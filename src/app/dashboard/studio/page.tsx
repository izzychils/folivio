"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  FileText,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, Card, EmptyState, Meter, Modal, Tabs } from "@/components/ui/surface";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { CvThumbnail } from "@/components/cv/preview";
import { atsReport, parseResumeText } from "@/lib/intelligence";
import { cvCompleteness, duplicateCv, newCv } from "@/lib/cv";
import { CV_ACCENTS, CV_TEMPLATES, TEMPLATE_BY_ID } from "@/lib/templates";
import type { CV, TemplateId } from "@/lib/types";
import { relativeTime, uid } from "@/lib/utils";

export default function StudioPage() {
  const { workspace, update } = useWorkspace();
  const { toast } = useToast();
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [templateFilter, setTemplateFilter] = useState<"all" | TemplateId>("all");
  const [newOpen, setNewOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<CV | null>(null);

  const [title, setTitle] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [targetCompany, setTargetCompany] = useState("");
  const [template, setTemplate] = useState<TemplateId>("modern");
  const [accent, setAccent] = useState("#1D5C45");

  const [importText, setImportText] = useState("");
  const [importError, setImportError] = useState("");
  const [importTab, setImportTab] = useState<"paste" | "file">("paste");

  const cvs = workspace?.cvs ?? [];

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return cvs.filter((cv) => {
      const matchesTemplate = templateFilter === "all" || cv.design.template === templateFilter;
      const haystack = `${cv.title} ${cv.targetRole} ${cv.targetCompany}`.toLowerCase();
      return matchesTemplate && (!needle || haystack.includes(needle));
    });
  }, [cvs, query, templateFilter]);

  const openNew = () => {
    setTitle(targetRole ? `${targetRole} CV` : "");
    setTemplate(workspace?.settings.defaultTemplate ?? "modern");
    setAccent(workspace?.settings.defaultAccent ?? "#1D5C45");
    setNewOpen(true);
  };

  const createCv = () => {
    if (!workspace) return;
    const cv = newCv(workspace.profile, {
      title: title.trim() || (targetRole.trim() ? `${targetRole.trim()} CV` : "Untitled CV"),
      targetRole: targetRole.trim(),
      targetCompany: targetCompany.trim(),
      template,
      accent,
    });
    update((state) => ({
      ...state,
      cvs: [cv, ...state.cvs],
      activity: [
        { id: uid("act"), kind: "cv.created" as const, text: `Created ${cv.title}`, at: new Date().toISOString() },
        ...state.activity,
      ].slice(0, 30),
    }));
    setNewOpen(false);
    toast({ title: "CV created", description: "Start with the target role, then fill the history.", tone: "success" });
    router.push(`/studio/${cv.id}`);
  };

  const runImport = () => {
    if (!workspace) return;
    if (importText.trim().length < 80) {
      setImportError("Paste a little more. At least a few sections and one role are needed to structure a document.");
      return;
    }
    const parsed = parseResumeText(importText);
    if (!parsed.experience.length && !parsed.summary) {
      setImportError("No sections were recognised. Include headings such as Experience, Education and Skills.");
      return;
    }
    const cv = newCv(workspace.profile, {
      title: "Imported CV",
      targetRole: "",
      template: "classic",
    });
    cv.contact = {
      ...cv.contact,
      ...Object.fromEntries(Object.entries(parsed.contact).filter(([, value]) => Boolean(value))),
    };
    if (parsed.summary) cv.summary = parsed.summary;
    if (parsed.experience.length) {
      cv.experience = parsed.experience.map((role) => ({ ...role, id: uid("exp") }));
    }
    if (parsed.education.length) {
      cv.education = parsed.education.map((item) => ({ ...item, id: uid("edu") }));
    }
    if (parsed.skills.length) {
      cv.skills = parsed.skills.map((group) => ({ ...group, id: uid("skl") }));
    }
    if (parsed.projects.length) {
      cv.projects = [
        {
          id: uid("prj"),
          name: "Imported projects",
          role: "",
          year: "",
          link: "",
          summary: parsed.projects.join(" ").slice(0, 320),
          bullets: [],
          tags: [],
        },
      ];
    }
    update((state) => ({
      ...state,
      cvs: [cv, ...state.cvs],
      activity: [
        { id: uid("act"), kind: "cv.created" as const, text: "Imported an existing CV", at: new Date().toISOString() },
        ...state.activity,
      ].slice(0, 30),
    }));
    setImportOpen(false);
    setImportText("");
    setImportError("");
    toast({ title: "CV imported", description: "Check the parsed sections, then correct anything the parser missed.", tone: "success" });
    router.push(`/studio/${cv.id}`);
  };

  const handleFile = async (file: File) => {
    if (file.size > 400_000) {
      setImportError("That file is larger than 400KB. Paste the text instead.");
      return;
    }
    const text = await file.text();
    setImportText(text);
    setImportError("");
    setImportTab("paste");
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">The studio</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">One career, several cases.</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            Each version is a separate document with its own target, style and history. Tailoring one
            never changes the others.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => setImportOpen(true)}>
            <Upload className="h-3.5 w-3.5" /> Import a CV
          </Button>
          <Button onClick={openNew}>
            <Plus className="h-3.5 w-3.5" /> New CV
          </Button>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[190px] flex-1 sm:max-w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, role or company"
            className="pl-9"
            aria-label="Search CVs"
          />
        </div>
        <Select
          value={templateFilter}
          onChange={(event) => setTemplateFilter(event.target.value as "all" | TemplateId)}
          className="w-[168px]"
          aria-label="Filter by style"
        >
          <option value="all">All styles</option>
          {CV_TEMPLATES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </Select>
        <span className="ml-auto text-[11px] text-muted">
          {filtered.length} of {cvs.length} documents
        </span>
      </div>

      {cvs.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={FileText}
            title="Your studio is empty"
            description="Create a version from your career profile, or paste an existing CV and let Folivio structure it. Nothing is uploaded."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button onClick={openNew}>
                  <Plus className="h-3.5 w-3.5" /> Create a CV
                </Button>
                <Button variant="secondary" onClick={() => setImportOpen(true)}>
                  <Upload className="h-3.5 w-3.5" /> Import
                </Button>
              </div>
            }
            className="py-16"
          />
          {workspace ? (
            <Card className="mx-auto mt-4 max-w-xl">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[12.5px] font-medium text-ink">Start from your profile instead</p>
                  <p className="mt-1 text-[11.5px] leading-relaxed text-muted">
                    {workspace.profile.experience.length
                      ? `Your profile has ${workspace.profile.experience.length} roles, ${workspace.profile.skills.length} skill groups and ${workspace.profile.projects.length} projects. A new CV will use them as the source.`
                      : "Fill in the career profile first and every CV you make afterwards starts with real content."}
                  </p>
                  <Link href="/dashboard/profile" className="mt-2 inline-flex items-center gap-1 text-[11px] font-medium text-accent-ink">
                    Open the career profile <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Search}
          title="Nothing matches that search"
          description="Try a different word, or clear the style filter."
          action={
            <Button
              variant="secondary"
              onClick={() => {
                setQuery("");
                setTemplateFilter("all");
              }}
            >
              Clear filters
            </Button>
          }
          className="mt-8"
        />
      ) : (
        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((cv) => {
            const report = atsReport(cv);
            const completeness = cvCompleteness(cv);
            return (
              <Card key={cv.id} padded={false} className="group overflow-hidden hover-lift">
                <div className="relative flex justify-center bg-[hsl(var(--surface))] px-4 py-4">
                  <Link
                    href={`/studio/${cv.id}`}
                    className="block overflow-hidden rounded-[3px] border border-line bg-white shadow-[0_10px_24px_-16px_rgb(0_0_0/0.4)]"
                    aria-label={`Open ${cv.title}`}
                  >
                    <CvThumbnail cv={cv} width={196} />
                  </Link>
                  <div className="absolute right-2.5 top-2.5 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
                    <button
                      type="button"
                      title="Duplicate"
                      aria-label="Duplicate this CV"
                      onClick={() => {
                        const copy = duplicateCv(cv);
                        update((state) => ({
                          ...state,
                          cvs: [copy, ...state.cvs],
                          activity: [
                            { id: uid("act"), kind: "cv.duplicated" as const, text: `Duplicated ${cv.title}`, at: new Date().toISOString() },
                            ...state.activity,
                          ].slice(0, 30),
                        }));
                        toast({ title: "Version duplicated", tone: "success" });
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-card/95 text-muted shadow-sm backdrop-blur transition-colors hover:text-ink"
                    >
                      <Copy className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      aria-label="Delete this CV"
                      onClick={() => setDeleteTarget(cv)}
                      className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-card/95 text-muted shadow-sm backdrop-blur transition-colors hover:text-[hsl(var(--danger))]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>

                <div className="border-t border-line p-3.5">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/studio/${cv.id}`} className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-ink">{cv.title}</p>
                      <p className="mt-0.5 truncate text-[11px] text-muted">
                        {cv.targetRole || "No target role"}
                        {cv.targetCompany ? ` at ${cv.targetCompany}` : ""}
                      </p>
                    </Link>
                    <Badge tone="outline">{TEMPLATE_BY_ID[cv.design.template].name}</Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-baseline justify-between">
                        <span className="eyebrow text-[8px]">Readiness</span>
                        <span className="num text-[10px] text-muted">{completeness.pct}%</span>
                      </div>
                      <Meter value={completeness.pct} />
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="num text-[15px] font-medium leading-none text-ink">{report.score}</p>
                      <p className="eyebrow text-[7.5px]">ATS</p>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between border-t border-line-soft pt-2.5">
                    <span className="text-[10px] text-muted">Edited {relativeTime(cv.updatedAt)}</span>
                    <Link
                      href={`/studio/${cv.id}`}
                      className="inline-flex items-center gap-1 text-[10.5px] font-medium text-accent-ink"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        open={newOpen}
        onClose={() => setNewOpen(false)}
        title="Create a CV"
        description="A new document, seeded from your career profile and set up for one target."
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setNewOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={createCv}>
              Create CV
            </Button>
          </>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Document title">
            <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Senior Product Designer, health" />
          </Field>
          <Field label="Target role">
            <Input value={targetRole} onChange={(event) => setTargetRole(event.target.value)} placeholder="Senior Product Designer" />
          </Field>
          <Field label="Target company" hint="Optional">
            <Input value={targetCompany} onChange={(event) => setTargetCompany(event.target.value)} placeholder="Lumen Health" />
          </Field>
          <Field label="Accent">
            <div className="flex h-[42px] items-center gap-1.5">
              {CV_ACCENTS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  title={item.name}
                  aria-label={item.name}
                  onClick={() => setAccent(item.value)}
                  className={`flex h-6 w-6 items-center justify-center rounded-full border-2 ${accent === item.value ? "border-ink" : "border-transparent"}`}
                >
                  <span className="h-[17px] w-[17px] rounded-full" style={{ background: item.value }} />
                </button>
              ))}
            </div>
          </Field>
        </div>

        <div className="mt-5">
          <p className="eyebrow mb-2 text-[9px]">Document style</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {CV_TEMPLATES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setTemplate(item.id);
                  setAccent(item.accent);
                }}
                className={`rounded-xl border p-3 text-left transition-colors ${
                  template === item.id
                    ? "border-accent bg-accent-soft/40"
                    : "border-line bg-card hover:border-[hsl(var(--muted))]/40"
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-medium text-ink">{item.name}</p>
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: item.accent }} />
                </div>
                <p className="mt-0.5 text-[10.5px] text-muted">{item.tagline}</p>
                <p className="mt-1 text-[9.5px] text-muted/80">Best for {item.bestFor.toLowerCase()}</p>
              </button>
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        title="Import an existing CV"
        description="Paste the text or load a .txt file. Folivio reads headings, roles, dates and skills, then you correct what it missed."
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setImportOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={runImport}>
              Parse and create
            </Button>
          </>
        }
      >
        <Tabs
          value={importTab}
          onChange={setImportTab}
          tabs={[
            { id: "paste", label: "Paste text" },
            { id: "file", label: "Load a file" },
          ]}
          className="mb-3"
        />

        {importTab === "paste" ? (
          <Textarea
            value={importText}
            onChange={(event) => {
              setImportText(event.target.value);
              setImportError("");
            }}
            placeholder={`Amara Okonkwo\namara@example.com\n\nEXPERIENCE\nSenior Product Designer, Meridian Health\nMar 2022 - Present\n- Led the onboarding redesign, cutting drop-off from 41% to 18%\n\nEDUCATION\nBSc Human Computer Interaction, Covenant University, 2017`}
            className="min-h-[240px] font-mono text-[11px] leading-relaxed"
          />
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-line bg-surface/50 px-6 py-12 text-center transition-colors hover:border-accent/40">
            <Upload className="h-5 w-5 text-muted" />
            <span className="mt-2 text-[12.5px] font-medium text-ink">Choose a text file</span>
            <span className="mt-1 text-[11px] text-muted">.txt or .md, up to 400KB</span>
            <input
              type="file"
              accept=".txt,.md,text/plain,text/markdown"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleFile(file);
              }}
            />
          </label>
        )}

        {importError ? (
          <p className="mt-2 text-[11px] text-[hsl(var(--danger))]">{importError}</p>
        ) : null}

        <div className="mt-3 rounded-lg border border-line bg-surface/60 p-3">
          <p className="text-[10.5px] leading-relaxed text-muted">
            Parsing is a starting point, not a promise. Check every date and title afterwards. PDF
            and Word import arrive with the backend.
          </p>
        </div>
      </Modal>

      <Modal
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Delete this CV?"
        description={deleteTarget ? `"${deleteTarget.title}" and its saved versions will be removed from this browser.` : undefined}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>
              Keep it
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (!deleteTarget) return;
                update((state) => ({
                  ...state,
                  cvs: state.cvs.filter((item) => item.id !== deleteTarget.id),
                }));
                toast({ title: "CV deleted" });
                setDeleteTarget(null);
              }}
            >
              Delete CV
            </Button>
          </>
        }
      />

    </div>
  );
}
