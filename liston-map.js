

var DEFAULT_LON = -76.78;
var DEFAULT_LAT = 39.41;
var DEFAULT_ZOOM = 6;
var pointClicked;
var urlLayerName;
var overlaySelected;


// necessary for use of Bing layers - generate your own at: https://msdn.microsoft.com/en-us/library/ff428642.aspx

	var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";
		// a generic attribution variable for NLS historic map tilesets
		var NLS_attribution = new ol.Attribution({
		 html: 'Historic background maps courtesy of the <a href="http://maps.nls.uk/">National Library of Scotland</a>' 
	});

// bounds of the map view

	var maxExtent = ol.proj.transformExtent([-100.0,0,10.0,70.0], 'EPSG:4326', 'EPSG:3857');

// zooms left-hand map to the extents of each tour

	function zoomtoextent() {
	        var extent = [mapleft.getLayers().getArray()[1].get('minx'), mapleft.getLayers().getArray()[1].get('miny'), mapleft.getLayers().getArray()[1].get('maxx'), mapleft.getLayers().getArray()[1].get('maxy')];
	        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
	        mapleft.getView().fitExtent(extent, mapleft.getSize());
	        mapright.getView().fitExtent(extent, mapleft.getSize());
	}
	
	function getbaseLayer(mosaic_id) {
	   var layers = baseLayers.slice();
	   for (var x = 0; x < layers.length; x++) {
	       if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
	   }
	}
	
	function getOverlay(mosaic_id) {
	    var layers = tourLayers.slice();
	    for (var x = 0; x < layers.length; x++) {
	        if (layers[x].get('mosaic_id') == mosaic_id) return layers[x];
	    }
	}

// parses the string following # in URL

	function loadOptions()
		{
		args = [];
		var hash = window.location.hash;
		if (hash.length > 0)
			{
			var elements = hash.split('&');
			elements[0] = elements[0].substring(1); /* Remove the # */
			for(var i = 0; i < elements.length; i++)
				{
				var pair = elements[i].split('=');
				args[pair[0]] = pair[1];
				}
			}
		}
	
	function setZoomLimit()
		{ 
		updateUrl();
		}
	
	function setPanEnd()
		{
		updateUrl();
		}

// create and update URL

	function updateUrl()
	    {
		 if (urlLayerName == undefined)
		 {
			urlLayerName = 'ALL';
		 }
	
//		 else 
//		{
//		 if (mapleft.getLayers().getLength() > 1) urlLayerName = mapleft.getLayers().getArray()[1].get('mosaic_id');
//		 }
		
		if (pointClicked == undefined)
		{
		pointClicked = '0,0';
		}
		var centre = ol.proj.transform(mapleft.getView().getCenter(), "EPSG:3857", "EPSG:4326");
		window.location.hash = "zoom=" + mapleft.getView().getZoom()  + "&lat=" + centre[1].toFixed(4)  + "&lon=" + centre[0].toFixed(4) + "&tour=" + urlLayerName + "&point=" + pointClicked ; 
	     }



// OpenStreetMap

	var osm = new ol.layer.Tile({
	 
		title: 'Background - OpenStreetMap',
		        visible: false,
		 
		source: new ol.source.OSM({
		attributions: [new ol.Attribution({html:'&copy; <a href="http://www.openstreetmap.org/">OpenStreetMap</a> contributors'})],
		   
		url: 'http://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		 
		})
	});

// Bing layers

	var BingSatellite =   new ol.layer.Tile({
		title: 'Background - Bing Satellite',
		        visible: false,
		       source: new ol.source.BingMaps({
		key: BingapiKey,
		imagerySet: 'Aerial'
	   })
	});
	
	var BingRoad = new ol.layer.Tile({
	       title: 'Background - Bing Road',
	        visible: false,
	       source: new ol.source.BingMaps({
	     key: BingapiKey,
	     imagerySet: 'Road'
	   })
	});
	
	var BingAerialWithLabels = new ol.layer.Tile({
		       title: 'Background - Bing Hybrid',
		        visible: false,
		       source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels'
		})
	});
	
	
	var mapboxstreets =  
		new ol.layer.Tile({
			           title: 'Background - MapBox Streets',
			        visible: false,
			   source: new ol.source.XYZ({
			// attributions: [nlsTILEATTRIBUTION],
			url: 'http://api.tiles.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiY2hyaXNmbGVldCIsImEiOiJqX1Z1RC1BIn0.EWTBwPuV5hT1bfnyP2cn_w',
			// minZoom: 10,
			// maxZoom: 15,
				tilePixelRatio: 1
			})
	          });

		var stamentoner = new ol.layer.Tile({
			title: 'Background Map - Stamen Toner',
			       mosaic_id: '10',
			        visible: false,
			       source: new ol.source.Stamen({
			       layer: 'toner'
			     })
		   });
		
		
		var stamentonerOV = new ol.layer.Tile({
			title: 'Background - Stamen Toner',
			       mosaic_id: '10',
			        visible: true,
			       source: new ol.source.Stamen({
			       layer: 'toner'
			     })
		   });
		
		var StamenWatercolor =  new ol.layer.Tile({
		          title: 'Background - Stamen Watercolor',
		          visible: false,
		          source: new ol.source.Stamen({
		                 layer: 'watercolor'
		          })
		});



		var stamenterrain = new ol.layer.Tile({
			title: 'Background - Stamen Terrain',
			       mosaic_id: '10',
			        visible: true,
			       source: new ol.source.Stamen({
			       layer: 'terrain'
			     })
		   });
		
		var oldmapsonline = new ol.layer.Tile({
			title: "Background - OldMapsOnline",
			source: new ol.source.XYZ({
			url: "https://klokantech-0.tilehosting.com/styles/oldmapsonline/rendered/{z}/{x}/{y}.png?key=ev9AGknsB0QtXEgJtrNO"
		
		 })
		});
		
		var osm_streets = new ol.layer.Tile({
			title: "Background - OSM Streets",
			source: new ol.source.XYZ({
			url: "https://klokantech-0.tilehosting.com/styles/basic/rendered/{z}/{x}/{y}.png?key=ev9AGknsB0QtXEgJtrNO"
		
		 })
		});

