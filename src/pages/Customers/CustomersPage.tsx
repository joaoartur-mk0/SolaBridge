import { useState } from "react";

import { customers } from "../../mocks";

import { PageHeader } from "../../components/shared/PageHeader";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clientes"
        description="Cadastre, edite e visualize seus clientes."
        action={<Button>Novo Cliente</Button>}
      />

      <Input
        placeholder="Pesquisar cliente..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredCustomers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium text-slate-100">
                {customer.name}
              </TableCell>

              <TableCell>
                <Badge variant={customer.type === "Pessoa Jurídica" ? "info" : "default"}>
                  {customer.type === "Pessoa Jurídica" ? "PJ" : "PF"}
                </Badge>
              </TableCell>

              <TableCell>{customer.document}</TableCell>

              <TableCell>{customer.email}</TableCell>

              <TableCell>{customer.phone}</TableCell>

              <TableCell>{customer.address.city}</TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button variant="secondary">Editar</Button>
                  <Button variant="danger">Excluir</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {filteredCustomers.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-500">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
