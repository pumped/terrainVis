var socket;
var layerManager;
var ui;

$(document).ready(function(){
	socket = io();
	socket.emit('height',1);

	ui = new UIController();
	ui.setup();

	layerManager = new LayerManager();
	layerManager.onLayerChange(function(layers){
		socket.emit('layers',layers)
	});

	socket.on('height', function newHeight(data){
		ui.setHeight(data.height);
	});

	socket.on('layers', function newLayers(data) {
		ui.setLayers(data.layers);
		console.log(data);
	});


	ui.onLayersChange(function layerChanged(id, on, single){
		if (single) {
			layerManager.onlyLayer(id);
		} else {
			if (on) {
				layerManager.layerOn(id);
			} else {
				layerManager.layerOff(id);
			}
		}
	});

	//height change
	ui.onHeightChange(function heightChange(height){
		console.log(height);
		socket.emit('height',height);
	});

	//year change
	ui.onTimeChange(function timeChange(time){
		console.log("sending");
		socket.emit('time',time);
	});

	//address changed
	ui.onAddressChanged(function addressChange(latLng){
		console.log(latLng);
		socket.emit('location', latLng)
	});

});


function setHeight(height) {
	socket.emit('height',height);
	setUI(height);
}


function layerSelector() {

}

layerSelector.prototype.bind = function(id) {
	var that = this;
	$(id).click(function(){
		that.selectLayer(1);
	});
}

layerSelector.prototype.selectLayer = function(layerID) {
	socket.emit("layer", layerID);
}
