

// define natives land layer
function colorWithAlpha(color, alpha) {
    const [r, g, b] = Array.from(ol.color.asArray(color));
    if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
        [r, g, b] = [0, 0, 0]
    }
    //return ol.color.asString([r, g, b, alpha]);
    return 'rgba(' + r +", " + g + ", " + b + ", " + alpha +')'
}
    var nativesSource = new ol.source.Vector({
      url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
        'version=1.1.0' +
          '&request=GetFeature' +
          '&typename=explore:natives_canada' +
        '&outputFormat=application/json',
      format: new ol.format.GeoJSON()
    });

    var nativesLand = new ol.layer.Vector({
      name: 'Natives Land',
      source: nativesSource
    });

    nativesLand.setStyle(function(feature) {
      var hexColor = feature.get('color');
      var polyColour = colorWithAlpha(hexColor, 0.2);
      return new ol.style.Style({
         stroke: new ol.style.Stroke({
         color: 'white',
         width: 1,
       }),
       fill: new ol.style.Fill({
         color: polyColour
     }),
     text: new ol.style.Text ({
          text: map.getView().getZoom() > 2 ? feature.get('Name').toString() : '',
          font: 'bold 12px times arial',
          fill: 'black',
          stroke: new ol.style.Stroke({
          color: 'white',
          width: 1,
        }),
        }),
   })

});






function show_natives_layer() {
    window.topLayer = nativesLand;
    map.addLayer(nativesLand);

}

function hide_natives_layer() {
    map.removeLayer(nativesLand);
}
