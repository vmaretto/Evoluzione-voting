import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// CONFIGURAZIONE SUPABASE
// ============================================================================
const SUPABASE_URL = 'https://pwhqkdivgumrsubpinrv.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3aHFrZGl2Z3VtcnN1YnBpbnJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NjQzNjQsImV4cCI6MjA4MDE0MDM2NH0.CTVRq2k9-Aw9jIcREcVmEKphoCyuDU-IzERqxNTo_rY';

// ============================================================================
// MOCK DATA - Per sviluppo senza Supabase
// ============================================================================
const MOCK_MODE = false; // Supabase configurato

const mockAziende = [
  { id: '1', nome: 'Abbraccio', regione: 'Toscana', attiva: true },
  { id: '2', nome: 'Accademia Olearia', regione: 'Sardegna', attiva: true },
  { id: '3', nome: 'Az. Agr. Marcoaldi Roberta', regione: 'Lazio', attiva: true },
  { id: '4', nome: 'Az. Agr. Mazzeranghi Bernardo', regione: 'Lazio', attiva: true },
  { id: '5', nome: 'Azienda Agraria Fratelli Caporali', regione: 'Umbria', attiva: true },
  { id: '6', nome: 'Cerrosughero', regione: 'Lazio', attiva: true },
  { id: '7', nome: 'Cinque Colli', regione: 'Sicilia', attiva: true },
  { id: '8', nome: 'CM Centumbrie', regione: 'Umbria', attiva: true },
  { id: '9', nome: 'Colli Etruschi', regione: 'Lazio', attiva: true },
  { id: '10', nome: 'Diamante Verde', regione: 'Lazio', attiva: true },
  { id: '11', nome: 'Fattoria Ambrosio 1938', regione: 'Campania', attiva: true },
  { id: '12', nome: 'Frantoio di Sant\'Agata d\'Oneglia', regione: 'Liguria', attiva: true },
  { id: '13', nome: 'Frantoio Franci', regione: 'Toscana', attiva: true },
  { id: '14', nome: 'Frantoio Gaudenzi', regione: 'Umbria', attiva: true },
  { id: '15', nome: 'Frantoio Oleario Bigucci', regione: 'Emilia-Romagna', attiva: true },
  { id: '16', nome: 'Frantoio Romano', regione: 'Campania', attiva: true },
  { id: '17', nome: 'Frantoio San Comaio', regione: 'Campania', attiva: true },
  { id: '18', nome: 'I&P', regione: 'Lazio', attiva: true },
  { id: '19', nome: 'KAIROS Cooperativa sociale ARL Onlus ETS', regione: 'Molise', attiva: true },
  { id: '20', nome: 'La Goccia d\'Oro', regione: 'Sicilia', attiva: true },
  { id: '21', nome: 'La Rosciola', regione: 'Lazio', attiva: true },
  { id: '22', nome: 'LunaVera di Sebastiano Fadda', regione: 'Sardegna', attiva: true },
  { id: '23', nome: 'Mandranova', regione: 'Sicilia', attiva: true },
  { id: '24', nome: 'Marfuga', regione: 'Umbria', attiva: true },
  { id: '25', nome: 'Marina Colonna - Colonna Olive Oil', regione: 'Molise', attiva: true },
  { id: '26', nome: 'Mezzecrete', regione: 'Toscana', attiva: true },
  { id: '27', nome: 'Mio Padre è un Albero', regione: 'Puglia', attiva: true },
  { id: '28', nome: 'Molino7Cento', regione: 'Lazio', attiva: true },
  { id: '29', nome: 'Oilivis, l\'oliva del Gargano', regione: 'Puglia', attiva: true },
  { id: '30', nome: 'Olearia San Giorgio', regione: 'Calabria', attiva: true },
  { id: '31', nome: 'Olio Evo Cappelli', regione: 'Lazio', attiva: true },
  { id: '32', nome: 'Olio Traldi di Francesca Boni', regione: 'Lazio', attiva: true },
  { id: '33', nome: 'Olivicola di Canino', regione: 'Lazio', attiva: true },
  { id: '34', nome: 'Olivieri Società Agricola', regione: 'Puglia', attiva: true },
  { id: '35', nome: 'Palazzo di Varignana', regione: 'Emilia-Romagna', attiva: true },
  { id: '36', nome: 'PozzoSerpi', regione: 'Puglia', attiva: true },
  { id: '37', nome: 'Solatìa Farm', regione: 'Lazio', attiva: true },
  { id: '38', nome: 'Tenute Librandi Pasquale', regione: 'Calabria', attiva: true },
];

const mockConfig = {
  countdown_end: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 ore da ora
  voting_open: true,
  event_name: 'EVOluzione',
};

// Mock voti per testing statistiche
const mockVoti = [
  { id: 1, categoria: 'horeca', email: 'test1@test.com', azienda_1: '1', azienda_2: '13', azienda_3: '24' },
  { id: 2, categoria: 'horeca', email: 'test2@test.com', azienda_1: '13', azienda_2: '1', azienda_3: '26' },
  { id: 3, categoria: 'horeca', email: 'test3@test.com', azienda_1: '24', azienda_2: '13', azienda_3: '1' },
  { id: 4, categoria: 'appassionato', email: 'test4@test.com', azienda_1: '26', azienda_2: '24', azienda_3: '13' },
  { id: 5, categoria: 'appassionato', email: 'test5@test.com', azienda_1: '13', azienda_2: '26', azienda_3: '24' },
  { id: 6, categoria: 'appassionato', email: 'test6@test.com', azienda_1: '24', azienda_2: '13', azienda_3: '1' },
  { id: 7, categoria: 'horeca', email: 'test7@test.com', azienda_1: '1', azienda_2: '24', azienda_3: '13' },
  { id: 8, categoria: 'appassionato', email: 'test8@test.com', azienda_1: '26', azienda_2: '1', azienda_3: '13' },
];

