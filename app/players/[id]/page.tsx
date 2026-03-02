import { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { serverFetch } from "@/lib/api-server";
import PlayerClient from "./player-client";

interface PlayerData {
  player: {
    id: number;
    first_name: string;
    last_name: string;
    nickname?: string;
    photo_url?: string;
    rating: number;
    rating_category: string;
    total_matches: number;
    wins: number;
    losses: number;
    win_rate: number;
    tournaments_played: number;
    tournaments_won: number;
    location: {
      name: string;
      full_path: string;
    };
    member_since: string;
  };
}

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  try {
    const data = await serverFetch<PlayerData>(`/players/${id}`);
    const player = data.player;
    const fullName = `${player.first_name} ${player.last_name}`;

    return {
      title: `${fullName} — Player Profile`,
      description: `${fullName} — ${player.rating_category} rated ${player.rating}. ${player.total_matches} matches played, ${player.win_rate?.toFixed(1)}% win rate. ${player.location?.full_path || ""}`.trim(),
      openGraph: {
        title: `${fullName} — CueSports Africa`,
        description: `Rating: ${player.rating} | Win Rate: ${player.win_rate?.toFixed(1)}% | Matches: ${player.total_matches}`,
        url: `https://cuesports.africa/players/${id}`,
        ...(player.photo_url && {
          images: [{ url: player.photo_url }],
        }),
      },
      alternates: {
        canonical: `https://cuesports.africa/players/${id}`,
      },
    };
  } catch {
    return {
      title: "Player Profile — CueSports Africa",
      description: "View player profile, stats, and match history.",
    };
  }
}

export default async function PlayerPage({ params }: Props) {
  const { id } = await params;

  let player: PlayerData["player"] | null = null;
  try {
    const data = await serverFetch<PlayerData>(`/players/${id}`);
    player = data.player;
  } catch {
    // Player will be fetched client-side as fallback
  }

  return (
    <>
      {player && (
        <>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "Person",
              name: `${player.first_name} ${player.last_name}`,
              url: `https://cuesports.africa/players/${id}`,
              ...(player.photo_url && { image: player.photo_url }),
              ...(player.location?.full_path && {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: player.location.name,
                },
              }),
              description: `${player.rating_category} pool player rated ${player.rating}. ${player.total_matches} matches, ${player.win_rate?.toFixed(1)}% win rate.`,
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
                  name: "Players",
                  item: "https://cuesports.africa/players",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: `${player.first_name} ${player.last_name}`,
                  item: `https://cuesports.africa/players/${id}`,
                },
              ],
            }}
          />
        </>
      )}
      <PlayerClient />
    </>
  );
}
