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
        Schema::create("produtos", function (Blueprint $table) {
            $table->id();

            $table
                ->foreignId("tenant_id")
                ->constrained("tenants")
                ->cascadeOnDelete();
            $table->string("ncm")->nullable();
            $table->string("cfop")->nullable();
            $table->string("cest")->nullable();
            $table->enum("unidade", ["KG", "UN", "LT", "ML", "G", "CX"]);
            $table->string("codigo_sku")->nullable();
            $table->string("descricao");
            $table->decimal("preco_venda", 15, 2)->default(0);
            $table->decimal("custo_medio", 15, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("produtos");
    }
};
