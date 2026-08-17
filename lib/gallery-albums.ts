// Album grouping for /gallery and event-page album links.
// Photos with no eventId (or an id that no longer exists) are 未分类.

import { galleryPage, type GalleryPhoto } from '@/content/gallery'
import { season, type SeasonEvent } from '@/content/home'

export const GALLERY_EVENT_ALL = 'all'
export const GALLERY_EVENT_UNCAT = 'uncategorized'

export type GalleryAlbum = {
  key: string
  titleZh: string
  titleEn: string
  count: number
  coverSrc: string | null
  mosaic: string[] | null
}

function knownEventIds(): Set<string> {
  return new Set(season.events.map((event) => event.id))
}

export function visiblePhotos(photos: GalleryPhoto[] = galleryPage.photos): GalleryPhoto[] {
  return photos.filter((photo) => Boolean(photo.image))
}

export function isUncategorized(photo: GalleryPhoto, ids: Set<string> = knownEventIds()): boolean {
  const id = photo.eventId?.trim() ?? ''
  return !id || !ids.has(id)
}

export function photosForEvent(
  eventKey: string,
  photos: GalleryPhoto[] = visiblePhotos(),
): GalleryPhoto[] {
  if (eventKey === GALLERY_EVENT_ALL) return photos
  if (eventKey === GALLERY_EVENT_UNCAT) {
    const ids = knownEventIds()
    return photos.filter((photo) => isUncategorized(photo, ids))
  }
  return photos.filter((photo) => (photo.eventId?.trim() ?? '') === eventKey)
}

function eventCover(event: SeasonEvent, albumPhotos: GalleryPhoto[]): string | null {
  return albumPhotos[0]?.image || event.cardImageUrl || event.imageUrl || null
}

function albumMosaic(albumPhotos: GalleryPhoto[]): string[] | null {
  if (albumPhotos.length < 2) return null
  return albumPhotos.slice(0, 4).map((photo) => photo.image)
}

export function buildGalleryAlbums(
  photos: GalleryPhoto[] = visiblePhotos(),
): GalleryAlbum[] {
  const { albums } = galleryPage
  const ids = knownEventIds()
  const all = photos

  const list: GalleryAlbum[] = [
    {
      key: GALLERY_EVENT_ALL,
      titleZh: albums.all.zh,
      titleEn: albums.all.en,
      count: all.length,
      coverSrc: all[0]?.image ?? null,
      mosaic: albumMosaic(all),
    },
  ]

  for (const event of season.events) {
    const albumPhotos = all.filter((photo) => (photo.eventId?.trim() ?? '') === event.id)
    if (albumPhotos.length === 0) continue
    list.push({
      key: event.id,
      titleZh: event.titleZh.join(''),
      titleEn: event.titleEn,
      count: albumPhotos.length,
      coverSrc: eventCover(event, albumPhotos),
      mosaic: albumMosaic(albumPhotos),
    })
  }

  const uncategorized = all.filter((photo) => isUncategorized(photo, ids))
  if (uncategorized.length > 0) {
    list.push({
      key: GALLERY_EVENT_UNCAT,
      titleZh: albums.uncategorized.zh,
      titleEn: albums.uncategorized.en,
      count: uncategorized.length,
      coverSrc: uncategorized[0]?.image ?? null,
      mosaic: albumMosaic(uncategorized),
    })
  }

  return list
}
