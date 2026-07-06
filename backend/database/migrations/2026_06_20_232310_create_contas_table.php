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
        Schema::create("contas", function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("codigo");
            $table
                ->foreignId("tenant_id")
                ->constrained("tenants")
                ->onDelete("cascade");
            $table->string("nome");
            $table->enum("tipo", [
                "ATIVO",
                "PASSIVO",
                "PL",
                "RECEITA",
                "DESPESA",
            ]);
            $table->char("natureza", 1);
            $table->unique(["tenant_id", "codigo"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("contas");
    }
};
