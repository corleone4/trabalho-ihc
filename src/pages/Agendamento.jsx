import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Stethoscope: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Notes: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
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

// ── Campo acessível ───────────────────────────────────────────────────────────
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

// ── Chip de tipo de consulta ──────────────────────────────────────────────────
const TIPOS = ["Rotina", "Urgência", "Retorno", "Exame", "Cirurgia"];
const TIPO_COLOR = {
  Rotina:   "border-indigo-500 bg-indigo-500/20 text-indigo-300",
  Urgência: "border-rose-500 bg-rose-500/20 text-rose-300",
  Retorno:  "border-cyan-500 bg-cyan-500/20 text-cyan-300",
  Exame:    "border-amber-500 bg-amber-500/20 text-amber-300",
  Cirurgia: "border-purple-500 bg-purple-500/20 text-purple-300",
};

export default function Agendamento() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [erros, setErros] = useState({});
  const [sucesso, setSucesso] = useState(false);

  const [form, setForm] = useState({
    paciente: "", medico: "", data: "", hora: "", tipo: "", descricao: "",
  });

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes") || "[]"));
    setMedicos(JSON.parse(localStorage.getItem("medicos") || "[]"));
  }, []);

  const hoje = new Date().toISOString().split("T")[0];

  const medicoSelecionado = medicos.find((m) => m.nome === form.medico);

  function handleChange(e) {
    const { name, value } = e.target;
    setErros((prev) => ({ ...prev, [name]: undefined }));
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!form.paciente) e.paciente = "Selecione um paciente";
    if (!form.medico)   e.medico   = "Selecione um médico";
    if (!form.data)     e.data     = "Selecione a data";
    if (!form.hora)     e.hora     = "Selecione o horário";
    return e;
  }

  function agendar(e) {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErros(e2); return; }

    try {
      const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
      consultas.push({
        ...form,
        // salva nome isolado para compatibilidade com Consultas.jsx
        medico: medicoSelecionado?.nome ?? form.medico,
        id: Date.now().toString(),
        status: "agendada",
        criadoEm: new Date().toISOString(),
      });
      localStorage.setItem("consultas", JSON.stringify(consultas));
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
          <button
            type="button"
            onClick={() => navigate("/consultas")}
            aria-label="Voltar para consultas"
            className="flex items-center justify-center w-9 h-9 rounded-xl
                       border border-slate-700 text-slate-400 hover:bg-slate-800 transition-all"
          >
            <Icon.ArrowLeft />
          </button>
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl
                            bg-gradient-to-br from-indigo-500 to-cyan-500
                            text-white shadow-lg shadow-indigo-500/30 shrink-0">
              <Icon.Calendar />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-100 leading-tight">Novo Agendamento</h1>
              <p className="text-xs text-slate-500 mt-0.5">Marque uma consulta para o paciente</p>
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
            <p className="text-base font-bold text-slate-100">Consulta agendada!</p>
            <p className="text-sm text-slate-500">Redirecionando…</p>
          </div>
        ) : (
          <form onSubmit={agendar} noValidate
            className="rounded-2xl border border-slate-800 bg-slate-900/80
                       backdrop-blur-sm shadow-2xl shadow-black/40 overflow-hidden">

            <div className="px-6 py-6 flex flex-col gap-5">

              {/* Paciente */}
              <Field id="paciente" label="Paciente" icon={Icon.User} required error={erros.paciente}>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon.User />
                </span>
                <select id="paciente" name="paciente" value={form.paciente}
                  onChange={handleChange}
                  className={inputCls(true, !!erros.paciente) + " appearance-none cursor-pointer"}
                  aria-required="true">
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id ?? p.cpf ?? p.nome} value={p.nome}>{p.nome}</option>
                  ))}
                </select>
              </Field>

              {/* Médico */}
              <Field id="medico" label="Médico" icon={Icon.Stethoscope} required error={erros.medico}>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon.Stethoscope />
                </span>
                <select id="medico" name="medico" value={form.medico}
                  onChange={handleChange}
                  className={inputCls(true, !!erros.medico) + " appearance-none cursor-pointer"}
                  aria-required="true">
                  <option value="">Selecione um médico</option>
                  {medicos.map((m) => (
                    <option key={m.id ?? m.crm ?? m.nome} value={m.nome}>
                      {m.nome}{m.especialidade ? ` — ${m.especialidade}` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Card info do médico */}
              {medicoSelecionado && (
                <div className="flex items-center gap-3 rounded-xl border border-indigo-500/20
                                bg-indigo-500/8 px-4 py-3">
                  <div className="text-indigo-400 shrink-0"><Icon.Clock /></div>
                  <p className="text-sm text-slate-300">
                    Atendimento:{" "}
                    <span className="font-semibold text-indigo-300">
                      {medicoSelecionado.horarioInicio} às {medicoSelecionado.horarioFim}
                    </span>
                    {medicoSelecionado.dias?.length > 0 && (
                      <span className="text-slate-500">
                        {" "}· {medicoSelecionado.dias.join(", ")}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* Data e hora */}
              <div className="grid grid-cols-2 gap-4">
                <Field id="data" label="Data" icon={Icon.Calendar} required error={erros.data}>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icon.Calendar />
                  </span>
                  <input id="data" name="data" type="date" min={hoje}
                    value={form.data} onChange={handleChange}
                    className={inputCls(true, !!erros.data)}
                    aria-required="true" />
                </Field>

                <Field id="hora" label="Horário" icon={Icon.Clock} required error={erros.hora}>
                  <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                    <Icon.Clock />
                  </span>
                  <input id="hora" name="hora" type="time"
                    value={form.hora} onChange={handleChange}
                    className={inputCls(true, !!erros.hora)}
                    aria-required="true" />
                </Field>
              </div>

              {/* Tipo — chips */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400
                                 flex items-center gap-1.5">
                  <Icon.Tag /> Tipo de consulta
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de consulta">
                  {TIPOS.map((t) => {
                    const sel = form.tipo === t;
                    return (
                      <button key={t} type="button"
                        onClick={() => setForm((prev) => ({ ...prev, tipo: t }))}
                        aria-pressed={sel}
                        className={[
                          "px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200",
                          sel ? TIPO_COLOR[t] : "border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300",
                        ].join(" ")}>
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-1.5">
                <label htmlFor="descricao"
                  className="text-[10px] font-bold tracking-widest uppercase text-slate-400
                             flex items-center gap-1.5">
                  <Icon.Notes /> Observações
                </label>
                <textarea id="descricao" name="descricao"
                  placeholder="Sintomas, retorno, exames…"
                  value={form.descricao} onChange={handleChange} rows={3}
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60
                             px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-600
                             outline-none resize-none transition-all duration-200
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20" />
              </div>

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
              <button type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                           bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                           shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all">
                <Icon.Check /> Confirmar Agendamento
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}