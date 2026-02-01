"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";

export default function RoleSelectPage() {
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isPlayer, isOrganizer, switchRole } =
    useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/signin");
      return;
    }

    // If user only has one role, redirect directly
    if (!isLoading && isAuthenticated) {
      if (isPlayer && !isOrganizer) {
        router.push("/player");
        return;
      }
      if (isOrganizer && !isPlayer) {
        router.push("/organizer");
        return;
      }
    }
  }, [isLoading, isAuthenticated, isPlayer, isOrganizer, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated || (!isPlayer && !isOrganizer)) {
    return null;
  }

  const playerProfile = user?.player_profile;
  const organizerProfile = user?.organizer_profile;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2 text-center">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground">
          Choose how you&apos;d like to continue
        </p>
      </div>

      {/* Role Cards */}
      <div className="space-y-4">
        {/* Player Option */}
        {isPlayer && (
          <Card
            className="cursor-pointer hover:shadow-md transition-all hover:border-primary"
            onClick={() => switchRole("player")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-7 w-7 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold">Player Dashboard</h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {playerProfile?.first_name} {playerProfile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    View tournaments, matches, and your rating
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Organizer Option */}
        {isOrganizer && (
          <Card
            className="cursor-pointer hover:shadow-md transition-all hover:border-gold"
            onClick={() => switchRole("organizer")}
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <Building2 className="h-7 w-7 text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold">Organizer Dashboard</h2>
                  <p className="text-sm text-muted-foreground truncate">
                    {organizerProfile?.organization_name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Manage tournaments, participants, and payouts
                  </p>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0" />
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Info text */}
      <p className="text-center text-xs text-muted-foreground">
        You can switch between dashboards anytime using the role switcher
      </p>
    </div>
  );
}
