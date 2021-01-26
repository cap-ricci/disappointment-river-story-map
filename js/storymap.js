function writeStory(json, data) {
  var features = json.features
  //sort json by objectid
  features.sort((a, b) => parseFloat(a.properties.OBJECTID) - parseFloat(b.properties.OBJECTID));
  var first_feature = features[0];

  var start = '<div class="chapter" name="start"' +
              'data-lon="' + first_feature.geometry.coordinates[0] +
              '" data-lat="' + first_feature.geometry.coordinates[0] + 
              '" data-zoom="4" data-animation="flyto"><h2>' + data.title + 
              '</h2><p>' + data.description + 
              '</p><div class="ol-scroll-next"><span>Start</span></div></div>'
  var html = $('<div id="storySource"></div>');
  html.append(start)
  features.forEach(function (e, idx) {
          var prop = e.properties
          var lonlat = e.geometry.coordinates
          var title = prop.geo_name
          var chapter = $('<div></div>');
          chapter.attr({
              'class': "chapter",
              'name': title,
              'data-lon': lonlat[0],
              'data-lat': lonlat[1],
              'data-zoom': "6",
              'data-animation': "flyto"
          })
          chapter.append($('<h2>' + title + '</h2>'))
          var image = $('<img>')
          image.attr({
              'data-title': title,
              'src': prop.img
          })
          chapter.append(image)
          // TODO define img-caption class
          chapter.append($('<p class="img-caption">'+prop.img_captio+'</p>'))
          if(idx === features.length-1) {
            chapter.append($(
              '<p>' + prop.text + '</p>' +
              '<div class="ol-scroll-top"><span>Top</span></div>'
            ))
          }
          else {
            chapter.append($(
            '<p>' + prop.text + '</p>' +
            '<div class="ol-scroll-next"><span>Next</span></div>'
            ))
          }
                    html.append(chapter)

      })
  
  return html.html()
}
//FIXME not working
function writeChapters(json) {
  var html = $('<div id="chapterSource"></div>');
  var list = $('<ol></ol>')
  
  json.features.forEach(function (e) {
    list.append($('<li><a onclick="story.setChapter(\''+e.properties.geo_name+'\')">'+e.properties.geo_name+'</a></li>'))
  })
  html.append(list)
  return html.html()
}

// display layers and control when it is selected
// start the given storyline
function story_init(name){
  var element = storylines[name]
  // generate a GetFeature request
  var featureRequest = new ol.format.WFS().writeGetFeature({
    srsName: 'EPSG:4326',
    featureNS: 'http://localhost:8080',
    featurePrefix: 'explore',
    featureTypes: [element.points_name],
    outputFormat: 'application/json'
  });

  // then post the request and add the received features to a layer
  fetch('http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
  'version=1.1.0' +
  '&request=GetFeature' +
  '&typename=explore:' + element.points_name +
  '&outputFormat=application/json', {
    method: 'POST',
    body: new XMLSerializer().serializeToString(featureRequest),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      var html = writeStory(json, element)
      var chapters = writeChapters(json)
      $('#story').empty();
      $('#story').append(html)
      $(".options").empty();
      // write chapters is not working atm
      // $('.options').append(chapters)
      story_show();
    });
}

function story_show(){
  //close the sidebar
  closeNav()
  // Add placemark
  var placemark = new ol.Overlay.Placemark();
  map.addOverlay (placemark);
  // The storymap
  var story = new ol.control.Storymap({
    html: document.getElementById('story')
    //target: document.getElementById('story')
  });
  //TODO some of this code below can be moved outside of the function
  // Show image fullscreen on click
	var fullscreen = new ol.control.Overlay ({ hideOnClick: true, className: 'zoom' });
	map.addControl(fullscreen);
  story.on('clickimage', function(e){
    console.log(e)
    fullscreen.showImage(e.img.src, e);
  });

  // Fly to the chapter on the map
  story.on('scrollto', function(e){
    if (e.name==='start') {
      placemark.hide();
    } else {
      placemark.show(e.coordinate);
    }
  });
  map.addControl(story);
}

//remove layers and control when another control is selected
function noshow_storymap(){
  map.removeControl(story);
  $(".options").empty();
  $("#story").empty();
}

//TODO see where/when this function is best executed
function load_lines(storylines) {
  var lines = []
  for (const key in storylines) {
    if (Object.hasOwnProperty.call(storylines, key)) {
      const element = storylines[key];
      lines[key] = new ol.layer.Vector({
      name: element.title,
      source: new ol.source.Vector({
        url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
          'version=1.1.0' +
            '&request=GetFeature' +
            '&typename=explore:' + element.lines_name +
            '&outputFormat=application/json',
        format: new ol.format.GeoJSON()
      }),
      style: new ol.style.Style({
        stroke: new ol.style.Stroke({
          color: element.color,
          width: 1,
        })
      })
    });
    }
      
  }
  return lines
}