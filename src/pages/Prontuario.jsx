import { useEffect, useState } from "react";

export default function Prontuario() {
  const [pacientes, setPacientes] = useState([]);
  const [selecionado, setSelecionado] = useState("");
  const [registros, setRegistros] = useState([]);
  const [texto, setTexto] = useState("");

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes")) || []);
  }, []);

  useEffect(() => {
    if (!selecionado) return;

    const prontuarios = JSON.parse(localStorage.getItem("prontuarios")) || {};
    setRegistros(prontuarios[selecionado] || []);
  }, [selecionado]);

  function salvarRegistro() {
    if (!texto) return;

    const prontuarios = JSON.parse(localStorage.getItem("prontuarios")) || {};

    const novos = prontuarios[selecionado] || [];

    novos.push({
      texto,
      data: new Date().toLocaleString(),
    });

    prontuarios[selecionado] = novos;

    localStorage.setItem("prontuarios", JSON.stringify(prontuarios));

    setTexto("");
    setRegistros(novos);
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Prontuário 📁
        </h2>
        <p className="text-gray-500">
          Histórico completo do paciente
        </p>
      </div>

      {/* SELEÇÃO */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <label className="label">Selecionar paciente</label>

        <select
          className="input"
          onChange={(e) => setSelecionado(e.target.value)}
        >
          <option value="">Selecione</option>
          {pacientes.map((p, i) => (
            <option key={i}>{p.nome}</option>
          ))}
        </select>
      </div>

      {/* REGISTROS */}
      {selecionado && (
        <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">

          <h3 className="text-lg font-semibold text-gray-700">
            Histórico
          </h3>

          {registros.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Nenhum registro encontrado.
            </p>
          ) : (
            <div className="flex flex-col gap-3 max-h-64 overflow-auto">
              {registros.map((r, i) => (
                <div
                  key={i}
                  className="bg-gray-50 p-3 rounded border"
                >
                  <p className="text-sm text-gray-700">{r.texto}</p>
                  <p className="text-xs text-gray-400 mt-1">{r.data}</p>
                </div>
              ))}
            </div>
          )}

          {/* NOVO REGISTRO */}
          <textarea
            placeholder="Adicionar observação clínica..."
            className="input"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />

          <button
            onClick={salvarRegistro}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg self-end"
          >
            Salvar registro
          </button>

        </div>
      )}

    </div>
  );
}