// the Web Tile Map Service layers from NLS - view full list at: http://maps.nls.uk/geo/explore/scripts/explore-layers.js


		var arrowsmith_attribution = new ol.Attribution({
		 	html: "Aaron Arrowsmith, 'Chart of the world on Mercator's projection...' (1796)."
		});
		
		var faden_america_attribution = new ol.Attribution({
		 	html: "William Faden, 'The United States of North America…' (1796)."
		});
		
		var faden_caribbean_attribution = new ol.Attribution({
		 	html: "William Faden, 'A General Chart of the West India Islands…' (1796)."
		});


		
		var arrowsmith_world = new ol.layer.Tile({
			title: "Arrowsmith - World",
			source: new ol.source.XYZ({
			attributions: [arrowsmith_attribution],
			url: "http://geo.nls.uk/mapdata3/100611144/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 8
			 })
		});
		
		var faden_america = new ol.layer.Tile({
			title: "William Faden",
			source: new ol.source.XYZ({
			attributions: [faden_america_attribution],
			url: "http://geo.nls.uk/mapdata3/122170812/{z}/{x}/{y}.png",
			extent: ol.proj.transformExtent([-109.597691, 21.391718, -48.250326, 55.105487], 'EPSG:4326', 'EPSG:3857'),
			minZoom: 1,
			maxZoom: 10
			 })
		});
		
		var faden_america_zoom = new ol.layer.Tile({
			title: "William Faden",
			source: new ol.source.XYZ({
			url: "http://geo.nls.uk/mapdata3/122170812_zoom/{z}/{x}/{y}.png",
			minZoom: 9,
			maxZoom: 11
			 })
		});

	var faden_caribbean = new ol.layer.Tile({
		title: "William Faden",
		source: new ol.source.XYZ({
		attributions: [faden_caribbean_attribution],
		url: "http://geo.nls.uk/mapdata3/122170815/{z}/{x}/{y}.png",
		extent: ol.proj.transformExtent([-88.691979, 8.240951, -58.137256, 28.835113], 'EPSG:4326', 'EPSG:3857'),
		minZoom: 1,
		maxZoom: 10
		 })
	});


// an array of the base layers listed above

	var baseLayers = [stamentoner, stamenterrain, StamenWatercolor, oldmapsonline, osm_streets, mapboxstreets, BingSatellite, BingRoad];

// makes the stamentoner layer visible

	stamentoner.setVisible(true);

// generate layerSelect drop-down for the baseLayers

   var layerSelect = document.getElementById('layerSelect');
   for (var x = 0; x < baseLayers.length; x++) {
       // if (!baseLayers[x].displayInLayerSwitcher) continue;
       var option = document.createElement('option');
       option.appendChild(document.createTextNode(baseLayers[x].get('title')));
       option.setAttribute('value', x);
       option.setAttribute('id', 'baseOption' + baseLayers[x].get('title'));
       layerSelect.appendChild(option);
   }



// Define styles for circles

            var normalStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: 'rgba(23, 255, 54, 0.3)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.9)',
                        width: 2
                    })
                })
            });

            var normalStyleSmall = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 2,
                    fill: new ol.style.Fill({
                        color: 'rgba(23, 255, 54, 0.6)',
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0, 0, 0, 0.9)',
                        width: 1
                    })
                })
            });




             var selectedStyle = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                        fill: new ol.style.Fill({
                        color: 'rgba(255, 153, 0,0.9)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.9)',
                        width: 3
                    })
                })
            });



