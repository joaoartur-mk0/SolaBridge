// Invoice
export type InvoiceStatus =
    | "Emitida"
    | "Cancelada"
    | "Rascunho"
    | "Contingência";

// Customers
export type CustomerType = 
    | "Pessoa Física" 
    | "Pessoa Jurídica";

// Plano de contas / Lançamentos contábeis
export type AccountType =
    | "ATIVO"
    | "PASSIVO"
    | "PL"
    | "RECEITA"
    | "DESPESA";

export type EntryNature = "D" | "C";