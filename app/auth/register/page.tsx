"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Phone,
  Lock,
  Mail,
  User,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
  IdCard,
  Search,
  X,
} from "lucide-react";
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

const steps = [
  { id: 1, name: "Account", description: "Login credentials" },
  { id: 2, name: "Personal", description: "Your information" },
  { id: 3, name: "Location", description: "Where you play" },
];

interface Country {
  id: number;
  name: string;
  code: string;
}

interface CommunityResult {
  id: number;
  name: string;
  full_path: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  // Location data
  const [countries, setCountries] = useState<Country[]>([]);
  const [communitySearch, setCommunitySearch] = useState("");
  const [communityResults, setCommunityResults] = useState<CommunityResult[]>([]);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formData, setFormData] = useState({
    // Step 1: Account
    phone_number: "",
    email: "",
    password: "",
    password_confirmation: "",
    // Step 2: Personal
    first_name: "",
    last_name: "",
    nickname: "",
    date_of_birth: "",
    gender: "",
    national_id_number: "",
    // Step 3: Location
    country_id: "",
    geographic_unit_id: "",
  });

  // Fetch countries on mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Close results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations/countries`
      );
      if (response.ok) {
        const data = await response.json();
        setCountries(data.countries || []);
      }
    } catch (err) {
      console.error("Failed to fetch countries:", err);
    }
  };

  const searchCommunities = async (query: string) => {
    if (query.length < 2 || !formData.country_id) {
      setCommunityResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/locations/search?q=${encodeURIComponent(query)}&country_id=${formData.country_id}`
      );
      if (response.ok) {
        const data = await response.json();
        setCommunityResults(data.results || []);
        setShowResults(true);
      }
    } catch (err) {
      console.error("Failed to search communities:", err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCommunitySearchChange = (value: string) => {
    setCommunitySearch(value);
    setSelectedCommunity(null);
    setFormData((prev) => ({ ...prev, geographic_unit_id: "" }));

    // Debounce search
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    searchTimeoutRef.current = setTimeout(() => {
      searchCommunities(value);
    }, 300);
  };

  const handleSelectCommunity = (community: CommunityResult) => {
    setSelectedCommunity(community);
    setCommunitySearch(community.name);
    setFormData((prev) => ({ ...prev, geographic_unit_id: community.id.toString() }));
    setShowResults(false);
    setFieldErrors((prev) => ({ ...prev, geographic_unit_id: [] }));
  };

  const clearCommunity = () => {
    setSelectedCommunity(null);
    setCommunitySearch("");
    setFormData((prev) => ({ ...prev, geographic_unit_id: "" }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: [] }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
    setFieldErrors((prev) => ({ ...prev, [name]: [] }));

    if (name === "country_id") {
      // Reset community when country changes
      clearCommunity();
    }
  };

  const validateStep = (step: number): boolean => {
    const errors: Record<string, string[]> = {};

    if (step === 1) {
      if (!formData.phone_number.match(/^(\+[1-9]\d{6,14}|0[1-9]\d{8,9})$/)) {
        errors.phone_number = ["Enter a valid phone number (e.g., 0705708643 or +254705708643)"];
      }
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        errors.email = ["Enter a valid email address"];
      }
      // Password: min 8 chars, uppercase, lowercase, and number
      const hasUppercase = /[A-Z]/.test(formData.password);
      const hasLowercase = /[a-z]/.test(formData.password);
      const hasNumber = /[0-9]/.test(formData.password);
      if (formData.password.length < 8 || !hasUppercase || !hasLowercase || !hasNumber) {
        errors.password = ["Password must be at least 8 characters with uppercase, lowercase, and numbers"];
      }
      if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = ["Passwords do not match"];
      }
    }

    if (step === 2) {
      if (!formData.first_name.trim()) {
        errors.first_name = ["First name is required"];
      }
      if (!formData.last_name.trim()) {
        errors.last_name = ["Last name is required"];
      }
      if (!formData.date_of_birth) {
        errors.date_of_birth = ["Date of birth is required"];
      } else {
        const age = calculateAge(formData.date_of_birth);
        if (age < 13) {
          errors.date_of_birth = ["You must be at least 13 years old"];
        }
      }
      if (!formData.gender) {
        errors.gender = ["Please select your gender"];
      }
    }

    if (step === 3) {
      if (!formData.country_id) {
        errors.country_id = ["Please select your country"];
      }
      if (!formData.geographic_unit_id) {
        errors.geographic_unit_id = ["Please search and select your community"];
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateAge = (dateString: string): number => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setFieldErrors(data.errors);
          // Go to the step with errors
          if (data.errors.phone_number || data.errors.email || data.errors.password) {
            setCurrentStep(1);
          } else if (data.errors.first_name || data.errors.last_name || data.errors.date_of_birth || data.errors.gender) {
            setCurrentStep(2);
          } else {
            setCurrentStep(3);
          }
          throw new Error("Please fix the errors below");
        }
        throw new Error(data.message || "Registration failed");
      }

      // Redirect to email verification
      router.push(`/auth/verify-email?email=${encodeURIComponent(formData.email)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const renderFieldError = (fieldName: string) => {
    if (fieldErrors[fieldName]?.length) {
      return (
        <p className="text-xs text-destructive mt-1">
          {fieldErrors[fieldName][0]}
        </p>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>
        <p className="text-muted-foreground">
          Join the CueSports Africa community
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                  currentStep > step.id
                    ? "bg-primary text-primary-foreground"
                    : currentStep === step.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  step.id
                )}
              </div>
              <div className="mt-2 text-center hidden sm:block">
                <div className="text-xs font-medium">{step.name}</div>
                <div className="text-xs text-muted-foreground">
                  {step.description}
                </div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mx-2 ${
                  currentStep > step.id ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Step 1: Account Details */}
        {currentStep === 1 && (
          <div className="space-y-4">
            {/* Phone Number */}
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  placeholder="0705708643"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.phone_number?.length ? "border-destructive" : ""}`}
                />
              </div>
              {renderFieldError("phone_number")}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.email?.length ? "border-destructive" : ""}`}
                />
              </div>
              {renderFieldError("email")}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Min 8 chars, upper, lower, number"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${fieldErrors.password?.length ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {renderFieldError("password")}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="password_confirmation">Confirm Password *</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${fieldErrors.password_confirmation?.length ? "border-destructive" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {renderFieldError("password_confirmation")}
            </div>
          </div>
        )}

        {/* Step 2: Personal Information */}
        {currentStep === 2 && (
          <div className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="first_name"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={handleChange}
                    className={`pl-10 ${fieldErrors.first_name?.length ? "border-destructive" : ""}`}
                  />
                </div>
                {renderFieldError("first_name")}
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name *</Label>
                <Input
                  id="last_name"
                  name="last_name"
                  placeholder="Doe"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={fieldErrors.last_name?.length ? "border-destructive" : ""}
                />
                {renderFieldError("last_name")}
              </div>
            </div>

            {/* Nickname */}
            <div className="space-y-2">
              <Label htmlFor="nickname">Nickname (Optional)</Label>
              <Input
                id="nickname"
                name="nickname"
                placeholder="Your pool nickname"
                value={formData.nickname}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                This will be displayed on leaderboards
              </p>
            </div>

            {/* Date of Birth */}
            <div className="space-y-2">
              <Label htmlFor="date_of_birth">Date of Birth *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date_of_birth"
                  name="date_of_birth"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className={`pl-10 ${fieldErrors.date_of_birth?.length ? "border-destructive" : ""}`}
                />
              </div>
              {renderFieldError("date_of_birth")}
            </div>

            {/* Gender */}
            <div className="space-y-2">
              <Label htmlFor="gender">Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(value) => handleSelectChange("gender", value)}
              >
                <SelectTrigger className={fieldErrors.gender?.length ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
              {renderFieldError("gender")}
            </div>

            {/* National ID */}
            <div className="space-y-2">
              <Label htmlFor="national_id_number">National ID (Optional)</Label>
              <div className="relative">
                <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="national_id_number"
                  name="national_id_number"
                  placeholder="Your national ID number"
                  value={formData.national_id_number}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Required for official tournament registration
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Location */}
        {currentStep === 3 && (
          <div className="space-y-4">
            {/* Country */}
            <div className="space-y-2">
              <Label htmlFor="country_id">Country *</Label>
              <Select
                value={formData.country_id}
                onValueChange={(value) => handleSelectChange("country_id", value)}
              >
                <SelectTrigger className={fieldErrors.country_id?.length ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select your country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.id} value={country.id.toString()}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {renderFieldError("country_id")}
            </div>

            {/* Community Search */}
            {formData.country_id && (
              <div className="space-y-2">
                <Label>Community *</Label>
                <div ref={searchRef} className="relative">
                  {selectedCommunity ? (
                    // Selected community display
                    <div className="flex items-center gap-2 p-3 rounded-md border bg-muted/50">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{selectedCommunity.name}</div>
                        <div className="text-xs text-muted-foreground truncate">
                          {selectedCommunity.full_path}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearCommunity}
                        className="p-1 hover:bg-muted rounded"
                      >
                        <X className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </div>
                  ) : (
                    // Search input
                    <>
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Type your community name..."
                        value={communitySearch}
                        onChange={(e) => handleCommunitySearchChange(e.target.value)}
                        onFocus={() => communityResults.length > 0 && setShowResults(true)}
                        className={`pl-10 pr-10 ${fieldErrors.geographic_unit_id?.length ? "border-destructive" : ""}`}
                      />
                      {isSearching && (
                        <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                      )}
                    </>
                  )}

                  {/* Search Results Dropdown */}
                  {showResults && communityResults.length > 0 && !selectedCommunity && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg max-h-60 overflow-auto">
                      {communityResults.map((community) => (
                        <button
                          key={community.id}
                          type="button"
                          onClick={() => handleSelectCommunity(community)}
                          className="w-full px-3 py-2 text-left hover:bg-muted flex items-start gap-2"
                        >
                          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                          <div className="min-w-0">
                            <div className="font-medium truncate">{community.name}</div>
                            <div className="text-xs text-muted-foreground truncate">
                              {community.full_path}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* No Results Message */}
                  {showResults && communitySearch.length >= 2 && communityResults.length === 0 && !isSearching && (
                    <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-lg p-3 text-sm text-muted-foreground">
                      No communities found for "{communitySearch}"
                    </div>
                  )}
                </div>
                {renderFieldError("geographic_unit_id")}
                <p className="text-xs text-muted-foreground">
                  Search for your community by name. This helps match you with local tournaments.
                </p>
              </div>
            )}

            {selectedCommunity && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 text-sm flex items-center gap-2">
                <Check className="h-4 w-4" />
                Location selected successfully
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 pt-4">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep} className="flex-1">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          )}
          {currentStep < 3 ? (
            <Button type="button" onClick={nextStep} className="flex-1">
              Continue
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>

      {/* Sign In Link */}
      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/signin" className="text-primary hover:underline font-medium">
          Sign in
        </Link>
      </div>
    </div>
  );
}
