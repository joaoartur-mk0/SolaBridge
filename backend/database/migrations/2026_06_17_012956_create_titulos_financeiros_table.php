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
        Schema::create("titulos_financeiros", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("tenant_id")
                ->constrained("tenants")
                ->cascadeOnDelete();
            $table
                ->foreignId("customer_id")
                ->nullable()
                ->constrained("customers");
            $table
                ->foreignId("supplier_id")
                ->nullable()
                ->constrained("suppliers");
            $table->enum("tipo", ["RECEBER", "PAGAR"]);
            $table->string("descricao");
            $table->decimal("valor_total", 15, 2);
            $table->date("data_vencimento");
            $table
                ->enum("status", ["PENDENTE", "PAGO", "ATRASADO", "CANCELADO"])
                ->default("PENDENTE");
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("titulos_financeiros");
    }
};
