/**
 * Prontuario.jsx — Histórico clínico do paciente
 *
 * Design: tema claro coeso com o sistema. Timeline vertical para registros,
 * campo de novo registro com contagem de caracteres, acessibilidade completa.
 */

import { useEffect, useRef, useState } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');`;

// ── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#f0f4f8",
  surface:   "#ffffff",
  surfaceAlt:"#f8fafc",
  border:    "#e2e8f0",
  text:      "#0f172a",
  textSub:   "#475569",
  textMuted: "#94a3b8",
  teal:      "#0d9488",
  tealMid:   "#2dd4bf",
  tealLight: "#e6faf8",
  blue:      "#3b82f6",
  rose:      "#e11d48",
  roseLight: "#fff1f2",
  amber:     "#d97706",
  amberLight:"#fffbeb",
  emerald:   "#059669",
  emeraldLight:"#ecfdf5",
};

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  Folder: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" strokeLinejoin="round" />
    </svg>
  ),
  User: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  Notes: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  ),
  Plus: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  ),
  Clock: () => (
    <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  Alert: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  Stethoscope: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeLinecap="round" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  EmptyTimeline: () => (
    <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" strokeLinecap="round" />
    </svg>
  ),
  Chevron: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

// ── Componente de registro na timeline ────────────────────────────────────────
function RegistroCard({ registro, index, total }) {
  const [expanded, setExpanded] = useState(index === 0);
  const isLong = registro.texto.length > 160;

  return (
    <li style={{ display: "flex", gap: 14, position: "relative" }}>
      {/* Linha da timeline */}
      {index < total - 1 && (
        <div style={{
          position: "absolute",
          left: 15, top: 32,
          width: 2, bottom: -16,
          background: `linear-gradient(to bottom, ${T.tealMid}44, ${T.border})`,
        }} />
      )}

      {/* Dot */}
      <div style={{
        width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
        background: index === 0 ? `linear-gradient(135deg, ${T.tealMid}, ${T.blue})` : T.surface,
        border: `2px solid ${index === 0 ? T.tealMid : T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: index === 0 ? "#fff" : T.textMuted,
        zIndex: 1, position: "relative",
        boxShadow: index === 0 ? "0 2px 8px rgba(45,212,191,0.25)" : "none",
      }}>
        <Icon.Stethoscope />
      </div>

      {/* Conteúdo */}
      <div style={{
        flex: 1, borderRadius: 14,
        border: `1.5px solid ${index === 0 ? T.tealMid + "44" : T.border}`,
        background: index === 0 ? T.tealLight : T.surface,
        padding: "14px 16px", marginBottom: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 10, color: T.textMuted,
          }}>
            <Icon.Clock />{registro.data}
          </span>
          {index === 0 && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "2px 8px",
              borderRadius: 999, background: T.tealMid + "22",
              color: T.teal, border: `1px solid ${T.tealMid}44`,
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Mais recente
            </span>
          )}
        </div>

        <p style={{
          fontSize: 13, color: T.text, margin: 0, lineHeight: 1.6,
          whiteSpace: "pre-wrap",
          display: isLong && !expanded ? "-webkit-box" : "block",
          WebkitLineClamp: isLong && !expanded ? 3 : "unset",
          WebkitBoxOrient: "vertical",
          overflow: isLong && !expanded ? "hidden" : "visible",
        }}>
          {registro.texto}
        </p>

        {isLong && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              marginTop: 6, background: "none", border: "none",
              cursor: "pointer", fontSize: 11, fontWeight: 600,
              color: T.teal, padding: 0, fontFamily: "inherit",
            }}
          >
            <span style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "flex" }}>
              <Icon.Chevron />
            </span>
            {expanded ? "Mostrar menos" : "Ver completo"}
          </button>
        )}
      </div>
    </li>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Prontuario() {
  const [pacientes,    setPacientes]    = useState([]);
  const [selecionado,  setSelecionado]  = useState("");
  const [registros,    setRegistros]    = useState([]);
  const [texto,        setTexto]        = useState("");
  const [erro,         setErro]         = useState("");
  const [sucesso,      setSucesso]      = useState(false);
  const textareaRef = useRef(null);
  const MAX = 1000;

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes") || "[]"));
  }, []);

  useEffect(() => {
    if (!selecionado) { setRegistros([]); return; }
    const prontuarios = JSON.parse(localStorage.getItem("prontuarios") || "{}");
    setRegistros(prontuarios[selecionado] || []);
  }, [selecionado]);

  function salvarRegistro() {
    if (!texto.trim()) { setErro("Escreva uma observação antes de salvar"); return; }
    setErro("");

    const prontuarios = JSON.parse(localStorage.getItem("prontuarios") || "{}");
    const novos = [
      { texto: texto.trim(), data: new Date().toLocaleString("pt-BR") },
      ...(prontuarios[selecionado] || []),
    ];
    prontuarios[selecionado] = novos;
    localStorage.setItem("prontuarios", JSON.stringify(prontuarios));
    setRegistros(novos);
    setTexto("");
    setSucesso(true);
    setTimeout(() => setSucesso(false), 2500);
    textareaRef.current?.focus();
  }

  function handleKeyDown(e) {
    // Ctrl+Enter ou Cmd+Enter salva
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      salvarRegistro();
    }
  }

  const pacienteSelecionado = pacientes.find((p) => p.nome === selecionado);

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        .pront-select:focus { border-color: ${T.tealMid} !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.15) !important; }
        .pront-textarea:focus { border-color: ${T.tealMid} !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.15) !important; }
        .pront-textarea-err:focus { border-color: ${T.rose} !important; box-shadow: 0 0 0 3px rgba(225,29,72,0.12) !important; }
        .pront-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .pront-btn:active { transform: scale(0.97); }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slideIn 0.25s ease both; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 800, margin: "0 auto" }}>

        {/* ── Cabeçalho ── */}
        <header style={{ marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", boxShadow: "0 8px 20px rgba(45,212,191,0.22)",
            }}>
              <Icon.Folder />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Prontuário</h1>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Histórico clínico do paciente</p>
            </div>
          </div>

          {/* Badge de registros */}
          {selecionado && registros.length > 0 && (
            <div className="slide-in" style={{
              padding: "6px 14px", borderRadius: 999,
              background: T.tealLight, border: `1px solid ${T.teal}33`,
              fontSize: 12, fontWeight: 700, color: T.teal,
            }}>
              {registros.length} registro{registros.length !== 1 ? "s" : ""}
            </div>
          )}
        </header>

        {/* ── Seleção de paciente ── */}
        <div style={{
          borderRadius: 20, border: `1.5px solid ${T.border}`,
          background: T.surface, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          overflow: "hidden", marginBottom: 20,
        }}>
          <div style={{
            padding: "14px 24px", borderBottom: `1px solid ${T.border}`,
            background: T.surfaceAlt,
            fontSize: 11, fontWeight: 700, color: T.textSub,
            textTransform: "uppercase", letterSpacing: "0.08em",
          }}>
            Selecionar paciente
          </div>

          <div style={{ padding: "20px 24px" }}>
            <div style={{ position: "relative" }}>
              <span style={{
                position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                color: T.textMuted, pointerEvents: "none", display: "flex",
              }}>
                <Icon.User />
              </span>
              <select
                id="paciente"
                value={selecionado}
                onChange={(e) => setSelecionado(e.target.value)}
                className="pront-select"
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "10px 12px 10px 36px",
                  borderRadius: 10, border: `1.5px solid ${T.border}`,
                  background: T.surface, color: selecionado ? T.text : T.textMuted,
                  fontSize: 13, outline: "none", fontFamily: "inherit",
                  transition: "border-color 0.15s, box-shadow 0.15s",
                  appearance: "none", cursor: "pointer",
                }}
                aria-label="Selecionar paciente para ver prontuário"
              >
                <option value="">Selecione um paciente…</option>
                {pacientes.map((p, i) => (
                  <option key={p.id ?? p.cpf ?? i} value={p.nome}>{p.nome}</option>
                ))}
              </select>
            </div>

            {/* Info do paciente selecionado */}
            {pacienteSelecionado && (
              <div className="slide-in" style={{
                marginTop: 12, padding: "10px 14px", borderRadius: 10,
                background: T.tealLight, border: `1px solid ${T.teal}22`,
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#fff", flexShrink: 0, fontSize: 13, fontWeight: 700,
                }}>
                  {pacienteSelecionado.nome?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.text, margin: 0 }}>
                    {pacienteSelecionado.nome}
                  </p>
                  {(pacienteSelecionado.cpf || pacienteSelecionado.email) && (
                    <p style={{ fontSize: 11, color: T.textMuted, margin: 0 }}>
                      {pacienteSelecionado.cpf ?? pacienteSelecionado.email}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Conteúdo do prontuário ── */}
        {selecionado && (
          <div className="slide-in" style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 20, alignItems: "start" }}>

            {/* Timeline de registros */}
            <div style={{
              borderRadius: 20, border: `1.5px solid ${T.border}`,
              background: T.surface, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "14px 24px", borderBottom: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: T.textSub,
                  textTransform: "uppercase", letterSpacing: "0.08em",
                }}>
                  Histórico clínico
                </span>
                {registros.length > 0 && (
                  <span style={{ fontSize: 11, color: T.textMuted }}>
                    {registros.length} entrada{registros.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              <div style={{ padding: "20px 24px" }}>
                {registros.length === 0 ? (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 10, padding: "40px 0", textAlign: "center", color: T.textMuted,
                  }}>
                    <Icon.EmptyTimeline />
                    <p style={{ fontSize: 14, fontWeight: 600, color: T.textSub, margin: 0 }}>
                      Nenhum registro
                    </p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>
                      Adicione a primeira observação clínica ao lado
                    </p>
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {registros.map((r, i) => (
                      <RegistroCard key={i} registro={r} index={i} total={registros.length} />
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Painel de novo registro */}
            <div style={{
              borderRadius: 20, border: `1.5px solid ${T.border}`,
              background: T.surface, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
              position: "sticky", top: 20,
            }}>
              <div style={{
                padding: "14px 20px", borderBottom: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                fontSize: 11, fontWeight: 700, color: T.textSub,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Nova observação
              </div>

              <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>

                {/* Toast de sucesso */}
                {sucesso && (
                  <div
                    className="slide-in"
                    role="status" aria-live="polite"
                    style={{
                      display: "flex", alignItems: "center", gap: 8,
                      padding: "10px 12px", borderRadius: 10,
                      background: T.emeraldLight, border: `1px solid ${T.emerald}33`,
                      fontSize: 12, fontWeight: 600, color: T.emerald,
                    }}
                  >
                    ✓ Registro salvo com sucesso!
                  </div>
                )}

                {/* Label */}
                <label
                  htmlFor="observacao"
                  style={{
                    fontSize: 11, fontWeight: 700, color: T.textSub,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ color: T.teal, display: "flex" }}><Icon.Notes /></span>
                  Observação clínica
                </label>

                {/* Textarea */}
                <div style={{ position: "relative" }}>
                  <textarea
                    id="observacao"
                    ref={textareaRef}
                    placeholder="Descreva sintomas, diagnóstico, tratamento ou orientações…"
                    value={texto}
                    onChange={(e) => {
                      if (e.target.value.length <= MAX) {
                        setTexto(e.target.value);
                        setErro("");
                      }
                    }}
                    onKeyDown={handleKeyDown}
                    rows={6}
                    className={`pront-textarea${erro ? " pront-textarea-err" : ""}`}
                    style={{
                      width: "100%", boxSizing: "border-box",
                      padding: "10px 12px",
                      borderRadius: 10,
                      border: `1.5px solid ${erro ? T.rose : T.border}`,
                      background: T.surface, color: T.text,
                      fontSize: 13, outline: "none", resize: "vertical",
                      fontFamily: "inherit", lineHeight: 1.6,
                      transition: "border-color 0.15s, box-shadow 0.15s",
                    }}
                    aria-required="true"
                    aria-describedby={erro ? "err-obs" : "hint-obs"}
                  />
                </div>

                {/* Erro / contador */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  {erro ? (
                    <p id="err-obs" role="alert" style={{
                      display: "flex", alignItems: "center", gap: 5,
                      fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
                    }}>
                      <Icon.Alert />{erro}
                    </p>
                  ) : (
                    <p id="hint-obs" style={{ fontSize: 10, color: T.textMuted, margin: 0 }}>
                      Ctrl+Enter para salvar rapidamente
                    </p>
                  )}
                  <span style={{
                    fontSize: 10, color: texto.length > MAX * 0.85 ? T.amber : T.textMuted,
                    fontVariantNumeric: "tabular-nums",
                  }}>
                    {texto.length}/{MAX}
                  </span>
                </div>

                {/* Botão */}
                <button
                  onClick={salvarRegistro}
                  className="pront-btn"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    width: "100%", padding: "11px",
                    borderRadius: 12, border: "none",
                    background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: "0 4px 14px rgba(45,212,191,0.28)",
                    fontFamily: "inherit",
                  }}
                >
                  <Icon.Plus />
                  Salvar registro
                </button>

              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}