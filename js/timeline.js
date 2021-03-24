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

var timelinePointsSourceAncient = new ol.source.Vector({
  url: "http://localhost:8080/geoserver/explore/wfs?service=WFS&" + "version=1.1.0" + "&request=GetFeature" + "&typename=explore:" + 
  chainRequest(['cook', 'hearne', 'pond', 'mackenzieLife' , 'mackenzie']) + 
  "&outputFormat=application/json",
  format: new ol.format.GeoJSON(),
});

// TODO maybe style points with an icon
var timelinePointsAncient = new ol.layer.Vector({
  name: "points",
  source: timelinePointsSourceAncient,
  // style: style()
});
////// TIMELINE INFORMATION
var listenerKey = timelinePointsSourceAncient.on("change", function (e) {
  if (timelinePointsSourceAncient.getState() == "ready") {
      ol.Observable.unByKey(listenerKey);
      tlineAncient.refresh();
  }
});

// change point colour depending on voyage
timelinePointsAncient.setStyle(function (feature) {
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

var tlineAncient = new ol.control.Timeline({
  className: "ol-zoomhover",
  source: timelinePointsSourceAncient,
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
var timelinepopupAncient = new ol.Overlay.Popup({
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
tlineAncient.on("select", function (e) {
  // Center map on feature
  map.getView().animate({
      center: e.feature.getGeometry().getCoordinates(),
      zoom: 8,
  });
  // Center time line on feature
  tlineAncient.setDate(e.feature);
  // Select feature on the map
  timelineselectAncient.getFeatures().clear();
  timelineselectAncient.getFeatures().push(e.feature);

  var p = e.feature;
  if (p) {
      // Show info
      var content = makePopupContent(p);
      timelinepopupAncient.show(p.getGeometry().getFirstCoordinate(), content);
  } else {
      $("#select").html("<p>Select an image.</p>");
  }
});

// Collapse the line
tlineAncient.on("collapse", function (e) {
  if (e.collapsed) $("#map").addClass("noimg");
  else $("#map").removeClass("noimg");
});
// scroll the line
tlineAncient.on("scroll", function (e) {
  $(".options .date").text(e.date.toLocaleDateString());
});
// choose feature by clicking on it on the map

var timelineselectAncient = new ol.interaction.Select({
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

timelinePointsAncient.set("selectable", true);

timelineselectAncient.on("select", function (e) {
  var f = e.selected[0];
  if (f) {
      tlineAncient.setDate(f);
      // Show info
      // TODO add delay
      var content = makePopupContent(f);
      timelinepopupAncient.show(f.getGeometry().getFirstCoordinate(), content);
  } else {
      $("#select").html("<p>Select an image.</p>");
  }
});

// add fast scroll buttons (+- 50 yrs)
tlineAncient.addButton({
  html: '<i class="fa fa-fast-forward"></i>',
  handleClick: function () {
      var date = tlineAncient.getDate("center");
      date.setDate(date.getDate() + 365 * 50);
      tlineAncient.setDate(date);
  },
});
tlineAncient.addButton({
  html: '<i class="fa fa-fast-backward"></i>',
  handleClick: function () {
      var date = tlineAncient.getDate("center");
      date.setDate(date.getDate() - 365 * 50);
      tlineAncient.setDate(date);
  },
});

// TIMELINE function
// TODO change name
// display layers and control when it is selected
function start_timeline_ancient() {
  toggleLines(false, ['cook', 'hearne', 'pond', 'mackenzieLife' , 'mackenzie']);
  map.addInteraction(timelineselectAncient);
  map.addLayer(timelinePointsAncient);
  timelinePointsAncient.setZIndex(99);
  map.addControl(tlineAncient);
  map.addOverlay(timelinepopupAncient);
  //TODO set timeline date around 1779s
  // tlineAncient.setDate("1779-01-01");
}

function stop_timeline_ancient() {
  map.removeInteraction(timelineselectAncient);
  map.removeControl(tlineAncient);
  // TODO change timelinePoints into a parameter?
  map.removeLayer(timelinePointsAncient);
  map.removeOverlay(timelinepopupAncient);
  toggleLines(true, ['cook', 'hearne', 'pond', 'mackenzieLife' , 'mackenzie']);
}