var liston_tour_style_1 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(239, 66, 233,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_2 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(51, 119, 255,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_3 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(119, 255, 51,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_4 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(113, 34, 11,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_5 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(204, 204, 0,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_6 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 0, 102,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_7 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(51, 51, 153,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
var liston_tour_style_8 = new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 6,
                    fill: new ol.style.Fill({
                        color: 'rgba(0, 102, 0,0.6)'
                    }),
                    stroke: new ol.style.Stroke({
                        color: 'rgba(0,0,0,0.8)',
                        width: 3
                    })
                })
            });
            var selectedTextStyleFunction = function(name) {
                return new ol.style.Style({
                    text: new ol.style.Text({
                        font: '14px helvetica,sans-serif',
                        text: name,
                        fill: new ol.style.Fill({
                            color: '#000'
                        }),
                        stroke: new ol.style.Stroke({
                            color: '#fff',
                            width: 2
                        })
                    })
                });
            };           


// style function for the Liston routes lines

var function_liston_routes = function(feature, resolution) {
       var geometry = feature.getGeometry();
       var linestring_width = 4;
       var linedash = [3, 5,3,5];
	if(resolution>1000) {
	                    linestring_width = 3;
			     linedash = [1,1];
	}
	else if(resolution<1000) {
                linestring_width = 4;
		linedash = [3, 5,3,5];
               }


       var styles = [
         // linestring
         new ol.style.Style({
           stroke: new ol.style.Stroke({
             color: feature.get('Color'),
             width: linestring_width,
		lineDash: linedash,
           })
         })
       ];
          var arrowimage = feature.get('arrow');
               if(resolution>=500) {
                   arrowimage = 'http://geo.nls.uk/maps/dev/liston/img/none.png';
               } 
    geometry.forEachSegment(function(start, end) {
         var dx = end[0] - start[0];
         var dy = end[1] - start[1];
         var rotation = Math.atan2(dy, dx);
         // arrows
         styles.push(new ol.style.Style({
           geometry: new ol.geom.Point(end),
           image: new ol.style.Icon({
             src: arrowimage,
             anchor: [1.2, 0.5],
             rotateWithView: false,
    	     opacity: 0.8,
             rotation: -rotation
           })
         }));
       });
       return styles;
     };


   var liston_routes = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'file:///C:/Chris/liston_layers/scripts/all_routes.js',
	    url: 'http://geo.nls.uk/maps/dev/liston/scripts/all_routes.js',
	       format: new ol.format.GeoJSON(),
	 }),
   style: function_liston_routes
  // maxResolution: 305.748113140705
   });


