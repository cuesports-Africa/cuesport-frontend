"use client";

import { useState, useCallback, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import {
  Trophy,
  MapPin,
  Calendar,
  ChevronLeft,
  Loader2,
  Users,
  DollarSign,
  Clock,
  Target,
  Star,
  User,
  Circle,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tournamentApi, type Tournament, type TournamentParticipant } from "@/lib/api";
import { cn } from "@/lib/utils";

type Tab = "overview" | "participants" | "matches";

function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(dateString: string | null | undefined): string {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700 border-green-200";
    case "registration":
      return "bg-blue-100 text-blue-700 border-blue-200";
    case "completed":
      return "bg-gray-100 text-gray-700 border-gray-200";
    case "cancelled":
      return "bg-red-100 text-red-700 border-red-200";
    case "draft":
    case "pending_review":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

function ParticipantRow({ participant }: { participant: TournamentParticipant }) {
  const player = participant.player;
  return (
    <Link
      href={`/players/${player.id}`}
      className="flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        {participant.seed && (
          <span className="text-xs font-bold text-muted-foreground w-6 text-right">
            #{participant.seed}
          </span>
        )}
        <div className="w-8 h-8 rounded-full bg-muted overflow-hidden flex-shrink-0">
          {player.photo_url ? (
            <Image
              src={player.photo_url}
              alt={player.name}
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
        <div>
          <span className="font-medium text-sm">{player.name}</span>
          {player.location?.name && (
            <p className="text-xs text-muted-foreground">{player.location.name}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm font-semibold">{player.rating}</span>
        {participant.stats && (
          <span className="text-xs text-muted-foreground">
            {participant.stats.matches_won}W-{participant.stats.matches_lost}L
          </span>
        )}
      </div>
    </Link>
  );
}

export default function TournamentDetailClient() {
  const params = useParams();
  const tournamentId = params.id as string;
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const { data: tournamentData, error, isLoading } = useSWR(
    tournamentId ? `tournament|${tournamentId}` : null,
    async () => {
      const res = await tournamentApi.get(Number(tournamentId));
      return res.data;
    },
    { revalidateOnFocus: false }
  );

  const { data: participantsData } = useSWR(
    tournamentId ? `tournament-participants|${tournamentId}` : null,
    async () => {
      const res = await tournamentApi.getParticipants(Number(tournamentId));
      return res.participants;
    },
    { revalidateOnFocus: false }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !tournamentData) {
    return (
      <div className="min-h-screen bg-muted/30">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Tournament Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The tournament you are looking for does not exist or has been removed.
            </p>
            <Button asChild>
              <Link href="/tournaments">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Tournaments
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const tournament = tournamentData;
  const participants = participantsData || [];
  const isLive = tournament.status.value === "active";
  const isRegistrationOpen = tournament.dates.is_registration_open;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Back Navigation */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-4">
          <Link
            href="/tournaments"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Tournaments
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Hero Card */}
        <div className="bg-card rounded-xl border p-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl md:text-3xl font-bold">{tournament.name}</h1>
                {isLive && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-electric bg-electric/10 px-2 py-0.5 rounded-full border border-electric/20">
                    <Circle className="h-2 w-2 fill-electric animate-pulse" />
                    LIVE
                  </span>
                )}
              </div>

              {tournament.description && (
                <p className="text-muted-foreground mb-4 max-w-2xl">
                  {tournament.description}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {tournament.venue?.name && (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {tournament.venue.name}
                    {tournament.venue.address && `, ${tournament.venue.address}`}
                  </span>
                )}
                {tournament.dates.starts_at && (
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(tournament.dates.starts_at)}
                  </span>
                )}
                {tournament.organizer?.name && (
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4" />
                    {tournament.organizer.name}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <span
                className={cn(
                  "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border",
                  getStatusColor(tournament.status.value)
                )}
              >
                {tournament.status.label}
              </span>
              {!tournament.entry_fee.is_free && (
                <span className="text-lg font-bold text-primary">
                  {tournament.entry_fee.formatted}
                </span>
              )}
              {tournament.entry_fee.is_free && (
                <span className="text-lg font-bold text-green-600">
                  Free Entry
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Users className="h-4 w-4" />
              <span className="text-sm">Participants</span>
            </div>
            <div className="text-2xl font-bold">{tournament.stats.participants_count}</div>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Target className="h-4 w-4" />
              <span className="text-sm">Matches</span>
            </div>
            <div className="text-2xl font-bold">{tournament.stats.matches_count}</div>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Trophy className="h-4 w-4" />
              <span className="text-sm">Format</span>
            </div>
            <div className="text-lg font-bold">{tournament.format.label}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Race to {tournament.settings.race_to}
              {tournament.settings.finals_race_to
                ? ` (Finals: ${tournament.settings.finals_race_to})`
                : ""}
            </div>
          </div>

          <div className="bg-card rounded-xl border p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-sm">Entry Fee</span>
            </div>
            <div className="text-2xl font-bold">
              {tournament.entry_fee.is_free ? "Free" : tournament.entry_fee.formatted}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-card rounded-xl border">
          <div className="flex border-b">
            {(["overview", "participants"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-3 text-sm font-medium transition-colors border-b-2",
                  activeTab === tab
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                )}
              >
                {tab === "overview" ? "Overview" : "Participants"}
                {tab === "participants" && ` (${participants.length})`}
              </button>
            ))}
          </div>

          <div className="p-4">
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Tournament Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Tournament Details</h3>
                    <dl className="space-y-3">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Type</dt>
                        <dd className="font-medium">{tournament.type.label}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Format</dt>
                        <dd className="font-medium">{tournament.format.label}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Race To</dt>
                        <dd className="font-medium">{tournament.settings.race_to}</dd>
                      </div>
                      {tournament.settings.finals_race_to && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Finals Race To</dt>
                          <dd className="font-medium">{tournament.settings.finals_race_to}</dd>
                        </div>
                      )}
                      {tournament.geographic_scope && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Scope</dt>
                          <dd className="font-medium">{tournament.geographic_scope.full_path}</dd>
                        </div>
                      )}
                    </dl>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Schedule</h3>
                    <dl className="space-y-3">
                      {tournament.dates.starts_at && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Start Date</dt>
                          <dd className="font-medium">{formatDateTime(tournament.dates.starts_at)}</dd>
                        </div>
                      )}
                      {tournament.dates.ends_at && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">End Date</dt>
                          <dd className="font-medium">{formatDateTime(tournament.dates.ends_at)}</dd>
                        </div>
                      )}
                      {tournament.dates.registration_opens_at && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Registration Opens</dt>
                          <dd className="font-medium">{formatDateTime(tournament.dates.registration_opens_at)}</dd>
                        </div>
                      )}
                      {tournament.dates.registration_closes_at && (
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Registration Closes</dt>
                          <dd className="font-medium">{formatDateTime(tournament.dates.registration_closes_at)}</dd>
                        </div>
                      )}
                    </dl>
                  </div>
                </div>

                {/* Description */}
                {tournament.description && (
                  <div>
                    <h3 className="font-semibold text-lg mb-2">About</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {tournament.description}
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeTab === "participants" && (
              <div>
                {participants.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No participants registered yet.</p>
                  </div>
                ) : (
                  <div className="divide-y">
                    {participants.map((p) => (
                      <ParticipantRow key={p.id} participant={p} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
