// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

import TreeService from "../../services/treeService";
import HexagonService from "../../services/hexagonService";

//  START OF CONSTANTS

const DEFAULT_LOCATION = { lng: 121.072489, lat: 14.648881 };
const DEFAULT_ZOOM_LEVEL = 15;
const POINT_ZOOM_LEVEL = 18;
const HEXAGON_ZOOM_LEVEL = 17;
const POLYGON_ZOOM_LEVEL = 13;

// given certain ranges, return a shade of green for polygons and hexagons
// color should be an array of 4 values: [r, g, b, a] lighter for lower values, darker for higher values

// "hexagons": [
//   [10, [135, 212, 107, 0.5]],
//   [50, [132, 211, 103, 0.5]],
//   [100, [118, 206, 86, 0.5]],
//   [500, [108, 202, 74, 0.5]],
//   [1000, [97, 198, 60, 0.5]],
//   [5000, [89, 186, 54, 0.5]],
//   [10000, [83, 172, 50, 0.5]],
//   [50000, [74, 154, 45, 0.5]],
// ]

const COLOR_CODE_HEATMAPS = {
  "hexagons": [
    [10, [135, 212, 107, 0.85]],
    [200, [108, 202, 74, 0.85]],
    [500, [89, 186, 54, 0.85]],
    [1000, [83, 172, 50, 0.85]],
    [50000, [74, 154, 45, 0.85]],
  ],
  "polygons": [
    [10, [135, 212, 107, 0.5]],
    [2000, [108, 202, 74, 0.85]],
    [10000, [89, 186, 54, 0.85]],
    [100000, [83, 172, 50, 0.85]],
    [1000000, [74, 154, 45, 0.85]],
  ]
  }

// START OF HELPER FUNCTIONS

const distanceCalculator = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const d = R * c; // in metres
  return d;
};

const createPolygon = (polygonData, color) => {
  // Create a polygon geometry
  const polygon = {
    type: "polygon", // autocasts as new Polygon()
    rings: polygonData,
  };

  const polygonOutlineSymbol = {
    // the polygon fill color
    type: "simple-fill", //
    color: color, 
    outline: {
      color: [255, 255, 255, 0.5],
      width: 1,
    },
  };
  return [polygon, polygonOutlineSymbol];
};

const createPoint = (pointData) => {
  const point = {
    type: "point", // autocasts as new Point()
    longitude: pointData.longitude,
    latitude: pointData.latitude,
  };

  const pointSymbol = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    color: "#228C22",
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 1,
    },
  };

  return [point, pointSymbol];
};

//  END OF HELPER FUNCTIONS

//  MAP COMPONENT

