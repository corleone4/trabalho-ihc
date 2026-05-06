import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Máscaras ─────────────────────────────────────────────────────────────────
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
function maskCRM(v) {
  return v.replace(/\D/g, "").slice(0, 6);
}

// ── Dados estáticos ───────────────────────────────────────────────────────────
const DIAS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const ESPECIALIDADES = [
  "Clínico Geral", "Cardiologia", "Pediatria", "Ortopedia",
  "Dermatologia", "Neurologia", "Ginecologia", "Psiquiatria",
];
const STEPS = ["Profissional", "Contato", "Disponibilidade"];

// ── Ícones SVG inline ─────────────────────────────────────────────────────────
const Icon = {
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Stethoscope: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Check: () => (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
};

// ── Componente de campo acessível ─────────────────────────────────────────────
function Field({ id, label, icon: IconComp, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400"
      >
        {IconComp && <IconComp />}
        {label}
        {required && <span className="text-rose-400">*</span>}
      </label>
      <div className="relative">{children}</div>
      {error && (
        <p id={`err-${id}`} role="alert" className="flex items-center gap-1.5 text-xs text-rose-400">
          <Icon.Alert /> {error}
        </p>
      )}
    </div>
  );
}

// ── Classes de input ──────────────────────────────────────────────────────────
function inputCls(withIcon = true, hasError = false) {
  return [
    "w-full rounded-xl border bg-white py-2.5 text-sm text-slate-800",
    "placeholder:text-slate-400 outline-none transition-all duration-200",
    withIcon ? "pl-9 pr-3" : "px-3",
    hasError
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
      : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
  ].join(" ");
}

// ── Componente principal ──────────────────────────────────────────────────────
export default function CadastroMedico() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "", crm: "", cpf: "", email: "",
    telefone: "", especialidade: "",
    horarioInicio: "", horarioFim: "",
    dias: [], observacoes: "",
  });
  const [erros, setErros] = useState({});
  const [step, setStep] = useState(0);
  const [sucesso, setSucesso] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    let val = value;
    if (name === "cpf") val = maskCPF(value);
    if (name === "telefone") val = maskPhone(value);
    if (name === "crm") val = maskCRM(value);
    setErros((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: val }));
  }

  function toggleDia(dia) {
    setForm((prev) => ({
      ...prev,
      dias: prev.dias.includes(dia)
        ? prev.dias.filter((d) => d !== dia)
        : [...prev.dias, dia],
    }));
  }

  function validateStep(s) {
    const e = {};
    if (s === 0) {
      if (!form.nome.trim()) e.nome = "Nome obrigatório";
      if (!form.crm) e.crm = "CRM obrigatório";
      if (!form.especialidade) e.especialidade = "Especialidade obrigatória";
      if (form.cpf && form.cpf.replace(/\D/g, "").length !== 11) e.cpf = "CPF incompleto";
    }
    if (s === 1 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "E-mail inválido";
    if (s === 2 && form.horarioInicio && form.horarioFim && form.horarioFim <= form.horarioInicio)
      e.horarioFim = "Horário fim deve ser após o início";
    return e;
  }

  function handleNext() {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErros(e); return; }
    setErros({});
    setStep((s) => s + 1);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const e2 = validateStep(2);
    if (Object.keys(e2).length) { setErros(e2); return; }
    try {
      const medicos = JSON.parse(localStorage.getItem("medicos") || "[]");
      medicos.push({ ...form, id: Date.now() });
      localStorage.setItem("medicos", JSON.stringify(medicos));
      setSucesso(true);
      setTimeout(() => navigate("/consultas"), 1800);
    } catch {
      setErros({ geral: "Erro ao salvar. Tente novamente." });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-10">

      <div className="w-full max-w-xl">

        {/* Cabeçalho */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center justify-center w-11 h-11 rounded-2xl
                          bg-gradient-to-br from-indigo-500 to-cyan-500
                          shadow-lg shadow-indigo-500/30 text-white shrink-0">
            <Icon.Stethoscope />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950 leading-tight">Cadastro de Médico</h1>
            <p className="text-xs text-slate-950 mt-0.5">Registre um profissional da clínica</p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 overflow-hidden" >

          {sucesso ? (
            <div className="flex flex-col items-center justify-center gap-4 py-16 px-8 text-center">
              <div className="flex items-center justify-center w-16 h-16 rounded-full
                              border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="text-lg font-bold text-slate-800">Médico cadastrado com sucesso!</p>
              <p className="text-sm text-slate-500">Redirecionando para consultas…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>

              {/* Stepper */}
              <div className="flex items-start px-6 pt-5 pb-4 border-b border-slate-200"
                role="tablist" aria-label="Etapas do cadastro">
                {STEPS.map((label, i) => {
                  const isActive = i === step;
                  const isDone = i < step;
                  return (
                    <div key={label} className="flex-1 flex flex-col items-center gap-1 relative">
                      {i < STEPS.length - 1 && (
                        <div className={`absolute top-4 left-1/2 w-full h-px transition-colors duration-300
                          ${isDone ? "bg-indigo-500/50" : "bg-slate-800"}`} />
                      )}
                      <button
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => isDone && setStep(i)}
                        className={[
                          "relative z-10 flex items-center justify-center w-8 h-8 rounded-full",
                          "text-xs font-bold border-2 transition-all duration-300",
                          isDone
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400 cursor-pointer"
                            : isActive
                              ? "bg-indigo-500 border-indigo-400 text-white shadow-lg shadow-indigo-500/40"
                              : "bg-slate-800 border-slate-700 text-slate-600 cursor-default",
                        ].join(" ")}
                      >
                        {isDone ? <Icon.Check /> : i + 1}
                      </button>
                      <span className={[
                        "text-[10px] font-semibold tracking-wider uppercase transition-colors",
                        isActive ? "text-indigo-400" : isDone ? "text-emerald-500" : "text-slate-600",
                      ].join(" ")}>
                        {label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Corpo */}
              <div className="px-6 py-6 flex flex-col gap-5">

                {/* STEP 0 */}
                {step === 0 && (
                  <>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                      Dados profissionais
                    </p>

                    <Field id="nome" label="Nome completo" icon={Icon.User} required error={erros.nome}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Icon.User />
                      </span>
                      <input
                        id="nome" name="nome"
                        className={inputCls(true, !!erros.nome)}
                        placeholder="Dr. João Silva"
                        value={form.nome} onChange={handleChange}
                        aria-required="true"
                        aria-describedby={erros.nome ? "err-nome" : undefined}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field id="crm" label="CRM" icon={Icon.Badge} required error={erros.crm}>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Icon.Badge />
                        </span>
                        <input
                          id="crm" name="crm"
                          className={inputCls(true, !!erros.crm)}
                          placeholder="123456"
                          value={form.crm} onChange={handleChange}
                          inputMode="numeric" aria-required="true"
                          aria-describedby={erros.crm ? "err-crm" : undefined}
                        />
                      </Field>

                      <Field id="cpf" label="CPF" icon={Icon.Badge} error={erros.cpf}>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Icon.Badge />
                        </span>
                        <input
                          id="cpf" name="cpf"
                          className={inputCls(true, !!erros.cpf)}
                          placeholder="000.000.000-00"
                          value={form.cpf} onChange={handleChange}
                          inputMode="numeric"
                          aria-describedby={erros.cpf ? "err-cpf" : undefined}
                        />
                      </Field>
                    </div>

                    <Field id="especialidade" label="Especialidade" icon={Icon.Stethoscope} required error={erros.especialidade}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Icon.Stethoscope />
                      </span>
                      <select
                        id="especialidade" name="especialidade"
                        className={inputCls(true, !!erros.especialidade) + " appearance-none cursor-pointer"}
                        value={form.especialidade} onChange={handleChange}
                        aria-required="true"
                      >
                        <option value="">Selecione a especialidade</option>
                        {ESPECIALIDADES.map((e) => <option key={e}>{e}</option>)}
                      </select>
                    </Field>
                  </>
                )}

                {/* STEP 1 */}
                {step === 1 && (
                  <>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                      Informações de contato
                    </p>

                    <Field id="email" label="E-mail" icon={Icon.Mail} error={erros.email}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Icon.Mail />
                      </span>
                      <input
                        id="email" name="email" type="email"
                        className={inputCls(true, !!erros.email)}
                        placeholder="medico@clinica.com.br"
                        value={form.email} onChange={handleChange}
                        inputMode="email"
                        aria-describedby={erros.email ? "err-email" : undefined}
                      />
                    </Field>

                    <Field id="telefone" label="Telefone / WhatsApp" icon={Icon.Phone}>
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                        <Icon.Phone />
                      </span>
                      <input
                        id="telefone" name="telefone"
                        className={inputCls(true, false)}
                        placeholder="(11) 99999-9999"
                        value={form.telefone} onChange={handleChange}
                        inputMode="tel"
                      />
                    </Field>
                  </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                  <>
                    <p className="text-[10px] font-bold tracking-widest uppercase text-indigo-400">
                      Disponibilidade
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                      <Field id="horarioInicio" label="Início" icon={Icon.Clock}>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Icon.Clock />
                        </span>
                        <input
                          id="horarioInicio" name="horarioInicio" type="time"
                          className={inputCls(true, false)}
                          value={form.horarioInicio} onChange={handleChange}
                        />
                      </Field>

                      <Field id="horarioFim" label="Fim" icon={Icon.Clock} error={erros.horarioFim}>
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                          <Icon.Clock />
                        </span>
                        <input
                          id="horarioFim" name="horarioFim" type="time"
                          className={inputCls(true, !!erros.horarioFim)}
                          value={form.horarioFim} onChange={handleChange}
                          aria-describedby={erros.horarioFim ? "err-horarioFim" : undefined}
                        />
                      </Field>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span id="dias-label"
                        className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                        Dias de atendimento
                      </span>
                      <div className="flex flex-wrap gap-2" role="group" aria-labelledby="dias-label">
                        {DIAS.map((dia) => {
                          const sel = form.dias.includes(dia);
                          return (
                            <button
                              key={dia} type="button"
                              onClick={() => toggleDia(dia)}
                              aria-pressed={sel}
                              className={[
                                "px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                                sel
                                  ? "bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-sm shadow-indigo-500/20"
                                  : "bg-transparent border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300",
                              ].join(" ")}
                            >
                              {dia}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="observacoes"
                        className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                        Observações
                      </label>
                      <textarea
                        id="observacoes" name="observacoes"
                        className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60
                                   px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-500
                                   outline-none resize-none transition-all duration-200
                                   focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                        placeholder="Informações adicionais sobre o profissional…"
                        value={form.observacoes} onChange={handleChange}
                        rows={3}
                      />
                    </div>
                  </>
                )}

                {/* Erro global */}
                {erros.geral && (
                  <div role="alert"
                    className="flex items-center gap-2 rounded-xl border border-rose-500/25
                                  bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
                    <Icon.Alert /> {erros.geral}
                  </div>
                )}
              </div>

              {/* Rodapé */}
              <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => navigate("/consultas")}
                  className="text-sm text-slate-600 hover:text-slate-300 transition-colors
                             px-2 py-1.5 rounded-lg hover:bg-white"
                >
                  Cancelar
                </button>

                <div className="flex items-center gap-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={() => setStep((s) => s - 1)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium
                                 border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all"
                    >
                      <Icon.ArrowLeft /> Voltar
                    </button>
                  )}

                  {step < 2 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                                 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                                 shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all"
                    >
                      Próximo <Icon.ArrowRight />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                                 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                                 shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all"
                    >
                      <Icon.Check /> Cadastrar
                    </button>
                  )}
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
