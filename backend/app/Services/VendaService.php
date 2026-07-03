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
            $custoTotal = $produto->custo_medio * $dados["quantiadade"];

            // Movimentação de estoque
            $movimentacao = MovimentacaoEstoque::create([
                "tenant_id" => $tenant_id,
                "produto_id" => $produto->id,
                "tipo_movimento" => "SAIDA",
                "quantiadade" => $dados["quantiadade"],
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
                "descricao" => "Venda" . $produto->nome,
                "valor_total" => $dados["valor_total"],
                "data_vencimento" => $dados["data_venda"],
                "status" => $status,
            ]);

            // Partição de débito e crédito
            $lancamento
                ->partidas()
                ->createMany([
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

            $lancamento
                ->partidas()
                ->createMany([
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
