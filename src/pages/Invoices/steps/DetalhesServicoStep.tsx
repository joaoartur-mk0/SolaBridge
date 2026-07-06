import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";

import type { InvoiceFormValues, UpdateInvoiceField } from "./types";

type DetalhesServicoStepProps = {
  values: InvoiceFormValues;
  updateField: UpdateInvoiceField;
};

export function DetalhesServicoStep({ values, updateField }: DetalhesServicoStepProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Descrição do serviço</label>

        <Textarea
          rows={4}
          value={values.description}
          onChange={(event) => updateField("description", event.target.value)}
          placeholder="Descreva o serviço prestado..."
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <Input
          label="Data de emissão"
          type="date"
          value={values.issueDate}
          onChange={(event) => updateField("issueDate", event.target.value)}
        />

        <Input
          label="Local da prestação"
          placeholder="Cidade/UF"
          value={values.placeOfService}
          onChange={(event) => updateField("placeOfService", event.target.value)}
        />

        <Input
          label="Código de Tributação Nacional"
          placeholder="nn.nn.nn"
          value={values.nationalTaxCode}
          onChange={(event) => updateField("nationalTaxCode", event.target.value)}
        />

        <Input
          label="Código da NBS"
          placeholder="n.nnnn.nn.nn"
          value={values.nbsCode}
          onChange={(event) => updateField("nbsCode", event.target.value)}
        />
      </div>
    </div>
  );
}
