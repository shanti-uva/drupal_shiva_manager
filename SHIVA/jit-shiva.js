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
			Label: 		{ overridable: true, type: 'Native'	},
			Tips: 		{ enable: true },
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true },
			CanvasStyles: {	}
			},
		forcedir: {
			iterations: 200,
			background: { CanvasStyles: {} },
			Navigation: { enable: true,	panning: 'avoid nodes' },
			Node: 		{ CanvasStyles: {} },		
			Edge: 		{ overridable: true, CanvasStyles: {} },
			Label: 		{ overridable: true, type: 'Native' },
			Tips: 		{ enable: true	},
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true },
			CanvasStyles: {}
			},
		hypertree: {
			background: { CanvasStyles: {} },
			Navigation: { enable: true, panning: true },		
			Node: 		{ CanvasStyles: {}, transform: false },
			Edge: 		{ overridable: true, CanvasStyles: {} },
			Label: 		{ overridable: true, type: 'Native'	},
			Tips:		{ enable: true	},
			Events: 	{ enable: true,	enableForEdges: true },
			NodeStyles: { enable: true	},
			CanvasStyles: {},
			},	
	}
}

VIZ.prototype.Draw=function(json) 
{
	var k,key,val;
	this.chartType=json.chartType;												// Chart type		
	$('#viz_css').attr("href","css/"+this.chartType+".css");					// Set css
	for (key in json) {															// For each property
		val=json[key];															// Get value
		if (key.match(/_fillStyle/))	val="#"+val;							// Add # to color						
		if (key.match(/_strokeStyle/))	val="#"+val;							// Add # to color						
		if (key.match(/_color/))		val="#"+val;							// Add # to color						
		if (val == "true") 				val=true;								// Force bool
		else if (val == 'false') 		val=false;								// Force bool
		k=key.split("_");														// Split into parts
		if (k.length == 2) 				this.Config[this.chartType][k[0]][k[1]]=val;// 2 parts
		else if (k.length == 3) 		this.Config[this.chartType][k[0]][k[1]][k[2]]=val; // 3 parts
		else 							this.Config[this.chartType][key]=val;	// Just 1
		}
	if (this.chartType != 'rgraph') 
		this.Config[this.chartType].background.CanvasStyles.strokeStyle = this.Config[this.chartType].background.CanvasStyles.fillStyle;
	new google.visualization.Query(json.dataSourceUrl).send($.proxy(this.Google2Jit,this));	// Load table
	this.config=this.Config[this.chartType]; 									// Set config
	$jit.id(this.container).style.height=this.config.height+"px";
	$jit.id(this.container).style.width=this.config.width+"px";	
	$jit.id(this.container).style.backgroundColor=this.config.background.CanvasStyles.fillStyle;
}

VIZ.prototype.Google2Jit=function(rs)
{	
	var table=rs.getDataTable();												// Get data table
	var numRows = table.getNumberOfRows();
	
	// Clean up data (trim leading and ending spaces) and save to local array
	// Crucial -- spaces will break things
	var ROWS = [];
	for (var i = 0; i < numRows; i++) {
		ROWS[i] = [];
		for (var j = 0; j < 4; j++) {
			var v = table.getValue(i,j);
			if (isNaN(v)) { v = v.replace(/(^\s+|\s+$)/g,""); }
			ROWS[i][j] = v;
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
			JIT[nodeID].name 	= ROWS[i][2];  
			var nodeClass 		= ROWS[i][3]; 
			JIT[nodeID].data.class = nodeClass;
			for (var k in CLASSES.node[nodeClass]) {
				JIT[nodeID].data['$' + k] = CLASSES.node[nodeClass][k];
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

	this.data = [];															// Clear data array
	for (var x in JIT) this.data.push(JIT[x]);								// Turn into array
		$jit.id(this.container).innerHTML = ''; 							// Empty div										
	this.Init[this.chartType](this); 										// Draw it			
}		

VIZ.prototype.Init = {
	rgraph:	function (obj) {
		var data 		= obj.data;
		var config 	= obj.Config[obj.chartType];
		var div 		= obj.container;
		config.injectInto = div;							// Canvas level params set at run time
		            
		config.onCreateLabel = function(domElement, node){
			domElement.innerHTML = node.name;
			domElement.onclick = function(){
				rgraph.onClick(node.id,{});
			};
		};
		
		config.onPlaceLabel = function(domElement, node)
		{
			var style = domElement.style;
			style.fontSize 		= config.Label.size + 'px';
			style.color 		= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			style.display = '';
			style.cursor = 'pointer';	
		};
		
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.class + "</b> with " + count + " connections.</div>";
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
	
		var jsonData 	= obj.data;
		var config		= obj.Config[obj.chartType];
		var div 			= obj.container;
		config.injectInto = div; 
		
		config.onCreateLabel = function(domElement, node){
			var style = domElement.style;
			style.fontSize 		= config.Label.size + 'px';
			style.color 		= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			domElement.innerHTML = node.name;
		};

		config.onPlaceLabel = function(domElement, node){
			var style = domElement.style;
			var left = parseInt(style.left);
			var top = parseInt(style.top);
			var w = domElement.offsetWidth;
			style.left = (left - w / 2) + 'px';
			style.top = (top + 10) + 'px';
			style.display = '';
		};
		
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
		config.onClick = function(node) {
			if(!node) return;
			// Build the right column relations list.
			// This is done by traversing the clicked node connections.
			var html = "<h4>" + node.name + "</h4><b> connections:</b><ul><li>";
			var list = [];
			node.eachAdjacency(function(adj){
				list.push(adj.nodeTo.name);
			});
			};
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.class + "</b> with " + count + " connections.</div>";
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
		config.onPlaceLabel = function(domElement, node) {
			var style = domElement.style;
			style.fontSize 		= config.Label.size + 'px';
			style.color 		= config.Label.color;
			style.fontWeight 	= config.Label.style;
			style.fontStyle 	= config.Label.style;
			style.fontFamily 	= config.Label.family;
			style.textAlign 	= config.Label.textAlign;
			style.cursor = 'pointer';
			style.display = '';
		};
		config.onCreateLabel = function(domElement, node) {
			domElement.innerHTML = node.name;
			$jit.util.addEvent(domElement, 'click', function () {
				ht.onClick(node.id, {
					onComplete: function() {
						ht.controller.onComplete();
					}
				});
			});
		};
		config.onComplete = function() {
			return;
		}
		config.Tips.onShow = function(tip, node) {
			var count = 0;
			node.eachAdjacency(function() { count++; });
			tip.innerHTML = "<div class='tip-title'>" + node.name + " is a <b>" + node.data.class + "</b> with " + count + " connections.</div>";
		};
		var ht = new $jit.Hypertree(config);
		ht.loadJSON(data);
		ht.refresh();
		ht.controller.onComplete();
	},	
}
