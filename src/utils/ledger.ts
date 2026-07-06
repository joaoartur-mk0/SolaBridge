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

function sumBalances(accountsToSum: Account[], entries: JournalEntry[]) {
  return accountsToSum.reduce((total, account) => total + getAccountBalance(account, entries), 0);
}

export function getIncomeStatement(accounts: Account[], entries: JournalEntry[]) {
  const contaPorId = new Map(accounts.map((account) => [account.id, account]));

  let totalReceitas = 0;
  let totalDespesas = 0;

  for (const entry of entries) {
    for (const partida of entry.partidas) {
      const conta = contaPorId.get(partida.accountId);

      if (!conta) {
        continue;
      }

      if (conta.tipo === "RECEITA" && partida.natureza === "C") {
        totalReceitas += partida.valor;
      }

      if (conta.tipo === "DESPESA" && partida.natureza === "D") {
        totalDespesas += partida.valor;
      }
    }
  }

  const resultadoLiquido = totalReceitas - totalDespesas;

  return {
    totalReceitas,
    totalDespesas,
    resultadoLiquido,
    status: resultadoLiquido >= 0 ? ("Lucro" as const) : ("Prejuízo" as const),
  };
}

const CIRCULANTE_ATIVO_PREFIXO = "1.1.";
const CIRCULANTE_PASSIVO_PREFIXO = "2.1.";

export function getBalanceSheet(accounts: Account[], entries: JournalEntry[]) {
  const contasAtivo = accounts.filter((account) => account.tipo === "ATIVO");
  const contasPassivo = accounts.filter((account) => account.tipo === "PASSIVO");
  const contasPL = accounts.filter((account) => account.tipo === "PL");

  const ativoCirculante = sumBalances(
    contasAtivo.filter((account) => account.codigo.startsWith(CIRCULANTE_ATIVO_PREFIXO)),
    entries
  );
  const ativoNaoCirculante = sumBalances(
    contasAtivo.filter((account) => !account.codigo.startsWith(CIRCULANTE_ATIVO_PREFIXO)),
    entries
  );

  const passivoCirculante = sumBalances(
    contasPassivo.filter((account) => account.codigo.startsWith(CIRCULANTE_PASSIVO_PREFIXO)),
    entries
  );
  const passivoNaoCirculante = sumBalances(
    contasPassivo.filter((account) => !account.codigo.startsWith(CIRCULANTE_PASSIVO_PREFIXO)),
    entries
  );

  const totalAtivo = ativoCirculante + ativoNaoCirculante;
  const totalPassivo = passivoCirculante + passivoNaoCirculante;

  const plBase = sumBalances(contasPL, entries);
  const { resultadoLiquido } = getIncomeStatement(accounts, entries);
  const totalPL = plBase + resultadoLiquido;

  return {
    ativoCirculante,
    ativoNaoCirculante,
    totalAtivo,
    passivoCirculante,
    passivoNaoCirculante,
    totalPassivo,
    patrimonioLiquido: totalPL,
    equacaoValida: Math.abs(totalAtivo - (totalPassivo + totalPL)) < 0.01,
  };
}

export function getCurrentLiquidity(accounts: Account[], entries: JournalEntry[]) {
  const ativoCirculante = sumBalances(
    accounts.filter(
      (account) => account.tipo === "ATIVO" && account.codigo.startsWith(CIRCULANTE_ATIVO_PREFIXO)
    ),
    entries
  );

  const passivoCirculante = sumBalances(
    accounts.filter(
      (account) =>
        account.tipo === "PASSIVO" && account.codigo.startsWith(CIRCULANTE_PASSIVO_PREFIXO)
    ),
    entries
  );

  const indice = passivoCirculante > 0 ? ativoCirculante / passivoCirculante : 0;

  return {
    ativoCirculante,
    passivoCirculante,
    indice: Math.round(indice * 100) / 100,
    status:
      indice >= 1
        ? ("Saudável (capacidade de pagar dívidas)" as const)
        : ("Atenção (risco de falta de liquidez)" as const),
  };
}

export function getCashBalance(accounts: Account[], entries: JournalEntry[]) {
  const contasCaixaBancos = accounts.filter(
    (account) => account.nome === "Caixa" || account.nome === "Bancos"
  );

  const saldo = sumBalances(contasCaixaBancos, entries);

  return {
    saldo,
    status: saldo >= 0 ? ("Positivo" as const) : ("Negativo" as const),
  };
}

export function getAccountLedger(account: Account, entries: JournalEntry[]) {
  const movimentacoesOrdenadas = entries
    .filter((entry) => entry.partidas.some((partida) => partida.accountId === account.id))
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date));

  let saldoAcumulado = 0;

  const movimentacoes = movimentacoesOrdenadas.flatMap((entry) =>
    entry.partidas
      .filter((partida) => partida.accountId === account.id)
      .map((partida) => {
        saldoAcumulado +=
          partida.natureza === account.natureza ? partida.valor : -partida.valor;

        return {
          data: entry.date,
          historico: entry.description,
          debito: partida.natureza === "D" ? partida.valor : 0,
          credito: partida.natureza === "C" ? partida.valor : 0,
          saldoAcumulado,
        };
      })
  );

  return { saldoAtual: saldoAcumulado, movimentacoes };
}
