import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/json-ld";
import { RegisterSW } from "@/components/pwa/register-sw";
import { InstallPrompt } from "@/components/pwa/install-prompt";
import { Providers } from "@/components/providers";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const siteConfig = {
  name: "CueSports Africa",
  description:
    "Africa's premier pool tournament and player management platform. Host tournaments, track Elo ratings, collect entry fees via M-Pesa, and compete from community to national level.",
  url: "https://cuesports.africa",
  ogImage: "https://cuesports.africa/og-image.jpg",
  twitterHandle: "@cuesportsafrica",
  email: "info@cuesports.africa",
  phone: "+254700000000",
  address: {
    city: "Nairobi",
    country: "Kenya",
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Professional Pool Tournament Management`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "pool tournaments",
    "billiards Africa",
    "8-ball tournaments",
    "tournament management software",
    "pool rankings Kenya",
    "Elo rating pool",
    "M-Pesa tournament payments",
    "pool league management",
    "cue sports Africa",
    "professional pool platform",
    "tournament bracket generator",
    "pool player rankings",
  ],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Professional Pool Tournament Management`,
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - Professional Pool Tournament Management`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    images: [siteConfig.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
  },
  category: "Sports",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#05161a" },
    { media: "(prefers-color-scheme: dark)", color: "#05161a" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* PWA Configuration */}
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="CueSports" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="CueSports Africa" />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/logo.png`,
            description: siteConfig.description,
            email: siteConfig.email,
            telephone: siteConfig.phone,
            address: {
              "@type": "PostalAddress",
              addressLocality: siteConfig.address.city,
              addressCountry: siteConfig.address.country,
            },
            sameAs: [
              "https://facebook.com/cuesportsafrica",
              "https://twitter.com/cuesportsafrica",
              "https://instagram.com/cuesportsafrica",
              "https://youtube.com/cuesportsafrica",
            ],
          }}
        />
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: siteConfig.name,
            url: siteConfig.url,
            potentialAction: {
              "@type": "SearchAction",
              target: {
                "@type": "EntryPoint",
                urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
              },
              "query-input": "required name=search_term_string",
            },
          }}
        />
      </head>
      <body
        className={`${sora.variable} font-sans antialiased min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <Providers>
          {children}
        </Providers>
        <RegisterSW />
        <InstallPrompt />
      </body>
    </html>
  );
}
