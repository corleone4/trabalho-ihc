import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import CadastroPaciente from "./pages/CadastroPaciente";
import CadastroMedico from "./pages/CadastroMedico";
import Agendamento from "./pages/Agendamento";
import Consultas from "./pages/Consultas";
import Prontuario from "./pages/Prontuario";
import Documentos from "./pages/Documentos";

import Layout from "./Layout";

function App() {
  return (
    <Routes>

      {/* SEM NAVBAR */}
      <Route path="/" element={<Login />} />
      

      {/* COM NAVBAR */}
      <Route path="/consultas" element={<Layout><Consultas /></Layout>} />
      <Route path="/cadastro-paciente" element={<Layout><CadastroPaciente /></Layout>} />
      <Route path="/agendamento" element={<Layout><Agendamento /></Layout>} />
      <Route path="/cadastro-medico" element={<Layout><CadastroMedico /></Layout>} />
      <Route path="/prontuario" element={<Layout><Prontuario /></Layout>} />
      <Route path="/documentos" element={<Layout><Documentos /></Layout>} />

    </Routes>
  );
}

export default App;