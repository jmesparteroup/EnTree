// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";
import TreeService from "../../services/treeService";
import HexagonService from "../../services/hexagonService";
import useCityStore from "../../stores/cityStore";
import useOpenAddTreesStore from "../../stores/openAddTreesStore";
import useNotificationStore from "../../stores/notificationStore";
import useBaseMapStore from "../../stores/basemapStore";
import useMapOptionsStore from "../../stores/mapOptionsStore";

import MAP_CONFIG from "../../constants/map";
import useSelectedTreeStore from "../../stores/selectTreesStore";

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

// given certain ranges, return a shade of green for polygons and hexagons
// color should be an array of 4 values: [r, g, b, a] lighter for lower values, darker for higher values

function calculateColor(startColor, endColor, minValue, maxValue, value) {
  // Convert the start and end colors to RGB arrays
  const startColorRgb = hexToRgb(startColor);
  const endColorRgb = hexToRgb(endColor);

  // Calculate the percentage that the value is between the min and max values
  const percentage = (value - minValue) / (maxValue - minValue);

  // Calculate the RGB values for the color at the given percentage between the start and end colors
  const colorRgb = [
    Math.round(
      startColorRgb[0] + (endColorRgb[0] - startColorRgb[0]) * percentage
    ),
    Math.round(
      startColorRgb[1] + (endColorRgb[1] - startColorRgb[1]) * percentage
    ),
    Math.round(
      startColorRgb[2] + (endColorRgb[2] - startColorRgb[2]) * percentage
    ),
  ];

  // Convert the RGB values back to a hex color code
  const colorHex = rgbToHex(colorRgb);

  return colorHex;
}

// Helper function to convert a hex color code to an RGB array
function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16);
  const g = parseInt(hex.substring(3, 5), 16);
  const b = parseInt(hex.substring(5, 7), 16);
  return [r, g, b];
}

// Helper function to convert an RGB array to a hex color code
function rgbToHex(rgb) {
  return (
    "#" +
    componentToHex(rgb[0]) +
    componentToHex(rgb[1]) +
    componentToHex(rgb[2])
  );
}

