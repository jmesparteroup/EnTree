import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useAppInfoStore = create(
  subscribeWithSelector((set) => ({
    openAppInfo: false,
    setOpenAppInfo: () => set((state) => ({ openAppInfo: !state.openAppInfo })),
    selectedStep: "",
    setSelectedStep: (step) => set((state) => ({ selectedStep: step })),
  }))
);

export default useAppInfoStore;
