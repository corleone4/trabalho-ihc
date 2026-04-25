import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  function entrar() {
    if (!email) return alert("Digite um email");
    if (!senha) return alert("Digite uma senha");
    localStorage.setItem("user", email);
    localStorage.setItem("password", senha);
    navigate("/consultas");
  }

  return (
    <div className="flex min-h-screen">

      {/* LADO ESQUERDO (imagem) */}
      <div className="hidden md:flex w-1/2">
        <img
          src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5"
          alt="Clínica médica"
          className="w-full h-full object-cover"
        />
      </div>

      {/* LADO DIREITO (login) */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 bg-gray-100 p-6">

        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

          <h1 className="text-2xl font-bold text-center text-blue-600">
            SmartClinic 🩺
          </h1>

          <p className="text-gray-500 text-center mt-2 mb-6">
            Sistema de agendamento médico
          </p>

          <input
            type="email"
            placeholder="Digite seu email"
            className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full p-2 border border-gray-300 rounded mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={(e) => setSenha(e.target.value)}
          />

          <button
            onClick={entrar}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded transition"
          >
            Entrar
          </button>

          <div className="text-center text-gray-400 text-sm mt-3">
            Acesso restrito à equipe da clínica
          </div>

        </div>

      </div>
    </div>
  );
}