import type { ServiceId } from "./ids";
import type { Money } from "./money";

export interface Service {
    id: ServiceId;
    name: string;
    description: string;
    price: Money;
    /** Código interno do serviço no tenant. */
    code?: string;
    /** Código de Tributação Nacional (LC 116/03), exigido pelo backend. */
    nationalTaxCode?: string;
    /** Código IBGE do município padrão de prestação (7 dígitos). */
    serviceCityCode?: string;
    /** Alíquota do ISSQN em %, usada na estimativa de imposto. */
    issRate?: number;
    withholdingTax?: boolean;
}
