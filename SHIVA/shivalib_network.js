///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB NETWORK
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawNetwork=function() 											//	DRAW NETWORK
{
	if (!this.jit)
		this.jit=new VIZ(this.container);
	this.jit.Draw(this.options);
}

function VIZ(container) 
{
	this.chartType = "rgraph";
	this.container = container; 
	this.config = new Object();	
	this.data = new Array();
	this.Config = {
		rgraph:	{
			background: { CanvasStyles: {}	},
			Navigation: { enable: true, panning: true },
			Node: 		{ CanvasStyles:{} },		
			Edge: 		{ overridable: true, CanvasStyles: {} },
			Label: 		{ overridable: true, type: 'HTML'	},
			Tips: 		{ enable: true },
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true },
			CanvasStyles: {	}
			},
		forcedir: {
			iterations: 200,
			background: { CanvasStyles: {}, numberOfCircles: 0 },
			Navigation: { enable: true,	panning: 'avoid nodes' },
			Node: 		{ CanvasStyles: {} },		
			Edge: 		{ overridable: true, CanvasStyles: {} },
			Label: 		{ overridable: true, type: 'HTML' },
			Tips: 		{ enable: true	},
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true },
			CanvasStyles: {}
			},
		hypertree: {
			background: { CanvasStyles: {}, numberOfCircles: 0 },
			Navigation: { enable: true, panning: true },		
			Node: 		{ CanvasStyles: {}, transform: false },
			Edge: 		{ overridable: true, CanvasStyles: {} },
			Label: 		{ overridable: true, type: 'HTML'	},
			Tips:		{ enable: true	},
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true	},
			CanvasStyles: {}
			}	
	}
}

SHIVA_Show.prototype.NetworkActions=function(msg)								// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");															// Split msg into parts
	if (v[0] == "ShivaAct=resize") {  												// RESIZE
		if (v[1] == "100") 															// If forcing 100%
			shivaLib.options.width=shivaLib.options.height="100%";					// Set values
		shivaLib.DrawNetwork();														// Redraw
	}
}

VIZ.prototype.Draw=function(json) 
{
	var k,key,val;
	this.chartType=json.chartType;		
	for (key in json) {
		val=json[key];
		if (key.match(/_(fillStyle|strokeStyle|color)/)) 	// It would be nice to inspect props here ...
			val = '#' + val;
		if (val == "true") 																
			val=true;
		else if (val == 'false') 													
			val=false;
		
		k=key.split("_"); // Split key name into its implicit parts (hopefully none has more than 3)
		if (k.length == 2) 				
			this.Config[this.chartType][k[0]][k[1]] = val;
		else if (k.length == 3)
			this.Config[this.chartType][k[0]][k[1]][k[2]] = val;
		else
			this.Config[this.chartType][key] = val;
		
		}
	shivaLib.GetSpreadsheet(json.dataSourceUrl,false,null,$.proxy(this.Spreadsheet2Jit,this));
	this.config=this.Config[this.chartType]; 
	$("#"+this.container).height(this.config.height);
	$("#"+this.container).width(this.config.width);
	$jit.id(this.container).style.backgroundColor=this.config.background.CanvasStyles.fillStyle;
}

