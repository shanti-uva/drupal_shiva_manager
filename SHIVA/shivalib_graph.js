///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB GRAPH
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawGraph=function() 							//	DRAW GRAPH
{
	var i,j,o,shape,id=0;
	var options=this.options;											// Local options
	var con="#"+this.container;											// Container
	var svg=null,nodes=null,edges=null,labels=null;						// Pointers to d3 data
	var dataSet=null;													// Holds data
	var d3Zoom;															// Scale/zoom
	var minZoom=.1,maxZoom=10;											// Zoom range
	var margins=[0,0,0,0];												// Default margins
	var canPan=true;													// Can pan/zoom screen
	var firstTime=true;
		
	var unselectable={"-moz-user-select":"none","-khtml-user-select":"none",	
		   			  "-webkit-user-select":"none","-ms-user-select":"none",
		   			  "user-select":"none","pointer-events":"none" }
	
	$(con).css("overflow","hidden")										// Keep in container

	if (!$("d3Popup").length)											// If not popup div yet
		$("body").append("<div id='d3Popup' class='rounded-corners' style='display:none;position:absolute;border:1px solid #999;background-color:#eee;padding:8px'></div>");
	
	var styles=new Object();											// Styles

	if (options.backCol == "none")										// If  transparent
		$(con).css("background-color","transparent");					// Set background color
	else																// Normal color
		$(con).css("background-color","#"+options.backCol);				// Set background color
	$(con).width(options.width);										// Set width
	if (options.height)													// If height spec'd												
		$(con).height(options.height);									// Set height
	else																// Not spec'd
		$(con).height(options.width),h=w;								// Use width
	$(con).html("");													// Clear div
	var colors=d3.scale.category10();									// Default colors
	var opHeight=$(con).height();										// Get height in pixels
	var opWidth=$(con).width();											// Get width in pixels
 	var w=opWidth;														// Width
	var h=opHeight;														// Height
	
	
	// DATA //////////////////////////////////////////////////////////////////////////////////////////////////////
	
	if ((options.chartType == "Network") || (options.chartType == "Chord")) {	// Force directed or chord
		if (options.dataSourceUrl) 										// If a spreadsheet spec'd
	    	this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
				var ids=new Object();
				dataSet={ nodes:[],edges:[]};							// Clear data
				styles={};												// Clear styles
				for (i=0;i<data.length;++i) {							// For each row
					if (!data[i][0])									// If no data
						continue;										// Skip
					if (data[i][0].match(/link-class/i)) {				// If a link-class
						if (!styles[data[i][1]])						// If new
							styles[data[i][1]]={};						// Create new style object
						if (data[i][2].match(/color/i))					// A color
							styles[data[i][1]].eCol=data[i][3];			// Set it
						if (data[i][2].match(/type/i))					// A shape
							styles[data[i][1]].shape=data[i][3];		// Set it
						if (data[i][2].match(/linewidth/i))				// A line width
							styles[data[i][1]].eWid=data[i][3];			// Set it
						if (data[i][2].match(/linecolor/i))				// A line color
							styles[data[i][1]].eCol=data[i][3];			// Set it
						if (data[i][2].match(/alpha/i))					// alpha
							styles[data[i][1]].alpha=data[i][3];		// Set it
						}
					else if (data[i][0].match(/class/i)) {				// If a class
						if (!styles[data[i][1]])						// If new
							styles[data[i][1]]={};						// Create new style object
						if (data[i][2].match(/color/i))					// A color
							styles[data[i][1]].col=data[i][3];			// Set it
						if (data[i][2].match(/type/i))					// A shape
							styles[data[i][1]].shape=data[i][3];		// Set it
						if (data[i][2].match(/linewidth/i))				// A line width
							styles[data[i][1]].eWid=data[i][3];			// Set it
						if (data[i][2].match(/linecolor/i))				// A line color
							styles[data[i][1]].eCol=data[i][3];			// Set it
						if (data[i][2].match(/alpha/i))					// Alpha
							styles[data[i][1]].alpha=data[i][3];		// Set it
						if (data[i][2].match(/dim/i))					// Size
							styles[data[i][1]].size=data[i][3];			// Set it
						}
					else if (data[i][0].match(/node/i)) {				// If a node
						o={};											// New object
						o.name=data[i][2];								// Add name
						o.id=data[i][1];								// Add id
						if (data[i][3])									// If a style set
							o.style=data[i][3];							// Add style
						if (data[i][4])									// If an info set
							o.info=data[i][4];							// Add info
						ids[o.id]=dataSet.nodes.length;					// Set index
						dataSet.nodes.push(o);							// Add node to list
						}
					else if (data[i][0].match(/link/i)) {				// If a link
						o={};											// New object
						o.source=data[i][1];							// Add name
						o.target=data[i][3];							// Add id
						o.style=data[i][2];								// Add style
						dataSet.edges.push(o);							// Add node to list
						}
					}
	 			for (i=0;i<dataSet.edges.length;++i) {					// For each edge
	 				dataSet.edges[i].source=ids[dataSet.edges[i].source];	// Convert id to index
	 				dataSet.edges[i].target=ids[dataSet.edges[i].target];	// Convert id to index
	 				}
	  			redraw();												// Draw graph
				});
		else if (dataSet)												// If data
			redraw();													// Draw graph
		}
	else if ((options.chartType == "Tree") || (options.chartType == "Bubble")) {	// Tree like data
		if (options.chartType == "Bubble")	minZoom=1;					// Cap zoom at 1
		if (options.dataSourceUrl) {									// If a spreadsheet spec'd
  			var nodeLink=false;											// Assume simple format
   			this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
			var items=new Array();										// Holds items
			for (i=0;i<data.length;++i) 								// For each row
				if (data[i][0] == "link") {								// If link node
					nodeLink=true;										// Node/link format
					break;												// Quit looking
					}
			if (nodeLink) {												// If using line/node format
				var ids=new Object();
				dataSet={ nodes:[],edges:[]};							// Clear data
				for (i=0;i<data.length;++i) {							// For each row
					if (!data[i][0])									// If no data
						continue;										// Skip
					else if (data[i][0].match(/node/i)) {				// If a node
						o={};											// New object
						o.name=data[i][2];								// Add name
						o.id=data[i][1];								// Add id
						if (data[i][4])									// If an info set
							o.info=data[i][4];							// Add info
						ids[o.id]=dataSet.nodes.length;					// Set index
						dataSet.nodes.push(o);							// Add node to list
						}
					else if (data[i][0].match(/class/i)) {				// If a class
						if (!styles[data[i][1]])						// If new
							styles[data[i][1]]={};						// Create new style object
						if (data[i][2].match(/color/i))					// A color
							styles[data[i][1]].col=data[i][3];			// Set it
						if (data[i][2].match(/type/i))					// A shape
							styles[data[i][1]].shape=data[i][3];		// Set it
						if (data[i][2].match(/linewidth/i))				// A line width
							styles[data[i][1]].eWid=data[i][3];			// Set it
						if (data[i][2].match(/linecolor/i))				// A line color
							styles[data[i][1]].eCol=data[i][3];			// Set it
						if (data[i][2].match(/alpha/i))					// Alpha
							styles[data[i][1]].alpha=data[i][3];		// Set it
						if (data[i][2].match(/dim/i))					// Size
							styles[data[i][1]].size=data[i][3];			// Set it
						}
					else if (data[i][0].match(/link/i)) {				// If a link
						o={};											// New object
						o.source=data[i][1];							// Add name
						o.target=data[i][3];							// Add id
						o.style=data[i][2];								// Add style
						dataSet.edges.push(o);							// Add node to list
						}
					}
	 			for (i=0;i<dataSet.edges.length;++i) {						// For each edge
	 				dataSet.edges[i].source=ids[dataSet.edges[i].source];	// Convert id to index
	 				dataSet.edges[i].target=ids[dataSet.edges[i].target];	// Convert id to index
	 				}
				var v=[];
	 			for (i=0;i<dataSet.nodes.length;++i) {					// For each node
		 			v[i]=0;
		 			for (j=0;j<dataSet.edges.length;++j) {				// For each edge
						if (dataSet.edges[j].source == i) {				// Source is this node
							o={};										// New object
							o.val=1;									// Put 1 in
							v[dataSet.edges[j].target]=1;				// Has a parent
							o.parent=dataSet.nodes[i].name;				// Set name
							o.style=dataSet.edges[j].style;
							o.name=dataSet.nodes[dataSet.edges[j].target].name;	// Set parent
							items.push(o);								// Add to array
							}
						}
					}
	 			for (i=0;i<dataSet.nodes.length;++i) 					// For each node
	 				if (!v[i]) {										// If not linked to anything
	 					items.splice(0,0,{name:dataSet.nodes[i].name,parent:"root", val:1});	// Add as root
	 					break;											// Quit looking
						}
				}
			else{														// Simple tree format
				for (i=0;i<data.length;++i) {							// For each row
					if (!data[i][0])									// If no data
						continue;										// Skip
				 	if (!data[i][0].match(/node/i)) 					// If not a node
						continue;										// Skip
					o={};												// New object
					o.name=data[i][2];									// Add name
					o.parent=data[i][1];								// Add parent
					if (data[i][3])										// If an info set
						o.val=data[i][3];								// Add val
					else												// If nothing there
						o.val=1;										// Put 1 in
					if (data[i][4])										// If an info set
						o.info=data[i][4];								// Add info
					items.push(o);										// Add to array
					}
				}

		dataSet=[];														// Init as array first

		var dataMap=items.reduce(function(map, node) {					// Create datamap					
			map[node.name]=node;
			return map;
			},{});
 
 		items.forEach(function(node) {									// For each item	
			var parent=dataMap[node.parent];							// Make map
			if (parent) {												// If a parent
				(parent.children || (parent.children = []))				// If an array present
					.push(node);										// Add to it
				} 
			else														// No parent
				dataSet.push(node);										// Add node to root
			});
			
		dataSet=dataSet[0];												// Save as object
		dataSet.x0=h/2;													// Center x
		dataSet.y0=0;													// At top
		if (options.depth > 0)											// If limiting
			dataSet.children.forEach( function (d){ setOpen(d,0) }); 	// Initialize the display to show only certain levels

		function setOpen(d, depth) {								// SET OPEN NODES
			++depth;													// Add to depth
			if (d.children) {											// If node has children									
				d.children.forEach(function (d){ setOpen(d,depth) });	// Toggle all children
				if ((d.children) && (depth > (options.depth-1))) {		// If it has children and over depth
					d._children=d.children;								// Save old children
					d.children=null;									// Clear current children to close it
			  		} 
				}
			}
		redraw();														// Draw
		});
		}
	}
	else if (options.chartType == "Stream") {							// Stream
		minZoom=1;														// Cap zoom at 1
		if (options.dataSourceUrl) 										// If a spreadsheet spec'd
	    	this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
			dataSet=[];													// Init as array 
			var nRows=data.length;										// Number of rows
			var nSets=data[0].length-1;									// Number of datasets
			for (i=1;i<nSets;++i) {										// For each dataset
				for (j=1;j<nRows;++j) {									// For time point
					o={};												// New obj
					o.key=data[0][i];									// Set field name as key
					o.date=new Date(data[j][0]);						// Set date
					o.value=data[j][i]-0;								// Set value
					dataSet.push(o);									// Add item
					}
				}
			redraw();													// Draw
			},true);
	}																	
	else if (options.chartType == "Parallel") {							// Parallel
		minZoom=1;														// Cap zoom at 1
		if (options.dataSourceUrl) 										// If a spreadsheet spec'd
	    	this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
			dataSet=[];													// Init as array 
			var nRows=data.length;										// Number of rows
			var nSets=data[0].length;									// Number of datasets
			for (i=1;i<nRows;++i) {										// For each row
				var o={};												// New obj
				o.name=data[i][0];										// Set field name as key
				for (j=1;j<nSets;++j) 									// For each field
					o[data[0][j]]=data[i][j]-0;							// Set value
				dataSet.push(o);										// Add item
				}
			redraw();													// Draw
			},true);
	}																	
	
	
	// SVG /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	
	svg=d3.select(con)													// Add SVG to container div
		.append("svg")													// Add SVG shell
		.attr("width",w-margins[0]-margins[2]).attr("height",h-margins[1]-margins[3])	// Set size
		.call(d3Zoom=d3.behavior.zoom().scaleExtent([minZoom,maxZoom]).on("zoom",zoomed)) // Set zoom
 		.append("g")													// Needed for pan/zoom
     	
	svg.append("defs")													// Add defs section
	    .append("clipPath")
	    .attr("id","cp0")
	    .append("rect").attr("width",w).attr("height",h).attr("x",100).attr("y",0)
	    
	svg.append("rect")													// Pan and zoom rect
		.style({"fill":"none","pointer-events":"all"})					// Invisble
    	.attr("id","underLayer")										// Set id
    	.attr("width",w).attr("height",h)								// Set size
    	.on("click",function(){ $("#d3Popup").hide(); });				// Hide any open popups				
	
	function zoomed() {													// ZOOM HANDLER
 		var t;
 		if (!canPan)
 			return;
 		var scale=d3.event.scale;										// Set current scale
 		var tp=[margins[0]-0,margins[3]-0];								// Move to margins
 		if (options.chartType == "Tree")								// Tree is x/y flopped
 			t=tp[0],tp[0]=tp[1],tp[1]=t;								// Flop coords
		if (!d3.event.sourceEvent.shiftKey)								// Don't move with shift key down (to allow node dragging)
			tp[0]+=d3.event.translate[0],tp[1]+=d3.event.translate[1]	// Set translation
 		svg.attr("transform","translate("+tp+") scale("+scale+")");		// Do it
 		if (options.chartType == "Bubble")								// Bubble needs text control
		 	if (options.style == "Packed")
			 	svg.selectAll("text")									// Add text
					.attr("font-size",options.lSize/scale+"px")			// Size
					   .text(function(d) { return d.name.substring(0,d.r/3*scale); });	// Set text
			} 	
	
	
	// DRAW /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
	
	
	function redraw(what) {												// DRAW

		// NETWORK /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		if (options.chartType == "Network") {							// Force directed
			
			force=d3.layout.force()									// CREATE LAYOUT
				 .nodes(dataSet.nodes)									// Set nodes
				 .links(dataSet.edges)									// Set links
				 .size([w,h])											// Set size
				 .linkDistance([options.linkDist])						// Set link distance
				 .charge([options.linkCharge])							// Set charge
				 .gravity([options.linkGravity/100])					// Set gravity
				 .linkStrength(Math.min([options.linkStrength/100],1))	// Set link strength
				 .start();												// Draw
		
			edges=svg.selectAll("line")								// CREATE EDGES
				.data(dataSet.edges);									// Set data
			edges.enter()												// Enter
				.append("line")											// Add line
				.style("stroke", function(d, i) {						// Edge col
					if (d.style && styles[d.style] && styles[d.style].eCol)	// If a style spec'd
						return styles[d.style].eCol;					// Get col from data
					else												// Default
						return "#"+options.eCol;						// Set wid
						})									
				.style("stroke-width", function(d, i) {					// Edge width
					if (d.style && styles[d.style] && styles[d.style].eWid)	// If a style spec'd
						return styles[d.style].eWid;					// Get col from options
					else												// Default
						return options.eWid;							// Set wid
					})									
				.style("opacity", function(d, i) {						// Alpha
					if (d.style && styles[d.style] && styles[d.style].alpha) // If a style spec'd
						return styles[d.style].alpha;					// Get alpha from options
					else												// Default
						return 1;										// Full alpha			
						})

			edges.append("title")									// CREATE EDGE TOOLTIPS
		      	.text(function(d) {										// Set edge tooltip
					var str=d.source.name;								// From
		      		if (d.style)										// If a class
		      		 	str+=" "+d.style+" ";							// Use it
		      		else												// No class
		      		 	str+=" is linked to to ";						// Connects
	      			str+=d.target.name;									// To
		      		return str; 										// Return
		      		});					

			edges.exit().remove();										// Exit function							
	
			nodes=svg.selectAll("g")									// CREATE NODES
				.data(dataSet.nodes);									// Set data
			nodes.enter()												// Enter
				.append(function(d,i) {									// Add shape
					shape=options.nShape;								// Set shape
					if (d.style && styles[d.style] && styles[d.style].shape) // If a style spec'd
						shape=styles[d.style].shape;					// Get shape from options
					return document.createElementNS("http://www.w3.org/2000/svg",shape.toLowerCase() != "circle"?"polygon":"circle");	// Create svg based on shape
					})
				.attr("points",function(d,i) {							// Add points
					shape=options.nShape;								// Set shape
					if (d.style && styles[d.style] && styles[d.style].shape) // If a style spec'd
						shape=styles[d.style].shape;					// Get shape from options
					var size=options.nSize;								// Default size
					if (d.style && styles[d.style] && styles[d.style].size)	// If a style spec'd
						size=styles[d.style].size;						// Get size from options
					return DrawSVGShape(shape.toLowerCase(),size);		// Create svg based on shape
					})
				.attr("r",function(d,i) {								// Add points
					if (d.style && styles[d.style] && styles[d.style].size)	// If a style spec'd
						return styles[d.style].size/2;					// Get size from options
					else												// Default
						return options.nSize/2;							// Return size
					})
				.style("fill", function(d, i) {							// Color
					if (d.style && styles[d.style] && styles[d.style].col)	// If a style spec'd
						return styles[d.style].col;						// Get col from options
					else{												// Default	
						if (options.nCol == "none")						// If no color set														
							return colors(i); 							// Set color from auto colors
						else											// A color set
							return "#"+options.nCol;					// Set color
						}
					})									
				.style("stroke", function(d, i) {						// Edge col
					if (d.style && styles[d.style] && styles[d.style].eCol)	// If a style spec'd
						return styles[d.style].eCol;					// Get col from options
					})									
				.style("stroke-width", function(d, i) {					// Edge width
					if (d.style && styles[d.style] && styles[d.style].eWid)	// If a style spec'd
						return styles[d.style].eWid;					// Get col from options
					})									
				.style("opacity", function(d, i) {						// Alpha
					if (d.style && styles[d.style] && styles[d.style].alpha)	// If a style spec'd
						return styles[d.style].alpha;					// Get alpha from options
					})									
				.on("click",function(d){ if (!d3.event.shiftKey) AddPopup(d); })	// Click on node unless dragging w/ shift
				.call(force.drag);
			nodes.append("title")									// CREATE EDGE TOOLTIPS
		      	.text(function(d) { 
					var str=d.info;										// Copy info
					if (str && str.match(/http/)) {						// If an embedded url
						var v=(str+" ").match(/http.?:\/\/.*?\s/ig);	// Extract url(s)
						for (var i=0;i<v.length;++i) {					// For each url
							v[i]=v[i].trim();							// Trim it
							str=str.replace(RegExp(v[i].replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&")),"");	// Remove link
							}
						}
		      		return str; });										// Set label
			nodes.exit().remove();										// Exit function							
					  
			labels=svg.selectAll("text")							// CREATE LABELS
				.data(dataSet.nodes);									// Set data
			labels.enter()												// Enter
				.append("text")											// Add div
				.attr("font-family","sans-serif")						// Sans
				.attr("text-anchor", "middle")							// Centered
				.attr("font-size",options.lSize+"px")					// Size
				.attr("fill","#"+options.lCol)							// Color
				.text(function(d) { return d.name; });					// Set text
			labels.exit().remove();										// Exit function							
		
			force.on("tick", function() {								// Every time the simulation "ticks", this will be called
				var size;									
				labels.attr("x", function(d) { return d.x+"px"; })		// Position labels
					.attr("y", function(d) { 							// Set top
						if (d.style && styles[d.style] && styles[d.style].size)	// If a style spec'd
							size=styles[d.style].size;					// Get size from data
						else											// Use default
							size=options.nSize;							// Get size from options
						size=size*.6+options.lSize*1;					// Add text height
						return d.y+size+"px"; 							// Return pos
						});
				edges.attr("x1", function(d) { return d.source.x; })	// Move edges
					.attr("y1", function(d) { return d.source.y; })
					.attr("x2", function(d) { return d.target.x; })
					.attr("y2", function(d) { return d.target.y; });
			
				nodes.attr("transform",function(d) { return "translate("+d.x+" "+d.y+")" }); // Move nodes
				});
			
			}
		
		// TREE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		
		else if (options.chartType == "Tree") {							// Tree
	
		 	margins=[20,20,20,options.spacing/2];						// Margins
	   	 	if (firstTime)
		   	 	svg.attr("transform","translate("+margins[3]+","+margins[0]+")"); // Move into margin area
	   	 	
	   	 	var tree=d3.layout.tree()									// Create tree layout
 		   		.size([h,w]);											// Set size
 			
 			var diagonal=d3.svg.diagonal()								// Create link lines
		    	.projection(function(d) { return [d.y, d.x]; });		// Set projection with x/y crossed
  			nodes=tree.nodes(dataSet).reverse();						// Compute the new tree layout.
			nodes.forEach(function(d) { d.y=d.depth*options.spacing; });// Normalize for fixed-depth.
				
			var node=svg.selectAll("g")									// Update the nodes
		      .data(nodes,function(d) { return d.id || (d.id=++id); });	// Get data
		
			var nodeEnter=node.enter().append("g")	  					// Enter any new nodes at the parent's previous position.
				.attr("transform", function(d) { 						// Initial position
					if (d.parent)										// If not dataSet
						return  "translate("+d.parent.y+","+d.parent.x+")"; // Position to parent dot
					else												// If dataSet
						return  "translate("+dataSet.y0+","+dataSet.x0+")"; // Position to dataSet
					})
				.on("click", function(d) { toggle(d); redraw(d); });	// Add click handler
		
			nodeEnter.append("circle")									// Add circle
				.attr("r",1e-6)											// Set size
				.style("stroke","#999")									// Edge
				.style("cursor", function(d) { return d._children ? "pointer" : "auto"; })	// Set cursor based on children
				.style("fill", function(d) { return d._children ? "#"+options.nCol : "#fff"; });	// Set color based on children
		
			nodeEnter.append("text")									// Add label
				.style("font-family","sans-serif")						// San serif
				.attr("x", function(d) { var dx=options.lSize/1.5; return d.children || d._children ? -dx : dx; })	// Position based on children
				.attr("dy",".3em")
				.attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; }) // Set anchor based on children
				.text(function(d) { return d.name; })					// Set name
				.style("fill-opacity", 1e-6)							// Transparent
				.style("fill",options.lCol)								// Color
				.style("font-size",options.lSize)						// Size
				.style(unselectable);									// Unselectable
		
			var nodeUpdate=node.transition()	  						// Transition nodes to their new position
				.duration(options.trans)								// Set time
				.attr("transform", function(d) { return "translate("+d.y+","+d.x+")"; });	// Move
		
			nodeUpdate.select("circle")									// Update circle
				.attr("r",options.lSize/2.67)							// Set size
				.style("fill", function(d) { return d._children ? "#"+options.nCol : "#fff"; });	// Set color based on children
		
			nodeUpdate.select("text")									// Update label
				.style("fill-opacity",1);								// Full alpha
		
			var nodeExit=node.exit().transition()	  					// Transition exiting nodes to the parent's new position.
				.duration(options.trans)								// Set time
				.attr("transform", function(d) { return "translate("+d.parent.y+","+d.parent.x+")"; })	// Move to 1st dot
				.remove();												// Remove
		
			nodeExit.select("circle")									// On circle exit
				.attr("r",1e-6);										// Make really small
		
			nodeExit.select("text")										// On text exit
		      .style("fill-opacity",1e-6);								// Make really transparent
		
			var link=svg.selectAll("path")	  							// Update the links
				.data(tree.links(nodes), function(d) { return d.target.id; });	// Set data
		
			link.enter().insert("path","g")	  							// Enter any new links at the parent's previous position
				.style("fill","none")									// No fule
				.style("stroke", function(d, i) {						// Edge col
					if (d.target.style && styles[d.target.style] && styles[d.target.style].eCol)	// If a style spec'd
						return styles[d.target.style].eCol;				// Get col from data
					else												// Default
						return "#"+options.eCol;						// Set wid
						})									
				.style("stroke-width", function(d, i) {					// Edge width
					if (d.target.style && styles[d.target.style] && styles[d.target.style].eWid)	// If a style spec'd
						return styles[d.target.style].eWid;				// Get col from options
					else												// Default
						return options.eWid;							// Set wid
					})									
				.attr("d", function(d) {								// Set path data
					var o={ x:d.source.x,y:d.source.y };				// dataSet dot											
			        return diagonal({source:o, target:o});				// Create diagonal
					})
			link.transition()	  										// Transition links to their new position
				.duration(options.trans)								// Set time
				.attr("d", diagonal);
		
		 	link.exit().transition()	  								// Transition exiting nodes to the parent's new position
				.duration(options.trans)								// Set time
				.attr("d", function(d) {								// Set path data
		       		var o={ x:d.source.x, y:d.source.y };				// Set dot
		       	 	return diagonal({source:o, target:o});				// Set diagonal
		     		})
				.remove();
		
			nodes.forEach(function(d) {	  								// Stash the old positions for transition
				d.x0=d.x;												// Save x
				d.y0=d.y;												// Y
				});
				
			function toggle(d) {										// CLICK HANDLER
				if (d.children) {										// If it has children
					d._children=d.children;								// Save old children
					d.children=null;									// Clear current children
		  			} 
		  		else{													// If no children
					d.children=d._children;								// Restore old children
					d._children=null;									// Clear saved children
				  	}
				}
			}															// End Tree

		// BUBBLE /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		
		
		else if (options.chartType == "Bubble") {						// Bubble graph
  		    colors=d3.scale.category20c();								// Set colors
			var dia=Math.min(opHeight,opWidth)-8;			// Diameter
		  	if (options.style == "Packed") {							// If packed
				var pack=d3.layout.pack()								// Create layout
				    .size([dia,dia])									// Set size
				    .value(function(d) { return d.val ? d.val : 1 });	// Set value to use

				node=svg.datum(dataSet).selectAll(".node")				// Add nodes
				    .data(pack.nodes)									// Set data
				    .enter()											// Add
				    .append("g")										// Add element
	 		     	.attr("transform", function(d) { return "translate("+d.x+","+d.y+")"; });	// Position
				
				node.append("title").text(function(d) { 				// Set tool tip
	     			var str=d.name;										// Add name
	     			if (!d.children && d.val)							// If children and a value
	     				str+=": "+d.val;								// Show it
	     			return str });
				
				node.append("circle")									// Add circle
			      	.attr("r", function(d) {  return d.r; })			// Set diameter
				    .style("stroke","#"+options.gCol)					// Edge
	     			.style("fill", function(d) { return  d.children ? "#"+options.gCol : "#"+options.nCol; })
	 	  			.style("fill-opacity", function(d) { return  d.children ? .15 : 1})
					.style("cursor", function(d) { return d.info ? "pointer" : "auto"; })	// Set cursor presence of info
					.on("click",AddPopup)								// Click on node

				node.filter(function(d) { return !d.children; })		// Filter
					.append("text")
			      	.attr("dy",".3em")									// Shift
					.attr("font-family","sans-serif")					// Sans
					.attr("text-anchor", "middle")						// Centered
					.attr("font-size",options.lSize+"px")				// Size
					.attr("fill","#"+options.lCol)						// Color
			      	.style("text-anchor","middle")						// Center
			      	.style(unselectable)								// Unselectable
			      	.text(function(d) { return d.name.substring(0,d.r/3); });	// Set text
					}
		  	else{														// Not packed
				function classes(root) {								// Returns a flattened hierarchy 
					var classes=[];
					
					function recurse(name, node) {
				    	if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
				    	else classes.push({packageName: name, className: node.name, value: node.val});
				  		}
				  	
				  	recurse(null, root);
				  	return {children: classes};
					}
	
				var bubble=d3.layout.pack()								// Create layout
					.size([dia,dia])									// Set size
		    		.padding(options.padding);							// Padding
			  	
				if (options.style != "Spiral")							// If not a spiral
			  		bubble.sort(null)									// Don't sort
			  	
			  	var node=svg.selectAll("node")							// Select the nodes
					.data(bubble.nodes(classes(dataSet))				// Set data							
					.filter(function(d) { return !d.children; }))		// Filter by children
			   
			    node.enter().append("g")								// Add node
			      .attr("transform",function(d) { return "translate("+d.x+","+d.y+")"; });	// Position
			  	
			  	node.append("title")									// Set tool tip
			      .text(function(d) { return d.className + ": " + d.value; });	// Value
				
				node.append("circle")									// Add circle
			      	.attr("r", function(d) { return d.r; })				// Set diameter
			      	.style("fill", function(d) { return colors(d.packageName); });	// Set color
		
		 		node.append("text")										// Add text
			      	.attr("dy",".3em")									// Shift
					.attr("font-family","sans-serif")					// Sans
					.attr("text-anchor", "middle")						// Centered
					.attr("font-size",options.lSize+"px")				// Size
					.attr("fill","#"+options.lCol)						// Color
			      	.style("text-anchor","middle")						// Center
			      	.style(unselectable)								// Unselectable
			      	.text(function(d) { return d.className.substring(0,d.r/3); });
						
			d3.select(self.frameElement).style("height",dia+"px");
			}
		}															// End bubble
	
		// STREAM /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		else if (options.chartType == "Stream") {						// Stream graph
			canPan=false;												// No pan/zoom
			var colorRange=["#B30000", "#E34A33", "#FC8D59", "#FDBB84", "#FDD49E", "#FEF0D9"];
			if (options.sCol != "none") {								// Using a specified color set
				colorRange=[];
				var v=options.sCol.split(",");
				for (i=0;i<v.length;++i)	colorRange.push("#"+v[i]);
				}
			var colorSet=d3.scale.ordinal().range(colorRange);			// Scale colorset
			var x=d3.time.scale().range([0,opWidth]);				// Scale x
			var y=d3.scale.linear().range([opHeight-options.lSize-10,options.lSize*1+10]);	// Scale y
						
			var timeBar=d3.select(con)									// Add start/end date bar
		        .append("div")											// Add div
		        .style("position","absolute")							// Setup
		        .style("top",(opHeight-options.lSize-6)+"px").style("left","0px") // Pos
		    	.style("font-size",options.lSize+"px").style("color","#"+options.lCol).style("font-family","sans-serif")
				.html("<span id='startDate'></span><span id='endDate' style='position:absolute;left:"+(opWidth-200)+"px;width:200px;text-align:right'></span>")
			
			var dataBar=d3.select(con)									// Add vertical data bar
		        .append("div")											// Add div
		        .style("position","absolute")							// Setup
		        .style("width","2px").style("height",opHeight-options.lSize*2-20+"px")			// Size
		        .style("pointer-events","none")							// No mouse hits
		        .style("top",(options.lSize-0+10)+"px").style("left","0px").style("background","#fff")  // Pos
		    	.style("font-size",options.lSize+"px").style("color","#"+options.lCol).style("font-family","sans-serif")
				.html("<div id='vdat' style='background-color:#"+options.backCol+";position:absolute;left:-100px;top:"+(-options.lSize-6)+"px;width:200px;text-align:center'></div><div id='vnow' style='background-color:#"+options.backCol+";position:absolute;left:-100px;top:"+(opHeight-options.lSize*2-16)+"px;width:200px;text-align:center'></div>")		
						
			var stack=d3.layout.stack()									// Create layout
					.offset("silhouette")								// Center the stream
			    	.values(function(d) { return d.values; })			// Get values
			   	 	.x(function(d) { return d.date; })					// Plot date on x axis
			    	.y(function(d) { return d.value; });				// Vaalue on y
			
			if (options.style == "Full")	stack.offset("expand")		// Full varient
			if (options.style == "Stacked")	stack.offset("zero")		// Stacked varient
						
			var nest=d3.nest().key(function(d) { return d.key; });		// Nest on keys
			var layers=stack(nest.entries(dataSet));					// Create layers
				
			var area=d3.svg.area()										// Create stream
			    .interpolate("cardinal")								// Use cardinal spline
			    .x(function(d) { return x(d.date); })					// Plot date on x axis
			    .y0(function(d) { return y(d.y0); })					// Plot y0 
			    .y1(function(d) { return y(d.y0+d.y); });				// Plot y1
			  
			x.domain(d3.extent(dataSet, function(d) { return d.date; }));	
		 	y.domain([0,d3.max(dataSet, function(d) { return d.y0+d.y; })]);	
		
			if (options.area == "Flat")	area.interpolate("linear")		// Linear varient
			if (options.area == "Stepped")	area.interpolate("step")	// Stepped varient
		
				svg.selectAll(".layer")									// Add layers
			      		.data(layers)									// Set data
		    			.enter().append("path")							// Add path
				      	.attr("class","layer")							// Set class
			      		.attr("d", function(d) { return area(d.values); })		// Set position
			      		.style("fill", function(d, i) { return colorSet(i); });	// Set color
			
				 svg.selectAll(".layer")								// Point at layers
						.attr("opacity",1)								//  Assunme fully opaque if mouse is out
						.on("mouseover", function(d,i) {				// On mouse over
				      		svg.selectAll(".layer")						// Point at layers
	      		     		.transition().duration(250)					// Quick transition
				     	 	.attr("opacity", function(d,j) {			// Set opacity
				        		return j != i ? 0.6 : 1;				// If over, set to 1, else .6
				    		})
				   	 	})
		
				.on("mousemove", function(d, i) {						// When hovering over layer
						var k,o,datearray=[];
						var date=x.invert(d3.mouse(this)[0]);			// Get date from x pos
				      	var now=date.getFullYear()*3650+date.getMonth()*300+date.getDate();	// Unique now
				      	var selected=(d.values);						// Selected layer						
				      	for (var k=0;k<selected.length;k++) { 			// For each data point
				        	o=selected[k].date;							// Get date
				        	datearray[k]=o.getFullYear()*3650+o.getMonth()*300+o.getDate();	// Make unique id
				        	}
					   	k=datearray.indexOf(now);						// Data item over
						d3.select(this).attr("stroke","#000").attr("stroke-width","0.5px")			// Show border
			        	dataBar.style("left",d3.mouse(this)[0]+"px");	// Position data bar
			      		$("#vnow").text(shivaLib.FormatDate(date,options.dateFormat))
			      		$("#vdat").text(d.key+": "+d.values[k].value)	// Show value
			      		dataBar.style("visibility","visible");			// Show data bar
			    		})

			    .on("mouseout", function(d, i) {						// Stop hovering on layer
			     		svg.selectAll(".layer")							// Get all layers
			      			.transition().duration(250)					// Quick transition
			      			.attr("opacity","1");						// Make layer opaque
			      		d3.select(this).attr("stroke-width","0px");		// Add border	
			      		dataBar.style("visibility","hidden");			// Hide data bar
			  			})
			    
			$("#startDate").text(shivaLib.FormatDate(x.invert(0),options.dateFormat));				// Set start date
			$("#endDate").text(shivaLib.FormatDate(x.invert(opWidth),options.dateFormat));	// Set end date
			}															// End Stream
	
		// PARALLEL /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		else if (options.chartType == "Parallel") {						// Parallel coords
	    	var y={};
		    var dragging={};
			canPan=false;												// No pan/zoom
			var x=d3.scale.ordinal().rangePoints([0,opWidth],1);	// X scale
			var line=d3.svg.line();										// Lines
			var axis=d3.svg.axis().orient("left").ticks(4).outerTickSize(0); // Axes

			
			svg.attr("height",opHeight-options.lSize*2+"px");
		   	svg.attr("transform", "translate(0,"+options.lSize*3+")");// Move
		   	
		  	x.domain(dimensions=d3.keys(dataSet[0]).filter(function(d) {		// Extract the list of dimensions and create a scale for each.
		  	  	return d != "name" && (y[d]=d3.scale.linear()					// If not a name, scale data point
		        	.domain(d3.extent(dataSet, function(p) { return +p[d]; }))	// Link to domain
		        	.range([opHeight-options.lSize*4,0]));								// Set range
		 	 	}));	
	

			function position(d) {										// GET POSITION
				var v=dragging[d];										// Dragging
			  	return v == null ? x(d) : v;							// Return pos based on in dragging or not
				}
			
			function path(d) {											// GET PATH
		  		return line(dimensions.map(function(p) { return [position(p), y[p](d[p])]; }));
				}
			
			function brush() {											// Handles a brush event, toggling the display of highlight lines.
			  	var actives=dimensions.filter(function(p) { return !y[p].brush.empty(); });
			 	var extents=actives.map(function(p) { return y[p].brush.extent(); });
			 	highlight.style("display", function(d) {
				  		return actives.every(function(p, i) {
							return extents[i][0] <= d[p] && d[p] <= extents[i][1];
				    		}) ? null : "none";
					  });
				}
	
   		   var background=svg.append("g")  								// Draw lines in grey
		   		.selectAll("path")										// All paths
		      	.data(dataSet)											// Set data
		    	.enter().append("path")									// Add path
		      	.attr("d",path)											// Set path data using path()
				.attr("fill","none")									// Lines
				.attr("stroke","#"+options.iCol)						// Inactive color
 				.attr("stroke-opacity",.4)								// Opacity
 	
		   var highlight=svg.append("g")  								// Draw lines in highlight color
		   		.selectAll("path")										// All paths
		      	.data(dataSet)											// Set data
		    	.enter().append("path")									// Add path
		      	.attr("d", path)										// Set path data
				.attr("fill","none")									// Lines
 				.attr("stroke","#"+options.eCol)						// Highlight color
 				.attr("stroke-width",options.eWid)						// Highlight color
				.attr("stroke-opacity",.7)								// Opacity
 
  			background.append("title").text(function(d) { return d.name })	// Tooltip
			highlight.append("title").text(function(d) { return d.name })	// Tooltip
 		 	var g=svg.selectAll(".dimension")  							// Add a dimension group for each dataset
      			.data(dimensions)										// Get dataset names
    			.enter().append("g")									// Add group
		      	.attr("transform", function(d) { return "translate("+x(d)+")"; })	// Position
		      	.call(d3.behavior.drag()								// Create new drag behavior
		        .on("dragstart", function(d) {							// On drag start
		          	dragging[d]=this.__origin__=x(d);					// Set associatie array by name and set origin to xpos of axis
		          	background.attr("visibility", "hidden");			// Hide grey lines
		       		})
   		        .on("drag", function(d) {								// On drag
		          	dragging[d]=Math.min(w,Math.max(0,this.__origin__+=d3.event.dx));	// New xpos
		         	highlight.attr("d",path);											// Set lines
		          	dimensions.sort(function(a,b) { return position(a)-position(b); });	// Sort by position
		          	x.domain(dimensions);
		         	g.attr("transform", function(d) { return "translate("+position(d)+")"; })	
		        	})
		        .on("dragend", function(d) {							// On drag end
		          	delete this.__origin__;								// Remove origin
		          	delete dragging[d];									// Remove from dragging[]
		          	transition(d3.select(this)).attr("transform","translate("+x(d)+")");	// Transition to new position
		          	transition(highlight)								// Reshow highlighted lines
		              	.attr("d",path);								// Move them to new place
		         	background.attr("d",path)							// Set pos of grey lines
		              	.transition().delay(500).duration(0)			// Wait 1/2 sec
		             	.attr("visibility","visible");					// Show grey lines
		        	})
		        );
		 
			 g.append("g")  											// Add an axis and title.
				.style("font-family","sans-serif")						// Sans
				.style("font-size","10px")								// Size
				.attr("fill","#999")									// Text color
 				.style(unselectable)									// Unselectable
				.each(function(d) { d3.select(this).call(axis.scale(y[d])); })
			    .append("text")											// Add axis title
 				.style("font-size",options.lSize+"px")					// Size
				.attr("stroke","none")									// No fill
				.attr("stroke-width",0)									// No fill
				.attr("text-anchor","middle")							// Centered
				.attr("fill","#"+options.lCol)							// Text color
				.attr("y",-options.lSize)								// Position
				.attr("font-weight","bold")								// Bold
				.text(String);
	
		    g.selectAll("path")											// Select the paths
				.attr("fill","none")									// No fill
				.attr("stroke","#999")									// Set loine color
 
 		    g.selectAll(".tick")										// Select the ticks
				.each(function(d,i) {									// For each tick
					 if (!this.transform.baseVal.getItem(0).matrix.f)	// If top-most
					 	this.style['opacity']=0;						// Hide it
					})
		
			g.append("g")		  										// Add and store a brush for each axis.
				.each(function(d) { d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brush", brush)); })
		    	.selectAll("rect")										// Select the rect
		      	.attr("x",-8)											// Position left of line
		      	.attr("width",16)										// Set width
				.attr("fill-opacity",.3)								// Set opacity
 	
			function transition(g) {									// TRANSITION
			  return g.transition().duration(500);						// Wait 1/2 sec
				}

			}															// End Parallel

		// CHORD /////////////////////////////////////////////////////////////////////////////////////////////////////////////////		

		else if (options.chartType == "Chord") {						// Chord graph
			canPan=false;												// No pan/zoom
			opHeight=opWidth;								// Got to be square
			var outerRadius=opWidth/2;							// Radius
			var innerRadius=outerRadius-options.padding;				// Real chart area
	
			var cols=[];												// Holds chart colors
			if (options.sCol != "none") {								// Using a specified color set
				var v=options.sCol.split(",");							// Get from optiona
				for (i=0;i<v.length;++i)	cols.push("#"+v[i]);		// Add to array
				}
			else{
		 		var c=d3.scale.category20c();							// Default colors
		 		for (i=0;i<20;++i)	cols.push(c(i));					// Add to array
		 		}
			var clen=cols.length-1;										// Wrap factor
	
			function fade(opacity, src) {								// FADE IN/OUT GROUPING
	 			 svg.selectAll(".chord")								// Get all chords
					.filter(function(d,i) { return d.source.index != src && d.target.index != src; })	// If not current
					.transition()										// Transition
			 		.style("opacity", opacity);							// Fade
				}
			
			var chord=d3.layout.chord()									// Set layout
			    .padding(.04)											// Set padding
			    .sortSubgroups(d3.descending)							// Sort bands by subgroups
			    .sortChords(d3.descending);								// Sort chords
			
			var arc=d3.svg.arc()										// Outer band
			    .innerRadius(innerRadius)								// Inner radius
			    .outerRadius((innerRadius+options.bandWidth*1));		// Outer radius
	
		 	svg.attr("transform", "translate("+outerRadius+","+outerRadius+")"); // Position
		  
			var indexByName=d3.map();									// Maps names to index
			var nameByIndex=d3.map();									// Maps index to names
		   	var	matrix=[];												// Correspondence matrix
		
			dataSet.nodes.forEach(function(d,i) {  						// Compute name maps
				nameByIndex.set(i,d.name);								// Add it to map
		 		indexByName.set(d.name,i);								// Add it to inverse map
				});
				
			dataSet.nodes.forEach(function(d) {							// For each node
				var row=[];												// Make new row
				for (i=0;i<dataSet.nodes.length;++i) row[i]=0;			// Add row elements
				matrix.push(row);										// Add row
				});
		
			dataSet.edges.forEach(function(d,i) { 						// For each edge
		    	matrix[d.source][d.target]++;							// Add to count of connections			
		    	matrix[d.target][d.source]++;							// And back			
				});
				
				chord.matrix(matrix);										// Set correspondence matrix
		
			var g=svg.selectAll(".group")								// Add outer groupings
	      		.data(chord.groups)										// For each node
	    		.enter().append("g")									// Add group
	      		.attr("class","group");									// Call it a 'group'
	
		  	g.append("path")											// Add grouping arc
		      	.style("fill",   function(d) { return cols[d.index%clen]; })	// Set fill color
		      	.style("stroke", function(d) { return cols[d.index%clen]; })	// Set edge color
		      	.attr("d",arc)											// Draw grouping
	   			.on("mouseover",function(d,i) { fade(.15,i);} )			// Fade down
	  			.on("mouseout", function() { fade(.67,i);} );				// Fade up
	    
		  	g.append("text")											// Add node label						
		  		.each(function(d) { d.angle=(d.startAngle+d.endAngle)/2; })	// Angle
		     	.attr("dy",".35em")										// Y offset
		     	.style("font-family","sans-serif")						// Sans
		     	.style("font-size",options.lSize+"px")					// Size
		    	.style("fill","#"+options.lCol)							// Color
		      	.attr("transform", function(d) {						// Position
		       		 return "rotate("+(d.angle*180/Math.PI-90)+")"		// Rotate
		            	+"translate("+(innerRadius*1+options.bandWidth*1+6)+")"	// Position
		            	+(d.angle > Math.PI ? "rotate(180)" : "");		// Flip if over 180 degrees
		     		 })
		      	.style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })	// Flip anchor is > 180 degrees
		      	.text(function(d) { return nameByIndex.get(d.index); });
	
			svg.selectAll(".chord")										// Add chords
				.data(chord.chords)										// For each chord
			    .enter().append("path")									// Add a path
			    .attr("class","chord")									// Call it a 'chord'
				.style("stroke-width",options.eWid)
				.style("opacity",.67)
			    .style("stroke", function(d) { return d3.rgb(cols[d.source.index%clen]).darker(); }) // Darker color edge 
			    .style("fill",   function(d) { return options.fill == "false" ?  "none" : cols[d.source.index%clen] })	// Set fill color
			    .attr("d", d3.svg.chord().radius(innerRadius));			// Position
	
			}															// End Chord

	firstTime=false;													// Not first time thru
	shivaLib.SendReadyMessage(true);									// Send ready msg to drupal manager
	}																	// End update


