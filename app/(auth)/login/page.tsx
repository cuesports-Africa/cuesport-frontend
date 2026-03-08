"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { authApi } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await authApi.login({ phone_number: phoneNumber, password });
            localStorage.setItem("auth_token", res.token.access_token);

            if (res.user.roles.is_organizer && res.user.organizer_profile) {
                router.push("/organizer");
            } else {
                router.push("/become-organizer");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="inline-block transition-transform hover:scale-105">
                    <Logo variant="white" showTagline={false} size="lg" />
                </div>
            </div>

            <div className="card-dark rounded-3xl p-8 shadow-2xl border border-border/20 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent opacity-50" />

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Welcome Back</h2>
                    <p className="text-sm text-muted-foreground">
                        Sign in to manage your tournaments and track your stats.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="phone_number" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="phone_number"
                                type="tel"
                                placeholder="+254712345678"
                                required
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                            <Link href="/forgot-password" className="text-xs font-medium text-electric hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-6"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Sign In
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="font-semibold text-electric hover:underline transition-colors">
                            Sign up free
                        </Link>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>
            </div>
        </>
    );
}
