"use client";

import { OrganizerSidebar } from "@/components/organizer/sidebar";
import { OrganizerMobileChrome } from "@/components/organizer/mobile-chrome";

export function OrganizerShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <OrganizerSidebar />

      {/* Mobile top bar + bottom nav + FAB + account sheet */}
      <OrganizerMobileChrome />

      {/* Main content
          - mobile: pt-14 for top bar; bottom padding via .organizer-mobile-bottom
          - desktop: pl-64 for sidebar, no top/bottom chrome */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen organizer-main">
        <div className="p-4 sm:p-6 lg:p-8 lg:pb-8">{children}</div>
      </main>

      {/* Inline style: bottom safe area + bottom-nav height on mobile only */}
      <style jsx global>{`
        @media (max-width: 1023.98px) {
          main.organizer-main {
            padding-bottom: calc(env(safe-area-inset-bottom) + 5.5rem);
          }
        }
      `}</style>
    </div>
  );
}
