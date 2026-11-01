"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { AuthLayout } from "@/components/auth/auth-layout";
import { Button } from "@/components/ui/button";
import { Field, Input, PasswordInput } from "@/components/ui/field";
import { useSession } from "@/lib/session";

const INCLUDED = [
  "A career profile that feeds every document",
  "Six document styles, from boardroom to studio",
  "ATS checks, job matching and cover letters",
];

export default function SignUpPage() {
  const { user, signUp } = useSession();
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) router.replace("/dashboard");
  }, [user, router]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setPending(true);
    const result = await signUp({ name, email, password });
    setPending(false);
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
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="font-medium text-ink underline decoration-line underline-offset-2">
            Sign in
          </Link>
        </>
      }
    >
      <p className="eyebrow mb-3">Create your workspace</p>
      <h1 className="display text-[38px] leading-[1.03]">Start with the work you have done.</h1>
      <p className="mt-2.5 text-[13px] leading-relaxed text-muted">
        No blank page. A sample career is loaded so you can see the finished shape, then replace it
        with your own history.
      </p>

      <ul className="mt-5 space-y-1.5">
        {INCLUDED.map((item) => (
          <li key={item} className="flex items-center gap-2 text-[11.5px] text-muted">
            <Check className="h-3 w-3 text-accent" strokeWidth={2.4} />
            {item}
          </li>
        ))}
      </ul>

      <form onSubmit={submit} className="mt-6 space-y-4">
        <Field label="Full name">
          <Input
            autoComplete="name"
            placeholder="Amara Okonkwo"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </Field>
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
        <Field label="Password" hint="8 characters or more">
          <PasswordInput
            autoComplete="new-password"
            placeholder="Choose a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
          />
        </Field>

        {error ? (
          <div className="flex items-start gap-2 rounded-lg border border-[hsl(var(--danger))]/20 bg-[hsl(var(--danger))]/[0.06] px-3 py-2.5">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[hsl(var(--danger))]" />
            <p className="text-[11.5px] leading-relaxed text-[hsl(var(--danger))]">{error}</p>
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" loading={pending}>
          Create account
          <ArrowRight className="h-4 w-4" />
        </Button>
      </form>

      <p className="mt-6 text-[10.5px] leading-relaxed text-muted/85">
        By creating an account you agree to keep the sample content honest and replace it with your
        own. Accounts are stored in this browser during the preview.
      </p>
    </AuthLayout>
  );
}
