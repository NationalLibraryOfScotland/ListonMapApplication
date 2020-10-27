

var DEFAULT_LON = -26.3;
var DEFAULT_LAT = 35.41;
var DEFAULT_ZOOM = 3;
var pointClicked;
var urlLayerName;
var overlaySelected;
var historicLayers;



// necessary for use of Bing layers - generate your own at: https://msdn.microsoft.com/en-us/library/ff428642.aspx

	var BingapiKey = "AgS4SIQqnI-GRV-wKAQLwnRJVcCXvDKiOzf9I1QpUQfFcnuV82wf1Aw6uw5GJPRz";
		// a generic attribution variable for NLS historic map tilesets
		var NLS_attribution = new ol.Attribution({
		 html: 'Historic background maps courtesy of the <a href="https://maps.nls.uk/">National Library of Scotland</a>' 
	});

// bounds of the map view

	var maxExtent = ol.proj.transformExtent([-100.0,0,40.0,70.0], 'EPSG:4326', 'EPSG:3857');

// zooms left-hand map to the extents of each tour

	function zoomtoextent() {
	        var extent = [mapleft.getLayers().getArray()[1].get('minx'), mapleft.getLayers().getArray()[1].get('miny'), mapleft.getLayers().getArray()[1].get('maxx'), mapleft.getLayers().getArray()[1].get('maxy')];
	        extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857"));
	        mapleft.getView().fitExtent(extent, mapleft.getSize());
	        mapright.getView().fitExtent(extent, mapright.getSize());
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

function resultsheaderclear()  {
	document.getElementById('wfsResultsleft').innerHTML = '';
    	str = "<br/><p id=\"noMapsSelected\">No maps selected - please <strong>click on a coloured box</strong> on the map to the left that covers the area you are interested in</p>";
	document.getElementById('wfsResultsleft').innerHTML = '<strong>Zoom in and click on circles to view details of places the Listons visited ...</strong>';
	unselectPreviousFeatures();
	document.getElementById('ListonTourNo').innerHTML = "";
	// ListonTourNo(urlLayerName);
	pointClicked = '0,0';
    	updateUrl();

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
		window.location.hash = "zoom=" + mapleft.getView().getZoom()  + "&lat=" + centre[1].toFixed(5)  + "&lon=" + centre[0].toFixed(5) + "&tour=" + urlLayerName + "&point=" + pointClicked ; 
	     }



// OpenStreetMap

	var osm = new ol.layer.Tile({
	 
		title: 'Background - OpenStreetMap',
		        visible: false,
		 
		source: new ol.source.OSM({
		attributions: [new ol.Attribution({html:'&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'})],
		   
		url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
		 
		})
	});

// Bing layers

	var BingSatellite =   new ol.layer.Tile({
		title: 'Background - Bing Satellite',
		        visible: false,
		       source: new ol.source.BingMaps({
		key: BingapiKey,
		imagerySet: 'Aerial'
	   }),
		opacity: 0.8
	});
	
	var BingRoad = new ol.layer.Tile({
	       title: 'Background - Bing Road',
	        visible: false,
	       source: new ol.source.BingMaps({
	     key: BingapiKey,
	     imagerySet: 'Road'
	   }),
		opacity: 0.8
	});
	
	var BingAerialWithLabels = new ol.layer.Tile({
		       title: 'Background - Bing Hybrid',
		        visible: false,
		       source: new ol.source.BingMaps({
			key: BingapiKey,
			imagerySet: 'AerialWithLabels'
		})
	});
	
		var opentopomap = new ol.layer.Tile({
		title: 'Background - OpenTopoMap',
	        mosaic_id: '9',
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: [
			            new ol.Attribution({html: 'Map tiles under <a href=\'https://creativecommons.org/licenses/by/3.0/\'>CC BY SA</a> from <a href=\'https://opentopomap.org/\'>OpenTopoMap</a>'})
			          ],
			          urls:[
			            'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://b.tile.opentopomap.org/{z}/{x}/{y}.png',
			            'https://c.tile.opentopomap.org/{z}/{x}/{y}.png'
			          ],
	      	}),
		opacity: 0.8
	    });


		var stamentoner = new ol.layer.Tile({
			title: 'Background Map - Stamen Toner',
			       mosaic_id: '10',
			        visible: false,
			       source: new ol.source.Stamen({
			       layer: 'toner'
			     }),
			opacity: 0.7
		   });
		
		
		var stamentonerOV = new ol.layer.Tile({
			title: 'Background - Stamen Toner',
			       mosaic_id: '10',
			        visible: true,
			       source: new ol.source.Stamen({
			       layer: 'toner'
			     }),
			opacity: 0.8
		   });
		
		var StamenWatercolor =  new ol.layer.Tile({
		          title: 'Background - Stamen Watercolor',
		          visible: false,
		          source: new ol.source.Stamen({
		                 layer: 'watercolor'
		          }),
			opacity: 0.4
		});



		var stamenterrain = new ol.layer.Tile({
			title: 'Background - Stamen Terrain',
			       mosaic_id: '10',
			        visible: true,
			       source: new ol.source.Stamen({
			       layer: 'terrain'
			     }),
			opacity: 0.4
		   });
		

var esri_world_topo = new ol.layer.Tile({
		preload: Infinity,
		title: 'Background - ESRI World Topo',
	        mosaic_id: '2',
		type: 'base', 
		    source: new ol.source.XYZ({
			          attributions: [
			            new ol.Attribution({        html: 'Tiles &copy; <a href="https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer">ArcGIS</a>'})
			          ],
			              url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
			                  'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
	      	}),
			opacity: 0.4
	    });


