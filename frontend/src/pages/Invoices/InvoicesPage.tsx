import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { customers, invoices as invoicesMock } from "../../mocks";
import type { InvoiceStatus } from "../../types/common";
import { mapInvoiceStatus } from "../../utils/invoiceStatus";

import { PageHeader } from "../../components/shared/PageHeader";
import { StatusBadge } from "../../components/shared/StatusBadge";

import { Dropdown } from "../../components/ui/Dropdown";
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function InvoicesPage() {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState(invoicesMock);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");

  const rows = useMemo(() => {
    return invoices.map((invoice) => ({
      ...invoice,
      customerName:
        customers.find((customer) => customer.id === invoice.customerId)?.name ??
        invoice.customerId,
    }));
  }, [invoices]);

  const filteredRows = rows.filter((row) => {
    const matchesSearch =
      row.id.toLowerCase().includes(search.toLowerCase()) ||
      row.customerName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "Todos" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  function handleCancel(invoiceId: string) {
    setInvoices((current) =>
      current.map((invoice) =>
        invoice.id === invoiceId ? { ...invoice, status: "Cancelada" as const } : invoice
      )
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Notas fiscais"
        description="Histórico das NFS-e emitidas, em rascunho, canceladas ou em contingência."
      />

      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Pesquisar por número ou destinatário..."
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
            <option value="Rascunho">Rascunho</option>
            <option value="Contingência">Contingência</option>
            <option value="Cancelada">Cancelada</option>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Número</TableHead>
            <TableHead>Destinatário</TableHead>
            <TableHead>Emissão</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Situação</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredRows.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell className="font-medium text-slate-100">
                {invoice.id}
              </TableCell>

              <TableCell>{invoice.customerName}</TableCell>

              <TableCell>{invoice.issueDate}</TableCell>

              <TableCell>{formatCurrency(invoice.amount)}</TableCell>

              <TableCell>
                <StatusBadge status={mapInvoiceStatus(invoice.status)} />
              </TableCell>

              <TableCell className="text-right">
                <Dropdown
                  items={[
                    {
                      label: "Visualizar",
                      onClick: () => navigate("/invoices/preview"),
                    },
                    {
                      label: "Editar",
                      onClick: () => navigate("/invoices/new"),
                      disabled: invoice.status === "Cancelada",
                    },
                    {
                      label: "Baixar",
                      onClick: () =>
                        alert(
                          "Download simulado: a geração real do PDF acontece na tela de pré-visualização."
                        ),
                    },
                    {
                      label: "Cancelar",
                      onClick: () => handleCancel(invoice.id),
                      variant: "danger",
                      disabled: invoice.status === "Cancelada",
                    },
                  ]}
                />
              </TableCell>
            </TableRow>
          ))}

          {filteredRows.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-slate-500">
                Nenhuma nota fiscal encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
