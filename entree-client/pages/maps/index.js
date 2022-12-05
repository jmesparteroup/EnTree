import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Container from "../../components/layout/Container";

import useCityStore from "../../stores/cityStore";
import useTreesStore from "../../stores/treesStore";
import useHexagonsStore from "../../stores/hexagonsStore";

import TreeService from "../../services/treeService";
import HexagonService from "../../services/hexagonService";

const EntreeMapWithNoSSR = dynamic(
  () => import("../../components/display/ArcGISMap"),
  {
    ssr: false,
  }
);

const DEFAULT_CITIES = ["Pasig City", "Mandaluyong City"];

export default function Maps() {
  const [openChangeView, setOpenChangeView] = useState(false);
  const [baseMapKey, setBaseMapKey] = useState("Topographic");

  const addCityPolygon = useCityStore((state) => state.addPolygon);
  const cityPolygons = useCityStore((state) => state.polygons);

  const hexagons = useHexagonsStore((state) => state.hexagons);
  const addHexagons = useHexagonsStore((state) => state.addHexagons);



  const BASEMAPS = {
    Topographic: "arcgis-topographic",
    Imagery: "arcgis-imagery",
    Streets: "arcgis-streets",
    Community: "arcgis-community",
  };

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

  const changeViewClickHandler = () => {
    setOpenChangeView((prevState) => !prevState);
    console.log(openChangeView);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      <Container className="w-full h-full rounded-md relative">
        <div className="h-full w-full">
          <EntreeMapWithNoSSR
            baselayer={BASEMAPS[baseMapKey]}
            cities={cityPolygons}
            useTreesStore={useTreesStore}
            useHexagonsStore={useHexagonsStore}
          />
        </div>

        {/* menu to change view */}
        <Container
          className="w-[100px] h-[100px] bottom-2 left-2 rounded-md absolute flex items-center text-gray-800 shadow-2xl cursor-pointer"
          onClick={changeViewClickHandler}
        >
          <div className="w-full h-full flex justify-center items-center">
            <button className="w-full h-full rounded-md border">
              {baseMapKey}
            </button>
          </div>
        </Container>
        {openChangeView ? (
          <Container
            className={`w-[510px] h-[100px] bottom-2 left-[112px] rounded-md absolute flex items-center text-gray-800 bg-transparent shadow-2xl cursor-pointer`}
          >
            {/* Buttons for normal, heatmap, hexagons */}
            <div className="w-full h-full flex justify-center items-center bg-transparent">
              {Object.keys(BASEMAPS).map((key) => (
                <button
                  key={key}
                  className="w-2/3 h-full rounded-md border bg-white border-gray-400"
                  onClick={() => setBaseMapKey(key)}
                >
                  {key}
                </button>
              ))}
            </div>
          </Container>
        ) : (
          <></>
        )}
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
