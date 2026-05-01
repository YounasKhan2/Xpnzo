import { createContext } from 'react';
import type { Models } from 'appwrite';

export interface AuthContextValue {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  isLoading: true,
  logout: async () => {},
});
