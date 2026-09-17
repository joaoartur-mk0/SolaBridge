import { apiFetch } from "./apiClient";

export type PaymentMethod = "A_VISTA" | "PRAZO";

export type CreateCompraInput = {
  supplierId: string;
  productId: string;
  quantity: number;
  unitCost: number;
  paymentMethod: PaymentMethod;
  /** Data da compra no formato yyyy-mm-dd. */
  purchaseDate: string;
};

// CompraService::processarCompra retorna ["titulo", "movimentacao", "lancamento"].
type CompraResult = {
  titulo: { id: number; valor_total: string | number; status: string };
  movimentacao: { id: number; quantidade: string | number };
  lancamento: { id: number };
};

export type CompraSummary = {
  tituloId: string;
  lancamentoId: string;
  total: number;
  status: string;
};

/** Registra uma compra (entrada de estoque + título a pagar + lançamento contábil). */
export async function createCompra(
  input: CreateCompraInput
): Promise<CompraSummary> {
  const result = await apiFetch<CompraResult>("/compras", {
    method: "POST",
    body: {
      supplier_id: Number(input.supplierId),
      produto_id: Number(input.productId),
      quantidade: input.quantity,
      custo_unitario: input.unitCost,
      forma_pagamento: input.paymentMethod,
      data_compra: input.purchaseDate,
    },
  });

  return {
    tituloId: String(result.titulo.id),
    lancamentoId: String(result.lancamento.id),
    total: Number(result.titulo.valor_total),
    status: result.titulo.status,
  };
}
