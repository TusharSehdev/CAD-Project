import React, { useState, useEffect } from "react";

interface HydrationSafeWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * A wrapper component that only renders its children after hydration is complete
 * This prevents hydration mismatches caused by browser extensions like BitDefender
 */
export function HydrationSafeWrapper({
  children,
  fallback = null,
}: HydrationSafeWrapperProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  // This effect only runs once on the client after hydration is complete
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // If we're still hydrating (server-side or first client render) use the fallback
  if (!isHydrated) {
    return <>{fallback}</>;
  }

  // When hydration is complete, render the actual children
  return <>{children}</>;
}

/**
 * A hook that returns true only after hydration is complete on the client
 */
export function useIsHydrated() {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
}

/**
 * This component renders different content on the server vs. client
 * to avoid hydration mismatches
 */
export function ClientOnly({
  children,
  fallback = null,
}: HydrationSafeWrapperProps) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
