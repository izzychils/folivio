"use client";

import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  Check,
  ScanText,
  Sparkles,
  Target,
  TrendingUp,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Meter, ScoreRing } from "@/components/ui/surface";

type TabId = "rewrite" | "match" | "ats" | "paths";

const TABS: { id: TabId; label: string; icon: typeof Wand2; caption: string }[] = [
  {
    id: "rewrite",
    label: "Experience rewriting",
    icon: Wand2,
    caption: "Finds the outcome hidden inside a vague sentence.",
  },
  {
    id: "match",
    label: "Job description matching",
    icon: Target,
    caption: "Reads the brief the way a hiring team wrote it.",
  },
  {
    id: "ats",
    label: "ATS analysis",
    icon: ScanText,
    caption: "Shows what a parser sees before a person does.",
  },
  {
    id: "paths",
    label: "Career paths",
    icon: TrendingUp,
    caption: "Names nearby moves, and what is missing to make them.",
  },
];

export function MarketingIntelligence() {
  const [tab, setTab] = useState<TabId>("rewrite");
  const active = TABS.find((item) => item.id === tab) ?? TABS[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)]">
      <div className="flex gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {TABS.map((item) => {
          const Icon = item.icon;
          const selected = item.id === tab;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={cn(
                "shrink-0 rounded-xl border px-3.5 py-3 text-left transition-colors lg:w-full",
                selected
                  ? "border-accent/30 bg-accent-soft/60"
                  : "border-transparent hover:border-line hover:bg-surface",
              )}
            >
              <span className="flex items-center gap-2">
                <Icon className={cn("h-3.5 w-3.5", selected ? "text-accent" : "text-muted")} />
                <span className={cn("text-[12px] font-medium", selected ? "text-accent-ink" : "text-ink")}>
                  {item.label}
                </span>
              </span>
              <span className="mt-1 hidden text-[10.5px] leading-snug text-muted lg:block">
                {item.caption}
              </span>
            </button>
          );
        })}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line bg-surface/70 px-3.5 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
            <span className="h-1.5 w-1.5 rounded-full bg-line" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted">{active.label}</span>
          <span className="flex items-center gap-1 text-[9px] text-muted">
            <span className="live-dot" /> local engine
          </span>
        </div>

        <div className="p-4 sm:p-5">
          {tab === "rewrite" ? <RewritePanel /> : null}
          {tab === "match" ? <MatchPanel /> : null}
          {tab === "ats" ? <AtsPanel /> : null}
          {tab === "paths" ? <PathsPanel /> : null}
        </div>
      </div>
    </div>
  );
}

function RewritePanel() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="eyebrow text-[8.5px]">Senior Product Designer / Meridian Health</p>
        <span className="inline-flex items-center gap-1 text-[9.5px] text-muted">
          <Sparkles className="h-3 w-3 text-accent" /> suggestion
        </span>
      </div>

      <div className="mt-3 rounded-lg border border-line bg-surface/60 p-3">
        <p className="eyebrow mb-1 text-[8px]">What you wrote</p>
        <p className="text-[12px] leading-relaxed text-muted">
          I was responsible for helping with the redesign of the onboarding flow.
        </p>
      </div>

      <div className="my-2 flex justify-center">
        <ArrowDown className="h-3.5 w-3.5 text-muted" />
      </div>

      <div className="rounded-lg border border-[hsl(var(--accent))]/25 bg-accent-soft/50 p-3">
        <p className="eyebrow mb-1 text-[8px] text-accent">What Folivio wrote</p>
        <p className="text-[12.5px] leading-relaxed text-ink">
          Led the onboarding redesign, cutting drop-off from 41% to 18% across three markets.
        </p>
        <p className="mt-2 border-t border-[hsl(var(--accent))]/15 pt-2 text-[9.5px] leading-relaxed text-muted">
          No new facts. The numbers were already in your notes, and the verb was the only thing
          missing.
        </p>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {["Tightened", "Formal", "Concise"].map((label) => (
          <span
            key={label}
            className="rounded-md border border-line bg-card px-2 py-1 text-[9.5px] text-muted"
          >
            {label}
          </span>
        ))}
        <span className="ml-auto text-[9.5px] text-muted">Three variants, one source</span>
      </div>
    </div>
  );
}

