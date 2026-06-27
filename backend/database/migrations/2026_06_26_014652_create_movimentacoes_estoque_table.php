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
        Schema::create("movimentacoes_estoque", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("tenants_id")
                ->constrained("tenants")
                ->cascadeOnDelete();
            $table
                ->foreignId("produto_id")
                ->constrained("produtos_servicos")
                ->cascadeOnDelete();
            $table
                ->foreignId("lancamento_id")
                ->nullable()
                ->constrained("lancamentos")
                ->nullOnDelete();
            $table->enum("tipo_movimento", [
                "ENTRADA",
                "SAIDA",
                "AJUSTE",
                "SALDO_INICIAL",
            ]);
            $table->decimal("quantidade", 10, 3);
            $table->decimal("custo_unitario", 15, 2);
            $table->string("observacao")->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("movimentacoes_estoque");
    }
};
