
var map;
var overlay; //current historic overlay node
var overlayLayers;
var baseLayer;
var baseLayers; // base layers include Bing, Stamen and OpenStreetMap
var overlaySelected;


// The parameters for the British National Grid - EPSG:27700

	proj4.defs("EPSG:27700", "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +datum=OSGB36 +units=m +no_defs");


// This code below converts the lat lon into a British National Grid Reference. With thanks from http://www.movable-type.co.uk/scripts/latlong-gridref.html NT261732

    function gridrefNumToLet(e, n, digits) {
        // get the 100km-grid indices
        var e100k = Math.floor(e / 100000),
        n100k = Math.floor(n / 100000);

        if (e100k < 0 || e100k > 6 || n100k < 0 || n100k > 12) return '';

        // translate those into numeric equivalents of the grid letters
        var l1 = (19 - n100k) - (19 - n100k) % 5 + Math.floor((e100k + 10) / 5);
        var l2 = (19 - n100k) * 5 % 25 + e100k % 5;

        // compensate for skipped 'I' and build grid letter-pairs
        if (l1 > 7) l1++;
        if (l2 > 7) l2++;
        var letPair = String.fromCharCode(l1 + 'A'.charCodeAt(0), l2 + 'A'.charCodeAt(0));

        // strip 100km-grid indices from easting & northing, and reduce precision
        e = Math.floor((e % 100000) / Math.pow(10, 5 - digits / 2));
        n = Math.floor((n % 100000) / Math.pow(10, 5 - digits / 2));

        Number.prototype.padLZ = function(w) {
            var n = this.toString();
            while (n.length < w) n = '0' + n;
            return n;
        }

        var gridRef = letPair + e.padLZ(digits / 2) + n.padLZ(digits / 2);

        return gridRef;
    }
	function gridrefLetToNum(gridref) {
	  // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
	  var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
	  var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
	  // shuffle down letters after 'I' since 'I' is not used in grid:
	  if (l1 > 7) l1--;
	  if (l2 > 7) l2--;

	  // convert grid letters into 100km-square indexes from false origin (grid square SV):
	  var e = ((l1-2)%5)*5 + (l2%5);
	  var n = (19-Math.floor(l1/5)*5) - Math.floor(l2/5);

	  // skip grid letters to get numeric part of ref, stripping any spaces:
	  gridref = gridref.slice(2).replace(/ /g,'');

	  // append numeric part of references to grid index:
	  e += gridref.slice(0, gridref.length/2);
	  n += gridref.slice(gridref.length/2);

	  // normalise to 1m grid, rounding up to centre of grid square:
	  switch (gridref.length) {
		case 2: e += '5000'; n += '5000'; break;
	    case 4: e += '500'; n += '500'; break;
	    case 6: e += '50'; n += '50'; break;
	    case 8: e += '5'; n += '5'; break;
	    // 10-digit refs are already 1m
	  }

	  return [e, n];
	}


// the base map layers

// OpenStreetMap
	var osm = new ol.layer.Tile({
	  title: 'Background map - OpenStreetMap',
	  mosaic_id: '4',
    	  visible: false,	
	  source: new ol.source.OSM({
	    // attributions: [ol.source.OSM.DATA_ATTRIBUTION],
	    url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
	  })/*,
	  opacity: 0.7*/
	});


   	var stamentoner = new ol.layer.Tile({
		title: 'Background map - Stamen Toner',
	        mosaic_id: '10',
		type: 'base', 
	        source: new ol.source.Stamen({
	        layer: 'toner'
	      })
	    });

