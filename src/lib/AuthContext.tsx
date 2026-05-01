import React, { useEffect, useState } from 'react';
import type { Models } from 'appwrite';
import { authService } from '../services/auth';
import { syncEngine } from '../db/syncEngine';
import { db } from '../db/db';
import { AuthContext } from './authTypes';

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // On app startup: check if a valid Appwrite session cookie exists
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        // If session is valid, pull latest cloud data into local DB
        if (currentUser && navigator.onLine) {
          syncEngine.pullSync().catch(console.error);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const logout = async () => {
    await authService.logout();
    // Clear all local data on logout to avoid leaking data
    await db.transactions.clear();
    await db.budgets.clear();
    await db.recurring.clear();
    await db.notifications.clear();
    await db.userSettings.clear();
    await db.syncQueue.clear();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


