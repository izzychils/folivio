import type { ReactNode } from "react";
import Link from "next/link";
import { MarketingNav } from "./nav";
import { Footer } from "./footer";

/**
 * Shared layout for the editorial detail pages (about, products, contact,
 * privacy, terms) so they inherit the same navigation, type scale and footer
 * as the landing page.
 */
export function PageShell({
  eyebrow,
  title,
  intro,
  meta,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  meta?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />
      <main>
        <section className="mx-auto max-w-[1180px] px-5 pb-10 pt-12 sm:px-8 sm:pt-16">
          <Link
            href="/"
            className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted transition-colors hover:text-ink"
          >
            ← Folivio
          </Link>
          <div className="mt-7 grid gap-6 lg:grid-cols-[1fr_0.45fr] lg:items-end">
            <div>
              <p className="eyebrow">{eyebrow}</p>
              <h1 className="display mt-4 max-w-[760px] text-[clamp(2rem,4.2vw,3.4rem)] text-ink">
                {title}
              </h1>
              <p className="mt-4 max-w-[560px] text-[12.5px] leading-[1.8] text-muted">{intro}</p>
            </div>
            {meta ? (
              <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-muted/70 lg:text-right">
                {meta}
              </p>
            ) : null}
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8">
          <div className="rule mb-8" />
          <div className="grid gap-8 lg:grid-cols-[180px_minmax(0,760px)]">
            <aside className="hidden lg:block">
              <p className="eyebrow text-[8.5px]">Company</p>
              <div className="mt-3 flex flex-col gap-1.5">
                {[
                  { label: "About", href: "/about" },
                  { label: "Products", href: "/products" },
                  { label: "Contact", href: "/contact" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-[11.5px] text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </aside>

            <article className="card-paper min-w-0 p-6 sm:p-9">
              <div className="space-y-8 text-[12px] leading-[1.85] text-muted">{children}</div>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-[15px] font-medium tracking-[-0.01em] text-ink">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}
