import type { MetadataRoute } from 'next'
import { site } from '@/lib/content'
import { ordines } from '@/lib/ordines'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/casa',
    '/institutions',
    '/health',
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
    if (path === '/health') return 0.95
    if (path === '/founder' || path === '/casa') return 0.75
    return 0.6
  }

  const staticEntries: MetadataRoute.Sitemap = routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: priorityFor(path),
  }))

  const operatingOrdoEntries: MetadataRoute.Sitemap = ordines
    .filter((ordo) => ordo.status === 'operating')
    .map((ordo) => ({
      url: `${site.url}/ordines/${ordo.slug}`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    }))

  return [...staticEntries, ...operatingOrdoEntries]
}
