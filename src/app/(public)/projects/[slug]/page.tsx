import { getProjectBySlug, getAllProjects, slugify } from "@/lib/projects-data";
import { notFound } from "next/navigation";
import HomeContent from "./HomeContent";

export default async function ProjectHomePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let project = getProjectBySlug(slug);
  if (!project) project = getAllProjects().find((p) => slugify(p.title) === slug);
  if (!project) notFound();

  const otherProjects = getAllProjects().filter((p) => p.slug !== project.slug).slice(0, 4);

  return <HomeContent project={project} otherProjects={otherProjects} />;
}
