import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { customers, invoices, services } from "../../mocks";
import type { InvoiceStatus } from "../../types/common";

import { PageHeader } from "../../components/shared/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

type StatusFilter = InvoiceStatus | "Todos";

function mapInvoiceStatus(status: InvoiceStatus) {
  switch (status) {
    case "Emitida":
      return "issued" as const;
    case "Pendente":
      return "pending" as const;
    case "Rejeitada":
      return "rejected" as const;
    case "Cancelada":
      return "cancelled" as const;
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");

  const rows = useMemo(() => {
    return invoices.map((invoice) => ({
      ...invoice,
      customerName:
        customers.find((customer) => customer.id === invoice.customerId)?.name ??
        invoice.customerId,
      serviceName:
        services.find((service) => service.id === invoice.serviceId)?.name ??
        invoice.serviceId,
    }));
  }, []);

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "Todos" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notas fiscais"
        description="Acompanhe as NFS-e emitidas, pendentes e canceladas."
        action={
          <Link to="/invoices/new">
            <Button>Emitir NFS-e</Button>
          </Link>
        }
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar por número ou cliente..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <div className="md:w-56">
          <Select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
          >
            <option value="Todos">Todos os status</option>
            <option value="Emitida">Emitida</option>
            <option value="Pendente">Pendente</option>
            <option value="Rejeitada">Rejeitada</option>
            <option value="Cancelada">Cancelada</option>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRows.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium text-slate-100">
                {invoice.id}
              </TableCell>

              <TableCell>{invoice.customerName}</TableCell>

              <TableCell>{invoice.serviceName}</TableCell>

              <TableCell>{invoice.issueDate}</TableCell>

              <TableCell>{formatCurrency(invoice.amount)}</TableCell>

              <TableCell>
                <StatusBadge status={mapInvoiceStatus(invoice.status)} />
              </TableCell>

              <TableCell>
                <Link to="/invoices/preview">
                  <Button variant="secondary">Visualizar</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}

          {filteredRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500">
                Nenhuma nota fiscal encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
