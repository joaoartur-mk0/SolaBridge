import { apiFetch } from "./apiClient";
import type { JournalEntry, JournalEntryLine } from "../types/ledger";
import type { EntryNature } from "../types/common";

type BackendPartida = {
  id: number;
  conta_id: number;
  valor: string | number;
  natureza: EntryNature;
};

type BackendLancamento = {
  id: number;
  description: string;
  date: string;
  partidas: BackendPartida[];
};

// Laravel paginator (Lancamento::query()->paginate(15)) serializado como JSON.
type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ListJournalEntriesParams = {
  startDate?: string;
  endDate?: string;
  accountId?: string;
};

export type CreateJournalEntryInput = {
  description: string;
  date: string;
  partidas: JournalEntryLine[];
};

function mapBackendLine(raw: BackendPartida): JournalEntryLine {
  return {
    accountId: String(raw.conta_id),
    valor: Number(raw.valor),
    natureza: raw.natureza,
  };
}

function mapBackendEntry(raw: BackendLancamento): JournalEntry {
  return {
    id: String(raw.id),
    description: raw.description,
    date: raw.date,
    partidas: (raw.partidas ?? []).map(mapBackendLine),
  };
}

export async function listJournalEntries(
  params: ListJournalEntriesParams = {}
): Promise<JournalEntry[]> {
  const query = new URLSearchParams();

  if (params.startDate) query.set("inicio", params.startDate);
  if (params.endDate) query.set("fim", params.endDate);
  if (params.accountId) query.set("conta_id", params.accountId);

  const queryString = query.toString();
  const path = queryString ? `/lancamentos?${queryString}` : "/lancamentos";

  const result = await apiFetch<PaginatedResponse<BackendLancamento>>(path);

  return result.data.map(mapBackendEntry);
}

export async function createJournalEntry(
  input: CreateJournalEntryInput
): Promise<JournalEntry> {
  const result = await apiFetch<BackendLancamento>("/lancamentos", {
    method: "POST",
    body: {
      description: input.description,
      date: input.date,
      partidas: input.partidas.map((partida) => ({
        conta_id: Number(partida.accountId),
        valor: partida.valor,
        natureza: partida.natureza,
      })),
    },
  });

  // LancamentoService::registrarLancamentoContabil devolve o model recém
  // criado sem a relação "partidas" carregada (o loop usa
  // $lancamento->partidas()->create(...), que não popula o relacionamento em
  // memória). Por isso completamos com as partidas que nós mesmos enviamos
  // em vez de confiar em result.partidas, que normalmente vem vazio/ausente.
  return {
    id: String(result.id),
    description: result.description ?? input.description,
    date: result.date ?? input.date,
    partidas: input.partidas,
  };
}
