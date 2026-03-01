import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  variant?: "default" | "white";
  showTagline?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Logo({ variant = "default", showTagline = false, size = "md" }: LogoProps) {
  const sizeMap = {
    sm: { width: 120, height: 40 },
    md: { width: 150, height: 50 },
    lg: { width: 200, height: 67 },
  };

  const { width, height } = sizeMap[size];

  return (
    <Link href="/" className="flex items-center gap-1 group">
      <div className="flex flex-col">
        <Image
          src="/logo.svg"
          alt="CueSports Africa"
          width={width}
          height={height}
          className={`h-auto ${variant === "white" ? "brightness-0 invert" : ""}`}
          priority
        />
        {showTagline && (
          <span className={`text-xs ${variant === "white" ? "text-white/70" : "text-muted-foreground"} -mt-1`}>
            Professionalizing Pool
          </span>
        )}
      </div>
    </Link>
  );
}
