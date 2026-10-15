<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\Concerns\CriaTenants;
use Tests\TestCase;

class ApiErrorHandlingTest extends TestCase
{
    use CriaTenants, RefreshDatabase;

    public function test_validacao_retorna_422_com_erros(): void
    {
        $this->postJson("/api/v1/login", [])
            ->assertStatus(422)
            ->assertJsonValidationErrors(["email", "password"]);
    }

    public function test_rota_protegida_sem_token_retorna_401(): void
    {
        $this->getJson("/api/v1/customers")->assertStatus(401);
    }

    public function test_registro_inexistente_retorna_404(): void
    {
        $this->autenticar($this->criarTenant());

        $this->getJson("/api/v1/compras/999")
            ->assertStatus(404)
            ->assertJson(["success" => false]);
    }

    public function test_id_nao_numerico_retorna_404(): void
    {
        $this->autenticar($this->criarTenant());

        $this->getJson("/api/v1/compras/abc")->assertStatus(404);
    }

    public function test_rota_inexistente_retorna_404(): void
    {
        $this->getJson("/api/v1/nao-existe")->assertStatus(404);
    }
}
