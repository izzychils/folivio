"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Copy, ExternalLink, Eye, Globe, Plus, Trash2 } from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, Card, Modal } from "@/components/ui/surface";
import { Field, Input, Switch, Textarea } from "@/components/ui/field";
import { ChipInput } from "@/components/ui/field";
import { PortfolioView } from "@/components/portfolio/view";
import { publishPortfolio, unpublishPortfolio } from "@/lib/storage";
import type { Portfolio, PortfolioTheme } from "@/lib/types";
import { cn, copyText, slugify, uid } from "@/lib/utils";

const THEMES: { id: PortfolioTheme; name: string; description: string }[] = [
  { id: "editorial", name: "Editorial", description: "Large type, numbered case studies, warm paper." },
  { id: "minimal", name: "Minimal", description: "Quiet spacing, a grid of projects, less ornament." },
  { id: "index", name: "Index", description: "A list first. Good when the work titles speak for themselves." },
];

const TONE_COLORS = ["#1D5C45", "#A9502A", "#1E3A5F", "#5A2A4A", "#3F5D45", "#4A4A45"];
const ACCENTS = ["#1D5C45", "#14140F", "#A9502A", "#1E3A5F", "#5A2A4A"];
const TONES = [0, 1, 2, 3, 4, 5] as const;

