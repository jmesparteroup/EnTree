// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

import TreeService from "../../services/treeService";

//  START OF HELPER FUNCTIONS AND CONSTANTS

const DEFAULT_LOCATION = { lng: 121.072489, lat: 14.648881 };

const createPolygon = (polygonData) => {
  // Create a polygon geometry
  const polygon = {
    type: "polygon", // autocasts as new Polygon()
    rings: polygonData,
  };

  const polygonOutlineSymbol = {
    // the polygon fill color
    type: "simple-fill", //
    color: [227, 139, 79, 0.3], // Orange, opacity 80%
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
    color: [226, 119, 40],
    outline: {
      // autocasts as new SimpleLineSymbol()
      color: [255, 255, 255],
      width: 2,
    },
  };

  return [point, pointSymbol];
};

//  END OF HELPER FUNCTIONS

//  MAP COMPONENT

export default function EntreeMap({ baselayer, polygons, useTreesStore }) {
  const mapRef = useRef(null);
  const location = useGeoLocation();

  const trees = useTreesStore((state) => state.trees);
  const treesRendered = useTreesStore((state) => state.treesRendered);
  const setTreesRendered = useTreesStore((state) => state.setTreesRendered);
  const addTrees = useTreesStore((state) => state.addTrees);

  const getTrees = async () => {
    const data = await TreeService.getAllTrees();
    addTrees(data);
  };

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

    setTreesRendered(trees?.length);
    state.treesRendered = trees?.length;
  };

  const renderPolygons = (view, state) => {
    setTreesRendered(0);
    state.treesRendered = 0;

    // CURRENTLY IMPLEMENTED: show polygons
    state.polygons?.forEach((polygonData) => {
      const [polygon, simpleFillSymbol] = createPolygon(
        polygonData.polygon,
        polygonData.color
      );
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
      polygons: polygons,
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
      zoom: 13, // Zoom level
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

        // IF ZOOM IS LESS THAN 15, SHOW TREES
        if (view.zoom >= 16 && localMapState.treesRendered < trees?.length) {
          view.graphics.removeAll();
          await getTrees();
          renderTrees(view, localMapState);
        }

        // IF ZOOM LEVEL IS LESS THAN 15, SHOW POLYGONS
        if (view.zoom < 16) {
          view.graphics.removeAll();
          renderPolygons(view, localMapState);
        }
      }
    );

    return () => {
      if (view) {
        view.container = null;
        treeRenderSubscription();
        treesSubscription();
      }
    };
  }, [baselayer]);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-full" ref={mapRef}></div>
    </div>
  );
}
