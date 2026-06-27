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
        Schema::create("partition", function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table
                ->foreignId("lancamento_id")
                ->constraint("lancamentos")
                ->cascadeOnDelete();
            $table
                ->foreignId("contas_id")
                ->constraint("contas")
                ->cascadeOnDelete();
            $table
                ->foreignId("produto_id")
                ->nullable()
                ->constrained("produtos_servicos")
                ->nullOnDelete();
            $table->decimal("valor", 15, 2);
            $table->enum("natureza", ["D", "C"]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("partition");
    }
};
