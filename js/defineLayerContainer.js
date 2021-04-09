function defineLayerContainer() {
  var layers = {};
  //Watercolor
  layers['watercolor'] = new ol.layer.Tile({
    name: 'watercolor',
    source: new ol.source.Stamen({
      layer: 'watercolor'
    })
  });
  // Define Terrain layer
  layers['terrain'] = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain'
    })
  });
  //Define OSM Standard
  layers['OSMStandard'] = new ol.layer.Tile({
    name: 'OSMStandard',
    source: new ol.source.OSM(),
    visible: true,
    title: 'OSMStandard'
  })
  // Define bingLayer
  layers['aerial'] = new ol.layer.Tile({
    name: 'aerial',
    source: new ol.source.BingMaps({
      key: 'Ajap7_9gxlIjlzC-Vx0NmCTi2QYVczMNbNA-L6-3ZaS-9o_gOT5bB9rMtM7MBcMP',
      imagerySet: 'Aerial'
    })
  });
  // Canadian Digital Elevation Model, Color Shaded Relief
  layers['relief'] = new ol.layer.Tile({
    name: 'relief',
    source: new ol.source.TileWMS({
      url: 'https://maps.geogratis.gc.ca/wms/elevation_en',
      crossOrigin: 'anonymous',
      params: { 'LAYERS': 'cdem.color-shaded-relief', 'TILED': true },
      serverType: 'mapserver'
    })
  });
  // Arctic Web Map
  var attribution = new ol.control.Attribution({
    html: 'Map &copy; <a href="https://arcticconnect.ca/">ArcticConnect</a>. Data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });
  layers['arctic_map'] = new ol.layer.Tile({
    name: 'arctic_map',
    source: new ol.source.XYZ({
      attributions: [attribution],
      url: 'http://tiles.arcticconnect.ca/osm_3573/{z}/{x}/{y}.png'
    })
  });
// natives land layer
  var nativesSource = new ol.source.Vector({
    url: 'http://localhost:8080/geoserver/explore/wfs?service=WFS&' +
      'version=1.1.0' +
      '&request=GetFeature' +
      '&typename=explore:natives_canada' +
      '&outputFormat=application/json',
    format: new ol.format.GeoJSON()
  });
  
  var nativesLand = new ol.layer.Vector({
    name: 'natives_land',
    source: nativesSource
  });
  
  nativesLand.set('selectable', false);
  nativesLand.setStyle(function (feature) {
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
      text: new ol.style.Text({
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
  layers['natives_land'] = nativesLand;
  return layers;
}
function colorWithAlpha(color, alpha) {
  const [r, g, b] = Array.from(ol.color.asArray(color));
  if (r < 0 || r > 255 || g < 0 || g > 255 || b < 0 || b > 255) {
    [r, g, b] = [0, 0, 0]
  }
  return 'rgba(' + r + ", " + g + ", " + b + ", " + alpha + ')'
}
//TODO move all layers here