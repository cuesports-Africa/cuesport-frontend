"use client";

const APK_DIRECT_URL = "https://downloads.cuesports.africa/app-release.apk";
const TRACK_URL = "https://api.cuesports.africa/api/analytics/app-downloads";

export function AppDownloadButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = JSON.stringify({ source: "hero_button" });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(TRACK_URL, data);
      }
    } catch {
      // fire-and-forget
    }
    window.location.href = APK_DIRECT_URL;
  };

  return (
    <a
      href={APK_DIRECT_URL}
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  );
}
