import { Filtro } from "./Filtro";

export class Evento {
  public nombre: string;
  public filtros: Filtro[] = [];
  constructor(data: { nombre: string }) {
    this.nombre = data.nombre;
  }

  public addFiltro(value: Filtro) {
    this.filtros.push(value);
  }
}
