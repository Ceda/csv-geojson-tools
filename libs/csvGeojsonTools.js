"use strict";

var dsv = require("d3-dsv"),
  sexagesimal = require("@mapbox/sexagesimal"),
  normalize = require("@mapbox/geojson-normalize");

function keyCount(o) {
  return typeof o == "object" ? Object.keys(o).length : 0;
}

function autoDelimiter(x) {
  var delimiters = [",", ";", "\t", "|"];
  var results = [];

  delimiters.forEach(function(delimiter) {
    var res = dsv.dsvFormat(delimiter).parse(x);
    if (res.length >= 1) {
      var count = keyCount(res[0]);
      for (var i = 0; i < res.length; i++) {
        if (keyCount(res[i]) !== count) return;
      }
      results.push({
        delimiter: delimiter,
        arity: Object.keys(res[0]).length
      });
    }
  });

  if (results.length) {
    return results.sort(function(a, b) {
      return b.arity - a.arity;
    })[0].delimiter;
  } else {
    return null;
  }
}

/**
 * Silly stopgap for dsv to d3-dsv upgrade
 *
 * @param {Array} x dsv output
 * @returns {Array} array without columns member
 */
function deleteColumns(x) {
  delete x.columns;
  return x;
}

function csv2geojson(x, options, callback) {
  if (!callback) {
    callback = options;
    options = {};
  }

  options.delimiter = options.delimiter || "auto";

  var crs = options.crs || "";

  var features = [],
    featurecollection = { type: "FeatureCollection", features: features };

  if (crs !== "") {
    featurecollection.crs = { type: "name", properties: { name: crs } };
  }

  if (options.delimiter === "auto" && typeof x == "string") {
    options.delimiter = autoDelimiter(x);
    if (!options.delimiter) {
      callback({
        type: "Error",
        message: "Could not autodetect delimiter"
      });
      return;
    }
  }

  var numericFields = options.numericFields
    ? options.numericFields.split(",")
    : null;

  var parsed =
    typeof x == "string"
      ? dsv.dsvFormat(options.delimiter).parse(x, function(d) {
          if (numericFields) {
            for (var key in d) {
              if (numericFields.includes(key)) {
                d[key] = +d[key];
              }
            }
          }
          return d;
        })
      : x;

  if (!parsed.length) {
    callback(null, featurecollection);
    return;
  }

  var i;

  for (i = 0; i < parsed.length; i++) {
    const type = parsed[i]["type"];
    const coordinates = parsed[i]["coordinates"];

    delete parsed[i]["lon"];
    delete parsed[i]["lat"];
    delete parsed[i]["type"];
    delete parsed[i]["coordinates"];

    features.push({
      type: "Feature",
      properties: parsed[i],
      geometry: {
        type: type,
        coordinates: JSON.parse(coordinates)
      }
    });
  }

  callback(null, featurecollection);
}

function geojson2csv(geojson, delim) {
  var rows = normalize(geojson)
    .features.map(function(feature) {
      if (feature.geometry) {
        let latLon = {
          lon: null,
          lat: null
        };

        if (feature.geometry.type === "Point") {
          latLon = {
            lon: feature.geometry.coordinates[0],
            lat: feature.geometry.coordinates[1]
          };
        }

        return Object.assign({}, feature.properties, {
          coordinates: JSON.stringify(feature.geometry.coordinates),
          type: feature.geometry.type,
          ...latLon
        });
      }
    })
    .filter(Boolean);

  return dsv.dsvFormat(delim || ",").format(rows);
}

module.exports = {
  csv2geojson: csv2geojson,
  geojson2csv: geojson2csv
};
