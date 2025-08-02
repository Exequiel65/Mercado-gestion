import { create } from 'zustand';
import type { IHomeConfig } from '~/types/Products';

interface UseHomeConfigState {
    config: null | IHomeConfig;
    setConfig: (config: IHomeConfig) => void;
}

export const useHomeConfig = create<UseHomeConfigState>((set: (partial: Partial<UseHomeConfigState>) => void) => ({
    config: null,
    setConfig: (config: IHomeConfig) => set({ config }),
}));
