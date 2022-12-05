import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useHexagonsStore = create(
  subscribeWithSelector((set) => ({
    hexagons: {
      13: [],
      14: [],
      15: [],
      16: [],
      17: [],
    },
    addHexagons: (hexagons, zoom) =>
      set((state) => ({
        hexagons: {
          ...state.hexagons,
          [zoom]: [...state.hexagons[zoom], ...hexagons],
        },
      })),
    clearHexagons: () => set({ hexagons: [] }),
  }))
);

export default useHexagonsStore;
