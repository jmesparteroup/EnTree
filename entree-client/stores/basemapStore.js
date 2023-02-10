import create from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

const BASEMAPS = {
  Streets: "arcgis-streets",
  Imagery: "arcgis-imagery",
};

const useBaseMapStore = create(
  subscribeWithSelector((set) => ({
    baseMap: BASEMAPS.Streets,
    baseMapKey: "Streets",
    setBaseMap: (baseMapKey) => set({ baseMap: BASEMAPS[baseMapKey], baseMapKey }),
  }))
);

export default useBaseMapStore;
