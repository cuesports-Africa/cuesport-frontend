"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { organizerApi } from "@/lib/api";

export default function BecomeOrganizerPage() {
    const router = useRouter();
    const [organizationName, setOrganizationName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await organizerApi.becomeOrganizer({
                organization_name: organizationName,
                description: description || undefined,
            });
            router.push("/organizer");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to register as organizer. Please try again.");
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
                    <div className="flex justify-center mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-electric/10 flex items-center justify-center">
                            <Building2 className="h-8 w-8 text-electric" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Become an Organiser</h2>
                    <p className="text-sm text-muted-foreground">
                        Set up your organisation to start hosting tournaments.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="organization_name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Organisation Name
                        </Label>
                        <div className="relative">
                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="organization_name"
                                type="text"
                                placeholder="e.g. Nairobi Pool League"
                                required
                                value={organizationName}
                                onChange={(e) => setOrganizationName(e.target.value)}
                                className="search-input-dark pl-10 h-12 rounded-xl border-border/20"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Description <span className="text-muted-foreground/60">(optional)</span>
                        </Label>
                        <textarea
                            id="description"
                            placeholder="Tell us about your organisation..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="search-input-dark w-full rounded-xl border-border/20 p-3 text-sm resize-none bg-transparent border"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-2"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <>
                                Continue as Organiser
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <Link
                        href="/"
                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                        Skip for now — I just want to play
                    </Link>
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
