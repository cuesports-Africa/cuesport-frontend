"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  Users,
  Plus,
  Search,
  MoreVertical,
  Play,
  Pause,
  XCircle,
  Eye,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tournamentApi, type Tournament } from "@/lib/api";
import { CreateTournamentModal } from "@/components/organizer/create-tournament-modal";

export default function OrganizerTournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchTournaments = async () => {
    try {
      const response = await tournamentApi.myTournaments();
      setTournaments(response.data || []);
    } catch (error) {
      console.error("Failed to fetch tournaments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, []);

  const filteredTournaments = tournaments.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status.value === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string, label: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      registration: "default",
      pending_review: "secondary",
      draft: "outline",
      completed: "secondary",
      cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "secondary"}>{label}</Badge>;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "TBD";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleOpenRegistration = async (id: number) => {
    try {
      await tournamentApi.openRegistration(id);
      await fetchTournaments();
    } catch (error) {
      console.error("Failed to open registration:", error);
    }
  };

  const handleCloseRegistration = async (id: number) => {
    try {
      await tournamentApi.closeRegistration(id);
      await fetchTournaments();
    } catch (error) {
      console.error("Failed to close registration:", error);
    }
  };

  const handleStartTournament = async (id: number) => {
    try {
      await tournamentApi.start(id);
      await fetchTournaments();
    } catch (error) {
      console.error("Failed to start tournament:", error);
    }
  };

  const handleCancelTournament = async (id: number) => {
    if (!confirm("Are you sure you want to cancel this tournament?")) return;
    try {
      await tournamentApi.cancel(id);
      await fetchTournaments();
    } catch (error) {
      console.error("Failed to cancel tournament:", error);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
        {/* Header - hidden on mobile */}
        <div className="hidden sm:flex sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">My Tournaments</h1>
            <p className="text-muted-foreground">Manage your hosted tournaments</p>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-gold text-black hover:bg-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Tournament
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tournaments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { value: "all", label: "All" },
              { value: "draft", label: "Draft" },
              { value: "pending_review", label: "Pending" },
              { value: "registration", label: "Open" },
              { value: "active", label: "Active" },
              { value: "completed", label: "Done" },
            ].map((status) => (
              <Button
                key={status.value}
                variant={statusFilter === status.value ? "default" : "outline"}
                size="sm"
                onClick={() => setStatusFilter(status.value)}
                className={`text-xs px-2.5 h-7 sm:text-sm sm:px-3 sm:h-9 shrink-0 ${
                  statusFilter !== status.value ? "border" : ""
                }`}
              >
                {status.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tournaments Table - Desktop */}
        {isLoading ? (
          <div className="border rounded-lg">
            <div className="p-8 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        ) : filteredTournaments.length > 0 ? (
          <>
            {/* Desktop Table View */}
            <div className="hidden lg:block border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[300px]">Tournament</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Players</TableHead>
                    <TableHead className="text-center">Race To</TableHead>
                    <TableHead className="text-right">Entry</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTournaments.map((tournament) => (
                    <TableRow
                      key={tournament.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => window.location.href = `/organizer/tournaments/${tournament.id}`}
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                            <Trophy className="h-5 w-5 text-gold" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{tournament.name}</p>
                            {tournament.venue?.name && (
                              <p className="text-xs text-muted-foreground truncate">
                                {tournament.venue.name}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(tournament.status.value, tournament.status.label)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(tournament.dates.starts_at)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{Math.max(0, tournament.stats.participants_count)}</span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="font-medium">{tournament.settings?.race_to || 3}</span>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {tournament.entry_fee?.is_free ? "Free" : tournament.entry_fee?.formatted}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/organizer/tournaments/${tournament.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>

                              {!["active", "completed", "cancelled"].includes(tournament.status.value) && (
                                <DropdownMenuItem asChild>
                                  <Link href={`/organizer/tournaments/${tournament.id}?edit=true`}>
                                    <Pencil className="h-4 w-4 mr-2" />
                                    Edit Tournament
                                  </Link>
                                </DropdownMenuItem>
                              )}

                              {tournament.status.value === "draft" && tournament.verification?.is_verified && (
                                <DropdownMenuItem onClick={() => handleOpenRegistration(tournament.id)}>
                                  <Play className="h-4 w-4 mr-2" />
                                  Open Registration
                                </DropdownMenuItem>
                              )}

                              {tournament.status.value === "registration" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleCloseRegistration(tournament.id)}>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Close Registration
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => tournament.can_be_started && handleStartTournament(tournament.id)}
                                    disabled={!tournament.can_be_started}
                                    className={tournament.can_be_started ? "text-green-600 focus:text-green-600" : "opacity-50"}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    {tournament.can_be_started
                                      ? "Start Tournament"
                                      : !tournament.dates.is_start_date_reached
                                        ? `Starts ${new Date(tournament.dates.starts_at || "").toLocaleDateString()}`
                                        : "Start Tournament"}
                                  </DropdownMenuItem>
                                </>
                              )}

                              {!["completed", "cancelled", "active"].includes(tournament.status.value) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem
                                    onClick={() => handleCancelTournament(tournament.id)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Cancel Tournament
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile List View */}
            <div className="lg:hidden divide-y">
              {filteredTournaments.map((tournament) => (
                <Link
                  key={tournament.id}
                  href={`/organizer/tournaments/${tournament.id}`}
                  className="flex items-center gap-3 py-3 active:bg-muted/50"
                >
                  <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center shrink-0">
                    <Trophy className="h-5 w-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{tournament.name}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                      <span>{formatDate(tournament.dates.starts_at)}</span>
                      <span>•</span>
                      <span>{Math.max(0, tournament.stats.participants_count)} players</span>
                      <span>•</span>
                      <span>{tournament.entry_fee?.is_free ? "Free" : tournament.entry_fee?.formatted}</span>
                    </div>
                  </div>
                  <Badge
                    variant={tournament.status.value === "registration" ? "default" : "secondary"}
                    className="text-xs shrink-0"
                  >
                    {tournament.status.value === "registration" ? "Open" : tournament.status.label}
                  </Badge>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <div className="border rounded-lg p-8 lg:p-12 text-center">
            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-7 w-7 lg:h-8 lg:w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base lg:text-lg font-medium mb-1 lg:mb-2">No tournaments found</h3>
            <p className="text-sm lg:text-base text-muted-foreground mb-6 lg:mb-6">
              {searchQuery || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first tournament to get started"}
            </p>
            {/* Button only on desktop - mobile uses FAB */}
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="hidden lg:inline-flex bg-gold text-black hover:bg-gold/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Tournament
            </Button>
          </div>
        )}
      </div>

      {/* Create Tournament Modal */}
      <CreateTournamentModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSuccess={fetchTournaments}
      />

      {/* Floating Action Button - Mobile/PWA only */}
      <button
        onClick={() => setIsCreateModalOpen(true)}
        className="lg:hidden fixed bottom-20 right-4 w-12 h-12 rounded-2xl bg-gold text-black shadow-lg flex items-center justify-center active:scale-95 transition-transform z-50"
      >
        <Plus className="h-5 w-5" />
      </button>
    </div>
  );
}
