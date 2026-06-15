"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, useState, type ReactNode } from "react";
import type { BuilderState, BuilderAction, BuilderPage } from "./types";
import { createDefaultPage, createDefaultSection, genId } from "./defaults";
import { useAuth } from "@/components/auth/AuthProvider";
import * as supabasePages from "@/lib/supabase/pages";
import * as supabasePublished from "@/lib/supabase/published";

const MAX_HISTORY = 50;

function storageKey(userId: string | null) {
  if (userId) return `builder_pages_${userId}`;
  return "builder_pages_anonymous";
}

function snapshotsKey(userId: string | null) {
  if (userId) return `builder_published_snapshots_${userId}`;
  return "builder_published_snapshots";
}

function loadLocalPages(userId: string | null): BuilderPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(storageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPages(userId: string | null, pages: BuilderPage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(pages));
  } catch {}
}

function loadPublishedSnapshots(userId: string | null): Record<string, BuilderPage> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(snapshotsKey(userId));
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function savePublishedSnapshots(userId: string | null, snapshots: Record<string, BuilderPage>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(snapshotsKey(userId), JSON.stringify(snapshots));
  } catch {}
}

/** Delete localStorage data for a specific user (used on logout / user switch) */
function clearUserLocalStorage(userId: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(userId));
    localStorage.removeItem(snapshotsKey(userId));
  } catch {}
}

const initialState: BuilderState = {
  pages: [],
  currentPageId: null,
  selectedElementId: null,
  selectedSectionId: null,
};

