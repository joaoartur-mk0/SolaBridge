<?php

namespace App\Services;

use App\Models\TituloFinanceiro;

class TituloFinanceiroService
{
    public function listarTitulos(array $filtros = [])
    {
        // Isolamento por tenant garantido pelo TenantScope global do model.
        $query = TituloFinanceiro::with(["customer", "supplier"]);

        if (!empty($filtros["tipo"])) {
            $query->where("tipo", strtoupper($filtros["tipo"]));
        }

        if (!empty($filtros["status"])) {
            $query->where("status", strtoupper($filtros["status"]));
        }

        // Filtro por faixa de data de vencimento.
        if (!empty($filtros["vencimento_inicio"])) {
            $query->whereDate(
                "data_vencimento",
                ">=",
                $filtros["vencimento_inicio"],
            );
        }
        if (!empty($filtros["vencimento_fim"])) {
            $query->whereDate(
                "data_vencimento",
                "<=",
                $filtros["vencimento_fim"],
            );
        }

        return $query->orderBy("data_vencimento")->paginate(15);
    }

    public function buscarTitulo(int $id)
    {
        // Detalhes + histórico contábil (lançamentos, partidas e contas).
        return TituloFinanceiro::with([
            "customer",
            "supplier",
            "lancamentos.partidas.conta",
        ])->findOrFail($id);
    }

    public function atualizarTitulo(int $id, array $dados)
    {
        $titulo = TituloFinanceiro::findOrFail($id);

        // Regra de negócio: se o pagamento acumulado atingir/ultrapassar o total
        // e o status não tiver sido informado explicitamente, o título é quitado.
        if (
            !array_key_exists("status", $dados) &&
            array_key_exists("valor_pago", $dados) &&
            $dados["valor_pago"] >= $titulo->valor_total
        ) {
            $dados["status"] = "PAGO";
        }

        $titulo->update($dados);
        return $titulo->fresh(["customer", "supplier"]);
    }
}
