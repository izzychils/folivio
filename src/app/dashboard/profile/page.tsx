"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, FileText, Info, Sparkles } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Card, Meter } from "@/components/ui/surface";
import { Field, Textarea } from "@/components/ui/field";
import { SectionForm, SECTIONS, sectionComplete, type SectionId } from "@/components/studio/sections";
import { newCv } from "@/lib/cv";
import type { CareerProfile, CV } from "@/lib/types";
import { cn, firstName, wordCount } from "@/lib/utils";
import { useSession } from "@/lib/session";
import { profileStrength } from "@/components/shell/app-shell";

const RAIL: { id: SectionId | "about"; label: string; hint: string }[] = [
  { id: "contact", label: "Contact", hint: "Name and reach" },
  { id: "summary", label: "Profile", hint: "The short version" },
  { id: "about", label: "Bio and goals", hint: "The longer version" },
  { id: "experience", label: "Experience", hint: "Roles and outcomes" },
  { id: "education", label: "Education", hint: "Study and training" },
  { id: "skills", label: "Skills", hint: "Tools and competencies" },
  { id: "projects", label: "Projects", hint: "Work with context" },
  { id: "certifications", label: "Certifications", hint: "Credentials" },
  { id: "languages", label: "Languages", hint: "Fluency" },
  { id: "achievements", label: "Achievements", hint: "Proof points" },
];

export default function ProfilePage() {
  const { workspace, update } = useWorkspace();
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const [draft, setDraft] = useState<CareerProfile | null>(null);
  const [active, setActive] = useState<SectionId | "about">("contact");
  const loaded = useRef(false);

  useEffect(() => {
    if (workspace?.profile && !loaded.current) {
      loaded.current = true;
      setDraft(workspace.profile);
    }
  }, [workspace]);

  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      update((state) => ({ ...state, profile: { ...draft, updatedAt: new Date().toISOString() } }));
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, update]);

  const asCv: CV | null = useMemo(() => (draft ? newCv(draft, { title: "Profile" }) : null), [draft]);
  const strength = profileStrength(draft ?? undefined);
  const sectionMeta = SECTIONS.find((item) => item.id === active);

  if (!draft || !asCv) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-line-soft" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-24 animate-pulse rounded-xl bg-line-soft" />
          ))}
        </div>
      </div>
    );
  }

  const applyCv = (next: CV) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            contact: next.contact,
            summary: next.summary,
            experience: next.experience,
            education: next.education,
            skills: next.skills,
            projects: next.projects,
            certifications: next.certifications,
            languages: next.languages,
            achievements: next.achievements,
          }
        : current,
    );
  };

  const createCv = () => {
    if (!workspace || !draft) return;
    const cv = newCv(draft, {
      title: draft.contact.headline ? `${draft.contact.headline} CV` : "New CV",
    });
    update((state) => ({
      ...state,
      cvs: [cv, ...state.cvs],
      activity: [
        {
          id: `act_${Date.now()}`,
          kind: "cv.created" as const,
          text: `Created ${cv.title} from the career profile`,
          at: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 30),
    }));
    toast({ title: "CV created from your profile", tone: "success" });
    router.push(`/studio/${cv.id}`);
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Source of truth</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">
            {firstName(user?.name ?? "Your")}&apos;s career profile.
          </h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            Write it once, properly. Every CV, letter and portfolio page is built from this material,
            so improving it improves everything downstream.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="hidden w-[150px] sm:block">
            <div className="mb-1 flex items-baseline justify-between">
              <span className="eyebrow text-[8px]">Complete</span>
              <span className="num text-[10.5px] text-muted">{strength}%</span>
            </div>
            <Meter value={strength} />
          </div>
          <Button onClick={createCv}>
            <FileText className="h-3.5 w-3.5" /> Create a CV
          </Button>
        </div>
      </header>

      {workspace?.settings.sampleContent ? (
        <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-line bg-surface/70 px-4 py-3">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
          <p className="text-[11.5px] leading-relaxed text-muted">
            This is sample material. Edit any field in place and it becomes yours.{" "}
            <Link href="/dashboard/settings" className="text-ink underline decoration-line underline-offset-2">
              Clear sample content
            </Link>{" "}
            if you would rather start empty.
          </p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-5 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav className="lg:sticky lg:top-[76px] lg:self-start">
          <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible">
            {RAIL.map((item) => {
              const done =
                item.id === "about"
                  ? Boolean(draft.bio.trim() && draft.goals.trim())
                  : sectionComplete(asCv, item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-colors lg:w-full",
                    active === item.id
                      ? "bg-accent-soft text-accent-ink"
                      : "text-muted hover:bg-card hover:text-ink",
                  )}
                >
                  <span className="flex-1">
                    <span className="block whitespace-nowrap text-[12px] font-medium">{item.label}</span>
                    <span className="hidden text-[9.5px] text-muted lg:block">{item.hint}</span>
                  </span>
                  <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", done ? "bg-accent/70" : "bg-line")} />
                </button>
              );
            })}
          </div>
        </nav>

        <div className="min-w-0">
          <Card className="p-4 sm:p-5">
            {active === "about" ? (
              <AboutForm
                bio={draft.bio}
                goals={draft.goals}
                onChange={(patch) => setDraft((current) => (current ? { ...current, ...patch } : current))}
              />
            ) : (
              <>
                <div className="mb-4">
                  <p className="eyebrow mb-1 text-[8.5px]">
                    Section {String(SECTIONS.findIndex((item) => item.id === active) + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-[18px] font-medium text-ink">{sectionMeta?.label}</h2>
                  <p className="mt-0.5 text-[11.5px] text-muted">
                    {SECTIONS.find((item) => item.id === active)?.description}
                  </p>
                </div>
                <SectionForm section={active as SectionId} cv={asCv} onChange={applyCv} />
              </>
            )}
          </Card>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="live-dot" />
              <p className="text-[11px] text-muted">Changes save to this browser as you write.</p>
            </div>
            <Link href="/dashboard/portfolio" className={buttonClass("ghost", "sm")}>
              Portfolio uses this too <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutForm({
  bio,
  goals,
  onChange,
}: {
  bio: string;
  goals: string;
  onChange: (patch: Partial<CareerProfile>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <p className="eyebrow mb-1 text-[8.5px]">Section 03</p>
        <h2 className="text-[18px] font-medium text-ink">Bio and goals</h2>
        <p className="mt-0.5 text-[11.5px] text-muted">
          The longer version of you. Used on the portfolio, in letters and by the assistant.
        </p>
      </div>

      <Field label="Professional bio" hint={`${wordCount(bio)} words`}>
        <Textarea
          value={bio}
          onChange={(event) => onChange({ bio: event.target.value })}
          className="min-h-[150px] text-[12.5px] leading-relaxed"
          placeholder="How you work, what you care about, and the kind of problem you are good at."
        />
      </Field>

      <Field label="What you are moving toward" hint="Private, never printed automatically">
        <Textarea
          value={goals}
          onChange={(event) => onChange({ goals: event.target.value })}
          className="min-h-[100px] text-[12.5px] leading-relaxed"
          placeholder="A role with more scope, a move into design leadership, a career change you are testing."
        />
      </Field>

      <div className="flex items-start gap-2 rounded-lg border border-line bg-surface/70 p-3">
        <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <p className="text-[11px] leading-relaxed text-muted">
          Goals shape suggestions, never claims. Nothing here is printed on a CV unless you put it
          there yourself.
        </p>
      </div>
    </div>
  );
}
