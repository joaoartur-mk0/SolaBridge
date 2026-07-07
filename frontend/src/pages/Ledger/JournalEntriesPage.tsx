import { useMemo, useState } from "react";

import { accounts, journalEntries as journalEntriesMock } from "../../mocks";
import type { EntryNature } from "../../types/common";
import type { JournalEntry } from "../../types/ledger";
import { getEntryTotals } from "../../utils/ledger";

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

function emptyLine(natureza: EntryNature): LineDraft {
  return { accountId: accounts[0]?.id ?? "", natureza, valor: "" };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getAccountName(accountId: string) {
  return accounts.find((account) => account.id === accountId)?.nome ?? accountId;
}

export function JournalEntriesPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(journalEntriesMock);

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [lines, setLines] = useState<LineDraft[]>([emptyLine("D"), emptyLine("C")]);

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
    setLines((current) => [...current, emptyLine("D")]);
  }

  function removeLine(index: number) {
    setLines((current) => current.filter((_, lineIndex) => lineIndex !== index));
  }

  function resetForm() {
    setDescription("");
    setDate("");
    setLines([emptyLine("D"), emptyLine("C")]);
  }

  function handleSubmit() {
    if (!canSubmit) {
      return;
    }

    const newEntry: JournalEntry = {
      id: `LC-${String(entries.length + 1).padStart(3, "0")}`,
      description: description.trim(),
      date,
      partidas: parsedLines.map((line) => ({
        accountId: line.accountId,
        valor: line.valorNumerico,
        natureza: line.natureza,
      })),
    };

    setEntries((current) => [newEntry, ...current]);
    resetForm();
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
            <Button variant="secondary" onClick={addLine}>
              + Adicionar partida
            </Button>
          </div>

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

            <Button onClick={handleSubmit} disabled={!canSubmit}>
              Registrar lançamento
            </Button>
          </div>
        </CardContent>
      </Card>

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
          {entries.map((entry) => {
            const { totalDebito: entryTotal } = getEntryTotals(entry.partidas);

            return (
              <TableRow key={entry.id}>
                <TableCell>{entry.date}</TableCell>

                <TableCell className="font-medium text-slate-100">{entry.description}</TableCell>

                <TableCell>
                  <div className="flex flex-wrap gap-2">
                    {entry.partidas.map((partida, index) => (
                      <Badge key={index} variant={partida.natureza === "D" ? "info" : "default"}>
                        {getAccountName(partida.accountId)} {partida.natureza}
                      </Badge>
                    ))}
                  </div>
                </TableCell>

                <TableCell>{formatCurrency(entryTotal)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
