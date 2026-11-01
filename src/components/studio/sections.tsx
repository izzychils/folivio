"use client";

import { useState } from "react";
import {
  Award,
  Briefcase,
  Folder,
  GraduationCap,
  Languages as LanguagesIcon,
  Plus,
  Sparkles,
  Star,
  Target,
  Trash2,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { ChipInput } from "@/components/ui/field";
import { BulletsEditor } from "./bullets";
import { draftSummary, rewriteBullet } from "@/lib/intelligence";
import type { CV, Experience } from "@/lib/types";
import { newCv } from "@/lib/cv";
import { uid, wordCount } from "@/lib/utils";

export type SectionId =
  | "target"
  | "contact"
  | "summary"
  | "experience"
  | "education"
  | "skills"
  | "projects"
  | "certifications"
  | "languages"
  | "achievements";

export const SECTIONS: {
  id: SectionId;
  label: string;
  icon: LucideIcon;
  description: string;
}[] = [
  { id: "target", label: "Target role", icon: Target, description: "What this version is for." },
  { id: "contact", label: "Contact", icon: User, description: "How a recruiter reaches you." },
  { id: "summary", label: "Profile", icon: Sparkles, description: "The first 40 words they read." },
  { id: "experience", label: "Experience", icon: Briefcase, description: "Roles and what changed." },
  { id: "education", label: "Education", icon: GraduationCap, description: "Qualifications and training." },
  { id: "skills", label: "Skills", icon: Wrench, description: "Tools and competencies, grouped." },
  { id: "projects", label: "Projects", icon: Folder, description: "Work that needs context." },
  { id: "certifications", label: "Certifications", icon: Award, description: "Credentials with a source." },
  { id: "languages", label: "Languages", icon: LanguagesIcon, description: "Languages and fluency." },
  { id: "achievements", label: "Achievements", icon: Star, description: "Short proof points." },
];

export function sectionComplete(cv: CV, section: SectionId): boolean {
  switch (section) {
    case "target":
      return Boolean(cv.targetRole.trim());
    case "contact":
      return Boolean(cv.contact.fullName && cv.contact.email);
    case "summary":
      return wordCount(cv.summary) >= 25;
    case "experience":
      return cv.experience.some((role) => role.role || role.company);
    case "education":
      return cv.education.some((item) => item.school || item.degree);
    case "skills":
      return cv.skills.some((group) => group.items.filter(Boolean).length > 0);
    case "projects":
      return cv.projects.some((project) => project.name);
    case "certifications":
      return cv.certifications.some((item) => item.name);
    case "languages":
      return cv.languages.some((item) => item.name);
    case "achievements":
      return cv.achievements.filter(Boolean).length > 0;
    default:
      return false;
  }
}

export function SectionForm({
  section,
  cv,
  onChange,
}: {
  section: SectionId;
  cv: CV;
  onChange: (next: CV) => void;
}) {
  switch (section) {
    case "target":
      return <TargetForm cv={cv} onChange={onChange} />;
    case "contact":
      return <ContactForm cv={cv} onChange={onChange} />;
    case "summary":
      return <SummaryForm cv={cv} onChange={onChange} />;
    case "experience":
      return <ExperienceForm cv={cv} onChange={onChange} />;
    case "education":
      return <EducationForm cv={cv} onChange={onChange} />;
    case "skills":
      return <SkillsForm cv={cv} onChange={onChange} />;
    case "projects":
      return <ProjectsForm cv={cv} onChange={onChange} />;
    case "certifications":
      return <CertificationsForm cv={cv} onChange={onChange} />;
    case "languages":
      return <LanguagesForm cv={cv} onChange={onChange} />;
    case "achievements":
      return <AchievementsForm cv={cv} onChange={onChange} />;
    default:
      return null;
  }
}

/* ── target ─────────────────────────────────────────────────────────────── */

function TargetForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  return (
    <div className="space-y-4">
      <Field label="Target role" hint="Shown under your name">
        <Input
          value={cv.targetRole}
          onChange={(event) => onChange({ ...cv, targetRole: event.target.value })}
          placeholder="Senior Product Designer"
        />
      </Field>
      <Field label="Company or organisation">
        <Input
          value={cv.targetCompany}
          onChange={(event) => onChange({ ...cv, targetCompany: event.target.value })}
          placeholder="Lumen Health"
        />
      </Field>
      <Field
        label="Job description"
        hint="Powers matching and keyword checks"
      >
        <Textarea
          value={cv.jobDescription}
          onChange={(event) => onChange({ ...cv, jobDescription: event.target.value })}
          placeholder="Paste the role description here. Folivio will find the terms this document should answer."
          className="min-h-[190px] font-mono text-[11.5px] leading-relaxed"
        />
      </Field>
      <div className="rounded-lg border border-line bg-surface/60 p-3">
        <p className="text-[11.5px] leading-relaxed text-muted">
          The job description never changes your history. It changes which parts of it this version
          puts first, and which words the ATS check looks for.
        </p>
      </div>
    </div>
  );
}

