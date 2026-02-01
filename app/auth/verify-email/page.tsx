"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, Loader2, RefreshCw, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/auth-context";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when complete
    if (value && index === 5 && newOtp.every((digit) => digit)) {
      handleSubmit(newOtp.join(""));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Check if it's a 6-digit code
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();

      // Auto-submit
      setTimeout(() => handleSubmit(pastedData), 100);
    }
  };

  const handleSubmit = async (code?: string) => {
    const verificationCode = code || otp.join("");

    if (verificationCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email,
            code: verificationCode,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Verification failed");
      }

      setSuccess(true);

      // Use auth context login to properly set state
      login(data.token.access_token, data.user);

      // Determine redirect path from response data
      const user = data.user;
      const isPlayer = user.roles?.is_player;
      const isOrganizer = user.roles?.is_organizer && user.organizer_profile;

      let redirectPath = "/";
      if (isPlayer && isOrganizer) {
        redirectPath = "/auth/role-select";
      } else if (isPlayer) {
        redirectPath = "/player";
      } else if (isOrganizer) {
        redirectPath = "/organizer";
      }

      // Redirect to dashboard after a brief delay
      setTimeout(() => {
        router.push(redirectPath);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || isResending) return;

    setIsResending(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/resend-verification`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend code");
      }

      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend code");
    } finally {
      setIsResending(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your account has been verified successfully.
            <br />
            Redirecting to dashboard...
          </p>
        </div>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Verify your email</h1>
        <p className="text-muted-foreground">
          We've sent a 6-digit code to
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm text-center">
          {error}
        </div>
      )}

      {/* OTP Input */}
      <div className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className={`w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold ${
                error ? "border-destructive" : ""
              }`}
              disabled={isLoading}
            />
          ))}
        </div>

        <Button
          onClick={() => handleSubmit()}
          className="w-full"
          size="lg"
          disabled={isLoading || otp.some((digit) => !digit)}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify Email
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Resend Code */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Didn't receive the code?
        </p>
        <Button
          variant="ghost"
          onClick={handleResend}
          disabled={resendCooldown > 0 || isResending}
          className="text-primary"
        >
          {isResending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending...
            </>
          ) : resendCooldown > 0 ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend in {resendCooldown}s
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Resend Code
            </>
          )}
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Tips:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Check your spam or junk folder</li>
          <li>The code expires in 30 minutes</li>
          <li>You can paste the code directly</li>
        </ul>
      </div>

      {/* Back to Sign In */}
      <div className="text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link href="/auth/register" className="text-primary hover:underline font-medium">
          Go back to registration
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
