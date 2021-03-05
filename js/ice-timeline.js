// first define layers and controls globally
var ice_extent_source = new ol.source.Vector({
  url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
    'version=1.1.0' +
    '&request=GetFeature' +
    '&typename=	explore:ice_extent_sept' + // cook3points_text
    '&outputFormat=application/json',
  format: new ol.format.GeoJSON()
});

var oldstyle =
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [155, 155, 155, 0.4]
    })
  });

var ice_extent_vector = new ol.layer.Vector({
  name: 'Ice Sheet Extent',
  source: ice_extent_source,
  style: oldstyle
});
// Create Timeline control
var iceTline = new ol.control.Timeline({
  className: 'ol-pointer',
  features: [{
    text: 'Arctic Ice Sheet',
    date: new Date('1979/01/01'),
    endDate: new Date('2022/12/31')
  }],
  graduation: 'year', // 'month'
  minDate: new Date('1979/06/01'),
  maxDate: new Date('2021/12/31'),
  getHTML: function (f) { return 'Arctic Ice Sheet'; },
  getFeatureDate: function (f) { return f.date; },
  endFeatureDate: function (f) { return f.endDate }
});

// Set the date when ready
setTimeout(function () { iceTline.setDate('1979'); });
iceTline.addButton({
  html: '<i class="fa fa-play"></i>',
  className: "go",
  title: "GO!",
  handleClick: function () {
    go();
  }
});

var newstyle =
  new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: [50, 151, 154, 1.0],
      width: 2
    })
  });
// Show features on scroll
iceTline.on('scroll', function (e) {
  var d = iceTline.roundDate(e.date, 'year')
  $('.dateStart').text(d.toLocaleDateString(undefined, { year: 'numeric' }));
  // Filter features visibility
  ice_extent_source.getFeatures().forEach(function (f) {
    var dt = f.get('date');

    if (dt == d.toLocaleDateString(undefined, { year: 'numeric' })) {
      f.setStyle(newstyle);
    } else {
      f.setStyle();
    }
  });
});

// Run on the timeline
var running = false;
var start = new Date('1979');
var end = new Date('2020');
function go(next) {
  var date = iceTline.getDate();
  if (running) clearTimeout(running);
  if (!next) {
    // stop
    if (date > start && date < end && running) {
      running = false;
      iceTline.element.classList.remove('running');
      return;
    }
    if (date > end) {
      date = start;
    }
  }
  if (date > end) {
    iceTline.element.classList.remove('running');
    return;
  }
  if (date < start) {
    date = start;
  }
  // 1 year
  date = new Date(date.getTime() + 24 * 60 * 60 * 1000 * 365);
  iceTline.setDate(date, { anim: false });
  // next
  iceTline.element.classList.add('running');
  running = setTimeout(function () { go(true); }, 250);
}


// display layers and control when it is selected
function show_arctic_map() {
  proj4.defs("EPSG:3573", "+proj=laea +lat_0=90 +lon_0=-100 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
  //define new view and apply to map
  map.setView(new ol.View({
    projection: 'EPSG:3857', //porjection di base (Spherical Mercator)
    center: ol.proj.fromLonLat([0, 90], 'EPSG:3573'),
    zoom: 3.5,
    minZoom: 1
  }));

  map.addLayer(layers['arctic_map'])
  map.addLayer(ice_extent_vector);
  map.addControl(iceTline);
}

//remove layers and control when another control is selected
function noshow_arctic_map() {
  map.removeLayer(layers['arctic_map']);
  map.removeLayer(ice_extent_vector);
  map.removeControl(iceTline);
  map.setView(new ol.View({
    projection: 'EPSG:3857',
    zoom: 3,
    center: [150000000, 7000000] // start of the map
  }));
}
