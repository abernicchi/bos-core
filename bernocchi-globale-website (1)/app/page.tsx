import type { Metadata } from 'next'
import { PremiumHome } from '@/components/home/premium-home'

export const metadata: Metadata = {
  title: 'Casa Bernocchi — Roma 1893 · Institución italiana internacional',
  description:
    'Casa Bernocchi: herencia institucional iniciada en Roma en 1893, operación regional en Costa Rica desde 2024 y proyección internacional en salud, derecho, ciencia e innovación.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Casa Bernocchi — Roma 1893',
    description:
      'Conocimiento, honor, disciplina y legado. Una casa italiana de instituciones con vocación internacional.',
    url: '/',
  },
}

export default function HomePage() {
  return <PremiumHome />
}
