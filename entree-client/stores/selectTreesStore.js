import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// SelectedTree Attributes
// treeId: tree.treeId,
// userId: tree.userId,
// lat: lat,
// lng: lng,

const useSelectedTreeStore = create(
  subscribeWithSelector((set) => ({
    selectedTree: null,
    setSelectedTree: (tree) => set((state) => ({ selectedTree: tree })),
    removeSelectedTree: () => set((state) => ({ selectedTree: null })),
  }))
);

export default useSelectedTreeStore;
