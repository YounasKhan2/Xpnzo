import Dexie, { type Table } from "dexie";
import { mockTransactions, mockBudgets } from "../data/mockData";
import type {
  BudgetStatus,
  RecurringFrequency,
  TransactionStatus,
  TransactionType,
} from "../../types/global-types";

export interface LocalTransaction {
  id?: string; // Appwrite document ID
  localId?: number; // Auto-incrementing local ID
  name: string;
  amount: number;
  category: string;
  merchant?: string;
  date: string;
  type: TransactionType;
  note?: string;
  status: TransactionStatus;
  account?: string;
  isSynced: boolean;
  isDeleted: boolean;
  updatedAt: number;
}

export interface LocalBudget {
  id?: string;
  localId?: number;
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  status: BudgetStatus;
  updatedAt: number;
}

export interface LocalRecurring {
  id?: string;
  localId?: number;
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  nextDate: string;
  category: string;
  isActive: boolean;
  updatedAt: number;
}

export type SyncPayload =
  | Partial<LocalTransaction>
  | Partial<LocalBudget>
  | Partial<LocalRecurring>;

export interface SyncQueueItem {
  id?: number;
  action: "create" | "update" | "delete";
  collection: "transactions" | "budgets" | "recurring";
  payload: SyncPayload;
  timestamp: number;
}

export class XpnzoDatabase extends Dexie {
  transactions!: Table<LocalTransaction>;
  budgets!: Table<LocalBudget>;
  recurring!: Table<LocalRecurring>;
  syncQueue!: Table<SyncQueueItem>;

  constructor() {
    super("XpnzoDB");
    this.version(1).stores({
      transactions: "++localId, id, category, date, isSynced, isDeleted",
      budgets: "id, category",
      recurring: "++id, name, category, isActive",
      syncQueue: "++id, collection, timestamp",
    });
  }
}

export const db = new XpnzoDatabase();

// Seed function to populate data if empty
export const seedDatabase = async () => {
  return db.transaction(
    "rw",
    [db.transactions, db.budgets, db.recurring],
    async () => {
      const transactionCount = await db.transactions.count();
      if (transactionCount === 0) {
        const transactionsToSeed: LocalTransaction[] = mockTransactions.map(
          (t) => ({
            ...t,
            isSynced: true,
            isDeleted: false,
            updatedAt: Date.now(),
          }),
        );
        await db.transactions.bulkAdd(transactionsToSeed);
      }

      const budgetCount = await db.budgets.count();
      if (budgetCount === 0) {
        const budgetsToSeed: LocalBudget[] = mockBudgets.map((b) => ({
          ...b,
          updatedAt: Date.now(),
        }));
        await db.budgets.bulkAdd(budgetsToSeed);
      }

      const recurringCount = await db.recurring.count();
      if (recurringCount === 0) {
        const { mockRecurring } = await import("../data/mockData");
        const recurringToSeed: LocalRecurring[] = mockRecurring.map((r) => ({
          ...r,
          updatedAt: Date.now(),
        }));
        await db.recurring.bulkAdd(recurringToSeed);
      }
    },
  );
};
