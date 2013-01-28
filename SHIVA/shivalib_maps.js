///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAPS/EARTH
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawEarth=function() 
{
	if (!this.map) {													// If not initted yet 
      	this.map="no";													// Loading
     	google.earth.createInstance(this.container, $.proxy(initCB,this));	// Create
	  	return;															// Quit
	  	}
	if (this.map == "no") 												// If not initted yet 
	  	return;															// Quit
	if (!this.options) 													// If no options yet
	  	return;															// Quit
	
	var ops=this.options;
   	this.items=[];
   	for (var key in ops) {
		if (ops[key] == "true")  ops[key]=true;
		if (ops[key] == "false") ops[key]=false;
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			v=ops[key].split(';');
			for (i=0;i<v.length;++i) {
				vv=v[i].split(':');
                if (vv[1].indexOf("http") == -1)
                    vv[1]=vv[1].replace(/~/g,"=");
  				o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");
				}
			this.items.push(o);
			}
		}
	$("#"+this.container).height(ops.height);							// Height
	$("#"+this.container).width(ops.width);								// Width
	var ge=this.map;													// Point at Google Earth
	var lookAt=ge.createLookAt('');										// LookAt object
	var v=ops.mapcenter.split(",");										// Get center
	lookAt.setLatitude(Number(v[0]));									// Set lat
	lookAt.setLongitude(Number(v[1]));									// Set lon
	lookAt.setRange(Number(ops.range));									// Set range
	lookAt.setTilt(Number(ops.tilt));									// Set tilt
	lookAt.setHeading(Number(ops.heading));								// Set heading
	ge.getView().setAbstractView(lookAt);								// Go there

	if (ops.panControl)													// If controls on
		ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);	// Show them	  
	else																// Controls off
		ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);	// Hide them	 
	ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_INSET_PIXELS);	// Top
	ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_PIXELS);	// Left

	ge.getOptions().setOverviewMapVisibility((ops.overviewMapControl));	// Show overview?
	ge.getOptions().setMouseNavigationEnabled((ops.draggable));			// Show overview	 	 
	if (ops.scrollwheel)												// If scroll enabled on
		ge.getOptions().setScrollWheelZoomSpeed(1);	    				// Normal action
	else																// No scroll
		ge.getOptions().setScrollWheelZoomSpeed(.0000000001)	    	// Disable by making really small
	ge.getOptions().setTerrainExaggeration(Number(ops.terrainexag));	// Terrain exaggeration
	ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS,ops.borders);	// Show borders?
	ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS,ops.roads);		// Show roads?
	ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN,true);			// Show terrain
	this.DrawEarthOverlays();											// Draw overlays
	this.DrawLayerControlBox(this.items,ops.controlbox);				// Draw control box
	
	function initCB(instance) {											// GOOGLE EARTH INIT
		this.map=instance;												// Set ptr to earth
		this.map.getWindow().setVisibility(true);						// Show it
		this.DrawEarth();												// Draw it
		if (typeof(ShivaPostInit) == "function") 						// If called from earth.htm
			ShivaPostInit();											// Do any post-init actions					
		google.earth.addEventListener(this.map.getGlobe(),'click', function(e) {	 // Click event
			var str=e.getLatitude()+"|"+e.getLongitude()+"|"+e.getClientX()+"|"+e.getClientY();
	 		shivaLib.SendShivaMessage("ShivaEarth=click|"+str);			// Send shiva message
 			});
		google.earth.addEventListener(shivaLib.map.getView(),'viewchangeend', function() { 
			var lookAt=shivaLib.map.getView().copyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);
			var view=Math.floor(lookAt.getLatitude()*10000)/10000+"|"+Math.floor(lookAt.getLongitude()*10000)/10000+"|";
			view+=Math.floor(lookAt.getRange())+"|"+Math.floor(lookAt.getTilt()*100)/100+"|"+Math.floor(lookAt.getHeading()*100)/100;
 			shivaLib.SendShivaMessage("ShivaEarth=move|"+view);			// Send shiva message
			});
		}
	this.SendReadyMessage(true);										// Send ready message									
}

//38.07,-78.55,37.99,-78.41,75
//http://www.viseyes.org/shiva/map.jpg
//http://code.google.com/apis/earth/documentation/samples/kml_example.kml

