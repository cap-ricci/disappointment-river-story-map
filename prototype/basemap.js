  // Define OSM Layer
  layers['osmLayer'] = new ol.layer.Tile({
    source: new ol.source.OSM()
  });

  // Define STAMEN
  layers['stamenLayer'] = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'watercolor'
    })
  });

  
  layers['toner'] = new ol.layer.Tile({
	source: new ol.source.Stamen({
		layer: 'toner'
	  })
  });

  // Define bingLayer
  layers['bingLayer'] = new ol.layer.Tile({
    source: new ol.source.BingMaps({
      key: 'Ajap7_9gxlIjlzC-Vx0NmCTi2QYVczMNbNA-L6-3ZaS-9o_gOT5bB9rMtM7MBcMP',
      imagerySet: 'Aerial'
    })
  });