// styles for each of the Liston tours

   var StyleFunction_liston_tour_1 = function(feature, resolution) {

 		 var radius_tour_1 = '7';
                var strokewidth = '2';
                if(resolution>2000) {
                    radius_tour_1 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_1 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_1,
                   fill: new ol.style.Fill({
                       color: 'rgba(239, 66, 233,0.6)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 51, 204, 0.9)',
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_1 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	  // url: 'file:///C:/Chris/liston_layers/scripts/1_North_America_1796.js',
	   url: 'http://geo.nls.uk/maps/dev/liston/scripts/1_North_America_1796.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_1,
	 	maxResolution: 2500
   });

   var liston_line_1 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'file:///C:/Chris/liston_layers/scripts/1_North_America_1796_route.js',
	    url: 'http://geo.nls.uk/maps/dev/liston/scripts/1_North_America_1796_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });

// liston_tour_1 Group - liston_tour_1 itinerary and point circles together

	var liston_tour_1_group = new ol.layer.Group({
	            title: 'North America, 1796',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '1',
			layers: [liston_line_1, liston_tour_1],
			minx: -78.1633,
			miny: 38.708,
			maxx: -73.9868,
			maxy: 40.732
	});

var StyleFunction_liston_tour_2 = function(feature, resolution) {

                var radius_tour_2 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_2 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_2 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_2,
                   fill: new ol.style.Fill({
                       color: 'rgba(51, 119, 255, 0.5)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_2 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		 //  url: 'file:///C:/Chris/liston_layers/scripts/2_Southern_States.js',
		  url: 'http://geo.nls.uk/maps/dev/liston/scripts/2_Southern_States.js',
	       format: new ol.format.GeoJSON(),
	 }),
   	style: StyleFunction_liston_tour_2,
	 	maxResolution: 2500
   });


   var liston_line_2 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		 //  url: 'file:///C:/Chris/liston_layers/scripts/2_Southern_States_route.js',
		  url: 'http://geo.nls.uk/maps/dev/liston/scripts/2_Southern_States_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });

// liston_tour_1 Group - liston_tour_1 itinerary and point circles together

	var liston_tour_2_group = new ol.layer.Group({
	            title: 'Tour to Southern States, 1797-8',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '2',
			layers: [liston_line_2, liston_tour_2],
			minx: -80.8923,
			miny: 32.7765,
			maxx: -75.1516,
			maxy: 39.9525
	});



var StyleFunction_liston_tour_3 = function(feature, resolution) {

                var radius_tour_3 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_3 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_3 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_3,
                   fill: new ol.style.Fill({
                    color: 'rgba(0, 102, 0, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_3 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 //  url: 'file:///C:/Chris/liston_layers/scripts/3_NewYorkandEasternStates.js',
	  url: 'http://geo.nls.uk/maps/dev/liston/scripts/3_NewYorkandEasternStates.js',
	       format: new ol.format.GeoJSON(),
	 }),
  	style: StyleFunction_liston_tour_3,
	 	maxResolution: 2500
   });

   var liston_line_3 = new ol.layer.Vector({
	 source: new ol.source.Vector({

	 //  url: 'file:///C:/Chris/liston_layers/scripts/3_NewYorkandEasternStates_route.js',
	  url: 'http://geo.nls.uk/maps/dev/liston/scripts/3_NewYorkandEasternStates_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_3_group = new ol.layer.Group({
	            title: 'New York & Eastern States, 1798',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '3',
			layers: [liston_line_3, liston_tour_3],
			minx: -75.1516,
			miny: 39.9525,
			maxx: -70.2553,
			maxy: 43.6615
	});


 var StyleFunction_liston_tour_4 = function(feature, resolution) {

                var radius_tour_4 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_4 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_4 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_4,
                   fill: new ol.style.Fill({
                       color: 'rgba(255, 0, 102, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_4 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/4_North_America.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/4_North_America.js',
	       format: new ol.format.GeoJSON(),
	 }),
	   style: StyleFunction_liston_tour_4,
	 	maxResolution: 2500
   });

   var liston_line_4 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/4_North_America_route.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/4_North_America_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_4_group = new ol.layer.Group({
	            title: 'North America, 1799',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '4',
			layers: [liston_line_4, liston_tour_4],
			minx: -75.1516,
			miny: 39.9525,
			maxx: -73.2977,
			maxy: 43.8417
	});

 	var StyleFunction_liston_tour_5 = function(feature, resolution) {

                var radius_tour_5 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_5 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_5 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_5,
                   fill: new ol.style.Fill({
                       color: 'rgba(204, 204, 0, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_5 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/5_Niagara.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/5_Niagara.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_5,
	 	maxResolution: 2500
   });

   var liston_line_5 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/5_Niagara_route.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/5_Niagara_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_5_group = new ol.layer.Group({
	            title: 'Falls of Niagara, 1799',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '5',
			layers: [liston_line_5, liston_tour_5],
			minx: -79.1502,
			miny: 42.6498,
			maxx: -73.7536,
			maxy: 43.4553
	});
 
	var StyleFunction_liston_tour_6 = function(feature, resolution) {

                var radius_tour_6 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_6 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_6 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_6,
                   fill: new ol.style.Fill({
                       color: 'rgba(113, 34, 11, 0.4)',

                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_6 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/6_Natural_Bridge.js',
	   url: 'http://geo.nls.uk/maps/dev/liston/scripts/6_Natural_Bridge.js',
	       format: new ol.format.GeoJSON(),
	 }),
	   style: StyleFunction_liston_tour_6,
		 	maxResolution: 2500
   });
 
   var liston_line_6 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/6_Natural_Bridge_route.js',
	   url: 'http://geo.nls.uk/maps/dev/liston/scripts/6_Natural_Bridge_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_6_group = new ol.layer.Group({
	            title: 'Natural Bridge in Virginia, 1800',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '6',
			layers: [liston_line_6, liston_tour_6],
			minx: -79.5431,
			miny: 37.6301,
			maxx: -75.1516,
			maxy: 40.0535
	});

	var StyleFunction_liston_tour_7 = function(feature, resolution) {

                var radius_tour_7 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_7 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_7 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_7,
                   fill: new ol.style.Fill({
                       color: 'rgba(51, 51, 153, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_7 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 //  url: 'file:///C:/Chris/liston_layers/scripts/7_Lower_Canada.js',
	   url: 'http://geo.nls.uk/maps/dev/liston/scripts/7_Lower_Canada.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_7,
		 	maxResolution: 2500
   });

   var liston_line_7 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		 //  url: 'file:///C:/Chris/liston_layers/scripts/7_Lower_Canada_route.js',
		   url: 'http://geo.nls.uk/maps/dev/liston/scripts/7_Lower_Canada_route.js',
		       format: new ol.format.GeoJSON(),
		 }),
	    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_7_group = new ol.layer.Group({
	            title: 'Lower Canada, 1800',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '7',
			layers: [liston_line_7, liston_tour_7],
			minx: -75.1516,
			miny: 39.9525,
			maxx: -70.9312,
			maxy: 46.9295
	});
 
	var StyleFunction_liston_tour_8 = function(feature, resolution) {

                var radius_tour_8 = '7';
                var strokewidth = '1';
                if(resolution>2000) {
                    radius_tour_8 = '3';
			   strokewidth = '0.5';
			}
			else if(resolution>1000) {
                   radius_tour_8 = '4';
                   strokewidth = '1';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_8,
                   fill: new ol.style.Fill({

                       color: 'rgba(119, 255, 51, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: '#0a2f6b'    ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_8 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/8_West_Indies.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/8_West_Indies.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_8,
	 	maxResolution: 2500
   });

   var liston_line_8 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	//   url: 'file:///C:/Chris/liston_layers/scripts/8_West_Indies_route.js',
	 url: 'http://geo.nls.uk/maps/dev/liston/scripts/8_West_Indies_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_8_group = new ol.layer.Group({
	            title: 'United States to West Indies, 1800-1',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '8',
			layers: [liston_line_8, liston_tour_8],
			minx: -76.3315,
			miny: 13.1514,
			maxx: -50,
			// maxx: -5.09264,
			maxy: 50.15

	});
 

	var liston_all = new ol.layer.Group({
	            title: 'ALL TOURS, 1796-1801',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '0',
			layers: [liston_routes, liston_tour_1, liston_tour_2, liston_tour_3, liston_tour_4, liston_tour_5, liston_tour_6, liston_tour_7, liston_tour_8 ],
			minx: -80.8923,
			miny: 13.1514,
			maxx: -50,
			// maxx: -5.09264,
			maxy: 50.15
	});

// an array of the Liston tour layers listed above

var tourLayers = [ liston_all, liston_tour_1_group, liston_tour_2_group, liston_tour_3_group, liston_tour_4_group, liston_tour_5_group, liston_tour_6_group, liston_tour_7_group, liston_tour_8_group ];

// makes the Liston All ROUTES layer visible

liston_all.setVisible(true);