SHIVA_Show.prototype.DrawEarthOverlays=function() 					//	DRAW MAP OVERLAYS
{
	var i,v,opacity,obj;
	var items=this.items;												// Point to items
	var lookAt=this.map.getView().copyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);	// Lookat object
	lookAt.setLatitude(Number(this.options.mapcenter.split(",")[0]));	// Set lat
	lookAt.setLongitude(Number(this.options.mapcenter.split(",")[1]));	// Set lon
	lookAt.setRange(Number(this.options.range));						// Set range
	lookAt.setTilt(Number(this.options.tilt));							// Set tilt
	lookAt.setHeading(Number(this.options.heading));					// Set heading

	for (i=0;i<items.length;++i) {
		opacity=1;														// Assume full opacity
		obj=shivaLib.map.getElementById("Layer-"+(i+1));				// Pointer to pevious layer obj, if any
		if (items[i].layerType == "GoTo") {								// GoTo position
			v=items[i].layerSource.split(",");							// Split into parts
			if ((v.length > 1) && (items[i].visible == "true")) {		// If enough  vals and visible
				if (v[0] != undefined)	lookAt.setLatitude(Number(v[0]));	// Set lat
				if (v[1] != undefined)	lookAt.setLongitude(Number(v[1]));	// Set lon
				if (v[2] != undefined)	lookAt.setRange(Number(v[2]));	// Set range
				if (v[3] != undefined)	lookAt.setTilt(Number(v[3]));	// Set tilt
				if (v[4] != undefined)	lookAt.setHeading(Number(v[4]));// Set heading
				}
			}
		if (items[i].layerType == "Overlay") {							// Image overlay
			if (!obj) {													// Not already alloc'd
				obj=this.map.createGroundOverlay("Layer-"+(i+1));		// Alloc overlay obj
				this.map.getFeatures().appendChild(obj);				// Add it to display list
				}
			if (items[i].listener)										// If exist
				google.earth.removeEventListener(obj,'click', null)		// Click event
			v=items[i].layerOptions.split(",");							// Split dest pos
			var icon=this.map.createIcon('');							// Create icon
			icon.setHref(items[i].layerSource);							// Set url
			obj.setIcon(icon);											// Set it
			var latLonBox=this.map.createLatLonBox('');					// Create loc
			latLonBox.setBox(Number(v[2]),Number(v[0]),Number(v[1]),Number(v[3]),0); // Fill loc	
			obj.setLatLonBox(latLonBox);								// Set loc
			if (v.length == 5)											// If opacity set
				opacity=v[4]/100;										// Set it
			}
		if (items[i].layerType == "KML") {								// KML layer
			var link=this.map.createLink('');							// Create link object	
			link.setHref(items[i].layerSource);							// Set url
			if (!obj) {													// Not already alloc'd
				obj=this.map.createNetworkLink("Layer-"+(i+1));			// Create layer object
				this.map.getFeatures().appendChild(obj);				// Add it to display list
				}
			var fly=(items[i].layerOptions.toLowerCase().indexOf("port") == -1)		// Preserve viewport?
			obj.set(link,true,fly); 									// Sets the flyToView
			items[i].listener=google.earth.addEventListener(obj,'click', function(e) {		 // Click event
				var str=i+"|"+e.getLatitude()+"|"+e.getLongitude();		// Get lon and lat
		 		shivaLib.SendShivaMessage("ShivaEarth=kml|"+str);		// Send shiva message
	 			});
			}
		if (obj) {														// If an object
			obj.setOpacity(opacity);									// Set opacity
			obj.setVisibility(items[i].visible == "true");				// Show/hide it
			}
		}
	this.map.getView().setAbstractView(lookAt);							// Go there
}

SHIVA_Show.prototype.EarthActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaActEarth=goto") {									// GOTO
		var lookAt=shivaLib.map.getView().copyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);
		if (v[1] != undefined)	lookAt.setLatitude(Number(v[1]));		// Set lat
		if (v[2] != undefined)	lookAt.setLongitude(Number(v[2]));		// Set lon
		if (v[3] != undefined)	lookAt.setRange(Number(v[3]));			// Set range
		if (v[4] != undefined)	lookAt.setTilt(Number(v[4]));			// Set tilt
		if (v[5] != undefined)	lookAt.setHeading(Number(v[5]));		// Set heading
		shivaLib.map.getView().setAbstractView(lookAt);					// Go there
		}
	else if ((v[0] == "ShivaActEarth=show") || (v[0] == "ShivaActEarth=hide")) {	// SHOW/SHOW
		if (this.items[v[1]]) 											// If valid item	
			this.items[v[1]].visible=(v[0] == "ShivaActEarth=show").toString();	// Set visibility 
		this.DrawEarthOverlays();											// Redraw
		}
	else if (v[0] == "ShivaActEarth=data")  {							// FILL MARKERS
		if (v[1]) 														// If valid item	
			this.EarthAddMarkers(v[1]);									// Add markers
		}
}

