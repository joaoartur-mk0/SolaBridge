export  interface Invoice {
    id: string;
    customerId: string;
    serviceId: string;
    issueDate: string;
    amount: number;
    status: "Emitida" | "Pendente" | "Cancelada" | "Rejeitada";
}