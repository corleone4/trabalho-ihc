import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CadastroPaciente from "./pages/CadastroPaciente";
import CadastroMedico from "./pages/CadastroMedico";
import Agendamento from "./pages/Agendamento";
import Consultas from "./pages/Consultas";
import Prontuario from "./pages/Prontuario";
import Documentos from "./pages/Documentos";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/cadastro-paciente" element={<CadastroPaciente />} />
        <Route path="/cadastro-medico" element={<CadastroMedico />} />
        <Route path="/agendamento" element={<Agendamento />} />
        <Route path="/consultas" element={<Consultas />} />
        <Route path="/prontuario" element={<Prontuario />} />
        <Route path="/documentos" element={<Documentos />} />
      </Routes>
    </div>
  );
}

export default App;