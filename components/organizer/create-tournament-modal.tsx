"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  MapPin,
  Wallet,
  Loader2,
  X,
  Search,
} from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { tournamentApi, locationApi } from "@/lib/api";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";

interface CreateTournamentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function CreateTournamentModal({
  open,
  onOpenChange,
  onSuccess,
}: CreateTournamentModalProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  // Geographic data
  const [scopeType, setScopeType] = useState<"open" | "county" | "constituency">("open");
  const [userCountryId, setUserCountryId] = useState<number | null>(null);

  // Smart search for county (MESO level = 4)
  const [countySearch, setCountySearch] = useState("");
  const [countyResults, setCountyResults] = useState<Array<{ id: number; name: string; full_path?: string }>>([]);
  const [selectedCounty, setSelectedCounty] = useState<{ id: number; name: string } | null>(null);
  const [isSearchingCounty, setIsSearchingCounty] = useState(false);

  // Smart search for constituency (MICRO level = 5)
  const [constituencySearch, setConstituencySearch] = useState("");
  const [constituencyResults, setConstituencyResults] = useState<Array<{ id: number; name: string; full_path?: string }>>([]);
  const [selectedConstituency, setSelectedConstituency] = useState<{ id: number; name: string } | null>(null);
  const [isSearchingConstituency, setIsSearchingConstituency] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    geographic_scope_id: "",
    max_participants: 16,
    race_to: 3,
    finals_race_to: "",
    entry_fee: 0,
    venue_name: "",
    venue_address: "",
    starts_at: "",
    registration_closes_at: "",
  });

  // Fetch user's country on modal open (from their community's ancestors)
  useEffect(() => {
    const fetchUserCountry = async () => {
      try {
        // Get the user's location (community) and find their country from ancestors
        if (user?.player_profile?.location?.id) {
          const locationData = await locationApi.get(user.player_profile.location.id);

          // Find the country (level 2 = NATIONAL) from ancestors
          const country = locationData.ancestors?.find(a => a.level === 2);
          if (country) {
            setUserCountryId(country.id);
            return;
          }
        }

        // Fallback: get first country from countries list
        const countriesData = await locationApi.countries();
        const country = countriesData.countries?.[0];
        if (country) {
          setUserCountryId(country.id);
        }
      } catch (err) {
        // Fallback: try to get first country
        try {
          const countriesData = await locationApi.countries();
          const country = countriesData.countries?.[0];
          if (country) {
            setUserCountryId(country.id);
          }
        } catch {}
      }
    };
    if (open) {
      fetchUserCountry();
    }
  }, [open, user]);

  // Smart search for counties (debounced) - MESO level = 4
  useEffect(() => {
    const searchCounties = async () => {
      if (countySearch.length < 2) {
        setCountyResults([]);
        return;
      }

      setIsSearchingCounty(true);
      try {
        // Search for MESO level (4) locations (counties)
        const data = await locationApi.search(countySearch, {
          level: 4,
          country_id: userCountryId || undefined,
        });
        setCountyResults(data.results || []);
      } catch (err) {
        setCountyResults([]);
      } finally {
        setIsSearchingCounty(false);
      }
    };

    const debounceTimer = setTimeout(searchCounties, 300);
    return () => clearTimeout(debounceTimer);
  }, [countySearch, userCountryId]);

  // Smart search for constituencies (debounced) - MICRO level = 5
  useEffect(() => {
    const searchConstituencies = async () => {
      if (constituencySearch.length < 2) {
        setConstituencyResults([]);
        return;
      }

      setIsSearchingConstituency(true);
      try {
        // Search for MICRO level (5) locations (constituencies/sub-counties)
        const data = await locationApi.search(constituencySearch, {
          level: 5,
          country_id: userCountryId || undefined,
        });
        setConstituencyResults(data.results || []);
      } catch (err) {
        setConstituencyResults([]);
      } finally {
        setIsSearchingConstituency(false);
      }
    };

    const debounceTimer = setTimeout(searchConstituencies, 300);
    return () => clearTimeout(debounceTimer);
  }, [constituencySearch, userCountryId]);

  // Handle scope type change
  const handleScopeTypeChange = (type: "open" | "county" | "constituency") => {
    setScopeType(type);
    setCountySearch("");
    setCountyResults([]);
    setSelectedCounty(null);
    setConstituencySearch("");
    setConstituencyResults([]);
    setSelectedConstituency(null);
    setFormData((prev) => ({ ...prev, geographic_scope_id: "" }));
  };

  // Handle county selection from search results
  const handleCountySelect = (county: { id: number; name: string }) => {
    setSelectedCounty(county);
    setCountySearch(county.name);
    setCountyResults([]);
    setFormData((prev) => ({ ...prev, geographic_scope_id: String(county.id) }));
  };

  // Handle constituency selection from search results
  const handleConstituencySelect = (constituency: { id: number; name: string }) => {
    setSelectedConstituency(constituency);
    setConstituencySearch(constituency.name);
    setConstituencyResults([]);
    setFormData((prev) => ({ ...prev, geographic_scope_id: String(constituency.id) }));
  };

  const resetForm = () => {
    setStep(1);
    setError("");
    setScopeType("open");
    setCountySearch("");
    setCountyResults([]);
    setSelectedCounty(null);
    setConstituencySearch("");
    setConstituencyResults([]);
    setSelectedConstituency(null);
    setFormData({
      name: "",
      description: "",
      geographic_scope_id: "",
      max_participants: 16,
      race_to: 3,
      finals_race_to: "",
      entry_fee: 0,
      venue_name: "",
      venue_address: "",
      starts_at: "",
      registration_closes_at: "",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await tournamentApi.create({
        name: formData.name,
        description: formData.description || undefined,
        geographic_scope_id: formData.geographic_scope_id
          ? Number(formData.geographic_scope_id)
          : undefined,
        max_participants: formData.max_participants,
        race_to: formData.race_to,
        finals_race_to: formData.finals_race_to
          ? Number(formData.finals_race_to)
          : undefined,
        entry_fee: formData.entry_fee * 100,
        venue_name: formData.venue_name || undefined,
        venue_address: formData.venue_address || undefined,
        starts_at: formData.starts_at,
        registration_closes_at:
          formData.registration_closes_at || formData.starts_at,
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
      router.push(`/organizer/tournaments/${response.tournament.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create tournament");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1:
        // Name is required, geographic scope is optional
        return formData.name.length >= 5;
      case 2:
        return formData.max_participants >= 4 && formData.race_to >= 2;
      case 3:
        return formData.starts_at;
      default:
        return false;
    }
  };

  return (
    <DialogPrimitive.Root
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm();
        onOpenChange(isOpen);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content
          className={cn(
            "fixed z-50 bg-background shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
            // Mobile: slide from right
            "inset-y-0 right-0 h-full w-full data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            // Desktop: centered modal
            "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:h-auto lg:max-h-[90vh] lg:w-full lg:max-w-xl lg:rounded-lg lg:border lg:data-[state=closed]:slide-out-to-left-1/2 lg:data-[state=closed]:slide-out-to-top-[48%] lg:data-[state=open]:slide-in-from-left-1/2 lg:data-[state=open]:slide-in-from-top-[48%] lg:data-[state=closed]:zoom-out-95 lg:data-[state=open]:zoom-in-95"
          )}
        >
          <div className="flex flex-col h-full lg:h-auto lg:max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <DialogPrimitive.Title className="flex items-center gap-2 font-semibold">
                  <Trophy className="h-5 w-5 text-gold" />
                  Create Tournament
                </DialogPrimitive.Title>
              </div>
              <DialogPrimitive.Close className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </DialogPrimitive.Close>
            </div>

            {/* Progress Steps */}
            <div className="flex items-center justify-center gap-2 py-4 px-4 border-b">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === s
                        ? "bg-gold text-black"
                        : step > s
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step > s ? "✓" : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-1 w-8 ${step > s ? "bg-green-500" : "bg-muted"}`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <form id="create-tournament-form" onSubmit={handleSubmit}>
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tournament Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Weekly 8-Ball Championship"
                        required
                        minLength={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your tournament..."
                        rows={3}
                      />
                    </div>

                    {/* Scope Type Selection */}
                    <div className="space-y-2">
                      <Label>
                        <MapPin className="inline h-4 w-4 mr-1" />
                        Registration Scope
                      </Label>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          type="button"
                          onClick={() => handleScopeTypeChange("open")}
                          className={cn(
                            "py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors",
                            scopeType === "open"
                              ? "bg-gold/10 border-gold text-gold"
                              : "border-input hover:bg-muted"
                          )}
                        >
                          Open
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScopeTypeChange("county")}
                          className={cn(
                            "py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors",
                            scopeType === "county"
                              ? "bg-gold/10 border-gold text-gold"
                              : "border-input hover:bg-muted"
                          )}
                        >
                          County
                        </button>
                        <button
                          type="button"
                          onClick={() => handleScopeTypeChange("constituency")}
                          className={cn(
                            "py-2.5 px-3 rounded-lg border text-sm font-medium transition-colors",
                            scopeType === "constituency"
                              ? "bg-gold/10 border-gold text-gold"
                              : "border-input hover:bg-muted"
                          )}
                        >
                          Constituency
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {scopeType === "open"
                          ? "Anyone can register for this tournament"
                          : scopeType === "county"
                          ? "Only players from the selected county can join"
                          : "Only players from the selected constituency can join"}
                      </p>
                    </div>

                    {/* County Search (only if scope is county) */}
                    {scopeType === "county" && (
                      <div className="space-y-2">
                        <Label htmlFor="county">Search County</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="county"
                            value={countySearch}
                            onChange={(e) => {
                              setCountySearch(e.target.value);
                              setSelectedCounty(null);
                              setFormData((prev) => ({ ...prev, geographic_scope_id: "" }));
                            }}
                            placeholder="Type at least 2 characters..."
                            className="pl-10"
                          />
                          {isSearchingCounty && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>

                        {/* Search Results Dropdown */}
                        {countyResults.length > 0 && !selectedCounty && (
                          <div className="border rounded-lg bg-card shadow-lg max-h-48 overflow-y-auto">
                            {countyResults.map((result) => (
                              <button
                                key={result.id}
                                type="button"
                                onClick={() => handleCountySelect(result)}
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                              >
                                <span className="font-medium">{result.name}</span>
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Selected County Badge */}
                        {selectedCounty && (
                          <div className="flex items-center gap-2 p-2 bg-gold/10 rounded-lg border border-gold/20">
                            <MapPin className="h-4 w-4 text-gold" />
                            <span className="text-sm font-medium">{selectedCounty.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedCounty(null);
                                setCountySearch("");
                                setFormData((prev) => ({ ...prev, geographic_scope_id: "" }));
                              }}
                              className="ml-auto text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {countySearch.length > 0 && countySearch.length < 2 && (
                          <p className="text-xs text-muted-foreground">
                            Type at least 2 characters to search
                          </p>
                        )}
                      </div>
                    )}

                    {/* Constituency Search (only if scope is constituency) */}
                    {scopeType === "constituency" && (
                      <div className="space-y-2">
                        <Label htmlFor="constituency">Search Constituency</Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="constituency"
                            value={constituencySearch}
                            onChange={(e) => {
                              setConstituencySearch(e.target.value);
                              setSelectedConstituency(null);
                              setFormData((prev) => ({ ...prev, geographic_scope_id: "" }));
                            }}
                            placeholder="Type at least 2 characters..."
                            className="pl-10"
                          />
                          {isSearchingConstituency && (
                            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                          )}
                        </div>

                        {/* Search Results Dropdown */}
                        {constituencyResults.length > 0 && !selectedConstituency && (
                          <div className="border rounded-lg bg-card shadow-lg max-h-48 overflow-y-auto">
                            {constituencyResults.map((result) => (
                              <button
                                key={result.id}
                                type="button"
                                onClick={() => handleConstituencySelect(result)}
                                className="w-full text-left px-3 py-2 hover:bg-muted text-sm border-b last:border-b-0"
                              >
                                <span className="font-medium">{result.name}</span>
                                {result.full_path && (
                                  <span className="text-xs text-muted-foreground block">
                                    {result.full_path}
                                  </span>
                                )}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Selected Constituency Badge */}
                        {selectedConstituency && (
                          <div className="flex items-center gap-2 p-2 bg-gold/10 rounded-lg border border-gold/20">
                            <MapPin className="h-4 w-4 text-gold" />
                            <span className="text-sm font-medium">{selectedConstituency.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedConstituency(null);
                                setConstituencySearch("");
                                setFormData((prev) => ({ ...prev, geographic_scope_id: "" }));
                              }}
                              className="ml-auto text-muted-foreground hover:text-foreground"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        )}

                        {constituencySearch.length > 0 && constituencySearch.length < 2 && (
                          <p className="text-xs text-muted-foreground">
                            Type at least 2 characters to search
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Settings */}
                {step === 2 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="max_participants">Max Participants *</Label>
                      <Input
                        id="max_participants"
                        name="max_participants"
                        type="number"
                        value={formData.max_participants}
                        onChange={handleChange}
                        min={4}
                        max={128}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Recommended: 8, 16, 32, or 64 for elimination formats
                      </p>
                    </div>

                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="race_to">Race To *</Label>
                        <Input
                          id="race_to"
                          name="race_to"
                          type="number"
                          value={formData.race_to}
                          onChange={handleChange}
                          min={2}
                          max={7}
                          required
                        />
                        <p className="text-xs text-muted-foreground">
                          Frames to win
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="finals_race_to">Finals Race To</Label>
                        <Input
                          id="finals_race_to"
                          name="finals_race_to"
                          type="number"
                          value={formData.finals_race_to}
                          onChange={handleChange}
                          min={formData.race_to}
                          max={9}
                          placeholder={String(formData.race_to)}
                        />
                        <p className="text-xs text-muted-foreground">Optional</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="entry_fee">Entry Fee (KES)</Label>
                      <div className="relative">
                        <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="entry_fee"
                          name="entry_fee"
                          type="number"
                          value={formData.entry_fee}
                          onChange={handleChange}
                          min={0}
                          className="pl-10"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Set to 0 for a free tournament
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 3: Schedule & Venue */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="grid gap-4 grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="starts_at">Start Date *</Label>
                        <Input
                          id="starts_at"
                          name="starts_at"
                          type="datetime-local"
                          value={formData.starts_at}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="registration_closes_at">Reg. Closes</Label>
                        <Input
                          id="registration_closes_at"
                          name="registration_closes_at"
                          type="datetime-local"
                          value={formData.registration_closes_at}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue_name">Venue Name</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="venue_name"
                          name="venue_name"
                          value={formData.venue_name}
                          onChange={handleChange}
                          placeholder="e.g., Club 8 Pool Hall"
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="venue_address">Venue Address</Label>
                      <Input
                        id="venue_address"
                        name="venue_address"
                        value={formData.venue_address}
                        onChange={handleChange}
                        placeholder="Full address"
                      />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Footer with Navigation Buttons */}
            <div className="flex items-center justify-between p-4 border-t bg-muted/30">
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Previous
                </Button>
              ) : (
                <div />
              )}

              {step < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                  className="bg-gold text-black hover:bg-gold/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  form="create-tournament-form"
                  disabled={isLoading || !isStepValid()}
                  className="bg-gold text-black hover:bg-gold/90"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Trophy className="h-4 w-4 mr-2" />
                      Create Tournament
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
