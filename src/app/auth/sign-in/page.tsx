"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Sparkles } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/field";
import { useSession } from "@/lib/session";

export default function SignInPage() {
  const { user, signIn, signInWithSample } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [demoPending, setDemoPending] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    const result = await signIn({ email, password });
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/dashboard");
  };

  const openSample = async () => {
    setError("");
    setDemoPending(true);
    const result = await signInWithSample();
    setDemoPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/dashboard");
  };

  return (
    <AuthLayout
      footer={
        <>
          New to Folivio?{" "}
          <Link href="/auth/sign-up" className="font-medium text-ink underline decoration-line underline-offset-2">
            Create an account
          </Link>
        </>
      }
    >
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="display text-[38px] leading-[1.03]">Pick up where you left off.</h1>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
        Your documents, portfolio and career profile are exactly as you left them.
      </p>

      <form onSubmit={submit} className="mt-7 space-y-4">
        <Field label="Email address">
          <Input
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </Field>
        <Field label="Password">
          <PasswordInput
            autoComplete="current-password"
            placeholder="Your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </Field>

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--danger))]/20 bg-[hsl(var(--danger))]/[0.06] px-3 py-2.5">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--danger))]" />
            <p className="text-[11.5px] leading-relaxed text-[hsl(var(--danger))]">{error}</p>
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Sign in
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line" />
        <span className="eyebrow text-[8.5px]">or look around first</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <button
        type="button"
        onClick={openSample}
        disabled={demoPending}
        className="flex w-full items-center gap-3 rounded-xl border border-line bg-card p-3.5 text-left transition-colors hover:border-[hsl(var(--accent))]/40 hover:bg-surface disabled:opacity-60"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent">
          <Sparkles className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[12.5px] font-medium text-ink">
            {demoPending ? "Loading the sample workspace" : "Explore a full sample career"}
          </span>
          <span className="block text-[11px] text-muted">
            Three CVs, a live portfolio and a cover letter, ready to inspect.
          </span>
        </span>
        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted" />
      </button>

      <p className="mt-6 text-[10.5px] leading-relaxed text-muted/85">
        This preview build keeps accounts in this browser. Nothing is uploaded, and no document
        leaves the device.
      </p>
    </AuthLayout>
  );
}