// the Web Tile Map Service layers from NLS - view full list at: https://maps.nls.uk/geo/explore/scripts/explore-layers.js


		var arrowsmith_attribution = new ol.Attribution({
		 	html: "Aaron Arrowsmith, 'Chart of the world on Mercator's projection...' (1796)."
		});
		
		var faden_america_attribution = new ol.Attribution({
		 	html: "William Faden, 'The United States of North America…' (1796)."
		});
		
		var faden_caribbean_attribution = new ol.Attribution({
		 	html: "William Faden, 'A General Chart of the West India Islands…' (1796)."
		});

		var pinkerton_europe_attribution = new ol.Attribution({
		 	html: "'Europe', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_england_attribution = new ol.Attribution({
		 	html: "'England', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_france_attribution = new ol.Attribution({
		 	html: "'France', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_austria_attribution = new ol.Attribution({
		 	html: "'Austrian Dominions', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_spain_attribution = new ol.Attribution({
		 	html: "'Spain and Portugal', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_turkey_attribution = new ol.Attribution({
		 	html: "'Turkey in Europe', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_switzerland_attribution = new ol.Attribution({
		 	html: "'Swisserland', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_germany_attribution = new ol.Attribution({
		 	html: "'Germany, south of the Mayn', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var pinkerton_southern_italy_attribution = new ol.Attribution({
		 	html: "'Southern Italy', from John Pinkerton's 'A modern atlas' (1815)."
		});

		var constantinople_attribution = new ol.Attribution({
		 	html: "'Carte de Constantinople, levée par F. Kauffer & Jean Baptiste Lechevalier' (1815)."
		});

		
		var arrowsmith_world = new ol.layer.Tile({
			title: "Arrowsmith - World",
			source: new ol.source.XYZ({
			attributions: [arrowsmith_attribution],
			url: "https://geo.nls.uk/mapdata3/100611144/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 8
			 })
		});

		var arrowsmith_scotland =  new ol.layer.Tile({
	  	 	extent: ol.proj.transformExtent([-8.512302, 54.349378, -1.319661, 59.123888], 'EPSG:4326', 'EPSG:3857'),
		            title: 'Scotland - Aaron Arrowsmith, 1807',
			    source: new ol.source.XYZ({
					attributions: [new ol.Attribution({html: '<a href="https://maps.nls.uk/joins/747.html">Aaron Arrowsmith, <em>Map of Scotland constructed from original materials</em> (1807)</a>'})],
					url: 'https://geo.nls.uk/mapdata3/123969245/{z}/{x}/{y}.png',
					minZoom: 2,
					maxZoom: 12,
					tilePixelRatio: 1
			}),
		        minx: -8.512302, 
		        miny: 54.349378, 
		        maxx: -1.319661, 
		        maxy: 59.123888
	          });
		
		var faden_america = new ol.layer.Tile({
			title: "William Faden",
			source: new ol.source.XYZ({
			attributions: [faden_america_attribution],
			url: "https://geo.nls.uk/mapdata3/122170812/{z}/{x}/{y}.png",
			extent: ol.proj.transformExtent([-109.597691, 21.391718, -48.250326, 55.105487], 'EPSG:4326', 'EPSG:3857'),
			minZoom: 1,
			maxZoom: 10
			 })
		});
		
		var faden_america_zoom = new ol.layer.Tile({
			title: "William Faden",
			source: new ol.source.XYZ({
			url: "https://geo.nls.uk/mapdata3/122170812_zoom/{z}/{x}/{y}.png",
			minZoom: 9,
			maxZoom: 11
			 })
		});

	var faden_caribbean = new ol.layer.Tile({
		title: "William Faden",
		source: new ol.source.XYZ({
		attributions: [faden_caribbean_attribution],
		url: "https://geo.nls.uk/mapdata3/122170815/{z}/{x}/{y}.png",
		extent: ol.proj.transformExtent([-88.691979, 8.240951, -58.137256, 28.835113], 'EPSG:4326', 'EPSG:3857'),
		minZoom: 1,
		maxZoom: 10
		 })
	});

	var pinkerton_europe = new ol.layer.Tile({
		title: "Europe, 1815",
		source: new ol.source.XYZ({
		attributions: [pinkerton_europe_attribution],
		url: "https://geo.nls.uk/mapdata3/196412626/{z}/{x}/{y}.png",
		extent: ol.proj.transformExtent([-40.82729136, 28.88035352, 75.81889829, 72.01039034], 'EPSG:4326', 'EPSG:3857'),
		minZoom: 5,
		maxZoom: 7
		 }),
		minx: -40.82729136, 
		miny: 28.88035352, 
		maxx: 75.81889829, 
		maxy: 72.01039034 
	});

	var pinkerton_england = new ol.layer.Tile({
		title: "England, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_england_attribution],
			url: "https://geo.nls.uk/mapdata3/196412629/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 10
		 }),
		extent: ol.proj.transformExtent([-6.25698447, 49.54450306, 2.17453187, 53.08527569], 'EPSG:4326', 'EPSG:3857'),
		minx: -6.25698447, 
		miny: 49.54450306, 
		maxx: 2.17453187, 
		maxy: 53.08527569
	});


	var pinkerton_france = new ol.layer.Tile({
		title: "France, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_france_attribution],
			url: "https://geo.nls.uk/mapdata3/196412632/{z}/{x}/{y}.png",
			minZoom: 4,
			maxZoom: 9
			 }),
		extent: ol.proj.transformExtent([-8.19416968, 41.55812536, 13.87247460, 52.18712432], 'EPSG:4326', 'EPSG:3857'),
		minx: -8.19416968, 
		miny: 41.55812536, 
		maxx: 13.87247460, 
		maxy: 50.5, 
	});

	var pinkerton_austria = new ol.layer.Tile({
		title: "Austrian Dominions, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_austria_attribution],
			url: "https://geo.nls.uk/mapdata3/196412635/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 9
			 }),
		extent: ol.proj.transformExtent([8.14676753, 43.51730303, 27.50205324, 52.72071907], 'EPSG:4326', 'EPSG:3857'),
		minx: 8.14676753, 
		miny: 43.51730303, 
		maxx: 27.50205324, 
		maxy: 52.72071907, 
	});

	var pinkerton_spain = new ol.layer.Tile({
		title: "Spain and Portugal, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_spain_attribution],
			url: "https://geo.nls.uk/mapdata3/196412638/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 9
		 }),
		extent: ol.proj.transformExtent([-10.96827556, 34.99237602, 6.21912989, 44.25893816], 'EPSG:4326', 'EPSG:3857'),
		minx: -10.96827556, 
		miny: 34.99237602,  
		maxx: 6.21912989, 
		maxy: 42.0
	});

	var pinkerton_turkey = new ol.layer.Tile({
		title: "Turkey in Europe, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_turkey_attribution],
			url: "https://geo.nls.uk/mapdata3/196412641/{z}/{x}/{y}.png",
	 		minZoom: 1,
			maxZoom: 9
		 }),
		extent: ol.proj.transformExtent([15.04416811, 33.73025813, 31.66875165, 49.62582703], 'EPSG:4326', 'EPSG:3857'),
		minx: 15.04416811, 
		miny: 33.73025813, 
		maxx: 31.66875165, 
		maxy: 44.0
	});

	var pinkerton_switzerland = new ol.layer.Tile({
		title: "Swisserland, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_switzerland_attribution],
			url: "https://geo.nls.uk/mapdata3/196412644/{z}/{x}/{y}.png",
		 }),
		extent: ol.proj.transformExtent([5.97879893, 45.61216140, 10.92353395, 48.01740365], 'EPSG:4326', 'EPSG:3857'),
		minx: 5.97879893, 
		miny: 45.61216140,
		maxx: 10.92353395, 
		maxy: 45.5,
		minZoom: 1,
		maxZoom: 11
	});

	var pinkerton_germany = new ol.layer.Tile({
		title: "Germany, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_germany_attribution],
			url: "https://geo.nls.uk/mapdata3/196412647/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 11
		 }),
		extent: ol.proj.transformExtent([6.42751081, 46.47584914, 15.18252244, 50.63214960], 'EPSG:4326', 'EPSG:3857'),
		minx: 6.42751081, 
		miny: 46.47584914,
		maxx: 13.0, 
		maxy: 50.63214960
	});

	var pinkerton_southern_italy = new ol.layer.Tile({
		title: "Southern Italy, 1815",
		source: new ol.source.XYZ({
			attributions: [pinkerton_southern_italy_attribution],
			url: "https://geo.nls.uk/mapdata3/196412653/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 11
		 }),
		extent: ol.proj.transformExtent([7.15250706, 35.75123633, 19.49641560, 43.09206091], 'EPSG:4326', 'EPSG:3857'),
		minx: 7.15250706, 
		miny: 36.69, 
		maxx: 19.49641560, 
		maxy: 43.09206091
	});


	var constantinople = new ol.layer.Tile({
		title: "Constantinople, 1815",
		source: new ol.source.XYZ({
			attributions: [constantinople_attribution],
			url: "https://geo.nls.uk/mapdata3/196412631/{z}/{x}/{y}.png",
			minZoom: 1,
			maxZoom: 16
		 }),
		extent: ol.proj.transformExtent([28.90121349, 40.96029267, 29.05797949, 41.06195828], 'EPSG:4326', 'EPSG:3857'),
		minx: 28.90121349, 
		miny: 40.96029267, 
		maxx: 29.05797949,
		maxy: 41.06195828 
	});


