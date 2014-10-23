//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB POSTER  (USED IN IMAGE:ZOOMABLE too)
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawPoster=function() 											//	DRAW POSTER
{
	var str,i,j,k,o,v,vv;
	var options=this.options;
	var container=this.container;
	var con="#"+container;
 	var _this=this;
	this.items=new Array();
   	for (var key in options) {
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			var v=options[key].split(';');
			for (i=0;i<v.length;++i) {
				v[i]=v[i].replace(/http:/g,"http`");
				o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				}
			this.items.push(o);
			}
		}
	if (!this.posterScale)																// If first time
   		this.posterScale=2;																// Init
	if (options.shivaGroup == "Poster") {												// If poster
		if (!this.eva)																	// If no eva
			this.eva=new EvA();															// Alloc it															
	  	this.eva.ondos=new Array();														// Clear ondos
		if (options.eva) {																// If some options
			var ud=options.eva.split("``");												// Split into rows
		  	for (i=0;i<ud.length;++i) {													// For each row
		 		v=ud[i].split("`");														// Split by value pair
				if (v.length < 2)														// If not enough elements
					continue;															// Skip
				o={};																	// New obj
				for (j=0;j<v.length;++j) {												// For each pair
					vv=v[j].split("~");													// Split pair
					o[vv[0]]=vv[1];														// Add it in
					}
				this.eva.ondos.push(o);													// Add to list and run if an init
				}
			}
		}
	
	var str="<div id='posterDiv' style='position:absolute;";							// Make poster div
	str+="background-color:#"+options.backCol+"'></div>";								// Back color
	$(con).html(str);																	// Add div
 	$(con).css({border:"1px solid",overflow:"hidden",margin:"0px",padding:"0px"});		// Put border and hode overflow on container
	$(con).width(options.width);	$(con).height(options.height);						// Set size
	$("#posterDiv").draggable({ drag:function(event,ui) {								// Make it draggable
								var w=$("#posterDiv").width();							// Get image width
								var h=$("#posterDiv").height();							// Get image height
								var s=shivaLib.posterScale;								// Current scale
								shivaLib.posterX=(-$("#posterDiv").css("left").replace(/px/,"")+(w/s/2))/w; // Get centerX %
								shivaLib.posterY=(-$("#posterDiv").css("top").replace(/px/,"")+(h/s/2))/h;  // Get centerY %
								shivaLib.DrawPosterOverview();							// Reflect pos in overview
								$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));  // Set cur pos
								if (shivaLib.options.chartType == "Zoomable")			// If a zoomable
								  	shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos); // Send message
								}});	 
	
	if (options.dataSourceUrl) {														// If a back img spec'd
		str="<img src='"+options.dataSourceUrl+"' ";									// Name
		str+="height='100%' width='100%'>";												// Size
		$("#posterDiv").append(str);													// Add image to poster
		}	
	this.DrawPosterOverview();															// Draw overview, if enabled
	if (this.posterMode != "Connect") {													// If editing or viewing
		this.DrawPosterPanes(-1,"draw");												// Draw panes
		this.DrawLayerControlBox(this.items,(options.controlbox == "true"));			// Draw control box?
		if ((this.posterMode != "Edit") && (this.options.eva))							// If not editing
			this.eva.Run(this.options.eva);												// Run Eva
		}
	var v=options.pos.split("|");														// Get start pos
	this.PositionPoster(v[0],v[1],v[2]);												// Set position
	this.DrawPosterOverview();															// Draw overview, if enabled
	this.SendReadyMessage(true);														// Send ready message
}

