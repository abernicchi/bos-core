/**
 * CENTRAL CONTENT & CONFIGURATION
 * ---------------------------------
 * Single source of truth for the Casa Bernocchi institutional site.
 * Edit values here to update them across the entire site.
 *
 * TRUTH RULES (do not violate):
 * - Founded in Italy. HQ Milano, Italia. Regional office Costa Rica.
 * - Do NOT invent clients, awards, revenue, team, partnerships, offices or stats.
 * - Future institutions must be marked "in development" or "planned".
 * - Use the exact Italian spelling "Bernocchi Globale", never "Bernocchi Global".
 */

export const site = {
  name: 'Casa Bernocchi®',
  legalName: 'Bernocchi Globale Holdings',
  domain: 'bernocchiglobale.it',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bernocchiglobale.it',
  email:
    process.env.CONTACT_RECIPIENT_EMAIL ?? 'segreteria@bernocchiglobale.it',
  phoneDisplay: '+506 8370 3939',
  whatsappNumber: '50683703939',
  whatsappMessage:
    'Hello. I would like to schedule a consultation with Bernocchi Health.',
  tagline: 'Italian excellence, built to endure.',
  positioning:
    'Casa Bernocchi is the institutional identity of Bernocchi Globale Holdings, developing professional excellence across health, law, science and innovation.',
  description:
    'Casa Bernocchi is the institutional identity of Bernocchi Globale Holdings, a private Italian group building professional excellence across health, law, science, technology and education. Its first operating institution is Bernocchi Health.',
  mission:
    'To build and govern specialised institutions bound by a shared system of ethics, verified knowledge, disciplined execution and long-term stewardship.',
  vision:
    'To become a respected private Italian group with international operations, recognised for institutions that unite professional excellence, verified credibility and generational continuity.',
} as const

export const offices = [
  {
    label: 'Headquarters',
    city: 'Milano',
    country: 'Italy',
    primary: true,
    detail: 'Bernocchi Globale Holdings — Milano, Italy',
  },
  {
    label: 'Regional Office',
    city: 'Costa Rica',
    country: '',
    primary: false,
    detail: 'Bernocchi Health — regional operations, Costa Rica',
  },
] as const

/** Primary navigation used in the global header. */
export const navigation = [
  { label: 'Casa', href: '/casa' },
  { label: 'Institutions', href: '/institutions' },
  { label: 'Founder', href: '/founder' },
  { label: 'Health', href: '/health' },
  { label: 'Journal', href: '/journal' },
  { label: 'Governance', href: '/governance' },
  { label: 'Contact', href: '/contact' },
] as const

export type InstitutionStatus = 'operating' | 'development' | 'planned' | 'future'

export const statusLabels: Record<InstitutionStatus, string> = {
  operating: 'Operating',
  development: 'In development',
  planned: 'Planned',
  future: 'Future institution',
}

export type Institution = {
  name: string
  slug: string
  status: InstitutionStatus
  summary: string
  order: string
  href?: string
}

export const institutions: Institution[] = [
  {
    name: 'Bernocchi Health',
    slug: 'health',
    status: 'operating',
    order: 'Ordo Medicinae',
    href: '/health',
    summary:
      'Professional care with institutional standards: clinical psychology, sexology, couples therapy and behavioural neuroscience.',
  },
  {
    name: 'Bernocchi Legal',
    slug: 'legal',
    status: 'development',
    order: 'Ordo Iuris',
    summary:
      'Legal counsel and institutional governance. Currently in development.',
  },
  {
    name: 'Bernocchi Research Institute',
    slug: 'research',
    status: 'development',
    order: 'Ordo Scientiae',
    summary:
      'Research, neuroscience and the production of verified knowledge. Currently in development.',
  },
  {
    name: 'Bernocchi Digital',
    slug: 'digital',
    status: 'development',
    order: 'Ordo Innovationis',
    summary:
      'Technology, artificial intelligence and digital systems. Currently in development.',
  },
  {
    name: 'Bernocchi Academy',
    slug: 'academy',
    status: 'planned',
    order: 'Ordo Humanitatis',
    summary: 'Education, culture and human development. Planned institution.',
  },
  {
    name: 'Bernocchi Capital',
    slug: 'capital',
    status: 'planned',
    order: 'Ordo Capitalis',
    summary:
      'Investment analysis and enterprise development. Planned institution.',
  },
]

