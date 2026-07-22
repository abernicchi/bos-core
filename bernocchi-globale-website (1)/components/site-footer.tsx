import Link from 'next/link'
import { navigation, offices, site, whatsappUrl } from '@/lib/content'
import { Monogram } from '@/components/monogram'

const legalLinks = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Cookies', href: '/cookies' },
  { label: 'Terms', href: '/terms' },
  { label: 'Medical Disclaimer', href: '/medical-disclaimer' },
]

const houseLinks = [
  { label: 'Casa Bernocchi', href: '/casa' },
  { label: 'The Founder', href: '/founder' },
  { label: 'Governance', href: '/governance' },
  { label: 'Contact', href: '/contact' },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="on-navy border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Monogram className="size-10 rounded-sm text-gold" />
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg text-foreground">
                  {site.name}
                </span>
                <span className="text-[0.6rem] uppercase tracking-[0.24em] text-muted-foreground">
                  {site.legalName}
                </span>
              </span>
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.positioning}
            </p>
            <div className="mt-5 space-y-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              <p>
                Founded in Italy{' '}
                <span aria-hidden="true" className="tracking-normal">
                  🇮🇹
                </span>
              </p>
              <p>
                Regional Office Costa Rica{' '}
                <span aria-hidden="true" className="tracking-normal">
                  🇨🇷
                </span>
              </p>
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.22em] text-gold">
              Scientia • Integritas • Posteritas
            </p>
          </div>

          <div>
            <h2 className="eyebrow text-muted-foreground">Navigation</h2>
            <ul className="mt-5 space-y-3">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-muted-foreground">The House</h2>
            <ul className="mt-5 space-y-3">
              {houseLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-foreground/80 transition-colors hover:text-gold"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="eyebrow text-muted-foreground">Presence</h2>
            <ul className="mt-5 space-y-4">
              {offices.map((office) => (
                <li key={office.label}>
                  <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {office.label}
                  </p>
                  <p className="text-sm text-foreground">
                    {office.city}
                    {office.country ? `, ${office.country}` : ''}
                  </p>
                </li>
              ))}
              <li>
                <a
                  href={`mailto:${site.email}`}
                  className="text-sm text-gold underline-offset-4 hover:underline"
                >
                  {site.email}
                </a>
              </li>
              <li>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/80 transition-colors hover:text-gold"
                >
                  WhatsApp · {site.phoneDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-border pt-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {site.legalName}. A private Italian group, founded in
            Italy.
          </p>
          <ul className="flex flex-wrap gap-6">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