// ============================================================================
// SUPABASE CLIENT (semplificato)
// ============================================================================
const supabase = {
  from: (table) => ({
    select: async (columns = '*') => {
      if (MOCK_MODE) {
        if (table === 'aziende') return { data: mockAziende, error: null };
        if (table === 'config') return { data: [mockConfig], error: null };
        if (table === 'voti') return { data: mockVoti, error: null };
        return { data: [], error: null };
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
        headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
      });
      return { data: await res.json(), error: null };
    },
    insert: async (data) => {
      if (MOCK_MODE) {
        console.log('Mock insert:', table, data);
        return { data, error: null };
      }
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: { 
          apikey: SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          Prefer: 'return=representation'
        },
        body: JSON.stringify(data)
      });
      return { data: await res.json(), error: null };
    },
    update: async (data) => ({
      eq: async (col, val) => {
        if (MOCK_MODE) {
          console.log('Mock update:', table, data, col, val);
          return { data, error: null };
        }
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
          method: 'PATCH',
          headers: { 
            apikey: SUPABASE_ANON_KEY, 
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
          },
          body: JSON.stringify(data)
        });
        return { data: await res.json(), error: null };
      }
    }),
    delete: () => ({
      eq: async (col, val) => {
        if (MOCK_MODE) {
          console.log('Mock delete:', table, col, val);
          return { error: null };
        }
        await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=eq.${val}`, {
          method: 'DELETE',
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        });
        return { error: null };
      },
      neq: async (col, val) => {
        if (MOCK_MODE) {
          console.log('Mock delete all:', table);
          // In mock mode svuotiamo l'array mockVoti
          mockVoti.length = 0;
          return { error: null };
        }
        await fetch(`${SUPABASE_URL}/rest/v1/${table}?${col}=neq.${val}`, {
          method: 'DELETE',
          headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
        });
        return { error: null };
      }
    }),
  }),
  rpc: async (fn, params) => {
    if (MOCK_MODE) {
      // Simula classifica mock
      return { 
        data: mockAziende.map((a, i) => ({ 
          ...a, 
          punteggio: Math.floor(Math.random() * 50),
          posizione: i + 1 
        })).sort((a, b) => b.punteggio - a.punteggio),
        error: null 
      };
    }
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: 'POST',
      headers: { 
        apikey: SUPABASE_ANON_KEY, 
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    return { data: await res.json(), error: null };
  }
};

// ============================================================================
// STYLES
// ============================================================================
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Outfit:wght@300;400;500;600&display=swap');
  
  :root {
    --olive: #7A8231;
    --olive-dark: #5A6024;
    --bronze: #A68A2C;
    --mustard: #C9B535;
    --lime: #E0D654;
    --sage: #C5C9B0;
    --cream: #FAF8F5;
    --charcoal: #2C2C2C;
    --silver: #6B6B6B;
  }
  
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  
  body {
    font-family: 'Outfit', sans-serif;
    background: var(--cream);
    color: var(--charcoal);
    min-height: 100vh;
  }
  
  .app-container {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--cream) 0%, #f5f0e8 100%);
  }
  
  /* ==================== VOTING APP ==================== */
  .voting-app {
    min-height: 100vh;
    padding: 20px;
    max-width: 480px;
    margin: 0 auto;
  }
  
  .voting-header {
    text-align: center;
    padding: 30px 0;
  }

  .voting-header .logo {
    max-width: 280px;
    height: auto;
  }
  
  .voting-card {
    background: white;
    border-radius: 20px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(122, 130, 49, 0.1);
    margin-bottom: 20px;
  }
  
  .step-indicator {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-bottom: 30px;
  }
  
  .step-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--sage);
    transition: all 0.3s;
  }
  
  .step-dot.active {
    background: var(--olive);
    transform: scale(1.3);
  }
  
  .step-dot.completed {
    background: var(--mustard);
  }
  
  .step-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--olive);
    text-align: center;
    margin-bottom: 10px;
  }
  
  .step-subtitle {
    text-align: center;
    color: var(--silver);
    margin-bottom: 25px;
    font-size: 0.9rem;
  }
  
  /* Category Selection */
  .category-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .category-btn {
    padding: 25px;
    border: 2px solid var(--sage);
    border-radius: 15px;
    background: white;
    cursor: pointer;
    transition: all 0.3s;
    text-align: left;
  }
  
  .category-btn:hover {
    border-color: var(--olive);
    transform: translateY(-2px);
    box-shadow: 0 5px 20px rgba(122, 130, 49, 0.15);
  }
  
  .category-btn.selected {
    border-color: var(--olive);
    background: linear-gradient(135deg, var(--olive) 0%, var(--olive-dark) 100%);
    color: white;
  }
  
  .category-btn .icon {
    font-size: 2rem;
    margin-bottom: 10px;
  }
  
  .category-btn .label {
    font-weight: 600;
    font-size: 1.1rem;
  }
  
  .category-btn .desc {
    font-size: 0.85rem;
    opacity: 0.7;
    margin-top: 5px;
  }
  
  /* Email Input */
  .email-input {
    width: 100%;
    padding: 18px 20px;
    border: 2px solid var(--sage);
    border-radius: 12px;
    font-size: 1rem;
    font-family: 'Outfit', sans-serif;
    transition: all 0.3s;
    outline: none;
  }
  
  .email-input:focus {
    border-color: var(--olive);
    box-shadow: 0 0 0 4px rgba(122, 130, 49, 0.1);
  }
  
  .email-input.error {
    border-color: #e74c3c;
  }
  
  .error-message {
    color: #e74c3c;
    font-size: 0.85rem;
    margin-top: 8px;
  }
  
  /* Company List */
  .company-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-height: 400px;
    overflow-y: auto;
    padding-right: 10px;
  }
  
  .company-item {
    display: flex;
    align-items: center;
    padding: 15px;
    border: 2px solid var(--sage);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s;
    background: white;
  }
  
  .company-item:hover {
    border-color: var(--mustard);
    transform: translateX(5px);
  }
  
  .company-item.selected-1 {
    border-color: var(--mustard);
    background: linear-gradient(135deg, #fff9e6 0%, #fff 100%);
  }
  
  .company-item.selected-2 {
    border-color: var(--silver);
    background: linear-gradient(135deg, #f5f5f5 0%, #fff 100%);
  }
  
  .company-item.selected-3 {
    border-color: #CD7F32;
    background: linear-gradient(135deg, #fdf5eb 0%, #fff 100%);
  }
  
  .company-logo {
    width: 50px;
    height: 50px;
    border-radius: 10px;
    background: var(--cream);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    color: var(--olive);
    margin-right: 15px;
    flex-shrink: 0;
  }
  
  .company-name {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .company-name-text {
    font-weight: 600;
    color: var(--charcoal);
  }

  .company-region {
    font-size: 0.85rem;
    font-weight: 400;
    color: var(--silver);
  }
  
  .selection-badge {
    width: 35px;
    height: 35px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9rem;
  }
  
  .badge-1 {
    background: linear-gradient(135deg, var(--mustard) 0%, #b8963a 100%);
    color: white;
  }
  
  .badge-2 {
    background: linear-gradient(135deg, #C0C0C0 0%, #a0a0a0 100%);
    color: white;
  }
  
  .badge-3 {
    background: linear-gradient(135deg, #CD7F32 0%, #a66928 100%);
    color: white;
  }
  
  .selection-summary {
    background: var(--cream);
    border-radius: 12px;
    padding: 15px;
    margin-top: 20px;
  }
  
  .selection-summary h4 {
    font-size: 0.85rem;
    color: var(--silver);
    margin-bottom: 10px;
  }
  
  .selection-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 0;
    border-bottom: 1px solid rgba(0,0,0,0.05);
  }
  
  .selection-row:last-child {
    border-bottom: none;
  }
  
  .points {
    font-size: 0.75rem;
    color: var(--silver);
    margin-left: auto;
  }
  
  /* Buttons */
  .btn-primary {
    width: 100%;
    padding: 18px;
    background: linear-gradient(135deg, var(--olive) 0%, var(--olive-dark) 100%);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Outfit', sans-serif;
    margin-top: 20px;
  }
  
  .btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(122, 130, 49, 0.3);
  }
  
  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .btn-secondary {
    width: 100%;
    padding: 15px;
    background: transparent;
    color: var(--olive);
    border: 2px solid var(--olive);
    border-radius: 12px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;
    font-family: 'Outfit', sans-serif;
    margin-top: 10px;
  }
  
  .btn-secondary:hover {
    background: var(--olive);
    color: white;
  }
  
  /* Thank You */
  .thank-you {
    text-align: center;
    padding: 40px 20px;
  }
  
  .thank-you .icon {
    font-size: 4rem;
    margin-bottom: 20px;
  }
  
  .thank-you h2 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--olive);
    margin-bottom: 15px;
  }
  
  .thank-you p {
    color: var(--silver);
    line-height: 1.6;
  }
  
  /* ==================== DASHBOARD ==================== */
  .classifica {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--cream) 0%, #f5f0e8 100%);
    color: var(--charcoal);
    padding: 40px;
    overflow: hidden;
  }

  .classifica-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .classifica-header .logo {
    max-width: 400px;
    height: auto;
    margin-bottom: 15px;
  }

  .classifica-header .subtitle {
    font-size: 1.2rem;
    color: var(--olive);
    margin-top: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  .countdown-container {
    text-align: center;
    margin-bottom: 50px;
  }

  .countdown {
    display: inline-flex;
    gap: 20px;
    background: white;
    padding: 25px 50px;
    border-radius: 20px;
    border: 2px solid var(--sage);
    box-shadow: 0 5px 20px rgba(122, 130, 49, 0.1);
  }

  .countdown-unit {
    text-align: center;
  }

  .countdown-value {
    font-family: 'Playfair Display', serif;
    font-size: 4rem;
    color: var(--olive);
    line-height: 1;
  }

  .countdown-label {
    font-size: 0.9rem;
    color: var(--silver);
    margin-top: 5px;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .countdown-separator {
    font-size: 3rem;
    color: var(--olive);
    opacity: 0.5;
    align-self: flex-start;
    padding-top: 10px;
  }

  .rankings-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .ranking-column {
    background: white;
    border-radius: 25px;
    padding: 30px;
    border: 2px solid var(--sage);
    box-shadow: 0 5px 20px rgba(122, 130, 49, 0.1);
  }

  .ranking-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    color: var(--olive);
    text-align: center;
    margin-bottom: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 15px;
  }

  .ranking-title .emoji {
    font-size: 2rem;
  }

  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .ranking-item {
    display: flex;
    align-items: center;
    padding: 18px 20px;
    background: var(--cream);
    border-radius: 15px;
    transition: all 0.3s;
  }

  .ranking-item:hover {
    background: rgba(122, 130, 49, 0.1);
    transform: translateX(10px);
  }

  .ranking-item.top-1 {
    background: linear-gradient(135deg, var(--olive) 0%, var(--olive-dark) 100%);
    border: none;
  }

  .ranking-item.top-1 .ranking-name,
  .ranking-item.top-1 .ranking-name-text {
    color: white;
  }

  .ranking-item.top-1 .ranking-region {
    color: rgba(255, 255, 255, 0.8);
  }

  .ranking-item.top-2 {
    background: linear-gradient(135deg, var(--sage) 0%, #b8bda0 100%);
    border: none;
  }

  .ranking-item.top-2 .ranking-name,
  .ranking-item.top-2 .ranking-name-text {
    color: var(--charcoal);
  }

  .ranking-item.top-3 {
    background: linear-gradient(135deg, #d4c9a8 0%, #c5b896 100%);
    border: none;
  }

  .ranking-item.top-3 .ranking-name,
  .ranking-item.top-3 .ranking-name-text {
    color: var(--charcoal);
  }

  .ranking-position {
    font-family: 'Playfair Display', serif;
    font-size: 1.8rem;
    width: 50px;
    text-align: center;
    color: var(--olive);
  }

  .ranking-item.top-1 .ranking-position { color: var(--mustard); }
  .ranking-item.top-2 .ranking-position { color: var(--charcoal); }
  .ranking-item.top-3 .ranking-position { color: #8B6914; }

  .ranking-name {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: 15px;
  }

  .ranking-name-text {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--charcoal);
  }

  .ranking-region {
    font-size: 0.9rem;
    font-weight: 400;
    color: var(--silver);
  }

  .ranking-medal {
    font-size: 2rem;
  }

  .ranking-empty {
    text-align: center;
    padding: 40px 20px;
    color: var(--silver);
    font-style: italic;
  }

  .voting-closed {
    text-align: center;
    padding: 60px;
  }

  .voting-closed h2 {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    color: var(--olive);
    margin-bottom: 20px;
  }
  
  /* ==================== ADMIN PANEL ==================== */
  .admin-panel {
    min-height: 100vh;
    padding: 30px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--sage);
  }
  
  .admin-header h1 {
    font-family: 'Playfair Display', serif;
    font-size: 2rem;
    color: var(--olive);
  }
  
  .admin-nav {
    display: flex;
    gap: 10px;
  }
  
  .admin-nav button {
    padding: 10px 20px;
    border: 2px solid var(--olive);
    background: white;
    color: var(--olive);
    border-radius: 8px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .admin-nav button.active,
  .admin-nav button:hover {
    background: var(--olive);
    color: white;
  }
  
  .admin-section {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.08);
    margin-bottom: 25px;
  }
  
  .admin-section h2 {
    font-family: 'Playfair Display', serif;
    color: var(--olive);
    margin-bottom: 20px;
    font-size: 1.3rem;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 8px;
    font-weight: 500;
    color: var(--charcoal);
  }
  
  .form-input {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid var(--sage);
    border-radius: 8px;
    font-size: 1rem;
    font-family: 'Outfit', sans-serif;
    transition: all 0.3s;
  }
  
  .form-input:focus {
    outline: none;
    border-color: var(--olive);
  }
  
  .company-admin-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .company-admin-item {
    display: flex;
    align-items: center;
    padding: 15px;
    background: var(--cream);
    border-radius: 10px;
    gap: 15px;
  }
  
  .company-admin-item .name {
    flex: 1;
    font-weight: 500;
  }
  
  .company-admin-item button {
    padding: 8px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .btn-edit {
    background: var(--mustard);
    color: white;
  }
  
  .btn-delete {
    background: #e74c3c;
    color: white;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
  }
  
  .stat-card {
    background: var(--cream);
    border-radius: 12px;
    padding: 25px;
    text-align: center;
  }
  
  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 3rem;
    color: var(--olive);
  }
  
  .stat-label {
    color: var(--silver);
    margin-top: 5px;
  }
  
  /* Navigation */
  .app-nav {
    position: fixed;
    bottom: 55px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    background: white;
    padding: 10px;
    border-radius: 50px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.15);
    z-index: 100;
  }
  
  .nav-btn {
    padding: 12px 20px;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s;
    font-family: 'Outfit', sans-serif;
    background: transparent;
    color: var(--charcoal);
  }
  
  .nav-btn.active {
    background: var(--olive);
    color: white;
  }

  /* Footer */
  .app-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--charcoal);
    color: var(--cream);
    text-align: center;
    padding: 12px 20px;
    font-size: 0.85rem;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
    z-index: 99;
  }

  .app-footer a {
    color: var(--sage);
    text-decoration: none;
    transition: color 0.3s;
  }

  .app-footer a:hover {
    color: var(--mustard);
    text-decoration: underline;
  }

  .footer-separator {
    color: var(--silver);
  }

  /* Responsive */
  @media (max-width: 768px) {
    .classifica {
      padding: 20px;
      padding-bottom: 150px;
    }

    .classifica-header .logo {
      max-width: 280px;
    }

    .countdown {
      padding: 15px 25px;
      gap: 15px;
    }

    .countdown-value {
      font-size: 2.5rem;
    }

    .rankings-container {
      grid-template-columns: 1fr;
      gap: 20px;
    }

    /* Admin Header - stack vertical forzato */
    .admin-header {
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      gap: 15px;
    }

    .admin-header h1 {
      font-size: 1.5rem;
      text-align: center;
      width: 100%;
    }

    /* Admin Nav Tabs - wrapping completo */
    .admin-nav {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 8px;
    }

    .admin-nav button {
      flex: 1 1 auto;
      min-width: 100px;
      text-align: center;
      padding: 10px 15px;
      font-size: 0.9rem;
    }

    /* Admin Panel responsive */
    .admin-panel {
      padding: 15px;
      padding-bottom: 150px;
    }

    .admin-section {
      padding: 15px;
    }

    /* Form Aggiungi Azienda - stack verticale */
    .admin-section > div[style*="display: flex"] {
      flex-direction: column !important;
    }

    .admin-section > div[style*="display: flex"] input {
      width: 100% !important;
    }

    .admin-section > div[style*="display: flex"] .btn-primary {
      width: 100% !important;
      margin-top: 10px;
    }

    /* Company Admin Item - layout verticale su mobile */
    .company-admin-item {
      flex-wrap: wrap;
      gap: 10px;
      position: relative;
    }

    .company-admin-item > span:first-child {
      position: absolute;
      left: 15px;
      top: 15px;
    }

    .company-admin-item .name {
      flex: 1 1 100%;
      margin-bottom: 8px;
      padding-left: 35px;
    }

    .company-admin-item button {
      flex: 1;
      min-width: 80px;
      padding: 10px 15px;
      font-size: 0.9rem;
    }

    /* Voting App padding */
    .voting-app {
      padding-bottom: 150px;
    }
  }

  /* Small mobile (iPhone SE, etc.) */
  @media (max-width: 480px) {
    .admin-header h1 {
      font-size: 1.3rem;
    }

    .admin-nav button {
      padding: 8px 12px;
      font-size: 0.8rem;
      min-width: 90px;
    }

    .app-nav {
      bottom: 45px;
      padding: 8px 10px;
      gap: 5px;
    }

    .nav-btn {
      padding: 8px 12px;
      font-size: 0.8rem;
    }

    .app-footer {
      padding: 8px 10px;
      font-size: 0.7rem;
    }

    .countdown {
      padding: 12px 15px;
      gap: 10px;
    }

    .countdown-value {
      font-size: 2rem;
    }

    .countdown-label {
      font-size: 0.75rem;
    }

    .company-admin-item button {
      padding: 8px 12px;
      font-size: 0.8rem;
    }
  }

  /* Animations */
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  
  .pulse {
    animation: pulse 2s infinite;
  }
`;

// ============================================================================
// VOTING APP COMPONENT
// ============================================================================
function VotingApp({ aziende, config }) {
  const [step, setStep] = useState(1);
  const [categoria, setCategoria] = useState(null);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [selections, setSelections] = useState([null, null, null]);
  const [submitted, setSubmitted] = useState(false);
  const [alreadyVoted, setAlreadyVoted] = useState(false);

  useEffect(() => {
    // Check localStorage per voto già espresso
    const voted = localStorage.getItem('evoluzione_voted');
    if (voted) setAlreadyVoted(true);
  }, []);

  const validateEmail = (e) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(e);
  };

  const handleEmailSubmit = () => {
    if (!validateEmail(email)) {
      setEmailError('Inserisci un indirizzo email valido');
      return;
    }
    setEmailError('');
    setStep(3);
  };

  const handleCompanyClick = (azienda) => {
    const currentIndex = selections.findIndex(s => s?.id === azienda.id);
    
    if (currentIndex !== -1) {
      // Rimuovi selezione
      const newSelections = [...selections];
      newSelections[currentIndex] = null;
      setSelections(newSelections);
    } else {
      // Aggiungi alla prima posizione libera
      const emptyIndex = selections.findIndex(s => s === null);
      if (emptyIndex !== -1) {
        const newSelections = [...selections];
        newSelections[emptyIndex] = azienda;
        setSelections(newSelections);
      }
    }
  };

  const getSelectionIndex = (aziendaId) => {
    return selections.findIndex(s => s?.id === aziendaId);
  };

  const handleSubmit = async () => {
    const voto = {
      categoria,
      email,
      azienda_1: selections[0]?.id,
      azienda_2: selections[1]?.id,
      azienda_3: selections[2]?.id,
      device_hash: btoa(navigator.userAgent + screen.width),
      created_at: new Date().toISOString()
    };

    await supabase.from('voti').insert(voto);
    localStorage.setItem('evoluzione_voted', 'true');
    setSubmitted(true);
  };

  if (!config?.voting_open) {
    return (
      <div className="voting-app">
        <div className="voting-header">
          <img src="/logo_evoluzione.png" alt="EVOluzione" className="logo" />
        </div>
        <div className="voting-card">
          <div className="thank-you">
            <div className="icon">⏰</div>
            <h2>Votazioni Chiuse</h2>
            <p>Le votazioni non sono attualmente aperte. Grazie per l'interesse!</p>
          </div>
        </div>
      </div>
    );
  }

  if (alreadyVoted || submitted) {
    return (
      <div className="voting-app">
        <div className="voting-header">
          <img src="/logo_evoluzione.png" alt="EVOluzione" className="logo" />
        </div>
        <div className="voting-card animate-in">
          <div className="thank-you">
            <div className="icon">🎉</div>
            <h2>Grazie!</h2>
            <p>Il tuo voto è stato registrato con successo. I risultati sono visualizzabili real time sulla classifica e quelli definitivi saranno annunciati al termine dell'evento.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="voting-app">
      <div className="voting-header">
        <img src="/logo_evoluzione.png" alt="EVOluzione" className="logo" />
      </div>

      <div className="step-indicator">
        {[1, 2, 3].map(s => (
          <div
            key={s}
            className={`step-dot ${step === s ? 'active' : ''} ${step > s ? 'completed' : ''}`}
          />
        ))}
      </div>

      <div className="voting-card animate-in" key={step}>
        {step === 1 && (
          <>
            <h3 className="step-title">Chi sei?</h3>
            <p className="step-subtitle">Seleziona la tua categoria</p>
            <div className="category-buttons">
              <button 
                className={`category-btn ${categoria === 'horeca' ? 'selected' : ''}`}
                onClick={() => { setCategoria('horeca'); setStep(2); }}
              >
                <div className="icon">🍽️</div>
                <div className="label">Operatore Ho.Re.Ca.</div>
                <div className="desc">Ristoratori, sommelier, buyer, distributori</div>
              </button>
              <button 
                className={`category-btn ${categoria === 'appassionato' ? 'selected' : ''}`}
                onClick={() => { setCategoria('appassionato'); setStep(2); }}
              >
                <div className="icon">❤️</div>
                <div className="label">Appassionato</div>
                <div className="desc">Wine lover, assaggiatore</div>
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h3 className="step-title">La tua email</h3>
            <p className="step-subtitle">Necessaria per validare il voto</p>
            <input
              type="email"
              className={`email-input ${emailError ? 'error' : ''}`}
              placeholder="nome@esempio.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
            />
            {emailError && <p className="error-message">{emailError}</p>}
            <button className="btn-primary" onClick={handleEmailSubmit}>
              Continua
            </button>
            <button className="btn-secondary" onClick={() => setStep(1)}>
              Indietro
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h3 className="step-title">Le tue preferenze</h3>
            <p className="step-subtitle">Seleziona fino a 3 aziende in ordine di preferenza</p>
            <div className="company-list">
              {aziende.filter(a => a.attiva !== false).map(azienda => {
                const selIndex = getSelectionIndex(azienda.id);
                return (
                  <div
                    key={azienda.id}
                    className={`company-item ${selIndex !== -1 ? `selected-${selIndex + 1}` : ''}`}
                    onClick={() => handleCompanyClick(azienda)}
                  >
                    <div className="company-logo">
                      <img src={azienda.logo_url || '/alberello.png'} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 10 }} />
                    </div>
                    <div className="company-name">
                      <span className="company-name-text">{azienda.nome}</span>
                      {azienda.regione && <span className="company-region">{azienda.regione}</span>}
                    </div>
                    {selIndex !== -1 && (
                      <div className={`selection-badge badge-${selIndex + 1}`}>
                        {selIndex + 1}°
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {selections.some(s => s !== null) && (
              <div className="selection-summary">
                <h4>Le tue scelte</h4>
                {selections.map((sel, idx) => sel && (
                  <div key={idx} className="selection-row">
                    <div className={`selection-badge badge-${idx + 1}`} style={{ width: 25, height: 25, fontSize: '0.75rem' }}>
                      {idx + 1}°
                    </div>
                    <span>{sel.nome}</span>
                    <span className="points">{3 - idx} {3 - idx === 1 ? 'punto' : 'punti'}</span>
                  </div>
                ))}
              </div>
            )}

            <button
              className="btn-primary"
              disabled={selections.filter(s => s !== null).length < 1}
              onClick={handleSubmit}
            >
              {selections.filter(s => s !== null).length < 1
                ? 'Seleziona almeno 1 azienda'
                : `Conferma scelte (${selections.filter(s => s !== null).length}/3)`}
            </button>
            <button className="btn-secondary" onClick={() => setStep(2)}>
              Indietro
            </button>
          </>
        )}

      </div>
    </div>
  );
}

// ============================================================================
// CLASSIFICA COMPONENT
// ============================================================================
const MIN_VOTI_CLASSIFICA = 3;

function Classifica({ config }) {
  const [classificaHoreca, setClassificaHoreca] = useState([]);
  const [classificaAppassionati, setClassificaAppassionati] = useState([]);
  const [numVotiHoreca, setNumVotiHoreca] = useState(0);
  const [numVotiAppassionati, setNumVotiAppassionati] = useState(0);
  const [countdown, setCountdown] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [votingEnded, setVotingEnded] = useState(false);

  const fetchClassifiche = useCallback(async () => {
    // In produzione userai una RPC function o una view
    const { data: voti } = await supabase.from('voti').select('*');
    const { data: aziende } = await supabase.from('aziende').select('*');

    // Conta voti per categoria
    const votiHoreca = voti?.filter(v => v.categoria === 'horeca').length || 0;
    const votiAppassionati = voti?.filter(v => v.categoria === 'appassionato').length || 0;
    setNumVotiHoreca(votiHoreca);
    setNumVotiAppassionati(votiAppassionati);

    // Calcola punteggi
    const calcola = (cat) => {
      const punteggi = {};
      aziende?.forEach(a => { punteggi[a.id] = { ...a, punteggio: 0 }; });

      voti?.filter(v => v.categoria === cat).forEach(v => {
        if (v.azienda_1 && punteggi[v.azienda_1]) punteggi[v.azienda_1].punteggio += 3;
        if (v.azienda_2 && punteggi[v.azienda_2]) punteggi[v.azienda_2].punteggio += 2;
        if (v.azienda_3 && punteggi[v.azienda_3]) punteggi[v.azienda_3].punteggio += 1;
      });

      return Object.values(punteggi)
        .filter(a => a.attiva !== false)
        .sort((a, b) => b.punteggio - a.punteggio);
    };

    setClassificaHoreca(calcola('horeca'));
    setClassificaAppassionati(calcola('appassionato'));
  }, []);

  useEffect(() => {
    fetchClassifiche();
    const interval = setInterval(fetchClassifiche, 5000); // Refresh ogni 5 secondi
    return () => clearInterval(interval);
  }, [fetchClassifiche]);

  useEffect(() => {
    if (!config?.countdown_end) return;
    
    const updateCountdown = () => {
      const end = new Date(config.countdown_end).getTime();
      const now = Date.now();
      const diff = end - now;
      
      if (diff <= 0) {
        setVotingEnded(true);
        setCountdown({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      setCountdown({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000)
      });
    };
    
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [config?.countdown_end]);

  const getMedal = (pos) => {
    if (pos === 0) return '🥇';
    if (pos === 1) return '🥈';
    if (pos === 2) return '🥉';
    return '';
  };

  const getTopClass = (pos) => {
    if (pos === 0) return 'top-1';
    if (pos === 1) return 'top-2';
    if (pos === 2) return 'top-3';
    return '';
  };

  const pad = (n) => n.toString().padStart(2, '0');

  if (votingEnded) {
    return (
      <div className="classifica">
        <div className="classifica-header">
          <img src="/logo_evoluzione.png" alt="EVOluzione" className="logo" />
          <div className="subtitle">Votazioni Concluse</div>
        </div>
        
        <div className="voting-closed">
          <h2>🏆 I Vincitori</h2>
        </div>
        
        <div className="rankings-container">
          <div className="ranking-column">
            <h3 className="ranking-title">
              <span className="emoji">🍽️</span>
              Premio Ho.Re.Ca.
            </h3>
            {classificaHoreca.slice(0, 1).map((azienda) => (
              <div key={azienda.id} className="ranking-item top-1 pulse">
                <div className="ranking-position">🏆</div>
                <div className="ranking-name">
                  <span className="ranking-name-text">{azienda.nome}</span>
                  {azienda.regione && <span className="ranking-region">{azienda.regione}</span>}
                </div>
              </div>
            ))}
          </div>

          <div className="ranking-column">
            <h3 className="ranking-title">
              <span className="emoji">❤️</span>
              Premio Appassionati
            </h3>
            {classificaAppassionati.slice(0, 1).map((azienda) => (
              <div key={azienda.id} className="ranking-item top-1 pulse">
                <div className="ranking-position">🏆</div>
                <div className="ranking-name">
                  <span className="ranking-name-text">{azienda.nome}</span>
                  {azienda.regione && <span className="ranking-region">{azienda.regione}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="classifica">
      <div className="classifica-header">
        <img src="/logo_evoluzione.png" alt="EVOluzione" className="logo" />
        <div className="subtitle">Classifica Live</div>
      </div>
      
      <div className="countdown-container">
        <div className="countdown">
          <div className="countdown-unit">
            <div className="countdown-value">{pad(countdown.hours)}</div>
            <div className="countdown-label">Ore</div>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-unit">
            <div className="countdown-value">{pad(countdown.minutes)}</div>
            <div className="countdown-label">Minuti</div>
          </div>
          <div className="countdown-separator">:</div>
          <div className="countdown-unit">
            <div className="countdown-value">{pad(countdown.seconds)}</div>
            <div className="countdown-label">Secondi</div>
          </div>
        </div>
      </div>
      
      <div className="rankings-container">
        <div className="ranking-column">
          <h3 className="ranking-title">
            <span className="emoji">🍽️</span>
            Classifica Ho.Re.Ca.
          </h3>
          {numVotiHoreca >= MIN_VOTI_CLASSIFICA ? (
            <div className="ranking-list">
              {classificaHoreca.slice(0, 10).map((azienda, idx) => (
                <div key={azienda.id} className={`ranking-item ${getTopClass(idx)}`}>
                  <div className="ranking-position">{idx + 1}</div>
                  <div className="ranking-name">
                    <span className="ranking-name-text">{azienda.nome}</span>
                    {azienda.regione && <span className="ranking-region">{azienda.regione}</span>}
                  </div>
                  <div className="ranking-medal">{getMedal(idx)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ranking-empty">
              <p>In attesa dei primi voti...</p>
            </div>
          )}
        </div>

        <div className="ranking-column">
          <h3 className="ranking-title">
            <span className="emoji">❤️</span>
            Classifica Appassionati
          </h3>
          {numVotiAppassionati >= MIN_VOTI_CLASSIFICA ? (
            <div className="ranking-list">
              {classificaAppassionati.slice(0, 10).map((azienda, idx) => (
                <div key={azienda.id} className={`ranking-item ${getTopClass(idx)}`}>
                  <div className="ranking-position">{idx + 1}</div>
                  <div className="ranking-name">
                    <span className="ranking-name-text">{azienda.nome}</span>
                    {azienda.regione && <span className="ranking-region">{azienda.regione}</span>}
                  </div>
                  <div className="ranking-medal">{getMedal(idx)}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ranking-empty">
              <p>In attesa dei primi voti...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// ADMIN PANEL COMPONENT
// ============================================================================
function AdminPanel({ aziende, setAziende, config, setConfig }) {
  const [activeTab, setActiveTab] = useState('aziende');
  const [newAzienda, setNewAzienda] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');
  const [stats, setStats] = useState({ totale: 0, horeca: 0, appassionati: 0 });
  const [configSaved, setConfigSaved] = useState(false);
  const [configSaving, setConfigSaving] = useState(false);

  // Funzioni helper per formattare data/ora
  const formatDateForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatTimeForInput = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const parseDateTime = (dateStr, timeStr) => {
    // Parsing formato DD/MM/YYYY e HH:MM
    const dateParts = dateStr.split('/');
    if (dateParts.length !== 3) return null;
    const [day, month, year] = dateParts;
    const timeParts = timeStr.split(':');
    if (timeParts.length !== 2) return null;
    const [hours, minutes] = timeParts;
    const date = new Date(year, month - 1, day, hours, minutes);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const [countdownDate, setCountdownDate] = useState(() => formatDateForInput(config?.countdown_end));
  const [countdownTime, setCountdownTime] = useState(() => formatTimeForInput(config?.countdown_end));

  const handleDateTimeChange = (newDate, newTime) => {
    const isoString = parseDateTime(newDate, newTime);
    if (isoString) {
      handleConfigChange('countdown_end', isoString);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const { data: voti } = await supabase.from('voti').select('*');
    setStats({
      totale: voti?.length || 0,
      horeca: voti?.filter(v => v.categoria === 'horeca').length || 0,
      appassionati: voti?.filter(v => v.categoria === 'appassionato').length || 0
    });
  };

  const handleAddAzienda = async () => {
    if (!newAzienda.trim()) return;
    
    const nuova = {
      id: Date.now().toString(),
      nome: newAzienda.trim(),
      logo_url: null,
      attiva: true
    };
    
    await supabase.from('aziende').insert(nuova);
    setAziende([...aziende, nuova]);
    setNewAzienda('');
  };

  const handleDeleteAzienda = async (id) => {
    if (!confirm('Sei sicuro di voler eliminare questa azienda?')) return;
    await supabase.from('aziende').delete().eq('id', id);
    setAziende(aziende.filter(a => a.id !== id));
  };

  const handleEditAzienda = async (id) => {
    if (!editingName.trim()) return;
    await supabase.from('aziende').update({ nome: editingName }).eq('id', id);
    setAziende(aziende.map(a => a.id === id ? { ...a, nome: editingName } : a));
    setEditingId(null);
    setEditingName('');
  };

  const handleConfigChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    setConfigSaved(false); // Indica che ci sono modifiche non salvate
  };

  const saveConfig = async () => {
    setConfigSaving(true);
    await supabase.from('config').update(config).eq('id', 1);
    setConfigSaving(false);
    setConfigSaved(true);
    setTimeout(() => setConfigSaved(false), 3000); // Nasconde "Salvato" dopo 3 secondi
  };

  const handleResetStats = async () => {
    if (!confirm('Sei sicuro? Questa azione cancellerà TUTTI i voti!')) return;

    // Cancella tutti i voti dal database
    await supabase.from('voti').delete().neq('id', 0);

    // Resetta le statistiche locali
    setStats({ totale: 0, horeca: 0, appassionati: 0 });
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>⚙️ Pannello Admin</h1>
        <div className="admin-nav">
          <button 
            className={activeTab === 'aziende' ? 'active' : ''}
            onClick={() => setActiveTab('aziende')}
          >
            Aziende
          </button>
          <button 
            className={activeTab === 'config' ? 'active' : ''}
            onClick={() => setActiveTab('config')}
          >
            Configurazione
          </button>
          <button 
            className={activeTab === 'stats' ? 'active' : ''}
            onClick={() => { setActiveTab('stats'); fetchStats(); }}
          >
            Statistiche
          </button>
        </div>
      </div>

      {activeTab === 'aziende' && (
        <div className="admin-section">
          <h2>Gestione Aziende</h2>
          
          <div style={{ display: 'flex', gap: 10, marginBottom: 25 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Nome nuova azienda"
              value={newAzienda}
              onChange={(e) => setNewAzienda(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddAzienda()}
              style={{ flex: 1 }}
            />
            <button className="btn-primary" style={{ width: 'auto', marginTop: 0, padding: '12px 25px' }} onClick={handleAddAzienda}>
              + Aggiungi
            </button>
          </div>

          <div className="company-admin-list">
            {aziende.map((azienda, idx) => (
              <div key={azienda.id} className="company-admin-item">
                <span style={{ color: 'var(--silver)', width: 30 }}>{idx + 1}.</span>
                {editingId === azienda.id ? (
                  <>
                    <input
                      type="text"
                      className="form-input"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      style={{ flex: 1 }}
                      autoFocus
                    />
                    <button className="btn-edit" onClick={() => handleEditAzienda(azienda.id)}>Salva</button>
                    <button style={{ background: 'var(--silver)', color: 'white', padding: '8px 15px', border: 'none', borderRadius: 6, cursor: 'pointer' }} onClick={() => setEditingId(null)}>Annulla</button>
                  </>
                ) : (
                  <>
                    <span className="name">{azienda.nome}</span>
                    <button className="btn-edit" onClick={() => { setEditingId(azienda.id); setEditingName(azienda.nome); }}>Modifica</button>
                    <button className="btn-delete" onClick={() => handleDeleteAzienda(azienda.id)}>Elimina</button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'config' && (
        <div className="admin-section">
          <h2>Configurazione Evento</h2>
          
          <div className="form-group">
            <label>Nome Evento</label>
            <input
              type="text"
              className="form-input"
              value={config?.event_name || ''}
              onChange={(e) => handleConfigChange('event_name', e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Fine Countdown</label>
            <div style={{ display: 'flex', gap: 15, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--silver)', marginBottom: 5, display: 'block' }}>Data (GG/MM/AAAA)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="DD/MM/YYYY"
                  value={countdownDate}
                  onChange={(e) => {
                    setCountdownDate(e.target.value);
                    handleDateTimeChange(e.target.value, countdownTime);
                  }}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.85rem', color: 'var(--silver)', marginBottom: 5, display: 'block' }}>Ora (HH:MM)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="HH:MM"
                  value={countdownTime}
                  onChange={(e) => {
                    setCountdownTime(e.target.value);
                    handleDateTimeChange(countdownDate, e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <input
                type="checkbox"
                checked={config?.voting_open || false}
                onChange={(e) => handleConfigChange('voting_open', e.target.checked)}
                style={{ width: 20, height: 20 }}
              />
              Votazioni Aperte
            </label>
          </div>

          <div style={{ marginTop: 30, display: 'flex', alignItems: 'center', gap: 15 }}>
            <button
              onClick={saveConfig}
              disabled={configSaving}
              style={{
                background: 'var(--olive)',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                borderRadius: 8,
                fontSize: '1rem',
                fontWeight: 600,
                cursor: configSaving ? 'wait' : 'pointer',
                opacity: configSaving ? 0.7 : 1
              }}
            >
              {configSaving ? 'Salvataggio...' : '💾 Salva Configurazione'}
            </button>
            {configSaved && (
              <span style={{ color: 'green', fontWeight: 600 }}>
                ✓ Salvato!
              </span>
            )}
          </div>
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="admin-section">
          <h2>Statistiche Voti</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{stats.totale}</div>
              <div className="stat-label">Voti Totali</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.horeca}</div>
              <div className="stat-label">Voti Ho.Re.Ca.</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{stats.appassionati}</div>
              <div className="stat-label">Voti Appassionati</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 15, marginTop: 30 }}>
            <button
              className="btn-secondary"
              onClick={fetchStats}
            >
              🔄 Aggiorna Statistiche
            </button>
            <button
              style={{
                padding: '15px 25px',
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 600,
                fontFamily: 'Outfit, sans-serif'
              }}
              onClick={handleResetStats}
            >
              🗑️ Azzera Statistiche
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MAIN APP
// ============================================================================
export default function App() {
  const [view, setView] = useState('vote'); // 'vote' | 'classifica' | 'admin'
  const [aziende, setAziende] = useState([]);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminUrl, setIsAdminUrl] = useState(false);

  useEffect(() => {
    // Determina la view dall'URL
    const path = window.location.pathname;
    if (path.includes('dashboard') || path.includes('classifica')) setView('classifica');
    else if (path.includes('admin')) {
      setView('admin');
      setIsAdminUrl(true);
    }
    else setView('vote');

    // Carica dati iniziali
    loadData();

    // Polling per sincronizzazione config ogni 5 secondi
    const interval = setInterval(async () => {
      const { data: configData } = await supabase.from('config').select('*');
      if (configData?.[0]) {
        setConfig(configData[0]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const { data: aziendeData } = await supabase.from('aziende').select('*');
    const { data: configData } = await supabase.from('config').select('*');

    setAziende(aziendeData || mockAziende);
    setConfig(configData?.[0] || mockConfig);
    setLoading(false);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--cream)',
        fontFamily: 'Playfair Display, serif',
        fontSize: '1.5rem',
        color: 'var(--olive)'
      }}>
        Caricamento...
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {view === 'vote' && <VotingApp aziende={aziende} config={config} />}
        {view === 'classifica' && <Classifica config={config} />}
        {view === 'admin' && <AdminPanel aziende={aziende} setAziende={setAziende} config={config} setConfig={setConfig} />}
        
        {/* Navigation */}
        <div className="app-nav">
          <button className={`nav-btn ${view === 'vote' ? 'active' : ''}`} onClick={() => setView('vote')}>
            Voto
          </button>
          <button className={`nav-btn ${view === 'classifica' ? 'active' : ''}`} onClick={() => setView('classifica')}>
            Classifica
          </button>
          {isAdminUrl && (
            <button className={`nav-btn ${view === 'admin' ? 'active' : ''}`} onClick={() => setView('admin')}>
              Admin
            </button>
          )}
        </div>

        {/* Footer */}
        <footer className="app-footer">
          <span>© 2026 Evoluzione</span>
          <span className="footer-separator">-</span>
          <a href="https://www.evoluzioneolio.com/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span className="footer-separator">-</span>
          <a href="https://www.evoluzioneolio.com/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie Policy</a>
        </footer>
      </div>
    </>
  );
}
