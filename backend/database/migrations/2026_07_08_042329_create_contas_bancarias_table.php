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
        Schema::create("contas_bancarias", function (Blueprint $table) {
            $table->id();

            $table
                ->foreignId("user_id")
                ->constrained("users")
                ->onDelete("cascade");

            $table->string("pluggy_item_id")->unique();

            $table->string("nome_instituicao")->nullable(); // Ex: "Itaú Unibanco"
            $table->string("mascara_conta")->nullable(); // Ex: "**** 1234"

            $table
                ->enum("status_sincronizacao", [
                    "pendente",
                    "concluido",
                    "erro",
                ])
                ->default("pendente");

            $table->timestamps(); // Cria 'created_at' e 'updated_at'
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("contas_bancarias");
    }
};
