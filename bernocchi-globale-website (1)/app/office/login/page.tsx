import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Segreteria Console — Casa Bernocchi',
  robots: { index: false, follow: false },
}

export default async function OfficeLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <main className="min-h-screen bg-[#07131f] px-6 py-16 text-[#f7f1e6]">
      <div className="mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#c9a85f]">
          Casa Bernocchi · Accesso riservato
        </p>
        <h1 className="mt-5 font-serif text-4xl font-light">Segreteria Console</h1>
        <p className="mt-4 text-sm leading-7 text-white/52">
          Acceso institucional para coordinación de citas, pagos y comunicaciones administrativas.
        </p>

        <form action="/api/office/login" method="post" className="mt-10 space-y-5 rounded-3xl border border-white/10 bg-white/[0.035] p-7">
          <label className="block text-sm">
            <span className="text-white/58">Correo institucional</span>
            <input
              name="email"
              type="email"
              required
              autoComplete="username"
              defaultValue="segreteria@bernocchiglobale.it"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-white outline-none focus:border-[#c9a85f]/70"
            />
          </label>
          <label className="block text-sm">
            <span className="text-white/58">Contraseña</span>
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="mt-2 w-full rounded-xl border border-white/10 bg-[#0b1b2a] px-4 py-3 text-white outline-none focus:border-[#c9a85f]/70"
            />
          </label>
          {error ? (
            <p className="rounded-xl border border-red-300/20 bg-red-300/5 p-3 text-xs text-red-100/80">
              No fue posible validar el acceso. Revise las credenciales o complete primero la activación recibida por correo.
            </p>
          ) : null}
          <button className="w-full rounded-full bg-[#c9a85f] px-5 py-3.5 text-sm font-semibold text-[#07131f] transition hover:bg-[#dfc47f]">
            Entrar a Segreteria
          </button>
        </form>
      </div>
    </main>
  )
}
