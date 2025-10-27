import { IdentificationType } from "../types";

export function normalizeId(raw: string): string {
  return (raw ?? "").toString().trim().replace(/[ \-\.]/g, "");
}

//Revisa la validez numerica de la cedula
export function isValidCedula(id10: string): boolean {
  const id = normalizeId(id10);
  if (!/^\d{10}$/.test(id)) return false;
  const prov = Number(id.slice(0,2));
  const third = Number(id[2]);
  if (prov < 1 || prov > 24) return false;
  if (third > 5) return false;

  const coefs = [2,1,2,1,2,1,2,1,2];
  const sum = coefs.reduce((acc, c, i) => {
    let p = Number(id[i]) * c;
    if (p >= 10) p -= 9;
    return acc + p;
  }, 0);
  const chk = (10 - (sum % 10)) % 10;
  return chk === Number(id[9]);
}

 export function  getIdentificationCode(identificacion:string) {
    const id = normalizeId(identificacion);
    if (id == "9999999999999") return IdentificationType.CONSUMIDOR_FINAL;

    const onlyDigits = /^\d+$/.test(id);

    if (onlyDigits && id.length === 13) {
      // RUC: natural (3er dígito 0-5) o sociedad (6 o 9)
      const third = Number(id[2]);
      if ([0, 1, 2, 3, 4, 5, 6, 9].includes(third))
        return IdentificationType.RUC;
    }

    if (onlyDigits && id.length === 10) {
      return IdentificationType.CEDULA;
    }

    return IdentificationType.PASAPORTE;
  }