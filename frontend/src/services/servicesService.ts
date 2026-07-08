import { apiFetch } from "./apiClient";
import type { Service } from "../types/service";

type BackendServico = {
  id: number;
  nome: string;
  descricao: string;
  valor_servico: string | number;
  codigo: string;
  codigo_tributacao_nacional: string | null;
  codigo_ibge_municipio: string | null;
  aliquota_iss: string | number | null;
  retencao_fonte: boolean;
};

// Laravel paginator (Servico::query()->paginate(15)) serializado como JSON.
type PaginatedResponse<T> = {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

// ServicoService::registrarServico retorna ["servico" => $servico].
type CreateServicoResponse = {
  servico: BackendServico;
};

export type ListServicesParams = {
  search?: string;
};

export type ServiceInput = {
  name: string;
  description: string;
  price: number;
  code: string;
  nationalTaxCode: string;
  serviceCityCode: string;
  issRate?: number;
  withholdingTax?: boolean;
};

function mapBackendService(raw: BackendServico): Service {
  return {
    id: String(raw.id),
    name: raw.nome,
    description: raw.descricao,
    price: Number(raw.valor_servico),
    code: raw.codigo,
    nationalTaxCode: raw.codigo_tributacao_nacional ?? undefined,
    serviceCityCode: raw.codigo_ibge_municipio ?? undefined,
    issRate: raw.aliquota_iss !== null && raw.aliquota_iss !== undefined
      ? Number(raw.aliquota_iss)
      : undefined,
    withholdingTax: raw.retencao_fonte,
  };
}

export async function listServices(
  params: ListServicesParams = {}
): Promise<Service[]> {
  const query = new URLSearchParams();

  if (params.search) {
    query.set("search", params.search);
  }

  const queryString = query.toString();
  const path = queryString ? `/servicos?${queryString}` : "/servicos";

  const result = await apiFetch<PaginatedResponse<BackendServico>>(path);

  return result.data.map(mapBackendService);
}

export async function createService(input: ServiceInput): Promise<Service> {
  const result = await apiFetch<CreateServicoResponse>("/servicos", {
    method: "POST",
    body: {
      nome: input.name,
      descricao: input.description,
      valor_servico: input.price,
      codigo: input.code,
      codigo_tributacao_nacional: input.nationalTaxCode,
      codigo_ibge_municipio: input.serviceCityCode,
      aliquota_iss: input.issRate,
      retencao_fonte: input.withholdingTax ?? false,
    },
  });

  return mapBackendService(result.servico);
}

export async function updateService(
  id: string,
  input: Partial<ServiceInput>
): Promise<Service> {
  const body: Record<string, unknown> = {};

  if (input.name !== undefined) body.nome = input.name;
  if (input.description !== undefined) body.descricao = input.description;
  if (input.price !== undefined) body.valor_servico = input.price;
  if (input.code !== undefined) body.codigo = input.code;
  if (input.nationalTaxCode !== undefined) body.codigo_tributacao_nacional = input.nationalTaxCode;
  if (input.serviceCityCode !== undefined) body.codigo_ibge_municipio = input.serviceCityCode;
  if (input.issRate !== undefined) body.aliquota_iss = input.issRate;
  if (input.withholdingTax !== undefined) body.retencao_fonte = input.withholdingTax;

  const result = await apiFetch<BackendServico>(`/servicos/${id}`, {
    method: "PATCH",
    body,
  });

  return mapBackendService(result);
}

export async function deleteService(id: string): Promise<void> {
  await apiFetch<void>(`/servicos/${id}`, { method: "DELETE" });
}
