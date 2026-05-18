"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/components/auth/auth-shell";
import { authApi } from "@/lib/api";

type Step = "email" | "code" | "reset";

const inputClass =
  "h-12 rounded-md border-rule bg-canvas px-4 text-[15px] tracking-[0.02em] transition-colors placeholder:text-mute-2 focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)]";

const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Step 1
  const [email, setEmail] = useState("");

  // Step 2 — code is carried through to step 3 (backend takes it on /reset-password)
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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
      if (!res.valid) {
        setError(res.message || "Invalid or expired code.");
        return;
      }
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
      await authApi.resetPassword({
        email,
        code: code.join(""),
        password,
        password_confirmation: passwordConfirmation,
      });
      router.push("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  }

  // Editorial step indicator (01 — 02 — 03) with current step in ink
  const steps: { id: Step; label: string }[] = [
    { id: "email", label: "Email" },
    { id: "code", label: "Code" },
    { id: "reset", label: "Reset" },
  ];

  return (
    <AuthShell
      imageSrc="https://images.unsplash.com/photo-1575553939928-d03b21323afe?w=1600&auto=format&fit=crop&q=80"
      imageAlt=""
      kicker="Members"
      tagline="Reset and resume."
    >
      {/* Step indicator */}
      <ol className="mb-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isDone = steps.findIndex((x) => x.id === step) > i;
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className={
                  isActive
                    ? "text-ink"
                    : isDone
                    ? "text-mute"
                    : "text-mute-2"
                }
              >
                <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span>{" "}
                <span className="hidden sm:inline">{s.label}</span>
              </span>
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className={
                    isDone
                      ? "inline-block h-px w-6 bg-mute"
                      : "inline-block h-px w-6 bg-rule"
                  }
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Headline + lead */}
      <div className="mb-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Reset
        </p>
        <h1 className="mt-3 text-[clamp(1.875rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
          {step === "email" && "Forgot your password?"}
          {step === "code" && "Check your email."}
          {step === "reset" && "New password."}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.55] text-mute">
          {step === "email" && "Enter the email tied to your account and we'll send a 6-digit code."}
          {step === "code" && (
            <>
              We sent a 6-digit code to{" "}
              <span className="text-ink font-medium">{email}</span>. Enter it
              below.
            </>
          )}
          {step === "reset" && "Pick something at least 8 characters long. Don't use it anywhere else."}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 px-4 py-3 rounded-md border border-destructive/30 bg-destructive/[0.04] text-destructive text-[13px]"
        >
          {error}
        </div>
      )}

      {/* Step 1 — Email */}
      {step === "email" && (
        <form className="space-y-5" onSubmit={handleSendCode}>
          <div>
            <Label htmlFor="email" className={labelClass}>
              Email
            </Label>
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

          <Button
            type="submit"
            disabled={loading}
            className="group w-full h-12 mt-2 rounded-pill bg-ink text-white text-[14px] font-bold hover:bg-navy transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-2">
                Send code
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Step 2 — OTP */}
      {step === "code" && (
        <form className="space-y-6" onSubmit={handleVerifyCode}>
          <div>
            <Label className={labelClass}>Six-digit code</Label>
            <div className="flex gap-2 sm:gap-3" onPaste={handleCodePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(i, e.target.value)}
                  onKeyDown={(e) => handleCodeKeyDown(i, e)}
                  aria-label={`Digit ${i + 1}`}
                  className="h-14 w-12 rounded-md border border-rule bg-canvas text-center text-[20px] font-bold tabular-nums text-ink transition-colors placeholder:text-mute-2 focus:border-ink focus:outline-none focus:shadow-[inset_0_-2px_0_0_var(--gold)] sm:h-16 sm:w-14 sm:text-[22px]"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode(["", "", "", "", "", ""]);
                setError("");
              }}
              className="mt-3 inline-block font-mono text-[11px] uppercase tracking-[0.18em] text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy"
            >
              Wrong email? Change it
            </button>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="group w-full h-12 mt-2 rounded-pill bg-ink text-white text-[14px] font-bold hover:bg-navy transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-2">
                Verify code
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Step 3 — Reset */}
      {step === "reset" && (
        <form className="space-y-5" onSubmit={handleResetPassword}>
          <div>
            <Label htmlFor="password" className={labelClass}>
              New password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-0 top-0 h-full inline-flex items-center justify-center w-11 text-mute-2 hover:text-ink transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="password_confirmation" className={labelClass}>
              Confirm password
            </Label>
            <div className="relative">
              <Input
                id="password_confirmation"
                type={showConfirm ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute right-0 top-0 h-full inline-flex items-center justify-center w-11 text-mute-2 hover:text-ink transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="group w-full h-12 mt-2 rounded-pill bg-ink text-white text-[14px] font-bold hover:bg-navy transition-colors disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <span className="inline-flex items-center gap-2">
                Reset password
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            )}
          </Button>
        </form>
      )}

      {/* Bottom — back to sign in */}
      <div className="mt-10 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-gold/70" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Remembered it
        </p>
      </div>
      <p className="mt-4 text-[14px] text-mute">
        Back to{" "}
        <Link
          href="/login"
          className="font-semibold text-ink hover:underline underline-offset-2"
        >
          sign in
        </Link>
      </p>
    </AuthShell>
  );
}
