import { getProjectBySlug, getAllProjects, slugify } from "@/lib/projects-data";
import ProjectShell from "@/components/projects/ProjectShell";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let project = getProjectBySlug(slug);
  if (!project) {
    project = getAllProjects().find((p) => slugify(p.title) === slug);
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Project Tidak Ditemukan</h1>
          <a href="/" className="text-[#22c55e] hover:underline">Kembali ke Beranda</a>
        </div>
      </div>
    );
  }

  return <ProjectShell project={project}>{children}</ProjectShell>;
}
