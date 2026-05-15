"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { AuthShell } from "@/components/auth/auth-shell";
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
      const res = await authApi.login({
        phone_number: phoneNumber,
        password,
      });
      localStorage.setItem("auth_token", res.token.access_token);

      if (res.user.roles.is_organizer && res.user.organizer_profile) {
        router.push("/organizer");
      } else {
        router.push("/become-organizer");
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      imageSrc="https://images.unsplash.com/photo-1575553939928-d03b21323afe?w=1600&auto=format&fit=crop&q=80"
      imageAlt=""
      kicker="Members"
      tagline="Back to the table."
    >
      <div className="mb-9">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Sign in
        </p>
        <h1 className="mt-3 text-[clamp(1.875rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
          Welcome back.
        </h1>
        <p className="mt-3 text-[15px] leading-[1.55] text-mute">
          Pick up where you left off &mdash; your tournaments, your ranking, your record.
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <Label
            htmlFor="phone_number"
            className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2"
          >
            Phone number
          </Label>
          <PhoneInput
            value={phoneNumber}
            onChange={setPhoneNumber}
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label
              htmlFor="password"
              className="block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2"
            >
              Password
            </Label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-navy hover:underline underline-offset-2"
            >
              Forgot?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-md border-rule bg-canvas px-4 text-[15px] tracking-[0.02em] transition-colors placeholder:text-mute-2 focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)]"
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
              Sign in
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          )}
        </Button>
      </form>

      <div className="mt-10 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-gold/70" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          New here
        </p>
      </div>
      <p className="mt-4 text-[14px] text-mute">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-ink hover:underline underline-offset-2"
        >
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
