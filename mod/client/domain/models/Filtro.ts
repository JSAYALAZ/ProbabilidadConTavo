export type COMPARADORES = "=" | "!=" | "<" | "<=" | ">" | ">=";
type Escalar = string | number | boolean | Date | null | undefined;
type Multi<T> = T | T[];

const toComparable = (v: Escalar) => {
  if (v instanceof Date) return v.getTime();
  if (typeof v === "string") {
    const s = v.trim();
    if (s === "") return s;
    if (s.toLowerCase() === "null") return null;
    if (s.toLowerCase() === "undefined") return undefined;
    if (s.toLowerCase() === "true") return true;
    if (s.toLowerCase() === "false") return false;
    // YYYY-MM-DD o ISO → Date si es válido
    if ((s.includes("-") || s.includes("T")) && !Number.isNaN(Date.parse(s))) {
      return new Date(s).getTime();
    }
    const n = Number(s);
    if (!Number.isNaN(n)) return n;
    return s;
  }
  return v;
};

const eq = (a: Escalar, b: Escalar) => toComparable(a) === toComparable(b);

const cmp = (a: Escalar, b: Escalar) => {
  const A = toComparable(a);
  const B = toComparable(b);
  if (typeof A === "number" && typeof B === "number") return A - B;
  if (typeof A === "string" && typeof B === "string") return A.localeCompare(B);
  throw new Error("Comparación inválida: tipos no comparables");
};

const parseArrayLikeString = (str: string): Escalar[] => {
  const t = str.trim();
  if (t.length === 0) return [];
  // Intento JSON primero: ["a", 2, true]
  if (t.startsWith("[") && t.endsWith("]")) {
    try {
      const arr = JSON.parse(t);
      return Array.isArray(arr) ? arr : [arr];
    } catch {
      // Fallback: quitar corchetes y split por coma
      const body = t.slice(1, -1);
      return body.split(",").map(x => x.trim().replace(/^['"]|['"]$/g, ""));
    }
  }
  // "a,b,c" → split por coma
  if (t.includes(",")) {
    return t.split(",").map(x => x.trim().replace(/^['"]|['"]$/g, ""));
  }
  // valor escalar en string
  return [t];
};

const toArray = (x: Multi<Escalar> | unknown): Escalar[] => {
  if (x === null || x === undefined) return [];
  if (Array.isArray(x)) return x;
  if (typeof x === "string") return parseArrayLikeString(x);
  return [x as Escalar];
};

export class Filtro {
  constructor(
    public data: { llave: string; comparador: COMPARADORES; valor: Multi<Escalar> }
  ) {}

  get llave() { return this.data.llave; }
  get comparador() { return this.data.comparador; }
  get valor() { return this.data.valor; }

  comparar(valorAComparar: Multi<Escalar> | unknown): boolean {
    const left = toArray(valorAComparar);    // lo que trae la muestra (array o "[...]" o "a,b,c")
    const right = toArray(this.valor);       // lo que pide el filtro (igual)

    switch (this.comparador) {
      case "=":
        if (right.length === 0 || left.length === 0) return false;
        return left.some(L => right.some(R => eq(L, R)));

      case "!=":
        if (right.length === 0) return true;
        return left.every(L => right.every(R => !eq(L, R)));

      case "<":
      case "<=":
      case ">":
      case ">=": {
        if (right.length !== 1)
          throw new Error("Para <, <=, >, >= el valor del filtro debe ser escalar (no array).");
        const R = right[0];
        const ok = (L: Escalar) => {
          const c = cmp(L, R);
          if (this.comparador === "<") return c < 0;
          if (this.comparador === "<=") return c <= 0;
          if (this.comparador === ">") return c > 0;
          return c >= 0;
        };
        return left.some(ok);
      }

      default:
        return false;
    }
  }
}
