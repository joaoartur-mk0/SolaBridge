<?php

namespace App\Services;

use App\Models\Produto;
use App\Models\MovimentacaoEstoque;
use App\Models\TituloFinanceiro;
use App\Models\Lancamento;
use Illuminate\Support\Facades\DB;
use Exception;

class CompraService
{
    protected $planoDeContasService;

    public function __construct(PlanoDeContasService $planoDeContasService)
    {
        $this->planoDeContasService = $planoDeContasService;
    }

    public function processarCompra(array $dados, int $tenant_id)
    {
        return DB::transaction(function () use ($dados, $tenant_id) {
            $valorTotal = $dados["quantidade"] * $dados["custo_unitario"];
            $produto = Produto::where("tenant_id", $tenant_id)->findOrFail(
                $dados["produto_id"],
            );

            $movimentacao = MovimentacaoEstoque::create([
                "tenant_id" => $tenant_id,
                "produto_id" => $produto->id,
                "tipo_movimento" => "ENTRADA",
                "quantidade" => $dados["quantidade"],
                "custo_unitario" => $dados["custo_unitario"],
                "observacao" => "Compra de fornecedor",
            ]);

            $produto->update(["custo_medio" => $dados["custo_unitario"]]);

            $status =
                $dados["forma_pagamento"] === "A_VISTA" ? "PAGO" : "PENDENTE";

            $titulo = TituloFinanceiro::create([
                "tenant_id" => $tenant_id,
                "supplier_id" => $dados["supplier_id"],
                "tipo" => "PAGAR",
                "descricao" =>
                    "Compra de " .
                    $dados["quantidade"] .
                    "x " .
                    $produto->descricao,
                "valor_total" => $valorTotal,
                "data_vencimento" => $dados["data_compra"],
                "status" => $status,
            ]);

            $lancamento = Lancamento::create([
                "tenant_id" => $tenant_id,
                "supplier_id" => $dados["supplier_id"],
                "titulo_id" => $titulo->id,
                "description" => "Ativo - Compra N." . $titulo->id,
                "date" => $dados["data_compra"],
            ]);

            $movimentacao->update(["lancamento_id" => $lancamento->id]);

            $contaEstoque = $this->planoDeContasService->resolverId(
                PlanoDeContasService::ESTOQUE,
                $tenant_id,
            );
            $contaCredito =
                $dados["forma_pagamento"] === "A_VISTA"
                    ? $this->planoDeContasService->resolverId(
                        PlanoDeContasService::CAIXA,
                        $tenant_id,
                    )
                    : $this->planoDeContasService->resolverId(
                        PlanoDeContasService::FORNECEDORES,
                        $tenant_id,
                    );

            $lancamento->partidas()->createMany([
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaEstoque,
                    "valor" => $valorTotal,
                    "natureza" => "D",
                ],
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaCredito,
                    "valor" => $valorTotal,
                    "natureza" => "C",
                ],
            ]);

            return [
                "titulo" => $titulo,
                "movimentacao" => $movimentacao,
                "lancamento" => $lancamento,
            ];
        });
    }

    public function listarCompras(?string $status = null)
    {
        $query = TituloFinanceiro::where("tipo", "PAGAR")->with("supplier");
        if ($status) {
            $query->where("status", strtoupper($status));
        }
        return $query->orderByDesc("data_vencimento")->paginate(15);
    }

    public function buscarCompra(int $id)
    {
        return TituloFinanceiro::where("tipo", "PAGAR")
            ->with([
                "supplier",
                "lancamentos.partidas.conta",
                "lancamentos.movimentacoes",
            ])
            ->findOrFail($id);
    }

    public function cancelarCompra(int $id, int $tenant_id)
    {
        return DB::transaction(function () use ($id, $tenant_id) {
            $titulo = TituloFinanceiro::where("tipo", "PAGAR")
                ->with(["lancamentos.partidas", "lancamentos.movimentacoes"])
                ->findOrFail($id);

            if ($titulo->status === "CANCELADO") {
                throw new Exception("Esta compra já está cancelada.");
            }

            foreach ($titulo->lancamentos as $lancamento) {
                $estorno = Lancamento::create([
                    "tenant_id" => $tenant_id,
                    "supplier_id" => $lancamento->supplier_id,
                    "titulo_id" => $titulo->id,
                    "description" => "Estorno - " . $lancamento->description,
                    "date" => now()->toDateString(),
                ]);

                foreach ($lancamento->partidas as $partida) {
                    $estorno->partidas()->create([
                        "tenant_id" => $tenant_id,
                        "conta_id" => $partida->conta_id,
                        "produto_id" => $partida->produto_id,
                        "servico_id" => $partida->servico_id,
                        "valor" => $partida->valor,
                        "natureza" => $partida->natureza === "D" ? "C" : "D",
                    ]);
                }

                foreach ($lancamento->movimentacoes as $mov) {
                    MovimentacaoEstoque::create([
                        "tenant_id" => $tenant_id,
                        "produto_id" => $mov->produto_id,
                        "lancamento_id" => $estorno->id,
                        "tipo_movimento" =>
                            $mov->tipo_movimento === "ENTRADA"
                                ? "SAIDA"
                                : "ENTRADA",
                        "quantidade" => $mov->quantidade,
                        "custo_unitario" => $mov->custo_unitario,
                        "observacao" => "Estorno de cancelamento",
                    ]);
                }
            }

            $titulo->update(["status" => "CANCELADO"]);

            return $titulo->fresh(["lancamentos.partidas"]);
        });
    }

    public function apagarCompra(int $id)
    {
        return DB::transaction(function () use ($id) {
            $titulo = TituloFinanceiro::where("tipo", "PAGAR")
                ->with("lancamentos")
                ->findOrFail($id);

            foreach ($titulo->lancamentos as $lancamento) {
                MovimentacaoEstoque::where(
                    "lancamento_id",
                    $lancamento->id,
                )->delete();
                $lancamento->delete();
            }

            $titulo->delete();

            return true;
        });
    }
}
