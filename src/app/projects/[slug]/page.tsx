import { getProjectBySlug, getAllProjects, slugify } from "@/lib/projects-data";
import Link from "next/link";
import ProjectClient from "./ProjectClient";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const slug = params.slug;
  let project = getProjectBySlug(slug);

  // Fallback: try matching by slugified title
  if (!project) {
    project = getAllProjects().find((p) => slugify(p.title) === slug) || null;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Tidak Ditemukan</h1>
          <Link href="/" className="text-[#22c55e] hover:underline">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const otherProjects = getAllProjects()
    .filter((p) => p.slug !== project.slug)
    .slice(0, 4);

  return <ProjectClient project={project} otherProjects={otherProjects} />;
}
