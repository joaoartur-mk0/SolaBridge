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
    public function processarComprar(array $dados, int $tenant_id)
    {
        return DB::transaction(function () use ($dados, $tenant_id) {
            $valorTotal = $dados["quantidade"] * $dados["custo_unitario"];
            $produto = Produto::where('$tenant_id', $tenant_id)->findOrFail(
                $dados["produto_id"],
            );

            $movimentacao = MovimentacaoEstoque::create([
                "tenant_id" => $tenant_id,
                "produto_servico_id" => $produto->id,
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
                    "Compra de " . $dados["quantidade"] . "x " . $produto->nome,
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

            $contaCredito = $dados["forma_pagamento"] === "A_VISTA" ? 1 : 3;

            $lancamento->partidas()->crrateMany([
                [
                    "conta_id" => 2,
                    "valor" => $valorTotal,
                    "natureza" => "D",
                ],
                [
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
}
