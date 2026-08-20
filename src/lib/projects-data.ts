export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  icon: string;
}

export interface AboutContent {
  story: string;
  mission: string;
  vision: string;
  values: string[];
  teamMembers: TeamMember[];
}

export interface ServicesContent {
  items: ServiceItem[];
  process: { title: string; desc: string }[];
}

export interface ContactContent {
  address: string;
  phone: string;
  email: string;
  hours: string;
  mapLat: string;
  mapLng: string;
}

export interface ProjectData {
  slug: string;
  title: string;
  category: string;
  description: string;
  gradient: string;
  gradientFrom: string;
  gradientTo: string;
  longDescription: string;
  features: string[];
  techStack: string[];
  industry: string;
  aboutSection: AboutContent;
  servicesSection: ServicesContent;
  contactSection: ContactContent;
}

const defaultProjects: ProjectData[] = [];

export function getProjectBySlug(slug: string): ProjectData | undefined {
  const exact = defaultProjects.find((p) => p.slug === slug);
  if (exact) return exact;
  return defaultProjects.find((p) => slugify(p.title) === slug);
}

export function getAllProjects(): ProjectData[] {
  return defaultProjects;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}