// an array of the base layers listed above

	var baseLayers = [stamentoner, stamenterrain, StamenWatercolor, osm, esri_world_topo, opentopomap, BingSatellite, BingRoad];

// arrowsmith_world, faden_caribbean, faden_america, faden_america_zoom, pinkerton_europe, 

	var historicLayersAll = [pinkerton_spain, pinkerton_france, arrowsmith_scotland, pinkerton_england, pinkerton_austria, pinkerton_turkey, pinkerton_germany, pinkerton_switzerland, pinkerton_southern_italy, constantinople ];

	historicLayers = [pinkerton_spain, pinkerton_france, arrowsmith_scotland, pinkerton_england, pinkerton_austria, pinkerton_turkey, pinkerton_germany, pinkerton_switzerland, pinkerton_southern_italy, constantinople ];

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
var liston_tour_style_9 = new ol.style.Style({
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
var liston_tour_style_10 = new ol.style.Style({
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
var liston_tour_style_11 = new ol.style.Style({
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
               if(resolution>=1000) {
                   arrowimage = 'https://digital.nls.uk/travels-of-henrietta-liston/map/img/none.png';
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
	   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/all_routes.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/all_routes.js',
	       format: new ol.format.GeoJSON(),
	 }),
   style: function_liston_routes
  // maxResolution: 305.748113140705
   });


// styles for each of the Liston tours

   var StyleFunction_liston_tour_1 = function(feature, resolution) {


 		 var radius_tour_1 = '7';
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_1 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_1 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_1,
                   fill: new ol.style.Fill({
                       color: 'rgba(239, 66, 233,0.6)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)',
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_1 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/1_North_America_1796.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/1_North_America_1796.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_1

   });

   var liston_line_1 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	    // url: 'https://geo.nls.uk/maps/dev/liston/scripts/1_North_America_1796_route.js',
	     url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/1_North_America_1796_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_2 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_2 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_2,
                   fill: new ol.style.Fill({
                       color: 'rgba(51, 119, 255, 0.5)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_2 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/2_Southern_States.js',
		  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/2_Southern_States.js',
	       format: new ol.format.GeoJSON(),
	 }),
   	style: StyleFunction_liston_tour_2

   });


   var liston_line_2 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		  // url: 'https://geo.nls.uk/maps/dev/liston/scripts/2_Southern_States_route.js',
		   url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/2_Southern_States_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_3 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_3 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_3,
                   fill: new ol.style.Fill({
                    color: 'rgba(0, 102, 0, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_3 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	  // url: 'https://geo.nls.uk/maps/dev/liston/scripts/3_NewYorkandEasternStates.js',
	   url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/3_NewYorkandEasternStates.js',
	       format: new ol.format.GeoJSON(),
	 }),
  	style: StyleFunction_liston_tour_3

   });

   var liston_line_3 = new ol.layer.Vector({
	 source: new ol.source.Vector({

	  // url: 'https://geo.nls.uk/maps/dev/liston/scripts/3_NewYorkandEasternStates_route.js',
	   url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/3_NewYorkandEasternStates_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_4 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_4 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_4,
                   fill: new ol.style.Fill({
                       color: 'rgba(255, 0, 102, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_4 = new ol.layer.Vector({
	 source: new ol.source.Vector({
         // url: 'https://geo.nls.uk/maps/dev/liston/scripts/4_North_America.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/4_North_America.js',
	       format: new ol.format.GeoJSON(),
	 }),
	   style: StyleFunction_liston_tour_4

   });

   var liston_line_4 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/4_North_America_route.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/4_North_America_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_5 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_5 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_5,
                   fill: new ol.style.Fill({
                       color: 'rgba(204, 204, 0, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_5 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	// url: 'https://geo.nls.uk/maps/dev/liston/scripts/5_Niagara.js',
	 url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/5_Niagara.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_5

   });

   var liston_line_5 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/5_Niagara_route.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/5_Niagara_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_6 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_6 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_6,
                   fill: new ol.style.Fill({
                       color: 'rgba(113, 34, 11, 0.4)',

                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_6 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/6_Natural_Bridge.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/6_Natural_Bridge.js',
	       format: new ol.format.GeoJSON(),
	 }),
	   style: StyleFunction_liston_tour_6
	
   });
 
   var liston_line_6 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/6_Natural_Bridge_route.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/6_Natural_Bridge_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_7 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_7 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_7,
                   fill: new ol.style.Fill({
                       color: 'rgba(51, 51, 153, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_7 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/7_Lower_Canada.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/7_Lower_Canada.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_7
	
   });

   var liston_line_7 = new ol.layer.Vector({
	 source: new ol.source.Vector({
		   // url: 'https://geo.nls.uk/maps/dev/liston/scripts/7_Lower_Canada_route.js',
		    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/7_Lower_Canada_route.js',
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
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_8 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_8 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_8,
                   fill: new ol.style.Fill({

                       color: 'rgba(119, 255, 51, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_8 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/8_West_Indies.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/8_West_Indies.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_8

   });

   var liston_line_8 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/8_West_Indies_route.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/8_West_Indies_route.js',
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


var StyleFunction_liston_tour_9 = function(feature, resolution) {




                var radius_tour_9 = '7';
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_9 = '2';
			   strokewidth = '1';
			}
		else if(resolution>2000) {
                   radius_tour_9 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_9,
                   fill: new ol.style.Fill({
                       color: 'rgba(51, 119, 255, 0.5)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_9 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/9_Turkish_Journal.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/9_Turkish_Journal.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_9,
	 	maxResolution: 100000
   });

   var liston_line_9 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/9_Turkish_Journal_route.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/9_Turkish_Journal_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_9_group = new ol.layer.Group({
	            title: 'The Turkish Journal, 1812-1814',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '9',
			layers: [liston_line_9, liston_tour_9 ],
			minx: -7.51,
			miny: 14.33,
			maxx: 34.54,
			maxy: 52.84

	});


var StyleFunction_liston_tour_10 = function(feature, resolution) {



                var radius_tour_10 = '7';
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_10 = '1';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_10 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_10,
                   fill: new ol.style.Fill({
                       color: 'rgba(204, 204, 0, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_10 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/10_Aegean_Travels.js',
	    url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/10_Aegean_Travels.js',
	       format: new ol.format.GeoJSON(),
	 }),
	  style: StyleFunction_liston_tour_10
   });

   var liston_line_10 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/10_Aegean_Travels_route.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/10_Aegean_Travels_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_10_group = new ol.layer.Group({
	            title: 'Aegean Travels, 1815',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '10',
			layers: [liston_line_10, liston_tour_10],
			minx: 23.36,
			miny: 37.9,
			maxx: 29.3,
			// maxx: -5.09264,
			maxy: 41.07

	});

 
 var StyleFunction_liston_tour_11 = function(feature, resolution) {



                var radius_tour_11 = '7';
                var strokewidth = '2.5';
                if(resolution>5000) {
                    radius_tour_11 = '2';
			   strokewidth = '1';
			}
			else if(resolution>2000) {
                   radius_tour_11 = '5';
                   strokewidth = '2';
               }

                return [new ol.style.Style({
               image: new ol.style.Circle({
                   radius: radius_tour_11,
                   fill: new ol.style.Fill({
                       color: 'rgba(255, 0, 102, 0.4)',
                   }),
                   stroke: new ol.style.Stroke({
                       color: 'rgba(0, 0, 0, 0.9)'   ,
                       width: strokewidth
                   })
               })
           })];
            };  

   var liston_tour_11 = new ol.layer.Vector({
	 source: new ol.source.Vector({
         // url: 'https://geo.nls.uk/maps/dev/liston/scripts/11_Return_to_Constantinople.js',
	  url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/11_Return_to_Constantinople.js',
	       format: new ol.format.GeoJSON(),
	 }),
	   style: StyleFunction_liston_tour_11
   });

   var liston_line_11 = new ol.layer.Vector({
	 source: new ol.source.Vector({
	 // url: 'https://geo.nls.uk/maps/dev/liston/scripts/11_Return_to_Constantinople_route.js',
	 url: 'https://digital.nls.uk/travels-of-henrietta-liston/map/scripts/11_Return_to_Constantinople_route.js',
	       format: new ol.format.GeoJSON(),
	 }),
    style: function_liston_routes
    // maxResolution: 305.748113140705
   });


	var liston_tour_11_group = new ol.layer.Group({
	            title: 'Return to Constantinople, 1817',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '11',
			layers: [liston_line_11, liston_tour_11],
			minx: -5.5,
			miny: 14.47,
			maxx: 29.6,
			maxy: 56.2
	});

	var liston_all = new ol.layer.Group({
	            title: 'ALL TOURS, 1796-1817',
			color:'#FF0000',
		        group_no: '',
		        mosaic_id: '0',
			layers: [liston_routes, liston_tour_1, liston_tour_2, liston_tour_3, liston_tour_4, liston_tour_5, liston_tour_6, liston_tour_7, liston_tour_8, liston_tour_9, liston_tour_10, liston_tour_11 ],
			minx: -80.8923,
			miny: 13.1514,
			maxx: 35,
			maxy: 50.15
	});

// an array of the Liston tour layers listed above

var tourLayers = [ liston_all, liston_tour_1_group, liston_tour_2_group, liston_tour_3_group, liston_tour_4_group, liston_tour_5_group, liston_tour_6_group, liston_tour_7_group, liston_tour_8_group, liston_tour_9_group, liston_tour_10_group, liston_tour_11_group];

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
	 collapsed: false,
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
	 controls: ol.control.defaults({attribution: false}).extend([attribution, overviewMapControl ]),   
	 layers: [stamentoner],
	 logo: false,
	 loadTilesWhileAnimating: true,
	 view: new ol.View({
	   center: ol.proj.transform([currentLon, currentLat], 'EPSG:4326', 'EPSG:3857'),
	   zoom: currentZoom,
	   extent: maxExtent,
	   minZoom: 3,
	   maxZoom: 15,
	 })
});

var mapright = new ol.Map({
	 target: 'mapright',
	 renderer: 'canvas',
	 controls: ol.control.defaults({attribution: false}).extend([attribution]),
	 layers: [arrowsmith_world, faden_caribbean, faden_america, faden_america_zoom, pinkerton_europe, pinkerton_france, arrowsmith_scotland,
		pinkerton_england, pinkerton_austria, pinkerton_spain, pinkerton_turkey, pinkerton_germany, pinkerton_switzerland, pinkerton_southern_italy, constantinople ],
	 logo: false,
	 loadTilesWhileAnimating: true,
	 view: new ol.View({
	   center: mapleft.getView().getCenter(),
	   extent: maxExtent,
	   minZoom: 3,
	   maxZoom: 15
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

	if (document.getElementById('ListonTourNo') != "NULL") { ListonTourNo(urlLayerName); }

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

            selectedFeatures = [];

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

		unselectPreviousFeatures();
 
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
			if (selectedTour == '9')                                
		  	{ return layer !== liston_line_9; }
			if (selectedTour == '10')                                
		  	{ return layer !== liston_line_10; }
			if (selectedTour == '11')                                
		  	{ return layer !== liston_line_11; }
			else
			{ return layer !== liston_routes; }
		
		});

	var info = document.getElementById('wfsResultsleft');

	if (selectedFeatures.length == 1) {

	urlLayerName = selectedFeatures[0].get("TOUR_NO");
	if (document.getElementById('ListonTourNo') != "NULL") { ListonTourNo(urlLayerName); }
	updateUrl();

	}

	if ((selectedFeatures.length == 2) && (selectedFeatures[0].get("TOUR_NO") == selectedFeatures[1].get("TOUR_NO"))) {
	urlLayerName = selectedFeatures[0].get("TOUR_NO");
	if (document.getElementById('ListonTourNo') != "NULL") { ListonTourNo(urlLayerName); }
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

	var windowWidth = $(window).width();
		if (windowWidth <= 500) 
	{
	closesidebar();
	}

		var coords = selectedFeatures[0].getGeometry().getCoordinates();


		
		espg3587 = [];
		espg3587 = ol.proj.transform(coords,"EPSG:3857", "EPSG:4326");
		
		
		pointClicked = [];
		pointClicked.push(espg3587[1].toFixed(5), espg3587[0].toFixed(5));


		var duration = 500;
		 var start = +new Date();
		 var pan = ol.animation.pan({
		   duration: duration,
		   source: /** @type {ol.Coordinate} */ (mapleft.getView().getCenter()),
		   start: start
		 });

		mapleft.beforeRender(pan);
		
		mapleft.getView().setCenter(coords);

		var mapZoom = mapleft.getView().getZoom();
		if (mapZoom < 9)
			{
			mapleft.getView().setZoom(9);

			}

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

		results += '<div id ="clear" align="right" ><a href="javascript:resultsheaderclear();">clear</a></div>';

                var k;
                for(k=0; k< selectedFeatures.length; k++) {
                   // selectedFeatures[i].setStyle(null);


 
		results += '<table><tr><td class="heading1" ><strong>Place: </strong></td><td class="heading1"> ' + selectedFeatures[k].get("MODERN_PLA") + '</td></tr>';

		if (selectedFeatures[k].get("OTHER_NAME") != "NULL") {

			results +=  '<tr><td class="heading"><strong>Name in journal: </strong></td><td class="info">'  + selectedFeatures[k].get("OTHER_NAME") + '</td></tr>';
			}

		if (selectedFeatures[k].get("COUNTRY") != null)  {

			results +=  '<tr><td class="heading"><strong>Country: </strong></td><td class="info"> ' + selectedFeatures[k].get("COUNTRY") + '</td></tr>';
			}
 
		//  '</td></tr><tr><td class="heading"><strong>No: </strong></td><td class="info"> '  + selectedFeatures[k].get("NO") + 
		results +=  '</td></tr><tr><td class="heading"><strong>Date visited: </strong></td><td class="info"> '  + selectedFeatures[k].get("DATE") + 
		  '</td></tr><tr><td class="heading"><strong>Tour: </strong></td><td class="info"> ' + selectedFeatures[k].get("TOUR_NAME") +
		  '</td></tr><tr></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID1") + '">'  + selectedFeatures[k].get("PAGE1") + '</a></td></tr>';

		if (selectedFeatures[k].get("PAGE2") != null)  {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID2") + '">'  + selectedFeatures[k].get("PAGE2") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE3") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID3") + '">'  + selectedFeatures[k].get("PAGE3") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE4") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID4") + '">'  + selectedFeatures[k].get("PAGE4") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE5") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID5") + '">'  + selectedFeatures[k].get("PAGE5") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE6") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID6") + '">'  + selectedFeatures[k].get("PAGE6") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE7") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID7") + '">'  + selectedFeatures[k].get("PAGE7") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE8") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID8") + '">'  + selectedFeatures[k].get("PAGE8") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE9") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID9") + '">'  + selectedFeatures[k].get("PAGE9") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE10") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID10") + '">'  + selectedFeatures[k].get("PAGE10") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE11") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID11") + '">'  + selectedFeatures[k].get("PAGE11") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE12") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID12") + '">'  + selectedFeatures[k].get("PAGE12") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE13") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID13") + '">'  + selectedFeatures[k].get("PAGE13") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE14") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID14") + '">'  + selectedFeatures[k].get("PAGE14") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE15") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID15") + '">'  + selectedFeatures[k].get("PAGE15") + '</a></td></tr>';
			}

		if (selectedFeatures[k].get("PAGE16") != null) {

			results +=  '</td></tr><tr><td class="heading"><strong>View journal: </strong></td><td class="link"><a href="https://digital.nls.uk/travels-of-henrietta-liston/journals/pageturner.cfm?id=' + 
			selectedFeatures[k].get("DOD_ID16") + '">'  + selectedFeatures[k].get("PAGE16") + '</a></td></tr>';
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
		    src: 'https://maps.nls.uk/geo/img/cross.png'
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
		    src: 'https://maps.nls.uk/geo/img/cross.png'
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


	historicLayers = [];
        var extent = mapright.getView().calculateExtent(mapright.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
	for (var i = 0; i < historicLayersAll.length; i++) {
	  var layerOL = historicLayersAll[i];
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];

	  if(ol.extent.intersects(overlayBounds, bounds)) historicLayers.push(layerOL); 

	}


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
	setTimeout( function(){
	     displayFeatureInfo(pixel,coordinate);
	}, 400); // delay 50 ms


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

// function to close the search panel div

	function closesidebar() {
		$('#sidebartour').hide();
		$('#layerSelect').hide();
		$('#tourSelect').hide();
		$('#tours').hide();
		$('#tours-button').hide();
		jQuery("#show").show();
	}

// function to close the search panel div

	function opensidebar() {
		$('#sidebartour').show();
		$('#layerSelect').show();
		$('#tourSelect').show();
		$('#tours-button').show();
		jQuery("#show").hide();
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
		if (document.getElementById('ListonTourNo') != "NULL") { ListonTourNo(urlLayerName); }
		updateUrl();
		displaypoint();
	})

// closes gazetteer on the map being moved

	function onMoveEnd()  {
		$('.collapse').collapse('hide');
	}


	function timedText() {
 		var overlaySelected = mapleft.getLayers().getArray()[0];
		var source = overlaySelected.getSource();

		source.on('tileloadend', function() {
		displaypoint();
	});

	}
	
//	function timedText() {
//	   setTimeout(myTimeout1, 2000) 
//	}
	
	function myTimeout1() {
		displaypoint();
	}

// zooms the map to specified point - this command is initiated in the gazetteers div

	function zoomMap(x,y,z)  {
		$('.collapse').collapse('hide');

		var windowWidth = $(window).width();
		if (windowWidth <= 500) 
			{
		         if ($("#sidebartour") != null )  { jQuery("#sidebartour").hide(); }
		         if ($("#layerSelect") != null )  { jQuery("#layerSelect").hide(); }
		         if ($("#tourSelect") != null )  { jQuery("#tourSelect").hide(); }
		         if ($("#tours") != null )  { jQuery("#tours").hide(); }
		         if ($("#tours-button") != null )  { jQuery("#tours-button").hide(); }
		         if ($("#show") != null ) { jQuery("#show").show(); }
			}


		 mapleft.getView().setZoom(z); 
	
//		else if ( y < 30)
//		{ mapleft.getView().setZoom(11); }
//		else
	
//		{mapleft.getView().setZoom(10);}
		
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

//		if ( x  < parseFloat(-30.0))
		
//			{ mapright.getView().setZoom(8); }
		
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
	

			pointClicked2 = pointClicked.toString().split(",");
			pointClicked4 = [];
			pointClicked4.push(parseFloat(pointClicked2[1]),parseFloat(pointClicked2[0]));
			
			        coordinate = [];
			coordinate = ol.proj.transform(pointClicked4,"EPSG:4326", "EPSG:3857");
			
			pixel = mapleft.getPixelFromCoordinate(coordinate);
			unselectPreviousFeatures();
			displayFeatureInfo(pixel);
	}

// only run pointClick when the base layers have loaded

	jQuery( document ).ready(function() {

 		var overlaySelected = mapleft.getLayers().getArray()[0];
		var source = overlaySelected.getSource();

//		source.on('tileloadend', function() {

mapleft.once('postrender', function(event) {

		if (pointClicked)
		if ((pointClicked !== null) && (pointClicked.length > 5)  )
			{
		   	setTimeout(pointTimeout1, 500) 
		
				function pointTimeout1() {
					pointClick(pointClicked);
				}
			}
		});
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
		mapCentre = [];
		mapCentre = ol.proj.transform(mapleft.getView().getCenter(), "EPSG:3857", "EPSG:4326");

	for (var i = 0; i < historicLayers.length; i++) {
		historicLayers[i].setVisible(false);
	}

	historicLayers = [];
        var extent = mapright.getView().calculateExtent(mapright.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
	for (var i = 0; i < historicLayersAll.length; i++) {
	  var layerOL = historicLayersAll[i];
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];

	  if(ol.extent.intersects(overlayBounds, bounds)) historicLayers.push(layerOL); 

	}
	
		if ((mapZoom < 6 ) && (mapCentre[0] < parseFloat(-30.0)))
			{
				arrowsmith_world.setVisible(true);
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				pinkerton_europe.setVisible(false);
				arrowsmith_scotland.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
				faden_america_zoom.setVisible(false);
			}
		else if (((mapZoom > 5 ) && (mapCentre[0] < parseFloat(-30.0)) && (mapCentre[1] < parseFloat(24.0))))
			{
				arrowsmith_world.setVisible(false);
				faden_caribbean.setVisible(true);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				arrowsmith_scotland.setVisible(false);
				pinkerton_europe.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
				faden_america_zoom.setVisible(false);
			}
		else if (((mapZoom > 5 ) && (mapCentre[0] < parseFloat(-30.0)) && (mapCentre[1] > parseFloat(24.0))))
			{
				arrowsmith_world.setVisible(false);
				faden_caribbean.setVisible(false);
				faden_america.setVisible(true);
				faden_america_zoom.setVisible(true);
				arrowsmith_scotland.setVisible(false);
				pinkerton_europe.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
				faden_america_zoom.setVisible(false);
			}
		else if ((mapZoom < 6 ) && (mapCentre[0] > parseFloat(-30.0)))
			{
				arrowsmith_world.setVisible(true);
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				arrowsmith_scotland.setVisible(false);
				pinkerton_europe.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_england.setVisible(false);
				constantinople.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
			}
		else if ((mapZoom == 5 ) && (mapCentre[0] > parseFloat(-30.0)))
			{
			var extent = mapright.getView().calculateExtent(mapright.getSize());
      			var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));

			if(ol.extent.containsXY([-40.82729136, 28.88035352, 75.81889829, 72.01039034], mapCentre[0], mapCentre[1] )) 
				{
				arrowsmith_world.setVisible(false);
				}
			else
				{
				arrowsmith_world.setVisible(true);
				}
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				pinkerton_europe.setVisible(true);
				arrowsmith_scotland.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
			}
		else if ((mapZoom == 6 ) && (mapCentre[0] > parseFloat(-30.0)))
			{

			var extent = mapright.getView().calculateExtent(mapright.getSize());
      			var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));

			if(ol.extent.containsXY([-40.82729136, 28.88035352, 75.81889829, 72.01039034], mapCentre[0], mapCentre[1] )) 
				{
				arrowsmith_world.setVisible(false);
				}
			else
				{
				arrowsmith_world.setVisible(true);
				}
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				pinkerton_europe.setVisible(true);
				arrowsmith_scotland.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
			}
		else if ((mapZoom == 7 ) && (mapCentre[0] > parseFloat(-30.0)))
			{
			var extent = mapright.getView().calculateExtent(mapright.getSize());
      			var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));

			if(ol.extent.containsXY([-40.82729136, 28.88035352, 75.81889829, 72.01039034], mapCentre[0], mapCentre[1] )) 
				{
				arrowsmith_world.setVisible(false);
				}
			else
				{
				arrowsmith_world.setVisible(true);
				}
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);
				pinkerton_europe.setVisible(true);
				arrowsmith_scotland.setVisible(false);
				pinkerton_france.setVisible(false);
				pinkerton_austria.setVisible(false);
				pinkerton_england.setVisible(false);
				pinkerton_spain.setVisible(false);
				pinkerton_switzerland.setVisible(false);
				pinkerton_germany.setVisible(false);
				pinkerton_turkey.setVisible(false);
				pinkerton_southern_italy.setVisible(false);
				constantinople.setVisible(false);
			}
		else if ((mapZoom > 7 ) && (mapCentre[0] > parseFloat(-30.0)))
			{

			var extent = mapright.getView().calculateExtent(mapright.getSize());
      			var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));

			if(ol.extent.containsXY([-40.82729136, 28.88035352, 75.81889829, 72.01039034], mapCentre[0], mapCentre[1] )) 
				{
				arrowsmith_world.setVisible(false);
				}
			else
				{
				arrowsmith_world.setVisible(true);
				}
				faden_caribbean.setVisible(false);
				faden_america.setVisible(false);
				faden_america_zoom.setVisible(false);

				for (var i = 0; i < historicLayers.length; i++) {
					historicLayers[i].setVisible(true);
				}
				if (historicLayers.length > 0)
				{
				arrowsmith_world.setVisible(false);
				pinkerton_europe.setVisible(true);
				}
			}
	}




