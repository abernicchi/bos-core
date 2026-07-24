import type { Metadata } from 'next'
import { PageHeader } from '@/components/page-header'
import { JournalCard } from '@/components/journal-card'
import { journalArticles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Journal — Notes on governance, ethics and knowledge',
  description:
    'The Casa Bernocchi Journal gathers reflections on institutions, governance and professional ethics. Editorial contributions in development.',
  alternates: { canonical: '/journal' },
}

export default function JournalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Journal"
        title="Notes on building institutions"
        intro="A growing editorial archive: reflections on governance, ethics, knowledge and continuity. The contributions gathered here are currently in draft."
      />

      <section className="mx-auto max-w-6xl px-6 py-16 lg:py-20">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {journalArticles.map((article) => (
            <JournalCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  )
}
