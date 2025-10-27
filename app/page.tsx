"use client";

import { Espacio } from "@/mod/client/domain/models/Espacio";
import { Evento } from "@/mod/client/domain/models/Evento";
import { Filtro } from "@/mod/client/domain/models/Filtro";
import { Muestra } from "@/mod/client/domain/models/Muestra";
import AddEvent from "@/mod/client/views/ui/AddEvento";
import AddFilter from "@/mod/client/views/ui/AddFilters";
import AddMuestra from "@/mod/client/views/ui/AddMuestra";
import SetMuestra from "@/mod/client/views/ui/SetMuestra";
import ViewSpave from "@/mod/client/views/ui/ViewSpave"; // si es ViewSpace, corrige el import
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function LandingPage() {
  const [muestra, setMuestra] = useState(new Muestra());
  const [espacio, setEspacio] = useState(
    new Espacio({ eventos: [], muestras: [] })
  );
  const [evntIn, setEnvtIn] = useState<Evento | null>(null);

  useEffect(() => {
    const esp = new Espacio({ eventos: [], muestras: [] });
    setEspacio(esp);
  }, [muestra]);

  const handleAddMuestra = (vals: Muestra) => {
    const esp = new Espacio({
      eventos: espacio.eventos,
      muestras: [...espacio.muestras, vals],
    });
    setEspacio(esp);
  };
  const handleAddEvent = (e: Evento) => {
    const esp = new Espacio({
      eventos: [...espacio.eventos, e],
      muestras: espacio.muestras,
    });
    setEspacio(esp);
  };
  const handleAddFilter = (e: Filtro) => {
    if (!evntIn) {
      toast.error("Selecciona un evento para agregar un filtro");
      return;
    }
    espacio.addFilter(evntIn, e);
    const esp = new Espacio({
      eventos: espacio.eventos,
      muestras: espacio.muestras,
    });
    setEspacio(esp);
  };

  return (
    <main className="font-sans bg-white p-4 min-h-screen space-y-4">
      <section className="grid grid-cols-4 gap-2 max-h-[calc(100vh-75vh)]">
        <SetMuestra muestra={muestra} setMuestra={setMuestra} />

        {/* Formulario para agregar muestras */}
        <AddMuestra add={handleAddMuestra} values={muestra.getValues()} />

        {/* Formulario para agregar eventos */}
        <AddEvent add={handleAddEvent} values={muestra.getValues()} />

        {/* Agregar filtros si hay evento seleccionado */}
        {evntIn && (
          <AddFilter
            add={handleAddFilter}
            values={muestra.getValues()}
            eventIn={evntIn}
          />
        )}
      </section>

      {/* Visualización del espacio */}
      <section className="bg-[#DEF2F1] p-4 max-h-[calc(100vh-30vh)]">
        <ViewSpave
          espacio={espacio}
          selectEvnt={(evnt: Evento) => setEnvtIn(evnt)}
        />
      </section>
      <footer className=" border-t border-gray-300  py-2 text-center text-sm text-gray-600">
        © 2025 <span className="font-semibold text-gray-800 ">José Ayala</span>{" "}
        — <span className="font-semibold text-gray-700">Angélica Panamá</span>
      </footer>
    </main>
  );
}
