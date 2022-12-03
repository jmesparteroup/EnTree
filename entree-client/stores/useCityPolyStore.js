import create from "zustand";

const useStore = create((set) => ({
  polygons: [],
  addPolygon: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  removePolygon: (polygon) =>
    set((state) => ({ polygons: state.polygons.filter((p) => p !== polygon) })),
  clearPolygons: () => set({ polygons: [] }),
}));

export default useStore;