export const principles = [
  {
    title: 'Scientia',
    subtitle: 'Knowledge',
    body: 'Verified knowledge precedes every decision. Nothing we state is taken for granted.',
  },
  {
    title: 'Integritas',
    subtitle: 'Integrity',
    body: 'Integrity is the condition of trust. Decisions are documented, coherent and accountable.',
  },
  {
    title: 'Posteritas',
    subtitle: 'Continuity',
    body: 'We build for generational continuity, not the short cycle. Institutions must outlive their founders.',
  },
]

/**
 * BERNOCCHI HEALTH SERVICES
 * The revenue-generating catalogue. Each service is delivered by licensed
 * professionals. Prices are indicative consultation fees in EUR.
 */
export type HealthService = {
  id: string
  name: string
  description: string
  benefits: string[]
  priceInCents: number
  currency: 'eur'
  duration: string
}

export const healthServices: HealthService[] = [
  {
    id: 'clinical-psychology',
    name: 'Clinical Psychology',
    description:
      'Confidential, evidence-based psychological consultation for anxiety, stress, mood and life transitions.',
    benefits: [
      'Structured clinical assessment',
      'Evidence-based methods',
      'Confidential and judgement-free',
    ],
    priceInCents: 12000,
    currency: 'eur',
    duration: '50 minutes',
  },
  {
    id: 'sexology',
    name: 'Sexology',
    description:
      'Professional, discreet support for sexual health, intimacy and related concerns.',
    benefits: [
      'Specialised clinical training',
      'Complete discretion',
      'Non-judgemental guidance',
    ],
    priceInCents: 13000,
    currency: 'eur',
    duration: '50 minutes',
  },
  {
    id: 'couples-therapy',
    name: 'Couples Therapy',
    description:
      'Guided sessions to rebuild communication, trust and connection between partners.',
    benefits: [
      'Structured relational framework',
      'Balanced, impartial guidance',
      'Practical tools between sessions',
    ],
    priceInCents: 15000,
    currency: 'eur',
    duration: '60 minutes',
  },
  {
    id: 'behavioral-neuroscience',
    name: 'Behavioral Neuroscience',
    description:
      'Consultation informed by behavioural neuroscience for habits, focus and self-regulation.',
    benefits: [
      'Neuroscience-informed approach',
      'Focus on measurable change',
      'Personalised strategy',
    ],
    priceInCents: 14000,
    currency: 'eur',
    duration: '50 minutes',
  },
  {
    id: 'online-consultation',
    name: 'Online Consultation',
    description:
      'Secure video consultation available internationally, subject to professional and jurisdictional eligibility.',
    benefits: [
      'Available internationally',
      'Secure and private',
      'Flexible scheduling',
    ],
    priceInCents: 11000,
    currency: 'eur',
    duration: '50 minutes',
  },
  {
    id: 'premium-professional-care',
    name: 'Premium Professional Care',
    description:
      'An extended, priority consultation pathway for complex or ongoing professional care.',
    benefits: [
      'Priority scheduling',
      'Extended session time',
      'Coordinated follow-up',
    ],
    priceInCents: 24000,
    currency: 'eur',
    duration: '80 minutes',
  },
]

/** Editorial copy for the Health landing page. */
export const healthIntro = {
  heading: 'Care delivered with the discipline of an institution.',
  lede: 'Bernocchi Health is the first operating institution of the group. Confidential, evidence-based consultations with licensed professionals — booked and paid for in a few clear steps.',
  reassurances: [
    {
      title: 'Online or in person',
      body: 'Meet by secure video or in person, whichever suits you.',
    },
    {
      title: 'Three languages',
      body: 'Consultations available in English, Italian and Spanish.',
    },
    {
      title: 'Clear pricing',
      body: 'Full fees shown before payment. No hidden costs.',
    },
    {
      title: 'Confidential by design',
      body: 'Delivered by licensed professionals, held in confidence.',
    },
  ],
} as const

/**
 * BERNOCCHI HEALTH — EDITORIAL SERVICE CARDS
 * Presentational catalogue for the Health landing page "Our Services" section.
 * Descriptions only (no invented professionals, credentials or prices here).
 */
