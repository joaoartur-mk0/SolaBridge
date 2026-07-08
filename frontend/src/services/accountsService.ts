import { apiFetch } from "./apiClient";
import type { Account } from "../types/account";
import type { AccountType, EntryNature } from "../types/common";

type BackendConta = {
  id: number;
  codigo: string;
  nome: string;
  tipo: AccountType;
  natureza: EntryNature;
};

function mapBackendAccount(raw: BackendConta): Account {
  return {
    id: String(raw.id),
    codigo: raw.codigo,
    nome: raw.nome,
    tipo: raw.tipo,
    natureza: raw.natureza,
  };
}

// GET /contas não é paginado (lista curta, o plano de contas inteiro do tenant).
export async function listAccounts(): Promise<Account[]> {
  const result = await apiFetch<BackendConta[]>("/contas");

  return result.map(mapBackendAccount);
}