//  generate the Liston tours drop-down list for the tourLayers

   var tourSelect = document.getElementById('tourSelect');
   for (var x = 0; x < tourLayers.length; x++) {
       // if (!baseLayers[x].displayInLayerSwitcher) continue;
       var option = document.createElement('option');
       option.appendChild(document.createTextNode(tourLayers[x].get('title')));
       option.setAttribute('value', x);
       option.setAttribute('color', tourLayers[x].get('color'));
       option.setAttribute('font-family', "Cormorant");
       option.setAttribute('id', 'tourOption' + tourLayers[x].get('title'));
       tourSelect.appendChild(option);
   }

loadOptions();

var currentZoom = DEFAULT_ZOOM;
var currentLat = DEFAULT_LAT;
var currentLon = DEFAULT_LON;

	if (args['zoom'])
		{
		currentZoom = args['zoom'];
		}
	if (args['lat'] && args['lon'])
		{
		currentLat = parseFloat(args['lat']); /* Necessary for lat (only) for some reason, otherwise was going to 90-val. Very odd... */
		currentLon = parseFloat(args['lon']);
		}
	if (args['zoom'] && args['lat'] && args['lon'])
		{
		defaultLLZ = false;
		}
	if (args['tour'])
		{
			urlLayerName = args['tour'];
		}

	if (args['point'])
		{
		pointClicked = args['point'];
		}


// overviewmap

	var overviewMapControl = new ol.control.OverviewMap({
	 // see in overviewmap-custom.html to see the custom CSS used
	 className: 'ol-overviewmap ol-custom-overviewmap',
	
	 // layers: baseLayers[0],
	 layers: [stamentonerOV],
	 collapseLabel: '\u00AB',
	 label: '\u00BB',
	 collapsed: false
	});

// attribution on the map

	var attribution = new ol.control.Attribution({
	 collapsible: true,
	 label: 'i',
	 collapsed: true,
	 tipLabel: 'Attributions'
	});

// the main ol map classes


var mapleft = new ol.Map({
	 target: 'mapleft',
	 renderer: 'canvas',
	 controls: ol.control.defaults({ attributionOptions: { collapsed: true, collapsible: true }}).extend([overviewMapControl ]),
	 layers: [stamentoner],
	 logo: false,
	 loadTilesWhileAnimating: true,
	 view: new ol.View({
	   center: ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857'),
	   zoom: currentZoom,
	   extent: maxExtent,
	   minZoom: 3,
	   maxZoom: 13,
	 })
});

var mapright = new ol.Map({
	 target: 'mapright',
	 renderer: 'canvas',
	 layers: [arrowsmith_world, faden_caribbean, faden_america, faden_america_zoom],
	 logo: false,
	 loadTilesWhileAnimating: true,
	 view: new ol.View({
	   center: mapleft.getView().getCenter(),
	   extent: maxExtent,
	   minZoom: 3,
	   maxZoom: 9,
	 })
});


	if (getOverlay(urlLayerName) == undefined) {
		overlaySelected = tourLayers[0];
	}
	else
	{
	var overlaySelected = getOverlay(urlLayerName);
	}

    	overlaySelected.setVisible(true);
    	mapleft.getLayers().insertAt(1,overlaySelected);

	document.getElementById("tourSelect").selectedIndex = urlLayerName ;

	if (document.getElementById('ListonTourNo') != null) { ListonTourNo(urlLayerName); }

	updateUrl();

	closetours();

       var scaleline = new ol.control.ScaleLine();
       mapleft.addControl(scaleline);

	var mouseposition = new ol.control.MousePosition({
	             projection: 'EPSG:4326'
	});

//    mapleft.addControl(mouseposition);

// by default, generate text in the wfsResultsleft div

	document.getElementById('wfsResultsleft').innerHTML = '<strong>Zoom in and click on circles to view details of places the Listons visited ...</strong>';

            var selectedFeatures = [];

// Unselect previous selected features

            function unselectPreviousFeatures() {
                var i;
                for(i=0; i< selectedFeatures.length; i++) {
                    selectedFeatures[i].setStyle(null);
                }
                selectedFeatures = [];
            }

