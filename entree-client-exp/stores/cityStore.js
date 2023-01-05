import create from "zustand";

// polygons => [polygon]

// polygon: {
//   city: String,
//   polygon: Array,
//   trees: Array,
// }

const useCityStore = create((set) => ({
  polygons: [],
  addPolygon: (polygon) =>
    set((state) => ({ polygons: [...state.polygons, polygon] })),
  removePolygon: (polygon) =>
    set((state) => ({ polygons: state.polygons.filter((p) => p !== polygon) })),
  clearPolygons: () => set({ polygons: [] }),
  addPolygons: (polygons) => set({ polygons: [...polygons] }),
}));

export default useCityStore;