// function to control zoom and display of layers in left-hand map

	function onMoveEndLeft(evt) {

				for (var i = 0; i < historicLayers.length; i++) {
					historicLayers[i].setVisible(false);
				}

	historicLayers = [];
        var extent = mapright.getView().calculateExtent(mapright.getSize());
      	var bounds = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:3857" , "EPSG:4326"));
	for (var i = 0; i < historicLayersAll.length; i++) {
	  var layerOL = historicLayersAll[i];
          var overlayBounds = [layerOL.get('minx'), layerOL.get('miny'), layerOL.get('maxx'), layerOL.get('maxy')];

	  if(ol.extent.intersects(overlayBounds, bounds)) historicLayers.push(layerOL); 

	}

		mapCentre = [];
		mapCentre = ol.proj.transform(mapleft.getView().getCenter(), "EPSG:3857", "EPSG:4326");

	
		if ((mapleft.getView().getZoom() < 8) && (mapCentre[0] < parseFloat(-30.0)))
		{ 
		mapright.getView().setZoom(mapleft.getView().getZoom()); 
		mapright.getView().setCenter(mapleft.getView().getCenter());  
		resultsheaderclear();
		}

		else if ((mapleft.getView().getZoom() > 7) && (mapCentre[0] < parseFloat(-30.0)))
		{ 
		mapright.getView().setCenter(mapleft.getView().getCenter()); 
		mapright.getView().setZoom(8);
		}
		else if ((mapleft.getView().getZoom() < 8) && (mapCentre[0] > parseFloat(-30.0)))
		{ 
		mapright.getView().setCenter(mapleft.getView().getCenter()); 
		mapright.getView().setZoom(mapleft.getView().getZoom());
		resultsheaderclear();
		}
		else if ((mapleft.getView().getZoom() > 7) && (mapCentre[0] > parseFloat(-30.0)))
		{ 
		mapright.getView().setCenter(mapleft.getView().getCenter()); 
		mapright.getView().setZoom(mapleft.getView().getZoom());
		}

	updateUrl();

	$('.collapse').collapse('hide');
	}

	mapleft.on('moveend', onMoveEndLeft);


	function onMoveEndRight(evt) {

		mapCentre = [];
		mapCentre = ol.proj.transform(mapleft.getView().getCenter(), "EPSG:3857", "EPSG:4326");
	
		if ((mapright.getView().getZoom() < 8) && (mapCentre[0] < parseFloat(-30.0)))
		{ 
		  mapleft.getView().setCenter(mapright.getView().getCenter());
		  mapleft.getView().setZoom(mapright.getView().getZoom());   
		}
		else if ((mapright.getView().getZoom() > 7) && (mapCentre[0] < parseFloat(-30.0)))
		{ 
		  mapleft.getView().setCenter(mapright.getView().getCenter());
		  mapright.getView().setZoom(8);
		  // mapleft.getView().setZoom(mapright.getView().getZoom());   
		}
		else if (mapCentre[0] > parseFloat(-30.0))
		{ 
		  mapleft.getView().setCenter(mapright.getView().getCenter());
		  mapleft.getView().setZoom(mapright.getView().getZoom());
		  // mapleft.getView().setZoom(mapright.getView().getZoom());   
		}
	
	}

	mapright.on('moveend', onMoveEndRight);

	mapright.getView().on('change:resolution', setZoomLayers);

	onMoveEndLeft();

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
	
		var duration = 250;
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
		urlLayerName = mapleft.getLayers().getArray()[1].get('mosaic_id');
		if (urlLayerName != '0')
		{
		zoomtoextent();
		}
		if (document.getElementById('ListonTourNo') != "NULL") { ListonTourNo(urlLayerName); }
		updateUrl();
	}


