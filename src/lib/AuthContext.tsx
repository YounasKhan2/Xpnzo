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

  // On app startup: restore session from Appwrite cookie or offline cache
  useEffect(() => {
    const checkSession = async () => {
      // 1. Optimistic Offline Restore
      const cachedUser = localStorage.getItem("xpnzo_user");
      if (cachedUser) {
        try {
          setUser(JSON.parse(cachedUser));
          setIsLoading(false); // Instantly unblock the UI!
        } catch {
          // Bad JSON
        }
      }

      // 2. Server Validation (if online)
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("xpnzo_user", JSON.stringify(currentUser));
        setIsLoading(false);
        if (navigator.onLine) {
          syncEngine.pullSync().catch(console.error);
        }
      } catch (error) {
        // If the server explicitly says "Unauthorized" (401), the session expired.
        // Wipe the offline cache and log out.
        const err = error as { code?: number };
        if (err?.code === 401) {
          setUser(null);
          localStorage.removeItem("xpnzo_user");
        }
        // Otherwise, it's a network error (offline). We do nothing!
        // The cached user remains in state, allowing offline PWA access.
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
    localStorage.setItem("xpnzo_user", JSON.stringify(currentUser));
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
    localStorage.removeItem("xpnzo_user");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
