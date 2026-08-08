export type JournalReference = {
  citation: string
  href?: string
}

export type JournalSection = {
  heading: string
  paragraphs: string[]
}

export type ScientificArticle = {
  slug: string
  title: string
  subtitle: string
  category: string
  ordo: 'Ordo Scientia'
  publicationType: 'Revisión clínica narrativa'
  publishedAt: string
  updatedAt: string
  readingTime: string
  excerpt: string
  keywords: string[]
  sections: JournalSection[]
  references: JournalReference[]
  disclaimer: string
}

export const scientificArticles: ScientificArticle[] = [
  {
    slug: 'eyaculacion-precoz-evaluacion-tratamiento-evidencia-2026',
    title: 'Eyaculación precoz: evaluación clínica y estrategias terapéuticas basadas en evidencia',
    subtitle: 'Una revisión clínica narrativa sobre definición, fenotipos, evaluación multidimensional y tratamiento contemporáneo.',
    category: 'Medicina sexual',
    ordo: 'Ordo Scientia',
    publicationType: 'Revisión clínica narrativa',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingTime: '12 min',
    excerpt:
      'La eyaculación precoz no puede reducirse a un cronómetro. El diagnóstico contemporáneo integra latencia, control percibido, malestar, impacto relacional y contexto clínico.',
    keywords: ['eyaculación precoz', 'medicina sexual', 'IELT', 'control eyaculatorio', 'sexología clínica'],
    sections: [
      {
        heading: 'Resumen',
        paragraphs: [
          'La eyaculación precoz es una disfunción sexual masculina heterogénea cuyo abordaje clínico exige integrar el tiempo hasta la eyaculación con el control percibido, el malestar individual o de pareja y el contexto en el que ocurre. La evidencia reciente desaconseja convertir una cifra aislada de latencia en diagnóstico automático.',
          'Esta revisión sintetiza criterios clínicos, evaluación diferencial y estrategias terapéuticas contemporáneas. El objetivo no es prescribir un esquema único, sino ordenar la toma de decisiones mediante un modelo biopsicosocial y de pareja, con atención particular a la coexistencia de disfunción eréctil, ansiedad de desempeño, síntomas genitourinarios, factores relacionales y uso de medicamentos.',
        ],
      },
      {
        heading: '1. Un trastorno definido por más que la latencia',
        paragraphs: [
          'Los consensos modernos distinguen formas de inicio desde las primeras experiencias sexuales y formas adquiridas después de un período de funcionamiento satisfactorio. También existen presentaciones variables que no siempre reúnen criterios de trastorno. La historia longitudinal es, por tanto, tan importante como la descripción del episodio actual.',
          'La latencia eyaculatoria intravaginal puede aportar información cuando es pertinente, pero tiene limitaciones obvias: no representa todas las prácticas sexuales, puede variar entre encuentros y no cuantifica por sí sola control, sufrimiento ni consecuencias interpersonales. La evaluación clínica debe preguntar qué ocurre, desde cuándo, con qué consistencia, en qué contextos y qué significado tiene para la persona y la pareja.',
        ],
      },
      {
        heading: '2. Evaluación clínica multidimensional',
        paragraphs: [
          'La entrevista debe explorar inicio, curso, generalización o especificidad situacional, nivel de control percibido, grado de malestar, satisfacción sexual y dinámica de pareja. También deben revisarse erección, deseo, dolor, síntomas urinarios o prostáticos, consumo de sustancias y medicamentos, salud mental y enfermedades médicas relevantes.',
          'La coexistencia de disfunción eréctil merece especial atención. Algunos pacientes aceleran la actividad sexual por temor a perder la erección y describen el resultado como eyaculación precoz; en otros, ambas condiciones coexisten y se refuerzan. Tratar solo la latencia sin comprender esta relación puede producir resultados pobres.',
          'Los cuestionarios validados pueden estructurar la evaluación y facilitar seguimiento, pero no sustituyen la historia clínica. El valor de una escala radica en medir cambios dentro de un caso bien caracterizado, no en convertir un punto de corte aislado en diagnóstico.',
        ],
      },
      {
        heading: '3. Principios terapéuticos',
        paragraphs: [
          'El tratamiento debe partir de objetivos acordados. Para algunas personas, el objetivo principal es aumentar el control; para otras, reducir ansiedad, ampliar el repertorio sexual, mejorar comunicación o disminuir el impacto relacional. La respuesta clínica relevante no es únicamente aumentar minutos, sino mejorar la experiencia sexual global.',
          'Las intervenciones psicológicas y sexológicas pueden incluir educación sexual, reducción de ansiedad de desempeño, modificación de patrones atencionales, entrenamiento de habilidades, comunicación de pareja y técnicas conductuales. La evidencia disponible sugiere que los enfoques combinados pueden ser útiles cuando los factores farmacológicos, conductuales y relacionales coexisten.',
          'Entre las opciones médicas descritas en la literatura se encuentran tratamientos farmacológicos sistémicos y anestésicos tópicos. La selección depende del fenotipo, comorbilidades, preferencias, disponibilidad regulatoria y perfil de seguridad. La indicación, dosis, contraindicaciones e interacciones requieren evaluación individual por un profesional habilitado.',
        ],
      },
      {
        heading: '4. Tratamiento combinado y seguimiento',
        paragraphs: [
          'La evidencia de metaanálisis recientes respalda que, en determinados pacientes con eyaculación precoz de larga evolución, combinar tratamiento farmacológico con intervenciones no farmacológicas puede mejorar resultados respecto de una única modalidad. Esto no implica que toda persona necesite terapia combinada: el beneficio depende de la formulación clínica y de los objetivos del paciente.',
          'El seguimiento debe medir control, satisfacción, malestar, efectos adversos, adherencia y calidad relacional además de cualquier cambio en latencia. Un plan razonable incluye un punto de reevaluación explícito y criterios para mantener, modificar o retirar intervenciones.',
        ],
      },
      {
        heading: '5. Conclusión',
        paragraphs: [
          'La eyaculación precoz es mejor entendida como un problema de control, tiempo, malestar y contexto, no como un único número. La evaluación multidimensional permite diferenciar fenotipos, identificar comorbilidades y evitar tratamientos mecánicos.',
          'La medicina sexual contemporánea favorece decisiones compartidas, objetivos funcionales y combinación racional de intervenciones cuando está indicada. La calidad del resultado debe juzgarse por la mejoría sexual y relacional global, no exclusivamente por la prolongación de la latencia.',
        ],
      },
    ],
    references: [
      {
        citation: 'Premature ejaculation: A comprehensive urological review of current evidence-based management strategies. 2026.',
        href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Premature+ejaculation%3A+A+comprehensive+urological+review+of+current+evidence-based+management+strategies',
      },
      {
        citation: 'International Society for Sexual Medicine. Definition and clinical framework for premature ejaculation.',
        href: 'https://www.issm.info/sexual-health-qa/what-is-premature-ejaculation',
      },
      {
        citation: 'Dapoxetine combined with non-pharmacological interventions for lifelong premature ejaculation: systematic review and meta-analysis. Journal of Sexual Medicine. 2025.',
        href: 'https://pubmed.ncbi.nlm.nih.gov/?term=dapoxetine+non-pharmacological+interventions+lifelong+premature+ejaculation+2025',
      },
      {
        citation: 'Topical anesthetics for premature ejaculation: systematic review and meta-analysis of randomized controlled trials. 2023.',
        href: 'https://pubmed.ncbi.nlm.nih.gov/?term=topical+anesthetics+premature+ejaculation+meta-analysis+2023',
      },
    ],
    disclaimer:
      'Documento científico y educativo de Ordo Scientia. No constituye diagnóstico, prescripción ni recomendación individual. Las decisiones clínicas requieren evaluación profesional y normativa aplicable.',
  },
  {
    slug: 'anorgasmia-trastorno-orgasmico-marco-clinico-2026',
    title: 'Anorgasmia y trastornos del orgasmo: marco clínico contemporáneo para evaluación y tratamiento',
    subtitle: 'Revisión clínica narrativa de mecanismos, clasificación, diagnóstico diferencial y abordaje biopsicosocial.',
    category: 'Medicina sexual',
    ordo: 'Ordo Scientia',
    publicationType: 'Revisión clínica narrativa',
    publishedAt: '2026-08-08',
    updatedAt: '2026-08-08',
    readingTime: '13 min',
    excerpt:
      'La ausencia o marcada dificultad para alcanzar el orgasmo requiere una lectura que integre neurobiología, estimulación, medicamentos, salud general, aprendizaje sexual y contexto relacional.',
    keywords: ['anorgasmia', 'trastorno orgásmico', 'orgasmo', 'sexología clínica', 'salud sexual'],
    sections: [
      {
        heading: 'Resumen',
        paragraphs: [
          'Los trastornos del orgasmo comprenden presentaciones en las que existe ausencia, marcada demora, infrecuencia o reducción clínicamente relevante de la experiencia orgásmica, siempre interpretadas dentro de la historia sexual y del grado de malestar asociado. Una variación sexual sin sufrimiento no debe patologizarse automáticamente.',
          'La respuesta orgásmica emerge de la interacción entre estimulación periférica, procesamiento sensorial, excitación, atención, aprendizaje, factores neuroendocrinos, medicamentos, salud física, estado emocional y relación. Por ello, la anorgasmia rara vez se comprende adecuadamente desde una sola causa.',
        ],
      },
      {
        heading: '1. Clasificar antes de tratar',
        paragraphs: [
          'La primera distinción útil es temporal: una dificultad puede estar presente desde el inicio de la vida sexual o aparecer después de un período de respuesta orgásmica. La segunda es contextual: puede ser generalizada o aparecer solo con determinadas prácticas, parejas, formas de estimulación o circunstancias.',
          'También es importante diferenciar ausencia completa de orgasmo de orgasmo muy demorado, infrecuente, menos intenso o difícil de reconocer subjetivamente. Estas experiencias pueden compartir mecanismos, pero no son equivalentes y pueden requerir estrategias distintas.',
        ],
      },
      {
        heading: '2. El papel del malestar y de la diversidad sexual',
        paragraphs: [
          'Los consensos contemporáneos incorporan el malestar clínicamente significativo como elemento central para definir disfunción. Esto protege contra la medicalización de diferencias que no generan sufrimiento y obliga a comprender las expectativas de la persona antes de fijar objetivos terapéuticos.',
          'La evaluación debe evitar asumir que el coito penetrativo es la vía esperable o suficiente para el orgasmo. En especial en mujeres, la anatomía y fisiología del clítoris y la diversidad de patrones de estimulación son fundamentales para una educación sexual clínicamente correcta.',
        ],
      },
      {
        heading: '3. Factores médicos, farmacológicos y neurobiológicos',
        paragraphs: [
          'Las causas potenciales incluyen alteraciones neurológicas, endocrinas, vasculares, dolor, cirugía pélvica, enfermedades crónicas y cambios asociados a etapas vitales. La historia médica debe dirigirse por síntomas y no convertirse en una batería indiscriminada de pruebas.',
          'Los medicamentos son un componente imprescindible del diagnóstico diferencial. Diversos psicofármacos, particularmente aquellos con efectos serotoninérgicos, pueden retrasar o inhibir el orgasmo. La relación temporal entre inicio, cambio de dosis y aparición del síntoma aporta información clínica relevante. Cualquier modificación farmacológica debe realizarse con el prescriptor responsable.',
        ],
      },
      {
        heading: '4. Factores psicológicos, sexuales y relacionales',
        paragraphs: [
          'Ansiedad de desempeño, hipervigilancia, distracción, vergüenza, aprendizaje sexual restrictivo, experiencias adversas, depresión, estrés y conflictos relacionales pueden interferir con la transición desde excitación hacia orgasmo. La evaluación debe distinguir causalidad, asociación y consecuencia: el malestar por la propia anorgasmia también puede generar ansiedad secundaria.',
          'La información sobre masturbación es clínicamente útil. Si el orgasmo ocurre de manera consistente a solas pero no en pareja, el problema no debe etiquetarse de inmediato como incapacidad fisiológica; puede orientar hacia diferencias de estimulación, comunicación, atención, seguridad o contexto.',
        ],
      },
      {
        heading: '5. Intervención multimodal',
        paragraphs: [
          'El tratamiento debe corresponder a la formulación clínica. Puede incluir educación anatómica y sexual, exploración de estimulación eficaz, entrenamiento atencional, reducción de presión por desempeño, terapia sexual individual o de pareja y manejo de factores médicos o farmacológicos identificados.',
          'Cuando existe un medicamento sospechoso, las opciones clínicas pueden incluir esperar adaptación, ajustar tratamiento, cambiar agente o utilizar estrategias específicas, siempre bajo supervisión del profesional que conoce la indicación primaria. El objetivo es preservar simultáneamente salud general y función sexual.',
          'En problemas relacionales, la pareja puede integrarse cuando sea apropiado y consentido. El foco no debe ser convertir el orgasmo en examen de rendimiento, sino aumentar conocimiento corporal, agencia, comunicación, placer y flexibilidad sexual.',
        ],
      },
      {
        heading: '6. Conclusión',
        paragraphs: [
          'La anorgasmia no es una entidad única. Es un resultado clínico que puede emerger de múltiples rutas biológicas, farmacológicas, psicológicas y relacionales. La clasificación temporal y contextual, junto con la presencia de malestar, permite ordenar el diagnóstico diferencial.',
          'La mejor práctica evita tanto la normalización automática del sufrimiento como la patologización de la diversidad. El tratamiento debe individualizarse, atender mecanismos plausibles y valorar resultados en términos de bienestar, agencia y satisfacción sexual, no únicamente de presencia o ausencia de orgasmo.',
        ],
      },
    ],
    references: [
      {
        citation: 'Definitions, classification, and epidemiology of sexual dysfunction: a consensus statement from the Fifth International Consultation on Sexual Medicine 2024. Sexual Medicine Reviews. 2026.',
        href: 'https://academic.oup.com/smr/search-results?q=Definitions%2C+classification%2C+and+epidemiology+of+sexual+dysfunction',
      },
      {
        citation: 'Female Orgasmic Disorder: Current Understanding and Clinical Management. Obstetrics & Gynecology. 2026.',
        href: 'https://pubmed.ncbi.nlm.nih.gov/?term=Female+Orgasmic+Disorder%3A+Current+Understanding+and+Clinical+Management',
      },
      {
        citation: 'International Consultation on Sexual Medicine: contemporary classification of orgasmic disorders and sexual dysfunction. 2026.',
        href: 'https://academic.oup.com/smr',
      },
    ],
    disclaimer:
      'Documento científico y educativo de Ordo Scientia. No sustituye una evaluación médica, psicológica o sexológica individual. El diagnóstico y tratamiento deben adaptarse a la persona y a la normativa profesional aplicable.',
  },
]

export function getScientificArticle(slug: string) {
  return scientificArticles.find((article) => article.slug === slug)
}
