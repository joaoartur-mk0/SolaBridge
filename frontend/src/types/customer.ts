import type { CustomerId } from "./ids";
import type { CustomerType } from "./common";
import type { Address } from "./address";

export interface Customer {
    id: CustomerId;
    type: CustomerType;
    name: string;
    document: string;
    email: string;
    phone: string;
    address: Address;
}