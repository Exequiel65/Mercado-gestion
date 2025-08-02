import { create } from "zustand"

export type Entity = {
  id: number
  name: string
  isActive: boolean
}

interface EntityStore {
  entity: Entity | null
  setEntity: (data: Entity) => void
  isHydrated: boolean
  setHydrated: (v: boolean) => void
}

export const useEntityStore = create<EntityStore>((set) => ({
  entity: null,
  isHydrated: false,
  setEntity: (data) => set({ entity: data }),
  setHydrated: (v) => set({ isHydrated: v }),
}))
