"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, ChevronLeft, BarChart3 } from "lucide-react";
import { tournamentApi, type Tournament } from "@/lib/api";
import { cn } from "@/lib/utils";

interface StandingEntry {
    position: number;
    player: {
        id: number;
        name: string;
        photo_url?: string;
    };
    matches_played: number;
    matches_won: number;
    matches_lost: number;
    frames_won: number;
    frames_lost: number;
    frame_difference: number;
    points: number;
}

const PODIUM_STYLES: Record<number, string> = {
    1: "bg-yellow-500/5 border-l-2 border-l-yellow-500/40",
    2: "bg-gray-400/5 border-l-2 border-l-gray-400/40",
    3: "bg-amber-700/5 border-l-2 border-l-amber-700/40",
};

const POSITION_BADGE_STYLES: Record<number, string> = {
    1: "bg-yellow-500/15 text-yellow-400",
    2: "bg-gray-400/15 text-gray-300",
    3: "bg-amber-700/15 text-amber-500",
};

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

function PositionBadge({ position }: { position: number }) {
    const style = POSITION_BADGE_STYLES[position];
    if (style) {
        return (
            <span
                className={cn(
                    "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold",
                    style
                )}
            >
                {position}
            </span>
        );
    }
    return (
        <span className="inline-flex items-center justify-center w-7 h-7 text-xs font-medium text-muted-foreground">
            {position}
        </span>
    );
}

/* ─── Mobile card for a single standing entry ─── */
function StandingCard({ entry }: { entry: StandingEntry }) {
    const podiumStyle = PODIUM_STYLES[entry.position] || "";
    return (
        <div
            className={cn(
                "card-dark rounded-2xl p-4 border border-border/20",
                podiumStyle
            )}
        >
            <div className="flex items-center gap-3 mb-3">
                <PositionBadge position={entry.position} />
                <PlayerAvatar
                    name={entry.player.name}
                    photoUrl={entry.player.photo_url}
                />
                <span className="text-sm font-semibold text-foreground truncate">
                    {entry.player.name}
                </span>
                <span className="ml-auto text-sm font-bold text-electric">
                    {entry.points} pts
                </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                    <p className="text-muted-foreground mb-0.5">Played</p>
                    <p className="text-foreground font-medium">
                        {entry.matches_played}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground mb-0.5">W / L</p>
                    <p className="text-foreground font-medium">
                        {entry.matches_won} / {entry.matches_lost}
                    </p>
                </div>
                <div>
                    <p className="text-muted-foreground mb-0.5">Frames</p>
                    <p className="text-foreground font-medium">
                        {entry.frames_won}-{entry.frames_lost}{" "}
                        <span
                            className={cn(
                                "text-xs",
                                entry.frame_difference > 0
                                    ? "text-green-400"
                                    : entry.frame_difference < 0
                                    ? "text-red-400"
                                    : "text-muted-foreground"
                            )}
                        >
                            ({entry.frame_difference > 0 ? "+" : ""}
                            {entry.frame_difference})
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function normalizeStandings(raw: unknown[]): StandingEntry[] {
    if (!raw || !Array.isArray(raw) || raw.length === 0) return [];

    const result: StandingEntry[] = [];
    raw.forEach((item: unknown, index: number) => {
        const entry = item as Record<string, unknown>;
        const player = entry.player as Record<string, unknown> | undefined;

        if (!player || typeof player !== "object") return;

        result.push({
            position:
                typeof entry.position === "number"
                    ? entry.position
                    : index + 1,
            player: {
                id: Number(player.id) || 0,
                name: String(player.name || "Unknown"),
                photo_url: player.photo_url
                    ? String(player.photo_url)
                    : undefined,
            },
            matches_played: Number(entry.matches_played) || 0,
            matches_won: Number(entry.matches_won) || 0,
            matches_lost: Number(entry.matches_lost) || 0,
            frames_won: Number(entry.frames_won) || 0,
            frames_lost: Number(entry.frames_lost) || 0,
            frame_difference: Number(entry.frame_difference) || 0,
            points: Number(entry.points) || 0,
        });
    });
    return result;
}

export default function StandingsPage() {
    const params = useParams();
    const id = Number(params.id);

    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [standings, setStandings] = useState<StandingEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [tournamentRes, standingsRes] = await Promise.all([
                tournamentApi.get(id),
                tournamentApi.standings(id),
            ]);
            setTournament(tournamentRes.data);
            setStandings(normalizeStandings(standingsRes.standings));
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to load standings"
            );
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) fetchData();
    }, [id, fetchData]);

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
                    Standings
                </h1>
                {tournament && (
                    <span className="text-sm text-muted-foreground">
                        &mdash; {tournament.name}
                    </span>
                )}
            </div>

            {/* Error banner */}
            {error && (
                <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
                    {error}
                </div>
            )}

            {/* Empty / not-started state */}
            {standings.length === 0 ? (
                <div className="card-dark rounded-2xl p-12 border border-border/20 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-electric/5 flex items-center justify-center">
                            <BarChart3 className="h-8 w-8 text-electric/40" />
                        </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                        No standings available
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Standings will be available once matches are played.
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
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3 w-16">
                                            Pos
                                        </th>
                                        <th className="text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Player
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Played
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Won
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Lost
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Frames (W-L)
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            +/-
                                        </th>
                                        <th className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground px-5 py-3">
                                            Points
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {standings.map((entry) => (
                                        <tr
                                            key={entry.player.id}
                                            className={cn(
                                                "border-b border-border/10 even:bg-muted/20 hover:bg-muted/30 transition-colors",
                                                PODIUM_STYLES[entry.position] || ""
                                            )}
                                        >
                                            <td className="px-5 py-3">
                                                <PositionBadge
                                                    position={entry.position}
                                                />
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="flex items-center gap-3">
                                                    <PlayerAvatar
                                                        name={entry.player.name}
                                                        photoUrl={
                                                            entry.player
                                                                .photo_url
                                                        }
                                                    />
                                                    <span className="font-medium text-foreground">
                                                        {entry.player.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3 text-center text-muted-foreground">
                                                {entry.matches_played}
                                            </td>
                                            <td className="px-5 py-3 text-center text-foreground font-medium">
                                                {entry.matches_won}
                                            </td>
                                            <td className="px-5 py-3 text-center text-muted-foreground">
                                                {entry.matches_lost}
                                            </td>
                                            <td className="px-5 py-3 text-center text-muted-foreground">
                                                {entry.frames_won}-
                                                {entry.frames_lost}
                                            </td>
                                            <td className="px-5 py-3 text-center">
                                                <span
                                                    className={cn(
                                                        "font-medium",
                                                        entry.frame_difference >
                                                            0
                                                            ? "text-green-400"
                                                            : entry.frame_difference <
                                                              0
                                                            ? "text-red-400"
                                                            : "text-muted-foreground"
                                                    )}
                                                >
                                                    {entry.frame_difference > 0
                                                        ? "+"
                                                        : ""}
                                                    {entry.frame_difference}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3 text-center font-bold text-electric">
                                                {entry.points}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ─── Mobile cards ─── */}
                    <div className="md:hidden space-y-3">
                        {standings.map((entry) => (
                            <StandingCard key={entry.player.id} entry={entry} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
