-- ============================================================
-- GESTIONALE PRESENZE & PERMESSI
-- Eseguire nell'editor SQL di Supabase (una volta sola)
-- ============================================================

-- Tabella dipendenti
CREATE TABLE IF NOT EXISTS dipendenti (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome       TEXT NOT NULL,
  cognome    TEXT NOT NULL,
  email      TEXT,
  matricola  TEXT,
  attivo     BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabella registrazioni assenze
CREATE TABLE IF NOT EXISTS registrazioni (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dipendente_id  UUID NOT NULL REFERENCES dipendenti(id) ON DELETE CASCADE,
  data           DATE NOT NULL,
  tipo           TEXT NOT NULL CHECK (tipo IN ('ferie','malattia','permesso','altro')),
  giorni         NUMERIC(4,1),   -- usato per ferie e malattia (0.5 = mezza giornata)
  ore            NUMERIC(5,2),   -- usato per permesso e altro (es. 2.5 = 2h 30min)
  note           TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT check_unita CHECK (
    (tipo IN ('ferie','malattia') AND giorni IS NOT NULL AND ore IS NULL) OR
    (tipo IN ('permesso','altro') AND ore IS NOT NULL AND giorni IS NULL)
  )
);

-- Indici per velocizzare le query filtrate
CREATE INDEX IF NOT EXISTS idx_reg_dipendente ON registrazioni(dipendente_id);
CREATE INDEX IF NOT EXISTS idx_reg_data       ON registrazioni(data);
CREATE INDEX IF NOT EXISTS idx_reg_tipo       ON registrazioni(tipo);
CREATE INDEX IF NOT EXISTS idx_reg_anno       ON registrazioni(EXTRACT(YEAR FROM data));

-- Vista comoda per riepilogo annuale
CREATE OR REPLACE VIEW riepilogo_annuale AS
SELECT
  d.id              AS dipendente_id,
  d.nome,
  d.cognome,
  d.matricola,
  EXTRACT(YEAR FROM r.data)::INT                              AS anno,
  SUM(CASE WHEN r.tipo = 'ferie'    THEN r.giorni ELSE 0 END) AS ferie_giorni,
  SUM(CASE WHEN r.tipo = 'malattia' THEN r.giorni ELSE 0 END) AS malattia_giorni,
  SUM(CASE WHEN r.tipo = 'permesso' THEN r.ore    ELSE 0 END) AS permessi_ore,
  SUM(CASE WHEN r.tipo = 'altro'    THEN r.ore    ELSE 0 END) AS altro_ore
FROM dipendenti d
JOIN registrazioni r ON d.id = r.dipendente_id
GROUP BY d.id, d.nome, d.cognome, d.matricola, EXTRACT(YEAR FROM r.data)::INT;

-- ── Dati di esempio (cancellare in produzione) ────────────────────────────────
INSERT INTO dipendenti (nome, cognome, matricola) VALUES
  ('Mario',    'Rossi',    'MAT001'),
  ('Laura',    'Bianchi',  'MAT002'),
  ('Giuseppe', 'Verdi',    'MAT003')
ON CONFLICT DO NOTHING;
