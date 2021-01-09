function defineLayerContainer() {
  // TODO remove unused layers
  var layers = {};

  // Define OSM Layer
  layers['osmLayer'] = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  // Define Toner layer
  layers['toner'] = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'toner'
    })
  });
  layers['watercolor'] = new ol.layer.Tile({
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

  return layers;

}