SHIVA_Show.prototype.PositionPoster=function(size, left, top) 						// POSITION POSTER
{
	if (size != undefined) {
		shivaLib.posterScale=size/1000;													// Current scale
		shivaLib.posterX=left/1000; 													// Get center X%
		shivaLib.posterY=top/1000;  													// Get center Y%
		}
	var s=shivaLib.posterScale;															// Point at scale
	$("#posterDiv").width(shivaLib.options.width);										// Set poster width
	$("#posterDiv").height(shivaLib.options.height);									// Set poster height
	var w=$("#posterDiv").width()*s;													// Get image width scaled
	var h=$("#posterDiv").height()*s;													// Get image height
	$("#posterDiv").width(w);															// Size it
	$("#posterDiv").height(h);															// Size it
	var l=w*shivaLib.posterX-(w/s/2);													// Get left
	var t=h*shivaLib.posterY-(h/s/2);													// Get top
	$("#posterDiv").css({"left":-l+"px","top":-t+"px"});								// Position poster	
	$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));  // Set cur pos
	this.DrawPosterPanes(-1,"resize");													// Resize panes
	if (typeof(DrawPosterGrid) == "function")											// If not in embedded
		DrawPosterGrid();																// Draw grid if enabled

	var l=$("#"+shivaLib.container).position().left;									// Left boundary
	var r=l-0+(w/s-w);																	// Right boundary
	var t=$("#"+shivaLib.container).position().top;										// Top boundary
	var b=t-0+(h/s-h);																	// Bottom boundary
	$("#posterDiv").draggable("option",{ containment: [r,b,l,t] } );					// Reset containment
}

SHIVA_Show.prototype.GoToPosterPane=function(num) 									// GO TO PANE
{
	if (num < this.items.length) {														// If a pane													
		var v=this.items[num].data.split("|");											// Get pane pos
		v[0]=Math.round(1000/v[0]*1000);												// Rescale
		this.options.pos=v[0]+"|"+v[1]+"|"+v[2];										// Set pos
		$("#posterOverDiv").hide();
		}
	else{																				// If start
		$("#posterOverDiv").show();
		this.options.pos="1000|500|500";												// Centered full screen
		}
	v=this.options.pos.split("|");														// Split put
	this.PositionPoster(v[0],v[1],v[2]);												// Redraw
	this.DrawPosterOverview();															// Redraw overview
	$("#shcr"+num).attr("checked","checked");											// Reset radio button
}

