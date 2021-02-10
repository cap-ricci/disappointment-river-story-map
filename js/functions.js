// define select style-----------------------------------------------------------
function defineSelect(layerName) {
  var myInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: layers[layerName].selected
  });
  return myInteraction;
}

// define Overview Map........................................................
function def_overviewMap() {

  var overviewMapControl = new ol.control.OverviewMap({
    // see in overviewmap-custom.html to see the custom CSS used
    className: 'ol-overviewmap ol-custom-overviewmap',
    layers: [
      new ol.layer.Tile({
        source: new ol.source.Stamen({
          layer: 'toner'
        })
      })
    ],
    collapseLabel: '\u00BB',
    label: '\u00AB',
    collapsed: false
  });

  return overviewMapControl;
}

// update basemap........................................................
function setBasemap(bmap) {
  // define new base layer
  //alert(bmap);
  if (bmap ==='native-land'){
    map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11'
      });
  }else{
    map = new ol.Map({
      target: 'map',
      view: new ol.View({
        projection: "EPSG:3857",
        zoom: 3,
        maxZoom: 6,
        minZoom:2,
        center: [-150000000, 7000000]
      }),
    layers: [ layers['watercolor']]
    });
  }

 
  baseLayer = layers[bmap];
  map.addLayer(baseLayer);
  baseLayer.setZIndex(-10);
  map.render();

  if (bmap == 'watercolor') {
    map.addLayer(layers['stamen_labels']);
    layers['stamen_labels'].setZIndex(-9);
    map.render();
  }else if(bmap == 'aerial'){

  }else if (bmap == 'native-land'){
   

  }else{
    
  }
};

// add Overlay........................................................
function addOverlay(omap) {
  Layer = layers[omap];
  //alert(omap);
  window.topLayer = omap;
  // Layer.setZIndex(zindex += 1);
  map.addLayer(Layer);
  //map.render();
  // overlays.push(omap);
  // updateControls();
  // if (typeof (selectInteraction) !== 'undefined') {
  //   map.removeInteraction(selectInteraction)
  // }
  // if (typeof (layers[omap]).selected !== 'undefined') {
  //   selectInteraction = defineSelect(omap);
  //   map.getInteractions().extend([selectInteraction])
  // }
  // infoDiv.innerHTML = '';
};

// update control view of current overlays
function updateControls() {
  // add dynamic html
  sortOverlays();
  var ct = 0
  var target = document.getElementById('overlaysDiv');
  target.innerHTML = "";
  target.appendChild(document.createElement("TABLE"));
  overlays.forEach(function (this_omap) {
    var thisrow = document.createElement("TR");
    thisrow.setAttribute('valign', 'middle', 'id', 'activeRow');
    // NAME OF LAYER
    var thistd = document.createElement("TD");
    thistd.setAttribute('style', 'min-width: 80px; font-size: 9pt;');
    thistd.setAttribute('valign', 'middle');
    var spanLine = layers[this_omap].title;
    var textnode = document.createTextNode(spanLine);
    thistd.appendChild(textnode);
    thisrow.appendChild(thistd);

    // SLIDER
    var thistd = document.createElement("TD");
    thistd.style.padding = "0px 10px 0px 0px";
    thistd.setAttribute('valign', 'middle');
    var slider = document.createElement("input");
    slider.setAttribute('type', "range", "min", "0", "max", "1", "step", ".5", "id", "opacitySlider" + this_omap);
    slider.setAttribute('style', "max-width: 170px;");
    $(function () {
      slider.oninput = function () {
        Layer = layers[this_omap];
        Layer.setOpacity(this.value / 100);
      }
    });
    slider.title = "adjust layer opacity";
    thistd.appendChild(slider);
    thisrow.appendChild(thistd);

    // MOVE LAYER to TOP
    var thistd = document.createElement("TD");
    thistd.setAttribute('style', 'width: 25px; text-align: center');
    thistd.setAttribute('valign', 'bottom');
    var lup = document.createElement("I");
    lup.setAttribute('class', 'fa fa-chevron-up');
    lup.setAttribute('onclick', 'move2top("' + this_omap + '")');
    lup.style.cursor = "pointer";
    lup.title = "move layer up";
    thistd.appendChild(lup);

    // MOVE LAYER to BOTTOM
    var ldown = document.createElement("I");
    ldown.setAttribute('class', 'fa fa-chevron-down');
    ldown.setAttribute('onclick', 'move2bottom("' + this_omap + '")');
    ldown.style.cursor = "pointer";
    ldown.title = "move layer down";
    thistd.appendChild(ldown);
    thisrow.appendChild(thistd);

    // DEL LAYER
    var thistd = document.createElement("TD");
    thistd.setAttribute('style', 'width: 25px; text-align: center');
    thistd.setAttribute('valign', 'middle');
    var delit = document.createElement("I");
    delit.setAttribute('class', 'fa fa-trash fa-lg');
    delit.setAttribute('onclick', 'deleteOverlay("' + this_omap + '")');
    delit.style.cursor = "pointer";
    delit.title = "delete layer";
    thistd.appendChild(delit);
    thisrow.appendChild(thistd);

    // LAYER INFO
    var thistd = document.createElement("TD");
    thistd.setAttribute('style', 'width: 25px; text-align: center');
    thistd.setAttribute('valign', 'middle');
    var info = document.createElement("I");
    info.setAttribute('class', 'fa fa-info-circle fa-lg')
    info.setAttribute("onclick", "info('" + this_omap + "')");
    info.style.cursor = "pointer";
    info.title = "read layer attribution";
    thistd.appendChild(info);
    thisrow.appendChild(thistd);

    //SQL Filter
    if (layers[this_omap].sqlview == 1) {
      var thistd = document.createElement("TD");
      thistd.setAttribute('style', 'width: 25px; text-align: center');
      var sql = document.createElement("I");
      sql.setAttribute('class', 'fa fa-filter fa-lg');
      // sql.setAttribute("src", "../images/sql.PNG");
      sql.setAttribute("onclick", "sql('" + this_omap + "')");
      sql.style.cursor = "pointer";
      sql.title = "apply sql filter";
    } else {
      var sql = document.createElement("IMG");
    }
    thistd.appendChild(sql);
    thisrow.appendChild(thistd);
    target.appendChild(thisrow);
  })
};


