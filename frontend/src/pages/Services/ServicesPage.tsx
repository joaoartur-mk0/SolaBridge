import { useCallback, useEffect, useState, type ChangeEvent } from "react";

import type { Service } from "../../types/service";
import { ApiError } from "../../services/apiClient";
import {
  createService,
  deleteService,
  listServices,
  updateService,
} from "../../services/servicesService";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";

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
  name: "",
  description: "",
  price: "",
  code: "",
  nationalTaxCode: "",
  serviceCityCode: "",
  issRate: "",
};

type ServiceForm = typeof emptyForm;

function serviceToForm(service: Service): ServiceForm {
  return {
    name: service.name,
    description: service.description,
    price: String(service.price),
    code: service.code ?? "",
    nationalTaxCode: service.nationalTaxCode ?? "",
    serviceCityCode: service.serviceCityCode ?? "",
    issRate: service.issRate !== undefined ? String(service.issRate) : "",
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [search, setSearch] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [formError, setFormError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listServices({ search: search.trim() || undefined });
      setServices(data);
    } catch (error) {
      setLoadError(
        error instanceof ApiError ? error.message : "Não foi possível carregar os serviços."
      );
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  // Busca no servidor, com debounce pra não disparar uma request por tecla.
  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchServices();
    }, 400);

    return () => clearTimeout(timeout);
  }, [fetchServices]);

  function handleChange(field: keyof ServiceForm) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({ ...current, [field]: event.target.value }));
    };
  }

  function openCreateForm() {
    setEditingService(null);
    setForm(emptyForm);
    setFormError("");
    setIsFormOpen(true);
  }

  function openEditForm(service: Service) {
    setEditingService(service);
    setForm(serviceToForm(service));
    setFormError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setEditingService(null);
    setForm(emptyForm);
    setFormError("");
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Excluir o serviço "${service.name}"?`)) {
      return;
    }

    setDeletingId(service.id);

    try {
      await deleteService(service.id);
      setServices((current) => current.filter((item) => item.id !== service.id));
    } catch (error) {
      setLoadError(
        error instanceof ApiError ? error.message : "Não foi possível excluir o serviço."
      );
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSubmit() {
    if (!form.name.trim() || !form.description.trim() || !form.code.trim()) {
      setFormError("Preencha nome, descrição e código do serviço.");
      return;
    }

    if (!form.nationalTaxCode.trim() || !form.serviceCityCode.trim()) {
      setFormError("Código de Tributação Nacional e código IBGE do município são obrigatórios.");
      return;
    }

    if (!/^\d{7}$/.test(form.serviceCityCode.trim())) {
      setFormError("O código IBGE do município deve ter exatamente 7 dígitos.");
      return;
    }

    const price = Number(form.price);

    if (!price || price <= 0) {
      setFormError("Informe um preço válido.");
      return;
    }

    setIsSaving(true);
    setFormError("");

    const input = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      code: form.code.trim(),
      nationalTaxCode: form.nationalTaxCode.trim(),
      serviceCityCode: form.serviceCityCode.trim(),
      issRate: form.issRate ? Number(form.issRate) : undefined,
    };

    try {
      if (editingService) {
        const updated = await updateService(editingService.id, input);

        setServices((current) =>
          current.map((item) => (item.id === editingService.id ? updated : item))
        );
      } else {
        const created = await createService(input);

        setServices((current) =>
          [...current, created].sort((a, b) => a.name.localeCompare(b.name))
        );
      }

      closeForm();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.firstFieldError ?? error.message);
      } else {
        setFormError("Não foi possível salvar o serviço.");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Serviços"
        description="Cadastre, edite e visualize os serviços oferecidos."
        action={
          <Button onClick={() => (isFormOpen ? closeForm() : openCreateForm())}>
            {isFormOpen ? "Fechar" : "Novo Serviço"}
          </Button>
        }
      />

      {isFormOpen && (
        <Card>
          <CardHeader>
            <SectionHeader
              title={editingService ? "Editar serviço" : "Novo serviço"}
              description="Dados usados na precificação e tributação da NFS-e."
            />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <Input label="Nome do serviço" value={form.name} onChange={handleChange("name")} />

              <Input
                label="Código interno"
                placeholder="SRV-001"
                value={form.code}
                onChange={handleChange("code")}
              />

              <Input
                label="Preço"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange("price")}
              />

              <Input
                label="Alíquota do ISS (%)"
                type="number"
                min="0"
                max="100"
                step="0.01"
                value={form.issRate}
                onChange={handleChange("issRate")}
              />

              <Input
                label="Código de Tributação Nacional"
                placeholder="nn.nn.nn"
                value={form.nationalTaxCode}
                onChange={handleChange("nationalTaxCode")}
              />

              <div>
                <Input
                  label="Código IBGE do município"
                  placeholder="3550308"
                  value={form.serviceCityCode}
                  onChange={handleChange("serviceCityCode")}
                  maxLength={7}
                />
                <p className="mt-1 text-xs text-slate-500">
                  7 dígitos. Município padrão de prestação deste serviço.
                </p>
              </div>

              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-medium text-slate-200">Descrição</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, description: event.target.value }))
                  }
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20"
                />
              </div>
            </div>

            {formError && <p className="mt-4 text-sm text-red-400">{formError}</p>}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button variant="secondary" onClick={closeForm}>
                Cancelar
              </Button>

              <Button onClick={handleSubmit} disabled={isSaving}>
                {isSaving ? "Salvando…" : editingService ? "Salvar alterações" : "Salvar serviço"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        placeholder="Pesquisar por nome ou código..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      {loadError && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {loadError}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serviço</TableHead>
            <TableHead>Código</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500">
                Carregando serviços…
              </TableCell>
            </TableRow>
          )}

          {!isLoading &&
            services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium text-slate-100">{service.name}</TableCell>

                <TableCell>{service.code ?? "—"}</TableCell>

                <TableCell>{service.description}</TableCell>

                <TableCell>{formatCurrency(service.price)}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEditForm(service)}>
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      disabled={deletingId === service.id}
                      onClick={() => handleDelete(service)}
                    >
                      {deletingId === service.id ? "Excluindo…" : "Excluir"}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}

          {!isLoading && services.length === 0 && !loadError && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500">
                Nenhum serviço encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
