import type { JournalEntry } from "../types/ledger";

export const journalEntries: JournalEntry[] = [
    {
        id: "LC-001",
        description: "Integralização de capital social",
        date: "2026-01-05",
        partidas: [
            { accountId: "CTA-1101", valor: 20000, natureza: "D" },
            { accountId: "CTA-3101", valor: 20000, natureza: "C" },
        ],
    },
    {
        id: "LC-002",
        description: "Compra de mercadorias a prazo",
        date: "2026-01-10",
        partidas: [
            { accountId: "CTA-1104", valor: 6000, natureza: "D" },
            { accountId: "CTA-2101", valor: 6000, natureza: "C" },
        ],
    },
    {
        id: "LC-003",
        description: "Venda de serviço à vista",
        date: "2026-01-15",
        partidas: [
            { accountId: "CTA-1101", valor: 3500, natureza: "D" },
            { accountId: "CTA-4101", valor: 3500, natureza: "C" },
        ],
    },
    {
        id: "LC-004",
        description: "Venda de mercadoria a prazo",
        date: "2026-01-18",
        partidas: [
            { accountId: "CTA-1103", valor: 4200, natureza: "D" },
            { accountId: "CTA-4101", valor: 4200, natureza: "C" },
        ],
    },
    {
        id: "LC-005",
        description: "Baixa do custo da mercadoria vendida",
        date: "2026-01-18",
        partidas: [
            { accountId: "CTA-5101", valor: 2500, natureza: "D" },
            { accountId: "CTA-1104", valor: 2500, natureza: "C" },
        ],
    },
    {
        id: "LC-006",
        description: "Recebimento de cliente",
        date: "2026-01-25",
        partidas: [
            { accountId: "CTA-1102", valor: 4200, natureza: "D" },
            { accountId: "CTA-1103", valor: 4200, natureza: "C" },
        ],
    },
    {
        id: "LC-007",
        description: "Pagamento parcial a fornecedor",
        date: "2026-01-28",
        partidas: [
            { accountId: "CTA-2101", valor: 3000, natureza: "D" },
            { accountId: "CTA-1102", valor: 3000, natureza: "C" },
        ],
    },
    {
        id: "LC-008",
        description: "Aquisição de móveis financiada a longo prazo",
        date: "2026-02-02",
        partidas: [
            { accountId: "CTA-1201", valor: 5000, natureza: "D" },
            { accountId: "CTA-2201", valor: 5000, natureza: "C" },
        ],
    },
];
