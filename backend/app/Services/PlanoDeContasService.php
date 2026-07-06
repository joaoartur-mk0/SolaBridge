<?php

namespace App\Services;

use App\Models\Conta;

class PlanoDeContasService
{
    // Códigos padrão do plano de contas, usados pelos lançamentos automáticos
    // de compra e venda. São únicos por tenant (unique tenant_id + codigo).
    public const CAIXA = "1.1.01";
    public const BANCOS = "1.1.02";
    public const CLIENTES = "1.1.03";
    public const ESTOQUE = "1.1.04";
    public const FORNECEDORES = "2.1.01";
    public const CAPITAL_SOCIAL = "3.1.01";
    public const RECEITA_VENDAS = "4.1.01";
    public const CMV = "5.1.01";

    public function criarPlanoPadrao(int $tenant_id): void
    {
        $contas = [
            [self::CAIXA, "Caixa", "ATIVO", "D"],
            [self::BANCOS, "Bancos", "ATIVO", "D"],
            [self::CLIENTES, "Clientes a Receber", "ATIVO", "D"],
            [self::ESTOQUE, "Estoque de Mercadorias", "ATIVO", "D"],
            [self::FORNECEDORES, "Fornecedores", "PASSIVO", "C"],
            [self::CAPITAL_SOCIAL, "Capital Social", "PL", "C"],
            [self::RECEITA_VENDAS, "Receita de Vendas", "RECEITA", "C"],
            [self::CMV, "Custo da Mercadoria Vendida", "DESPESA", "D"],
        ];

        foreach ($contas as $conta) {
            Conta::create([
                "tenant_id" => $tenant_id,
                "codigo" => $conta[0],
                "nome" => $conta[1],
                "tipo" => $conta[2],
                "natureza" => $conta[3],
            ]);
        }
    }

    public function resolverId(string $codigo, int $tenant_id): int
    {
        return Conta::where("tenant_id", $tenant_id)
            ->where("codigo", $codigo)
            ->firstOrFail()->id;
    }
}
