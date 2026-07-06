import type { Account } from "../types/account";
import type { JournalEntry } from "../types/ledger";

export function getAccountBalance(account: Account, entries: JournalEntry[]): number {
  let saldo = 0;

  for (const entry of entries) {
    for (const partida of entry.partidas) {
      if (partida.accountId !== account.id) {
        continue;
      }

      saldo += partida.natureza === account.natureza ? partida.valor : -partida.valor;
    }
  }

  return saldo;
}

export function getEntryTotals(partidas: { valor: number; natureza: "D" | "C" }[]) {
  const totalDebito = partidas
    .filter((partida) => partida.natureza === "D")
    .reduce((total, partida) => total + partida.valor, 0);

  const totalCredito = partidas
    .filter((partida) => partida.natureza === "C")
    .reduce((total, partida) => total + partida.valor, 0);

  return { totalDebito, totalCredito };
}
