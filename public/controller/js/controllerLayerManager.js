

function LayerManager() {
  this.layersOn = [];
  this.callback = [];
}

LayerManager.prototype.setCurrentLayer = function (layers) {
  this.layersOn = layers;

};

LayerManager.prototype.onLayerChange = function (callback) {
  this.callback.push(callback);
};

LayerManager.prototype._layerChange = function () {
  for (i in this.callback) {
      this.callback[i](this.layersOn);
  }
};

//single layer on, all layers off
LayerManager.prototype.onlyLayer = function (id) {
  this.layersOn = [id];

  this._layerChange();
};

//turn on individual layers
LayerManager.prototype.layerOn = function (id) {
  if (this.layersOn.indexOf(id) == -1) {
    console.log("layer not currently on");
    console.log(this.layersOn);
    this.layersOn.push(id);
  } else {
    console.debug('layer already on');
  }

  this._layerChange();
};

//turn off individual layers
LayerManager.prototype.layerOff = function (id) {
  var idx = this.layersOn.indexOf(id);
  if (idx != -1) {
    this.layersOn.splice(idx,1);
    this._layerChange();
  }
};
