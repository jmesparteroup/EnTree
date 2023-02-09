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
    renderedHexagons: {
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
          [zoom]: [...hexagons],
        },
      })),
    // clear hexagons for a given zoom level
    clearHexagons: (zoom) =>
      set((state) => ({
        hexagons: {
          ...state.hexagons,
          [zoom]: [],
        },
      })),
    transferRenderedHexagons: (zoom) =>
      set((state) => ({
        renderedHexagons: {
          ...state.renderedHexagons,
          [zoom]: [...state.hexagons[zoom], ...state.renderedHexagons[zoom]],
        },
      })),
    retransferRenderedHexagons: (zoom) =>
      set((state) => ({
        hexagons: {
          ...state.hexagons,
          [zoom]: [...state.renderedHexagons[zoom]],
        },
      })),
  }))
);

export default useHexagonsStore;
