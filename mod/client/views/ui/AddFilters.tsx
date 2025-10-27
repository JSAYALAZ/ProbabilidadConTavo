import { FormEvent } from "react";
import { COMPARADORES, Filtro } from "../../domain/models/Filtro";
import { Evento } from "../../domain/models/Evento";

export default function AddFilter({
  values,
  add,
  eventIn,
}: {
  values: Map<string, any>;
  add: (data: Filtro) => void;
  eventIn: Evento;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newF = new Filtro({
      llave: formData.get("llave") as string,
      comparador: formData.get("comparador") as COMPARADORES,
      valor: formData.get("valor") as string,
    });
    add(newF);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#DEF2F1] rounded-lg p-4 shadow-md space-y-2"
    >
      <h2 className="text-2xl font-semibold text-[#17252A]">
        Agregar filtro en - {eventIn.nombre}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Select: llave */}
        <div className="flex flex-col">
          <label
            htmlFor="llave"
            className="text-sm font-medium text-[#2B7A78] mb-1"
          >
            Nombre del filtro
          </label>
          <select
            name="llave"
            id="llave"
            className="px-4 py-2 border border-[#3AAFA9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B7A78] bg-white text-[#17252A]"
            required
          >
            {Array.from(values.entries()).map(([key]) => (
              <option value={key} key={key}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Select: comparador */}
        <div className="flex flex-col">
          <label
            htmlFor="comparador"
            className="text-sm font-medium text-[#2B7A78] mb-1"
          >
            Comparador
          </label>
          <select
            name="comparador"
            id="comparador"
            className="px-4 py-2 border border-[#3AAFA9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B7A78] bg-white text-[#17252A]"
            required
          >
            <option value="=">igual</option>
            <option value="!=">diferente</option>
            <option value="<">menor</option>
            <option value="<=">menor o igual</option>
            <option value=">">mayor</option>
            <option value=">=">mayor o igual</option>
          </select>
        </div>

        {/* Input: valor */}
        <div className="flex flex-col">
          <label
            htmlFor="valor"
            className="text-sm font-medium text-[#2B7A78] mb-1"
          >
            Valor
          </label>
          <input
            type="text"
            name="valor"
            id="valor"
            placeholder="Ej. 15"
            className="px-4 py-2 border border-[#3AAFA9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B7A78] bg-white text-[#17252A]"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-[#2B7A78] text-white px-6 py-2 rounded-md hover:bg-[#3AAFA9] transition-colors"
      >
        Agregar filtro
      </button>
    </form>
  );
}
