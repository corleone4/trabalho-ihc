import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CadastroPaciente() {
  const navigate = useNavigate();

  const [confirmarsenha, setConfirmarSenha] = useState("")

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha:"",
    telefone: "",
    nascimento: "",
  });

  const [erro, setErro] = useState("");

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function cadastrar(e) {
    e.preventDefault();

    if (!form.nome || !form.email || !form.senha) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }

    if (form.senha != confirmarsenha){
        setErro("As senhas não correspondem.");
        return;
    }

    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];

    pacientes.push(form);

    localStorage.setItem("pacientes", JSON.stringify(pacientes));

    alert("Paciente cadastrado com sucesso!");
    navigate("/");
  }

  return (
    <div className="flex min-h-screen">
      
      {/* IMAGEM LATERAL */}
      <div className="hidden md:flex w-1/2">
        <img
          src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
          alt="Paciente"
          className="w-full h-full object-cover"
        />
      </div>

      {/* FORMULÁRIO */}
      <div className="flex items-center justify-center w-full md:w-1/2 bg-gray-100 p-6">
        
        <form
          onSubmit={cadastrar}
          className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md flex flex-col gap-3"
        >
          
          <h2 className="text-2xl font-bold text-center text-blue-600">
            Cadastro de Paciente 🧍‍♂️
          </h2>

          <p className="text-center text-gray-500 mb-4">
            Preencha seus dados para continuar
          </p>

          {/* Nome */}
          <input
            name="nome"
            placeholder="Nome completo"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          {/* Email */}
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          <input
            name="senha"
            type="password"
            placeholder="Senha"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />
          <input
            name="confirmarsenha"
            type="password"
            placeholder="Confirmar Senha"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          {/* Telefone */}
          <input
            name="telefone"
            placeholder="Telefone"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          {/* Data nascimento */}
          <input
            name="nascimento"
            type="date"
            className="border p-2 rounded focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
          />

          {/* ERRO */}
          {erro && (
            <p className="text-red-500 text-sm">{erro}</p>
          )}

          {/* BOTÃO */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
          >
            Cadastrar
          </button>

          {/* VOLTAR */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="text-blue-600 text-sm hover:underline"
          >
            Voltar para login
          </button>

        </form>
      </div>
    </div>
  );
}