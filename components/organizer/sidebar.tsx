"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Trophy,
    PlusCircle,
    LogOut,
    Menu,
    X,
    Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/layout/logo";
import { useOrganizerUser } from "@/app/organizer/auth-guard";

const navItems = [
    { href: "/organizer", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { href: "/organizer/tournaments", label: "My Tournaments", icon: Trophy, exact: false },
    { href: "/organizer/tournaments/create", label: "Create Tournament", icon: PlusCircle, exact: true },
];

export function OrganizerSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useOrganizerUser();
    const [mobileOpen, setMobileOpen] = useState(false);

    function isActive(href: string, exact: boolean) {
        if (exact) return pathname === href;
        return pathname.startsWith(href);
    }

    function handleLogout() {
        localStorage.removeItem("auth_token");
        router.push("/login");
    }

    const orgName = user.organizer_profile?.organization_name || "Organiser";

    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-background/95 backdrop-blur-xl border-b border-border/20 flex items-center justify-between px-4">
                <Link href="/organizer" className="flex items-center gap-2">
                    <Logo variant="white" showTagline={false} size="sm" />
                </Link>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    className="p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
            </div>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 left-0 z-40 h-screen w-64 bg-background border-r border-border/20 flex flex-col transition-transform duration-300 ease-in-out",
                    "lg:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                {/* Logo */}
                <div className="h-14 flex items-center px-5 border-b border-border/20 shrink-0">
                    <Link href="/organizer" className="flex items-center gap-2" onClick={() => setMobileOpen(false)}>
                        <Logo variant="white" showTagline={false} size="sm" />
                    </Link>
                </div>

                {/* Org info */}
                <div className="px-5 py-4 border-b border-border/10">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-electric/10 flex items-center justify-center shrink-0">
                            <Building2 className="h-4 w-4 text-electric" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{orgName}</p>
                            <p className="text-xs text-muted-foreground">Organiser</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const active = isActive(item.href, item.exact);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                                    active
                                        ? "bg-electric/10 text-electric"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )}
                            >
                                <item.icon className={cn("h-4 w-4 shrink-0", active ? "text-electric" : "")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-border/10">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all w-full"
                    >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
}
