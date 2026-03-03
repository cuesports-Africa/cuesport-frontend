"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  useReportWebVitals((metric) => {
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log(metric.name, metric.value);
    }

    // Send to analytics endpoint in production
    if (process.env.NODE_ENV === "production") {
      const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        id: metric.id,
      });

      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/vitals", body);
      }
    }
  });

  return null;
}
