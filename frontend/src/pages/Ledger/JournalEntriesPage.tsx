import { useCallback, useEffect, useMemo, useState } from "react";

import type { Account } from "../../types/account";
import type { EntryNature } from "../../types/common";
import type { JournalEntry } from "../../types/ledger";
import { getEntryTotals } from "../../utils/ledger";

import { ApiError } from "../../services/apiClient";
import { listAccounts } from "../../services/accountsService";
import { createJournalEntry, listJournalEntries } from "../../services/ledgerService";

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

type LineDraft = {
  accountId: string;
  natureza: EntryNature;
  valor: string;
};

function emptyLine(accounts: Account[], natureza: EntryNature): LineDraft {
  return { accountId: accounts[0]?.id ?? "", natureza, valor: "" };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function JournalEntriesPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [accountsError, setAccountsError] = useState("");

  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [entriesError, setEntriesError] = useState("");

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchAccounts = useCallback(async () => {
    setIsLoadingAccounts(true);
    setAccountsError("");

    try {
      const data = await listAccounts();
      setAccounts(data);
      setLines([emptyLine(data, "D"), emptyLine(data, "C")]);
    } catch (error) {
      setAccountsError(
        error instanceof ApiError ? error.message : "Não foi possível carregar o plano de contas."
      );
    } finally {
      setIsLoadingAccounts(false);
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    setIsLoadingEntries(true);
    setEntriesError("");

    try {
      const data = await listJournalEntries();
      setEntries(data);
    } catch (error) {
      setEntriesError(
        error instanceof ApiError ? error.message : "Não foi possível carregar os lançamentos."
      );
    } finally {
      setIsLoadingEntries(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
    fetchEntries();
  }, [fetchAccounts, fetchEntries]);

  function getAccountName(accountId: string) {
    return accounts.find((account) => account.id === accountId)?.nome ?? accountId;
  }

  const parsedLines = lines.map((line) => ({
    ...line,
    valorNumerico: Number(line.valor) || 0,
  }));

  const { totalDebito, totalCredito } = useMemo(
    () =>
      getEntryTotals(
        parsedLines.map((line) => ({ valor: line.valorNumerico, natureza: line.natureza }))
      ),
    [parsedLines]
  );

  const isBalanced = totalDebito > 0 && totalDebito === totalCredito;
  const hasIncompleteLine = parsedLines.some(
    (line) => !line.accountId || line.valorNumerico <= 0
  );
  const canSubmit =
    accounts.length > 0 &&
    description.trim().length > 0 &&
    date.length > 0 &&
    lines.length >= 2 &&
    !hasIncompleteLine &&
    isBalanced;

  function updateLine(index: number, changes: Partial<LineDraft>) {
    setLines((current) =>
      current.map((line, lineIndex) => (lineIndex === index ? { ...line, ...changes } : line))
    );
  }

  function addLine() {
    setLines((current) => [...current, emptyLine(accounts, "D")]);
  }

  function removeLine(index: number) {
    setLines((current) => current.filter((_, lineIndex) => lineIndex !== index));
  }

  function resetForm() {
    setDescription("");
    setDate("");
    setLines([emptyLine(accounts, "D"), emptyLine(accounts, "C")]);
  }

  async function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    setIsSaving(true);
    setSubmitError("");

    try {
      const newEntry = await createJournalEntry({
        description: description.trim(),
        date,
        partidas: parsedLines.map((line) => ({
          accountId: line.accountId,
          valor: line.valorNumerico,
          natureza: line.natureza,
        })),
      });

      setEntries((current) => [newEntry, ...current]);
      resetForm();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "Não foi possível registrar o lançamento."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Lançamentos Contábeis"
        description="Registre partidas dobradas e acompanhe o livro diário."
      />

      <Card>
        <CardHeader>
          <SectionHeader
            title="Novo lançamento"
            description="Selecione as contas de débito e crédito. O total de cada lado precisa bater para liberar o registro."
          />
        </CardHeader>

        <CardContent>
          {accountsError && (
            <p className="mb-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {accountsError}
            </p>
          )}

          {!isLoadingAccounts && !accountsError && accounts.length === 0 && (
            <p className="mb-4 rounded-lg border border-amber-400/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              Nenhuma conta encontrada no plano de contas deste tenant.
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-[2fr_1fr]">
            <Input
              label="Histórico"
              placeholder="Ex: Recebimento de cliente"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <Input
              label="Data"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>

          <div className="mt-6 space-y-3">
            {lines.map((line, index) => (
              <div
                key={index}
                className="grid gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4 md:grid-cols-[2fr_1fr_1fr_auto]"
              >
                <Select
                  label="Conta"
                  value={line.accountId}
                  onChange={(event) => updateLine(index, { accountId: event.target.value })}
                  disabled={accounts.length === 0}
                >
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.codigo} — {account.nome}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Natureza"
                  value={line.natureza}
                  onChange={(event) =>
                    updateLine(index, { natureza: event.target.value as EntryNature })
                  }
                >
                  <option value="D">Débito</option>
                  <option value="C">Crédito</option>
                </Select>

                <Input
                  label="Valor"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0,00"
                  value={line.valor}
                  onChange={(event) => updateLine(index, { valor: event.target.value })}
                />

                <div className="flex items-end">
                  <Button
                    variant="danger"
                    onClick={() => removeLine(index)}
                    disabled={lines.length <= 2}
                  >
                    Remover
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Button variant="secondary" onClick={addLine} disabled={accounts.length === 0}>
              + Adicionar partida
            </Button>
          </div>

          {submitError && (
            <p className="mt-4 rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {submitError}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-800 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="text-slate-400">
                Total débito: <strong className="text-slate-100">{formatCurrency(totalDebito)}</strong>
              </span>

              <span className="text-slate-400">
                Total crédito: <strong className="text-slate-100">{formatCurrency(totalCredito)}</strong>
              </span>
            </div>

            {!isBalanced && (totalDebito > 0 || totalCredito > 0) && (
              <p className="text-sm text-red-400">
                O total de débitos deve ser igual ao total de créditos (Princípio das Partidas Dobradas).
              </p>
            )}

            <Button onClick={handleSubmit} disabled={!canSubmit || isSaving}>
              {isSaving ? "Registrando…" : "Registrar lançamento"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {entriesError && (
        <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {entriesError}
        </p>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Histórico</TableHead>
            <TableHead>Partidas</TableHead>
            <TableHead>Valor</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoadingEntries && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500">
                Carregando lançamentos…
              </TableCell>
            </TableRow>
          )}

          {!isLoadingEntries &&
            entries.map((entry) => {
              const { totalDebito: entryTotal } = getEntryTotals(entry.partidas);

              return (
                <TableRow key={entry.id}>
                  <TableCell>{entry.date}</TableCell>

                  <TableCell className="font-medium text-slate-100">
                    {entry.description}
                  </TableCell>

                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {entry.partidas.map((partida, index) => (
                        <Badge
                          key={index}
                          variant={partida.natureza === "D" ? "info" : "default"}
                        >
                          {getAccountName(partida.accountId)} {partida.natureza}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>{formatCurrency(entryTotal)}</TableCell>
                </TableRow>
              );
            })}

          {!isLoadingEntries && entries.length === 0 && !entriesError && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-slate-500">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
