import { FormEvent } from "react";
import { Muestra } from "../../domain/models/Muestra";

export default function AddMuestra({
  values,
  add,
}: {
  values: Map<string, any>;
  add: (data: Muestra) => void;
}) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newM = new Muestra();
    formData.forEach((value, key) => {
      newM.addAtribute(key, value);
    });
    add(newM);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-[#DEF2F1] rounded-lg p-4 shadow-md space-y-2"
    >
      <h2 className="text-2xl font-semibold text-[#17252A]">
        Agregar nueva muestra
      </h2>

      <div className="grid grid-cols-3 gap-1">
        {Array.from(values.entries()).map(([key]) => (
          <div key={key} className="grid grid-cols-2 items-center">
            <label
              htmlFor={key}
              className="mb-1 text-sm font-medium text-[#2B7A78]"
            >
              {key}
            </label>
            <input
              type="text"
              name={key}
              id={key}
              className="px-3 py-2 border border-[#3AAFA9] 
              rounded-md focus:outline-none focus:ring-2 
              focus:ring-[#2B7A78] bg-white text-black"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        className="mt-4 bg-[#2B7A78] text-white px-6 py-2 rounded-md hover:bg-[#3AAFA9] transition-colors"
      >
        Agregar muestra
      </button>
    </form>
  );
}