/* ── contact ────────────────────────────────────────────────────────────── */

function ContactForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (key: keyof CV["contact"], value: string) =>
    onChange({ ...cv, contact: { ...cv.contact, [key]: value } });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Full name">
          <Input value={cv.contact.fullName} onChange={(event) => patch("fullName", event.target.value)} placeholder="Amara Okonkwo" />
        </Field>
        <Field label="Professional headline">
          <Input value={cv.contact.headline} onChange={(event) => patch("headline", event.target.value)} placeholder="Senior Product Designer" />
        </Field>
        <Field label="Email">
          <Input type="email" value={cv.contact.email} onChange={(event) => patch("email", event.target.value)} placeholder="you@example.com" />
        </Field>
        <Field label="Phone">
          <Input value={cv.contact.phone} onChange={(event) => patch("phone", event.target.value)} placeholder="+234 800 000 0000" />
        </Field>
        <Field label="Location">
          <Input value={cv.contact.location} onChange={(event) => patch("location", event.target.value)} placeholder="Lagos, Nigeria" />
        </Field>
        <Field label="Website or portfolio">
          <Input value={cv.contact.website} onChange={(event) => patch("website", event.target.value)} placeholder="yourname.com" />
        </Field>
        <Field label="LinkedIn">
          <Input value={cv.contact.linkedin} onChange={(event) => patch("linkedin", event.target.value)} placeholder="linkedin.com/in/yourname" />
        </Field>
        <Field label="GitHub or other">
          <Input value={cv.contact.github} onChange={(event) => patch("github", event.target.value)} placeholder="github.com/yourname" />
        </Field>
      </div>
      <p className="text-[10.5px] leading-relaxed text-muted">
        Only what you enter appears on the sheet. Leave a field empty and Folivio will not print a
        placeholder.
      </p>
    </div>
  );
}

/* ── summary ────────────────────────────────────────────────────────────── */

function SummaryForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const words = wordCount(cv.summary);

  return (
    <div className="space-y-3">
      <Field label="Professional profile" hint={`${words} words, aim for 40 to 90`}>
        <Textarea
          value={cv.summary}
          onChange={(event) => onChange({ ...cv, summary: event.target.value })}
          placeholder="What you do, the scale you have worked at, and the value you bring. In your own words."
          className="min-h-[170px] text-[12.5px] leading-relaxed"
        />
      </Field>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSuggestion(draftSummary(cv))}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-card px-2.5 py-1.5 text-[11px] font-medium text-ink transition-colors hover:border-[hsl(var(--accent))]/40"
        >
          <Sparkles className="h-3 w-3 text-accent" /> Suggest a profile
        </button>
        <span className="text-[10px] text-muted">Assembled from your roles and skills.</span>
      </div>

      {suggestion ? (
        <div className="overflow-hidden rounded-xl border border-[hsl(var(--accent))]/25 bg-accent-soft/50">
          <div className="flex items-center justify-between border-b border-[hsl(var(--accent))]/15 px-3 py-2">
            <span className="eyebrow text-[8.5px] text-accent">Draft from your profile</span>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="text-[10px] text-muted hover:text-ink"
            >
              Dismiss
            </button>
          </div>
          <p className="px-3 py-2.5 text-[12px] leading-relaxed text-ink">{suggestion}</p>
          <div className="flex gap-2 border-t border-[hsl(var(--accent))]/15 px-3 py-2">
            <button
              type="button"
              onClick={() => {
                onChange({ ...cv, summary: suggestion });
                setSuggestion(null);
              }}
              className="rounded-md bg-[hsl(var(--accent))] px-2.5 py-1 text-[10.5px] font-medium text-[hsl(var(--paper))]"
            >
              Use this wording
            </button>
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="rounded-md px-2.5 py-1 text-[10.5px] text-muted hover:text-ink"
            >
              Keep mine
            </button>
          </div>
        </div>
      ) : null}

      <div className="rounded-lg border border-line bg-surface/60 p-3">
        <p className="text-[11px] leading-relaxed text-muted">
          A summary should answer three things: what you do, the scale you have worked at, and what
          you are moving toward. If a number is not yours, leave it out.
        </p>
      </div>
    </div>
  );
}

/* ── experience ─────────────────────────────────────────────────────────── */

function ExperienceForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<Experience>) =>
    onChange({
      ...cv,
      experience: cv.experience.map((role) => (role.id === id ? { ...role, ...update } : role)),
    });

  return (
    <div className="space-y-3">
      {cv.experience.map((role, index) => (
        <div key={role.id} className="rounded-xl border border-line bg-card p-3.5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="eyebrow text-[8px]">Role {String(index + 1).padStart(2, "0")}</p>
              <p className="truncate text-[12.5px] font-medium text-ink">
                {role.role || "Untitled role"}
                {role.company ? <span className="text-muted"> at {role.company}</span> : null}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onChange({ ...cv, experience: cv.experience.filter((item) => item.id !== role.id) })
              }
              aria-label="Remove this role"
              className="rounded-md p-1.5 text-muted transition-colors hover:bg-[hsl(var(--danger))]/8 hover:text-[hsl(var(--danger))]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Job title">
                <Input value={role.role} onChange={(event) => patch(role.id, { role: event.target.value })} placeholder="Senior Product Designer" />
              </Field>
              <Field label="Company">
                <Input value={role.company} onChange={(event) => patch(role.id, { company: event.target.value })} placeholder="Meridian Health" />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Location">
                <Input value={role.location} onChange={(event) => patch(role.id, { location: event.target.value })} placeholder="Lagos, Nigeria" />
              </Field>
              <Field label="Start">
                <Input value={role.start} onChange={(event) => patch(role.id, { start: event.target.value })} placeholder="Mar 2022" />
              </Field>
              <Field label="End" hint={role.end.toLowerCase() === "present" ? "Current" : undefined}>
                <div className="flex gap-1.5">
                  <Input value={role.end} onChange={(event) => patch(role.id, { end: event.target.value })} placeholder="Present" />
                  <button
                    type="button"
                    onClick={() => patch(role.id, { end: "Present" })}
                    className="shrink-0 rounded-[10px] border border-line bg-surface px-2 text-[10px] text-muted transition-colors hover:text-ink"
                    title="Mark as current role"
                  >
                    Now
                  </button>
                </div>
              </Field>
            </div>
            <Field label="One line of context" hint="Optional">
              <Input value={role.summary} onChange={(event) => patch(role.id, { summary: event.target.value })} placeholder="Owning the patient experience across web and mobile." />
            </Field>
            <div>
              <p className="eyebrow mb-1.5 text-[9px]">Achievements</p>
              <BulletsEditor items={role.bullets} onChange={(bullets) => patch(role.id, { bullets })} />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            ...cv,
            experience: [
              ...cv.experience,
              {
                id: uid("exp"),
                role: "",
                company: "",
                location: "",
                start: "",
                end: "",
                summary: "",
                bullets: [""],
              },
            ],
          })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add a role
      </button>
    </div>
  );
}

