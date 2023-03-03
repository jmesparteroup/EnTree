import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useNewTreesStore = create(
  subscribeWithSelector((set) => ({
    newTrees: [],
    highlightedIndex: -1,
    addNewTree: (tree) =>
      set((state) => ({ newTrees: [...state.newTrees, tree] })),
    removeNewTree: (tree) =>
      set((state) => ({
        newTrees: state.newTrees.filter((t) => t !== tree),
      })),
    clearNewTrees: () => set({ newTrees: [] }),
    setHighlightedIndex: (index) =>
      set((state) => ({ highlightedIndex: index })),
  }))
);

export default useNewTreesStore;