SHIVA_Show.prototype.DrawPosterOverview=function() 									// DRAW POSTER OVERVIEW
{
	var str;
	var options=this.options;
	var s=this.posterScale;																// Scale
	var w=$("#containerDiv").width()/4;													// Width of frame
	var h=$("#containerDiv").height()/4;												// Height of frame
	var h=w*h/w;																		// Height based on aspect
	if (($("#posterOverDiv").length == 0) && (options.overview == "true"))  {			// If not initted yet and showing
		var css = { position:"absolute",												// Frame factors
					left:w*4-w+"px",
					width:w+"px",
					height:h+"px",
					top:h*4-h+"px",
					border:"1px solid",
					"background-color":"#"+options.backCol
					};
		
		str="<div id='posterOverDiv'></div>";											// Frame box div
		$("#"+this.container).append(str);												// Add to container
		$("#posterOverDiv").css(css);													// Set overview frame
		if (options.dataSourceUrl) {													// If a back img spec'd
			str="<img src='"+options.dataSourceUrl+"' ";								// Name
			str+="height='"+h+"' ";														// Height
			str+="width='"+w+"' >";														// Width
			$("#posterOverDiv").append(str);											// Add image to poster
			}	
		if (typeof(DrawPosterOverviewGrid) == "function")								// If not embedded
			DrawPosterOverviewGrid();													// Draw grid in overview if enabled
		var css = { position:"absolute",												// Box factors
					border:"1px solid #666",
					"z-index":3,
					"background-color":"rgba(220,220,220,0.4)"
					};
		str="<div id='posterOverBox'></div>";											// Control box div
		$("#posterOverDiv").append(str);												// Add control box to overview frame
		$("#posterOverBox").css(css);													// Set overview frame
		$("#posterOverBox").draggable({ containment:"parent", 							// Make it draggable 
							drag:function(event,ui) {									// Handle drag						
								var w=$("#posterOverDiv").width();						// Overview width
								var pw=$("#posterDiv").width();							// Poster width
								var h=$("#posterOverDiv").height();						// Overview hgt
								var ph=$("#posterDiv").height();						// Poster hgt
								var s=shivaLib.posterScale;								// Current scale
								var x=Math.max(0,ui.position.left/w*pw);				// Calc left
								var y=Math.max(0,ui.position.top/h*ph);					// Calc top
								shivaLib.posterX=(x+(pw/s/2))/pw; 						// Get center X%
								shivaLib.posterY=(y+(ph/s/2))/ph;  						// Get center Y%
								$("#posterDiv").css({"left":-x+"px","top":-y+"px"});	// Position poster	
								$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));  // Set cur pos
								if (shivaLib.options.chartType == "Zoomable")			// If a zoomable
								  	shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos); // Send message
								}
							 });		
		$("#posterOverBox").resizable({ containment:"parent",						// Resizable
								aspectRatio:true,
								minHeight:12,
								stop:function(event,ui) {								// On resize stop
									var w=$("#posterOverDiv").width();					// Overview width
									var pw=$("#posterDiv").width();						// Poster width
									var h=$("#posterOverDiv").height();					// Overview hgt
									var ph=$("#posterDiv").height();					// Poster hgt
									shivaLib.posterScale=Math.max(w/ui.size.width,1); 	// Get new scale, cap at 100%					
									var s=shivaLib.posterScale;							// Current scale
									var x=Math.max(0,ui.position.left/w*pw);			// Calc left
									var y=Math.max(0,ui.position.top/h*ph);				// Calc top
									shivaLib.posterX=(x+(pw/s/2))/pw; 					// Get center X%
									shivaLib.posterY=(y+(ph/s/2))/ph;  					// Get center Y%
									$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));  // Set cur pos
									shivaLib.PositionPoster();							// Redraw
									if (shivaLib.options.chartType == "Zoomable")		// If a zoomable
								  		shivaLib.SendShivaMessage("ShivaImage=move",shivaLib.options.pos); // Send message
									}
								}); 
			}
		var x=$("#posterDiv").css("left").replace(/px/,"");								// Get x pos
		x=-x/w/4*w/this.posterScale;													// Scale to fit
		var y=$("#posterDiv").css("top").replace(/px/,"");								// Get y pos
		y=-y/h/4*h/this.posterScale;													// Scale to fit
		$("#posterOverBox").width(w/this.posterScale).height(h/this.posterScale);		// Set size
		$("#posterOverBox").css({"left":x+"px","top":y+"px"});							// Position control box		
}

