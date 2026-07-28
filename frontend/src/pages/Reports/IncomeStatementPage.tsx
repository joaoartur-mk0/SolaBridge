import { accounts, journalEntries } from "../../mocks";
import { getIncomeStatement } from "../../utils/ledger";

import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { StatCard } from "../../components/ui/StatCard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function IncomeStatementPage() {
  const dre = getIncomeStatement(accounts, journalEntries);
  const isLucro = dre.status === "Lucro";

  return (
    <div className="space-y-8">
      <PageHeader
        title="DRE — Demonstração de Resultado"
        description="Apuração do resultado do período a partir das contas de Receita e Despesa."
        action={<Badge variant={isLucro ? "success" : "danger"}>{dre.status}</Badge>}
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total de Receitas"
          value={formatCurrency(dre.totalReceitas)}
          description="Soma das contas de Receita (natureza credora)"
          icon={<span>+</span>}
        />

        <StatCard
          title="Total de Despesas"
          value={formatCurrency(dre.totalDespesas)}
          description="Soma das contas de Despesa (natureza devedora)"
          icon={<span>-</span>}
        />

        <StatCard
          title="Resultado do Período"
          value={
            <span className={isLucro ? "text-positive" : "text-danger"}>
              {formatCurrency(dre.resultadoLiquido)}
            </span>
          }
          description={isLucro ? "Lucro no período" : "Prejuízo no período"}
          icon={<span>=</span>}
        />
      </section>
    </div>
  );
}
