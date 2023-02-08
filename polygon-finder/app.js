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
    const geojson = data[0].geojson
    console.log("Type: ", geojson.type)

    if (geojson.type == "Polygon") {
      // process array into polygon for postgis
      const polygon = geojson.coordinates[0].map((point) => {
        return [`${point[0]} ${point[1]}`];
      });
      let id = Math.floor((Math.random() * 100000) + 100000);
      const string = `INSERT INTO "cityPolygons" VALUES\n(${id}, '${city}','POLYGON((${polygon.join(", ")}))');\n`;
      fs.writeFileSync("raw.json", JSON.stringify(data));
      fs.writeFileSync("polygon.txt", string, { flag: 'a'});
      console.log(`Polygon of ${city} written to file`);
    } else {
      for (let p of geojson.coordinates) {
        const polygon = p[0].map((point) => {
          return [`${point[0]} ${point[1]}`];
        });
        let id = Math.floor((Math.random() * 100000) + 100000);
        const string = `INSERT INTO "cityPolygons" VALUES\n(${id}, '${city}','POLYGON((${polygon.join(", ")}))');\n`;
        fs.writeFileSync("raw.json", JSON.stringify(data));
        fs.writeFileSync("polygon.txt", string, { flag: 'a'});
        console.log(`Polygon of ${city} written to file`);
      }
    }
  } catch (error) {
    console.log(`Error getting polygon for ${city}`);
    console.log(error.message);
  }
}

const NCR_Cities = [
  "Taguig",
  "Valenzuela, Northern Manila District",
  "Pateros"
];

NCR_Cities.forEach(async (city) => {
  await getCityPolygon(city);
});
