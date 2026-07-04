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

            // Partição de débito e crédito (receita)
            $lancamento->partidas()->createMany([
                [
                    "conta_id" => 1,
                    "valor" => $dados["valor_total"],
                    "natureza" => "D",
                ],
                [
                    "conta_id" => 4,
                    "valor" => $dados["valor_total"],
                    "natureza" => "C",
                ],
            ]);

            // Partição de débito e crédito (custo da mercadoria vendida)
            $lancamento->partidas()->createMany([
                [
                    "conta_id" => 5,
                    "valor" => $custoTotal,
                    "natureza" => "D",
                ],
                [
                    "conta_id" => 2,
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
}
