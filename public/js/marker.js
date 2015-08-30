

function Marker(map) {
  this.map = map;
  this.marker;

  var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
      anchor: [0.5, 0.5],
      anchorXUnits: 'fraction',
      anchorYUnits: 'fraction',
      opacity: 1,
      src: 'css/dot.png'
    }))
  });

  var vectorSource = new ol.source.Vector({
    features: []
  });

  this.vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: iconStyle
  });

  map.addLayer(this.vectorLayer);

}

Marker.prototype.setLocation = function(lat,lng) {
  //add a marker

  console.log(lat);
  var source = this.vectorLayer.getSource();

  //delete markers
  var features = source.getFeatures();
  for(var i in features) {
    source.removeFeature(features[i]);
  }

  //create marker
  var iconFeature = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.transform([lng,lat], 'EPSG:4326','EPSG:3857')),
    name: 'Here'
  });

  source.addFeature(iconFeature);


};

Marker.prototype.removeMarker = function() {
  // remove the marker

}
