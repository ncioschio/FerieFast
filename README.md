# Gestionale Presenze & Permessi

App React + Supabase per gestire ferie, permessi orari, malattia e altri eventi (Legge 104, ecc.) del personale, con export Excel per il commercialista.

---

## Struttura del progetto

```
gestionale-presenze/
├── index.html
├── vite.config.js
├── package.json
├── supabase_schema.sql        ← schema database da incollare su Supabase
└── src/
    ├── main.jsx               ← entry point
    ├── App.jsx                ← root con navigazione e fetch dati
    ├── index.css              ← stili globali
    ├── supabaseClient.js      ← ⚙️ inserisci qui le credenziali Supabase
    ├── utils.js               ← costanti e funzioni condivise
    └── components/
        ├── UI.jsx             ← componenti riutilizzabili (Avatar, Badge, ecc.)
        ├── Dashboard.jsx      ← vista riepilogo per dipendente
        ├── Inserisci.jsx      ← form inserimento assenze
        ├── Dipendenti.jsx     ← anagrafica dipendenti
        └── Export.jsx         ← export Excel per commercialista
```

---

## Setup (una volta sola)

### 1. Crea il database su Supabase

1. Vai su [supabase.com](https://supabase.com) → crea un nuovo progetto
2. Nella sidebar → **SQL Editor** → incolla il contenuto di `supabase_schema.sql` → **Run**
3. Vai su **Settings → API** e copia:
   - **Project URL** (es. `https://abcxyz.supabase.co`)
   - **anon public** key

### 2. Inserisci le credenziali

Apri `src/supabaseClient.js` e sostituisci:

```js
const SUPABASE_URL      = "https://TUOPROGETTOQXXXX.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

### 3. Installa e avvia

Richiede [Node.js](https://nodejs.org) ≥ 18.

```bash
npm install
npm run dev
```

Apri il browser su `http://localhost:5173`

---

## Deploy per la segretaria (GitHub Pages)

```bash
# 1. Crea un repository su GitHub e carica il progetto

# 2. Apri vite.config.js e decommenta/imposta:
#    base: "/nome-del-repository/",

# 3. Apri package.json e aggiungi in cima:
#    "homepage": "https://TUOUTENTE.github.io/NOMEREPO",

# 4. Esegui il deploy
npm run deploy
```

Poi su GitHub → repository → **Settings → Pages** → seleziona il branch `gh-pages`.

> L'app sarà accessibile a `https://TUOUTENTE.github.io/NOMEREPO`

---

## Tipi di evento

| Tipo             | Unità   | Note                              |
|------------------|---------|-----------------------------------|
| Ferie            | Giorni  | 0.5 = mezza giornata              |
| Malattia         | Giorni  | 0.5 = mezza giornata              |
| Permesso orario  | Ore     | es. 2.5 = 2h 30min (step 0.25h)  |
| Altro            | Ore     | Legge 104, permesso studio, ecc.  |

---

## Export Excel

Il file generato contiene **due fogli**:

- **Foglio 1** `[Mese Anno]` — dettaglio giornaliero: dipendente, matricola, data, tipo, giorni/ore, note
- **Foglio 2** `[Riepilogo Anno]` — totali annuali per dipendente: ferie, malattia, permessi, altro

---

## Sicurezza

La `anon key` di Supabase è progettata per essere pubblica: le autorizzazioni reali sono controllate da **Row Level Security (RLS)** sul database. Per un uso interno tra colleghi la configurazione di default va bene. Se in futuro volessi aggiungere autenticazione, Supabase supporta login con email/password nativamente.
