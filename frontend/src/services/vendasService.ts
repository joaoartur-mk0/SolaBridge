import { apiFetch } from "./apiClient";
import type { PaymentMethod } from "./comprasService";

export type CreateVendaInput = {
  productId: string;
  customerId: string;
  quantity: number;
  /** Valor total da venda (não é unitário — o back recebe o total). */
  totalAmount: number;
  paymentMethod: PaymentMethod;
  /** Data da venda no formato yyyy-mm-dd. */
  saleDate: string;
};

// VendaService::processarVenda retorna ["titulo", "movimentacao", "lancamento"].
type VendaResult = {
  titulo: { id: number; valor_total: string | number; status: string };
  movimentacao: { id: number; quantidade: string | number };
  lancamento: { id: number };
};

export type VendaSummary = {
  tituloId: string;
  lancamentoId: string;
  total: number;
  status: string;
};

/** Registra uma venda (saída de estoque + título a receber + receita e CMV). */
export async function createVenda(
  input: CreateVendaInput
): Promise<VendaSummary> {
  const result = await apiFetch<VendaResult>("/vendas", {
    method: "POST",
    body: {
      produto_id: Number(input.productId),
      customer_id: Number(input.customerId),
      quantidade: input.quantity,
      valor_total: input.totalAmount,
      forma_pagamento: input.paymentMethod,
      data_venda: input.saleDate,
    },
  });

  return {
    tituloId: String(result.titulo.id),
    lancamentoId: String(result.lancamento.id),
    total: Number(result.titulo.valor_total),
    status: result.titulo.status,
  };
}
