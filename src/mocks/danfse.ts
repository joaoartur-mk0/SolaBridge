import type { DanfseData } from "../types/danfse";

export const danfseMock: DanfseData = {
  accessKey: "35260500000000000100550010000000011000000015",
  number: "000001",
  competenceDate: "04/07/2026",
  issueDateTime: "04/07/2026 10:35:22",
  dpsNumber: "15",
  dpsSeries: "A1",
  dpsIssueDateTime: "04/07/2026 10:34:10",
  issuer: "Prestador",
  status: "draft",
  purpose: "NFS-e regular",
  cityName: "Teófilo Otoni / MG",
  generatorEnvironment: "Sistema Nacional NFS-e",
  environmentType: "homologation",

  provider: {
    document: "00.000.000/0001-00",
    municipalRegistration: "123456",
    phone: "(33) 99999-0000",
    name: "SolaBridge Tecnologia LTDA",
    city: "Teófilo Otoni",
    state: "MG",
    ibgeCode: "3168606",
    zipCode: "39.800-000",
    address: "Rua Exemplo, 100, Centro",
    email: "contato@solabridge.com.br",
  },

  customer: {
    document: "12.345.678/0001-90",
    municipalRegistration: "654321",
    phone: "(33) 98888-0000",
    name: "Alfa Serviços Contábeis LTDA",
    city: "Teófilo Otoni",
    state: "MG",
    ibgeCode: "3168606",
    zipCode: "39.800-000",
    address: "Avenida Principal, 250, Centro",
    email: "financeiro@alfacontabil.com.br",
  },

  recipientIsCustomer: true,

  service: {
    nationalTaxCode: "01.05.01",
    municipalTaxCode: "001",
    nbsCode: "1.1401.10.00",
    location: "Teófilo Otoni",
    locationState: "MG",
    country: "BR",
    taxDescription:
      "Licenciamento ou cessão de direito de uso de programas de computação.",
    description:
      "Prestação de serviço de desenvolvimento, implantação e suporte de sistema web para gestão contábil simplificada.",
  },

  municipalTax: {
    taxationType: "Operação Tributável",
    incidenceLocation: "Teófilo Otoni / MG / BR",
    specialRegime: "-",
    immunityType: "-",
    suspendedEnforceability: "-",
    suspensionProcess: "-",
    municipalBenefit: "-",
    deductions: 0,
    unconditionalDiscount: 0,
    calculationBase: 3500,
    rate: 2,
    retention: "Não Retido",
    issqnAmount: 70,
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
    incidenceCityCode: "3168606",
    incidenceCity: "Teófilo Otoni",
    incidenceState: "MG",
    calculationBase: 3500,
    ibsStateRate: 0,
    ibsCityRate: 0,
    ibsCityAmount: 0,
    ibsStateAmount: 0,
    ibsTotalAmount: 0,
    cbsRate: 0,
    cbsAmount: 0,
  },

  totals: {
    serviceAmount: 3500,
    unconditionalDiscount: 0,
    conditionalDiscount: 0,
    totalRetentions: 70,
    netAmount: 3430,
    ibsCbsTotal: 0,
    netAmountWithIbsCbs: 3430,
  },

  complementaryInfo: {
    text: "Documento gerado em ambiente acadêmico para simulação do fluxo de emissão de NFS-e.",
    approximateTaxes: {
      federal: 0,
      state: 0,
      municipal: 70,
    },
  },
};