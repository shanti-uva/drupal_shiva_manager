///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB GRAPH
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawGraph=function() 							//	DRAW GRAPH
{
	var i,o,shape,id=0;
	var options=this.options;											// Local options
	var con="#"+this.container;											// Container
 	var w=options.width;												// Width
	var h=options.height;												// Height
	var svg=null,nodes=null,edges=null,labels=null;						// Pointers to d3 data
	var dataSet=null;													// Holds data
	var d3Zoom;															// Scale/zoom
	var margins=[0,0,0,0];												// Default margins
	var firstTime=true;
		
	var unselectable={"-moz-user-select":"none","-khtml-user-select":"none",	
		   			  "-webkit-user-select":"none","-ms-user-select":"none",
		   			  "user-select":"none","pointer-events":"none" }
	
	if (!$("d3Popup").length)											// If not popup div yet
		$("body").append("<div id='d3Popup' class='rounded-corners' style='display:none;position:absolute;border:1px solid #999;background-color:#eee;padding:8px'></div>");
	
	var styles=new Object();											// Styles

	if (options.backCol == "none")										// If  transparent
		$(con).css("background-color","transparent");					// Set background color
	else																// Normal color
		$(con).css("background-color","#"+options.backCol);				// Set background color
	$(con).width(options.width);	$(con).height(options.height);		// Set size
	$(con).html("");													// Clear div
	var colors=d3.scale.category10();									// Default colors

	function zoomed() {													// ZOOM HANDLER
 		var t;
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

	svg=d3.select(con)													// Add SVG to container div
		.append("svg")													// Add SVG shell
		.attr("width",w-margins[0]-margins[2]).attr("height",h-margins[1]-margins[3])	// Set size
		.call(d3Zoom=d3.behavior.zoom().scaleExtent([.1,10]).on("zoom",zoomed)) // Set zoom
		.append("g")													// Needed for pan/zoom	
		
	svg.append("rect")													// Pan and zoom rect
		.style({"fill":"none","pointer-events":"all"})					// Invisble
    	.attr("id","underLayer")										// Set id
    	.attr("width",w).attr("height",h)								// Set size
    	.on("click",function(){ $("#d3Popup").hide(); });				// Hide any open popups				

	if (options.chartType == "Network") {								// Force directed
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
		if (options.dataSourceUrl) {									// If a spreadsheet spec'd
  			this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
			var items=new Array();										// Holds items
			for (i=0;i<data.length;++i) {								// For each row
				if (!data[i][0])										// If no data
					continue;											// Skip
			 	if (!data[i][0].match(/node/i)) 						// If not a node
					continue;											// Skip
				o={};													// New object
				o.name=data[i][2];										// Add name
				o.parent=data[i][1];									// Add parent
				if (data[i][3])											// If an info set
					o.val=data[i][3];									// Add val
				else													// If nothing there
					o.val=1;											// Put 1 in
				if (data[i][4])											// If an info set
					o.info=data[i][4];									// Add info
				items.push(o);											// Add to array
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
						return options.eCol;							// Set wid
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
							return options.nCol;						// Set color
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
				.on("click",AddPopup)									// Click on node
				.call(force.drag);
			nodes.append("title")									// CREATE EDGE TOOLTIPS
		      	.text(function(d) { 
					var str=d.info;										// Copy info
					if (d.info.match(/http/)) {							// If an embedded url
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
				.style("stroke",options.eCol)							// Color
				.style("stroke-width",options.eWid)						// Width
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
			var dia=Math.min(options.height,options.width)-8;			// Diameter
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
	
				function classes(root) {								// Returns a flattened hierarchy 
					var classes=[];
					
					function recurse(name, node) {
				    	if (node.children) node.children.forEach(function(child) { recurse(node.name, child); });
				    	else classes.push({packageName: name, className: node.name, value: node.val});
				  		}
				  	
				  	recurse(null, root);
				  	return {children: classes};
					}
					
			d3.select(self.frameElement).style("height",dia+"px");
			}															// End bubble
		
		firstTime=false;												// Not first time thru
		}																// End update
	shivaLib.SendReadyMessage(true);									// Send ready msg to drupal manager
}




/////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////

function AddPopup(d)												// SHOW A POPUP
{
	var x=d3.event.clientX+8;											// Set xPos
	var y=d3.event.clientY+8;											// Y
	$("#d3Popup").css({left:x,top:y});									// Position
	$("#d3Popup").html(shivaLib.LinkToAnchor(d.info));					// Add text										
	$("#d3Popup").show();												// Show it
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
			shivaLib.options.width=shivaLib.options.height="100%";		// Set values
		shivaLib.DrawGraph();											// Redraw
		}
	else if (v[0] == "ShivaAct=data") {									// DATA
//		var data=$.parseJSON(v[1]);										// Convert to table format
//		shivaLib.map.setDataTable(data);								// Set data
		shivaLib.DrawGraph();											// Redraw
		}
}
                      