SHIVA_Show.prototype.DrawPosterPanes=function(num, mode) 							// DRAW POSTER PANES
{
	var i,v,u,str,dw,dh,x,y,s=0,isImg=true;
	var scale=this.posterScale;
	var e=this.items.length;															// Assume end is all items
	var w=$("#posterDiv").width();														// Poster width
	var h=$("#posterDiv").height();														// Poster height
	if (num != -1) s=num,e=num-0+1;														// Just draw one
	for (i=0;i<e;++i) {																	// For each pane
		v=this.items[i].data.split("|");												// Get specs
		dw=v[0]/1000*w;																	// Div width
		if (this.items[i].asp)															// If loaded
			dh=dw*this.items[i].asp/1000;												// Div height based on aspect
		else																			// Not loaded yet
			dh=v[0]/1000*h;																// Div height based on poster frame
		x=w*v[1]/1000-(dw/2);															// Set centered left
		y=h*v[2]/1000-(dh/2);															// Set centered top
		str="<div id='posterPane"+i+"' style='position:absolute;background:none transparent;";	// Base
		if (this.items[i].style) 														// If a style spec'd
			str+=this.items[i].style.replace(/\|/g,";").replace(/=/g,":");				// Add it
		str+="'>"
		u=this.items[i].url;															// Point at url
		if (isImg=u.match(/\.jpg|\.jpeg|\.gif|\.png/i))									// If an image file
			str+="<img src='"+this.items[i].url+"' width='100%'>";						// Image				
		else if (u) {																	// Something else
				if (this.items[i].asp)														// If loaded
				srs="go.htm?srs=100&";													// Resize to 100%
			else																		// First time
				srs="go.htm?";															// Get in original aspect ratio
			if (!isNaN(u))																// If a number
				u=srs+"e="+u;															// Add file base
			else if ((u.match(/e=/)) || (u.match(/M=/)))								// An eStore or drupal
				u=srs+u;																// Add file base
			if (u.match(/go.htm/))														// A shiva module
				u+="&if="+i;															// Add id
			str+="<iframe id='posterFrame-"+i+"' src='"+u+"'";							// Iframe base
			if (this.items[i].scrollbars == "false")									// If not scrolling
				str+="scrolling='no' ";													// Inhibit it
			str+="frameborder='0' allowtransparency='true'></iframe>";					// Finish iframe				
			}
		if (mode == "draw") {															// If doing them all, or redrawing one
			$("#posterPane"+i).remove();												// Remove old one, if there
			$("#posterDiv").append(str+"</div>");										// Add div to poster
			if (this.posterMode == "Edit") {											// If editing
				str="<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;border:1px dashed'>";	// Make overlay div for dragging
				str+="<div id='posterPaneLab"+i+"' style='position:absolute;left:0px;text-shadow:1px 1px #eee'>";
				str+="<b> "+(i+1)+". "+this.items[i].layerTitle+"</b></div>";			// Label
				$("#posterPane"+i).append(str+"</div>");								// Add div
				}
			else if (this.items[i].caption) {											// If a caption
				str="<div style='font-size:small;position:absolute;left:0px;top:100%;width:100%;padding:4px;text-align:center'><b>"+shivaLib.LinkToAnchor(this.items[i].caption)+"</b>";// Show it
				$("#posterPane"+i).append(str+"</div>");								// Add div
				}
			if ((this.posterMode != "Edit") && (this.items[i].drag == "true")) {		// If in draggable view
				str="<div style='position:absolute;left:0px;top:0px;width:80%;height:20px;'>";	// Make overlay div for dragging
				$("#posterPane"+i).append(str+"</div>");								// Add div
				$("#posterPane"+i).draggable({ containment:"parent" });					// Make draggable		
				}
			}
		$("#posterFrame-"+i).height(dh);												// Set iframe height
		$("#posterFrame-"+i).width(dw);													// Set iframe width
		$("#posterPane"+i).height(dh);													// Set pane height
		$("#posterPane"+i).width(dw);													// Set pane width
		$("#posterPane"+i).css({"left":x+"px","top":y+"px"});							// Set pos			
		$("#posterPaneLab"+i).css("top",$("#posterPane"+i).height()+3+"px");			// Set label pos			
		if (this.options.overview == "true")  {											// If showing overview
			str="<div id='posterOverPane"+i+"' style='position:absolute;opacity:.4;border:1px solid white;pointer-events:none;background-color:#666'/>";	// Base
			if (mode == "draw") 														// If adding to dom
				$("#posterOverDiv").append(str);										// Add div to overview
			x=$("#posterPane"+i).position().left;										// Get left
			y=$("#posterPane"+i).position().top;										// Get top
			$("#posterOverPane"+i).css({"left":x/4/scale+"px","top":y/4/scale+"px"});	// Set pos			
			$("#posterOverPane"+i).height(dh/4/scale);									// Set pane height
			$("#posterOverPane"+i).width(dw/4/scale);									// Set pane width
			}
		if ((mode == "resize") && (u)) {												// If resizing a filled iframe
			if (u.match(/go\.htm/)) {													// If a  SHIVA module		
				var win=document.getElementById("posterFrame-"+i).contentWindow;		// Point at iframe	
				win.postMessage("ShivaAct=resize","*");									// Send message to container
				}
			}
		if (this.posterMode != "Edit") 													// If viewing
			continue;																	// No need for interaction

		$("#posterPane"+i).resizable({ 	containment:"parent",							// Resizable
										aspectRatio:!(shivaLib.items[i].url.match(/http/)),
										stop:function(event,ui) {						// On resize stop
											var i=event.target.id.substr(10);			// Extract id
											var v=shivaLib.items[i].data.split("|");	// Get parts
											v[0]=Math.floor(Math.min(ui.size.width/$("#containerDiv").width()/shivaLib.posterScale,1)*1000); // Get new scale, cap at 100%					
											shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];				// Set new size
											$("#itemInput"+i+"-1").val(shivaLib.items[i].data);			// Put in menu
											if (shivaLib.items[i].url.match(/http/)) { 					// If not a shiva module
												var asp=Math.round(ui.size.height/ui.size.width*1000);	// Set asp string
												shivaLib.items[i].asp=asp;								// Set new asp
												$("#itemInput"+i+"-2").val(asp);						// Set props
												}
											shivaLib.DrawPosterPanes(i,"resize");						// Redraw this pane, and resize 								
											}
										});
		
		$("#posterPane"+i).draggable({  containment:"parent",							// Draggable
										drag:function(event,ui) {						// On drag stop
											var i=event.target.id.substr(10);			// Extract id
											var v=shivaLib.items[i].data.split("|");	// Get parts
											var w=$("#posterDiv").width();				// Poster wid
											var h=$("#posterDiv").height();				// Poster hgt
											var off=0;									// Iframe offset
											if (shivaLib.items[i].url.match(/[[.]jpg|jpeg|gif|png]/i))	// If an image file
												off=12*shivaLib.posterScale;			// Set offset
											v[1]=Math.round(($("#posterPane"+i).position().left+$("#posterPane"+i).width()/2)/w*1000);
											v[2]=Math.round(($("#posterPane"+i).position().top+$("#posterPane"+i).height()/2+off)/h*1000);
											shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];		// Set new pos
											$("#itemInput"+i+"-1").val(shivaLib.items[i].data);	// Put in menu									
											shivaLib.DrawPosterPanes(i,"drag");			// Redraw this pane in overview									
											}
										});
		}	
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   EvA METHODS 
//   Documentation: https://docs.google.com/document/d/1Q42_K0Li7ZDtXfY27neZuo7aENZ-yGybKAYMFNBTGqg/edit
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function EvA() 														// CONSTRUCTOR
{
	this.ondos=new Array();												// Hold ondo statements
	this.data=new Array();												// Holds table data
	if (window.addEventListener) 
		window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false); // Add event listener
	else
		window.attachEvent("message",$.proxy(this.ShivaEventHandler,this),false); // Add event listener
}

