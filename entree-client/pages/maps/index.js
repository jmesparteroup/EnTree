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

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/ArcGISMap"),
  {
    ssr: false,
  }
);

const DEFAULT_CITIES = ["Pasig City", "Mandaluyong City"];
const BASEMAPS = {
  Streets: "arcgis-streets",
  Imagery: "arcgis-imagery",
};

export default function Maps() {
  const [baseMapKey, setBaseMapKey] = useState("Streets");

  const addCityPolygon = useCityStore((state) => state.addPolygon);
  const cityPolygons = useCityStore((state) => state.polygons);

  const hexagons = useHexagonsStore((state) => state.hexagons);
  const addHexagons = useHexagonsStore((state) => state.addHexagons);

  // initialize the map with the view which are city heatmaps and trees
  useEffect(() => {
    const getCityPolygons = async () => {
      let cityPromises = DEFAULT_CITIES.map(async (city) => {
        const data = TreeService.getTreesByCity(city);
        return data;
      });

      let cityPolygons = await Promise.all(cityPromises);
      cityPolygons.forEach((city) => {
        console.log(city);
        addCityPolygon(city);
      });
    };

    const getHexagons = async (zoom) => {
      let hexagons = await HexagonService.getHexagons(zoom);
      addHexagons(hexagons, zoom);
    };

    getCityPolygons();
    getHexagons(14);
  }, []);

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <Container className="w-full h-full rounded-md relative">
        <div className="h-full w-full">
          <EntreeMapWithNoSSR
            baselayer={BASEMAPS[baseMapKey]}
            cities={cityPolygons}
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
        <AddTrees
          className="bottom-2 left-2 absolute"
          useNewTreesStore={useNewTreesStore}
          TreeService={TreeService}
        />
      </Container>
      {/* form for adding new trees */}
      {/* <Container className="h-full hidden md:flex md:w-1/3 m-2 rounded-lg flex-col">
        <div className="flex flex-col items-center ">
          <h1 className="text-center text-3xl font-bold w-full">Add Tree</h1>
        </div>
      </Container> */}
    </div>
  );
}
