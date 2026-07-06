import { dashboard } from "../mocks/dashboard";
import { invoices } from "../mocks/invoices";
import { accounts, journalEntries } from "../mocks";

import { PageHeader } from "../components/shared/PageHeader";
import { SectionHeader } from "../components/shared/SectionHeader";
import { StatusBadge } from "../components/shared/StatusBadge";

import { Button } from "../components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Link } from "react-router-dom";

import { mapInvoiceStatus } from "../utils/invoiceStatus";
import { getCashBalance, getIncomeStatement } from "../utils/ledger";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const recentInvoices = invoices.map((invoice) => ({
  ...invoice,
  number: invoice.id,
  customerName: invoice.customerId,
  serviceName: invoice.serviceId,
}));

const taxSummary = [
  {
    label: "ISS estimado",
    value: 950,
    description: "Cálculo simulado sobre serviços emitidos",
  },
  {
    label: "Impostos federais",
    value: 1750,
    description: "Previsão simplificada para acompanhamento",
  },
  {
    label: "Total estimado",
    value: dashboard.estimatedTaxes,
    description: "Valor aproximado para planejamento",
  },
];

export function Dashboard() {
  const caixaBancos = getCashBalance(accounts, journalEntries);
  const dre = getIncomeStatement(accounts, journalEntries);
  const isLucro = dre.resultadoLiquido >= 0;

  const rascunhoCount = invoices.filter((invoice) => invoice.status === "Rascunho").length;
  const contingenciaCount = invoices.filter((invoice) => invoice.status === "Contingência").length;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral financeira, contábil e fiscal da empresa."
        action={
          <Link to="/invoices/new">
            <Button>Emitir NFS-e</Button>
          </Link>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Receita do mês"
          value={formatCurrency(dashboard.monthlyRevenue)}
          description="Total faturado no período atual"
          icon={<span>↗</span>}
        />

        <StatCard
          title="Saldo em Caixa e Bancos"
          value={formatCurrency(caixaBancos.saldo)}
          description="Consolidado das contas Caixa e Bancos"
          icon={<span>$</span>}
        />

        <StatCard
          title="Resultado do Período"
          value={
            <span className={isLucro ? "text-emerald-400" : "text-red-400"}>
              {formatCurrency(dre.resultadoLiquido)}
            </span>
          }
          description={isLucro ? "Lucro apurado no período" : "Prejuízo apurado no período"}
          icon={<span>=</span>}
        />

        <StatCard
          title="NFS-e emitidas"
          value={String(dashboard.invoicesIssued)}
          description={`${rascunhoCount} notas em rascunho`}
          icon={<span>NF</span>}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader>
            <SectionHeader
              title="Notas fiscais recentes"
              description="Últimas NFS-e registradas no sistema."
              action={
                <Button variant="secondary">
                  Ver histórico
                </Button>
              }
            />
          </CardHeader>

          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Número</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Serviço</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {recentInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium text-slate-100">
                      {invoice.number}
                    </TableCell>

                    <TableCell>{invoice.customerName}</TableCell>

                    <TableCell>{invoice.serviceName}</TableCell>

                    <TableCell>{formatCurrency(invoice.amount)}</TableCell>

                    <TableCell>
                      <StatusBadge status={mapInvoiceStatus(invoice.status)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo fiscal</CardTitle>
              <CardDescription>
                Valores simulados para apoiar o controle contábil.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {taxSummary.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border border-slate-800 bg-slate-950/50 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <p className="text-sm font-medium text-slate-300">
                        {item.label}
                      </p>

                      <p className="text-sm font-semibold text-lime-300">
                        {formatCurrency(item.value)}
                      </p>
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pendências</CardTitle>
              <CardDescription>
                Acompanhamento rápido das obrigações em aberto.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-300">Notas em rascunho</span>
                  <span className="font-semibold text-yellow-300">{rascunhoCount}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-300">Notas em contingência</span>
                  <span className="font-semibold text-amber-300">{contingenciaCount}</span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <span className="text-sm text-slate-300">Relatórios do mês</span>
                  <span className="font-semibold text-lime-300">Atualizados</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}