"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowRight, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/forgot-password`,
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
        throw new Error(data.message || "Failed to send reset code");
      }

      setSuccess(true);

      // Redirect to reset password page after a short delay
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
          <Mail className="h-10 w-10 text-green-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold">Check your email</h1>
          <p className="text-muted-foreground">
            We've sent a password reset code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Redirecting to reset password...
        </p>
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <KeyRound className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl md:text-3xl font-bold">Forgot password?</h1>
        <p className="text-muted-foreground">
          No worries! Enter your email and we'll send you a reset code.
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter the email address associated with your account
          </p>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending code...
            </>
          ) : (
            <>
              Send Reset Code
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Back to Sign In */}
      <Button variant="ghost" className="w-full" asChild>
        <Link href="/auth/signin">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to sign in
        </Link>
      </Button>

      {/* Help Text */}
      <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground mb-2">Need help?</p>
        <p>
          If you don't receive an email within a few minutes, check your spam
          folder or{" "}
          <Link href="/support" className="text-primary hover:underline">
            contact support
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
