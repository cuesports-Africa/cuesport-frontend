"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter, usePathname } from "next/navigation";
import {
  Loader2,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Target,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { tournamentApi, type Tournament } from "@/lib/api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-500/10 text-green-400",
  registration: "bg-blue-500/10 text-blue-400",
  completed: "bg-gray-500/10 text-gray-400",
  draft: "bg-yellow-500/10 text-yellow-400",
  cancelled: "bg-red-500/10 text-red-400",
  pending_review: "bg-orange-500/10 text-orange-400",
};

const SUB_TABS = [
  { label: "Bracket", slug: "bracket" },
  { label: "Matches", slug: "matches" },
  { label: "Participants", slug: "participants" },
  { label: "Standings", slug: "standings" },
] as const;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString?: string): string {
  if (!dateString) return "Not set";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  // Data
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Can-start check
  const [startCheck, setStartCheck] = useState<{
    checked: boolean;
    canStart: boolean;
    issues: string[];
  }>({ checked: false, canStart: false, issues: [] });
  const [checkingStart, setCheckingStart] = useState(false);

  // Cancel flow
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  // Delete flow
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // ------------------------------------------------------------------
  // Fetch tournament
  // ------------------------------------------------------------------

  const fetchTournament = useCallback(async () => {
    try {
      setError(null);
      const res = await tournamentApi.get(id);
      setTournament(res.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load tournament"
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!id || isNaN(id)) {
      setError("Invalid tournament ID");
      setLoading(false);
      return;
    }
    fetchTournament();
  }, [id, fetchTournament]);

  // ------------------------------------------------------------------
  // Clear success messages after a delay
  // ------------------------------------------------------------------

  useEffect(() => {
    if (actionSuccess) {
      const timer = setTimeout(() => setActionSuccess(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [actionSuccess]);

  // ------------------------------------------------------------------
  // Action handlers
  // ------------------------------------------------------------------

  async function handleOpenRegistration() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await tournamentApi.openRegistration(id);
      setTournament(res.tournament);
      setActionSuccess(res.message || "Registration opened successfully.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to open registration"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCloseRegistration() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await tournamentApi.closeRegistration(id);
      setTournament(res.tournament);
      setActionSuccess(res.message || "Registration closed.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to close registration"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCheckStart() {
    setCheckingStart(true);
    setActionError(null);
    try {
      const res = await tournamentApi.canStart(id);
      setStartCheck({
        checked: true,
        canStart: res.can_start,
        issues: res.issues || [],
      });
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to check start readiness"
      );
    } finally {
      setCheckingStart(false);
    }
  }

  async function handleStartTournament() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await tournamentApi.start(id);
      setTournament(res.tournament);
      setStartCheck({ checked: false, canStart: false, issues: [] });
      setActionSuccess(res.message || "Tournament started! Brackets generated.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to start tournament"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleCancel() {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await tournamentApi.cancel(id, { reason: cancelReason });
      setTournament(res.tournament);
      setShowCancelConfirm(false);
      setCancelReason("");
      setActionSuccess(res.message || "Tournament cancelled.");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to cancel tournament"
      );
    } finally {
      setActionLoading(false);
    }
  }

  async function handleDelete() {
    setActionLoading(true);
    setActionError(null);
    try {
      await tournamentApi.delete(id);
      router.push("/organizer/tournaments");
    } catch (err) {
      setActionError(
        err instanceof Error ? err.message : "Failed to delete tournament"
      );
      setActionLoading(false);
    }
  }

  // ------------------------------------------------------------------
  // Render: Loading
  // ------------------------------------------------------------------

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-electric" />
          <p className="text-sm text-muted-foreground">
            Loading tournament...
          </p>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Render: Error
  // ------------------------------------------------------------------

  if (error || !tournament) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="card-dark rounded-2xl p-8 border border-border/20 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-7 w-7 text-red-400" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Tournament not found
          </h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-md mx-auto">
            {error || "The requested tournament could not be loaded."}
          </p>
          <Link href="/organizer/tournaments">
            <Button className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold">
              Back to Tournaments
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ------------------------------------------------------------------
  // Derived values
  // ------------------------------------------------------------------

  const status = tournament.status.value;
  const badgeClass = STATUS_COLORS[status] || STATUS_COLORS.draft;
  const isDraftLike = status === "draft" || status === "pending_review";
  const isRegistration = status === "registration";
  const isActive = status === "active";
  const isFinished = status === "completed" || status === "cancelled";

  // ------------------------------------------------------------------
  // Render: Page
  // ------------------------------------------------------------------

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Back link */}
      <Link
        href="/organizer/tournaments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tournaments
      </Link>

      {/* Header */}
      <div className="card-dark rounded-2xl p-6 border border-border/20">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-foreground truncate">
              {tournament.name}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span
                className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}
              >
                {tournament.status.label}
              </span>
              {tournament.verification.is_verified && (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-green-500/10 text-green-400">
                  <ShieldCheck className="h-3 w-3" />
                  Verified
                </span>
              )}
              {tournament.verification.is_verified === false &&
                status === "pending_review" && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400">
                    Pending Review
                  </span>
                )}
            </div>
          </div>
          {tournament.organizer && (
            <div className="text-sm text-muted-foreground shrink-0">
              Organised by{" "}
              <span className="text-foreground font-medium">
                {tournament.organizer.name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Action feedback */}
      {actionSuccess && (
        <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {actionSuccess}
        </div>
      )}
      {actionError && (
        <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
          <XCircle className="h-4 w-4 shrink-0" />
          {actionError}
        </div>
      )}

      {/* Info grid */}
      <div className="card-dark rounded-2xl p-6 border border-border/20">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Tournament Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {/* Start date */}
          <InfoRow
            icon={Calendar}
            label="Start Date"
            value={formatDate(tournament.dates.starts_at)}
          />

          {/* Registration closes */}
          <InfoRow
            icon={Calendar}
            label="Registration Closes"
            value={formatDate(tournament.dates.registration_closes_at)}
          />

          {/* Format */}
          <InfoRow
            icon={Trophy}
            label="Format"
            value={tournament.format.label}
          />

          {/* Type */}
          <InfoRow
            icon={Target}
            label="Type"
            value={tournament.type.label}
          />

          {/* Entry fee */}
          <InfoRow
            icon={DollarSign}
            label="Entry Fee"
            value={
              tournament.entry_fee.is_free
                ? "Free"
                : tournament.entry_fee.formatted
            }
          />

          {/* Participants */}
          <InfoRow
            icon={Users}
            label="Participants"
            value={String(tournament.stats.participants_count)}
          />

          {/* Race to */}
          <InfoRow
            icon={Target}
            label="Race To"
            value={
              tournament.settings.finals_race_to
                ? `${tournament.settings.race_to} (Finals: ${tournament.settings.finals_race_to})`
                : String(tournament.settings.race_to)
            }
          />

          {/* Location */}
          {tournament.geographic_scope && (
            <InfoRow
              icon={MapPin}
              label="Location"
              value={tournament.geographic_scope.full_path}
            />
          )}

          {/* Venue */}
          {tournament.venue.name && (
            <InfoRow
              icon={MapPin}
              label="Venue"
              value={
                tournament.venue.address
                  ? `${tournament.venue.name} -- ${tournament.venue.address}`
                  : tournament.venue.name
              }
            />
          )}

          {/* Winners count */}
          <InfoRow
            icon={Trophy}
            label="Winners"
            value={String(tournament.settings.winners_count)}
          />
        </div>

        {/* Description */}
        {tournament.description && (
          <div className="mt-6 pt-4 border-t border-border/10">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tournament.description}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {!isFinished && (
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Actions
          </h2>
          <div className="space-y-4">
            {/* ---- DRAFT / PENDING REVIEW ---- */}
            {isDraftLike && (
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleOpenRegistration}
                  disabled={actionLoading}
                  className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Open Registration
                </Button>

                <Button
                  disabled
                  variant="outline"
                  className="border-border/30 text-muted-foreground cursor-not-allowed opacity-50"
                >
                  Edit Tournament
                </Button>

                {/* Delete */}
                {!showDeleteConfirm ? (
                  <Button
                    onClick={() => setShowDeleteConfirm(true)}
                    disabled={actionLoading}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0"
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    Delete
                  </Button>
                ) : (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 w-full sm:w-auto">
                    <p className="text-sm text-red-400 mr-2">
                      Permanently delete this tournament?
                    </p>
                    <Button
                      onClick={handleDelete}
                      disabled={actionLoading}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1 h-auto"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin mr-1" />
                      ) : null}
                      Confirm
                    </Button>
                    <Button
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={actionLoading}
                      variant="ghost"
                      className="text-xs text-muted-foreground hover:text-foreground px-3 py-1 h-auto"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* ---- REGISTRATION ---- */}
            {isRegistration && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleCloseRegistration}
                    disabled={actionLoading}
                    className="bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-0 font-semibold"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Close Registration
                  </Button>

                  <Button
                    onClick={handleCheckStart}
                    disabled={checkingStart || actionLoading}
                    variant="outline"
                    className="border-border/30 text-foreground hover:bg-white/5"
                  >
                    {checkingStart ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Check if Ready to Start
                  </Button>
                </div>

                {/* Start readiness results */}
                {startCheck.checked && (
                  <div
                    className={`rounded-xl border px-4 py-3 ${
                      startCheck.canStart
                        ? "border-green-500/20 bg-green-500/5"
                        : "border-yellow-500/20 bg-yellow-500/5"
                    }`}
                  >
                    {startCheck.canStart ? (
                      <div className="space-y-3">
                        <p className="text-sm text-green-400 flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          Tournament is ready to start!
                        </p>
                        <Button
                          onClick={handleStartTournament}
                          disabled={actionLoading}
                          className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold"
                        >
                          {actionLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Start Tournament
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-yellow-400 font-medium">
                          Cannot start yet. Please resolve the following:
                        </p>
                        <ul className="list-disc list-inside space-y-1">
                          {startCheck.issues.map((issue, i) => (
                            <li
                              key={i}
                              className="text-sm text-yellow-400/80"
                            >
                              {issue}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ---- ACTIVE ---- */}
            {isActive && (
              <div className="space-y-4">
                {!showCancelConfirm ? (
                  <Button
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={actionLoading}
                    className="bg-red-500/10 text-red-400 hover:bg-red-500/20 border-0"
                  >
                    Cancel Tournament
                  </Button>
                ) : (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 space-y-3">
                    <p className="text-sm text-red-400 font-medium">
                      Are you sure you want to cancel this tournament?
                    </p>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1.5">
                        Reason for cancellation
                      </label>
                      <textarea
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        placeholder="Provide a reason for participants..."
                        rows={3}
                        className="w-full rounded-lg border border-border/20 bg-background/50 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-electric/50 resize-none"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        onClick={handleCancel}
                        disabled={actionLoading}
                        className="bg-red-500 hover:bg-red-600 text-white text-sm"
                      >
                        {actionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Confirm Cancellation
                      </Button>
                      <Button
                        onClick={() => {
                          setShowCancelConfirm(false);
                          setCancelReason("");
                        }}
                        disabled={actionLoading}
                        variant="ghost"
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Go Back
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-page navigation tabs */}
      <div className="card-dark rounded-2xl p-6 border border-border/20">
        <nav className="flex gap-2 border-b border-border/20 pb-3 mb-6 overflow-x-auto">
          {SUB_TABS.map((tab) => (
            <Link
              key={tab.slug}
              href={`/organizer/tournaments/${id}/${tab.slug}`}
              className="px-4 py-2 text-sm font-medium whitespace-nowrap rounded-t-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-white/5"
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <p className="text-sm text-muted-foreground text-center py-4">
          Select a tab above to view bracket, matches, participants, or
          standings.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// InfoRow helper component
// ---------------------------------------------------------------------------

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
