import { Input } from "../../../components/ui/Input";
import { Textarea } from "../../../components/ui/Textarea";

import type { InvoiceFormValues, UpdateInvoiceField } from "./types";

type ComplementosStepProps = {
  values: InvoiceFormValues;
  updateField: UpdateInvoiceField;
};

export function ComplementosStep({ values, updateField }: ComplementosStepProps) {
  return (
    <div className="space-y-5">
      <label className="flex items-center gap-2 text-sm font-medium text-slate-200">
        <input
          type="checkbox"
          checked={values.hasIntermediary}
          onChange={(event) => updateField("hasIntermediary", event.target.checked)}
          className="h-4 w-4 rounded border-slate-700 bg-slate-950 accent-brand"
        />
        Esta operação possui intermediário
      </label>

      {values.hasIntermediary && (
        <div className="grid gap-5 md:grid-cols-2">
          <Input
            label="Nome do intermediário"
            value={values.intermediaryName}
            onChange={(event) => updateField("intermediaryName", event.target.value)}
          />

          <Input
            label="CNPJ / CPF do intermediário"
            value={values.intermediaryDocument}
            onChange={(event) => updateField("intermediaryDocument", event.target.value)}
          />
        </div>
      )}

      <div className="grid gap-5 border-t border-slate-800 pt-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium text-slate-200">
            Informações complementares
          </label>

          <Textarea
            rows={3}
            value={values.complementaryInfo}
            onChange={(event) => updateField("complementaryInfo", event.target.value)}
            placeholder="Informações adicionais que devem constar na NFS-e..."
          />
        </div>

        <Input
          label="Documento de Responsabilidade Técnica (opcional)"
          placeholder="Ex: ART 123456-MG"
          value={values.technicalResponsibilityDocument}
          onChange={(event) => updateField("technicalResponsibilityDocument", event.target.value)}
        />
      </div>
    </div>
  );
}
