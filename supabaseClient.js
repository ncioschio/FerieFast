import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// ⚙️  CONFIGURAZIONE — sostituisci con i valori da Supabase → Settings → API
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL      = "https://TUOPROGETTOQXXXX.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
