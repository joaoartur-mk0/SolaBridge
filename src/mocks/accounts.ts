import type { Account } from "../types/account";

export const accounts: Account[] = [
    { id: "CTA-1101", codigo: "1.1.01", nome: "Caixa", tipo: "ATIVO", natureza: "D" },
    { id: "CTA-1102", codigo: "1.1.02", nome: "Bancos", tipo: "ATIVO", natureza: "D" },
    { id: "CTA-1103", codigo: "1.1.03", nome: "Clientes a Receber", tipo: "ATIVO", natureza: "D" },
    { id: "CTA-1104", codigo: "1.1.04", nome: "Estoque de Materiais de Consumo", tipo: "ATIVO", natureza: "D" },
    { id: "CTA-1201", codigo: "1.2.01", nome: "Móveis e Utensílios", tipo: "ATIVO", natureza: "D" },
    { id: "CTA-2101", codigo: "2.1.01", nome: "Fornecedores", tipo: "PASSIVO", natureza: "C" },
    { id: "CTA-2201", codigo: "2.2.01", nome: "Empréstimos de Longo Prazo", tipo: "PASSIVO", natureza: "C" },
    { id: "CTA-3101", codigo: "3.1.01", nome: "Capital Social", tipo: "PL", natureza: "C" },
    { id: "CTA-4101", codigo: "4.1.01", nome: "Receita de Serviços Prestados", tipo: "RECEITA", natureza: "C" },
    { id: "CTA-5101", codigo: "5.1.01", nome: "Custo dos Serviços Prestados", tipo: "DESPESA", natureza: "D" },
];
