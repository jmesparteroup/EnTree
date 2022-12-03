import create from "zustand";

const useTreesStore = create((set) => ({
  trees: [],
  addTrees: (trees) => set((state) => ({ trees: [...state.trees, ...trees] })),
  clearTrees: () => set({ trees: [] }),
}));

export default useTreesStore;
