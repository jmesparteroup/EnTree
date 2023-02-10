// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

import TreeService from "../../services/treeService";
import HexagonService from "../../services/hexagonService";
import useCityStore from "../../stores/cityStore";
import useOpenAddTreesStore from "../../stores/openAddTreesStore";

import useNotificationStore from "../../stores/notificationStore";
import useBaseMapStore from "../../stores/basemapStore";


// STRUCTURE OF FILE
// 1. CONSTANTS
// 2. HELPER FUNCTIONS
// 3. MAIN FUNCTION
// 3.1 FUNCTIONS FOR QUERYING DATA
// 3.2 FUNCTIONS FOR RENDERING DATA
// 3.3 SUBSCRIPTIONS FOR THE STORES
// 3.4 MAIN LOGIC FOR RENDERING LAYERS
// 3.4.1 ON DRAG
// 3.4.2 ON ZOOM (STATIONARY) 
// 4. EXPORT


//  START OF CONSTANTS
const DEFAULT_CITIES = [
  "Caloocan",
  "Las Pinas",
  "Makati",
  "Malabon",
  "Mandaluyong",
  "Manila",
  "Marikina",
  "Muntinlupa",
  "Navotas",
  "Paranaque",
  "Pasay",
  "Pasig",
  "Quezon City",
  "San Juan",
  "Taguig",
  "Valenzuela",
  "Pateros",
];
const DEFAULT_LOCATION = { lng: 121.072489, lat: 14.648881 };
const DEFAULT_ZOOM_LEVEL = 14;
const POINT_ZOOM_LEVEL = 18;
const HEXAGON_ZOOM_LEVEL = 17;
const POLYGON_ZOOM_LEVEL = 13;

// given certain ranges, return a shade of green for polygons and hexagons
// color should be an array of 4 values: [r, g, b, a] lighter for lower values, darker for higher values

const COLOR_CODE_HEATMAPS = {
  // hexagons: [
  //   [10, [135, 212, 107, 0.85]],
  //   [200, [108, 202, 74, 0.85]],
  //   [500, [89, 186, 54, 0.85]],
  //   [1000, [83, 172, 50, 0.85]],
  //   [50000, [74, 154, 45, 0.85]],
  // ],
  hexagons: [
    [10, [237,248,233, 0.85]],
    [200, [186,228,179, 0.85]],
    [500, [116,196,118, 0.85]],
    [1000, [49,163,84, 0.85]],
    [50000, [0,109,44, 0.85]],
  ],
  polygons: [
    [10, [135, 212, 107, 0.5]],
    [100, [108, 202, 74, 0.85]],
    [1000, [89, 186, 54, 0.85]],
    [10000, [83, 172, 50, 0.85]],
    [100000, [74, 154, 45, 0.85]],
  ],
};

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

