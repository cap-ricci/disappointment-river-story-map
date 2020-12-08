function defineLayerContainer() {
  // TODO remove unused layers
  var layers = {};
  //define layers from esri Deutschland (arcGis rest service api)
  var FeatureServices = [
    {
      'name': 'naturschutzgebiete',
      'url': 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Naturschutzgebiete_RLP/FeatureServer/0/',
      'rgb': 'rgb(36, 141, 15)',
      'title': 'DLM50 Naturschutzgebiete RLP',
      'sourceurl': 'https://opendata-esri-de.opendata.arcgis.com/datasets/91bda75f3368471bac2ca5eafc753ebb_0/data',
      'attribution': 'Protected natural areas in Rheinland-Pfalz at 50m resolution.'
    },
    {
      'name': 'stehendesgewaesser',
      'url': 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/Gew%C3%A4sserfl%C3%A4che/FeatureServer/1/',
      'rgb': 'rgb(44, 197, 243)',
      'title': 'DLM50 Stehendes Gewässer RLP',
      'sourceurl': 'https://opendata-esri-de.opendata.arcgis.com/datasets/esri-de-content::stehendes-gew%C3%A4sser-rlp',
      'attribution': 'Still water bodiesd in Rheinland-Pfalz at 50m resolution.'
    },
    {
      'name': 'DLM250gewaesserflaechen',
      'url': 'https://services2.arcgis.com/jUpNdisbWqRpMo35/arcgis/rest/services/DE_DLM250_Gew%C3%A4sserfl%C3%A4chen/FeatureServer/0/',
      'rgb': 'rgb(44, 47, 243)',
      'title': 'DLM250 Gewässerflächen',
      'sourceurl': 'https://opendata-esri-de.opendata.arcgis.com/datasets/esri-de-content::dlm250-gew%C3%A4sserfl%C3%A4chen/geoservice',
      'attribution': 'Water bodies in Germany at 250m resolution.'
    }]
  // (adapted) sourcecode from https://openlayers.org/en/latest/examples/vector-esri.html
  esrijsonFormat = new ol.format.EsriJSON();

  FeatureServices.forEach(function (obj) {
    var vectorSource = new ol.source.Vector({
      loader: function (extent, resolution, projection) {
        var url = obj.url + 'query/?f=json&' +
          'returnGeometry=true&spatialRel=esriSpatialRelIntersects&geometry=' +
          encodeURIComponent('{"xmin":' + extent[0] + ',"ymin":' +
            extent[1] + ',"xmax":' + extent[2] + ',"ymax":' + extent[3] +
            ',"spatialReference":{"wkid":102100}}') +
          '&geometryType=esriGeometryEnvelope&inSR=102100&outFields=*' +
          '&outSR=102100';
        $.ajax({
          url: url, dataType: 'jsonp', success: function (response) {
            if (response.error) {
              alert(response.error.message + '\n' +
                response.error.details.join('\n'));
            } else {
              // dataProjection will be read from document
              var features = esrijsonFormat.readFeatures(response, {
                featureProjection: projection
              });
              if (features.length > 0) {
                vectorSource.addFeatures(features);
              }
            }
          }
        });
      },
      strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
        tileSize: 512
      }))
    });

    layers[obj.name] = new ol.layer.Vector({
      source: vectorSource,
      style: new ol.style.Style({
        fill: new ol.style.Fill({
          color: obj.rgb
        }),
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 255)',
          width: 0.4
        })
      })
    });

    layers[obj.name].title = obj.title;
    layers[obj.name].sourceurl = obj.sourceurl
    layers[obj.name].attribution = obj.attribution

  });

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
  //...................................................................

  // Add GEOSERVER layers
  // DOP aerial image
  layers['DOPLayer'] = new ol.layer.Tile({
    source: new ol.source.TileWMS({
      url: 'http://localhost:8080/geoserver/wms',
      params: { 'LAYERS': 'KPS:rp_dop' }
    }),
    opacity: 0.7
  });
  layers['DOPLayer'].title = 'DOP40 RLP'
  layers['DOPLayer'].sourceurl = 'https://lvermgeo.rlp.de/de/geodaten/opendata/'
  layers['DOPLayer'].attribution = 'Digital orthophoto with 40cm resolution.'
  // camping areas PostGIS database
  var source_hs = new ol.source.ImageWMS({
    url: 'http://localhost:8080/geoserver/KPS/wms',
    params: {
      'LAYERS': 'KPS:camper_areas',
      'viewparams': 'd:5000;x:739580;y:6404023'
    },
    serverType: 'geoserver'
  })
  layers['camp_areas'] = new ol.layer.Image({
    source: source_hs
  });
  layers['camp_areas'].sqlview = 1   // marker for SQLView (0/1)
  layers['camp_areas'].sqlparam1 = 'Search Radius (km)'
  layers['camp_areas'].sqlparam1V = 5         // Startwert 1
  layers['camp_areas'].title = 'Camping areas Germany'
  layers['camp_areas'].sourceurl = 'https://www.campercontact.com/en'
  layers['camp_areas'].attribution = 'Camping areas query via GEOSERVER SQL view.'

  // OpenWeather layers
  var OWapikey = ''
  layers['OW_temperature'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=' + OWapikey
    }),
    opacity: 0.7
  });
  layers['OW_temperature'].title = 'OpenWeather temperature'
  layers['OW_temperature'].sourceurl = 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=temperature&lat=30&lon=-20&zoom=3'
  layers['OW_temperature'].attribution = 'Current temperatures from OpenWeatherMap.org.'
  layers['OW_temperature'].hascolorbar = 1

  layers['OW_clouds'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://tile.openweathermap.org/map/clouds_new/{z}/{x}/{y}.png?appid=' + OWapikey
    }),
    opacity: 0.7
  });
  layers['OW_clouds'].title = 'OpenWeather clouds'
  layers['OW_clouds'].sourceurl = 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=clouds&lat=30&lon=-20&zoom=3'
  layers['OW_clouds'].attribution = 'Current clouds from OpenWeatherMap.org.'
  layers['OW_clouds'].hascolorbar = 1

  layers['OW_precipitation'] = new ol.layer.Tile({
    source: new ol.source.XYZ({
      url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png?appid=' + OWapikey
    }),
    opacity: 0.7
  });
  layers['OW_precipitation'].title = 'OpenWeather precipitation'
  layers['OW_precipitation'].sourceurl = 'https://openweathermap.org/weathermap?basemap=map&cities=false&layer=precipitation&lat=30&lon=-20&zoom=3'
  layers['OW_precipitation'].attribution = 'Current precipitation from OpenWeatherMap.org.'
  layers['OW_precipitation'].hascolorbar = 1

  return layers;

}


