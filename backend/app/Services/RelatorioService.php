<?php

namespace App\Services;
use App\Models\Partida;
use App\Models\Conta;

class RelatorioService
{
    public function gerarDRE($dataInicio = null, $dataFim = null)
    {
        $queryBase = Partida::with(["conta", "lancamento"]);
        if ($dataInicio && $dataFim) {
            $queryBase->whereHas("lancamento", function ($q) use (
                $dataInicio,
                $dataFim,
            ) {
                $q->whereBetween("date", [$dataInicio, $dataFim]);
            });
        }

        $queryReceitas = clone $queryBase;
        $queryDespesas = clone $queryBase;

        $totalReceitas = $queryReceitas
            ->whereHas("conta", function ($q) {
                $q->where("tipo", "RECEITA");
            })
            ->where("natureza", "C")
            ->sum("valor");

        $totalDespesas = $queryDespesas
            ->whereHas("conta", function ($q) {
                $q->whereIn("tipo", ["DESPESA", "DEPESA"]);
            })
            ->where("natureza", "D")
            ->sum("valor");

        $resultadoLiquido = $totalReceitas - $totalDespesas;

        return [
            "total_receitas" => $totalReceitas,
            "total_despesas" => $totalDespesas,
            "resultado_liquido" => $resultadoLiquido,
            "status" => $resultadoLiquido >= 0 ? "Lucro" : "Prejuizo",
        ];
    }

    public function gerarBalancoPatrimonial()
    {
        $ativosDebitos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "ATIVO");
        })
            ->where("natureza", "D")
            ->sum("valor");
        $ativosCreditos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "ATIVO");
        })
            ->where("natureza", "C")
            ->sum("valor");
        $totalAtivo = $ativosDebitos - $ativosCreditos;

        $passivosDebitos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PASSIVO");
        })
            ->where("natureza", "D")
            ->sum("valor");
        $passivosCreditos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PASSIVO");
        })
            ->where("natureza", "C")
            ->sum("valor");
        $totalPassivo = $passivosCreditos - $passivosDebitos;

        $plDebitos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PL");
        })
            ->where("natureza", "D")
            ->sum("valor");
        $plCreditos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PL");
        })
            ->where("natureza", "C")
            ->sum("valor");
        $plBase = $plCreditos - $plDebitos;

        $dre = $this->gerarDRE();
        $totalPL = $plBase + $dre["resultado_liquido"];

        return [
            "ativo" => $totalAtivo,
            "passivo" => $totalPassivo,
            "patrimonio_liquido" => $totalPL,
            "equacao_valida" =>
                abs($totalAtivo - ($totalPassivo + $totalPL)) < 0.01,
        ];
    }

    public function gerarExtratoRazao(
        $contaId,
        $dataInicio = null,
        $dataFim = null,
    ) {
        $conta = Conta::findOrFail($contaId);
        $naturezaConta = strtoupper($conta->natureza);

        $query = Partida::with("lancamento")->where("conta_id", $contaId);

        if ($dataInicio && $dataFim) {
            $query->whereHas("lancamento", function ($q) use (
                $dataInicio,
                $dataFim,
            ) {
                $q->whereBetween("date", [$dataInicio, $dataFim]);
            });
        }

        $partidas = $query->get()->sortBy(function ($partida) {
            return $partida->lancamento->date;
        });

        $saldoAcumulado = 0;
        $historico = [];

        foreach ($partidas as $partida) {
            $valor = $partida->valor;
            $naturezaPartida = strtoupper($partida->natureza);

            if ($naturezaConta === "D") {
                $saldoAcumulado += $naturezaPartida === "D" ? $valor : -$valor;
            } else {
                $saldoAcumulado += $naturezaPartida === "C" ? $valor : -$valor;
            }

            $historico[] = [
                "data" => $partida->lancamento->date,
                "historico" => $partida->lancamento->description,
                "debito" => $naturezaPartida === "D" ? $valor : 0,
                "credito" => $naturezaPartida === "C" ? $valor : 0,
                "saldo_acumulado" => $saldoAcumulado,
            ];
        }

        return [
            "codigo_conta" => $conta->codigo,
            "nome_conta" => $conta->nome,
            "natureza" => $naturezaConta,
            "saldo_atual" => $saldoAcumulado,
            "movimentacoes" => array_values($historico),
        ];
    }

    public function calcularLiquidezCorrente()
    {
        $ativosCirculantesDebitos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "ATIVO")->where("codigo", "like", "1.1.%");
        })
            ->where("natureza", "D")
            ->sum("valor");
        $ativosCirculantesCreditos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "ATIVO")->where("codigo", "like", "1.1.%");
        })
            ->where("natureza", "C")
            ->sum("valor");
        $totalAtivosCirculantes =
            $ativosCirculantesDebitos - $ativosCirculantesCreditos;

        $passivoCirculantesDebitos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PASSIVO")->where("codigo", "like", "2.1.%");
        })
            ->where("natureza", "D")
            ->sum("valor");
        $passivoCirculantesCreditos = Partida::whereHas("conta", function ($q) {
            $q->where("tipo", "PASSIVO")->where("codigo", "like", "2.1.%");
        })
            ->where("natureza", "C")
            ->sum("valor");
        $passivoAtivosCirculantes =
            $passivoCirculantesDebitos - $passivoCirculantesCreditos;

        $indice = 0;
        if ($passivoAtivosCirculantes > 0) {
            $indice = $totalAtivosCirculantes / $passivoAtivosCirculantes;
        }

        return [
            "ativo_circulante" => $totalAtivosCirculantes,
            "passivo_circulante" => $passivoAtivosCirculantes,
            "indice_liquidez_corrente" => round($indice, 2),
            "status" =>
                $indice >= 1
                    ? "Saudável (Capacidade de pagar dívidas)"
                    : "Atenção (Risco de falta de liquidez)",
        ];
    }

    public function obterSaldoCaixaBancos()
    {
        $totalEntradas = Partida::whereHas("conta", function ($q) {
            $q->whereIn("nome", ["Caixa", "Bancos"]);
        })
            ->where("natureza", "D")
            ->sum("valor");

        $totalSaidas = Partida::whereHas("conta", function ($q) {
            $q->whereIn("nome", ["Caixa", "Bancos"]);
        })
            ->where("natureza", "C")
            ->sum("valor");

        $saldoConsolidado = $totalEntradas - $totalSaidas;

        return [
            "contas_consolidadas" => ["Caixa", "Bancos"],
            "total_entradas" => $totalEntradas,
            "total_saídas" => $totalSaidas,
            "saldo_atual" => $saldoConsolidado,
            "status" => $saldoConsolidado >= 0 ? "Positivo" : "Negativo",
        ];
    }
}