EvA.prototype.Run=function(ondoList) 								// RUN
{
	var i,o;
	this.data=[];														// Clear table data
	for (i=0;i<this.ondos.length;++i) {									// For each ondo
		o=this.ondos[i];												// Point at ondo
		o.done=0;														// Not done yet
		if (o.on == "init")												// If an init
			this.RunOnDo(o);											// Run it
		}
	}

EvA.prototype.RunOnDo=function(ondo) 								// RUN AN INIT ONDO
{
	var str,o,i;
	var to=ondo.to;														// Save to
	var from=ondo.from;													// Save to
	if (!isNaN(to))    	to="posterFrame-"+(to-1);						// True iframe ids
	if (!isNaN(from)) 	from="posterFrame-"+(from-1);					// True iframe ids
	switch(ondo.Do) {													// Route on type
		case "load": 													// Load an iframe
			str=ondo.src;												// Set url
			if (!to.match(/posterFrame-/)) {							// If loading a data file							
	   			shivaLib.GetSpreadsheet(str,false,null,function(data){	// Get spreadsheet data
					ondo.ready=true;									// Done
					shivaLib.eva.data[ondo.to]=data;					// Save data in table def'd by 'to'
					},true);											// Add fields too
				break;
				}
			if (ondo.src.indexOf("e=") == 0)							// An eStore
				str="//www.viseyes.org/shiva/go.htm?srs=100&"+ondo.src;	// Make url
			else if (ondo.src.indexOf("m=") == 0)						// A Drupal manager
				str="//shiva.shanti.virginia.edu/go.htm?srs=100&m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			else if (ondo.src.indexOf("E=") == 0)						// eStore test
				str="//127.0.0.1:8020/SHIVA/go.htm?srs=100&e="+ondo.src.substr(2);	// Make url
			else if (ondo.src.indexOf("M=") == 0)						// Drupal test
				str="//127.0.0.1:8020/SHIVA/go.htm?srs=100&m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			$("#"+to).attr("src",str);									// Set src
				break;
		case "fill": 													// Fill an iframe
			if ((!ondo.src) || (!this.data[ondo.src]))					// No src
				break;													// Quit
			str="ShivaAct=data|";										// Base			
			str+=this.TableToString(this.data[ondo.src])				// Add table data
			this.SendMessage(to,str);									// Send message to iframe
			break;
		case "tell": 													// Run an action
			str="ShivaAct="+ondo.src;									// Add base
			for (i=1;i<7;++i) {											// For each possible param
				if (ondo["p"+i]) 										// If it is set
					str+="|"+ondo["p"+i];								// Add it
				}
			this.SendMessage(to,str);									// Send message to iframe
			break;
		case "script": 													// Add a script
			if (!ondo.src)												// If no source
				break;													// Quit
			var s=document.createElement("script");						// Create new element
			$("#scr-"+ondo.to).remove();								// Remove old one
			s.id="scr-"+ondo.to;										// Set id same a fname
			s.setAttribute('type','text/javascript');					// JS
			str="function "+ondo.to+"(p1,p2,p3,p4,p5,p6,p7){";			// Function header
			str+=ondo.src.replace(/&apos;/g,"\'").replace(/&quot;/g,"\"").replace(/&br;/g,"\n");	// Unescape ', ", & \n
			s.appendChild(document.createTextNode(str+"}"));			// Add text node
			document.getElementsByTagName('head').item(0).appendChild(s);	// Add to DOM
	 		break;
		case "call": 													// Run a callback
			window[ondo.to](ondo.p1,ondo.p2,ondo.p3,ondo.p4,ondo.p5,ondo.p6);// Callback
			break;
		case "filter": 													// Run a query
			if (!ondo.src || !ondo.to)									// If no source/dest
				break;													// Quit
			this.data[ondo.to]=[];										// New array
			this.Query(this.data[ondo.src],this.data[ondo.to],ondo.query,ondo.p1,ondo.p2);	// Run query on table
			break;
		}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   MESSAGING  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

EvA.prototype.ShivaEventHandler=function(e) 						// CATCH SHIVA EVENTS
{
	var from;
	var i,o,n=this.ondos.length;
	var v=e.data.split("|");											// Get parts
	if (v[0].match(/ShivaChart=ready/)) {								// A ready message
		if (v[1].match(/posterFrame-/)) 								// A frame ready
			if ((i=v[1].substr(12)) && (v.length > 2)){					// Get id
				if (!shivaLib.items[i].asp[i]) {						// If not set
					shivaLib.items[i].asp=v[2];							// Set it
					$("#itemInput"+i+"-2").val(v[2]);					// Set props
					}
				}
		}
	v[0]=v[0].split("=")[1];											// Strip prefix
	for (i=0;i<n;++i) {													// For each ondo
		o=this.ondos[i];												// Point at it
		from=o.from;													// Copy
		if (!isNaN(o.from)) from="posterFrame-"+(o.from-1);				// True iframe ids
		if (o.on == "ready") { 											// A ready message
			if ((!o.done) && (v[1] == from) && (v[0] == "ready")) {		// If it matches source and not done yet
				o.done++;												// Mark it done
				this.RunOnDo(o);										// Do it
				}
			}
		else if ((v[1] == from) && (v[0] == o.on))						// If it matches source and type
			this.HandleOnEvent(o,e.data);								// Handle it
		}
}

EvA.prototype.HandleOnEvent=function(ondo, data) 					// HANDLE INCOMING EVENT
{
	var run=new Object();												// New run obj
	for (o in ondo)														// For each field in on field
		run[o]=ondo[o];													// Add to run obj
	if ((!run.p1) && (run.Do == "call")) {								// If params not defined for a callback
		var v=data.split("|");											// Get on params
		if (v[1] != undefined)	run.p1=v[1];							// Add param from on
		if (v[2] != undefined)	run.p2=v[2];							// Add 
		if (v[3] != undefined)	run.p3=v[3];							// Add 
		if (v[4] != undefined)	run.p4=v[4];							// Add 
		if (v[5] != undefined)	run.p5=v[5];							// Add 
		if (v[6] != undefined)	run.p6=v[6];							// Add 
		}	
	this.RunOnDo(run);													// Run it
}

EvA.prototype.SendMessage=function(con, msg) 						// SEND HTML5 MESSAGE TO IFRAME
{
	var win=document.getElementById(con).contentWindow;					// Point at iframe	
	win.postMessage(msg,"*");											// Send message to container
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   DATA TABLES  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////


EvA.prototype.TableToString=function(table) 						// SAVE TABLE AS STRING
{
	var i,j,val,str="[";
	var cols=table[0].length-1;											// Number of fields
	var rows=table.length-1;											// Number of rows
	for (i=0;i<=rows;++i) {												// For each event
		str+="[";														// Begin row
		for (j=0;j<=cols;++j) { 										// For each value
			val=table[i][j];											// Get value
			if ((isNaN(val)) || (!val)) {								// If not a number or blank		
				str+="\""+val+"\"";										// Add value
				}
			else														// A number
				str+=val;												// Add it
			if (j != cols)												// If not last
				str+=",";												// Add comma
			}
		str+="]";														// End row
		if (i != rows)													// If not last
			str+=",";													// Add comma
		}
	return str+"]";														// Return stringified array
}

EvA.prototype.Query=function(src, dst, query, fields, sort) 		// RUN QUERY
{
	var v,j,i=0;
	var allFields=false;												// Assume selected fields
	var nAnds=0;														// Assume no AND clauses yet
	if (!src || !dst)													// No data
		return;															// Quit
	var n=src.length;													// Length of table
	var clause=new Array();												// Holds clauses
	var ands=new Array();												// Holds hits of AND clauses
	var ors=new Array();												// Holds hits of OR clauses

	if ((!fields) || (fields == "*")) { 								// If no fields spec'd
		fields=src[0];													// Return all fields
		allFields=true;													// Fast track
		}
	else																// Only these fields
		fields=fields.split("+");										// Split buy '+'
	if ((!query) || (query == "*"))										// If no query spec'd
		query="* * *";													// Return all rows

	var o=new Object();													// Create obj
	clause.push(o);														// Add 1st clause
	o.type="AND";														// 1st is AND
	v=query.split(" ");													// Tokenize
	while (i < v.length) {												// For each token	
		o.hits=[];														// No hits yet
		o.field=v[i++];													// Field
		o.cond=v[i++];													// Condition
		o.what=v[i++];													// Field
		if ((i < v.length) && (v[i] != "AND") && (v[i] != "OR"))		// Must have space in what word phrase
			o.what+=" "+v[i++];											// Ad next what word
		if (i < v.length) {												// For each token
			o={};														// Fresh obj
			o.type=v[i++];												// Type
			clause.push(o);												// Add new clause
			}
		}	
	for (i=0;i<clause.length;++i) {										// For each clause
		o=clause[i];													// Point at clause
		h=ands;															// Point at ands array to store hits
		if (o.type == "OR")												// Unless it's an OR
			h=ors;														// Point at ors array
		else															// An AND
			nAnds++;													// Add to count
		for (j=0;j<src[0].length;++j) 									// For each field
			if (o.field == src[0][j]) {									// If name matches
				o.field=j;												// Replace name with num
				break;													// Quit looking
				}
		for (j=1;j<n;++j) {												// If each row
			if (o.cond == "*")	{										// Always
				h.push(j-1);											// Add it to clause									
				}
			if (o.cond == "LT")	{										// Less than
				if (src[j][o.field] < o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			else if (o.cond == "GT") {									// Greater than
				if (src[j][o.field] > o.what)							// A hit
					h.push(j-1);										// Add it to clause		
				}							
			if (o.cond == "LE")	{										// Less than or equal
				if (src[j][o.field] <= o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			else if (o.cond == "GE") {									// Greater than or equal
				if (src[j][o.field] >= o.what)							// A hit
					h.push(j-1);										// Add it to clause		
				}							
			if (o.cond == "EQ")	{										// Equal
				if (src[j][o.field] == o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "NE")	{										// Not equal
				if (src[j][o.field] != o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "LK")	{										// Like
				if (src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase()) != -1)	// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "NL")	{										// Not like
				if (src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase()) == -1)	// A hit
					h.push(j-1);										// Add it to clause									
				}
			}
		}

	var results=new Array();											// Make new array to hold results
	if (nAnds == 1) 													// If just one AND clauses
		results=ands;													// Take hits from ands
	else {																// Multiple AND clauses
		var thisOne;
		n=ands.length;													// Number of AND hits
		var matches=1;													// Set matches counter
		for (i=0;i<n;++i) {												// For each and hit
			thisOne=ands[i];											// Point at current and hit
			for (j=i+1;j<n;++j) {										// For following ands
				if (ands[j] == thisOne)									// A match
					++matches;											// Add to count
				if (matches == nAnds)	{								// Enough to add row to results	
					results.push(ands[i]);								// Add to results
					matches=1;											// Reset matches
					break;												// Stop looking for this one
					}
				}
			}
		}
	n=results.length;													// Number of hits
	if (ors.length) {													// If any OR clauses
		for (i=0;i<ors.length;++i) {									// For each or hit
			for (j=0;j<n;++j) 											// For each result
				if (ors[i] == results[j])								// If already in
					break;												// Quit
			if (j == n)													// Didn't have it already
				results.push(ors[i]);									// Add to results
			}
		}
	
	n=fields.length;													// Number of fields
	if (allFields) {													// If doing all fields
		for (i=0;i<results.length;++i) 									// For each result
			dst.push(src[results[i]]);									// Add row
		}
	else{																// Selected fields
		var ids=new Array();
		for (i=0;i<n;++i) { 											// For each desired field
			for (j=0;j<src[0].length;++j) 								// For each possible field
				if (fields[i] == src[0][j]) {							// If name matches
					ids[i]=j;											// Replace name with num
					break;												// Quit looking
					}
			}
		for (i=0;i<results.length;++i) {								// For each result
			o=[];														// New array
			for (j=0;j<n;++j) 	{										// For each result
				o.push(src[results[i]+1][ids[j]]);						// Add data (skip header)
			}
			dst.push(o);												// Add row
			}
		}
	
	if (sort) {															// If sorting
		var dir=1;														// Assume ascending
		if (sort.charAt(0) == "-") {									// If neg	
			dir=-1;														// Sort descending
			sort=sort.substr(1);										// Eemove '-'
			}
		for (j=0;j<n;++j) 												// For each field
			if (sort == src[0][j]) {									// If name matches
				sort=j;													// Replace name with num
				break;													// Quit looking
				}
		dst.sort(function(a,b) { return a[sort] > b[sort]?-1*dir:1*dir });	// Sort it
		}
	dst.splice(0,0,fields);												// Set header
}

	