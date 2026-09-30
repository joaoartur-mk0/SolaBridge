<?php

namespace Tests\Feature;

use App\Models\Supplier;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CriaTenants;
use Tests\TestCase;

class IsolamentoTenantTest extends TestCase
{
    use CriaTenants, RefreshDatabase;

    private function lancamento(int $debito, int $credito): array
    {
        return [
            "description" => "Aporte",
            "date" => "2026-01-01",
            "partidas" => [
                ["conta_id" => $debito, "valor" => 10, "natureza" => "D"],
                ["conta_id" => $credito, "valor" => 10, "natureza" => "C"],
            ],
        ];
    }

    public function test_lancamento_com_contas_de_outro_tenant_e_rejeitado(): void
    {
        $adminA = $this->criarTenant("a");
        $adminB = $this->criarTenant("b");
        $this->autenticar($adminA);

        $this->postJson(
            "/api/v1/lancamentos",
            $this->lancamento(
                $this->contaDoTenant($adminB, "1.1.01")->id,
                $this->contaDoTenant($adminB, "3.1.01")->id,
            ),
        )
            ->assertStatus(422)
            ->assertJsonValidationErrors([
                "partidas.0.conta_id",
                "partidas.1.conta_id",
            ]);
    }

    public function test_lancamento_com_contas_do_proprio_tenant_e_aceito(): void
    {
        $adminA = $this->criarTenant("a");
        $this->criarTenant("b");
        $this->autenticar($adminA);

        $this->postJson(
            "/api/v1/lancamentos",
            $this->lancamento(
                $this->contaDoTenant($adminA, "1.1.01")->id,
                $this->contaDoTenant($adminA, "3.1.01")->id,
            ),
        )->assertStatus(201);
    }

    public function test_compra_com_fornecedor_de_outro_tenant_e_rejeitada(): void
    {
        $adminA = $this->criarTenant("a");
        $adminB = $this->criarTenant("b");

        $fornecedorB = Supplier::create([
            "tenant_id" => $adminB->tenant_id,
            "tipo_pessoa" => "PJ",
            "documento" => "123",
            "nome" => "Fornecedor B",
        ]);

        $this->autenticar($adminA);

        $this->postJson("/api/v1/compras", [
            "supplier_id" => $fornecedorB->id,
            "produto_id" => 1,
            "quantidade" => 1,
            "custo_unitario" => 10,
            "forma_pagamento" => "A_VISTA",
            "data_compra" => "2026-01-01",
        ])
            ->assertStatus(422)
            ->assertJsonValidationErrors(["supplier_id"]);
    }
}