SHIVA_Show.prototype.EarthAddMarkers=function(json)				// ADD MARKERS FROM JSON
{
}

///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAPS
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawMap=function() 													//	DRAW MAP
{
	var v,vv,i;
	var container=this.container;
	var ops=this.options;
   	var latlng=new google.maps.LatLng(-34.397,150.644);
	var mapType=ops.mapTypeId.toUpperCase();
	if (mapType == "LAND")
		ops.mapTypeId=mapType;
	else
		ops.mapTypeId=google.maps.MapTypeId[mapType];
  	var ll=ops.mapcenter.split(",")
	latlng=new google.maps.LatLng(ll[0],ll[1]);
	ops.center=latlng;
	ops.zoom=Number(ll[2]);
   	
  	this.items=[];
  	for (var key in ops) {
		if (ops[key] == "true")  ops[key]=true;
		if (ops[key] == "false") ops[key]=false;
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			v=ops[key].split(';');
			for (i=0;i<v.length;++i) {
				vv=v[i].split(':');
				if (vv[1].indexOf("http") == -1)
				    vv[1]=vv[1].replace(/~/g,"=");
				o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");
				}
			this.items.push(o);
			}
		}
	
	if (ops.width)
		document.getElementById(container).style.width=ops.width+"px";
	if (ops.height)
		document.getElementById(container).style.height=ops.height+"px";
	ops["mapTypeControlOptions"]={ "mapTypeIds":[	
		google.maps.MapTypeId.ROADMAP,
     	google.maps.MapTypeId.TERRAIN,
		google.maps.MapTypeId.SATELLITE,
		google.maps.MapTypeId.HYBRID,
		"LAND"
		],
		style: google.maps.MapTypeControlStyle.DROPDOWN_MENU 
		};
	this.map=new google.maps.Map(document.getElementById(container),ops);
	this.AddClearMapStyle(this.map);
	this.AddBlankMapStyle(this.map);
	this.DrawMapOverlays();
	this.DrawLayerControlBox(this.items,this.options.controlbox);
	this.SendReadyMessage(true);											
	google.maps.event.addListener(this.map,'click', function(e) {
	 	var l=e.latLng.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");
	 	var p=e.pixel.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");
	 	shivaLib.SendShivaMessage("ShivaMap=click|"+l+"|"+p);
 		});
	google.maps.event.addListener(this.map,'center_changed', function(e) {
	 	var map=shivaLib.map;
	 	var lat=map.getCenter();
	 	shivaLib.SendShivaMessage("ShivaMap=move|"+lat.Ya+"|"+lat.Za+"|"+map.getZoom());
 		});
}

SHIVA_Show.prototype.AddInternalOptions=function(options, newOps) 							//	PARSE ITEMS
{
	var i,vv;
	if (newOps) {
		var v=newOps.split(',');
		for (i=0;i<v.length;++i) {
			vv=v[i].split("=");
			if (vv[1] == 'true') 	vv[1]=true;
			if (vv[1] == 'false') 	vv[1]=false;
			options[vv[0]]=vv[1];
			}
		}
}		

