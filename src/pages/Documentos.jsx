import { useEffect, useState } from "react";

export default function Documentos() {
  const [pacientes, setPacientes] = useState([]);
  const [form, setForm] = useState({
    paciente: "",
    tipo: "",
    conteudo: "",
  });

  useEffect(() => {
    setPacientes(JSON.parse(localStorage.getItem("pacientes")) || []);
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function gerarDocumento() {
    if (!form.paciente || !form.tipo || !form.conteudo) {
      alert("Preencha todos os campos");
      return;
    }

    const docs = JSON.parse(localStorage.getItem("documentos")) || [];

    docs.push({
      ...form,
      data: new Date().toLocaleString(),
    });

    localStorage.setItem("documentos", JSON.stringify(docs));

    alert("Documento gerado!");
    setForm({ paciente: "", tipo: "", conteudo: "" });
  }

  return (
    <div className="max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Documentos 📄
        </h2>
        <p className="text-gray-500">
          Emitir atestados e prescrições
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow flex flex-col gap-4">

        {/* PACIENTE */}
        <div>
          <label className="label">Paciente</label>
          <select name="paciente" className="input" onChange={handleChange}>
            <option value="">Selecione</option>
            {pacientes.map((p, i) => (
              <option key={i}>{p.nome}</option>
            ))}
          </select>
        </div>

        {/* TIPO */}
        <div>
          <label className="label">Tipo de documento</label>
          <select name="tipo" className="input" onChange={handleChange}>
            <option value="">Selecione</option>
            <option>Atestado</option>
            <option>Prescrição</option>
          </select>
        </div>

        {/* TEXTO */}
        <div>
          <label className="label">Conteúdo</label>
          <textarea
            name="conteudo"
            placeholder="Digite o conteúdo do documento..."
            className="input"
            onChange={handleChange}
          />
        </div>

        {/* BOTÃO */}
        <button
          onClick={gerarDocumento}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg self-end"
        >
          Gerar Documento
        </button>

      </div>
    </div>
  );
}