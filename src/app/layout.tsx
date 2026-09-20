import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";

import { getLayoutSettingsFromDb } from "@/lib/content-db";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const layout = await getLayoutSettingsFromDb();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || layout.canonicalUrl || "https://treqo.org";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: layout.siteTitle || "TREQO",
      template: layout.titleTemplate || "%s | TREQO",
    },
    description:
      layout.metaDescription ||
      "TREQO is a digital marketing learning system built around 70% doing, live brand projects, and capstone revenue proof.",
    keywords: layout.metaKeywords || [
      "Digital Marketing Course",
      "Performance Marketing",
      "Growth Marketing",
      "Marketing School Hyderabad",
      "Live Ad Campaigns",
      "Treqo",
    ],
    authors: [{ name: layout.authorName || "Treqo School of Modern Learning" }],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: siteUrl,
      siteName: layout.siteTitle || "TREQO",
      title:
        layout.ogTitle ||
        layout.siteTitle ||
        "TREQO: LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
      description:
        layout.ogDescription ||
        layout.metaDescription ||
        "TREQO is a digital marketing learning system built around 70% doing, live brand projects, and capstone revenue proof.",
      images: layout.ogImage ? [{ url: layout.ogImage }] : [{ url: "/icon.svg" }],
    },
    twitter: {
      card: layout.twitterCard || "summary_large_image",
      title:
        layout.twitterTitle ||
        layout.ogTitle ||
        layout.siteTitle ||
        "TREQO: The Marketing School",
      description:
        layout.twitterDescription ||
        layout.metaDescription ||
        "LEARN THE SKILLS. BUILD THE MINDSET. BREAK THE PATTERN.",
    },
    robots: {
      index: layout.robotsIndex !== false,
      follow: layout.robotsFollow !== false,
    },
    icons: {
      icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
      shortcut: "/icon.svg",
      apple: "/icon.svg",
    },
    verification: layout.googleSiteVerification
      ? { google: layout.googleSiteVerification }
      : undefined,
  };
}

import { ApplyModalProvider } from "@/context/ApplyModalContext";
import ApplyModal from "@/components/modal/ApplyModal";
import CurriculumModal from "@/components/modal/CurriculumModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-BLPP9TW5NP"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-BLPP9TW5NP');
          `}
        </Script>
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ApplyModalProvider>
          {children}
          <ApplyModal />
          <CurriculumModal />
        </ApplyModalProvider>
      </body>
    </html>
  );
}
