import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CadastroMedico() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    crm: "",
    cpf: "",
    email: "",
    telefone: "",
    especialidade: "",
    horarioInicio: "",
    horarioFim: "",
    dias: [],
    observacoes: "",
  });

  const [erro, setErro] = useState("");

  function handleChange(e) {
    setErro("");
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDias(dia) {
    const novos = form.dias.includes(dia)
      ? form.dias.filter((d) => d !== dia)
      : [...form.dias, dia];

    setForm({ ...form, dias: novos });
  }

  function cadastrar(e) {
    e.preventDefault();

    if (!form.nome || !form.crm || !form.especialidade) {
      setErro("Preencha os campos obrigatórios.");
      return;
    }

    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];
    medicos.push(form);

    localStorage.setItem("medicos", JSON.stringify(medicos));

    alert("Médico cadastrado com sucesso!");
    navigate("/consultas");
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Cadastro de Médico 🩺
        </h2>
        <p className="text-gray-500 mt-1">
          Registre um profissional da clínica
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={cadastrar}
        className="bg-white p-6 rounded-2xl shadow-md flex flex-col gap-6"
      >

        {/* DADOS PROFISSIONAIS */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Dados profissionais
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="label">Nome</label>
              <input name="nome" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">CRM</label>
              <input name="crm" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">CPF</label>
              <input name="cpf" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Especialidade</label>
              <select name="especialidade" className="input" onChange={handleChange}>
                <option value="">Selecione</option>
                <option>Clínico Geral</option>
                <option>Cardiologia</option>
                <option>Pediatria</option>
                <option>Ortopedia</option>
              </select>
            </div>

          </div>
        </div>

        {/* CONTATO */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Contato
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="label">Email</label>
              <input name="email" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Telefone</label>
              <input name="telefone" className="input" onChange={handleChange} />
            </div>

          </div>
        </div>

        {/* DISPONIBILIDADE */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Disponibilidade
          </h3>

          <div className="grid md:grid-cols-2 gap-4">

            <div>
              <label className="label">Horário início</label>
              <input type="time" name="horarioInicio" className="input" onChange={handleChange} />
            </div>

            <div>
              <label className="label">Horário fim</label>
              <input type="time" name="horarioFim" className="input" onChange={handleChange} />
            </div>

          </div>

          {/* DIAS */}
          <div className="mt-4">
            <label className="label">Dias de atendimento</label>

            <div className="flex flex-wrap gap-2 mt-2">
              {["Seg", "Ter", "Qua", "Qui", "Sex"].map((dia) => (
                <button
                  type="button"
                  key={dia}
                  onClick={() => handleDias(dia)}
                  className={`px-3 py-1 rounded-full border text-sm transition
                    ${form.dias.includes(dia)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-600"}`}
                >
                  {dia}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* OBSERVAÇÕES */}
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Observações
          </h3>

          <textarea
            name="observacoes"
            placeholder="Informações adicionais..."
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
            Cadastrar Médico
          </button>

        </div>

      </form>
    </div>
  );
}