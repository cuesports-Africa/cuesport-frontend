"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  ArrowUpRight,
  Loader2,
  Plus,
  Wallet as WalletIcon,
  AlertCircle,
  Check,
  RefreshCw,
  Smartphone,
  Building2,
  ChevronRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  walletApi,
  type WalletOverview,
  type PayoutMethod,
  type PayoutRequest,
} from "@/lib/api";
import { cn } from "@/lib/utils";

const REFRESH_INTERVAL = 30_000;
const PAGE_SIZE = 20;

type Tab = "transactions" | "payouts";
type TxFilter = "all" | "credit" | "debit";

// ───────────────────────────────────────────────
// Formatters
// ───────────────────────────────────────────────

function fmtKES(amount: number): string {
  return new Intl.NumberFormat("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function fmtKESCompact(amount: number): string {
  if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 10_000) return `${(amount / 1_000).toFixed(1)}K`;
  return fmtKES(amount);
}

function fmtDateAbs(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }) +
    " · " +
    d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

function fmtRelative(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

// ───────────────────────────────────────────────
// Status indicator — dot + mono label, editorial
// ───────────────────────────────────────────────

const STATUS_DOT: Record<string, string> = {
  pending: "bg-gold",
  approved: "bg-navy",
  processing: "bg-navy animate-pulse",
  completed: "bg-emerald-600",
  failed: "bg-destructive",
  cancelled: "bg-mute",
};

function StatusDot({ status, label }: { status: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.2em] text-ink">
      <span
        aria-hidden
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          STATUS_DOT[status] || "bg-mute"
        )}
      />
      {label}
    </span>
  );
}

// ───────────────────────────────────────────────
// Method icon
// ───────────────────────────────────────────────

function MethodIcon({ type }: { type: PayoutMethod["type"] }) {
  if (type === "bank") return <Building2 className="h-4 w-4" />;
  return <Smartphone className="h-4 w-4" />;
}

function methodLabel(m: PayoutMethod): string {
  return `${m.type_label} · ${m.masked_account_number}`;
}

// ───────────────────────────────────────────────
// Hero — available balance + request payout CTA
// ───────────────────────────────────────────────

function WalletHero({
  overview,
  lastFetched,
  refreshing,
  onRefresh,
  onRequest,
  canRequest,
}: {
  overview: WalletOverview;
  lastFetched: number;
  refreshing: boolean;
  onRefresh: () => void;
  onRequest: () => void;
  canRequest: boolean;
}) {
  return (
    <section className="border border-rule rounded-lg bg-canvas p-6 sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Available to withdraw
        </p>
        <button
          onClick={onRefresh}
          disabled={refreshing}
          aria-label="Refresh balance"
          className="inline-flex h-7 w-7 items-center justify-center rounded-md text-mute-2 transition-colors hover:bg-bone hover:text-ink disabled:opacity-50"
        >
          <RefreshCw
            className={cn("h-3.5 w-3.5", refreshing && "animate-spin")}
          />
        </button>
      </div>

      <div className="mt-3 flex items-baseline gap-3">
        <span className="font-mono text-[14px] uppercase tracking-[0.2em] text-mute">
          {overview.wallet.currency || "KES"}
        </span>
        <span className="text-[clamp(2.5rem,7vw,4.25rem)] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-ink">
          {fmtKES(overview.available_balance)}
        </span>
      </div>

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
        Updated {fmtRelative(new Date(lastFetched).toISOString())}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button
          onClick={onRequest}
          disabled={!canRequest}
          className="group inline-flex h-11 items-center gap-2 rounded-pill bg-ink px-5 text-[13px] font-bold text-white transition-colors hover:bg-navy disabled:opacity-40"
        >
          Request payout
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Button>
        {!canRequest && (
          <p className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-mute-2">
            {overview.available_balance <= 0
              ? "Nothing to withdraw yet"
              : "Add a payout method first"}
          </p>
        )}
      </div>
    </section>
  );
}

// ───────────────────────────────────────────────
// Stats strip — 4 cells
// ───────────────────────────────────────────────

