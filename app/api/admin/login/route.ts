import { NextResponse } from 'next/server'
import {
  COOKIE_NAME,
  SESSION_TTL_MS,
  createSessionToken,
  sessionCookieOptions,
  verifyPassword,
} from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  if (!process.env.AUTH_SECRET) {
    return NextResponse.json({ error: '服务器缺少配置：AUTH_SECRET' }, { status: 500 })
  }
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: '服务器缺少配置：ADMIN_PASSWORD' }, { status: 500 })
  }

  let password = ''
  try {
    const body = await request.json()
    password = String(body?.password ?? '')
  } catch {
    return NextResponse.json({ error: '请求内容无效' }, { status: 400 })
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: '密码错误' }, { status: 401 })
  }

  const token = await createSessionToken(process.env.AUTH_SECRET)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(COOKIE_NAME, token, sessionCookieOptions(Math.floor(SESSION_TTL_MS / 1000)))
  return res
}