// main function to select tour circle features on mouse click

	var displayFeatureInfo = function(pixel) {
 
		 var feature = mapleft.forEachFeatureAtPixel(pixel, function(feature, layer) {
			
	                   feature.setStyle([
	                        selectedStyle
				// StyleFunction_selectedStyle
	                   ]);
	                 selectedFeatures.push(feature);
	
			 }, null, function(layer) {
			 
			var selectedTour = mapleft.getLayers().getArray()[1].get("mosaic_id");
				
			if (selectedTour == '1')                                
		  	{ return layer !== liston_line_1; }
			if (selectedTour == '2')                                
		  	{ return layer !== liston_line_2; }
			if (selectedTour == '3')                                
		  	{ return layer !== liston_line_3; }
			if (selectedTour == '4')                                
		  	{ return layer !== liston_line_4; }
			if (selectedTour == '5')                                
		  	{ return layer !== liston_line_5; }
			if (selectedTour == '6')                                
		  	{ return layer !== liston_line_6; }
			if (selectedTour == '7')                                
		  	{ return layer !== liston_line_7; }
			if (selectedTour == '8')                                
		  	{ return layer !== liston_line_8; }
		
			else
			{ return layer !== liston_routes; }
		
		});

	var info = document.getElementById('wfsResultsleft');

	if (selectedFeatures.length == 1) {

	urlLayerName = selectedFeatures[0].get("TOUR_NO");
	if (document.getElementById('ListonTourNo') != null) { ListonTourNo(urlLayerName); }
	updateUrl();

	}

	if ((selectedFeatures.length == 2) && (selectedFeatures[0].get("TOUR_NO") == selectedFeatures[1].get("TOUR_NO"))) {
	urlLayerName = selectedFeatures[0].get("TOUR_NO");
	if (document.getElementById('ListonTourNo') != null) { ListonTourNo(urlLayerName); }
	updateUrl();

	}

	if ((selectedFeatures.length == 2) && (selectedFeatures[0].get("TOUR_NO") !== selectedFeatures[1].get("TOUR_NO"))) {
	document.getElementById('ListonTourNo').innerHTML = "";
	urlLayerName = 'ALL';
	updateUrl();

	}

	if (selectedFeatures.length > 2)  {
	document.getElementById('ListonTourNo').innerHTML = "";
	urlLayerName = 'ALL';
	updateUrl();

	}
	 
	if (selectedFeatures.length > 0) {

		var coords = selectedFeatures[0].getGeometry().getCoordinates();
		
		espg3587 = [];
		espg3587 = ol.proj.transform(coords,"EPSG:3857", "EPSG:4326");
		
		
		pointClicked = [];
		pointClicked.push(espg3587[1].toFixed(4), espg3587[0].toFixed(4));
		updateUrl();
		
		var results = "";

// console.log(selectedFeatures);

//selectedFeatures.sort(function(a, b){
//    return a.DOD_PAGE-b.DOD_PAGE
//})

		selectedFeatures.sort(function(a, b){
		   var nameA=a.get("NO"), nameB=b.get("NO")
		   if (nameA < nameB) //sort string ascending
		       return -1 
		   if (nameA > nameB)
		       return 1
		   return 0 //default return value (no sorting)
		})

                var k;
                for(k=0; k< selectedFeatures.length; k++) {
                   // selectedFeatures[i].setStyle(null);
 
		results += '<table><tr><td class="heading1" ><strong>Place: </strong></td><td class="info"> ' + selectedFeatures[k].get("MODERN_PLA");

		if (selectedFeatures[k].get("OTHER_NAME") != "NULL") {

			results +=  '<tr><td class="heading"><strong>Name in Journal: </strong></td><td class="info">'  + selectedFeatures[k].get("OTHER_NAME") + '</td></tr>';
			}
 
		//  '</td></tr><tr><td class="heading"><strong>No: </strong></td><td class="info"> '  + selectedFeatures[k].get("NO") + 
		results +=  '</td></tr><tr><td class="heading"><strong>Date visited: </strong></td><td class="info"> '  + selectedFeatures[k].get("DATE") + 
		  '</td></tr><tr><td>&nbsp;</td></tr><tr><td class="heading"><strong>Tour: </strong></td><td class="info"> ' + selectedFeatures[k].get("TOUR_NAME") +
		  '</td></tr><tr></tr><tr><td class="heading"><strong>View diary: </strong></td><td class="link"><a href="http://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID1") + '">Page '  + selectedFeatures[k].get("PAGE1") + '</a></td></tr>';

		if (selectedFeatures[k].get("PAGE2") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View diary: </strong></td><td class="link"><a href="http://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID2") + '">Page '  + selectedFeatures[k].get("PAGE2") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE3") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View diary: </strong></td><td class="link"><a href="http://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID3") + '">Page '  + selectedFeatures[k].get("PAGE3") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE4") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View diary: </strong></td><td class="link"><a href="http://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID3") + '">Page '  + selectedFeatures[k].get("PAGE3") + '</a></td></tr>';
			}

		results +=  '</table></br><hr2></hr2></br>';
               }
	 info.innerHTML = results;

	 } else {
	   pointClicked = '0,0';
	   updateUrl();
	   info.innerHTML = '<strong>Zoom in and click on circles to view details of places the Listons visited ...</strong>';
	   document.getElementById('ListonTourNo').innerHTML = "";
	 }

};


// sets up slave cross-hairs on each map

		var iconFeature = new ol.Feature();
		
		var iconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [10, 10],
		    anchorXUnits: 'pixels',
		    anchorYUnits: 'pixels',
		    src: 'http://maps.nls.uk/geo/img/cross.png'
		  }))
		});
		
	
		iconFeature.setStyle(iconStyle);
	
		var vectorSource = new ol.source.Vector({
		  features: [iconFeature]
		});
		
		var vectorLayerMouseCross = new ol.layer.Vector({
		  source: vectorSource,
		  title: 'vectorMouseCross'
		});
	
	
		var mapleftlayerlength = mapleft.getLayers().getLength();
	    	mapleft.getLayers().insertAt(mapleftlayerlength,vectorLayerMouseCross);

		var RiconFeature = new ol.Feature();
		
		var iconStyle = new ol.style.Style({
		  image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
		    anchor: [10, 10],
		    anchorXUnits: 'pixels',
		    anchorYUnits: 'pixels',
		    src: 'http://maps.nls.uk/geo/img/cross.png'
		  }))
		});
		
	
		RiconFeature.setStyle(iconStyle);
	
		var RvectorSource = new ol.source.Vector({
		  features: [RiconFeature]
		});
		
		var RvectorLayerMouseCross = new ol.layer.Vector({
		  source: RvectorSource,
		  title: 'RvectorMouseCross'
		});
	

	
		var maprightlayerlength = mapright.getLayers().getLength();
	    	mapright.getLayers().insertAt(maprightlayerlength,RvectorLayerMouseCross);

 	mapright.on('pointermove', function(event) {
		RiconFeature.setGeometry(null);
                var coord3857 = event.coordinate;
		iconFeature.setGeometry( new ol.geom.Point(coord3857) );

	});


 	mapleft.on('pointermove', function(event) {
		iconFeature.setGeometry(null);
                var Rcoord3857 = event.coordinate;
		RiconFeature.setGeometry( new ol.geom.Point(Rcoord3857) );

	});



	jQuery("#tours").on("mouseenter", function(event) {
		iconFeature.setGeometry(null);
		RiconFeature.setGeometry(null);
	});   

	jQuery("#gazetteers").on("mouseenter", function(event) {
		iconFeature.setGeometry(null);
		RiconFeature.setGeometry(null);
	}); 

	jQuery("#wfsResultsleft").on("mouseenter", function(event) {
		iconFeature.setGeometry(null);
		RiconFeature.setGeometry(null);
	}); 


