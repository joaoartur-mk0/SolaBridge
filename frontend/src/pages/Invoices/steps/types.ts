export type InvoiceFormValues = {
  customerId: string;
  serviceId: string;
  amount: string;
  operationNature: string;
  description: string;
  issueDate: string;
  placeOfService: string;
  nationalTaxCode: string;
  nbsCode: string;
  hasIntermediary: boolean;
  intermediaryName: string;
  intermediaryDocument: string;
  complementaryInfo: string;
  technicalResponsibilityDocument: string;
};

export type InvoiceFormField = keyof InvoiceFormValues;

export type UpdateInvoiceField = <K extends InvoiceFormField>(
  field: K,
  value: InvoiceFormValues[K]
) => void;

export type InvoiceCustomer = {
  id: string;
  name: string;
  document: string;
  city: string;
};

export type InvoiceService = {
  id: string;
  name: string;
  defaultValue: number;
  taxRate: number;
};

export const operationNatureOptions = [
  { value: "prestacao-servico", label: "Prestação de serviço" },
  { value: "consultoria", label: "Consultoria" },
  { value: "desenvolvimento", label: "Desenvolvimento de software" },
];
