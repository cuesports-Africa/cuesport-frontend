"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  X,
  Smartphone,
  Landmark,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { walletApi, type WalletOverview, type PayoutMethod } from "@/lib/api";

const PAYOUT_METHOD_ICONS: Record<string, React.ElementType> = {
  mpesa: Smartphone,
  airtel: Smartphone,
  mtn: Smartphone,
  bank: Landmark,
};

export default function OrganizerPayoutsPage() {
  const [walletData, setWalletData] = useState<WalletOverview | null>(null);
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([]);
  const [transactions, setTransactions] = useState<Array<{
    id: number;
    type: "credit" | "debit";
    source: string;
    amount: number;
    currency: string;
    description?: string;
    created_at: string;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Withdraw sheet state
  const [showWithdrawSheet, setShowWithdrawSheet] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethodId, setSelectedMethodId] = useState<number | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [walletRes, methodsRes, transactionsRes] = await Promise.all([
          walletApi.getOverview(),
          walletApi.getPayoutMethods(),
          walletApi.getTransactions({ page: currentPage, per_page: 20 }),
        ]);

        setWalletData(walletRes);
        setPayoutMethods(methodsRes.payout_methods || []);
        setTransactions(transactionsRes.transactions || []);
        setTotalPages(transactionsRes.meta?.last_page || 1);

        // Set default payout method
        const defaultMethod = methodsRes.payout_methods?.find((m) => m.is_default);
        if (defaultMethod) {
          setSelectedMethodId(defaultMethod.id);
        }
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  const handleWithdraw = async () => {
    if (!withdrawAmount || !selectedMethodId) return;

    const amountInCents = Math.round(parseFloat(withdrawAmount) * 100);
    if (amountInCents < 100) {
      setWithdrawError("Minimum withdrawal is KES 1");
      return;
    }
    if (walletData && amountInCents > walletData.available_balance) {
      setWithdrawError("Amount exceeds available balance");
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError("");

    try {
      await walletApi.requestPayout({
        amount: amountInCents,
        payout_method_id: selectedMethodId,
      });
      setWithdrawSuccess(true);
      // Refresh wallet data
      const walletRes = await walletApi.getOverview();
      setWalletData(walletRes);
    } catch (err) {
      setWithdrawError(err instanceof Error ? err.message : "Failed to request payout");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const openWithdrawSheet = () => {
    setWithdrawAmount(walletData ? (walletData.available_balance / 100).toString() : "");
    setWithdrawError("");
    setWithdrawSuccess(false);
    setShowWithdrawSheet(true);
  };

  const closeWithdrawSheet = () => {
    setShowWithdrawSheet(false);
    setWithdrawAmount("");
    setWithdrawError("");
    setWithdrawSuccess(false);
  };

  const getStatusColor = (type: string) => {
    return type === "credit"
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";
  };

  const availableBalance = walletData?.available_balance || 0;
  const hasPayoutMethod = payoutMethods.length > 0;
  const selectedMethod = payoutMethods.find((m) => m.id === selectedMethodId);

  return (
    <div className="min-h-full">
      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Payouts & Earnings</h1>
              <p className="text-muted-foreground">
                Track your tournament revenue and payouts
              </p>
            </div>
            {hasPayoutMethod && availableBalance > 0 && (
              <Button onClick={openWithdrawSheet} className="bg-gold text-black hover:bg-gold/90">
                <Wallet className="h-4 w-4 mr-2" />
                Withdraw KES {(availableBalance / 100).toLocaleString()}
              </Button>
            )}
          </div>

          {/* Stats Grid - Desktop */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {((walletData?.wallet?.total_earned || 0) / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  From all tournaments
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  KES {(availableBalance / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Ready to withdraw</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  KES {((walletData?.pending_payouts || 0) / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Awaiting payout</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Withdrawn</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  KES {((walletData?.wallet?.total_withdrawn || 0) / 100).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Total withdrawn</p>
              </CardContent>
            </Card>
          </div>

          {/* No payout method warning */}
          {!isLoading && !hasPayoutMethod && (
            <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <Wallet className="h-5 w-5 text-yellow-600" />
                  <p className="text-sm">
                    Add a payout method to withdraw your earnings
                  </p>
                </div>
                <Link href="/organizer/profile">
                  <Button variant="outline" size="sm">
                    Add Method
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Transactions List - Desktop */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : transactions.length > 0 ? (
                <>
                  <div className="space-y-4">
                    {transactions.map((tx) => (
                      <div
                        key={tx.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              tx.type === "credit"
                                ? "bg-green-100 dark:bg-green-900/30"
                                : "bg-red-100 dark:bg-red-900/30"
                            }`}
                          >
                            {tx.type === "credit" ? (
                              <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                            )}
                          </div>
                          <div>
                            <span className="font-medium capitalize">{tx.source.replace(/_/g, " ")}</span>
                            {tx.description && (
                              <p className="text-sm text-muted-foreground">{tx.description}</p>
                            )}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className={`font-bold ${getStatusColor(tx.type)}`}>
                            {tx.type === "credit" ? "+" : "-"}
                            {tx.currency} {(tx.amount / 100).toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 pt-6">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <span className="text-sm text-muted-foreground px-4">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <Wallet className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No transactions yet</h3>
                  <p className="text-muted-foreground">
                    Earnings from your tournaments will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile/PWA Layout */}
      <div className="lg:hidden">
        {/* Stats Grid - Mobile (2x2 compact) */}
        <div className="grid grid-cols-2 gap-3 p-4">
          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Total</span>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold">
              KES {((walletData?.wallet?.total_earned || 0) / 100).toLocaleString()}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Available</span>
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            </div>
            <div className="text-xl font-bold text-green-600 dark:text-green-400">
              KES {(availableBalance / 100).toLocaleString()}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Pending</span>
              <Clock className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
              KES {((walletData?.pending_payouts || 0) / 100).toLocaleString()}
            </div>
          </div>

          <div className="bg-card rounded-xl p-4 border border-border/50">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Withdrawn</span>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="text-xl font-bold">
              KES {((walletData?.wallet?.total_withdrawn || 0) / 100).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Withdraw Button - Mobile */}
        {hasPayoutMethod && availableBalance > 0 && (
          <div className="px-4 pb-4">
            <button
              onClick={openWithdrawSheet}
              className="w-full py-3 rounded-xl bg-gold text-black font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
            >
              <Wallet className="h-5 w-5" />
              Withdraw KES {(availableBalance / 100).toLocaleString()}
            </button>
          </div>
        )}

        {/* No payout method warning - Mobile */}
        {!isLoading && !hasPayoutMethod && (
          <div className="px-4 pb-4">
            <Link
              href="/organizer/profile"
              className="block w-full py-3 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 font-medium text-center text-sm"
            >
              Add a payout method to withdraw
            </Link>
          </div>
        )}

        {/* Transaction History Header - Mobile */}
        <div className="px-4 py-3 bg-muted/30">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Transaction History
          </h2>
        </div>

        {/* Transactions List - Mobile */}
        {isLoading ? (
          <div className="px-4 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="py-4 border-b border-border/30 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-32 mb-2" />
                    <div className="h-3 bg-muted rounded w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : transactions.length > 0 ? (
          <>
            <div className="divide-y divide-border/30">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center gap-3 px-4 py-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      tx.type === "credit"
                        ? "bg-green-100 dark:bg-green-900/30"
                        : "bg-red-100 dark:bg-red-900/30"
                    }`}
                  >
                    {tx.type === "credit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm capitalize">
                      {tx.source.replace(/_/g, " ")}
                    </span>
                    {tx.description && (
                      <p className="text-xs text-muted-foreground truncate">{tx.description}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className={`font-semibold text-sm ${getStatusColor(tx.type)}`}>
                      {tx.type === "credit" ? "+" : "-"}
                      {(tx.amount / 100).toLocaleString()}
                    </div>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 py-4 px-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-muted disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Previous
                </button>
                <span className="text-xs text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm font-medium rounded-lg bg-muted disabled:opacity-50 active:scale-95 transition-transform"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-8 py-12">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Wallet className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-1">
              No transactions yet
            </h3>
            <p className="text-xs text-muted-foreground text-center max-w-[220px]">
              Earnings from your tournaments will appear here
            </p>
          </div>
        )}
      </div>

      {/* Withdraw Sheet (Mobile Bottom Sheet style) */}
      {showWithdrawSheet && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeWithdrawSheet}
          />

          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-background rounded-t-2xl max-h-[80vh] overflow-y-auto safe-area-bottom">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            {/* Close button */}
            <button
              onClick={closeWithdrawSheet}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-muted flex items-center justify-center"
            >
              <X className="h-4 w-4" />
            </button>

            {withdrawSuccess ? (
              /* Success State */
              <div className="px-6 py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h2 className="text-xl font-bold mb-2">Withdrawal Requested</h2>
                <p className="text-muted-foreground mb-2">
                  KES {parseFloat(withdrawAmount).toLocaleString()} will be sent to
                </p>
                <p className="font-medium mb-1">
                  {selectedMethod?.type_label || selectedMethod?.type}
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  {selectedMethod?.masked_account_number}
                </p>
                <p className="text-xs text-muted-foreground mb-6">
                  Expected: 1-2 business days
                </p>
                <button
                  onClick={closeWithdrawSheet}
                  className="w-full py-3 rounded-xl bg-gold text-black font-semibold active:scale-[0.98] transition-transform"
                >
                  Done
                </button>
              </div>
            ) : (
              /* Withdraw Form */
              <div className="px-6 pb-8">
                <h2 className="text-xl font-bold mb-1">Withdraw Funds</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Available: KES {(availableBalance / 100).toLocaleString()}
                </p>

                {withdrawError && (
                  <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    {withdrawError}
                  </div>
                )}

                {/* Amount Input */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      KES
                    </span>
                    <input
                      type="number"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 rounded-xl border bg-background text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-gold"
                      placeholder="0"
                    />
                  </div>
                  <button
                    onClick={() => setWithdrawAmount((availableBalance / 100).toString())}
                    className="text-xs text-gold font-medium mt-2"
                  >
                    Withdraw All
                  </button>
                </div>

                {/* Payout Method Selection */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Withdraw To</label>
                  <div className="space-y-2">
                    {payoutMethods.map((method) => {
                      const Icon = PAYOUT_METHOD_ICONS[method.type] || Wallet;
                      return (
                        <button
                          key={method.id}
                          onClick={() => setSelectedMethodId(method.id)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                            selectedMethodId === method.id
                              ? "border-gold bg-gold/10"
                              : "border-border"
                          }`}
                        >
                          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-gold" />
                          </div>
                          <div className="flex-1 text-left">
                            <p className="font-medium text-sm">{method.type_label || method.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {method.account_name} • {method.masked_account_number}
                            </p>
                          </div>
                          {selectedMethodId === method.id && (
                            <CheckCircle2 className="h-5 w-5 text-gold" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Withdraw Button */}
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || !withdrawAmount || !selectedMethodId}
                  className="w-full py-3 rounded-xl bg-gold text-black font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Withdraw KES {withdrawAmount ? parseFloat(withdrawAmount).toLocaleString() : "0"}
                    </>
                  )}
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  Processing time: 1-2 business days
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