/////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////

function AddPopup(d)												// SHOW A POPUP
{
	if (!d.info)														// Nothing to show
		return;															// Quit
	var x=d3.event.clientX+8;											// Set xPos
	var y=d3.event.clientY+8;											// Y
	$("#d3Popup").css({left:x,top:y});									// Position
	$("#d3Popup").html(shivaLib.LinkToAnchor(d.info));					// Add text										
	$("#d3Popup").show();												// Show it
	$("#d3Popup").delay(shivaLib.options.popupTime*1000).fadeOut(400);	// Close after n seconds
	}

function DrawSVGShape(shape, size)									// DRAW A SHAPE
{
	var i,r,o,pts="";
	size/=2;															// Halve size
	var s2=size/2;														// Quarter
	if (shape == "square") {											// A square
		pts=-size+","+(-size)+" ";
		pts+=size+","+(-size)+" ";
		pts+=size+","+size+" ";
		pts+=-size+","+size+" ";
		return pts;														// Return points
		}
	else if (shape == "triangle") {										// A triangle
		pts="0,"+(-size)+" ";
		pts+=size+","+s2+" ";
		pts+=-size+","+s2+" ";
		return pts;														// Return points
		}
	else if (shape == "caret") {										// A caret
		pts="0,"+(-s2)+" ";
		pts+=size+","+size+" ";
		pts+="0,"+(+s2)+" ";
		pts+=-size+","+size+" ";
		return pts;														// Return points
		}
	else if (shape == "diamond") {										// A diamond
		pts="0,"+(-size*3/2)+" ";
		pts+=size+",0 ";
		pts+="0,"+(size*3/2)+" ";
		pts+=-size+",0 ";
		return pts;														// Return points
		}
	else if (shape == "plus") {											// A plus
		pts=-s2+","+(-s2*3)+" ";
		pts+=s2+","+(-s2*3)+" ";
		pts+=s2+","+(-s2)+" ";
		pts+=(s2+size)+","+(-s2)+" ";
		pts+=(s2+size)+","+(s2)+" ";
		pts+=s2+","+s2+" ";
		pts+=s2+","+(s2*3)+" ";
		pts+=-s2+","+(s2*3)+" ";
		pts+=-s2+","+s2+" ";
		pts+=-s2*3+","+s2+" ";
		pts+=-s2*3+","+(-s2)+" ";
		pts+=-(s2)+","+(-s2)+" ";
		return pts;														// Return points
	}

	var a=(2*Math.PI)/10; 
	for (i=11;i!=0;i--) {												// For each point
	    r=size*(i%2+.6);												// Radius
	    o=a*i;															// Angle
	    pts+=(r*Math.sin(o))+",";										// Get X
	    pts+=(r*Math.cos(o))+" ";										// Y
		}
	return pts;															// Return points
	}

}	
	
SHIVA_Show.prototype.GraphActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=resize") {  									// RESIZE
		if (v[1] == "100") 												// If forcing 100%
			shivaLib.opWidth=shivaLib.opHeight="100%";		// Set values
		shivaLib.DrawGraph();											// Redraw
		}
	else if (v[0] == "ShivaAct=data") {									// DATA
//		var data=$.parseJSON(v[1]);										// Convert to table format
//		shivaLib.map.setDataTable(data);								// Set data
		shivaLib.DrawGraph();											// Redraw
		}
}
                      