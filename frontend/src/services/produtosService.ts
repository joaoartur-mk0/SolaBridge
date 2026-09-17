import { apiFetch } from "./apiClient";
import type { Product, ProductUnit } from "../types/product";

type BackendProduto = {
  id: number;
  descricao: string;
  codigo_sku: string | null;
  unidade: ProductUnit;
  preco_venda: string | number;
  custo_medio: string | number;
  ncm: string | null;
  cfop: string | null;
  cest: string | null;
};

// Laravel paginator (Produto::query()->paginate(15)) serializado como JSON.
type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// ProdutoService::registrarProduto retorna ["produto" => $produto].
type CreateProdutoResponse = {
  produto: BackendProduto;
};

export type ListProdutosParams = {
  search?: string;
};

export type ProductInput = {
  description: string;
  salePrice: number;
  averageCost: number;
  unit: ProductUnit;
  sku?: string;
  ncm?: string;
  cfop?: string;
  cest?: string;
};

function mapBackendProduto(raw: BackendProduto): Product {
  return {
    id: String(raw.id),
    description: raw.descricao,
    sku: raw.codigo_sku ?? undefined,
    unit: raw.unidade,
    salePrice: Number(raw.preco_venda),
    averageCost: Number(raw.custo_medio),
    ncm: raw.ncm ?? undefined,
    cfop: raw.cfop ?? undefined,
    cest: raw.cest ?? undefined,
  };
}

/**
 * Lista produtos do tenant.
 * Depende do endpoint `GET /produtos` (tarefa B1 do backend — ver docs/MODULO_ESTOQUE.md).
 * Enquanto o back não expõe o index, esta chamada retorna 404/erro e as telas
 * tratam isso mostrando um aviso.
 */
export async function listProdutos(
  params: ListProdutosParams = {}
): Promise<Product[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  const queryString = query.toString();
  const path = queryString ? `/produtos?${queryString}` : "/produtos";

  const result = await apiFetch<PaginatedResponse<BackendProduto>>(path);

  return result.data.map(mapBackendProduto);
}

// `POST /produtos` já existe hoje no backend.
export async function createProduto(input: ProductInput): Promise<Product> {
  const result = await apiFetch<CreateProdutoResponse>("/produtos", {
    method: "POST",
    body: {
      descricao: input.description,
      preco_venda: input.salePrice,
      custo_medio: input.averageCost,
      unidade: input.unit,
      codigo_sku: input.sku || undefined,
      ncm: input.ncm || undefined,
      cfop: input.cfop || undefined,
      cest: input.cest || undefined,
    },
  });

  return mapBackendProduto(result.produto);
}