/* ── education ──────────────────────────────────────────────────────────── */

function EducationForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<CV["education"][number]>) =>
    onChange({
      ...cv,
      education: cv.education.map((item) => (item.id === id ? { ...item, ...update } : item)),
    });

  return (
    <div className="space-y-3">
      {cv.education.map((item) => (
        <div key={item.id} className="rounded-xl border border-line bg-card p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-medium text-ink">{item.degree || "Untitled qualification"}</p>
            <button
              type="button"
              aria-label="Remove this qualification"
              onClick={() => onChange({ ...cv, education: cv.education.filter((entry) => entry.id !== item.id) })}
              className="rounded-md p-1.5 text-muted transition-colors hover:text-[hsl(var(--danger))]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            <Field label="Qualification">
              <Input value={item.degree} onChange={(event) => patch(item.id, { degree: event.target.value })} placeholder="BSc Human Computer Interaction" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Institution">
                <Input value={item.school} onChange={(event) => patch(item.id, { school: event.target.value })} placeholder="Covenant University" />
              </Field>
              <Field label="Location">
                <Input value={item.location} onChange={(event) => patch(item.id, { location: event.target.value })} placeholder="Ota, Nigeria" />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Start">
                <Input value={item.start} onChange={(event) => patch(item.id, { start: event.target.value })} placeholder="2013" />
              </Field>
              <Field label="End">
                <Input value={item.end} onChange={(event) => patch(item.id, { end: event.target.value })} placeholder="2017" />
              </Field>
            </div>
            <Field label="Detail" hint="Grade, thesis, honours">
              <Textarea value={item.detail} onChange={(event) => patch(item.id, { detail: event.target.value })} className="min-h-[64px] text-[12px]" placeholder="Second Class Upper. Final year project on wayfinding." />
            </Field>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          onChange({
            ...cv,
            education: [
              ...cv.education,
              { id: uid("edu"), degree: "", school: "", location: "", start: "", end: "", detail: "" },
            ],
          })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add education
      </button>
    </div>
  );
}

/* ── skills ─────────────────────────────────────────────────────────────── */

function SkillsForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<CV["skills"][number]>) =>
    onChange({
      ...cv,
      skills: cv.skills.map((group) => (group.id === id ? { ...group, ...update } : group)),
    });

  return (
    <div className="space-y-3">
      {cv.skills.map((group) => (
        <div key={group.id} className="rounded-xl border border-line bg-card p-3.5">
          <div className="mb-3 flex items-end gap-2">
            <Field label="Group label" className="flex-1">
              <Input value={group.label} onChange={(event) => patch(group.id, { label: event.target.value })} placeholder="Product" />
            </Field>
            <button
              type="button"
              aria-label="Remove this skill group"
              onClick={() => onChange({ ...cv, skills: cv.skills.filter((item) => item.id !== group.id) })}
              className="mb-0.5 rounded-md p-2 text-muted transition-colors hover:text-[hsl(var(--danger))]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <ChipInput
            values={group.items}
            onChange={(items) => patch(group.id, { items })}
            placeholder="Type a skill and press Enter"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...cv, skills: [...cv.skills, { id: uid("skl"), label: "", items: [] }] })}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add a skill group
      </button>
      <p className="text-[10.5px] leading-relaxed text-muted">
        Group by kind, not by level. Human skills and tools can sit in separate groups, which is
        easier for a reader to scan and for a parser to read.
      </p>
    </div>
  );
}

/* ── projects ───────────────────────────────────────────────────────────── */

function ProjectsForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<CV["projects"][number]>) =>
    onChange({
      ...cv,
      projects: cv.projects.map((project) => (project.id === id ? { ...project, ...update } : project)),
    });

  return (
    <div className="space-y-3">
      {cv.projects.map((project) => (
        <div key={project.id} className="rounded-xl border border-line bg-card p-3.5">
          <div className="mb-3 flex items-start justify-between gap-2">
            <p className="text-[12px] font-medium text-ink">{project.name || "Untitled project"}</p>
            <button
              type="button"
              aria-label="Remove this project"
              onClick={() => onChange({ ...cv, projects: cv.projects.filter((item) => item.id !== project.id) })}
              className="rounded-md p-1.5 text-muted transition-colors hover:text-[hsl(var(--danger))]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Project name">
                <Input value={project.name} onChange={(event) => patch(project.id, { name: event.target.value })} placeholder="Care pathways" />
              </Field>
              <Field label="Your role">
                <Input value={project.role} onChange={(event) => patch(project.id, { role: event.target.value })} placeholder="Lead designer" />
              </Field>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Year">
                <Input value={project.year} onChange={(event) => patch(project.id, { year: event.target.value })} placeholder="2023" />
              </Field>
              <Field label="Link" hint="Optional">
                <Input value={project.link} onChange={(event) => patch(project.id, { link: event.target.value })} placeholder="casestudy.com/care" />
              </Field>
            </div>
            <Field label="Summary">
              <Textarea value={project.summary} onChange={(event) => patch(project.id, { summary: event.target.value })} className="min-h-[64px] text-[12px]" placeholder="What the project was, and what it changed." />
            </Field>
            <div>
              <p className="eyebrow mb-1.5 text-[9px]">Detail</p>
              <BulletsEditor items={project.bullets} onChange={(bullets) => patch(project.id, { bullets })} addLabel="Add detail" />
            </div>
            <Field label="Tags" hint="Comma separated">
              <ChipInput values={project.tags} onChange={(tags) => patch(project.id, { tags })} placeholder="Healthcare, Service design" />
            </Field>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            ...cv,
            projects: [
              ...cv.projects,
              { id: uid("prj"), name: "", role: "", year: "", link: "", summary: "", bullets: [""], tags: [] },
            ],
          })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add a project
      </button>
    </div>
  );
}

/* ── certifications ─────────────────────────────────────────────────────── */

function CertificationsForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<CV["certifications"][number]>) =>
    onChange({
      ...cv,
      certifications: cv.certifications.map((item) => (item.id === id ? { ...item, ...update } : item)),
    });

  return (
    <div className="space-y-3">
      {cv.certifications.map((item) => (
        <div key={item.id} className="rounded-xl border border-line bg-card p-3.5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-[12px] font-medium text-ink">{item.name || "Untitled credential"}</p>
            <button
              type="button"
              aria-label="Remove this certification"
              onClick={() => onChange({ ...cv, certifications: cv.certifications.filter((entry) => entry.id !== item.id) })}
              className="rounded-md p-1.5 text-muted transition-colors hover:text-[hsl(var(--danger))]"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            <Field label="Credential">
              <Input value={item.name} onChange={(event) => patch(item.id, { name: event.target.value })} placeholder="NN/g UX Certification" />
            </Field>
            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Issuer">
                <Input value={item.issuer} onChange={(event) => patch(item.id, { issuer: event.target.value })} placeholder="Nielsen Norman Group" />
              </Field>
              <Field label="Year">
                <Input value={item.year} onChange={(event) => patch(item.id, { year: event.target.value })} placeholder="2021" />
              </Field>
              <Field label="Link" hint="Optional">
                <Input value={item.link} onChange={(event) => patch(item.id, { link: event.target.value })} placeholder="Verify link" />
              </Field>
            </div>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange({
            ...cv,
            certifications: [
              ...cv.certifications,
              { id: uid("crt"), name: "", issuer: "", year: "", link: "" },
            ],
          })
        }
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add a credential
      </button>
      <p className="text-[10.5px] leading-relaxed text-muted">
        Only list credentials you can produce on request. A certificate without an issuer is a
        question waiting to be asked.
      </p>
    </div>
  );
}

/* ── languages ──────────────────────────────────────────────────────────── */

const LEVELS = ["Native", "Fluent", "Professional", "Conversational", "Basic"];

function LanguagesForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const patch = (id: string, update: Partial<CV["languages"][number]>) =>
    onChange({
      ...cv,
      languages: cv.languages.map((item) => (item.id === id ? { ...item, ...update } : item)),
    });

  return (
    <div className="space-y-2.5">
      {cv.languages.map((item) => (
        <div key={item.id} className="flex items-end gap-2">
          <Field label="Language" className="flex-1">
            <Input value={item.name} onChange={(event) => patch(item.id, { name: event.target.value })} placeholder="English" />
          </Field>
          <Field label="Fluency" className="w-[150px]">
            <Select value={item.level} onChange={(event) => patch(item.id, { level: event.target.value })}>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          </Field>
          <button
            type="button"
            aria-label="Remove this language"
            onClick={() => onChange({ ...cv, languages: cv.languages.filter((entry) => entry.id !== item.id) })}
            className="mb-1 rounded-md p-2 text-muted transition-colors hover:text-[hsl(var(--danger))]"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange({ ...cv, languages: [...cv.languages, { id: uid("lng"), name: "", level: "Fluent" }] })}
        className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-line bg-surface/40 py-2.5 text-[11.5px] font-medium text-muted transition-colors hover:border-accent/40 hover:text-ink"
      >
        <Plus className="h-3.5 w-3.5" /> Add a language
      </button>
    </div>
  );
}

/* ── achievements ───────────────────────────────────────────────────────── */

function AchievementsForm({ cv, onChange }: { cv: CV; onChange: (next: CV) => void }) {
  const [preview, setPreview] = useState<{ source: string; text: string } | null>(null);

  return (
    <div className="space-y-3">
      <BulletsEditor
        items={cv.achievements}
        onChange={(achievements) => onChange({ ...cv, achievements })}
        placeholder="A short proof point, with a number if you have one."
        addLabel="Add achievement"
      />

      {cv.achievements.filter(Boolean).length ? (
        <div className="rounded-lg border border-line bg-surface/60 p-3">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow text-[8.5px]">Tighten the wording</p>
            <button
              type="button"
              onClick={() => {
                const source = cv.achievements.find(Boolean);
                if (!source) return;
                setPreview({ source, text: rewriteBullet(source)[0]?.text ?? source });
              }}
              className="inline-flex items-center gap-1 text-[10.5px] font-medium text-accent-ink"
            >
              <Sparkles className="h-3 w-3" /> Suggest
            </button>
          </div>
          {preview ? (
            <div className="mt-2 space-y-1.5">
              <p className="text-[11px] text-muted line-through decoration-[hsl(var(--danger))]/40">
                {preview.source}
              </p>
              <p className="text-[11.5px] text-ink">{preview.text}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...cv,
                      achievements: cv.achievements.map((item) =>
                        item === preview.source ? preview.text : item,
                      ),
                    });
                    setPreview(null);
                  }}
                  className="rounded-md bg-[hsl(var(--accent))] px-2 py-1 text-[10px] font-medium text-[hsl(var(--paper))]"
                >
                  Use it
                </button>
                <button
                  type="button"
                  onClick={() => setPreview(null)}
                  className="rounded-md px-2 py-1 text-[10px] text-muted hover:text-ink"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
              The suggestion only removes filler and strengthens the verb.
            </p>
          )}
        </div>
      ) : null}
    </div>
  );
}

/** Used by the empty state in the studio to seed a new CV. */
export function starterCv(cv: CV): CV {
  return newCv(
    {
      contact: cv.contact,
      summary: cv.summary,
      bio: "",
      goals: "",
      experience: cv.experience,
      education: cv.education,
      skills: cv.skills,
      projects: cv.projects,
      certifications: cv.certifications,
      languages: cv.languages,
      achievements: cv.achievements,
      updatedAt: new Date().toISOString(),
    },
    { title: cv.title || "New CV" },
  );
}
