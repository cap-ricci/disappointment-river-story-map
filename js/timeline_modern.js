// first define layers and controls globally
// load point features for timeline
function chainRequest(keys) {
  var typenames = [];
  keys.forEach(function(key) {
      elem = storylines[key];
      typenames.push(elem.points_name);
  })
  return typenames.join(",");
}


var timelinePointsSourceModern = new ol.source.Vector({
  url: "http://localhost:8080/geoserver/explore/wfs?service=WFS&" + "version=1.1.0" + "&request=GetFeature" + "&typename=explore:" + 
  chainRequest(['castner', 'mackay']) + 
  "&outputFormat=application/json",
  format: new ol.format.GeoJSON(),
});

// TODO maybe style points with an icon
var timelinePointsModern = new ol.layer.Vector({
  name: "points",
  source: timelinePointsSourceModern,
  // style: style()
});
////// TIMELINE INFORMATION
var listenerKey = timelinePointsSourceModern.on("change", function (e) {
  if (timelinePointsSourceModern.getState() == "ready") {
      ol.Observable.unByKey(listenerKey);
      tlineModern.refresh();
  }
});

// change point colour depending on voyage
timelinePointsModern.setStyle(function (feature) {
  console.log(feature.get("voyage"));
  let fillColor = storylines[feature.get("voyage")].color;

  return new ol.style.Style({
      image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({ color: fillColor }),
          stroke: new ol.style.Stroke({
              color: [255, 255, 255],
              width: 1,
          }),
      }),
  });
});

//Timeline control
var info = $(".options").html("");

var tlineModern = new ol.control.Timeline({
  className: "ol-zoomhover",
  source: timelinePointsSourceModern,
  graduation: "day",
  maxZoom: 6,
  minZoom: 3,
  zoomButton: true,
  getHTML: function (f) {
      //return '<img src="'+f.get('img')+'"/> '+(f.get('geo_name')||'');
      return '<div style="color: white; background-color:' + storylines[f.get("voyage")].color + '">' + f.get("geo_name") + "</div>";
  },
  getFeatureDate: function (f) {
      return f.get("date");
  },
  endFeatureDate: function (f) {
      var d = f.get("endDate");
      // Create end date
      if (!d) {
          d = new Date(f.get("date"));
          d = new Date(d.getTime() + (5 + 50 * 10 * 24 * 60 * 60 * 1000));
          f.set("endDate", d);
      }
      return d;
  },
});

// make popup overlay
var timelinepopupModern = new ol.Overlay.Popup({
  popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
  closeBox: true,
  onshow: function () {
      console.log("You opened the timeline box");
  },
  onclose: function () {
      console.log("You close the timeline box");
  },
  positioning: "top-center",
  autoPan: true,
  autoPanAnimation: { duration: 250 },
});

// Select a feature
tlineModern.on("select", function (e) {
  // Center map on feature
  map.getView().animate({
      center: e.feature.getGeometry().getCoordinates(),
      zoom: 8,
  });
  // Center time line on feature
  tlineModern.setDate(e.feature);
  // Select feature on the map
  timelineselectModern.getFeatures().clear();
  timelineselectModern.getFeatures().push(e.feature);

  var p = e.feature;
  if (p) {
      // Show info
      var content = makePopupContent(p);
      timelinepopupModern.show(p.getGeometry().getFirstCoordinate(), content);
  } else {
      $("#select").html("<p>Select an image.</p>");
  }
});

// Collapse the line
tlineModern.on("collapse", function (e) {
  if (e.collapsed) $("#map").addClass("noimg");
  else $("#map").removeClass("noimg");
});
// scroll the line
tlineModern.on("scroll", function (e) {
  $(".options .date").text(e.date.toLocaleDateString());
});
// choose feature by clicking on it on the map

var timelineselectModern = new ol.interaction.Select({
  layers: function (layer) {
      return layer.get("selectable") == true;
  },
  hitTolerance: 5,
  style: new ol.style.Style({
      image: new ol.style.Circle({
          radius: 5,
          fill: new ol.style.Fill({ color: "gold" }),
          stroke: new ol.style.Stroke({
              color: [255, 255, 255],
              width: 1,
          }),
      }),
  }),
}); //, style: style(true)

timelinePointsModern.set("selectable", true);

timelineselectModern.on("select", function (e) {
  var f = e.selected[0];
  if (f) {
      tlineModern.setDate(f);
      // Show info
      // TODO add delay
      var content = makePopupContent(f);
      timelinepopupModern.show(f.getGeometry().getFirstCoordinate(), content);
  } else {
      $("#select").html("<p>Select an image.</p>");
  }
});

// add fast scroll buttons (+- 50 yrs)
tlineModern.addButton({
  html: '<i class="fa fa-fast-forward"></i>',
  handleClick: function () {
      var date = tlineModern.getDate("center");
      date.setDate(date.getDate() + 365 * 50);
      tlineModern.setDate(date);
  },
});
tlineModern.addButton({
  html: '<i class="fa fa-fast-backward"></i>',
  handleClick: function () {
      var date = tlineModern.getDate("center");
      date.setDate(date.getDate() - 365 * 50);
      tlineModern.setDate(date);
  },
});

// TIMELINE function
// TODO change name
// display layers and control when it is selected
function start_timeline_modern() {
  map.addInteraction(timelineselectModern);
  map.addLayer(timelinePointsModern);
  timelinePointsModern.setZIndex(99);
  map.addControl(tlineModern);
  map.addOverlay(timelinepopupModern);
  //TODO set timeline date around 1779s
  // tlineModern.setDate("1779-01-01");
}

function stop_timeline_modern() {
  map.removeInteraction(timelineselectModern);
  map.removeControl(tlineModern);
  // TODO change timelinePoints into a parameter?
  map.removeLayer(timelinePointsModern);
  map.removeOverlay(timelinepopupModern);
}
