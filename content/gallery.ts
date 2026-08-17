// ============================================================
// Gallery page content — typed accessor over editable data.
//
// Values live in ./data/gallery.json so the /admin dashboard
// can edit them without touching source code. Photos are real
// uploaded images only; order in the array is the display order.
// ============================================================

import galleryData from './data/gallery.json'

export type GalleryPhoto = {
  // Required: path/URL of the uploaded image.
  image: string
  // Optional caption fields shown in the detail lightbox.
  title?: string
  description?: string
  date?: string
  // When true, the photo also appears in the home page Repertoire filmstrip.
  home?: boolean
  // Season event id this photo belongs to. Empty / omitted = 未分类.
  eventId?: string
}

export type GalleryPage = {
  header: {
    titleZh: string
    titleEn: string
    quote: { zh: string; en: string }
  }
  lightbox: { stamp: string }
  albums: {
    all: { zh: string; en: string }
    uncategorized: { zh: string; en: string }
    back: { zh: string; en: string }
    frames: string
  }
  photos: GalleryPhoto[]
}

export const galleryPage = (galleryData as { galleryPage: GalleryPage }).galleryPage
