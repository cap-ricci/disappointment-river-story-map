overlays = [];
zindex = overlays.length; // zindex = number of current layers == index of topmost layer. here zindex=0
activeLayer = "";
// define Layers
layers = defineLayerContainer();
// var baseLayer = layers[isBase];
var scale = new ol.control.ScaleLine();
// define OVERLAY
// var overlay = new ol.Overlay({
//   element: document.getElementById('overlay'),
//   positioning: 'bottom-center'
// });

// Instanciate a Map, set the object target to the map DOM id
// The map
// TODO add scale, attribution
var map = new ol.Map({
  target: 'map',
  view: new ol.View({
    projection: "EPSG:3857",
    zoom: 3,
    maxZoom: 10,
    minZoom: 2,
    center: [-11000000, 7000000]
  }),
  layers: [layers[isBase]]
});
// change pointer when hovering feature
// TODO does it work?
map.on("pointermove", function (evt) {
  var hit = this.forEachFeatureAtPixel(evt.pixel, function (feature, layer) {
    return true;
  });
  if (hit) {
    this.getTargetElement().style.cursor = 'pointer';
  } else {
    this.getTargetElement().style.cursor = '';
  }
});