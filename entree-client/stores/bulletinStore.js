import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useBulletinStore = create(
  subscribeWithSelector((set) => ({
    openBulletin: true,
    setOpenBulletin: () => set((state) => ({ openBulletin: !state.openBulletin })),
  }))
);

export default useBulletinStore;
