import type { ServiceId } from "./ids";
import type { Money } from "./money";

export interface Service {
    id: ServiceId;
    name: string;
    description: string;
    price: Money;
}