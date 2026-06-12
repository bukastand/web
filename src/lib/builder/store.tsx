"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, useRef, type ReactNode } from "react";
import type { BuilderState, BuilderAction, BuilderPage } from "./types";
import { createDefaultPage, createDefaultSection, genId } from "./defaults";
import { useAuth } from "@/components/auth/AuthProvider";
import * as supabasePages from "@/lib/supabase/pages";


const STORAGE_KEY = "builder_pages";

function loadLocalPages(): BuilderPage[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalPages(pages: BuilderPage[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pages));
  } catch {}
}

const initialState: BuilderState = {
  pages: [],
  currentPageId: null,
  selectedElementId: null,
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
      return { ...state, selectedElementId: action.elementId };

    case "PUBLISH_PAGE":
      return updatePage((p) => ({ ...p, published: !p.published }));

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
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function BuilderProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(builderReducer, initialState);
  const loadedUserIdRef = useRef<string | null>(null);
  const lastSavedJson = useRef("");
  const lastSavedPageIdsRef = useRef<string[]>([]);

  // Load pages: from Supabase if logged in, otherwise from localStorage
  useEffect(() => {
    if (user) {
      // Already loaded for this user - skip
      if (loadedUserIdRef.current === user.id) return;
      loadedUserIdRef.current = user.id;

      supabasePages.fetchPages(user.id).then((pages) => {
        if (pages.length > 0) {
          dispatch({ type: "LOAD_PAGES", pages });
          saveLocalPages(pages);
          lastSavedJson.current = JSON.stringify(pages);
        } else {
          // No pages in Supabase yet, try localStorage
          const local = loadLocalPages();
          if (local.length > 0) {
            dispatch({ type: "LOAD_PAGES", pages: local });
          }
          lastSavedJson.current = JSON.stringify(local);
        }
      });
    } else {
      loadedUserIdRef.current = null;
      const local = loadLocalPages();
      dispatch({ type: "LOAD_PAGES", pages: local });
      lastSavedJson.current = JSON.stringify(local);
    }
  }, [user?.id]);

  // Save pages to localStorage on every change, and sync to Supabase
  useEffect(() => {
    // Always save to localStorage as instant backup
    saveLocalPages(state.pages);

    // Sync to Supabase if user is logged in
    if (user) {
      const currentPageIds = new Set(state.pages.map((p) => p.id));
      
      // Detect deleted pages by comparing with previous page IDs
      // (handles both partial deletes and deleting ALL pages)
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

  const currentPage = state.pages.find((p) => p.id === state.currentPageId);

  const createNewPage = useCallback((title?: string) => {
    const page = createDefaultPage(title);
    dispatch({ type: "ADD_PAGE", page });
  }, []);

  return (
    <BuilderContext.Provider value={{ state, dispatch, currentPage, createNewPage }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const ctx = useContext(BuilderContext);
  if (!ctx) throw new Error("useBuilder must be used within BuilderProvider");
  return ctx;
}
