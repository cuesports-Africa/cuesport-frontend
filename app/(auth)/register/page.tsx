"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Mail, Lock, User, ArrowRight,
    Calendar, Loader2, MapPin, AtSign, ChevronLeft, Check, CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhoneInput } from "@/components/ui/phone-input";
import { Logo } from "@/components/layout/logo";
import { authApi, locationApi, type GeographicUnit } from "@/lib/api";

// Level labels for each depth in the hierarchy
const LEVEL_LABELS: Record<string, string> = {
    country: "Country",
    region: "Region",
    county: "County",
    sub_county: "Constituency",
    ward: "Ward",
    community: "Community",
};

interface LocationLevel {
    label: string;
    options: GeographicUnit[];
    selectedId: string;
    loading: boolean;
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

    // Dynamic cascading location
    const [locationLevels, setLocationLevels] = useState<LocationLevel[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);

    // Load countries on mount
    useEffect(() => {
        locationApi.countries()
            .then((res) => {
                setLocationLevels([{
                    label: "Country",
                    options: res.countries,
                    selectedId: "",
                    loading: false,
                }]);
            })
            .catch(() => {})
            .finally(() => setLoadingCountries(false));
    }, []);

    // Handle location selection at any level
    const handleLocationChange = useCallback((levelIndex: number, selectedId: string) => {
        setLocationLevels((prev) => {
            // Update the selected value and trim deeper levels
            const updated = prev.slice(0, levelIndex + 1);
            updated[levelIndex] = { ...updated[levelIndex], selectedId };
            // Add a loading placeholder for the next level
            return [...updated, { label: "", options: [], selectedId: "", loading: true }];
        });

        // Fetch children
        locationApi.children(Number(selectedId))
            .then((res) => {
                setLocationLevels((prev) => {
                    // If user changed selection while loading, ignore stale response
                    if (prev[levelIndex]?.selectedId !== selectedId) return prev;

                    if (res.children.length === 0) {
                        // No children — current selection is atomic, remove loading placeholder
                        return prev.slice(0, levelIndex + 1);
                    }

                    // Determine label from first child's type
                    const childType = res.children[0]?.type || "region";
                    const label = LEVEL_LABELS[childType] || childType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

                    const updated = [...prev];
                    updated[levelIndex + 1] = {
                        label,
                        options: res.children,
                        selectedId: "",
                        loading: false,
                    };
                    return updated;
                });
            })
            .catch(() => {
                // On error, remove the loading placeholder
                setLocationLevels((prev) => prev.slice(0, levelIndex + 1));
            });
    }, []);

    // Get the country ID (first level selection)
    const countryId = locationLevels[0]?.selectedId || "";

    // Get the final (atomic) geographic_unit_id
    // It's the last level that has a selectedId AND has no children loaded after it
    const getAtomicId = (): string => {
        for (let i = locationLevels.length - 1; i >= 0; i--) {
            if (locationLevels[i].selectedId) {
                // Check there's no next level (or next level is empty/loading)
                const nextLevel = locationLevels[i + 1];
                if (!nextLevel || (nextLevel.options.length === 0 && !nextLevel.loading)) {
                    return locationLevels[i].selectedId;
                }
            }
        }
        return "";
    };

    // Check if location selection is complete (reached atomic level)
    const isLocationComplete = (): boolean => {
        const lastLevelWithSelection = locationLevels.findLastIndex((l) => l.selectedId !== "");
        if (lastLevelWithSelection < 0) return false;
        // Complete if there's no deeper level loaded after it
        const nextLevel = locationLevels[lastLevelWithSelection + 1];
        return !nextLevel || (nextLevel.options.length === 0 && !nextLevel.loading);
    };

    const isAnyLocationLoading = locationLevels.some((l) => l.loading);

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

        if (!countryId) {
            setError("Please select your country.");
            return;
        }

