"use client";

const APK_DIRECT_URL = "https://downloads.cuesports.africa/app-release.apk";
const TRACK_URL = "https://api.cuesports.africa/api/analytics/app-downloads";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Where to send the user. Defaults to the direct APK URL for backwards-compat. */
  href?: string;
  /** Source tag sent with the analytics beacon. */
  source?: string;
};

export function AppDownloadButton({
  children,
  className,
  href = APK_DIRECT_URL,
  source = "hero_button",
}: Props) {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const data = JSON.stringify({ source });
      if (navigator.sendBeacon) {
        navigator.sendBeacon(TRACK_URL, data);
      }
    } catch {
      // fire-and-forget
    }
    window.location.href = href;
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