mapleft.on('click', function(evt) {
     var pixel = evt.pixel;
     var coordinate = evt.coordinate;
     unselectPreviousFeatures();
     displayFeatureInfo(pixel,coordinate);
});

// selects point in the middle of the mapleft view

	function displaypoint() {
		var i;
		for(i=0; i< selectedFeatures.length; i++) {
		selectedFeatures[i].setStyle(null);
		}
		selectedFeatures = [];
		var env1 = (mapleft.getSize()[0])/2;
		var env2 = (mapleft.getSize()[1])/2;
		var pixel = [];
		pixel.push(Math.round(env1),Math.round(env2));
		if (mapleft.getView().getZoom() > 8)
		{
		displayFeatureInfo(pixel);
		}
	}

// function to close the gazetteer div

	function closegaz() {
		$('.collapse').collapse('hide');
	}

// function to close the tours div

	function closetours() {
		$('#tours').hide();
	}

	function opentours() {
		$('#tours').show();
	}

// function on closing gazetteers div to select ALL TOURS and then select point in centre of mapleft

	$('#gazetteers').on('hidden.bs.collapse', function () {
		mapleft.getLayers().removeAt(1);
		var urlLayerName = "0";
		var overlaySelected = getOverlay(urlLayerName);
		overlaySelected.setVisible(true);
		mapleft.getLayers().insertAt(1,overlaySelected);
		document.getElementById("tourSelect").selectedIndex = urlLayerName ;
		if (document.getElementById('ListonTourNo') != null) { ListonTourNo(urlLayerName); }
		updateUrl();
		displaypoint();
	})

// closes gazetteer on the map being moved

	function onMoveEnd()  {
		$('.collapse').collapse('hide');
	}


	
	function timedText() {
	   setTimeout(myTimeout1, 2000) 
	}
	
	function myTimeout1() {
		displaypoint();
	}

// zooms the map to specified point - this command is initiated in the gazetteers div

	function zoomMap(x,y)  {
		$('.collapse').collapse('hide');
	
		if ( y < 30)
		{ mapleft.getView().setZoom(11); }
		else
	
		{mapleft.getView().setZoom(10);}
		
		var duration = 1500;
		 var start = +new Date();
		 var pan = ol.animation.pan({
		   duration: duration,
		   source: /** @type {ol.Coordinate} */ (mapleft.getView().getCenter()),
		   start: start
		 });
		 var bounce = ol.animation.bounce({
		   duration: duration,
		   resolution: 3 * mapleft.getView().getResolution(),
		   start: start
		 });
		 mapleft.beforeRender(pan, bounce);
		timedText();
		
		mapleft.getView().setCenter(ol.proj.transform([x,y],'EPSG:4326', 'EPSG:3857'));
		
		mapright.getView().setZoom(8);
		
		var duration = 1500;
		 var start = +new Date();
		 var pan = ol.animation.pan({
		   duration: duration,
		   source: /** @type {ol.Coordinate} */ (mapright.getView().getCenter()),
		   start: start
		 });
		 var bounce = ol.animation.bounce({
		   duration: duration,
		   resolution: 3 * mapright.getView().getResolution(),
		   start: start
		 });
		 mapright.beforeRender(pan, bounce);
		timedText();
		
		mapright.getView().setCenter(ol.proj.transform([x,y],'EPSG:4326', 'EPSG:3857'));
	
	}

// function to select point based on point= argument in URL

	function pointClick(pointClicked)  {
	
			unselectPreviousFeatures();
			pointClicked2 = pointClicked.split(",");
			        pointClicked4 = [];
			pointClicked4.push(parseFloat(pointClicked2[1]),parseFloat(pointClicked2[0]));
			
			        coordinate = [];
			coordinate = ol.proj.transform(pointClicked4,"EPSG:4326", "EPSG:3857");
			
			pixel = mapleft.getPixelFromCoordinate(coordinate);
			displayFeatureInfo(pixel);
	}

// only run pointClick when the base layers have loaded

	baseLayers[0].getSource().on('tileloadend', function() {
		if (pointClicked)
		if ((pointClicked !== null) && (pointClicked.length > 5)  )
		{
		pointClick(pointClicked);
		}
	});

