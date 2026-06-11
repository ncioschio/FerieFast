// ─── TIPI DI EVENTO ──────────────────────────────────────────────────────────
export const TIPI = [
  { value: "ferie",    label: "Ferie",             unit: "giorni", color: "#185FA5", bg: "var(--blue-bg)"  },
  { value: "malattia", label: "Malattia",           unit: "giorni", color: "#A32D2D", bg: "var(--red-bg)"   },
  { value: "permesso", label: "Permesso orario",    unit: "ore",    color: "#854F0B", bg: "var(--amber-bg)" },
  { value: "altro",    label: "Altro (104, ecc.)",  unit: "ore",    color: "#3B6D11", bg: "var(--green-bg)" },
];

export const TIPO_MAP = Object.fromEntries(TIPI.map((t) => [t.value, t]));

export const MESI = [
  "Gennaio","Febbraio","Marzo","Aprile","Maggio","Giugno",
  "Luglio","Agosto","Settembre","Ottobre","Novembre","Dicembre",
];

// ─── UTILS ───────────────────────────────────────────────────────────────────
export function fmt(n, unit) {
  if (!n && n !== 0) return "–";
  const v = parseFloat(n);
  if (unit === "giorni") return v === 0.5 ? "½ g" : `${v} g`;
  const h = Math.floor(v);
  const m = Math.round((v - h) * 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function initials(nome, cognome) {
  return `${nome?.[0] ?? ""}${cognome?.[0] ?? ""}`.toUpperCase();
}

export function avatarColor(nome) {
  const colors = ["#185FA5","#854F0B","#3B6D11","#993556","#534AB7","#0F6E56"];
  return colors[(nome?.charCodeAt(0) ?? 0) % colors.length];
}

export function calcTotali(registrazioni, dipId, anno, mese) {
  return registrazioni
    .filter((r) => {
      if (r.dipendente_id !== dipId) return false;
      const d = new Date(r.data);
      if (anno !== null && d.getFullYear() !== anno) return false;
      if (mese !== null && d.getMonth() !== mese) return false;
      return true;
    })
    .reduce(
      (acc, r) => {
        if      (r.tipo === "ferie")    acc.ferie    += parseFloat(r.giorni ?? 0);
        else if (r.tipo === "malattia") acc.malattia += parseFloat(r.giorni ?? 0);
        else if (r.tipo === "permesso") acc.permesso += parseFloat(r.ore ?? 0);
        else if (r.tipo === "altro")    acc.altro    += parseFloat(r.ore ?? 0);
        return acc;
      },
      { ferie: 0, malattia: 0, permesso: 0, altro: 0 }
    );
}

export function formatDate(dateStr) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("it-IT", {
    weekday: "short", day: "numeric", month: "short",
  });
}

export const ANNI = [2023, 2024, 2025, 2026, 2027];
