CREATE TABLE "contas" (
  "id" integer PRIMARY KEY NOT NULL,
  "codigo" varchar,
  "nome" varchar NOT NULL,
  "tipo" varchar NOT NULL,
  "natureza" varchar NOT NULL
);

CREATE TABLE "lançamentos" (
  "id" integer PRIMARY KEY NOT NULL,
  "description" varchar NOT NULL,
  "date" timestamp NOT NULL
);

CREATE TABLE "deb_cred_part" (
  "id" integer PRIMARY KEY NOT NULL,
  "lançamento_id" integer NOT NULL,
  "contas_id" integer NOT NULL,
  "valor" decimal NOT NULL,
  "natureza" varchar() NOT NULL
);

ALTER TABLE "contas" ADD CONSTRAINT "contas_partida" FOREIGN KEY ("id") REFERENCES "deb_cred_part" ("contas_id") DEFERRABLE INITIALLY IMMEDIATE;

ALTER TABLE "lançamentos" ADD CONSTRAINT "lançamentos_partidas" FOREIGN KEY ("id") REFERENCES "deb_cred_part" ("lançamento_id") DEFERRABLE INITIALLY IMMEDIATE;

-- Defer constraint checking for INSERT
BEGIN;
SET CONSTRAINTS ALL DEFERRED;

INSERT INTO "contas" ("id", "nome", "tipo", "natureza")
VALUES
  (0, 'Caixa', 'ATIVO', 'D'),
  (1, 'Bancos', 'ATIVO', 'D'),
  (2, 'Contas a Receber', 'ATIVO', 'D'),
  (3, 'Veículos', 'ATIVO', 'D'),
  (4, 'Máquinas', 'ATIVO', 'D'),
  (5, 'Fornecedores', 'PASSIVO', 'C'),
  (6, 'Empréstimos', 'PASSIVO', 'C'),
  (7, 'Impóstos a Pagar', 'PASSIVO', 'C'),
  (8, 'Capital Social', 'PL', 'C'),
  (9, 'Lucros Acumulados', 'PL', 'C'),
  (10, 'Receita de Vendas', 'RECEITA', 'C'),
  (11, 'CMV', 'DESPESA', 'D'),
  (12, 'Despesas Operacionais', 'DEPESA', 'D'),
  (13, 'Despesas ADM', 'DEPESA', 'D');
INSERT INTO "lançamentos" ("id", "description", "date")
VALUES
  (0, 'Venda de Produto', '2026-01-01'),
  (1, 'Compra de Mercadoria', '2026-02-28');
INSERT INTO "deb_cred_part" ("id", "lançamento_id", "contas_id", "valor", "natureza")
VALUES
  (0, 0, 10, 25, 'c'),
  (1, 0, 0, 25, 'D'),
  (2, 1, 5, 10, 'C'),
  (3, 1, 11, 10, 'D');

SET CONSTRAINTS ALL IMMEDIATE;
COMMIT;