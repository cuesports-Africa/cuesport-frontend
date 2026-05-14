import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

type AuthShellProps = {
  /** Unsplash or local image source for the left column. */
  imageSrc: string;
  imageAlt?: string;
  /** Editorial kicker text shown over the image's bottom-left. */
  kicker?: string;
  /** Pull-quote / tagline shown over the image (italic, larger). */
  tagline?: string;
  children: React.ReactNode;
};

export function AuthShell({
  imageSrc,
  imageAlt = "",
  kicker,
  tagline,
  children,
}: AuthShellProps) {
  return (
    <div className="min-h-screen flex bg-canvas">
      {/* ─── Left — image (desktop only) ─── */}
      <aside className="hidden lg:flex lg:w-[46%] xl:w-[48%] relative isolate overflow-hidden bg-ink">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(max-width: 1024px) 0vw, 50vw"
          className="object-cover object-center -z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,22,40,0.35) 0%, rgba(10,22,40,0.55) 60%, rgba(10,22,40,0.78) 100%)",
          }}
        />

        <div className="relative w-full flex flex-col justify-between p-10 xl:p-14 text-white">
          <div className="w-fit">
            <Logo size="sm" variant="white" />
          </div>

          {(kicker || tagline) && (
            <div className="max-w-[34ch]">
              {kicker && (
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-white/70">
                  {kicker}
                </p>
              )}
              {tagline && (
                <p className="mt-3 text-[clamp(1.5rem,2.2vw,2rem)] italic font-light leading-[1.15] tracking-tight text-white">
                  {tagline}
                </p>
              )}
              <div className="mt-6 h-px w-12 bg-gold/70" />
            </div>
          )}
        </div>
      </aside>

      {/* ─── Right — form ─── */}
      <main className="flex-1 flex flex-col">
        {/* Mobile top bar — only when image is hidden */}
        <div className="lg:hidden flex items-center justify-between px-5 sm:px-8 h-[60px] border-b border-rule">
          <Logo size="sm" />
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-5 sm:px-8 lg:px-12 xl:px-16 py-10 lg:py-12">
          <div className="w-full max-w-[440px] mx-auto lg:mx-0">
            {children}
          </div>
        </div>

        {/* Desktop bottom-of-form back link */}
        <div className="hidden lg:flex justify-end px-12 xl:px-16 pb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-mute hover:text-ink transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}
