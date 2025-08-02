import { create } from "zustand"
import { persist } from "zustand/middleware"

export type User = {
  id: string
  email: string
  name: string
  roles: string[],
  userName: string,
  storeId: string | null,
  picture: string,
  dateOfBirth: string | null,
}

type AuthState = {
  token: string | null
  user: User | null
  login: (token: string, user: User | null) => void
  logout: () => void
  setUser: (user: User) => void,
  isHydrated: boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => {
        set({ token, user })
      },
      logout: () => {
        set({ token: null, user: null })
      },
      setUser: (user) => {
        set((state) => ({ ...state, user }))
      },
      isHydrated: false,
    }),
    {
      name: "auth-storage", // Clave en localStorage
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state!.isHydrated = true
      },
    }
  )
)
