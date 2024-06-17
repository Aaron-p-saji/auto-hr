import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refresh: string | null;
  setAuth: (token: string, refresh: string) => void;
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      refresh: null,
      setAuth: (token, refresh) =>
        set({ isAuthenticated: true, token, refresh }),
      clearAuth: () => set({ isAuthenticated: false, token: null }),
    }),
    {
      name: "auth-storage", // unique name per storage
      storage: createJSONStorage(() => localStorage), // Use storage directly
    }
  )
);

export { useAuthStore };