// Bing API key - please generate your own

	var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";

	var BingSatellite =   new ol.layer.Tile({
		title: 'Background map - Bing Satellite',
		mosaic_id: '2',
		type: 'base', 
    		visible: false,	
	        source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'Aerial'
		    })
	});

	var BingRoad = new ol.layer.Tile({
	         title: 'Background map - Bing Road',
		 mosaic_id: '1',
	         type: 'base',
    		 visible: false,	
	         source: new ol.source.BingMaps({
		      key: BingapiKey,
		      imagerySet: 'Road'
		    })
	});

	var BingAerialWithLabels = new ol.layer.Tile({
	          title: 'Background map - Bing Hybrid',
		  mosaic_id: '3',
	          type: 'base',
    		  visible: false,	
	          source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels'
		})
	});

	var StamenWatercolor =  new ol.layer.Tile({
	           title: 'Background map - Water color',
	           type: 'base',
	           source: new ol.source.Stamen({
	                  layer: 'watercolor'
	           })
	});

	var OSOpendata = new ol.layer.Tile({
	              title: 'Background map - OS Opendata',
	              type: 'base',
		      source: new ol.source.XYZ({
				    attributions: [new ol.Attribution({html: 'Contains OS data &copy; Crown copyright and database right 2011'})],
				    url: 'http://geo.nls.uk/maps/opendata/{z}/{x}/{y}.png',
				    // minZoom: 10,
				    maxZoom: 16,
				    tilePixelRatio: 1
				  })
	                    });

// an array of the base layers listed above

	var baseLayers = [BingRoad, BingSatellite, BingAerialWithLabels, osm, OSOpendata, stamentoner];

	BingRoad.setVisible(true);

        setResults();

// sets up the base layers as a set of radio buttons

	    var layerSelect = document.getElementById('layerSelect');
	    for (var x = 0; x < baseLayers.length; x++) {
	        // if (!baseLayers[x].displayInLayerSwitcher) continue;
	        var option = document.createElement('option');
		option.appendChild(document.createTextNode(baseLayers[x].get('title')));
	        option.setAttribute('value', x);
	        option.setAttribute('id', 'baseOption' + baseLayers[x].get('title'));
	        layerSelect.appendChild(option);
	    }

// NLS clickable indexes as overlay layers from GeoServer

    var catalog_1inch_popular = new ol.layer.Tile({
                        title: "Scotland, Ordnance Survey One inch Popular, 1921-1930",
			typename: 'nls:catalog_1inch_popular',
    			visible: false,	
    			source: new ol.source.XYZ({
      				url: "http://geoserver.nls.uk/geodata/gwc/service/gmaps?layers=nls:catalog_1inch_popular&zoom={z}&x={x}&y={y}&format=image/png",
  			attributions: '' })   
    });



    var catalog_1inch_newpop = new ol.layer.Tile({
                        title: "England and Wales, Ordnance Survey One inch New Popular, 1945-47",
			typename: 'nls:new_pop_eng_wales',
    			visible: false,	
    			source: new ol.source.XYZ({
      				url: "http://geoserver.nls.uk/geodata/gwc/service/gmaps?layers=nls:new_pop_eng_wales&zoom={z}&x={x}&y={y}&format=image/png",
  			attributions: '' })   
    });




    var catalog_1inch_seventh = new ol.layer.Tile({
                        title: "Great Britain, Ordnance Survey One inch Seventh Series, 1952-61",
			typename: 'nls:catalog_one_inch_7th_series',
    			visible: false,	
    			source: new ol.source.XYZ({
      				url: "http://geoserver.nls.uk/geodata/gwc/service/gmaps?layers=nls:catalog_one_inch_7th_series&zoom={z}&x={x}&y={y}&format=image/png",
  			attributions: '' })   
    });



    var catalog_6inch = new ol.layer.Tile({
                        title: "Scotland, Ordnance Survey Six Inch, 1843-82",
			typename: 'nls:catalog_6inch',
    			visible: false,	
    			source: new ol.source.XYZ({
      				url: "http://geoserver.nls.uk/geodata/gwc/service/gmaps?layers=nls:catalog_6inch&zoom={z}&x={x}&y={y}&format=image/png",
   			attributions: '' })   
    });

