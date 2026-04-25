import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Agendamento() {
  const navigate = useNavigate();

  const [pacientes, setPacientes] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [erro, setErro] = useState("");

  const [form, setForm] = useState({
    paciente: "",
    medico: "",
    data: "",
    hora: "",
    tipo: "",
    descricao: "",
  });

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes")) || []);
    setMedicos(JSON.parse(localStorage.getItem("medicos")) || []);
  }, []);

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function agendar(e) {
    e.preventDefault();

    if (!form.paciente || !form.medico || !form.data || !form.hora) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }

    const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

    consultas.push({
      ...form,
      criadoEm: new Date().toISOString(),
    });

    localStorage.setItem("consultas", JSON.stringify(consultas));

    alert("Consulta agendada com sucesso!");
    navigate("/consultas");
  }

  // evita datas passadas
  const hoje = new Date().toISOString().split("T")[0];

  const medicoSelecionado = medicos.find(
    (m) => m.nome === form.medico
  );

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Agendamento 📅
        </h2>
        <p className="text-gray-500 mt-1">
          Marque uma nova consulta para o paciente
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={agendar}
        className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6"
      >

        {/* PACIENTE */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Paciente
          </h3>

          <select
            name="paciente"
            className="input"
            onChange={handleChange}
          >
            <option value="">Selecione um paciente</option>
            {pacientes.map((p, i) => (
              <option key={i}>{p.nome}</option>
            ))}
          </select>
        </div>

        {/* MÉDICO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Médico
          </h3>

          <select
            name="medico"
            className="input"
            onChange={handleChange}
          >
            <option value="">Selecione um médico</option>
            {medicos.map((m, i) => (
              <option key={i}>
                {m.nome} - {m.especialidade}
              </option>
            ))}
          </select>

          {/* INFO DO MÉDICO */}
          {medicoSelecionado && (
            <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded">
              Atendimento: {medicoSelecionado.horarioInicio} às {medicoSelecionado.horarioFim}
            </div>
          )}
        </div>

        {/* DATA E HORA */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Data e horário
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="date"
              name="data"
              min={hoje}
              className="input"
              onChange={handleChange}
            />

            <input
              type="time"
              name="hora"
              className="input"
              onChange={handleChange}
            />
          </div>
        </div>

        {/* TIPO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Tipo de consulta
          </h3>

          <select
            name="tipo"
            className="input"
            onChange={handleChange}
          >
            <option value="">Selecione</option>
            <option>Rotina</option>
            <option>Urgência</option>
            <option>Retorno</option>
          </select>
        </div>

        {/* OBSERVAÇÃO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Observações
          </h3>

          <textarea
            name="descricao"
            placeholder="Ex: sintomas, retorno, exames..."
            className="input"
            onChange={handleChange}
          />
        </div>

        {/* ERRO */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
            {erro}
          </div>
        )}

        {/* AÇÕES */}
        <div className="border-t pt-4 mt-4 flex justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate("/consultas")}
            className="px-4 py-2 text-gray-600 hover:text-blue-600"
          >
            Cancelar
          </button>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-sm"
          >
            Confirmar Agendamento
          </button>

        </div>

      </form>
    </div>
  );
}