import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";

const customers = [
  {
    id: "CUS-001",
    name: "Alfa Serviços Contábeis",
    document: "12.345.678/0001-90",
    city: "Teófilo Otoni/MG",
  },
  {
    id: "CUS-002",
    name: "João Pereira Consultoria",
    document: "123.456.789-10",
    city: "Belo Horizonte/MG",
  },
];

const services = [
  {
    id: "SER-001",
    name: "Consultoria empresarial",
    defaultValue: 3500,
    taxRate: 5,
  },
  {
    id: "SER-002",
    name: "Desenvolvimento de software",
    defaultValue: 5200,
    taxRate: 2,
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CreateInvoicePage() {
  const navigate = useNavigate();

  const [customerId, setCustomerId] = useState(customers[0].id);
  const [serviceId, setServiceId] = useState(services[0].id);
  const [amount, setAmount] = useState(String(services[0].defaultValue));
  const [description, setDescription] = useState(
    "Prestação de serviço conforme contrato firmado entre as partes."
  );

  const selectedCustomer = customers.find((customer) => customer.id === customerId);
  const selectedService = services.find((service) => service.id === serviceId);

  const parsedAmount = Number(amount) || 0;

  const estimatedTax = useMemo(() => {
    if (!selectedService) {
      return 0;
    }

    return parsedAmount * (selectedService.taxRate / 100);
  }, [parsedAmount, selectedService]);

  function handleServiceChange(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);

    setServiceId(serviceId);

    if (service) {
      setAmount(String(service.defaultValue));
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Emitir NFS-e"
        description="Preencha os dados principais da nota fiscal de serviço eletrônica."
        action={
          <Badge variant="info">
            Simulação visual
          </Badge>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <SectionHeader
              title="Dados da nota"
              description="Selecione o tomador, o serviço e revise as informações antes da emissão."
            />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Cliente / Tomador
                </label>

                <Select
                  value={customerId}
                  onChange={(event) => setCustomerId(event.target.value)}
                >
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Serviço
                </label>

                <Select
                  value={serviceId}
                  onChange={(event) => handleServiceChange(event.target.value)}
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Valor da nota
                </label>

                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="0,00"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-200">
                  Natureza da operação
                </label>

                <Select defaultValue="prestacao-servico">
                  <option value="prestacao-servico">Prestação de serviço</option>
                  <option value="consultoria">Consultoria</option>
                  <option value="desenvolvimento">Desenvolvimento de software</option>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-200">
                  Descrição da NFS-e
                </label>

                <Textarea
                  rows={5}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Descreva o serviço prestado..."
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:justify-end">
              <Button variant="secondary">
                Salvar rascunho
              </Button>

              <Button onClick={() => navigate("/invoices/preview")}>
                Emitir NFS-e
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumo da emissão</CardTitle>
            <CardDescription>
              Prévia dos principais dados antes da geração da nota.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Tomador
                </p>

                <p className="mt-1 text-sm font-medium text-slate-100">
                  {selectedCustomer?.name}
                </p>

                <p className="text-xs text-slate-400">
                  {selectedCustomer?.document}
                </p>

                <p className="text-xs text-slate-500">
                  {selectedCustomer?.city}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Serviço
                </p>

                <p className="mt-1 text-sm font-medium text-slate-100">
                  {selectedService?.name}
                </p>

                <p className="text-xs text-slate-400">
                  Alíquota simulada: {selectedService?.taxRate}%
                </p>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">Valor bruto</span>
                  <span className="font-semibold text-slate-100">
                    {formatCurrency(parsedAmount)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4">
                  <span className="text-sm text-slate-400">Imposto estimado</span>
                  <span className="font-semibold text-yellow-300">
                    {formatCurrency(estimatedTax)}
                  </span>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">Valor líquido estimado</span>
                    <span className="font-bold text-lime-300">
                      {formatCurrency(parsedAmount - estimatedTax)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-lime-400/20 bg-lime-400/5 p-4">
                <p className="text-sm font-medium text-lime-300">
                  Emissão em modo demonstrativo
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Nesta etapa acadêmica, o botão de emissão apenas representa o fluxo visual.
                  A integração com a API pública de NFS-e será feita posteriormente pelo backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}