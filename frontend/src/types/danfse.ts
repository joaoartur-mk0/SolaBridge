export type DanfseEnvironmentType = "production" | "homologation";

export type DanfseStatus =
  | "draft"
  | "authorized"
  | "cancelled"
  | "replaced"
  | "rejected";

export type DanfseParty = {
  document: string;
  municipalRegistration?: string;
  phone?: string;
  name: string;
  city: string;
  state: string;
  ibgeCode?: string;
  zipCode?: string;
  address?: string;
  email?: string;
};

export type DanfseService = {
  nationalTaxCode: string;
  municipalTaxCode?: string;
  nbsCode?: string;
  location: string;
  locationState: string;
  country: string;
  taxDescription: string;
  description: string;
};

export type DanfseMunicipalTax = {
  taxationType: string;
  incidenceLocation: string;
  specialRegime?: string;
  immunityType?: string;
  suspendedEnforceability?: string;
  suspensionProcess?: string;
  municipalBenefit?: string;
  deductions: number;
  unconditionalDiscount: number;
  calculationBase: number;
  rate: number;
  retention: string;
  issqnAmount: number;
};

export type DanfseFederalTax = {
  irrf: number;
  socialSecurity: number;
  socialContributions: number;
  pis: number;
  cofins: number;
  retentionDescription: string;
};

export type DanfseIbsCbsTax = {
  cst: string;
  taxClass: string;
  operationIndicator: string;
  incidenceCityCode: string;
  incidenceCity: string;
  incidenceState: string;
  calculationBase: number;
  ibsStateRate: number;
  ibsCityRate: number;
  ibsCityAmount: number;
  ibsStateAmount: number;
  ibsTotalAmount: number;
  cbsRate: number;
  cbsAmount: number;
};

export type DanfseTotals = {
  serviceAmount: number;
  unconditionalDiscount: number;
  conditionalDiscount: number;
  totalRetentions: number;
  netAmount: number;
  ibsCbsTotal: number;
  netAmountWithIbsCbs: number;
};

export type DanfseComplementaryInfo = {
  text?: string;
  approximateTaxes: {
    federal: number;
    state: number;
    municipal: number;
  };
};

export type DanfseData = {
  accessKey: string;
  number: string;
  competenceDate: string;
  issueDateTime: string;
  dpsNumber: string;
  dpsSeries: string;
  dpsIssueDateTime: string;
  issuer: string;
  status: DanfseStatus;
  purpose: string;
  cityName: string;
  generatorEnvironment: string;
  environmentType: DanfseEnvironmentType;
  provider: DanfseParty;
  customer?: DanfseParty;
  recipientIsCustomer: boolean;
  recipient?: DanfseParty;
  intermediary?: DanfseParty;
  service: DanfseService;
  municipalTax: DanfseMunicipalTax;
  federalTax: DanfseFederalTax;
  ibsCbsTax: DanfseIbsCbsTax;
  totals: DanfseTotals;
  complementaryInfo: DanfseComplementaryInfo;
};