        const atomicId = getAtomicId();
        if (!atomicId || !isLocationComplete()) {
            setError("Please complete your location selection down to the community level.");
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
                geographic_unit_id: Number(atomicId),
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

    const labelClass = "text-xs font-semibold uppercase tracking-wider text-muted-foreground";
    const inputClass = "search-input-dark pl-10 h-12 rounded-xl border-border/20";

    return (
        <>
            <div className="flex justify-center mb-8">
                <div className="inline-block transition-transform hover:scale-105">
                    <Logo variant="white" showTagline={false} size="lg" />
                </div>
            </div>

            <div className="card-dark rounded-3xl p-6 sm:p-8 shadow-2xl border border-border/20 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent opacity-50" />

                {/* Header */}
                <div className="mb-6 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-1">Create an Account</h2>
                    <p className="text-sm text-muted-foreground">
                        {step === 1 ? "Set up your login details" : "Tell us a bit about yourself"}
                    </p>
                </div>

                {/* Step indicator */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                            Step {step} of 2
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                            {step === 1 ? "Account" : "Profile"}
                        </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted/30 overflow-hidden">
                        <div
                            className="h-full rounded-full bg-electric transition-all duration-500 ease-out"
                            style={{ width: step === 1 ? "50%" : "100%" }}
                        />
                    </div>
                    {/* Step dots */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-electric flex items-center justify-center">
                                {step > 1
                                    ? <Check className="h-3.5 w-3.5 text-[#030e10]" />
                                    : <span className="text-xs font-bold text-[#030e10]">1</span>
                                }
                            </div>
                            <span className="text-xs font-medium text-electric hidden sm:inline">Account</span>
                        </div>
                        <div className="flex-1 mx-3 h-px bg-border/30" />
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                step >= 2 ? "bg-electric" : "bg-muted/40 border border-border/30"
                            }`}>
                                <span className={`text-xs font-bold ${step >= 2 ? "text-[#030e10]" : "text-muted-foreground"}`}>2</span>
                            </div>
                            <span className={`text-xs font-medium hidden sm:inline ${step >= 2 ? "text-electric" : "text-muted-foreground"}`}>Profile</span>
                        </div>
                    </div>
                </div>

                {/* Error displays */}
                {(error || stepError) && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
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
                                        placeholder="John"
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
                                        placeholder="Doe"
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
                                    placeholder="e.g. The Cue Master"
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
                                    placeholder="name@example.com"
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
                                        placeholder="Create a password"
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
                                        placeholder="Confirm password"
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
                            className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-2"
                        >
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                )}

                {/* Step 2: Profile Details */}
                {step === 2 && (
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Summary of step 1 */}
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/20 border border-border/10">
                            <div className="w-10 h-10 rounded-full bg-electric/10 flex items-center justify-center shrink-0">
                                <User className="h-5 w-5 text-electric" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-foreground truncate">{firstName} {lastName}</p>
                                <p className="text-xs text-muted-foreground truncate">{email}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleBack}
                                className="text-xs font-medium text-electric hover:underline shrink-0"
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
                                    <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
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
                                    placeholder="e.g. 12345678"
                                    maxLength={50}
                                    value={nationalIdNumber}
                                    onChange={(e) => setNationalIdNumber(e.target.value)}
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Dynamic cascading location */}
                        <div className="space-y-3">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <Label className={labelClass}>Your Location</Label>
                            </div>

                            {loadingCountries ? (
                                <div className="flex items-center gap-2 py-3 text-sm text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Loading countries...
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {locationLevels.map((level, index) => {
                                        if (level.loading) {
                                            return (
                                                <div key={`loading-${index}`} className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                    Loading...
                                                </div>
                                            );
                                        }
                                        if (level.options.length === 0) return null;

                                        return (
                                            <div key={`level-${index}`} className="space-y-1.5">
                                                <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70">
                                                    {level.label}
                                                </span>
                                                <Select
                                                    value={level.selectedId}
                                                    onValueChange={(val) => handleLocationChange(index, val)}
                                                    required={index === 0}
                                                >
                                                    <SelectTrigger className="search-input-dark h-11 rounded-xl border-border/20 w-full">
                                                        <SelectValue placeholder={`Select ${level.label.toLowerCase()}`} />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {level.options.map((opt) => (
                                                            <SelectItem key={opt.id} value={String(opt.id)}>
                                                                {opt.flag ? `${opt.flag} ${opt.name}` : opt.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        );
                                    })}

                                    {/* Completion indicator */}
                                    {isLocationComplete() && countryId && (
                                        <div className="flex items-center gap-2 text-xs text-emerald-400">
                                            <Check className="h-3.5 w-3.5" />
                                            Location complete
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 mt-2">
                            <Button
                                type="button"
                                onClick={handleBack}
                                variant="ghost"
                                className="h-12 rounded-xl px-5 text-muted-foreground hover:text-foreground font-medium"
                            >
                                <ChevronLeft className="mr-1 h-4 w-4" />
                                Back
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading || isAnyLocationLoading || !isLocationComplete()}
                                className="flex-1 h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all"
                            >
                                {loading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <>
                                        Create Account
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-electric hover:underline transition-colors">
                            Sign in
                        </Link>
                    </p>
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