// an array of the overlay layers listed above

    overlayLayers = [  catalog_1inch_popular, catalog_1inch_newpop, catalog_6inch, catalog_1inch_seventh ]

    catalog_1inch_popular.setVisible(true);

		var attribution = new ol.control.Attribution({
		  collapsible: true,
		  label: 'i',
		  collapsed: true,
		  tipLabel: 'Attributions'
		});


		var map = new ol.Map({
		  target: document.getElementById('map'),
		  renderer: 'canvas',
		  controls: ol.control.defaults({ attributionOptions: { collapsed: true, collapsible: true }}),
		  interactions : ol.interaction.defaults({doubleClickZoom :false}),
		  layers: [BingRoad, catalog_1inch_popular],
		  logo: false,
		  view: new ol.View({
		    center: ol.proj.transform([-4.0, 56.0], 'EPSG:4326', 'EPSG:3857'),
		    zoom: 5
		  })
		});

// sets up the overlay layers as a set of radio buttons

       var overlaySelect = document.getElementById('overlaySelect');
           for (var x = 0; x < overlayLayers.length; x++) {
              var checked = (overlayLayers[x].getVisible()) ? "checked" : "";
              overlaySelect.innerHTML += '<p><input type="radio" name="overlay" id="overlayRadio'+ overlayLayers[x].get('title') + '" value="' + x + '" onClick="switchOverlay(this.value)" ' + checked + '><span>' + overlayLayers[x].get('title') + '</span></p>';
       }

// function to change the overlay layer

       function switchOverlay(index) {
		if (map.getLayers().getLength() > 2) map.getLayers().removeAt(2);
		setResults();
		map.getLayers().getArray()[1].setVisible(false);
		map.getLayers().removeAt(1);
		map.getLayers().insertAt(1,overlayLayers[index]);
		overlaySelected = overlayLayers[index];
	    	overlaySelected.setVisible(true);
		map.getLayers().getArray()[1].setOpacity(opacity);
	}


// the function executed on a single map click event

	map.on('singleclick', function(evt)
		{
		setResults("Loading... please wait");
		if (map.getLayers().getLength() > 2) map.getLayers().removeAt(2); 
		
// converts coordinates into the British National Grid as the shapefiles in GeoServer are in BNG ESPG:27700

		var coord = evt.coordinate;
		var transformed_coordinate = ol.proj.transform(coord,"EPSG:3857", "EPSG:4326");
		var transformed_coordinate27700 = ol.proj.transform(coord,"EPSG:3857", "EPSG:27700");
		
// retrieve the Typename of the currently selected overlay Layer

		if (overlaySelected == undefined)
		{overlaySelected = overlayLayers[0];}

		TypeName = overlaySelected.get('typename');
		
// the WFS request to GeoServer

		var urlgeoserver =  'http://geoserver.nls.uk/geodata/wfs?service=WFS' + 
				'&version=1.1.0&request=GetFeature&typename=' + TypeName +
				'&outputFormat=text/javascript&format_options=callback:loadFeatures' +
				'&srsname=EPSG:3857&cql_filter=INTERSECTS(the_geom,POINT(' 
				+ transformed_coordinate27700[0] + ' ' + transformed_coordinate27700[1] + '))'; 

		// format used to parse WFS GetFeature responses
		
		var geojsonFormat = new ol.format.GeoJSON();

		var vectorSource = new ol.source.Vector({
		  loader: function(extent, resolution, projection) {
			var url = urlgeoserver
		    	$.ajax({url: url, dataType: 'jsonp', jsonp: false})
		  },
		  strategy: ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
		    maxZoom: 19
		  }))
		});
		
		window.loadFeatures = function(response) {
		  vectorSource.addFeatures(geojsonFormat.readFeatures(response));

		var featuresALL = response.features;

		var results = "";

		if (featuresALL.length < 1)
			results += '<br/><p id="noMapsSelected">No maps selected - please click on a coloured shape on the map to the left that covers the area you are interested in</p>';

		else if (featuresALL.length == 1)
	            results += '<p><strong>Results - 1 map:</strong><br />(click to view)</p>';
		else if (featuresALL.length > 1)

	        results += '<p><strong>Results - ' + featuresALL.length + ' maps:</strong><br />(click to view)</p>';

		for (var x = 0; x < featuresALL.length; x++) {

 			results += '<p><a href="' + featuresALL[x].properties.IMAGEURL + 
				'"><img src="' + featuresALL[x].properties.IMAGETHUMB + '" width="150" /><br />'  + featuresALL[x].properties.SHEET + 
				'</a><br />' + featuresALL[x].properties.DATES + '</p>';
			}
	            	setResults(results);
		};

