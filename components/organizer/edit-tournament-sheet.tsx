"use client";

import { useState, useEffect } from "react";
import { Loader2, Trophy, MapPin, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { tournamentApi, type Tournament } from "@/lib/api";

interface EditTournamentSheetProps {
  tournament: Tournament;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updated: Tournament) => void;
}

export function EditTournamentSheet({
  tournament,
  open,
  onOpenChange,
  onSuccess,
}: EditTournamentSheetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Convert ISO date to datetime-local format
  const toLocalDatetime = (isoString?: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  };

  const [formData, setFormData] = useState({
    name: tournament.name,
    description: tournament.description || "",
    race_to: tournament.settings.race_to || 3,
    finals_race_to: tournament.settings.finals_race_to || "",
    entry_fee: (tournament.entry_fee?.amount || 0) / 100,
    venue_name: tournament.venue?.name || "",
    venue_address: tournament.venue?.address || "",
    starts_at: toLocalDatetime(tournament.dates.starts_at),
    registration_closes_at: toLocalDatetime(tournament.dates.registration_closes_at),
  });

  // Reset form when tournament changes
  useEffect(() => {
    setFormData({
      name: tournament.name,
      description: tournament.description || "",
      race_to: tournament.settings.race_to || 3,
      finals_race_to: tournament.settings.finals_race_to || "",
      entry_fee: (tournament.entry_fee?.amount || 0) / 100,
      venue_name: tournament.venue?.name || "",
      venue_address: tournament.venue?.address || "",
      starts_at: toLocalDatetime(tournament.dates.starts_at),
      registration_closes_at: toLocalDatetime(tournament.dates.registration_closes_at),
    });
    setError("");
  }, [tournament, open]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      const response = await tournamentApi.update(tournament.id, {
        name: formData.name,
        description: formData.description || undefined,
        race_to: formData.race_to,
        finals_race_to: formData.finals_race_to ? Number(formData.finals_race_to) : undefined,
        entry_fee: formData.entry_fee * 100,
        venue_name: formData.venue_name || undefined,
        venue_address: formData.venue_address || undefined,
        starts_at: formData.starts_at,
        registration_closes_at: formData.registration_closes_at || formData.starts_at,
      });

      onSuccess?.(response.tournament);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update tournament");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid = formData.name.length >= 3 && formData.race_to >= 2 && formData.starts_at;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-gold" />
            Edit Tournament
          </SheetTitle>
          <SheetDescription>
            Update tournament details. Changes will be saved immediately.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-6 px-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Basic Info</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Tournament Name</Label>
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
          </div>

          <Separator />

          {/* Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Match Settings</h3>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="race_to">Race To</Label>
                <Input
                  id="race_to"
                  name="race_to"
                  type="number"
                  value={formData.race_to}
                  onChange={handleChange}
                  min={2}
                  max={7}
                />
                <p className="text-xs text-muted-foreground">Frames to win</p>
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
              <p className="text-xs text-muted-foreground">Set to 0 for free entry</p>
            </div>
          </div>

          <Separator />

          {/* Schedule */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Schedule</h3>

            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="starts_at">Start Date</Label>
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
          </div>

          <Separator />

          {/* Venue */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Venue</h3>

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

          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !isValid}
              className="flex-1 bg-gold text-black hover:bg-gold/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
