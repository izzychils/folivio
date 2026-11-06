import type { Metadata } from "next";
import Link from "next/link";
import { buttonClass } from "@/lib/button";
import { site } from "@/lib/site";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Products",
  description:
    "What Folivio includes: the CV studio, editorial templates, career intelligence and the portfolio builder.",
};

const products = [
  {
    name: "CV studio",
    audience: "For the document itself",
    copy: "A structured editor where every line belongs to a real role, project or outcome. Edit once and the layout reflows instead of breaking; export a clean PDF when it is ready.",
    points: ["Structured sections", "ATS-safe export", "Version history"],
  },
  {
    name: "Editorial templates",
    audience: "For how it looks",
    copy: "Document templates designed like a career publication — hairline rules, an editorial serif for statements, a tight grotesque for the details. Not a decorated form.",
    points: ["Print-accurate layouts", "Type-first design", "One-page to long-form"],
  },
  {
    name: "Career intelligence",
    audience: "For how it reads",
    copy: "An assistant grounded in your entries. It tightens phrasing, flags vague bullets and suggests structure, and never invents an employer, date or metric.",
    points: ["Grounded in your entries", "Suggestions you approve", "Gap detection"],
  },
  {
    name: "Portfolio builder",
    audience: "For showing the work",
    copy: "Turn the same material into a shareable page with project detail, links and evidence — the context a CV bullet cannot carry.",
    points: ["Shareable link", "Project detail", "Case-study layout"],
  },
];

export default function ProductsPage() {
  return (
    <PageShell
      eyebrow="Products"
      title="One body of work, four ways to present it."
      intro="Folivio is a single studio with four surfaces that read the same entries. Write once, then publish a CV, a portfolio, or both."
      meta={`${site.companyLine} Free to start.`}
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {products.map((product) => (
          <div key={product.name} className="card-flat p-5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[14.5px] font-medium text-ink">{product.name}</h2>
              <span className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-muted/80">
                {product.audience}
              </span>
            </div>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{product.copy}</p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {product.points.map((point) => (
                <li
                  key={point}
                  className="rounded-full border border-line bg-card px-2.5 py-1 text-[10px] text-muted"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <Section title="Who Folivio serves">
        <p>
          Professionals with real experience and no time to typeset it, career changers who need
          their work translated rather than inflated, freelancers who need one credible link, and
          careers services that want a consistent standard across many people.
        </p>
      </Section>

      <Section title="Try it">
        <p>
          The demo is free and needs no card. Start from an empty studio or from a sample career, and
          see how the document reads before you commit your own history to it.
        </p>
        <p>
          <Link href="/auth/sign-up" className={buttonClass("primary", "md")}>
            Start free
          </Link>
        </p>
      </Section>

      <p>
        <Link
          href="/about"
          className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
        >
          Read about {site.company}
        </Link>{" "}
        or{" "}
        <Link
          href="/contact"
          className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
        >
          get in touch
        </Link>
        .
      </p>
    </PageShell>
  );
}
