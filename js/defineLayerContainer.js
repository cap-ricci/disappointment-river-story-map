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
  // Define Terrain layer
  layers['terrain'] = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'terrain'
    })
  });
  // Define bingLayer
  layers['bingLayer'] = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'AtZ75pXnX1KpB9s24HGIbCxs5BdCkStfydSjLigwNDwC1vd0vJB8GBz3uPfV1rHS',
      imagerySet: 'AerialWithLabelsOnDemand'
    })
  });

  return layers;

}


