# 🍷 Evoluzione 2026 - Sistema di Votazione

Sistema di votazione real-time per l'evento Evoluzione 2026, con webapp mobile, dashboard per TV e pannello admin.

## 🎯 Funzionalità

### Webapp Votazione (Mobile)
- Selezione categoria (Ho.Re.Ca. / Appassionato)
- Email obbligatoria per validazione
- Selezione 3 preferenze (3pt, 2pt, 1pt)
- Prevenzione doppi voti (localStorage + email)
- Design elegante ottimizzato per mobile

### Dashboard (TV Grande)
- Classifica real-time separata per categoria
- Countdown configurabile
- Solo posizioni, senza numeri di voti
- Aggiornamento automatico ogni 5 secondi
- Design dark adatto per proiezione

### Pannello Admin
- CRUD aziende partecipanti
- Configurazione countdown
- Apertura/chiusura votazioni
- Statistiche voti in tempo reale

---

## 🚀 Quick Start

### 1. Setup Supabase

1. Crea un progetto su [supabase.com](https://supabase.com)
2. Vai su **SQL Editor**
3. Copia e incolla il contenuto di `supabase-setup.sql`
4. Esegui lo script
5. Vai su **Settings > API** e copia:
   - Project URL
   - anon/public key

### 2. Configurazione App

Apri `src/App.jsx` e modifica le prime righe:

```javascript
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co';
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY';
const MOCK_MODE = false; // Metti false per usare Supabase
```

### 3. Installazione e Avvio

```bash
# Installa dipendenze
npm install

# Avvia in development
npm run dev
```

### 4. Deploy

```bash
# Build per produzione
npm run build

# Deploy su Vercel (consigliato)
npx vercel
```

---

## 📱 URL della Webapp

Dopo il deploy avrai questi URL:

| Pagina | URL | Uso |
|--------|-----|-----|
| **Votazione** | `tuodominio.com/` | QR Code per totem/A1 |
| **Dashboard** | `tuodominio.com/dashboard` | TV grande |
| **Admin** | `tuodominio.com/admin` | Gestione (proteggere!) |

---

## 🔧 Configurazione Evento

### Dal Pannello Admin:

1. **Aziende**: Aggiungi le aziende partecipanti
2. **Countdown**: Imposta data/ora fine votazioni
3. **Apertura**: Spunta "Votazioni Aperte" quando pronti

### QR Code:

Genera il QR code che punta a `https://tuodominio.com/` usando:
- [QR Code Generator](https://www.qr-code-generator.com/)
- O qualsiasi altro generatore

---

## 🎨 Personalizzazione

### Colori (in `styles` dentro App.jsx):

```css
:root {
  --burgundy: #722F37;      /* Colore principale */
  --gold: #C9A962;          /* Accenti */
  --cream: #FAF8F5;         /* Sfondo */
  --charcoal: #2C2C2C;      /* Testo */
}
```

### Logo Evento:

Sostituisci il testo "EVOLUZIONE" con un'immagine nel componente `voting-header`.

---

## 🔒 Sicurezza

### Proteggere il Pannello Admin:

**Opzione 1 - Basic Auth (semplice)**
```javascript
// Aggiungi all'inizio di AdminPanel
const [authed, setAuthed] = useState(false);
const password = prompt('Password admin:');
if (password !== 'tuapassword') return <div>Accesso negato</div>;
```

**Opzione 2 - Supabase Auth (consigliato)**
Implementa autenticazione Supabase per l'admin.

### RLS Supabase:

Per produzione, mantieni attive le Row Level Security policies.

---

## 📊 Sistema di Punteggio

| Preferenza | Punti |
|------------|-------|
| 1° scelta | 3 punti |
| 2° scelta | 2 punti |
| 3° scelta | 1 punto |

Le classifiche sono separate:
- **Premio Ho.Re.Ca.**: voti degli operatori
- **Premio Appassionati**: voti degli appassionati

---

## 🐛 Troubleshooting

### I voti non appaiono nella dashboard
- Verifica che `MOCK_MODE = false`
- Controlla le credenziali Supabase
- Verifica che RLS permetta le letture

### Il countdown non funziona
- Assicurati che la data sia nel futuro
- Formato corretto: datetime-local nel pannello admin

### Errore CORS
- Aggiungi il tuo dominio alle origini permesse in Supabase

---

## 📁 Struttura Progetto

```
evoluzione-voting/
├── src/
│   └── App.jsx          # App completa (voting, dashboard, admin)
├── supabase-setup.sql   # Script database
├── package.json
└── README.md
```

---

## 🎪 Giorno dell'Evento - Checklist

- [ ] Carica le aziende nel pannello admin
- [ ] Imposta data/ora fine votazioni
- [ ] Genera e stampa QR code
- [ ] Testa la votazione dal cellulare
- [ ] Collega la TV alla dashboard
- [ ] Apri le votazioni
- [ ] Monitora i voti in tempo reale

---

## 📞 Supporto

Per problemi tecnici durante l'evento, contattare Virgilio.

---

**Buona votazione! 🍷**
