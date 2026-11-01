"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Copy,
  Download,
  FileText,
  Mail,
  Plus,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { buttonClass } from "@/lib/button";
import { Badge, Card, EmptyState, Modal } from "@/components/ui/surface";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import {
  draftBio,
  draftCoverLetter,
  draftLinkedIn,
  draftPersonalStatement,
} from "@/lib/intelligence";
import type { CV, Letter, LetterKind } from "@/lib/types";
import { cn, copyText, downloadFile, relativeTime, uid, wordCount } from "@/lib/utils";

const KINDS: { id: LetterKind; label: string; hint: string }[] = [
  { id: "cover", label: "Cover letter", hint: "Tailored to one role and one brief." },
  { id: "statement", label: "Personal statement", hint: "For applications, scholarships and courses." },
  { id: "bio", label: "Professional bio", hint: "Third person, for a site or a speaker page." },
  { id: "linkedin", label: "LinkedIn summary", hint: "First person, short paragraphs." },
];

export default function LettersPage() {
  const { workspace, update } = useWorkspace();
  const { toast } = useToast();
  const letters = useMemo(() => workspace?.letters ?? [], [workspace]);

  const [selectedId, setSelectedId] = useState<string>("");
  const [draft, setDraft] = useState<Letter | null>(null);
  const [kind, setKind] = useState<LetterKind>("cover");
  const [confirmNew, setConfirmNew] = useState(false);
  const loadedId = useRef("");

  useEffect(() => {
    if (!selectedId && letters[0]) setSelectedId(letters[0].id);
  }, [letters, selectedId]);

  useEffect(() => {
    if (!selectedId) {
      setDraft(null);
      return;
    }
    if (loadedId.current === selectedId) return;
    const found = letters.find((letter) => letter.id === selectedId) ?? null;
    loadedId.current = selectedId;
    setDraft(found ? { ...found } : null);
    if (found) setKind(found.kind);
  }, [selectedId, letters]);

  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      update((state) => ({
        ...state,
        letters: state.letters.some((letter) => letter.id === draft.id)
          ? state.letters.map((letter) => (letter.id === draft.id ? { ...draft, updatedAt: new Date().toISOString() } : letter))
          : [{ ...draft }, ...state.letters],
      }));
    }, 600);
    return () => clearTimeout(timer);
  }, [draft, update]);

  if (!workspace) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6">
        <div className="h-8 w-44 animate-pulse rounded bg-line-soft" />
        <div className="mt-6 h-72 animate-pulse rounded-xl bg-line-soft" />
      </div>
    );
  }

  const cvs = workspace.cvs;
  const selectedCv = cvs.find((cv) => cv.id === draft?.cvId) ?? cvs[0] ?? null;

  const createLetter = (type: LetterKind) => {
    const letter: Letter = {
      id: uid("ltr"),
      kind: type,
      title: KINDS.find((item) => item.id === type)?.label ?? "New letter",
      role: selectedCv?.targetRole ?? "",
      company: selectedCv?.targetCompany ?? "",
      body: "",
      cvId: selectedCv?.id ?? null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    update((state) => ({
      ...state,
      letters: [letter, ...state.letters],
      activity: [
        {
          id: uid("act"),
          kind: "letter.created" as const,
          text: `Started ${letter.title.toLowerCase()}`,
          at: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 30),
    }));
    setSelectedId(letter.id);
    loadedId.current = letter.id;
    setDraft(letter);
    setKind(type);
    setConfirmNew(false);
  };

  const generate = () => {
    if (!draft) return;
    const cv: CV | null = selectedCv;
    if (!cv) {
      toast({ title: "No CV to draw from", description: "Create a CV first.", tone: "error" });
      return;
    }
    let body = "";
    if (kind === "cover") {
      body = draftCoverLetter({
        cv,
        jobDescription: cv.jobDescription,
        company: draft.company,
        role: draft.role,
      });
    } else if (kind === "statement") {
      body = draftPersonalStatement(cv);
    } else if (kind === "bio") {
      body = draftBio(cv);
    } else {
      body = draftLinkedIn(cv);
    }
    setDraft({ ...draft, kind, body, cvId: cv.id, updatedAt: new Date().toISOString() });
    toast({
      title: "Draft written from your CV",
      description: "Read it once and correct anything that does not sound like you.",
      tone: "success",
    });
  };

  const remove = () => {
    if (!draft) return;
    update((state) => ({ ...state, letters: state.letters.filter((letter) => letter.id !== draft.id) }));
    setDraft(null);
    setSelectedId("");
    loadedId.current = "";
    toast({ title: "Letter deleted" });
  };

  const copy = async () => {
    if (!draft?.body) return;
    const ok = await copyText(draft.body);
    toast({ title: ok ? "Copied to clipboard" : "Copy failed", tone: ok ? "success" : "error" });
  };

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Letters</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">The words around the CV.</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            Cover letters, personal statements and professional bios, drawn from the same material as
            your documents. Edit them until they sound like you, because they will be read as you.
          </p>
        </div>
        <Button onClick={() => setConfirmNew(true)}>
          <Plus className="h-3.5 w-3.5" /> New letter
        </Button>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
        <Card padded={false} className="h-fit overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <p className="text-[12px] font-medium text-ink">Your letters</p>
            <Badge tone="outline">{letters.length}</Badge>
          </div>
          {letters.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Mail className="mx-auto h-5 w-5 text-muted" />
              <p className="mt-2 text-[12px] font-medium text-ink">Nothing written yet</p>
              <p className="mt-1 text-[11px] leading-relaxed text-muted">
                Start with a cover letter for the role you are chasing.
              </p>
              <Button size="sm" className="mt-3" onClick={() => setConfirmNew(true)}>
                <Plus className="h-3 w-3" /> New letter
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-[hsl(var(--line-soft))]">
              {letters.map((letter) => (
                <li key={letter.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(letter.id);
                      loadedId.current = "";
                    }}
                    className={cn(
                      "w-full px-4 py-3 text-left transition-colors",
                      selectedId === letter.id ? "bg-accent-soft/60" : "hover:bg-surface/70",
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-[12px] font-medium text-ink">{letter.title}</p>
                      <span className="shrink-0 text-[9px] uppercase tracking-[0.1em] text-muted">
                        {KINDS.find((item) => item.id === letter.kind)?.label.split(" ")[0]}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-[10.5px] text-muted">
                      {letter.company || letter.role || "No target yet"}
                    </p>
                    <p className="mt-1 text-[9.5px] text-muted/80">
                      {wordCount(letter.body)} words · {relativeTime(letter.updatedAt)}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {draft ? (
          <Card>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="eyebrow mb-1 text-[8.5px]">Draft</p>
                <input
                  value={draft.title}
                  onChange={(event) => setDraft({ ...draft, title: event.target.value })}
                  aria-label="Letter title"
                  className="w-full border-0 bg-transparent p-0 text-[18px] font-medium tracking-[-0.01em] text-ink focus:outline-none"
                />
                <p className="mt-0.5 text-[10.5px] text-muted">
                  {wordCount(draft.body)} words · edited {relativeTime(draft.updatedAt)}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button variant="secondary" size="sm" onClick={copy} disabled={!draft.body}>
                  <Copy className="h-3 w-3" /> Copy
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    downloadFile(
                      `${draft.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.txt`,
                      draft.body,
                    )
                  }
                  disabled={!draft.body}
                >
                  <Download className="h-3 w-3" /> Text
                </Button>
                <button
                  type="button"
                  onClick={remove}
                  aria-label="Delete letter"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-card text-muted transition-colors hover:text-[hsl(var(--danger))]"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Field label="Type">
                <Select
                  value={kind}
                  onChange={(event) => {
                    const next = event.target.value as LetterKind;
                    setKind(next);
                    setDraft({ ...draft, kind: next });
                  }}
                >
                  {KINDS.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Source CV">
                <Select
                  value={draft.cvId ?? ""}
                  onChange={(event) => setDraft({ ...draft, cvId: event.target.value || null })}
                >
                  <option value="">No document</option>
                  {cvs.map((cv) => (
                    <option key={cv.id} value={cv.id}>
                      {cv.title}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Role">
                <Input
                  value={draft.role}
                  onChange={(event) => setDraft({ ...draft, role: event.target.value })}
                  placeholder="Senior Product Designer"
                />
              </Field>
              <Field label="Company">
                <Input
                  value={draft.company}
                  onChange={(event) => setDraft({ ...draft, company: event.target.value })}
                  placeholder="Lumen Health"
                />
              </Field>
            </div>

            {selectedCv?.jobDescription && (kind === "cover" || kind === "statement") ? (
              <p className="mt-2 rounded-lg border border-line bg-surface/60 px-3 py-2 text-[10.5px] leading-relaxed text-muted">
                Using the brief saved on{" "}
                <span className="text-ink">{selectedCv.title}</span> ({wordCount(selectedCv.jobDescription)} words).
              </p>
            ) : null}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Button size="sm" onClick={generate} disabled={!selectedCv}>
                <Sparkles className="h-3 w-3" /> {draft.body ? "Regenerate" : "Generate a draft"}
              </Button>
              <span className="text-[10.5px] text-muted">
                {KINDS.find((item) => item.id === kind)?.hint}
              </span>
            </div>

            <div className="mt-3">
              <Field label="Letter" hint="Yours to edit. Nothing is sent anywhere.">
                <Textarea
                  value={draft.body}
                  onChange={(event) => setDraft({ ...draft, body: event.target.value })}
                  className="min-h-[420px] text-[13px] leading-[1.8]"
                  placeholder="Write it yourself, or generate a first draft from your CV and then make it sound like you."
                />
              </Field>
            </div>

            {!cvs.length ? (
              <p className="mt-2 text-[10.5px] text-muted">
                A CV is needed before a draft can be generated.{" "}
                <Link href="/dashboard/studio" className="text-ink underline decoration-line underline-offset-2">
                  Create one
                </Link>
                .
              </p>
            ) : null}
          </Card>
        ) : (
          <EmptyState
            icon={Mail}
            title="Select a letter or start a new one"
            description="A cover letter carries the context a CV cannot: why this role, and why now."
            action={
              <Button onClick={() => setConfirmNew(true)}>
                <Plus className="h-3.5 w-3.5" /> Start a letter
              </Button>
            }
            className="min-h-[420px]"
          />
        )}
      </div>

      <Modal
        open={confirmNew}
        onClose={() => setConfirmNew(false)}
        title="What are you writing?"
        description="Each type is drafted differently from the same career material."
      >
        <div className="grid gap-2 sm:grid-cols-2">
          {KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => createLetter(item.id)}
              className="rounded-xl border border-line bg-card p-3 text-left transition-colors hover:border-accent/40 hover:bg-surface"
            >
              <p className="text-[12.5px] font-medium text-ink">{item.label}</p>
              <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">{item.hint}</p>
            </button>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-line bg-surface/60 p-3">
          <FileText className="h-3.5 w-3.5 shrink-0 text-muted" />
          <p className="text-[10.5px] leading-relaxed text-muted">
            The draft uses the CV selected on the right. You can change the source at any time.
          </p>
        </div>
      </Modal>

      {cvs.length === 0 ? (
        <div className="mt-4">
          <Link href="/dashboard/studio" className={buttonClass("ghost", "sm")}>
            Go to the studio <FileText className="h-3 w-3" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
