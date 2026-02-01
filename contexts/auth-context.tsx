"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { authApi, type User } from "@/lib/api";

type ActiveRole = "player" | "organizer" | null;

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  activeRole: ActiveRole;
  isPlayer: boolean;
  isOrganizer: boolean;
  isDualRole: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchRole: (role: ActiveRole) => void;
  getDefaultDashboard: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeRole, setActiveRole] = useState<ActiveRole>(null);

  // Derived state
  const isAuthenticated = !!user;
  const isPlayer = !!user?.roles?.is_player;
  const isOrganizer = !!user?.roles?.is_organizer && !!user?.organizer_profile;
  const isDualRole = isPlayer && isOrganizer;

  // Determine active role from current path
  useEffect(() => {
    if (pathname?.startsWith("/player")) {
      setActiveRole("player");
    } else if (pathname?.startsWith("/organizer")) {
      setActiveRole("organizer");
    }
  }, [pathname]);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      try {
        const token = localStorage.getItem("auth_token");
        const userData = localStorage.getItem("user");

        if (token && userData) {
          const parsedUser = JSON.parse(userData) as User;
          setUser(parsedUser);

          // Set initial active role based on stored preference or user roles
          const storedRole = localStorage.getItem(
            "active_role"
          ) as ActiveRole | null;
          if (storedRole && isValidRoleForUser(storedRole, parsedUser)) {
            setActiveRole(storedRole);
          } else if (parsedUser.roles?.is_player) {
            setActiveRole("player");
          } else if (
            parsedUser.roles?.is_organizer &&
            parsedUser.organizer_profile
          ) {
            setActiveRole("organizer");
          }
        }
      } catch (error) {
        console.error("Failed to parse user data:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("active_role");
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const isValidRoleForUser = (role: ActiveRole, userData: User): boolean => {
    if (role === "player") {
      return !!userData.roles?.is_player;
    }
    if (role === "organizer") {
      return !!userData.roles?.is_organizer && !!userData.organizer_profile;
    }
    return false;
  };

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    // Set default active role
    if (userData.roles?.is_player) {
      setActiveRole("player");
      localStorage.setItem("active_role", "player");
    } else if (userData.roles?.is_organizer && userData.organizer_profile) {
      setActiveRole("organizer");
      localStorage.setItem("active_role", "organizer");
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("active_role");
      setUser(null);
      setActiveRole(null);
      router.push("/");
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const { user: freshUser } = await authApi.me();
      localStorage.setItem("user", JSON.stringify(freshUser));
      setUser(freshUser);
    } catch (error) {
      console.error("Failed to refresh user:", error);
      // If refresh fails, log out
      await logout();
    }
  }, [logout]);

  const switchRole = useCallback(
    (role: ActiveRole) => {
      if (!user || !role) return;

      if (!isValidRoleForUser(role, user)) {
        console.error("Invalid role for user:", role);
        return;
      }

      setActiveRole(role);
      localStorage.setItem("active_role", role);

      // Navigate to the appropriate dashboard
      if (role === "player") {
        router.push("/player");
      } else if (role === "organizer") {
        router.push("/organizer");
      }
    },
    [user, router]
  );

  const getDefaultDashboard = useCallback((): string => {
    if (!user) return "/auth/signin";

    const userIsPlayer = user.roles?.is_player;
    const userIsOrganizer =
      user.roles?.is_organizer && user.organizer_profile;

    // If dual role, go to role selection
    if (userIsPlayer && userIsOrganizer) {
      return "/auth/role-select";
    }

    // Single role - go to appropriate dashboard
    if (userIsPlayer) {
      return "/player";
    }

    if (userIsOrganizer) {
      return "/organizer";
    }

    // Fallback
    return "/";
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        activeRole,
        isPlayer,
        isOrganizer,
        isDualRole,
        login,
        logout,
        refreshUser,
        switchRole,
        getDefaultDashboard,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
