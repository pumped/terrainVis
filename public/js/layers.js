
function Layers(map) {
	this.map = map;

	this.years = [1952,1959,1976,1982,1985,1989,1992,2005];
	this.layerIDs = [6,11,12,13,14,15,16,17];

	this.layers = {};

	this.setupLayers();
}

Layers.prototype.addLayer = function(layer) {

}

Layers.prototype.setMap = function(map) {

};

Layers.prototype.getLayer = function (id) {
	return this.layers[id];
};

Layers.prototype.addLayer = function(layer, id) {
	this.layers[id] = layer;
};

Layers.prototype.setLayers = function(layers) {
	console.debug(layers);
	//remove layers not in list
	var l = this.map.getLayers();
	var length = l.getLength();

	for (var i=length-1; i>1; i--) {
		l.removeAt(i);
	}

	//add layers in list
	for (i in layers) {
		this.map.addLayer(this.layers[layers[i]].getLayer());
	}
};

Layers.prototype.setLayer = function(id) {
	//this.map.addLayer(nmRivers.getLayer());
	//this.map.addLayer(bomRivers.getLayer());

	//this.map.addLayer(landUsage.getLayer());

	//this.map.addLayer(bbQuality.getLayer());
	//this.map.addLayer(gravityAnomaly.getLayer());
	//this.map.addLayer(historic.getLayer());

	this.map.addLayer(this.getLayer(2).getLayer());
}


/*
	-----------------
	 Layer Prototype
   	-----------------
*/
function Layer() {
	this.timeline = false;
	this.url = "http://"
}

Layer.prototype.setLayer = function(layer) {
	this.layer = layer;
}

Layer.prototype.getLayer = function(id) {
	return this.layer;
}

Layer.prototype.setPlayer = function(player) {
	this.player = player;
}

Layer.prototype.getPlayer = function() {
	return this.player;
}


/*
	-----------------
	     Layers
   	-----------------
*/

