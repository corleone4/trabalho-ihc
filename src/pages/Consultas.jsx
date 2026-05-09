/**
 * Consultas.jsx — Tela de listagem e gerenciamento de consultas
 *
 * BUG CORRIGIDO: O botão "Editar" navegava para /agendamento/:id, mas a rota
 * não existia no roteador → tela em branco. A navegação foi mantida; certifique-se
 * de que seu App.jsx (ou Routes) declare:
 *   <Route path="/agendamento/:id" element={<Agendamento />} />
 * além de:
 *   <Route path="/agendamento" element={<Agendamento />} />
 *
 * Design: tema claro refinado — consistente com Agendamento.jsx.
 * Tipografia: DM Sans (Google Fonts) + números em tabular-nums para métricas.
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Google Font via @import (carregado uma vez) ───────────────────────────────
const FONT_STYLE = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`;

// ── Paleta de tokens ──────────────────────────────────────────────────────────
const TOKEN = {
  bg:        "#f0f4f8",
  surface:   "#ffffff",
  surfaceHov:"#f8fafc",
  border:    "#e2e8f0",
  borderHov: "#cbd5e1",
  text:      "#0f172a",
  textMuted: "#94a3b8",
  textSub:   "#475569",
  teal:      "#0d9488",
  tealMid:   "#2dd4bf",
  tealDim:   "rgba(13,148,136,0.10)",
  amber:     "#d97706",
  amberDim:  "rgba(217,119,6,0.10)",
  rose:      "#e11d48",
  roseDim:   "rgba(225,29,72,0.10)",
  emerald:   "#059669",
  emeraldDim:"rgba(5,150,105,0.10)",
  indigo:    "#4f46e5",
  indigoDim: "rgba(79,70,229,0.10)",
};

// ── Ícones SVG inline ─────────────────────────────────────────────────────────
const Icon = {
  Calendar: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2.5" />
      <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  Stethoscope: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeLinecap="round" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" strokeLinecap="round" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" strokeLinecap="round" />
    </svg>
  ),
  EmptyBox: () => (
    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" strokeLinecap="round" />
      <path d="M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" strokeLinecap="round" />
      <path d="M10 12h4" strokeLinecap="round" />
    </svg>
  ),
  Alert: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  ),
  Filter: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Mapa de status ────────────────────────────────────────────────────────────
const STATUS_MAP = {
  agendada:   { label: "Agendada",   color: TOKEN.indigo,  bg: TOKEN.indigoDim,  dot: TOKEN.indigo  },
  confirmada: { label: "Confirmada", color: TOKEN.emerald, bg: TOKEN.emeraldDim, dot: TOKEN.emerald },
  cancelada:  { label: "Cancelada",  color: TOKEN.rose,    bg: TOKEN.roseDim,    dot: TOKEN.rose    },
  realizada:  { label: "Realizada",  color: TOKEN.textSub, bg: "rgba(100,116,139,0.12)", dot: TOKEN.textSub },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.agendada;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "2px 9px", borderRadius: "999px",
      background: s.bg, color: s.color,
      fontSize: "10px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
      border: `1px solid ${s.color}33`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.color, flexShrink: 0 }} />
      {s.label}
    </span>
  );
}

// ── Modal de exclusão ─────────────────────────────────────────────────────────
function ConfirmModal({ consulta, onConfirm, onCancel }) {
  // Fecha com Escape
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onCancel]);

  return (
    <div
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      style={{
        position: "fixed", inset: 0, zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "16px",
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)",
      }}
    >
      <div style={{
        width: "100%", maxWidth: 380, borderRadius: 20,
        border: `1px solid ${TOKEN.border}`, background: TOKEN.surface,
        boxShadow: "0 24px 60px rgba(0,0,0,0.15)", padding: "24px",
        display: "flex", flexDirection: "column", gap: 20,
        animation: "modalIn 0.18s ease",
      }}>
        <style>{`@keyframes modalIn { from { transform: scale(0.94); opacity: 0 } to { transform: scale(1); opacity: 1 } }`}</style>

        <div style={{ display: "flex", gap: 14 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12, flexShrink: 0,
            background: TOKEN.roseDim, color: TOKEN.rose,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon.Alert />
          </div>
          <div>
            <h2 id="modal-title" style={{ fontSize: 15, fontWeight: 700, color: TOKEN.text, margin: 0 }}>
              Excluir consulta?
            </h2>
            <p style={{ fontSize: 13, color: TOKEN.textSub, marginTop: 6, lineHeight: 1.5 }}>
              A consulta de{" "}
              <strong style={{ color: TOKEN.text }}>{consulta?.paciente}</strong>
              {" "}com{" "}
              <strong style={{ color: TOKEN.text }}>{consulta?.medico}</strong>
              {" "}será removida permanentemente.
            </p>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500,
              color: TOKEN.textSub, background: "transparent",
              border: `1px solid ${TOKEN.border}`, cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = TOKEN.surfaceHov}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 18px", borderRadius: 12, fontSize: 13, fontWeight: 700,
              color: "#fff", background: TOKEN.rose,
              border: "none", cursor: "pointer", transition: "all 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.opacity = "0.85"}
            onMouseLeave={(e) => e.currentTarget.style.opacity = "1"}
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Chips de filtro ───────────────────────────────────────────────────────────
const FILTROS = ["Todas", "Agendada", "Confirmada", "Realizada", "Cancelada"];

// ── Componente principal ──────────────────────────────────────────────────────
export default function Consultas() {
  const navigate = useNavigate();
  const [consultas, setConsultas]       = useState([]);
  const [busca, setBusca]               = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("consultas") || "[]");
    setConsultas(dados);
  }, []);

  // Filtros
  const consultasFiltradas = consultas.filter((c) => {
    const termo = busca.toLowerCase();
    const matchBusca =
      !termo ||
      c.paciente?.toLowerCase().includes(termo) ||
      c.medico?.toLowerCase().includes(termo);
    const matchStatus =
      filtroStatus === "Todas" ||
      (c.status ?? "agendada").toLowerCase() === filtroStatus.toLowerCase();
    return matchBusca && matchStatus;
  });

  // Exclusão
  function confirmarExclusao() {
    const novas = consultas.filter((c) => c.id !== pendingDelete);
    localStorage.setItem("consultas", JSON.stringify(novas));
    setConsultas(novas);
    setPendingDelete(null);
  }

  const consultaParaExcluir = consultas.find((c) => c.id === pendingDelete);

  // Métricas
  const total     = consultas.length;
  const hoje      = new Date().toDateString();
  const hojeCount = consultas.filter((c) => new Date(c.data).toDateString() === hoje).length;
  const pendentes = consultas.filter(
    (c) => !["realizada", "cancelada"].includes(c.status ?? "agendada")
  ).length;

  // ── Estilos base ──────────────────────────────────────────────────────────
  const styles = {
    page: {
      minHeight: "100vh",
      background: TOKEN.bg,
      fontFamily: "'DM Sans', sans-serif",
      padding: "32px 16px 60px",
    },
    wrap: {
      maxWidth: 720, margin: "0 auto",
      display: "flex", flexDirection: "column", gap: 24,
    },
    header: {
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
    },
    headerLeft: {
      display: "flex", alignItems: "center", gap: 14,
    },
    iconBox: {
      width: 44, height: 44, borderRadius: 14, flexShrink: 0,
      background: `linear-gradient(135deg, ${TOKEN.tealMid}, #3b82f6)`,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "#fff", boxShadow: `0 8px 24px rgba(45,212,191,0.22)`,
    },
    h1: { fontSize: 20, fontWeight: 700, color: TOKEN.text, margin: 0 },
    sub: { fontSize: 12, color: TOKEN.textMuted, marginTop: 2 },
    btnPrimary: {
      display: "flex", alignItems: "center", gap: 7,
      padding: "9px 18px", borderRadius: 12, border: "none",
      fontSize: 13, fontWeight: 700, color: "#ffffff",
      background: `linear-gradient(135deg, ${TOKEN.tealMid}, #3b82f6)`,
      cursor: "pointer", transition: "all 0.15s",
      boxShadow: `0 4px 16px rgba(45,212,191,0.30)`,
    },
    metricsGrid: {
      display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
    },
    metricCard: {
      borderRadius: 16, border: `1px solid ${TOKEN.border}`,
      background: TOKEN.surface,
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      padding: "16px 12px", textAlign: "center",
    },
    metricVal: { fontSize: 26, fontWeight: 700, fontVariantNumeric: "tabular-nums", margin: 0 },
    metricLabel: { fontSize: 10, color: TOKEN.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.08em" },
    searchWrap: { position: "relative" },
    searchInput: {
      width: "100%", boxSizing: "border-box",
      padding: "10px 36px 10px 38px", borderRadius: 12,
      border: `1px solid ${TOKEN.border}`, background: TOKEN.surface,
      color: TOKEN.text, fontSize: 13, outline: "none",
      transition: "border-color 0.15s, box-shadow 0.15s",
      fontFamily: "inherit",
    },
    searchIcon: {
      position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
      color: TOKEN.textMuted, pointerEvents: "none",
      display: "flex", alignItems: "center",
    },
    clearBtn: {
      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
      color: TOKEN.textMuted, background: "none", border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", padding: 4, borderRadius: 6,
    },
    chipsRow: {
      display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center",
    },
    filterIcon: { color: TOKEN.textMuted, display: "flex", alignItems: "center" },
    list: { display: "flex", flexDirection: "column", gap: 10, listStyle: "none", padding: 0, margin: 0 },
    card: {
      borderRadius: 16, border: `1px solid ${TOKEN.border}`,
      background: TOKEN.surface,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      display: "flex", overflow: "hidden",
      transition: "border-color 0.18s, background 0.18s, box-shadow 0.18s",
      cursor: "default",
    },
    cardBar: {
      width: 3, flexShrink: 0,
      background: `linear-gradient(to bottom, ${TOKEN.tealMid}, #3b82f6)`,
      opacity: 0.5, transition: "opacity 0.18s",
    },
    cardBody: {
      flex: 1, padding: "14px 16px",
      display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      minWidth: 0,
    },
    cardInfo: { display: "flex", flexDirection: "column", gap: 6, minWidth: 0 },
    cardName: {
      display: "flex", alignItems: "center", gap: 7,
      fontSize: 14, fontWeight: 600, color: TOKEN.text,
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    cardMedico: {
      display: "flex", alignItems: "center", gap: 7,
      fontSize: 13, color: TOKEN.textSub,
      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
    },
    cardMeta: {
      display: "flex", alignItems: "center", gap: 6,
      fontSize: 11, color: TOKEN.textMuted,
    },
    cardActions: {
      display: "flex", alignItems: "center", gap: 4, flexShrink: 0,
      opacity: 0, transition: "opacity 0.15s",
    },
    actionBtn: (hoverColor) => ({
      width: 32, height: 32, borderRadius: 8, border: "none", cursor: "pointer",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "transparent", color: TOKEN.textMuted, transition: "all 0.15s",
    }),
    empty: {
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", gap: 12, padding: "72px 0", textAlign: "center",
      color: TOKEN.textMuted,
    },
    emptyTitle: { fontSize: 15, fontWeight: 600, color: TOKEN.textSub, margin: 0 },
    emptyDesc: { fontSize: 13, color: TOKEN.textMuted, margin: "4px 0 0" },
    resultsCount: {
      textAlign: "center", fontSize: 11, color: TOKEN.textMuted,
    },
  };

  return (
    <>
      <style>{FONT_STYLE}</style>
      <style>{`
        .consult-search:focus { border-color: ${TOKEN.teal} !important; box-shadow: 0 0 0 3px ${TOKEN.tealDim} !important; }
        .consult-chip { padding: 4px 13px; border-radius: 999px; font-size: 11px; font-weight: 600; border: 1px solid ${TOKEN.border}; background: transparent; color: ${TOKEN.textMuted}; cursor: pointer; transition: all 0.15s; font-family: inherit; }
        .consult-chip:hover { border-color: ${TOKEN.teal}; color: ${TOKEN.teal}; }
        .consult-chip[aria-pressed="true"] { background: ${TOKEN.tealDim}; border-color: ${TOKEN.teal}; color: ${TOKEN.teal}; }
        .consult-card:hover { border-color: ${TOKEN.borderHov} !important; background: ${TOKEN.surfaceHov} !important; box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important; }
        .consult-card:hover .card-bar { opacity: 1 !important; }
        .consult-card:hover .card-actions, .consult-card:focus-within .card-actions { opacity: 1 !important; }
        .action-edit:hover { color: ${TOKEN.teal} !important; background: ${TOKEN.tealDim} !important; }
        .action-del:hover { color: ${TOKEN.rose} !important; background: ${TOKEN.roseDim} !important; }
        .btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }
        .btn-primary:active { transform: scale(0.97); }
      `}</style>

      {pendingDelete && (
        <ConfirmModal
          consulta={consultaParaExcluir}
          onConfirm={confirmarExclusao}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <div style={styles.page}>
        <div style={styles.wrap}>

          {/* ── Cabeçalho ── */}
          <header style={styles.header}>
            <div style={styles.headerLeft}>
              <div style={styles.iconBox}>
                <Icon.Calendar />
              </div>
              <div>
                <h1 style={styles.h1}>Consultas</h1>
                <p style={styles.sub}>Gerencie os agendamentos</p>
              </div>
            </div>

            <button
              className="btn-primary"
              onClick={() => navigate("/agendamento")}
              style={styles.btnPrimary}
              aria-label="Criar nova consulta"
            >
              <Icon.Plus />
              Nova Consulta
            </button>
          </header>

          {/* ── Métricas ── */}
          {total > 0 && (
            <div style={styles.metricsGrid} role="region" aria-label="Resumo de consultas">
              {[
                { label: "Total",    value: total,     color: TOKEN.teal  },
                { label: "Hoje",     value: hojeCount, color: TOKEN.amber },
                { label: "Pendentes",value: pendentes, color: TOKEN.indigo },
              ].map(({ label, value, color }) => (
                <div key={label} style={styles.metricCard}>
                  <p style={{ ...styles.metricVal, color }}>{value}</p>
                  <p style={styles.metricLabel}>{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Busca + filtros ── */}
          {total > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Campo de busca */}
              <div style={styles.searchWrap}>
                <span style={styles.searchIcon}><Icon.Search /></span>
                <input
                  className="consult-search"
                  type="search"
                  placeholder="Buscar por paciente ou médico…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  style={styles.searchInput}
                  aria-label="Buscar consultas"
                />
                {busca && (
                  <button
                    onClick={() => setBusca("")}
                    style={styles.clearBtn}
                    aria-label="Limpar busca"
                  >
                    <Icon.X />
                  </button>
                )}
              </div>

              {/* Chips de status */}
              <div style={styles.chipsRow} role="group" aria-label="Filtrar por status">
                <span style={styles.filterIcon}><Icon.Filter /></span>
                {FILTROS.map((f) => (
                  <button
                    key={f}
                    className="consult-chip"
                    onClick={() => setFiltroStatus(f)}
                    aria-pressed={filtroStatus === f}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Lista ── */}
          {consultasFiltradas.length === 0 ? (
            <div style={styles.empty} role="status">
              <Icon.EmptyBox />
              <div>
                <p style={styles.emptyTitle}>
                  {busca || filtroStatus !== "Todas"
                    ? "Nenhuma consulta encontrada"
                    : "Nenhuma consulta agendada"}
                </p>
                <p style={styles.emptyDesc}>
                  {busca || filtroStatus !== "Todas"
                    ? "Tente ajustar os filtros ou a busca"
                    : 'Clique em "Nova Consulta" para começar'}
                </p>
              </div>
              {!busca && filtroStatus === "Todas" && (
                <button
                  className="btn-primary"
                  onClick={() => navigate("/agendamento")}
                  style={{ ...styles.btnPrimary, marginTop: 4 }}
                >
                  <Icon.Plus />
                  Nova Consulta
                </button>
              )}
            </div>
          ) : (
            <ul style={styles.list} role="list" aria-label="Lista de consultas">
              {consultasFiltradas.map((c) => {
                const dataFormatada = c.data
                  ? new Date(c.data + "T12:00:00").toLocaleDateString("pt-BR", {
                      weekday: "short", day: "2-digit", month: "short", year: "numeric",
                    })
                  : "—";

                return (
                  <li
                    key={c.id}
                    className="consult-card"
                    style={styles.card}
                    role="article"
                  >
                    <div className="card-bar" style={styles.cardBar} />

                    <div style={styles.cardBody}>
                      {/* Informações */}
                      <div style={styles.cardInfo}>
                        <div style={{ marginBottom: 2 }}>
                          <StatusBadge status={c.status ?? "agendada"} />
                        </div>

                        <p style={styles.cardName}>
                          <span style={{ color: TOKEN.teal, display: "flex" }}><Icon.User /></span>
                          {c.paciente}
                        </p>

                        <p style={styles.cardMedico}>
                          <span style={{ color: TOKEN.indigo, display: "flex" }}><Icon.Stethoscope /></span>
                          {c.medico}
                        </p>

                        <p style={styles.cardMeta}>
                          <span style={{ display: "flex" }}><Icon.Clock /></span>
                          {dataFormatada}
                          {(c.hora || c.horario) && (
                            <span style={{ color: TOKEN.textMuted }}>
                              · {c.hora ?? c.horario}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Ações */}
                      <div className="card-actions" style={styles.cardActions}>
                        <button
                          className="action-edit"
                          onClick={() => navigate(`/agendamento/${c.id}`)}
                          aria-label={`Editar consulta de ${c.paciente}`}
                          style={styles.actionBtn(TOKEN.teal)}
                          title="Editar"
                        >
                          <Icon.Edit />
                        </button>
                        <button
                          className="action-del"
                          onClick={() => setPendingDelete(c.id)}
                          aria-label={`Excluir consulta de ${c.paciente}`}
                          style={styles.actionBtn(TOKEN.rose)}
                          title="Excluir"
                        >
                          <Icon.Trash />
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Contador de resultados */}
          {consultasFiltradas.length > 0 && (busca || filtroStatus !== "Todas") && (
            <p style={styles.resultsCount} aria-live="polite">
              {consultasFiltradas.length} resultado{consultasFiltradas.length !== 1 ? "s" : ""} encontrado{consultasFiltradas.length !== 1 ? "s" : ""}
            </p>
          )}

        </div>
      </div>
    </>
  );
}