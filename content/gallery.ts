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
}

export type GalleryPage = {
  header: {
    meta: string
    charsTop: string
    charsRed: string
    crumbsTop: { plain: string; bold: string }
    enTitle: string
    crumbsBottom: string
  }
  lightbox: { stamp: string }
  photos: GalleryPhoto[]
}

export const galleryPage = (galleryData as { galleryPage: GalleryPage }).galleryPage
