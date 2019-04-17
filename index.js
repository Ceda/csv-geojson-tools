const fs = require("fs");
const path = require("path");

const file = path.resolve("geojson/geo.json");

const buffer = fs.readFileSync(file);

const content = JSON.parse(buffer);

/// Read csv
const csvFile = path.resolve("csv/test.csv");

const csvBuffer = fs.readFileSync(csvFile);

const csvContent = csvBuffer.toString();

var csv2geojson = require("csv2geojson");

// csv2geojson.csv2geojson(csvContent, function(err, data) {
//   console.log(data);
// });

const geoJsonFromCsv = csv2geojson.csv2geojson(csvContent, function(err, data) {
  // err has any parsing errors
  // data is the data.
  console.log(data.features);
});

// const geoJsonFromCsv = csv2geojson.auto(csvContent);
// console.log(geoJsonFromCsv);

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

// // Convert geojson to csv
// const geojsonToCsv = require(path.resolve(__dirname, "./to-csv.js"));
//
// const csvString = geojsonToCsv(content, ";");
//
// console.log(csvString);
