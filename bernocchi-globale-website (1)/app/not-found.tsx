import Link from 'next/link'
import { Monogram } from '@/components/monogram'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 py-24 text-center">
      <Monogram className="size-12 rounded-sm text-gold" />
      <p className="mt-8 text-xs font-medium uppercase tracking-[0.2em] text-gold">
        Error 404
      </p>
      <h1 className="mt-3 font-serif text-4xl text-foreground text-balance">
        Page not found
      </h1>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The page you are looking for does not exist or has been moved. Please
        return to the home page or contact the Segreteria Generale.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="rounded-sm bg-gold px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-gold/90"
        >
          Back to home
        </Link>
        <Link
          href="/contact"
          className="rounded-sm border border-border px-5 py-2.5 text-sm text-foreground transition-colors hover:border-gold"
        >
          Contact
        </Link>
      </div>
    </div>
  )
}
