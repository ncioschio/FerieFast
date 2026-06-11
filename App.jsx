import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabaseClient.js";
import Dashboard  from "./components/Dashboard.jsx";
import Inserisci  from "./components/Inserisci.jsx";
import Dipendenti from "./components/Dipendenti.jsx";
import Export     from "./components/Export.jsx";
import { Loading, ErrorBox } from "./components/UI.jsx";

const NAV = [
  { id: "dashboard",  label: "Dashboard",    icon: <IconDashboard /> },
  { id: "inserisci",  label: "Inserisci",     icon: <IconPlus />      },
  { id: "dipendenti", label: "Dipendenti",    icon: <IconUsers />     },
  { id: "export",     label: "Esporta",       icon: <IconDownload />  },
];

export default function App() {
  const [view, setView]               = useState("dashboard");
  const [dipendenti, setDipendenti]   = useState([]);
  const [registrazioni, setReg]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchDipendenti = useCallback(async () => {
    const { data, error } = await supabase
      .from("dipendenti")
      .select("*")
      .order("cognome");
    if (error) throw error;
    setDipendenti(data ?? []);
  }, []);

  const fetchRegistrazioni = useCallback(async () => {
    const { data, error } = await supabase
      .from("registrazioni")
      .select("*")
      .order("data", { ascending: false });
    if (error) throw error;
    setReg(data ?? []);
  }, []);

  const fetchAll = useCallback(async () => {
    try {
      await Promise.all([fetchDipendenti(), fetchRegistrazioni()]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }, [fetchDipendenti, fetchRegistrazioni]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchAll();
      setLoading(false);
    })();
  }, [fetchAll]);

  // ── Elimina registrazione ──────────────────────────────────────────────────
  async function handleDelete(id) {
    if (!confirm("Eliminare questa registrazione?")) return;
    const { error } = await supabase.from("registrazioni").delete().eq("id", id);
    if (error) alert(error.message);
    else await fetchRegistrazioni();
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  const dipAttiviEArchiviati = dipendenti; // Export li vuole tutti
  const dipAttivi = dipendenti.filter((d) => d.attivo);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-secondary)" }}>

      {/* Top bar */}
      <header style={{
        background: "var(--bg)", borderBottom: "0.5px solid var(--border)",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto",
          padding: "0 20px",
          display: "flex", alignItems: "center", gap: 0,
        }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 0", marginRight: 32 }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontWeight: 500, fontSize: 15 }}>Gestionale Presenze</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", gap: 2 }}>
            {NAV.map((n) => (
              <button key={n.id} onClick={() => setView(n.id)} style={{
                padding: "14px 14px",
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${view === n.id ? "var(--blue)" : "transparent"}`,
                borderRadius: 0,
                color: view === n.id ? "var(--blue)" : "var(--text-muted)",
                fontWeight: view === n.id ? 500 : 400,
                fontSize: 14,
                display: "flex", alignItems: "center", gap: 7,
                cursor: "pointer",
                transition: "color 0.15s",
              }}>
                {n.icon} {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenuto */}
      <main style={{ maxWidth: 1000, margin: "0 auto", padding: "28px 20px" }}>
        {loading ? (
          <Loading />
        ) : error ? (
          <ErrorBox message={error} />
        ) : (
          <>
            {view === "dashboard"  && (
              <Dashboard
                dipendenti={dipAttivi}
                registrazioni={registrazioni}
                onDelete={handleDelete}
              />
            )}
            {view === "inserisci"  && (
              <Inserisci
                dipendenti={dipAttivi}
                onSaved={fetchRegistrazioni}
              />
            )}
            {view === "dipendenti" && (
              <Dipendenti
                dipendenti={dipAttiviEArchiviati}
                onRefresh={fetchDipendenti}
              />
            )}
            {view === "export"     && (
              <Export
                dipendenti={dipAttivi}
                registrazioni={registrazioni}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

// ── Icone inline ─────────────────────────────────────────────────────────────
function IconDashboard() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
}
function IconPlus() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
}
function IconUsers() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>;
}
function IconDownload() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>;
}
