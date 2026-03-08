"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ChevronLeft, Users, UserMinus } from "lucide-react";
import { tournamentApi, type Tournament, type TournamentParticipant } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PARTICIPANT_STATUS_STYLES: Record<string, string> = {
    registered: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    checked_in: "bg-green-500/10 text-green-400 border-green-500/20",
    eliminated: "bg-red-500/10 text-red-400 border-red-500/20",
    winner: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
};

function StatusBadge({ status }: { status: TournamentParticipant["status"] }) {
    const styles =
        PARTICIPANT_STATUS_STYLES[status.value] ||
        PARTICIPANT_STATUS_STYLES.registered;
    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border",
                styles
            )}
        >
            {status.label}
        </span>
    );
}

function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function PlayerAvatar({
    name,
    photoUrl,
}: {
    name: string;
    photoUrl?: string;
}) {
    if (photoUrl) {
        return (
            <img
                src={photoUrl}
                alt={name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
        );
    }
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    return (
        <div className="w-8 h-8 rounded-full bg-muted/40 flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">
            {initials}
        </div>
    );
}

function RemoveButton({
    participant,
    onRemove,
}: {
    participant: TournamentParticipant;
    onRemove: (id: number) => Promise<void>;
}) {
    const [confirming, setConfirming] = useState(false);
    const [removing, setRemoving] = useState(false);

    async function handleConfirm() {
        setRemoving(true);
        try {
            await onRemove(participant.id);
        } finally {
            setRemoving(false);
            setConfirming(false);
        }
    }

    if (confirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                    Remove {participant.player.name.split(" ")[0]}?
                </span>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={removing}
                    className="px-2.5 py-1 text-xs font-medium text-muted-foreground hover:text-foreground rounded-lg transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={removing}
                    className="px-2.5 py-1 text-xs font-medium bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                    {removing && (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    )}
                    Confirm
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors"
        >
            Remove
        </button>
    );
}

/* ─── Mobile card for a single participant ─── */
function ParticipantCard({
    participant,
    onRemove,
}: {
    participant: TournamentParticipant;
    onRemove: (id: number) => Promise<void>;
}) {
    return (
        <div className="card-dark rounded-2xl p-4 border border-border/20">
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 min-w-0">
                    <PlayerAvatar
                        name={participant.player.full_name}
                        photoUrl={participant.player.photo_url}
                    />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">
                            {participant.player.full_name}
                        </p>
                        {participant.player.location && (
                            <p className="text-xs text-muted-foreground truncate">
                                {participant.player.location.full_path}
                            </p>
                        )}
                    </div>
                </div>
                <StatusBadge status={participant.status} />
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground mb-3">
                {participant.seed != null && (
                    <span>
                        Seed: <span className="text-foreground font-medium">#{participant.seed}</span>
                    </span>
                )}
                <span>
                    Rating:{" "}
                    <span className="text-foreground font-medium">
                        {participant.player.rating}
                    </span>{" "}
                    <span className="text-muted-foreground/70">
                        ({participant.player.rating_category})
                    </span>
                </span>
                <span>Registered {formatDate(participant.registered_at)}</span>
            </div>

            <div className="flex justify-end">
                <RemoveButton
                    participant={participant}
                    onRemove={onRemove}
                />
            </div>
        </div>
    );
}

export default function ParticipantsPage() {
    const params = useParams();
    const id = Number(params.id);

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [participants, setParticipants] = useState<TournamentParticipant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tournamentRes, participantsRes] = await Promise.all([
                tournamentApi.get(id),
                tournamentApi.getParticipants(id),
            ]);
            setTournament(tournamentRes.data);
            setParticipants(participantsRes.participants);
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to load participants"
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

    async function handleRemove(participantId: number) {
        try {
            await tournamentApi.removeParticipant(id, participantId);
            await fetchData();
        } catch (err) {
            setError(
                err instanceof Error ? err.message : "Failed to remove participant"
            );
        }
    }

    /* ─── Loading ─── */
    if (loading) {
        return (
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-center min-h-[50vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-electric" />
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Back link */}
            <Link
                href={`/organizer/tournaments/${id}`}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Tournament
            </Link>

            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <h1 className="text-2xl font-bold text-foreground">
                    Participants
                </h1>
                <span className="inline-flex items-center gap-1.5 bg-electric/10 text-electric px-3 py-1 rounded-full text-sm font-semibold">
                    <Users className="h-3.5 w-3.5" />
                    {participants.length}
                </span>
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Empty state */}
            {participants.length === 0 ? (
                <div className="card-dark rounded-2xl p-12 border border-border/20 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-electric/5 flex items-center justify-center">
                            <UserMinus className="h-8 w-8 text-electric/40" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No participants yet
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Participants will appear here once players register for
                        this tournament.
                    </p>
                </div>
            ) : (
                <>
                    {/* ─── Desktop table ─── */}
                    <div className="hidden md:block card-dark rounded-2xl border border-border/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border/10">
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            #
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Player
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Rating
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Location
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Status
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Registered
                                        </th>
                                        <th className="text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map((p) => (
                                        <tr
                                            key={p.id}
                                            className="border-b border-border/10 even:bg-muted/20 hover:bg-muted/30 transition-colors"
                                        >
                                            <td className="px-5 py-3 text-muted-foreground font-medium">
                                                {p.seed != null ? p.seed : "—"}
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <PlayerAvatar
                                                        name={p.player.full_name}
                                                        photoUrl={p.player.photo_url}
                                                    />
                                                    <span className="font-medium text-foreground">
                                                        {p.player.full_name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3">
                                                <span className="text-foreground font-medium">
                                                    {p.player.rating}
                                                </span>
                                                <span className="ml-1.5 text-muted-foreground text-xs">
                                                    {p.player.rating_category}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground max-w-[200px] truncate">
                                                {p.player.location?.full_path || "—"}
                                            </td>
                                            <td className="px-5 py-3">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                                                {formatDate(p.registered_at)}
                                            </td>
                                            <td className="px-5 py-3 text-right">
                                                <RemoveButton
                                                    participant={p}
                                                    onRemove={handleRemove}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ─── Mobile cards ─── */}
                    <div className="md:hidden space-y-3">
                        {participants.map((p) => (
                            <ParticipantCard
                                key={p.id}
                                participant={p}
                                onRemove={handleRemove}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
