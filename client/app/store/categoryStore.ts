// src/store/categoryStore.ts
import { create } from 'zustand';

export type Category = {
  id: number;
  name: string;
  subCategories: {
      id: number;
    name: string;
    childCategories: { id: number; name: string }[];
  }[];
};

type CategoryStore = {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  setCategories: (categories) => set({ categories }),
}));
