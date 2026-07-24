import { useState } from "react";

import { accounts as accountsMock, journalEntries } from "../../mocks";
import type { Account } from "../../types/account";
import type { AccountType } from "../../types/common";
import { getAccountBalance } from "../../utils/ledger";

import { PageHeader } from "../../components/shared/PageHeader";
import { SectionHeader } from "../../components/shared/SectionHeader";

import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";

const accountTypeLabels: Record<AccountType, string> = {
  ATIVO: "Ativo",
  PASSIVO: "Passivo",
  PL: "Patrimônio Líquido",
  RECEITA: "Receita",
  DESPESA: "Despesa",
};

const naturezaPorTipo: Record<AccountType, "D" | "C"> = {
  ATIVO: "D",
  PASSIVO: "C",
  PL: "C",
  RECEITA: "C",
  DESPESA: "D",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function AccountsPage() {
  const [accounts, setAccounts] = useState<Account[]>(accountsMock);
  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [codigo, setCodigo] = useState("");
  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<AccountType>("ATIVO");
  const [error, setError] = useState("");

  const filteredAccounts = accounts.filter(
    (account) =>
      account.nome.toLowerCase().includes(search.toLowerCase()) ||
      account.codigo.includes(search)
  );

  function resetForm() {
    setCodigo("");
    setNome("");
    setTipo("ATIVO");
    setError("");
  }

  function handleSubmit() {
    if (!codigo.trim() || !nome.trim()) {
      setError("Preencha o código e o nome da conta.");
      return;
    }

    if (accounts.some((account) => account.codigo === codigo.trim())) {
      setError("Já existe uma conta com esse código.");
      return;
    }

    setAccounts((current) => [
      ...current,
      {
        id: `CTA-${codigo.trim()}`,
        codigo: codigo.trim(),
        nome: nome.trim(),
        tipo,
        natureza: naturezaPorTipo[tipo],
      },
    ]);

    resetForm();
    setIsFormOpen(false);
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Plano de Contas"
        description="Cadastro das contas contábeis usadas nos lançamentos."
        action={
          <Button onClick={() => setIsFormOpen((current) => !current)}>
            {isFormOpen ? "Fechar" : "Nova Conta"}
          </Button>
        }
      />

      {isFormOpen && (
        <Card>
          <CardHeader>
            <SectionHeader
              title="Nova conta"
              description="A natureza é definida automaticamente a partir do tipo escolhido."
            />
          </CardHeader>

          <CardContent>
            <div className="grid gap-5 md:grid-cols-3">
              <Input
                label="Código"
                placeholder="Ex: 1.1.05"
                value={codigo}
                onChange={(event) => setCodigo(event.target.value)}
              />

              <Input
                label="Nome da conta"
                placeholder="Ex: Aplicações Financeiras"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
              />

              <Select
                label="Tipo"
                value={tipo}
                onChange={(event) => setTipo(event.target.value as AccountType)}
              >
                {Object.entries(accountTypeLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <span className="text-sm text-slate-400">Natureza da conta:</span>
              <Badge variant="info">{naturezaPorTipo[tipo] === "D" ? "Devedora (D)" : "Credora (C)"}</Badge>
            </div>

            {error && <p className="mt-3 text-sm text-danger">{error}</p>}

            <div className="mt-6 flex justify-end gap-3 border-t border-slate-800 pt-5">
              <Button variant="secondary" onClick={() => setIsFormOpen(false)}>
                Cancelar
              </Button>

              <Button onClick={handleSubmit}>Salvar conta</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        placeholder="Pesquisar por código ou nome..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Natureza</TableHead>
            <TableHead>Saldo atual</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredAccounts.map((account) => (
            <TableRow key={account.id}>
              <TableCell className="font-mono text-slate-400">{account.codigo}</TableCell>

              <TableCell className="font-medium text-slate-100">{account.nome}</TableCell>

              <TableCell>{accountTypeLabels[account.tipo]}</TableCell>

              <TableCell>
                <Badge variant={account.natureza === "D" ? "info" : "default"}>
                  {account.natureza === "D" ? "Devedora" : "Credora"}
                </Badge>
              </TableCell>

              <TableCell>{formatCurrency(getAccountBalance(account, journalEntries))}</TableCell>
            </TableRow>
          ))}

          {filteredAccounts.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-slate-500">
                Nenhuma conta encontrada.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
