"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, X, Smartphone } from "lucide-react";

const APK_DIRECT_URL = "https://downloads.cuesports.africa/app-release.apk";
const TRACK_URL = "https://api.cuesports.africa/api/analytics/app-downloads";

function trackDownload() {
  try {
    const data = JSON.stringify({ source: "install_prompt" });
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACK_URL, data);
    }
  } catch {
    // fire-and-forget — don't block the download
  }
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone or fullscreen mode)
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches
    ) {
      setIsInstalled(true);
      return;
    }

    // Check if dismissed recently
    const dismissed = localStorage.getItem("app-install-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return;
      }
    }

    // Detect Android
    const ua = navigator.userAgent.toLowerCase();
    setIsAndroid(/android/.test(ua));

    // Show prompt after a short delay for better UX
    setTimeout(() => setShowPrompt(true), 3000);
  }, []);

  const handleDownload = () => {
    trackDownload();
    window.location.href = APK_DIRECT_URL;
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    localStorage.setItem("app-install-dismissed", Date.now().toString());
    setShowPrompt(false);
  };

  if (isInstalled || !showPrompt || !isAndroid) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50 animate-in slide-in-from-bottom-4">
      <div className="bg-card border shadow-lg rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
            <Smartphone className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm">CueSports Africa App</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get the full experience on your phone
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex gap-2 mt-3">
          <Button
            onClick={handleDownload}
            size="sm"
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-1.5" />
            Get the App
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="outline"
          >
            Not now
          </Button>
        </div>
      </div>
    </div>
  );
}
