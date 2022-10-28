// import fetch from 'node-fetch';

import fetch from 'node-fetch'

async function getCityPolygon(city) {
   const response  = await fetch(`https://nominatim.openstreetmap.org/search?q=${city}&format=json&polygon_geojson=1`);
   const data = await response.json();
   console.log(data[0].geojson.coordinates[0].length);
}

getCityPolygon('Quezon City');
