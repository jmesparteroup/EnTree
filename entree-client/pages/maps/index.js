import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";

import useTreesStore from "../../stores/treesStore";
import useHexagonsStore from "../../stores/hexagonsStore";
import useNewTreesStore from "../../stores/newTreesStore";

import TreeService from "../../services/treeService";

import BaseMapSelect from "../../components/display/BaseMapSelect";
import AddTrees from "../../components/display/AddTrees";
import Notification from "../../components/display/Notification";
import useBaseMapStore from "../../stores/basemapStore";
import MapOptions from "../../components/display/MapOptions";

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/ArcGISMap"),
  {
    ssr: false,
  }
);

const BASEMAPS = {
  Streets: "arcgis-streets",
  Imagery: "arcgis-imagery",
};

export default function Maps() {
  const setBaseMap = useBaseMapStore((state) => state.setBaseMap);
  const baseMapKey = useBaseMapStore((state) => state.baseMapKey);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      <Container className="w-full h-full rounded-md relative overflow-hidden">
        <div className="h-full w-full">
          <EntreeMapWithNoSSR
            useTreesStore={useTreesStore}
            useHexagonsStore={useHexagonsStore}
            useNewTreesStore={useNewTreesStore}
          />
        </div>

        {/* menu to change view */}
        <BaseMapSelect
          className="top-2 left-2 absolute"
          BASEMAPS={BASEMAPS}
          baseMapKey={baseMapKey}
          setBaseMapKey={setBaseMap}
        />
        {/*  */}
        <AddTrees
          className="bottom-2 left-2 absolute"
          useNewTreesStore={useNewTreesStore}
          TreeService={TreeService}
        />
        <MapOptions
          className="bottom-2 left-[80px] absolute"
          useNewTreesStore={useNewTreesStore}
          TreeService={TreeService}
        />
      </Container>
      {/* Notification popup on the lower right */}
      <Notification className="absolute right-2 bottom-2" type="success" />
      {/* form for adding new trees */}
    </div>
  );
}
