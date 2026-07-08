<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create("servicos", function (Blueprint $table) {
            $table->id();
            $table->string("nome");
            $table->decimal("valor_servico", 15, 2)->default(0);
            $table
                ->foreignId("tenant_id")
                ->constrained("tenants")
                ->onDelete("cascade");
            $table->text("descricao");
            $table->string("codigo");

            // Códigos fiscais (LC 116/03 e município da prestação)
            $table->string("codigo_tributacao_nacional")->nullable();
            $table->char("codigo_ibge_municipio", 7)->nullable();

            // Motor de precificação (ISSQN)
            $table->decimal("valor_bruto", 15, 2)->default(0);
            $table->decimal("deducoes", 15, 2)->default(0);
            $table->decimal("desconto_condicionado", 15, 2)->default(0);
            $table->decimal("desconto_incondicionado", 15, 2)->default(0);
            $table->decimal("base_calculo", 15, 2)->default(0);
            $table->decimal("aliquota_iss", 5, 2)->default(0);
            $table->boolean("retencao_fonte")->default(false);

            // Estrutura flexível de tributos (preparada para IBS/CBS - EC 132/23)
            $table->jsonb("tributos")->nullable();

            $table->timestamps();
            // Soft delete: exclusão lógica (DELETE /servicos/{id} apenas inativa).
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("servicos");
    }
};
