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
// display esri Deutschland layers names in info menu (works with DLM50 Naturschutzgebiete)
var displayFeatureInfo = function (pixel) {
  var features = [];
  map.forEachFeatureAtPixel(pixel, function (feature) {
    features.push(feature);
  });
  if (features.length > 0) {
    var info = [];
    var i, ii;
    for (i = 0, ii = features.length; i < ii; ++i) {
      info.push(features[i].get('name'));
    }
    document.getElementById('info').innerHTML = info.join(', ') || '(unknown)';
  } else {
    document.getElementById('info').innerHTML = '&nbsp;';
  }
};

map.setView(view);
map.addLayer(baseLayer);
// add control
map.addControl(fs_ctrl);
map.addControl(overviewMapControl);
map.addControl(mousePositionControl);
map.addControl(scale);
// add Interaction
map.addInteraction(drz);
map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  displayFeatureInfo(pixel);
});

map.on('click', function (evt) {
  displayFeatureInfo(evt.pixel);
});
map.on('singleclick', function (evt) {
  // when coordinate catcher is enabled, send coordinates to Google Maps
  var cs = document.getElementById("coordinate-switch")
  if (cs.checked) {
    var coords = ol.proj.toLonLat(evt.coordinate);
    var lat = coords[1];
    var lon = coords[0];
    url = 'https://www.google.com/maps/search/?api=1&query=' + lat + ',' + lon
    // open Google Maps in new window
    window.open(url, '_blank');
  }
  //when top layer is camping area, enable the SQL query, and show info card when user clicks on records
  else if (window.topLayer == 'camp_areas') {
    //update SQL query with new radius and coordinates
    xcoord = evt.coordinate[0].toString();
    ycoord = evt.coordinate[1].toString();
    var radius;
    if (document.getElementById('radius') == undefined) {
      radius = 5;
    } else {
      radius = document.getElementById('radius').value;
    }
    viewparameters = 'd:' + radius * 1000 + ';x:' + xcoord + ';y:' + ycoord
    layers['camp_areas'].getSource().updateParams({ 'LAYERS': 'KPS:camper_areas', 'viewparams': viewparameters });

    // get description field and display info cards
    var view = map.getView();
    var viewResolution = view.getResolution();
    var campInfo = document.getElementById('campInfo')
    campInfo.innerHTML = ''
    var url = layers[window.topLayer].getSource().getGetFeatureInfoUrl(
      evt.coordinate, viewResolution, view.getProjection(),
      { 'INFO_FORMAT': 'application/json', 'FEATURE_COUNT': 50, 'propertyName': 'description' });
    if (url) {
      fetch(url)
        .then(function (response) { return response.text(); })
        .then(function (html) {
          var geo = new ol.format.GeoJSON();
          var obj = JSON.parse(html);
          var features = geo.readFeatures(obj, "FeatureCollection");
          if (features.length > 0) {
            campInfo.innerHTML = '<h4>Selected camping sites</h4>'
          }
          var row = document.createElement('div');
          row.setAttribute('class', 'row')
          row.style.padding = '5px'
          campInfo.appendChild(row)
          for (var i = 0; i < features.length; i++) {
            var col = document.createElement('div');
            col.setAttribute('class', 'col-3 col')
            col.style.padding = '0 5px 0 0'
            var card = document.createElement('div');
            card.setAttribute('class', 'card h-100')
            cardbody = parseCampDescription(features[i].values_.description)
            card.appendChild(cardbody)
            col.appendChild(card)
            row.appendChild(col)
          }
          window.scrollTo(0, document.body.scrollHeight);
        });
    }

  }
})
$(document).ready(function () {
  // initialize vertical sliding panel
  var coordSwitch = { val: false };
  $('#controllers').BootSideMenu({
    side: "right",
    pushBody: false,
    width: '380px',
    duration: 250,
    closeOnClick: false
  });

  // Location search binded to search button ---------------------------------------------------------------------
  $("#GoButton").on('keypress click', function (e) {
    var Adresse = $("#AdressSearch");
    if (e.which === 13 || e.type === 'click') {
      $.getJSON('http://nominatim.openstreetmap.org/search?format=json&q=' + Adresse.val(), function (data) {
        var lat = parseFloat(data[0].lat);
        var lon = parseFloat(data[0].lon);
        map.getView().setZoom(13);
        map.getView().setCenter(ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'));
      });
    };
  });
});