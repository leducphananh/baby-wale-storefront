/**
 * In-memory rate limiter for serverless/edge environments.
 * Note: In Vercel, this state is per-instance (isolate). It won't perfectly
 * sync across global regions, but it's sufficient to deter basic spam and
 * brute-force attempts without requiring external services like Redis.
 */

interface RateLimitStore {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitStore>();

/**
 * Clean up expired entries periodically to prevent memory leaks
 */
function cleanup() {
  const now = Date.now();
  for (const [key, value] of store.entries()) {
    if (value.resetAt < now) {
      store.delete(key);
    }
  }
}

// Run cleanup every minute
if (typeof setInterval !== "undefined") {
  setInterval(cleanup, 60000);
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Rate limit by IP or identifier
 * @param identifier Unique ID (e.g., IP address)
 * @param limit Max requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function rateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const record = store.get(identifier);

  if (!record || record.resetAt < now) {
    // First request or window expired
    store.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: now + windowMs,
    };
  }

  // Increment existing record
  record.count += 1;

  return {
    success: record.count <= limit,
    limit,
    remaining: Math.max(0, limit - record.count),
    reset: record.resetAt,
  };
}
