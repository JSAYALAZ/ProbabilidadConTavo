import { Dispatch, FormEvent, SetStateAction, useRef } from "react";
import { Muestra } from "../../domain/models/Muestra";

type Props = {
  muestra: Muestra;
  setMuestra: Dispatch<SetStateAction<Muestra>>;
};

export default function SetMuestra({ muestra, setMuestra }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawKey = (formData.get("key") ?? "").toString().trim();

    if (!rawKey) return;
    const newMuetsra = new Muestra();
    newMuetsra.setAtributes(muestra.values);
    newMuetsra.addAtribute(rawKey, "");

    setMuestra(newMuetsra);

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = (k: string) => {
    const newMuetsra = new Muestra();
    newMuetsra.setAtributes(muestra.values);
    newMuetsra.values.delete(k);
    setMuestra(newMuetsra);
  };

  return (
    <div className="bg-[#DEF2F1] rounded-lg p-4 shadow-md space-y-2">
      <h2 className="text-2xl font-semibold text-black">
        Atributos de la muestra
      </h2>

      {/* Lista de pares clave/valor */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from(muestra.values.entries()).map(([key]) => (
          <div
            key={key}
            className="flex items-center justify-between  px-4 py-2 rounded-md"
          >
            <span className="text-[#2B7A78] font-medium">{key}</span>
            <button
              type="button"
              onClick={() => handleRemove(key)}
              className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Quitar
            </button>
          </div>
        ))}
      </div>

      {/* Form para agregar nueva clave */}
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          ref={inputRef}
          type="text"
          name="key"
          placeholder="Clave"
          className="flex-1 px-4 py-2 border border-[#3AAFA9] rounded-md focus:outline-none focus:ring-2 focus:ring-[#2B7A78]"
        />
        <button
          type="submit"
          className="bg-[#2B7A78] text-white px-4 py-2 rounded-md hover:bg-[#3AAFA9] transition-colors"
        >
          Agregar atributo
        </button>
      </form>
    </div>
  );
}