export default function EntreeMap({ baselayer, cities, useTreesStore, useHexagonsStore }) {
  const mapRef = useRef(null);
  const location = useGeoLocation();

  const trees = useTreesStore((state) => state.trees);
  const treesRendered = useTreesStore((state) => state.treesRendered);
  const setTreesRendered = useTreesStore((state) => state.setTreesRendered);
  const addTrees = useTreesStore((state) => state.addTrees);

  const hexagons = useHexagonsStore((state) => state.hexagons);
  const addHexagons = useHexagonsStore((state) => state.addHexagons);


  const getTrees = async (lat, lng) => {
    console.log("Getting Trees");
    const data = await TreeService.getTreesByProximity(lat, lng, 500);
    if (data) {
      // remove trees that are already in store
      const newTrees = data.filter((tree) => {
        return !trees.some((t) => t.id === tree.id);
      });
      addTrees(newTrees);
    }
  };

  const getHexagons = async (zoom) => {
    console.log("Getting Hexagons");
    const data = await HexagonService.getHexagons(zoom);
    if (data) {
      addHexagons(data, zoom);
    }
  }

  const renderTrees = (view, state) => {
    console.log(
      `Trees rendered: ${state.treesRendered} Trees length: ${state.trees?.length}`
    );

    state.trees?.forEach((tree) => {
      // POINT(121.083367 14.592321) -> [121.083367, 14.592321]
      const [lng, lat] = tree.location
        .replace("POINT(", "")
        .replace(")", "")
        .split(" ");

      const [point, pointSymbol] = createPoint({
        longitude: lng,
        latitude: lat,
      });

      const graphic = new Graphic({
        geometry: point,
        symbol: pointSymbol,
      });

      view.graphics.add(graphic);
    });

    setTreesRendered(state.trees?.length);
  };

  const renderPolygons = (view, state) => {
    // Get polygon color
    const color = COLOR_CODE_HEATMAPS.polygons.find((colorCode) => {
      return state.treesRendered < colorCode[0];
    })[1];

    // CURRENTLY IMPLEMENTED: show polygons
    state.cities?.forEach((polygonData) => {
      const [polygon, simpleFillSymbol] = createPolygon(
        polygonData.polygon,
        color
      );
      const graphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      view.graphics.add(graphic);
    });
  };

  const renderHexagons = (view, state, zoom) => {
    setTreesRendered(-1);
    // CURRENTLY IMPLEMENTED: show hexagons
    state.hexagons[zoom]?.map((hexagon) => {
      // get hexagon color
      const color = COLOR_CODE_HEATMAPS.hexagons.find((colorCode) => {
        return hexagon.count <= colorCode[0];
      })[1];


      const [polygon, simpleFillSymbol] = createPolygon(hexagon.hexagon, color);
      const graphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      view.graphics.add(graphic);
    });
  };

  // initialize the map with the view which are city heatmaps
  useEffect(() => {
    let localMapState = {
      trees: trees,
      treesRendered: treesRendered,
      cities: cities,
      hexagons: hexagons,
      viewCenter: [location?.coordinates?.lng, location?.coordinates?.lat],
      zoomLevel: DEFAULT_ZOOM_LEVEL,
    };

    const treeRenderSubscription = useTreesStore.subscribe(
      (state) => state.treesRendered,
      () => {
        localMapState.treesRendered = useTreesStore.getState().treesRendered;
      }
    );

    const treesSubscription = useTreesStore.subscribe(
      (state) => state.trees,
      () => {
        localMapState.trees = useTreesStore.getState().trees;
      }
    );

    const hexagonsSubscription = useHexagonsStore.subscribe(
      (state) => state.hexagons,
      () => {
        localMapState.hexagons = useHexagonsStore.getState().hexagons;
      }
    );


    config.apiKey =
      "AAPK55c00e93bd0743829d697d33557eca05L_lRyhpFL28eYxnVDH20DmrLuF1ClNg0KB2FgYqLiOJvdVfFr_hew2HXu9F0Td18";

    const map = new Map({
      basemap: baselayer, // Basemap layer service
    });

    const view = new MapView({
      map: map,
      center: [
        location?.coordinates?.lng || DEFAULT_LOCATION.lng,
        location?.coordinates?.lat || DEFAULT_LOCATION.lat,
      ], // Longitude, latitude
      zoom: DEFAULT_ZOOM_LEVEL, // Zoom level
      container: mapRef.current, // Div element
      padding: {
        top: 50,
        bottom: 0,
      },
    });

    // Check if the user moves the map and releases it
    reactiveUtils.when(
      () => view?.stationary,
      async () => {
        const { longitude, latitude } = view.center;

        console.log(`Center View: Long ${longitude} Lat ${latitude}`); // successfully catches venter of view
        console.log(`Zoom level: ${view.zoom}`); // successfully catches zoom level

        // IF ZOOM IS LESS THAN 18, SHOW TREES
        if (view.zoom >= 18) {
          // IF PREVIOUS ZOOM LEVEL IS BELOW 18 CLEAR GRAPHICS
          if (localMapState.zoomLevel < POINT_ZOOM_LEVEL) {
            view.graphics.removeAll();
            localMapState.zoomLevel = view.zoom;
          }

          const distanceFromLastView = distanceCalculator(
            localMapState.viewCenter[1],
            localMapState.viewCenter[0],
            latitude,
            longitude
          );

          if (
            localMapState.treesRendered === -1 ||
            distanceFromLastView > 200
          ) {
            localMapState.viewCenter = [longitude, latitude];
            await getTrees(latitude, longitude);
            renderTrees(view, localMapState);
          }
        }

        // IF ZOOM LEVEL IS LESS THAN 18, SHOW HEXAGONS
        if (view.zoom < POINT_ZOOM_LEVEL && view.zoom > POLYGON_ZOOM_LEVEL) {
          view.graphics.removeAll();
          localMapState.zoomLevel = view.zoom;
          if (localMapState.hexagons[view.zoom].length === 0) {
            await getHexagons(view.zoom);
          }
          renderHexagons(view, localMapState, view.zoom);
        }
        if (view.zoom <= POLYGON_ZOOM_LEVEL) {
          localMapState.zoomLevel = view.zoom;
          view.graphics.removeAll();
          console.log("rendering polygons");
          console.log(localMapState.cities);
          renderPolygons(view, localMapState);
        }
      }
    );

    return () => {
      if (view) {
        view.container = null;
        treeRenderSubscription();
        treesSubscription();
        hexagonsSubscription();
      }
    };
  }, [baselayer]);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-full" ref={mapRef}></div>
    </div>
  );
}
