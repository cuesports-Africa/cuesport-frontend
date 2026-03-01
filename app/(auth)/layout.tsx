import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Authentication - CueSports Africa",
    description: "Sign in or create an account for CueSports Africa.",
};

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background patterns */}
            <div className="absolute inset-0 max-bg-gradient pointer-events-none" />
            <div className="absolute -top-[500px] -right-[500px] w-[1000px] h-[1000px] rounded-full bg-electric/5 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-[500px] -left-[500px] w-[1000px] h-[1000px] rounded-full bg-electric/5 blur-3xl pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                {children}
            </div>
        </div>
    );
}