SHIVA_Show.prototype.DrawMapOverlays=function() 										//	DRAW MAP OVERLAYS
{
 	if (!this.items)
  		return;
 	var i,j,latlng,v,ops,curZoom,curLatLon;
	var _this=this;
 	var items=this.items; 
    v=this.options.mapcenter.split(",")
	curLatlng=new google.maps.LatLng(v[0],v[1]);
	curZoom=v[2];
	for (i=0;i<items.length;++i) {
		ops=new Object();
		if (items[i].listener)
			google.maps.event.removeListener(items[i].listener);
		if ((items[i].obj) && (items[i].layerType == "MarkerSet")) {
			for (j=0;j<items[i].obj.length;++j) {						
				google.maps.event.removeListener(items[i].obj[j].listener);	
				items[i].obj[j].obj.setMap(null);
				}
			items[i].obj=null;
			}
		else if (items[i].obj)
			items[i].obj.setMap(null);
		if (items[i].layerType == "Drawn") {
			items[i].obj=new ShivaCustomMapOverlay()
			}
		else if (items[i].layerType == "Marker") {
			items[i].obj=new google.maps.Marker();
			v=items[i].layerSource.split(",")
			items[i].pos=latlng=new google.maps.LatLng(v[0],v[1]);
			ops["title"]=v[2];
			ops["position"]=latlng;
			if (v.length == 4)
				ops["icon"]=v[3]
 			if (ops && items[i].obj)
				items[i].obj.setOptions(ops);
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
				var j,v;
 				for (j=0;j<_this.items.length;++j)	{				
					v=_this.items[j].layerSource.split(",")
					if (v[2] == this.title)					
 						break;											
  					}
   				shivaLib.SendShivaMessage("ShivaMap=marker|"+this.title+"|"+e.latLng.Ya+"|"+e.latLng.Za+"|"+j);
	 			});
			}
		else if (items[i].layerType == "MarkerSet") {
			if (items[i].visible == "true") {
				this.items[i].obj=[];
				this.markerData=i;
				this.GetGoogleSpreadsheet(items[i].layerSource,function(d){_this.MapAddMarkers(d,_this.items[_this.markerData].obj)});
				}
			continue;
			}
		else if (items[i].layerType == "Overlay") {
			v=items[i].layerOptions.split(",");
			var imageBounds=new google.maps.LatLngBounds(new google.maps.LatLng(v[2],v[1]),new google.maps.LatLng(v[0],v[3]));
			if (v.length == 5)
				ops["opacity"]=v[4]/100;
			if (items[i].layerSource)
				items[i].obj=new google.maps.GroundOverlay(items[i].layerSource,imageBounds,ops);
//	38.07,-78.55,37.99,-78.41
//	//www.viseyes.org/shiva/map.jpg
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
	 			shivaLib.SendShivaMessage("ShivaMap=overlay|"+this.url+"|"+e.latLng.Ya+"|"+e.latLng.Za);
 				});
			}
		else if (items[i].layerType == "KML") {
			if (items[i].layerOptions) {	
				v=items[i].layerOptions.split(",");
				for (j=0;j<v.length;++j) 
					ops[v[j].split("=")[0]]=v[j].split("=")[1];
				}
			items[i].obj=new google.maps.KmlLayer(items[i].layerSource,ops);
			items[i].listener=google.maps.event.addListener(items[i].obj,'click', function(e) {
	  			var str=this.url+"|"+e.featureData.name+"|"+e.latLng.Ya+"|"+e.latLng.Za;
		 		shivaLib.SendShivaMessage("ShivaMap=kml|"+str);
	 			});
			}
		else if ((items[i].layerType == "GoTo") && (items[i].visible == "true")) {
			v=items[i].layerSource.split(",");							// Split into parts
			if (v.length > 1)									 		// If enough  vals and visible
				curLatlng=new google.maps.LatLng(v[0],v[1]);			// Set center
			if (v.length > 2)											// If set
				curZoom=v[2];											// Set zoom
			}
		if ((items[i].visible == "true") && (items[i].obj))				// If showing
			items[i].obj.setMap(this.map);								// Add to map
		}
	this.map.setCenter(curLatlng);										// Center map
	this.map.setZoom(Number(curZoom));									// Zoom map
}

SHIVA_Show.prototype.MapActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaActMap=goto") {									// GOTO
		var curLatlng=new google.maps.LatLng(v[1],v[2]);				// Set lat/lon
		this.map.setCenter(curLatlng);									// Center map
		this.map.setZoom(Number(v[3]));									// Zoom map
		}
	else if ((v[0] == "ShivaActMap=show") || (v[0] == "ShivaActMap=hide")) {	// SHOW/SHOW
		if (this.items[v[1]]) 											// If valid item	
			this.items[v[1]].visible=(v[0] == "ShivaActMap=show").toString();	// Set visibility 
		this.DrawMapOverlays();											// Redraw
		}
	else if (v[0] == "ShivaActMap=data")  {								// FILL MARKERS
		if (v[1]) 														// If valid item	
			this.MapAddMarkers(v[1]);									// Add markers
		}
	else if (v[0] == "ShivaActMap=marker") { 							// SHOW/HIDE MARKERS
		if (v[1] < this.markerData.length) 								// If valid
			this.markerData[v[1]].obj.setMap(v[2]=="true"?this.map:null);	// Hide/show
		}
}

