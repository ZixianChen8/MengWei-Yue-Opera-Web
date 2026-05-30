// ============================================================
// Admin auth — password gate + HMAC-signed session cookie.
//
// No external dependency: uses Web Crypto (crypto.subtle) which
// is available in both the Node.js runtime (where proxy.ts and
// route handlers run) and the Edge runtime. The cookie payload
// is `{ exp }` signed with AUTH_SECRET; there is no server-side
// session store.
// ============================================================

export const COOKIE_NAME = 'mwy_admin'

// Session lifetime. Admins re-enter the password after this.
export const SESSION_TTL_MS = 8 * 60 * 60 * 1000 // 8 hours

const encoder = new TextEncoder()
const decoder = new TextDecoder()

// ── base64url helpers (no Buffer, works in any runtime) ─────
function bytesToBase64Url(bytes: Uint8Array): string {
  let bin = ''
  for (const b of bytes) bin += String.fromCharCode(b)
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(input: string): Uint8Array {
  let s = input.replace(/-/g, '+').replace(/_/g, '/')
  const pad = s.length % 4
  if (pad) s += '='.repeat(4 - pad)
  const bin = atob(s)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

// Constant-time string comparison to avoid leaking via timing.
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

async function hmacSha256(secret: string, data: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  return new Uint8Array(sig)
}

// ── Session token ───────────────────────────────────────────
export async function createSessionToken(
  secret: string,
  ttlMs: number = SESSION_TTL_MS,
): Promise<string> {
  const payload = JSON.stringify({ exp: Date.now() + ttlMs })
  const payloadB64 = bytesToBase64Url(encoder.encode(payload))
  const sig = bytesToBase64Url(await hmacSha256(secret, payloadB64))
  return `${payloadB64}.${sig}`
}

export async function verifySessionToken(
  token: string | undefined | null,
  secret: string | undefined,
): Promise<boolean> {
  if (!token || !secret) return false
  const parts = token.split('.')
  if (parts.length !== 2) return false
  const [payloadB64, sig] = parts
  const expected = bytesToBase64Url(await hmacSha256(secret, payloadB64))
  if (!timingSafeEqual(sig, expected)) return false
  try {
    const payload = JSON.parse(decoder.decode(base64UrlToBytes(payloadB64)))
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

// ── Password check ──────────────────────────────────────────
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD
  if (!expected) return false
  return timingSafeEqual(input, expected)
}

// Shared cookie attributes for set/clear.
export function sessionCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: maxAgeSeconds,
  }
}