// Helper function to convert a number to a two-digit hex string
function componentToHex(c) {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

const COLOR_CODE_HEATMAPS = {
  hexagons: {
    14: [
      [0, [237, 248, 233, 0.2]],
      [10, [237, 248, 233, 0.75]],
      [100, [186, 228, 179, 0.75]],
      [200, [116, 196, 118, 0.75]],
      [1000, [49, 163, 84, 0.75]],
      [5000, [0, 109, 44, 0.75]],
    ],
    15: [
      [0, [237, 248, 233, 0.2]],
      [5, [237, 248, 233, 0.65]],
      [50, [186, 228, 179, 0.65]],
      [100, [116, 196, 118, 0.65]],
      [500, [49, 163, 84, 0.65]],
      [5000, [0, 109, 44, 0.65]],
    ],
    16: [
      [0, [237, 248, 233, 0.2]],
      [5, [237, 248, 233, 0.65]],
      [20, [186, 228, 179, 0.65]],
      [50, [116, 196, 118, 0.65]],
      [200, [49, 163, 84, 0.65]],
      [1000, [0, 109, 44, 0.65]],
    ],
    17: [
      [0, [237, 248, 233, 0.2]],
      [3, [237, 248, 233, 0.65]],
      [8, [186, 228, 179, 0.65]],
      [20, [116, 196, 118, 0.65]],
      [50, [49, 163, 84, 0.65]],
      [200, [0, 109, 44, 0.65]],
    ],
  },
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

const createPolygon = (polygonData, color, borderOnly) => {
  // Create a polygon geometry
  const polygon = {
    type: "polygon", // autocasts as new Polygon()
    rings: polygonData,
  };

  const polygonOutlineSymbol = {
    // the polygon fill color
    type: "simple-fill", //
    color: color,
    outline: borderOnly
      ? {
          color: [255, 255, 255, 0.8], // White
          width: 1,
        }
      : {
          color: [250, 128, 114],
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
  // DECLARE HOOKS AND STORES
  const mapRef = useRef(null);
  const location = useGeoLocation();

  const baseMap = useBaseMapStore((state) => state.baseMap);

  const trees = useTreesStore((state) => state.trees);
  const treesRendered = useTreesStore((state) => state.treesRendered);
  const setTreesRendered = useTreesStore((state) => state.setTreesRendered);
  const addTrees = useTreesStore((state) => state.addTrees);
  const clearTrees = useTreesStore((state) => state.clearTrees);
  const transferRenderedTrees = useTreesStore(
    // transfer rendered trees to the store
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
  const setHighlightedIndex = useNewTreesStore(
    // set highlighted index for new trees
    (state) => state.setHighlightedIndex
  );

  const cityPolygons = useCityStore((state) => state.polygons);
  const addCityPolygons = useCityStore((state) => state.addPolygons);

  const openAddTrees = useOpenAddTreesStore((state) => state.openAddTrees);

  const setMessage = useNotificationStore((state) => state.setMessage);
  const setStatus = useNotificationStore((state) => state.setStatus);

  const mapOptions = useMapOptionsStore((state) => state.mapOptions);
  const selectCities = useMapOptionsStore((state) => state.selectCities);

  const setSelectedTree = useSelectedTreeStore(
    (state) => state.setSelectedTree
  );
  const removeSelectedTree = useSelectedTreeStore(
    (state) => state.removeSelectedTree
  );

  const getCityPolygons = async () => {
    setStatus("loading");
    setMessage("Fetching City Data");

    let cityPromises = MAP_CONFIG.DEFAULT_CITIES.map(async (city) => {
      const data = await TreeService.getTreesByCity(city);
      return {
        city: city,
        ...data,
      };
    });

    let cityPolygonsData = await Promise.all(cityPromises);
    addCityPolygons(cityPolygonsData);

    setStatus("success");
    setMessage("City Data Loaded");
  };

  const getTrees = async (lat, lng, trees) => {
    setStatus("loading");
    setMessage("Fetching Trees");

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

      let updatedHexagonsCount = 0;

      const newHexagons = data.filter((hexagon) => {
        // find if hexagon is already in store then edit the count of the one in store
        const hexagonInStore = hexagons?.find(
          // note that this gives us the pointer to the item in the array itself
          (h) => h.hexId === hexagon.hexId
        );
        if (hexagonInStore) {
          if (hexagonInStore.count !== hexagon.count) {
            updatedHexagonsCount++;
          }
          hexagonInStore.count = hexagon.count;
          return false;
        }
        return true;
      });

      addHexagons(newHexagons, zoom);
      if (updatedHexagonsCount > 0) {
        setMessage(
          `${updatedHexagonsCount} hexagons updated. ${`${newHexagons.length} new hexagons loaded`}`
        );
      } else {
        setMessage(
          `${
            newHexagons.length === 0
              ? "No new hexagons found within the area."
              : `${newHexagons.length} new hexagons loaded`
          } `
        );
      }
    }
    setStatus("success");
  };

  const renderTrees = (graphicsLayer, trees) => {
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

      graphic.attributes = {
        treeId: tree.treeId,
        userId: tree.userId,
        lat: lat,
        lng: lng,
      };

      graphicsLayer.add(graphic);
    });

    setTreesRendered(trees?.length);
  };

  const addLabels = (labelLayer, graphic, label) => {
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

    labelLayer.add(textGraphic);
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
          attributes: {
            clientIdentifier: tree.clientIdentifier,
          }
        });

        // add to the new trees layer
        newTreesLayer.add(graphic);

        // return graphic;
      });
    } catch (error) {
      console.log(error);
    }
  };

  const renderPolygons = (
    graphicsLayer,
    state,
    showFull,
    labelLayer,
    cityOutlinesLayer
  ) => {
    try {
      // Get polygon color
      setTreesRendered(-1);

      state.cities?.forEach((cityData) => {
        // if city is not selected, skip
        if (state.mapOptions.showSelect && !state.selectCities[cityData.city])
          return;

        let color;

        if (showFull) {
          color = COLOR_CODE_HEATMAPS.polygons.find((colorCode) => {
            return cityData.trees < colorCode[0];
          })[1];
        } else {
          color = [255, 255, 255, 0];
        }

        cityData.polygons.map((polygonData) => {
          const [polygon, simpleFillSymbol] = createPolygon(
            polygonData,
            color,
            showFull
          );
          const graphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol,
          });

          if (showFull) {
            graphicsLayer.add(graphic);
            addLabels(labelLayer, graphic, cityData.trees);
          } else {
            cityOutlinesLayer.add(graphic);
          }
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  const renderHexagons = (
    graphicsLayer,
    hexagons,
    zoom,
    state,
    labelLayer,
    zeroTreesLayer
  ) => {
    setTreesRendered(-1);
    // CURRENTLY IMPLEMENTED: show hexagons
    hexagons[zoom]?.map((hexagon) => {
      // if mapOptions is set to show only selected cities, then only render hexagons that are in the selected cities
      if (state.mapOptions.showSelect) {
        const city = hexagon.cities.find((city) => {
          const result = state.selectCities[city];
          return result;
        });
        if (!city) return;
      }

      // get hexagon color
      // const color = COLOR_CODE_HEATMAPS.hexagons[zoom].find((colorCode) => {
      //   return hexagon.count <= colorCode[0];
      // })[1];
      const color = COLOR_CODE_HEATMAPS.hexagons[zoom].find((colorCode) => {
        return hexagon.count < colorCode[0];
      })[1];

      const [polygon, simpleFillSymbol] = createPolygon(
        hexagon.hexagon,
        color,
        true
      );
      const graphic = new Graphic({
        geometry: polygon,
        symbol: simpleFillSymbol,
      });
      // add a text symbol to the center of the hexagon
      if (hexagon.count === 0) {
        zeroTreesLayer.add(graphic);
      } else {
        graphicsLayer.add(graphic);
        addLabels(labelLayer, graphic, hexagon.count);
      }
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
      zoomLevel: MAP_CONFIG.DEFAULT_ZOOM_LEVEL,
      newTrees: newTrees,
      firstLoad: true,
      openAddTrees: openAddTrees,
      baseMap: baseMap,
      mapOptions: mapOptions,
      selectCities: selectCities,
      highlight: null,
      selectedTree: null,
    };

    config.apiKey =
      "AAPK55c00e93bd0743829d697d33557eca05L_lRyhpFL28eYxnVDH20DmrLuF1ClNg0KB2FgYqLiOJvdVfFr_hew2HXu9F0Td18";

    const map = new Map({
      basemap: baseMap, // Basemap layer service
      highlightOptions: {
        color: "orange",
      },
    });

    const view = new MapView({
      map: map,
      center: [
        location?.coordinates?.lng || MAP_CONFIG.DEFAULT_LOCATION.lng,
        location?.coordinates?.lat || MAP_CONFIG.DEFAULT_LOCATION.lat,
      ], // Longitude, latitude
      zoom: MAP_CONFIG.DEFAULT_ZOOM_LEVEL, // Zoom level
      container: mapRef.current, // Div element
      padding: {
        top: 50,
        bottom: 0,
      },
    });

    // ADD LAYERS

    // graphic layer for most
    const graphicsLayer = new GraphicsLayer({ id: "graphicsLayer" });
    map.add(graphicsLayer);

    // layer for city outlines
    const cityOutlinesLayer = new GraphicsLayer({ id: "cityOutlinesLayer" });

    // create a new layer for the new trees
    const newTreesLayer = new GraphicsLayer({ id: "newTreesLayer" });
    map.add(newTreesLayer);

    const labelLayer = new GraphicsLayer({ id: "labelLayer" });
    map.add(labelLayer);

    // create a new layer for 0 tree hexagons
    const zeroTreesLayer = new GraphicsLayer({ id: "zeroTreesLayer" });
    map.add(zeroTreesLayer);

    const showLabelsSubscription = useMapOptionsStore.subscribe(
      (state) => state.showLabels,
      () => {
        // log
        console.log("Show Labels Changed");
        const showLabels = useMapOptionsStore.getState().showLabels;
        labelLayer.visible = showLabels;
      }
    );

    const mapOptionsSubscription = useMapOptionsStore.subscribe(
      (state) => state.mapOptions || state.selectCities,
      () => {
        // log
        console.log("Map Options Changed");
        localMapState.mapOptions = useMapOptionsStore.getState().mapOptions;
        labelLayer.removeAll();
        graphicsLayer.removeAll();
        // if zoom is in the hexagon range, render hexagons
        if (
          view.zoom < MAP_CONFIG.POINT_ZOOM_LEVEL &&
          view.zoom > MAP_CONFIG.POLYGON_ZOOM_LEVEL
        ) {
          renderHexagons(
            graphicsLayer,
            localMapState.renderedHexagons,
            localMapState.zoomLevel,
            localMapState,
            labelLayer,
            zeroTreesLayer
          );
          renderPolygons(
            graphicsLayer,
            localMapState,
            false,
            labelLayer,
            cityOutlinesLayer
          );
        }
        if (view.zoom < MAP_CONFIG.POLYGON_ZOOM_LEVEL) {
          renderPolygons(
            graphicsLayer,
            localMapState,
            true,
            labelLayer,
            cityOutlinesLayer
          );
        }
      }
    );

    const selectCitiesSubscription = useMapOptionsStore.subscribe(
      (state) => state.selectCities,
      () => {
        console.log("Select Cities Changed");
        localMapState.selectCities = useMapOptionsStore.getState().selectCities;
        labelLayer.removeAll();
        graphicsLayer.removeAll();
        if (
          view.zoom < MAP_CONFIG.POINT_ZOOM_LEVEL &&
          view.zoom > MAP_CONFIG.POLYGON_ZOOM_LEVEL
        ) {
          renderHexagons(
            graphicsLayer,
            localMapState.renderedHexagons,
            localMapState.zoomLevel,
            localMapState,
            labelLayer,
            zeroTreesLayer
          );
          renderPolygons(
            graphicsLayer,
            localMapState,
            false,
            labelLayer,
            cityOutlinesLayer
          );
        }
        if (view.zoom < MAP_CONFIG.POLYGON_ZOOM_LEVEL) {
          renderPolygons(
            graphicsLayer,
            localMapState,
            true,
            labelLayer,
            cityOutlinesLayer
          );
        }
      }
    );

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
      }
    );

    const renderedHexagonsSubscription = useHexagonsStore.subscribe(
      (state) => state.renderedHexagons,
      () => {
        localMapState.renderedHexagons =
          useHexagonsStore.getState().renderedHexagons;
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

    view.on("click", async (event) => {
      if (!localMapState.openAddTrees) {
        if (view.zoom >= MAP_CONFIG.POINT_ZOOM_LEVEL) {
          const opts = {
            include: graphicsLayer,
          };

          let layerView = await view.whenLayerView(graphicsLayer);
          view.hitTest(event, opts).then((response) => {
            // check if a feature is returned from the hurricanesLayer
            if (response.results.length) {
              const graphic = response.results[0].graphic;
              console.log(graphic);
              if (localMapState.highlight) {
                localMapState.highlight.remove();
                // remove
                if (localMapState.selectedTree === graphic) {
                  localMapState.selectedTree = null;
                  localMapState.highlight = null;
                  removeSelectedTree();
                  console.log("removed selected tree");
                } else if (localMapState.selectedTree !== graphic) {
                  localMapState.selectedTree = graphic;
                  localMapState.highlight = layerView.highlight(graphic);
                  setSelectedTree(graphic);
                }
              } else {
                localMapState.highlight = layerView.highlight(graphic);
                localMapState.selectedTree = graphic;
                setSelectedTree(graphic);
              }
              return;
            }
          });
        }
        return;
      } // if the user is not adding a new tree, do nothing
      // view.popup.autoOpenEnabled = false;

      const opts = {
        include: newTreesLayer,
      };
      // hit test the new trees layer
      let hit;
      view.hitTest(event, opts).then((response) => {
        // check if a feature is returned from the hurricanesLayer
        if (response.results.length) {
          const graphic = response.results[0].graphic;
          console.log(graphic);
          // find index in localmapstate.newtrees
          const index = localMapState.newTrees.findIndex(
            (tree) => tree.clientIdentifier === graphic.attributes.clientIdentifier
          );
          setHighlightedIndex(index);
          return;
        }
        // Get the coordinates of the click on the view
        let lat = Math.round(event.mapPoint.latitude * 10000000) / 10000000;
        let lng = Math.round(event.mapPoint.longitude * 10000000) / 10000000;

        addNewTree({
          longitude: lng,
          latitude: lat,
          clientIdentifier: `newTree${Date.now()}`,
        });
      });
    });

    // Check if the user moves the map and releases it
    reactiveUtils.on(
      () => view,
      "drag",
      async () => {
        const { longitude, latitude } = view.center;

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
            renderTrees(graphicsLayer, localMapState.trees);
            transferRenderedTrees();
            clearTrees();
          }
        }

        // IF ZOOM LEVEL IS LESS THAN 18, SHOW HEXAGONS
        if (
          view.zoom < MAP_CONFIG.POINT_ZOOM_LEVEL &&
          view.zoom > MAP_CONFIG.POLYGON_ZOOM_LEVEL
        ) {
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
              localMapState.renderedHexagons[view.zoom]
            );

            renderHexagons(
              graphicsLayer,
              localMapState.hexagons,
              view.zoom,
              localMapState,
              labelLayer,
              zeroTreesLayer
            );
            transferRenderedHexagons(
              view.zoom,
              localMapState.hexagons[view.zoom] || ["1"]
            );
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

        // IF ZOOM IS LESS THAN 18, SHOW TREES
        if (view.zoom >= 18) {
          // IF PREVIOUS ZOOM LEVEL IS BELOW 18 CLEAR GRAPHICS
          if (localMapState.zoomLevel < MAP_CONFIG.POINT_ZOOM_LEVEL) {
            labelLayer.removeAll();
            graphicsLayer.removeAll();
            localMapState.zoomLevel = view.zoom;
          }

          if (localMapState.treesRendered === -1) {
            localMapState.viewCenter = [longitude, latitude];
            await getTrees(latitude, longitude, localMapState.trees);
            renderTrees(graphicsLayer, localMapState.trees);
            renderTrees(graphicsLayer, localMapState.renderedTrees);
            clearTrees();
          }
        }

        // IF ZOOM LEVEL IS LESS THAN 18, SHOW HEXAGONS
        if (
          view.zoom < MAP_CONFIG.POINT_ZOOM_LEVEL &&
          view.zoom > MAP_CONFIG.POLYGON_ZOOM_LEVEL
        ) {
          // IF CURRENT ZOOM == PREVIOUS ZOOM, DO NOTHING
          if (
            localMapState.zoomLevel !== view.zoom ||
            localMapState.firstLoad
          ) {
            labelLayer.removeAll();
            graphicsLayer.removeAll();
            localMapState.zoomLevel = view.zoom;

            await getHexagons(
              view.zoom,
              latitude,
              longitude,
              localMapState.renderedHexagons[view.zoom]
            );

            if (!localMapState.hexagons[view.zoom]) return;

            renderHexagons(
              graphicsLayer,
              localMapState.hexagons,
              view.zoom,
              localMapState,
              labelLayer,
              zeroTreesLayer
            );

            renderHexagons(
              graphicsLayer,
              localMapState.renderedHexagons,
              view.zoom,
              localMapState,
              labelLayer,
              zeroTreesLayer
            );

            console.log(
              "localMapState.hexagons[view.zoom]",
              localMapState.hexagons[view.zoom]
            );
            transferRenderedHexagons(
              view.zoom,
              localMapState.hexagons[view.zoom]
            );
            clearHexagons(view.zoom);
            renderPolygons(
              graphicsLayer,
              localMapState,
              false,
              labelLayer,
              cityOutlinesLayer
            );

            localMapState.firstLoad = false;
          }
        }
        if (view.zoom <= MAP_CONFIG.POLYGON_ZOOM_LEVEL) {
          localMapState.zoomLevel = view.zoom;
          await getCityPolygons();
          labelLayer.removeAll();
          graphicsLayer.removeAll();

          renderPolygons(
            graphicsLayer,
            localMapState,
            true,
            labelLayer,
            cityOutlinesLayer
          );
        }
        // always render new trees
      }
    );

    // move label layer to the top
    let ind = map.layers.findIndex((layer) => {
      return layer.id === "labelLayer";
    });
    map.layers.reorder(map.layers.getItemAt(ind), map.layers.length - 1);
    ind = map.layers.findIndex((layer) => {
      return layer.id === "newTreesLayer";
    });
    map.layers.reorder(map.layers.getItemAt(ind), map.layers.length - 2);

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
        mapOptionsSubscription();
        selectCitiesSubscription();
        showLabelsSubscription();
      }
    };
  }, []);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-full" ref={mapRef}></div>
    </div>
  );
}
