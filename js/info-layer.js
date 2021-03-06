// define layers outside the function
// Popup overlay

var popup = new ol.Overlay.Popup (
  {	popupClass: "default orange", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onshow: function(){ console.log("You opened the box"); },
    onclose: function(){ console.log("You close the box"); },
    positioning: 'top-center',
    autoPan: true,
    autoPanAnimation: { duration: 250 }
  });

// Vector Layer
  var infoSource = new ol.source.Vector({
  url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
    'version=1.1.0' +
      '&request=GetFeature' +
      '&typename=explore:extra_points_layer' +
    '&outputFormat=application/json',
  format: new ol.format.GeoJSON()
});

 var infoLayer = new ol.layer.Vector({
   name: 'Additional information points',
   source: infoSource, 
   style: new ol.style.Style({ image: new ol.style.Icon({ src:"infopoint.svg", scale: 1.5 }) })
 });

// Control Select
var select = new ol.interaction.Select({
     //condition: ol.events.condition.pointerMove,
     style:  new ol.style.Style({ image: new ol.style.Icon({ src:"infopoint.svg", scale: 1.5 }) })
});

function makePopupContent(feature) {
  var content = "";
  content += "<b>" + feature.get("title") + "</b>";
  content += "<p><p><p>";
  content += "<img src='"+feature.get("img")+"'/>";
  content += "<i>Image: "
  if (feature.get("img_captio")) {
  content += feature.get("img_captio")+"</i>";
} else {
  content += feature.get("img_catio")+"</i>";
}
  content += "<p>";
  content += feature.get("text");
  content += "<p>";
  content += feature.get("url_text");
  if (feature.get("url") != "") {
  content += "<a href="+feature.get("url")+" title='Info'> here.</a>";
  }


  return content;
}
// On selected => show/hide popup
select.getFeatures().on(['add'], function(e) {
  var feature = e.element;
  var content = makePopupContent(feature);
  popup.show(feature.getGeometry().getFirstCoordinate(), content);
});
select.getFeatures().on(['remove'], function(e) {
  popup.hide();
});

 function show_info_layer() {
     map.addOverlay(popup);
     window.topLayer = infoLayer;
     map.addLayer(infoLayer);
     infoLayer.setZIndex(map.getLayers().getArray().length);
     map.addInteraction(select);
 }

 function hide_info_layer() {
     popup.hide();
     select.getFeatures().clear();
     map.removeLayer(infoLayer);
     map.removeInteraction(select);
     map.removeOverlay(popup);
 }
