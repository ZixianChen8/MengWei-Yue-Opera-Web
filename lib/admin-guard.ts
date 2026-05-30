// Server-side admin check for route handlers and server components.
// Defense-in-depth: proxy.ts already gates these paths, but we
// re-verify here so a matcher change can't silently expose them.
import { cookies } from 'next/headers'
import { COOKIE_NAME, verifySessionToken } from './auth'

export async function isAdmin(): Promise<boolean> {
  const store = await cookies()
  return verifySessionToken(store.get(COOKIE_NAME)?.value, process.env.AUTH_SECRET)
}