Layers.prototype.setupLayers = function() {

	//rivers
	var nmRivers = new Layer();
	var nmRiversSource = new ol.source.TileWMS({
		url: 'http://geoserver.nationalmap.nicta.com.au/geotopo_250k/ows',
		params:{
			layers: "Hydrography:reservoirs,Hydrography:lakes,Hydrography:watercourseareas"
		}
	})

	var nmRiversLayer = new ol.layer.Tile({
		source:nmRiversSource,
		opacity:1
	});
	nmRivers.setLayer(nmRiversLayer);
	this.addLayer(nmRivers, 0);


	//rivers
	var bomRivers = new Layer();
	var bomRiversSource = new ol.source.TileWMS({
		url: 'http://geofabric.bom.gov.au/simplefeatures/ows',
		params:{
			layers: "ahgf_shcarto:AHGFEstuary,ahgf_shcarto:AHGFMappedStream"
		}
	})
	var bomRiversLayer = new ol.layer.Tile({
		source:bomRiversSource,
		opacity:1
	});
	bomRivers.setLayer(bomRiversLayer);
	this.addLayer(bomRivers, 1);


	//flood layers
	var floodRaster = new AnimatedRaster({
		extent: [16323200, -2205879, 16367200, -2164879],
		url: "img/tsv",
		startTime: "0.0"
	});
	var player = new Animater(floodRaster);
	var flood = new Layer();
	flood.setPlayer(player);

	var floodLayer = new ol.layer.Image({
		source:floodRaster.getSource(),
		opacity:1
	});
	flood.setLayer(floodLayer);
	floodRaster.onframe(function updateOverlay(val) {
		//console.log(val);
		floodLayer.changed();
		$("#height .value").html(val)
	});
	this.addLayer(flood, 2);











	//broadband quality
	var bbQuality = new Layer();
	var bbQualitySource = new ol.source.TileWMS({
		url: 'https://programs.communications.gov.au/geoserver/ows',
		params:{
			layers: "mybroadband:MyBroadband_ADSL_Quality_no_outline"
		}
	})
	var bbQualityLayer = new ol.layer.Tile({
		source:bbQualitySource,
		opacity:1
	});
	bbQuality.setLayer(bbQualityLayer);
	this.addLayer(bbQuality, 3);




	//Gravity Anomaly
	var gravityAnomaly = new Layer();
	var gravityAnomalySource = new ol.source.TileArcGISRest({
		url: 'http://'+proxyURL+'www.ga.gov.au/gisimg/rest/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer',
		params: {
			LAYERS: '12'
		}
	})
	var gravityAnomalyLayer = new ol.layer.Tile({
		source:gravityAnomalySource,
		opacity:0.8
	});
	gravityAnomaly.setLayer(gravityAnomalyLayer);
	this.addLayer(gravityAnomaly, 4);


	//Red Zone
	var redZone = new Layer();
	var redZoneSource = new ol.source.TileArcGISRest({
		url: 'http://'+proxyURL+'maps.townsville.qld.gov.au/arcgis/rest/services/MOSAICEXTERNAL/Asset_Infrastructure_Property/MapServer/export',
		params: {
			LAYERS: 'show:61'
		}
	})
	var redZoneLayer = new ol.layer.Tile({
		source:redZoneSource,
		opacity:0.5
	});
	redZone.setLayer(redZoneLayer);
	this.addLayer(redZone, 5);


	//population estimates
	var populationEstimates = new Layer();
	var populationEstimatesSource = new ol.source.TileArcGISRest({
		url: 'http://'+proxyURL+'www.ga.gov.au/gis/rest/services/hazards/NEXIS_National_Exposure_Information_System_Population_Density_Exposure/MapServer',
		params: {
			LAYERS: 'show:0,1,2,3,4'
		}
	})
	var populationEstimatesLayer = new ol.layer.Tile({
		source:populationEstimatesSource,
		opacity:0.8
	});
	populationEstimates.setLayer(populationEstimatesLayer);
	this.addLayer(populationEstimates, 7);


	//housing stress
	var housingStress = new Layer();
	var housingStressSource = new ol.source.TileWMS({
		url: 'https://geoserver.aurin.org.au/nm/wms',
		params: {
			LAYERS: 'housingstress'
		}
	})
	var housingStressLayer = new ol.layer.Tile({
		source:housingStressSource,
		opacity:1
	});
	housingStress.setLayer(housingStressLayer);
	this.addLayer(housingStress, 8);



	//Magnetic Intensity
	var magneticIntensity = new Layer();
	var magneticIntensitySource = new ol.source.TileArcGISRest({
		url: 'http://'+proxyURL+'www.ga.gov.au/gisimg/rest/services/earth_science/Geoscience_Australia_National_Geophysical_Grids/MapServer',
		params: {
			LAYERS: 'show:3'
		}
	})
	varmagneticIntensityLayer = new ol.layer.Tile({
		source:magneticIntensitySource,
		opacity:0.8
	});
	magneticIntensity.setLayer(varmagneticIntensityLayer);
	this.addLayer(magneticIntensity, 9);


	//Current Land Use
	var landUse = new Layer();
	var landUseSource = new ol.source.TileArcGISRest({
		url: 'https://geospatial.information.qld.gov.au/ArcGIS/rest/services/QLD/CurrentLandUse/MapServer',
		params: {
			LAYERS: 'show:20,21,29,22,24'
		}
	})
	landUseLayer = new ol.layer.Tile({
		source:landUseSource,
		opacity:0.5
	});
	landUse.setLayer(landUseLayer);
	this.addLayer(landUse, 10);




	//historic
	for (var i=0; i<this.years.length;i++) {
		var historic = new Layer();
		var historicSource = new ol.source.TileArcGISRest({
			url: 'http://'+proxyURL+'maps.townsville.qld.gov.au/arcgis/rest/services/Imagery/Aerial_Photos_'+this.years[i]+'/MapServer/'
		})
		var historicLayer = new ol.layer.Tile({
			source:historicSource,
			opacity:1
		});
		historic.setLayer(historicLayer);
		this.addLayer(historic, this.layerIDs[i]);
	}

}

Layers.prototype.setTime = function(time) {
	console.log("setting layers");
	if (time < this.years.length) {
		//var year = this.years(time);
		this.setLayers([this.layerIDs[time]]);
	}
}


//land usage - Not working
/*var landUsage = new Layer();
var landUsageSource = new ol.source.TileWMS({
	url: 'https://geospatial.information.qld.gov.au/ArcGIS/rest/services/QLD/CurrentLandUse/MapServer/export',
	params: {
		layers: "show:6",
		bboxSR: "3857",
		imageSR: "3857",
		size: "256x256",
		format: "png",
		transparent: "true",
		f: "image"

	}
})
var landUsageLayer = new ol.layer.Tile({
	source:landUsageSource,
	opacity:1
});
landUsage.setLayer(landUsageLayer);*/



/*
modisTerraLST.setLayer(
	ol.layer.Tile({
		source: new ol.source.XYZ({
        	url: 'http://map1.vis.earthdata.nasa.gov/wmts-webmerc/MODIS_Terra_Land_Surface_Temp_Day/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}',
			attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
			//bounds: [[-85.0511287776, -179.999999975], [85.0511287776, 179.999999975]],
			minZoom: 1,
			maxZoom: 7,
			format: 'png',
			time: '',
			tilematrixset: 'GoogleMapsCompatible_Level',
	     }),
		opacity: 0.75
	})
);*/
