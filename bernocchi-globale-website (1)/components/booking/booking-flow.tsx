'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Loader2,
  Search,
} from 'lucide-react'
import {
  consultationModes,
  consultationTypes,
  languages,
  bookingTimeSlots,
} from '@/lib/content'
import { cn } from '@/lib/utils'

type CountryOption = {
  iso: string
  name: string
  dial: string
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { iso: 'AF', name: "Afghanistan", dial: '93' },
  { iso: 'AL', name: "Albania", dial: '355' },
  { iso: 'DZ', name: "Algeria", dial: '213' },
  { iso: 'AS', name: "American Samoa", dial: '1684' },
  { iso: 'AD', name: "Andorra", dial: '376' },
  { iso: 'AO', name: "Angola", dial: '244' },
  { iso: 'AI', name: "Anguilla", dial: '1264' },
  { iso: 'AQ', name: "Antarctica", dial: '672' },
  { iso: 'AG', name: "Antigua and Barbuda", dial: '1268' },
  { iso: 'AR', name: "Argentina", dial: '54' },
  { iso: 'AM', name: "Armenia", dial: '374' },
  { iso: 'AW', name: "Aruba", dial: '297' },
  { iso: 'AU', name: "Australia", dial: '61' },
  { iso: 'AT', name: "Austria", dial: '43' },
  { iso: 'AZ', name: "Azerbaijan", dial: '994' },
  { iso: 'BH', name: "Bahrain", dial: '973' },
  { iso: 'BD', name: "Bangladesh", dial: '880' },
  { iso: 'BB', name: "Barbados", dial: '1246' },
  { iso: 'BY', name: "Belarus", dial: '375' },
  { iso: 'BE', name: "Belgium", dial: '32' },
  { iso: 'BZ', name: "Belize", dial: '501' },
  { iso: 'BJ', name: "Benin", dial: '229' },
  { iso: 'BM', name: "Bermuda", dial: '1441' },
  { iso: 'BT', name: "Bhutan", dial: '975' },
  { iso: 'BO', name: "Bolivia", dial: '591' },
  { iso: 'BA', name: "Bosnia and Herzegovina", dial: '387' },
  { iso: 'BW', name: "Botswana", dial: '267' },
  { iso: 'BR', name: "Brazil", dial: '55' },
  { iso: 'IO', name: "British Indian Ocean Territory", dial: '246' },
  { iso: 'VG', name: "British Virgin Islands", dial: '1284' },
  { iso: 'BN', name: "Brunei", dial: '673' },
  { iso: 'BG', name: "Bulgaria", dial: '359' },
  { iso: 'BF', name: "Burkina Faso", dial: '226' },
  { iso: 'BI', name: "Burundi", dial: '257' },
  { iso: 'KH', name: "Cambodia", dial: '855' },
  { iso: 'CM', name: "Cameroon", dial: '237' },
  { iso: 'CA', name: "Canada", dial: '1' },
  { iso: 'CV', name: "Cape Verde", dial: '238' },
  { iso: 'BQ', name: "Caribbean Netherlands", dial: '599' },
  { iso: 'KY', name: "Cayman Islands", dial: '1345' },
  { iso: 'CF', name: "Central African Republic", dial: '236' },
  { iso: 'TD', name: "Chad", dial: '235' },
  { iso: 'CL', name: "Chile", dial: '56' },
  { iso: 'CN', name: "China", dial: '86' },
  { iso: 'CX', name: "Christmas Island", dial: '61' },
  { iso: 'CC', name: "Cocos (Keeling) Islands", dial: '61' },
  { iso: 'CO', name: "Colombia", dial: '57' },
  { iso: 'KM', name: "Comoros", dial: '269' },
  { iso: 'CK', name: "Cook Islands", dial: '682' },
  { iso: 'CR', name: "Costa Rica", dial: '506' },
  { iso: 'HR', name: "Croatia", dial: '385' },
  { iso: 'CU', name: "Cuba", dial: '53' },
  { iso: 'CW', name: "Curaçao", dial: '599' },
  { iso: 'CY', name: "Cyprus", dial: '357' },
  { iso: 'CZ', name: "Czech Republic", dial: '420' },
  { iso: 'CD', name: "Democratic Republic of the Congo", dial: '243' },
  { iso: 'DK', name: "Denmark", dial: '45' },
  { iso: 'DJ', name: "Djibouti", dial: '253' },
  { iso: 'DM', name: "Dominica", dial: '1767' },
  { iso: 'DO', name: "Dominican Republic", dial: '1809' },
  { iso: 'TL', name: "East Timor", dial: '670' },
  { iso: 'EC', name: "Ecuador", dial: '593' },
  { iso: 'EG', name: "Egypt", dial: '20' },
  { iso: 'SV', name: "El Salvador", dial: '503' },
  { iso: 'GQ', name: "Equatorial Guinea", dial: '240' },
  { iso: 'ER', name: "Eritrea", dial: '291' },
  { iso: 'EE', name: "Estonia", dial: '372' },
  { iso: 'ET', name: "Ethiopia", dial: '251' },
  { iso: 'FK', name: "Falkland Islands", dial: '500' },
  { iso: 'FO', name: "Faroe Islands", dial: '298' },
  { iso: 'FM', name: "Federated States of Micronesia", dial: '691' },
  { iso: 'FJ', name: "Fiji", dial: '679' },
  { iso: 'FI', name: "Finland", dial: '358' },
  { iso: 'FR', name: "France", dial: '33' },
  { iso: 'GF', name: "French Guiana", dial: '594' },
  { iso: 'PF', name: "French Polynesia", dial: '689' },
  { iso: 'TF', name: "French Southern Territories", dial: '262' },
  { iso: 'GA', name: "Gabon", dial: '241' },
  { iso: 'GE', name: "Georgia", dial: '995' },
  { iso: 'DE', name: "Germany", dial: '49' },
  { iso: 'GH', name: "Ghana", dial: '233' },
  { iso: 'GI', name: "Gibraltar", dial: '350' },
  { iso: 'GR', name: "Greece", dial: '30' },
  { iso: 'GL', name: "Greenland", dial: '299' },
  { iso: 'GD', name: "Grenada", dial: '1473' },
  { iso: 'GP', name: "Guadeloupe", dial: '590' },
  { iso: 'GU', name: "Guam", dial: '1671' },
  { iso: 'GT', name: "Guatemala", dial: '502' },
  { iso: 'GG', name: "Guernsey", dial: '44' },
  { iso: 'GN', name: "Guinea", dial: '224' },
  { iso: 'GW', name: "Guinea-Bissau", dial: '245' },
  { iso: 'GY', name: "Guyana", dial: '592' },
  { iso: 'HT', name: "Haiti", dial: '509' },
  { iso: 'HN', name: "Honduras", dial: '504' },
  { iso: 'HK', name: "Hong Kong", dial: '852' },
  { iso: 'HU', name: "Hungary", dial: '36' },
  { iso: 'IS', name: "Iceland", dial: '354' },
  { iso: 'IN', name: "India", dial: '91' },
  { iso: 'ID', name: "Indonesia", dial: '62' },
  { iso: 'IR', name: "Iran", dial: '98' },
  { iso: 'IQ', name: "Iraq", dial: '964' },
  { iso: 'IE', name: "Ireland", dial: '353' },
  { iso: 'IM', name: "Isle of Man", dial: '44' },
  { iso: 'IL', name: "Israel", dial: '972' },
  { iso: 'IT', name: "Italy", dial: '39' },
  { iso: 'CI', name: "Ivory Coast", dial: '225' },
  { iso: 'JM', name: "Jamaica", dial: '1876' },
  { iso: 'JP', name: "Japan", dial: '81' },
  { iso: 'JE', name: "Jersey", dial: '44' },
  { iso: 'JO', name: "Jordan", dial: '962' },
  { iso: 'KZ', name: "Kazakhstan", dial: '76' },
  { iso: 'KE', name: "Kenya", dial: '254' },
  { iso: 'KI', name: "Kiribati", dial: '686' },
  { iso: 'XK', name: "Kosovo", dial: '383' },
  { iso: 'KW', name: "Kuwait", dial: '965' },
  { iso: 'KG', name: "Kyrgyzstan", dial: '996' },
  { iso: 'LA', name: "Laos", dial: '856' },
  { iso: 'LV', name: "Latvia", dial: '371' },
  { iso: 'LB', name: "Lebanon", dial: '961' },
  { iso: 'LS', name: "Lesotho", dial: '266' },
  { iso: 'LR', name: "Liberia", dial: '231' },
  { iso: 'LY', name: "Libya", dial: '218' },
  { iso: 'LI', name: "Liechtenstein", dial: '423' },
  { iso: 'LT', name: "Lithuania", dial: '370' },
  { iso: 'LU', name: "Luxembourg", dial: '352' },
  { iso: 'MO', name: "Macau", dial: '853' },
  { iso: 'MG', name: "Madagascar", dial: '261' },
  { iso: 'MW', name: "Malawi", dial: '265' },
  { iso: 'MY', name: "Malaysia", dial: '60' },
  { iso: 'MV', name: "Maldives", dial: '960' },
  { iso: 'ML', name: "Mali", dial: '223' },
  { iso: 'MT', name: "Malta", dial: '356' },
  { iso: 'MH', name: "Marshall Islands", dial: '692' },
  { iso: 'MQ', name: "Martinique", dial: '596' },
  { iso: 'MR', name: "Mauritania", dial: '222' },
  { iso: 'MU', name: "Mauritius", dial: '230' },
  { iso: 'YT', name: "Mayotte", dial: '262' },
  { iso: 'MX', name: "Mexico", dial: '52' },
  { iso: 'MD', name: "Moldova", dial: '373' },
  { iso: 'MC', name: "Monaco", dial: '377' },
  { iso: 'MN', name: "Mongolia", dial: '976' },
  { iso: 'ME', name: "Montenegro", dial: '382' },
  { iso: 'MS', name: "Montserrat", dial: '1664' },
  { iso: 'MA', name: "Morocco", dial: '212' },
  { iso: 'MZ', name: "Mozambique", dial: '258' },
  { iso: 'MM', name: "Myanmar", dial: '95' },
  { iso: 'NA', name: "Namibia", dial: '264' },
  { iso: 'NR', name: "Nauru", dial: '674' },
  { iso: 'NP', name: "Nepal", dial: '977' },
  { iso: 'NL', name: "Netherlands", dial: '31' },
  { iso: 'NC', name: "New Caledonia", dial: '687' },
  { iso: 'NZ', name: "New Zealand", dial: '64' },
  { iso: 'NI', name: "Nicaragua", dial: '505' },
  { iso: 'NE', name: "Niger", dial: '227' },
  { iso: 'NG', name: "Nigeria", dial: '234' },
  { iso: 'NU', name: "Niue", dial: '683' },
  { iso: 'NF', name: "Norfolk Island", dial: '672' },
  { iso: 'KP', name: "North Korea", dial: '850' },
  { iso: 'MP', name: "Northern Mariana Islands", dial: '1670' },
  { iso: 'NO', name: "Norway", dial: '47' },
  { iso: 'OM', name: "Oman", dial: '968' },
  { iso: 'PK', name: "Pakistan", dial: '92' },
  { iso: 'PW', name: "Palau", dial: '680' },
  { iso: 'PS', name: "Palestine", dial: '970' },
  { iso: 'PA', name: "Panama", dial: '507' },
  { iso: 'PG', name: "Papua New Guinea", dial: '675' },
  { iso: 'PY', name: "Paraguay", dial: '595' },
  { iso: 'PE', name: "Peru", dial: '51' },
  { iso: 'PH', name: "Philippines", dial: '63' },
  { iso: 'PN', name: "Pitcairn Islands", dial: '64' },
  { iso: 'PL', name: "Poland", dial: '48' },
  { iso: 'PT', name: "Portugal", dial: '351' },
  { iso: 'PR', name: "Puerto Rico", dial: '1787' },
  { iso: 'QA', name: "Qatar", dial: '974' },
  { iso: 'MK', name: "Republic of Macedonia", dial: '389' },
  { iso: 'CG', name: "Republic of the Congo", dial: '242' },
  { iso: 'RO', name: "Romania", dial: '40' },
  { iso: 'RU', name: "Russia", dial: '7' },
  { iso: 'RW', name: "Rwanda", dial: '250' },
  { iso: 'RE', name: "Réunion", dial: '262' },
  { iso: 'BL', name: "Saint Barthélemy", dial: '590' },
  { iso: 'SH', name: "Saint Helena", dial: '290' },
  { iso: 'KN', name: "Saint Kitts and Nevis", dial: '1869' },
  { iso: 'LC', name: "Saint Lucia", dial: '1758' },
  { iso: 'MF', name: "Saint Martin", dial: '590' },
  { iso: 'PM', name: "Saint Pierre and Miquelon", dial: '508' },
  { iso: 'VC', name: "Saint Vincent and the Grenadines", dial: '1784' },
  { iso: 'WS', name: "Samoa", dial: '685' },
  { iso: 'SM', name: "San Marino", dial: '378' },
  { iso: 'SA', name: "Saudi Arabia", dial: '966' },
  { iso: 'SN', name: "Senegal", dial: '221' },
  { iso: 'RS', name: "Serbia", dial: '381' },
  { iso: 'SC', name: "Seychelles", dial: '248' },
  { iso: 'SL', name: "Sierra Leone", dial: '232' },
  { iso: 'SG', name: "Singapore", dial: '65' },
  { iso: 'SX', name: "Sint Maarten", dial: '1721' },
  { iso: 'SK', name: "Slovakia", dial: '421' },
  { iso: 'SI', name: "Slovenia", dial: '386' },
  { iso: 'SB', name: "Solomon Islands", dial: '677' },
  { iso: 'SO', name: "Somalia", dial: '252' },
  { iso: 'ZA', name: "South Africa", dial: '27' },
  { iso: 'GS', name: "South Georgia", dial: '500' },
  { iso: 'KR', name: "South Korea", dial: '82' },
  { iso: 'SS', name: "South Sudan", dial: '211' },
  { iso: 'ES', name: "Spain", dial: '34' },
  { iso: 'LK', name: "Sri Lanka", dial: '94' },
  { iso: 'SD', name: "Sudan", dial: '249' },
  { iso: 'SR', name: "Suriname", dial: '597' },
  { iso: 'SJ', name: "Svalbard and Jan Mayen", dial: '4779' },
  { iso: 'SZ', name: "Swaziland", dial: '268' },
  { iso: 'SE', name: "Sweden", dial: '46' },
  { iso: 'CH', name: "Switzerland", dial: '41' },
  { iso: 'SY', name: "Syria", dial: '963' },
  { iso: 'ST', name: "São Tomé and Príncipe", dial: '239' },
  { iso: 'TW', name: "Taiwan", dial: '886' },
  { iso: 'TJ', name: "Tajikistan", dial: '992' },
  { iso: 'TZ', name: "Tanzania", dial: '255' },
  { iso: 'TH', name: "Thailand", dial: '66' },
  { iso: 'BS', name: "The Bahamas", dial: '1242' },
  { iso: 'GM', name: "The Gambia", dial: '220' },
  { iso: 'TG', name: "Togo", dial: '228' },
  { iso: 'TK', name: "Tokelau", dial: '690' },
  { iso: 'TO', name: "Tonga", dial: '676' },
  { iso: 'TT', name: "Trinidad and Tobago", dial: '1868' },
  { iso: 'TN', name: "Tunisia", dial: '216' },
  { iso: 'TR', name: "Turkey", dial: '90' },
  { iso: 'TM', name: "Turkmenistan", dial: '993' },
  { iso: 'TC', name: "Turks and Caicos Islands", dial: '1649' },
  { iso: 'TV', name: "Tuvalu", dial: '688' },
  { iso: 'VI', name: "U.S. Virgin Islands", dial: '1340' },
  { iso: 'UG', name: "Uganda", dial: '256' },
  { iso: 'UA', name: "Ukraine", dial: '380' },
  { iso: 'AE', name: "United Arab Emirates", dial: '971' },
  { iso: 'GB', name: "United Kingdom", dial: '44' },
  { iso: 'US', name: "United States", dial: '1' },
  { iso: 'UM', name: "United States Minor Outlying Islands", dial: '1' },
  { iso: 'UY', name: "Uruguay", dial: '598' },
  { iso: 'UZ', name: "Uzbekistan", dial: '998' },
  { iso: 'VU', name: "Vanuatu", dial: '678' },
  { iso: 'VA', name: "Vatican City", dial: '39' },
  { iso: 'VE', name: "Venezuela", dial: '58' },
  { iso: 'VN', name: "Vietnam", dial: '84' },
  { iso: 'WF', name: "Wallis and Futuna", dial: '681' },
  { iso: 'EH', name: "Western Sahara", dial: '212' },
  { iso: 'YE', name: "Yemen", dial: '967' },
  { iso: 'ZM', name: "Zambia", dial: '260' },
  { iso: 'ZW', name: "Zimbabwe", dial: '263' },
  { iso: 'AX', name: "Åland Islands", dial: '358' },
]

