
function UIController() {
  this.heightChangeCallbacks = [];
  this.layerChangeCallbacks = [];
  this.addressChangeCallbacks = [];
}

UIController.prototype.setup = function() {
  var that = this;

  //setup ui handlers
  $(".layerSelector a, .layerCard a").click(function(){
		var id = $(this).data("id");
		layerManager.onlyLayer(id);
    that._layersChanged(id, true, true);
		//socket.emit('layers',{'layers':[0,1,2]});
	});

  $("#overlaySelector input").change(function overlaySelectorChanged(){
		var id = $(this).data("id");
		if($(this).is(":checked")) {
      that._layersChanged(id, true, false); //on
    } else {
			that._layersChanged(id, false, false); //off
		}
	});


  $(function() {
    $( "#slider" ).slider({
      min:0,
      max:15,
      value:6,
      slide: function(event, ui) {
        console.log(ui.value);
        that._heightChanged(ui.value);
      },
      create: function(event, ui) {
        //$('.ui-slider-handle').html('<img src="dragme.png" style="margin-top: 130px;    margin-left: -55px;">');
      }
    });
  });


  //address picker
  var addressPicker = new AddressPicker({
    componentRestrictions: { country: 'AU' },
    bounds: google.maps.LatLngBounds(google.maps.LatLng(-20,146),google.maps.LatLng(-19,147))
  });

  $('#address').typeahead(null, {
    displayKey: 'description',
    source: addressPicker.ttAdapter()
  });

  addressPicker.bindDefaultTypeaheadEvent($('#address'))

  // Listen for selected places result
  $(addressPicker).on('addresspicker:selected', function (event, result) {
    var latLng = {
      lat: result.lat(),
      lng: result.lng()
    }
    that._addressChanged(latLng);
  });

}

UIController.prototype._addressChanged = function(latLng) {
  for (i in this.addressChangeCallbacks) {
    var callback = this.addressChangeCallbacks[i];
    if (callback && typeof(callback) === "function") {
      callback(latLng);
    }
  }
}

UIController.prototype.onAddressChanged = function(callback) {
  this.addressChangeCallbacks.push(callback);
}

UIController.prototype.setLayers = function(layers) {
  //set layers in ui
  if (layers.indexOf(2) != -1) {
    $('#floodTab').tab('show');
    console.log("show flood tab");

    //set overlays
    $('#overlaySelector input').each(function(i) {
      //if the layer was on
      if(layers.indexOf($(this).data('id')) != -1) {
        $(this).prop("checked", true);
      } else {
        $(this).prop("checked", false);
      }
    });
  } else if (layers.indexOf(6) != -1) {
    $('#historyTab').tab('show');
    console.log("show history tab");
  } else {
    $('#otherTab').tab('show');
    console.log("show other tab");
  }
}

UIController.prototype.setHeight = function(height) {
  // set height in ui
  $('#slider').slider('value',height);
  this._updateHeightUI(height);

}

UIController.prototype._updateHeightUI = function(height) {
  $('#height .value').html(height);
}

UIController.prototype._layersChanged = function(layer, on, single) {
  for (i in this.layerChangeCallbacks) {
    var callback = this.layerChangeCallbacks[i];
    if (callback && typeof(callback) === "function") {
      callback(layer, on, single);
    }
  }
}

UIController.prototype._heightChanged = function(height) {
  this._updateHeightUI(height);

  for (i in this.heightChangeCallbacks) {
    var callback = this.heightChangeCallbacks[i];
    if (callback && typeof(callback) === "function") {
      callback(height);
    }
  }
}

UIController.prototype.onHeightChange = function(callback) {
  this.heightChangeCallbacks.push(callback);
}

UIController.prototype.onLayersChange = function(callback) {
  this.layerChangeCallbacks.push(callback);
}
