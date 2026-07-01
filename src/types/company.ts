import type { Address } from "../types/address";

export interface Company{
    name: string;
    cnpj: string;
    municipalRegistration: string;
    email: string;
    phone: string;
    address: Address;
}