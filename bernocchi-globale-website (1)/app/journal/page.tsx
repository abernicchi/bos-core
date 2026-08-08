import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Journal — Casa Bernocchi',
  description: 'Archivo editorial de Casa Bernocchi.',
  robots: { index: false, follow: false },
}

/**
 * The Journal remains preserved in the codebase while the editorial archive is
 * completed. Draft material is intentionally not exposed on the public site.
 */
export default function JournalPage() {
  notFound()
}
