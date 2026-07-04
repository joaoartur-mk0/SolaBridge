<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Database\Seeder;

class ContaSeeder extends Seeder
{
    public function run(): void
    {
        $empresaId = DB::table("companies")->insertGetId([
            "cnpj" => "00.000.000/0001-00",
            "razaosocial" => "Empresa de QA SolaBridge",
            "nomefantasia" => "QA SolaBridge",
            "email" => "qa@solabridge.com",
            "contato" => "999999999",
            "cep" => "00000-000",
            "created_at" => now(),
            "updated_at" => now(),
        ]);

        $contas = [
            [
                "company_id" => $empresaId,
                "codigo" => "1.1.01",
                "nome" => "Caixa",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "1.1.02",
                "nome" => "Bancos",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "1.1.03",
                "nome" => "Contas a Receber",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "1.1.04",
                "nome" => "Estoque",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ], // <-- A nossa 15ª conta!

            [
                "company_id" => $empresaId,
                "codigo" => "1.2.01",
                "nome" => "Veículos",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "1.2.02",
                "nome" => "Máquinas",
                "tipo" => "ATIVO",
                "natureza" => "D",
            ],

            [
                "company_id" => $empresaId,
                "codigo" => "2.1.01",
                "nome" => "Fornecedores",
                "tipo" => "PASSIVO",
                "natureza" => "C",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "2.1.02",
                "nome" => "Empréstimos",
                "tipo" => "PASSIVO",
                "natureza" => "C",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "2.1.03",
                "nome" => "Impostos a Pagar",
                "tipo" => "PASSIVO",
                "natureza" => "C",
            ],

            [
                "company_id" => $empresaId,
                "codigo" => "3.1.01",
                "nome" => "Capital Social",
                "tipo" => "PL",
                "natureza" => "C",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "3.1.02",
                "nome" => "Lucros Acumulados",
                "tipo" => "PL",
                "natureza" => "C",
            ],

            [
                "company_id" => $empresaId,
                "codigo" => "4.1.01",
                "nome" => "Receita de Vendas",
                "tipo" => "RECEITA",
                "natureza" => "C",
            ],

            [
                "company_id" => $empresaId,
                "codigo" => "5.1.01",
                "nome" => "CMV",
                "tipo" => "DESPESA",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "5.1.02",
                "nome" => "Despesas Operacionais",
                "tipo" => "DESPESA",
                "natureza" => "D",
            ],
            [
                "company_id" => $empresaId,
                "codigo" => "5.1.03",
                "nome" => "Despesas ADM",
                "tipo" => "DESPESA",
                "natureza" => "D",
            ],
        ];

        DB::table("contas")->insert($contas);
    }
}
