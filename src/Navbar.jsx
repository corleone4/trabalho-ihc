import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const user = localStorage.getItem("user");

    function sair() {
        localStorage.removeItem("user");
        navigate("/");
    }

    return (
        <div className="bg-white shadow px-6 py-3 flex justify-between items-center">

            <h1 className="text-blue-600 font-bold text-lg cursor-pointer"
                onClick={() => navigate("/consultas")}>
                SmartClinic 🩺
            </h1>

            <div className="flex items-center gap-4 text-sm">

                <button onClick={() => navigate("/consultas")} className="hover:text-blue-600">
                    Consultas
                </button>

                <button onClick={() => navigate("/agendamento")} className="hover:text-blue-600">
                    Agendar
                </button>

                <button onClick={() => navigate("/cadastro-paciente")}>
                    Paciente
                </button>

                <button onClick={() => navigate("/cadastro-medico")} className="hover:text-blue-600">
                    Médicos
                </button>

                <button onClick={() => navigate("/prontuario")} className="hover:text-blue-600">
                    Prontuário
                </button>

                <button onClick={() => navigate("/documentos")} className="hover:text-blue-600">
                    Documentos
                </button>

                <span className="text-gray-400">|</span>

                <span className="text-gray-500">{user}</span>

                <button onClick={sair} className="text-red-500 hover:underline">
                    Sair
                </button>

            </div>
        </div>
    );
}