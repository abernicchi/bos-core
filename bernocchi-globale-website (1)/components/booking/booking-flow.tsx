'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  Loader2,
  LockKeyhole,
  Mail,
  MapPin,
  Search,
  ShieldCheck,
  UserRound,
  Video,
} from 'lucide-react'
import { bookingTimeSlots, consultationTypes } from '@/lib/content'
import { casaLocales, type LocaleCode } from '@/lib/i18n'
import { useCasaLocale } from '@/components/use-casa-locale'
import { cn } from '@/lib/utils'
import { trackEvent } from '@/lib/analytics-events'

type CountryOption = { iso: string; name: string; dial: string }
type Booking = {
  consultationId: string
  mode: 'online' | 'in-person' | ''
  firstName: string
  lastName: string
  email: string
  whatsapp: string
  phoneCountryIso: string
  country: string
  language: LocaleCode
  date: string
  time: string
  consent: boolean
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { iso: 'CR', name: 'Costa Rica', dial: '506' },
  { iso: 'IT', name: 'Italia', dial: '39' },
  { iso: 'ES', name: 'España', dial: '34' },
  { iso: 'AD', name: 'Andorra', dial: '376' },
  { iso: 'CH', name: 'Suiza', dial: '41' },
  { iso: 'FR', name: 'Francia', dial: '33' },
  { iso: 'DE', name: 'Alemania', dial: '49' },
  { iso: 'PL', name: 'Polonia', dial: '48' },
  { iso: 'RU', name: 'Rusia', dial: '7' },
  { iso: 'US', name: 'Estados Unidos', dial: '1' },
  { iso: 'HK', name: 'Hong Kong', dial: '852' },
  { iso: 'CN', name: 'China', dial: '86' },
  { iso: 'JP', name: 'Japón', dial: '81' },
  { iso: 'MX', name: 'México', dial: '52' },
  { iso: 'PA', name: 'Panamá', dial: '507' },
  { iso: 'CO', name: 'Colombia', dial: '57' },
  { iso: 'AR', name: 'Argentina', dial: '54' },
  { iso: 'CL', name: 'Chile', dial: '56' },
  { iso: 'PE', name: 'Perú', dial: '51' },
  { iso: 'BR', name: 'Brasil', dial: '55' },
  { iso: 'GB', name: 'Reino Unido', dial: '44' },
  { iso: 'PT', name: 'Portugal', dial: '351' },
  { iso: 'NL', name: 'Países Bajos', dial: '31' },
  { iso: 'BE', name: 'Bélgica', dial: '32' },
  { iso: 'AT', name: 'Austria', dial: '43' },
  { iso: 'IE', name: 'Irlanda', dial: '353' },
  { iso: 'CA', name: 'Canadá', dial: '1' },
  { iso: 'AU', name: 'Australia', dial: '61' },
  { iso: 'SG', name: 'Singapur', dial: '65' },
]

const serviceNames: Record<LocaleCode, Record<string, string>> = {
  es: { 'clinical-sexology': 'Sexología clínica', 'couples-therapy': 'Terapia de pareja', 'mens-sexual-health': 'Salud sexual masculina', 'womens-sexual-health': 'Salud sexual femenina', 'online-consultation': 'Consulta internacional en línea', 'executive-consultation': 'Consulta ejecutiva' },
  en: { 'clinical-sexology': 'Clinical Sexology', 'couples-therapy': 'Couples Therapy', 'mens-sexual-health': "Men's Sexual Health", 'womens-sexual-health': "Women's Sexual Health", 'online-consultation': 'International Online Consultation', 'executive-consultation': 'Executive Consultation' },
  it: { 'clinical-sexology': 'Sessuologia clinica', 'couples-therapy': 'Terapia di coppia', 'mens-sexual-health': 'Salute sessuale maschile', 'womens-sexual-health': 'Salute sessuale femminile', 'online-consultation': 'Consulenza internazionale online', 'executive-consultation': 'Consulenza executive' },
  fr: { 'clinical-sexology': 'Sexologie clinique', 'couples-therapy': 'Thérapie de couple', 'mens-sexual-health': 'Santé sexuelle masculine', 'womens-sexual-health': 'Santé sexuelle féminine', 'online-consultation': 'Consultation internationale en ligne', 'executive-consultation': 'Consultation exécutive' },
  de: { 'clinical-sexology': 'Klinische Sexologie', 'couples-therapy': 'Paartherapie', 'mens-sexual-health': 'Sexualgesundheit für Männer', 'womens-sexual-health': 'Sexualgesundheit für Frauen', 'online-consultation': 'Internationale Online-Beratung', 'executive-consultation': 'Executive-Beratung' },
  ca: { 'clinical-sexology': 'Sexologia clínica', 'couples-therapy': 'Teràpia de parella', 'mens-sexual-health': 'Salut sexual masculina', 'womens-sexual-health': 'Salut sexual femenina', 'online-consultation': 'Consulta internacional en línia', 'executive-consultation': 'Consulta executiva' },
  zh: { 'clinical-sexology': '临床性学', 'couples-therapy': '伴侣治疗', 'mens-sexual-health': '男性性健康', 'womens-sexual-health': '女性性健康', 'online-consultation': '国际在线咨询', 'executive-consultation': '高管咨询' },
  pl: { 'clinical-sexology': 'Seksuologia kliniczna', 'couples-therapy': 'Terapia par', 'mens-sexual-health': 'Zdrowie seksualne mężczyzn', 'womens-sexual-health': 'Zdrowie seksualne kobiet', 'online-consultation': 'Międzynarodowa konsultacja online', 'executive-consultation': 'Konsultacja executive' },
  ru: { 'clinical-sexology': 'Клиническая сексология', 'couples-therapy': 'Терапия пар', 'mens-sexual-health': 'Мужское сексуальное здоровье', 'womens-sexual-health': 'Женское сексуальное здоровье', 'online-consultation': 'Международная онлайн-консультация', 'executive-consultation': 'Консультация для руководителей' },
  ja: { 'clinical-sexology': '臨床セクソロジー', 'couples-therapy': 'カップルセラピー', 'mens-sexual-health': '男性の性の健康', 'womens-sexual-health': '女性の性の健康', 'online-consultation': '国際オンライン相談', 'executive-consultation': 'エグゼクティブ相談' },
}

