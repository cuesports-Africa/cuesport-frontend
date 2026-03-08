"use client";

import { Suspense, useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/layout/logo";
import { authApi } from "@/lib/api";

function VerifyEmailForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resent, setResent] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    function handleChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handlePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (pasted.length === 0) return;
        const newCode = [...code];
        for (let i = 0; i < 6; i++) {
            newCode[i] = pasted[i] || "";
        }
        setCode(newCode);
        const focusIndex = Math.min(pasted.length, 5);
        inputRefs.current[focusIndex]?.focus();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }

        setError("");
        setLoading(true);
        try {
            const res = await authApi.verifyEmail({ email, code: fullCode });
            localStorage.setItem("auth_token", res.token.access_token);
            router.push("/become-organizer");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Verification failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    async function handleResend() {
        setResent(false);
        setError("");
        try {
            await authApi.resendVerification({ email });
            setResent(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to resend code.");
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
                            <Mail className="h-8 w-8 text-electric" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Verify Your Email</h2>
                    <p className="text-sm text-muted-foreground">
                        We sent a 6-digit code to{" "}
                        <span className="text-foreground font-medium">{email}</span>
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {resent && (
                    <div className="mb-4 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center flex items-center justify-center gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Code resent successfully.
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-3" onPaste={handlePaste}>
                        {code.map((digit, i) => (
                            <Input
                                key={i}
                                ref={(el) => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                className="search-input-dark w-12 h-14 text-center text-xl font-bold rounded-xl border-border/20"
                            />
                        ))}
                    </div>

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all"
                    >
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            "Verify Email"
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Didn&apos;t receive the code?{" "}
                        <button
                            type="button"
                            onClick={handleResend}
                            className="font-semibold text-electric hover:underline transition-colors"
                        >
                            Resend code
                        </button>
                    </p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <Link href="/login" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                </Link>
            </div>
        </>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-electric" />
            </div>
        }>
            <VerifyEmailForm />
        </Suspense>
    );
}
