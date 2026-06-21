import fs from "fs";
import path from "path";

// Simple Markdown to HTML converter for the docs
function mdToHtml(md: string): string {
  let html = md;

  // Escape HTML special chars in code blocks first (protect them)
  const codeBlocks: string[] = [];
  html = html.replace(/```([\s\S]*?)```/g, (match) => {
    const inner = match.slice(3, -3);
    const langMatch = inner.match(/^(\w+)\n/);
    const lang = langMatch ? langMatch[1] : "";
    const code = (langMatch ? inner.slice(langMatch[0].length) : inner)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code class="language-${lang}">${code}</code></pre>`);
    return `%%CODEBLOCK_${idx}%%`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Images
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy" />');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Bold + Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>");

  // Tables
  html = html.replace(/^\|(.+)\|$/gm, (row) => {
    const cells = row.slice(1, -1).split("|").map((c) => c.trim());
    const isHeader = /^[-:\s]+$/.test(cells.join(""));
    if (isHeader) return "";
    const tag = "td";
    return `<tr>${cells.map((c) => `<${tag}>${c}</${tag}>`).join("")}</tr>`;
  });
  // Wrap consecutive rows in table
  html = html.replace(/((?:<tr>.*?<\/tr>\n?)+)/g, '<table>$1</table>');

  // Separators
  html = html.replace(/^---$/gm, '<hr class="my-8 border-white/10" />');

  // Helper for heading id
  const headingId = (text: string) => text.toLowerCase().replace(/<[^>]+>/g, '').replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');

  // Headings (h1-h6) with id attributes for TOC navigation
  html = html.replace(/^###### (.+)$/gm, (_, t) => `<h6 id="${headingId(t)}" class="text-base font-semibold text-white mt-6 mb-2">${t}</h6>`);
  html = html.replace(/^##### (.+)$/gm, (_, t) => `<h5 id="${headingId(t)}" class="text-lg font-semibold text-white mt-6 mb-2">${t}</h5>`);
  html = html.replace(/^#### (.+)$/gm, (_, t) => `<h4 id="${headingId(t)}" class="text-xl font-semibold text-white mt-6 mb-2">${t}</h4>`);
  html = html.replace(/^### (.+)$/gm, (_, t) => `<h3 id="${headingId(t)}" class="text-2xl font-bold text-white mt-8 mb-3">${t}</h3>`);
  html = html.replace(/^## (.+)$/gm, (_, t) => `<h2 id="${headingId(t)}" class="text-3xl font-bold text-white mt-10 mb-4 border-b border-white/10 pb-3">${t}</h2>`);
  html = html.replace(/^# (.+)$/gm, (_, t) => `<h1 id="${headingId(t)}" class="text-4xl sm:text-5xl font-extrabold text-white mb-6">${t}</h1>`);

  // Lists (unordered)
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, (match) => {
    if (!match.includes("<ul>")) return `<ul class="list-disc pl-6 space-y-1 my-3 text-gray-300">${match}</ul>`;
    return match;
  });

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*?<\/li>\n?)+)/g, (match) => {
    if (!match.includes("<ol>") && !match.includes("<ul>")) return `<ol class="list-decimal pl-6 space-y-1 my-3 text-gray-300">${match}</ol>`;
    return match;
  });

  // Paragraphs - wrap non-tag lines (skip lines already inside HTML elements)
  html = html.replace(/^(?!<(?:[a-z]|\/|%%CODEBLOCK)|\s*$|\||\})(.+)$/gm, (match) => {
    const trimmed = match.trim();
    if (!trimmed) return match;
    return `<p class="text-gray-300 leading-relaxed mb-4">${trimmed}</p>`;
  });

  // Restore code blocks
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_, idx) => codeBlocks[parseInt(idx)]);

  return html;
}

export default function DocsPage() {
  // Read the markdown file at request time
  const filePath = path.join(process.cwd(), "docs/builder-elements.md");
  let markdown = "";

  try {
    markdown = fs.readFileSync(filePath, "utf-8");
  } catch {
    return (
      <main className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Dokumentasi Tidak Tersedia</h1>
          <p className="text-gray-500">File dokumentasi tidak ditemukan.</p>
        </div>
      </main>
    );
  }

  const sections = markdown.split(/\n(?=## )/);
  const title = sections[0]?.match(/^# (.+)$/m)?.[1] || "Dokumentasi Element Builder";

  // Extract table of contents from headings
  const tocItems: { level: number; title: string; anchor: string }[] = [];
  markdown.split("\n").forEach((line) => {
    const match = line.match(/^(#{2,4}) (.+)$/);
    if (match && !match[2].startsWith("Daftar Isi")) {
      tocItems.push({
        level: match[1].length,
        title: match[2].replace(/\*\*(.+?)\*\*/g, "$1"),
        anchor: match[2].toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
      });
    }
  });

  return (
    <main className="min-h-screen bg-[#0f172a]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-xl font-bold text-white">
              PAGODA<span className="text-[#22c55e]"> STUDIO</span>
            </a>
            <span className="text-sm text-gray-500 hidden sm:block">/ Dokumentasi</span>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/builder/pages"
              className="px-4 py-2 bg-[#22c55e]/20 text-[#22c55e] text-sm font-medium rounded-xl hover:bg-[#22c55e]/30 transition-all border border-[#22c55e]/30"
            >
              Buka Builder
            </a>
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Beranda
            </a>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar - Table of Contents */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-1">
            <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wider">
              Daftar Isi
            </h3>
            {tocItems.map((item, i) => (
              <a
                key={i}
                href={`#${item.anchor}`}
                className={`block text-sm transition-colors hover:text-[#22c55e] ${
                  item.level === 2
                    ? "text-gray-300 font-medium"
                    : item.level === 3
                    ? "text-gray-500 pl-4 text-xs"
                    : "text-gray-600 pl-8 text-xs"
                }`}
              >
                {item.title}
              </a>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 max-w-4xl prose-custom">
          <div
            className="text-gray-200 leading-relaxed [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_h4]:!text-white [&_h5]:!text-white [&_h6]:!text-white [&_a]:!text-[#22c55e] [&_a]:no-underline hover:[&_a]:underline [&_code]:text-[#22c55e] [&_code]:bg-white/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-sm [&_pre]:bg-white/5 [&_pre]:border [&_pre]:border-white/10 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre_code]:bg-transparent [&_pre_code]:text-gray-300 [&_pre_code]:p-0 [&_blockquote]:border-l-4 [&_blockquote]:border-[#22c55e] [&_blockquote]:pl-4 [&_blockquote]:text-gray-400 [&_blockquote]:italic [&_blockquote]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_th]:text-left [&_th]:p-3 [&_th]:bg-white/5 [&_th]:text-white [&_th]:font-semibold [&_th]:text-sm [&_th]:border [&_th]:border-white/10 [&_td]:p-3 [&_td]:text-sm [&_td]:text-gray-300 [&_td]:border [&_td]:border-white/10 [&_tr]:border-white/10 [&_ul]:text-gray-300 [&_ol]:text-gray-300 [&_li]:mb-1 [&_hr]:border-white/10 [&_img]:rounded-xl [&_img]:border [&_img]:border-white/10 [&_img]:my-4 [&_img]:max-w-full"
            dangerouslySetInnerHTML={{
              __html: `<div>${mdToHtml(markdown)}</div>`,
            }}
          />
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 text-center mt-12">
        <p className="text-xs text-gray-600">
          &copy; {new Date().getFullYear()} PAGODA STUDIO — Dokumentasi Element Builder
        </p>
      </footer>
    </main>
  );
}
