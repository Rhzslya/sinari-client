import { ServiceStatus } from "@/enum/enum";
import type { ServiceResponse } from "@/model/repair-model";
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

  const startCooldown = useCallback(
    (seconds: number = 60, overrideId?: string) => {
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
    },
    [keyPrefix, normalizedKey, storageKey],
  );

  return { cooldown, startCooldown, setCooldown };
}

const GRACE_PERIOD_MINUTES = 15;

export function useServiceLock(service: ServiceResponse | null | undefined) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!service) {
    return {
      isLocked: true,
      timeLeft: { m: 0, s: 0 },
      isGracePeriodActive: false,
      isTaken: false,
    };
  }

  const anchorTime = service.grace_period_start
    ? new Date(service.grace_period_start).getTime()
    : 0;

  const diffInSeconds = (now - anchorTime) / 1000;
  const GRACE_PERIOD_SECONDS = 15 * 60;

  const remainingSeconds =
    anchorTime > 0
      ? Math.max(0, Math.ceil(GRACE_PERIOD_SECONDS - diffInSeconds))
      : 0;

  const m = Math.floor(remainingSeconds / 60);
  const s = remainingSeconds % 60;

  const diffInMinutes = anchorTime > 0 ? (now - anchorTime) / 1000 / 60 : 9999;

  const minutesLeft = Math.max(
    0,
    Math.ceil(GRACE_PERIOD_MINUTES - diffInMinutes),
  );

  const isFinalStatus =
    service.status === ServiceStatus.FINISHED ||
    service.status === ServiceStatus.CANCELLED;

  const isTaken = service.status === ServiceStatus.TAKEN;

  const isLocked = isTaken || (isFinalStatus && minutesLeft <= 0);

  return {
    isLocked,
    timeLeft: { m, s },
    isGracePeriodActive: !isLocked && isFinalStatus && remainingSeconds > 0,
    isTaken,
  };
}
