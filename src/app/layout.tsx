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
  title: "Folivio. Your experience deserves better presentation.",
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
  openGraph: {
    title: "Folivio",
    description:
      "Career intelligence for people whose experience deserves better presentation.",
    type: "website",
  },
};

const themeScript = `(function(){try{var t=localStorage.getItem('folivio.v1.theme');var d=t==='dark'||((!t||t==='system')&&window.matchMedia('(prefers-color-scheme: dark)').matches);if(d){document.documentElement.classList.add('dark');document.documentElement.style.colorScheme='dark';}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${instrument.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <Script id="folivio-theme" strategy="beforeInteractive">
          {themeScript}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
