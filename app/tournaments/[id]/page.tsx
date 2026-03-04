import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { serverFetch } from "@/lib/api-server";
import { type Tournament } from "@/lib/api";
import TournamentDetailClient from "./tournament-detail-client";

interface TournamentResponse {
  data: Tournament;
}

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * Map the API tournament status to a schema.org EventStatusType.
 */
function getEventStatus(statusValue: string): string {
  switch (statusValue) {
    case "registration":
    case "active":
    case "draft":
    case "pending_review":
      return "https://schema.org/EventScheduled";
    case "completed":
      return "https://schema.org/EventCompleted";
    case "cancelled":
      return "https://schema.org/EventCancelled";
    default:
      return "https://schema.org/EventScheduled";
  }
}

/**
 * Build the SportsEvent JSON-LD object, only including fields that have data.
 */
function buildSportsEventJsonLd(tournament: Tournament, id: string) {
  const url = `https://cuesports.africa/tournaments/${id}`;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const jsonLd: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: tournament.name,
    url,
    eventStatus: getEventStatus(tournament.status.value),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    sport: "Billiards",
    organizer: {
      "@type": "SportsOrganization",
      name: tournament.organizer?.name || "CueSports Africa",
      url: "https://cuesports.africa",
    },
  };

  if (tournament.description) {
    jsonLd.description = tournament.description;
  }

  if (tournament.dates.starts_at) {
    jsonLd.startDate = tournament.dates.starts_at;
  }

  if (tournament.dates.ends_at) {
    jsonLd.endDate = tournament.dates.ends_at;
  }

  // Location
  if (tournament.venue?.name) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location: Record<string, any> = {
      "@type": "Place",
      name: tournament.venue.name,
    };

    // Build address from available data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const address: Record<string, any> = {
      "@type": "PostalAddress",
    };

    if (tournament.venue.address) {
      address.streetAddress = tournament.venue.address;
    }

    if (tournament.geographic_scope?.full_path) {
      address.addressLocality = tournament.geographic_scope.name;
    }

    // Only include address if we have at least one address field
    if (address.streetAddress || address.addressLocality) {
      location.address = address;
    }

    jsonLd.location = location;
  }

  // Offers (entry fee)
  if (tournament.entry_fee) {
    const availability = tournament.dates.is_registration_open
      ? "https://schema.org/InStock"
      : tournament.status.value === "completed" || tournament.status.value === "cancelled"
        ? "https://schema.org/SoldOut"
        : "https://schema.org/PreOrder";

    jsonLd.offers = {
      "@type": "Offer",
      url,
      availability,
      price: tournament.entry_fee.amount,
      priceCurrency: tournament.entry_fee.currency,
    };
  }

  // Maximum attendee capacity
  if (tournament.stats.participants_count > 0) {
    jsonLd.maximumAttendeeCapacity = tournament.stats.participants_count;
  }

  return jsonLd;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: tournament } = await serverFetch<TournamentResponse>(
      `/tournaments/${id}`
    );

    const locationParts: string[] = [];
    if (tournament.venue?.name) locationParts.push(tournament.venue.name);
    if (tournament.geographic_scope?.name) locationParts.push(tournament.geographic_scope.name);
    const locationStr = locationParts.length > 0 ? ` at ${locationParts.join(", ")}` : "";

    const dateStr = tournament.dates.starts_at
      ? ` on ${new Date(tournament.dates.starts_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`
      : "";

    const feeStr = tournament.entry_fee.is_free
      ? "Free entry."
      : `Entry fee: ${tournament.entry_fee.formatted}.`;

    const description = `${tournament.name} -- cue sport tournament${locationStr}${dateStr}. ${tournament.format.label} format, race to ${tournament.settings.race_to}. ${feeStr} ${tournament.stats.participants_count} participants.`.trim();

    return {
      title: `${tournament.name} -- Tournament Details`,
      description,
      openGraph: {
        title: `${tournament.name} -- CueSports Africa`,
        description,
        url: `https://cuesports.africa/tournaments/${id}`,
      },
      alternates: {
        canonical: `https://cuesports.africa/tournaments/${id}`,
      },
    };
  } catch {
    return {
      title: "Tournament -- CueSports Africa",
      description:
        "View cue sport tournament details, brackets, participants, and results on CueSports Africa.",
    };
  }
}

export default async function TournamentPage({ params }: Props) {
  const { id } = await params;

  let tournament: Tournament | null = null;
  try {
    const res = await serverFetch<TournamentResponse>(`/tournaments/${id}`);
    tournament = res.data;
  } catch {
    // Tournament will be fetched client-side as fallback
  }

  return (
    <>
      {tournament && (
        <>
          <JsonLd data={buildSportsEventJsonLd(tournament, id)} />
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
                  name: "Tournaments",
                  item: "https://cuesports.africa/tournaments",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: tournament.name,
                  item: `https://cuesports.africa/tournaments/${id}`,
                },
              ],
            }}
          />
        </>
      )}
      <TournamentDetailClient />
    </>
  );
}
