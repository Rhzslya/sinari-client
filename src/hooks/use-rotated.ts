import { useState, useCallback } from "react";

export function useRotatedPage(
  cacheKey: string,
  maxPages: number,
  durationMs: number,
) {
  const [page, setPage] = useState<number>(() => {
    if (typeof window === "undefined") return 1;

    const cachedData = localStorage.getItem(cacheKey);
    const now = Date.now();

    if (cachedData) {
      try {
        const { page: cachedPage, expiry } = JSON.parse(cachedData);
        if (now < expiry) {
          return cachedPage;
        }
      } catch {
        //
      }
    }

    const newPage = Math.floor(Math.random() * maxPages) + 1;

    localStorage.setItem(
      cacheKey,
      JSON.stringify({ page: newPage, expiry: now + durationMs }),
    );

    return newPage;
  });

  const updatePage = useCallback(
    (newPage: number) => {
      setPage(newPage);
      localStorage.setItem(
        cacheKey,
        JSON.stringify({ page: newPage, expiry: Date.now() + durationMs }),
      );
    },
    [cacheKey, durationMs],
  );

  return { page, updatePage };
}