SHIVA_Show.prototype.MapAddMarkers=function(json, mData)			// ADD MARKERS TO MAP FROM JSON
{
	var i,j,o,mark,list,ops;
	var _this=shivaLib;
	if (typeof(json) == "string") {										// If it came from shivaEvent
		json=$.parseJSON(json);											// Objectify
		var cols=json[0].length;										// Number of fields
		for (i=1;i<json.length;++i) {									// For each event
			o={};														// Fresh obj
			for (j=0;j<cols;++j)  										// For each value
				o[json[0][j]]=json[i][j];								// Key value pair
			json[i]=o;													// Add to array
			}
		json=json.slice(1);												// Remove header
		mData=this.markerData;											// Point at markerdata
		if (mData) {													// If data
			for (i=0;i<mData.length;++i) {								// For each old maker
				google.maps.event.removeListener(mData[i].listener);	// Remove listener
				mData[i].obj.setMap(null);								// Remove marker
				}
			}
		this.markerData=mData=[];										// Clear data 
		}
	for (i=0;i<json.length;++i) {										// For each marker
		mark=new google.maps.Marker();									// Create marker obj
		ops={};															// New obj
		if (json[i].title)												// If a title
			ops["title"]=json[i].title;									// Set title
		ops["position"]=new google.maps.LatLng(json[i].lat-0,json[i].lon-0); // Set position
		if (json[i].icon)												// If an icon
			ops["icon"]=json[i].icon;									// Set icon
		mark.setOptions(ops);											// Set options
		mark.setMap(shivaLib.map);										// Add to map
		list=google.maps.event.addListener(mark,'click', function(e) {	// Add listener
 			var j;
 			for (j=0;j<mData.length;++j)								// Look thru data	
 				if (mData[j].title == this.title)						// If titles match
 						break;											// Quit looking
  			shivaLib.SendShivaMessage("ShivaMap=marker|"+this.title+"|"+e.latLng.Ya+"|"+e.latLng.Za+"|"+j);
			});
		mData.push({ obj:mark, title:json[i].title,listener:list });	// Add to array
		}
}

SHIVA_Show.prototype.DrawLayerControlBox=function(items, show)			// DRAW LAYER CONTROLBOX
{
	var i,hasGotos=false,hasLayers=false;
	if (!show) {															// If not on
		$("#shivaMapControlDiv").remove();									// Remove it
		return;																// Quit
		}
	var l=$("#"+this.container).css("left").replace(/px/g,"");				// Get left
	var t=$("#"+this.container).css("top").replace(/px/g,"");				// Get top
	var h=$("#"+this.container).css("height").replace(/px/g,"");			// Get height
	if (t == "auto")	t=8;												// Must be a num
	if (l == "auto")	l=8;												// Must be a num
	if (this.options.shivaGroup == "Earth") {								// If earth, place top-right
		l=Number(l)+($("#"+this.container).css("width").replace(/px/g,"")-0)+8;	 // Right
		t=24;	h=0;														// Top
		}
	if ($("#shivaMapControlDiv").length == 0) {								// If no palette
		str="<div id='shivaMapControlDiv' style='position:absolute;left:"+l+"px;top:"+((t-0)+(h-0)-24)+"px'>";
		$("body").append("</div>"+str);										// Add palette to body
		$("#shivaMapControlDiv").addClass("rounded-corners").css("background-color","#eee").css('border',"1px solid #ccc");
		$("#shivaMapControlDiv").draggable();								// Make it draggable
		$("#shivaMapControlDiv").css("z-index",2001);						// Force on top
		}
	var str="<p style='text-shadow:1px 1px white' align='center'><b>&nbsp;&nbsp;Controls&nbsp;&nbsp;</b></p>";
	for (i=0;i<items.length;++i) {											// For each item
		if ((items[i].layerTitle) && (items[i].layerType != "GoTo")) 		// If titled and not a GoTo
			hasLayers=true;													// Draw layers header
		else if ((items[i].layerTitle) && (items[i].layerType == "GoTo")) 	// If titled and a GoTo
			hasGotos=true;													// Draw gotos header
		}
	if (hasLayers) {														// If has layers, put up this header
		str="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Show layer&nbsp;&nbsp;</b><br/>";
		for (i=0;i<items.length;++i) 
			if ((items[i].layerTitle) && (items[i].layerType != "GoTo")) {	// If titled and not a GoTo
				str+="&nbsp;<input type='checkbox' id='shcb"+i+"'";			// Add check
				if (items[i].visible == "true")								// If initially visible
					str+=" checked=checked ";								// Set checked
				str+=">"+items[i].layerTitle+"&nbsp;&nbsp;<br/>";			// Add label
				}
			str+="</p>";													// Close p	
			}
	if (hasGotos) {															// Ih gotos
		if (!hasLayers)  str="";											// If not layers, kill header
		str+="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Go to place&nbsp;&nbsp;</b><br/>";
		str+="&nbsp;<input type='radio' name='gotos' id='shcr"+items.length+"' checked=checked>Home<br/>";		// Add home button
		for (i=0;i<items.length;++i) 										// For each item
			if ((items[i].layerTitle) && (items[i].layerType == "GoTo")) {	// If a GoTo
				str+="&nbsp;<input type='radio' name='gotos' id='shcr"+i+"'";	// Add check
				if (items[i].visible == "true")								// If initially visible
					str+=" checked=checked ";								// Set checked
				str+=">"+items[i].layerTitle+"&nbsp;&nbsp;<br/>";			// Add label
				}
		str+="</p>";														// Close p	
		}
	$("#shivaMapControlDiv").html(str+"<br/>");								// Add content	
	var _this=this;															// Local copy of this
	for (i=0;i<items.length;++i) {											// For each item
		if (items[i].layerType == "GoTo")									// If a goto
			$("#shcr"+i).click( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this); } );  // Add handler
		else																// A regular layer
			$("#shcb"+i).click( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"?"),_this); } );  // Add handler
		}
	if (hasGotos)															// If has gotos
		$("#shcr"+items.length).change( function() { $.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this); } );  // Add handler
}

