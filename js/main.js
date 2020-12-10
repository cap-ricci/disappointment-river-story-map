overlays = [];
zindex = overlays.length; // zindex = number of current layers == index of topmost layer
activeLayer = "";
// define Layers
layers = defineLayerContainer();
var baseLayer = layers[isBase];
// define CONTROLS
var fs_ctrl = new ol.control.FullScreen();
// get overview map
var overviewMapControl = def_overviewMap();
var scale = new ol.control.ScaleLine();
// Mouse position control
var mousePositionControl = new ol.control.MousePosition({
  coordinateFormat: ol.coordinate.createStringXY(2),
  projection: 'EPSG:4326',
  coordinateFormat: function (coordinate) {
    return ol.coordinate.format(coordinate, '{y}, {x}', 2);
  },
  className: 'custom-mouse-position',
  target: document.getElementById('mouse-position'),
  undefinedHTML: '&nbsp;'
});
// define INTERACTION
var drz = new ol.interaction.DragRotateAndZoom();
// define OVERLAY
var overlay = new ol.Overlay({
  element: document.getElementById('overlay'),
  positioning: 'bottom-center'
});
// Create latitude and longitude and convert them to default projection
var trier = ol.proj.transform([6.64, 49.756], 'EPSG:4326', 'EPSG:3857');
// Instanciate a Map, set the object target to the map DOM id
var map = new ol.Map({
  target: 'map'
});
// Define VIEW
var view = new ol.View({
  center: trier,
  zoom: 10
})

map.setView(view);
map.addLayer(baseLayer);
// add control
map.addControl(fs_ctrl);
map.addControl(overviewMapControl);
map.addControl(mousePositionControl);
map.addControl(scale);
// add Interaction
map.addInteraction(drz);