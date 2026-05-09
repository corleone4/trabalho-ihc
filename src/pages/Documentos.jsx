/**
 * Documentos.jsx — Emissão de atestados e prescrições
 *
 * Design: tema claro, coeso com o restante do sistema (DM Sans, teal/azul).
 * Melhorias: validação inline, preview do documento antes de gerar,
 * lista de documentos emitidos recentemente, acessibilidade completa.
 */

import { useEffect, useState } from "react";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');`;

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

// ── Tipos de documento ────────────────────────────────────────────────────────
const TIPOS = [
  {
    id: "Atestado",
    label: "Atestado Médico",
    icon: "🩺",
    desc: "Comprovação de atendimento ou afastamento",
    color: T.teal, light: T.tealLight,
  },
  {
    id: "Prescrição",
    label: "Prescrição",
    icon: "💊",
    desc: "Receita de medicamentos e orientações",
    color: T.blue, light: "#eff6ff",
  },
  {
    id: "Encaminhamento",
    label: "Encaminhamento",
    icon: "📋",
    desc: "Encaminhar para especialista ou exame",
    color: T.amber, light: T.amberLight,
  },
];

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  Document: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  ),
  User: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" strokeLinecap="round" />
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Alert: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" strokeLinecap="round" />
    </svg>
  ),
  Notes: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" strokeLinejoin="round" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" strokeLinecap="round" />
    </svg>
  ),
  Trash: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  EmptyBox: () => (
    <svg width="36" height="36" fill="none" stroke="currentColor" strokeWidth="1.2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" strokeLinecap="round" />
      <path d="M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" strokeLinecap="round" />
      <path d="M10 12h4" strokeLinecap="round" />
    </svg>
  ),
};

// ── Campo de formulário acessível ─────────────────────────────────────────────
function Field({ id, label, icon: IconComp, required, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label
        htmlFor={id}
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontSize: 11, fontWeight: 700, color: T.textSub,
          textTransform: "uppercase", letterSpacing: "0.07em",
        }}
      >
        {IconComp && <span style={{ color: T.teal, display: "flex" }}><IconComp /></span>}
        {label}
        {required && <span style={{ color: T.rose }} aria-label="obrigatório">*</span>}
      </label>
      <div style={{ position: "relative" }}>
        {IconComp && (
          <span style={{
            position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
            color: T.textMuted, pointerEvents: "none", display: "flex",
          }}>
            <IconComp />
          </span>
        )}
        {children}
      </div>
      {error && (
        <p role="alert" style={{
          display: "flex", alignItems: "center", gap: 5,
          fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
        }}>
          <Icon.Alert />{error}
        </p>
      )}
    </div>
  );
}