// make cursor appear as pointer when over tour circles



	var cursorHoverStyle = "pointer";
	var target = mapleft.getTarget();
	//target returned might be the DOM element or the ID of this element dependeing on how the map was initialized
	//either way get a jQuery object for it
 	
	var jTarget = typeof target === "string" ? jQuery("#"+target) : jQuery(target);
	mapleft.on("pointermove", function (event) {
	   var mouseCoordInMapPixels = [event.originalEvent.offsetX, event.originalEvent.offsetY];
	   //detect feature at mouse coords
	   var hit = mapleft.forEachFeatureAtPixel(mouseCoordInMapPixels, function (feature, layer) {
	        if (feature.get("arrow") == null)
         	return true;

	   });
	   if (hit)  {
	       jTarget.css("cursor", cursorHoverStyle);
	   } else {
	       jTarget.css("cursor", "");
	   }
	});

// function to control zoom and display of layers in right-hand map


	function setZoomLayers() {
	
		// arrowsmith_world, faden_caribbean, faden_america, faden_america_zoom
	
		var mapZoom = mapright.getView().getZoom();
	
		if (mapZoom < 6 )
			{
				arrowsmith_world.setVisible(true);
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
			}
		else
			{
				arrowsmith_world.setVisible(true);
				faden_caribbean.setVisible(true);
				faden_america.setVisible(true);
				faden_america_zoom.setVisible(true);
			}
	}

// function to control zoom and display of layers in left-hand map

	function onMoveEndLeft(evt) {
	
		if (mapleft.getView().getZoom() < 8)
		{ 
		mapright.getView().setZoom(mapleft.getView().getZoom()); 
		mapright.getView().setCenter(mapleft.getView().getCenter());  
	   	document.getElementById('wfsResultsleft').innerHTML = '<strong>Zoom in and click on circles to view details of places the Listons visited ... </strong>';
		unselectPreviousFeatures();
		}
		else
		{ mapleft.getView().setZoom(mapleft.getView().getZoom()); 
		mapright.getView().setCenter(mapleft.getView().getCenter()); 
		mapright.getView().setZoom(8);
	}



	updateUrl();

	}

	mapleft.on('moveend', onMoveEndLeft);


	function onMoveEndRight(evt) {
	
	
		if (mapright.getView().getZoom() < 8)
		{ 
		  mapleft.getView().setCenter(mapright.getView().getCenter());
		  mapleft.getView().setZoom(mapright.getView().getZoom());   
		}
		else
		{ 
		  mapleft.getView().setCenter(mapright.getView().getCenter());
		  mapright.getView().setZoom(8);
		  // mapleft.getView().setZoom(mapright.getView().getZoom());   
		}
	
	
	}

	mapright.on('moveend', onMoveEndRight);

	mapright.getView().on('change:resolution', setZoomLayers);

      // var zoomslider = new ol.control.ZoomSlider();
      // map.addControl(zoomslider);


// function to change the baseLayer

	var changemap = function(index) {
		 mapleft.getLayers().removeAt(0);
		 mapleft.getLayers().insertAt(0,baseLayers[index]);
		 // map.getLayers().getArray()[1].setOpacity(opacity);
		 updateUrl();
		 mapleft.getLayers().getArray()[0].setVisible(true);
	}

// function to change the tourLayer

	var tourchangemap = function(index) {
	
	   	document.getElementById('wfsResultsleft').innerHTML = '<strong>Zoom in and click on circles to view details of places the Listons visited ... </strong>';
		unselectPreviousFeatures();
		pointClicked = '0,0';
		mapleft.getLayers().removeAt(1);
		mapleft.getLayers().insertAt(1,tourLayers[index]);
		 // map.getLayers().getArray()[1].setOpacity(opacity);
		mapleft.getLayers().getArray()[1].setVisible(true);
	
		var duration = 750;
		 var start = +new Date();
		 var pan = ol.animation.pan({
		   duration: duration,
		   source: /** @type {ol.Coordinate} */ (mapright.getView().getCenter()),
		   start: start
		 });
		 var bounce = ol.animation.bounce({
		   duration: duration,
		   resolution: 3 * mapright.getView().getResolution(),
		   start: start
		 });
		 mapleft.beforeRender(pan);
		 mapright.beforeRender(pan);
		zoomtoextent();
		urlLayerName = mapleft.getLayers().getArray()[1].get('mosaic_id');
		if (document.getElementById('ListonTourNo') != null) { ListonTourNo(urlLayerName); }
		updateUrl();
	}


function ListonTourNo(str) {  
       if (str == 1)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ North America, 1796";
  }
       else if (str == 2)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Tour to Southern States, 1797-8";
  }
       else if (str == 3)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Tour to New York & the Eastern States, 1798";
  }
       else if (str == 4)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ North America, 1799. Journeys to Lebanon Springs, to Lake George, etc.";
  }
       else if (str == 5)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Journal to the Falls of Niagara, 1799";
  }
       else if (str == 6)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Journey to the Natural Bridge in Virginia, 1800";
  }
       else if (str == 7)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Journey to Lower Canada, 1800";
  }
       else if (str == 8)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Journal to the United States to the West Indies, 1800-1";
  }
       else {
  document.getElementById('ListonTourNo').innerHTML = "";
  }
}
