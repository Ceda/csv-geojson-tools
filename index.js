const fs = require("fs");
const path = require("path");

const file = path.resolve("geojson/geo.json");

const buffer = fs.readFileSync(file);

const content = JSON.parse(buffer);

const geojsonToCsv = require(path.resolve(__dirname, "./to-csv.js"));

const csvString = geojsonToCsv(content, ";");

console.log(csvString);
