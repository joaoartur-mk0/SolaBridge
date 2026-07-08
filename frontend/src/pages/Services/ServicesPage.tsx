import { useState } from "react";

import { services } from "../../mocks";

import { PageHeader } from "../../components/shared/PageHeader";

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

export default function ServicesPage() {
  const [search, setSearch] = useState("");

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <PageHeader
        title="Serviços"
        description="Cadastre, edite e visualize os serviços oferecidos."
        action={<Button>Novo Serviço</Button>}
      />

      <Input
        placeholder="Pesquisar serviço..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredServices.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium text-slate-100">
                {service.name}
              </TableCell>

              <TableCell>{service.description}</TableCell>

              <TableCell>
                {service.price.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  <Button variant="secondary">Editar</Button>
                  <Button variant="danger">Excluir</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}

          {filteredServices.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500">
                Nenhum serviço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
