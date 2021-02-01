// overlays = [];
// zindex = overlays.length; // zindex = number of current layers == index of topmost layer
// activeLayer = "";
// define Layers
layers = defineLayerContainer();
var baseLayer = layers[isBase];
// // define CONTROLS
// // var fs_ctrl = new ol.control.FullScreen();
// // get overview map
// var overviewMapControl = def_overviewMap();
// var scale = new ol.control.ScaleLine();
// // Mouse position control
// var mousePositionControl = new ol.control.MousePosition({
//   coordinateFormat: ol.coordinate.createStringXY(2),
//   projection: 'EPSG:4326',
//   coordinateFormat: function (coordinate) {
//     return ol.coordinate.format(coordinate, '{y}, {x}', 2);
//   },
//   className: 'custom-mouse-position',
//   target: document.getElementById('mouse-position'),
//   undefinedHTML: '&nbsp;'
// });
// define INTERACTION
// var drz = new ol.interaction.DragRotateAndZoom();
// define OVERLAY
// var overlay = new ol.Overlay({
//   element: document.getElementById('overlay'),
//   positioning: 'bottom-center'
// });
// Instanciate a Map, set the object target to the map DOM id

// The map
var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    projection: "EPSG:3857",
    zoom: 3,
    maxZoom: 6,
    minZoom:2,
    center: [150000000, 7000000]
  }),
layers: [ layers['watercolor']]
});
// // add control
// // map.addControl(fs_ctrl);
// map.addControl(overviewMapControl);
// // map.addControl(mousePositionControl);
// map.addControl(scale);
// // add Interaction
// map.addInteraction(drz);

// voyage line vector layers.. added at the beginning
//TODO probably need to be changed later
/*
var lines = load_lines(storylines)
for (const key in lines) {
  if (Object.hasOwnProperty.call(lines, key)) {
    const element = lines[key];
    map.addLayer(element)
  }
}
*/

//TESTTESTTEST loads geojson from native land. how to encapsulate in a vector layer?
fetch('https://native-land.ca/api/index.php?maps=territories')
  .then(function (response) {
    return response.json();
  })
  .then(function(json) {
    var geoJSON = {
  "type": "FeatureCollection",
  "features": json
 }
//  console.log(geoJSON) success
  })

 
