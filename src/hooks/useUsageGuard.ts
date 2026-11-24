import { useState, useEffect, useCallback } from 'react';

const CONSENT_STORAGE_KEY = 'lifetale_weddingsuite_privacy_consent_v1';
export const COOLDOWN_SECONDS = 10;

function readConsentFromStorage(): boolean {
  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
}

export function useUsageGuard() {
  const [hasAcceptedConsent, setHasAcceptedConsent] = useState<boolean>(() =>
    readConsentFromStorage()
  );
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0);

  // Brief cooldown countdown timer to prevent accidental rapid duplicate exports
  useEffect(() => {
    if (cooldownSeconds <= 0) return;
    const timer = window.setTimeout(() => {
      setCooldownSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [cooldownSeconds]);

  const acceptConsent = useCallback(() => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
    } catch {
      // Proceed even if storage is blocked
    }
    setHasAcceptedConsent(true);
  }, []);

  const recordGenerationRequest = useCallback(() => {
    setCooldownSeconds(COOLDOWN_SECONDS);
  }, []);

  return {
    hasAcceptedConsent,
    acceptConsent,
    cooldownSeconds,
    recordGenerationRequest,
  };
}
