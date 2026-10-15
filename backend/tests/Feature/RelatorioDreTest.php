<?php

namespace Tests\Feature;

use App\Models\Customer;
use App\Models\Produto;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CriaTenants;
use Tests\TestCase;

class RelatorioDreTest extends TestCase
{
    use CriaTenants, RefreshDatabase;

    private function registrarVenda(): int
    {
        $admin = $this->criarTenant();
        $this->autenticar($admin);

        $cliente = Customer::create([
            "tenant_id" => $admin->tenant_id,
            "tipo_pessoa" => "PF",
            "documento" => "1",
            "nome" => "Cliente",
        ]);
        $produto = Produto::create([
            "tenant_id" => $admin->tenant_id,
            "descricao" => "Produto",
            "unidade" => "UN",
            "preco_venda" => 10,
            "custo_medio" => 4,
        ]);

        return $this->postJson("/api/v1/vendas", [
            "produto_id" => $produto->id,
            "customer_id" => $cliente->id,
            "quantidade" => 1,
            "valor_total" => 10,
            "forma_pagamento" => "A_VISTA",
            "data_venda" => "2026-01-02",
        ])
            ->assertStatus(201)
            ->json("data.titulo.id");
    }

    public function test_dre_reflete_venda(): void
    {
        $this->registrarVenda();

        $this->getJson("/api/v1/relatorios/dre")->assertJson([
            "total_receitas" => 10,
            "total_despesas" => 4,
            "resultado_liquido" => 6,
        ]);
        $this->getJson("/api/v1/relatorios/balanco")->assertJson([
            "equacao_valida" => true,
        ]);
    }

    public function test_venda_cancelada_nao_entra_no_dre(): void
    {
        $venda = $this->registrarVenda();

        $this->postJson("/api/v1/vendas/{$venda}/cancelar")->assertStatus(200);

        $this->getJson("/api/v1/relatorios/dre")->assertJson([
            "total_receitas" => 0,
            "total_despesas" => 0,
            "resultado_liquido" => 0,
        ]);
        $this->getJson("/api/v1/relatorios/balanco")->assertJson([
            "equacao_valida" => true,
        ]);
    }

    public function test_cancelar_venda_duas_vezes_retorna_409(): void
    {
        $venda = $this->registrarVenda();

        $this->postJson("/api/v1/vendas/{$venda}/cancelar")->assertStatus(200);
        $this->postJson("/api/v1/vendas/{$venda}/cancelar")
            ->assertStatus(409)
            ->assertJson(["message" => "Esta venda já está cancelada."]);
    }
}
