# Casa Bernocchi

Sito istituzionale pubblico di **Bernocchi Globale Holdings** (Casa Bernocchi) — un
gruppo italiano privato fondato nel 2026, con sede centrale a Milano e ufficio
regionale in Costa Rica.

Costruito con Next.js 16 (App Router), React 19, Tailwind CSS v4 e TypeScript.

## Regole di verità del contenuto

Il sito è deliberatamente onesto sullo stato reale del gruppo. **Non modificare
questi vincoli senza istruzioni esplicite:**

- Fondazione nel **2026**. Sede a **Milano, Italia**; ufficio regionale in **Costa Rica**.
- Non inventare clienti, premi, fatturato, team, partnership, sedi o statistiche.
- Le istituzioni non ancora attive sono marcate `development`, `planned` o `future`.
- **Bernocchi Health** è l'unica istituzione a priorità operativa.
- Usare sempre la grafia italiana **"Bernocchi Globale"**, mai "Bernocchi Global".

## Contenuto centralizzato

Tutto il contenuto strutturato (nomi, istituzioni, ordini, contatti, articoli del
Journal, tipi di richiesta) vive in un unico file:

```
lib/content.ts
```

Modificando i valori qui, l'aggiornamento si propaga a tutto il sito.

## Struttura delle pagine

| Rotta | Contenuto |
| --- | --- |
| `/` | Home istituzionale |
| `/la-casa` | Identità, missione, visione, principi |
| `/istituzioni` | Le istituzioni del gruppo e il loro stato |
| `/ordini` | I sei Ordini (domini disciplinari) |
| `/health` | Bernocchi Health — pagina di conversione (form) |
| `/legal` | Bernocchi Legal — in sviluppo (interesse professionale) |
| `/governance` | Modello di governance e integrità |
| `/fondatore` | Il fondatore e la filosofia |
| `/journal` + `/journal/[slug]` | Note editoriali (bozze) |
| `/contatti` | Segreteria Generale e form generale |
| `/privacy`, `/cookies`, `/termini` | Documenti legali (modelli da far validare) |

## Modulo di contatto

Il componente `components/inquiry-form.tsx` invia a `app/api/inquiry/route.ts`.
Di default la richiesta viene validata e registrata a log. Per l'invio email in
produzione, collegare un provider (es. Resend) nella route e impostare le variabili
d'ambiente indicate in `.env.example`.

## Variabili d'ambiente

Vedi `.env.example`. Nessuna è obbligatoria per l'esecuzione in locale.

## Note

- I documenti legali sono **modelli** e devono essere verificati da un legale per le
  giurisdizioni italiana e costaricana prima della pubblicazione.
- Le lingue previste sono Italiano (default), English ed Español; il selettore è
  predisposto per l'internazionalizzazione futura.