// the style of the selected feature

	        var selectedStyle = new ol.style.Style({
	                stroke: new ol.style.Stroke({
	                        color: 'blue',
	                        width: 4
	                    }),
		    	fill: new ol.style.Fill({
				color: 'rgba(0, 0, 250, 0.1)'
	                    }),
	                });

// the vector layer for the selected feature

	            var vectorLayer = new ol.layer.Vector({
			mosaic_id: '200',
	  		title: "vectors - vectors",
	                source: vectorSource,
	                style: selectedStyle
	            });
	
		if (map.getLayers().getLength() < 3)
			{
			    map.getLayers().insertAt(2,vectorLayer);
			}
	});


// Change base layer

	var changemap = function(index) {
	  map.getLayers().getArray()[0].setVisible(false);
	  map.getLayers().removeAt(0);
	  map.getLayers().insertAt(0,baseLayers[index]);
	  map.getLayers().getArray()[0].setVisible(true);
	}

// add the OL ZoomSlider and ScaleLine controls

    map.addControl(new ol.control.ZoomSlider());
    map.addControl(new ol.control.ScaleLine({ units:'metric' }));

    map.removeInteraction(new ol.interaction.DoubleClickZoom({
		duration: 1000
		})
   	);	

    var mouseposition = new ol.control.MousePosition({
            projection: 'EPSG:4326',
            coordinateFormat: function(coordinate) {
	    // BNG: ol.extent.applyTransform([x, y], ol.proj.getTransform("EPSG:4326", "EPSG:27700"), 
		var coord27700 = ol.proj.transform(coordinate, 'EPSG:4326', 'EPSG:27700');
		var templatex = '{x}';
		var outx = ol.coordinate.format(coord27700, templatex, 0);
		var templatey = '{y}';
		var outy = ol.coordinate.format(coord27700, templatey, 0);
		NGR = gridrefNumToLet(outx, outy, 6);
		var hdms = ol.coordinate.toStringHDMS(coordinate);
		if ((outx  < 0) || (outx > 700000 ) || (outy < 0) || (outy > 1300000 )) {
	        return '<strong>' + ol.coordinate.format(coordinate, '{x}, {y}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; 
		}
		else 
                { return '<strong>' + NGR + '</strong>&nbsp; <br/>' + ol.coordinate.format(coord27700, '{x}, {y}', 0) + 
			'&nbsp; <br/>' + ol.coordinate.format(coordinate, '{x}, {y}', 4) + '&nbsp; <br/>&nbsp;' + hdms + ' &nbsp;'; }
            	}
    });

    map.addControl(mouseposition);


// Initialize the Gazetteer with autocomplete and County+Parish selector
     nlsgaz(function(minx,miny,maxx,maxy){
      // alert(minx + ' ' + miny + ' ' + maxx + ' ' + maxy);

      // zoom to gridref
      if (miny == null) {
         var osgbnum = gridrefLetToNum(minx);
	 // console.log(osgbnum);
         // var osgb = new OpenLayers.LonLat(osgbnum[0], osgbnum[1]);
	 point27700 = [];
	 point27700.push(parseFloat(osgbnum[0]), parseFloat(osgbnum[1]));
	 console.log(point27700);
	 point3857 = [];
	 point3857 = ol.proj.transform(point27700,"EPSG:27700", "EPSG:3857");
	 var a = map.getView().setCenter(point3857);
    	 var b = map.getView().setZoom(7+minx.length);

	 return a && b;

      }
      // zoom to bbox
      var extent = [minx, miny, maxx, maxy];
        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
        map.getView().fitExtent(extent, map.getSize());
       
	if (map.getView().getZoom() > 16 )
	{map.getView().setZoom(16);}

     });

// the populates the results div on the right with default text 


function setResults(str) {
    if (!str) str = "<p>No maps selected - please click on a coloured shape on the map to the left that covers the area you are interested in</p>";
    document.getElementById('results').innerHTML = str;
}




