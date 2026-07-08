import { Select } from "../../../components/ui/Select";
import { Input } from "../../../components/ui/Input";

import type {
  InvoiceCustomer,
  InvoiceFormValues,
  InvoiceService,
  UpdateInvoiceField,
} from "./types";
import { operationNatureOptions } from "./types";

type TomadorServicoStepProps = {
  values: InvoiceFormValues;
  updateField: UpdateInvoiceField;
  customers: InvoiceCustomer[];
  services: InvoiceService[];
  onServiceChange: (serviceId: string) => void;
};

export function TomadorServicoStep({
  values,
  updateField,
  customers,
  services,
  onServiceChange,
}: TomadorServicoStepProps) {
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Cliente / Tomador</label>

        <Select
          value={values.customerId}
          onChange={(event) => updateField("customerId", event.target.value)}
        >
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Serviço</label>

        <Select
          value={values.serviceId}
          onChange={(event) => onServiceChange(event.target.value)}
        >
          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </Select>
      </div>

      <Input
        label="Valor da nota"
        type="number"
        min="0"
        step="0.01"
        value={values.amount}
        onChange={(event) => updateField("amount", event.target.value)}
        placeholder="0,00"
      />

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-200">Natureza da operação</label>

        <Select
          value={values.operationNature}
          onChange={(event) => updateField("operationNature", event.target.value)}
        >
          {operationNatureOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
