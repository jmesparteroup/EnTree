// use @arcgis/core to create a map
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import config from "@arcgis/core/config";
import * as watchUtils from "@arcgis/core/core/watchUtils";

import { useEffect, useRef } from "react";
import useGeoLocation from "../../hooks/useGeoLocation";

function EntreeMap() {
  const mapRef = useRef(null);
  const location = useGeoLocation();
  const DEFAULT_LOCATION = { lng: 121.072489, lat: 14.648881 };

  useEffect(() => {
    config.apiKey =
      "AAPK55c00e93bd0743829d697d33557eca05L_lRyhpFL28eYxnVDH20DmrLuF1ClNg0KB2FgYqLiOJvdVfFr_hew2HXu9F0Td18";

    const map = new Map({
      basemap: "arcgis-streets", // Basemap layer service
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

    watchUtils.when(view, "stationary", () => {
      const long = view.center.longitude;
      const lat = view.center.latitude;
      console.log(long, lat); // successfully catches venter of view
      console.log(view.zoom); // successfully catches zoom level
    });

    return () => {
      if (view) {
        view.container = null;
      }
    };
  }, []);

  return (
    <div className="h-full overflow-y-hidden">
      <div className="h-full w-100 mx-5" ref={mapRef}></div>
    </div>
  );
}

export default EntreeMap;
