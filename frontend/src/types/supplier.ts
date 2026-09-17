import type { SupplierId } from "./ids";
import type { CustomerType } from "./common";

/** Fornecedor. Compartilha o mesmo formato de pessoa (PF/PJ) de Customer. */
export interface Supplier {
    id: SupplierId;
    type: CustomerType;
    name: string;
    document: string;
    email: string;
    phone: string;
    active?: boolean;
}
