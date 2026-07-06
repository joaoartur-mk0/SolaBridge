import { useState } from "react";

import { accounts, journalEntries } from "../../mocks";
import { getAccountLedger } from "../../utils/ledger";

import { PageHeader } from "../../components/shared/PageHeader";
import { Badge } from "../../components/ui/Badge";
import { Select } from "../../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function AccountLedgerPage() {
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? "");

  const account = accounts.find((item) => item.id === accountId);
  const extrato = account ? getAccountLedger(account, journalEntries) : null;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Extrato / Razão por conta"
        description="Movimentações e saldo acumulado de uma conta contábil."
        action={
          account && (
            <Badge variant="info">Saldo atual: {formatCurrency(extrato?.saldoAtual ?? 0)}</Badge>
          )
        }
      />

      <div className="md:w-80">
        <Select
          label="Conta"
          value={accountId}
          onChange={(event) => setAccountId(event.target.value)}
        >
          {accounts.map((item) => (
            <option key={item.id} value={item.id}>
              {item.codigo} — {item.nome}
            </option>
          ))}
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Histórico</TableHead>
            <TableHead>Débito</TableHead>
            <TableHead>Crédito</TableHead>
            <TableHead>Saldo acumulado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {extrato?.movimentacoes.map((movimento, index) => (
            <TableRow key={index}>
              <TableCell>{movimento.data}</TableCell>
              <TableCell className="font-medium text-slate-100">{movimento.historico}</TableCell>
              <TableCell>{movimento.debito > 0 ? formatCurrency(movimento.debito) : "—"}</TableCell>
              <TableCell>{movimento.credito > 0 ? formatCurrency(movimento.credito) : "—"}</TableCell>
              <TableCell className="font-medium text-slate-100">
                {formatCurrency(movimento.saldoAcumulado)}
              </TableCell>
            </TableRow>
          ))}

          {extrato?.movimentacoes.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500">
                Nenhuma movimentação para esta conta.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