function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  const updatePage = (fn: (page: BuilderPage) => BuilderPage) => {
    if (!state.currentPageId) return state;
    return {
      ...state,
      pages: state.pages.map((p) => (p.id === state.currentPageId ? { ...fn(p), updatedAt: new Date().toISOString() } : p)),
    };
  };

  switch (action.type) {
    case "LOAD_PAGES":
      return { ...state, pages: action.pages };

    case "SET_CURRENT_PAGE":
      return { ...state, currentPageId: action.pageId, selectedElementId: null };

    case "ADD_PAGE":
      return { ...state, pages: [...state.pages, action.page], currentPageId: action.page.id };

    case "DELETE_PAGE":
      return {
        ...state,
        pages: state.pages.filter((p) => p.id !== action.pageId),
        currentPageId: state.currentPageId === action.pageId ? null : state.currentPageId,
      };

    case "UPDATE_PAGE_TITLE":
      return updatePage((p) => ({ ...p, title: action.title }));

    case "UPDATE_PAGE_SLUG":
      return updatePage((p) => ({ ...p, slug: action.slug }));

    case "ADD_SECTION": {
      const section = createDefaultSection();
      return updatePage((p) => {
        const sections = [...p.sections];
        const idx = action.index ?? sections.length;
        sections.splice(idx, 0, section);
        return { ...p, sections };
      });
    }

    case "ADD_TEMPLATE_SECTION":
      return updatePage((p) => {
        const sections = [...p.sections];
        const idx = action.index ?? sections.length;
        sections.splice(idx, 0, action.section);
        return { ...p, sections };
      });

    case "REMOVE_SECTION":
      return updatePage((p) => ({ ...p, sections: p.sections.filter((s) => s.id !== action.sectionId) }));

    case "DUPLICATE_SECTION": {
      return updatePage((p) => {
        const idx = p.sections.findIndex((s) => s.id === action.sectionId);
        if (idx === -1) return p;
        const clone = JSON.parse(JSON.stringify(p.sections[idx]));
        clone.id = genId("sec");
        clone.columns.forEach((col: any) => {
          col.id = genId("col");
          col.elements.forEach((el: any) => (el.id = genId("el")));
        });
        const sections = [...p.sections];
        sections.splice(idx + 1, 0, clone);
        return { ...p, sections };
      });
    }

    case "MOVE_SECTION":
      return updatePage((p) => {
        const sections = [...p.sections];
        const idx = sections.findIndex((s) => s.id === action.sectionId);
        if (idx === -1) return p;
        const [moved] = sections.splice(idx, 1);
        sections.splice(action.toIndex, 0, moved);
        return { ...p, sections };
      });

    case "UPDATE_SECTION_STYLES":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => (s.id === action.sectionId ? { ...s, styles: { ...s.styles, ...action.styles } } : s)),
      }));

    case "ADD_ELEMENT":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId) return s;
          const cols = [...s.columns];
          const col = { ...cols[action.columnIndex] };
          const elements = [...col.elements];
          const idx = action.dropIndex ?? elements.length;
          elements.splice(idx, 0, action.element);
          col.elements = elements;
          cols[action.columnIndex] = col;
          return { ...s, columns: cols };
        }),
      }));

    case "REMOVE_ELEMENT":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId) return s;
          const cols = s.columns.map((col, i) => {
            if (i !== action.columnIndex) return col;
            return { ...col, elements: col.elements.filter((e) => e.id !== action.elementId) };
          });
          return { ...s, columns: cols };
        }),
      }));

    case "DUPLICATE_ELEMENT": {
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId) return s;
          return {
            ...s,
            columns: s.columns.map((col, i) => {
              if (i !== action.columnIndex) return col;
              const idx = col.elements.findIndex((e) => e.id === action.elementId);
              if (idx === -1) return col;
              const clone = JSON.parse(JSON.stringify(col.elements[idx]));
              clone.id = genId("el");
              const els = [...col.elements];
              els.splice(idx + 1, 0, clone);
              return { ...col, elements: els };
            }),
          };
        }),
      }));
    }

    case "MOVE_ELEMENT":
      return updatePage((p) => {
        let movedEl: any = null;
        let newPages = {
          ...p,
          sections: p.sections.map((s) => {
            if (s.id === action.from.sectionId) {
              return {
                ...s,
                columns: s.columns.map((col, i) => {
                  if (i !== action.from.columnIndex) return col;
                  const idx = col.elements.findIndex((e) => e.id === action.from.elementId);
                  if (idx === -1) return col;
                  movedEl = col.elements[idx];
                  const els = [...col.elements];
                  els.splice(idx, 1);
                  return { ...col, elements: els };
                }),
              };
            }
            return s;
          }),
        };
        if (!movedEl) return p;
        return {
          ...newPages,
          sections: newPages.sections.map((s) => {
            if (s.id !== action.to.sectionId) return s;
            return {
              ...s,
              columns: s.columns.map((col, i) => {
                if (i !== action.to.columnIndex) return col;
                const els = [...col.elements];
                els.splice(action.to.index, 0, movedEl);
                return { ...col, elements: els };
              }),
            };
          }),
        };
      });

    case "UPDATE_ELEMENT":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId) return s;
          return {
            ...s,
            columns: s.columns.map((col, i) => {
              if (i !== action.columnIndex) return col;
              return {
                ...col,
                elements: col.elements.map((e) =>
                  e.id === action.elementId
                    ? { ...e, content: { ...e.content, ...action.content }, styles: { ...e.styles, ...(action.styles || {}) } }
                    : e
                ),
              };
            }),
          };
        }),
      }));

    case "UPDATE_GLOBAL_STYLES":
      return updatePage((p) => ({ ...p, globalStyles: { ...p.globalStyles, ...action.styles } }));

    case "SELECT_ELEMENT":
      return { ...state, selectedElementId: action.elementId, selectedSectionId: null };

    case "SELECT_SECTION":
      return { ...state, selectedSectionId: action.sectionId, selectedElementId: null };

    case "PUBLISH_PAGE":
      return updatePage((p) => ({
        ...p,
        published: true,
        publishedSnapshot: JSON.parse(JSON.stringify(p)),
      }));

    case "UNPUBLISH_PAGE":
      return updatePage((p) => ({ ...p, published: false, publishedSnapshot: null }));

    case "ADD_COLUMN":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId) return s;
          const cols = [...s.columns];
          const totalWidth = cols.reduce((sum, c) => sum + c.width, 0);
          const newWidth = Math.round(totalWidth / (cols.length + 1));
          const remaining = totalWidth - newWidth;
          const newCol = {
            id: genId(),
            width: newWidth,
            elements: [],
          };
          cols.forEach((c) => (c.width = Math.round(remaining / cols.length)));
          const idx = action.index ?? cols.length;
          cols.splice(idx, 0, newCol);
          return { ...s, columns: cols };
        }),
      }));

    case "REMOVE_COLUMN":
      return updatePage((p) => ({
        ...p,
        sections: p.sections.map((s) => {
          if (s.id !== action.sectionId || s.columns.length <= 1) return s;
          const cols = s.columns.filter((_, i) => i !== action.columnIndex);
          const totalWidth = cols.reduce((sum, c) => sum + c.width, 0);
          cols.forEach((c) => (c.width = Math.round((c.width / totalWidth) * 12)));
          return { ...s, columns: cols };
        }),
      }));

    default:
      return state;
  }
}

interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  currentPage: BuilderPage | undefined;
  createNewPage: (title?: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(builderReducer, initialState);
  const loadedUserIdRef = useRef<string | null>(null);
  const lastSavedJson = useRef("");
  const lastSavedPageIdsRef = useRef<string[]>([]);

  // ── Undo/Redo ──
  const historyRef = useRef<{ past: BuilderPage[][]; future: BuilderPage[][] }>({ past: [], future: [] });
  const pagesRef = useRef(state.pages);
  pagesRef.current = state.pages;

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Load pages: from Supabase if logged in, otherwise from localStorage
  useEffect(() => {
    if (user) {
      // User changed — clear old user's localStorage cache to avoid data leak
      if (loadedUserIdRef.current && loadedUserIdRef.current !== user.id) {
        clearUserLocalStorage(loadedUserIdRef.current);
      }

      if (loadedUserIdRef.current === user.id) return;
      loadedUserIdRef.current = user.id;

      supabasePages.fetchPages(user.id).then((pages) => {
        if (pages.length > 0) {
          // Data dari Supabase — langsung pakai
          dispatch({ type: "LOAD_PAGES", pages });
          saveLocalPages(user.id, pages);
          lastSavedJson.current = JSON.stringify(pages);
        } else {
          // Tidak ada data di Supabase — cek localStorage user-specific
          let local = loadLocalPages(user.id);
          
          if (local.length === 0) {
            // Tidak ada data user-specific — cek anonymous localStorage
            // Ini terjadi saat user membuat halaman tanpa login, lalu login
            try {
              const anonRaw = localStorage.getItem("builder_pages_anonymous");
              if (anonRaw) {
                const anonPages = JSON.parse(anonRaw);
                if (Array.isArray(anonPages) && anonPages.length > 0) {
                  local = anonPages;
                  // Migrasi ke user-specific localStorage
                  saveLocalPages(user.id, local);
                  // Hapus anonymous agar tidak terpakai lagi
                  localStorage.removeItem("builder_pages_anonymous");
                  // Sync ke Supabase
                  supabasePages.savePages(user.id, local);
                  console.log(`Migrated ${local.length} page(s) from anonymous to user ${user.id}`);
                }
              }
            } catch {}
          }

          if (local.length > 0) {
            dispatch({ type: "LOAD_PAGES", pages: local });
          } else {
            dispatch({ type: "LOAD_PAGES", pages: [] });
          }
          lastSavedJson.current = JSON.stringify(local);
        }
      });
    } else {
      loadedUserIdRef.current = null;
      const local = loadLocalPages(null);
      dispatch({ type: "LOAD_PAGES", pages: local });
      lastSavedJson.current = JSON.stringify(local);
    }
  }, [user?.id]);

  // Save pages to localStorage on every change, and sync to Supabase
  useEffect(() => {
    // Always save to localStorage as instant backup (user-specific key)
    const uid = user?.id || null;
    saveLocalPages(uid, state.pages);

    // Sync to Supabase if user is logged in
    if (user) {
      const currentPageIds = new Set(state.pages.map((p) => p.id));
      
      // Detect deleted pages by comparing with previous page IDs
      if (lastSavedPageIdsRef.current.length > 0) {
        const deletedIds = lastSavedPageIdsRef.current.filter((id) => !currentPageIds.has(id));
        for (const deletedId of deletedIds) {
          supabasePages.deletePage(user.id, deletedId);
        }
      }
      lastSavedPageIdsRef.current = state.pages.map((p) => p.id);

      // Upsert current pages if data changed
      const currentJson = JSON.stringify(state.pages);
      if (currentJson !== lastSavedJson.current) {
        lastSavedJson.current = currentJson;
        supabasePages.savePages(user.id, state.pages);
      }
    }
  }, [state.pages, user?.id]);

  // ── Update canUndo/canRedo after each state change ──
  useEffect(() => {
    setCanUndo(historyRef.current.past.length > 0);
    setCanRedo(historyRef.current.future.length > 0);
  }, [state.pages]);

  // currentPage must be defined here (before effects that reference it)
  const currentPage = state.pages.find((p) => p.id === state.currentPageId);

  // ── Published snapshots: sync to localStorage + Supabase ──
  const prevSnapshotJsonRef = useRef<string>("");

  useEffect(() => {
    if (!currentPage) return;

    const snapshotJson = JSON.stringify(currentPage.publishedSnapshot);
    if (prevSnapshotJsonRef.current === snapshotJson) return;
    prevSnapshotJsonRef.current = snapshotJson;

    const uid = user?.id || null;
    const snapshots = loadPublishedSnapshots(uid);

    if (currentPage.publishedSnapshot) {
      // Published: save snapshot (deep copy from publish time)
      const snapshotData = currentPage.publishedSnapshot;

      // Remove old slug entry if slug changed
      for (const [slug, pg] of Object.entries(snapshots)) {
        if (pg.id === currentPage.id && slug !== currentPage.slug) {
          delete snapshots[slug];
          if (user) supabasePublished.unpublishPage(user.id, slug);
        }
      }
      snapshots[currentPage.slug] = snapshotData;

      // Always save to localStorage
      savePublishedSnapshots(uid, snapshots);

      // Sync to Supabase if logged in
      if (user) {
        supabasePublished.publishPage(user.id, currentPage.slug, currentPage.title, snapshotData)
          .then((ok) => {
            if (ok) {
              console.log("Published to live website:", currentPage.slug);
            } else {
              console.warn("Publish to Supabase failed. Check Supabase dashboard.");
            }
          });
      } else {
        console.log("Page saved locally. Login to publish to live website.");
      }
    } else {
      // Unpublished: remove from storage
      if (snapshots[currentPage.slug]) {
        delete snapshots[currentPage.slug];
        savePublishedSnapshots(uid, snapshots);
        if (user) supabasePublished.unpublishPage(user.id, currentPage.slug);
      }
    }
  }, [currentPage?.publishedSnapshot, currentPage?.id, currentPage?.slug, user?.id]);

  // ── Wrapped dispatch for undo/redo history ──
  const wrappedDispatch = useCallback((action: BuilderAction) => {
    // Save to history before dispatching (except LOAD_PAGES which is used by undo/redo itself)
    if (action.type !== "LOAD_PAGES") {
      const current = pagesRef.current;
      historyRef.current = {
        past: [...historyRef.current.past.slice(-MAX_HISTORY), current],
        future: [],
      };
    }
    dispatch(action);
  }, [dispatch]);

  // ── Undo ──
  const undo = useCallback(() => {
    const { past } = historyRef.current;
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    historyRef.current = {
      past: past.slice(0, -1),
      future: [pagesRef.current, ...historyRef.current.future],
    };
    dispatch({ type: "LOAD_PAGES", pages: previous });
  }, [dispatch]);

  // ── Redo ──
  const redo = useCallback(() => {
    const { future } = historyRef.current;
    if (future.length === 0) return;
    const next = future[0];
    historyRef.current = {
      past: [...historyRef.current.past, pagesRef.current],
      future: future.slice(1),
    };
    dispatch({ type: "LOAD_PAGES", pages: next });
  }, [dispatch]);

  const createNewPage = useCallback((title?: string) => {
    const page = createDefaultPage(title);
    wrappedDispatch({ type: "ADD_PAGE", page });
  }, [wrappedDispatch]);

  return (
    <BuilderContext.Provider value={{ state, dispatch: wrappedDispatch, currentPage, createNewPage, undo, redo, canUndo, canRedo }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
