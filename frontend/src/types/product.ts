import type { ProductId } from "./ids";
import type { Money } from "./money";

/** Unidades aceitas pelo backend (enum da tabela produtos). */
export type ProductUnit = "KG" | "UN" | "LT" | "ML" | "G" | "CX";

export const PRODUCT_UNITS: ProductUnit[] = ["UN", "KG", "LT", "ML", "G", "CX"];

export interface Product {
    id: ProductId;
    description: string;
    /** Código interno / SKU do produto no tenant. */
    sku?: string;
    unit: ProductUnit;
    salePrice: Money;
    /** Custo médio atual (usado no CMV da venda). */
    averageCost: Money;
    ncm?: string;
    cfop?: string;
    cest?: string;
}
