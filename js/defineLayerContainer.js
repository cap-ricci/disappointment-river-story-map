function defineLayerContainer() {
  // TODO remove unused layers
  var layers = {};

  // Define OSM Layer
  layers['osm'] = new ol.layer.Tile({
    source: new ol.source.OSM()
  });
  // Define Toner layer
  layers['toner'] = new ol.layer.Tile({
    source: new ol.source.Stamen({
      layer: 'toner'
    })
  });
  //Watercolor
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

  // Define bingLayer
  layers['aerial'] = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'Ajap7_9gxlIjlzC-Vx0NmCTi2QYVczMNbNA-L6-3ZaS-9o_gOT5bB9rMtM7MBcMP',
      imagerySet: 'Aerial'
    })
  });

  // Define Earth Data
  layers['modis_truecolor'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/' +
        'MODIS_Terra_CorrectedReflectance_TrueColor/default/2020-07-15/' +
        'GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg'
    })
  });

  layers['sea_temp'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/' +
        'GHRSST_L4_MUR_Sea_Surface_Temperature/default/2013-06-15/' +
        'GoogleMapsCompatible_Level7/{z}/{y}/{x}.png'
    })
  });


  layers['surface_temp'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://gibs-{a-c}.earthdata.nasa.gov/wmts/epsg3857/best/' +
        'AIRS_L2_Surface_Air_Temperature_Day/default/2013-06-15/' +
        'GoogleMapsCompatible_Level6/{z}/{y}/{x}.png'
    })
  });
  return layers;

}

//TODO move all layers here
