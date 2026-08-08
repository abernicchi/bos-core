import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'
import { ordines } from '@/lib/ordines'
import { scientificArticles } from '@/lib/journal'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/casa',
    '/institutions',
    '/health',
    '/journal',
    '/payments',
    '/governance',
    '/founder',
    '/contact',
    '/privacy',
    '/cookies',
    '/terms',
    '/medical-disclaimer',
  ]

  const now = new Date()
  const priorityFor = (path: string) => {
    if (path === '') return 1
    if (path === '/institutions') return 0.95
    if (path === '/health' || path === '/journal') return 0.9
    if (path === '/casa' || path === '/governance') return 0.8
    return 0.6
  }

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: priorityFor(path),
  }))

  const ordoEntries: MetadataRoute.Sitemap = ordines.map((ordo) => ({
    url: `${site.url}/ordines/${ordo.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.88,
  }))

  const journalEntries: MetadataRoute.Sitemap = scientificArticles.map((article) => ({
    url: `${site.url}/journal/${article.slug}`,
    lastModified: new Date(`${article.updatedAt}T12:00:00Z`),
    changeFrequency: 'yearly',
    priority: 0.78,
  }))

  return [...staticEntries, ...ordoEntries, ...journalEntries]
}
