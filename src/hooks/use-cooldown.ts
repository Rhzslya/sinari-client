import { useState, useEffect, useCallback } from "react";

const DEFAULT_PREFIX = "resend_verif_";

export function useCooldown(
  keyId: string = "",
  keyPrefix: string = DEFAULT_PREFIX,
) {
  const normalizedKey = keyId.toLowerCase();
  const storageKey = normalizedKey
    ? `${keyPrefix}${normalizedKey}`
    : `${keyPrefix}global`;

  const getSavedCooldown = useCallback(() => {
    if (typeof window === "undefined") return 0;

    const targetTime = localStorage.getItem(storageKey);
    if (!targetTime) return 0;

    const diff = Math.ceil((parseInt(targetTime) - Date.now()) / 1000);
    return diff > 0 ? diff : 0;
  }, [storageKey]);

  const [cooldown, setCooldown] = useState(getSavedCooldown);

  useEffect(() => {
    setCooldown(getSavedCooldown());
  }, [getSavedCooldown]);

  useEffect(() => {
    if (cooldown <= 0) return;

    const interval = setInterval(() => {
      const currentKey = normalizedKey
        ? `${keyPrefix}${normalizedKey}`
        : `${keyPrefix}global`;

      const targetTime = localStorage.getItem(currentKey);

      if (!targetTime) {
        setCooldown(0);
        return;
      }

      const remaining = Math.ceil((parseInt(targetTime) - Date.now()) / 1000);

      if (remaining <= 0) {
        setCooldown(0);
        localStorage.removeItem(currentKey);
        clearInterval(interval);
      } else {
        setCooldown(remaining);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldown, getSavedCooldown, storageKey, keyId, normalizedKey, keyPrefix]);

  const startCooldown = (seconds: number = 60, overrideId?: string) => {
    const finalId = overrideId ? overrideId.toLowerCase() : normalizedKey;

    const keyToUse = finalId ? `${keyPrefix}${finalId}` : storageKey;

    const targetTime = Date.now() + seconds * 1000;

    localStorage.setItem(keyToUse, targetTime.toString());
    if (!overrideId || finalId === normalizedKey) {
      setCooldown(seconds);
    }
  };

  return { cooldown, startCooldown, setCooldown };
}