function MatchPanel() {
  return (
    <div>
      <div className="flex items-center gap-4">
        <ScoreRing value={78} size={78} label="fit" />
        <div>
          <p className="text-[12.5px] font-medium text-ink">Senior Product Designer, Lumen Health</p>
          <p className="mt-0.5 text-[10.5px] text-muted">24 of 31 role terms covered by this CV.</p>
          <div className="mt-2 w-[180px]">
            <Meter value={78} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <p className="eyebrow mb-1.5 text-[8px] text-accent">Already covered</p>
          <div className="flex flex-wrap gap-1">
            {["design system", "usability testing", "research", "accessibility", "fintech"].map((term) => (
              <span key={term} className="rounded border border-transparent bg-accent-soft px-1.5 py-0.5 text-[9.5px] text-accent-ink">
                {term}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-1.5 text-[8px]">Worth addressing</p>
          <div className="flex flex-wrap gap-1">
            {["journey mapping", "prototyping", "WCAG 2.1"].map((term) => (
              <span key={term} className="rounded border border-line bg-surface px-1.5 py-0.5 text-[9.5px] text-muted">
                {term}
              </span>
            ))}
          </div>
          <p className="mt-1.5 text-[9.5px] leading-snug text-muted">
            Add only what is true. A gap you can explain is better than a claim you cannot defend.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-lg border border-line bg-surface/60 p-2.5">
        <p className="text-[10px] leading-relaxed text-muted">
          <span className="text-ink">Lead with:</span> the onboarding redesign, the design system
          adoption, and the accessibility pass on core flows.
        </p>
      </div>
    </div>
  );
}

function AtsPanel() {
  const checks = [
    { label: "Contact details", detail: "Email and phone present in the header.", ok: true },
    { label: "Complete date ranges", detail: "Every role has a start and an end.", ok: true },
    { label: "Measurable outcomes", detail: "Three bullets include a number.", ok: true },
    { label: "Job description keywords", detail: "17 of 24 terms matched.", ok: false },
  ];
  return (
    <div>
      <div className="flex items-center gap-4">
        <ScoreRing value={91} size={78} label="ATS" />
        <div>
          <p className="text-[12.5px] font-medium text-ink">Structure holds up</p>
          <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
            A readable document with real dates, real outcomes and no tables hiding the text.
          </p>
        </div>
      </div>

      <div className="mt-4 divide-y divide-[hsl(var(--line-soft))] border-y border-line">
        {checks.map((check) => (
          <div key={check.label} className="flex items-start gap-2 py-2.5">
            <span
              className={cn(
                "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold",
                check.ok ? "bg-accent-soft text-accent" : "bg-[hsl(var(--warning))]/12 text-[hsl(var(--warning))]",
              )}
            >
              {check.ok ? <Check className="h-2 w-2" strokeWidth={3} /> : "!"}
            </span>
            <div>
              <p className="text-[11px] font-medium text-ink">{check.label}</p>
              <p className="text-[10px] text-muted">{check.detail}</p>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-[9.5px] text-muted">
        A score is an opinion about structure. It is not a prediction of an interview.
      </p>
    </div>
  );
}

function PathsPanel() {
  const paths = [
    {
      role: "Design Systems Lead",
      why: "Your system work and adoption numbers already read like a lead, not a contributor.",
      bridge: ["Design ops", "Frontend fundamentals"],
    },
    {
      role: "Design Manager",
      why: "You have mentored three designers and run critique. The missing piece is formal people scope.",
      bridge: ["Line management", "Hiring"],
    },
    {
      role: "Design Engineer",
      why: "HTML, CSS and Storybook experience puts the design engineering route within reach.",
      bridge: ["TypeScript", "Component APIs"],
    },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-[12.5px] font-medium text-ink">Paths this profile points to</p>
        <span className="text-[9.5px] text-muted">based on skills, not fantasy</span>
      </div>
      <div className="mt-3 space-y-2">
        {paths.map((path, index) => (
          <div key={path.role} className="rounded-lg border border-line bg-surface/50 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-baseline gap-2">
                <span className="num font-mono text-[9px] text-muted">0{index + 1}</span>
                <p className="text-[12px] font-medium text-ink">{path.role}</p>
              </div>
              <ArrowRight className="h-3 w-3 shrink-0 text-muted" />
            </div>
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{path.why}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {path.bridge.map((item) => (
                <span key={item} className="rounded border border-line bg-card px-1.5 py-0.5 text-[9px] text-muted">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
