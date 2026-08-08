import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react'
import { getScientificArticle, scientificArticles } from '@/lib/journal'
import { site } from '@/lib/content'

type Params = { slug: string }

export function generateStaticParams(): Params[] {
  return scientificArticles.map((article) => ({ slug: article.slug }))
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params
  const article = getScientificArticle(slug)
  if (!article) return { title: 'Publicación no encontrada' }

  return {
    title: `${article.title} — Ordo Scientia`,
    description: article.excerpt,
    alternates: { canonical: `/journal/${article.slug}` },
    openGraph: {
      type: 'article',
      title: article.title,
      description: article.excerpt,
      url: `/journal/${article.slug}`,
      publishedTime: `${article.publishedAt}T12:00:00Z`,
      modifiedTime: `${article.updatedAt}T12:00:00Z`,
    },
  }
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params
  const article = getScientificArticle(slug)
  if (!article) notFound()

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: article.title,
    alternativeHeadline: article.subtitle,
    description: article.excerpt,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    articleSection: article.category,
    keywords: article.keywords.join(', '),
    inLanguage: 'es',
    url: `${site.url}/journal/${article.slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'Ordo Scientia · Casa Bernocchi',
      parentOrganization: { '@type': 'Organization', name: site.legalName, url: site.url },
    },
  }

  return (
    <article className="bg-[#f7f3ea] text-[#07131f]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <header className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto max-w-4xl px-6 py-16 lg:py-24">
          <Link href="/journal" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-white/42 transition hover:text-[#d8bd7a]">
            <ArrowLeft className="size-4" /> Ordo Scientia Journal
          </Link>
          <div className="mt-10 flex flex-wrap gap-3 text-[0.62rem] uppercase tracking-[0.16em] text-[#c9a85f]">
            <span>{article.category}</span><span>·</span><span>{article.publicationType}</span><span>·</span><span>{article.publishedAt}</span>
          </div>
          <h1 className="mt-5 text-balance font-serif text-4xl font-light leading-[1.02] sm:text-5xl lg:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-white/62">{article.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-2">
            {article.keywords.map((keyword) => <span key={keyword} className="rounded-full border border-white/12 px-3 py-1 text-[0.62rem] text-white/44">{keyword}</span>)}
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_18rem] lg:py-24">
        <div className="max-w-3xl">
          {article.sections.map((section) => (
            <section key={section.heading} className="mb-12">
              <h2 className="font-serif text-3xl font-light leading-tight">{section.heading}</h2>
              <div className="mt-5 space-y-5">
                {section.paragraphs.map((paragraph, index) => <p key={index} className="text-[1.03rem] leading-8 text-[#07131f]/74">{paragraph}</p>)}
              </div>
            </section>
          ))}

          <section className="border-t border-[#07131f]/12 pt-10">
            <h2 className="font-serif text-3xl font-light">Referencias seleccionadas</h2>
            <ol className="mt-6 space-y-5">
              {article.references.map((reference, index) => (
                <li key={`${reference.citation}-${index}`} className="flex gap-4 text-sm leading-7 text-[#07131f]/62">
                  <span className="font-mono text-xs text-[#927331]">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <span>{reference.citation}</span>
                    {reference.href ? <a href={reference.href} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1 text-[#775c28] underline decoration-[#775c28]/25 underline-offset-4">Fuente <ExternalLink className="size-3" /></a> : null}
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-3xl border border-[#07131f]/10 bg-white/55 p-6">
            <p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#927331]">Ficha editorial</p>
            <dl className="mt-5 space-y-4 text-sm">
              <div><dt className="text-[#07131f]/38">Institución</dt><dd className="mt-1">{article.ordo}</dd></div>
              <div><dt className="text-[#07131f]/38">Tipo</dt><dd className="mt-1">{article.publicationType}</dd></div>
              <div><dt className="text-[#07131f]/38">Lectura</dt><dd className="mt-1">{article.readingTime}</dd></div>
              <div><dt className="text-[#07131f]/38">Versión</dt><dd className="mt-1">{article.updatedAt}</dd></div>
            </dl>
          </div>
          <div className="mt-4 flex gap-3 rounded-3xl border border-[#927331]/20 bg-[#927331]/6 p-5 text-xs leading-6 text-[#07131f]/58">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#927331]" />
            <p>{article.disclaimer}</p>
          </div>
        </aside>
      </div>
    </article>
  )
}
