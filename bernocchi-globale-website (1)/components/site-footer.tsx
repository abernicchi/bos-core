'use client'

import Link from 'next/link'
import { Globe2, Mail, MessageCircle } from 'lucide-react'
import { site, whatsappUrl } from '@/lib/content'
import { Monogram } from '@/components/monogram'
import { LanguageSelector } from '@/components/language-selector'
import { useCasaLocale } from '@/components/use-casa-locale'
import type { LocaleCode } from '@/lib/i18n'
import { ordines } from '@/lib/ordines'

const copy: Record<LocaleCode, {
  heritage: string
  opening: string
  international: string
  house: string
  services: string
  governance: string
  founder: string
  contact: string
  health: string
  institutions: string
  legal: string
  privacy: string
  cookies: string
  terms: string
  disclaimer: string
  orientation: string
  euNote: string
  rights: string
}> = {
  es: { heritage:'Origen histórico', opening:'Operación regional', international:'Red internacional', house:'La Casa', services:'Instituciones', governance:'Gobernanza', founder:'Fundador', contact:'Contacto', health:'Bernocchi Health', institutions:'Todas las instituciones', legal:'Marco legal', privacy:'Privacidad', cookies:'Cookies', terms:'Términos', disclaimer:'Aviso médico', orientation:'Orientación europea', euNote:'La bandera europea no implica aprobación, patrocinio ni afiliación oficial con la Unión Europea.', rights:'Todos los derechos reservados.' },
  en: { heritage:'Historical origin', opening:'Regional operation', international:'International network', house:'The House', services:'Institutions', governance:'Governance', founder:'Founder', contact:'Contact', health:'Bernocchi Health', institutions:'All institutions', legal:'Legal framework', privacy:'Privacy', cookies:'Cookies', terms:'Terms', disclaimer:'Medical disclaimer', orientation:'European orientation', euNote:'The European flag does not imply approval, sponsorship or official affiliation with the European Union.', rights:'All rights reserved.' },
  it: { heritage:'Origine storica', opening:'Operatività regionale', international:'Rete internazionale', house:'La Casa', services:'Istituzioni', governance:'Governance', founder:'Fondatore', contact:'Contatti', health:'Bernocchi Health', institutions:'Tutte le istituzioni', legal:'Quadro legale', privacy:'Privacy', cookies:'Cookie', terms:'Termini', disclaimer:'Avvertenza medica', orientation:'Orientamento europeo', euNote:'La bandiera europea non implica approvazione, patrocinio o affiliazione ufficiale con l’Unione europea.', rights:'Tutti i diritti riservati.' },
  fr: { heritage:'Origine historique', opening:'Activité régionale', international:'Réseau international', house:'La Maison', services:'Institutions', governance:'Gouvernance', founder:'Fondateur', contact:'Contact', health:'Bernocchi Health', institutions:'Toutes les institutions', legal:'Cadre juridique', privacy:'Confidentialité', cookies:'Cookies', terms:'Conditions', disclaimer:'Avertissement médical', orientation:'Orientation européenne', euNote:'Le drapeau européen n’implique ni approbation, ni parrainage, ni affiliation officielle avec l’Union européenne.', rights:'Tous droits réservés.' },
  de: { heritage:'Historischer Ursprung', opening:'Regionaler Betrieb', international:'Internationales Netzwerk', house:'Das Haus', services:'Institutionen', governance:'Governance', founder:'Gründer', contact:'Kontakt', health:'Bernocchi Health', institutions:'Alle Institutionen', legal:'Rechtlicher Rahmen', privacy:'Datenschutz', cookies:'Cookies', terms:'Bedingungen', disclaimer:'Medizinischer Hinweis', orientation:'Europäische Orientierung', euNote:'Die Europaflagge bedeutet keine Genehmigung, Förderung oder offizielle Verbindung zur Europäischen Union.', rights:'Alle Rechte vorbehalten.' },
  ca: { heritage:'Origen històric', opening:'Operació regional', international:'Xarxa internacional', house:'La Casa', services:'Institucions', governance:'Governança', founder:'Fundador', contact:'Contacte', health:'Bernocchi Health', institutions:'Totes les institucions', legal:'Marc legal', privacy:'Privacitat', cookies:'Cookies', terms:'Termes', disclaimer:'Avís mèdic', orientation:'Orientació europea', euNote:'La bandera europea no implica aprovació, patrocini ni afiliació oficial amb la Unió Europea.', rights:'Tots els drets reservats.' },
  zh: { heritage:'历史起源', opening:'区域运营', international:'国际网络', house:'家族机构', services:'机构', governance:'治理', founder:'创始人', contact:'联系', health:'Bernocchi Health', institutions:'所有机构', legal:'法律框架', privacy:'隐私', cookies:'Cookie', terms:'条款', disclaimer:'医疗声明', orientation:'欧洲导向', euNote:'欧洲旗帜不代表欧盟批准、赞助或官方隶属。', rights:'保留所有权利。' },
  pl: { heritage:'Początek historyczny', opening:'Działalność regionalna', international:'Sieć międzynarodowa', house:'Dom', services:'Instytucje', governance:'Ład', founder:'Założyciel', contact:'Kontakt', health:'Bernocchi Health', institutions:'Wszystkie instytucje', legal:'Ramy prawne', privacy:'Prywatność', cookies:'Cookies', terms:'Warunki', disclaimer:'Nota medyczna', orientation:'Orientacja europejska', euNote:'Flaga europejska nie oznacza zatwierdzenia, sponsorowania ani oficjalnego powiązania z Unią Europejską.', rights:'Wszelkie prawa zastrzeżone.' },
  ru: { heritage:'Историческое начало', opening:'Региональная деятельность', international:'Международная сеть', house:'Дом', services:'Институты', governance:'Управление', founder:'Основатель', contact:'Контакты', health:'Bernocchi Health', institutions:'Все институты', legal:'Правовая основа', privacy:'Конфиденциальность', cookies:'Cookies', terms:'Условия', disclaimer:'Медицинское уведомление', orientation:'Европейская ориентация', euNote:'Флаг Европы не означает одобрение, спонсорство или официальную связь с Европейским союзом.', rights:'Все права защищены.' },
  ja: { heritage:'歴史的起源', opening:'地域運営', international:'国際ネットワーク', house:'カーサ', services:'機関', governance:'ガバナンス', founder:'創設者', contact:'お問い合わせ', health:'Bernocchi Health', institutions:'すべての機関', legal:'法的枠組み', privacy:'プライバシー', cookies:'Cookie', terms:'利用規約', disclaimer:'医療免責事項', orientation:'欧州志向', euNote:'欧州旗はEUの承認、後援、公式提携を意味しません。', rights:'無断転載を禁じます。' },
}

