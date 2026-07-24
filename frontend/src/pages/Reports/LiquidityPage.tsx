import { accounts, journalEntries } from "../../mocks";
import { getCurrentLiquidity } from "../../utils/ledger";

import { PageHeader } from "../../components/shared/PageHeader";
import { StatCard } from "../../components/ui/StatCard";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function LiquidityPage() {
  const liquidez = getCurrentLiquidity(accounts, journalEntries);
  const isSaudavel = liquidez.indice >= 1;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Índice de Liquidez Corrente"
        description="Capacidade da empresa de pagar suas dívidas de curto prazo."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Ativo Circulante"
          value={formatCurrency(liquidez.ativoCirculante)}
          description="Contas com código 1.1.x"
        />

        <StatCard
          title="Passivo Circulante"
          value={formatCurrency(liquidez.passivoCirculante)}
          description="Contas com código 2.1.x"
        />

        <StatCard
          title="Índice de Liquidez Corrente"
          value={
            <span className={isSaudavel ? "text-positive" : "text-warning"}>
              {liquidez.indice.toFixed(2)}x
            </span>
          }
          description={liquidez.status}
        />
      </section>
    </div>
  );
}
