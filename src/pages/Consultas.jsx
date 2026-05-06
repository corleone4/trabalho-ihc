import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Ícones SVG inline ─────────────────────────────────────────────────────────
const Icon = {
  Calendar: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" />
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
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  ),
  Search: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
    </svg>
  ),
  EmptyBox: () => (
    <svg className="w-12 h-12" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path d="M21 8V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2" />
      <path d="M3 8h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8z" />
      <path d="M10 12h4" />
    </svg>
  ),
  Alert: () => (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  X: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  ),
};

// ── Status badge ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  agendada:   { label: "Agendada",   cls: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" },
  confirmada: { label: "Confirmada", cls: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  cancelada:  { label: "Cancelada",  cls: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
  realizada:  { label: "Realizada",  cls: "bg-slate-500/20 text-slate-400 border-slate-600/40" },
};

function StatusBadge({ status }) {
  const s = STATUS_MAP[status] ?? STATUS_MAP.agendada;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold
                      tracking-wider uppercase border ${s.cls}`}>
      {s.label}
    </span>
  );
}

// ── Modal de confirmação de exclusão ──────────────────────────────────────────
function ConfirmModal({ consulta, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4
                 bg-black/60 backdrop-blur-sm"
      role="dialog" aria-modal="true" aria-labelledby="modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900
                      shadow-2xl shadow-black/60 p-6 flex flex-col gap-5">

        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl
                          bg-rose-500/15 text-rose-400 shrink-0">
            <Icon.Alert />
          </div>
          <div>
            <h2 id="modal-title" className="text-base font-bold text-slate-100">
              Excluir consulta?
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              A consulta de <span className="text-slate-200 font-medium">{consulta?.paciente}</span> com{" "}
              <span className="text-slate-200 font-medium">{consulta?.medico}</span> será removida
              permanentemente.
            </p>
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400
                       border border-slate-700 hover:bg-slate-800 transition-all"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white
                       bg-rose-600 hover:bg-rose-500 active:scale-95 transition-all"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Componente principal ──────────────────────────────────────────────────────
const FILTROS = ["Todas", "Agendada", "Confirmada", "Realizada", "Cancelada"];

export default function Consultas() {
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [busca, setBusca] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("Todas");
  const [pendingDelete, setPendingDelete] = useState(null); // { id }

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("consultas") || "[]");
    setConsultas(dados);
  }, []);

  // ── Filtros ────────────────────────────────────────────────────────────────
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

  // ── Exclusão ───────────────────────────────────────────────────────────────
  function confirmarExclusao() {
    const novas = consultas.filter((c) => c.id !== pendingDelete);
    localStorage.setItem("consultas", JSON.stringify(novas));
    setConsultas(novas);
    setPendingDelete(null);
  }

  const consultaParaExcluir = consultas.find((c) => c.id === pendingDelete);

  // ── Métricas rápidas ───────────────────────────────────────────────────────
  const total     = consultas.length;
  const hoje      = new Date().toDateString();
  const hojeCount = consultas.filter((c) => new Date(c.data).toDateString() === hoje).length;
  const pendentes = consultas.filter(
    (c) => !["realizada", "cancelada"].includes(c.status ?? "agendada")
  ).length;

  return (
    <>
      {pendingDelete && (
        <ConfirmModal
          consulta={consultaParaExcluir}
          onConfirm={confirmarExclusao}
          onCancel={() => setPendingDelete(null)}
        />
      )}

      <div className="min-h-screen bg-slate-950 px-4 py-10">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">

          {/* ── Cabeçalho ── */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl
                              bg-gradient-to-br from-indigo-500 to-cyan-500
                              text-white shadow-lg shadow-indigo-500/30 shrink-0">
                <Icon.Calendar />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-100 leading-tight">Consultas</h1>
                <p className="text-xs text-slate-500 mt-0.5">Gerencie os agendamentos</p>
              </div>
            </div>

            <button
              onClick={() => navigate("/agendamento")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold
                         bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                         shadow-lg shadow-indigo-500/30 hover:opacity-90 active:scale-95 transition-all"
            >
              <Icon.Plus /> Nova Consulta
            </button>
          </div>

          {/* ── Métricas ── */}
          {total > 0 && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Total",    value: total,     color: "text-indigo-400" },
                { label: "Hoje",     value: hojeCount, color: "text-cyan-400"   },
                { label: "Pendentes",value: pendentes, color: "text-amber-400"  },
              ].map(({ label, value, color }) => (
                <div key={label}
                     className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-center">
                  <p className={`text-2xl font-bold ${color}`}>{value}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          )}

          {/* ── Busca + filtros ── */}
          {total > 0 && (
            <div className="flex flex-col gap-3">
              {/* Campo de busca */}
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  <Icon.Search />
                </span>
                <input
                  type="search"
                  placeholder="Buscar por paciente ou médico…"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full rounded-xl border border-slate-700/60 bg-slate-800/60
                             pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-600
                             outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20
                             transition-all"
                  aria-label="Buscar consultas"
                />
                {busca && (
                  <button
                    onClick={() => setBusca("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    aria-label="Limpar busca"
                  >
                    <Icon.X />
                  </button>
                )}
              </div>

              {/* Chips de status */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por status">
                {FILTROS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFiltroStatus(f)}
                    aria-pressed={filtroStatus === f}
                    className={[
                      "px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200",
                      filtroStatus === f
                        ? "bg-indigo-500/20 border-indigo-500 text-indigo-300"
                        : "bg-transparent border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300",
                    ].join(" ")}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Lista ── */}
          {consultasFiltradas.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
              <div className="text-slate-700">
                <Icon.EmptyBox />
              </div>
              <div>
                <p className="text-base font-semibold text-slate-400">
                  {busca || filtroStatus !== "Todas"
                    ? "Nenhuma consulta encontrada"
                    : "Nenhuma consulta agendada"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {busca || filtroStatus !== "Todas"
                    ? "Tente ajustar os filtros"
                    : 'Clique em "Nova Consulta" para começar'}
                </p>
              </div>
              {!busca && filtroStatus === "Todas" && (
                <button
                  onClick={() => navigate("/agendamento")}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold
                             bg-gradient-to-r from-indigo-500 to-cyan-500 text-white
                             shadow-lg shadow-indigo-500/30 hover:opacity-90 transition-all"
                >
                  <Icon.Plus /> Nova Consulta
                </button>
              )}
            </div>
          ) : (
            <ul className="flex flex-col gap-3" role="list" aria-label="Lista de consultas">
              {consultasFiltradas.map((c) => {
                const dataFormatada = c.data
                  ? new Date(c.data).toLocaleDateString("pt-BR", {
                      weekday: "short", day: "2-digit", month: "short", year: "numeric",
                    })
                  : "—";

                return (
                  <li
                    key={c.id}
                    className="group rounded-2xl border border-slate-800 bg-slate-900/60
                               hover:border-slate-700 hover:bg-slate-900
                               transition-all duration-200 overflow-hidden"
                  >
                    {/* Barra colorida lateral via gradient */}
                    <div className="flex">
                      <div className="w-1 shrink-0 bg-gradient-to-b from-indigo-500 to-cyan-500
                                      rounded-l-2xl opacity-60 group-hover:opacity-100 transition-opacity" />

                      <div className="flex-1 px-4 py-4 flex items-center justify-between gap-3 min-w-0">

                        {/* Informações */}
                        <div className="flex flex-col gap-2 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <StatusBadge status={c.status ?? "agendada"} />
                          </div>

                          <div className="flex flex-col gap-1">
                            <p className="flex items-center gap-1.5 text-sm font-semibold text-slate-100 truncate">
                              <span className="text-indigo-400 shrink-0"><Icon.User /></span>
                              {c.paciente}
                            </p>
                            <p className="flex items-center gap-1.5 text-sm text-slate-400 truncate">
                              <span className="text-cyan-500 shrink-0"><Icon.Stethoscope /></span>
                              {c.medico}
                            </p>
                            <p className="flex items-center gap-1.5 text-xs text-slate-500">
                              <span className="shrink-0"><Icon.Clock /></span>
                              {dataFormatada}
                              {c.horario && (
                                <span className="text-slate-600">· {c.horario}</span>
                              )}
                            </p>
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-1 shrink-0
                                        opacity-0 group-hover:opacity-100 focus-within:opacity-100
                                        transition-opacity duration-200">
                          <button
                            onClick={() => navigate(`/agendamento/${c.id}`)}
                            aria-label={`Editar consulta de ${c.paciente}`}
                            className="flex items-center justify-center w-8 h-8 rounded-lg
                                       text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10
                                       transition-all"
                          >
                            <Icon.Edit />
                          </button>
                          <button
                            onClick={() => setPendingDelete(c.id)}
                            aria-label={`Excluir consulta de ${c.paciente}`}
                            className="flex items-center justify-center w-8 h-8 rounded-lg
                                       text-slate-500 hover:text-rose-400 hover:bg-rose-500/10
                                       transition-all"
                          >
                            <Icon.Trash />
                          </button>
                        </div>

                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          {/* Contador de resultados */}
          {consultasFiltradas.length > 0 && (busca || filtroStatus !== "Todas") && (
            <p className="text-center text-xs text-slate-600">
              {consultasFiltradas.length} resultado{consultasFiltradas.length !== 1 ? "s" : ""} encontrado{consultasFiltradas.length !== 1 ? "s" : ""}
            </p>
          )}

        </div>
      </div>
    </>
  );
}
