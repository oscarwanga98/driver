import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface TokenState {
  accessToken: string | null;
  refreshToken: string | null;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  clearTokens: () => void;
}

type TokenPersist = PersistOptions<TokenState>;

export const useTokenStore = create<
  TokenState,
  [["zustand/persist", TokenPersist]]
>(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      setAccessToken: (token: string) => set({ accessToken: token }),
      setRefreshToken: (token: string) => set({ refreshToken: token }),
      clearTokens: () => set({ accessToken: null, refreshToken: null }),
    }),
    {
      name: "token-storage", // key for storage
      getStorage: () => localStorage, // use localStorage for persistence
    }
  )
);
