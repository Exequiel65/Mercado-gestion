import { create } from "zustand"

export type Store = {
    id: number
    name: string
    description: string
}

type SetupState = {
    stores: Store[]
    currentStoreId: number | null
    setStores: (stores: Store[]) => void
    setCurrentStore: (id: number) => void,
    isHydrated: boolean
    setHydrated: (v: boolean) => void
}

export const useSetupStore = create<SetupState>((set) => ({
    stores: [],
    currentStoreId: null,
    isHydrated: false,
    setStores: (stores) => set({ stores }),
    setCurrentStore: (id) => set({ currentStoreId: id }),
    setHydrated: (v) => set({ isHydrated: v }),
}))
