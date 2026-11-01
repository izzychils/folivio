"use client";

import { useEffect, useMemo, useRef, useState, useDeferredValue } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  Download,
  FileCode,
  FileText,
  History,
  MoreHorizontal,
  Palette,
  ShieldCheck,
  Sparkles,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, IconButton, Modal, Meter, ScoreRing, Tabs } from "@/components/ui/surface";
import { CvPreview } from "@/components/cv/preview";
import { SectionForm, SECTIONS, sectionComplete, type SectionId } from "./sections";
import { atsReport, qualityNotes, suggestDesign } from "@/lib/intelligence";
import { applyVersion, cvCompleteness, cvFilename, cvPlainText, cvToHtmlDocument, duplicateCv, snapshotVersion, stripCv } from "@/lib/cv";
import { CV_ACCENTS, CV_FONTS, CV_TEMPLATES, TEMPLATE_BY_ID } from "@/lib/templates";
import type { CV, TemplateId } from "@/lib/types";
import { cn, downloadFile, relativeTime, wordCount } from "@/lib/utils";

type Panel = "preview" | "design" | "checks";

export function CvEditor({ cvId }: { cvId: string }) {
  const { workspace, ready, update } = useWorkspace();
  const router = useRouter();
  const { toast } = useToast();

  const stored = workspace?.cvs.find((item) => item.id === cvId) ?? null;
  const [draft, setDraft] = useState<CV | null>(null);
  const [section, setSection] = useState<SectionId>("target");
  const [panel, setPanel] = useState<Panel>("preview");
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  const [menuOpen, setMenuOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<{ rationale: string; design: Partial<CV["design"]> } | null>(null);
  const loadedId = useRef<string | null>(null);

  useEffect(() => {
    if (stored && loadedId.current !== stored.id) {
      loadedId.current = stored.id;
      setDraft(stored);
    }
  }, [stored]);

  useEffect(() => {
    if (!draft || !update) return;
    const current = workspace?.cvs.find((item) => item.id === draft.id);
    if (!current) return;
    const dirty = JSON.stringify(stripCv(current)) !== JSON.stringify(stripCv(draft));
    if (!dirty) return;
    const timer = setTimeout(() => {
      const stamp = new Date().toISOString();
      update((state) => ({
        ...state,
        cvs: state.cvs.map((item) => (item.id === draft.id ? { ...draft, updatedAt: stamp } : item)),
      }));
      setDraft((current) =>
        current && current.id === draft.id ? { ...current, updatedAt: stamp } : current,
      );
    }, 500);
    return () => clearTimeout(timer);
  }, [draft, workspace, update]);

  const deferred = useDeferredValue(draft);
  const report = useMemo(() => (deferred ? atsReport(deferred) : null), [deferred]);
  const completeness = useMemo(() => (draft ? cvCompleteness(draft) : null), [draft]);
  const dirty = Boolean(
    draft &&
      stored &&
      JSON.stringify(stripCv(stored)) !== JSON.stringify(stripCv(draft)),
  );

  if (!ready) return <EditorSkeleton />;

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-paper px-6">
        <div className="max-w-sm text-center">
          <p className="eyebrow mb-2">Not found</p>
          <h1 className="display text-[30px]">That document is not in this workspace.</h1>
          <p className="mt-2 text-[12.5px] text-muted">
            It may have been deleted in another tab. Your other versions are still in the studio.
          </p>
          <Link href="/dashboard/studio" className={buttonClass("primary", "md", "mt-5")}>
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the studio
          </Link>
        </div>
      </div>
    );
  }

  const patch = (partial: Partial<CV>) => setDraft((current) => (current ? { ...current, ...partial } : current));
  const template = TEMPLATE_BY_ID[draft.design.template];

  const flushForPrint = () => {
    update((state) => ({
      ...state,
      cvs: state.cvs.map((item) =>
        item.id === draft.id ? { ...draft, updatedAt: new Date().toISOString() } : item,
      ),
    }));
    try {
      window.localStorage.setItem(`folivio.v1.print.${draft.id}`, JSON.stringify(draft));
    } catch {
      /* storage may be full, the print route can read the saved CV instead */
    }
    window.open(`/print/cv/${draft.id}?auto=1`, "_blank", "noopener,noreferrer");
    toast({
      title: "Opening the print view",
      description: "Choose Save as PDF in the print dialog to keep a copy.",
    });
  };

  const saveVersion = () => {
    const version = snapshotVersion(draft, `Saved ${new Date().toLocaleDateString()}`);
    patch({ versions: [version, ...draft.versions].slice(0, 12) });
    toast({ title: "Version saved", description: "You can restore it from the history panel.", tone: "success" });
  };

  const duplicate = () => {
    const copy = duplicateCv(draft);
    update((state) => ({ ...state, cvs: [copy, ...state.cvs] }));
    toast({ title: "Duplicated", description: "A separate version, ready to tailor.", tone: "success" });
    router.push(`/studio/${copy.id}`);
  };

  const remove = () => {
    update((state) => ({ ...state, cvs: state.cvs.filter((item) => item.id !== draft.id) }));
    router.replace("/dashboard/studio");
  };

  const activeSection = SECTIONS.find((item) => item.id === section) ?? SECTIONS[0];

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-paper">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b border-line bg-paper/90 px-3 backdrop-blur-md sm:px-4">
        <div className="flex min-w-0 items-center gap-2">
          <Link
            href="/dashboard/studio"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:text-ink"
            aria-label="Back to the studio"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div className="min-w-0">
            <input
              value={draft.title}
              onChange={(event) => patch({ title: event.target.value })}
              aria-label="Document title"
              className="w-full min-w-0 max-w-[240px] truncate border-0 bg-transparent p-0 text-[13px] font-medium text-ink focus:outline-none sm:max-w-[320px]"
            />
            <div className="flex items-center gap-1.5">
              <span className={cn("h-1.5 w-1.5 rounded-full", dirty ? "bg-[hsl(var(--warning))]" : "bg-accent")} />
              <p className="text-[10px] text-muted">
                {dirty ? "Saving changes" : `Saved ${relativeTime(draft.updatedAt)}`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="mr-1 hidden items-center gap-1.5 lg:flex">
            <Badge tone="outline">{template.name}</Badge>
            <Badge tone="outline">{completeness?.pct ?? 0}% complete</Badge>
          </div>
          <IconButton label="Version history" onClick={() => setHistoryOpen(true)}>
            <History className="h-3.5 w-3.5" />
          </IconButton>
          <Button size="sm" onClick={flushForPrint} className="hidden sm:inline-flex">
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Button>
          <div className="relative">
            <IconButton label="More actions" onClick={() => setMenuOpen((open) => !open)} active={menuOpen}>
              <MoreHorizontal className="h-4 w-4" />
            </IconButton>
            {menuOpen ? (
              <>
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMenuOpen(false)}
                  className="fixed inset-0 z-[60] cursor-default"
                />
                <div className="absolute right-0 top-9 z-[70] w-[224px] rounded-xl border border-line bg-card p-1.5 shadow-[var(--shadow-lg)] animate-[rise_150ms_ease_both]">
                  <MenuItem
                    icon={Download}
                    label="Download PDF"
                    onClick={() => {
                      setMenuOpen(false);
                      flushForPrint();
                    }}
                  />
                  <MenuItem
                    icon={FileCode}
                    label="Download HTML"
                    onClick={() => {
                      setMenuOpen(false);
                      downloadFile(cvFilename(draft, "html"), cvToHtmlDocument(draft), "text/html");
                    }}
                  />
                  <MenuItem
                    icon={FileText}
                    label="Copy plain text"
                    onClick={async () => {
                      setMenuOpen(false);
                      await navigator.clipboard.writeText(cvPlainText(draft));
                      toast({ title: "Document copied as plain text", tone: "success" });
                    }}
                  />
                  <MenuItem
                    icon={History}
                    label="Save a version"
                    onClick={() => {
                      setMenuOpen(false);
                      saveVersion();
                    }}
                  />
                  <MenuItem
                    icon={Copy}
                    label="Duplicate"
                    onClick={() => {
                      setMenuOpen(false);
                      duplicate();
                    }}
                  />
                  <div className="my-1 h-px bg-line" />
                  <MenuItem
                    icon={Trash2}
                    label="Delete this CV"
                    destructive
                    onClick={() => {
                      setMenuOpen(false);
                      setDeleteOpen(true);
                    }}
                  />
                </div>
              </>
            ) : null}
          </div>
          <Button size="sm" className="sm:hidden" onClick={flushForPrint} aria-label="Download PDF">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </header>

      <div className="flex items-center gap-1 border-b border-line bg-surface/60 px-3 py-1.5 xl:hidden">
        <button
          type="button"
          onClick={() => setMobileView("edit")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-[11.5px] font-medium transition-colors",
            mobileView === "edit" ? "bg-card text-ink shadow-sm" : "text-muted",
          )}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setMobileView("preview")}
          className={cn(
            "flex-1 rounded-md py-1.5 text-[11.5px] font-medium transition-colors",
            mobileView === "preview" ? "bg-card text-ink shadow-sm" : "text-muted",
          )}
        >
          Preview and checks
        </button>
      </div>

      <div className="flex min-h-0 flex-1 overflow-hidden">
        <aside className="hidden w-[206px] shrink-0 flex-col border-r border-line bg-surface/40 xl:flex">
          <div className="flex-1 overflow-y-auto p-2.5">
            <p className="eyebrow px-2 pb-2 pt-1 text-[8.5px]">Content</p>
            <ul className="space-y-0.5">
              {SECTIONS.map((item) => {
                const Icon = item.icon;
                const done = sectionComplete(draft, item.id);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setSection(item.id)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] transition-colors",
                        section === item.id
                          ? "bg-accent-soft font-medium text-accent-ink"
                          : "text-muted hover:bg-card hover:text-ink",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.7} />
                      <span className="flex-1 truncate">{item.label}</span>
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          done ? "bg-accent/70" : "bg-line",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <p className="eyebrow px-2 pb-2 pt-5 text-[8.5px]">Presentation</p>
            <button
              type="button"
              onClick={() => setPanel("design")}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] transition-colors",
                panel === "design" ? "bg-accent-soft font-medium text-accent-ink" : "text-muted hover:bg-card hover:text-ink",
              )}
            >
              <Palette className="h-3.5 w-3.5" /> Design
            </button>
            <button
              type="button"
              onClick={() => setPanel("checks")}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[12px] transition-colors",
                panel === "checks" ? "bg-accent-soft font-medium text-accent-ink" : "text-muted hover:bg-card hover:text-ink",
              )}
            >
              <ShieldCheck className="h-3.5 w-3.5" /> Checks
              <span className="ml-auto num text-[10px]">{report?.score ?? 0}</span>
            </button>
          </div>

          <div className="border-t border-line p-3">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-[8.5px]">Completeness</span>
              <span className="num text-[11px] text-ink">{completeness?.pct ?? 0}%</span>
            </div>
            <Meter value={completeness?.pct ?? 0} className="mt-2" />
            <p className="mt-2 text-[10px] leading-snug text-muted">
              {completeness?.missing[0] ? `Next: ${completeness.missing[0].toLowerCase()}` : "Every section is present."}
            </p>
          </div>
        </aside>

        <section
          className={cn(
            "min-w-0 flex-1 overflow-y-auto",
            mobileView === "preview" ? "hidden xl:block" : "block",
          )}
        >
          <div className="mx-auto w-full max-w-[560px] px-4 py-5 sm:px-6">
            <div className="mb-4 xl:hidden">
              <div className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto pb-1">
                {SECTIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSection(item.id)}
                    className={cn(
                      "shrink-0 rounded-full border px-2.5 py-1 text-[10.5px] transition-colors",
                      section === item.id
                        ? "border-transparent bg-accent-soft text-accent-ink"
                        : "border-line bg-card text-muted",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="eyebrow mb-1 text-[8.5px]">
                  Section {String(SECTIONS.findIndex((item) => item.id === section) + 1).padStart(2, "0")}
                </p>
                <h1 className="text-[19px] font-medium tracking-[-0.02em] text-ink">{activeSection.label}</h1>
                <p className="mt-0.5 text-[11.5px] text-muted">{activeSection.description}</p>
              </div>
              <span className="hidden shrink-0 items-center gap-1 rounded-md border border-line bg-surface px-2 py-1 text-[9.5px] text-muted sm:inline-flex">
                <span className={cn("h-1.5 w-1.5 rounded-full", dirty ? "bg-[hsl(var(--warning))]" : "bg-accent")} />
                {dirty ? "Unsaved" : "Saved"}
              </span>
            </div>

            <SectionForm section={section} cv={draft} onChange={setDraft} />

            <div className="mt-6 flex items-center justify-between gap-2 border-t border-line pt-4">
              <button
                type="button"
                onClick={() => {
                  const index = SECTIONS.findIndex((item) => item.id === section);
                  if (index > 0) setSection(SECTIONS[index - 1].id);
                }}
                className="inline-flex items-center gap-1 text-[11.5px] text-muted transition-colors hover:text-ink"
              >
                <ArrowLeft className="h-3 w-3" /> Previous
              </button>
              <button
                type="button"
                onClick={() => {
                  const index = SECTIONS.findIndex((item) => item.id === section);
                  if (index < SECTIONS.length - 1) {
                    setSection(SECTIONS[index + 1].id);
                  } else {
                    setPanel("checks");
                    setMobileView("preview");
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md bg-accent-soft px-2.5 py-1.5 text-[11.5px] font-medium text-accent-ink transition-colors hover:bg-accent/15"
              >
                {section === SECTIONS[SECTIONS.length - 1].id ? "Review the checks" : "Next section"}
                <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        </section>

        <aside
          className={cn(
            "min-w-0 flex-1 flex-col border-l border-line bg-surface/40 xl:flex xl:w-[46%] xl:max-w-none xl:flex-none",
            mobileView === "preview" ? "flex" : "hidden",
          )}
        >
          <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-b border-line px-3">
            <Tabs
              size="sm"
              value={panel}
              onChange={(value) => setPanel(value)}
              tabs={[
                { id: "preview", label: "Preview" },
                { id: "design", label: "Design" },
                { id: "checks", label: "Checks", count: report?.score },
              ]}
            />
            <div className="hidden items-center gap-1.5 sm:flex">
              <Badge tone="outline">{draft.design.density}</Badge>
              <span className="font-mono text-[9px] text-muted">A4</span>
            </div>
          </div>

          {panel === "preview" ? (
            <div className="min-h-0 flex-1">
              <CvPreview cv={draft} padding={20} />
            </div>
          ) : null}

          {panel === "design" ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <DesignPanel
                cv={draft}
                onChange={patch}
                recommendation={recommendation}
                onRecommend={() => setRecommendation(suggestDesign(draft.targetRole || draft.contact.headline))}
                onDismissRecommendation={() => setRecommendation(null)}
              />
            </div>
          ) : null}

          {panel === "checks" ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
              <ChecksPanel cv={deferred ?? draft} report={report} cvId={draft.id} />
            </div>
          ) : null}
        </aside>
      </div>

      <Modal
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        title="Version history"
        description="Snapshots you save stay with this document. Restoring keeps the current one in the list."
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setHistoryOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                saveVersion();
                setHistoryOpen(false);
              }}
            >
              Save a version now
            </Button>
          </>
        }
      >
        {draft.versions.length === 0 ? (
          <p className="text-[12.5px] leading-relaxed text-muted">
            No saved versions yet. Save one before a large rewrite, then you can compare and return
            to it.
          </p>
        ) : (
          <ul className="divide-y divide-[hsl(var(--line-soft))]">
            {draft.versions.map((version) => (
              <li key={version.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-[12.5px] text-ink">{version.label}</p>
                  <p className="text-[10.5px] text-muted">
                    {new Date(version.at).toLocaleString()} · {wordCount(version.document.summary)} word profile
                  </p>
                </div>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setDraft(applyVersion(draft, version));
                    setHistoryOpen(false);
                    toast({ title: "Version restored", tone: "success" });
                  }}
                >
                  Restore
                </Button>
              </li>
            ))}
          </ul>
        )}
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this CV?"
        description="This removes the document and its saved versions from this browser. Your career profile is not affected."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(false)}>
              Keep it
            </Button>
            <Button variant="danger" size="sm" onClick={remove}>
              Delete CV
            </Button>
          </>
        }
      />
    </div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  destructive = false,
}: {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] transition-colors",
        destructive
          ? "text-[hsl(var(--danger))] hover:bg-[hsl(var(--danger))]/8"
          : "text-muted hover:bg-surface hover:text-ink",
      )}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

