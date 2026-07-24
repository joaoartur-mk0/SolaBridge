import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import type { Customer } from "../../types/customer";
import type { CustomerType } from "../../types/common";
import type { Address } from "../../types/address";

import { ApiError } from "../../services/apiClient";
import {
  createCustomer,
  listCustomers,
  updateCustomerLocalAddress,
  updateCustomerStatus,
} from "../../services/customersService";

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
  codigoIbge: "",
  street: "",
  number: "",
  neighborhood: "",
  city: "",
  state: "",
  zipCode: "",
};

type CustomerForm = typeof emptyForm;
type StatusFilter = "all" | "active" | "inactive";

function customerToForm(customer: Customer): CustomerForm {
  return {
    type: customer.type,
    name: customer.name,
    document: customer.document,
    email: customer.email,
    phone: customer.phone,
    codigoIbge: customer.address.codigoIbge || "",
    street: customer.address.street,
    number: customer.address.number,
    neighborhood: customer.address.neighborhood,
    city: customer.address.city,
    state: customer.address.state,
    zipCode: customer.address.zipCode,
  };
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [isFormOpen, setIsFormOpen] = useState(false);
  // Não-nulo = editando só o endereço local de um cliente já existente.
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form, setForm] = useState<CustomerForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const isPessoaJuridica = form.type === "Pessoa Jurídica";
  const isEditingAddressOnly = editingCustomer !== null;

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listCustomers({
        search: search.trim() || undefined,
        status: statusFilter === "all" ? undefined : statusFilter,
      });

      setCustomers(data);
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível carregar os clientes."
      );
    } finally {
      setIsLoading(false);
    }
  }, [search, statusFilter]);

  // Busca no servidor, com debounce pra não disparar uma request por tecla.
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCustomers();
    }, 400);

    return () => clearTimeout(timeout);
  }, [fetchCustomers]);

  function handleChange(field: keyof CustomerForm) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function handleTypeChange(type: CustomerType) {
    setForm((current) => ({ ...current, type }));
  }

  function openCreateForm() {
    setEditingCustomer(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditAddressForm(customer: Customer) {
    setEditingCustomer(customer);
    setForm(customerToForm(customer));
    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingCustomer(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function handleToggleStatus(customer: Customer) {
    setStatusUpdatingId(customer.id);

    try {
      const updated = await updateCustomerStatus(customer.id, !customer.active);

      setCustomers((current) =>
        current.map((item) => (item.id === customer.id ? updated : item))
      );
    } catch (error) {
      setLoadError(
        error instanceof ApiError
          ? error.message
          : "Não foi possível atualizar o status do cliente."
      );
    } finally {
      setStatusUpdatingId(null);
    }
  }

  async function handleSubmit() {
    const address: Address = {
      street: form.street,
      number: form.number,
      neighborhood: form.neighborhood,
      city: form.city,
      state: form.state,
      zipCode: form.zipCode,
    };

    // Editando um cliente existente: só o endereço (local) pode mudar aqui,
    // não existe rota no backend pra atualizar os outros dados ainda.
    if (editingCustomer) {
      updateCustomerLocalAddress(editingCustomer.id, address);

      setCustomers((current) =>
        current.map((item) =>
          item.id === editingCustomer.id ? { ...item, address } : item
        )
      );

      closeForm();
      return;
    }

    if (!form.name.trim() || !form.document.trim()) {
      setFormError(
        isPessoaJuridica ? "Preencha a razão social e o CNPJ." : "Preencha o nome e o CPF."
      );
      return;
    }

    if (form.codigoIbge && !/^\d{7}$/.test(form.codigoIbge.trim())) {
      setFormError("O código IBGE do município deve ter exatamente 7 dígitos.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    try {
      const newCustomer = await createCustomer({
        type: form.type,
        name: form.name.trim(),
        document: form.document.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        codigoIbge: form.codigoIbge.trim(),
        address,
      });

      setCustomers((current) =>
        [...current, newCustomer].sort((a, b) => a.name.localeCompare(b.name))
      );

      closeForm();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.firstFieldError ?? error.message);
      } else {
        setFormError("Não foi possível salvar o cliente.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Clientes"
        description="Cadastre e visualize os clientes (tomadores) usados na emissão de NFS-e."
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
              title={isEditingAddressOnly ? "Editar endereço" : "Novo cliente"}
              description={
                isEditingAddressOnly
                  ? "Nome, documento e contato ainda não podem ser editados por aqui (falta rota no backend)."
                  : "Dados usados como tomador nas NFS-e emitidas."
              }
              action={
                !isEditingAddressOnly && (
                  <PersonTypeToggle value={form.type} onChange={handleTypeChange} />
                )
              }
            />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <Input
                label={isPessoaJuridica ? "Razão social" : "Nome completo"}
                value={form.name}
                onChange={handleChange("name")}
                disabled={isEditingAddressOnly}
              />

              <Input
                label={isPessoaJuridica ? "CNPJ" : "CPF"}
                placeholder={isPessoaJuridica ? "00.000.000/0000-00" : "000.000.000-00"}
                value={form.document}
                onChange={handleChange("document")}
                disabled={isEditingAddressOnly}
              />

              <Input
                label="E-mail"
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                disabled={isEditingAddressOnly}
              />

              <Input
                label="Telefone"
                value={form.phone}
                onChange={handleChange("phone")}
                disabled={isEditingAddressOnly}
              />

              {!isEditingAddressOnly && (
                <div>
                  <Input
                    label="Código IBGE do município"
                    placeholder="3550308"
                    value={form.codigoIbge}
                    onChange={handleChange("codigoIbge")}
                    maxLength={7}
                  />
                  <p className="mt-1 text-xs text-slate-500">
                    7 dígitos. Consulte em{" "}
                    <span className="text-slate-400">
                      geoservicos.ibge.gov.br
                    </span>
                    . Obrigatório para clientes nacionais.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-slate-800 pt-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Endereço (informações complementares — salvo só neste navegador)
              </p>

              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
            </div>

            {formError && <p className="mt-4 text-sm text-danger">{formError}</p>}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button variant="secondary" onClick={closeForm}>
                Cancelar
              </Button>

              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Salvando…" : isEditingAddressOnly ? "Salvar endereço" : "Salvar cliente"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Input
          placeholder="Pesquisar por nome ou documento..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="sm:max-w-sm"
        />

        <div className="inline-flex rounded-lg border border-slate-700 bg-slate-950 p-1">
          {(
            [
              { value: "all", label: "Todos" },
              { value: "active", label: "Ativos" },
              { value: "inactive", label: "Inativos" },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setStatusFilter(option.value)}
              className={
                "rounded-md px-3 py-1.5 text-sm font-medium transition " +
                (statusFilter === option.value
                  ? "bg-brand text-slate-50"
                  : "text-slate-400 hover:text-slate-100")
              }
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <p className="rounded-lg border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {loadError}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Documento</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Cidade</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-slate-500">
                Carregando clientes…
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            customers.map((customer) => (
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

                <TableCell>{customer.email || "—"}</TableCell>

                <TableCell>{customer.phone || "—"}</TableCell>

                <TableCell>{customer.address.city || "—"}</TableCell>

                <TableCell>
                  <Badge variant={customer.active ? "success" : "default"}>
                    {customer.active ? "Ativo" : "Inativo"}
                  </Badge>
                </TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEditAddressForm(customer)}>
                      Editar endereço
                    </Button>

                    <Button
                      variant={customer.active ? "danger" : "secondary"}
                      disabled={statusUpdatingId === customer.id}
                      onClick={() => handleToggleStatus(customer)}
                    >
                      {statusUpdatingId === customer.id
                        ? "Salvando…"
                        : customer.active
                          ? "Inativar"
                          : "Ativar"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && customers.length === 0 && !loadError && (
            <TableRow>
              <TableCell colSpan={8} className="text-center text-slate-500">
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
