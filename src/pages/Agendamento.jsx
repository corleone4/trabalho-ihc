import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// ── Ícones ────────────────────────────────────────────────────────────────────
const Icon = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  User: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
    </svg>
  ),
  Stethoscope: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" /><circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Tag: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  Notes: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" /><path d="M12 8v4M12 16h.01" />
    </svg>
  ),
  Check: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
  ArrowLeft: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
};

// ── Chip de tipo de consulta ──────────────────────────────────────────────────
const TIPOS = ["Rotina", "Urgência", "Retorno", "Exame", "Cirurgia"];

// CORREÇÃO: cores adaptadas para tema claro (text-*-700 e bg-*-50/border-*-300)
const TIPO_COLOR = {
  Rotina:   { sel: "border-indigo-400 bg-indigo-50 text-indigo-700",  idle: "border-slate-300 text-slate-600 hover:border-indigo-300 hover:bg-indigo-50/60" },
  Urgência: { sel: "border-rose-400 bg-rose-50 text-rose-700",         idle: "border-slate-300 text-slate-600 hover:border-rose-300 hover:bg-rose-50/60" },
  Retorno:  { sel: "border-cyan-400 bg-cyan-50 text-cyan-700",          idle: "border-slate-300 text-slate-600 hover:border-cyan-300 hover:bg-cyan-50/60" },
  Exame:    { sel: "border-amber-400 bg-amber-50 text-amber-700",       idle: "border-slate-300 text-slate-600 hover:border-amber-300 hover:bg-amber-50/60" },
  Cirurgia: { sel: "border-purple-400 bg-purple-50 text-purple-700",    idle: "border-slate-300 text-slate-600 hover:border-purple-300 hover:bg-purple-50/60" },
};

// ── Campo acessível — tema claro ──────────────────────────────────────────────
function Field({ id, label, icon: IconComp, required, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-600"
      >
        {IconComp && <span className="text-slate-400"><IconComp /></span>}
        {label}
        {required && <span className="text-rose-500" aria-label="obrigatório">*</span>}
      </label>
      <div className="relative">
        {IconComp && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            <IconComp />
          </span>
        )}
        {children}
      </div>
      {error && (
        <p role="alert" className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
          <Icon.Alert />{error}
        </p>
      )}
    </div>
  );
}

