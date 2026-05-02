import { ID, AppwriteException } from "appwrite";
import { account } from "../lib/appwrite";

export const authService = {
  // ── Register ───────────────────────────────────────────────────────────────
  register: async (email: string, pass: string, name: string) => {
    return account.create(ID.unique(), email, pass, name);
  },

  // ── Login ──────────────────────────────────────────────────────────────────
  // Handles the edge case where an orphaned session cookie blocks a new login.
  login: async (email: string, pass: string) => {
    try {
      return await account.createEmailPasswordSession(email, pass);
    } catch (error) {
      if (
        error instanceof AppwriteException &&
        error.type === "user_session_already_exists"
      ) {
        // Orphaned session detected — attempt to clear it and retry once
        try {
          await account.deleteSession("current");
        } catch {
          // Deletion blocked (e.g. browser cookie policy) — swallow and retry anyway
        }
        // Re-attempt the login after clearing (or attempting to clear) the session
        return await account.createEmailPasswordSession(email, pass);
      }
      throw error;
    }
  },

  // ── Get current user ───────────────────────────────────────────────────────
  // Returns null instead of throwing when there is no active session.
  getCurrentUser: async () => {
    return await account.get();
  },

  // ── Security Features ──────────────────────────────────────────────────────
  updatePassword: async (password: string, oldPassword?: string) => {
    return await account.updatePassword(password, oldPassword);
  },

  getSessions: async () => {
    return await account.listSessions();
  },

  deleteSession: async (sessionId: string) => {
    return await account.deleteSession(sessionId);
  },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logout: async () => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
};
