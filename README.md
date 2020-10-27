ListonMapApplication
====================

This <a href="https://digital.nls.uk/travels-of-henrietta-liston/map/">map application</a> uses <a href="https://openlayers.org/">OpenLayers v 3.5</a>, and <a href="https://geojson.org/geojson-spec.html">GeoJSON</a> sets of points and lines to form a geographical interface for the <a href="https://digital.nls.uk/travels-of-henrietta-liston/index.html">Travels of Henrietta Liston, 1796-1817</a>. 

There are <a href="https://digital.nls.uk/travels-of-henrietta-liston/places.html#help">Help Notes about the map application</a>, explaining its basic use.

This map viewer was originally put together in 2018 to show the North American and Canadian tours of Henrietta and Robert Liston (1796-1801). In 2020 the map viewer was updated to include the three tours to Constantinople / Istanbul (1812-1817). At the same time, some improvements were made to the functionality as well as better responsive styling.

All the map specific Javascript written for this application is in the <a href="https://github.com/NationalLibraryOfScotland/ListonMapApplication/blob/master/scripts/liston-map.js">liston-map.js</a> file with comments explaining the functions.

The left-hand map panel allows a set of modern background maps to be displayed, and the lines and points of each tour. The right-hand map panel shows three georeferenced historical maps from the 1790s, which display at different zoom levels. These maps were generated using <a href="https://www.maptiler.com/">MapTiler</a>.

The map application allows searching by a 'Search Places Visited' button, bringing up a gazetteer of places (presented using <a href="https://getbootstrap.com/components/#nav-tabs">Bootstrap Nav Tabs</a>). Selecting a place initiates a zoomMap(x,y) function which closes the gazetteer div, zooms to the selected place on the map using pan and bounce animation, and selects it. It is also possible to search directly by zooming in on the map. 

Some of the functionality of the dual-map viewer, including the cross-hair slave pointer, is taken from the National Library of Scotland <a href="http://maps.nls.uk/geo/explore/sidebyside/">Side-by-Side viewer</a>.

The lines and points of each tour, appearing as coloured overlays on the left map panel, are generated from <a href="https://geojson.org/geojson-spec.html">GeoJSON</a> files. These have been styled using a stylefunction to change their display at different zoom levels, with directional arrows at higher zoom levels. There are 8 tours, with separate point and line GeoJSON files for each tour, with each grouped together as an ol.layer.Group for selection and display of each tour separately.

When tour points are selected, eg. <a href="https://digital.nls.uk/travels-of-henrietta-liston/map/#zoom=10&lat=38.9393&lon=-76.9339&tour=2&point=38.9393,-76.9339">Bladensburg</a> they are styled to appear in orange, the details of the place and link to its appearance in the <a href="https://digital.nls.uk/travels-of-henrietta-liston/browse/index.html">Liston Journals</a> are shown to the upper right. This uses the OpenLayers forEachFeatureAtPixel functionality.

The URL of the application changes dynamically to show the particular zoom level and centre of the map, as well as if a place or tours is selected. You can save this specific URL to return to a specific map view or selected place. 

View the <a href="https://digital.nls.uk/travels-of-henrietta-liston/map/">complete working version of the application</a> on the National Library of Scotland website.

