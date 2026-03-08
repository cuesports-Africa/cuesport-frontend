"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi, type User } from "@/lib/api";
import { Loader2 } from "lucide-react";

const OrganizerUserContext = createContext<User | null>(null);

export function useOrganizerUser() {
    const user = useContext(OrganizerUserContext);
    if (!user) throw new Error("useOrganizerUser must be used inside OrganizerAuthGuard");
    return user;
}

export function OrganizerAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            router.replace("/login");
            return;
        }

        authApi.me()
            .then((res) => {
                if (!res.user.roles.is_organizer || !res.user.organizer_profile) {
                    router.replace("/become-organizer");
                    return;
                }
                setUser(res.user);
            })
            .catch(() => {
                localStorage.removeItem("auth_token");
                router.replace("/login");
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-electric" />
            </div>
        );
    }

    return (
        <OrganizerUserContext.Provider value={user}>
            {children}
        </OrganizerUserContext.Provider>
    );
}
