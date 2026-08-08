import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return []
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Journal — Casa Bernocchi',
    description: 'Archivo editorial de Casa Bernocchi.',
    robots: { index: false, follow: false },
  }
}

/** Draft articles stay in the editorial source but are not public until approved. */
export default function ArticlePage() {
  notFound()
}
