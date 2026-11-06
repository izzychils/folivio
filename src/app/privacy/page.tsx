import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageShell, Section, Bullets } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${site.name} handles your CV, portfolio and account details. This demo build keeps everything in your browser.`,
};

export default function PrivacyPage() {
  return (
    <PageShell
      eyebrow="Privacy Policy"
      title="Your career history is yours."
      intro={`${site.name} is currently a frontend demonstration with no backend and no analytics service connected. This page explains exactly what that means for the CVs and portfolios you create here.`}
      meta={`Last updated ${site.lastUpdated}`}
    >
      <Section title="Who we are">
        <p>
          {site.name} is a product of {site.company}, {site.location}. For any privacy question, or
          to ask that something be removed, write to{" "}
          <a
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
          .
        </p>
      </Section>

      <Section title="What the demo stores">
        <p>
          Accounts, CV drafts, template choices and portfolio entries are kept in your browser's
          local storage on the device you used. Nothing is sent to a {site.name} server and no
          document is uploaded anywhere.
        </p>
        <p>
          Passwords in the demo are salted and hashed before being stored locally, but this is still
          a browser-only store: do not reuse a real account password in it.
        </p>
      </Section>

      <Section title="What we do not collect">
        <Bullets
          items={[
            "No analytics, advertising identifiers or tracking pixels.",
            "No payment or card details. The demo never asks for a payment method.",
            "No uploaded documents are transmitted or stored.",
            "No data about employers or referees until you type it in yourself.",
            "Nothing is emailed on your behalf.",
          ]}
        />
      </Section>

      <Section title="Your CV content">
        <p>
          Career history is personal data and often reveals more than intended — dates of
          employment, education, sometimes health or family context. In a live {site.name}
          deployment, your documents would be stored on a server you can export from and delete,
          and would never be used to train a model without your explicit choice.
        </p>
        <p>
          The demo assistant reads only the entries in your own browser session.
        </p>
      </Section>

      <Section title="Your choices">
        <p>
          Clear site data for this address in your browser settings to remove everything the demo
          stored, including your account and drafts. To make a request about information you sent us
          by email, use the address above.
        </p>
      </Section>

      <section className="rounded-lg border border-line bg-surface p-4">
        <p className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-muted/80">Demo note</p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          This policy describes a prototype build and is not legal advice. It should be reviewed
          before a production launch.
        </p>
      </section>
    </PageShell>
  );
}
