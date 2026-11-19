import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.folivio.online"),
  title: {
    default: "Folivio. Your experience deserves better presentation.",
    template: "%s · Folivio",
  },
  description:
    "Folivio turns your real experience into a CV, a portfolio and the language to talk about your work. Career intelligence that never invents a fact.",
  keywords: [
    "CV builder",
    "resume builder",
    "AI CV",
    "portfolio builder",
    "career intelligence",
    "ATS checker",
  ],
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  category: "Career software",
  authors: [{ name: "Folivio" }],
  creator: "Folivio",
  publisher: "Folivio",
  applicationName: "Folivio",
  openGraph: {
    title: "Folivio: career intelligence for people who have done the work",
    description:
      "Career intelligence for people whose experience deserves better presentation.",
    url: "https://www.folivio.online",
    siteName: "Folivio",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Folivio: your experience deserves better presentation",
    description:
      "Turn real experience into a CV and portfolio that reads well: editorial templates, an AI-assisted studio and intelligence that never invents a fact.",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://www.folivio.online/#organization",
      name: "Folivio",
      url: "https://www.folivio.online",
      email: "hello@folivio.online",
      description:
        "Folivio turns real experience into a CV, a portfolio and the language to talk about the work.",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lagos",
        addressCountry: "NG",
      },
    },
    {
      "@type": "WebSite",
      "@id": "https://www.folivio.online/#website",
      url: "https://www.folivio.online",
      name: "Folivio",
      publisher: { "@id": "https://www.folivio.online/#organization" },
      inLanguage: "en",
    },
    {
      "@type": "SoftwareApplication",
      name: "Folivio",
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "CV and portfolio builder",
      operatingSystem: "Web browser",
      url: "https://www.folivio.online",
      description:
        "An AI-assisted career studio: build an ATS-friendly CV and a shareable portfolio from experience you actually have, with cover letters and job matching.",
      featureList: [
        "CV builder with editorial templates",
        "Portfolio builder",
        "Cover letters",
        "Job matching",
        "ATS-friendly exports",
        "Careful AI writing",
      ],
    },
  ],
};

const themeScript = `(function(){try{var t=localStorage.getItem('folivio.v1.theme');if(!t)t='light';var d=t==='dark'||(t==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}else{document.documentElement.classList.remove('dark');document.documentElement.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script id="folivio-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
