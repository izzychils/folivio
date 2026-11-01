"use client";

import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Copy,
  FileText,
  Globe,
  Plus,
  Sparkles,
  Target,
  User,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, Card, EmptyState, Meter, ScoreRing, SectionHead, Stat } from "@/components/ui/surface";
import { CvThumbnail } from "@/components/cv/preview";
import { atsReport, careerPaths } from "@/lib/intelligence";
import { cvCompleteness, newCv } from "@/lib/cv";
import { TEMPLATE_BY_ID } from "@/lib/templates";
import { copyText, firstName, relativeTime } from "@/lib/utils";
import { profileStrength } from "@/components/shell/app-shell";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardPage() {
  const { user } = useSession();
  const { workspace, clearSampleContent } = useWorkspace();
  const { toast } = useToast();

  if (!workspace || !user) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="h-8 w-52 animate-pulse rounded-lg bg-line-soft" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="h-[108px] animate-pulse rounded-[var(--radius)] bg-line-soft" />
          ))}
        </div>
      </div>
    );
  }

  const { profile, cvs, portfolio, activity } = workspace;
  const reports = cvs.map((cv) => ({ cv, report: atsReport(cv) }));
  const averageAts = reports.length
    ? Math.round(reports.reduce((total, item) => total + item.report.score, 0) / reports.length)
    : 0;
  const strength = profileStrength(profile);
  const paths = careerPaths(cvs[0] ?? newCv(profile));
  const leading = reports.sort((a, b) => b.report.score - a.report.score)[0];
  const nextFix = leading?.report.checks.find((check) => check.status !== "pass");
  const completeness = leading ? cvCompleteness(leading.cv) : null;

  const copyPortfolio = async () => {
    const url = `${window.location.origin}/p/${portfolio.slug}`;
    const ok = await copyText(url);
    toast({
      title: ok ? "Portfolio link copied" : "Could not copy the link",
      description: ok ? url : "Select the address in the portfolio page instead.",
      tone: ok ? "success" : "error",
    });
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">
            {new Date().toLocaleDateString(undefined, {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">
            {greeting()}, {firstName(user.name)}.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            One career, several presentations. Everything here is built from the same profile, so a
            change of direction never means starting over.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dashboard/assistant" className={buttonClass("secondary", "md")}>
            <Sparkles className="h-3.5 w-3.5" />
            Career assistant
          </Link>
          <Link href="/dashboard/studio" className={buttonClass("primary", "md")}>
            <Plus className="h-3.5 w-3.5" />
            New CV
          </Link>
        </div>
      </header>

      {workspace.settings.sampleContent ? (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[hsl(var(--accent))]/20 bg-accent-soft/60 px-4 py-3">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-[10px] font-semibold text-accent">
              i
            </span>
            <p className="text-[12px] leading-relaxed text-accent-ink">
              <span className="font-medium">A sample career is loaded.</span> It is here so you can
              see how a finished workspace reads. Replace it with your own experience whenever you
              are ready.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              clearSampleContent();
              toast({
                title: "Sample content cleared",
                description: "Your workspace is empty and ready for your own history.",
                tone: "success",
              });
            }}
            className="text-[11.5px] font-medium text-accent-ink underline decoration-accent/30 underline-offset-4 transition-colors hover:decoration-accent"
          >
            Clear sample content
          </button>
        </div>
      ) : null}

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Stat
          label="Documents"
          value={cvs.length}
          note={cvs.length === 1 ? "One version in your studio" : `${cvs.length} versions in your studio`}
          icon={FileText}
        />
        <Stat
          label="CV readiness"
          value={averageAts}
          suffix="/100"
          note={averageAts >= 80 ? "Strong across your documents" : "A few checks need attention"}
          icon={Target}
        />
        <Stat
          label="Career profile"
          value={strength}
          suffix="%"
          note={completeness?.missing[0] ?? "All core sections are present"}
          icon={User}
        />
        <Stat
          label="Portfolio"
          value={portfolio.published ? "Live" : "Draft"}
          note={portfolio.published ? `/p/${portfolio.slug}` : "Not published yet"}
          icon={Globe}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.55fr_1fr]">
        <Card padded={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-soft px-5 py-4">
            <div>
              <h2 className="text-[14px] font-medium text-ink">Your documents</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">Versions you can tailor, never overwrite.</p>
            </div>
            <Link
              href="/dashboard/studio"
              className="inline-flex items-center gap-1 text-[11.5px] text-muted transition-colors hover:text-ink"
            >
              Open studio <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>

          {cvs.length === 0 ? (
            <div className="p-5">
              <EmptyState
                icon={FileText}
                title="No CVs yet"
                description="Start from your career profile and Folivio will structure a first draft. Nothing is invented."
                action={
                  <Link href="/dashboard/studio" className={buttonClass("primary", "md")}>
                    <Plus className="h-3.5 w-3.5" /> Create your first CV
                  </Link>
                }
                className="border-0 bg-transparent py-8"
              />
            </div>
          ) : (
            <ul className="divide-y divide-[hsl(var(--line-soft))]">
              {cvs.slice(0, 4).map((cv) => {
                const report = reports.find((item) => item.cv.id === cv.id)?.report;
                const score = report?.score ?? 0;
                return (
                  <li key={cv.id}>
                    <Link
                      href={`/studio/${cv.id}`}
                      className="group flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-surface/70"
                    >
                      <span className="overflow-hidden rounded-[4px] border border-line bg-white">
                        <CvThumbnail cv={cv} width={52} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center gap-2">
                          <span className="truncate text-[13px] font-medium text-ink">{cv.title}</span>
                          {cv.targetRole ? (
                            <Badge tone="outline" className="hidden sm:inline-flex">
                              {TEMPLATE_BY_ID[cv.design.template].name}
                            </Badge>
                          ) : null}
                        </span>
                        <span className="mt-0.5 block truncate text-[11.5px] text-muted">
                          {cv.targetRole || "No target role"}
                          {cv.targetCompany ? ` at ${cv.targetCompany}` : ""}
                        </span>
                        <span className="mt-1 flex items-center gap-2 text-[10.5px] text-muted/80">
                          Edited {relativeTime(cv.updatedAt)}
                          <span className="h-0.5 w-0.5 rounded-full bg-muted/60" />
                          {cv.versions.length} saved {cv.versions.length === 1 ? "version" : "versions"}
                        </span>
                      </span>
                      <span className="hidden w-[92px] shrink-0 sm:block">
                        <span className="mb-1 flex items-baseline justify-between">
                          <span className="eyebrow text-[8px]">ATS</span>
                          <span className="num text-[11px] text-ink">{score}</span>
                        </span>
                        <Meter
                          value={score}
                          tone={score >= 80 ? "accent" : score >= 55 ? "warning" : "danger"}
                        />
                      </span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-ink" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {cvs.length ? (
            <div className="border-t border-line-soft bg-surface/50 px-5 py-3">
              <Link
                href="/dashboard/studio"
                className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-accent-ink transition-opacity hover:opacity-75"
              >
                <Plus className="h-3 w-3" /> Create a version for another role
              </Link>
            </div>
          ) : null}
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[14px] font-medium text-ink">Career signal</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">How a reader and a parser see you.</p>
            </div>
            <ScoreRing value={leading?.report.score ?? 0} size={64} label="ATS" />
          </div>

          <div className="mt-4 space-y-2.5">
            {(leading?.report.checks ?? []).slice(0, 4).map((check) => (
              <div key={check.id} className="flex items-start gap-2">
                <span
                  className={`mt-[3px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold ${
                    check.status === "pass"
                      ? "bg-accent-soft text-accent"
                      : check.status === "warn"
                        ? "bg-[hsl(var(--warning))]/12 text-[hsl(var(--warning))]"
                        : "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]"
                  }`}
                >
                  {check.status === "pass" ? "✓" : "!"}
                </span>
                <div className="min-w-0">
                  <p className="text-[11.5px] font-medium text-ink">{check.label}</p>
                  <p className="text-[10.5px] leading-snug text-muted">{check.detail}</p>
                </div>
              </div>
            ))}
            {!leading ? (
              <p className="text-[12px] leading-relaxed text-muted">
                Create a CV and this panel starts reading it the way an applicant tracking system
                would: structure, dates, measurable outcomes and keywords.
              </p>
            ) : null}
          </div>

          <div className="mt-auto pt-4">
            {leading && nextFix ? (
              <div className="rounded-xl border border-line bg-surface/70 p-3">
                <p className="eyebrow mb-1 text-[8.5px]">Next best action</p>
                <p className="text-[11.5px] leading-snug text-ink">{nextFix.label}</p>
                <p className="mt-0.5 text-[10.5px] leading-snug text-muted">{nextFix.detail}</p>
                <Link
                  href={`/dashboard/match?cv=${leading.cv.id}`}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent-ink"
                >
                  Work on it <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            ) : (
              <Link href="/dashboard/match" className={buttonClass("secondary", "sm", "w-full")}>
                <Target className="h-3.5 w-3.5" /> Match a job description
              </Link>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr]">
        <Card className="flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-[14px] font-medium text-ink">Online portfolio</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                A page you can send instead of a PDF.
              </p>
            </div>
            <Badge tone={portfolio.published ? "positive" : "outline"}>
              {portfolio.published ? "Live" : "Draft"}
            </Badge>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border border-line">
            <div className="flex items-center gap-1.5 border-b border-line-soft bg-surface px-3 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="h-1.5 w-1.5 rounded-full bg-line" />
              <span className="ml-2 truncate font-mono text-[9.5px] text-muted">
                folivio.app/p/{portfolio.slug}
              </span>
            </div>
            <div className="bg-card p-4">
              <p className="display text-[22px] leading-tight">
                {portfolio.displayName || "Your name"}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted">
                {portfolio.headline || "Your headline"}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {portfolio.projects.slice(0, 3).map((project) => (
                  <span
                    key={project.id}
                    className="rounded border border-line px-1.5 py-0.5 text-[9.5px] text-muted"
                  >
                    {project.title}
                  </span>
                ))}
                {portfolio.projects.length === 0 ? (
                  <span className="text-[10.5px] text-muted">No projects added yet.</span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link href="/dashboard/portfolio" className={buttonClass("secondary", "sm")}>
              Edit portfolio
            </Link>
            {portfolio.published ? (
              <>
                <button type="button" onClick={copyPortfolio} className={buttonClass("ghost", "sm")}>
                  <Copy className="h-3 w-3" /> Copy link
                </button>
                <Link
                  href={`/p/${portfolio.slug}`}
                  target="_blank"
                  className={buttonClass("ghost", "sm")}
                >
                  View <ArrowUpRight className="h-3 w-3" />
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={copyPortfolio}
                className={buttonClass("ghost", "sm")}
                disabled
              >
                Copy link
              </button>
            )}
          </div>
        </Card>

        <Card className="flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[14px] font-medium text-ink">Recent activity</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">A quiet record of what changed.</p>
            </div>
            <Badge tone="outline">{activity.length}</Badge>
          </div>

          {activity.length === 0 ? (
            <p className="mt-6 text-[12px] leading-relaxed text-muted">
              Nothing yet. Edits, new versions and published pages will appear here.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {activity.slice(0, 5).map((item) => (
                <li key={item.id} className="flex items-start gap-2.5">
                  <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/50" />
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] leading-snug text-ink">{item.text}</p>
                    <p className="text-[10px] text-muted">{relativeTime(item.at)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <SectionHead
            eyebrow="Career path intelligence"
            title="Where this profile already points"
            description="Based on the skills and roles on your profile. Not a prediction, a set of nearby moves."
          />
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {paths.map((path) => (
              <div key={path.title} className="rounded-xl border border-line bg-surface/50 p-3.5">
                <p className="text-[12.5px] font-medium text-ink">{path.title}</p>
                <p className="mt-1 text-[11px] leading-snug text-muted">{path.why}</p>
                <div className="mt-2.5 flex flex-wrap gap-1">
                  {path.bridge.map((item) => (
                    <span
                      key={item}
                      className="rounded border border-line bg-card px-1.5 py-0.5 text-[9.5px] text-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <Link
              href="/dashboard/assistant"
              className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-accent-ink transition-opacity hover:opacity-75"
            >
              Talk it through with the assistant <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
