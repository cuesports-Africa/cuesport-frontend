"use client";

import { ChevronDown, User, Building2, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/auth-context";

interface RoleSwitcherProps {
  variant?: "default" | "compact";
}

export function RoleSwitcher({ variant = "default" }: RoleSwitcherProps) {
  const { user, activeRole, isPlayer, isOrganizer, isDualRole, switchRole } =
    useAuth();

  // Only show for dual-role users
  if (!isDualRole) {
    return null;
  }

  const currentRoleLabel =
    activeRole === "organizer"
      ? user?.organizer_profile?.organization_name || "Organizer"
      : `${user?.player_profile?.first_name || "Player"} ${user?.player_profile?.last_name || ""}`.trim();

  const currentRoleIcon =
    activeRole === "organizer" ? (
      <Building2 className="h-4 w-4" />
    ) : (
      <User className="h-4 w-4" />
    );

  if (variant === "compact") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            {currentRoleIcon}
            <ChevronDown className="h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Switch Dashboard</DropdownMenuLabel>
          <DropdownMenuSeparator />

          {isPlayer && (
            <DropdownMenuItem
              onClick={() => switchRole("player")}
              className="gap-2"
            >
              <User className="h-4 w-4" />
              <span className="flex-1">Player Dashboard</span>
              {activeRole === "player" && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )}

          {isOrganizer && (
            <DropdownMenuItem
              onClick={() => switchRole("organizer")}
              className="gap-2"
            >
              <Building2 className="h-4 w-4" />
              <span className="flex-1">Organizer Dashboard</span>
              {activeRole === "organizer" && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 justify-between min-w-[180px]"
        >
          <span className="flex items-center gap-2">
            {currentRoleIcon}
            <span className="truncate max-w-[120px]">{currentRoleLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          Switch Dashboard
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        {isPlayer && (
          <DropdownMenuItem
            onClick={() => switchRole("player")}
            className="gap-3 py-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.player_profile?.first_name}{" "}
                {user?.player_profile?.last_name}
              </p>
              <p className="text-xs text-muted-foreground">Player Dashboard</p>
            </div>
            {activeRole === "player" && (
              <Check className="h-4 w-4 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        )}

        {isOrganizer && (
          <DropdownMenuItem
            onClick={() => switchRole("organizer")}
            className="gap-3 py-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
              <Building2 className="h-4 w-4 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {user?.organizer_profile?.organization_name}
              </p>
              <p className="text-xs text-muted-foreground">
                Organizer Dashboard
              </p>
            </div>
            {activeRole === "organizer" && (
              <Check className="h-4 w-4 text-primary shrink-0" />
            )}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
