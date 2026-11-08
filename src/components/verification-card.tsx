"use client";

import { useEffect, useState } from "react";

interface CompanyRecord {
  registrationId: string;
  companyName: string;
  website: string;
  status: string;
  registrationDate: string;
  expiryDate: string;
  planType: string;
  securityCompliance: string;
  headquarters: string;
  country: string;
}

// Official Folivio company records
const companyDatabase: CompanyRecord[] = [
  {
    registrationId: "HC-456882",
    companyName: "Hallcraft",
    website: "hallcraft.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Design & Collaboration Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "FV-738291",
    companyName: "Folivio",
    website: "folivio.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Career Intelligence Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "ES-924567",
    companyName: "Eduschol",
    website: "eduschol.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Education Management Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "JV-582341",
    companyName: "JOVO",
    website: "jovo.ng",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Campus Marketplace Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "LL-673148",
    companyName: "Learning Lab",
    website: "learninglab.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Interactive Science Education Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "SP-819423",
    companyName: "Sideplate",
    website: "sideplate.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Restaurant QR Ordering Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "SQ-345789",
    companyName: "Stoq",
    website: "stoq.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Inventory Management Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
  {
    registrationId: "PQ-761234",
    companyName: "Pharmiq",
    website: "pharmiq.online",
    status: "Verified",
    registrationDate: "2026-01-10",
    expiryDate: "2029-01-09",
    planType: "Pharmacy Management Platform",
    securityCompliance: "ISO 27001 & SOC 2 Type II",
    headquarters: "Lagos",
    country: "Nigeria",
  },
];

export function VerificationCard() {
  const [regIdValue, setRegIdValue] = useState("");
  const [result, setResult] = useState<CompanyRecord | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleVerify = () => {
    const regId = regIdValue.trim().toUpperCase();
    if (!regId) return;

    const found = companyDatabase.find((c) => c.registrationId === regId);
    if (!found) {
      setResult(null);
      setNotFound(true);
      return;
    }

    setResult(found);
    setNotFound(false);
  };

  const handleReset = () => {
    setRegIdValue("");
    setResult(null);
    setNotFound(false);
  };

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const copyLink = () => {
    if (!result) return;
    const link = `${window.location.origin}/verify?id=${result.registrationId}`;
    navigator.clipboard.writeText(link);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const regId = id.toUpperCase();
      setRegIdValue(regId);
      const found = companyDatabase.find((c) => c.registrationId === regId);
      if (found) {
        setResult(found);
      } else {
        setNotFound(true);
      }
    }
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Search Input */}
      <div className="card-paper p-6 sm:p-8">
        <label className="mb-3 block text-[12px] font-medium text-ink">
          Enter Company Registration ID
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            type="text"
            placeholder="e.g., FV-738291"
            value={regIdValue}
            onChange={(e) => setRegIdValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            className="flex-1 rounded-lg border border-line bg-surface px-4 py-3 text-[13px] text-ink placeholder:text-muted focus:border-accent focus:outline-none"
          />
          <button
            onClick={handleVerify}
            className="flex items-center justify-center gap-2 rounded-lg bg-accent px-6 py-3 text-[13px] font-medium text-paper transition hover:opacity-90"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Verify ID
          </button>
        </div>
      </div>

      {/* Success Result */}
      {result && (
        <div className="mt-6 overflow-hidden rounded-lg border border-line bg-card shadow-[var(--shadow-lg)]">
          <div className="border-b border-line bg-accent px-6 py-4 sm:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-[18px] font-semibold text-paper">
                  {result.companyName}
                </h3>
                <p className="mt-1 font-mono text-[11px] text-paper/80">
                  {result.registrationId} • {result.website}
                </p>
              </div>
              <span className="flex items-center gap-1.5 rounded-full bg-[#8fd4b4] px-3 py-1 text-[11px] font-semibold text-[#16150f]">
                <svg
                  className="h-3.5 w-3.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                {result.status}
              </span>
            </div>
          </div>
          <div className="p-6 sm:p-8">
            {/* Location confirmation */}
            <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#8fd4b4]/30 bg-[#8fd4b4]/10 p-4">
              <svg
                className="h-5 w-5 shrink-0"
                style={{ color: "#8fd4b4" }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div>
                <p className="text-[13px] font-medium text-ink">
                  Registered Location Confirmed
                </p>
                <p className="text-[11.5px] text-muted">
                  {result.headquarters}, {result.country}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <DetailBlock
                label="Registration ID"
                value={result.registrationId}
              />
              <DetailBlock label="Official Domain" value={result.website} />
              <DetailBlock
                label="Registration Date"
                value={formatDate(result.registrationDate)}
              />
              <DetailBlock
                label="Expiry Date"
                value={formatDate(result.expiryDate)}
              />
              <DetailBlock label="Service Type" value={result.planType} />
              <DetailBlock
                label="Security Compliance"
                value={result.securityCompliance}
              />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={copyLink}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-surface px-5 py-3 text-[12px] font-medium text-ink transition hover:bg-line-soft"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy Link
              </button>
              <button
                onClick={() => window.print()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-accent px-5 py-3 text-[12px] font-medium text-paper transition hover:opacity-90"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Not Found */}
      {notFound && (
        <div className="card-paper mt-6 p-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--danger))]/10">
            <svg
              className="h-7 w-7"
              style={{ color: "hsl(var(--danger))" }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-[16px] font-semibold text-ink">
            Record Not Found
          </h3>
          <p className="mb-6 text-[12.5px] text-muted">
            No record found for this Registration ID. Please check the ID and
            try again.
          </p>
          <button
            onClick={handleReset}
            className="rounded-lg border border-line bg-surface px-5 py-2.5 text-[12px] font-medium text-ink transition hover:bg-line-soft"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Quick Demo Info */}
      <div className="mt-6 rounded-lg border border-line bg-surface/50 p-5 text-center">
        <p className="mb-3 text-[11.5px] text-muted">
          Try a sample Registration ID:
        </p>
        <button
          onClick={() => {
            setRegIdValue("FV-738291");
            setResult(null);
            setNotFound(false);
          }}
          className="rounded-lg border border-line bg-card px-4 py-2 font-mono text-[12px] font-medium text-ink transition hover:bg-surface"
        >
          FV-738291
        </button>
      </div>
    </div>
  );
}

function DetailBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4">
      <p className="mb-1 text-[10.5px] uppercase tracking-[0.08em] text-muted">{label}</p>
      <p className="text-[13px] font-medium text-ink">{value}</p>
    </div>
  );
}
