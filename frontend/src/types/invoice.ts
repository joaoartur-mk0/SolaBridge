import type { InvoiceStatus } from "./common";
import type { InvoiceId, ServiceId, CustomerId } from "./ids";
import type { Money } from "./money";
import type { ISODate } from "./date";

export interface Invoice {
    id:InvoiceId;
    customerId: CustomerId;
    serviceId: ServiceId;
    issueDate: ISODate;
    amount: Money;
    status: InvoiceStatus; 
}