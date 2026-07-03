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
            $table->string("descricao");
            $table->string("codigo");
            $table->timestamps();
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
