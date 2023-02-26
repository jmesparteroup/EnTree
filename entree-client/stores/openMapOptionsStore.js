import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useOpenMapOptionsStore = create(
  subscribeWithSelector((set) => ({
    openMapOptions: false,
    setOpenMapOptions: () => set((state) => ({ openMapOptions: !state.openMapOptions })),
  }))
);

export default useOpenMapOptionsStore;
