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
        Schema::create("customer", function (Blueprint $table) {
            $table->id();
            $table
                ->foreignId("tenants_id")
                ->constrained("tenants")
                ->cascadeOnDelete();
            $table->enum("tipo_pessoa", ["PF", "PJ"]);
            $table->string("documento");
            $table->string("nome");
            $table->string("email")->nullable();
            $table->string("telefone")->nullable();
            $table->unique(["tenants_id", "documento"]);
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
