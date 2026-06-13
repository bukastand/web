export type ElementType =
  | "heading" | "text" | "image" | "button" | "video" | "spacer" | "divider" | "icon"
  | "features" | "pricing" | "testimonial" | "cta" | "stats" | "contactForm" | "maps"
  | "navbar" | "footer" | "three-background";

export interface ElementStyles {
  // Shorthand (backward compatible)
  padding?: string;
  margin?: string;
  borderRadius?: string;
  // Individual padding
  paddingTop?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  paddingRight?: string;
  // Individual margin
  marginTop?: string;
  marginBottom?: string;
  marginLeft?: string;
  marginRight?: string;
  // Individual border radius
  borderTopLeftRadius?: string;
  borderTopRightRadius?: string;
  borderBottomLeftRadius?: string;
  borderBottomRightRadius?: string;
  // Other
  textAlign?: "left" | "center" | "right";
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  fontFamily?: string;
  width?: string;
  height?: string;
  maxWidth?: string;
  opacity?: string;
  objectFit?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
}

export interface ElementContent {
  [key: string]: any;
}

export interface BuilderElement {
  id: string;
  type: ElementType;
  content: ElementContent;
  styles: ElementStyles;
}

export interface BuilderColumn {
  id: string;
  width: number; // 1-12 (Tailwind grid)
  elements: BuilderElement[];
}

export interface SectionStyles {
  padding?: string;
  paddingTop?: string;
  paddingBottom?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  textColor?: string;
  containerWidth?: "full" | "boxed";
}

export interface BuilderSection {
  id: string;
  columns: BuilderColumn[];
  styles: SectionStyles;
}

export interface GlobalStyles {
  fontFamily: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  containerWidth: number; // px
}

export interface BuilderPage {
  id: string;
  title: string;
  slug: string;
  sections: BuilderSection[];
  globalStyles: GlobalStyles;
  createdAt: string;
  updatedAt: string;
  published: boolean;
  /** Deep copy of page data at last publish time — the live published version */
  publishedSnapshot: BuilderPage | null;
}

export type BuilderAction =
  | { type: "SET_CURRENT_PAGE"; pageId: string }
  | { type: "LOAD_PAGES"; pages: BuilderPage[] }
  | { type: "ADD_PAGE"; page: BuilderPage }
  | { type: "DELETE_PAGE"; pageId: string }
  | { type: "UPDATE_PAGE_TITLE"; pageId: string; title: string }
  | { type: "UPDATE_PAGE_SLUG"; pageId: string; slug: string }
  | { type: "ADD_SECTION"; pageId: string; index?: number }
  | { type: "REMOVE_SECTION"; pageId: string; sectionId: string }
  | { type: "DUPLICATE_SECTION"; pageId: string; sectionId: string }
  | { type: "MOVE_SECTION"; pageId: string; sectionId: string; toIndex: number }
  | { type: "UPDATE_SECTION_STYLES"; pageId: string; sectionId: string; styles: Partial<SectionStyles> }
  | { type: "ADD_ELEMENT"; pageId: string; sectionId: string; columnIndex: number; element: BuilderElement; dropIndex?: number }
  | { type: "REMOVE_ELEMENT"; pageId: string; sectionId: string; columnIndex: number; elementId: string }
  | { type: "DUPLICATE_ELEMENT"; pageId: string; sectionId: string; columnIndex: number; elementId: string }
  | { type: "MOVE_ELEMENT"; pageId: string; from: { sectionId: string; columnIndex: number; elementId: string }; to: { sectionId: string; columnIndex: number; index: number } }
  | { type: "UPDATE_ELEMENT"; pageId: string; sectionId: string; columnIndex: number; elementId: string; content: Partial<ElementContent>; styles?: Partial<ElementStyles> }
  | { type: "UPDATE_GLOBAL_STYLES"; pageId: string; styles: Partial<GlobalStyles> }
  | { type: "SELECT_ELEMENT"; elementId: string | null }
  | { type: "PUBLISH_PAGE"; pageId: string }
  | { type: "UNPUBLISH_PAGE"; pageId: string }
  | { type: "REORDER_COLUMNS"; pageId: string; sectionId: string; columns: BuilderColumn[] }
  | { type: "UPDATE_COLUMN_WIDTH"; pageId: string; sectionId: string; columnIndex: number; width: number }
  | { type: "ADD_COLUMN"; pageId: string; sectionId: string; index?: number }
  | { type: "REMOVE_COLUMN"; pageId: string; sectionId: string; columnIndex: number };

export interface BuilderState {
  pages: BuilderPage[];
  currentPageId: string | null;
  selectedElementId: string | null;
}
