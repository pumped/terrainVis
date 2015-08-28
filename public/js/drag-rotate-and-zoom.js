var socket;
var layers;

$(document).ready(function(){
  socket = io();
  socket.emit('height','0');

  var map = new ol.Map({
    interactions: ol.interaction.defaults().extend([
      new ol.interaction.DragRotateAndZoom()
    ]),
    layers: [
      /*new ol.layer.Tile({
        source: new ol.source.Stamen({layer: 'toner'})
      }),*/
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          //url: 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
          url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          //url: 'http://tile.thunderforest.com/transport-dark/{z}/{x}/{y}.png',
          attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })]
        })
      }),
      new ol.layer.Tile({
        source: new ol.source.XYZ({
          //url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
          url: 'http://tile.openstreetmap.se/hydda/roads_and_labels/{z}/{x}/{y}.png',
          attributions: [new ol.Attribution({ html: ['&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'] })],
          type: "hyb"
        })
      })
    ],
    target: 'map',
    view: new ol.View({
      center: ol.proj.transform([146.777877,-19.278325], 'EPSG:4326', 'EPSG:3857'),
      zoom: 12
    })
  });


  //create new calibration object
  var calibration = new Calibrate(map);

  //load new layers
  layers = new Layers(map);
  layers.setLayer();

  socket.on('height', function(data){
    layers.getLayer(2).getPlayer().animateTo(data.height);
    console.log(data.height);
  });

  socket.on('layers', function socketLayersReceive(data) {
    console.log(data);
    layers.setLayers(data.layers);

    if (data.layers.indexOf(2) == -1) {
      //show height
      $("#height").hide();
    } else {
      $("#height").show();
    }
  });

});
