import type { InvoiceCustomer, InvoiceFormValues, InvoiceService } from "./types";
import { operationNatureOptions } from "./types";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function ReviewItem({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-100">{value?.trim() ? value : "—"}</p>
    </div>
  );
}

type RevisaoStepProps = {
  values: InvoiceFormValues;
  customer?: InvoiceCustomer;
  service?: InvoiceService;
  amount: number;
};

export function RevisaoStep({ values, customer, service, amount }: RevisaoStepProps) {
  const operationNatureLabel = operationNatureOptions.find(
    (option) => option.value === values.operationNature
  )?.label;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Tomador e serviço
        </h3>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <ReviewItem label="Cliente / Tomador" value={customer?.name} />
          <ReviewItem label="Documento" value={customer?.document} />
          <ReviewItem label="Serviço" value={service?.name} />
          <ReviewItem label="Valor da nota" value={formatCurrency(amount)} />
          <ReviewItem label="Natureza da operação" value={operationNatureLabel} />
        </div>
      </div>

      <div className="border-t border-slate-800 pt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Detalhes do serviço
        </h3>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <ReviewItem label="Data de emissão" value={values.issueDate} />
          <ReviewItem label="Local da prestação" value={values.placeOfService} />
          <ReviewItem label="Código de Tributação Nacional" value={values.nationalTaxCode} />
          <ReviewItem label="Código da NBS" value={values.nbsCode} />
          <div className="md:col-span-2">
            <ReviewItem label="Descrição do serviço" value={values.description} />
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 pt-5">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          Complementos
        </h3>

        <div className="mt-3 grid gap-4 md:grid-cols-2">
          <ReviewItem
            label="Intermediário"
            value={values.hasIntermediary ? values.intermediaryName : "Sem intermediário"}
          />

          {values.hasIntermediary && (
            <ReviewItem label="Documento do intermediário" value={values.intermediaryDocument} />
          )}

          <div className="md:col-span-2">
            <ReviewItem label="Informações complementares" value={values.complementaryInfo} />
          </div>

          <ReviewItem
            label="Documento de Responsabilidade Técnica"
            value={values.technicalResponsibilityDocument}
          />
        </div>
      </div>
    </div>
  );
}
