import type { GalleryPhoto } from '@/content/gallery'

const MAX = 4

/** Prefer `home: true` photos, then fill from remaining list order, capped at 4. */
export function selectMenuPhotos(photos: GalleryPhoto[]): GalleryPhoto[] {
  const home = photos.filter((p) => p.home)
  const rest = photos.filter((p) => !p.home)
  return [...home, ...rest].slice(0, MAX)
}
