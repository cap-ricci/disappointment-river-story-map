// first define layers and controls globally
// load point features for timeline
function chainRequest(list) {
  var typenames = [];
  for(const key in list){
    elem = list[key];
    typenames.push(elem.points_name);
  }
  return typenames.join(',')
}


var timelinePointsSource = new ol.source.Vector({
  url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
    'version=1.1.0' +
      '&request=GetFeature' +
      '&typename=explore:' + chainRequest(storylines) +
    '&outputFormat=application/json',
  format: new ol.format.GeoJSON()
});
// TODO maybe style points with an icon
var timelinePoints = new ol.layer.Vector({
  name: 'points',
  source: timelinePointsSource,
  // style: style()
});
////// TIMELINE INFORMATION
var listenerKey = timelinePointsSource.on('change', function(e) {
if (timelinePointsSource.getState() == 'ready') {
  ol.Observable.unByKey(listenerKey);
  tline.refresh();
  }
  });

// change point colour depending on voyage 
timelinePoints.setStyle(function(feature) {
  let fillColor;
  var voyage = feature.get("voyage");
  if (voyage == 'cook') {
    fillColor = 'lightcoral';
} else if (voyage == 'hearne') {
    fillColor = 'turquoise';
} else if (voyage == 'pond') {
    fillColor = 'cornflowerblue';
} else if (voyage == 'castner') {
    fillColor = 'orchid';
} else if (voyage == 'mackenzieLife') {
    fillColor = 'chocolate';
} else {
    fillColor = 'black';
}

  return new ol.style.Style({
   image: new ol.style.Circle({
     radius: 5,
     fill: new ol.style.Fill({color: fillColor}),
     stroke: new ol.style.Stroke({
       color: [255,255,255], width: 1
     })
   })
})
});


//Timeline control
var info = $(".options").html("");

var tline = new ol.control.Timeline({
  className: 'ol-zoomhover',
  source: timelinePointsSource,
  graduation: 'month',
  zoomButton: true,
  // TODO improve feature display in timeline
  getHTML: function(f){
    //return '<img src="'+f.get('img')+'"/> '+(f.get('geo_name')||'');
    return  '<div style="'+
        storylines[f.getId().split("Points.")[0]].timeline_html+
        '">'+f.get('geo_name')+'</div>';
  },
  getFeatureDate: function(f) {
    return f.get('date');
  },
  endFeatureDate: function(f) {
    var d = f.get('endDate');
    // Create end date
    if (!d) {
      d = new Date (f.get('date')); 
      d = new Date( d.getTime() + (5 + 10*10*24*60*60*1000));
      f.set('endDate', d);
    }
    return d;
  }
});

// make popup overlay
var timelinepopup = new ol.Overlay.Popup (
  {	popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
    closeBox: true,
    onshow: function(){ console.log("You opened the timeline box"); },
    onclose: function(){ console.log("You close the timeline box"); },
    positioning: 'top-center',
    autoPan: true,
    autoPanAnimation: { duration: 250 }
});

// Select a feature
tline.on('select', function(e){

  // Center map on feature
  map.getView().animate({
    center: e.feature.getGeometry().getCoordinates(),
    zoom: 8
  });
  // Center time line on feature
  tline.setDate(e.feature);
  // Select feature on the map
  timelineselect.getFeatures().clear();
  timelineselect.getFeatures().push(e.feature);

  var p = e.feature;
  if (p) {
    // Show info
    var content = makePopupContent(p);
    timelinepopup.show(p.getGeometry().getFirstCoordinate(), content);
      } else {
    $("#select").html("<p>Select an image.</p>");
  }
});

// Collapse the line
tline.on('collapse', function(e) {
  if (e.collapsed) $('#map').addClass('noimg')
  else $('#map').removeClass('noimg')
});
// scroll the line
tline.on('scroll', function(e){
  $('.options .date').text(e.date.toLocaleDateString());
});
// choose feature by clicking on it on the map

var timelineselect = new ol.interaction.Select({
    //condition: ol.events.condition.click,
    hitTolerance: 5,
    style: new ol.style.Style({
          image: new ol.style.Circle({
            radius: 5,
            fill: new ol.style.Fill({color: 'gold'}),
            stroke: new ol.style.Stroke({
              color: [255,255,255], width: 1
            })
          })
        })
});//, style: style(true)

timelineselect.on('select', function(e){
  var f = e.selected[0];
  if (f) {
    tline.setDate(f);
    // Show info
    // TODO add delay
    var content = makePopupContent(f);
    timelinepopup.show(f.getGeometry().getFirstCoordinate(), content);
  } else {
    $("#select").html("<p>Select an image.</p>");
  }
});

// add fast scroll buttons (+- 10 yrs)
tline.addButton({
  html: '<i class="fas fa-fast-forward"></i>',
  handleClick: function(){
    var date = tline.getDate('center');
    date.setDate(date.getDate() + 365*10);
    tline.setDate(date);
  }
})
tline.addButton({
  html: '<i class="fas fa-fast-backward"></i>',
  handleClick: function(){
    var date = tline.getDate('center');
    date.setDate(date.getDate() - 365*10);
    tline.setDate(date);
  }
})


// TIMELINE function
// TODO change name
// display layers and control when it is selected
function start_timelines() {
  map.addInteraction(timelineselect);
  map.addLayer(timelinePoints);
  timelinePoints.setZIndex(99);
  map.addControl(tline);
  map.addOverlay(timelinepopup);
}

function stop_timelines(){
  map.removeInteraction(timelineselect);
  map.removeControl(tline);
  // TODO change timelinePoints into a parameter?
  map.removeLayer(timelinePoints);
  map.removeOverlay(timelinepopup);
}
