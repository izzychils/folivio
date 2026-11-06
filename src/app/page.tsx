import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileText,
  Globe,
  History,
  Layers,
  PenLine,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { Reveal } from "@/components/marketing/reveal";
import { MarketingFaq } from "@/components/marketing/faq";
import { MarketingIntelligence } from "@/components/marketing/intelligence";
import { buttonClass } from "@/lib/button";
import { ScoreRing } from "@/components/ui/surface";
import { CvThumbnail } from "@/components/cv/preview";
import { CV_TEMPLATES } from "@/lib/templates";
import { demoCv } from "@/lib/demo";
import type { CV } from "@/lib/types";

const GALLERY: { cv: CV; label: string; bestFor: string }[] = CV_TEMPLATES.map((template) => ({
  cv: {
    ...demoCv,
    design: {
      ...demoCv.design,
      template: template.id,
      accent: template.accent,
      font: template.font,
      density:
        template.id === "technical" ? "compact" : template.id === "creative" ? "airy" : "balanced",
    },
  },
  label: template.name,
  bestFor: template.bestFor,
}));

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />

      {/* ── hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="underlay-accent pointer-events-none absolute inset-x-0 top-0 h-[620px]" />
        <div className="pointer-events-none absolute right-0 top-24 hidden h-[420px] w-[46%] opacity-[0.35] lg:block">
          <div className="paper-dots h-full w-full" />
        </div>
        <div className="relative mx-auto grid max-w-[1180px] items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pt-20 lg:grid-cols-[1.02fr_0.98fr] lg:gap-6 lg:pb-24 lg:pt-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-line bg-card/70 px-3 py-1.5">
              <span className="live-dot" />
              <span className="eyebrow text-[8.5px] text-ink">Career intelligence, not a template shop</span>
            </div>

            <h1
              className="display mt-6 text-ink"
              style={{ fontSize: "clamp(46px, 7.4vw, 84px)", lineHeight: 0.94, letterSpacing: "-0.035em" }}
            >
              Your experience deserves{" "}
              <em className="italic" style={{ color: "hsl(var(--accent))" }}>
                better presentation.
              </em>
            </h1>

            <p className="mt-6 max-w-[520px] text-[14px] leading-relaxed text-muted sm:text-[15px]">
              Folivio turns the work you have actually done into a CV, a portfolio page and the
              language to explain it. It will structure, reword and challenge you. It will never
              invent a fact.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Link href="/auth/sign-up" className={buttonClass("primary", "lg")}>
                Build your first CV <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/auth/sign-in" className={buttonClass("secondary", "lg")}>
                Explore a sample career
              </Link>
            </div>

            <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
              {["No invented facts", "Six document styles", "Everything stays in your workspace"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Check className="h-3 w-3 text-accent" strokeWidth={2.4} />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <div className="absolute inset-x-6 top-6 h-full rounded-full bg-[hsl(var(--accent))]/10 blur-3xl" />
            <div className="relative rotate-[-2.2deg] overflow-hidden rounded-[3px] border border-line bg-white p-1.5 shadow-[0_50px_90px_-40px_rgb(22_21_15/0.45)]">
              <CvThumbnail cv={demoCv} width={320} className="rounded-[1px]" />
            </div>

            <div className="absolute -left-4 top-14 hidden w-[164px] -rotate-[4deg] rounded-xl border border-line bg-card/97 p-3 shadow-[var(--shadow-lg)] backdrop-blur sm:block">
              <div className="flex items-center gap-2">
                <ScoreRing value={92} size={44} />
                <div>
                  <p className="eyebrow text-[7.5px]">ATS read</p>
                  <p className="text-[11px] font-medium text-ink">Structure holds</p>
                </div>
              </div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line-soft">
                <div className="h-full w-[92%] rounded-full bg-accent" />
              </div>
              <p className="mt-1.5 text-[9px] leading-snug text-muted">Dates, outcomes, sections.</p>
            </div>

            <div className="absolute -right-3 bottom-16 hidden w-[224px] rotate-[2deg] rounded-xl border border-line bg-card/97 p-3 shadow-[var(--shadow-lg)] backdrop-blur sm:block">
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-3 w-3 text-accent" />
                <span className="eyebrow text-[7.5px]">Rewritten from your notes</span>
              </div>
              <p className="mt-1.5 text-[9.5px] leading-relaxed text-muted line-through decoration-[hsl(var(--danger))]/40">
                Helped with onboarding improvements.
              </p>
              <p className="mt-1 text-[10.5px] leading-relaxed text-ink">
                Cut onboarding drop-off from 41% to 18% across three markets.
              </p>
            </div>

            <div className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-card px-3 py-1.5 shadow-[var(--shadow-md)]">
              <span className="flex h-1.5 w-1.5 rounded-full bg-accent" />
              <span className="font-mono text-[8.5px] uppercase tracking-[0.12em] text-muted">
                A4, print ready
              </span>
            </div>
          </div>
        </div>

        <div className="border-y border-line bg-surface/50">
          <div className="mx-auto grid max-w-[1180px] grid-cols-2 divide-x divide-[hsl(var(--line))] px-5 sm:px-8 lg:grid-cols-4">
            {[
              { value: "06", label: "document styles" },
              { value: "12", label: "structural checks" },
              { value: "03", label: "kinds of letter" },
              { value: "00", label: "invented facts" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`px-4 py-5 sm:px-6 ${index < 2 ? "border-b border-line lg:border-b-0" : ""}`}
              >
                <p className="display num text-[30px] leading-none text-ink">{stat.value}</p>
                <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.12em] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── the gap ──────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <p className="eyebrow mb-4">The gap</p>
            <h2 className="display max-w-[440px] text-[36px] leading-[1.04] sm:text-[46px]">
              Most CVs fail on presentation, not on substance.
            </h2>
            <p className="mt-5 max-w-[420px] text-[13px] leading-relaxed text-muted">
              The work is real. It is buried under vague verbs, missing numbers and a layout that
              fights the reader. A recruiter gives it seconds. A parser gives it less.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-4">
              {[
                {
                  number: "01",
                  title: "The experience is there",
                  body: "Eight years of work, real outcomes and a career built on solving difficult problems.",
                },
                {
                  number: "02",
                  title: "The language is thin",
                  body: "Responsible for, helped with, involved in. Job descriptions are written in outcomes. Most CVs are written in duties.",
                },
                {
                  number: "03",
                  title: "The format hides the proof",
                  body: "Columns that confuse parsers, sections without dates, achievements with no numbers attached to them.",
                },
              ].map((item) => (
                <div key={item.number} className="border-t border-line pt-4">
                  <div className="flex items-baseline gap-4">
                    <span className="num font-mono text-[10px] text-muted">{item.number}</span>
                    <div>
                      <h3 className="text-[15px] font-medium text-ink">{item.title}</h3>
                      <p className="mt-1 max-w-[480px] text-[12.5px] leading-relaxed text-muted">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl border border-[hsl(var(--accent))]/20 bg-accent-soft/50 p-4">
              <p className="text-[12.5px] leading-relaxed text-accent-ink">
                The fix is not to add more. It is to find what is already true, and say it clearly.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── product ──────────────────────────────────────────────────────── */}
      <section id="product" className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[560px]">
                <p className="eyebrow mb-4">The product</p>
                <h2 className="display text-[36px] leading-[1.04] sm:text-[48px]">
                  One profile. Every document a career needs.
                </h2>
              </div>
              <p className="max-w-[340px] text-[12.5px] leading-relaxed text-muted">
                Write your history once, properly. Then present different parts of it, for different
                rooms, without retyping a word.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "A CV per opportunity",
                body: "Separate documents with their own target role, style and version history. Tailoring one never touches the others.",
                detail: "PDF, HTML or link",
              },
              {
                icon: Layers,
                title: "Six document styles",
                body: "Modern, classic, executive, academic, creative and technical. Each one built around how that reader actually reads.",
                detail: "Typography, accent and spacing",
              },
              {
                icon: ShieldCheck,
                title: "ATS intelligence",
                body: "Twelve checks across structure, dates, outcomes, keywords and scannability, with the reason behind every result.",
                detail: "Score with explanations",
              },
              {
                icon: Globe,
                title: "A portfolio in a link",
                body: "Turn projects and case studies into a page you can send instead of a PDF. Three editorial themes.",
                detail: "Shareable, no design work",
              },
              {
                icon: PenLine,
                title: "Letters that match",
                body: "Cover letters, personal statements and professional bios drafted from the same facts, tailored to the role.",
                detail: "Four letter types",
              },
              {
                icon: History,
                title: "Nothing gets lost",
                body: "Save a version before a rewrite, restore it in a click. Your history is part of the document, not a folder on your desktop.",
                detail: "Snapshots and restore",
              },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Reveal key={feature.title} delay={index * 40}>
                  <div className="card-paper hover-lift flex h-full flex-col p-5">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                      <Icon className="h-3.5 w-3.5" strokeWidth={1.7} />
                    </span>
                    <h3 className="mt-4 text-[14px] font-medium text-ink">{feature.title}</h3>
                    <p className="mt-1.5 flex-1 text-[12px] leading-relaxed text-muted">{feature.body}</p>
                    <p className="mt-4 flex items-center gap-1.5 border-t border-line-soft pt-3 font-mono text-[9px] uppercase tracking-[0.1em] text-muted">
                      <span className="h-1 w-1 rounded-full bg-accent/70" />
                      {feature.detail}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── intelligence ─────────────────────────────────────────────────── */}
      <section id="intelligence" className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="max-w-[600px]">
            <p className="eyebrow mb-4">The intelligence layer</p>
            <h2 className="display text-[36px] leading-[1.04] sm:text-[48px]">
              The intelligence is in the restraint.
            </h2>
            <p className="mt-4 text-[13px] leading-relaxed text-muted">
              Four things the engine does, and one it refuses to do: add a fact you did not give it.
            </p>
          </div>
        </Reveal>
        <Reveal delay={60} className="mt-8">
          <MarketingIntelligence />
        </Reveal>
      </section>

      {/* ── templates ────────────────────────────────────────────────────── */}
      <section id="templates" className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[520px]">
                <p className="eyebrow mb-4">The library</p>
                <h2 className="display text-[36px] leading-[1.04] sm:text-[48px]">Six ways to be read.</h2>
              </div>
              <p className="max-w-[330px] text-[12.5px] leading-relaxed text-muted">
                A designer and a finance director should not send the same document. Same facts, a
                different reading experience.
              </p>
            </div>
          </Reveal>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {GALLERY.map((item, index) => (
              <Reveal key={item.label} delay={index * 40}>
                <div className="group">
                  <div className="overflow-hidden rounded-[3px] border border-line bg-white shadow-[0_14px_30px_-22px_rgb(0_0_0/0.4)] transition-transform duration-300 group-hover:-translate-y-1">
                    <CvThumbnail cv={item.cv} width={150} className="mx-auto" />
                  </div>
                  <p className="mt-2 text-[11.5px] font-medium text-ink">{item.label}</p>
                  <p className="text-[9.5px] leading-snug text-muted">{item.bestFor}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <p className="mt-6 flex items-center gap-2 text-[10.5px] text-muted">
            <ShieldCheck className="h-3 w-3 text-accent" />
            Every style is single column friendly underneath, so a parser can still read it.
          </p>
        </div>
      </section>

      {/* ── how it works ─────────────────────────────────────────────────── */}
      <section id="how" className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="max-w-[520px]">
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="display text-[36px] leading-[1.04] sm:text-[48px]">
              Three passes, then send.
            </h2>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {[
            {
              number: "01",
              title: "Write the truth",
              body: "Guided questions or an imported document. Roles, dates, outcomes, skills, the direction you want. The assistant asks when something is missing.",
            },
            {
              number: "02",
              title: "Choose the presentation",
              body: "Pick a style for the reader, a target role for the brief, and let the checks show you what a parser and a tired recruiter would see.",
            },
            {
              number: "03",
              title: "Send the right version",
              body: "A print ready PDF, a self-contained HTML file, or a portfolio link. Each version stays saved, so the next application starts from the last one.",
            },
          ].map((step, index) => (
            <Reveal key={step.number} delay={index * 60}>
              <div className="border-t border-line pt-5">
                <p className="num font-mono text-[10px] text-accent">{step.number}</p>
                <h3 className="mt-3 text-[17px] font-medium text-ink">{step.title}</h3>
                <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{step.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── honesty ──────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden" style={{ background: "#16150f", color: "#f6f4ec" }}>
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(40rem 20rem at 15% 0%, rgba(143,212,180,0.18), transparent 60%), radial-gradient(35rem 18rem at 90% 100%, rgba(169,80,42,0.18), transparent 60%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[1180px] gap-10 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="eyebrow mb-4" style={{ color: "rgba(246,244,236,0.45)" }}>
              A rule, not a feature
            </p>
            <h2 className="display max-w-[560px] text-[36px] leading-[1.02] sm:text-[50px]">
              A career document is a promise. The AI should not be the one breaking it.
            </h2>
            <p className="mt-5 max-w-[480px] text-[13px] leading-relaxed" style={{ color: "rgba(246,244,236,0.6)" }}>
              Portfolios are checked, references are called, dates are compared. Anything invented
              eventually falls on the person whose name is at the top of the page. So the engine is
              built to ask, not to fill.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <ul className="space-y-3">
              {[
                {
                  title: "No invented employers, degrees or dates",
                  body: "The structure comes from your history. If a section is empty, it stays empty until you fill it.",
                },
                {
                  title: "No invented metrics",
                  body: "When a bullet needs a number, Folivio says so. It will not guess a percentage.",
                },
                {
                  title: "No invented credentials",
                  body: "Certifications print exactly what you entered, including the issuer and the year.",
                },
              ].map((rule) => (
                <li
                  key={rule.title}
                  className="rounded-xl border p-4"
                  style={{ borderColor: "rgba(246,244,236,0.14)", background: "rgba(246,244,236,0.04)" }}
                >
                  <p className="flex items-start gap-2 text-[13px] font-medium">
                    <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "#8fd4b4" }} />
                    {rule.title}
                  </p>
                  <p className="mt-1.5 pl-5 text-[11.5px] leading-relaxed" style={{ color: "rgba(246,244,236,0.55)" }}>
                    {rule.body}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[10.5px]" style={{ color: "rgba(246,244,236,0.4)" }}>
              This is why the engine can run locally, and why the checks are explainable.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── quotes ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="display text-[32px] leading-none sm:text-[40px]">What early users noticed.</h2>
            <p className="text-[10.5px] uppercase tracking-[0.12em] text-muted">Illustrative feedback</p>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-3 md:grid-cols-3">
          {[
            {
              quote:
                "I had eight years of work and one bad paragraph. The rewrite found the outcomes I had stopped noticing.",
              name: "Product designer",
              detail: "Lagos, 8 years",
            },
            {
              quote:
                "The ATS panel told me my dates were incomplete. That is the boring thing that quietly costs you an interview.",
              name: "Data analyst",
              detail: "Manchester, 4 years",
            },
            {
              quote:
                "I sent a portfolio link instead of a PDF and had a reply the same afternoon. The page did the talking.",
              name: "Frontend engineer",
              detail: "Nairobi, 6 years",
            },
          ].map((item, index) => (
            <Reveal key={item.name} delay={index * 50}>
              <figure className="card-paper flex h-full flex-col p-5">
                <span className="display text-[32px] leading-none text-accent/40">&ldquo;</span>
                <blockquote className="mt-1 flex-1 text-[13px] leading-relaxed text-ink">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-4 border-t border-line-soft pt-3">
                  <p className="text-[11px] font-medium text-ink">{item.name}</p>
                  <p className="text-[10px] text-muted">{item.detail}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="border-y border-line bg-surface/40">
        <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-[520px]">
                <p className="eyebrow mb-4">Pricing</p>
                <h2 className="display text-[36px] leading-[1.04] sm:text-[48px]">Pay for the search, not the format.</h2>
              </div>
              <p className="max-w-[320px] text-[12px] leading-relaxed text-muted">
                Preview build: every plan is unlocked and nothing is charged. Pricing below is the
                intended shape after the backend lands.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                period: "forever",
                description: "For one application you care about.",
                features: ["One CV version", "All six styles", "ATS checks", "PDF and HTML export"],
                cta: "Start free",
                featured: false,
              },
              {
                name: "Pro",
                price: "$9",
                period: "per month",
                description: "For an active search with several versions in play.",
                features: [
                  "Unlimited CV versions",
                  "Cover letters and statements",
                  "Portfolio page and themes",
                  "Version history",
                  "Job match and gap analysis",
                ],
                cta: "Start free",
                featured: true,
              },
              {
                name: "Studio",
                price: "$19",
                period: "per month",
                description: "For a career change, or a practice of one.",
                features: [
                  "Everything in Pro",
                  "Interview preparation",
                  "Career path planning",
                  "Portfolio HTML export",
                  "Priority support",
                ],
                cta: "Start free",
                featured: false,
              },
            ].map((plan, index) => (
              <Reveal key={plan.name} delay={index * 50}>
                <div
                  className={`relative flex h-full flex-col rounded-[var(--radius)] border bg-card p-5 ${
                    plan.featured ? "border-[hsl(var(--accent))]/45 shadow-[var(--shadow-md)]" : "border-line"
                  }`}
                >
                  {plan.featured ? (
                    <span className="absolute -top-2.5 left-5 rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] text-[hsl(var(--paper))]">
                      Most useful
                    </span>
                  ) : null}
                  <p className="text-[12px] font-medium uppercase tracking-[0.1em] text-muted">{plan.name}</p>
                  <div className="mt-3 flex items-baseline gap-1.5">
                    <span className="display num text-[38px] leading-none text-ink">{plan.price}</span>
                    <span className="text-[10.5px] text-muted">{plan.period}</span>
                  </div>
                  <p className="mt-2 text-[11.5px] leading-relaxed text-muted">{plan.description}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[11.5px] text-ink">
                        <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" strokeWidth={2.4} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/auth/sign-up"
                    className={buttonClass(plan.featured ? "primary" : "secondary", "md", "mt-5 w-full")}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── faq ──────────────────────────────────────────────────────────── */}
      <section id="faq" className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="lg:sticky lg:top-24">
              <p className="eyebrow mb-4">Questions</p>
              <h2 className="display max-w-[360px] text-[34px] leading-[1.05] sm:text-[42px]">
                The things people ask before trusting a CV tool.
              </h2>
              <p className="mt-4 max-w-[320px] text-[12px] leading-relaxed text-muted">
                Still unsure? Write to{" "}
                <a href="mailto:hello@folivio.online" className="text-ink underline decoration-line underline-offset-4">
                  hello@folivio.online
                </a>
                . A person reads it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <MarketingFaq />
          </Reveal>
        </div>
      </section>

      {/* ── final call ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-[1180px] px-5 pb-16 sm:px-8 sm:pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[20px] border border-line bg-card px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="underlay-accent pointer-events-none absolute inset-0" />
            <div className="relative">
              <p className="eyebrow mb-4">Start with what you have</p>
              <h2 className="display mx-auto max-w-[760px] text-[36px] leading-[1.02] sm:text-[54px]">
                Your next role will not read the version in your head.
              </h2>
              <p className="mx-auto mt-4 max-w-[460px] text-[13px] leading-relaxed text-muted">
                Write it once. Present it properly. Keep every version, and never start from a blank
                page again.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <Link href="/auth/sign-up" className={buttonClass("primary", "lg")}>
                  Build your CV <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/auth/sign-in" className={buttonClass("secondary", "lg")}>
                  Look inside first
                </Link>
              </div>
              <p className="mt-4 text-[10px] text-muted">
                Free while in preview. No card, no analytics, no upload.
              </p>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
