-- ============================================================================
-- EVOLUZIONE 2026 - Database Setup per Supabase
-- ============================================================================

-- Tabella Aziende
CREATE TABLE aziende (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  logo_url TEXT,
  attiva BOOLEAN DEFAULT true,
  ordine INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Voti
CREATE TABLE voti (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL CHECK (categoria IN ('horeca', 'appassionato')),
  email TEXT NOT NULL,
  azienda_1 UUID REFERENCES aziende(id),
  azienda_2 UUID REFERENCES aziende(id),
  azienda_3 UUID REFERENCES aziende(id),
  device_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabella Configurazione
CREATE TABLE config (
  id INT PRIMARY KEY DEFAULT 1,
  event_name TEXT DEFAULT 'Evoluzione 2026',
  countdown_end TIMESTAMP WITH TIME ZONE,
  voting_open BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserisci configurazione iniziale
INSERT INTO config (id, event_name, voting_open) 
VALUES (1, 'Evoluzione 2026', false)
ON CONFLICT (id) DO NOTHING;

-- Indici per performance
CREATE INDEX idx_voti_categoria ON voti(categoria);
CREATE INDEX idx_voti_created ON voti(created_at);
CREATE INDEX idx_aziende_attiva ON aziende(attiva);

-- Row Level Security (opzionale ma consigliato)
ALTER TABLE aziende ENABLE ROW LEVEL SECURITY;
ALTER TABLE voti ENABLE ROW LEVEL SECURITY;
ALTER TABLE config ENABLE ROW LEVEL SECURITY;

-- Policy: Tutti possono leggere le aziende attive
CREATE POLICY "Aziende visibili a tutti" ON aziende
  FOR SELECT USING (attiva = true);

-- Policy: Tutti possono inserire voti
CREATE POLICY "Chiunque può votare" ON voti
  FOR INSERT WITH CHECK (true);

-- Policy: Config leggibile da tutti
CREATE POLICY "Config leggibile" ON config
  FOR SELECT USING (true);

-- Policy per admin (usa il service key o crea un ruolo admin)
-- Per semplicità, disabilita RLS in development:
-- ALTER TABLE aziende DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE voti DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE config DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FUNZIONE per calcolo classifica real-time
-- ============================================================================
CREATE OR REPLACE FUNCTION get_classifica(cat TEXT)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  punteggio BIGINT,
  posizione BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.nome,
    COALESCE(SUM(
      CASE 
        WHEN v.azienda_1 = a.id THEN 3
        WHEN v.azienda_2 = a.id THEN 2
        WHEN v.azienda_3 = a.id THEN 1
        ELSE 0
      END
    ), 0)::BIGINT as punteggio,
    ROW_NUMBER() OVER (ORDER BY COALESCE(SUM(
      CASE 
        WHEN v.azienda_1 = a.id THEN 3
        WHEN v.azienda_2 = a.id THEN 2
        WHEN v.azienda_3 = a.id THEN 1
        ELSE 0
      END
    ), 0) DESC)::BIGINT as posizione
  FROM aziende a
  LEFT JOIN voti v ON v.categoria = cat
  WHERE a.attiva = true
  GROUP BY a.id, a.nome
  ORDER BY punteggio DESC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REAL-TIME (abilita su Supabase Dashboard)
-- ============================================================================
-- Vai su Database > Replication e abilita real-time per:
-- - voti
-- - aziende
-- - config

-- ============================================================================
-- AZIENDE DI ESEMPIO (placeholder)
-- ============================================================================
INSERT INTO aziende (nome, ordine) VALUES
  ('Azienda Demo 1', 1),
  ('Azienda Demo 2', 2),
  ('Azienda Demo 3', 3),
  ('Azienda Demo 4', 4),
  ('Azienda Demo 5', 5),
  ('Azienda Demo 6', 6);
