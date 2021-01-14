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
    zoom: 3,
    center: [150000000, 7000000]
  }),
layers: [ layers['watercolor'], layers['aerial']]
});
// FIXME swipe control not working
var ctrl = new ol.control.Swipe();
map.addControl(ctrl);
// // Set stamen on left
ctrl.addLayer(layers['watercolor']);
ctrl.addLayer(layers['aerial'], true);
// // add control
// // map.addControl(fs_ctrl);
// map.addControl(overviewMapControl);
// // map.addControl(mousePositionControl);
// map.addControl(scale);
// // add Interaction
// map.addInteraction(drz);

// voyage line vector layers.. added at the beginning
//TODO probably need to be changed later
var lines = load_lines(storylines)
for (const key in lines) {
  if (Object.hasOwnProperty.call(lines, key)) {
    const element = lines[key];
    // map.addLayer(element)
  }
}