const baseInput = {
  width: "100%", boxSizing: "border-box",
  padding: "10px 12px 10px 36px",
  borderRadius: 10, border: `1.5px solid ${T.border}`,
  background: T.surface, color: T.text,
  fontSize: 13, outline: "none", fontFamily: "inherit",
  transition: "border-color 0.15s, box-shadow 0.15s",
  appearance: "none",
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function Documentos() {
  const [pacientes, setPacientes] = useState([]);
  const [docs, setDocs]           = useState([]);
  const [form, setForm]           = useState({ paciente: "", tipo: "", conteudo: "" });
  const [erros, setErros]         = useState({});
  const [sucesso, setSucesso]     = useState(false);

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes") || "[]"));
    setDocs(JSON.parse(localStorage.getItem("documentos") || "[]"));
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;
    setErros((p) => ({ ...p, [name]: undefined }));
    setForm((p) => ({ ...p, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.paciente) e.paciente = "Selecione um paciente";
    if (!form.tipo)     e.tipo     = "Selecione o tipo de documento";
    if (!form.conteudo.trim()) e.conteudo = "Preencha o conteúdo";
    return e;
  }

  function gerarDocumento() {
    const e = validate();
    if (Object.keys(e).length) { setErros(e); return; }

    const novo = {
      ...form,
      id: Date.now().toString(),
      data: new Date().toLocaleString("pt-BR"),
    };
    const novos = [novo, ...docs];
    localStorage.setItem("documentos", JSON.stringify(novos));
    setDocs(novos);
    setForm({ paciente: "", tipo: "", conteudo: "" });
    setSucesso(true);
    setTimeout(() => setSucesso(false), 3000);
  }

  function excluirDoc(id) {
    const novos = docs.filter((d) => d.id !== id);
    localStorage.setItem("documentos", JSON.stringify(novos));
    setDocs(novos);
  }

  const tipoSelecionado = TIPOS.find((t) => t.id === form.tipo);

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        .doc-input:focus { border-color: ${T.tealMid} !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.15) !important; }
        .doc-input-err:focus { border-color: ${T.rose} !important; box-shadow: 0 0 0 3px rgba(225,29,72,0.12) !important; }
        .tipo-chip:hover { border-color: ${T.tealMid} !important; background: ${T.tealLight} !important; }
        .doc-del:hover { color: ${T.rose} !important; background: rgba(225,29,72,0.08) !important; }
        .doc-btn:hover { opacity: 0.88; transform: translateY(-1px); }
        .doc-btn:active { transform: scale(0.97); }
        @keyframes slideIn { from { opacity:0; transform:translateY(-6px); } to { opacity:1; transform:translateY(0); } }
        .slide-in { animation: slideIn 0.25s ease both; }
      `}</style>

      <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 760, margin: "0 auto" }}>

        {/* ── Cabeçalho ── */}
        <header style={{ marginBottom: 28, display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "#fff", boxShadow: "0 8px 20px rgba(45,212,191,0.22)",
            }}>
              <Icon.Document />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 700, color: T.text, margin: 0 }}>Documentos</h1>
              <p style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Emissão de atestados e prescrições</p>
            </div>
          </div>

          {/* Contador */}
          {docs.length > 0 && (
            <div style={{
              padding: "6px 14px", borderRadius: 999,
              background: T.tealLight, border: `1px solid ${T.teal}33`,
              fontSize: 12, fontWeight: 700, color: T.teal,
            }}>
              {docs.length} documento{docs.length !== 1 ? "s" : ""}
            </div>
          )}
        </header>

        {/* ── Toast de sucesso ── */}
        {sucesso && (
          <div
            className="slide-in"
            role="status" aria-live="polite"
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 16px", borderRadius: 12, marginBottom: 20,
              background: T.emeraldLight, border: `1.5px solid ${T.emerald}33`,
              color: T.emerald, fontSize: 13, fontWeight: 600,
            }}
          >
            <Icon.Check /> Documento gerado com sucesso!
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, alignItems: "start" }}>

          {/* ── Formulário ── */}
          <div style={{
            borderRadius: 20, border: `1.5px solid ${T.border}`,
            background: T.surface, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}>
            {/* Divisor de seção */}
            <div style={{
              padding: "16px 24px", borderBottom: `1px solid ${T.border}`,
              background: T.surfaceAlt,
              fontSize: 11, fontWeight: 700, color: T.textSub,
              textTransform: "uppercase", letterSpacing: "0.08em",
            }}>
              Novo documento
            </div>

            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Paciente */}
              <Field id="paciente" label="Paciente" icon={Icon.User} required error={erros.paciente}>
                <select
                  id="paciente" name="paciente"
                  value={form.paciente} onChange={handleChange}
                  className={`doc-input${erros.paciente ? " doc-input-err" : ""}`}
                  style={{ ...baseInput, borderColor: erros.paciente ? T.rose : T.border, cursor: "pointer" }}
                  aria-required="true"
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p, i) => (
                    <option key={p.id ?? p.cpf ?? i} value={p.nome}>{p.nome}</option>
                  ))}
                </select>
              </Field>

              {/* Tipo — chips */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: T.textSub,
                  textTransform: "uppercase", letterSpacing: "0.07em",
                  display: "flex", alignItems: "center", gap: 6,
                }}>
                  <span style={{ color: T.teal, display: "flex" }}><Icon.Notes /></span>
                  Tipo de documento <span style={{ color: T.rose }}>*</span>
                </span>

                {erros.tipo && (
                  <p role="alert" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
                  }}>
                    <Icon.Alert />{erros.tipo}
                  </p>
                )}

                <div role="group" aria-label="Tipo de documento" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {TIPOS.map((tipo) => {
                    const sel = form.tipo === tipo.id;
                    return (
                      <button
                        key={tipo.id}
                        type="button"
                        className={sel ? "" : "tipo-chip"}
                        onClick={() => { setForm((p) => ({ ...p, tipo: tipo.id })); setErros((p) => ({ ...p, tipo: undefined })); }}
                        aria-pressed={sel}
                        style={{
                          display: "flex", alignItems: "center", gap: 12,
                          padding: "10px 14px", borderRadius: 10, cursor: "pointer",
                          border: `1.5px solid ${sel ? tipo.color : T.border}`,
                          background: sel ? tipo.light : T.surface,
                          transition: "all 0.15s", textAlign: "left", fontFamily: "inherit",
                        }}
                      >
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{tipo.icon}</span>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: sel ? tipo.color : T.text, margin: 0 }}>
                            {tipo.label}
                          </p>
                          <p style={{ fontSize: 11, color: T.textMuted, margin: 0, marginTop: 1 }}>
                            {tipo.desc}
                          </p>
                        </div>
                        {sel && (
                          <span style={{
                            marginLeft: "auto", width: 20, height: 20, borderRadius: "50%",
                            background: tipo.color, color: "#fff",
                            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                          }}>
                            <Icon.Check />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conteúdo */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="conteudo"
                  style={{
                    fontSize: 11, fontWeight: 700, color: T.textSub,
                    textTransform: "uppercase", letterSpacing: "0.07em",
                    display: "flex", alignItems: "center", gap: 6,
                  }}
                >
                  <span style={{ color: T.teal, display: "flex" }}><Icon.Notes /></span>
                  Conteúdo <span style={{ color: T.rose }}>*</span>
                </label>
                <textarea
                  id="conteudo" name="conteudo"
                  placeholder={
                    form.tipo === "Atestado"
                      ? "Ex: Atesto que o paciente esteve sob meus cuidados em…"
                      : form.tipo === "Prescrição"
                        ? "Ex: Amoxicilina 500mg — 1 cápsula de 8 em 8 horas por 7 dias…"
                        : "Descreva o conteúdo do documento…"
                  }
                  value={form.conteudo}
                  onChange={handleChange}
                  rows={5}
                  className={`doc-input${erros.conteudo ? " doc-input-err" : ""}`}
                  style={{
                    width: "100%", boxSizing: "border-box",
                    padding: "10px 12px", borderRadius: 10,
                    border: `1.5px solid ${erros.conteudo ? T.rose : T.border}`,
                    background: T.surface, color: T.text,
                    fontSize: 13, outline: "none", resize: "vertical",
                    fontFamily: "inherit", lineHeight: 1.55,
                    transition: "border-color 0.15s, box-shadow 0.15s",
                  }}
                  aria-required="true"
                />
                {erros.conteudo && (
                  <p role="alert" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
                  }}>
                    <Icon.Alert />{erros.conteudo}
                  </p>
                )}
              </div>

            </div>

            {/* Rodapé */}
            <div style={{
              padding: "14px 24px", borderTop: `1px solid ${T.border}`,
              background: T.surfaceAlt, display: "flex", justifyContent: "flex-end",
            }}>
              <button
                onClick={gerarDocumento}
                className="doc-btn"
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 22px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
                  color: "#fff", fontSize: 13, fontWeight: 700,
                  cursor: "pointer", transition: "all 0.15s",
                  boxShadow: "0 4px 14px rgba(45,212,191,0.28)",
                  fontFamily: "inherit",
                }}
              >
                <Icon.Document />
                Gerar Documento
              </button>
            </div>
          </div>

          {/* ── Preview + Histórico ── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Preview em tempo real */}
            {(form.paciente || form.tipo || form.conteudo) && (
              <div
                className="slide-in"
                style={{
                  borderRadius: 16, border: `1.5px dashed ${T.tealMid}`,
                  background: T.tealLight, padding: "18px 20px",
                }}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: T.teal, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 10px" }}>
                  Pré-visualização
                </p>
                {tipoSelecionado && (
                  <p style={{ fontSize: 13, fontWeight: 700, color: T.teal, margin: "0 0 4px" }}>
                    {tipoSelecionado.icon} {tipoSelecionado.label}
                  </p>
                )}
                {form.paciente && (
                  <p style={{ fontSize: 12, color: T.textSub, margin: "0 0 8px" }}>
                    Paciente: <strong>{form.paciente}</strong>
                  </p>
                )}
                {form.conteudo && (
                  <p style={{
                    fontSize: 12, color: T.text, margin: 0,
                    whiteSpace: "pre-wrap", lineHeight: 1.55,
                    maxHeight: 100, overflow: "auto",
                  }}>
                    {form.conteudo}
                  </p>
                )}
              </div>
            )}

            {/* Histórico */}
            <div style={{
              borderRadius: 20, border: `1.5px solid ${T.border}`,
              background: T.surface, boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              overflow: "hidden",
            }}>
              <div style={{
                padding: "16px 20px", borderBottom: `1px solid ${T.border}`,
                background: T.surfaceAlt,
                fontSize: 11, fontWeight: 700, color: T.textSub,
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
                Documentos emitidos
              </div>

              <div style={{ maxHeight: 380, overflowY: "auto" }}>
                {docs.length === 0 ? (
                  <div style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    gap: 8, padding: "40px 20px", textAlign: "center", color: T.textMuted,
                  }}>
                    <Icon.EmptyBox />
                    <p style={{ fontSize: 13, color: T.textSub, fontWeight: 600, margin: 0 }}>Nenhum documento</p>
                    <p style={{ fontSize: 12, color: T.textMuted, margin: 0 }}>Documentos gerados aparecerão aqui</p>
                  </div>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {docs.map((d, i) => {
                      const tipo = TIPOS.find((t) => t.id === d.tipo);
                      return (
                        <li
                          key={d.id ?? i}
                          style={{
                            padding: "14px 20px",
                            borderBottom: i < docs.length - 1 ? `1px solid ${T.border}` : "none",
                            display: "flex", alignItems: "flex-start",
                            justifyContent: "space-between", gap: 12,
                          }}
                        >
                          <div style={{ minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 3 }}>
                              <span style={{ fontSize: 14 }}>{tipo?.icon ?? "📄"}</span>
                              <span style={{
                                fontSize: 11, fontWeight: 700, padding: "2px 8px",
                                borderRadius: 999, background: tipo ? tipo.light : T.tealLight,
                                color: tipo?.color ?? T.teal,
                                border: `1px solid ${tipo?.color ?? T.teal}33`,
                              }}>
                                {d.tipo}
                              </span>
                            </div>
                            <p style={{ fontSize: 13, fontWeight: 600, color: T.text, margin: "0 0 2px" }}>
                              {d.paciente}
                            </p>
                            <p style={{
                              fontSize: 11, color: T.textMuted, margin: "0 0 4px",
                              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                              maxWidth: 180,
                            }}>
                              {d.conteudo}
                            </p>
                            <p style={{
                              display: "flex", alignItems: "center", gap: 4,
                              fontSize: 10, color: T.textMuted, margin: 0,
                            }}>
                              <Icon.Clock />{d.data}
                            </p>
                          </div>
                          <button
                            className="doc-del"
                            onClick={() => excluirDoc(d.id)}
                            aria-label={`Excluir documento de ${d.paciente}`}
                            style={{
                              width: 30, height: 30, borderRadius: 8,
                              background: "none", border: "none", cursor: "pointer",
                              color: T.textMuted, display: "flex", alignItems: "center",
                              justifyContent: "center", transition: "all 0.15s", flexShrink: 0,
                            }}
                          >
                            <Icon.Trash />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}