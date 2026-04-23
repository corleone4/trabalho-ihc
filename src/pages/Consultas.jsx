import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarConsultas();
  }, []);

  function carregarConsultas() {
    const dados = JSON.parse(localStorage.getItem("consultas")) || [];
    setConsultas(dados);
  }

  function excluirConsulta(index) {
    const novas = [...consultas];
    novas.splice(index, 1);

    localStorage.setItem("consultas", JSON.stringify(novas));
    setConsultas(novas);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-600">
          Consultas 📅
        </h1>

        <button
          onClick={() => navigate("/agendamento")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Nova Consulta
        </button>
      </div>

      {/* LISTA */}
      {consultas.length === 0 ? (
        <div className="text-center text-gray-500 mt-20">
          Nenhuma consulta agendada 😢
        </div>
      ) : (
        <div className="grid gap-4">
          {consultas.map((c, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold text-gray-800">
                  {c.paciente}
                </p>
                <p className="text-sm text-gray-500">
                  {c.medico}
                </p>
                <p className="text-sm text-gray-400">
                  {c.data}
                </p>
              </div>

              <button
                onClick={() => excluirConsulta(index)}
                className="text-red-500 hover:underline text-sm"
              >
                Excluir
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}