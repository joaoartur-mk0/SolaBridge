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
        Schema::create("tenants", function (Blueprint $table) {
            $table->id();

            $table->enum("tipo_pessoa", ["PF", "PJ"]);

            $table->string("documento")->unique();

            $table->string("nome");
            $table->string("email");
            $table->string("contato");
            // cep é opcional no StoreTenantRequest (nullable) — a coluna precisa
            // acompanhar, senão o onboarding/seed sem cep viola o NOT NULL.
            $table->string("cep")->nullable();

            $table->string("razao_social")->nullable();
            $table->string("inscricao_estadual")->nullable()->unique();
            $table->string("inscricao_municipal")->nullable();
            $table->string("cnae")->nullable();
            $table->enum("regime_tributacao", [
                "MEI",
                "ME",
                "SIMPLES_NACIONAL",
                "LUCRO_PRESUMIDO",
                "LUCRO_REAL",
            ]);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("tenants");
    }
};
