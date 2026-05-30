// ============================================================
// Registry of admin-editable content sections.
//
// Maps a (target, section) pair to the JSON data file and the
// top-level key inside it. Used by the dashboard to list editors
// and by the content API to validate writes (only known sections
// may be written).
// ============================================================

export type ContentTarget = 'home' | 'gallery'

export const DATA_FILES: Record<ContentTarget, string> = {
  home: 'content/data/home.json',
  gallery: 'content/data/gallery.json',
}

export type SectionDef = {
  target: ContentTarget
  section: string
  label: string
  blurb: string
  group: 'Programme' | 'Site text' | 'Pages'
}

// Order here is the order shown on the dashboard.
export const SECTIONS: SectionDef[] = [
  { target: 'home', section: 'season', label: 'Events', blurb: 'Upcoming performances, dates, venues, and banner images.', group: 'Programme' },
  { target: 'home', section: 'repertoire', label: 'Repertoire', blurb: 'Past works archive and their images.', group: 'Programme' },
  { target: 'gallery', section: 'galleryPage', label: 'Gallery', blurb: 'Stage photo captions, categories, and filter labels.', group: 'Programme' },

  { target: 'home', section: 'hero', label: 'Hero', blurb: 'Landing title characters and the studio subtitle.', group: 'Site text' },
  { target: 'home', section: 'overture', label: 'Overture', blurb: 'Intro section copy, quote, and the three statistics.', group: 'Site text' },
  { target: 'home', section: 'studio', label: 'Studio / Learn', blurb: 'Class descriptions and the programme list.', group: 'Site text' },
  { target: 'home', section: 'about', label: 'About (home block)', blurb: 'Vertical verse and mission shown on the home page.', group: 'Site text' },
  { target: 'home', section: 'nav', label: 'Navigation', blurb: 'Menu labels and links, plus the brand mark.', group: 'Site text' },
  { target: 'home', section: 'footer', label: 'Footer', blurb: 'Footer columns, contact lines, and legal text.', group: 'Site text' },

  { target: 'home', section: 'aboutPage', label: 'About page', blurb: 'Full /about page: bio, contact, and form labels.', group: 'Pages' },
  { target: 'home', section: 'eventsListingPage', label: 'Events page', blurb: '/events listing header, month ribbon, and archive.', group: 'Pages' },
  { target: 'home', section: 'eventPage', label: 'Event detail labels', blurb: 'Labels shown on each /events/[id] detail page.', group: 'Pages' },
]

export function findSection(target: string, section: string): SectionDef | undefined {
  return SECTIONS.find((s) => s.target === target && s.section === section)
}
