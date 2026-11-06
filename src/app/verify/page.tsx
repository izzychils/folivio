import { Metadata } from "next";
import { MarketingNav } from "@/components/marketing/nav";
import { Footer } from "@/components/marketing/footer";
import { VerificationCard } from "@/components/verification-card";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Company Verification | Folivio",
  description:
    "Verify Folivio's official registration and company details. Confirm the authenticity of our platform and services.",
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-paper">
      <MarketingNav />
      
      <main>
        {/* Hero Section */}
        <section className="border-b border-line bg-surface/40">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-[680px] text-center">
              <p className="eyebrow mb-4">Verification</p>
              <h1 className="display text-[36px] leading-[1.04] sm:text-[52px]">
                Confirm Official Registration
              </h1>
              <p className="mx-auto mt-5 max-w-[520px] text-[13px] leading-relaxed text-muted">
                Verify the authenticity of Folivio and confirm official company
                registration details. Enter a registration ID below to view
                verification status.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Card */}
        <section className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
          <VerificationCard />
        </section>

        {/* Info Section */}
        <section className="border-t border-line bg-surface/40">
          <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 sm:py-20">
            <h2 className="display mb-8 text-center text-[28px] sm:text-[34px]">
              Why Verify?
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="card-paper p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-ink">
                  Authenticity
                </h3>
                <p className="text-[12px] leading-relaxed text-muted">
                  Confirm you're working with the official Folivio platform
                  and not an impersonator.
                </p>
              </div>
              <div className="card-paper p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-ink">
                  Trust
                </h3>
                <p className="text-[12px] leading-relaxed text-muted">
                  Verify our registration details, operational status, and
                  compliance certifications.
                </p>
              </div>
              <div className="card-paper p-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-accent">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 text-[14px] font-medium text-ink">
                  Transparency
                </h3>
                <p className="text-[12px] leading-relaxed text-muted">
                  Access public records of our company registration and service
                  offerings.
                </p>
              </div>
            </div>
            <p className="mt-6 text-center text-[10.5px] text-muted">
              Last updated: {site.lastUpdated}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
