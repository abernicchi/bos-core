import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Landmark, ShieldCheck } from 'lucide-react'
import { principles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Oficina del Fundador — Casa Bernocchi',
  description:
    'La visión contemporánea de Casa Bernocchi: custodiar una herencia institucional iniciada en Roma en 1893 y convertirla en instituciones verificables y duraderas.',
  alternates: { canonical: '/founder' },
}

export default function FounderPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <Image
          src="/images/founder-portrait.png"
          alt="Estudio editorial de la Oficina del Fundador de Casa Bernocchi"
          fill
          priority
          className="object-cover opacity-24"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#07131f_4%,rgba(7,19,31,.96)_55%,rgba(7,19,31,.72))]" />
        <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-10 lg:py-32">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
            Oficina del Fundador
          </p>
          <h1 className="mt-6 max-w-5xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">
            Custodiar el origen. Gobernar el presente. Preparar el legado.
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
            La Oficina del Fundador dirige la etapa contemporánea de Casa Bernocchi,
            preserva la coherencia institucional y transforma una memoria iniciada
            en Roma en 1893 en estructuras capaces de perdurar.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-10 lg:py-28">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-[#07131f]/10 shadow-[0_30px_90px_rgba(7,19,31,.12)]">
            <Image
              src="/images/library.png"
              alt="Biblioteca institucional, símbolo de conocimiento y continuidad"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
          </div>
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Mandato contemporáneo</p>
            <blockquote className="mt-6 text-balance font-serif text-3xl font-light leading-relaxed sm:text-4xl">
              “Una institución no se mide por lo que proclama, sino por aquello que puede documentar, sostener y transmitir.”
            </blockquote>
            <div className="mt-8 space-y-5 text-base leading-8 text-[#07131f]/62">
              <p>
                Casa Bernocchi declara su fundación histórica en Roma, Italia, en
                1893. En 2024 abre su operación regional en Costa Rica y comienza
                una etapa de reorganización, expansión profesional y construcción
                institucional bajo la dirección de la Oficina del Fundador.
              </p>
              <p>
                Esta Oficina no sustituye la historia de la Casa: la custodia. Su
                función es convertir principios heredados en gobernanza, archivos,
                protocolos, instituciones especializadas y decisiones verificables.
              </p>
              <p>
                El horizonte no es una campaña ni un ciclo financiero. Es la
                continuidad generacional de una Casa capaz de actuar con precisión
                en salud, derecho, ciencia, innovación, educación y capital.
              </p>
            </div>
            <div className="mt-8 flex gap-3 rounded-2xl border border-[#a3823e]/20 bg-[#a3823e]/6 p-5 text-xs leading-6 text-[#07131f]/56">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#a3823e]" />
              <p>
                La fecha de 1893 es una declaración institucional que deberá conservar respaldo archivístico suficiente cuando se utilice ante terceros, autoridades o procesos de verificación histórica.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Método institucional</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Permanecer exige diseño.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Verificar', 'Separar hechos, hipótesis y recomendaciones antes de decidir.', BookOpen],
                ['Documentar', 'Registrar decisiones, responsables, riesgos y versiones.', Landmark],
                ['Gobernar', 'Asignar autoridad, controles y rendición de cuentas.', ShieldCheck],
                ['Transmitir', 'Convertir el conocimiento individual en patrimonio institucional.', ArrowRight],
              ].map(([title, body, Icon]) => {
                const Component = Icon as typeof BookOpen
                return (
                  <article key={String(title)} className="rounded-3xl border border-white/10 bg-white/[0.035] p-7">
                    <Component className="size-5 text-[#c9a85f]" />
                    <h3 className="mt-7 font-serif text-2xl">{String(title)}</h3>
                    <p className="mt-3 text-sm leading-7 text-white/52">{String(body)}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#f7f3ea] text-[#07131f]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Principios de la Casa</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-[#07131f]/10 bg-[#07131f]/10 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="bg-[#f7f3ea] p-8">
                <h3 className="font-serif text-3xl">{principle.title}</h3>
                <p className="mt-2 text-[0.64rem] uppercase tracking-[0.2em] text-[#a3823e]">{principle.subtitle}</p>
                <p className="mt-5 text-sm leading-7 text-[#07131f]/58">{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#0a1927] text-[#f7f1e6]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Gobernanza</p>
            <p className="mt-4 max-w-3xl text-balance font-serif text-3xl font-light leading-tight sm:text-4xl">
              La autoridad de la Oficina del Fundador se ejerce mediante reglas, trazabilidad y responsabilidad.
            </p>
          </div>
          <Link href="/governance" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-7 py-3.5 text-sm font-semibold text-[#07131f] transition hover:-translate-y-1 hover:bg-[#dfc47f]">
            Conocer la gobernanza <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
