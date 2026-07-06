import { useState, type ChangeEvent } from "react";

import { customers as customersMock } from "../../mocks";
import type { Customer } from "../../types/customer";
import type { CustomerType } from "../../types/common";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { PersonTypeToggle } from "../../components/shared/PersonTypeToggle";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

const emptyForm = {
  type: "Pessoa Jurídica" as CustomerType,
  name: "",
  document: "",
  email: "",
  phone: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

type CustomerForm = typeof emptyForm;

function customerToForm(customer: Customer): CustomerForm {
  return {
    type: customer.type,
    name: customer.name,
    document: customer.document,
    email: customer.email,
    phone: customer.phone,
    street: customer.address.street,
    number: customer.address.number,
    neighborhood: customer.address.neighborhood,
    city: customer.address.city,
    state: customer.address.state,
    zipCode: customer.address.zipCode,
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(customersMock);
  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [error, setError] = useState("");

  const isPessoaJuridica = form.type === "Pessoa Jurídica";

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(search.toLowerCase())
  );

  function handleChange(field: keyof CustomerForm) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleTypeChange(type: CustomerType) {
    setForm((current) => ({ ...current, type }));
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(customer: Customer) {
    setEditingId(customer.id);
    setForm(customerToForm(customer));
    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  function handleDelete(id: string) {
    setCustomers((current) => current.filter((customer) => customer.id !== id));

    if (editingId === id) {
      closeForm();
    }
  }

  function handleSubmit() {
    if (!form.name.trim() || !form.document.trim()) {
      setError(isPessoaJuridica ? "Preencha a razão social e o CNPJ." : "Preencha o nome e o CPF.");
      return;
    }

    const address = {
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
    };

    if (editingId) {
      setCustomers((current) =>
        current.map((customer) =>
          customer.id === editingId
            ? {
                ...customer,
                type: form.type,
                name: form.name.trim(),
                document: form.document.trim(),
                email: form.email.trim(),
                phone: form.phone.trim(),
                address,
              }
            : customer
        )
      );
    } else {
      const newCustomer: Customer = {
        id: `CUS-${String(customers.length + 1).padStart(3, "0")}`,
        type: form.type,
        name: form.name.trim(),
        document: form.document.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address,
      };

      setCustomers((current) => [...current, newCustomer]);
    }

    closeForm();
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clientes"
        description="Cadastre, edite e visualize seus clientes."
        action={
          <Button onClick={() => (isFormOpen ? closeForm() : openCreateForm())}>
            {isFormOpen ? "Fechar" : "Novo Cliente"}
          </Button>
        }
      />

      {isFormOpen && (
        <Card>
          <CardHeader>
            <SectionHeader
              title={editingId ? "Editar cliente" : "Novo cliente"}
              description="Dados usados como tomador nas NFS-e emitidas."
              action={<PersonTypeToggle value={form.type} onChange={handleTypeChange} />}
            />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label={isPessoaJuridica ? "Razão social" : "Nome completo"}
                value={form.name}
                onChange={handleChange("name")}
              />

              <Input
                label={isPessoaJuridica ? "CNPJ" : "CPF"}
                placeholder={isPessoaJuridica ? "00.000.000/0000-00" : "000.000.000-00"}
                value={form.document}
                onChange={handleChange("document")}
              />

              <Input
                label="E-mail"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
              />

              <Input
                label="Telefone"
                value={form.phone}
                onChange={handleChange("phone")}
              />
            </div>

            <div className="mt-6 grid gap-5 border-t border-slate-800 pt-5 md:grid-cols-2 xl:grid-cols-3">
              <Input label="Rua" value={form.street} onChange={handleChange("street")} />
              <Input label="Número" value={form.number} onChange={handleChange("number")} />
              <Input
                label="Bairro"
                value={form.neighborhood}
                onChange={handleChange("neighborhood")}
              />
              <Input label="Cidade" value={form.city} onChange={handleChange("city")} />
              <Input label="Estado" value={form.state} onChange={handleChange("state")} />
              <Input label="CEP" value={form.zipCode} onChange={handleChange("zipCode")} />
            </div>

            {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button variant="secondary" onClick={closeForm}>
                Cancelar
              </Button>

              <Button onClick={handleSubmit}>
                {editingId ? "Salvar alterações" : "Salvar cliente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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
                  <Button variant="secondary" onClick={() => openEditForm(customer)}>
                    Editar
                  </Button>
                  <Button variant="danger" onClick={() => handleDelete(customer.id)}>
                    Excluir
                  </Button>
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
