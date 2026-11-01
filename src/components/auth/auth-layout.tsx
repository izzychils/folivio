import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Wordmark } from "@/components/ui/logo";

const POINTS = [
  "Built from your real history, never invented",
  "CVs for different roles, side by side",
  "A portfolio page you can send in one link",
];

export function AuthLayout({
  children,
  footer,
}: {
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="grid min-h-screen bg-paper lg:grid-cols-[1fr_0.92fr]">
      <div className="flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Folivio home">
            <Wordmark />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11.5px] text-muted transition-colors hover:text-ink"
          >
            Back to site <ArrowRight className="h-3 w-3" />
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-8 sm:px-8">
          <div className="w-full max-w-[392px]">{children}</div>
        </main>

        <footer className="px-5 py-5 text-center text-[10.5px] text-muted/80 sm:px-8">
          {footer ?? (
            <>
              Accounts and documents stay in this browser while Folivio is in preview.{" "}
              <Link href="/" className="underline decoration-line underline-offset-2 hover:text-ink">
                Read how it works
              </Link>
            </>
          )}
        </footer>
      </div>

      <aside className="relative hidden overflow-hidden border-l border-line bg-[hsl(var(--ink))] text-[hsl(var(--paper))] lg:flex lg:flex-col lg:justify-between">
        <div className="pointer-events-none absolute inset-0 opacity-[0.16]">
          <div className="absolute -left-24 top-10 h-[420px] w-[420px] rounded-full bg-[hsl(var(--accent))] blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-[hsl(var(--clay))] blur-[120px]" />
        </div>

        <div className="relative px-12 py-12">
          <p className="eyebrow mb-6 text-[hsl(var(--paper))]/45">Career intelligence</p>
          <p className="display max-w-[460px] text-[46px] leading-[1.02]">
            Your experience deserves better{" "}
            <em className="italic text-[hsl(var(--accent))]" style={{ color: "#8fd4b4" }}>
              presentation.
            </em>
          </p>
          <p className="mt-6 max-w-[380px] text-[13px] leading-relaxed text-[hsl(var(--paper))]/60">
            Folivio reads what you have actually done, finds the language that makes it legible, and
            puts it on paper without adding a single fact.
          </p>

          <ul className="mt-8 space-y-2.5">
            {POINTS.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[12.5px] text-[hsl(var(--paper))]/75">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[hsl(var(--accent))]/20 text-[hsl(var(--accent))]">
                  <Check className="h-2.5 w-2.5" strokeWidth={2.5} />
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative px-12 pb-12">
          <div className="rounded-xl border border-[hsl(var(--paper))]/12 bg-[hsl(var(--paper))]/[0.04] p-4 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-[hsl(var(--accent))]" />
              <span className="eyebrow text-[9px] text-[hsl(var(--paper))]/45">Rewrite, not invention</span>
            </div>
            <p className="mt-3 text-[11.5px] leading-relaxed text-[hsl(var(--paper))]/40 line-through decoration-[hsl(var(--danger))]/50">
              I was responsible for helping with the redesign of the onboarding flow.
            </p>
            <p className="mt-2 text-[12px] leading-relaxed text-[hsl(var(--paper))]/90">
              Led the onboarding redesign, cutting drop-off from 41% to 18% across three markets.
            </p>
            <p className="mt-3 text-[10px] text-[hsl(var(--paper))]/35">
              The number was already in her notes. The engine only found it.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}
