import { ID } from 'appwrite';
import { account } from '../lib/appwrite';

export const authService = {
  // Create account
  register: async (email: string, pass: string, name: string) => {
    try {
      return await account.create(ID.unique(), email, pass, name);
    } catch (error) {
      throw error;
    }
  },

  // Login
  login: async (email: string, pass: string) => {
    try {
      return await account.createEmailPasswordSession(email, pass);
    } catch (error) {
      throw error;
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      return await account.get();
    } catch (error) {
      return null;
    }
  },

  // Logout
  logout: async () => {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
};