// sort overlays according to current ZIndex----------------------------------
function sortOverlays() {
  // get array with z indices
  zidx = [];
  ct = 0;
  overlays.forEach(function (this_omap) {
    zidx[ct] = layers[this_omap].getZIndex();
    //alert(this_omap);
    ct += 1;
  });
  //alert(zidx);
  //alert(overlays);
  // create dict with(key: zidx, value: omap)
  dict = {};
  for (var i = 0; i < zidx.length; i++) {
    dict[zidx[i]] = overlays[i];
    //alert(zidx[i]+', '+overlays[i]);
  }
  zidx.sort();
  var tempDict = {};
  for (var i = 0; i < zidx.length; i++) {
    tempDict[zidx[i]] = dict[zidx[i]];
  }
  Object.keys(tempDict).sort();
  overlays = (Object.values(tempDict));
  //define name of topLayer
  topLayer = overlays[overlays.length - 1];
  //alert(topLayer);
  overlays.reverse();

}

// change Zindex (suspended)--------------------------------------------------------------
function moveIndex(omap, diff) {
  var i = layers[omap].getZIndex();
  // find layer that holds the current z index and change accordingly...
  overlays.forEach(function (this_omap) {
    if (layers[this_omap].getZIndex() == i + diff) {
      layers[this_omap].setZIndex(i);
    }
  })
  // adjust the new zindex
  if ((i + diff) <= zindex & (i + diff) >= 0) {
    layers[omap].setZIndex(i + diff);
    updateControls(overlays);
  }
};


// move LAYER TO TOP --------------------------------------------------------------
function move2top_orig(omap) {
  var i = layers[omap].getZIndex();
  // find layer that holds the current maximum zindex and change accordingly...
  overlays.forEach(function (this_omap) {
    if (layers[this_omap].getZIndex() == zindex) {
      layers[this_omap].setZIndex(i);
    }
  })
  // adjust the new zindex
  layers[omap].setZIndex(zindex);
  updateControls(overlays);
};

// move LAYER TO TOP --------------------------------------------------------------
function move2top(omap) {
  var i = layers[omap].getZIndex();
  // find layer that holds the current maximum zindex and change accordingly...
  var start_index = zindex - 1;
  overlays.forEach(function (this_omap) {
    var isindex = layers[this_omap].getZIndex(); // got through all layers
    if (isindex != i) { // if layer is not the one to be moved to top
      layers[this_omap].setZIndex(start_index);
      start_index -= 1;
    }
  })
  // adjust the new zindex
  layers[omap].setZIndex(zindex);
  updateControls(overlays);

  if (typeof (selectInteraction) !== 'undefined') {
    map.removeInteraction(selectInteraction)
  }
  if (typeof (layers[omap]).selected !== 'undefined') {
    selectInteraction = defineSelect(omap);
    map.getInteractions().extend([selectInteraction])
  }
};


