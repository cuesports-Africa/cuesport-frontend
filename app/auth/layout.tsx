import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: {
    template: "%s | CueSports Africa",
    default: "Authentication",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-10">
        <div className="flex-1 flex flex-col justify-center max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            Africa's Premier Pool
            <span className="text-gold block mt-2">Management Platform</span>
          </h1>
          <p className="text-lg opacity-80 mb-8">
            Join thousands of players across Africa. Track your ratings,
            compete in tournaments, and be part of the growing cue sports community.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-3xl font-bold text-gold">5,000+</div>
              <div className="text-sm opacity-70">Active Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">200+</div>
              <div className="text-sm opacity-70">Tournaments</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-gold">15</div>
              <div className="text-sm opacity-70">Countries</div>
            </div>
          </div>
        </div>

        {/* Testimonial */}
        <div className="mt-auto pt-10 border-t border-white/10">
          <blockquote className="text-sm opacity-80 italic mb-3">
            "CueSports Africa has transformed how we organize and track pool tournaments.
            The rating system keeps players motivated and competition fair."
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold/20" />
            <div>
              <div className="font-medium text-sm">David Kimani</div>
              <div className="text-xs opacity-60">Pro Player, Kenya</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex flex-col">
        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-sm text-muted-foreground border-t">
          <p>
            By continuing, you agree to our{" "}
            <Link href="/legal/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/legal/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
