export default function Agendamento() {
  function agendar(e) {
    e.preventDefault();

    const paciente = e.target.paciente.value;
    const medico = e.target.medico.value;
    const data = e.target.data.value;

    const consultas = JSON.parse(localStorage.getItem("consultas")) || [];

    consultas.push({ paciente, medico, data });

    localStorage.setItem("consultas", JSON.stringify(consultas));

    alert("Agendado!");
  }

  return (
    <form onSubmit={agendar} className="p-5 flex flex-col gap-3">
      <h2>Agendamento</h2>

      <input name="paciente" placeholder="Paciente" className="border p-2" />
      <input name="medico" placeholder="Médico" className="border p-2" />
      <input name="data" type="date" className="border p-2" />

      <button className="bg-blue-500 text-white p-2 rounded">
        Agendar
      </button>
    </form>
  );
}