// move LAYER TO BOTTOM --------------------------------------------------------------
function move2bottom(omap) {
  var i = layers[omap].getZIndex();
  // find layer that holds the current z index and change accordingly...
  overlays.forEach(function (this_omap) {
    if (layers[this_omap].getZIndex() == 0) {
      layers[this_omap].setZIndex(i);
    }
  })
  // adjust the new zindex
  layers[omap].setZIndex(0);
  updateControls(overlays);
};

// delete Overlay........................................................
function deleteOverlay(omap) {
  Layer = layers[omap];
  map.removeLayer(Layer);
  overlays.splice([overlays.indexOf(omap)], 1);
  if (overlays.length == 0) {
    document.getElementById('overlaysDiv').innerHTML = "";
  }
  updateControls();
  document.getElementById("campInfo").innerHTML = ''
};

// SHOW LAYER INFO--------------------------------------------------------------
function info(omap) {
  var infoDiv = document.getElementById('infoDiv');
  infoDiv.innerHTML = "<p><span class = 'infobox'>" +
  layers[omap].title + ": " + layers[omap].attribution + " Visit " + 
  "<a href='" + layers[omap].sourceurl + 
  "' target='_blank' rel='_noopener'>this page</a> for more information." 
  // Weather layer
  if (layers[omap].hascolorbar == 1) {
    //show weather layer legend
    var legend = document.createElement("div");
    var cbar = document.createElement("IMG");
    cbar.setAttribute("src", "../images/cmaps/" + omap + ".PNG");
    cbar.setAttribute("style", "width: 100%;")
    legend.appendChild(cbar);
    infoDiv.appendChild(legend);
  }
};

function sql(omap) {
  infoDiv.innerHTML = infoDiv.innerHTML + "<p><span class = 'infobox'>" +
    " <b>SQL query:</b><p>" +
    "Enter a search radius and click on map to choose coordinate<p>" +
    "<form>" +
    layers[omap].sqlparam1 + ":<br>" +
    "<input id='radius' type='text' value=" + layers[omap].sqlparam1V + ">" +
    "<input type='button' value='set radius' onclick='setRadius();'>" +
    "</form>" +
    "<p>Current radius: <div id='radiusVal'></div>";
}
function setRadius() {
  radius = document.getElementById('radius').value;
  radiusVal.innerHTML = radius;
}

/// toggle checkbox for display of layers, add further if conditions for integration of more layers
function toggleBtnClick(clicked, layer) {
  if (clicked) {
      if (layer == 'surface_temp') {
      clicked_temp = false;
  } else if (layer == 'relief') {
      clicked_relief = false;
  }
    deleteOverlay(layer);
  } else {
    addOverlay(layer);
    if (layer == 'surface_temp') {
    clicked_temp = true;
} else if (layer == 'relief') {
    clicked_relief = true;
}
  }
}

function toggleBtnClickInfo(clicked) {
    if (clicked) {
        clicked_info = false;
        hide_info_layer();
    } else {
        show_info_layer();
        clicked_info = true;
    }
}

function openNav() {
  document.getElementById("tocSidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("tocSidenav").style.width = "0";
}

// alternative using radio buttons
function controlOn(controlName) {
  switch(controlName) {
    case 'ice-timeline':
      show_arctic_map();
      break;
    case 'events-timeline':
      start_timelines();
      break;
    case 'storymap':
      //ask user which storymap -> open hidden side panel
      //potential hole bcs use might not choose a storymap
      openNav();
    break;
    case 'map-slider':
      //TODO implement show_map_slider()
      show_map_slider();
      break;
    default:
      //do nothing
  }
} 


function controlOff(controlName) {
  switch(controlName) {
    case 'ice-timeline':
      noshow_arctic_map();
      break;
    case 'events-timeline':
      //TODO implement
      stop_timelines();
      break;
    case 'storymap':
      //TODO implement
      noshow_storymap()
    break;
    case 'map-slider':
      //TODO implement noshow_map_slider()
      noshow_map_slider();
      break;
    default:
      //do nothing
  }
} 

