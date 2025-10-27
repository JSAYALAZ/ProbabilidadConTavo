import { Prisma } from "@prisma/client";

export enum IdentificationType {
  RUC = "RUC",
  CEDULA = "CEDULA",
  PASAPORTE = "PASAPORTE",
  CONSUMIDOR_FINAL = "CONSUMIDOR_FINAL",
  EXTERIOR = "EXTERIOR",
}

export const SRI_ID_TYPE: Record<IdentificationType, "04"|"05"|"06"|"07"|"08"> = {
  [IdentificationType.RUC]: "04",
  [IdentificationType.CEDULA]: "05",
  [IdentificationType.PASAPORTE]: "06",
  [IdentificationType.CONSUMIDOR_FINAL]: "07",
  [IdentificationType.EXTERIOR]: "08",
};

export type ClientFilters = {
  where: Prisma.ClientWhereInput;
  orderBy?: Prisma.ClientOrderByWithRelationInput;
  skip?: number;
  take?: number;
};


