// define select style-----------------------------------------------------------
function defineSelect(layerName) {
  var myInteraction = new ol.interaction.Select({
    condition: ol.events.condition.pointerMove,
    style: layers[layerName].selected
  });
  return myInteraction;
}

// update basemap........................................................
function setBasemap(bmap) {
  // define new base layer
  map.removeLayer(layers[isBase]);
  // layers array defined in defineLayerContainer
  isBase = bmap;
  map.addLayer(layers[isBase]);
  baseLayer.setZIndex(-10);
  map.render();
};

// add Overlay........................................................
function addOverlay(omap) {
  Layer = layers[omap];
  window.topLayer = omap;
  // Layer.setZIndex(zindex += 1);
  map.addLayer(Layer);
  map.render();
  overlays.push(omap);
  // sortOverlays();
  if (typeof (selectInteraction) !== 'undefined') {
    map.removeInteraction(selectInteraction)
  }
  if (typeof (layers[omap]).selected !== 'undefined') {
    selectInteraction = defineSelect(omap);
    map.getInteractions().extend([selectInteraction])
  }
};

// sort overlays according to current ZIndex----------------------------------
function sortOverlays() {
  // for each element in the Layer controller list, if corresponding layer is active, 
  // set the zindex equal to index of element in list
  // get order of layers
  var controllers = [];
  $('#layers').children().each(function(){
    controllers.push($(this).attr('data-layer'));
  });
  // assign new zindex to active layers
  // element list goes top to bottom while layer stack goes bottom to top
  map.getLayers().forEach(function(layer) {
    let newIndex = controllers.indexOf(layer.get('name'));
    if(newIndex>=0) {
      layer.setZIndex(controllers.length - newIndex);
    }
  })
}

/// toggle checkbox for display of layers, add further if conditions for integration of more layers
function toggleBtnClick(checkbox) {
  const layer_name = checkbox.name;
  if (!checkbox.checked) {
    switch (layer_name) {
      case 'info_layer':
        hide_info_layer();
        break;
      case 'lines_layer':
        const layersToRemove = ['cook', 'hearne', 'pond', 'mackenzieLife', 'mackenzie', 'castner', 'mackay'];
        layersToRemove.forEach(function (layer) {
          map.removeLayer(layer);
        });
        break;
      default:
        map.removeLayer(layers[checkbox.name]);
    }
  } else {
    switch (layer_name) {
      case 'info_layer':
        show_info_layer();
        break;
      case 'lines_layer':
        const layersToAdd = load_lines(['cook', 'hearne', 'pond', 'mackenzieLife', 'mackenzie', 'castner', 'mackay'])
        for (const key in layersToAdd) {
          const element = layersToAdd[key];
          element.set('name', 'lines_layer');
          map.addLayer(element);
        }
        break;
      default:
        addOverlay(checkbox.name);
    }
    sortOverlays();
  }
}

function toggleLines(clicked, list) {
  if (clicked) {
    // clicked_lines = false;
    var toDelete = [];
    list.forEach(function(key) {
      elem = storylines[key];
      toDelete.push(elem.title);
    })
    var layersToRemove = [];
    map.getLayers().forEach(function (layer) {
      if (toDelete.indexOf(layer.get('name')) >= 0) {
        layersToRemove.push(layer);
      }
    })
    var len = layersToRemove.length;
    for (var i = 0; i < len; i++) {
      map.removeLayer(layersToRemove[i]);
    }
  } else {
    var toName = [];
    var lines = load_lines(list)
    for (const key in lines) {
      //if (Object.hasOwnProperty.call(lines, key)) {
      const element = lines[key];
      map.addLayer(element);
      toName.push(elem.title);
    }
    // }

    map.getLayers().forEach(function (layer) {
      if (toName.indexOf(layer.get('name')) >= 0) {
        layer.setZIndex(map.getLayers().getArray().length);
      }
    })
    // clicked_lines = true;
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
  switch (controlName) {
    case 'ice-timeline':
      show_arctic_map();
      break;
    case 'events-timeline-ancient':
      start_timeline_ancient();
      break;
    case 'events-timeline-modern':
      start_timeline_modern();
      break;
    case 'storymap':
      //ask user which storymap -> open hidden side panel
      //potential hole bcs use might not choose a storymap
      openNav();
      $('#story_change').show();
      break;
    default:
    //do nothing
  }
}


function controlOff(controlName) {
  switch (controlName) {
    case 'ice-timeline':
      noshow_arctic_map();
      break;
    case 'events-timeline-ancient':
      stop_timeline_ancient();
      break;
    case 'events-timeline-modern':
      stop_timeline_modern();
      break;
    case 'storymap':

      $('#story_change').hide();
      noshow_storymap()
      break;
    default:
    //do nothing
  }
}

