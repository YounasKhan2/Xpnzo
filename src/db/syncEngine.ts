import { db, type SyncQueueItem, type SyncCollection } from "./db";
import { databases } from "../lib/appwrite";

// ─── Appwrite Collection IDs ─────────────────────────────────────────────────

const COLLECTION_IDS: Record<SyncCollection, string> = {
  transactions: "69f4b467003790fede5a",
  budgets: "69f4b46e0038f1fd5966",
  recurring: "69f4b473000c148e7eb3",
  notifications: "", // Add your Appwrite notifications collection ID here when ready
};

const DATABASE_ID = "69f4b4650016cddc01d3";
const MAX_RETRIES = 3;

// ─── Core Sync Logic ─────────────────────────────────────────────────────────

const processSyncItem = async (item: SyncQueueItem): Promise<void> => {
  if ((item.retryCount ?? 0) >= MAX_RETRIES) {
    console.warn(`[Sync] Dropping item ${item.id} after ${MAX_RETRIES} failed retries.`);
    await db.syncQueue.delete(item.id!);
    return;
  }

  const collectionId = COLLECTION_IDS[item.collection];
  if (!collectionId) {
    // Collection not yet configured in Appwrite — skip silently
    return;
  }

  try {
    switch (item.action) {
      case "create":
        await databases.createDocument(DATABASE_ID, collectionId, "unique()", item.payload);
        break;
      case "update":
        if (item.payload.id) {
          await databases.updateDocument(DATABASE_ID, collectionId, item.payload.id, item.payload);
        }
        break;
      case "delete":
        if (item.payload.id) {
          await databases.deleteDocument(DATABASE_ID, collectionId, item.payload.id);
        }
        break;
    }

    // ── Success: remove from queue and mark synced in local DB ──
    await db.syncQueue.delete(item.id!);

    const localId = (item.payload as { localId?: number }).localId;
    if (localId === undefined) return;

    switch (item.collection) {
      case "transactions":
        await db.transactions.update(localId, { isSynced: true });
        break;
      case "budgets":
        await db.budgets.update(localId, { isSynced: true });
        break;
      case "recurring":
        await db.recurring.update(localId, { isSynced: true });
        break;
      case "notifications":
        // notifications don't have an isSynced field – nothing to update
        break;
    }
  } catch (error) {
    console.error(`[Sync] Failed to process item ${item.id}:`, error);
    await db.syncQueue.update(item.id!, { retryCount: (item.retryCount ?? 0) + 1 });
  }
};

const startSync = async (): Promise<void> => {
  if (!navigator.onLine) return;

  try {
    const queue = await db.syncQueue.orderBy("timestamp").toArray();
    for (const item of queue) {
      await processSyncItem(item);
    }
  } catch (error) {
    console.error("[Sync] Sync cycle failed:", error);
  }
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const syncEngine = { startSync };

// Trigger sync whenever the browser comes back online
window.addEventListener("online", () => syncEngine.startSync());
