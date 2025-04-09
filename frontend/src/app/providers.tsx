"use client";

import React, { useEffect } from "react";

/**
 * Provides global hydration warning suppression for BitDefender and other extensions
 */
export function HydrationErrorSuppressor() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect BitDefender or similar extensions
      const hasBitDefender =
        document.documentElement.outerHTML.includes("bis_") ||
        document.documentElement.outerHTML.includes("extension");

      if (hasBitDefender) {
        // Patch React's internal hydration error reporting
        const originalConsoleError = console.error;
        console.error = function (...args) {
          const message = args[0];
          if (
            typeof message === "string" &&
            (message.includes("Hydration failed") ||
              message.includes("hydrated but some attributes") ||
              message.includes("bis_") ||
              message.includes("extension") ||
              message.includes("__processed_"))
          ) {
            // Suppress hydration errors caused by browser extensions
            return;
          }
          return originalConsoleError.apply(this, args);
        };
      }
    }
  }, []);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <HydrationErrorSuppressor />
      {children}
    </>
  );
}
