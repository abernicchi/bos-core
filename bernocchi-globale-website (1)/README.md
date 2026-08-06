# Casa Bernocchi

Sitio institucional público de **Bernocchi Globale Holdings** — Casa Bernocchi.
Construido con Next.js 16, React 19, Tailwind CSS v4 y TypeScript.

## Marco institucional y reglas de verdad

- Casa Bernocchi declara una **fundación histórica en Roma, Italia, en 1893**.
- La **operación regional en Costa Rica** se abre en **2024**.
- La fecha histórica de 1893 debe conservar respaldo documental, archivístico y genealógico antes de utilizarse en trámites, publicidad regulada o declaraciones que requieran prueba externa.
- No inventar clientes, premios, ingresos, equipos, alianzas, licencias, oficinas físicas ni estadísticas.
- Distinguir siempre entre:
  - `heritage`: origen o memoria histórica;
  - `operating`: operación activa;
  - `coordination`: centro de coordinación;
  - `market`: mercado estratégico o proyección comercial;
  - `planned`: institución o instalación futura.
- Una ciudad marcada como mercado estratégico **no debe presentarse como sucursal física abierta al público**.
- La bandera de la Unión Europea expresa orientación institucional y geográfica; no implica aprobación, patrocinio ni afiliación oficial.
- Usar la grafía italiana **Bernocchi Globale**, nunca “Bernocchi Global”.

## Idiomas

La interfaz internacional admite:

- Español
- English
- Italiano
- Français
- Deutsch
- Català
- 中文（普通话）
- Polski
- Русский
- 日本語

La preferencia se conserva localmente y se aplica a la portada, navegación y flujo de reserva. Las páginas legales y editoriales deben traducirse únicamente después de revisión profesional por idioma y jurisdicción.

## Reservas Bernocchi Health

El flujo público sigue esta secuencia:

1. tipo de servicio;
2. modalidad;
3. datos y disponibilidad;
4. revisión y envío.

La selección de servicio y modalidad avanza automáticamente. La solicitud se guarda en Supabase desde el servidor y se notifica por correo a la Segreteria Generale. El método y el estado de pago permanecen en `pending` hasta verificación externa.

### Seguridad

- No se recopila historia clínica ni información médica sensible en el formulario público.
- `SUPABASE_SERVICE_ROLE_KEY` y `RESEND_API_KEY` son secretos exclusivos del servidor.
- La tabla de reservas tiene RLS activado y no permite acceso directo a visitantes anónimos.
- El correo continúa como canal de respaldo operativo si el almacenamiento temporalmente falla.

## Variables de entorno

- `NEXT_PUBLIC_SITE_URL`
- `CONTACT_RECIPIENT_EMAIL`
- `CONTACT_FROM_EMAIL`
- `RESEND_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Rutas principales

| Ruta | Contenido |
| --- | --- |
| `/` | Portada institucional premium y red internacional |
| `/casa` | Historia, misión, principios y arquitectura institucional |
| `/institutions` | Instituciones y estado declarado |
| `/health` | Bernocchi Health y reserva de citas |
| `/governance` | Gobernanza, integridad y riesgo |
| `/founder` | Oficina del Fundador y filosofía |
| `/journal` | Contenido editorial |
| `/contact` | Segreteria Generale |
| `/privacy`, `/cookies`, `/terms` | Documentos legales sujetos a validación profesional |

## Criterio de diseño

La experiencia visual debe transmitir alta relojería y automoción europea en precisión, proporción, movimiento, materialidad y discreción, sin copiar marcas, logotipos, interfaces protegidas ni elementos distintivos de terceros.
