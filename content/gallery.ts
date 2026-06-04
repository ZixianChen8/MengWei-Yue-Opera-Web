// ============================================================
// Gallery page content — typed accessor over editable data.
//
// Values live in ./data/gallery.json so the /admin dashboard
// can edit them without touching source code. Types match the
// previous inline literals so consumers are unchanged.
// ============================================================

import galleryData from './data/gallery.json'

export type GalleryAspect = 'r45' | 'r32' | 'r57' | 'r11'
export type GalleryCategory = 'mainstage' | 'recital' | 'studio' | 'backstage'
export type GalleryFilterKey = 'all' | GalleryCategory

export type GalleryPhoto = {
  cn: string
  en: string
  cat: GalleryCategory
  ar: GalleryAspect
  glyph: string
  venue: string
  play: string
  // Real photo path/URL; empty string keeps the decorative glyph placeholder.
  image?: string
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
  countSuffix: string
  filters: { key: GalleryFilterKey; zh: string; en: string }[]
  lightbox: { tagSuffix: string; stamp: string }
  photos: GalleryPhoto[]
}

export const galleryPage = (galleryData as { galleryPage: GalleryPage }).galleryPage