VIZ.prototype.Spreadsheet2Jit=function(data)
{	
	var i,j,v,n;
	var ROWS=[];
	var numCols=0;
	var numRows=data.length;									// Number of rows
	for (i=0;i<numRows;i++) {									// For each row
		ROWS[i]=[];												// Init sub-array
		n=data[i].length;										// Get row length
		numCols=Math.max(numCols,n);							// Expand to longest
		for (j=0;j<n;j++) {										// For each col
			v=data[i][j];										// Get value
			if (isNaN(v)) 										// If not a number
				 v=v.replace(/(^\s+|\s+$)/g,"");				// Remove padding (crucial!)
			ROWS[i][j]=v;										// Set in array of arrays
			}
	}
	// Grab the classes for interpolating into the JIT json
	// This allows overriding node and link properties from within the spreadsheet!
	var CLASSES = {node: {}, link: {}};
	for (var i = 0; i < numRows; i++) {				
		var rType = ROWS[i][0];
		if (!rType.match(/-class/)) continue;
		var c = ROWS[i][1];			// Class
		var k = ROWS[i][2];			// Property (Key)
		var v = ROWS[i][3]; 		// Value
		if (rType.match(/node-class/)) {
			if (CLASSES.node[c] == undefined) CLASSES.node[c] = {};
			CLASSES.node[c][k] = v;
		} else if (rType.match(/link-class/)) {
			if (CLASSES.link[c] == undefined) CLASSES.link[c] = {};
			CLASSES.link[c][k] = v;
		}
	}
		
	var JIT = {};		
	for (var i = 0; i < numRows; i++) {
		var rType 	= ROWS[i][0];  
		if (rType.match(/-class/)) continue;	
		var nodeID 	= ROWS[i][1];
		
		if (JIT[nodeID] == undefined) {
			JIT[nodeID] 						= {};
			JIT[nodeID].id					= nodeID;
			JIT[nodeID].data 				= {}; // For properties
			JIT[nodeID].adjacencies = []; // For links (note: tree viz types want 'children' here)
		}
		
		if (rType.match(/^\s*node\s*$/)) {
			
			if (ROWS[i][2] && !ROWS[i][2].match(/^\s*$/)) {
				JIT[nodeID].name 	= ROWS[i][2]; 		
			} else {
				JIT[nodeID].name 	= nodeID; 
			}
			
			var nodeClass = ROWS[i][3];
			JIT[nodeID].data.className = nodeClass;
			for (var k in CLASSES.node[nodeClass]) {
				JIT[nodeID].data['$' + k] = CLASSES.node[nodeClass][k];
			}

			if (numCols > 4) {
				JIT[nodeID].data.tip = ROWS[i][4]; 	
			}
			
		} else if (rType.match(/^\s*link\s*$/)) {
			var linkClass = ROWS[i][2];
			var nodeTo 		= ROWS[i][3];
			var linkObject = {'nodeTo': nodeTo, 'data': {'class': linkClass}};
			for (var k in CLASSES.link[linkClass]) {
				linkObject.data['$' + k] = CLASSES.link[linkClass][k];
			}
			JIT[nodeID].adjacencies.push(linkObject);  
		}
		
	}		
	shivaLib.SendReadyMessage(true);					// Send ready msg to drupal manager
	this.data = [];															// Clear data array
	for (var x in JIT) this.data.push(JIT[x]);	// Turn into array
		$jit.id(this.container).innerHTML = ''; 	// Empty div										
	this.Init[this.chartType](this); 						// Draw it			
}

