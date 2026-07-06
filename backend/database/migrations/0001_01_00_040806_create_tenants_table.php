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
            $table->string("cep");

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
