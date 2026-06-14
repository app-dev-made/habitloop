/**
 * HabitLoop Rate Limiter
 *
 * In-memory rate limiter for Next.js API routes on Vercel.
 *
 * Note: Vercel serverless functions are stateless — each invocation may
 * run in a different process. This rate limiter works per-process (which
 * is still effective since Vercel reuses warm instances), but for strict
 * cross-process limiting you'd use Upstash Redis.
 *
 * Uses lazy cleanup instead of setInterval (which doesn't survive
 * serverless cold starts).
 */

interface Entry {
  count:   number
  resetAt: number
}

const store = new Map<string, Entry>()
let lastCleanup = Date.now()

function maybeCleanup() {
  const now = Date.now()
  // Cleanup at most once per minute
  if (now - lastCleanup < 60_000) return
  lastCleanup = now
  for (const [key, entry] of store) {
    if (now > entry.resetAt) store.delete(key)
  }
}

/**
 * Check rate limit for an identifier.
 * @param identifier  Unique key, e.g. `"predictions:user-uuid"`
 * @param maxRequests Max requests allowed in the window (default: 60)
 * @param windowMs    Window size in ms (default: 60 seconds)
 * @returns           { success: true } if allowed, { success: false } if rate-limited
 */
export function rateLimit(
  identifier: string,
  maxRequests = 60,
  windowMs    = 60_000,
): { success: boolean; remaining: number; resetIn: number } {
  maybeCleanup()

  const now   = Date.now()
  const entry = store.get(identifier)

  if (!entry || now > entry.resetAt) {
    store.set(identifier, { count: 1, resetAt: now + windowMs })
    return { success: true, remaining: maxRequests - 1, resetIn: windowMs }
  }

  if (entry.count >= maxRequests) {
    return { success: false, remaining: 0, resetIn: entry.resetAt - now }
  }

  entry.count++
  return { success: true, remaining: maxRequests - entry.count, resetIn: entry.resetAt - now }
}
