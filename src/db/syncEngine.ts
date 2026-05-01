import { db, type SyncQueueItem, type SyncCollection } from "./db";
import {
  databases,
  DATABASE_ID,
  COLLECTION_IDS,
  Permission,
  Role,
} from "../lib/appwrite";
import { Query } from "appwrite";
import { authService } from "../services/auth";

const MAX_RETRIES = 3;

// ─── Core Sync Logic (Push) ──────────────────────────────────────────────────

const processSyncItem = async (item: SyncQueueItem): Promise<void> => {
  if ((item.retryCount ?? 0) >= MAX_RETRIES) {
    console.warn(
      `[Sync] Dropping item ${item.id} after ${MAX_RETRIES} failed retries.`,
    );
    await db.syncQueue.delete(item.id!);
    return;
  }

  const collectionId = COLLECTION_IDS[item.collection];
  if (!collectionId) {
    return;
  }

  // Get current user for permission scoping
  const user = await authService.getCurrentUser();
  if (!user) {
    console.warn("[Sync] No authenticated user found. Skipping sync.");
    return;
  }

  const userPermissions = [
    Permission.read(Role.user(user.$id)),
    Permission.update(Role.user(user.$id)),
    Permission.delete(Role.user(user.$id)),
  ];

  try {
    // Sanitize payload: remove local-only tracking fields before sending to Appwrite
    const cloudPayload = { ...item.payload } as Record<string, unknown>;
    delete cloudPayload.id;
    delete cloudPayload.localId;
    delete cloudPayload.isSynced;
    delete cloudPayload.isDeleted;
    delete cloudPayload.updatedAt;

    switch (item.action) {
      case "create": {
        const createdDoc = await databases.createDocument(
          DATABASE_ID,
          collectionId,
          "unique()",
          cloudPayload,
          userPermissions,
        );
        // Link the cloud ID back to our local record so it doesn't get duplicated on next pull
        if (item.payload.localId) {
          await db[item.collection].update(item.payload.localId, {
            id: createdDoc.$id,
          });
        }
        break;
      }
      case "update":
        if (item.payload.id) {
          // Note: When updating, Appwrite also expects just the data, not the ID inside the payload
          await databases.updateDocument(
            DATABASE_ID,
            collectionId,
            item.payload.id,
            cloudPayload,
            userPermissions,
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
      case "userSettings":
        // currently no isSynced flag for these
        break;
    }
  } catch (error) {
    console.error(`[Sync] Failed to process item ${item.id}:`, error);
    await db.syncQueue.update(item.id!, {
      retryCount: (item.retryCount ?? 0) + 1,
    });
  }
};

const pushSync = async (): Promise<void> => {
  if (!navigator.onLine) return;
  try {
    const queue = await db.syncQueue.orderBy("timestamp").toArray();
    for (const item of queue) {
      await processSyncItem(item);
    }
  } catch (error) {
    console.error("[Sync] Push cycle failed:", error);
  }
};

// ─── Core Sync Logic (Pull) ──────────────────────────────────────────────────

import type { Table, UpdateSpec } from "dexie";

type SyncEntity = {
  localId?: number;
  id?: string;
  updatedAt?: number;
  isSynced?: boolean;
  isDeleted?: boolean;
};

const pullCollection = async <T extends SyncEntity>(
  collection: SyncCollection,
  localTable: Table<T>,
) => {
  const collectionId = COLLECTION_IDS[collection];
  if (!collectionId) return;

  try {
    // Fetch all documents from Appwrite (could be optimized with lastSyncTime)
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.limit(100),
    ]);

    for (const doc of response.documents) {
      // Find if we have it locally
      const localDoc = await localTable.where("id").equals(doc.$id).first();

      const parsedDoc = { ...doc } as Record<string, unknown>;
      delete parsedDoc.$id;
      delete parsedDoc.$collectionId;
      delete parsedDoc.$databaseId;
      delete parsedDoc.$createdAt;
      delete parsedDoc.$updatedAt;
      delete parsedDoc.$permissions;

      // Strip any polluted localId that might have accidentally synced to the cloud previously
      delete parsedDoc.localId;

      if (!localDoc) {
        // Doesn't exist locally, insert it
        await localTable.add({
          ...parsedDoc,
          id: doc.$id,
          isSynced: true,
          isDeleted: false,
        } as unknown as T);
      } else {
        // Exists locally, resolve conflict by timestamp (Appwrite wins if newer or we don't track it locally)
        const localTime = localDoc.updatedAt || 0;
        const remoteTime = new Date(doc.$updatedAt).getTime() || 0;

        if (remoteTime > localTime) {
          if (localDoc.localId !== undefined) {
            await localTable.update(localDoc.localId, {
              ...parsedDoc,
              isSynced: true,
            } as unknown as UpdateSpec<T>);
          }
        }
      }
    }
  } catch (err) {
    console.error(`[Sync] Failed to pull collection ${collection}:`, err);
  }
};

const pullSync = async (): Promise<void> => {
  if (!navigator.onLine) return;
  try {
    await Promise.all([
      pullCollection("transactions", db.transactions),
      pullCollection("budgets", db.budgets),
      pullCollection("recurring", db.recurring),
      pullCollection("notifications", db.notifications),
      pullCollection("userSettings", db.userSettings),
    ]);
  } catch (err) {
    console.error("[Sync] Pull cycle failed:", err);
  }
};

const startSync = async (): Promise<void> => {
  if (!navigator.onLine) return;
  await pushSync();
  await pullSync();
};

// ─── Public API ──────────────────────────────────────────────────────────────

export const syncEngine = { startSync, pushSync, pullSync };

window.addEventListener("online", () => syncEngine.startSync());
