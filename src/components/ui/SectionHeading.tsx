import type { ReactNode } from "react";

interface SectionHeadingProps {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  action?: ReactNode;
  className?: string;
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className = "",
}: SectionHeadingProps) {
  if (align === "center") {
    return (
      <div className={`text-center max-w-2xl mx-auto ${className}`}>
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-5">
            {index && <span className="text-accent">{index}</span>}
            {index && " · "}
            {eyebrow}
          </p>
        )}
        <h2 className="heading-lg">{title}</h2>
        {description && <p className="body-lg mt-5">{description}</p>}
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 ${className}`}
    >
      <div className="max-w-2xl">
        {eyebrow && (
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-faint mb-5">
            {index && <span className="text-accent">{index}</span>}
            {index && " · "}
            {eyebrow}
          </p>
        )}
        <h2 className="heading-lg">{title}</h2>
        {description && <p className="body-lg mt-5">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 pb-1">{action}</div>}
    </div>
  );
}
