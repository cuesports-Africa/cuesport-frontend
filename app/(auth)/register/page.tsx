"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Mail, Lock, User, ArrowUpRight,
    Calendar, Loader2, MapPin, AtSign, ChevronLeft, Check, CreditCard, Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [stepError, setStepError] = useState("");

    // Step 1: Account
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    // Step 2: Profile
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [nationalIdNumber, setNationalIdNumber] = useState("");

    // Location: Country → Ward search → Community
    const [countries, setCountries] = useState<GeographicUnit[]>([]);
    const [countryId, setCountryId] = useState("");
    const [loadingCountries, setLoadingCountries] = useState(true);

    // Ward search
    const [wardQuery, setWardQuery] = useState("");
    const [wardResults, setWardResults] = useState<WardResult[]>([]);
    const [wardSearching, setWardSearching] = useState(false);
    const [selectedWard, setSelectedWard] = useState<WardResult | null>(null);
    const [showWardDropdown, setShowWardDropdown] = useState(false);
    const wardDropdownRef = useRef<HTMLDivElement>(null);
    const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Community (children of ward)
    const [communities, setCommunities] = useState<GeographicUnit[]>([]);
    const [communityId, setCommunityId] = useState("");
    const [loadingCommunities, setLoadingCommunities] = useState(false);

    // Load countries on mount
    useEffect(() => {
        locationApi.countries()
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
            locationApi.search(wardQuery.trim(), { country_id: Number(countryId) })
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

    // Load communities when ward is selected
    useEffect(() => {
        if (!selectedWard) {
            setCommunities([]);
            setCommunityId("");
            return;
        }
        setLoadingCommunities(true);
        setCommunityId("");
        locationApi.children(selectedWard.id)
            .then((res) => setCommunities(res.children))
            .catch(() => setCommunities([]))
            .finally(() => setLoadingCommunities(false));
    }, [selectedWard]);

    // Close ward dropdown on outside click
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (wardDropdownRef.current && !wardDropdownRef.current.contains(e.target as Node)) {
                setShowWardDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    // Reset ward/community when country changes
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
            setStepError("Nickname must be 2-30 characters.");
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
        if (validateStep1()) {
            setStep(2);
        }
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
            setError(err instanceof Error ? err.message : "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    const labelClass = "block font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2";
    const inputClass = "pl-10 h-12 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px]";

    return (
        <AuthShell
            imageSrc="https://images.unsplash.com/photo-1707916041849-927236f6b4c8?w=1600&auto=format&fit=crop&q=80"
            imageAlt=""
            kicker="Join the record"
            tagline="From your local hall to the national stage."
        >
            <div className="mb-7">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-mute-2">
                    Create account
                </p>
                <h1 className="mt-3 text-[clamp(1.875rem,3vw,2.5rem)] font-extrabold leading-[1.05] tracking-[-0.025em] text-ink">
                    {step === 1 ? "Start your account." : "Tell us about you."}
                </h1>
                <p className="mt-3 text-[15px] leading-[1.55] text-mute">
                    {step === 1 ? "Your details for signing in." : "A bit of profile information to get you ranked."}
                </p>
            </div>

            {/* Step indicator */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2">
                        Step {step} of 2 — {step === 1 ? "Account" : "Profile"}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute-2 nums-tabular">
                        {step === 1 ? "50%" : "100%"}
                    </span>
                </div>
                <div className="h-[3px] w-full rounded-full bg-bone overflow-hidden">
                    <div
                        className="h-full rounded-full bg-navy transition-all duration-500 ease-out"
                        style={{ width: step === 1 ? "50%" : "100%" }}
                    />
                </div>
            </div>

            {(error || stepError) && (
                <div
                    role="alert"
                    className="mb-5 px-4 py-3 rounded-md border border-destructive/30 bg-destructive/[0.04] text-destructive text-[13px]"
                >
                    {error || stepError}
                </div>
            )}

                {/* Step 1: Account Details */}
                {step === 1 && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="first_name" className={labelClass}>First Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="first_name"
                                        type="text"
                                        required
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_name" className={labelClass}>Last Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nickname" className={labelClass}>Nickname</Label>
                            <div className="relative">
                                <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                            </div>
                            <p className="text-[10px] text-muted-foreground">Your display name (2-30 characters). Must be unique.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className={labelClass}>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone_number" className={labelClass}>Phone Number</Label>
                            <PhoneInput
                                value={phoneNumber}
                                onChange={setPhoneNumber}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="password" className={labelClass}>Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Must be at least 5 characters.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation" className={labelClass}>Confirm Password</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        required
                                        value={passwordConfirmation}
                                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
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

                {/* Step 2: Profile Details */}
                {step === 2 && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Summary of step 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-md bg-bone/60 border border-rule">
                            <div className="w-9 h-9 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                                <User className="h-4 w-4 text-navy" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-[14px] font-semibold text-ink truncate">{firstName} {lastName}</p>
                                <p className="text-[12px] text-mute truncate">{email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleBack}
                                className="font-mono text-[10px] uppercase tracking-[0.18em] text-navy hover:underline shrink-0"
                            >
                                Edit
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth" className={labelClass}>Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
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
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="gender" className={labelClass}>Gender</Label>
                                <Select value={gender} onValueChange={setGender} required>
                                    <SelectTrigger className="h-12 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px] w-full">
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
                        <div className="space-y-2">
                            <Label htmlFor="national_id" className={labelClass}>
                                National ID Number <span className="text-muted-foreground/60 normal-case font-normal">(optional)</span>
                            </Label>
                            <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input
                                    id="national_id"
                                    type="text"
                                    maxLength={50}
                                    value={nationalIdNumber}
                                    onChange={(e) => setNationalIdNumber(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Location: Country → Ward search → Community */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <Label className={labelClass}>Your Location</Label>
                            </div>

                            {/* Country */}
                            <div className="space-y-1.5">
                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">Country</span>
                                <Select value={countryId} onValueChange={handleCountryChange} required disabled={loadingCountries}>
                                    <SelectTrigger className="h-11 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px] w-full">
                                        <SelectValue placeholder={loadingCountries ? "Loading..." : "Select country"} />
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
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                        Ward
                                    </span>
                                    <div className="relative" ref={wardDropdownRef}>
                                        {selectedWard ? (
                                            <div className="h-11 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px] px-3 flex items-center justify-between">
                                                <div className="min-w-0">
                                                    <span className="text-sm text-foreground">{selectedWard.name}</span>
                                                    <span className="text-xs text-muted-foreground ml-2 hidden sm:inline">
                                                        {selectedWard.full_path}
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={clearWard}
                                                    className="text-xs font-medium text-navy hover:underline shrink-0 ml-2"
                                                >
                                                    Change
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Type to search your ward..."
                                                        value={wardQuery}
                                                        onChange={(e) => {
                                                            setWardQuery(e.target.value);
                                                            setSelectedWard(null);
                                                        }}
                                                        className="pl-9 h-11 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px]"
                                                    />
                                                    {wardSearching && (
                                                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                                                    )}
                                                </div>

                                                {/* Search results dropdown */}
                                                {showWardDropdown && wardResults.length > 0 && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 max-h-48 bg-background border border-border/30 rounded-xl shadow-2xl z-50 overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-150">
                                                        {wardResults.map((ward) => (
                                                            <button
                                                                key={ward.id}
                                                                type="button"
                                                                onClick={() => handleWardSelect(ward)}
                                                                className="w-full text-left px-3 py-2.5 hover:bg-muted/40 transition-colors"
                                                            >
                                                                <span className="text-sm text-foreground block">{ward.name}</span>
                                                                <span className="text-[10px] text-muted-foreground block truncate">
                                                                    {ward.full_path}
                                                                </span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {showWardDropdown && wardResults.length === 0 && !wardSearching && wardQuery.trim().length >= 2 && (
                                                    <div className="absolute top-full left-0 right-0 mt-1 px-3 py-3 bg-background border border-border/30 rounded-xl shadow-2xl z-50 text-sm text-muted-foreground text-center">
                                                        No wards found
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted-foreground">Search by ward name (e.g. &quot;Magumu&quot;)</p>
                                </div>
                            )}

                            {/* Community (children of selected ward) */}
                            {selectedWard && (
                                <div className="space-y-1.5">
                                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                        Community
                                    </span>
                                    {loadingCommunities ? (
                                        <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading communities...
                                        </div>
                                    ) : communities.length > 0 ? (
                                        <Select value={communityId} onValueChange={setCommunityId} required>
                                            <SelectTrigger className="h-11 rounded-md border-rule bg-bone/40 focus-visible:ring-navy/20 focus-visible:border-navy text-[15px] w-full">
                                                <SelectValue placeholder="Select community" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {communities.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    ) : (
                                        <p className="text-xs text-muted-foreground py-2">
                                            No communities found for this ward.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Completion indicator */}
                            {isLocationComplete && (
                                <div className="flex items-center gap-2 text-xs text-emerald-600">
                                    <Check className="h-3.5 w-3.5" />
                                    Location complete
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

            <p className="mt-8 text-[14px] text-mute">
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