function StatCell({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="border border-rule rounded-lg p-4 sm:p-5">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
        {label}
      </p>
      <p className="mt-2 text-[20px] sm:text-[22px] font-extrabold leading-none tracking-[-0.01em] tabular-nums text-ink">
        {value}
      </p>
      {hint && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
          {hint}
        </p>
      )}
    </div>
  );
}

function StatsStrip({
  overview,
  methodsCount,
}: {
  overview: WalletOverview;
  methodsCount: number;
}) {
  const currency = overview.wallet.currency || "KES";
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <StatCell
        label="Pending"
        value={`${currency} ${fmtKESCompact(overview.wallet.pending_balance)}`}
        hint="Awaiting clearance"
      />
      <StatCell
        label="Total earned"
        value={`${currency} ${fmtKESCompact(overview.wallet.total_earned)}`}
        hint="Lifetime"
      />
      <StatCell
        label="Total withdrawn"
        value={`${currency} ${fmtKESCompact(overview.wallet.total_withdrawn)}`}
        hint="All payouts"
      />
      <StatCell
        label="Payout methods"
        value={String(methodsCount)}
        hint={methodsCount === 0 ? "Add one to withdraw" : "Manage in settings"}
      />
    </div>
  );
}

// ───────────────────────────────────────────────
// Default method strip
// ───────────────────────────────────────────────

