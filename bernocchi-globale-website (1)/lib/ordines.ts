import type { InstitutionStatus } from '@/lib/content'

export type OrdoSlug =
  | 'medicinae'
  | 'iuris'
  | 'scientia'
  | 'innovatio'
  | 'humanitatis'
  | 'capitalis'

export type Ordo = {
  slug: OrdoSlug
  code: string
  order: string
  institution: string
  status: InstitutionStatus
  statusLabel: string
  discipline: string
  promise: string
  summary: string
  mandate: string
  capabilities: string[]
  controls: string[]
  nextMilestone: string
  primaryHref: string
  primaryLabel: string
  imagePosition: string
  regulatoryNote?: string
}

/**
 * Canonical portfolio of Casa Bernocchi. Status language is deliberately
 * explicit: only Medicinae currently presents an operating service pathway.
 */
export const ordines: readonly Ordo[] = [
  {
    slug: 'medicinae',
    code: 'ordo_medicinae',
    order: 'Ordo Medicinae',
    institution: 'Bernocchi Health',
    status: 'operating',
    statusLabel: 'Operativa',
    discipline: 'Salud y bienestar clínico',
    promise: 'Cuidado profesional con disciplina institucional.',
    summary:
      'Atención confidencial, basada en evidencia y organizada mediante un recorrido verificable de solicitud, reserva y seguimiento.',
    mandate:
      'Proteger la dignidad de cada persona y elevar la calidad de la atención mediante criterios clínicos, privacidad y continuidad documentada.',
    capabilities: [
      'Sexología clínica y salud sexual',
      'Terapia de pareja',
      'Consulta internacional en línea',
      'Atención ejecutiva y seguimiento estructurado',
    ],
    controls: [
      'Elegibilidad profesional y jurisdiccional antes de prestar el servicio',
      'Reserva provisional con prevención de solapamientos',
      'Recogida mínima de datos; ningún dato clínico en el formulario público',
      'Confirmación y trazabilidad por Segreteria Generale',
    ],
    nextMilestone: 'Ampliación controlada de disponibilidad y red profesional.',
    primaryHref: '/health#book',
    primaryLabel: 'Solicitar una cita',
    imagePosition: '18% center',
    regulatoryNote:
      'Los servicios dependen de la licencia del profesional, la ubicación del paciente y la elegibilidad aplicable.',
  },
  {
    slug: 'iuris',
    code: 'ordo_iuris',
    order: 'Ordo Iuris',
    institution: 'Bernocchi Legal',
    status: 'development',
    statusLabel: 'En estructuración',
    discipline: 'Derecho y arquitectura institucional',
    promise: 'Norma, criterio y continuidad para instituciones responsables.',
    summary:
      'Una práctica en estructuración para gobierno corporativo, diseño de políticas y coordinación jurídica internacional.',
    mandate:
      'Traducir deberes legales y fiduciarios en estructuras comprensibles, documentadas y sostenibles.',
    capabilities: [
      'Gobierno corporativo y documentación institucional',
      'Mapeo regulatorio y coordinación de asesores',
      'Políticas internas, riesgo y cumplimiento',
      'Arquitectura contractual y continuidad empresarial',
    ],
    controls: [
      'Revisión de jurisdicción y alcance antes de aceptar un asunto',
      'Intervención únicamente de profesionales habilitados cuando corresponda',
      'Gestión de conflictos de interés',
      'Trazabilidad de decisiones y versiones documentales',
    ],
    nextMilestone: 'Constitución del panel profesional y protocolo de admisión.',
    primaryHref: '/contact?ordo=ordo_iuris',
    primaryLabel: 'Presentar una consulta institucional',
    imagePosition: '39% center',
    regulatoryNote:
      'Esta página no constituye asesoramiento jurídico ni una oferta de servicios regulados. Cada encargo estará sujeto a habilitación y aceptación formal.',
  },
  {
    slug: 'scientia',
    code: 'ordo_scientia',
    order: 'Ordo Scientia',
    institution: 'Bernocchi Research Institute',
    status: 'development',
    statusLabel: 'En desarrollo',
    discipline: 'Investigación y conocimiento verificable',
    promise: 'Conocimiento que puede ser examinado, reproducido y gobernado.',
    summary:
      'Plataforma en desarrollo para investigación aplicada, síntesis rigurosa y transferencia responsable de conocimiento.',
    mandate:
      'Separar evidencia, inferencia y opinión; convertir investigación útil en decisiones institucionales auditables.',
    capabilities: [
      'Revisión de evidencia y síntesis multidisciplinaria',
      'Diseño de protocolos y agendas de investigación',
      'Ciencia del comportamiento y neurociencia aplicada',
      'Publicaciones, observatorios y transferencia de conocimiento',
    ],
    controls: [
      'Declaración de fuentes, límites e incertidumbre',
      'Revisión ética y protección de participantes',
      'Versionado de métodos y resultados',
      'Separación entre investigación, comunicación y promoción',
    ],
    nextMilestone: 'Publicación de la primera agenda de investigación y su marco ético.',
    primaryHref: '/contact?ordo=ordo_scientia',
    primaryLabel: 'Proponer investigación',
    imagePosition: '57% center',
  },
  {
    slug: 'innovatio',
    code: 'ordo_innovatio',
    order: 'Ordo Innovatio',
    institution: 'Bernocchi Digital',
    status: 'development',
    statusLabel: 'En desarrollo',
    discipline: 'Sistemas digitales e inteligencia aplicada',
    promise: 'Tecnología sobria, segura y al servicio del juicio humano.',
    summary:
      'Unidad en desarrollo para productos digitales, automatización e inteligencia artificial con responsabilidad operativa.',
    mandate:
      'Diseñar sistemas que aumenten capacidad sin diluir privacidad, control humano ni responsabilidad institucional.',
    capabilities: [
      'Diseño de productos y experiencias digitales',
      'Automatización de operaciones y flujos de conocimiento',
      'Gobernanza y evaluación de sistemas de inteligencia artificial',
      'Datos, observabilidad y seguridad por diseño',
    ],
    controls: [
      'Minimización de datos y privilegios',
      'Revisión humana para decisiones sensibles',
      'Pruebas, registro y reversibilidad de cambios',
      'Proveedores y modelos evaluados por riesgo',
    ],
    nextMilestone: 'Consolidación del sistema operativo digital de la Casa.',
    primaryHref: '/contact?ordo=ordo_innovatio',
    primaryLabel: 'Explorar una colaboración',
    imagePosition: '70% center',
  },
  {
    slug: 'humanitatis',
    code: 'ordo_humanitatis',
    order: 'Ordo Humanitatis',
    institution: 'Bernocchi Academy',
    status: 'planned',
    statusLabel: 'Planificada',
    discipline: 'Educación, cultura y formación',
    promise: 'Formación para custodiar criterio, oficio y humanidad.',
    summary:
      'Institución planificada para formación profesional, cultura institucional y transmisión intergeneracional de conocimiento.',
    mandate:
      'Crear experiencias formativas exigentes que unan fundamentos humanísticos, práctica profesional y responsabilidad cívica.',
    capabilities: [
      'Programas ejecutivos y formación profesional',
      'Cultura, escritura y pensamiento crítico',
      'Escuela de gobierno y continuidad institucional',
      'Becas y proyectos de impacto educativo',
    ],
    controls: [
      'Resultados de aprendizaje explícitos y evaluables',
      'Docentes y contenidos sujetos a verificación',
      'Accesibilidad y protección del participante',
      'Ninguna credencial académica se ofrecerá sin habilitación aplicable',
    ],
    nextMilestone: 'Definición del primer programa y consejo académico.',
    primaryHref: '/contact?ordo=ordo_humanitatis',
    primaryLabel: 'Registrar interés',
    imagePosition: '84% center',
    regulatoryNote:
      'No se ofrecen actualmente títulos ni acreditaciones oficiales.',
  },
  {
    slug: 'capitalis',
    code: 'ordo_capitalis',
    order: 'Ordo Capitalis',
    institution: 'Bernocchi Capital',
    status: 'planned',
    statusLabel: 'Planificada',
    discipline: 'Capital, empresa y stewardship',
    promise: 'Capital disciplinado para construir valor duradero.',
    summary:
      'Institución planificada para análisis empresarial, asignación responsable de capital y desarrollo de activos estratégicos.',
    mandate:
      'Proteger capital y reputación mediante análisis riguroso, gobierno claro y horizontes de largo plazo.',
    capabilities: [
      'Análisis empresarial y evaluación de oportunidades',
      'Estrategia de capital y desarrollo corporativo',
      'Gobierno de activos y continuidad patrimonial',
      'Apoyo estratégico a empresas de la Casa',
    ],
    controls: [
      'Separación entre análisis, decisión y supervisión',
      'Registro de tesis, riesgos y conflictos',
      'Debida diligencia proporcional',
      'Ninguna captación pública ni recomendación de inversión sin autorización',
    ],
    nextMilestone: 'Aprobación del mandato de inversión y marco de riesgos.',
    primaryHref: '/contact?ordo=ordo_capitalis',
    primaryLabel: 'Contacto institucional',
    imagePosition: '96% center',
    regulatoryNote:
      'Esta página no es una oferta de valores, captación de fondos ni asesoramiento de inversión.',
  },
] as const

export function getOrdo(slug: string) {
  return ordines.find((ordo) => ordo.slug === slug)
}

export function getOrdoByCode(code: string) {
  return ordines.find((ordo) => ordo.code === code)
}
