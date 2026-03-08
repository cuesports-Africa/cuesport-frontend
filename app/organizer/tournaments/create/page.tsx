"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { tournamentApi, locationApi, type GeographicUnit } from "@/lib/api";
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
import { ArrowLeft, Loader2, Trophy } from "lucide-react";

export default function CreateTournamentPage() {
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [countryId, setCountryId] = useState<string>("");
  const [regionId, setRegionId] = useState<string>("");
  const [startsAt, setStartsAt] = useState("");
  const [registrationClosesAt, setRegistrationClosesAt] = useState("");
  const [maxPlayers, setMaxPlayers] = useState<string>("32");
  const [raceTo, setRaceTo] = useState<string>("3");
  const [finalsRaceTo, setFinalsRaceTo] = useState<string>("");
  const [genderRestriction, setGenderRestriction] = useState<string>("open");
  const [winnersCount, setWinnersCount] = useState<string>("1");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [entryFee, setEntryFee] = useState<string>("0");
  const [entryFeeCurrency, setEntryFeeCurrency] = useState<string>("KES");

  // Location data
  const [countries, setCountries] = useState<GeographicUnit[]>([]);
  const [regions, setRegions] = useState<GeographicUnit[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [loadingRegions, setLoadingRegions] = useState(false);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load countries on mount
  useEffect(() => {
    locationApi
      .countries()
      .then((res) => setCountries(res.countries))
      .catch(() => setError("Failed to load countries"))
      .finally(() => setLoadingCountries(false));
  }, []);

  // Load regions when country changes
  useEffect(() => {
    if (!countryId) {
      setRegions([]);
      setRegionId("");
      return;
    }

    setLoadingRegions(true);
    setRegionId("");
    locationApi
      .children(Number(countryId))
      .then((res) => setRegions(res.children))
      .catch(() => setRegions([]))
      .finally(() => setLoadingRegions(false));
  }, [countryId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validation
    if (!name.trim()) {
      setError("Tournament name is required.");
      return;
    }
    if (!regionId) {
      setError("Please select a country and region.");
      return;
    }
    if (!startsAt) {
      setError("Start date is required.");
      return;
    }
    if (!registrationClosesAt) {
      setError("Registration close date is required.");
      return;
    }
    if (!maxPlayers || Number(maxPlayers) < 2) {
      setError("Max players must be at least 2.");
      return;
    }

    setSubmitting(true);

    try {
      const payload: Parameters<typeof tournamentApi.create>[0] = {
        name: name.trim(),
        geographic_scope_id: Number(regionId),
        starts_at: new Date(startsAt).toISOString(),
        registration_closes_at: new Date(registrationClosesAt).toISOString(),
        max_players: Number(maxPlayers),
      };

      if (description.trim()) payload.description = description.trim();
      if (venueName.trim()) payload.venue_name = venueName.trim();
      if (venueAddress.trim()) payload.venue_address = venueAddress.trim();
      if (Number(entryFee) > 0) {
        payload.entry_fee = Number(entryFee);
        payload.entry_fee_currency = entryFeeCurrency;
      }
      if (raceTo) payload.race_to = Number(raceTo);
      if (finalsRaceTo) payload.finals_race_to = Number(finalsRaceTo);
      if (genderRestriction && genderRestriction !== "open") {
        payload.gender_restriction = genderRestriction;
      }
      if (winnersCount) payload.winners_count = Number(winnersCount);

      const res = await tournamentApi.create(payload);
      router.push(`/organizer/tournaments/${res.tournament.id}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to create tournament."
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href="/organizer/tournaments"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Tournaments
      </Link>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-electric/10 flex items-center justify-center">
          <Trophy className="h-6 w-6 text-electric" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Create Tournament
          </h1>
          <p className="text-sm text-muted-foreground">
            Set up a new tournament for your players
          </p>
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Basic Info */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Basic Info
          </h2>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Tournament Name *
              </Label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Nairobi Open 8-Ball Championship"
                className="search-input-dark h-12 rounded-xl border-border/20"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Description
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your tournament, rules, prizes, etc."
                rows={4}
                className="search-input-dark w-full rounded-xl border-border/20 px-3 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-ring/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Location */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Location
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Country *
              </Label>
              <Select
                value={countryId}
                onValueChange={setCountryId}
                disabled={loadingCountries}
              >
                <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                  <SelectValue
                    placeholder={
                      loadingCountries ? "Loading..." : "Select country"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem
                      key={country.id}
                      value={String(country.id)}
                    >
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Region *
              </Label>
              <Select
                value={regionId}
                onValueChange={setRegionId}
                disabled={!countryId || loadingRegions}
              >
                <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                  <SelectValue
                    placeholder={
                      loadingRegions
                        ? "Loading..."
                        : !countryId
                          ? "Select country first"
                          : "Select region"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem
                      key={region.id}
                      value={String(region.id)}
                    >
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Section 3: Schedule */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Start Date & Time *
              </Label>
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="search-input-dark h-12 rounded-xl border-border/20"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Registration Closes *
              </Label>
              <Input
                type="datetime-local"
                value={registrationClosesAt}
                onChange={(e) => setRegistrationClosesAt(e.target.value)}
                className="search-input-dark h-12 rounded-xl border-border/20"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Settings */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Settings
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Max Players *
              </Label>
              <Input
                type="number"
                min={2}
                value={maxPlayers}
                onChange={(e) => setMaxPlayers(e.target.value)}
                placeholder="32"
                className="search-input-dark h-12 rounded-xl border-border/20"
                required
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Race To (Frames)
              </Label>
              <Input
                type="number"
                min={1}
                value={raceTo}
                onChange={(e) => setRaceTo(e.target.value)}
                placeholder="3"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Finals Race To
              </Label>
              <Input
                type="number"
                min={1}
                value={finalsRaceTo}
                onChange={(e) => setFinalsRaceTo(e.target.value)}
                placeholder="e.g. 5"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Gender Restriction
              </Label>
              <Select
                value={genderRestriction}
                onValueChange={setGenderRestriction}
              >
                <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                  <SelectValue placeholder="Open" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="male">Male Only</SelectItem>
                  <SelectItem value="female">Female Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Winners Count
              </Label>
              <Input
                type="number"
                min={1}
                value={winnersCount}
                onChange={(e) => setWinnersCount(e.target.value)}
                placeholder="1"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Venue */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">Venue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Venue Name
              </Label>
              <Input
                type="text"
                value={venueName}
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Club 254 Pool Hall"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Venue Address
              </Label>
              <Input
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                placeholder="e.g. Kenyatta Ave, Nairobi"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
          </div>
        </div>

        {/* Section 6: Entry Fee */}
        <div className="card-dark rounded-2xl p-6 border border-border/20">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Entry Fee
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Entry Fee Amount
              </Label>
              <Input
                type="number"
                min={0}
                step="0.01"
                value={entryFee}
                onChange={(e) => setEntryFee(e.target.value)}
                placeholder="0"
                className="search-input-dark h-12 rounded-xl border-border/20"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Currency
              </Label>
              <Select
                value={entryFeeCurrency}
                onValueChange={setEntryFeeCurrency}
              >
                <SelectTrigger className="search-input-dark h-12 rounded-xl border-border/20 w-full">
                  <SelectValue placeholder="KES" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                  <SelectItem value="USD">USD - US Dollar</SelectItem>
                  <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                  <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex items-center gap-4 pt-2">
          <Button
            type="submit"
            disabled={submitting}
            className="bg-electric hover:bg-electric/90 text-[#030e10] font-bold rounded-xl h-12 px-8"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Tournament"
            )}
          </Button>
          <Link
            href="/organizer/tournaments"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
