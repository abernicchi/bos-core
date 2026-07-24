import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/components/status-badge'
import { journalArticles, site } from '@/lib/content'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return journalArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>
}): Promise<Metadata> {
  const { slug } = await params
  const article = journalArticles.find((a) => a.slug === slug)
  if (!article) return { title: 'Article not found' }
  return {
    title: `${article.title} — Journal · Casa Bernocchi`,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      url: `/journal/${article.slug}`,
    },
  }
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<Params>
}) {
  const { slug } = await params
  const article = journalArticles.find((a) => a.slug === slug)
  if (!article) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    articleSection: article.category,
    inLanguage: 'en',
    publisher: {
      '@type': 'Organization',
      name: site.name,
      url: site.url,
    },
    creativeWorkStatus: article.status === 'draft' ? 'Draft' : 'Published',
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Link
        href="/journal"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Back to Journal
      </Link>

      <header className="mt-8 border-b border-border/60 pb-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold">
            {article.category}
          </span>
          {article.status === 'draft' ? (
            <StatusBadge status="development" label="Editorial draft" />
          ) : null}
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-foreground text-balance sm:text-5xl">
          {article.title}
        </h1>
        <p className="mt-4 text-sm text-muted-foreground">
          {article.readingTime} read
        </p>
      </header>

      <div className="mt-10 space-y-6">
        {article.body.map((paragraph, index) => (
          <p
            key={index}
            className="text-lg leading-relaxed text-foreground/90 text-pretty"
          >
            {paragraph}
          </p>
        ))}
      </div>

      <footer className="mt-12 border-t border-border/60 pt-8">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This contribution is an editorial draft and may be revised before
          final publication. The views expressed are offered for institutional
          reflection.
        </p>
      </footer>
    </article>
  )
}
