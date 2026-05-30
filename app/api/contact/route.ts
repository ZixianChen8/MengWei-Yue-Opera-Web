import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const dynamic = 'force-dynamic'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_FIELD_LENGTH = 200
const MAX_MESSAGE_LENGTH = 4000
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 3

const subjectLabels: Record<string, string> = {
  festival: 'Festival Invitation',
  partner: 'Institutional Partnership',
  community: 'Community Event',
  press: 'Press & Media',
  other: 'Other',
}

type RateBucket = {
  count: number
  resetAt: number
}

const rateBuckets = new Map<string, RateBucket>()

function textField(value: unknown, max = MAX_FIELD_LENGTH) {
  if (typeof value !== 'string') return ''
  return value.trim().slice(0, max)
}

function getClientKey(request: Request) {
  const forwardedFor = request.headers.get('x-forwarded-for')
  return forwardedFor?.split(',')[0]?.trim() || 'unknown'
}

function isRateLimited(key: string) {
  const now = Date.now()
  const bucket = rateBuckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return false
  }

  bucket.count += 1
  return bucket.count > RATE_LIMIT_MAX
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'Server is missing RESEND_API_KEY' }, { status: 500 })
  }
  if (!process.env.CONTACT_FROM_EMAIL) {
    return NextResponse.json({ error: 'Server is missing CONTACT_FROM_EMAIL' }, { status: 500 })
  }
  if (!process.env.CONTACT_TO_EMAIL) {
    return NextResponse.json({ error: 'Server is missing CONTACT_TO_EMAIL' }, { status: 500 })
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const payload = body as Record<string, unknown>
  const name = textField(payload.name)
  const email = textField(payload.email)
  const subject = textField(payload.subject)
  const phone = textField(payload.phone)
  const message = textField(payload.message, MAX_MESSAGE_LENGTH)
  const company = textField(payload.company)

  if (company) {
    return NextResponse.json({ ok: true })
  }

  if (!name || !EMAIL_RE.test(email) || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const subjectLabel = subjectLabels[subject] ?? subjectLabels.other
  const submittedAt = new Date().toISOString()
  const text = [
    'New website contact form submission',
    '',
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || 'Not provided'}`,
    `Subject: ${subjectLabel}`,
    `Submitted: ${submittedAt}`,
    '',
    'Message:',
    message,
  ].join('\n')

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: process.env.CONTACT_FROM_EMAIL,
      to: process.env.CONTACT_TO_EMAIL,
      replyTo: email,
      subject: `Website inquiry: ${subjectLabel}`,
      text,
    })

    if (error) {
      console.error('Resend contact email failed', error)
      return NextResponse.json({ error: 'Unable to send email' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Contact email request failed', error)
    return NextResponse.json({ error: 'Unable to send email' }, { status: 502 })
  }
}