function DefaultMethodStrip({
  methods,
  onAdd,
}: {
  methods: PayoutMethod[];
  onAdd: () => void;
}) {
  const defaultMethod = methods.find((m) => m.is_default) || methods[0];

  if (!defaultMethod) {
    return (
      <div className="flex items-center justify-between gap-4 border border-rule rounded-lg p-4 sm:p-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
            Payout method
          </p>
          <p className="mt-1.5 text-[14px] font-medium text-ink">
            Add an M-Pesa number or bank account to receive payouts.
          </p>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex h-9 items-center gap-2 rounded-pill border border-rule bg-canvas px-4 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
        >
          <Plus className="h-3.5 w-3.5" />
          Add method
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-4 border border-rule rounded-lg p-4 sm:p-5">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-rule bg-bone text-ink">
          <MethodIcon type={defaultMethod.type} />
        </div>
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
            Default payout method
          </p>
          <p className="mt-1 text-[14px] font-semibold text-ink truncate">
            {methodLabel(defaultMethod)}
          </p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2 truncate">
            {defaultMethod.account_name}
          </p>
        </div>
      </div>
      <button
        onClick={onAdd}
        className="inline-flex h-9 items-center gap-1 rounded-pill border border-rule bg-canvas px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
      >
        Manage
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// ───────────────────────────────────────────────
// Tabs — editorial gold-underline pattern
// ───────────────────────────────────────────────

function WalletTabs({
  active,
  onChange,
  txCount,
  payoutCount,
}: {
  active: Tab;
  onChange: (t: Tab) => void;
  txCount?: number;
  payoutCount?: number;
}) {
  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "transactions", label: "Transactions", count: txCount },
    { id: "payouts", label: "Payouts", count: payoutCount },
  ];
  return (
    <div className="border-b border-rule">
      <div className="flex items-center gap-1">
        {tabs.map((t) => {
          const isActive = active === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id)}
              className={cn(
                "relative inline-flex items-center gap-2 px-3 sm:px-4 py-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] transition-colors",
                isActive
                  ? "text-ink"
                  : "text-mute-2 hover:text-ink"
              )}
            >
              {t.label}
              {typeof t.count === "number" && (
                <span
                  className={cn(
                    "tabular-nums font-mono text-[10px]",
                    isActive ? "text-mute" : "text-mute-2"
                  )}
                >
                  {t.count}
                </span>
              )}
              {isActive && (
                <span
                  aria-hidden
                  className="absolute left-3 right-3 sm:left-4 sm:right-4 -bottom-px h-[2px] bg-gold"
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Filter pills
// ───────────────────────────────────────────────

function FilterPills({
  active,
  onChange,
  counts,
}: {
  active: TxFilter;
  onChange: (f: TxFilter) => void;
  counts: Record<TxFilter, number | undefined>;
}) {
  const pills: { id: TxFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "credit", label: "Credits" },
    { id: "debit", label: "Debits" },
  ];
  return (
    <div className="flex flex-wrap items-center gap-2">
      {pills.map((p) => {
        const isActive = active === p.id;
        const count = counts[p.id];
        return (
          <button
            key={p.id}
            onClick={() => onChange(p.id)}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-pill border px-3.5 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] transition-colors",
              isActive
                ? "border-ink bg-ink text-white"
                : "border-rule bg-canvas text-ink hover:bg-bone"
            )}
          >
            {p.label}
            {typeof count === "number" && (
              <span
                className={cn(
                  "tabular-nums",
                  isActive ? "text-white/70" : "text-mute-2"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ───────────────────────────────────────────────
// Transaction row
// ───────────────────────────────────────────────

interface TxRow {
  id: number;
  type: "credit" | "debit";
  source: string;
  amount: number;
  balance_after: number;
  currency: string;
  description?: string;
  created_at: string;
}

function TransactionRow({ tx }: { tx: TxRow }) {
  const isCredit = tx.type === "credit";
  const sign = isCredit ? "+" : "−";
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 px-4 sm:px-5 py-4 border-b border-rule last:border-b-0 transition-colors hover:bg-bone/40">
      <div
        className={cn(
          "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border",
          isCredit
            ? "border-emerald-600/40 bg-emerald-600/[0.06] text-emerald-700"
            : "border-rule bg-bone text-mute"
        )}
      >
        <ArrowUpRight
          className={cn(
            "h-4 w-4",
            isCredit ? "rotate-180" : "" // credit = arrow-down (incoming)
          )}
        />
      </div>
      <div className="min-w-0">
        <p className="text-[14px] font-semibold text-ink truncate">
          {tx.description || tx.source}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
          <span>{tx.source}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">{fmtDateAbs(tx.created_at)}</span>
          <span aria-hidden>·</span>
          <span className="tabular-nums">
            Bal {tx.currency} {fmtKES(tx.balance_after)}
          </span>
        </div>
      </div>
      <div
        className={cn(
          "text-right font-mono text-[15px] font-bold tabular-nums",
          isCredit ? "text-ink" : "text-mute"
        )}
      >
        <span className={cn(isCredit && "text-gold")}>{sign}</span>{" "}
        {fmtKES(tx.amount)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Payout row
// ───────────────────────────────────────────────

function PayoutRow({ p }: { p: PayoutRequest }) {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 px-4 sm:px-5 py-4 border-b border-rule last:border-b-0 transition-colors hover:bg-bone/40">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-md border border-rule bg-bone text-ink">
        <MethodIcon type={p.payout_method.type} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <p className="text-[14px] font-semibold text-ink truncate">
            {methodLabel(p.payout_method)}
          </p>
          <StatusDot status={p.status} label={p.status_label} />
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-mute-2">
          <span>Requested {fmtDateAbs(p.requested_at)}</span>
          {p.completed_at && (
            <>
              <span aria-hidden>·</span>
              <span>Completed {fmtDateAbs(p.completed_at)}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right font-mono text-[15px] font-bold tabular-nums text-ink">
        {p.currency} {fmtKES(p.amount)}
      </div>
    </div>
  );
}

// ───────────────────────────────────────────────
// Skeleton row
// ───────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="grid grid-cols-[auto,1fr,auto] items-center gap-4 px-4 sm:px-5 py-4 border-b border-rule last:border-b-0">
      <div className="h-9 w-9 rounded-md bg-bone animate-pulse" />
      <div>
        <div className="h-3.5 w-40 rounded bg-bone animate-pulse" />
        <div className="mt-2 h-2.5 w-56 rounded bg-bone animate-pulse" />
      </div>
      <div className="h-4 w-20 rounded bg-bone animate-pulse" />
    </div>
  );
}

// ───────────────────────────────────────────────
// Empty state
// ───────────────────────────────────────────────

function EmptyBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="px-6 py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
        Empty
      </p>
      <h3 className="mt-3 text-[18px] font-bold text-ink">{title}</h3>
      <p className="mt-2 max-w-md mx-auto text-[14px] text-mute">{body}</p>
    </div>
  );
}

// ───────────────────────────────────────────────
// Request Payout Sheet
// ───────────────────────────────────────────────

function RequestPayoutSheet({
  open,
  onOpenChange,
  available,
  currency,
  methods,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  available: number;
  currency: string;
  methods: PayoutMethod[];
  onSuccess: () => void;
}) {
  const defaultId = methods.find((m) => m.is_default)?.id ?? methods[0]?.id;
  const [amount, setAmount] = useState("");
  const [methodId, setMethodId] = useState<number | undefined>(defaultId);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // sync default if methods change
  useMemo(() => {
    if (!methodId && defaultId) setMethodId(defaultId);
  }, [defaultId, methodId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (amt > available) {
      setError(`Amount exceeds available balance (${currency} ${fmtKES(available)}).`);
      return;
    }
    if (!methodId) {
      setError("Pick a payout method.");
      return;
    }
    setSubmitting(true);
    try {
      await walletApi.requestPayout({ amount: amt, payout_method_id: methodId });
      setAmount("");
      onSuccess();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payout request failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 bg-canvas border-l border-rule"
      >
        <SheetHeader className="px-6 py-5 border-b border-rule">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
            01 · Withdraw
          </p>
          <SheetTitle className="mt-2 text-[22px] font-extrabold tracking-[-0.02em] text-ink">
            Request payout
          </SheetTitle>
          <p className="mt-1 text-[13px] text-mute">
            Funds settle to your default payout method.
          </p>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Available */}
          <div className="border border-rule rounded-md px-4 py-3 bg-bone/40">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
              Available
            </p>
            <p className="mt-1 font-mono text-[18px] font-bold tabular-nums text-ink">
              {currency} {fmtKES(available)}
            </p>
          </div>

          {/* Amount */}
          <div>
            <Label
              htmlFor="payout-amount"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2"
            >
              Amount ({currency})
            </Label>
            <div className="relative">
              <Input
                id="payout-amount"
                type="number"
                step="0.01"
                min="0"
                max={available}
                inputMode="decimal"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="h-12 rounded-md border-rule bg-canvas px-4 pr-20 text-[15px] tabular-nums tracking-[0.02em] transition-colors placeholder:text-mute-2 focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)]"
              />
              <button
                type="button"
                onClick={() => setAmount(String(available))}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 items-center rounded-pill border border-rule bg-canvas px-3 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
              >
                Max
              </button>
            </div>
          </div>

          {/* Method */}
          <div>
            <Label
              htmlFor="payout-method"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2"
            >
              Payout method
            </Label>
            {methods.length === 0 ? (
              <p className="text-[13px] text-mute">
                No payout methods on file. Add one from settings to enable withdrawals.
              </p>
            ) : (
              <Select
                value={methodId ? String(methodId) : undefined}
                onValueChange={(v) => setMethodId(Number(v))}
              >
                <SelectTrigger
                  id="payout-method"
                  className="h-12 rounded-md border-rule bg-canvas text-[14px] focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)]"
                >
                  <SelectValue placeholder="Select a method" />
                </SelectTrigger>
                <SelectContent className="rounded-md border-rule bg-canvas">
                  {methods.map((m) => (
                    <SelectItem key={m.id} value={String(m.id)}>
                      <span className="inline-flex items-center gap-2">
                        <MethodIcon type={m.type} />
                        {methodLabel(m)}
                        {m.is_default && (
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2">
                            · default
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="px-4 py-3 rounded-md border border-destructive/30 bg-destructive/[0.04] text-destructive text-[13px]"
            >
              {error}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="inline-flex h-11 items-center justify-center rounded-pill border border-rule bg-canvas px-5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
            >
              Cancel
            </button>
            <Button
              type="submit"
              disabled={submitting || methods.length === 0}
              className="group flex-1 h-11 rounded-pill bg-ink text-[13px] font-bold text-white transition-colors hover:bg-navy disabled:opacity-40"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <Check className="h-4 w-4" />
                  Confirm payout
                </span>
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}

// ───────────────────────────────────────────────
// Page
// ───────────────────────────────────────────────

export default function WalletPage() {
  const [tab, setTab] = useState<Tab>("transactions");
  const [txFilter, setTxFilter] = useState<TxFilter>("all");
  const [txPage, setTxPage] = useState(1);
  const [sheetOpen, setSheetOpen] = useState(false);

  const overviewSWR = useSWR(
    "wallet:overview",
    () => walletApi.getOverview(),
    { refreshInterval: REFRESH_INTERVAL, revalidateOnFocus: true }
  );

  const methodsSWR = useSWR(
    "wallet:methods",
    () => walletApi.getPayoutMethods()
  );

  const txSWR = useSWR(
    ["wallet:tx", txPage],
    () => walletApi.getTransactions({ page: txPage, per_page: PAGE_SIZE }),
    { refreshInterval: REFRESH_INTERVAL }
  );

  const payoutsSWR = useSWR(
    "wallet:payouts",
    () => walletApi.getPayoutRequests({ per_page: PAGE_SIZE }),
    { refreshInterval: REFRESH_INTERVAL }
  );

  const overview = overviewSWR.data;
  const methods = methodsSWR.data?.payout_methods ?? [];
  const allTx = txSWR.data?.transactions ?? [];
  const payouts = payoutsSWR.data?.payouts ?? [];

  const filteredTx = useMemo(() => {
    if (txFilter === "all") return allTx;
    return allTx.filter((t) => t.type === txFilter);
  }, [allTx, txFilter]);

  const txCounts = useMemo(() => {
    const credit = allTx.filter((t) => t.type === "credit").length;
    const debit = allTx.length - credit;
    return { all: allTx.length, credit, debit };
  }, [allTx]);

  const lastFetched = overviewSWR.data
    ? Date.now() - (Date.now() % 1000)
    : Date.now();
  const canRequest =
    !!overview && overview.available_balance > 0 && methods.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6 lg:space-y-8">
      {/* ── Header ───────────────────────────────── */}
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          01 · Organiser · Wallet
        </p>
        <h1 className="mt-3 text-[clamp(1.75rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
          Your wallet.
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.55] text-mute">
          Earnings, payouts, and the ledger — kept clean.
        </p>
      </header>

      {/* ── Hero ─────────────────────────────────── */}
      {overviewSWR.error ? (
        <div className="border border-destructive/30 bg-destructive/[0.04] rounded-lg p-6">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
            <div>
              <p className="text-[14px] font-semibold text-ink">
                Couldn&rsquo;t load your wallet.
              </p>
              <p className="mt-1 text-[13px] text-mute">
                {overviewSWR.error instanceof Error
                  ? overviewSWR.error.message
                  : "Try again in a moment."}
              </p>
            </div>
            <button
              onClick={() => overviewSWR.mutate()}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-pill border border-rule bg-canvas px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </button>
          </div>
        </div>
      ) : !overview ? (
        <div className="border border-rule rounded-lg p-6 sm:p-8">
          <div className="h-3 w-32 rounded bg-bone animate-pulse" />
          <div className="mt-4 h-12 w-72 rounded bg-bone animate-pulse" />
          <div className="mt-4 h-9 w-40 rounded bg-bone animate-pulse" />
        </div>
      ) : (
        <WalletHero
          overview={overview}
          lastFetched={lastFetched}
          refreshing={overviewSWR.isValidating}
          onRefresh={() => overviewSWR.mutate()}
          onRequest={() => setSheetOpen(true)}
          canRequest={canRequest}
        />
      )}

      {/* ── Stats strip ──────────────────────────── */}
      {overview && (
        <StatsStrip overview={overview} methodsCount={methods.length} />
      )}

      {/* ── Default method ───────────────────────── */}
      <DefaultMethodStrip
        methods={methods}
        onAdd={() => {
          // future: open method-management sheet
          window.alert(
            "Payout-method management page coming next. For now, contact support to add or update a method."
          );
        }}
      />

      {/* ── Tabs + filter row ────────────────────── */}
      <section>
        <WalletTabs
          active={tab}
          onChange={(t) => setTab(t)}
          txCount={txSWR.data?.meta.total}
          payoutCount={payoutsSWR.data?.meta.total}
        />

        {tab === "transactions" && (
          <div className="mt-4 sm:mt-5">
            <FilterPills
              active={txFilter}
              onChange={(f) => setTxFilter(f)}
              counts={txCounts}
            />
          </div>
        )}

        {/* ── Body ──────────────────────────────── */}
        <div className="mt-4 sm:mt-5 border border-rule rounded-lg overflow-hidden bg-canvas">
          {tab === "transactions" ? (
            txSWR.isLoading && !txSWR.data ? (
              <div>
                {[...Array(5)].map((_, i) => (
                  <RowSkeleton key={i} />
                ))}
              </div>
            ) : txSWR.error ? (
              <EmptyBlock
                title="Couldn't load transactions."
                body={
                  txSWR.error instanceof Error
                    ? txSWR.error.message
                    : "Try again shortly."
                }
              />
            ) : filteredTx.length === 0 ? (
              <EmptyBlock
                title={
                  txFilter === "all"
                    ? "Your ledger is empty."
                    : `No ${txFilter}s yet.`
                }
                body={
                  txFilter === "all"
                    ? "Entry fees from your tournaments will show up here the moment they settle."
                    : `When ${txFilter} entries arrive, they'll appear here.`
                }
              />
            ) : (
              <>
                {filteredTx.map((t) => (
                  <TransactionRow key={t.id} tx={t} />
                ))}
                {txSWR.data && txSWR.data.meta.last_page > 1 && (
                  <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-t border-rule bg-bone/40">
                    <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2 tabular-nums">
                      Page {txSWR.data.meta.current_page} of{" "}
                      {txSWR.data.meta.last_page} · {txSWR.data.meta.total} total
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                        disabled={txPage === 1}
                        className="inline-flex h-9 items-center rounded-pill border border-rule bg-canvas px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-ink transition-colors hover:bg-bone disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() =>
                          setTxPage((p) =>
                            Math.min(txSWR.data!.meta.last_page, p + 1)
                          )
                        }
                        disabled={txPage >= txSWR.data.meta.last_page}
                        className="inline-flex h-9 items-center rounded-pill bg-ink px-3 font-mono text-[10.5px] font-bold uppercase tracking-[0.18em] text-white transition-colors hover:bg-navy disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )
          ) : payoutsSWR.isLoading && !payoutsSWR.data ? (
            <div>
              {[...Array(3)].map((_, i) => (
                <RowSkeleton key={i} />
              ))}
            </div>
          ) : payoutsSWR.error ? (
            <EmptyBlock
              title="Couldn't load payouts."
              body={
                payoutsSWR.error instanceof Error
                  ? payoutsSWR.error.message
                  : "Try again shortly."
              }
            />
          ) : payouts.length === 0 ? (
            <EmptyBlock
              title="No payouts yet."
              body="When you request a withdrawal, it shows up here with live status."
            />
          ) : (
            payouts.map((p) => <PayoutRow key={p.id} p={p} />)
          )}
        </div>
      </section>

      {/* ── Footer note ──────────────────────────── */}
      <p className="text-center font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
        <WalletIcon className="inline-block h-3 w-3 -mt-0.5 mr-1" />
        Balances refresh every 30 seconds
      </p>

      {/* ── Sheet ────────────────────────────────── */}
      {overview && (
        <RequestPayoutSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
          available={overview.available_balance}
          currency={overview.wallet.currency || "KES"}
          methods={methods}
          onSuccess={() => {
            overviewSWR.mutate();
            txSWR.mutate();
            payoutsSWR.mutate();
            setTab("payouts");
          }}
        />
      )}
    </div>
  );
}
