import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useTreesStore = create(
  subscribeWithSelector((set) => ({
    trees: [],
    treesRendered: -1,
    renderedTrees: [],
    addTrees: (trees) =>
      set((state) => ({ trees: [...state.trees, ...trees] })),
    clearTrees: () => set({ trees: [] }),
    incrementTreesRendered: () =>
      set((state) => ({ treesRendered: state.treesRendered + 1 })),
    setTreesRendered: (treesRendered) => set({ treesRendered }),
    transferRenderedTrees: () =>
      set((state) => ({
        renderedTrees: [...state.renderedTrees, ...state.trees],
      })),
    removeTree: (tree) =>
      set((state) => ({
        renderedTrees: state.renderedTrees.filter((t) => t !== tree),
      })),
  }))
);

export default useTreesStore;
