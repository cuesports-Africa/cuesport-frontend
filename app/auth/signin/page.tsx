"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Phone, Lock, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import type { User } from "@/lib/api";

// Helper to determine redirect path based on user roles
function getRedirectPath(user: User, requestedRedirect?: string | null): string {
  const isPlayer = user.roles?.is_player;
  const isOrganizer = user.roles?.is_organizer && user.organizer_profile;

  // Dual role - show role selection
  if (isPlayer && isOrganizer) {
    return "/auth/role-select";
  }

  // If there's a requested redirect and user has access, use it
  if (requestedRedirect) {
    if (requestedRedirect.startsWith("/player") && isPlayer) {
      return requestedRedirect;
    }
    if (requestedRedirect.startsWith("/organizer") && isOrganizer) {
      return requestedRedirect;
    }
  }

  // Player only
  if (isPlayer) {
    return "/player";
  }

  // Organizer only
  if (isOrganizer) {
    return "/organizer";
  }

  // Fallback
  return "/";
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const redirectParam = searchParams.get("redirect");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    phone_number: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 403 && data.message?.includes("verify")) {
          // Email not verified, redirect to verification
          router.push(`/auth/verify-email?email=${encodeURIComponent(data.email || "")}`);
          return;
        }
        throw new Error(data.message || "Invalid credentials");
      }

      // Use auth context login to properly set state
      login(data.token.access_token, data.user);

      // Redirect based on user roles (and requested redirect if any)
      const redirectPath = getRedirectPath(data.user, redirectParam);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">
          Sign in to your account to continue
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
        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone_number">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone_number"
              name="phone_number"
              type="tel"
              placeholder="+254 700 000 000"
              value={formData.phone_number}
              onChange={handleChange}
              className="pl-10"
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Enter your phone number in international format
          </p>
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              className="pl-10 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Signing in...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </form>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            New to CueSports?
          </span>
        </div>
      </div>

      {/* Register Link */}
      <Button variant="outline" className="w-full" size="lg" asChild>
        <Link href="/auth/register">
          Create an account
        </Link>
      </Button>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}
