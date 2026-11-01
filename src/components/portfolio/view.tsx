import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";
import type { Portfolio, PortfolioProject } from "@/lib/types";
import { cn } from "@/lib/utils";

const TONE_COLORS = ["#1D5C45", "#A9502A", "#1E3A5F", "#5A2A4A", "#3F5D45", "#4A4A45"];

function toneStyle(project: PortfolioProject) {
  const color = TONE_COLORS[project.tone % TONE_COLORS.length];
  return {
    background: `linear-gradient(135deg, ${color}1f, ${color}0a)`,
    borderColor: `${color}33`,
    color,
  };
}

export function PortfolioView({
  portfolio,
  preview = false,
}: {
  portfolio: Portfolio;
  preview?: boolean;
}) {
  const accent = portfolio.accent || "#1D5C45";
  const projects = portfolio.projects.filter((project) => project.title);
  const theme = portfolio.theme;

  return (
    <div
      className={cn("min-h-screen bg-paper text-ink", theme === "minimal" && "bg-[hsl(var(--surface))]")}
      style={{ "--pf": accent } as CSSProperties}
    >
      <header
        className={cn(
          "sticky top-0 z-20 border-b border-line bg-paper/85 backdrop-blur-md",
          theme === "minimal" && "bg-[hsl(var(--surface))]/90",
        )}
      >
        <div className="mx-auto flex max-w-[1080px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <span className="truncate text-[12.5px] font-medium tracking-[-0.01em]">
            {portfolio.displayName || "Your name"}
          </span>
          <nav className="hidden items-center gap-7 sm:flex">
            {[
              { href: "#work", label: "Work" },
              { href: "#about", label: "About" },
              { href: "#contact", label: "Contact" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-[10.5px] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>
          {portfolio.showEmail && portfolio.email ? (
            <a
              href={`mailto:${portfolio.email}`}
              className="pf-border-hover inline-flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[10.5px] font-medium text-ink transition-colors"
              style={{ borderColor: `${accent}44` }}
            >
              Say hello <ArrowUpRight className="h-3 w-3" />
            </a>
          ) : null}
        </div>
      </header>

      <main className="mx-auto max-w-[1080px] px-5 sm:px-8">
        <section className={cn("pt-14 sm:pt-24", theme === "minimal" ? "pb-12" : "pb-16")}>
          <div className="flex items-center gap-2">
            <span className="h-[5px] w-[5px] rounded-full" style={{ background: accent }} />
            <p className="eyebrow text-[9px]">
              {portfolio.location || "Portfolio"}
              {projects.length ? ` / ${projects.length} selected projects` : ""}
            </p>
          </div>
          <h1
            className="display mt-6"
            style={{ fontSize: "clamp(46px, 9vw, 96px)", lineHeight: 0.92, letterSpacing: "-0.035em" }}
          >
            {portfolio.displayName || "Your name"}
          </h1>
          {portfolio.headline ? (
            <p
              className={cn("display mt-5 max-w-[720px] italic", theme === "minimal" && "not-italic")}
              style={{ fontSize: "clamp(20px, 3vw, 34px)", lineHeight: 1.15, color: accent }}
            >
              {portfolio.headline}
            </p>
          ) : null}

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            {portfolio.location ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted">
                <MapPin className="h-3.5 w-3.5" /> {portfolio.location}
              </span>
            ) : null}
            {portfolio.showEmail && portfolio.email ? (
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted">
                <Mail className="h-3.5 w-3.5" /> {portfolio.email}
              </span>
            ) : null}
            <a
              href="#work"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium"
              style={{ color: accent }}
            >
              View the work <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </section>

        <section id="work" className="border-t border-line py-12 sm:py-16">
          <div className="flex items-end justify-between gap-4">
            <h2 className="display text-[30px] leading-none sm:text-[38px]">Selected work</h2>
            <span className="num text-[10.5px] text-muted">
              {projects.length ? `${String(projects.length).padStart(2, "0")} projects` : ""}
            </span>
          </div>

          {projects.length === 0 ? (
            <p className="mt-6 text-[13px] leading-relaxed text-muted">
              Projects will appear here once they are added in the portfolio builder.
            </p>
          ) : theme === "minimal" ? (
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {projects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} accent={accent} flat />
              ))}
            </div>
          ) : theme === "index" ? (
            <div className="mt-6 divide-y divide-[hsl(var(--line))] border-t border-line">
              {projects.map((project, index) => (
                <a
                  key={project.id}
                  href={project.link || "#work"}
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noreferrer" : undefined}
                  className="group grid grid-cols-[36px_minmax(0,1fr)_auto] items-baseline gap-4 py-5 transition-colors hover:bg-card/60 sm:grid-cols-[48px_minmax(0,1fr)_120px_auto]"
                >
                  <span className="num font-mono text-[10px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="pf-hover block text-[15px] font-medium text-ink transition-colors">
                      {project.title}
                    </span>
                    <span className="mt-0.5 block max-w-[60ch] text-[11.5px] leading-snug text-muted">
                      {project.summary}
                    </span>
                  </span>
                  <span className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
                    {project.subtitle || project.tags[0] || ""}
                  </span>
                  <span className="flex items-center gap-2 text-[10.5px] text-muted">
                    {project.year}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <div className="mt-8 divide-y divide-[hsl(var(--line))] border-y border-line">
              {projects.map((project, index) => (
                <a
                  key={project.id}
                  href={project.link || "#work"}
                  target={project.link ? "_blank" : undefined}
                  rel={project.link ? "noreferrer" : undefined}
                  className="group grid gap-5 py-7 sm:grid-cols-[34px_168px_minmax(0,1fr)_auto] sm:items-start"
                >
                  <span className="num font-mono text-[10px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div
                    className="relative h-[112px] w-full overflow-hidden rounded-[3px] border"
                    style={toneStyle(project)}
                  >
                    <span
                      className="display absolute bottom-1.5 right-2.5 text-[34px] leading-none opacity-30"
                      style={{ color: "currentColor" }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex h-full flex-col justify-between p-3">
                      <span className="text-[8.5px] uppercase tracking-[0.16em] opacity-70">
                        {project.year}
                      </span>
                      <span className="h-[2px] w-8 opacity-40" style={{ background: "currentColor" }} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h3 className="display text-[24px] leading-tight sm:text-[27px]">{project.title}</h3>
                      {project.subtitle ? (
                        <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                          {project.subtitle}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 max-w-[58ch] text-[12.5px] leading-relaxed text-ink/80">
                      {project.summary}
                    </p>
                    {project.body ? (
                      <p className="mt-1.5 max-w-[58ch] text-[11.5px] leading-relaxed text-muted">
                        {project.body}
                      </p>
                    ) : null}
                    {project.tags.length ? (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.08em] text-muted"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <ArrowUpRight className="hidden h-4 w-4 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block" />
                </a>
              ))}
            </div>
          )}
        </section>

        <section id="about" className="grid gap-8 border-t border-line py-12 sm:grid-cols-[180px_minmax(0,1fr)] sm:py-16">
          <h2 className="display text-[30px] leading-none sm:text-[32px]">About</h2>
          <div>
            <p className="max-w-[62ch] whitespace-pre-line text-[13.5px] leading-[1.75] text-ink/85">
              {portfolio.about || "A short introduction belongs here. It is written in the portfolio builder."}
            </p>

            <div id="contact" className="mt-8 grid gap-2 border-t border-line pt-5 sm:max-w-[420px]">
              {portfolio.email && portfolio.showEmail ? (
                <a
                  href={`mailto:${portfolio.email}`}
                  className="pf-hover flex items-center justify-between gap-3 text-[12px] text-ink transition-colors"
                >
                  <span className="text-muted">Email</span> {portfolio.email}
                </a>
              ) : null}
              {portfolio.website ? (
                <a
                  href={`https://${portfolio.website.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-hover flex items-center justify-between gap-3 text-[12px] text-ink transition-colors"
                >
                  <span className="text-muted">Website</span> {portfolio.website}
                </a>
              ) : null}
              {portfolio.linkedin ? (
                <a
                  href={`https://${portfolio.linkedin.replace(/^https?:\/\//, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="pf-hover flex items-center justify-between gap-3 text-[12px] text-ink transition-colors"
                >
                  <span className="text-muted">LinkedIn</span> {portfolio.linkedin}
                </a>
              ) : null}
              {portfolio.location ? (
                <p className="flex items-center justify-between gap-3 text-[12px] text-ink">
                  <span className="text-muted">Based in</span> {portfolio.location}
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-center justify-between gap-3 px-5 py-6 sm:px-8">
          <p className="text-[10.5px] text-muted">
            {portfolio.displayName || "Portfolio"} · {new Date().getFullYear()}
          </p>
          <div className="flex items-center gap-4">
            {preview ? (
              <span className="rounded-full border border-line px-2 py-0.5 text-[9px] uppercase tracking-[0.1em] text-muted">
                Preview
              </span>
            ) : null}
            <Link href="/" className="text-[10.5px] text-muted transition-colors hover:text-ink">
              Built with Folivio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  accent,
  flat,
}: {
  project: PortfolioProject;
  index: number;
  accent: string;
  flat?: boolean;
}) {
  return (
    <a
      href={project.link || "#work"}
      target={project.link ? "_blank" : undefined}
      rel={project.link ? "noreferrer" : undefined}
      className="pf-border-hover group block border border-line bg-card p-5 transition-colors"
    >
      <div className="flex items-center justify-between">
        <span className="num font-mono text-[10px] text-muted">{String(index + 1).padStart(2, "0")}</span>
        <span className="text-[10px] text-muted">{project.year}</span>
      </div>
      <div
        className={cn("mt-4 flex items-end justify-between rounded-[3px] border p-3", flat && "h-[92px]")}
        style={toneStyle(project)}
      >
        <span className="text-[8.5px] uppercase tracking-[0.16em] opacity-70">
          {project.tags[0] || "Case study"}
        </span>
        <span className="h-[2px] w-10 opacity-40" style={{ background: "currentColor" }} />
      </div>
      <h3 className="mt-4 text-[16px] font-medium tracking-[-0.01em]">{project.title}</h3>
      <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-muted">
        {project.subtitle || project.tags.slice(0, 2).join(", ")}
      </p>
      <p className="mt-2 text-[12px] leading-relaxed text-muted">{project.summary}</p>
      <span className="mt-3 inline-flex items-center gap-1 text-[10.5px] font-medium" style={{ color: accent }}>
        Read the case <ArrowUpRight className="h-3 w-3" />
      </span>
    </a>
  );
}
