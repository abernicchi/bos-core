import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Landmark, ShieldCheck, Stethoscope } from 'lucide-react'
import { principles } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Oficina del Fundador — Casa Bernocchi',
  description:
    'La Oficina del Fundador de Casa Bernocchi dirige la arquitectura institucional, la gobernanza, la reputación y la continuidad de la Casa.',
  alternates: { canonical: '/founder' },
}

export default function FounderPage() {
  return (
    <>
      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.08fr_.92fr] lg:items-center lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
              Oficina del Fundador
            </p>
            <h1 className="mt-6 max-w-4xl text-balance font-serif text-5xl font-light leading-[.98] sm:text-6xl lg:text-7xl">
              Antonello Bernocchi Medici
            </h1>
            <p className="mt-5 font-serif text-2xl font-light text-[#e2cb92] sm:text-3xl">
              Founder · Casa Bernocchi
            </p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/62 sm:text-lg">
              La Oficina del Fundador define estándares, custodia la coherencia institucional,
              ordena riesgos y transforma decisiones en sistemas que puedan documentarse,
              auditarse y transmitirse.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/governance" className="inline-flex items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-7 py-3.5 text-sm font-semibold text-[#07131f] transition hover:-translate-y-0.5 hover:bg-[#dfc47f]">
                Ver gobernanza <ArrowRight className="size-4" />
              </Link>
              <Link href="/health#professional" className="inline-flex items-center justify-center gap-2 rounded-full border border-white/18 px-7 py-3.5 text-sm font-medium text-white/82 transition hover:border-[#c9a85f]/55 hover:text-[#d8bd7a]">
                Dirección clínica <Stethoscope className="size-4" />
              </Link>
            </div>
          </div>

          <div className="relative mx-auto aspect-[4/5] w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-[0_35px_110px_rgba(0,0,0,.32)]">
            <Image
              src="/images/founder-portrait.png"
              alt="Antonello Bernocchi Medici, fundador de Casa Bernocchi"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 42vw"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#07131f] via-[#07131f]/78 to-transparent p-7 pt-28">
              <p className="text-[0.62rem] uppercase tracking-[0.22em] text-[#c9a85f]">Conocimiento · Honor · Disciplina · Legado</p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Mandato contemporáneo</p>
            <blockquote className="mt-6 text-balance font-serif text-3xl font-light leading-relaxed sm:text-4xl">
              “Una institución no se mide por lo que proclama, sino por aquello que puede documentar, sostener y transmitir.”
            </blockquote>
          </div>
          <div className="space-y-5 text-base leading-8 text-[#07131f]/62">
            <p>
              La Oficina del Fundador no es una pieza ceremonial. Actúa como centro de
              dirección para la arquitectura corporativa, la reputación, los controles y
              la continuidad de Casa Bernocchi.
            </p>
            <p>
              En la etapa actual, su prioridad es consolidar lo que ya opera —en especial
              Bernocchi Health— antes de dar el mismo protagonismo público a instituciones
              que todavía permanecen en desarrollo o planificación.
            </p>
            <p>
              La historia, la ambición y el prestigio solo adquieren valor institucional
              cuando pueden coexistir con precisión factual, cumplimiento y una experiencia
              real para clientes, pacientes, colaboradores y terceros.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#07131f] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Método institucional</p>
              <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Prestigio sin verificación es fragilidad.</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Verificar', 'Separar hechos acreditados, información aportada y aspiraciones antes de publicar.', BookOpen],
                ['Documentar', 'Registrar decisiones, fuentes, responsables, riesgos y versiones.', Landmark],
                ['Gobernar', 'Asignar autoridad, controles y rendición de cuentas antes de crecer.', ShieldCheck],
                ['Transmitir', 'Convertir conocimiento individual en patrimonio institucional reproducible.', ArrowRight],
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
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-start lg:px-10 lg:py-28">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Política de credenciales</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-light leading-tight sm:text-5xl">Lo que se afirma públicamente debe poder probarse.</h2>
          </div>
          <div>
            <p className="text-base leading-8 text-[#07131f]/62">
              Casa Bernocchi adopta una regla de verificación previa para títulos académicos,
              afiliaciones institucionales, publicaciones, premios, licencias, colegiaturas y
              experiencias profesionales. La información curricular aportada por una persona
              no se convierte automáticamente en una afirmación corporativa pública.
            </p>
            <div className="mt-7 flex gap-3 rounded-2xl border border-[#a3823e]/20 bg-[#a3823e]/6 p-5 text-xs leading-6 text-[#07131f]/58">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#a3823e]" />
              <p>
                Esta política protege al paciente, al profesional y a la Casa. Las credenciales
                pertinentes al servicio y a la jurisdicción se confirman antes de la prestación cuando corresponde.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0a1927] text-[#f7f1e6]">
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-28">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">Principios de la Casa</p>
          <div className="mt-10 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 md:grid-cols-3">
            {principles.map((principle) => (
              <article key={principle.title} className="bg-[#0a1927] p-8">
                <h3 className="font-serif text-3xl">{principle.title}</h3>
                <p className="mt-2 text-[0.64rem] uppercase tracking-[0.2em] text-[#c9a85f]">{principle.subtitle}</p>
                <p className="mt-5 text-sm leading-7 text-white/52">{principle.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f3eee3] text-[#07131f]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-20 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div>
            <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#a3823e]">Ejecución</p>
            <p className="mt-4 max-w-3xl text-balance font-serif text-3xl font-light leading-tight sm:text-4xl">
              La primera prueba del modelo institucional es Bernocchi Health: una experiencia clara, humana y verificable.
            </p>
          </div>
          <Link href="/health" className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#07131f] px-7 py-3.5 text-sm font-semibold text-[#f3eee3] transition hover:-translate-y-0.5">
            Conocer Bernocchi Health <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  )
}
