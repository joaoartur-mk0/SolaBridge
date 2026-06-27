export interface FinanceEntry {
    id: string;
    description: string;
    category: string;
    type: "Receita" | "Despesa";
    value: number;
    date: string;
    paid: boolean;
}