export function SiteFooter() {
  const year = new Date().getFullYear()
  const { locale } = useCasaLocale()
  const t = copy[locale]

  return (
    <footer className="border-t border-white/10 bg-[#050e17] text-[#f7f1e6]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_.75fr_.75fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Monogram className="size-11 rounded-full border border-[#c9a85f]/35 bg-white/5 text-[#c9a85f]" />
              <span>
                <span className="block font-serif text-xl tracking-wide">{site.name}</span>
                <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.25em] text-white/38">{site.legalName}</span>
              </span>
            </Link>
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Conocimiento · Honor · Disciplina · Legado. Una casa italiana de instituciones con vocación internacional.
            </p>
            <div className="mt-7 grid max-w-md gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[0.58rem] uppercase tracking-[0.18em] text-[#c9a85f]">{t.heritage}</p>
                <p className="mt-2 text-sm">🇮🇹 Roma · 1893</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
                <p className="text-[0.58rem] uppercase tracking-[0.18em] text-[#c9a85f]">{t.opening}</p>
                <p className="mt-2 text-sm">🇨🇷 Costa Rica · 2024</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-white/38">{t.house}</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/64">
              <li><Link href="/casa" className="transition hover:text-[#c9a85f]">Casa Bernocchi</Link></li>
              <li><Link href="/founder" className="transition hover:text-[#c9a85f]">{t.founder}</Link></li>
              <li><Link href="/governance" className="transition hover:text-[#c9a85f]">{t.governance}</Link></li>
              <li><Link href="/contact" className="transition hover:text-[#c9a85f]">{t.contact}</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-white/38">{t.services}</h2>
            <ul className="mt-5 space-y-3 text-sm text-white/64">
              <li><Link href="/health" className="transition hover:text-[#c9a85f]">{t.health}</Link></li>
              <li><Link href="/institutions" className="transition hover:text-[#c9a85f]">{t.institutions}</Link></li>
              {ordines.filter((ordo) => ordo.slug !== 'medicinae').map((ordo) => (
                <li key={ordo.slug}><Link href={`/ordines/${ordo.slug}`} className="transition hover:text-[#c9a85f]">{ordo.order}</Link></li>
              ))}
              <li><a href={`mailto:${site.email}`} className="inline-flex items-center gap-2 text-[#d8bd7a] hover:text-[#ead49f]"><Mail className="size-4" />{site.email}</a></li>
              <li><a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 transition hover:text-[#c9a85f]"><MessageCircle className="size-4" />{site.phoneDisplay}</a></li>
            </ul>
          </div>

          <div>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-[0.64rem] font-semibold uppercase tracking-[0.22em] text-white/38">{t.international}</h2>
              <LanguageSelector />
            </div>
            <div className="mt-5 rounded-2xl border border-[#c9a85f]/22 bg-[#c9a85f]/6 p-5">
              <div className="flex items-center gap-3"><Globe2 className="size-5 text-[#c9a85f]" /><span className="text-2xl">🇪🇺</span></div>
              <p className="mt-4 text-sm font-medium">{t.orientation}</p>
              <p className="mt-3 text-[0.68rem] leading-5 text-white/38">{t.euNote}</p>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-7 text-xs text-white/38 md:flex-row md:items-center md:justify-between">
          <p>© {year} {site.legalName}. {t.rights}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            <li><Link href="/privacy" className="hover:text-[#c9a85f]">{t.privacy}</Link></li>
            <li><Link href="/cookies" className="hover:text-[#c9a85f]">{t.cookies}</Link></li>
            <li><Link href="/terms" className="hover:text-[#c9a85f]">{t.terms}</Link></li>
            <li><Link href="/medical-disclaimer" className="hover:text-[#c9a85f]">{t.disclaimer}</Link></li>
            <li><Link href="/payments" className="hover:text-[#c9a85f]">Pagos</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
