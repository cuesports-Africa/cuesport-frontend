import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import ContactClient from "./contact-client";

export const metadata: Metadata = {
  title: "Contact Us - Get in Touch",
  description:
    "Contact CueSports Africa for tournament inquiries, partnerships, technical support, or general questions. Reach us via email, phone, or WhatsApp.",
  keywords: [
    "contact cuesports africa",
    "pool tournament support",
    "snooker tournament support",
    "tournament organizer help",
    "cuesports africa phone",
    "cuesports africa email",
    "pool tournament inquiry Kenya",
    "snooker partnership Africa",
    "pool federation contact",
    "host pool tournament Africa",
  ],
  openGraph: {
    title: "Contact Us — CueSports Africa",
    description:
      "Have questions? Reach out via email, phone, or WhatsApp. We typically respond within 24 hours.",
    url: "https://cuesports.africa/about/contact",
  },
  alternates: {
    canonical: "https://cuesports.africa/about/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact CueSports Africa",
          url: "https://cuesports.africa/about/contact",
          mainEntity: {
            "@type": "Organization",
            name: "CueSports Africa",
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: "+254-700-000-000",
                contactType: "customer support",
                email: "info@cuesports.africa",
                availableLanguage: ["English", "Swahili"],
                hoursAvailable: {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ],
                  opens: "08:00",
                  closes: "18:00",
                },
              },
            ],
            address: {
              "@type": "PostalAddress",
              addressLocality: "Nairobi",
              addressCountry: "KE",
            },
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: "Home",
              item: "https://cuesports.africa",
            },
            {
              "@type": "ListItem",
              position: 2,
              name: "About",
              item: "https://cuesports.africa/about",
            },
            {
              "@type": "ListItem",
              position: 3,
              name: "Contact",
              item: "https://cuesports.africa/about/contact",
            },
          ],
        }}
      />
      <ContactClient />
    </>
  );
}
