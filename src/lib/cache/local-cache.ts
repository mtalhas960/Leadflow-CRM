/* ------------------------------------------------------------------ */
/*  Lightweight localStorage TTL cache for rarely-changing config.    */
/*  Used to skip Firestore reads on subsequent page loads for data    */
/*  like workspace settings, client portal config, meeting types.     */
/* ------------------------------------------------------------------ */

const PREFIX = "lf_";
const MAX_ITEMS = 50;

interface CacheEntry<T> {
  data: T;
  ts: number;
}

function key(k: string): string {
  return PREFIX + k;
}

export function cacheGet<T>(cacheKey: string, ttlMs = 10 * 60 * 1000): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key(cacheKey));
    if (!raw) return null;
    const entry = JSON.parse(raw) as CacheEntry<T>;
    if (Date.now() - entry.ts > ttlMs) {
      localStorage.removeItem(key(cacheKey));
      return null;
    }
    return entry.data;
  } catch {
    return null;
  }
}

export function cacheSet<T>(cacheKey: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    // Trim oldest entries if over limit
    const keys = Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .sort((a, b) => {
        const ea = JSON.parse(localStorage.getItem(a) || "{}") as CacheEntry<unknown>;
        const eb = JSON.parse(localStorage.getItem(b) || "{}") as CacheEntry<unknown>;
        return (ea.ts || 0) - (eb.ts || 0);
      });
    while (keys.length >= MAX_ITEMS) {
      localStorage.removeItem(keys.shift()!);
    }

    localStorage.setItem(key(cacheKey), JSON.stringify({ data, ts: Date.now() }));
  } catch {
    // localStorage full or disabled — silently skip
  }
}

export function cacheRemove(cacheKey: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(key(cacheKey));
  } catch {
    // silently skip
  }
}

/**
 * Invalidate all cached entries matching a prefix.
 */
export function cacheInvalidate(prefix: string): void {
  if (typeof window === "undefined") return;
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(PREFIX + prefix));
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {
    // silently skip
  }
}
