var dsvFormat = require("d3-dsv").dsvFormat;
var normalize = require("@mapbox/geojson-normalize");

/**
 * Given a valid GeoJSON object, return a CSV composed of all decodable points.
 * @param {Object} geojson any GeoJSON object
 * @param {string} delim CSV or DSV delimiter: by default, ","
 * @param {boolean} [mixedGeometry=false] serialize just the properties
 * of non-Point features.
 * @example
 * var csvString = geojsonToCsv(geojsonObject)
 */
function geojsonToCsv(geojson, delim, mixedGeometry) {
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

        const properties = Object.keys(feature.properties).reduce(
          (c, k) => ((c[k.toLowerCase()] = feature.properties[k]), c),
          {}
        );

        return Object.assign({}, properties, {
          coordinates: JSON.stringify(feature.geometry.coordinates),
          type: feature.geometry.type,
          ...latLon
        });
      }

      if (mixedGeometry) {
        return feature.properties;
      }
    })
    .filter(Boolean);

  return dsvFormat(delim || ",").format(rows);
}

module.exports = geojsonToCsv;
