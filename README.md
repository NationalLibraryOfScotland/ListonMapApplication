NLSFindByPlaceOL3
=================

This <a href="http://digital.nls.uk/travels-of-henrietta-liston/map/">map application</a> uses <a href="http://openlayers.org/">OpenLayers v 3.5</a>, and GE0JSON sets of points and lines to form a geographical interface for the <a href="http://digital.nls.uk/travels-of-henrietta-liston/index.html">tours of Henrietta Liston, 1796-1801</a>. 

There are <a href="http://digital.nls.uk/travels-of-henrietta-liston/places.html">Help Notes about the map application</a>, explaining its basic use.

All the map specific Javascript is in the <a href="https://github.com/NationalLibraryOfScotland/ListonMapApplication/blob/master/liston-map.js">liston-map.js</a> file.

The left-hand map panel allows a set of modern background maps to be displayed, and the lines and points of each tour. The right-hand map panel shows three georeferenced historical maps from the 1790s, which display at different zoom levels. These maps were generated using <a href="https://www.maptiler.com/">MapTiler</a>.

The map application allows searching by a 'Search Places Visited' button, bringing up a gazetteer of places (presented using <a href="http://getbootstrap.com/components/#nav-tabs">Bootstrap Nav Tabs</a>). Selecting a place initiates a zoomMap(x,y) function which closes the gazetteer div, zooms to the selected place on the map, and selects it. It is also possible to search directly by zooming in on the map. 

Some of the functionality of the dual-map viewer, including the cross-hair slave pointer, is taken from the National Library of Scotland <a href="http://maps.nls.uk/geo/explore/sidebyside.cfm">Side-by-Side viewer</a>.

The lines and points of each tour, appearing as coloured overlays on the left map panel, are generated from GEOJSON files. These have been styled to change their display at different zoom levels.

When points are selected, eg. <a href="http://digital.nls.uk/travels-of-henrietta-liston/map/#zoom=10&lat=38.9393&lon=-76.9339&tour=2&point=38.9393,-76.9339">Bladensburg</a> they are styled to appear in orange, the details of the place and link to its appearance in the <a href="http://digital.nls.uk/travels-of-henrietta-liston/browse/index.html">Liston Journals</a> are shown to the upper right.

The URL of the application changes dynamically to show the particular zoom level and centre of the map, as well as if a place or tours is selected. You can save this specific URL to return to a specific map view or selected place.

View a more <a href="http://digital.nls.uk/travels-of-henrietta-liston/map/">complete working version of the application</a> on the National Library of Scotland website.