export const healthServiceCards: { name: string; description: string }[] = [
  {
    name: 'Clinical Sexology',
    description:
      'Discreet, clinically grounded consultation for sexual health, intimacy and related concerns, held in complete confidence.',
  },
  {
    name: 'Couples Therapy',
    description:
      'Structured, impartial sessions to rebuild communication, trust and connection between partners.',
  },
  {
    name: "Men's Sexual Health",
    description:
      'Focused, confidential consultation addressing male sexual health with professional sensitivity.',
  },
  {
    name: "Women's Sexual Health",
    description:
      'Focused, confidential consultation addressing female sexual health with professional sensitivity.',
  },
  {
    name: 'Psychological Assessment',
    description:
      'Structured clinical assessment for anxiety, stress, mood and life transitions, using evidence-based methods.',
  },
  {
    name: 'Executive Mental Health',
    description:
      'A discreet, priority pathway for demanding professional lives, with extended sessions and coordinated follow-up.',
  },
  {
    name: 'Online Consultations',
    description:
      'Secure video consultation available internationally, subject to professional and jurisdictional eligibility.',
  },
]

/** BERNOCCHI HEALTH — the four institutional pillars ("Why Bernocchi"). */
export const whyBernocchi: {
  title: string
  flag?: string
  body: string
}[] = [
  {
    title: 'Italian Excellence',
    flag: '🇮🇹',
    body: 'Care shaped by an Italian standard of professional rigour, discretion and enduring quality.',
  },
  {
    title: 'Evidence-Based Practice',
    body: 'Every consultation is grounded in verified clinical method, not opinion or trend.',
  },
  {
    title: 'Confidentiality',
    body: 'Absolute discretion by design. What is shared in consultation remains in confidence.',
  },
  {
    title: 'Personalized Care',
    body: 'A considered, individual pathway for each person, never a template.',
  },
]

/** BERNOCCHI HEALTH — the four-step patient journey. */
export const patientJourney: { step: string; title: string; body: string }[] =
  [
    {
      step: '01',
      title: 'Book',
      body: 'Request an appointment in a few clear steps. The Segreteria Generale confirms availability with you.',
    },
    {
      step: '02',
      title: 'Consultation',
      body: 'Meet your clinician online or in person for a confidential, unhurried first consultation.',
    },
    {
      step: '03',
      title: 'Treatment Plan',
      body: 'Receive a considered, personalised plan built around your goals and circumstances.',
    },
    {
      step: '04',
      title: 'Follow-up',
      body: 'Ongoing, coordinated follow-up ensures continuity of care over time.',
    },
  ]

/** BERNOCCHI HEALTH — frequently asked questions. */
export const healthFaqs: { question: string; answer: string }[] = [
  {
    question: 'Is my consultation confidential?',
    answer:
      'Yes. Confidentiality is fundamental to our practice. Consultations are delivered by licensed professionals and held in strict confidence. Please do not include clinical details in any form on this website.',
  },
  {
    question: 'Do you offer online consultations?',
    answer:
      'Yes. Secure video consultations are available internationally, subject to professional and jurisdictional eligibility, so you can be cared for wherever you are.',
  },
  {
    question: 'Which languages are available?',
    answer:
      'Consultations are available in English, Italian and Spanish. You can indicate your preferred language when you request an appointment.',
  },
  {
    question: 'How does payment work?',
    answer:
      'Requesting an appointment involves no payment. Indicative fees are shown transparently, and the Segreteria Generale confirms the details with you before your consultation.',
  },
  {
    question: 'How long is a consultation?',
    answer:
      'Most consultations last between 50 and 80 minutes depending on the pathway, allowing time for an unhurried, thorough conversation.',
  },
  {
    question: 'How do I arrange an appointment?',
    answer:
      'Use the booking request on this page, or reach us on WhatsApp or by email. We will confirm availability and guide you through the next steps.',
  },
]

export const consultationModes = [
  { value: 'online', label: 'Online' },
  { value: 'in-person', label: 'In person' },
]

/**
 * CONSULTATION TYPES — booking request flow
 * ------------------------------------------
 * These are the consultations a visitor can request an appointment for.
 * The current flow captures a *request* (no payment). Prices are intentionally
 * omitted here and confirmed by the Segreteria Generale after review.
 */
export type ConsultationType = {
  id: string
  name: string
  description: string
  duration: string
}

