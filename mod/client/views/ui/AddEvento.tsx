import { FormEvent } from "react";
import { Evento } from "../../domain/models/Evento";

export default function AddEvent({
  values,
  add,
}: {
  values: Map<string, any>;
  add: (data: Evento) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newM = new Evento({ nombre: formData.get("nombre") as string });
    add(newM);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#DEF2F1] rounded-lg p-4 shadow-md space-y-2"
    >
      <h2 className="text-2xl font-semibold text-[#17252A]">Agregar evento</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre" className="text-sm font-medium text-[#2B7A78]">
          Nombre del evento
        </label>
        <input
          type="text"
          name="nombre"
          id="nombre"
          placeholder="Ej. Evento A"
          className="px-4 py-2 border border-[#3AAFA9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B7A78] bg-white text-[#17252A]"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-[#2B7A78] text-white px-6 py-2 rounded-md hover:bg-[#3AAFA9] transition-colors"
      >
        Agregar evento
      </button>
    </form>
  );
}
