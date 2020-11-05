function getColor(depth){
  if (depth <=10){
    return 'yellow'
  }
  if (depth <=30){
    return 'lightgreen'
  }
  if (depth <=50){
    return 'green'
  }
  if (depth <=70){
    return 'darkgreen'
  }
  if (depth <=90){
    return 'orange'
  }
  if (depth > 90){
    return 'darkred'
  }
}

let queryUrl = ("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson")


d3.json(queryUrl, function(data) {


createFeatures(data.features);
});

function createFeatures(earthquakeData) { 

function onEachFeature(feature, layer) {
layer.bindPopup("<h3>" + feature.properties.place +
  "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
}
console.log(earthquakeData);

function pointToLayer(feature, latlng){
  let circle = L.circleMarker(latlng, {
    fillOpacity: 1,
    radius: feature.properties.mag * 3,
    color: getColor(feature.geometry.coordinates[2])

  });
return circle
}

let earthquakes = L.geoJSON(earthquakeData, {
onEachFeature: onEachFeature,
pointToLayer: pointToLayer
});

createMap(earthquakes);
}

function createMap(earthquakes) {

let streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/streets-v11",
accessToken: API_KEY
});

let darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "dark-v10",
accessToken: API_KEY
});

let satellite = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
maxZoom: 18,
id: 'mapbox.satellite',
accessToken: API_KEY
});

let baseMaps = {
"Street Map": streetmap,
"Dark Map": darkmap,
"Satellite": satellite
};

let overlayMaps = {
Earthquakes: earthquakes
};

let myMap = L.map("map", {
center: [
  37.09, -95.71
],
zoom: 5,
layers: [streetmap, earthquakes]
});

L.control.layers(baseMaps, overlayMaps, {
collapsed: false
}).addTo(myMap);

let legend = L.control({position: 'bottomright'});
legend.onAdd = function(map){

let div = L.DomUtil.create("div", 'info legend'),

depth = [0, 10, 30, 50, 70, 90],
color = [];

for (let i = 0; i<depth.length; i++){
  div.innerHTML +=
  '<i style="background:' + color[i] + '"></i> ' +
  depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');    
}
  return div;

};
legend.addTo(myMap);
}