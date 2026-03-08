"use client";

import { OrganizerSidebar } from "@/components/organizer/sidebar";

export function OrganizerShell({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background">
            <OrganizerSidebar />
            {/* Main content area — offset for sidebar */}
            <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen">
                <div className="p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
