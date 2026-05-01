import { ID, AppwriteException } from "appwrite";
import { account } from "../lib/appwrite";

export const authService = {
  // Create account
  register: async (email: string, pass: string, name: string) => {
    return account.create(ID.unique(), email, pass, name);
  },

  // Login
  login: async (email: string, pass: string) => {
    try {
      return await account.createEmailPasswordSession(email, pass);
    } catch (error) {
      if (
        error instanceof AppwriteException &&
        error.type === "user_session_already_exists"
      ) {
        // If a session is already active (orphaned), try to delete it and retry
        try {
          await account.deleteSession("current");
          return await account.createEmailPasswordSession(email, pass);
        } catch {
          console.warn(
            "Failed to delete orphaned session, falling back to existing session.",
          );
          // If deletion fails, check if the existing session is valid
          const existingUser = await account.get();
          if (existingUser) return existingUser;
          throw error;
        }
      }
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  },
};