export const consultationTypes: ConsultationType[] = [
  {
    id: 'clinical-sexology',
    name: 'Clinical Sexology',
    description:
      'Professional, discreet clinical support for sexual health and wellbeing.',
    duration: '50 minutes',
  },
  {
    id: 'couples-therapy',
    name: 'Couples Therapy',
    description:
      'Guided sessions to rebuild communication, trust and connection between partners.',
    duration: '60 minutes',
  },
  {
    id: 'mens-sexual-health',
    name: "Men's Sexual Health",
    description:
      'Focused, confidential consultation addressing male sexual health concerns.',
    duration: '50 minutes',
  },
  {
    id: 'womens-sexual-health',
    name: "Women's Sexual Health",
    description:
      'Focused, confidential consultation addressing female sexual health concerns.',
    duration: '50 minutes',
  },
  {
    id: 'online-consultation',
    name: 'Online Consultation',
    description:
      'Secure video consultation available internationally, subject to eligibility.',
    duration: '50 minutes',
  },
  {
    id: 'executive-consultation',
    name: 'Executive Consultation',
    description:
      'An extended, priority consultation pathway for demanding schedules.',
    duration: '80 minutes',
  },
]

/**
 * Assignable professionals for the booking flow. Kept generic and truthful —
 * "First available" lets patients book without naming a specific clinician.
 * Add named, licensed professionals here as the practice grows.
 */
export const professionals = [
  {
    id: 'first-available',
    name: 'First available professional',
    role: 'Licensed clinician',
  },
]

export const languages = [
  { value: 'it', label: 'Italiano', flag: '🇮🇹' },
  { value: 'en', label: 'English', flag: '🇬🇧' },
  { value: 'es', label: 'Español', flag: '🇪🇸' },
]

/** Weekday time slots offered in the booking flow (local office time). */
export const bookingTimeSlots = [
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]

export type InquiryType =
  | 'health'
  | 'institutional'
  | 'collaboration'
  | 'research'
  | 'media'
  | 'other'

export const inquiryTypes: { value: InquiryType; label: string }[] = [
  { value: 'health', label: 'Health consultation' },
  { value: 'institutional', label: 'Institutional enquiry' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'research', label: 'Research' },
  { value: 'media', label: 'Media' },
  { value: 'other', label: 'Other' },
]

export type JournalArticle = {
  slug: string
  title: string
  category: string
  excerpt: string
  status: 'draft' | 'published'
  readingTime: string
  body: string[]
}

/** Editorial drafts — clearly marked until formally published. */
export const journalArticles: JournalArticle[] = [
  {
    slug: 'why-institutions-outlive-companies',
    title: 'Why Institutions Outlive Companies',
    category: 'Governance',
    status: 'draft',
    readingTime: '6 min',
    excerpt:
      'Companies chase cycles. Institutions build memory. A reflection on permanence.',
    body: [
      'A company is organised around an opportunity; an institution is organised around a duty. The distinction seems semantic until you observe what survives across generations.',
      'Institutions endure because they encode knowledge into rules, documents and practice that do not depend on the presence of any single person. Continuity is not an accident: it is a design choice.',
      'To build an institution is to accept that value is measured in decades, not quarters. It is a discipline before it is an ambition.',
    ],
  },
  {
    slug: 'the-cost-of-unwritten-decisions',
    title: 'The Cost of Unwritten Decisions',
    category: 'Ethics & Risk',
    status: 'draft',
    readingTime: '5 min',
    excerpt:
      'What is not written cannot be verified, learned from or defended. The price of the implicit.',
    body: [
      'An undocumented decision is a decision that was never truly made: it exists only in the fallible memory of those who were present.',
      'Documentation is not bureaucracy. It is the mechanism through which an institution learns from its mistakes and defends its integrity.',
      'The cost of the implicit is always paid later, and with interest.',
    ],
  },
  {
    slug: 'clarity-as-a-professional-duty',
    title: 'Clarity as a Professional Duty',
    category: 'Culture',
    status: 'draft',
    readingTime: '4 min',
    excerpt:
      'Clarity is not a style: it is an obligation to those who rely on our judgement.',
    body: [
      'When a person entrusts a professional with a matter of health, law or capital, they also entrust them with the responsibility of being understood.',
      'Unexplained complexity is a form of distance. Clarity, by contrast, is an act of respect.',
      'We consider clarity a professional duty, not a courtesy.',
    ],
  },
]

/** Helper: canonical WhatsApp deep link built from config. */
export const whatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  site.whatsappMessage,
)}`

/**
 * WhatsApp deep link used on the appointment confirmation page, with the
 * prefilled message a visitor sends to confirm availability after requesting
 * an appointment.
 */
export const bookingWhatsappMessage =
  'Hello, I have submitted an appointment request through the Bernocchi Health website and would like to confirm availability.'

export const bookingWhatsappUrl = `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(
  bookingWhatsappMessage,
)}`
