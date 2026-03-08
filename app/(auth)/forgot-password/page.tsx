"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, Loader2, CheckCircle, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/layout/logo";
import { authApi } from "@/lib/api";

type Step = "email" | "code" | "reset";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [step, setStep] = useState<Step>("email");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Step 1
    const [email, setEmail] = useState("");

    // Step 2
    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [resetToken, setResetToken] = useState("");
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Step 3
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    async function handleSendCode(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authApi.forgotPassword({ email });
            setStep("code");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send reset code.");
        } finally {
            setLoading(false);
        }
    }

    function handleCodeChange(index: number, value: string) {
        if (!/^\d*$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleCodeKeyDown(index: number, e: React.KeyboardEvent) {
        if (e.key === "Backspace" && !code[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    function handleCodePaste(e: React.ClipboardEvent) {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
        if (!pasted.length) return;
        const newCode = [...code];
        for (let i = 0; i < 6; i++) newCode[i] = pasted[i] || "";
        setCode(newCode);
        inputRefs.current[Math.min(pasted.length, 5)]?.focus();
    }

    async function handleVerifyCode(e: React.FormEvent) {
        e.preventDefault();
        const fullCode = code.join("");
        if (fullCode.length !== 6) {
            setError("Please enter the full 6-digit code.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            const res = await authApi.verifyResetCode({ email, code: fullCode });
            setResetToken(res.token);
            setStep("reset");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Invalid or expired code.");
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword(e: React.FormEvent) {
        e.preventDefault();
        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
            return;
        }
        setError("");
        setLoading(true);
        try {
            await authApi.resetPassword({ email, token: resetToken, password, password_confirmation: passwordConfirmation });
            router.push("/login");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    }

    const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
    const inputClass = "search-input-dark pl-10 h-12 rounded-xl border-border/20";

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
                            <KeyRound className="h-8 w-8 text-electric" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                        {step === "email" && "Forgot Password"}
                        {step === "code" && "Enter Reset Code"}
                        {step === "reset" && "Set New Password"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {step === "email" && "Enter your email and we'll send you a reset code."}
                        {step === "code" && (
                            <>We sent a 6-digit code to <span className="text-foreground font-medium">{email}</span></>
                        )}
                        {step === "reset" && "Choose a new password for your account."}
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Step 1: Email */}
                {step === "email" && (
                    <form className="space-y-5" onSubmit={handleSendCode}>
                        <div className="space-y-2">
                            <Label htmlFor="email" className={labelClass}>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Reset Code"}
                        </Button>
                    </form>
                )}

                {/* Step 2: OTP Code */}
                {step === "code" && (
                    <form className="space-y-6" onSubmit={handleVerifyCode}>
                        <div className="flex justify-center gap-3" onPaste={handleCodePaste}>
                            {code.map((digit, i) => (
                                <Input
                                    key={i}
                                    ref={(el) => { inputRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(i, e.target.value)}
                                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                                    className="search-input-dark w-12 h-14 text-center text-xl font-bold rounded-xl border-border/20"
                                />
                            ))}
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify Code"}
                        </Button>
                    </form>
                )}

                {/* Step 3: New Password */}
                {step === "reset" && (
                    <form className="space-y-5" onSubmit={handleResetPassword}>
                        <div className="space-y-2">
                            <Label htmlFor="password" className={labelClass}>New Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="New password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Must be at least 8 characters long.</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation" className={labelClass}>Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    placeholder="Confirm new password"
                                    required
                                    value={passwordConfirmation}
                                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all"
                        >
                            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Reset Password
                                </>
                            )}
                        </Button>
                    </form>
                )}
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
