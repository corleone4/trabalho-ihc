import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Máscaras ──────────────────────────────────────────────────────────────────
function maskCPF(v) {
  return v.replace(/\D/g, "").slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}
function maskPhone(v) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
}
function maskCEP(v) {
  return v.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d{1,3})/, "$1-$2");
}

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Badge: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M8 4v4h8V4M12 12h4M12 16h4M8 12h.01M8 16h.01" />
    </svg>
  ),
  Mail: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="4" width="20" height="16" rx="2" /><path d="m2 7 10 7 10-7" />
    </svg>
  ),
  Phone: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 4 5.2 2 2 0 0 1 5.9 3h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.4 2.1L10 11a16 16 0 0 0 6.9 6.9l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.9.7A2 2 0 0 1 22 16.9z" />
    </svg>
  ),
  MapPin: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Calendar: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
};

const STEPS = ["Pessoal", "Endereço"];

function Field({ id, label, icon: IconComp, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id}
        className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
        {IconComp && <IconComp />}{label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">
        {IconComp && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
            <IconComp />
          </span>
        )}
        {children}
      </div>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-rose-400">
          <Icon.Alert />{error}
        </p>
      )}
    </div>
  );
}

function inputCls(withIcon = true, hasError = false) {
  return [
    "w-full rounded-xl border bg-slate-800/60 py-2.5 text-sm text-slate-100",
    "placeholder:text-slate-600 outline-none transition-all duration-200",
    withIcon ? "pl-9 pr-3" : "px-3",
    hasError
      ? "border-rose-500/60 focus:border-rose-400 focus:ring-2 focus:ring-rose-500/20"
      : "border-slate-700/60 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
  ].join(" ");
}

