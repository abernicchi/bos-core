import Link from 'next/link'
import { type JournalArticle } from '@/lib/content'

export function JournalCard({ article }: { article: JournalArticle }) {
  return (
    <Link
      href={`/journal/${article.slug}`}
      className="group flex flex-col justify-between gap-6 rounded-sm border border-border bg-card p-7 transition-colors hover:border-gold/50"
    >
      <div>
        <div className="flex items-center gap-3">
          <span className="eyebrow text-gold">{article.category}</span>
          {article.status === 'draft' ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[0.6rem] uppercase tracking-[0.14em] text-muted-foreground">
              Editorial draft
            </span>
          ) : null}
        </div>
        <h3 className="mt-4 text-balance font-serif text-2xl leading-snug text-card-foreground transition-colors group-hover:text-gold">
          {article.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {article.excerpt}
        </p>
      </div>
      <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {article.readingTime} read
      </span>
    </Link>
  )
}
