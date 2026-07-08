import type { InvoiceStatus } from "../types/common";

export function mapInvoiceStatus(status: InvoiceStatus) {
  switch (status) {
    case "Emitida":
      return "issued" as const;
    case "Cancelada":
      return "cancelled" as const;
    case "Rascunho":
      return "draft" as const;
    case "Contingência":
      return "contingency" as const;
  }
}
