import type { AccountId, JournalEntryId } from "./ids";
import type { EntryNature } from "./common";
import type { Money } from "./money";
import type { ISODate } from "./date";

export interface JournalEntryLine {
    accountId: AccountId;
    valor: Money;
    natureza: EntryNature;
}

export interface JournalEntry {
    id: JournalEntryId;
    description: string;
    date: ISODate;
    partidas: JournalEntryLine[];
}
