import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useNewTreesStore = create(
  subscribeWithSelector((set) => ({
    newTrees: [],
    addNewTree: (tree) =>
      set((state) => ({ newTrees: [...state.newTrees, tree] })),
    removeNewTree: (tree) =>
      set((state) => ({
        newTrees: state.newTrees.filter((t) => t !== tree),
      })),
    clearNewTrees: () => set({ newTrees: [] }),
  }))
);

export default useNewTreesStore;
