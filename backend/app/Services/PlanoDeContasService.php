<?php

namespace App\Services;

use App\Models\Conta;

class PlanoDeContasService
{
    // Códigos padrão do plano de contas, usados pelos lançamentos automáticos
    // de compra e venda. São únicos por tenant (unique tenant_id + codigo).
    // Obs.: CLIENTES aponta para "Contas a Receber" (1.1.03) e ESTOQUE (1.1.04)
    // é mantido por necessidade técnica dos lançamentos de compra/venda (ver nota
    // no relatório de mudanças) — as demais contas seguem exatamente a tabela padrão.
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
            // ATIVO
            [self::CAIXA, "Caixa", "ATIVO", "D"],
            [self::BANCOS, "Bancos", "ATIVO", "D"],
            [self::CLIENTES, "Contas a Receber", "ATIVO", "D"],
            // Conta de estoque exigida pelos lançamentos de compra/venda (CMV).
            [self::ESTOQUE, "Estoque de Mercadorias", "ATIVO", "D"],
            ["1.2.01", "Veículos", "ATIVO", "D"],
            ["1.2.02", "Máquinas", "ATIVO", "D"],
            // PASSIVO
            [self::FORNECEDORES, "Fornecedores", "PASSIVO", "C"],
            ["2.1.02", "Empréstimos", "PASSIVO", "C"],
            ["2.1.03", "Impostos a Pagar", "PASSIVO", "C"],
            // PATRIMÔNIO LÍQUIDO
            [self::CAPITAL_SOCIAL, "Capital Social", "PL", "C"],
            ["3.1.02", "Lucros Acumulados", "PL", "C"],
            // RECEITA
            [self::RECEITA_VENDAS, "Receita de Vendas", "RECEITA", "C"],
            // DESPESA
            [self::CMV, "CMV", "DESPESA", "D"],
            ["5.1.02", "Despesas Operacionais", "DESPESA", "D"],
            ["5.1.03", "Despesas Adm", "DESPESA", "D"],
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
