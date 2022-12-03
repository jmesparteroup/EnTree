// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

import useTreesStore from "../../stores/treesStore";
import TreeService from "../../services/treeService";

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

export default function EntreeMap({ baselayer, polygons }) {
  const mapRef = useRef(null);
  const location = useGeoLocation();

  const trees = useTreesStore((state) => state.trees);
  const addTrees = useTreesStore((state) => state.addTrees);

  const DEFAULT_LOCATION = { lng: 121.072489, lat: 14.648881 };

  useEffect(() => {
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

    // Add graphics layer

    // Check if the user moves the map and releases it
    reactiveUtils.when(
      () => view?.stationary === true,
      async () => {
        const long = view.center.longitude;
        const lat = view.center.latitude;
        console.log(`Center View: Long ${long} Lat ${lat}`); // successfully catches venter of view
        console.log(`Zoom level: ${view.zoom}`); // successfully catches zoom level

        // if zoon level is 15 or higher, show trees
        if (view.zoom >= 15) {
          //  remove all graphics
          view.graphics.removeAll();
          

          // get trees from server
          if (trees?.length === 0) {
            const data = await TreeService.getAllTrees();
            const treesResponse = await data.json();
            addTrees(treesResponse);
          }

          console.log("Showing trees:", trees);
          trees?.forEach((tree) => {
            // POINT(121.083367 14.592321) -> [121.083367, 14.592321]
            const [lng, lat] = tree.location
              .replace("POINT(", "")
              .replace(")", "")
              .split(" ");

            const point = {
              type: "point", // autocasts as new Point()
              longitude: lng,
              latitude: lat,
            };

            const simpleMarkerSymbol = {
              type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
              color: [226, 119, 40],
              outline: {
                // autocasts as new SimpleLineSymbol()
                color: [255, 255, 255],
                width: 1,
              },
            };

            const graphic = new Graphic({
              geometry: point,
              symbol: simpleMarkerSymbol,
            });

            view.graphics.add(graphic);
          });
        } 

        // if zoom level is less than 15, remove trees
        if (view.zoom < 15) {
          view.graphics.removeAll();

          polygons?.forEach((polygonData) => {
            const [polygon, simpleFillSymbol] = createPolygon(polygonData);
            const graphic = new Graphic({
              geometry: polygon,
              symbol: simpleFillSymbol,
            });
            view.graphics.add(graphic);
          });
        }
        
      }
    );

    return () => {
      if (view) {
        view.container = null;
      }
    };
  }, [baselayer, polygons]);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-full" ref={mapRef}></div>
    </div>
  );
}
