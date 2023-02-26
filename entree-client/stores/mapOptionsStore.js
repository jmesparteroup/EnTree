import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const useMapOptionsStore = create(
  subscribeWithSelector((set) => ({
    openMapOptions: false,
    selectCities: {
      Caloocan: false,
      "Las Pinas": false,
      Makati: false,
      Malabon: false,
      Mandaluyong: false,
      Manila: false,
      Marikina: false,
      Muntinlupa: false,
      Navotas: false,
      Paranaque: false,
      Pasay: false,
      Pasig: false,
      "Quezon City": false,
      "San Juan": false,
      Taguig: false,
      Valenzuela: false,
      Pateros: false,
    },
    setOpenMapOptions: () =>
      set((state) => ({ openMapOptions: !state.openMapOptions })),
    // option to show certain cities
    mapOptions: {
      showAll: true,
      showSelect: false,
    },
    setMapOptions: (options) => {
      set((state) => ({ mapOptions: options }));
    },
    // option to show certain cities
    addSelectCity: (city) => {
      set((state) => ({
        selectCities: { ...state.selectCities, [city]: true },
      }));
    },
    removeSelectCity: (city) => {
      set((state) => ({
        selectCities: { ...state.selectCities, [city]: false },
      }));
    }
  }))
);

export default useMapOptionsStore;