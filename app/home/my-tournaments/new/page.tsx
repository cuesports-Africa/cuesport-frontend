"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Trophy,
  Calendar,
  Users,
  CreditCard,
  Info,
  Loader2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formats = [
  {
    id: "single_elimination",
    name: "Single Elimination",
    description: "One loss and you're out. Fast and simple.",
  },
  {
    id: "double_elimination",
    name: "Double Elimination",
    description: "Players must lose twice to be eliminated.",
  },
  {
    id: "round_robin",
    name: "Round Robin",
    description: "Everyone plays everyone. Best for smaller groups.",
  },
  {
    id: "swiss",
    name: "Swiss System",
    description: "Players with similar records face each other.",
  },
];

const playerLimits = [8, 16, 32, 64, 128];

interface FormData {
  name: string;
  description: string;
  venue_name: string;
  venue_address: string;
  date: string;
  time: string;
  format: string;
  max_players: number;
  entry_fee: number;
  race_to: number;
  registration_deadline: string;
}

export default function NewTournamentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    venue_name: "",
    venue_address: "",
    date: "",
    time: "",
    format: "single_elimination",
    max_players: 32,
    entry_fee: 500,
    race_to: 5,
    registration_deadline: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "max_players" || name === "entry_fee" || name === "race_to"
        ? parseInt(value) || 0
        : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("auth_token");

      // Combine date and time for starts_at
      const startsAt = formData.date && formData.time
        ? new Date(`${formData.date}T${formData.time}`).toISOString()
        : null;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tournaments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            venue_name: formData.venue_name,
            venue_address: formData.venue_address,
            format: formData.format,
            starts_at: startsAt,
            registration_closes_at: formData.registration_deadline || startsAt,
            entry_fee: formData.entry_fee * 100, // Convert to cents
            best_of: formData.race_to * 2 - 1, // Convert race_to to best_of
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create tournament");
      }

      // Clear cache to force refresh
      localStorage.removeItem("my_tournaments_cache");

      router.push("/home/my-tournaments");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name.trim() !== "" && formData.venue_name.trim() !== "";
      case 2:
        return formData.date !== "" && formData.time !== "";
      case 3:
        return formData.format !== "" && formData.max_players > 0;
      default:
        return true;
    }
  };

  return (
    <div className="p-4 lg:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/home/my-tournaments">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Tournament</h1>
          <p className="text-sm text-muted-foreground">
            Step {step} of 4
          </p>
        </div>
      </div>

      {/* Review Notice */}
      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
        <Clock className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-yellow-800">Tournaments require approval</p>
          <p className="text-yellow-700">
            After creating, your tournament will be reviewed by our team before you can open registration.
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s < step
                  ? "bg-gold text-primary"
                  : s === step
                  ? "bg-gold text-primary"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {s}
            </div>
            {s < 4 && (
              <div className={`flex-1 h-1 rounded ${s < step ? "bg-gold" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Step 1: Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="font-semibold">Basic Information</h2>
                <p className="text-sm text-muted-foreground">Name and location</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Weekly 8-Ball Classic"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                name="description"
                placeholder="Tell players what to expect..."
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_name">Venue Name *</Label>
              <Input
                id="venue_name"
                name="venue_name"
                placeholder="e.g., Nairobi Sports Club"
                value={formData.venue_name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="venue_address">Venue Address</Label>
              <Input
                id="venue_address"
                name="venue_address"
                placeholder="e.g., Ngong Road, Nairobi"
                value={formData.venue_address}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Time */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="font-semibold">Date & Time</h2>
                <p className="text-sm text-muted-foreground">When is the tournament?</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Start Time *</Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="registration_deadline">Registration Deadline</Label>
              <Input
                id="registration_deadline"
                name="registration_deadline"
                type="datetime-local"
                value={formData.registration_deadline}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to close registration when tournament starts
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Format & Players */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="font-semibold">Format & Players</h2>
                <p className="text-sm text-muted-foreground">How will players compete?</p>
              </div>
            </div>

            <div className="space-y-3">
              <Label>Tournament Format *</Label>
              <div className="grid gap-3">
                {formats.map((format) => (
                  <label
                    key={format.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                      formData.format === format.id
                        ? "border-gold bg-gold/5"
                        : "hover:border-gold/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="format"
                      value={format.id}
                      checked={formData.format === format.id}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-medium">{format.name}</div>
                      <div className="text-sm text-muted-foreground">{format.description}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="max_players">Max Players *</Label>
                <select
                  id="max_players"
                  name="max_players"
                  value={formData.max_players}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {playerLimits.map((limit) => (
                    <option key={limit} value={limit}>
                      {limit} players
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="race_to">Race To *</Label>
                <select
                  id="race_to"
                  name="race_to"
                  value={formData.race_to}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  {[3, 4, 5, 6, 7, 8, 9].map((n) => (
                    <option key={n} value={n}>
                      Race to {n}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Entry Fee & Summary */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-gold" />
              </div>
              <div>
                <h2 className="font-semibold">Entry Fee & Review</h2>
                <p className="text-sm text-muted-foreground">Set pricing and submit for review</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="entry_fee">Entry Fee (KES) *</Label>
              <Input
                id="entry_fee"
                name="entry_fee"
                type="number"
                min="0"
                step="100"
                value={formData.entry_fee}
                onChange={handleChange}
                required
              />
              <p className="text-xs text-muted-foreground">
                Set to 0 for free tournaments
              </p>
            </div>

            {/* Prize Pool Preview */}
            {formData.entry_fee > 0 && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Info className="h-4 w-4 text-gold" />
                  Prize Pool Estimate
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">If full ({formData.max_players} players)</div>
                    <div className="text-xl font-bold">
                      KES {(formData.entry_fee * formData.max_players * 0.8).toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">After 20% platform fee</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Per player entry</div>
                    <div className="text-xl font-bold">
                      KES {formData.entry_fee.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Entry fee</div>
                  </div>
                </div>
              </div>
            )}

            {/* Summary */}
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Tournament Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">{formData.name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Venue</span>
                  <span className="font-medium">{formData.venue_name || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span className="font-medium">
                    {formData.date && formData.time
                      ? `${formData.date} at ${formData.time}`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">
                    {formats.find((f) => f.id === formData.format)?.name || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Players</span>
                  <span className="font-medium">{formData.max_players}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Entry Fee</span>
                  <span className="font-medium">
                    {formData.entry_fee === 0 ? "Free" : `KES ${formData.entry_fee.toLocaleString()}`}
                  </span>
                </div>
              </div>
            </div>

            {/* What happens next */}
            <div className="bg-primary/5 rounded-lg p-4 text-sm">
              <p className="font-medium text-foreground mb-2">What happens next?</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>1. Your tournament will be reviewed by our team</li>
                <li>2. You'll be notified once it's approved</li>
                <li>3. Then you can open registration for players</li>
              </ul>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1"
            >
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="flex-1 bg-gold hover:bg-gold/90 text-primary"
            >
              Continue
            </Button>
          ) : (
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold hover:bg-gold/90 text-primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit for Review"
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