const copy: Record<LocaleCode, {
  steps: string[]
  title: string
  intro: string
  chooseService: string
  chooseMode: string
  online: string
  onlineBody: string
  inPerson: string
  inPersonBody: string
  details: string
  firstName: string
  lastName: string
  email: string
  country: string
  searchCountry: string
  whatsapp: string
  language: string
  date: string
  time: string
  consent: string
  review: string
  service: string
  mode: string
  contact: string
  schedule: string
  payment: string
  paymentPending: string
  paymentBody: string
  submit: string
  submitting: string
  back: string
  continue: string
  error: string
  validation: string
  provisional: string
  privacy: string
}> = {
  es: { steps: ['Servicio', 'Modalidad', 'Datos', 'Confirmación'], title: 'Reserva institucional', intro: 'Seleccione una opción y el proceso avanzará automáticamente.', chooseService: 'Seleccione el tipo de servicio', chooseMode: 'Seleccione la modalidad', online: 'En línea', onlineBody: 'Videoconsulta segura, sujeta a elegibilidad profesional y jurisdiccional.', inPerson: 'Presencial', inPersonBody: 'Atención presencial en la operación regional disponible.', details: 'Datos y disponibilidad', firstName: 'Nombre', lastName: 'Apellidos', email: 'Correo electrónico', country: 'País y prefijo', searchCountry: 'Buscar país', whatsapp: 'WhatsApp', language: 'Idioma preferido', date: 'Fecha solicitada', time: 'Hora solicitada', consent: 'Autorizo el contacto para gestionar esta solicitud y acepto el aviso de privacidad.', review: 'Revise su solicitud', service: 'Servicio', mode: 'Modalidad', contact: 'Contacto', schedule: 'Disponibilidad', payment: 'Método de pago', paymentPending: 'Pendiente de asignación', paymentBody: 'No se realiza un cobro en este paso. La Segreteria Generale confirmará el método aplicable y las condiciones de reserva.', submit: 'Enviar solicitud', submitting: 'Registrando reserva', back: 'Atrás', continue: 'Continuar', error: 'No fue posible registrar la solicitud. Inténtelo de nuevo o contacte la Segreteria.', validation: 'Complete correctamente todos los campos obligatorios.', provisional: 'La selección constituye una reserva provisional, no una confirmación definitiva.', privacy: 'No introduzca información clínica o sensible en este formulario.' },
  en: { steps: ['Service', 'Mode', 'Details', 'Confirmation'], title: 'Institutional reservation', intro: 'Select an option and the journey will advance automatically.', chooseService: 'Choose the service type', chooseMode: 'Choose the consultation mode', online: 'Online', onlineBody: 'Secure video consultation, subject to professional and jurisdictional eligibility.', inPerson: 'In person', inPersonBody: 'In-person care at the available regional operation.', details: 'Details and availability', firstName: 'First name', lastName: 'Last name', email: 'Email address', country: 'Country and code', searchCountry: 'Search country', whatsapp: 'WhatsApp', language: 'Preferred language', date: 'Requested date', time: 'Requested time', consent: 'I authorise contact to manage this request and accept the privacy notice.', review: 'Review your request', service: 'Service', mode: 'Mode', contact: 'Contact', schedule: 'Availability', payment: 'Payment method', paymentPending: 'Pending assignment', paymentBody: 'No charge is made at this step. The Segreteria Generale will confirm the applicable method and reservation conditions.', submit: 'Submit request', submitting: 'Registering reservation', back: 'Back', continue: 'Continue', error: 'We could not register the request. Please try again or contact the Segreteria.', validation: 'Please complete all required fields correctly.', provisional: 'Your selection is a provisional reservation, not a final confirmation.', privacy: 'Do not enter clinical or sensitive information in this form.' },
  it: { steps: ['Servizio', 'Modalità', 'Dati', 'Conferma'], title: 'Prenotazione istituzionale', intro: 'Selezioni un’opzione e il percorso avanzerà automaticamente.', chooseService: 'Selezioni il tipo di servizio', chooseMode: 'Selezioni la modalità', online: 'Online', onlineBody: 'Videoconsulenza sicura, soggetta a idoneità professionale e giurisdizionale.', inPerson: 'In presenza', inPersonBody: 'Assistenza in presenza presso l’operatività regionale disponibile.', details: 'Dati e disponibilità', firstName: 'Nome', lastName: 'Cognome', email: 'Email', country: 'Paese e prefisso', searchCountry: 'Cerca Paese', whatsapp: 'WhatsApp', language: 'Lingua preferita', date: 'Data richiesta', time: 'Orario richiesto', consent: 'Autorizzo il contatto per gestire la richiesta e accetto l’informativa privacy.', review: 'Verifichi la richiesta', service: 'Servizio', mode: 'Modalità', contact: 'Contatto', schedule: 'Disponibilità', payment: 'Metodo di pagamento', paymentPending: 'In attesa di assegnazione', paymentBody: 'In questa fase non viene effettuato alcun addebito. La Segreteria Generale confermerà il metodo applicabile e le condizioni di prenotazione.', submit: 'Inviare la richiesta', submitting: 'Registrazione in corso', back: 'Indietro', continue: 'Continua', error: 'Non è stato possibile registrare la richiesta. Riprovi o contatti la Segreteria.', validation: 'Completi correttamente tutti i campi obbligatori.', provisional: 'La selezione costituisce una prenotazione provvisoria, non una conferma definitiva.', privacy: 'Non inserisca informazioni cliniche o sensibili nel modulo.' },
  fr: { steps: ['Service', 'Modalité', 'Données', 'Confirmation'], title: 'Réservation institutionnelle', intro: 'Sélectionnez une option et le parcours avancera automatiquement.', chooseService: 'Choisissez le type de service', chooseMode: 'Choisissez la modalité', online: 'En ligne', onlineBody: 'Consultation vidéo sécurisée, sous réserve d’éligibilité professionnelle et juridictionnelle.', inPerson: 'En présentiel', inPersonBody: 'Prise en charge en présentiel dans l’activité régionale disponible.', details: 'Données et disponibilité', firstName: 'Prénom', lastName: 'Nom', email: 'Adresse e-mail', country: 'Pays et indicatif', searchCountry: 'Rechercher un pays', whatsapp: 'WhatsApp', language: 'Langue préférée', date: 'Date demandée', time: 'Heure demandée', consent: 'J’autorise le contact pour gérer cette demande et j’accepte l’avis de confidentialité.', review: 'Vérifiez votre demande', service: 'Service', mode: 'Modalité', contact: 'Contact', schedule: 'Disponibilité', payment: 'Mode de paiement', paymentPending: 'Attribution en attente', paymentBody: 'Aucun débit n’est effectué à cette étape. La Segreteria Generale confirmera le mode applicable et les conditions de réservation.', submit: 'Envoyer la demande', submitting: 'Enregistrement de la réservation', back: 'Retour', continue: 'Continuer', error: 'La demande n’a pas pu être enregistrée. Réessayez ou contactez la Segreteria.', validation: 'Veuillez remplir correctement tous les champs obligatoires.', provisional: 'La sélection constitue une réservation provisoire, et non une confirmation définitive.', privacy: 'N’indiquez aucune information clinique ou sensible dans ce formulaire.' },
  de: { steps: ['Leistung', 'Format', 'Daten', 'Bestätigung'], title: 'Institutionelle Reservierung', intro: 'Wählen Sie eine Option; der Ablauf geht automatisch weiter.', chooseService: 'Leistung auswählen', chooseMode: 'Beratungsformat auswählen', online: 'Online', onlineBody: 'Sichere Videoberatung, vorbehaltlich professioneller und rechtlicher Zulässigkeit.', inPerson: 'Persönlich', inPersonBody: 'Persönliche Betreuung am verfügbaren regionalen Standort.', details: 'Daten und Verfügbarkeit', firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail-Adresse', country: 'Land und Vorwahl', searchCountry: 'Land suchen', whatsapp: 'WhatsApp', language: 'Bevorzugte Sprache', date: 'Gewünschtes Datum', time: 'Gewünschte Uhrzeit', consent: 'Ich erlaube die Kontaktaufnahme zur Bearbeitung dieser Anfrage und akzeptiere den Datenschutzhinweis.', review: 'Anfrage prüfen', service: 'Leistung', mode: 'Format', contact: 'Kontakt', schedule: 'Verfügbarkeit', payment: 'Zahlungsmethode', paymentPending: 'Zuweisung ausstehend', paymentBody: 'In diesem Schritt erfolgt keine Belastung. Die Segreteria Generale bestätigt die anwendbare Methode und die Reservierungsbedingungen.', submit: 'Anfrage senden', submitting: 'Reservierung wird registriert', back: 'Zurück', continue: 'Weiter', error: 'Die Anfrage konnte nicht registriert werden. Versuchen Sie es erneut oder kontaktieren Sie die Segreteria.', validation: 'Bitte füllen Sie alle Pflichtfelder korrekt aus.', provisional: 'Die Auswahl ist eine vorläufige Reservierung, keine endgültige Bestätigung.', privacy: 'Geben Sie keine klinischen oder sensiblen Informationen ein.' },
  ca: { steps: ['Servei', 'Modalitat', 'Dades', 'Confirmació'], title: 'Reserva institucional', intro: 'Seleccioneu una opció i el procés avançarà automàticament.', chooseService: 'Seleccioneu el tipus de servei', chooseMode: 'Seleccioneu la modalitat', online: 'En línia', onlineBody: 'Videoconsulta segura, subjecta a elegibilitat professional i jurisdiccional.', inPerson: 'Presencial', inPersonBody: 'Atenció presencial a l’operació regional disponible.', details: 'Dades i disponibilitat', firstName: 'Nom', lastName: 'Cognoms', email: 'Correu electrònic', country: 'País i prefix', searchCountry: 'Cerca país', whatsapp: 'WhatsApp', language: 'Idioma preferit', date: 'Data sol·licitada', time: 'Hora sol·licitada', consent: 'Autoritzo el contacte per gestionar la sol·licitud i accepto l’avís de privacitat.', review: 'Reviseu la sol·licitud', service: 'Servei', mode: 'Modalitat', contact: 'Contacte', schedule: 'Disponibilitat', payment: 'Mètode de pagament', paymentPending: 'Pendent d’assignació', paymentBody: 'No es realitza cap cobrament en aquest pas. La Segreteria Generale confirmarà el mètode aplicable i les condicions de reserva.', submit: 'Enviar sol·licitud', submitting: 'Registrant la reserva', back: 'Enrere', continue: 'Continuar', error: 'No s’ha pogut registrar la sol·licitud. Torneu-ho a provar o contacteu amb la Segreteria.', validation: 'Completeu correctament tots els camps obligatoris.', provisional: 'La selecció és una reserva provisional, no una confirmació definitiva.', privacy: 'No introduïu informació clínica o sensible.' },
  zh: { steps: ['服务', '方式', '资料', '确认'], title: '机构预约', intro: '选择后，流程将自动进入下一步。', chooseService: '选择服务类型', chooseMode: '选择咨询方式', online: '在线', onlineBody: '安全视频咨询，须符合专业与司法辖区要求。', inPerson: '面谈', inPersonBody: '在可用的区域运营地点提供面谈服务。', details: '资料与可用时间', firstName: '名字', lastName: '姓氏', email: '电子邮箱', country: '国家与区号', searchCountry: '搜索国家', whatsapp: 'WhatsApp', language: '首选语言', date: '申请日期', time: '申请时间', consent: '我同意为处理本申请而联系我，并接受隐私声明。', review: '核对申请', service: '服务', mode: '方式', contact: '联系方式', schedule: '时间', payment: '付款方式', paymentPending: '待分配', paymentBody: '此步骤不会收费。Segreteria Generale 将确认适用的付款方式与预约条件。', submit: '提交申请', submitting: '正在登记预约', back: '返回', continue: '继续', error: '无法登记申请。请重试或联系 Segreteria。', validation: '请正确填写所有必填字段。', provisional: '当前选择仅为临时预留，并非最终确认。', privacy: '请勿在表单中输入临床或敏感信息。' },
  pl: { steps: ['Usługa', 'Forma', 'Dane', 'Potwierdzenie'], title: 'Rezerwacja instytucjonalna', intro: 'Wybierz opcję, a proces przejdzie automatycznie dalej.', chooseService: 'Wybierz rodzaj usługi', chooseMode: 'Wybierz formę konsultacji', online: 'Online', onlineBody: 'Bezpieczna konsultacja wideo, zależna od wymogów zawodowych i jurysdykcyjnych.', inPerson: 'Stacjonarnie', inPersonBody: 'Opieka stacjonarna w dostępnej działalności regionalnej.', details: 'Dane i dostępność', firstName: 'Imię', lastName: 'Nazwisko', email: 'Adres e-mail', country: 'Kraj i kierunkowy', searchCountry: 'Szukaj kraju', whatsapp: 'WhatsApp', language: 'Preferowany język', date: 'Wybrana data', time: 'Wybrana godzina', consent: 'Wyrażam zgodę na kontakt w celu obsługi zgłoszenia i akceptuję informację o prywatności.', review: 'Sprawdź zgłoszenie', service: 'Usługa', mode: 'Forma', contact: 'Kontakt', schedule: 'Dostępność', payment: 'Metoda płatności', paymentPending: 'Oczekuje na przypisanie', paymentBody: 'Na tym etapie nie jest pobierana opłata. Segreteria Generale potwierdzi metodę i warunki rezerwacji.', submit: 'Wyślij zgłoszenie', submitting: 'Rejestrowanie rezerwacji', back: 'Wstecz', continue: 'Dalej', error: 'Nie udało się zarejestrować zgłoszenia. Spróbuj ponownie lub skontaktuj się z Segreteria.', validation: 'Wypełnij poprawnie wszystkie wymagane pola.', provisional: 'Wybór stanowi rezerwację wstępną, a nie ostateczne potwierdzenie.', privacy: 'Nie wpisuj danych klinicznych ani wrażliwych.' },
  ru: { steps: ['Услуга', 'Формат', 'Данные', 'Подтверждение'], title: 'Институциональная запись', intro: 'Выберите вариант — процесс автоматически перейдёт далее.', chooseService: 'Выберите вид услуги', chooseMode: 'Выберите формат', online: 'Онлайн', onlineBody: 'Безопасная видеоконсультация с учётом профессиональных и юрисдикционных требований.', inPerson: 'Очно', inPersonBody: 'Очная помощь в доступной региональной операции.', details: 'Данные и доступность', firstName: 'Имя', lastName: 'Фамилия', email: 'Электронная почта', country: 'Страна и код', searchCountry: 'Найти страну', whatsapp: 'WhatsApp', language: 'Предпочитаемый язык', date: 'Желаемая дата', time: 'Желаемое время', consent: 'Я разрешаю связаться со мной для обработки запроса и принимаю уведомление о конфиденциальности.', review: 'Проверьте запрос', service: 'Услуга', mode: 'Формат', contact: 'Контакт', schedule: 'Доступность', payment: 'Способ оплаты', paymentPending: 'Ожидает назначения', paymentBody: 'На этом этапе списание не производится. Segreteria Generale подтвердит применимый способ и условия резервации.', submit: 'Отправить запрос', submitting: 'Регистрация резервации', back: 'Назад', continue: 'Продолжить', error: 'Не удалось зарегистрировать запрос. Повторите попытку или свяжитесь с Segreteria.', validation: 'Корректно заполните все обязательные поля.', provisional: 'Выбор является предварительной резервацией, а не окончательным подтверждением.', privacy: 'Не указывайте клиническую или чувствительную информацию.' },
  ja: { steps: ['サービス', '方式', '情報', '確認'], title: '機関予約', intro: '選択すると、自動的に次のステップへ進みます。', chooseService: 'サービスを選択', chooseMode: '相談方式を選択', online: 'オンライン', onlineBody: '専門要件および管轄要件に従う安全なビデオ相談。', inPerson: '対面', inPersonBody: '利用可能な地域運営拠点での対面相談。', details: '情報と空き時間', firstName: '名', lastName: '姓', email: 'メールアドレス', country: '国と国番号', searchCountry: '国を検索', whatsapp: 'WhatsApp', language: '希望言語', date: '希望日', time: '希望時間', consent: '本申請の管理に必要な連絡を許可し、プライバシー通知に同意します。', review: '申請内容を確認', service: 'サービス', mode: '方式', contact: '連絡先', schedule: '日時', payment: '支払方法', paymentPending: '割り当て待ち', paymentBody: 'この段階では請求されません。Segreteria Generale が適用される方法と予約条件を確認します。', submit: '申請を送信', submitting: '予約を登録中', back: '戻る', continue: '続ける', error: '申請を登録できませんでした。再試行するか Segreteria にご連絡ください。', validation: '必須項目を正しく入力してください。', provisional: 'この選択は仮予約であり、最終確定ではありません。', privacy: '臨床情報や機微情報を入力しないでください。' },
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const fieldClass = 'w-full rounded-xl border border-white/12 bg-white/[0.045] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-white/28 focus:border-[#c9a85f]/70 focus:bg-white/[0.07] focus:ring-2 focus:ring-[#c9a85f]/12'
const labelClass = 'mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white/48'

function todayISO() {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60_000).toISOString().split('T')[0]
}

function flagEmoji(iso: string) {
  return iso.toUpperCase().replace(/[A-Z]/g, (letter) => String.fromCodePoint(127397 + letter.charCodeAt(0)))
}

function digits(value: string, max = 15) {
  return value.replace(/\D/g, '').slice(0, max)
}

export function BookingFlow({ initialConsultationId }: { initialConsultationId?: string }) {
  const router = useRouter()
  const { locale } = useCasaLocale()
  const t = copy[locale]
  const countryMenuRef = useRef<HTMLDivElement>(null)
  const [step, setStep] = useState(initialConsultationId ? 1 : 0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')
  const [booking, setBooking] = useState<Booking>({
    consultationId: initialConsultationId ?? '', mode: '', firstName: '', lastName: '', email: '', whatsapp: '', phoneCountryIso: 'CR', country: 'Costa Rica', language: locale, date: '', time: '', consent: false,
  })

  useEffect(() => {
    function close(event: PointerEvent) {
      if (!countryMenuRef.current?.contains(event.target as Node)) setCountryOpen(false)
    }
    function escape(event: KeyboardEvent) { if (event.key === 'Escape') setCountryOpen(false) }
    document.addEventListener('pointerdown', close)
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', escape) }
  }, [])

  const consultation = consultationTypes.find((item) => item.id === booking.consultationId)
  const selectedCountry = COUNTRY_OPTIONS.find((item) => item.iso === booking.phoneCountryIso) ?? COUNTRY_OPTIONS[0]
  const filteredCountries = useMemo(() => {
    const q = countrySearch.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    return COUNTRY_OPTIONS.filter((item) => `${item.name} ${item.iso} ${item.dial}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q))
  }, [countrySearch])
  const internationalWhatsApp = `+${selectedCountry.dial}${digits(booking.whatsapp)}`
  const detailsValid = booking.firstName.trim().length > 1 && booking.lastName.trim().length > 1 && EMAIL_RE.test(booking.email.trim()) && digits(booking.whatsapp).length >= 6 && booking.date >= todayISO() && Boolean(booking.time) && booking.consent

  function chooseService(id: string) {
    if (!booking.consultationId) trackEvent('booking_start', { serviceCode: id, ordoCode: 'ordo_medicinae' })
    setBooking((current) => ({ ...current, consultationId: id }))
    setError(null)
    window.setTimeout(() => setStep(1), 170)
  }

  function chooseMode(mode: 'online' | 'in-person') {
    setBooking((current) => ({ ...current, mode }))
    setError(null)
    window.setTimeout(() => setStep(2), 170)
  }

  async function submit() {
    if (!consultation || !booking.mode || !detailsValid) {
      setError(t.validation)
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/appointment', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultationId: booking.consultationId,
          consultation: serviceNames[locale][booking.consultationId] ?? consultation.name,
          mode: booking.mode,
          fullName: `${booking.firstName.trim()} ${booking.lastName.trim()}`,
          email: booking.email.trim(), whatsapp: internationalWhatsApp,
          country: booking.country, language: booking.language, date: booking.date,
          time: booking.time, paymentMethod: 'pending', consent: booking.consent,
          company: '', website: '',
        }),
      })
      const result = await response.json().catch(() => ({})) as {
        referenceCode?: string
        paymentToken?: string
        error?: string
      }
      if (!response.ok) throw new Error(result.error || 'Request failed')
      trackEvent('booking_submit', {
        serviceCode: booking.consultationId,
        ordoCode: 'ordo_medicinae',
      })
      const confirmationParams = new URLSearchParams()
      if (result.referenceCode) confirmationParams.set('ref', result.referenceCode)
      if (result.paymentToken) confirmationParams.set('pay', result.paymentToken)
      const query = confirmationParams.size ? `?${confirmationParams.toString()}` : ''
      router.push(`/health/confirmation${query}`)
    } catch (submissionError) {
      console.error('[Casa Bernocchi] Booking submission error:', submissionError)
      setError(t.error)
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-white/12 bg-[#07131f] shadow-[0_30px_100px_rgba(0,0,0,.35)]">
      <div className="border-b border-white/10 bg-[linear-gradient(120deg,rgba(185,151,82,.14),transparent_55%)] px-5 py-6 sm:px-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-[0.64rem] font-semibold uppercase tracking-[0.24em] text-[#d3b56f]">Bernocchi Health</p><h3 className="mt-2 font-serif text-3xl text-white">{t.title}</h3><p className="mt-2 text-sm text-white/48">{t.intro}</p></div>
          <div className="flex items-center gap-1.5">
            {t.steps.map((label, index) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={cn('flex size-8 items-center justify-center rounded-full border text-xs font-semibold transition', index < step ? 'border-[#c9a85f] bg-[#c9a85f] text-[#07131f]' : index === step ? 'border-[#c9a85f] bg-[#c9a85f]/12 text-[#e2c77f]' : 'border-white/15 text-white/30')}>{index < step ? <Check className="size-4" /> : index + 1}</div>
                {index < t.steps.length - 1 ? <span className={cn('h-px w-4 sm:w-7', index < step ? 'bg-[#c9a85f]' : 'bg-white/12')} /> : null}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="min-h-[34rem] p-5 sm:p-8 lg:p-10">
        {step === 0 ? (
          <fieldset><legend className="font-serif text-2xl text-white">{t.chooseService}</legend><div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {consultationTypes.map((item) => {
              const selected = booking.consultationId === item.id
              return <button key={item.id} type="button" onClick={() => chooseService(item.id)} className={cn('group relative min-h-40 rounded-2xl border p-5 text-left transition duration-300 hover:-translate-y-1', selected ? 'border-[#c9a85f] bg-[#c9a85f]/12' : 'border-white/10 bg-white/[0.035] hover:border-[#c9a85f]/45 hover:bg-white/[0.06]')}>
                <div className="flex items-center justify-between gap-3"><span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#c9a85f]">{item.duration}</span><span className="text-xs font-medium text-white/58">{new Intl.NumberFormat(locale, { style: 'currency', currency: item.currency.toUpperCase() }).format(item.priceInCents / 100)}</span></div><h4 className="mt-5 font-serif text-xl text-white">{serviceNames[locale][item.id] ?? item.name}</h4><ArrowRight className="absolute bottom-5 right-5 size-4 text-white/28 transition group-hover:translate-x-1 group-hover:text-[#c9a85f]" />
              </button>
            })}
          </div></fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset><legend className="font-serif text-2xl text-white">{t.chooseMode}</legend><div className="mt-7 grid gap-4 sm:grid-cols-2">
            {[
              { value: 'online' as const, title: t.online, body: t.onlineBody, icon: Video },
              { value: 'in-person' as const, title: t.inPerson, body: t.inPersonBody, icon: MapPin },
            ].map((item) => { const Icon = item.icon; const selected = booking.mode === item.value; return <button key={item.value} type="button" onClick={() => chooseMode(item.value)} className={cn('group min-h-64 rounded-3xl border p-7 text-left transition duration-300 hover:-translate-y-1', selected ? 'border-[#c9a85f] bg-[#c9a85f]/12' : 'border-white/10 bg-white/[0.035] hover:border-[#c9a85f]/45 hover:bg-white/[0.06]')}>
              <div className="flex size-12 items-center justify-center rounded-2xl border border-[#c9a85f]/30 bg-[#c9a85f]/8 text-[#d4b875]"><Icon className="size-5" /></div><h4 className="mt-10 font-serif text-3xl text-white">{item.title}</h4><p className="mt-4 max-w-sm text-sm leading-7 text-white/48">{item.body}</p>
            </button> })}
          </div></fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset><legend className="font-serif text-2xl text-white">{t.details}</legend><div className="mt-7 grid gap-5 sm:grid-cols-2">
            <div><label htmlFor="cb-first-name" className={labelClass}>{t.firstName}</label><input id="cb-first-name" autoComplete="given-name" value={booking.firstName} onChange={(e) => setBooking((c) => ({ ...c, firstName: e.target.value }))} className={fieldClass} /></div>
            <div><label htmlFor="cb-last-name" className={labelClass}>{t.lastName}</label><input id="cb-last-name" autoComplete="family-name" value={booking.lastName} onChange={(e) => setBooking((c) => ({ ...c, lastName: e.target.value }))} className={fieldClass} /></div>
            <div className="sm:col-span-2"><label htmlFor="cb-email" className={labelClass}>{t.email}</label><div className="relative"><Mail className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" /><input id="cb-email" type="email" autoComplete="email" value={booking.email} onChange={(e) => setBooking((c) => ({ ...c, email: e.target.value }))} className={cn(fieldClass, 'pl-11')} placeholder="name@example.com" /></div></div>
            <div ref={countryMenuRef} className="relative"><span className={labelClass}>{t.country}</span><button type="button" onClick={() => setCountryOpen((value) => !value)} className={cn(fieldClass, 'flex items-center justify-between text-left')}><span className="flex items-center gap-2"><span>{flagEmoji(selectedCountry.iso)}</span><span>{selectedCountry.name}</span></span><span className="flex items-center gap-2 text-white/45">+{selectedCountry.dial}<ChevronDown className="size-4" /></span></button>
              {countryOpen ? <div className="absolute z-50 mt-2 w-full min-w-[19rem] overflow-hidden rounded-2xl border border-[#c9a85f]/35 bg-[#091724] shadow-2xl"><div className="border-b border-white/10 p-3"><div className="flex items-center gap-2 rounded-xl border border-white/12 bg-white/[0.04] px-3"><Search className="size-4 text-[#c9a85f]" /><input autoFocus value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} placeholder={t.searchCountry} className="w-full bg-transparent py-3 text-sm text-white outline-none placeholder:text-white/30" /></div></div><ul className="max-h-64 overflow-y-auto p-1">{filteredCountries.map((item) => <li key={item.iso}><button type="button" onClick={() => { setBooking((c) => ({ ...c, phoneCountryIso: item.iso, country: item.name })); setCountryOpen(false); setCountrySearch('') }} className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-sm text-white/72 hover:bg-white/6 hover:text-white"><span>{flagEmoji(item.iso)} <span className="ml-2">{item.name}</span></span><span className="text-white/42">+{item.dial}</span></button></li>)}</ul></div> : null}
            </div>
            <div><label htmlFor="cb-whatsapp" className={labelClass}>{t.whatsapp}</label><div className="flex"><span className="flex items-center rounded-l-xl border border-r-0 border-white/12 bg-white/[0.06] px-4 text-sm text-white/50">+{selectedCountry.dial}</span><input id="cb-whatsapp" inputMode="tel" autoComplete="tel-national" value={booking.whatsapp} onChange={(e) => setBooking((c) => ({ ...c, whatsapp: digits(e.target.value) }))} className={cn(fieldClass, 'rounded-l-none')} /></div></div>
            <div><label htmlFor="cb-language" className={labelClass}>{t.language}</label><select id="cb-language" value={booking.language} onChange={(e) => setBooking((c) => ({ ...c, language: e.target.value as LocaleCode }))} className={fieldClass}>{casaLocales.map((item) => <option key={item.value} value={item.value} className="bg-[#091724]">{item.flag} {item.nativeLabel}</option>)}</select></div>
            <div><label htmlFor="cb-date" className={labelClass}>{t.date}</label><div className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/28" /><input id="cb-date" type="date" min={todayISO()} value={booking.date} onChange={(e) => setBooking((c) => ({ ...c, date: e.target.value }))} className={cn(fieldClass, 'pl-11 [color-scheme:dark]')} /></div></div>
            <div className="sm:col-span-2"><span className={labelClass}>{t.time}</span><div className="grid grid-cols-4 gap-2 sm:grid-cols-8">{bookingTimeSlots.map((time) => <button key={time} type="button" onClick={() => setBooking((c) => ({ ...c, time }))} className={cn('rounded-xl border px-2 py-3 text-xs transition', booking.time === time ? 'border-[#c9a85f] bg-[#c9a85f] font-semibold text-[#07131f]' : 'border-white/10 bg-white/[0.035] text-white/58 hover:border-[#c9a85f]/45 hover:text-white')}>{time}</button>)}</div></div>
            <label className="sm:col-span-2 flex cursor-pointer items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4"><input type="checkbox" checked={booking.consent} onChange={(e) => setBooking((c) => ({ ...c, consent: e.target.checked }))} className="mt-1 size-4 accent-[#c9a85f]" /><span className="text-xs leading-6 text-white/52">{t.consent}</span></label>
          </div>
          <div className="mt-8 flex items-center justify-between gap-4"><p className="text-xs text-white/35">{t.privacy}</p><button type="button" onClick={() => { if (detailsValid) { setError(null); setStep(3) } else setError(t.validation) }} className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#c9a85f] px-6 py-3 text-sm font-semibold text-[#07131f] transition hover:bg-[#dfc47f]">{t.continue}<ArrowRight className="size-4" /></button></div>
          </fieldset>
        ) : null}

        {step === 3 && consultation ? (
          <div><h4 className="font-serif text-2xl text-white">{t.review}</h4><div className="mt-7 grid gap-4 md:grid-cols-2">
            {[
              { icon: ShieldCheck, label: t.service, value: serviceNames[locale][booking.consultationId] ?? consultation.name },
              { icon: booking.mode === 'online' ? Video : MapPin, label: t.mode, value: booking.mode === 'online' ? t.online : t.inPerson },
              { icon: UserRound, label: t.contact, value: `${booking.firstName} ${booking.lastName}\n${booking.email}\n${internationalWhatsApp}` },
              { icon: Clock3, label: t.schedule, value: `${booking.date} · ${booking.time}\n${casaLocales.find((item) => item.value === booking.language)?.nativeLabel ?? booking.language}` },
            ].map((item) => { const Icon = item.icon; return <div key={item.label} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><div className="flex items-center gap-3 text-[#d2b46d]"><Icon className="size-4" /><span className="text-[0.62rem] uppercase tracking-[0.18em]">{item.label}</span></div><p className="mt-4 whitespace-pre-line text-sm leading-6 text-white/72">{item.value}</p></div> })}
          </div>
          <div className="mt-5 rounded-2xl border border-[#c9a85f]/28 bg-[#c9a85f]/7 p-5"><div className="flex items-start gap-4"><div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#c9a85f]/35 text-[#d2b46d]"><CreditCard className="size-5" /></div><div><p className="text-[0.62rem] uppercase tracking-[0.18em] text-[#d2b46d]">{t.payment}</p><p className="mt-2 font-serif text-xl text-white">{t.paymentPending}</p><p className="mt-2 max-w-2xl text-xs leading-6 text-white/48">{t.paymentBody}</p></div></div></div>
          <div className="mt-5 flex gap-3 rounded-2xl border border-white/10 p-4 text-xs leading-6 text-white/42"><LockKeyhole className="mt-1 size-4 shrink-0 text-[#c9a85f]" /><p>{t.provisional}</p></div>
          <button type="button" onClick={submit} disabled={submitting} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#c9a85f] px-7 py-4 text-sm font-semibold text-[#07131f] transition hover:bg-[#dfc47f] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? <><Loader2 className="size-4 animate-spin" />{t.submitting}</> : <><CheckCircle2 className="size-4" />{t.submit}</>}</button>
          </div>
        ) : null}

        {error ? <p role="alert" className="mt-6 rounded-xl border border-red-400/25 bg-red-400/8 px-4 py-3 text-sm text-red-100">{error}</p> : null}
      </div>

      {step > 0 && step < 3 ? <div className="flex items-center justify-between border-t border-white/10 px-5 py-4 sm:px-8"><button type="button" onClick={() => { setError(null); setStep((current) => Math.max(0, current - 1)) }} className="inline-flex items-center gap-2 text-sm text-white/48 transition hover:text-[#d2b46d]"><ArrowLeft className="size-4" />{t.back}</button><p className="text-[0.62rem] uppercase tracking-[0.18em] text-white/25">{t.steps[step]}</p></div> : null}
    </div>
  )
}
