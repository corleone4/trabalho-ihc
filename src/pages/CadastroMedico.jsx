export default function CadastroMedico() {
  function cadastrar(e) {
    e.preventDefault();

    const nome = e.target.nome.value;
    const especialidade = e.target.especialidade.value;

    const medicos = JSON.parse(localStorage.getItem("medicos")) || [];

    medicos.push({ nome, especialidade });

    localStorage.setItem("medicos", JSON.stringify(medicos));

    alert("Médico cadastrado!");
  }

  return (
    <form className="p-5 flex flex-col gap-3" onSubmit={cadastrar}>
      <h2 className="text-xl">Cadastro Médico</h2>

      <input name="nome" placeholder="Nome" className="border p-2" required />
      <input
        name="especialidade"
        placeholder="Especialidade"
        className="border p-2"
        required
      />

      <button className="bg-green-500 text-white p-2 rounded">
        Salvar
      </button>
    </form>
  );
}