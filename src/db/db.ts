import Dexie, { type Table } from "dexie";
import type {
  BudgetStatus,
  RecurringFrequency,
  TransactionStatus,
  TransactionType,
} from "../../types/global-types";
import type { LocalUserSettings } from "../../types/Settings-types";

export type { LocalUserSettings };

// ─── Table Interfaces ────────────────────────────────────────────────────────

export interface LocalTransaction {
  localId?: number;  // Auto-increment PK (local-first)
  id?: string;       // Appwrite document ID (populated after first sync)
  name: string;
  amount: number;
  category: string;
  merchant?: string;
  date: string;
  type: TransactionType;
  note?: string;
  status: TransactionStatus;
  account?: string;
  receiptFileId?: string; // Appwrite Storage file ID for attached receipt
  isSynced: boolean;
  isDeleted: boolean;
  updatedAt: number;
}

export interface LocalBudget {
  localId?: number;  // Auto-increment PK
  id?: string;       // Appwrite document ID
  category: string;
  limit: number;
  spent: number;
  color: string;
  icon: string;
  status: BudgetStatus;
  isSynced: boolean;
  isDeleted: boolean;
  updatedAt: number;
}

export interface LocalRecurring {
  localId?: number;  // Auto-increment PK
  id?: string;       // Appwrite document ID
  name: string;
  amount: number;
  frequency: RecurringFrequency;
  nextDate: string;
  category: string;
  isActive: boolean;
  isSynced: boolean;
  isDeleted: boolean;
  updatedAt: number;
}

export interface LocalNotification {
  localId?: number;  // Auto-increment PK
  id?: string;       // Appwrite document ID
  title: string;
  message: string;
  type: "alert" | "info" | "system" | "success";
  isRead: boolean;
  updatedAt: number;
}

// ─── Sync Queue ──────────────────────────────────────────────────────────────

export type SyncCollection = "transactions" | "budgets" | "recurring" | "notifications" | "userSettings";

export type SyncPayload =
  | Partial<LocalTransaction>
  | Partial<LocalBudget>
  | Partial<LocalRecurring>
  | Partial<LocalNotification>
  | Partial<LocalUserSettings>;

export interface SyncQueueItem {
  id?: number;
  action: "create" | "update" | "delete";
  collection: SyncCollection;
  payload: SyncPayload;
  retryCount: number;
  timestamp: number;
}

// ─── Database Class ──────────────────────────────────────────────────────────
// NOTE: The database was renamed from "XpnzoDB" to "XpnzoDB_2" to force a
// clean slate after the primary key change (++localId on all tables).
// IndexedDB does not support changing an object store's primary key in-place,
// so renaming the DB is the correct resolution during early development when
// there is no real user data to preserve.

export class XpnzoDatabase extends Dexie {
  transactions!: Table<LocalTransaction>;
  budgets!: Table<LocalBudget>;
  recurring!: Table<LocalRecurring>;
  syncQueue!: Table<SyncQueueItem>;
  notifications!: Table<LocalNotification>;
  userSettings!: Table<LocalUserSettings>;

  constructor() {
    super("XpnzoDB_2");

    // v1 — canonical schema (clean start, all tables use ++localId as PK)
    this.version(1).stores({
      transactions: "++localId, id, category, date, type, isSynced, isDeleted",
      budgets:      "++localId, id, category, isSynced, isDeleted",
      recurring:    "++localId, id, name, category, isActive, isSynced, isDeleted",
      syncQueue:    "++id, collection, timestamp",
      notifications:"++localId, id, type, isRead, updatedAt",
      userSettings: "++localId",
    });
  }
}

export const db = new XpnzoDatabase();
