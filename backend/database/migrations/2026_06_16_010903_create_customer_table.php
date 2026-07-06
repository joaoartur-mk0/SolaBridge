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
        Schema::create("customers", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("tenant_id")
                ->constrained("tenants")
                ->cascadeOnDelete();
            $table->enum("tipo_pessoa", ["PF", "PJ"]);
            $table->string("documento");
            $table->string("nome");
            $table->string("email")->nullable();
            $table->string("telefone")->nullable();

            // Tomador nacional
            $table->string("inscricao_estadual")->nullable();
            $table->string("inscricao_municipal")->nullable();

            // Tomador estrangeiro
            $table->string("nif")->nullable();
            $table->string("codigo_pais")->nullable();

            // Endereçamento (código IBGE do município, 7 dígitos)
            $table->char("codigo_ibge", 7)->nullable();

            $table->boolean("active")->default(true);

            $table->unique(["tenant_id", "documento"]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("customer");
    }
};
