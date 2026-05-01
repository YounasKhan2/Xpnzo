import { db, type SyncQueueItem } from "./db";
import { databases } from "../lib/appwrite";

// Actual Collection IDs from Appwrite
const COLLECTION_IDS = {
  transactions: "69f4b467003790fede5a",
  budgets: "69f4b46e0038f1fd5966",
  recurring: "69f4b473000c148e7eb3",
};

const DATABASE_ID = "69f4b4650016cddc01d3";

export const syncEngine = {
  isSyncing: false,

  async startSync() {
    if (this.isSyncing || !navigator.onLine) return;
    this.isSyncing = true;

    try {
      const queue = await db.syncQueue.orderBy("timestamp").toArray();

      for (const item of queue) {
        await this.processSyncItem(item);
      }
    } catch (error) {
      console.error("Sync failed:", error);
    } finally {
      this.isSyncing = false;
    }
  },

  async processSyncItem(item: SyncQueueItem) {
    const collectionId = COLLECTION_IDS[item.collection];
    if (!collectionId) return;

    try {
      switch (item.action) {
        case "create":
          await databases.createDocument(
            DATABASE_ID,
            collectionId,
            "unique()",
            item.payload,
          );
          break;
        case "update":
          if (item.payload.id) {
            await databases.updateDocument(
              DATABASE_ID,
              collectionId,
              item.payload.id,
              item.payload,
            );
          }
          break;
        case "delete":
          if (item.payload.id) {
            await databases.deleteDocument(
              DATABASE_ID,
              collectionId,
              item.payload.id,
            );
          }
          break;
      }

      // If successful, remove from queue
      await db.syncQueue.delete(item.id!);

      // If it was a transaction, mark as synced in local DB
      if (item.collection === "transactions" && item.payload.localId) {
        await db.transactions.update(item.payload.localId, { isSynced: true });
      }
    } catch (error) {
      console.error(`Failed to sync item ${item.id}:`, error);
      // We could add retry logic here
    }
  },
};

// Listen for network changes
window.addEventListener("online", () => syncEngine.startSync());
