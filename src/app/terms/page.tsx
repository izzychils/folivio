import type { Metadata } from "next";
import { site } from "@/lib/site";
import { PageShell, Section, Bullets } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that apply to using ${site.name}, a career publishing product from ${site.company}.`,
};

export default function TermsPage() {
  return (
    <PageShell
      eyebrow="Terms of Service"
      title="What you can expect from us, and what we expect from you."
      intro={`These terms govern your use of ${site.name}, a CV and portfolio studio from ${site.company}. By using the site you accept them.`}
      meta={`Last updated ${site.lastUpdated}`}
    >
      <Section title="Who you are agreeing with">
        <p>
          {site.name} is operated by {site.company}, {site.location}. Where these terms say "we" or
          "us", that is {site.company}; "you" means the person using the site.
        </p>
      </Section>

      <Section title="This is a demonstration build">
        <p>
          The current site is a frontend demo with no backend. Accounts, CV drafts and portfolios
          live only in your browser and disappear if you clear site data. No fee is charged and no
          service obligation is created by using the demo.
        </p>
      </Section>

      <Section title="Your content stays yours">
        <p>
          You own the career history, documents and portfolio material you create. We claim no
          ownership over it. You are responsible for the accuracy of what you publish — Folivio
          presents your claims, it does not verify employers, dates, qualifications or metrics.
        </p>
      </Section>

      <Section title="Acceptable use">
        <Bullets
          items={[
            "Use the site to build and share your own career documents.",
            "Do not submit another person's career history or personal data without their permission.",
            "Do not misrepresent qualifications, employers or credentials in a published document.",
            "Do not attempt to disrupt, reverse engineer or overload the site or its infrastructure.",
            "Do not copy the templates, design or code into another product without permission.",
          ]}
        />
      </Section>

      <Section title="Accounts">
        <p>
          Sign-in on this build is local to your browser. Where real accounts exist, you are
          responsible for keeping credentials secure and for activity under your account, and you
          must tell us promptly if you believe access has been compromised.
        </p>
      </Section>

      <Section title="Fees">
        <p>
          Pricing shown on the site describes a future paid product. Nothing is charged here. Paid
          access would be governed by a separate written agreement with {site.company}.
        </p>
      </Section>

      <Section title="Intellectual property">
        <p>
          The {site.name} name, design, templates, copy and code belong to {site.company} or its
          licensors. Your content remains yours; you grant us only the permission needed to display
          and export it for you.
        </p>
      </Section>

      <Section title="Availability and changes">
        <p>
          The demo is provided as is, without warranties of any kind. We may change, suspend or
          withdraw it at any time. We may update these terms; the date at the top of this page will
          change when we do.
        </p>
      </Section>

      <Section title="Limitation of liability">
        <p>
          To the extent the law allows, {site.company} is not liable for indirect or consequential
          loss, lost profits, lost data or the outcome of an application made using a document built
          here. Nothing limits liability that cannot lawfully be limited.
        </p>
      </Section>

      <Section title="Questions">
        <p>
          Contact{" "}
          <a
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>{" "}
          about these terms, or read the{" "}
          <a
            href="/privacy"
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
          >
            privacy policy
          </a>
          .
        </p>
      </Section>

      <section className="rounded-lg border border-line bg-surface p-4">
        <p className="text-[8.5px] font-medium uppercase tracking-[0.16em] text-muted/80">Demo note</p>
        <p className="mt-2 text-[11px] leading-relaxed text-muted">
          These terms cover a prototype build and are not legal advice. They should be reviewed by a
          qualified lawyer before a production launch.
        </p>
      </section>
    </PageShell>
  );
}
