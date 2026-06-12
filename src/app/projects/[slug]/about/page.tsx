import { getProjectBySlug, getAllProjects, slugify } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import AboutContent from "./AboutContent";

export default async function AboutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project = getProjectBySlug(slug);
  if (!project) project = getAllProjects().find((p) => slugify(p.title) === slug);
  if (!project) notFound();

  return <AboutContent project={project} />;
}
