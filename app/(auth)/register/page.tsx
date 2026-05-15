"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, Loader2, Search, Check, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { AuthShell } from "@/components/auth/auth-shell";
import { authApi, locationApi, type GeographicUnit } from "@/lib/api";

interface WardResult {
  id: number;
  name: string;
  full_path: string;
  level: number;
  local_term: string;
}

// Shared editorial input styling — same gold-underline-on-focus signature
// used across /login and /forgot-password.
const inputClass =
  "h-12 rounded-md border-rule bg-canvas px-4 text-[15px] tracking-[0.02em] transition-colors placeholder:text-mute-2 focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)]";

const selectTriggerClass =
  "h-12 rounded-md border-rule bg-canvas px-4 text-[15px] tracking-[0.02em] transition-colors focus-visible:border-ink focus-visible:ring-0 focus-visible:shadow-[inset_0_-2px_0_0_var(--gold)] w-full";

const labelClass =
  "block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 mb-2";

const subLabelClass =
  "block font-mono text-[10px] uppercase tracking-[0.18em] text-mute-2 mb-1.5";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stepError, setStepError] = useState("");

  // Step 1 — Account
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  // Step 2 — Profile
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationalIdNumber, setNationalIdNumber] = useState("");

  // Location — Country → Ward search → Community
  const [countries, setCountries] = useState<GeographicUnit[]>([]);
  const [countryId, setCountryId] = useState("");
  const [loadingCountries, setLoadingCountries] = useState(true);

  const [wardQuery, setWardQuery] = useState("");
  const [wardResults, setWardResults] = useState<WardResult[]>([]);
  const [wardSearching, setWardSearching] = useState(false);
  const [selectedWard, setSelectedWard] = useState<WardResult | null>(null);
  const [showWardDropdown, setShowWardDropdown] = useState(false);
  const wardDropdownRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [communities, setCommunities] = useState<GeographicUnit[]>([]);
  const [communityId, setCommunityId] = useState("");
  const [loadingCommunities, setLoadingCommunities] = useState(false);

  // Load countries on mount
  useEffect(() => {
    locationApi
      .countries()
      .then((res) => setCountries(res.countries))
      .catch(() => {})
      .finally(() => setLoadingCountries(false));
  }, []);

  // Debounced ward search
  useEffect(() => {
    if (!countryId || wardQuery.trim().length < 2) {
      setWardResults([]);
      setShowWardDropdown(false);
      return;
    }
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setWardSearching(true);
      locationApi
        .search(wardQuery.trim(), { country_id: Number(countryId) })
        .then((res) => {
          setWardResults(res.results);
          setShowWardDropdown(true);
        })
        .catch(() => setWardResults([]))
        .finally(() => setWardSearching(false));
    }, 350);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [wardQuery, countryId]);

  // Load communities when ward changes
  useEffect(() => {
    if (!selectedWard) {
      setCommunities([]);
      setCommunityId("");
      return;
    }
    setLoadingCommunities(true);
    setCommunityId("");
    locationApi
      .children(selectedWard.id)
      .then((res) => setCommunities(res.children))
      .catch(() => setCommunities([]))
      .finally(() => setLoadingCommunities(false));
  }, [selectedWard]);

  // Click outside dismisses ward dropdown
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        wardDropdownRef.current &&
        !wardDropdownRef.current.contains(e.target as Node)
      ) {
        setShowWardDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleCountryChange(val: string) {
    setCountryId(val);
    setWardQuery("");
    setSelectedWard(null);
    setWardResults([]);
    setCommunities([]);
    setCommunityId("");
  }

  function handleWardSelect(ward: WardResult) {
    setSelectedWard(ward);
    setWardQuery(ward.name);
    setShowWardDropdown(false);
  }

  function clearWard() {
    setSelectedWard(null);
    setWardQuery("");
    setCommunities([]);
    setCommunityId("");
  }

  const isLocationComplete = !!communityId;

  function validateStep1(): boolean {
    if (!firstName.trim() || !lastName.trim()) {
      setStepError("First and last name are required.");
      return false;
    }
    if (nickname.trim().length < 2 || nickname.trim().length > 30) {
      setStepError("Nickname must be 2–30 characters.");
      return false;
    }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStepError("Please enter a valid email address.");
      return false;
    }
    if (!phoneNumber.trim()) {
      setStepError("Phone number is required.");
      return false;
    }
    if (password.length < 5) {
      setStepError("Password must be at least 5 characters.");
      return false;
    }
    if (password !== passwordConfirmation) {
      setStepError("Passwords do not match.");
      return false;
    }
    return true;
  }

  function handleNext() {
    setStepError("");
    if (validateStep1()) setStep(2);
  }

  function handleBack() {
    setStepError("");
    setError("");
    setStep(1);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!dateOfBirth || !gender) {
      setError("Please fill in date of birth and gender.");
      return;
    }
    if (!countryId || !communityId) {
      setError("Please complete your location (country, ward, and community).");
      return;
    }

    setLoading(true);
    try {
      const payload: Parameters<typeof authApi.register>[0] = {
        first_name: firstName,
        last_name: lastName,
        nickname,
        email,
        phone_number: phoneNumber,
        date_of_birth: dateOfBirth,
        gender,
        country_id: Number(countryId),
        geographic_unit_id: Number(communityId),
        password,
        password_confirmation: passwordConfirmation,
      };
      if (nationalIdNumber.trim()) {
        payload.national_id_number = nationalIdNumber.trim();
      }
      await authApi.register(payload);
      router.push(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  // Editorial step indicator: 01 Account — 02 Profile
  const steps: { id: 1 | 2; label: string }[] = [
    { id: 1, label: "Account" },
    { id: 2, label: "Profile" },
  ];

  return (
    <AuthShell
      imageSrc="https://images.unsplash.com/photo-1707916041849-927236f6b4c8?w=1600&auto=format&fit=crop&q=80"
      imageAlt=""
      kicker="Newcomers"
      tagline="Put your name on the wall."
    >
      {/* Step indicator */}
      <ol className="mb-8 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.2em]">
        {steps.map((s, i) => {
          const isActive = s.id === step;
          const isDone = step > s.id;
          return (
            <li key={s.id} className="flex items-center gap-3">
              <span
                className={
                  isActive ? "text-ink" : isDone ? "text-mute" : "text-mute-2"
                }
              >
                <span className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>{" "}
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
          Create account
        </p>
        <h1 className="mt-3 text-[clamp(1.875rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
          {step === 1 ? "Start your account." : "Tell us about you."}
        </h1>
        <p className="mt-3 text-[15px] leading-[1.55] text-mute">
          {step === 1
            ? "Your details for signing in."
            : "A bit of profile information to get you ranked."}
        </p>
      </div>

      {(error || stepError) && (
        <div
          role="alert"
          className="mb-5 px-4 py-3 rounded-md border border-destructive/30 bg-destructive/[0.04] text-destructive text-[13px]"
        >
          {error || stepError}
        </div>
      )}

      {/* ── Step 1 — Account ── */}
      {step === 1 && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="first_name" className={labelClass}>
                First name
              </Label>
              <Input
                id="first_name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="last_name" className={labelClass}>
                Last name
              </Label>
              <Input
                id="last_name"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="nickname" className={labelClass}>
              Nickname
            </Label>
            <Input
              id="nickname"
              type="text"
              required
              minLength={2}
              maxLength={30}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className={inputClass}
            />
            <p className="mt-1.5 text-[11px] leading-[1.4] text-mute">
              Your display name (2–30 characters). Must be unique.
            </p>
          </div>

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

          <div>
            <Label htmlFor="phone_number" className={labelClass}>
              Phone number
            </Label>
            <PhoneInput
              value={phoneNumber}
              onChange={setPhoneNumber}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="password" className={labelClass}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
              />
              <p className="mt-1.5 text-[11px] leading-[1.4] text-mute">
                Minimum 5 characters.
              </p>
            </div>
            <div>
              <Label htmlFor="password_confirmation" className={labelClass}>
                Confirm password
              </Label>
              <Input
                id="password_confirmation"
                type="password"
                placeholder="••••••••"
                required
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <Button
            type="button"
            onClick={handleNext}
            className="group w-full h-12 mt-2 rounded-pill bg-ink text-white text-[14px] font-bold hover:bg-navy transition-colors"
          >
            <span className="inline-flex items-center gap-2">
              Continue
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Button>
        </div>
      )}

      {/* ── Step 2 — Profile ── */}
      {step === 2 && (
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Summary of step 1 */}
          <div className="flex items-center gap-3 rounded-md border border-rule bg-bone/60 px-4 py-3">
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold text-ink truncate">
                {firstName} {lastName}
              </p>
              <p className="text-[12px] text-mute truncate">{email}</p>
            </div>
            <button
              type="button"
              onClick={handleBack}
              className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy shrink-0"
            >
              Edit
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date_of_birth" className={labelClass}>
                Date of birth
              </Label>
              <Input
                id="date_of_birth"
                type="date"
                required
                max={new Date().toISOString().split("T")[0]}
                min="1920-01-01"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="gender" className={labelClass}>
                Gender
              </Label>
              <Select value={gender} onValueChange={setGender} required>
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* National ID (optional) */}
          <div>
            <Label htmlFor="national_id" className={labelClass}>
              National ID{" "}
              <span className="font-mono text-[10px] normal-case font-normal text-mute-2">
                (optional)
              </span>
            </Label>
            <Input
              id="national_id"
              type="text"
              maxLength={50}
              value={nationalIdNumber}
              onChange={(e) => setNationalIdNumber(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Location: Country → Ward → Community */}
          <div className="space-y-4 rounded-md border border-rule bg-bone/40 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                Your location
              </p>
              {isLocationComplete && (
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink">
                  <Check className="h-3 w-3" />
                  Complete
                </span>
              )}
            </div>

            {/* Country */}
            <div>
              <span className={subLabelClass}>Country</span>
              <Select
                value={countryId}
                onValueChange={handleCountryChange}
                required
                disabled={loadingCountries}
              >
                <SelectTrigger className={selectTriggerClass}>
                  <SelectValue
                    placeholder={loadingCountries ? "Loading…" : "Select country"}
                  />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.flag ? `${c.flag} ${c.name}` : c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Ward search */}
            {countryId && (
              <div>
                <span className={subLabelClass}>Ward</span>
                <div className="relative" ref={wardDropdownRef}>
                  {selectedWard ? (
                    <div className="flex items-center justify-between h-12 rounded-md border border-rule bg-canvas px-4">
                      <div className="min-w-0">
                        <span className="text-[14.5px] text-ink">
                          {selectedWard.name}
                        </span>
                        <span className="ml-2 hidden text-[12px] text-mute sm:inline">
                          {selectedWard.full_path}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={clearWard}
                        className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy underline underline-offset-2 decoration-navy/30 transition-colors hover:decoration-navy shrink-0"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mute-2" />
                        <Input
                          type="text"
                          placeholder="Type to search your ward…"
                          value={wardQuery}
                          onChange={(e) => {
                            setWardQuery(e.target.value);
                            setSelectedWard(null);
                          }}
                          className={`${inputClass} pl-10`}
                        />
                        {wardSearching && (
                          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-mute-2" />
                        )}
                      </div>

                      {showWardDropdown && wardResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-2 max-h-56 overflow-y-auto bg-canvas border border-rule rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 duration-150">
                          {wardResults.map((ward) => (
                            <button
                              key={ward.id}
                              type="button"
                              onClick={() => handleWardSelect(ward)}
                              className="w-full text-left px-4 py-3 transition-colors hover:bg-bone/60"
                            >
                              <span className="block text-[14px] text-ink">
                                {ward.name}
                              </span>
                              <span className="mt-0.5 block truncate text-[11px] text-mute">
                                {ward.full_path}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {showWardDropdown &&
                        wardResults.length === 0 &&
                        !wardSearching &&
                        wardQuery.trim().length >= 2 && (
                          <div className="absolute top-full left-0 right-0 mt-2 px-4 py-3 bg-canvas border border-rule rounded-md shadow-lg z-50 text-[13px] text-mute text-center">
                            No wards found
                          </div>
                        )}
                    </>
                  )}
                </div>
                <p className="mt-1.5 text-[11px] leading-[1.4] text-mute">
                  Search by ward name (e.g. &ldquo;Magumu&rdquo;).
                </p>
              </div>
            )}

            {/* Community */}
            {selectedWard && (
              <div>
                <span className={subLabelClass}>Community</span>
                {loadingCommunities ? (
                  <div className="flex items-center gap-2 py-2 text-[13px] text-mute">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading communities…
                  </div>
                ) : communities.length > 0 ? (
                  <Select
                    value={communityId}
                    onValueChange={setCommunityId}
                    required
                  >
                    <SelectTrigger className={selectTriggerClass}>
                      <SelectValue placeholder="Select community" />
                    </SelectTrigger>
                    <SelectContent>
                      {communities.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="py-2 text-[12px] text-mute">
                    No communities found for this ward.
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-2">
            <Button
              type="button"
              onClick={handleBack}
              variant="ghost"
              className="h-12 rounded-pill px-5 text-mute hover:text-ink hover:bg-bone font-medium"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading || !isLocationComplete}
              className="group flex-1 h-12 rounded-pill bg-ink text-white text-[14px] font-bold hover:bg-navy transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create account
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              )}
            </Button>
          </div>
        </form>
      )}

      {/* Bottom — sign in */}
      <div className="mt-10 flex items-center gap-3">
        <span aria-hidden className="h-px w-8 bg-gold/70" />
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
          Returning
        </p>
      </div>
      <p className="mt-4 text-[14px] text-mute">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-ink hover:underline underline-offset-2"
        >
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
