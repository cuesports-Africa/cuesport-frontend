"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { authApi, type User } from "@/lib/api";
import { Loader2 } from "lucide-react";

// Cache user across navigations within the organizer section
let cachedUser: User | null = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface OrganizerUserContextValue {
    user: User;
    refreshUser: () => Promise<void>;
}

const OrganizerUserContext = createContext<OrganizerUserContextValue | null>(null);

export function useOrganizerUser() {
    const ctx = useContext(OrganizerUserContext);
    if (!ctx) throw new Error("useOrganizerUser must be used inside OrganizerAuthGuard");
    return ctx;
}

export function OrganizerAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(cachedUser);
    const [loading, setLoading] = useState(!cachedUser || Date.now() - cacheTimestamp > CACHE_TTL);

    const fetchUser = useCallback(async () => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        try {
            const res = await authApi.me();
            if (!res.user.roles.is_organizer || !res.user.organizer_profile) {
                router.replace("/become-organizer");
                return;
            }
            cachedUser = res.user;
            cacheTimestamp = Date.now();
            setUser(res.user);
        } catch {
            cachedUser = null;
            localStorage.removeItem("auth_token");
            router.replace("/login");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        // Use cache if fresh
        if (cachedUser && Date.now() - cacheTimestamp < CACHE_TTL) {
            setUser(cachedUser);
            setLoading(false);
            return;
        }
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(async () => {
        try {
            const res = await authApi.me();
            cachedUser = res.user;
            cacheTimestamp = Date.now();
            setUser(res.user);
        } catch {
            // ignore refresh errors
        }
    }, []);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-electric" />
            </div>
        );
    }

    return (
        <OrganizerUserContext.Provider value={{ user, refreshUser }}>
            {children}
        </OrganizerUserContext.Provider>
    );
}
