import { Evento } from "./Evento";
import { Filtro } from "./Filtro";
import { Muestra } from "./Muestra";

// 👉 Pega esto dentro de tu clase Espacio

export type ProbEventStat = {
  name: string;
  count: number;
  probability: number; // count / total
  complementCount: number;
  complementProbability: number; // 1 - probability
};

export type ProbPairwiseStat = {
  a: string;
  b: string;
  intersectionCount: number;
  intersectionProbability: number;
  unionCount: number;
  unionProbability: number;
  condA_given_B: number | null; // P(A|B)
  condB_given_A: number | null; // P(B|A)
  independence: boolean | null; // ≈ test numérico con tolerancia
};

export type ProbPartition = {
  mask: number; // bitmask de pertenencia
  key: string; // p. ej. "A&B&!C"
  names: string[]; // eventos presentes en la partición
  count: number;
  probability: number;
};

export type ProbabilitySummary = {
  total: number;
  events: ProbEventStat[];
  pairwise: ProbPairwiseStat[];
  partitions: ProbPartition[]; // completo: todas las celdas del diagrama de Euler
  sanity: {
    partitionsSumOne: boolean; // suma de probs de particiones ≈ 1
    countsSumEqualTotal: boolean; // suma de counts de particiones == total
  };
};

export class Espacio {
  public eventos: Evento[] = [];
  public muestras: Muestra[] = [];
  constructor(data: { eventos: Evento[]; muestras: Muestra[] }) {
    this.eventos = data.eventos;
    this.muestras = data.muestras;
  }

  setMuestra(muestra: Muestra) {
    this.muestras.push(muestra);
  }

  addFilter(eventName: Evento, filtro: Filtro) {
    this.eventos.find((e) => e.nombre === eventName.nombre)?.addFiltro(filtro);
  }
  getGroups() {
    const resp: Map<string, Muestra[]> = new Map();

    // Caso sin eventos: el universo es todo y retornamos
    if (this.eventos.length === 0) {
      resp.set("universo", [...this.muestras]);
      return resp;
    }

    // Para saber quién cae en al menos un evento
    const inAny = new Set<Muestra>();

    // Grupos por evento (pertenencia correcta: cumple TODOS los filtros)
    for (const ev of this.eventos) {
      const includes = this.muestras.filter((m) =>
        ev.filtros.every((f) => f.comparar(m.values.get(f.llave)))
      );
      includes.forEach((m) => inAny.add(m));
      resp.set(ev.nombre, includes);
    }

    // Universo = todas las muestras (sin duplicados)
    resp.set("universo", [...this.muestras]);

    // Opcional: muestras que no pertenecen a ningún evento
    const fuera = this.muestras.filter((m) => !inAny.has(m));
    resp.set("fuera_de_eventos", fuera);

    return resp;
  }

  clean() {
    this.eventos = [];
    this.muestras = [];
  }

  private belongsToEvent(m: Muestra, ev: Evento): boolean {
    // Un muestra pertenece a un evento si cumple TODOS sus filtros
    return ev.filtros.every((f) => f.comparar(m.values.get(f.llave)));
  }

