"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";
import { PortfolioView } from "@/components/portfolio/view";
import { Wordmark } from "@/components/ui/logo";
import { readPublishedOne, type PublishedSnapshot } from "@/lib/storage";
import { buttonClass } from "@/lib/button";

export default function PublicPortfolioPage() {
  const params = useParams<{ slug: string | string[] }>();
  const slugParam = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const slug = slugParam ?? "";
  const [snapshot, setSnapshot] = useState<PublishedSnapshot | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSnapshot(readPublishedOne(slug));
    setReady(true);
  }, [slug]);

  if (!ready) {
    return <div className="min-h-screen bg-paper" />;
  }

  if (!snapshot) {
    return (
      <div className="flex min-h-screen flex-col bg-paper">
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" aria-label="Folivio home">
            <Wordmark />
          </Link>
          <Link href="/auth/sign-in" className={buttonClass("secondary", "sm")}>
            Sign in
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-12">
          <div className="w-full max-w-[560px]">
            <p className="eyebrow mb-3">Portfolio link</p>
            <h1 className="display text-[36px] leading-[1.05] sm:text-[44px]">
              This page is not available in this browser.
            </h1>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              Folivio is running without a backend in this preview, so published pages are stored in
              the browser that created them. Open the link on the same device, or publish again from
              the portfolio builder.
            </p>
            <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-line bg-surface/70 p-3.5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted" />
              <p className="text-[11.5px] leading-relaxed text-muted">
                The address requested was{" "}
                <span className="font-mono text-ink">/p/{slug}</span>. If this is someone else&apos;s
                link, their page will render once the hosted backend is in place.
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/dashboard/portfolio" className={buttonClass("primary", "md")}>
                Open the portfolio builder <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/" className={buttonClass("secondary", "md")}>
                Back to the site
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <PortfolioView portfolio={snapshot} />;
}
