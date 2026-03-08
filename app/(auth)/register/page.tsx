"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Mail, Lock, User, ArrowRight, Phone, Calendar, Loader2, MapPin, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Logo } from "@/components/layout/logo";
import { authApi, locationApi, type GeographicUnit } from "@/lib/api";

export default function RegisterPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Form fields
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [countryId, setCountryId] = useState("");
    const [regionId, setRegionId] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        if (password !== passwordConfirmation) {
            setError("Passwords do not match.");
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

            <div className="card-dark rounded-3xl p-8 shadow-2xl border border-border/20 backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-electric to-transparent opacity-50" />

                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-foreground mb-2">Create an Account</h2>
                    <p className="text-sm text-muted-foreground">
                        Join the premier pool and snooker platform in Africa.
                    </p>
                </div>

                {error && (
                    <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Name row */}
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

                    {/* Nickname */}
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

                    {/* Email */}
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

                    {/* Phone */}
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

                    {/* DOB and Gender row */}
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

                    {/* Country and Region */}
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

                    {/* Password */}
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
                        <p className="text-[10px] text-muted-foreground">Must be at least 8 characters long.</p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation" className={labelClass}>Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password_confirmation"
                                type="password"
                                placeholder="Confirm your password"
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
                        className="w-full h-12 rounded-xl bg-electric hover:bg-electric/90 text-[#030e10] font-bold text-base glow-cyan transition-all mt-6"
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
                </form>

                <div className="mt-8 text-center">
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
