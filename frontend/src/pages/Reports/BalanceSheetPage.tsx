import { accounts, journalEntries } from "../../mocks";
import { getBalanceSheet } from "../../utils/ledger";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";

import { Badge } from "../../components/ui/Badge";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function BalanceRow({ label, value, strong = false }: { label: string; value: number; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
      <span className={strong ? "text-sm font-semibold text-slate-100" : "text-sm text-slate-300"}>
        {label}
      </span>

      <span className={strong ? "font-bold text-brand-light" : "font-medium text-slate-100"}>
        {formatCurrency(value)}
      </span>
    </div>
  );
}

export function BalanceSheetPage() {
  const balanco = getBalanceSheet(accounts, journalEntries);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Balanço Patrimonial"
        description="Posição de Ativo, Passivo e Patrimônio Líquido, com a igualdade contábil verificada."
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader>
            <SectionHeader title="Ativo" description="Circulante e Não Circulante." />
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <BalanceRow label="Ativo Circulante" value={balanco.ativoCirculante} />
              <BalanceRow label="Ativo Não Circulante" value={balanco.ativoNaoCirculante} />
              <BalanceRow label="Total do Ativo" value={balanco.totalAtivo} strong />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <SectionHeader title="Passivo e Patrimônio Líquido" description="Circulante, Não Circulante e PL." />
          </CardHeader>

          <CardContent>
            <div className="space-y-3">
              <BalanceRow label="Passivo Circulante" value={balanco.passivoCirculante} />
              <BalanceRow label="Passivo Não Circulante" value={balanco.passivoNaoCirculante} />
              <BalanceRow label="Total do Passivo" value={balanco.totalPassivo} />
              <BalanceRow label="Patrimônio Líquido" value={balanco.patrimonioLiquido} />
              <BalanceRow
                label="Total Passivo + PL"
                value={balanco.totalPassivo + balanco.patrimonioLiquido}
                strong
              />
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent>
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-medium text-slate-200">
                Ativo = Passivo + Patrimônio Líquido
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatCurrency(balanco.totalAtivo)} = {formatCurrency(balanco.totalPassivo)} +{" "}
                {formatCurrency(balanco.patrimonioLiquido)}
              </p>
            </div>

            <Badge variant={balanco.equacaoValida ? "success" : "danger"}>
              {balanco.equacaoValida ? "Equação válida" : "Equação inconsistente"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