export default function PortfolioPage() {
  const { workspace, update } = useWorkspace();
  const { toast } = useToast();
  const [draft, setDraft] = useState<Portfolio | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [slugError, setSlugError] = useState("");
  const loaded = useRef(false);
  const lastSlug = useRef("");

  useEffect(() => {
    if (workspace?.portfolio && !loaded.current) {
      loaded.current = true;
      setDraft(workspace.portfolio);
      lastSlug.current = workspace.portfolio.slug;
    }
  }, [workspace]);

  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      const next = { ...draft, updatedAt: new Date().toISOString() };
      update((state) => ({ ...state, portfolio: next }));
      if (next.published) {
        if (lastSlug.current && lastSlug.current !== next.slug) {
          unpublishPortfolio(lastSlug.current);
        }
        lastSlug.current = next.slug;
        publishPortfolio(next.slug, {
          ...next,
          ownerName: next.displayName,
          publishedAt: new Date().toISOString(),
        });
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [draft, update]);

  if (!draft) {
    return (
      <div className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6">
        <div className="h-8 w-48 animate-pulse rounded bg-line-soft" />
        <div className="mt-6 h-64 animate-pulse rounded-xl bg-line-soft" />
      </div>
    );
  }

  const patch = (partial: Partial<Portfolio>) =>
    setDraft((current) => (current ? { ...current, ...partial } : current));

  const copyLink = async () => {
    const url = `${window.location.origin}/p/${draft.slug}`;
    const ok = await copyText(url);
    toast({
      title: ok ? "Link copied" : "Copy failed",
      description: ok ? url : "Select the address manually.",
      tone: ok ? "success" : "error",
      });
  };

  const setPublished = (published: boolean) => {
    if (published && !draft.slug.trim()) {
      setSlugError("Choose an address before publishing.");
      return;
    }
    setSlugError("");
    const next = { ...draft, published, updatedAt: new Date().toISOString() };
    setDraft(next);
    if (published) {
      publishPortfolio(next.slug, {
        ...next,
        ownerName: next.displayName,
        publishedAt: new Date().toISOString(),
      });
      lastSlug.current = next.slug;
      update((state) => ({
        ...state,
        portfolio: next,
        activity: [
          {
            id: uid("act"),
            kind: "portfolio.published" as const,
            text: "Published the online portfolio",
            at: new Date().toISOString(),
          },
          ...state.activity,
        ].slice(0, 30),
      }));
      toast({ title: "Portfolio published", description: `Your page is live at /p/${next.slug}.`, tone: "success" });
    } else {
      unpublishPortfolio(next.slug);
      update((state) => ({ ...state, portfolio: next }));
      toast({ title: "Portfolio unpublished", description: "The page is offline. Your content is safe." });
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Professional identity</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">Your work, in one link.</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            A portfolio page built from the projects you already wrote. No design software, no
            hosting account, no blank canvas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-3.5 w-3.5" /> Full preview
          </Button>
          {draft.published ? (
            <Link href={`/p/${draft.slug}`} target="_blank" className={buttonClass("secondary", "md")}>
              <ExternalLink className="h-3.5 w-3.5" /> Open page
            </Link>
          ) : null}
          <Button
            variant={draft.published ? "secondary" : "primary"}
            onClick={() => setPublished(!draft.published)}
          >
            {draft.published ? "Unpublish" : "Publish page"}
          </Button>
        </div>
      </header>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-line bg-surface/60 px-4 py-2.5">
        <span className={cn("h-1.5 w-1.5 rounded-full", draft.published ? "bg-accent" : "bg-line")} />
        <span className="font-mono text-[10.5px] text-muted">folivio.app/p/{draft.slug}</span>
        <Badge tone={draft.published ? "positive" : "outline"}>{draft.published ? "Live" : "Draft"}</Badge>
        <button
          type="button"
          onClick={copyLink}
          className="ml-auto inline-flex items-center gap-1 text-[10.5px] font-medium text-accent-ink"
        >
          <Copy className="h-3 w-3" /> Copy link
        </button>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,540px)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Card>
            <h2 className="text-[14px] font-medium text-ink">Identity</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">What a visitor reads first.</p>
            <div className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Display name">
                  <Input value={draft.displayName} onChange={(event) => patch({ displayName: event.target.value })} placeholder="Amara Okonkwo" />
                </Field>
                <Field label="Headline">
                  <Input value={draft.headline} onChange={(event) => patch({ headline: event.target.value })} placeholder="Product designer, health and fintech" />
                </Field>
              </div>
              <Field label="About" hint="120 to 200 words works best">
                <Textarea
                  value={draft.about}
                  onChange={(event) => patch({ about: event.target.value })}
                  className="min-h-[150px] text-[12.5px] leading-relaxed"
                  placeholder="How you work, what you care about, and the kind of problem you are good at."
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Location">
                  <Input value={draft.location} onChange={(event) => patch({ location: event.target.value })} placeholder="Lagos, Nigeria" />
                </Field>
                <Field label="Email">
                  <Input type="email" value={draft.email} onChange={(event) => patch({ email: event.target.value })} placeholder="you@example.com" />
                </Field>
                <Field label="Website">
                  <Input value={draft.website} onChange={(event) => patch({ website: event.target.value })} placeholder="yourname.com" />
                </Field>
                <Field label="LinkedIn">
                  <Input value={draft.linkedin} onChange={(event) => patch({ linkedin: event.target.value })} placeholder="linkedin.com/in/yourname" />
                </Field>
              </div>
              <Switch
                checked={draft.showEmail}
                onChange={(showEmail) => patch({ showEmail })}
                label="Show email on the page"
                description="Turn this off and visitors can still use LinkedIn or your website."
              />
            </div>
          </Card>

          <Card>
            <h2 className="text-[14px] font-medium text-ink">Address</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">One link you can put anywhere.</p>
            <div className="mt-3">
              <Field label="Page address" error={slugError}>
                <div className="flex items-center overflow-hidden rounded-[10px] border border-line bg-card focus-within:border-[hsl(var(--accent))]/70">
                  <span className="shrink-0 border-r border-line bg-surface px-2.5 py-2.5 font-mono text-[10.5px] text-muted">
                    /p/
                  </span>
                  <input
                    value={draft.slug}
                    onChange={(event) => {
                      patch({ slug: slugify(event.target.value) });
                      setSlugError("");
                    }}
                    placeholder="your-name"
                    className="w-full border-0 bg-transparent px-2.5 py-2 font-mono text-[11.5px] text-ink focus:outline-none"
                  />
                </div>
              </Field>
            </div>
          </Card>

          <Card>
            <h2 className="text-[14px] font-medium text-ink">Presentation</h2>
            <p className="mt-0.5 text-[11.5px] text-muted">The page takes the accent you choose.</p>

            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {THEMES.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => patch({ theme: theme.id })}
                  className={cn(
                    "rounded-lg border p-2.5 text-left transition-colors",
                    draft.theme === theme.id
                      ? "border-accent bg-accent-soft/40"
                      : "border-line bg-card hover:border-[hsl(var(--muted))]/40",
                  )}
                >
                  <ThemeSketch id={theme.id} accent={draft.accent} />
                  <p className="mt-2 text-[11px] font-medium text-ink">{theme.name}</p>
                  <p className="mt-0.5 text-[9.5px] leading-snug text-muted">{theme.description}</p>
                </button>
              ))}
            </div>

            <div className="mt-4">
              <p className="eyebrow mb-2 text-[8.5px]">Accent</p>
              <div className="flex gap-1.5">
                {ACCENTS.map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    aria-label={accent}
                    onClick={() => patch({ accent })}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border-2",
                      draft.accent === accent ? "border-ink" : "border-transparent",
                    )}
                  >
                    <span className="h-5 w-5 rounded-full" style={{ background: accent }} />
                  </button>
                ))}
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[14px] font-medium text-ink">Projects</h2>
                <p className="mt-0.5 text-[11.5px] text-muted">
                  Short case studies read better than a gallery.
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() =>
                  patch({
                    projects: [
                      ...draft.projects,
                      {
                        id: uid("pfp"),
                        title: "",
                        subtitle: "",
                        year: "",
                        summary: "",
                        body: "",
                        tags: [],
                        link: "",
                        tone: 0,
                      },
                    ],
                  })
                }
              >
                <Plus className="h-3 w-3" /> Add
              </Button>
            </div>

            <div className="mt-3 space-y-3">
              {draft.projects.map((project, index) => (
                <div key={project.id} className="rounded-xl border border-line bg-surface/40 p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="eyebrow text-[8.5px]">Project {String(index + 1).padStart(2, "0")}</p>
                    <button
                      type="button"
                      aria-label="Remove project"
                      onClick={() => patch({ projects: draft.projects.filter((item) => item.id !== project.id) })}
                      className="rounded p-1 text-muted transition-colors hover:text-[hsl(var(--danger))]"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                  <div className="space-y-2.5">
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <Field label="Title">
                        <Input
                          value={project.title}
                          onChange={(event) =>
                            patch({
                              projects: draft.projects.map((item) =>
                                item.id === project.id ? { ...item, title: event.target.value } : item,
                              ),
                            })
                          }
                          placeholder="Care pathways"
                        />
                      </Field>
                      <Field label="Subtitle">
                        <Input
                          value={project.subtitle}
                          onChange={(event) =>
                            patch({
                              projects: draft.projects.map((item) =>
                                item.id === project.id ? { ...item, subtitle: event.target.value } : item,
                              ),
                            })
                          }
                          placeholder="Lead designer, Meridian"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-2">
                      <Field label="Year">
                        <Input
                          value={project.year}
                          onChange={(event) =>
                            patch({
                              projects: draft.projects.map((item) =>
                                item.id === project.id ? { ...item, year: event.target.value } : item,
                              ),
                            })
                          }
                          placeholder="2023"
                        />
                      </Field>
                      <Field label="Link">
                        <Input
                          value={project.link}
                          onChange={(event) =>
                            patch({
                              projects: draft.projects.map((item) =>
                                item.id === project.id ? { ...item, link: event.target.value } : item,
                              ),
                            })
                          }
                          placeholder="Full case study URL"
                        />
                      </Field>
                    </div>
                    <Field label="Summary">
                      <Textarea
                        value={project.summary}
                        onChange={(event) =>
                          patch({
                            projects: draft.projects.map((item) =>
                              item.id === project.id ? { ...item, summary: event.target.value } : item,
                            ),
                          })
                        }
                        className="min-h-[58px] text-[12px]"
                        placeholder="What the project was, and what changed because of it."
                      />
                    </Field>
                    <Field label="Detail" hint="Optional">
                      <Textarea
                        value={project.body}
                        onChange={(event) =>
                          patch({
                            projects: draft.projects.map((item) =>
                              item.id === project.id ? { ...item, body: event.target.value } : item,
                            ),
                          })
                        }
                        className="min-h-[58px] text-[12px]"
                        placeholder="How you approached it, who you worked with, what you learned."
                      />
                    </Field>
                    <Field label="Tags">
                      <ChipInput
                        values={project.tags}
                        onChange={(tags) =>
                          patch({
                            projects: draft.projects.map((item) =>
                              item.id === project.id ? { ...item, tags } : item,
                            ),
                          })
                        }
                        placeholder="Healthcare, Research"
                      />
                    </Field>
                    <div>
                      <p className="eyebrow mb-1.5 text-[8.5px]">Card colour</p>
                      <div className="flex gap-1.5">
                        {TONES.map((tone) => (
                          <button
                            key={tone}
                            type="button"
                            aria-label={`Tone ${tone + 1}`}
                            onClick={() =>
                              patch({
                                projects: draft.projects.map((item) =>
                                  item.id === project.id ? { ...item, tone } : item,
                                ),
                              })
                            }
                            className={cn(
                              "h-5 w-5 rounded-full border-2",
                              project.tone === tone ? "border-ink" : "border-transparent",
                            )}
                            style={{ background: TONE_COLORS[tone] }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {draft.projects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-line bg-surface/40 py-8 text-center">
                  <Globe className="mx-auto h-5 w-5 text-muted" />
                  <p className="mt-2 text-[12px] font-medium text-ink">No projects yet</p>
                  <p className="mt-1 text-[11px] text-muted">Add the work you want to be known for.</p>
                </div>
              ) : null}
            </div>
          </Card>
        </div>

        <div className="hidden min-w-0 xl:block">
          <div className="sticky top-[76px]">
            <div className="mb-2 flex items-center justify-between">
              <p className="eyebrow text-[8.5px]">Live preview</p>
              <span className="text-[10px] text-muted">{draft.theme}</span>
            </div>
            <div className="overflow-hidden rounded-xl border border-line bg-card">
              <BrowserBar slug={draft.slug} />
              <ScaledPortfolio portfolio={draft} />
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-muted">
              Published pages in this preview build are stored in this browser. A real hosted link
              arrives with the backend.
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Portfolio preview"
        description="The page as a visitor sees it, including unpublished changes."
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setPreviewOpen(false)}>
              Close
            </Button>
            <Button
              size="sm"
              onClick={() => {
                copyLink();
                setPreviewOpen(false);
              }}
            >
              <Copy className="h-3.5 w-3.5" /> Copy link
            </Button>
          </>
        }
      >
        <div className="h-[68vh] overflow-y-auto rounded-lg border border-line">
          <PortfolioView portfolio={draft} preview />
        </div>
      </Modal>
    </div>
  );
}

function BrowserBar({ slug }: { slug: string }) {
  return (
    <div className="flex items-center gap-1.5 border-b border-line bg-surface px-3 py-2">
      <span className="h-1.5 w-1.5 rounded-full bg-line" />
      <span className="h-1.5 w-1.5 rounded-full bg-line" />
      <span className="h-1.5 w-1.5 rounded-full bg-line" />
      <span className="ml-2 truncate font-mono text-[9px] text-muted">folivio.app/p/{slug}</span>
    </div>
  );
}

function ScaledPortfolio({ portfolio }: { portfolio: Portfolio }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.55);

  useEffect(() => {
    const element = frame.current;
    if (!element) return;
    const measure = () => setScale(Math.max(0.3, Math.min(0.7, (element.clientWidth - 2) / 1080)));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frame} className="relative h-[520px] overflow-hidden bg-paper">
      <div
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
        style={{ width: 1080, transform: `scale(${scale})` }}
      >
        <PortfolioView portfolio={portfolio} preview />
      </div>
    </div>
  );
}

function ThemeSketch({ id, accent }: { id: PortfolioTheme; accent: string }) {
  return (
    <div className="h-10 w-full overflow-hidden rounded border border-line bg-white p-1.5">
      {id === "editorial" ? (
        <div className="space-y-1">
          <div className="h-[4px] w-[62%] rounded-full" style={{ background: "#16150f" }} />
          <div className="h-[2px] w-[40%] rounded-full" style={{ background: accent }} />
          <div className="mt-1 flex gap-1">
            <div className="h-3 w-4 rounded-[1px]" style={{ background: `${accent}33` }} />
            <div className="flex-1 space-y-[2px]">
              <div className="h-[1.5px] w-full rounded-full bg-[#16150f]/20" />
              <div className="h-[1.5px] w-[70%] rounded-full bg-[#16150f]/20" />
            </div>
          </div>
        </div>
      ) : null}
      {id === "minimal" ? (
        <div className="space-y-1">
          <div className="h-[3px] w-[40%] rounded-full bg-[#16150f]/80" />
          <div className="grid grid-cols-2 gap-1">
            {[0, 1].map((index) => (
              <div key={index} className="space-y-[2px] border border-[#16150f]/10 p-1">
                <div className="h-[2px] w-full rounded-full" style={{ background: `${accent}55` }} />
                <div className="h-[1.5px] w-[70%] rounded-full bg-[#16150f]/20" />
              </div>
            ))}
          </div>
        </div>
      ) : null}
      {id === "index" ? (
        <div className="space-y-[3px] pt-0.5">
          <div className="h-[3px] w-[38%] rounded-full bg-[#16150f]/80" />
          {[0, 1, 2].map((index) => (
            <div key={index} className="flex items-center gap-1 border-b border-[#16150f]/10 pb-[2px]">
              <span className="h-[1.5px] w-[6px] rounded-full" style={{ background: accent }} />
              <span className="h-[1.5px] flex-1 rounded-full bg-[#16150f]/20" />
              <span className="h-[1.5px] w-[8px] rounded-full bg-[#16150f]/10" />
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
