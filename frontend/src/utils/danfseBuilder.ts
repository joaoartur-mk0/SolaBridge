import { company } from "../mocks";
import type { DanfseData } from "../types/danfse";

export type EmissionFormData = {
  customerName: string;
  customerDocument: string;
  customerCity: string;
  customerState: string;
  serviceName: string;
  serviceDescription: string;
  amount: number;
  taxRate: number;
  issueDate: string;
  placeOfServiceCity: string;
  placeOfServiceState: string;
  nationalTaxCode: string;
  nbsCode: string;
  hasIntermediary: boolean;
  intermediaryName: string;
  intermediaryDocument: string;
  complementaryInfo: string;
  technicalResponsibilityDocument: string;
};

function formatDateBR(isoDate: string) {
  if (!isoDate) {
    return "-";
  }

  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

function generateAccessKey() {
  return Array.from({ length: 46 }, () => Math.floor(Math.random() * 10)).join("");
}

export function buildDanfseFromEmission(data: EmissionFormData): DanfseData {
  const issueDate = formatDateBR(data.issueDate);
  const issueDateTime = `${issueDate} ${new Date().toLocaleTimeString("pt-BR")}`;
  const taxAmount = data.amount * (data.taxRate / 100);

  const complementaryParts = [data.complementaryInfo.trim()];

  if (data.technicalResponsibilityDocument.trim()) {
    complementaryParts.push(`Doc. Tec.: ${data.technicalResponsibilityDocument.trim()}`);
  }

  return {
    accessKey: generateAccessKey(),
    number: String(Math.floor(Math.random() * 900000) + 100000),
    competenceDate: issueDate,
    issueDateTime,
    dpsNumber: String(Math.floor(Math.random() * 9000) + 1000),
    dpsSeries: "A1",
    dpsIssueDateTime: issueDateTime,
    issuer: "Prestador",
    status: "authorized",
    purpose: "NFS-e regular",
    cityName: `${company.address.city} / ${company.address.state}`,
    generatorEnvironment: "Sistema Nacional NFS-e",
    environmentType: "homologation",

    provider: {
      document: company.cnpj,
      municipalRegistration: company.municipalRegistration,
      phone: company.phone,
      name: company.name,
      city: company.address.city,
      state: company.address.state,
      zipCode: company.address.zipCode,
      address: `${company.address.street}, ${company.address.number}, ${company.address.neighborhood}`,
      email: company.email,
    },

    customer: {
      document: data.customerDocument,
      name: data.customerName,
      city: data.customerCity,
      state: data.customerState,
    },

    recipientIsCustomer: true,

    intermediary: data.hasIntermediary
      ? {
          document: data.intermediaryDocument,
          name: data.intermediaryName,
          city: "-",
          state: "-",
        }
      : undefined,

    service: {
      nationalTaxCode: data.nationalTaxCode,
      nbsCode: data.nbsCode,
      location: data.placeOfServiceCity,
      locationState: data.placeOfServiceState,
      country: "BR",
      taxDescription: data.serviceName,
      description: data.serviceDescription,
    },

    municipalTax: {
      taxationType: "Operação Tributável",
      incidenceLocation: `${data.placeOfServiceCity} / ${data.placeOfServiceState} / BR`,
      deductions: 0,
      unconditionalDiscount: 0,
      calculationBase: data.amount,
      rate: data.taxRate,
      retention: "Não Retido",
      issqnAmount: taxAmount,
    },

    federalTax: {
      irrf: 0,
      socialSecurity: 0,
      socialContributions: 0,
      pis: 0,
      cofins: 0,
      retentionDescription: "PIS/COFINS/CSLL Não Retido",
    },

    ibsCbsTax: {
      cst: "000",
      taxClass: "000001",
      operationIndicator: "1",
      incidenceCityCode: "-",
      incidenceCity: data.placeOfServiceCity,
      incidenceState: data.placeOfServiceState,
      calculationBase: data.amount,
      ibsStateRate: 0,
      ibsCityRate: 0,
      ibsCityAmount: 0,
      ibsStateAmount: 0,
      ibsTotalAmount: 0,
      cbsRate: 0,
      cbsAmount: 0,
    },

    totals: {
      serviceAmount: data.amount,
      unconditionalDiscount: 0,
      conditionalDiscount: 0,
      totalRetentions: taxAmount,
      netAmount: data.amount - taxAmount,
      ibsCbsTotal: 0,
      netAmountWithIbsCbs: data.amount - taxAmount,
    },

    complementaryInfo: {
      text: complementaryParts.filter(Boolean).join(" | "),
      approximateTaxes: {
        federal: 0,
        state: 0,
        municipal: taxAmount,
      },
    },
  };
}
