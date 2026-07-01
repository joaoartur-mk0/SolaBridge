import type { FinanceType } from "./common";
import type { FinanceCategory,PaymentStatus } from "./common";
import type { FinanceId } from "./ids";
import type { Money } from "./money";
import type { ISODate } from "./date";

export interface FinanceEntry {
    id: FinanceId;
    description: string;
    category: FinanceCategory;
    type: FinanceType;
    value: Money;
    date: ISODate;
    status: PaymentStatus;
}