import type { Metadata } from "next";
import { Mail, MapPin, Clock } from "lucide-react";
import { site } from "@/lib/site";
import { PageShell, Section } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Contact",
  description: `Contact ${site.company} about Folivio — the CV studio, portfolio builder, licensing or support.`,
};

export default function ContactPage() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Write to a person, not a form."
      intro="Questions about the studio, licensing Folivio for a careers service, or something in the demo that did not behave? One address reaches the people who build it."
      meta={`${site.companyLine} ${site.location}.`}
    >
      <Section title="Email">
        <p>
          <a
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>{" "}
          is read by {site.company}. Tell us what you are trying to do — build a CV, publish a
          portfolio, run a cohort — and you will get an answer about your case rather than a link to
          a help centre.
        </p>
      </Section>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { icon: Mail, label: "Email", value: site.email, href: `mailto:${site.email}` },
          { icon: MapPin, label: "Based in", value: site.location },
          { icon: Clock, label: "We reply", value: "Within two working days" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="card-flat p-4">
              <Icon className="h-4 w-4 text-[hsl(var(--accent))]" />
              <p className="mt-2.5 text-[8.5px] font-medium uppercase tracking-[0.16em] text-muted/80">
                {item.label}
              </p>
              {item.href ? (
                <a
                  href={item.href}
                  className="mt-1 block text-[11.5px] font-medium text-ink hover:underline"
                >
                  {item.value}
                </a>
              ) : (
                <p className="mt-1 text-[11.5px] font-medium text-ink">{item.value}</p>
              )}
            </div>
          );
        })}
      </div>

      <Section title="Before you write">
        <p>
          This site is a frontend demonstration: your drafts, accounts and portfolios stay in your
          browser and are never transmitted. Anything you send by email is read by {site.company}
          and handled as described in the{" "}
          <a
            href="/privacy"
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
          >
            privacy policy
          </a>
          .
        </p>
      </Section>
    </PageShell>
  );
}
