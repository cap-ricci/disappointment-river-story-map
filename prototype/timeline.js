// load point features for timeline
// TODO change this to load arbitrary shapefiles
var allPointsSource = new ol.source.Vector({
    url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
     'version=1.1.0' +
       '&request=GetFeature' +
       '&typename=explore:' + storylines['cook'].points_name + ',' + storylines['hearne'].points_name +
     '&outputFormat=application/json',
    format: new ol.format.GeoJSON()
});
var allPoints = new ol.layer.Vector({
  name: 'points',
  source: allPointsSource,
  style: style()
});
////// TIMELINE INFORMATION

// Style function
var cache = {};
function style(select){
return function(f) {
  var style = cache[f.get('img')+'-'+select];
  if (!style) {
    var img = new ol.style.Photo({
      src: f.get('img'),
      radius: select ? 20:15,
      shadow: true,
      stroke: new ol.style.Stroke({
        width: 4,
        color: select ? '#fff':'#fafafa'
      }),
      onload: function() { f.changed(); }
    })
    style = cache[f.get('img')+'-'+select] = new ol.style.Style({
      image: img
    })
  }
  return style;
}
};

var listenerKey = allPointsSource.on('change', function(e) {
if (allPointsSource.getState() == 'ready') {
  ol.Observable.unByKey(listenerKey);
  tline.refresh();
  }
  });



// Create Timeline control when features are loaded
var info = $(".options").html("");

var tline = new ol.control.Timeline({
className: 'ol-zoomhover',
source: allPointsSource,
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
    d = new Date( d.getTime() + (5 + 10*Math.random())*10*24*60*60*1000);
    f.set('endDate', d);
  }
  return d;
}
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
select.getFeatures().clear();
select.getFeatures().push(e.feature);

var p = e.feature;
if (p) {
  // Show info
  
        $(".options").html("");
        $("<img>").attr('src',p.get("img")).appendTo(info);
        $("<p>").text(p.get("date")) 
        $("<p>").text(p.get("text")).appendTo(info);
        

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
var select = new ol.interaction.Select({ hitTolerance: 5, style: style(true) });
map.addInteraction(select);
select.on('select', function(e){
var f = e.selected[0];
if (f) {
  tline.setDate(f);
  // Show info
        $(".options").html("");
        $("<img>").attr('src',f.get("img")).appendTo(info);
        $("<p>").text(f.get("date")).appendTo(info);
        $("<p>").text(f.get("text")).appendTo(info);
        

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
function start_timelines() {
map.removeControl(story);
$(".options").empty();
$("#story").empty();
map.addLayer(allPoints);
map.addControl(tline);
}