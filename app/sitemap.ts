import type { MetadataRoute } from 'next'
import { journalArticles, site } from '@/lib/content'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/casa',
    '/health',
    '/governance',
    '/founder',
    '/journal',
    '/contact',
    '/privacy',
    '/cookies',
    '/terms',
    '/medical-disclaimer',
  ]

  const now = new Date()

  const priorityFor = (path: string) => {
    if (path === '') return 1
    if (path === '/health') return 0.9
    return 0.6
  }

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: priorityFor(path),
  }))

  const articleEntries: MetadataRoute.Sitemap = journalArticles.map((a) => ({
    url: `${site.url}/journal/${a.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }))

  return [...staticEntries, ...articleEntries]
}
