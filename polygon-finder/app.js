// import fetch from 'node-fetch';
import fs from "fs";
import fetch from "node-fetch";

async function getCityPolygon(city) {
  console.log("Getting polygon for city: " + city);
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${city}&format=json&polygon_geojson=1`
    );
    const data = await response.json();
    console.log(data[0].geojson.coordinates[0].length);

    // process array into polygon for postgis
    const polygon = data[0].geojson.coordinates[0].map((point) => {
      return [`${point[0]} ${point[1]}`];
    });
    const string = `INSERT into cityPolygons VALUES(${city},'POLYGON(${polygon.join(
      ", "
    )})')`;
    fs.writeFileSync("raw.json", JSON.stringify(data));
    fs.writeFileSync("polygon.txt", string);
    console.log(`Polygon of ${city} written to file`);
  } catch (error) {
    console.log(`Error getting polygon for ${city}`);
    console.log(error.message);
  }
}

const NCR_Cities = [
  "Mandaluyong"
];

NCR_Cities.forEach(async (city) => {
  await getCityPolygon(city);
});