////////////// CUSTOM OVERLAY //////////////

if ((typeof(google) == "object") && (google.maps))							// If lib loaded
	ShivaCustomMapOverlay.prototype=new google.maps.OverlayView();			// Inherit from Google maps overlay class

function ShivaCustomMapOverlay(bounds, data)							// CUSTOM MAP OVERLAY
{
var swBound = new google.maps.LatLng(62.281819, -150.287132);
var neBound = new google.maps.LatLng(62.400471, -150.005608);
bounds = new google.maps.LatLngBounds(swBound, neBound);
	this.bounds_=bounds;													// Set bounds
  	this.data_= data;														// Drawing data
 	this.div_=null;															// Container div
  }

ShivaCustomMapOverlay.prototype.onAdd=function()						// ADD HANDLER
{
	var div=document.createElement('div');									// Layer div
	div.style.border="none";												
	div.style.borderWidth="0px";
	div.style.position="absolute";

var img = document.createElement("img");
img.src="http://www.viseyes.org/shiva/map.jpg";
img.style.width = "100%";
img.style.height = "100%";
div.appendChild(img);

	this.div_=div;															// Set div
	var panes=this.getPanes();												// Get list of panes
	panes.overlayLayer.appendChild(div);									// Add to overlay pane
}

ShivaCustomMapOverlay.prototype.draw=function()							// DRAW HANDLER
{
	var overlayProjection=this.getProjection();								// Get current proj
	var sw=overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());  // Get corner
	var ne=overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());	 // Get corner
	this.div_.style.left=sw.x+'px';											// Left
	this.div_.style.top=ne.y+'px';											// Top
	this.div_.style.width=(ne.x-sw.x)+'px';									// Width
	this.div_.style.height=(sw.y-ne.y)+'px';								// Hgt
}

ShivaCustomMapOverlay.prototype.onRemove=function()							// REMOVE HANDLER
{
	this.div_.parentNode.removeChild(this.div_);
  	this.div_=null;
}

////////////// LAND MAP ///////////////

SHIVA_Show.prototype.AddClearMapStyle=function(map)						// SET MAP STYLE
{
	var style=[
		{ featureType:"road", 	        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"transit",        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"poi",            elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"administrative", elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"landscape",      elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"labels",   stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"geometry", stylers: [ { lightness:-20}    ] }
		];
	var type=new google.maps.StyledMapType(style,{name:"Land"});
	map.mapTypes.set("LAND",type);
}

SHIVA_Show.prototype.AddBlankMapStyle=function(map)						// SET BLANK MAP STYLE
{
	var style=[
		{ featureType:"road", 	        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"transit",        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"poi",            elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"administrative", elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"landscape",      elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"water",      	elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"labels",   stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"geometry", stylers: [ { lightness:-20}    ] }
		];
	var type=new google.maps.StyledMapType(style,{name:"Blank"});
	map.mapTypes.set("BLANK",type);
}
