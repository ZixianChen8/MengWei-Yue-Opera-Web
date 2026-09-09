// ============================================================
// Server-side loader for special events (专场).
//
// Event files are created by /admin at runtime, so they cannot be
// statically imported; they are read from disk instead. Every
// /special route is prerendered (generateStaticParams +
// dynamicParams = false), so these reads happen at build time and
// never on a live request — which matters because the runtime
// filesystem on Vercel does not contain later admin edits (those
// arrive via a redeploy).
//
// Server-only: importing this from a client component pulls in
// node:fs and will fail the build.
// ============================================================

import fs from 'node:fs/promises'
import path from 'node:path'
import type { SpecialEvent } from '@/content/special'
import { isValidSlug } from '@/lib/special-paths'

// Spelled out as literal segments (rather than reusing SPECIAL_DIR) so the
// bundler can statically trace the directory and include the event files.
function absoluteDir(): string {
  return path.join(process.cwd(), 'content', 'data', 'special')
}

/** Slugs of every event file on disk (the index.json mirror is for clients). */
export async function listSpecialSlugs(): Promise<string[]> {
  let entries: string[]
  try {
    entries = await fs.readdir(absoluteDir())
  } catch {
    return []
  }
  return entries
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.slice(0, -'.json'.length))
    .filter(isValidSlug)
    .sort()
}

export async function loadSpecialEvent(slug: string): Promise<SpecialEvent | null> {
  if (!isValidSlug(slug)) return null
  try {
    const raw = await fs.readFile(path.join(absoluteDir(), `${slug}.json`), 'utf8')
    return JSON.parse(raw) as SpecialEvent
  } catch {
    return null
  }
}

/** Published events only — unpublished ones must not get public routes. */
export async function loadPublishedSpecialEvents(): Promise<SpecialEvent[]> {
  const slugs = await listSpecialSlugs()
  const events = await Promise.all(slugs.map(loadSpecialEvent))
  return events.filter((event): event is SpecialEvent => !!event && event.published)
}
