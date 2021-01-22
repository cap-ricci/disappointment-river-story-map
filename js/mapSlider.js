// first define layers and controls globally
// FIXME swipe control not working
//the layers must be added to the map first
var ctrl = new ol.control.Swipe();
function show_map_slider() {
    map.addControl(ctrl);
    // // Set stamen on left
    ctrl.addLayer(layers['watercolor']);
    ctrl.addLayer(layers['aerial'], true);
}

function noshow_map_slider() {
    // TODO
}
