import { create } from "zustand";

type MappingStore = {
    isLoading: boolean;
    setLoading: (value: boolean) => void;
    getLoading: () => boolean;
}

export const useMappingStore = create<MappingStore>((set, get) => ({
    isLoading: false,
    setLoading: (value) => set({ isLoading: value }),
    getLoading: () => get().isLoading,
}))