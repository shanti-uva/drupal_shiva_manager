///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB GRAPH
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawGraph=function() 							//	DRAW GRAPH
{
	var i,o,shape;
	var options=this.options;											// Local options
	var con="#"+this.container;											// Container
 	var w=options.width;												// Width
	var h=options.height;												// Height
	var svg=null,nodes=null,edges=null,labels=null;						// Pointers to d3 data
	var dataSet=null;													// Holds data
	var d3Scale=1;														// Scale
	
	var unselectable={"-moz-user-select":"none","-khtml-user-select":"none",	
		   			  "-webkit-user-select":"none","-ms-user-select":"none",
		   			  "user-select":"none","pointer-events":"none" }
	var styles=new Object();											// Styles


	if (options.backCol == "none")										// If  transparent
		$(con).css("background-color","transparent");					// Set background color
	else																// Normal color
		$(con).css("background-color","#"+options.backCol);				// Set background color
	$(con).width(options.width);	$(con).height(options.height);		// Set size
	$(con).html("");													// Clear div
	var colors=d3.scale.category10();									// Default colors

	function zoomed() {													// ZOOM HANDLER
 		d3Scale=d3.event.scale;											// Set current scale
 		if (d3Scale != 1)												// If zoomed
 			svg.attr("transform","translate("+d3.event.translate+") scale("+d3Scale+")");	// Set scale and translate
		else
 			svg.attr("transform","translate("+[0,0]+") scale("+d3Scale+")");	// Set scale and translate

		} 	
	var svg=d3.select(con)												// Add SVG to container div
		.append("svg")													// Add SVG shell
		.attr("width",w).attr("height",h)								// Set size
		.append("g")													// Needed for pan/zoom	
		.call(d3.behavior.zoom().scaleExtent([1,10]).center([w/2,h/2]).on("zoom",zoomed)) // Set zoom
	 		
	svg.append("rect")													// Pan and zoom rect
		.style({"fill":"none","pointer-events":"all"})					// Invisble
    	.attr("id","underLayer")										// Set id
    	.attr("width",w).attr("height",h);								// Set size

	if (options.dataSourceUrl) 											// If a spreadsheet spec'd
    	this.GetSpreadsheet(options.dataSourceUrl,false,null,function(data) {	// Get spreadsheet data
			var ids=new Object();
			dataSet={ nodes:[],edges:[]};								// Clear data
			styles={};													// Clear styles
			for (i=0;i<data.length;++i) {								// For each row
				if (!data[i][0])										// If no data
					continue;											// Skip
				if (data[i][0].match(/link-class/i)) {					// If a link-class
					if (!styles[data[i][1]])							// If new
						styles[data[i][1]]={};							// Create new style object
					if (data[i][2].match(/color/i))						// A color
						styles[data[i][1]].eCol=data[i][3];				// Set it
					if (data[i][2].match(/type/i))						// A shape
						styles[data[i][1]].shape=data[i][3];			// Set it
					if (data[i][2].match(/linewidth/i))					// A line width
						styles[data[i][1]].eWid=data[i][3];				// Set it
					if (data[i][2].match(/linecolor/i))					// A line color
						styles[data[i][1]].eCol=data[i][3];				// Set it
					if (data[i][2].match(/alpha/i))						// alpha
						styles[data[i][1]].alpha=data[i][3];			// Set it
					}
				else if (data[i][0].match(/class/i)) {					// If a class
					if (!styles[data[i][1]])							// If new
						styles[data[i][1]]={};							// Create new style object
					if (data[i][2].match(/color/i))						// A color
						styles[data[i][1]].col=data[i][3];				// Set it
					if (data[i][2].match(/type/i))						// A shape
						styles[data[i][1]].shape=data[i][3];			// Set it
					if (data[i][2].match(/linewidth/i))					// A line width
						styles[data[i][1]].eWid=data[i][3];				// Set it
					if (data[i][2].match(/linecolor/i))					// A line color
						styles[data[i][1]].eCol=data[i][3];				// Set it
					if (data[i][2].match(/alpha/i))						// alpha
						styles[data[i][1]].alpha=data[i][3];			// Set it
					if (data[i][2].match(/dim/i))						// Size
						styles[data[i][1]].size=data[i][3];				// Set it
					}
				else if (data[i][0].match(/node/i)) {					// If a node
					o={};												// New object
					o.name=data[i][2];									// Add name
					o.id=data[i][1];									// Add id
					if (data[i][3])										// If a style set
						o.style=data[i][3];								// Add style
					if (data[i][4])										// If an info set
						o.info=data[i][4];								// Add info
					ids[o.id]=dataSet.nodes.length;						// Set index
					dataSet.nodes.push(o);								// Add node to list
					}
				else if (data[i][0].match(/link/i)) {					// If a link
					o={};												// New object
					o.source=data[i][1];								// Add name
					o.target=data[i][3];								// Add id
					o.style=data[i][2];									// Add style
					dataSet.edges.push(o);								// Add node to list
					}
				}
 			for (i=0;i<dataSet.edges.length;++i) {						// For each edge
 				dataSet.edges[i].source=ids[dataSet.edges[i].source];	// Convert id to index
 				dataSet.edges[i].target=ids[dataSet.edges[i].target];	// Convert id to index
 				if (!styles[dataSet.edges[i].style])					// If not a valid style	
					dataSet.edges[i].style=null;						// Null it out				
 				}
  			redraw();													// Draw graph
			});
	else if (dataSet)													// If data
		redraw();														// Draw graph
	
	function redraw() {												// DRAW
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
				.call(force.drag);
			nodes.append("title")									// CREATE EDGE TOOLTIPS
		      	.text(function(d) { return d.info; });					// Set label
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
		else if (options.chartType == "Tree") {							// Force directed
			}
	shivaLib.SendReadyMessage(true);									// Send ready msg to drupal manager
}


/////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////

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
                      