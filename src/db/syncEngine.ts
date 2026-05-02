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

type SyncEntity = {
  localId?: number;
  id?: string;
  updatedAt?: number;
  isSynced?: boolean;
  isDeleted?: boolean;
};

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

    // ── Pre-process ID and state ──
    let docId = (item.payload as { id?: string }).id;
    const localId = (item.payload as { localId?: number }).localId;

    if (localId) {
      const record = (await db[item.collection].get(localId)) as SyncEntity | undefined;
      
      // If record is missing locally and not already synced, we can't process it
      if (!record && !docId) {
        await db.syncQueue.delete(item.id!);
        return;
      }

      // If it's a create/update but already deleted locally and never synced, skip it
      if (!docId && record?.isDeleted && (item.action === "create" || item.action === "update")) {
        await db.syncQueue.delete(item.id!);
        return;
      }

      // Try to recover docId from local record if missing in payload
      if (!docId && record?.id) {
        docId = record.id;
      }
    }

    switch (item.action) {
      case "create": {
        const createdDoc = await databases.createDocument(
          DATABASE_ID,
          collectionId,
          "unique()",
          cloudPayload,
          userPermissions,
        );
        // Link the cloud ID back to our local record
        if (localId) {
          await db[item.collection].update(localId, {
            id: createdDoc.$id,
          });
        }
        break;
      }
      case "update":
        if (docId) {
          await databases.updateDocument(
            DATABASE_ID,
            collectionId,
            docId,
            cloudPayload,
            userPermissions,
          );
        }
        break;
      case "delete":
        if (docId) {
          await databases.deleteDocument(
            DATABASE_ID,
            collectionId,
            docId,
          );
        }
        break;
    }

    // ── Success: remove from queue and mark synced in local DB ──
    await db.syncQueue.delete(item.id!);

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

const pullCollection = async <T extends SyncEntity>(
  collection: SyncCollection,
  localTable: Table<T>,
) => {
  const collectionId = COLLECTION_IDS[collection];
  if (!collectionId) return;

  try {
    // Fetch all documents belonging to this user from Appwrite
    const response = await databases.listDocuments(DATABASE_ID, collectionId, [
      Query.limit(100),
    ]);

    // Build a Set of all cloud IDs for quick lookup
    const cloudIds = new Set(response.documents.map((d) => d.$id));

    // ── Upsert: insert new / update changed ───────────────────────────────
    for (const doc of response.documents) {
      const localDoc = await localTable.where("id").equals(doc.$id).first();

      const parsedDoc = { ...doc } as Record<string, unknown>;
      delete parsedDoc.$id;
      delete parsedDoc.$collectionId;
      delete parsedDoc.$databaseId;
      delete parsedDoc.$createdAt;
      delete parsedDoc.$updatedAt;
      delete parsedDoc.$permissions;
      // Strip any localId that may have accidentally been synced to the cloud
      delete parsedDoc.localId;

      if (!localDoc) {
        await localTable.add({
          ...parsedDoc,
          id: doc.$id,
          isSynced: true,
          isDeleted: false,
        } as unknown as T);
      } else {
        const localTime = localDoc.updatedAt || 0;
        const remoteTime = new Date(doc.$updatedAt).getTime() || 0;
        if (remoteTime > localTime && localDoc.localId !== undefined) {
          await localTable.update(localDoc.localId, {
            ...parsedDoc,
            isSynced: true,
          } as unknown as UpdateSpec<T>);
        }
      }
    }

    // ── Purge: remove local records deleted on the server ─────────────────
    // Find all local records that have a cloud ID (i.e. were previously synced)
    // but whose ID is no longer present in the latest Appwrite response.
    const allLocalSynced = await localTable
      .filter((item) => !!item.id)
      .toArray();

    for (const localItem of allLocalSynced) {
      if (localItem.id && !cloudIds.has(localItem.id)) {
        // This record was deleted from Appwrite — remove it locally too
        if (localItem.localId !== undefined) {
          await localTable.delete(localItem.localId);
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
