// ============================================================
// GitHub Contents API helper — the persistence layer.
//
// On Vercel the runtime filesystem is read-only/ephemeral, so
// admin edits are committed back to the repo. Vercel then
// redeploys, regenerating the static pages from the new data.
// Server-only (reads GITHUB_* env). Runs in the Node runtime.
// ============================================================

const API = 'https://api.github.com'

type GitHubConfig = {
  token: string
  owner: string
  repo: string
  branch: string
}

function config(): GitHubConfig {
  const token = process.env.GITHUB_TOKEN
  const owner = process.env.GITHUB_OWNER
  const repo = process.env.GITHUB_REPO
  const branch = process.env.GITHUB_BRANCH || 'main'
  if (!token || !owner || !repo) {
    throw new Error('Missing GITHUB_TOKEN, GITHUB_OWNER, or GITHUB_REPO env vars')
  }
  return { token, owner, repo, branch }
}

function headers(token: string): HeadersInit {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'mwy-admin',
  }
}

export function utf8ToBase64(text: string): string {
  return Buffer.from(text, 'utf8').toString('base64')
}

function base64ToUtf8(b64: string): string {
  return Buffer.from(b64, 'base64').toString('utf8')
}

type FileResult = { sha: string; contentBase64: string }

// Fetch a file; returns null if it does not exist yet (404).
export async function getFile(path: string): Promise<FileResult | null> {
  const { token, owner, repo, branch } = config()
  const url = `${API}/repos/${owner}/${repo}/contents/${encodeURIComponent(path).replace(/%2F/g, '/')}?ref=${encodeURIComponent(branch)}`
  const res = await fetch(url, { headers: headers(token), cache: 'no-store' })
  if (res.status === 404) return null
  if (!res.ok) {
    throw new Error(`GitHub getFile failed (${res.status}): ${await res.text()}`)
  }
  const json = await res.json()
  return { sha: json.sha as string, contentBase64: (json.content as string)?.replace(/\n/g, '') ?? '' }
}

// Read + parse a JSON file. Returns null if the file is absent.
export async function getJsonFile<T = unknown>(
  path: string,
): Promise<{ sha: string; data: T } | null> {
  const file = await getFile(path)
  if (!file) return null
  return { sha: file.sha, data: JSON.parse(base64ToUtf8(file.contentBase64)) as T }
}

// Create or update a file. Pass the existing sha when updating.
export async function putFile(args: {
  path: string
  contentBase64: string
  message: string
  sha?: string
}): Promise<{ commitSha: string; contentSha: string }> {
  const { token, owner, repo, branch } = config()
  const url = `${API}/repos/${owner}/${repo}/contents/${encodeURIComponent(args.path).replace(/%2F/g, '/')}`
  const res = await fetch(url, {
    method: 'PUT',
    headers: { ...headers(token), 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify({
      message: args.message,
      content: args.contentBase64,
      branch,
      ...(args.sha ? { sha: args.sha } : {}),
    }),
  })
  if (!res.ok) {
    throw new Error(`GitHub putFile failed (${res.status}): ${await res.text()}`)
  }
  const json = await res.json()
  return { commitSha: json.commit?.sha ?? '', contentSha: json.content?.sha ?? '' }
}
