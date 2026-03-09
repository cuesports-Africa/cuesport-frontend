"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    ArrowLeft, Mail, Lock, User, ArrowRight, Phone,
    Calendar, Loader2, MapPin, AtSign, ChevronLeft, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/layout/logo";
import { authApi, locationApi, type GeographicUnit } from "@/lib/api";

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
    const [countryId, setCountryId] = useState("");
    const [regionId, setRegionId] = useState("");

    // Location data
    const [countries, setCountries] = useState<GeographicUnit[]>([]);
    const [regions, setRegions] = useState<GeographicUnit[]>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loadingRegions, setLoadingRegions] = useState(false);

    useEffect(() => {
        locationApi.countries()
            .then((res) => setCountries(res.countries))
            .catch(() => {})
            .finally(() => setLoadingCountries(false));
    }, []);

    useEffect(() => {
        if (!countryId) {
            setRegions([]);
            setRegionId("");
            return;
        }
        setLoadingRegions(true);
        setRegionId("");
        locationApi.children(Number(countryId))
            .then((res) => setRegions(res.children))
            .catch(() => setRegions([]))
            .finally(() => setLoadingRegions(false));
    }, [countryId]);

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

        if (!dateOfBirth || !gender || !countryId || !regionId) {
            setError("Please fill in all fields.");
            return;
        }

        setLoading(true);
        try {
            await authApi.register({
                first_name: firstName,
                last_name: lastName,
                nickname,
                email,
                phone_number: phoneNumber,
                date_of_birth: dateOfBirth,
                gender,
                country_id: Number(countryId),
                geographic_unit_id: Number(regionId),
                password,
                password_confirmation: passwordConfirmation,
            });
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

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        placeholder="+254712345678"
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className={inputClass}
                                    />
                                </div>
                            </div>
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
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="country" className={labelClass}>Country</Label>
                                <Select value={countryId} onValueChange={setCountryId} required disabled={loadingCountries}>
                                    <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                                            <SelectValue placeholder={loadingCountries ? "Loading..." : "Select"} />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {countries.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="region" className={labelClass}>Region</Label>
                                <Select value={regionId} onValueChange={setRegionId} required disabled={!countryId || loadingRegions}>
                                    <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                                        <SelectValue placeholder={loadingRegions ? "Loading..." : "Select"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {regions.map((r) => (
                                            <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
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
                                disabled={loading}
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
