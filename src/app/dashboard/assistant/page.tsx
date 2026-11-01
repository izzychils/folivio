"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  Plus,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useWorkspace } from "@/lib/workspace";
import { useSession } from "@/lib/session";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge, Card, Tabs } from "@/components/ui/surface";
import { Mark } from "@/components/ui/logo";
import {
  ASSISTANT_OPENING,
  assistantStep,
  emptyDraft,
  interviewQuestions,
  type ProfileDraft,
} from "@/lib/intelligence";
import { newCv } from "@/lib/cv";
import type { ChatTurn, Experience } from "@/lib/types";
import { cn, uid } from "@/lib/utils";

type StoredChat = {
  turns: ChatTurn[];
  step: number;
  draft: ProfileDraft;
  done: boolean;
};

export default function AssistantPage() {
  const { workspace, update } = useWorkspace();
  const { user } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const [turns, setTurns] = useState<ChatTurn[]>([
    { id: uid("msg"), role: "assistant", text: ASSISTANT_OPENING, at: new Date().toISOString() },
  ]);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft());
  const [done, setDone] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [tab, setTab] = useState<"draft" | "interview">("draft");
  const restored = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const storageKey = user ? `folivio.v1.assistant.${user.id}` : null;

  useEffect(() => {
    if (!storageKey) return;
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredChat;
        if (parsed.turns?.length) {
          setTurns(parsed.turns);
          setStep(parsed.step ?? 0);
          setDraft(parsed.draft ?? emptyDraft());
          setDone(Boolean(parsed.done));
        }
      }
    } catch {
      /* a broken draft should not block the builder */
    }
    restored.current = true;
  }, [storageKey]);

  useEffect(() => {
    if (!storageKey || !restored.current) return;
    window.localStorage.setItem(storageKey, JSON.stringify({ turns, step, draft, done }));
  }, [storageKey, turns, step, draft, done]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [turns, pending]);

  const cvForQuestions = useMemo(() => {
    if (!workspace) return null;
    return workspace.cvs[0] ?? newCv(workspace.profile);
  }, [workspace]);

  const questions = useMemo(() => (cvForQuestions ? interviewQuestions(cvForQuestions) : []), [cvForQuestions]);

  if (!workspace || !user) {
    return (
      <div className="mx-auto max-w-[1180px] px-4 py-8 sm:px-6">
        <div className="h-8 w-56 animate-pulse rounded bg-line-soft" />
        <div className="mt-6 h-[420px] animate-pulse rounded-xl bg-line-soft" />
      </div>
    );
  }

  const send = (raw?: string) => {
    const answer = (raw ?? input).trim();
    if (!answer || pending) return;
    const userTurn: ChatTurn = {
      id: uid("msg"),
      role: "user",
      text: answer,
      at: new Date().toISOString(),
    };
    setTurns((current) => [...current, userTurn]);
    setInput("");
    setSuggestions([]);
    setPending(true);

    const result = assistantStep(step, answer, draft);

    setTimeout(() => {
      setTurns((current) => [
        ...current,
        { id: uid("msg"), role: "assistant", text: result.reply, at: new Date().toISOString() },
      ]);
      setDraft(result.draft);
      setStep(result.nextStep);
      setDone(result.done);
      setSuggestions(result.suggestions);
      setPending(false);
    }, 520);
  };

  const restart = () => {
    setTurns([
      { id: uid("msg"), role: "assistant", text: ASSISTANT_OPENING, at: new Date().toISOString() },
    ]);
    setStep(0);
    setDraft(emptyDraft());
    setDone(false);
    setSuggestions([]);
    setInput("");
    if (storageKey) window.localStorage.removeItem(storageKey);
  };

  const addToProfile = (thenCreateCv = false) => {
    if (!draft.role && !draft.achievement && !draft.skills.length) {
      toast({ title: "Nothing to add yet", description: "Answer a couple of questions first.", tone: "error" });
      return;
    }

    const profile = { ...workspace.profile };
    const headline = profile.contact.headline || draft.targetRole || draft.role;
    profile.contact = {
      ...profile.contact,
      headline,
      fullName: profile.contact.fullName || user.name,
    };

    if (draft.role && !profile.experience.some((role) => role.role.toLowerCase() === draft.role.toLowerCase())) {
      const role: Experience = {
        id: uid("exp"),
        role: draft.role,
        company: draft.company,
        location: "",
        start: "",
        end: "Present",
        summary: "",
        bullets: draft.achievement ? [draft.achievement] : [],
      };
      profile.experience = [role, ...profile.experience];
    }

    if (draft.skills.length) {
      const existing = profile.skills.flatMap((group) => group.items.map((item) => item.toLowerCase()));
      const fresh = draft.skills.filter((skill) => !existing.includes(skill.toLowerCase()));
      if (fresh.length) {
        if (profile.skills.length) {
          profile.skills = profile.skills.map((group, index) =>
            index === 0 ? { ...group, items: [...group.items, ...fresh] } : group,
          );
        } else {
          profile.skills = [{ id: uid("skl"), label: "Core skills", items: fresh }];
        }
      }
    }

    if (draft.targetRole) {
      profile.goals = profile.goals || `Moving toward ${draft.targetRole.toLowerCase()} work.`;
    }

    const createdCv = thenCreateCv
      ? newCv(profile, {
          title: draft.targetRole ? `${draft.targetRole} CV` : "New CV",
          targetRole: draft.targetRole || draft.role,
          targetCompany: draft.company,
        })
      : null;

    update((state) => ({
      ...state,
      profile,
      cvs: createdCv ? [createdCv, ...state.cvs] : state.cvs,
      activity: [
        {
          id: uid("act"),
          kind: "profile.updated" as const,
          text: thenCreateCv ? "Built a profile and CV from the assistant" : "Added assistant notes to the profile",
          at: new Date().toISOString(),
        },
        ...state.activity,
      ].slice(0, 30),
    }));

    toast({
      title: thenCreateCv ? "Profile and CV created" : "Added to your career profile",
      description: thenCreateCv
        ? "Every fact came from your answers. Review the CV before sending it."
        : "You can edit every field in the career profile.",
      tone: "success",
    });

    if (createdCv) {
      setTimeout(() => router.push(`/studio/${createdCv.id}`), 120);
    }
  };

  const progress = Math.min(100, step * 25);

  return (
    <div className="mx-auto max-w-[1180px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Career assistant</p>
          <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">Let us get the material down.</h1>
          <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
            A short guided conversation. Folivio asks, you answer, and the draft is built only from
            what you said.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone="accent">
            <ShieldCheck className="h-2.5 w-2.5" /> No invention
          </Badge>
          <Button variant="secondary" size="sm" onClick={restart}>
            <RotateCcw className="h-3 w-3" /> Start over
          </Button>
        </div>
      </header>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card padded={false} className="flex h-[620px] flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Sparkles className="h-3.5 w-3.5" />
              </span>
              <div>
                <p className="text-[12px] font-medium text-ink">Profile builder</p>
                <p className="text-[10px] text-muted">Guided, four questions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-1 w-[70px] overflow-hidden rounded-full bg-line-soft">
                <div className="h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${progress}%` }} />
              </div>
              <span className="num text-[9.5px] text-muted">{Math.min(step, 4)}/4</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4">
            <div className="space-y-3">
              {turns.map((turn) =>
                turn.role === "assistant" ? (
                  <div key={turn.id} className="flex items-start gap-2.5">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink">
                      <Mark className="h-4 w-4" />
                    </span>
                    <div className="max-w-[520px] rounded-xl rounded-tl-sm border border-line bg-surface/70 px-3.5 py-2.5">
                      <p className="text-[12.5px] leading-relaxed text-ink">{turn.text}</p>
                    </div>
                  </div>
                ) : (
                  <div key={turn.id} className="flex items-start justify-end gap-2.5">
                    <div className="max-w-[440px] rounded-xl rounded-tr-sm bg-[hsl(var(--accent))] px-3.5 py-2.5 text-[hsl(var(--paper))]">
                      <p className="text-[12.5px] leading-relaxed">{turn.text}</p>
                    </div>
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-medium text-accent-ink">
                      {user.name.slice(0, 1).toUpperCase()}
                    </span>
                  </div>
                ),
              )}

              {pending ? (
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-surface">
                    <Mark className="h-4 w-4" />
                  </span>
                  <div className="flex items-center gap-1 rounded-xl border border-line bg-surface/70 px-3 py-3">
                    {[0, 1, 2].map((index) => (
                      <span
                        key={index}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted"
                        style={{ animationDelay: `${index * 140}ms` }}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {suggestions.length ? (
            <div className="flex flex-wrap gap-1.5 px-4 pb-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => send(suggestion)}
                  className="rounded-full border border-line bg-card px-2.5 py-1 text-[10.5px] text-muted transition-colors hover:border-accent/40 hover:text-ink"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          ) : null}

          <div className="border-t border-line-soft p-3">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder={done ? "Add anything you left out..." : "Type your answer"}
                className="field max-h-[120px] min-h-[42px] flex-1 resize-none py-2.5 text-[12.5px]"
              />
              <Button size="md" onClick={() => send()} disabled={!input.trim() || pending} aria-label="Send message">
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <p className="mt-1.5 text-[9.5px] text-muted">
              Enter sends, Shift and Enter adds a line. Nothing is uploaded.
            </p>
          </div>
        </Card>

        <div className="space-y-4">
          <Card padded={false} className="overflow-hidden">
            <div className="border-b border-line-soft px-4 py-3">
              <Tabs
                value={tab}
                onChange={setTab}
                size="sm"
                tabs={[
                  { id: "draft", label: "Draft" },
                  { id: "interview", label: "Interview prep" },
                ]}
              />
            </div>

            {tab === "draft" ? (
              <div className="p-4">
                {draft.role || draft.achievement || draft.skills.length ? (
                  <div className="space-y-3">
                    <DraftRow label="Role" value={draft.role || "Not captured yet"} />
                    <DraftRow label="Organisation" value={draft.company || "Not captured yet"} />
                    <div>
                      <p className="eyebrow mb-1 text-[8px]">Achievement</p>
                      <p className="text-[11.5px] leading-relaxed text-ink">
                        {draft.achievement || "Not captured yet"}
                      </p>
                    </div>
                    <div>
                      <p className="eyebrow mb-1 text-[8px]">Skills</p>
                      <div className="flex flex-wrap gap-1">
                        {draft.skills.length ? (
                          draft.skills.map((skill) => (
                            <span key={skill} className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px] text-ink">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11.5px] text-muted">Not captured yet</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="eyebrow mb-1 text-[8px]">Target direction</p>
                      <p className="text-[11.5px] text-ink">{draft.targetRole || "Not captured yet"}</p>
                    </div>

                    {done && draft.summary ? (
                      <div className="rounded-lg border border-[hsl(var(--accent))]/20 bg-accent-soft/40 p-2.5">
                        <p className="eyebrow mb-1 text-[8px] text-accent">Draft profile</p>
                        <p className="text-[11px] leading-relaxed text-ink">{draft.summary}</p>
                      </div>
                    ) : null}

                    <div className="space-y-2 pt-1">
                      <Button className="w-full" size="sm" onClick={() => addToProfile(true)}>
                        <Plus className="h-3 w-3" /> Add and build a CV
                      </Button>
                      <Button variant="secondary" size="sm" className="w-full" onClick={() => addToProfile(false)}>
                        Add to profile only
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center">
                    <span className="mx-auto flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted">
                      <MessageSquare className="h-4 w-4" />
                    </span>
                    <p className="mt-2 text-[12px] font-medium text-ink">The draft fills as you answer</p>
                    <p className="mx-auto mt-1 max-w-[220px] text-[11px] leading-relaxed text-muted">
                      Role, one achievement, skills and the direction you want. Nothing else is
                      assumed.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[11.5px] font-medium text-ink">Likely questions</p>
                  <span className="text-[9.5px] text-muted">{questions.length} prompts</span>
                </div>
                <ul className="space-y-2.5">
                  {questions.map((item, index) => (
                    <li key={item.question} className="border-b border-line-soft pb-2.5 last:border-0 last:pb-0">
                      <p className="text-[11px] font-medium leading-snug text-ink">
                        {String(index + 1).padStart(2, "0")}. {item.question}
                      </p>
                      <p className="mt-0.5 text-[10px] leading-snug text-muted">{item.why}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>

          <Card>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" />
              <p className="text-[12px] font-medium text-ink">The rule this builder follows</p>
            </div>
            <p className="mt-2 text-[11px] leading-relaxed text-muted">
              It will reword, structure and ask. It will never add a degree, an employer, a date or a
              number you did not give it. If a field is thin, the right answer is to ask you, not to
              fill it.
            </p>
            <div className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3">
              <User className="h-3 w-3 text-muted" />
              <p className="text-[10px] text-muted">Drafts stay in this browser.</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DraftRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="eyebrow text-[8px]">{label}</span>
      <span className="max-w-[190px] text-right text-[11.5px] text-ink">{value}</span>
    </div>
  );
}
