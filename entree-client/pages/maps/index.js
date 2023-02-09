import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";

import useCityStore from "../../stores/cityStore";
import useTreesStore from "../../stores/treesStore";
import useHexagonsStore from "../../stores/hexagonsStore";
import useNewTreesStore from "../../stores/newTreesStore";

import TreeService from "../../services/treeService";
import HexagonService from "../../services/hexagonService";

import BaseMapSelect from "../../components/display/BaseMapSelect";
import AddTrees from "../../components/display/AddTrees";
import Notification from "../../components/display/Notification";

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
  const [baseMapKey, setBaseMapKey] = useState("Streets");

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      <Container className="w-full h-full rounded-md relative overflow-hidden">
        <div className="h-full w-full">
          <EntreeMapWithNoSSR
            baselayer={BASEMAPS[baseMapKey]}
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
          setBaseMapKey={setBaseMapKey}
        />
        {/*  */}
        <AddTrees
          className="bottom-2 left-2 absolute"
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
