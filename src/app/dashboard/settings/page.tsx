"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Download,
  LogOut,
  Monitor,
  Moon,
  RefreshCw,
  ShieldCheck,
  Sun,
  Trash2,
  Upload,
  User,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { useWorkspace } from "@/lib/workspace";
import { useTheme } from "@/lib/theme";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";
import { Badge, Card, Modal } from "@/components/ui/surface";
import { Field, Input, PasswordInput, Select } from "@/components/ui/field";
import { CV_ACCENTS, CV_TEMPLATES } from "@/lib/templates";
import type { ThemeMode, Workspace } from "@/lib/types";
import { cn, downloadFile } from "@/lib/utils";

export default function SettingsPage() {
  const { user, updateName, changePassword, signOut, deleteAccount } = useSession();
  const { workspace, update, replace, resetToSample, clearSampleContent } = useWorkspace();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [clearOpen, setClearOpen] = useState(false);
  const [importError, setImportError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  if (!workspace || !user) {
    return (
      <div className="mx-auto max-w-[900px] px-4 py-8 sm:px-6">
        <div className="h-8 w-40 animate-pulse rounded bg-line-soft" />
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-32 animate-pulse rounded-xl bg-line-soft" />
          ))}
        </div>
      </div>
    );
  }

  const saveName = () => {
    const result = updateName(name);
    if (!result.ok) {
      toast({ title: result.error, tone: "error" });
      return;
    }
    update((state) => ({
      ...state,
      profile: { ...state.profile, contact: { ...state.profile.contact, fullName: name.trim() } },
    }));
    toast({ title: "Name updated", tone: "success" });
  };

  const submitPassword = async () => {
    setPasswordError("");
    const result = await changePassword(currentPassword, nextPassword);
    if (!result.ok) {
      setPasswordError(result.error);
      return;
    }
    setCurrentPassword("");
    setNextPassword("");
    toast({ title: "Password changed", tone: "success" });
  };

  const exportWorkspace = () => {
    const payload = JSON.stringify({ exportedAt: new Date().toISOString(), user: { name: user.name, email: user.email }, workspace }, null, 2);
    downloadFile("folivio-workspace.json", payload, "application/json");
    toast({ title: "Workspace exported", description: "A JSON file with your profile, CVs and portfolio.", tone: "success" });
  };

  const importWorkspace = async (file: File) => {
    setImportError("");
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { workspace?: Workspace } & Partial<Workspace>;
      const candidate = parsed.workspace ?? parsed;
      if (!candidate || !candidate.profile || !Array.isArray(candidate.cvs)) {
        setImportError("That file does not look like a Folivio export.");
        return;
      }
      replace({ ...(candidate as Workspace), version: 1 });
      toast({ title: "Workspace imported", description: "Your profile, documents and portfolio are in place.", tone: "success" });
    } catch {
      setImportError("The file could not be read as JSON.");
    }
  };

  const themes: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Paper", icon: Sun },
    { id: "dark", label: "Ink", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="mx-auto max-w-[900px] px-4 py-6 sm:px-6 lg:py-8">
      <header>
        <p className="eyebrow mb-2">Settings</p>
        <h1 className="display text-[32px] leading-[1.05] sm:text-[38px]">Your account, your data.</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
          Folivio is running as a local preview. Accounts, documents and published pages live in this
          browser, and you can take all of it with you.
        </p>
      </header>

      <div className="mt-6 space-y-4">
        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <User className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-medium text-ink">Account</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">The name on the workspace and on new documents.</p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <Field label="Full name">
                  <Input value={name} onChange={(event) => setName(event.target.value)} />
                </Field>
                <Field label="Email" hint="Read only in this build">
                  <Input value={user.email} disabled readOnly />
                </Field>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={saveName} disabled={name.trim() === user.name}>
                  Save name
                </Button>
                <Button variant="secondary" size="sm" onClick={() => router.push("/dashboard/profile")}>
                  Open career profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-[14px] font-medium text-ink">Password</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">
            Stored as a salted hash in this browser. It is not protecting a server yet.
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Current password">
              <PasswordInput
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Field label="New password" hint="8 characters or more">
              <PasswordInput
                value={nextPassword}
                onChange={(event) => setNextPassword(event.target.value)}
                autoComplete="new-password"
              />
            </Field>
          </div>
          {passwordError ? (
            <p className="mt-2 text-[11px] text-[hsl(var(--danger))]">{passwordError}</p>
          ) : null}
          <Button
            size="sm"
            className="mt-3"
            onClick={submitPassword}
            disabled={!currentPassword || nextPassword.length < 8}
          >
            Change password
          </Button>
        </Card>

        <Card>
          <h2 className="text-[14px] font-medium text-ink">Appearance</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">Paper for daylight, ink for late edits.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {themes.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "flex items-center gap-2 rounded-xl border px-3 py-2.5 text-left transition-colors",
                    theme === option.id
                      ? "border-accent bg-accent-soft/50"
                      : "border-line bg-card hover:border-[hsl(var(--muted))]/40",
                  )}
                >
                  <Icon className="h-3.5 w-3.5 text-muted" />
                  <span className="text-[12px] font-medium text-ink">{option.label}</span>
                  {theme === option.id ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" /> : null}
                </button>
              );
            })}
          </div>
        </Card>

        <Card>
          <h2 className="text-[14px] font-medium text-ink">New document defaults</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">Applied when you create a CV without choosing a style.</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Default style">
              <Select
                value={workspace.settings.defaultTemplate}
                onChange={(event) =>
                  update((state) => ({
                    ...state,
                    settings: { ...state.settings, defaultTemplate: event.target.value as typeof state.settings.defaultTemplate },
                  }))
                }
              >
                {CV_TEMPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Default accent">
              <div className="flex h-[42px] items-center gap-1.5">
                {CV_ACCENTS.map((accent) => (
                  <button
                    key={accent.value}
                    type="button"
                    aria-label={accent.name}
                    onClick={() =>
                      update((state) => ({
                        ...state,
                        settings: { ...state.settings, defaultAccent: accent.value },
                      }))
                    }
                    className={cn(
                      "flex h-6 w-6 items-center justify-center rounded-full border-2",
                      workspace.settings.defaultAccent === accent.value ? "border-ink" : "border-transparent",
                    )}
                  >
                    <span className="h-[17px] w-[17px] rounded-full" style={{ background: accent.value }} />
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </Card>

        <Card>
          <h2 className="text-[14px] font-medium text-ink">Sample content</h2>
          <p className="mt-0.5 text-[11.5px] text-muted">
            {workspace.settings.sampleContent
              ? "The workspace contains example material so the product is not empty on first run."
              : "The workspace contains no sample material."}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {workspace.settings.sampleContent ? (
              <Button variant="secondary" size="sm" onClick={() => setClearOpen(true)}>
                <Trash2 className="h-3 w-3" /> Clear sample content
              </Button>
            ) : (
              <Button variant="secondary" size="sm" onClick={resetToSample}>
                <RefreshCw className="h-3 w-3" /> Restore the sample workspace
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
              <ShieldCheck className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-[14px] font-medium text-ink">Your data</h2>
              <p className="mt-0.5 text-[11.5px] text-muted">
                Export a copy, restore one, or remove everything. Nothing leaves this device.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={exportWorkspace}>
                  <Download className="h-3 w-3" /> Export workspace
                </Button>
                <Button variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  <Upload className="h-3 w-3" /> Import workspace
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json,.json"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void importWorkspace(file);
                    event.target.value = "";
                  }}
                />
              </div>
              {importError ? (
                <p className="mt-2 text-[11px] text-[hsl(var(--danger))]">{importError}</p>
              ) : null}
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="text-[14px] font-medium text-ink">Session</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => { signOut(); router.push("/"); }}>
              <LogOut className="h-3 w-3" /> Sign out
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="h-3 w-3" /> Delete account
            </Button>
          </div>
          <p className="mt-2 text-[10.5px] leading-relaxed text-muted">
            Deleting the account removes the profile, CVs, portfolio and letters stored in this browser.
            There is no server copy.
          </p>
        </Card>

        <div className="flex flex-wrap items-center justify-between gap-2 pb-4">
          <p className="text-[10px] text-muted">Folivio preview build 0.1.0 · local workspace</p>
          <Badge tone="outline">No trackers</Badge>
        </div>
      </div>

      <Modal
        open={clearOpen}
        onClose={() => setClearOpen(false)}
        title="Clear the sample content?"
        description="The example profile, CVs, portfolio and letters will be removed. Anything you wrote yourself will also go, because the workspace is replaced with a blank one."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setClearOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                clearSampleContent();
                setClearOpen(false);
                toast({ title: "Workspace cleared", description: "Start with your own experience.", tone: "success" });
              }}
            >
              Clear it
            </Button>
          </>
        }
      />

      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete this account?"
        description="Your account and every document stored for it in this browser will be removed. This cannot be undone."
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setDeleteOpen(false)}>
              Keep my account
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                deleteAccount();
                router.push("/");
              }}
            >
              Delete everything
            </Button>
          </>
        }
      />
    </div>
  );
}
