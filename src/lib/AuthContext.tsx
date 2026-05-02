import React, { useEffect, useState, useCallback } from 'react';
import type { Models } from 'appwrite';
import { authService } from '../services/auth';
import { syncEngine } from '../db/syncEngine';
import { db } from '../db/db';
import { AuthContext } from './authTypes';

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app startup: restore session from Appwrite cookie
  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
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

  // ── login ──────────────────────────────────────────────────────────────────
  // Handles the session creation + state update in one atomic operation.
  // This is the source of truth — AuthForm should never touch user state directly.
  const login = useCallback(async (email: string, pass: string) => {
    await authService.login(email, pass);
    // After a successful session, fetch the full user object and update state
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) throw new Error('Login succeeded but could not retrieve user profile.');
    setUser(currentUser);
    // Pull latest cloud data into local DB for this user
    if (navigator.onLine) {
      syncEngine.pullSync().catch(console.error);
    }
  }, []);

  // ── register ───────────────────────────────────────────────────────────────
  // Creates the account then immediately logs in.
  const register = useCallback(async (email: string, pass: string, name: string) => {
    await authService.register(email, pass, name);
    // Auto-login after successful registration
    await login(email, pass);
  }, [login]);

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    await authService.logout();
    // Wipe all local data to prevent leaking to the next user on this device
    await db.transactions.clear();
    await db.budgets.clear();
    await db.recurring.clear();
    await db.notifications.clear();
    await db.userSettings.clear();
    await db.syncQueue.clear();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
