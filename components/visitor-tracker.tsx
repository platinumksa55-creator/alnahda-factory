"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname) return;

    // Do not track admin routes or API calls
    if (pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Avoid double tracking the same path on initial load re-renders
    if (lastTrackedPath.current === pathname) {
      return;
    }
    lastTrackedPath.current = pathname;

    try {
      // Get or create persistent visitor ID
      let visitorId = localStorage.getItem("alnahda_vid");
      if (!visitorId) {
        visitorId = "vid_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 9);
        localStorage.setItem("alnahda_vid", visitorId);
      }

      // Send tracking ping silently
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          path: pathname,
          referrer: document.referrer || "direct",
        }),
      }).catch(() => {
        // Silently ignore network failures
      });
    } catch {
      // localStorage may be disabled in some private modes
    }
  }, [pathname]);

  return null;
}