const createPoint = (pointData, color) => {
  const point = {
    type: "point", // autocasts as new Point()
    longitude: pointData.longitude,
    latitude: pointData.latitude,
  };

  const pointSymbol = {
    type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
    color: color,
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

export default function EntreeMap({
  useTreesStore,
  useHexagonsStore,
  useNewTreesStore,
}) {
  const mapRef = useRef(null);
  const location = useGeoLocation();

  const baseMap = useBaseMapStore((state) => state.baseMap);

  const trees = useTreesStore((state) => state.trees);
  const treesRendered = useTreesStore((state) => state.treesRendered);
  const setTreesRendered = useTreesStore((state) => state.setTreesRendered);
  const addTrees = useTreesStore((state) => state.addTrees);
  const clearTrees = useTreesStore((state) => state.clearTrees);
  const transferRenderedTrees = useTreesStore( // transfer rendered trees to the store
    (state) => state.transferRenderedTrees
  );
  const renderedTrees = useTreesStore((state) => state.renderedTrees);

  const hexagons = useHexagonsStore((state) => state.hexagons);
  const addHexagons = useHexagonsStore((state) => state.addHexagons);
  const renderedHexagons = useHexagonsStore((state) => state.renderedHexagons);
  const transferRenderedHexagons = useHexagonsStore(
    (state) => state.transferRenderedHexagons
  );
  const clearHexagons = useHexagonsStore((state) => state.clearHexagons);

  const newTrees = useNewTreesStore((state) => state.newTrees);
  const addNewTree = useNewTreesStore((state) => state.addNewTree);

  const cityPolygons = useCityStore((state) => state.polygons);
  const addCityPolygons = useCityStore((state) => state.addPolygons);

  const openAddTrees = useOpenAddTreesStore((state) => state.openAddTrees);

  const setMessage = useNotificationStore((state) => state.setMessage);
  const setStatus = useNotificationStore((state) => state.setStatus);

  const getCityPolygons = async () => {
    setStatus("loading");
    setMessage("Fetching City Data");

    let cityPromises = DEFAULT_CITIES.map(async (city) => {
      return await TreeService.getTreesByCity(city);
    });

    let cityPolygonsData = await Promise.all(cityPromises);
    addCityPolygons(cityPolygonsData);

    setStatus("success");
    setMessage("City Data Loaded");
  };

  const getTrees = async (lat, lng, trees) => {
    setStatus("loading");
    setMessage("Fetching Trees");

    console.log("Trees:", trees)

    const data = await TreeService.getTreesByProximity(lat, lng, 500);
    if (data) {
      // remove trees that are already in store
      const newTrees = data.filter((tree) => {
        return !trees.some((t) => t.id === tree.id);
      });
      addTrees(newTrees);
    }

    setStatus("success");
    setMessage("Trees Loaded");
  };

  const getHexagons = async (zoom, lat, lng, hexagons) => {
    setStatus("loading");
    setMessage("Fetching Hexagons");
    const data = await HexagonService.getHexagons(zoom, lat, lng);

    if (data?.length > 0) {
      // remove hexagons that are already in store
      console.log("Newly Pulled Hexagons:", data);
      console.log("Hexagons:", hexagons);
      console.log("Length of Hexagons Before:", data?.length);
      const newHexagons = data.filter((hexagon) => {
        return !hexagons[zoom].some((h) => h.hexId === hexagon.hexId);
      });
      console.log("Length of Hexagons After:", data?.length);

      addHexagons(newHexagons, zoom);
    }
    setStatus("success");
    setMessage("Hexagons Loaded");
  };

  const renderTrees = (view, trees) => {
    trees?.forEach((tree) => {
      // POINT(121.083367 14.592321) -> [121.083367, 14.592321]
      const [lng, lat] = tree.location
        .replace("POINT(", "")
        .replace(")", "")
        .split(" ");

      const [point, pointSymbol] = createPoint(
        {
          longitude: lng,
          latitude: lat,
        },
        "#228C22"
      );

      const graphic = new Graphic({
        geometry: point,
        symbol: pointSymbol,
      });

      view.graphics.add(graphic);
    });

    setTreesRendered(trees?.length);
  };

  const addLabels = (view, graphic, label) => {
    const textSymbol = {
      type: "text", // autocasts as new TextSymbol()
      color: "black",
      haloColor: "white",
      haloSize: "1px",
      text: label,
      xoffset: 0,
      yoffset: 0,
      font: {
        // autocast as new Font()
        size: 12,
        family: "sans-serif",
      },
    };

    const textGraphic = new Graphic({
      geometry: graphic?.geometry?.extent?.center,
      symbol: textSymbol,
    });

    view.graphics.add(textGraphic);
  };

  const renderNewTrees = (view, state, newTreesLayer) => {
    try {
      // loop through new trees and add them to the map
      if (state.newTrees.length === 0) return;

      state.newTrees?.forEach((tree) => {
        const { longitude, latitude } = tree;

        const [point, pointSymbol] = createPoint(
          {
            longitude: longitude,
            latitude: latitude,
          },
          "#1434A4"
        );

        const graphic = new Graphic({
          geometry: point,
          symbol: pointSymbol,
        });

        // add to the new trees layer
        newTreesLayer.add(graphic);

        // return graphic;
      });
      console.log("New Trees Layer added to map", view.graphics);
    } catch (error) {
      console.log(error);
    }
  };

  const renderPolygons = (view, state) => {
    // Get polygon color
    setTreesRendered(-1);

    // CURRENTLY IMPLEMENTED: show polygons
    state.cities?.forEach((cityData) => {
      // for each polygon in city.polygons array render polygon
      const color = COLOR_CODE_HEATMAPS.polygons.find((colorCode) => {
        return cityData.trees < colorCode[0];
      })[1];

      cityData.polygons.map((polygonData) => {
        const [polygon, simpleFillSymbol] = createPolygon(polygonData, color);
        const graphic = new Graphic({
          geometry: polygon,
          symbol: simpleFillSymbol,
        });
        view.graphics.add(graphic);
        addLabels(view, graphic, cityData.trees);
      });
    });
  };

  const renderHexagons = (view, hexagons, zoom) => {
    setTreesRendered(-1);
    // CURRENTLY IMPLEMENTED: show hexagons
    hexagons[zoom]?.map((hexagon) => {
      // get hexagon color
      const color = COLOR_CODE_HEATMAPS.hexagons.find((colorCode) => {
        return hexagon.count <= colorCode[0];
      })[1];

      const [polygon, simpleFillSymbol] = createPolygon(hexagon.hexagon, color);
      const graphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      // add a text symbol to the center of the hexagon

      view.graphics.add(graphic);
      addLabels(view, graphic, hexagon.count);
    });
  };

  // initialize the map with the view which are city heatmaps
  useEffect(() => {
    let localMapState = {
      trees: trees,
      treesRendered: treesRendered,
      renderedTrees: renderedTrees,
      cities: cityPolygons,
      hexagons: hexagons,
      renderedHexagons: renderedHexagons,
      viewCenter: [location?.coordinates?.lng, location?.coordinates?.lat],
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      newTrees: newTrees,
      firstLoad: true,
      openAddTrees: openAddTrees,
      baseMap: baseMap,
    };

    config.apiKey =
      "AAPK55c00e93bd0743829d697d33557eca05L_lRyhpFL28eYxnVDH20DmrLuF1ClNg0KB2FgYqLiOJvdVfFr_hew2HXu9F0Td18";

    const map = new Map({
      basemap: baseMap, // Basemap layer service
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

    // create a new layer for the new trees
    const newTreesLayer = new GraphicsLayer();
    map.add(newTreesLayer);

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

    const renderedTreesSubscription = useTreesStore.subscribe(
      (state) => state.renderedTrees,
      () => {
        localMapState.renderedTrees = useTreesStore.getState().renderedTrees;
      }
    );

    const hexagonsSubscription = useHexagonsStore.subscribe(
      (state) => state.hexagons,
      () => {
        localMapState.hexagons = useHexagonsStore.getState().hexagons;
        console.log("Hexagons", localMapState.hexagons);
      }
    );

    const renderedHexagonsSubscription = useHexagonsStore.subscribe(
      (state) => state.renderedHexagons,
      () => {
        localMapState.renderedHexagons =
          useHexagonsStore.getState().renderedHexagons;
        console.log("Rendered Hexagons", localMapState.renderedHexagons);
      }
    );

    const newTreesSubscription = useNewTreesStore.subscribe(
      (state) => state.newTrees,
      () => {
        const newState = useNewTreesStore.getState().newTrees;
        if (newState.length < localMapState.newTrees.length) {
          // clear the new trees layer
          newTreesLayer.removeAll();
          console.log("New Trees Layer cleared");
        }
        localMapState.newTrees = newState;
        renderNewTrees(view, localMapState, newTreesLayer);
      }
    );

    const citiesSubscription = useCityStore.subscribe(
      (state) => state.polygons,
      () => {
        //
        console.log("Cities changed");
        localMapState.cities = useCityStore.getState().polygons;
      }
    );

    const openAddTreesSubscription = useOpenAddTreesStore.subscribe(
      (state) => state.openAddTrees,
      () => {
        localMapState.openAddTrees =
          useOpenAddTreesStore.getState().openAddTrees;
      }
    );

    const baseMapSubscription = useBaseMapStore.subscribe(
      (state) => state.baseMap,
      () => {
        localMapState.baseMap = useBaseMapStore.getState().baseMap;
        map.basemap = localMapState.baseMap;
      }
    );

    view.on("click", (event) => {
      if (!localMapState.openAddTrees) return; // if the user is not adding a new tree, do nothing
      view.popup.autoOpenEnabled = false;

      // Get the coordinates of the click on the view
      let lat = Math.round(event.mapPoint.latitude * 10000000) / 10000000;
      let lng = Math.round(event.mapPoint.longitude * 10000000) / 10000000;

      addNewTree({
        longitude: lng,
        latitude: lat,
        description: "I am a new tree",
      });
    });

    // Check if the user moves the map and releases it
    reactiveUtils.on(
      () => view,
      "drag",
      async () => {
        const { longitude, latitude } = view.center;
        console.log("Map moved to", latitude, longitude);

        const distanceFromLastView = distanceCalculator(
          localMapState.viewCenter[1],
          localMapState.viewCenter[0],
          latitude,
          longitude
        );

        if (distanceFromLastView < 200 * 2 ** (18 - view.zoom)) return;


        // IF ZOOM IS LESS THAN 18, SHOW TREES
        if (view.zoom >= 18) {
          // IF PREVIOUS ZOOM LEVEL IS BELOW 18 CLEAR GRAPHICS
          if (
            localMapState.treesRendered === -1 ||
            distanceFromLastView > 200
          ) {
            localMapState.viewCenter = [longitude, latitude];
            await getTrees(latitude, longitude, localMapState.trees);
            renderTrees(view, localMapState.trees);
            transferRenderedTrees();
            clearTrees();
          }
        }

        // IF ZOOM LEVEL IS LESS THAN 18, SHOW HEXAGONS
        if (view.zoom < POINT_ZOOM_LEVEL && view.zoom > POLYGON_ZOOM_LEVEL) {
          // IF CURRENT ZOOM == PREVIOUS ZOOM, DO NOTHING
          if (
            distanceFromLastView >
            200 * 2 ** (18 - view.zoom) // 200 meters at zoom 18, 400 meters at zoom 17, 800 meters at zoom 16, etc.
          ) {
            localMapState.viewCenter = [longitude, latitude];
            await getHexagons(
              view.zoom,
              latitude,
              longitude,
              localMapState.renderedHexagons
            );
            renderHexagons(view, localMapState.hexagons, view.zoom);
            transferRenderedHexagons(view.zoom);
            clearHexagons(view.zoom);
          }
        }
        // always render new trees
      }
    );

    reactiveUtils.when(
      () => view?.stationary,
      async () => {
        const { longitude, latitude } = view.center;
        console.log("Map moved to", latitude, longitude);


        // IF ZOOM IS LESS THAN 18, SHOW TREES
        if (view.zoom >= 18) {
          // IF PREVIOUS ZOOM LEVEL IS BELOW 18 CLEAR GRAPHICS
          if (localMapState.zoomLevel < POINT_ZOOM_LEVEL) {
            view.graphics.removeAll();
            localMapState.zoomLevel = view.zoom;
          }

          if (
            localMapState.treesRendered === -1
          ) {
            localMapState.viewCenter = [longitude, latitude];
            await getTrees(latitude, longitude, localMapState.trees);
            renderTrees(view, localMapState.trees);
            renderTrees(view, localMapState.renderedTrees);
            clearTrees();
          }
        }

        // IF ZOOM LEVEL IS LESS THAN 18, SHOW HEXAGONS
        if (view.zoom < POINT_ZOOM_LEVEL && view.zoom > POLYGON_ZOOM_LEVEL) {
          // IF CURRENT ZOOM == PREVIOUS ZOOM, DO NOTHING
          if (
            localMapState.zoomLevel !== view.zoom ||
            localMapState.firstLoad
          ) {
            view.graphics.removeAll();
            localMapState.zoomLevel = view.zoom;
            await getHexagons(
              view.zoom,
              latitude,
              longitude,
              localMapState.hexagons
            );

            renderHexagons(view, localMapState.hexagons, view.zoom);
            renderHexagons(view, localMapState.renderedHexagons, view.zoom);
            transferRenderedHexagons(view.zoom);
            clearHexagons(view.zoom);

            localMapState.firstLoad = false;
          } 
        }
        if (view.zoom <= POLYGON_ZOOM_LEVEL) {
          localMapState.zoomLevel = view.zoom;
          await getCityPolygons();
          view.graphics.removeAll();
          console.log("Rendering Cities");
          console.log("Cities", localMapState.cities);

          renderPolygons(view, localMapState);
        }
        // always render new trees
      }
    );

    return () => {
      if (view) {
        view.container = null;
        treeRenderSubscription();
        treesSubscription();
        hexagonsSubscription();
        newTreesSubscription();
        citiesSubscription();
        openAddTreesSubscription();
        renderedHexagonsSubscription();
        renderedTreesSubscription();
        baseMapSubscription();
      }
    };
  }, []);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-full" ref={mapRef}></div>
    </div>
  );
}
