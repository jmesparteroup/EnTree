import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useOpenAddTreesStore = create(
  subscribeWithSelector((set) => ({
    openAddTrees: false,
    setOpenAddTrees: () => set((state) => ({ openAddTrees: !state.openAddTrees })),
  }))
);

export default useOpenAddTreesStore;
