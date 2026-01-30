import { useState, useEffect, useCallback } from "react";

const DEFAULT_PREFIX = "resend_verif_";

export function useCooldown(
  keyId: string = "",
  keyPrefix: string = DEFAULT_PREFIX,
) {
  const normalizedKey = keyId.toLowerCase();

  const storageKey = normalizedKey ? `${keyPrefix}${normalizedKey}` : null;

  const getRemainingTime = useCallback(() => {
    if (typeof window === "undefined" || !storageKey) return 0;

    const targetTimeStr = localStorage.getItem(storageKey);
    if (!targetTimeStr) return 0;

    const targetTime = parseInt(targetTimeStr);
    const now = Date.now();

    const diff = Math.ceil((targetTime - now) / 1000);
    return diff > 0 ? diff : 0;
  }, [storageKey]);

  const [cooldown, setCooldown] = useState(getRemainingTime);

  useEffect(() => {
    setCooldown(getRemainingTime());
  }, [getRemainingTime]);

  useEffect(() => {
    const sync = () => {
      setCooldown(getRemainingTime());
    };

    const interval = window.setInterval(sync, 1000);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        sync();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [getRemainingTime, storageKey]);

  const startCooldown = (seconds: number = 60, overrideId?: string) => {
    const finalId = overrideId ? overrideId.toLowerCase() : normalizedKey;
    const keyToUse = finalId ? `${keyPrefix}${finalId}` : storageKey;

    if (!keyToUse) return;

    const now = Date.now();
    let targetTime = now + seconds * 1000;

    const existingTimeStr = localStorage.getItem(keyToUse);
    if (existingTimeStr) {
      const existingTime = parseInt(existingTimeStr);
      if (existingTime > now) {
        targetTime = existingTime;
      }
    }

    localStorage.setItem(keyToUse, targetTime.toString());

    if (!overrideId || finalId === normalizedKey) {
      const remaining = Math.ceil((targetTime - now) / 1000);
      setCooldown(remaining);
    }

    window.dispatchEvent(new Event("storage"));
  };

  return { cooldown, startCooldown, setCooldown };
}