  /**
   * Calcula estadísticas de probabilidad empírica sobre las muestras actuales.
   * @param opts.includePartitions incluir todas las celdas (por defecto true)
   * @param opts.tolerance tolerancia para comparar independencia (por defecto 1e-9)
   * @param opts.precision redondeo de probabilidades (opcional)
   */
  public getProbabilitySummary(opts?: {
    includePartitions?: boolean;
    tolerance?: number;
    precision?: number;
  }): ProbabilitySummary {
    const includePartitions = opts?.includePartitions ?? true;
    const tol = opts?.tolerance ?? 1e-9;
    const round = (x: number) =>
      typeof opts?.precision === "number"
        ? Number(x.toFixed(opts.precision))
        : x;

    const N = this.muestras.length;
    const k = this.eventos.length;
    const names = this.eventos.map((e) => e.nombre);

    // Edge case: sin muestras -> todo 0 / null seguro
    if (N === 0) {
      return {
        total: 0,
        events: names.map((n) => ({
          name: n,
          count: 0,
          probability: 0,
          complementCount: 0,
          complementProbability: 0,
        })),
        pairwise: [],
        partitions: includePartitions ? [] : [],
        sanity: { partitionsSumOne: true, countsSumEqualTotal: true },
      };
    }

    // 1) Para cada muestra, construimos la máscara de pertenencia a eventos.
    //    mask bit i = 1 si pertenece al evento i.
    const partCounts = new Array(1 << k).fill(0) as number[];
    for (const m of this.muestras) {
      let mask = 0;
      for (let i = 0; i < k; i++) {
        if (this.belongsToEvent(m, this.eventos[i])) {
          mask |= 1 << i;
        }
      }
      partCounts[mask]++;
    }

    // 2) Métricas por evento (margen): |A_i| y P(A_i)
    const eventCounts = new Array(k).fill(0) as number[];
    for (let mask = 0; mask < partCounts.length; mask++) {
      if (partCounts[mask] === 0) continue;
      for (let i = 0; i < k; i++) {
        if (mask & (1 << i)) eventCounts[i] += partCounts[mask];
      }
    }
    const events: ProbEventStat[] = eventCounts.map((cnt, i) => {
      const p = cnt / N;
      return {
        name: names[i],
        count: cnt,
        probability: round(p),
        complementCount: N - cnt,
        complementProbability: round(1 - p),
      };
    });

    // 3) Pares: intersección, unión, condicionales e "independencia" numérica
    const pairwise: ProbPairwiseStat[] = [];
    for (let i = 0; i < k; i++) {
      for (let j = i + 1; j < k; j++) {
        let inter = 0;
        for (let mask = 0; mask < partCounts.length; mask++) {
          if (mask & (1 << i) && mask & (1 << j)) inter += partCounts[mask];
        }
        const Ai = eventCounts[i];
        const Bj = eventCounts[j];
        const union = Ai + Bj - inter;

        const pAi = Ai / N;
        const pBj = Bj / N;
        const pInter = inter / N;
        const pUnion = union / N;

        const pA_given_B = Bj > 0 ? inter / Bj : null;
        const pB_given_A = Ai > 0 ? inter / Ai : null;

        // Independencia: P(A∩B) ≈ P(A)P(B) dentro de tolerancia
        const independence =
          pA_given_B === null || pB_given_A === null
            ? null
            : Math.abs(pInter - pAi * pBj) <= tol;

        pairwise.push({
          a: names[i],
          b: names[j],
          intersectionCount: inter,
          intersectionProbability: round(pInter),
          unionCount: union,
          unionProbability: round(pUnion),
          condA_given_B: pA_given_B === null ? null : round(pA_given_B),
          condB_given_A: pB_given_A === null ? null : round(pB_given_A),
          independence,
        });
      }
    }

    // 4) Particiones completas (todas las celdas del diagrama de Euler)
    const partitions: ProbPartition[] = [];
    if (includePartitions) {
      for (let mask = 0; mask < partCounts.length; mask++) {
        const count = partCounts[mask];
        const present: string[] = [];
        const parts: string[] = [];
        for (let i = 0; i < k; i++) {
          const on = Boolean(mask & (1 << i));
          parts.push(on ? names[i] : `!${names[i]}`);
          if (on) present.push(names[i]);
        }
        partitions.push({
          mask,
          key: parts.join("&"),
          names: present,
          count,
          probability: round(count / N),
        });
      }
    }

    // 5) Sanity checks
    const sumCounts = partCounts.reduce((a, b) => a + b, 0);
    const sumProb = includePartitions
      ? partitions.reduce((a, b) => a + b.probability, 0)
      : 1;

    return {
      total: N,
      events,
      pairwise,
      partitions,
      sanity: {
        partitionsSumOne: Math.abs(sumProb - 1) <= tol,
        countsSumEqualTotal: sumCounts === N,
      },
    };
  }
}
