import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useSearchStore = create(
  subscribeWithSelector((set) => ({
    selectedLocation: "",
    setSelectedLocation: (location) => set({ selectedLocation: location }),
    data: {},
    setData: (data) => set({ data }),

  }))
);

export default useSearchStore;
