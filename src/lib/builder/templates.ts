import { createDefaultPage } from "./defaults";
import type { BuilderPage, BuilderSection } from "./types";

export interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  icon: string;
  previewColor: string;
  sections: BuilderSection[];
  globalStyles?: {
    fontFamily: string;
    primaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
}

// ─── Create a BuilderPage from a Template ───
export function createPageFromTemplate(template: Template): BuilderPage {
  const page = createDefaultPage(template.title);
  return {
    ...page,
    slug: template.slug || page.slug,
    sections: JSON.parse(JSON.stringify(template.sections)),
    globalStyles: {
      ...page.globalStyles,
      ...(template.globalStyles || {}),
    },
  };
}
