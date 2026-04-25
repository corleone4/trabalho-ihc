import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Consultas() {
  const [consultas, setConsultas] = useState([]);
  const navigate = useNavigate();

  const user = localStorage.getItem("user");

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
    <div className="min-h-screen bg-gray-100">

      <div className="p-6 max-w-4xl mx-auto">

        {/* TÍTULO + AÇÃO */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            Consultas 📅
          </h2>

          <button
            onClick={() => navigate("/agendamento")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            + Nova Consulta
          </button>
        </div>

        {/* LISTA */}
        {consultas.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">Nenhuma consulta agendada 😢</p>
            <p className="text-sm mt-1">
              Clique em “Nova Consulta” para começar
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {consultas.map((c, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow hover:shadow-md transition flex justify-between items-center"
              >
                
                {/* INFO */}
                <div className="flex flex-col">
                  <p className="font-semibold text-gray-800">
                    👤 {c.paciente}
                  </p>
                  <p className="text-sm text-gray-500">
                    🩺 {c.medico}
                  </p>
                  <p className="text-sm text-gray-400">
                    📅 {new Date(c.data).toLocaleDateString("pt-BR")}
                  </p>
                </div>

                {/* AÇÕES */}
                <button
                  onClick={() => excluirConsulta(index)}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Excluir
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}