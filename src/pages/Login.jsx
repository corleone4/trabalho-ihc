/**
 * Login.jsx — Tela de autenticação
 *
 * Design: split-screen refinado — painel esquerdo com marca e ilustração geométrica,
 * painel direito com formulário limpo. Tema claro coeso com o restante do sistema.
 * Tipografia: DM Sans + Playfair Display para o nome da marca.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const FONT = `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@700&display=swap');`;

// ── Tokens ────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#f0f4f8",
  surface:   "#ffffff",
  border:    "#e2e8f0",
  text:      "#0f172a",
  textSub:   "#475569",
  textMuted: "#94a3b8",
  teal:      "#0d9488",
  tealMid:   "#2dd4bf",
  blue:      "#3b82f6",
  rose:      "#e11d48",
  roseLight: "#fff1f2",
};

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  Mail: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m2 7 10 7 10-7" strokeLinecap="round" />
    </svg>
  ),
  Lock: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round" />
    </svg>
  ),
  Eye: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  EyeOff: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" strokeLinecap="round" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" strokeLinecap="round" />
      <path d="M1 1l22 22" strokeLinecap="round" />
    </svg>
  ),
  Alert: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4M12 16h.01" strokeLinecap="round" />
    </svg>
  ),
  ArrowRight: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Stethoscope: () => (
    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" strokeLinecap="round" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" strokeLinecap="round" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
};

// ── Painel esquerdo — marca + decoração geométrica ────────────────────────────
function BrandPanel() {
  return (
    <div style={{
      width: "45%",
      background: `linear-gradient(145deg, #0f172a 0%, #134e4a 60%, #0d9488 100%)`,
      display: "flex", flexDirection: "column",
      justifyContent: "space-between",
      padding: "48px 52px",
      position: "relative",
      overflow: "hidden",
      flexShrink: 0,
    }}>
      {/* Círculos decorativos */}
      <div style={{
        position: "absolute", top: -80, right: -80,
        width: 320, height: 320, borderRadius: "50%",
        border: "1.5px solid rgba(45,212,191,0.15)",
      }} />
      <div style={{
        position: "absolute", top: -20, right: -20,
        width: 200, height: 200, borderRadius: "50%",
        border: "1.5px solid rgba(45,212,191,0.10)",
      }} />
      <div style={{
        position: "absolute", bottom: -60, left: -60,
        width: 280, height: 280, borderRadius: "50%",
        border: "1.5px solid rgba(45,212,191,0.12)",
      }} />
      {/* Grid pontilhado sutil */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(rgba(45,212,191,0.08) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
      }} />

      {/* Logo */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 14, marginBottom: 40,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: "rgba(45,212,191,0.15)",
            border: "1px solid rgba(45,212,191,0.30)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: T.tealMid,
          }}>
            <Icon.Stethoscope />
          </div>
          <span style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24, fontWeight: 700, color: "#ffffff",
            letterSpacing: "-0.02em",
          }}>
            SmartClinic
          </span>
        </div>

        <h2 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 38, fontWeight: 700,
          color: "#ffffff", lineHeight: 1.2,
          margin: 0, letterSpacing: "-0.02em",
        }}>
          Cuidado com<br />
          <span style={{ color: T.tealMid }}>inteligência.</span>
        </h2>

        <p style={{
          fontSize: 14, color: "rgba(255,255,255,0.55)",
          marginTop: 16, lineHeight: 1.65, maxWidth: 300,
        }}>
          Gerencie consultas, prontuários e documentos clínicos em um único sistema seguro e eficiente.
        </p>
      </div>

      {/* Badges de recurso */}
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        {[
          "Agendamento de consultas",
          "Prontuários digitais",
          "Emissão de documentos",
        ].map((item) => (
          <div key={item} style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px", borderRadius: 10,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.10)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: T.tealMid, flexShrink: 0,
            }} />
            <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 500 }}>
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail]     = useState("");
  const [senha, setSenha]     = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [erros, setErros]     = useState({});
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {};
    if (!email.trim())         e.email = "Informe seu e-mail";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "E-mail inválido";
    if (!senha)                e.senha = "Informe sua senha";
    else if (senha.length < 4) e.senha = "Senha muito curta";
    return e;
  }

  function entrar(ev) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErros(e); return; }

    setLoading(true);
    // Simula latência mínima para feedback visual
    setTimeout(() => {
      localStorage.setItem("user", email);
      localStorage.setItem("password", senha);
      navigate("/consultas");
    }, 600);
  }

  const inputStyle = (hasErr) => ({
    width: "100%", boxSizing: "border-box",
    padding: "10px 12px 10px 38px",
    borderRadius: 10, fontFamily: "'DM Sans', sans-serif",
    border: `1.5px solid ${hasErr ? T.rose : T.border}`,
    background: T.surface, color: T.text,
    fontSize: 13, outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  });

  return (
    <>
      <style>{FONT}</style>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        .login-input:focus { border-color: ${T.tealMid} !important; box-shadow: 0 0 0 3px rgba(45,212,191,0.15) !important; }
        .login-input-err:focus { border-color: ${T.rose} !important; box-shadow: 0 0 0 3px rgba(225,29,72,0.12) !important; }
        .login-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .login-btn:active:not(:disabled) { transform: scale(0.98); }
        .eye-btn:hover { color: ${T.teal} !important; }
        @media (max-width: 768px) {
          .brand-panel { display: none !important; }
          .form-panel { width: 100% !important; }
        }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .form-anim { animation: fadeUp 0.35s ease both; }
      `}</style>

      <div style={{
        display: "flex", minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        background: T.bg,
      }}>

        {/* Painel esquerdo */}
        <div className="brand-panel">
          <BrandPanel />
        </div>

        {/* Painel direito — formulário */}
        <div className="form-panel" style={{
          flex: 1, display: "flex",
          alignItems: "center", justifyContent: "center",
          padding: "32px 24px",
          background: T.bg,
        }}>
          <div className="form-anim" style={{
            width: "100%", maxWidth: 400,
            display: "flex", flexDirection: "column", gap: 28,
          }}>

            {/* Cabeçalho do form */}
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28, fontWeight: 700,
                color: T.text, margin: 0, letterSpacing: "-0.02em",
              }}>
                Bem-vindo de volta
              </h1>
              <p style={{ fontSize: 13, color: T.textMuted, marginTop: 6 }}>
                Entre com suas credenciais para continuar
              </p>
            </div>

            {/* Formulário */}
            <form
              onSubmit={entrar}
              noValidate
              aria-label="Formulário de login"
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >

              {/* E-mail */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="email"
                  style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.07em" }}
                >
                  E-mail
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                    color: T.textMuted, display: "flex",
                  }}>
                    <Icon.Mail />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErros((p) => ({ ...p, email: undefined })); }}
                    style={inputStyle(!!erros.email)}
                    className={`login-input${erros.email ? " login-input-err" : ""}`}
                    aria-required="true"
                    aria-describedby={erros.email ? "err-email" : undefined}
                    autoComplete="email"
                  />
                </div>
                {erros.email && (
                  <p id="err-email" role="alert" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
                  }}>
                    <Icon.Alert />{erros.email}
                  </p>
                )}
              </div>

              {/* Senha */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label
                  htmlFor="senha"
                  style={{ fontSize: 11, fontWeight: 700, color: T.textSub, textTransform: "uppercase", letterSpacing: "0.07em" }}
                >
                  Senha
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)",
                    color: T.textMuted, display: "flex",
                  }}>
                    <Icon.Lock />
                  </span>
                  <input
                    id="senha"
                    type={mostrarSenha ? "text" : "password"}
                    placeholder="••••••••"
                    value={senha}
                    onChange={(e) => { setSenha(e.target.value); setErros((p) => ({ ...p, senha: undefined })); }}
                    style={{ ...inputStyle(!!erros.senha), paddingRight: 40 }}
                    className={`login-input${erros.senha ? " login-input-err" : ""}`}
                    aria-required="true"
                    aria-describedby={erros.senha ? "err-senha" : undefined}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setMostrarSenha((v) => !v)}
                    aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
                    style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer",
                      color: T.textMuted, display: "flex", padding: 4, borderRadius: 6,
                      transition: "color 0.15s",
                    }}
                  >
                    {mostrarSenha ? <Icon.EyeOff /> : <Icon.Eye />}
                  </button>
                </div>
                {erros.senha && (
                  <p id="err-senha" role="alert" style={{
                    display: "flex", alignItems: "center", gap: 5,
                    fontSize: 11, color: T.rose, fontWeight: 600, margin: 0,
                  }}>
                    <Icon.Alert />{erros.senha}
                  </p>
                )}
              </div>

              {/* Botão */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  width: "100%", padding: "11px", borderRadius: 12, border: "none",
                  background: `linear-gradient(135deg, ${T.tealMid}, ${T.blue})`,
                  color: "#fff", fontSize: 14, fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.75 : 1,
                  transition: "all 0.15s",
                  boxShadow: "0 4px 16px rgba(45,212,191,0.30)",
                  fontFamily: "inherit",
                  marginTop: 4,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      width: 14, height: 14, border: "2px solid rgba(255,255,255,0.4)",
                      borderTopColor: "#fff", borderRadius: "50%",
                      animation: "spin 0.7s linear infinite", flexShrink: 0,
                    }} />
                    Entrando…
                  </>
                ) : (
                  <>Entrar <Icon.ArrowRight /></>
                )}
              </button>

            </form>

            {/* Rodapé */}
            <p style={{
              textAlign: "center", fontSize: 12, color: T.textMuted,
              padding: "12px 16px", borderRadius: 10,
              background: "rgba(148,163,184,0.08)",
              border: `1px solid ${T.border}`,
            }}>
              🔒 Acesso restrito à equipe da clínica
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}