export default function CadastroPaciente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "", cpf: "", email: "", telefone: "",
    nascimento: "", sexo: "",
    logradouro: "", numero: "", bairro: "", cidade: "", cep: "",
  });

  const [erros, setErros] = useState({});
  const [step, setStep] = useState(0);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    let val = value;
    if (name === "cpf")      val = maskCPF(value);
    if (name === "telefone") val = maskPhone(value);
    if (name === "cep")      val = maskCEP(value);
    setErros((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!form.nome.trim()) e.nome = "Nome obrigatório";
      if (!form.email.trim()) e.email = "E-mail obrigatório";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido";
      if (form.cpf && form.cpf.replace(/\D/g, "").length !== 11) e.cpf = "CPF incompleto";
    }
    return e;
  }

  function handleNext() {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErros(e); return; }
    setErros({});
    setStep((s) => s + 1);
  }

  function cadastrar(e) {
    e.preventDefault();
    const e2 = validateStep(0);
    if (Object.keys(e2).length) { setErros(e2); setStep(0); return; }
    try {
      const pacientes = JSON.parse(localStorage.getItem("pacientes") || "[]");
      pacientes.push({ ...form, id: Date.now().toString() });
      localStorage.setItem("pacientes", JSON.stringify(pacientes));
      setSucesso(true);
      setTimeout(() => navigate("/consultas"), 1600);
    } catch {
      setErros({ geral: "Erro ao salvar. Tente novamente." });
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-10">
      <div className="max-w-xl mx-auto flex flex-col gap-6">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => navigate("/consultas")}
            aria-label="Voltar"
            className="flex items-center justify-center w-9 h-9 rounded-xl
                       border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all">
            <Icon.ArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl
                            bg-gradient-to-br from-indigo-500 to-cyan-500
                            text-white shadow-lg shadow-indigo-500/30 shrink-0">
              <Icon.User />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 leading-tight">Cadastro de Paciente</h1>
              <p className="text-xs text-slate-500 mt-0.5">Registre um novo paciente na clínica</p>
            </div>
          </div>
        </div>

        {sucesso ? (
          <div className="rounded-2xl border border-emerald-700/40 bg-emerald-500/10
                          flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-full
                            border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-100">Paciente cadastrado!</p>
            <p className="text-sm text-slate-500">Redirecionando…</p>
          </div>
        ) : (
          <form onSubmit={cadastrar} noValidate
            className="rounded-2xl border border-slate-800 bg-slate-900/80
                       backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">

            {/* Stepper */}
            <div className="flex items-start px-6 pt-5 pb-4 border-b border-slate-800"
              role="tablist">
              {STEPS.map((label, i) => {
                const isActive = i === step;
                const isDone = i < step;
                return (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1 relative">
                    {i < STEPS.length - 1 && (
                      <div className={`absolute top-4 left-1/2 w-full h-px transition-colors duration-300
                        ${isDone ? "bg-indigo-500/50" : "bg-slate-800"}`} />
                    )}
                    <button type="button" role="tab" aria-selected={isActive}
                      onClick={() => isDone && setStep(i)}
                      className={[
                        "relative z-10 flex items-center justify-center w-8 h-8 rounded-full",
                        "text-xs font-bold border-2 transition-all duration-300",
                        isDone
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-pointer"
                          : isActive
                          ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40"
                          : "bg-slate-800 border-slate-700 text-slate-600 cursor-default",
                      ].join(" ")}>
                      {isDone
                        ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
                        : i + 1}
                    </button>
                    <span className={[
                      "text-[10px] font-semibold tracking-wider uppercase transition-colors",
                      isActive ? "text-indigo-400" : isDone ? "text-emerald-500" : "text-slate-600",
                    ].join(" ")}>{label}</span>
                  </div>
                );
              })}
            </div>

            <div className="px-6 py-6 flex flex-col gap-5">

              {/* STEP 0 — Dados pessoais */}
              {step === 0 && (
                <>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                    Dados pessoais
                  </p>

                  <Field id="nome" label="Nome completo" icon={Icon.User} required error={erros.nome}>
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.User /></span>
                    <input id="nome" name="nome" className={inputCls(true, !!erros.nome)}
                      placeholder="Maria da Silva" value={form.nome} onChange={handleChange}
                      aria-required="true" />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field id="cpf" label="CPF" icon={Icon.Badge} error={erros.cpf}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.Badge /></span>
                      <input id="cpf" name="cpf" className={inputCls(true, !!erros.cpf)}
                        placeholder="000.000.000-00" value={form.cpf} onChange={handleChange}
                        inputMode="numeric" />
                    </Field>

                    <Field id="nascimento" label="Nascimento" icon={Icon.Calendar}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.Calendar /></span>
                      <input id="nascimento" name="nascimento" type="date"
                        className={inputCls(true, false)} value={form.nascimento} onChange={handleChange} />
                    </Field>
                  </div>

                  <Field id="email" label="E-mail" icon={Icon.Mail} required error={erros.email}>
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.Mail /></span>
                    <input id="email" name="email" type="email"
                      className={inputCls(true, !!erros.email)}
                      placeholder="maria@email.com" value={form.email} onChange={handleChange}
                      inputMode="email" aria-required="true" />
                  </Field>

                  <div className="grid grid-cols-2 gap-4">
                    <Field id="telefone" label="Telefone" icon={Icon.Phone}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.Phone /></span>
                      <input id="telefone" name="telefone"
                        className={inputCls(true, false)}
                        placeholder="(11) 99999-9999" value={form.telefone} onChange={handleChange}
                        inputMode="tel" />
                    </Field>

                    <Field id="sexo" label="Sexo">
                      <select id="sexo" name="sexo" value={form.sexo} onChange={handleChange}
                        className={inputCls(false, false) + " appearance-none cursor-pointer"}>
                        <option value="">Selecione</option>
                        <option>Masculino</option>
                        <option>Feminino</option>
                        <option>Outro</option>
                      </select>
                    </Field>
                  </div>
                </>
              )}

              {/* STEP 1 — Endereço */}
              {step === 1 && (
                <>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                    Endereço
                  </p>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <Field id="logradouro" label="Logradouro" icon={Icon.MapPin}>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.MapPin /></span>
                        <input id="logradouro" name="logradouro"
                          className={inputCls(true, false)}
                          placeholder="Rua, avenida…" value={form.logradouro} onChange={handleChange} />
                      </Field>
                    </div>

                    <Field id="numero" label="Número">
                      <input id="numero" name="numero"
                        className={inputCls(false, false)}
                        placeholder="123" value={form.numero} onChange={handleChange}
                        inputMode="numeric" />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field id="bairro" label="Bairro">
                      <input id="bairro" name="bairro"
                        className={inputCls(false, false)}
                        placeholder="Centro" value={form.bairro} onChange={handleChange} />
                    </Field>

                    <Field id="cep" label="CEP">
                      <input id="cep" name="cep"
                        className={inputCls(false, false)}
                        placeholder="00000-000" value={form.cep} onChange={handleChange}
                        inputMode="numeric" />
                    </Field>
                  </div>

                  <Field id="cidade" label="Cidade" icon={Icon.MapPin}>
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"><Icon.MapPin /></span>
                    <input id="cidade" name="cidade"
                      className={inputCls(true, false)}
                      placeholder="São Paulo" value={form.cidade} onChange={handleChange} />
                  </Field>
                </>
              )}

              {erros.geral && (
                <div role="alert"
                  className="flex items-center gap-2 rounded-xl border border-rose-500/25
                             bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                  <Icon.Alert />{erros.geral}
                </div>
              )}
            </div>

            {/* Rodapé */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-800">
              <button type="button" onClick={() => navigate("/consultas")}
                className="text-sm text-slate-500 hover:text-slate-300 transition-colors
                           px-2 py-1.5 rounded-lg hover:bg-slate-800/60">
                Cancelar
              </button>
              <div className="flex items-center gap-2">
                {step > 0 && (
                  <button type="button" onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                               border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all">
                    <Icon.ArrowLeft /> Voltar
                  </button>
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" onClick={handleNext}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                               bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                               shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all">
                    Próximo
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </button>
                ) : (
                  <button type="submit"
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                               bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                               shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all">
                    <Icon.Check /> Cadastrar Paciente
                  </button>
                )}
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}