import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";

import Head from "next/head";

import useTreesStore from "../../stores/treesStore";
import useHexagonsStore from "../../stores/hexagonsStore";
import useNewTreesStore from "../../stores/newTreesStore";
import useBaseMapStore from "../../stores/basemapStore";
import useOpenAddTreesStore from "../../stores/openAddTreesStore";
import useUserStore from "../../stores/userStore";
import useSelectedTreeStore from "../../stores/selectTreesStore";

import TreeService from "../../services/treeService";

import BaseMapSelect from "../../components/display/BaseMapSelect";
import AddTrees from "../../components/display/AddTrees";
import Notification from "../../components/display/Notification";
import MapOptions from "../../components/display/MapOptions";
import SelectedTree from "../../components/display/SelectedTreeDialogue";
import ZoomIndicator from "../../components/display/ZoomIndicator";
import InfoDialogue from "../../components/display/InfoDialogue";

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/ArcGISMap"),
  {
    ssr: false,
  }
);

const BASEMAPS = {
  Streets: "arcgis-streets",
  Satellite: "arcgis-imagery",
};

export default function Maps() {
  const setBaseMap = useBaseMapStore((state) => state.setBaseMap);
  const baseMapKey = useBaseMapStore((state) => state.baseMapKey);
  const user = useUserStore((state) => state.userState.user);

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      <Head>
        <title>Entree | Maps</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container className="w-full h-full rounded-md relative overflow-hidden">
        <div className="h-full w-full">
          <EntreeMapWithNoSSR
            useTreesStore={useTreesStore}
            useHexagonsStore={useHexagonsStore}
            useNewTreesStore={useNewTreesStore}
          />
        </div>
      </Container>
      {/* Notification popup on the lower right */}
      {/* menu to change view */}
      <BaseMapSelect
        className="absolute top-[4rem] left-2 "
        BASEMAPS={BASEMAPS}
        baseMapKey={baseMapKey}
        setBaseMapKey={setBaseMap}
      />
      {/*  */}
      <AddTrees
        className="absolute bottom-2 left-2 "
        useNewTreesStore={useNewTreesStore}
        TreeService={TreeService}
        useOpenAddTreesStore={useOpenAddTreesStore}
        useUserStore={useUserStore}
      />
      <MapOptions
        className={`bottom-2 ${user ? "left-[80px]" : "left-2"} absolute`}
        useNewTreesStore={useNewTreesStore}
        TreeService={TreeService}
      />
      <SelectedTree
        TreeService={TreeService}
        useTreesStore={useTreesStore}
        useSelectedTreeStore={useSelectedTreeStore}
        useUserStore={useUserStore}
      />
      <Notification className="absolute right-2 bottom-2" type="success" />
      <ZoomIndicator className="absolute right-2 top-[4rem]" />
      <InfoDialogue className="absolute right-2 top-[7.5rem]" />

      {/* form for adding new trees */}
    </div>
  );
}
