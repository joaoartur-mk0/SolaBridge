import type { AccountId } from "./ids";
import type { AccountType, EntryNature } from "./common";

export interface Account {
    id: AccountId;
    codigo: string;
    nome: string;
    tipo: AccountType;
    natureza: EntryNature;
}
