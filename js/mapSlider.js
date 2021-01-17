function mapSlider() {
    // FIXME swipe control not working
    //the layers must be added to the map first
    var ctrl = new ol.control.Swipe();
    map.addControl(ctrl);
    // // Set stamen on left
    ctrl.addLayer(layers['watercolor']);
    ctrl.addLayer(layers['aerial'], true);
}
