const fs = require("fs");
const path = require("path");

const file = path.resolve("geojson/geo.json");

const buffer = fs.readFileSync(file);

const content = JSON.parse(buffer);

/// Read csv
const csvFile = path.resolve("csv/test.csv");

const csvBuffer = fs.readFileSync(csvFile);

const csvContent = csvBuffer.toString();

const csvGeojsonTools = require(path.resolve(
  __dirname,
  "./libs/csvGeojsonTools.js"
));

const geoJsonFromCsv = csvGeojsonTools.csv2geojson(csvContent, function(
  err,
  data
) {
  console.log(data.features);
});

const csvString = csvGeojsonTools.geojson2csv(content, ";");

console.log(csvString);

// // Json to CSV
// const converter = require("json-2-csv");
//
// converter
//   .json2csvAsync(content, { delimiter: { field: ";" } })
//   .then(response => {
//     console.log(response);
//   });

// // Geo Json validator
// const validator = require("geojson-validation");
//
// validator.valid(content, function(valid, errs) {
//   console.log(valid);
//   console.log(errs);
// });
