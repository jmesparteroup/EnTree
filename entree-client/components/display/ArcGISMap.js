// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import Graphic from "@arcgis/core/Graphic";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils";

import { useEffect, useRef, useState } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

const createPolygon = (polygonData) => {
  // Create a polygon geometry
  const polygon = {
    type: "polygon", // autocasts as new Polygon()
    rings: polygonData,
  };

  const polygonOutlineSymbol = {
    // type only outlines the polygon
    type: "simple-line", // 
    color: [227, 139, 79, 0.8], // Orange, opacity 80%
    outline: {
      color: [255, 255, 255],
      width: 1,
    },
  };
  return [polygon, polygonOutlineSymbol];
};

function EntreeMap({ baselayer, polygons }) {
  const mapRef = useRef(null);
  const location = useGeoLocation();
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
        console.log(long, lat); // successfully catches venter of view
        console.log(view.zoom); // successfully catches zoom level

        // test
        console.log(polygons);
        polygons?.forEach((polygonData) => {
          const [polygon, simpleFillSymbol] = createPolygon(polygonData);
          const graphic = new Graphic({
            geometry: polygon,
            symbol: simpleFillSymbol,
          });
          view.graphics.add(graphic);
          console.log("added polygon");
        });
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

export default EntreeMap;
