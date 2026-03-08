import type { Metadata } from "next";
import { OrganizerAuthGuard } from "./auth-guard";
import { OrganizerShell } from "./shell";

export const metadata: Metadata = {
    title: "Organiser Dashboard - CueSports Africa",
    robots: { index: false, follow: false },
};

export default function OrganizerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <OrganizerAuthGuard>
            <OrganizerShell>{children}</OrganizerShell>
        </OrganizerAuthGuard>
    );
}
