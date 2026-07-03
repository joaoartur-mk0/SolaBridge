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
        Schema::create("lancamentos", function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table
                ->foreignId("tenants_id")
                ->constrained("tenants")
                ->onDelete("cascade");
            $table
                ->foreignId("customer_id")
                ->nullable()
                ->constrained("customer")
                ->nullOnDelete();
            $table
                ->foreignId("supplier_id")
                ->nullable()
                ->constrained("supplier")
                ->nullOnDelete();
            $table
                ->foreignId("titulo_id")
                ->nullable()
                ->constrained("titulos_financeiros")
                ->nullOnDelete();
            $table->string("description");
            $table->date("date");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists("lancamentos");
    }
};