VIZ.prototype.Init = {
	rgraph:	function (obj) {
		var data 		= obj.data;
		var config 	= obj.Config[obj.chartType];
		var div 		= obj.container;
		config.injectInto = div;							// Canvas level params set at run time

		var divElement = document.getElementById(div);
		config.width = divElement.offsetWidth; // - 50;
		config.height = divElement.offsetHeight; // - 50;
		            
		config.onCreateLabel = function(domElement, node) {
			domElement.className = 'shiva-node-label';
			domElement.innerHTML = node.name;
			domElement.onclick = function(){
				shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);				
				rgraph.onClick(node.id,{});
			};
			var style = domElement.style;
			style.fontSize 		= config.Label.size + 'px';
			style.color 		= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			style.cursor = 'crosshair';	
			style.display = '';

		};
		
		config.onPlaceLabel = function(domElement, node) { };
		
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			if (node.data.tip) {
				tip.innerHTML = "<div class='tip-title'>" + node.data.tip + "</div>";
			} else {
				tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.className + "</b> with " + count + " connections.</div>";
			}
			tip.style.color = 'black';
			tip.style.fontFamily = config.Label.family;
			tip.style.backgroundColor = 'white';
			tip.style.padding = '1em';
			tip.style.maxWidth = '200px';
			tip.style.fontSize = '10pt';
			tip.style.border = '1px solid black';
			tip.style.opacity = '0.99';
			tip.style.boxShadow = '#555 2px 2px 8px';
		};
		 		
		var rgraph = new $jit.RGraph(config);		

		rgraph.loadJSON(data);
		
		rgraph.graph.eachNode(function(n) {
			var pos = n.getPos();
			pos.setc(-200, -200);
		});
		
		rgraph.compute('end');
		
		rgraph.fx.animate({
			modes:['polar'],
			duration: 2000
		});
		
		var canvasConfig = rgraph.canvas.getConfig();	
	},
	forcedir: function (obj) {
		var jsonData 		= obj.data;
		var config			= obj.Config[obj.chartType];
		var div 			= obj.container;
		config.injectInto = div; 
	
		config.onCreateLabel = function(domElement, node){
			var style = domElement.style;
			domElement.className = 'shiva-node-label';
			style.fontSize 		= config.Label.size + 'px';
			style.color 		= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			style.cursor = 'crosshair';
			domElement.innerHTML = node.name;
			var left = parseInt(style.left);
			var top = parseInt(style.top);
			var w = domElement.offsetWidth;
			style.left = (left - w / 2) + 'px';
			style.top = (top + 10) + 'px';
			style.display = '';
			domElement.onclick = function(){
				shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);				
			};
		};

		config.onPlaceLabel = function(domElement, node) { };
		
		config.onMouseEnter = function() {
			fd.canvas.getElement().style.cursor = 'move';
		};
		config.onMouseLeave = function() {
			fd.canvas.getElement().style.cursor = '';
		};
		config.onDragMove = function(node, eventInfo, e) {
			var pos = eventInfo.getPos();
			node.pos.setc(pos.x, pos.y);
			fd.plot();
		};
		config.onTouchMove = function(node, eventInfo, e) {
			$jit.util.event.stop(e); //stop default touchmove event
			this.onDragMove(node, eventInfo, e);
		};
		
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			if (node.data.tip) {
				tip.innerHTML = "<div class='tip-title'>" + node.data.tip + "</div>";
			} else {
				tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.className + "</b> with " + count + " connections.</div>";
			}
			tip.style.color = 'black';
			tip.style.fontFamily = config.Label.family;
			tip.style.backgroundColor = 'white';
			tip.style.padding = '1em';
			tip.style.maxWidth = '200px';
			tip.style.fontSize = '10pt';
			tip.style.border = '1px solid black';
			tip.style.opacity = '0.99';
			tip.style.boxShadow = '#555 2px 2px 8px';
		};

		var fd = new $jit.ForceDirected(config);
		fd.loadJSON(jsonData);
		
		fd.computeIncremental({// compute positions incrementally and animate.
			iter: 40,
			property: 'end',
			onStep: function(perc){},
			onComplete: function(){
				fd.animate({
					modes: ['linear'],
					transition: $jit.Trans.Elastic.easeOut,
					duration: 2500
				});
			}
		});
	},
	hypertree: function (obj) {
		var data 		= obj.data;
		var config		= obj.Config[obj.chartType];
		var div			= obj.container;
	
		config.injectInto = div;
		
		var divElement = document.getElementById(div);
		config.width = divElement.offsetWidth; // - 50;
		config.height = divElement.offsetHeight; // - 50;
		
		config.onCreateLabel = function(domElement, node) {
			domElement.innerHTML = node.name;
			var style = domElement.style;
			domElement.className = 'shiva-node-label';
			style.fontSize 		= config.Label.size + 'px';
			style.color 			= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			style.cursor = 'crosshair';
			style.display = '';
			$jit.util.addEvent(domElement, 'click', function () {
				ht.onClick(node.id, {
					onComplete: function() {
						shivaLib.SendShivaMessage("ShivaNetwork=click",node.id);				
						ht.controller.onComplete();
					}
				});
			});
		};
		
		config.onPlaceLabel = function(domElement, node) { };
		
		config.onComplete = function() {
			return;
		}
		
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			if (node.data.tip) {
				tip.innerHTML = "<div class='tip-title'>" + node.data.tip + "</div>";
			} else {
				tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.className + "</b> with " + count + " connections.</div>";
			}
			tip.style.color = 'black';
			tip.style.fontFamily = config.Label.family;
			tip.style.backgroundColor = 'white';
			tip.style.padding = '1em';
			tip.style.maxWidth = '200px';
			tip.style.fontSize = '10pt';
			tip.style.border = '1px solid black';
			tip.style.opacity = '0.99';
			tip.style.boxShadow = '#555 2px 2px 8px';
		};
		
		var ht = new $jit.Hypertree(config);
		ht.loadJSON(data);
		ht.refresh();
		ht.controller.onComplete();
	}	
}