export function DesignPanel({
  cv,
  onChange,
  recommendation,
  onRecommend,
  onDismissRecommendation,
}: {
  cv: CV;
  onChange: (partial: Partial<CV>) => void;
  recommendation?: { rationale: string; design: Partial<CV["design"]> } | null;
  onRecommend?: () => void;
  onDismissRecommendation?: () => void;
}) {
  const setTemplate = (id: TemplateId) => {
    const meta = TEMPLATE_BY_ID[id];
    onChange({
      design: {
        ...cv.design,
        template: id,
        font: meta.font,
        density: id === "technical" ? "compact" : id === "creative" ? "airy" : "balanced",
      },
    });
  };

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="eyebrow text-[8.5px]">Document style</p>
          <span className="text-[10px] text-muted">{TEMPLATE_BY_ID[cv.design.template].format}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {CV_TEMPLATES.map((template) => {
            const active = template.id === cv.design.template;
            return (
              <button
                key={template.id}
                type="button"
                onClick={() => setTemplate(template.id)}
                className={cn(
                  "group overflow-hidden rounded-lg border text-left transition-colors",
                  active ? "border-accent bg-card" : "border-line bg-card/60 hover:border-[hsl(var(--muted))]/40",
                )}
              >
                <TemplateSketch id={template.id} accent={active ? cv.design.accent : "#6e6c60"} />
                <div className="border-t border-line-soft px-2 py-1.5">
                  <p className={cn("text-[10.5px] font-medium", active ? "text-accent-ink" : "text-ink")}>
                    {template.name}
                  </p>
                  <p className="truncate text-[9px] text-muted">{template.tagline}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2 text-[8.5px]">Accent</p>
        <div className="flex flex-wrap gap-1.5">
          {CV_ACCENTS.map((accent) => (
            <button
              key={accent.value}
              type="button"
              title={accent.name}
              aria-label={accent.name}
              onClick={() => onChange({ design: { ...cv.design, accent: accent.value } })}
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full border-2 transition-transform",
                cv.design.accent === accent.value ? "scale-105 border-ink" : "border-transparent",
              )}
            >
              <span className="h-5 w-5 rounded-full" style={{ background: accent.value }} />
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2 text-[8.5px]">Typeface</p>
        <div className="grid grid-cols-3 gap-1.5">
          {CV_FONTS.map((font) => (
            <button
              key={font.id}
              type="button"
              onClick={() => onChange({ design: { ...cv.design, font: font.id } })}
              className={cn(
                "rounded-lg border px-2 py-2 text-center transition-colors",
                cv.design.font === font.id
                  ? "border-accent bg-card"
                  : "border-line bg-card/60 hover:border-[hsl(var(--muted))]/40",
              )}
            >
              <span
                className="block text-[17px] leading-none text-ink"
                style={{
                  fontFamily:
                    font.id === "editorial"
                      ? "Georgia, serif"
                      : font.id === "technical"
                        ? "var(--font-jetbrains), monospace"
                        : "var(--font-inter), sans-serif",
                }}
              >
                {font.sample}
              </span>
              <span className="mt-1 block text-[9px] text-muted">{font.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="eyebrow mb-2 text-[8.5px]">Spacing</p>
        <div className="inline-flex w-full items-center gap-0.5 rounded-lg border border-line bg-surface p-0.5">
          {(["airy", "balanced", "compact"] as const).map((density) => (
            <button
              key={density}
              type="button"
              onClick={() => onChange({ design: { ...cv.design, density } })}
              className={cn(
                "flex-1 rounded-md py-1.5 text-[10.5px] font-medium capitalize transition-colors",
                cv.design.density === density ? "bg-card text-ink shadow-sm" : "text-muted hover:text-ink",
              )}
            >
              {density}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="eyebrow text-[8.5px]">Visual assistant</p>
          <Sparkles className="h-3 w-3 text-accent" />
        </div>
        {recommendation ? (
          <>
            <p className="mt-2 text-[11.5px] leading-relaxed text-ink">{recommendation.rationale}</p>
            <div className="mt-2.5 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  onChange({ design: { ...cv.design, ...recommendation.design } });
                  onDismissRecommendation?.();
                }}
              >
                Apply
              </Button>
              <Button variant="ghost" size="sm" onClick={onDismissRecommendation}>
                No thanks
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              Based on the target role, the assistant can suggest a layout, accent and type pairing.
            </p>
            <Button variant="secondary" size="sm" className="mt-2.5" onClick={onRecommend}>
              Recommend a style
            </Button>
          </>
        )}
      </div>

      <p className="text-[10px] leading-relaxed text-muted">
        All six styles are single column friendly for parsing. Accents print dark enough to stay
        readable on paper.
      </p>
    </div>
  );
}

function TemplateSketch({ id, accent }: { id: TemplateId; accent: string }) {
  const line = (width: string, opacity = 0.35) => (
    <span className="block h-[2px] rounded-full bg-[hsl(var(--ink))]" style={{ width, opacity }} />
  );

  return (
    <div className="relative h-[76px] w-full overflow-hidden bg-white p-2.5">
      {id === "modern" ? (
        <div className="flex h-full gap-2">
          <div className="w-[34%] rounded-[2px] p-1" style={{ background: `${accent}18` }}>
            <div className="mb-1 h-[5px] w-[80%] rounded-full" style={{ background: accent, opacity: 0.7 }} />
            <div className="space-y-[3px]">
              {[90, 70, 80, 60].map((width) => (
                <span key={width} className="block h-[1.5px] rounded-full" style={{ width: `${width}%`, background: accent, opacity: 0.28 }} />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-[4px] pt-0.5">
            {line("55%")}
            {line("100%", 0.16)}
            {line("92%", 0.16)}
            {line("70%", 0.16)}
            {line("45%", 0.5)}
            {line("100%", 0.16)}
          </div>
        </div>
      ) : null}
      {id === "classic" ? (
        <div className="flex h-full flex-col items-center gap-[4px] pt-0.5">
          <div className="h-[5px] w-[46%] rounded-full" style={{ background: accent, opacity: 0.8 }} />
          <span className="h-[1.5px] w-[30%] rounded-full bg-[hsl(var(--ink))]" style={{ opacity: 0.3 }} />
          <span className="my-[2px] block h-px w-full" style={{ background: accent, opacity: 0.5 }} />
          <div className="w-full space-y-[4px]">
            {line("38%", 0.55)}
            {line("100%", 0.16)}
            {line("94%", 0.16)}
            {line("34%", 0.55)}
            {line("100%", 0.16)}
          </div>
        </div>
      ) : null}
      {id === "executive" ? (
        <div className="flex h-full flex-col gap-[4px]">
          <div className="flex items-end justify-between border-b pb-1.5" style={{ borderColor: accent }}>
            <div className="h-[6px] w-[44%] rounded-full" style={{ background: accent, opacity: 0.85 }} />
            <div className="w-[24%] space-y-[2px]">
              {[100, 80, 90].map((width) => (
                <span key={width} className="block h-[1px] rounded-full bg-[hsl(var(--ink))]" style={{ width: `${width}%`, opacity: 0.25 }} />
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <span className="block w-[2px]" style={{ background: accent }} />
            <div className="flex-1 space-y-[3px]">
              {line("100%", 0.2)}
              {line("88%", 0.2)}
            </div>
          </div>
          <div className="mt-auto space-y-[3px]">
            {line("30%", 0.5)}
            {line("100%", 0.14)}
            {line("76%", 0.14)}
          </div>
        </div>
      ) : null}
      {id === "academic" ? (
        <div className="flex h-full flex-col items-center gap-[3px]">
          <div className="h-[5px] w-[52%] rounded-full" style={{ background: accent, opacity: 0.75 }} />
          <span className="h-[1px] w-[34%] rounded-full bg-[hsl(var(--ink))]" style={{ opacity: 0.25 }} />
          <div className="mt-1 w-full space-y-[3px]">
            {[30, 100, 96, 88, 26, 100, 72].map((width, index) => (
              <span
                key={`${width}-${index}`}
                className="block h-[1.5px] rounded-full bg-[hsl(var(--ink))]"
                style={{ width: `${width}%`, opacity: index === 0 || index === 4 ? 0.5 : 0.16 }}
              />
            ))}
          </div>
        </div>
      ) : null}
      {id === "creative" ? (
        <div className="flex h-full overflow-hidden rounded-[2px]">
          <div className="w-[42%] p-1" style={{ background: accent }}>
            <div className="mb-1 h-[4px] w-[80%] rounded-full bg-white/85" />
            <div className="space-y-[3px]">
              {[70, 90, 60].map((width) => (
                <span key={width} className="block h-[1px] rounded-full bg-white/45" style={{ width: `${width}%` }} />
              ))}
            </div>
            <div className="mt-2 flex gap-[2px]">
              {[0, 1, 2].map((index) => (
                <span key={index} className="h-[8px] w-[12px] rounded-[1px] border border-white/40" />
              ))}
            </div>
          </div>
          <div className="flex-1 space-y-[3px] p-1">
            {line("100%", 0.2)}
            {line("80%", 0.2)}
            <div className="mt-2 space-y-[2px] border border-[hsl(var(--line))] p-1">
              {line("60%", 0.4)}
              {line("90%", 0.14)}
            </div>
          </div>
        </div>
      ) : null}
      {id === "technical" ? (
        <div className="flex h-full flex-col gap-[3px]">
          <div className="flex items-center gap-1">
            <span className="h-[4px] w-[38%] rounded-full" style={{ background: accent, opacity: 0.85 }} />
            <span className="h-[1px] flex-1" style={{ background: accent, opacity: 0.3 }} />
          </div>
          <span className="h-px w-full" style={{ background: accent, opacity: 0.5 }} />
          {[20, 100, 92, 20, 88, 100, 60].map((width, index) => (
            <div key={`${width}-${index}`} className="flex items-center gap-1">
              {[20, 20].includes(width) ? null : (
                <span className="h-[1px] w-[6%] shrink-0" style={{ background: accent, opacity: 0.7 }} />
              )}
              <span
                className="h-[1.5px] rounded-full bg-[hsl(var(--ink))]"
                style={{ width: `${Math.max(width, 22)}%`, opacity: [20].includes(width) ? 0.5 : 0.15 }}
              />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ChecksPanel({
  cv,
  report,
  cvId,
}: {
  cv: CV;
  report: ReturnType<typeof atsReport> | null;
  cvId: string;
}) {
  if (!report) return null;
  const notes = qualityNotes(cv);
  const failed = report.checks.filter((check) => check.status !== "pass");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 rounded-xl border border-line bg-card p-4">
        <ScoreRing value={report.score} size={84} label="ATS" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink">{report.grade}</p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            {report.stats.words} words, {report.stats.bullets} bullets, {report.stats.quantified} with
            numbers.
          </p>
          <p className="mt-1 text-[10.5px] leading-relaxed text-muted">
            A structured document, not a guarantee of an interview.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card">
        <div className="flex items-center justify-between border-b border-line-soft px-3 py-2">
          <p className="eyebrow text-[8.5px]">Checks</p>
          <span className="text-[10px] text-muted">
            {report.checks.length - failed.length} of {report.checks.length} passing
          </span>
        </div>
        <ul className="divide-y divide-[hsl(var(--line-soft))]">
          {report.checks.map((check) => (
            <li key={check.id} className="flex items-start gap-2 px-3 py-2">
              <span
                className={cn(
                  "mt-[2px] flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold",
                  check.status === "pass"
                    ? "bg-accent-soft text-accent"
                    : check.status === "warn"
                      ? "bg-[hsl(var(--warning))]/12 text-[hsl(var(--warning))]"
                      : "bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]",
                )}
              >
                {check.status === "pass" ? <Check className="h-2 w-2" strokeWidth={3} /> : "!"}
              </span>
              <div className="min-w-0">
                <p className="text-[11.5px] font-medium text-ink">{check.label}</p>
                <p className="text-[10.5px] leading-snug text-muted">{check.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-xl border border-line bg-card p-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow text-[8.5px]">
            {cv.jobDescription.trim() ? "Job description terms" : "Role terms"}
          </p>
          <span className="text-[10px] text-muted">
            {report.keywords.filter((keyword) => keyword.matched).length}/{report.keywords.length}
          </span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {report.keywords.slice(0, 18).map((keyword) => (
            <span
              key={keyword.term}
              className={cn(
                "rounded border px-1.5 py-0.5 text-[9.5px]",
                keyword.matched
                  ? "border-transparent bg-accent-soft text-accent-ink"
                  : "border-line bg-surface text-muted",
              )}
            >
              {keyword.term}
            </span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-line bg-card p-3">
        <p className="eyebrow mb-2 text-[8.5px]">Consistency</p>
        <ul className="space-y-1.5">
          {notes.map((note) => (
            <li key={note.text} className="flex items-start gap-2 text-[10.5px] leading-snug text-muted">
              <span
                className={cn(
                  "mt-1 h-1 w-1 shrink-0 rounded-full",
                  note.tone === "good" ? "bg-accent" : "bg-[hsl(var(--warning))]",
                )}
              />
              {note.text}
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/dashboard/match?cv=${cvId}`}
        className={buttonClass("secondary", "sm", "w-full")}
      >
        <ShieldCheck className="h-3.5 w-3.5" /> Open the full job match
      </Link>

      <p className="pb-2 text-[10px] leading-relaxed text-muted">
        The checks read structure, dates, outcomes and keywords. They cannot judge the quality of
        the work, only whether the document gives it a fair chance.
      </p>
    </div>
  );
}

function EditorSkeleton() {
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <div className="h-14 border-b border-line bg-surface/60" />
      <div className="flex flex-1">
        <div className="hidden w-[206px] border-r border-line bg-surface/40 xl:block" />
        <div className="flex-1 p-6">
          <div className="h-6 w-40 animate-pulse rounded bg-line-soft" />
          <div className="mt-6 space-y-3">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="h-16 animate-pulse rounded-xl bg-line-soft" />
            ))}
          </div>
        </div>
        <div className="hidden w-[46%] border-l border-line bg-surface/40 xl:block" />
      </div>
    </div>
  );
}
