<?php

namespace App\Services;

use App\Models\Produto;
use App\Models\MovimentacaoEstoque;
use App\Models\TituloFinanceiro;
use App\Models\Lancamento;
use Illuminate\Support\Facades\DB;
use Exception;

class VendaService
{
    protected $planoDeContasService;

    public function __construct(PlanoDeContasService $planoDeContasService)
    {
        $this->planoDeContasService = $planoDeContasService;
    }

    public function processarVenda(array $dados, int $tenant_id)
    {
        return DB::transaction(function () use ($dados, $tenant_id) {
            $produto = Produto::where("tenant_id", $tenant_id)->findOrFail(
                $dados["produto_id"],
            );
            $custoTotal = $produto->custo_medio * $dados["quantidade"];

            // Movimentação de estoque
            $movimentacao = MovimentacaoEstoque::create([
                "tenant_id" => $tenant_id,
                "produto_id" => $produto->id,
                "tipo_movimento" => "SAIDA",
                "quantidade" => $dados["quantidade"],
                "custo_unitario" => $produto->custo_medio,
                "observacao" => "Venda de mercadoria",
            ]);

            // Adiciona no modulo financeiro
            $status =
                $dados["forma_pagamento"] === "A_VISTA" ? "PAGO" : "PENDENTE";
            $titulo = TituloFinanceiro::create([
                "tenant_id" => $tenant_id,
                "customer_id" => $dados["customer_id"],
                "tipo" => "RECEBER",
                "descricao" => "Venda de " . $produto->descricao,
                "valor_total" => $dados["valor_total"],
                "data_vencimento" => $dados["data_venda"],
                "status" => $status,
            ]);

            $lancamento = Lancamento::create([
                "tenant_id" => $tenant_id,
                "customer_id" => $dados["customer_id"],
                "titulo_id" => $titulo->id,
                "description" => "Venda N." . $titulo->id,
                "date" => $dados["data_venda"],
            ]);

            $movimentacao->update(["lancamento_id" => $lancamento->id]);

            $contaRecebimento =
                $dados["forma_pagamento"] === "A_VISTA"
                    ? $this->planoDeContasService->resolverId(
                        PlanoDeContasService::CAIXA,
                        $tenant_id,
                    )
                    : $this->planoDeContasService->resolverId(
                        PlanoDeContasService::CLIENTES,
                        $tenant_id,
                    );
            $contaReceita = $this->planoDeContasService->resolverId(
                PlanoDeContasService::RECEITA_VENDAS,
                $tenant_id,
            );
            $contaCmv = $this->planoDeContasService->resolverId(
                PlanoDeContasService::CMV,
                $tenant_id,
            );
            $contaEstoque = $this->planoDeContasService->resolverId(
                PlanoDeContasService::ESTOQUE,
                $tenant_id,
            );

            // Partição de débito e crédito (receita)
            $lancamento->partidas()->createMany([
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaRecebimento,
                    "valor" => $dados["valor_total"],
                    "natureza" => "D",
                ],
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaReceita,
                    "valor" => $dados["valor_total"],
                    "natureza" => "C",
                ],
            ]);

            // Partição de débito e crédito (custo da mercadoria vendida)
            $lancamento->partidas()->createMany([
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaCmv,
                    "valor" => $custoTotal,
                    "natureza" => "D",
                ],
                [
                    "tenant_id" => $tenant_id,
                    "conta_id" => $contaEstoque,
                    "valor" => $custoTotal,
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

    public function listarVendas(?string $status = null)
    {
        $query = TituloFinanceiro::where("tipo", "RECEBER")->with("customer");
        if ($status) {
            $query->where("status", strtoupper($status));
        }
        return $query->orderByDesc("data_vencimento")->paginate(15);
    }

    public function buscarVenda(int $id)
    {
        return TituloFinanceiro::where("tipo", "RECEBER")
            ->with([
                "customer",
                "lancamentos.partidas.conta",
                "lancamentos.movimentacoes",
            ])
            ->findOrFail($id);
    }

    public function cancelarVenda(int $id, int $tenant_id)
    {
        return DB::transaction(function () use ($id, $tenant_id) {
            $titulo = TituloFinanceiro::where("tipo", "RECEBER")
                ->with(["lancamentos.partidas", "lancamentos.movimentacoes"])
                ->findOrFail($id);

            if ($titulo->status === "CANCELADO") {
                throw new Exception("Esta venda já está cancelada.");
            }

            foreach ($titulo->lancamentos as $lancamento) {
                $estorno = Lancamento::create([
                    "tenant_id" => $tenant_id,
                    "customer_id" => $lancamento->customer_id,
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

    public function apagarVenda(int $id)
    {
        return DB::transaction(function () use ($id) {
            $titulo = TituloFinanceiro::where("tipo", "RECEBER")
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
