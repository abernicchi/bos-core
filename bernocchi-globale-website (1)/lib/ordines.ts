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
 * Canonical portfolio of Casa Bernocchi.
 * All six Ordines are instituted and operational as organisational units.
 * A public operational status does not waive professional, licensing,
 * securities, academic, privacy or jurisdictional requirements for regulated
 * acts. Each Ordo therefore declares its permitted public scope explicitly.
 */
export const ordines: readonly Ordo[] = [
  {
    slug: 'medicinae',
    code: 'ordo_medicinae',
    order: 'Ordo Medicinae',
    institution: 'Bernocchi Health',
    status: 'operating',
    statusLabel: 'Institución activa · atención clínica',
    discipline: 'Salud, sexualidad y bienestar clínico',
    promise: 'Cuidado profesional con disciplina institucional.',
    summary:
      'Unidad clínica activa de Casa Bernocchi para atención confidencial, basada en evidencia y organizada mediante recorridos verificables de valoración, reserva y seguimiento.',
    mandate:
      'Proteger la dignidad de cada persona y elevar la calidad de la atención mediante criterio clínico, privacidad, trazabilidad y continuidad.',
    capabilities: [
      'Sexología clínica y salud sexual',
      'Psicología clínica y terapia de pareja',
      'Salud sexual masculina y femenina',
      'Consulta internacional en línea sujeta a elegibilidad',
      'Producción clínica y divulgación científica en coordinación con Ordo Scientia',
    ],
    controls: [
      'Elegibilidad profesional y jurisdiccional antes de prestar servicios regulados',
      'Reserva con prevención de solapamientos y trazabilidad por Segreteria Generale',
      'Minimización de datos; ningún dato clínico sensible en formularios públicos',
      'Consentimiento informado, confidencialidad y documentación clínica cuando corresponda',
    ],
    nextMilestone: 'Escalar la red profesional, protocolos clínicos y biblioteca científica especializada.',
    primaryHref: '/health#book',
    primaryLabel: 'Solicitar una consulta',
    imagePosition: '18% center',
    regulatoryNote:
      'La prestación clínica depende de la licencia del profesional, la ubicación del paciente y la normativa aplicable en cada caso.',
  },
  {
    slug: 'iuris',
    code: 'ordo_iuris',
    order: 'Ordo Iuris',
    institution: 'Bernocchi Legal',
    status: 'operating',
    statusLabel: 'Institución activa · admisión controlada',
    discipline: 'Derecho, gobernanza y arquitectura institucional',
    promise: 'Norma, criterio y continuidad para instituciones responsables.',
    summary:
      'Unidad jurídica e institucional activa para gobierno corporativo, investigación jurídica, documentación, cumplimiento, riesgo y coordinación de profesionales habilitados.',
    mandate:
      'Traducir deberes legales, fiduciarios y regulatorios en estructuras comprensibles, documentadas, auditables y sostenibles.',
    capabilities: [
      'Gobierno corporativo y documentación institucional',
      'Investigación jurídica comparada y mapeo regulatorio',
      'Políticas internas, riesgo, cumplimiento y protección documental',
      'Arquitectura contractual y continuidad empresarial',
      'Coordinación de asesores y profesionales habilitados por jurisdicción',
    ],
    controls: [
      'Revisión previa de jurisdicción, competencia y alcance',
      'Intervención de profesionales habilitados cuando la actividad lo exija',
      'Gestión de conflictos de interés y secreto profesional',
      'Trazabilidad de decisiones, fuentes y versiones documentales',
    ],
    nextMilestone: 'Desplegar biblioteca jurídica, protocolos de admisión y red profesional por jurisdicción.',
    primaryHref: '/contact?ordo=ordo_iuris',
    primaryLabel: 'Abrir consulta institucional',
    imagePosition: '39% center',
    regulatoryNote:
      'La Ordo está institucionalmente activa. La asesoría o representación jurídica regulada solo se acepta cuando exista habilitación profesional y jurisdiccional suficiente.',
  },
  {
    slug: 'scientia',
    code: 'ordo_scientia',
    order: 'Ordo Scientia',
    institution: 'Bernocchi Research Institute',
    status: 'operating',
    statusLabel: 'Institución activa · producción científica',
    discipline: 'Investigación, evidencia y conocimiento verificable',
    promise: 'Conocimiento que puede ser examinado, discutido y transmitido.',
    summary:
      'Instituto activo para revisión de evidencia, investigación aplicada, publicaciones científicas, observatorios y transferencia responsable de conocimiento entre las Ordines.',
    mandate:
      'Separar hechos, inferencias e hipótesis; construir conocimiento útil con fuentes trazables, metodología declarada y revisión crítica.',
    capabilities: [
      'Revisiones narrativas, scoping reviews y síntesis de evidencia',
      'Diseño de protocolos y agendas de investigación',
      'Sexología, neurociencia, conducta humana y salud',
      'Derecho, instituciones, tecnología y capital como líneas multidisciplinarias',
      'Journal, working papers y notas de evidencia de Casa Bernocchi',
    ],
    controls: [
      'Fuentes primarias y secundarias identificadas con fecha y alcance',
      'Separación expresa entre evidencia, hipótesis y recomendación',
      'Revisión ética y protección de participantes antes de investigación humana',
      'Declaración de conflictos, límites, incertidumbre y correcciones',
    ],
    nextMilestone: 'Publicar el primer ciclo de revisiones científicas y establecer el registro editorial de Ordo Scientia.',
    primaryHref: '/journal',
    primaryLabel: 'Leer publicaciones',
    imagePosition: '57% center',
    regulatoryNote:
      'Las publicaciones de la Ordo son material científico y educativo; no sustituyen diagnóstico, tratamiento ni consejo profesional individual.',
  },
  {
    slug: 'innovatio',
    code: 'ordo_innovatio',
    order: 'Ordo Innovatio',
    institution: 'Bernocchi Digital',
    status: 'operating',
    statusLabel: 'Institución activa · sistemas digitales',
    discipline: 'Tecnología, datos e inteligencia aplicada',
    promise: 'Tecnología sobria, segura y al servicio del juicio humano.',
    summary:
      'Unidad tecnológica activa responsable del sistema operativo digital de la Casa, automatización, productos internos, datos, observabilidad e inteligencia artificial.',
    mandate:
      'Aumentar la capacidad de Casa Bernocchi mediante sistemas seguros y verificables sin diluir privacidad, control humano ni responsabilidad institucional.',
    capabilities: [
      'Arquitectura web, aplicaciones y productos digitales',
      'Automatización de operaciones y flujos de conocimiento',
      'Gobernanza, evaluación y despliegue responsable de inteligencia artificial',
      'Datos, analítica, observabilidad, seguridad y continuidad',
      'Integraciones corporativas entre Calendar, Drive, pagos y sistemas internos',
    ],
    controls: [
      'Privilegio mínimo, segregación de secretos y minimización de datos',
      'Revisión humana en decisiones sensibles',
      'Pruebas, logs, reversibilidad y control de versiones',
      'Evaluación de proveedores, dependencias, modelos y superficie de ataque',
    ],
    nextMilestone: 'Consolidar BOS Core como sistema operativo común de las seis Ordines.',
    primaryHref: '/contact?ordo=ordo_innovatio',
    primaryLabel: 'Proponer un proyecto digital',
    imagePosition: '70% center',
    regulatoryNote:
      'La Ordo no presenta sistemas automatizados como sustitutos de profesionales en decisiones médicas, jurídicas, financieras o equivalentes de alto impacto.',
  },
  {
    slug: 'humanitatis',
    code: 'ordo_humanitatis',
    order: 'Ordo Humanitatis',
    institution: 'Bernocchi Academy',
    status: 'operating',
    statusLabel: 'Institución activa · formación no acreditada',
    discipline: 'Educación, cultura y formación',
    promise: 'Formación para custodiar criterio, oficio y humanidad.',
    summary:
      'Unidad educativa y cultural activa para seminarios, lecturas, formación profesional no conducente a título, escritura, pensamiento crítico y transmisión del conocimiento de la Casa.',
    mandate:
      'Crear experiencias formativas exigentes que unan fundamentos humanísticos, práctica profesional, ciencia y responsabilidad cívica.',
    capabilities: [
      'Seminarios y programas ejecutivos no conducentes a grado',
      'Cultura, escritura, historia institucional y pensamiento crítico',
      'Formación interna de las Ordines y escuela de gobierno',
      'Divulgación académica y educación pública basada en evidencia',
      'Becas y proyectos educativos cuando exista financiación aprobada',
    ],
    controls: [
      'Resultados de aprendizaje explícitos y evaluables',
      'Docentes, bibliografía y materiales sujetos a verificación',
      'Accesibilidad, propiedad intelectual y protección del participante',
      'Ningún título, grado o acreditación oficial sin autorización legal expresa',
    ],
    nextMilestone: 'Lanzar el primer ciclo de seminarios Bernocchi y el programa interno de formación institucional.',
    primaryHref: '/contact?ordo=ordo_humanitatis',
    primaryLabel: 'Registrar interés académico',
    imagePosition: '84% center',
    regulatoryNote:
      'La actividad educativa inicial es no acreditada y no conduce a títulos oficiales salvo que una futura habilitación se declare expresamente.',
  },
  {
    slug: 'capitalis',
    code: 'ordo_capitalis',
    order: 'Ordo Capitalis',
    institution: 'Bernocchi Capital',
    status: 'operating',
    statusLabel: 'Institución activa · capital interno',
    discipline: 'Capital, empresa, activos y stewardship',
    promise: 'Capital disciplinado para construir valor duradero.',
    summary:
      'Unidad activa para planificación financiera interna, evaluación empresarial, gobierno de activos, desarrollo corporativo y análisis de oportunidades de Casa Bernocchi.',
    mandate:
      'Proteger capital, activos y reputación mediante análisis riguroso, gobierno claro, asignación disciplinada y horizontes de largo plazo.',
    capabilities: [
      'Planificación financiera y control de recursos de la Casa',
      'Análisis empresarial y evaluación de oportunidades',
      'Estrategia de capital, presupuestos y desarrollo corporativo',
      'Gobierno de activos, propiedad y continuidad patrimonial',
      'Apoyo económico a proyectos aprobados de las demás Ordines',
    ],
    controls: [
      'Separación entre análisis, aprobación, ejecución y supervisión',
      'Registro de tesis, riesgos, supuestos y conflictos',
      'Debida diligencia proporcional antes de comprometer capital',
      'Ninguna captación pública, gestión de terceros o recomendación de inversión sin autorización aplicable',
    ],
    nextMilestone: 'Implantar presupuesto maestro, comité de capital y tablero de rentabilidad/riesgo de las Ordines.',
    primaryHref: '/contact?ordo=ordo_capitalis',
    primaryLabel: 'Contacto corporativo',
    imagePosition: '96% center',
    regulatoryNote:
      'La actividad inicial de Bernocchi Capital es corporativa e interna. Esta página no constituye oferta de valores, captación de fondos ni asesoramiento financiero a terceros.',
  },
] as const

export function getOrdo(slug: string) {
  return ordines.find((ordo) => ordo.slug === slug)
}

export function getOrdoByCode(code: string) {
  return ordines.find((ordo) => ordo.code === code)
}
