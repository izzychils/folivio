"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  FileText,
  Save,
  Sparkles,
  Target,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, Card, EmptyState, Meter, ScoreRing } from "@/components/ui/surface";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { atsReport, gapAnalysis, matchJob } from "@/lib/intelligence";
import { uid } from "@/lib/utils";
import type { AtsReport, GapItem, MatchReport } from "@/lib/types";

const SAMPLE_BRIEF = `Senior Product Designer, Care Platform

We are looking for a senior product designer to lead the end to end experience of our care platform. You will work with clinicians, engineers and data partners to simplify complex workflows.

What you will do
- Own discovery and delivery for two squads, from research through to production handoff
- Build and maintain the design system alongside the frontend platform team
- Run qualitative research with patients and clinicians, and turn it into decisions
- Raise the accessibility bar across every surface we ship

What we are looking for
- 5 or more years designing digital products, ideally in health or fintech
- Strong systems thinking and hands on design system experience
- Comfortable with usability testing, journey mapping and prototyping
- Working knowledge of WCAG 2.1 accessibility standards
- Clear written communication and a portfolio that explains your decisions`;

export default function MatchPage() {
  const { workspace, update } = useWorkspace();
  const { toast } = useToast();
  const cvs = workspace?.cvs ?? [];

  const [cvId, setCvId] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [jd, setJd] = useState("");
  const [result, setResult] = useState<{ match: MatchReport; gaps: GapItem[]; ats: AtsReport } | null>(null);

  useEffect(() => {
    if (!cvId && cvs[0]) setCvId(cvs[0].id);
  }, [cvs, cvId]);

  const selected = useMemo(() => cvs.find((cv) => cv.id === cvId) ?? null, [cvs, cvId]);

  useEffect(() => {
    if (!selected) return;
    setRole(selected.targetRole);
    setCompany(selected.targetCompany);
    setJd(selected.jobDescription);
    setResult(null);
  }, [selected?.id]);

  const analyse = () => {
    if (!selected) return;
    const cv = { ...selected, targetRole: role || selected.targetRole, jobDescription: jd };
    const match = matchJob(cv, jd);
    const gaps = gapAnalysis(cv, jd);
    const ats = atsReport(cv);
    setResult({ match, gaps, ats });
  };

  const saveToCv = () => {
    if (!selected) return;
    update((state) => ({
      ...state,
      cvs: state.cvs.map((cv) =>
        cv.id === selected.id
          ? { ...cv, targetRole: role, targetCompany: company, jobDescription: jd, updatedAt: new Date().toISOString() }
          : cv,
      ),
      activity: [
        {
          id: uid("act"),
          kind: "cv.updated" as const,
          text: `Set the target brief for ${selected.title}`,
          at: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 30),
    }));
    toast({ title: "Saved to the CV", description: "The ATS check and editor now use this brief.", tone: "success" });
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Job match</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">Does this document answer the brief?</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            Paste a job description. Folivio finds the language the role asks for, shows what your CV
            already covers, and names the gaps without inventing anything to fill them.
          </p>
        </div>
        {cvs.length ? (
          <div className="w-full sm:w-[260px]">
            <Field label="Document">
              <Select value={cvId} onChange={(event) => setCvId(event.target.value)}>
                {cvs.map((cv) => (
                  <option key={cv.id} value={cv.id}>
                    {cv.title}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
        ) : null}
      </header>

      {!selected ? (
        <EmptyState
          icon={FileText}
          title="No CV to match yet"
          description="Create a CV first. The match is measured against the document you would actually send."
          action={
            <Link href="/dashboard/studio" className={buttonClass("primary", "md")}>
              Open the studio <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          }
          className="mt-8"
        />
      ) : (
        <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)]">
          <Card>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[14px] font-medium text-ink">The brief</h2>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Everything here stays with this version of the CV.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setJd(SAMPLE_BRIEF);
                  setRole("Senior Product Designer");
                  setCompany("Lumen Health");
                  toast({ title: "Sample brief loaded", description: "Analyse it to see the match engine work." });
                }}
                className="inline-flex items-center gap-1 text-[10.5px] font-medium text-accent-ink"
              >
                <Sparkles className="h-3 w-3" /> Sample
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Role">
                <Input value={role} onChange={(event) => setRole(event.target.value)} placeholder="Senior Product Designer" />
              </Field>
              <Field label="Company">
                <Input value={company} onChange={(event) => setCompany(event.target.value)} placeholder="Lumen Health" />
              </Field>
            </div>

            <div className="mt-3">
              <Field label="Job description" hint={`${jd.trim().split(/\s+/).filter(Boolean).length} words`}>
                <Textarea
                  value={jd}
                  onChange={(event) => {
                    setJd(event.target.value);
                    setResult(null);
                  }}
                  className="min-h-[300px] font-mono text-[11.5px] leading-relaxed"
                  placeholder="Paste the responsibilities, requirements and nice to haves."
                />
              </Field>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button onClick={analyse} disabled={!jd.trim()}>
                <Target className="h-3.5 w-3.5" /> Analyse match
              </Button>
              <Button variant="secondary" onClick={saveToCv}>
                <Save className="h-3.5 w-3.5" /> Save to this CV
              </Button>
              <Link href={`/studio/${selected.id}`} className={buttonClass("ghost", "md", "ml-auto")}>
                Open editor <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </Card>

          <div className="space-y-4">
            {!result ? (
              <Card className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-muted">
                  <Target className="h-5 w-5" strokeWidth={1.5} />
                </span>
                <p className="mt-3 text-[13px] font-medium text-ink">Nothing analysed yet</p>
                <p className="mt-1 max-w-[250px] text-[11.5px] leading-relaxed text-muted">
                  Add a job description and run the match. The score is explained term by term, not
                  handed down as a mystery number.
                </p>
              </Card>
            ) : (
              <>
                <Card>
                  <div className="flex items-center gap-4">
                    <ScoreRing value={result.match.score} size={88} label="fit" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-ink">
                        {result.match.score >= 75
                          ? "Strong coverage"
                          : result.match.score >= 50
                            ? "Partial coverage"
                            : "Needs a targeted pass"}
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted">
                        {result.match.stats.covered} of {result.match.stats.required} job description
                        terms appear in this document.
                      </p>
                      <div className="mt-2">
                        <Meter value={(result.match.stats.covered / Math.max(1, result.match.stats.required)) * 100} />
                      </div>
                    </div>
                  </div>

                  {result.match.emphasis.length ? (
                    <div className="mt-4">
                      <p className="eyebrow mb-1.5 text-[8.5px]">Lead with these</p>
                      <div className="flex flex-wrap gap-1">
                        {result.match.emphasis.map((term) => (
                          <span key={term} className="rounded border border-transparent bg-accent-soft px-1.5 py-0.5 text-[10px] text-accent-ink">
                            {term}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </Card>

                <Card>
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-medium text-ink">Terms missing</p>
                    <Badge tone="outline">{result.match.missing.length}</Badge>
                  </div>
                  {result.match.missing.length ? (
                    <>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {result.match.missing.map((term) => (
                          <span key={term} className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-muted">
                            {term}
                          </span>
                        ))}
                      </div>
                      <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
                        Only add a term if it is genuinely part of your work. A keyword you cannot
                        defend in an interview is worse than a gap.
                      </p>
                    </>
                  ) : (
                    <p className="mt-2 flex items-center gap-1.5 text-[11.5px] text-ink">
                      <Check className="h-3.5 w-3.5 text-accent" /> Every extracted term is covered.
                    </p>
                  )}
                </Card>

                <Card>
                  <p className="text-[13px] font-medium text-ink">What to work on</p>
                  <ul className="mt-2.5 space-y-2.5">
                    {result.gaps.slice(0, 5).map((gap) => (
                      <li key={gap.title} className="flex items-start gap-2">
                        <span
                          className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                            gap.severity === "high"
                              ? "bg-[hsl(var(--danger))]"
                              : gap.severity === "medium"
                                ? "bg-[hsl(var(--warning))]"
                                : "bg-line"
                          }`}
                        />
                        <div>
                          <p className="text-[11.5px] font-medium leading-snug text-ink">{gap.title}</p>
                          <p className="mt-0.5 text-[10.5px] leading-snug text-muted">{gap.detail}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </Card>
              </>
            )}

            <Card>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-medium text-ink">This document</p>
                <span className="num text-[11px] text-muted">{result?.ats.score ?? atsReport(selected).score}/100</span>
              </div>
              <div className="mt-2 space-y-1.5">
                {atsReport(selected)
                  .checks.filter((check) => check.status !== "pass")
                  .slice(0, 3)
                  .map((check) => (
                    <div key={check.id} className="flex items-start gap-1.5">
                      <span className="mt-[5px] h-1 w-1 shrink-0 rounded-full bg-[hsl(var(--warning))]" />
                      <p className="text-[10.5px] leading-snug text-muted">
                        <span className="text-ink">{check.label}.</span> {check.detail}
                      </p>
                    </div>
                  ))}
                {atsReport(selected).checks.every((check) => check.status === "pass") ? (
                  <p className="text-[11px] text-muted">All structural checks pass.</p>
                ) : null}
              </div>
              <Link href={`/studio/${selected.id}`} className={buttonClass("secondary", "sm", "mt-3 w-full")}>
                Fix in the editor <ArrowRight className="h-3 w-3" />
              </Link>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