$(document).ready(function() {

 function checkWidth() {
    var windowWidth = $(window).width();


    if (windowWidth >= 500) {
         if ($("#sidebartour") != null )  { jQuery("#sidebartour").show(); }
         if ($("#layerSelect") != null )  { jQuery("#layerSelect").show(); }
         if ($("#tourSelect") != null )  { jQuery("#tourSelect").show(); }
         if ($("#tours-button") != null )  { jQuery("#tours-button").show(); }
         if ($("#show") != null ) { jQuery("#show").hide(); }
    } else {

         if ($("#sidebartour") != null )  { jQuery("#sidebartour").hide(); }
         if ($("#layerSelect") != null )  { jQuery("#layerSelect").hide(); }
         if ($("#tourSelect") != null )  { jQuery("#tourSelect").hide(); }
         if ($("#tours") != null )  { jQuery("#tours").hide(); }
         if ($("#tours-button") != null )  { jQuery("#tours-button").hide(); }
         if ($("#show") != null ) { jQuery("#show").show(); }
    }
 }
 checkWidth();

 $(window).resize(checkWidth);

});






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

       else if (str == 9)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ The Turkish Journal, 1812-14";
  }

       else if (str == 10)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Aegean Travels, 1815";
  }

       else if (str == 11)
  {
  document.getElementById('ListonTourNo').innerHTML = "/ Return to Constantinople, 1817";
  }
       else {
  document.getElementById('ListonTourNo').innerHTML = "";
  }
}