// CORREÇÃO: inputCls agora usa tema claro consistente com Layout
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
export default function Agendamento() {
  const navigate = useNavigate();

  // ── BUG FIX: lê o id da URL para modo edição ──────────────────────────────
  // Antes: o botão de editar em Consultas.jsx navegava para /agendamento/:id,
  // mas este componente nunca lia o parâmetro — formulário abria vazio/undefined.
  // Agora: se existir um `id` na rota, o formulário é pré-preenchido com os
  // dados da consulta existente, e o submit atualiza em vez de criar um novo.
  const { id: editId } = useParams();
  const isEditing = Boolean(editId);

  const [pacientes, setPacientes] = useState([]);
  const [medicos,   setMedicos]   = useState([]);
  const [erros,     setErros]     = useState({});
  const [sucesso,   setSucesso]   = useState(false);

  const [form, setForm] = useState({
    paciente: "", medico: "", data: "", hora: "", tipo: "", descricao: "",
  });

  useEffect(() => {
    const pacs = JSON.parse(localStorage.getItem("pacientes") || "[]");
    const meds = JSON.parse(localStorage.getItem("medicos")   || "[]");
    setPacientes(pacs);
    setMedicos(meds);

    // Se estiver editando, pré-carrega os dados da consulta existente
    if (editId) {
      const consultas = JSON.parse(localStorage.getItem("consultas") || "[]");
      const consulta  = consultas.find((c) => c.id === editId);
      if (consulta) {
        setForm({
          paciente:  consulta.paciente  ?? "",
          medico:    consulta.medico    ?? "",
          data:      consulta.data      ?? "",
          hora:      consulta.hora      ?? consulta.horario ?? "",
          tipo:      consulta.tipo      ?? "",
          descricao: consulta.descricao ?? "",
        });
      }
    }
  }, [editId]);

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

      if (isEditing) {
        // Modo edição: substitui a consulta existente preservando id e status
        const index = consultas.findIndex((c) => c.id === editId);
        if (index !== -1) {
          consultas[index] = {
            ...consultas[index],
            ...form,
            medico: medicoSelecionado?.nome ?? form.medico,
          };
        }
      } else {
        // Modo criação: adiciona nova consulta
        consultas.push({
          ...form,
          medico:    medicoSelecionado?.nome ?? form.medico,
          id:        Date.now().toString(),
          status:    "agendada",
          criadoEm:  new Date().toISOString(),
        });
      }

      localStorage.setItem("consultas", JSON.stringify(consultas));
      setSucesso(true);
      setTimeout(() => navigate("/consultas"), 1600);
    } catch {
      setErros({ geral: "Erro ao salvar. Tente novamente." });
    }
  }

  return (
    // CORREÇÃO: bg-slate-50 consistente com Layout (removido bg-slate-950)
    <div className="flex flex-col items-center px-4 py-2">
      <div className="max-w-xl w-full flex flex-col gap-6">

        {/* ── Cabeçalho ─────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/consultas")}
            aria-label="Voltar para consultas"
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0
                       border border-slate-300 text-slate-500 bg-white
                       hover:bg-slate-50 hover:border-slate-400
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500
                       transition-all"
          >
            <Icon.ArrowLeft />
          </button>

          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-11 h-11 rounded-2xl shrink-0
                         bg-gradient-to-br from-indigo-500 to-cyan-500
                         text-white shadow-md shadow-indigo-500/25"
              aria-hidden="true"
            >
              {isEditing ? <Icon.Edit /> : <Icon.Calendar />}
            </div>
            <div>
              {/* Título muda conforme modo criação/edição */}
              <h1 className="text-xl font-bold text-slate-800 leading-tight">
                {isEditing ? "Editar Consulta" : "Novo Agendamento"}
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                {isEditing
                  ? "Atualize os dados do agendamento"
                  : "Marque uma consulta para o paciente"}
              </p>
            </div>
          </div>
        </div>

        {/* ── Tela de sucesso ───────────────────────────────────────────── */}
        {sucesso ? (
          <div
            role="status"
            aria-live="polite"
            className="rounded-2xl border border-emerald-200 bg-emerald-50
                       flex flex-col items-center gap-3 py-14 text-center"
          >
            <div className="flex items-center justify-center w-14 h-14 rounded-full
                            border-2 border-emerald-400 bg-white text-emerald-500">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            </div>
            <p className="text-base font-bold text-slate-800">
              {isEditing ? "Consulta atualizada!" : "Consulta agendada!"}
            </p>
            <p className="text-sm text-slate-500">Redirecionando…</p>
          </div>

        ) : (
          /* ── Formulário ──────────────────────────────────────────────── */
          <form
            onSubmit={agendar}
            noValidate
            aria-label={isEditing ? "Formulário de edição de consulta" : "Formulário de novo agendamento"}
            className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/60 overflow-hidden"
          >
            <div className="px-6 py-6 flex flex-col gap-5">

              {/* Paciente */}
              <Field id="paciente" label="Paciente" icon={Icon.User} required error={erros.paciente}>
                <select
                  id="paciente" name="paciente" value={form.paciente}
                  onChange={handleChange}
                  className={inputCls(true, !!erros.paciente) + " appearance-none cursor-pointer"}
                  aria-required="true"
                  aria-describedby={erros.paciente ? "err-paciente" : undefined}
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id ?? p.cpf ?? p.nome} value={p.nome}>{p.nome}</option>
                  ))}
                </select>
              </Field>

              {/* Médico */}
              <Field id="medico" label="Médico" icon={Icon.Stethoscope} required error={erros.medico}>
                <select
                  id="medico" name="medico" value={form.medico}
                  onChange={handleChange}
                  className={inputCls(true, !!erros.medico) + " appearance-none cursor-pointer"}
                  aria-required="true"
                  aria-describedby={erros.medico ? "err-medico" : undefined}
                >
                  <option value="">Selecione um médico</option>
                  {medicos.map((m) => (
                    <option key={m.id ?? m.crm ?? m.nome} value={m.nome}>
                      {m.nome}{m.especialidade ? ` — ${m.especialidade}` : ""}
                    </option>
                  ))}
                </select>
              </Field>

              {/* Card de disponibilidade do médico selecionado */}
              {medicoSelecionado && (medicoSelecionado.horarioInicio || medicoSelecionado.dias?.length > 0) && (
                <div
                  className="flex items-start gap-3 rounded-xl border border-indigo-100
                             bg-indigo-50 px-4 py-3"
                  role="note"
                  aria-label="Disponibilidade do médico selecionado"
                >
                  <span className="text-indigo-500 shrink-0 mt-0.5"><Icon.Clock /></span>
                  <p className="text-sm text-slate-700">
                    Atendimento:{" "}
                    {medicoSelecionado.horarioInicio && medicoSelecionado.horarioFim && (
                      <span className="font-semibold text-indigo-700">
                        {medicoSelecionado.horarioInicio} às {medicoSelecionado.horarioFim}
                      </span>
                    )}
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
                  <input
                    id="data" name="data" type="date" min={hoje}
                    value={form.data} onChange={handleChange}
                    className={inputCls(true, !!erros.data)}
                    aria-required="true"
                    aria-describedby={erros.data ? "err-data" : undefined}
                  />
                </Field>

                <Field id="hora" label="Horário" icon={Icon.Clock} required error={erros.hora}>
                  <input
                    id="hora" name="hora" type="time"
                    value={form.hora} onChange={handleChange}
                    className={inputCls(true, !!erros.hora)}
                    aria-required="true"
                    aria-describedby={erros.hora ? "err-hora" : undefined}
                  />
                </Field>
              </div>

              {/* Tipo — chips */}
              <div className="flex flex-col gap-2">
                <span
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-600"
                  id="tipo-label"
                >
                  <span className="text-slate-400"><Icon.Tag /></span>
                  Tipo de consulta
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </span>
                <div className="flex flex-wrap gap-2" role="group" aria-labelledby="tipo-label">
                  {TIPOS.map((t) => {
                    const sel = form.tipo === t;
                    return (
                      <button
                        key={t} type="button"
                        onClick={() => setForm((prev) => ({ ...prev, tipo: sel ? "" : t }))}
                        aria-pressed={sel}
                        className={[
                          "px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all duration-200",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1",
                          sel ? TIPO_COLOR[t].sel : TIPO_COLOR[t].idle,
                        ].join(" ")}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Observações */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="descricao"
                  className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-slate-600"
                >
                  <span className="text-slate-400"><Icon.Notes /></span>
                  Observações
                  <span className="text-slate-400 font-normal">(opcional)</span>
                </label>
                {/* CORREÇÃO: removido bg-slate-800/60 text-slate-100 (dark) */}
                <textarea
                  id="descricao" name="descricao"
                  placeholder="Sintomas, retorno, exames…"
                  value={form.descricao} onChange={handleChange} rows={3}
                  className="w-full rounded-xl border border-slate-300 bg-white
                             px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400
                             outline-none resize-none transition-all duration-200
                             focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              {/* Erro global */}
              {erros.geral && (
                <div
                  role="alert"
                  className="flex items-center gap-2 rounded-xl border border-rose-200
                             bg-rose-50 px-4 py-3 text-sm text-rose-700 font-medium"
                >
                  <Icon.Alert />{erros.geral}
                </div>
              )}
            </div>

            {/* ── Rodapé ───────────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={() => navigate("/consultas")}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors
                           px-3 py-1.5 rounded-lg hover:bg-slate-100 font-medium"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold
                           bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                           shadow-md shadow-indigo-500/25 hover:opacity-90 active:scale-95
                           focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                           transition-all"
              >
                <Icon.Check />
                {isEditing ? "Salvar Alterações" : "Confirmar Agendamento"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}