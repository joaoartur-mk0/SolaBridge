import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { company } from "../../mocks";
import { buildDanfseFromEmission } from "../../utils/danfseBuilder";

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
import { Stepper, type StepperStep } from "../../components/ui/Stepper";

import { TomadorServicoStep } from "./steps/TomadorServicoStep";
import { DetalhesServicoStep } from "./steps/DetalhesServicoStep";
import { ComplementosStep } from "./steps/ComplementosStep";
import { RevisaoStep } from "./steps/RevisaoStep";
import type { InvoiceCustomer, InvoiceFormValues, InvoiceService } from "./steps/types";

const customers: InvoiceCustomer[] = [
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

const services: InvoiceService[] = [
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

const steps: StepperStep[] = [
  { id: "tomador-servico", label: "Tomador e Serviço" },
  { id: "detalhes-servico", label: "Detalhes do serviço" },
  { id: "complementos", label: "Complementos" },
  { id: "revisao", label: "Revisão e emissão" },
];

const initialValues: InvoiceFormValues = {
  customerId: customers[0].id,
  serviceId: services[0].id,
  amount: String(services[0].defaultValue),
  operationNature: "prestacao-servico",
  description: "Prestação de serviço conforme contrato firmado entre as partes.",
  issueDate: "",
  placeOfService: `${company.address.city}/${company.address.state}`,
  nationalTaxCode: "",
  nbsCode: "",
  hasIntermediary: false,
  intermediaryName: "",
  intermediaryDocument: "",
  complementaryInfo: "",
  technicalResponsibilityDocument: "",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function CreateInvoicePage() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<InvoiceFormValues>(initialValues);

  const selectedCustomer = customers.find((customer) => customer.id === values.customerId);
  const selectedService = services.find((service) => service.id === values.serviceId);

  const parsedAmount = Number(values.amount) || 0;

  const estimatedTax = useMemo(() => {
    if (!selectedService) {
      return 0;
    }

    return parsedAmount * (selectedService.taxRate / 100);
  }, [parsedAmount, selectedService]);

  function updateField<K extends keyof InvoiceFormValues>(field: K, value: InvoiceFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleServiceChange(serviceId: string) {
    const service = services.find((item) => item.id === serviceId);

    setValues((current) => ({
      ...current,
      serviceId,
      amount: service ? String(service.defaultValue) : current.amount,
    }));
  }

  const isTomadorServicoValid = Boolean(selectedCustomer) && Boolean(selectedService) && parsedAmount > 0;
  const isDetalhesServicoValid =
    values.description.trim().length > 0 &&
    values.issueDate.length > 0 &&
    values.nationalTaxCode.trim().length > 0 &&
    values.nbsCode.trim().length > 0;
  const isComplementosValid =
    !values.hasIntermediary ||
    (values.intermediaryName.trim().length > 0 && values.intermediaryDocument.trim().length > 0);

  const stepValidity = [isTomadorServicoValid, isDetalhesServicoValid, isComplementosValid, true];
  const canEmit = isTomadorServicoValid && isDetalhesServicoValid && isComplementosValid;
  const isLastStep = currentStep === steps.length - 1;
  const canAdvance = stepValidity[currentStep];

  function goToStep(index: number) {
    setCurrentStep(index);
  }

  function goNext() {
    if (!canAdvance) {
      return;
    }

    setCurrentStep((current) => Math.min(current + 1, steps.length - 1));
  }

  function goBack() {
    setCurrentStep((current) => Math.max(current - 1, 0));
  }

  function handleEmit() {
    if (!canEmit || !selectedCustomer || !selectedService) {
      return;
    }

    const [customerCity, customerState] = selectedCustomer.city.split("/").map((part) => part.trim());
    const [placeOfServiceCity, placeOfServiceState] = values.placeOfService
      .split("/")
      .map((part) => part.trim());

    const danfse = buildDanfseFromEmission({
      customerName: selectedCustomer.name,
      customerDocument: selectedCustomer.document,
      customerCity: customerCity ?? "",
      customerState: customerState ?? "",
      serviceName: selectedService.name,
      serviceDescription: values.description,
      amount: parsedAmount,
      taxRate: selectedService.taxRate,
      issueDate: values.issueDate,
      placeOfServiceCity: placeOfServiceCity ?? "",
      placeOfServiceState: placeOfServiceState ?? "",
      nationalTaxCode: values.nationalTaxCode,
      nbsCode: values.nbsCode,
      hasIntermediary: values.hasIntermediary,
      intermediaryName: values.intermediaryName,
      intermediaryDocument: values.intermediaryDocument,
      complementaryInfo: values.complementaryInfo,
      technicalResponsibilityDocument: values.technicalResponsibilityDocument,
    });

    navigate("/invoices/preview", { state: { danfse } });
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Emitir NFS-e"
        description="Preencha os dados principais da nota fiscal de serviço eletrônica."
        action={<Badge variant="info">Simulação visual</Badge>}
      />

      <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <Stepper steps={steps} currentStepIndex={currentStep} onStepClick={goToStep} />
          </CardHeader>

          <CardContent>
            <SectionHeader
              title={steps[currentStep].label}
              description={
                currentStep === 0
                  ? "Selecione o tomador, o serviço e o valor da nota."
                  : currentStep === 1
                  ? "Detalhes exigidos pela Nota Técnica Nº 008 para o DANFSe."
                  : currentStep === 2
                  ? "Informações opcionais: intermediário e complementos da nota."
                  : "Confira todos os dados antes de emitir a NFS-e."
              }
            />

            <div className="mt-6">
              {currentStep === 0 && (
                <TomadorServicoStep
                  values={values}
                  updateField={updateField}
                  customers={customers}
                  services={services}
                  onServiceChange={handleServiceChange}
                />
              )}

              {currentStep === 1 && (
                <DetalhesServicoStep values={values} updateField={updateField} />
              )}

              {currentStep === 2 && (
                <ComplementosStep values={values} updateField={updateField} />
              )}

              {currentStep === 3 && (
                <RevisaoStep
                  values={values}
                  customer={selectedCustomer}
                  service={selectedService}
                  amount={parsedAmount}
                />
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={goBack} disabled={currentStep === 0}>
                Voltar
              </Button>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <Button variant="ghost">Salvar rascunho</Button>

                {isLastStep ? (
                  <Button onClick={handleEmit} disabled={!canEmit}>
                    Emitir NFS-e
                  </Button>
                ) : (
                  <Button onClick={goNext} disabled={!canAdvance}>
                    Próximo
                  </Button>
                )}
              </div>
            </div>

            {!canAdvance && (
              <p className="mt-3 text-sm text-danger">
                Preencha os campos obrigatórios desta etapa para continuar.
              </p>
            )}
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

                <p className="text-xs text-slate-400">{selectedCustomer?.document}</p>

                <p className="text-xs text-slate-500">{selectedCustomer?.city}</p>
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
                  <span className="font-semibold text-warning">
                    {formatCurrency(estimatedTax)}
                  </span>
                </div>

                <div className="mt-3 border-t border-slate-800 pt-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-300">Valor líquido estimado</span>
                    <span className="font-bold text-brand-light">
                      {formatCurrency(parsedAmount - estimatedTax)}
                    </span>
                  </div>
                </div>
              </div>

              {!canEmit && (
                <div className="rounded-xl border border-warning/20 bg-warning/5 p-4">
                  <p className="text-sm font-medium text-warning">
                    Faltam campos obrigatórios
                  </p>

                  <p className="mt-1 text-xs text-slate-400">
                    Preencha data de emissão, código de tributação nacional e código da NBS
                    (e os dados do intermediário, se aplicável) para liberar a emissão.
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-brand/20 bg-brand/5 p-4">
                <p className="text-sm font-medium text-brand-light">
                  Emissão em modo demonstrativo
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Nesta etapa acadêmica, o botão de emissão gera o DANFSe com os dados
                  preenchidos aqui. A integração com a API pública de NFS-e será feita
                  posteriormente pelo backend.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
