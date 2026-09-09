// Repo paths + slug rules for special events. No filesystem access here, so
// this is safe to import from client components (the admin create form
// validates slugs with the same rule the API enforces).

export const SPECIAL_DIR = 'content/data/special'
export const SPECIAL_INDEX_PATH = `${SPECIAL_DIR}/index.json`

export function specialEventFilePath(slug: string): string {
  return `${SPECIAL_DIR}/${slug}.json`
}

// Lowercase, digits and dashes. `index` is reserved for the event index file.
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,58}[a-z0-9])?$/

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug) && slug !== 'index'
}

export const SLUG_HINT = '只能使用小写字母、数字与短横线，例如 spring-gala-2027。'

/** Best-effort slug from a title; the operator can still edit it before saving. */
export function suggestSlug(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '')
}

/** Page ids share the slug rule; they become the last URL segment. */
export function isValidPageId(id: string): boolean {
  return isValidSlug(id)
}
