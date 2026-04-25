import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CadastroPaciente() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    nascimento: "",
    sexo: "",
    logradouro: "",
    numero: "",
    bairro: "",
    cidade: "",
  });

  const [confirmar, setConfirmar] = useState("");
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

    if (form.senha !== confirmar) {
      setErro("As senhas não coincidem.");
      return;
    }

    const pacientes = JSON.parse(localStorage.getItem("pacientes")) || [];
    pacientes.push(form);

    localStorage.setItem("pacientes", JSON.stringify(pacientes));

    alert("Paciente cadastrado com sucesso!");
    navigate("/");
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Cadastro de Paciente 🧍‍♂️
        </h2>
        <p className="text-gray-500 mt-1">
          Registre um novo paciente no sistema da clínica
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={cadastrar}
        className="bg-white p-8 rounded-2xl shadow-md flex flex-col gap-6"
      >

        {/* DADOS PESSOAIS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Dados pessoais
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="label">Nome completo</label>
              <input name="nome" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">CPF</label>
              <input name="cpf" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Email</label>
              <input name="email" type="email" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Telefone</label>
              <input name="telefone" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Data de nascimento</label>
              <input type="date" name="nascimento" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Sexo</label>
              <select name="sexo" className="input" onChange={handleChange}>
                <option value="">Selecione</option>
                <option>Masculino</option>
                <option>Feminino</option>
                <option>Outro</option>
              </select>
            </div>

          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Endereço
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div className="md:col-span-2">
              <label className="label">Logradouro</label>
              <input
                name="logradouro"
                placeholder="Rua, avenida..."
                className="input"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Número</label>
              <input
                name="numero"
                placeholder="123"
                className="input"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="label">Bairro</label>
              <input
                name="bairro"
                className="input"
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Cidade</label>
              <input
                name="cidade"
                className="input"
                onChange={handleChange}
              />
            </div>

          </div>
        </div>

        {/* ERRO */}
        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded">
            {erro}
          </div>
        )}

        {/* AÇÕES */}
        <div className="border-t pt-4 mt-6 flex justify-end gap-3">

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
            Cadastrar Paciente
          </button>

        </div>

      </form>
    </div>
  );
}