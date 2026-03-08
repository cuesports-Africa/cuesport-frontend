"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import {
    Loader2,
    Trophy,
    Users,
    Calendar,
    BadgeCheck,
    ChevronLeft,
    ChevronRight,
    Plus,
} from "lucide-react";
import { tournamentApi, type Tournament } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type StatusFilter =
    | "all"
    | "draft"
    | "registration"
    | "active"
    | "completed"
    | "cancelled";

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "draft", label: "Draft" },
    { value: "registration", label: "Registration" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
];

const STATUS_BADGE_STYLES: Record<string, string> = {
    active: "bg-green-500/10 text-green-500 border-green-500/20",
    registration: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    completed: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    draft: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    pending_review: "bg-orange-500/10 text-orange-500 border-orange-500/20",
};

function formatDate(dateString?: string): string {
    if (!dateString) return "No date set";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function StatusBadge({ status }: { status: Tournament["status"] }) {
    const styles = STATUS_BADGE_STYLES[status.value] || STATUS_BADGE_STYLES.draft;
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

function TournamentCard({ tournament }: { tournament: Tournament }) {
    return (
        <Link
            href={`/organizer/tournaments/${tournament.id}`}
            className="card-dark rounded-2xl p-5 border border-border/20 hover:border-border/40 transition-all block group"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-bold text-foreground group-hover:text-electric transition-colors line-clamp-1">
                    {tournament.name}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                    {tournament.verification.is_verified && (
                        <BadgeCheck className="h-4 w-4 text-electric flex-shrink-0" />
                    )}
                    <StatusBadge status={tournament.status} />
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatDate(tournament.dates.starts_at)}
                </span>
                <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {tournament.stats.participants_count} participant{tournament.stats.participants_count !== 1 ? "s" : ""}
                </span>
                <span className="flex items-center gap-1.5">
                    {tournament.entry_fee.is_free ? (
                        <span className="text-green-500 font-medium">Free</span>
                    ) : (
                        <span>{tournament.entry_fee.formatted}</span>
                    )}
                </span>
            </div>

            {tournament.venue.name && (
                <p className="text-xs text-muted-foreground mt-2 truncate">
                    {tournament.venue.name}
                    {tournament.venue.address ? ` - ${tournament.venue.address}` : ""}
                </p>
            )}
        </Link>
    );
}

function EmptyState({ statusFilter }: { statusFilter: StatusFilter }) {
    return (
        <div className="card-dark rounded-2xl p-12 border border-border/20 text-center">
            <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-2xl bg-electric/5 flex items-center justify-center">
                    <Trophy className="h-8 w-8 text-electric/40" />
                </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
                No tournaments found
            </h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
                {statusFilter === "all"
                    ? "You haven't created any tournaments yet. Get started by creating your first tournament."
                    : `You have no ${statusFilter} tournaments.`}
            </p>
            <Link href="/organizer/tournaments/create">
                <Button className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold rounded-xl">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Tournament
                </Button>
            </Link>
        </div>
    );
}

export default function OrganizerTournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<{
        current_page: number;
        last_page: number;
        total: number;
    }>({ current_page: 1, last_page: 1, total: 0 });

    const fetchTournaments = useCallback(
        async (status: StatusFilter, pageNum: number) => {
            setLoading(true);
            try {
                const params: { status?: string; page?: number } = { page: pageNum };
                if (status !== "all") {
                    params.status = status;
                }
                const res = await tournamentApi.myTournaments(params);
                setTournaments(res.data);
                setMeta(res.meta);
            } catch {
                // Silently handle errors — auth guard will redirect if unauthenticated
            } finally {
                setLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        fetchTournaments(statusFilter, page);
    }, [statusFilter, page, fetchTournaments]);

    function handleTabChange(tab: StatusFilter) {
        setStatusFilter(tab);
        setPage(1);
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold text-foreground">My Tournaments</h1>
                <Link href="/organizer/tournaments/create">
                    <Button className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold rounded-xl">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Tournament
                    </Button>
                </Link>
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={cn(
                            "px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap",
                            statusFilter === tab.value
                                ? "bg-electric/10 text-electric"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex items-center justify-center min-h-[40vh]">
                    <Loader2 className="h-8 w-8 animate-spin text-electric" />
                </div>
            ) : tournaments.length === 0 ? (
                <EmptyState statusFilter={statusFilter} />
            ) : (
                <>
                    {/* Tournament Cards */}
                    <div className="space-y-3">
                        {tournaments.map((tournament) => (
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {meta.last_page > 1 && (
                        <div className="flex items-center justify-between mt-8">
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="text-muted-foreground hover:text-foreground disabled:opacity-40"
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" />
                                Previous
                            </Button>
                            <span className="text-sm text-muted-foreground">
                                Page {meta.current_page} of {meta.last_page}
                            </span>
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled={page >= meta.last_page}
                                onClick={() =>
                                    setPage((p) => Math.min(meta.last_page, p + 1))
                                }
                                className="text-muted-foreground hover:text-foreground disabled:opacity-40"
                            >
                                Next
                                <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