type Booking = {
  consultationId: string
  mode: string
  fullName: string
  email: string
  whatsapp: string
  phoneCountryIso: string
  country: string
  language: string
  date: string
  time: string
}

const STEPS = ['Consultation', 'Mode', 'Your details', 'Confirmation'] as const

const fieldClass =
  'w-full rounded-sm border border-input bg-background px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold'

const labelClass =
  'mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function todayISO() {
  return new Date().toISOString().split('T')[0]
}

function flagEmoji(iso: string) {
  return iso
    .toUpperCase()
    .replace(/[A-Z]/g, (letter) =>
      String.fromCodePoint(127397 + letter.charCodeAt(0)),
    )
}

function phoneDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 15)
}

export function BookingFlow({
  initialConsultationId,
}: {
  initialConsultationId?: string
}) {
  const router = useRouter()
  const countryMenuRef = useRef<HTMLDivElement>(null)

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countryOpen, setCountryOpen] = useState(false)
  const [countrySearch, setCountrySearch] = useState('')

  const [booking, setBooking] = useState<Booking>({
    consultationId: initialConsultationId ?? consultationTypes[0].id,
    mode: 'online',
    fullName: '',
    email: '',
    whatsapp: '',
    phoneCountryIso: 'CR',
    country: 'Costa Rica',
    language: 'en',
    date: '',
    time: '',
  })

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        countryMenuRef.current &&
        !countryMenuRef.current.contains(event.target as Node)
      ) {
        setCountryOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setCountryOpen(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const consultation = useMemo(
    () =>
      consultationTypes.find((item) => item.id === booking.consultationId) ??
      consultationTypes[0],
    [booking.consultationId],
  )

  const selectedCountry = useMemo(
    () =>
      COUNTRY_OPTIONS.find((item) => item.iso === booking.phoneCountryIso) ??
      COUNTRY_OPTIONS.find((item) => item.iso === 'CR') ??
      COUNTRY_OPTIONS[0],
    [booking.phoneCountryIso],
  )

  const filteredCountries = useMemo(() => {
    const search = countrySearch.trim().toLowerCase()
    const digits = search.replace(/\D/g, '')

    if (!search) return COUNTRY_OPTIONS

    return COUNTRY_OPTIONS.filter(
      (country) =>
        country.name.toLowerCase().includes(search) ||
        country.iso.toLowerCase().includes(search) ||
        (digits.length > 0 && country.dial.includes(digits)),
    )
  }, [countrySearch])

  const internationalWhatsApp = `+${selectedCountry.dial}${booking.whatsapp}`

  function update<K extends keyof Booking>(key: K, value: Booking[K]) {
    setBooking((current) => ({ ...current, [key]: value }))
  }

  function selectCountry(country: CountryOption) {
    setBooking((current) => ({
      ...current,
      phoneCountryIso: country.iso,
      country: country.name,
      whatsapp: '',
    }))
    setCountrySearch('')
    setCountryOpen(false)
  }

  const canContinue = (() => {
    switch (step) {
      case 0:
        return Boolean(booking.consultationId)
      case 1:
        return Boolean(booking.mode)
      case 2:
        return (
          booking.fullName.trim().length > 1 &&
          EMAIL_RE.test(booking.email) &&
          booking.whatsapp.length >= 6 &&
          internationalWhatsApp.length <= 16 &&
          booking.country.trim().length > 1 &&
          Boolean(booking.date) &&
          Boolean(booking.time)
        )
      default:
        return true
    }
  })()

  const modeLabel =
    consultationModes.find((item) => item.value === booking.mode)?.label ?? '—'

  const languageLabel =
    languages.find((item) => item.value === booking.language)?.label ?? '—'

  async function submitRequest() {
    setSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultation: consultation.name,
          mode: modeLabel,
          fullName: booking.fullName,
          email: booking.email,
          whatsapp: internationalWhatsApp,
          country: booking.country,
          language: languageLabel,
          date: booking.date,
          time: booking.time,
        }),
      })

      if (!response.ok) {
        throw new Error('request-failed')
      }

      router.push('/health/confirmation')
    } catch {
      setError(
        'We could not submit your request just now. Please try again, or contact us on WhatsApp.',
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="overflow-hidden rounded-sm border border-border bg-card">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-2 border-b border-border bg-secondary px-6 py-4 text-xs">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={cn(
                'inline-flex size-5 items-center justify-center rounded-full text-[0.65rem] font-medium',
                index < step && 'bg-gold text-navy',
                index === step && 'border border-gold text-gold',
                index > step &&
                  'border border-border text-muted-foreground',
              )}
            >
              {index < step ? <Check className="size-3" /> : index + 1}
            </span>

            <span
              className={cn(
                'uppercase tracking-[0.12em]',
                index === step
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {label}
            </span>

            {index < STEPS.length - 1 ? (
              <span className="ml-1 text-border">/</span>
            ) : null}
          </li>
        ))}
      </ol>

      <div className="p-6 lg:p-8">
        {step === 0 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Choose a consultation
            </legend>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {consultationTypes.map((item) => {
                const selected = booking.consultationId === item.id

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => update('consultationId', item.id)}
                    className={cn(
                      'flex flex-col gap-1 rounded-sm border p-4 text-left transition-colors',
                      selected
                        ? 'border-gold bg-gold/5'
                        : 'border-border hover:border-gold/50',
                    )}
                    aria-pressed={selected}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="font-medium text-card-foreground">
                        {item.name}
                      </span>

                      {selected ? (
                        <Check className="size-4 text-gold" />
                      ) : null}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      {item.description}
                    </span>

                    <span className="mt-1 text-xs uppercase tracking-[0.12em] text-gold/80">
                      {item.duration}
                    </span>
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {step === 1 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Choose consultation mode
            </legend>

            <p className="mt-2 text-sm text-muted-foreground">
              Meet by secure video or in person, whichever suits you.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {consultationModes.map((item) => {
                const selected = booking.mode === item.value

                return (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => update('mode', item.value)}
                    className={cn(
                      'flex items-center justify-between rounded-sm border p-5 text-left transition-colors',
                      selected
                        ? 'border-gold bg-gold/5'
                        : 'border-border hover:border-gold/50',
                    )}
                    aria-pressed={selected}
                  >
                    <span className="font-medium text-card-foreground">
                      {item.label}
                    </span>

                    {selected ? (
                      <Check className="size-4 text-gold" />
                    ) : null}
                  </button>
                )
              })}
            </div>
          </fieldset>
        ) : null}

        {step === 2 ? (
          <fieldset>
            <legend className="font-serif text-2xl text-card-foreground">
              Your details
            </legend>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  Full name
                </label>

                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  value={booking.fullName}
                  onChange={(event) =>
                    update('fullName', event.target.value)
                  }
                  className={fieldClass}
                />
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={booking.email}
                  onChange={(event) => update('email', event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div className="sm:col-span-2">
                <span className={labelClass}>WhatsApp number</span>

                <div className="grid gap-3 sm:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
                  <div ref={countryMenuRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setCountryOpen((open) => !open)}
                      className={cn(
                        fieldClass,
                        'flex items-center justify-between gap-3 text-left',
                      )}
                      aria-haspopup="listbox"
                      aria-expanded={countryOpen}
                    >
                      <span className="min-w-0 truncate">
                        <span className="mr-2" aria-hidden="true">
                          {flagEmoji(selectedCountry.iso)}
                        </span>
                        <span>{selectedCountry.name}</span>
                      </span>

                      <span className="flex shrink-0 items-center gap-2 text-muted-foreground">
                        +{selectedCountry.dial}
                        <ChevronDown
                          className={cn(
                            'size-4 transition-transform',
                            countryOpen && 'rotate-180',
                          )}
                        />
                      </span>
                    </button>

                    {countryOpen ? (
                      <div className="absolute z-50 mt-2 w-full min-w-[18rem] overflow-hidden rounded-sm border border-border bg-card shadow-xl">
                        <div className="border-b border-border p-2">
                          <div className="flex items-center gap-2 rounded-sm border border-input bg-background px-3">
                            <Search className="size-4 shrink-0 text-muted-foreground" />

                            <input
                              type="search"
                              autoFocus
                              value={countrySearch}
                              onChange={(event) =>
                                setCountrySearch(event.target.value)
                              }
                              placeholder="Search country or calling code"
                              className="w-full bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                              aria-label="Search country or calling code"
                            />
                          </div>
                        </div>

                        <ul
                          role="listbox"
                          aria-label="Countries and calling codes"
                          className="max-h-64 overflow-y-auto py-1"
                        >
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => {
                              const selected =
                                country.iso === selectedCountry.iso

                              return (
                                <li key={country.iso}>
                                  <button
                                    type="button"
                                    role="option"
                                    aria-selected={selected}
                                    onClick={() => selectCountry(country)}
                                    className={cn(
                                      'flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-secondary',
                                      selected && 'bg-gold/10 text-gold',
                                    )}
                                  >
                                    <span className="min-w-0 truncate">
                                      <span
                                        className="mr-2"
                                        aria-hidden="true"
                                      >
                                        {flagEmoji(country.iso)}
                                      </span>
                                      {country.name}
                                    </span>

                                    <span className="shrink-0 text-muted-foreground">
                                      +{country.dial}
                                    </span>
                                  </button>
                                </li>
                              )
                            })
                          ) : (
                            <li className="px-4 py-5 text-center text-sm text-muted-foreground">
                              No country found.
                            </li>
                          )}
                        </ul>
                      </div>
                    ) : null}
                  </div>

                  <div className="flex overflow-hidden rounded-sm border border-input bg-background transition-colors focus-within:border-gold focus-within:ring-1 focus-within:ring-gold">
                    <span className="flex items-center border-r border-input px-3.5 text-sm font-medium text-muted-foreground">
                      +{selectedCountry.dial}
                    </span>

                    <input
                      id="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="Phone number"
                      value={booking.whatsapp}
                      onChange={(event) =>
                        update('whatsapp', phoneDigits(event.target.value))
                      }
                      className="min-w-0 flex-1 bg-transparent px-3.5 py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
                    />
                  </div>
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  The international prefix is added automatically. Your number
                  will be sent as {internationalWhatsApp}.
                </p>
              </div>

              <div>
                <label htmlFor="country" className={labelClass}>
                  Country
                </label>

                <input
                  id="country"
                  type="text"
                  value={
                    `${flagEmoji(selectedCountry.iso)} ${booking.country}`
                  }
                  readOnly
                  className={cn(fieldClass, 'cursor-default bg-secondary')}
                />
              </div>

              <div>
                <label htmlFor="language" className={labelClass}>
                  Preferred language
                </label>

                <select
                  id="language"
                  value={booking.language}
                  onChange={(event) =>
                    update('language', event.target.value)
                  }
                  className={fieldClass}
                >
                  {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="date" className={labelClass}>
                  Preferred date
                </label>

                <input
                  id="date"
                  type="date"
                  min={todayISO()}
                  value={booking.date}
                  onChange={(event) => update('date', event.target.value)}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-5">
              <span className={labelClass}>Preferred time</span>

              <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
                {bookingTimeSlots.map((slot) => {
                  const selected = booking.time === slot

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => update('time', slot)}
                      className={cn(
                        'rounded-sm border py-2 text-sm transition-colors',
                        selected
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-border text-card-foreground hover:border-gold/50',
                      )}
                      aria-pressed={selected}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
              Please do not include clinical or medical information. This is an
              appointment request only — times are indicative and will be
              confirmed by the Segreteria Generale.
            </p>
          </fieldset>
        ) : null}

        {step === 3 ? (
          <div>
            <h3 className="font-serif text-2xl text-card-foreground">
              Review your request
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Please confirm the details below before submitting your
              appointment request.
            </p>

            <div className="mt-5 rounded-sm border border-border bg-secondary p-5 text-sm">
              <dl className="grid gap-2 sm:grid-cols-2">
                <SummaryRow
                  label="Consultation"
                  value={consultation.name}
                />
                <SummaryRow
                  label="Duration"
                  value={consultation.duration}
                />
                <SummaryRow label="Mode" value={modeLabel} />
                <SummaryRow label="Language" value={languageLabel} />
                <SummaryRow
                  label="Date & time"
                  value={`${booking.date || '—'} · ${booking.time || '—'}`}
                />
                <SummaryRow
                  label="Full name"
                  value={booking.fullName || '—'}
                />
                <SummaryRow
                  label="Email"
                  value={booking.email || '—'}
                />
                <SummaryRow
                  label="WhatsApp"
                  value={internationalWhatsApp}
                />
                <SummaryRow
                  label="Country"
                  value={
                    `${flagEmoji(selectedCountry.iso)} ${booking.country}`
                  }
                />
              </dl>
            </div>

            {error ? (
              <p
                role="alert"
                className="mt-4 rounded-sm border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive"
              >
                {error}
              </p>
            ) : null}

            <button
              type="button"
              onClick={submitRequest}
              disabled={submitting}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                <>
                  Submit appointment request
                  <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </div>
        ) : null}

        {step < 3 ? (
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(0, current - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back
            </button>

            <button
              type="button"
              onClick={() => setStep((current) => current + 1)}
              disabled={!canContinue}
              className="inline-flex items-center gap-2 rounded-sm bg-gold px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {step === 2 ? 'Review request' : 'Continue'}
              <ArrowRight className="size-4" />
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={submitting}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="size-4" />
              Back to details
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 sm:block">
      <dt className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="text-card-foreground sm:mt-0.5">{value}</dd>
    </div>
  )
}
