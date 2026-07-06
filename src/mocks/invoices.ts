import type { Invoice } from "../types/invoice";

export const invoices: Invoice[] = [
    {
        id: "INV-001",
        customerId: "CUS-001",
        serviceId: "SER-001",
        issueDate: "2026-06-20",
        amount: 3500,
        status: "Emitida"
    },
    {
        id: "INV-002",
        customerId: "CUS-002",
        serviceId: "SER-002",
        issueDate: "2026-06-25",
        amount: 1200,
        status: "Pendente"
    },
    {
        id: "INV-003",
        customerId: "CUS-001",
        serviceId: "SER-002",
        issueDate: "2026-07-01",
        amount: 1200,
        status: "Cancelada"
    },
    {
        id: "INV-004",
        customerId: "CUS-002",
        serviceId: "SER-001",
        issueDate: "2026-07-03",
        amount: 3500,
        status: "Rejeitada"
    }
];
