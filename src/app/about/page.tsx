import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";
import { PageShell, Section, Bullets } from "@/components/marketing/page-shell";

export const metadata: Metadata = {
  title: "About",
  description:
    "Folivio is an AI CV and portfolio studio from Ivents, built for people whose experience deserves better presentation.",
};

export default function AboutPage() {
  return (
    <PageShell
      eyebrow="About"
      title="Your experience already happened. Folivio makes it readable."
      intro={`Folivio is a career publishing tool from ${site.company}. It takes the work you have actually done and turns it into a CV and a portfolio that read like they were written by someone who knows you.`}
      meta={`${site.companyLine} ${site.location}.`}
    >
      <Section title="What Folivio does">
        <p>
          You bring the roles, the projects and the outcomes. Folivio gives them structure: sections
          that hold up to a recruiter's ten-second scan, templates that behave like a designed
          document rather than a form, and an assistant that suggests sharper phrasing without
          inventing achievements you never had.
        </p>
        <p>
          The same material becomes a shareable portfolio page, so the person reading your CV can
          see the work behind the bullet points.
        </p>
      </Section>

      <Section title="Who it is for">
        <Bullets
          items={[
            "Mid-career and senior professionals whose CV has quietly gone stale.",
            "Career changers who need their existing experience translated, not embellished.",
            "Freelancers and consultants who need one link that shows what they actually do.",
            "People applying across borders, who need formats that survive an ATS as well as a human.",
          ]}
        />
      </Section>

      <Section title="How the intelligence works">
        <p>
          The assistant works from what you have entered. It suggests structure, tightens language
          and points at gaps — it does not fabricate employers, metrics or qualifications. Every
          suggestion is shown to you before it lands in the document, and you can reject any line
          you would not defend in an interview.
        </p>
      </Section>

      <Section title="The build you are looking at">
        <p>
          This site is a frontend demonstration. Accounts, drafts and portfolios are stored in your
          browser; no document is uploaded to a server and nothing is emailed on your behalf.
        </p>
        <p>
          {site.companyLine} For anything commercial, or to talk through employer or institution
          licensing, write to{" "}
          <a
            className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
          .
        </p>
      </Section>

      <p>
        <Link
          href="/products"
          className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
        >
          See what Folivio includes
        </Link>{" "}
        or{" "}
        <Link
          href="/contact"
          className="font-medium text-ink underline decoration-[hsl(var(--accent))]/30 underline-offset-2 hover:decoration-[hsl(var(--accent))]"
        >
          contact the team
        </Link>
        .
      </p>
    </PageShell>
  );
}
