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

// Finance
export type FinanceType = 
    | "Receita" 
    | "Despesa";                        
export type FinanceCategory = 
    | "Serviços"
    | "Impostos" 
    | "Salários"  
    | "Infraestrutura"
    | "Marketing" 
    | "Outros"; 
export type PaymentStatus =
    | "Pago"
    | "Pendente"
    | "Atrasado";