import type { ReactNode } from 'react'
import AnniversaryNav from '@/components/AnniversaryNav/AnniversaryNav'

// Shared layout for /anniversary/*. Rendering the bottom pill here (rather than
// per-page) keeps it mounted as the *same* element across navigations between
// the sibling pages, so its active indicator can slide/morph between tabs
// instead of snapping. The pill hides itself on the hub (returns null there).
export default function AnniversaryLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <AnniversaryNav />
    </>
  )
}
