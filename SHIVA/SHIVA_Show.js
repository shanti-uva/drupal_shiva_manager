function SHIVA_Show(container, options, editMode) 						// CONSTRUCTOR
{
	this.drupalMan=false;
	this.options=null;
	this.map=null;															
	this.player=null;
	this.timeLine=null;															
	this.container=container;
	this.editMode=editMode;
	this.items=null;
	this.overlay=null;
	this.g=null;
	this.qe=null;
	this.ev=null;
	this.jit=null
	this.cvs=null
	if (options)
		this.Draw(options);
}

SHIVA_Show.prototype.Draw=function(ops) 								//	DRAW LOADER/DIRECTOR
{
	if (!ops)
		return;
	this.options=ops;
	this.LoadJSLib(ops.shivaGroup,$.proxy(function() { this.DrawElement(ops) },this))
}

SHIVA_Show.prototype.DrawElement=function(ops) 							//	DRAW DIRECTOR
{
	var _this=this;
	var group=ops.shivaGroup;
	if (group == 'Visualization') 
		this.DrawChart();
	else if (group == 'Map')
		this.DrawMap();
	else if (group == 'Timeline')
		this.DrawTimeline();
	else if (group == 'Control')
		this.DrawControl();
	else if (group == 'Video')
		this.DrawVideo();
	else if (group == 'Image')
		this.DrawImage();
	else if (group == 'Subway')
		this.DrawSubway();
	else if (group == 'Data')
		this.DrawChart();
	else if (group == 'Network')
		this.DrawNetwork();
	else if (group == 'Earth')
		this.DrawEarth();
	else if (group == 'Draw') {
		if (ops.width)	$("#"+this.container).css("width",ops.width+"px");
		if (ops.height)	$("#"+this.container).css("height",ops.height+"px");
		this.DrawOverlay();
		this.SendReadyMessage(true);											
		}
	else if (group == 'Webpage')
		this.DrawWebpage();
	if (ops["draw-1"])
		this.AddOverlay();
	var ud=ops["ud"];														// Get ud flag
	if (ud == "true")		ud=true;										// Convert to boolean
	else if (ud == "false")	ud=false;										// Convert to boolean
	if (ud) {																// If allowing user annotation in go.htm														
		if ((this.drupalMan) || ((window.parent) && (window.parent.name != "topWindow"))) {	
		var h=$("#"+this.container).css("height").replace(/px/g,"");		// Get height
		var str="<img  id='shivaAnnotateBut' src='annotate.gif' style='position:absolute";	
		str+=";top:"+(h-0+12)+"px'>";										// Bottom of container div
		$("body").append(str);												// Add button
		$("#shivaAnnotateBut").click(function() { _this.Annotate(); });		// Click event
		$("#shivaAnnotateBut").css('pointer-events','auto');				// Inibit pointer clicks if menu gone
		}
	}
}

SHIVA_Show.prototype.LoadJSLib=function(which, callback) 				// LOAD JS LIBRARY
{
 	var i,obj,lib="";
 	switch(which) {	
		/*case "Timeline": 													// Simile			
			obj="Timeline.DefaultEventSource";								// Object to test for
			lib="http://api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true";  // Lib to load
          	break;*/											 // Route on type
		case "Timeline": 											 // Simile			
			obj="timeglider";								     // Object to test for
			lib="./timeglider/timeglider-all.js";  // Lib to load (NEEDS TO BE FIXED TO FINAL LOCATION)
         break;
		case "Video": 														// Popcorn
			obj="Popcorn.smart";											// Object to test for
			lib="http://popcornjs.org/code/dist/popcorn-complete.min.js";  // Lib to load
         break;
		case "Image": 														// Ad gallery
			obj="jQuery.prototype.adGallery";								// Object to test for
			lib="jquery.ad-gallery.min.js";  								// Lib to load
         break;
		case "Network": 													// JIT
			obj="$jit.id";													// Object to test for
			lib="jit-yc.js";  												// Lib to load
           	break;
		case "Map": 														// Google maps		
  			obj="google.maps.Map";											// Object to test for
        	lib="http://maps.googleapis.com/maps/api/js?sensor=false&callback=shivaJSLoaded"; 		// Lib to load
            break;
		}
	if (lib) {																// If a lib to load
		var v=obj.split(".");												// Split by parts
		var n=v.length;														// Number of parts
		var o=$(window)[0];													// Point at root
		for (i=0;i<n;++i) 													// For each part
			if (!(o=o[v[i]])) 												// Not a match
				break;														// Quit looking
		if (o && (i == n)) {												// Got them all		
			callback();														// Call callback
			return;															// Quit
			}
  		var head=document.getElementsByTagName('head')[0];					// Point at head
  		var script=document.createElement('script');						// Point at script
   		script.type="text/javascript";										// Set type
   		script.charset="utf-8";
      script.src=lib; 													// URL
    	script.onload=shivaJSLoaded(obj,callback);							// Set callback
      head.appendChild(script);											// Add to script
		}
	else																	// No lib
		callback();															// Call callback
}

function shivaJSLoaded(obj, callback) 									// RECURSE UNTIL JS METHOD/PROPERTY IS AVAILABLE
{
	var i;
	if (!obj)																// If no obj
		return;																// Return
	var v=obj.split(".");													// Split by parts
	var n=v.length;															// Number of parts
	var o=$(window)[0];														// Point at root
	for (i=0;i<n;++i) 														// For each part
		if (!(o=o[v[i]])) 													// Not a match
			break;															// Quit looking
	if (o && (i == n)) 		{												// Got them all		
		callback();															// Call callback
	} else {															// No loaded yet
		setTimeout(function() { shivaJSLoaded(obj,callback); },50);			// Recurse	
	}
}

SHIVA_Show.prototype.SendReadyMessage=function(mode) 					// SEND READY MESSAGE TO DRUPAL MANAGER
{
	if (shivaLib.drupalMan) 												// If called from Drupal manager
		window.parent.postMessage("ShivaReady="+mode.toString(),"*");		// Send message to parent wind		
}

SHIVA_Show.prototype.AddOverlay=function() 								// ADD OVERLAY
{
	var key;
   	this.overlay=new Array();												// Alloc new array
	this.DrawOverlay();														// Initialize
   	for (key in this.options) {												// For each element
		if (key.match(/draw-/g)) 											// If a drawing	segment					
			this.AddOverlaySeg(this.options[key],false);					// Add seg
		}
	$("#shivaDrawDiv").css('pointer-events','none');						// Inibit pointer clicks if menu gone
 	this.DrawOverlay();														// Draw
}	

SHIVA_Show.prototype.AddOverlaySeg=function(seg, init)					// ADD SEGMENT TO OVERLAY
{
	var i,key;
	if (!seg)																// No seg
		return;																// Quit
	var o=new Object();														// Alloc object
	if (!this.overlay)														// If not alloc'd
	   	this.overlay=new Array();											// Alloc new array
	if (!this.dr && init) {													// If not already instantiated
		this.Draw({shivaGroup:"Draw"});										// Create canvas
		this.dr=new SHIVA_Draw(this.container,true);						// Alloc drawing module
		}
	var v=seg.split(';');													// Split into parts
	for (i=0;i<v.length;++i) {												// For each param
		key=v[i].split(':')[0];												// Get key
		o[key]=v[i].split(':')[1].replace(/\~/g,"#").replace(/\|/g,"\n").replace(/\`/g,":");
		if (o[key] == "true")		o[key]=true;							// Force boolean
		if (o[key] == "false")		o[key]=false;							// Force boolean
		}	
	if (o.x)	o.x=o.x.split(",");											// Force arrays
	if (o.y)	o.y=o.y.split(",");											// Force arrays
	this.overlay.push(o);													// Add segment
}

SHIVA_Show.prototype.DrawOverlay=function() 							// DRAW OVERLAY
{
	var o,i,col,ecol,ewid,a,cur,ctx,str,now,s=0,e=36000;
	var con="#"+this.container;
	if (!this.g)															// If no graphics lib
		this.g=new SHIVA_Graphics();										// Allocate it
	var l=$(con).css("left");	var t=$(con).css("top");					// Get pos
	if (l == "auto")	l="0px";											// Turn auto into 0
	if (t == "auto")	t="0px";											// Turn auto into 0
	i=$(con).css("height").replace(/px/g,"");								// Get hgt
	if (this.player)														// If a player object
		i-=40;																// Don't hide controls
	if (!$("#shivaDrawCanvas").length) {									// No canvas yet	
		str="<div id='shivaDrawDiv' style='position:absolute";				// Div
		str+=";width:"+$(con).css("width");									// Make div
		str+=";top:"+t;														// same as
		str+=";left:"+l;													// container div
		str+=";height:"+i+"px'/>";											// Set hgt
		$('body').append(str);												// Add to dom								
		this.g.CreateCanvas("shivaDrawCanvas","shivaDrawDiv");				// Create canvas
		}
	$("#shivaDrawCanvas").attr("width",$(con).css("width"));				// Wid
	$("#shivaDrawCanvas").attr("height",i+"px");							// Hgt
	$("#shivaDrawDiv").css("left",l+"px");									// Left div
	$("#shivaDrawDiv").css("top",t+"px");									// Top
	$("#shivaDrawDiv").css("width",$(con).css("width"));					// Wid
	$("#shivaDrawDiv").css("height",i+"px");								// Hgt
	ctx=$("#shivaDrawCanvas")[0].getContext('2d');							// Get context
	ctx.clearRect(0,0,1600,1600);											// Clear canvas
	if ($.browser.msie)														// IE
		$("#shivaDrawDiv").css("z-index",2);								// Force on top
	else																	// All else
		$("#shivaDrawDiv").css("z-index",2000);								// Force on top
	if ($("#shivaDrawPaletteDiv").length)									// If palette is up
		$("#shivaDrawDiv").css('pointer-events','auto');					// Enable pointer clicks 
	else																	// If menu gone
		$("#shivaDrawDiv").css('pointer-events','none');					// Inibit pointer clicks 
	if (!this.overlay)														// Nothing to draw
		return;																// Quit
	this.DrawIdeaLinks(false);												// Draw idea link lines, if any												
	for (i=0;i<this.overlay.length;++i) {									// For each seg
		o=this.overlay[i];													// Point at it
		if (this.player) {													// If over a player
			now=Math.floor(this.player.currentTime());						// Get time in seconds
			if (o.s) {														// If a start defined
				v=o.s.split(":");											// Split
				if (v.length == 1)											// No mins
					v[1]=v[0],v[0]=0;										// Clear
				s=Number(v[0]*60)+Number(v[1]);								// Set start
				}
			if (o.e == "end")	e=36000;									// End to 10 hrs
			else if (o.e) {													// Get set end
				v=o.e.split(":");											// Split
				if (v.length == 1)											// No mins
					v[1]=v[0],v[0]=0;										// Clear
	 			e=Number(v[0]*60)+Number(v[1]);								// Set start
				}	
			if ((now < s) || (now >= e))									// If out of range
				continue;													// Skip it
			}
		$("#shtx"+i).remove();												// Remove text
		$("#shim"+i).remove();												// Remove image
		$("#shivaIdea"+i).remove();											// Remove idea node
		if (o.type == 5) {													// Idea map
			var dd="#shivaIdea"+i;											// Div id										
			str="<div id='"+dd.substr(1)+"'";
			str+="style='position:absolute;padding:8px;font-family:sans-serif;text-align:center;";
			str+="margin:0px;border:1px solid "+o.ideaEdgeCol+";background-color:"+o.ideaBackCol+";";
			str+="left:"+o.ideaLeft+"px;top:"+o.ideaTop+"px;'>";
			str+="</div>";		
			$("#shivaDrawDiv").append(str);									// Add div
			str="<textarea";												// Assume display mode
			if ((shivaLib.dr) && (shivaLib.dr.curTool != 6))				// If not idea editing
				str+=" readonly='readonly'"; 								// Makes it read only
			str+=" id='shtx"+i+"' onchange='shivaLib.dr.SetShivaText(this.value,"+i+")' "
			str+="style='overflow:hidden;vertical-align:middle;";			// Textarea style
			if ((!shivaLib.dr) || ((shivaLib.dr) && (shivaLib.dr.curTool != 6)))	 // If not idea editing
				str+="resize:none;"; 										// Remove resizer
			str+="height:"+o.ideaHgt+"px;width:"+o.ideaWid+"px;color:"+o.ideaTextCol+";" // Size/color textarea
			if (o.ideaBold)													// If bold
				str+="font-weight:bold;";									// Add tag
			str+="background:transparent;border:none;margin:0px;padding:0px;font-family:sans-serif;text-align:center;'/>";
			$(dd).append(str);												// Add text area
			$("#shtx"+i).html(o.text);										// Set text
			if (o.ideaShape == "Round box") 								// Round box
				$(dd).css("border-radius","8px");							// Small round border
			else if (o.ideaShape == "Oval") 								// Oval
				$(dd).css("border-radius",$(dd).css("height"));				// Set border to height
			else if (o.ideaShape == "Circle") {								// Circle
				var w=$(dd).width();										// Get wid
				$(dd).css("border-radius",(w/2+16)+"px");					// Set border 1/2 wid + padding
				$(dd).css("height",w+"px");									// Hgt same as wid
				}
			if (o.ideaGradient) {											// If a gradient
				if ($.browser.mozilla)										// Firefox			
				 	$(dd).css("background","-moz-linear-gradient(top,#f0f0f0,"+o.ideaBackCol+")");
				else														// All other browsers
					 $(dd).css("background","-webkit-linear-gradient(top, #f0f0f0 0%,"+o.ideaBackCol+" 100%)");
				}

			if ((shivaLib.dr) && (shivaLib.dr.curTool == 6)) {				// If in idea map editing mode

				$("#shtx"+i).resizable( { stop: function(event,ui) {		// ON RESIZE HANDLER
					var num=ui.originalElement[0].id.substr(4);				// Get index
					shivaLib.dr.segs[num].ideaWid=ui.size.width-4;			// Set width
					shivaLib.dr.segs[num].ideaHgt=ui.size.height-4;			// Set height
					} });
	
				$(dd).draggable( { drag:function(event, ui) {				// ON DRAG HANDLER
						var num=this.id.substr(9);							// Get index
						var dx=ui.position.left-shivaLib.dr.segs[num].ideaLeft;	// Dx
						var dy=ui.position.top-shivaLib.dr.segs[num].ideaTop;	// Dy
						shivaLib.dr.segs[num].ideaLeft=ui.position.left;	// Set left
						shivaLib.dr.segs[num].ideaTop=ui.position.top;		// Set top
						shivaLib.dr.MoveIdeaChildren(num,dx,dy);			// Move children
						shivaLib.DrawIdeaLinks(true);						// Draw idea link lines										
						},
					stop:function(event, ui) {
						shivaLib.dr.DrawOverlay();								// Redraw
					} });
	
				$(dd).droppable( { drop:function(event, ui) {				// ON DROP HANDLER
					var from=ui.draggable.context.id.substr(9);				// From id
					var to=event.target.id.substr(9);						// To id
					shivaLib.dr.IdeaDrop(from,to);							// React to drop			
					}});
	
				}	
			continue;														// Next segment
			}
		cur=o.curve;														// Curve
		col=o.color;														// Get col
		ecol=o.edgeColor;													// Ecol
		ewid=Math.floor(o.edgeWidth/10)+1;									// Edge is .5-10							 															
		a=Number(o.alpha)/100;												// Alpha is 0-1											
		if (o.edgeColor == -1)	ewid=0;										// None has no width
		if ((o.x) && (o.x.length < 2))										// If only 1 point
			continue;														// Skip it
		if (o.type == 1) 													// Circle
			this.g.DrawCircle(ctx,o.color,a,o.x[0],o.y[0],Math.abs(o.x[0]-o.x[1]),ecol,ewid);
		else if (o.type == 2) {												// Box
			if (o.curve)													// If curves on
				this.g.DrawRoundBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);
			else															// Line
				this.g.DrawBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			}
		else if (o.type == 3) {												// Text
			if (o.curve)													// If curves
				this.g.DrawRoundBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);
			else															// Lines
				this.g.DrawBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			str="<text";													// Assume display mode
			if ($("#shivaDrawPaletteDiv").length)							// If palette is up
				str+="area"; 												// Textarea makes it editable
			str+=" id='shtx"+i+"' onchange='shivaLib.dr.SetShivaText(this.value,"+i+")' ";
			str+="style='position:absolute;background:transparent;border:none;margin:8px;font-family:sans-serif;";
			str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;opacity:"+(o.alpha/100)+";";
			str+="width:"+(Math.abs(o.x[1]-o.x[0])-18)+"px;height:"+Math.abs(o.y[1]-o.y[0]-18)+"px'/>";
			$("#shivaDrawDiv").append(str);									// Add div
			$("#shtx"+i).css("color",o.textColor).css("text-align",o.textAlign.toLowerCase());	// Color/align
			$("#shtx"+i).css("font-size",Number(o.textSize)+12);			// Set font size
			$("#shtx"+i).html(o.text);										// Set text
			}
		else if (o.type == 4) {												// Image
			this.g.DrawBar(ctx,-1,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);
			str="<div id='shim"+i+"' style='position:absolute;background:transparent;opacity:"+(o.alpha/100)+";";
			w=Math.abs(o.x[1]-o.x[0]);
			h=Math.abs(o.y[1]-o.y[0]);
			str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;";
			str+="width:"+(w-16)+"px;height:"+h+"px'>";
			str+="<img id=shimi"+i+" src='"+o.imageURL+"' width='"+w+"'/>";	// Add img tag
			$("#shivaDrawDiv").append(str);									// Add div
			}
		else if ((o.x) && (o.x.length == 2) && (!o.arrow))					// Polygon
			this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);	// Use line if only 2 points
		else if ((o.x) && (!o.arrow)) 										// > 2 pts
			this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur == true));	// Regular poly
		if ((o.x) && (o.type == 0) && (o.arrow)) {							// If line arrow
			var xx=[],yy=[];												// Arrow arrays
			var n=o.x.length-1;												// Last point
			var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);				// Angle of line
			var h=Math.max(12,ewid*4);										// Set size
			xx[0]=o.x[n]-h*Math.cos(aa-Math.PI/6),
			yy[0]=o.y[n]-h*Math.sin(aa-Math.PI/6);			
 			xx[1]=o.x[n];	yy[1]=o.y[n];									// Tip point
			xx[2]=o.x[n]-h*Math.cos(aa+Math.PI/6),
			yy[2]=o.y[n]-h*Math.sin(aa+Math.PI/6);			
 			this.g.DrawPolygon(ctx,ecol,a,xx,yy,ecol,0,false);				// Regular draw arrow
			o.x[n]=((xx[2]-xx[0])/2)+xx[0];									// Mid x
			o.y[n]=((yy[2]-yy[0])/2)+yy[0];									// Mid y
			if (o.x.length == 2)											// Only 2 pyt
				this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);	// Use line if only 2 points
			else
				this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur == true));	// Regular poly
			o.x[n]=xx[1];	o.y[n]=yy[1];									// Restore last point
			}
		}
	if ((shivaLib.dr) && (shivaLib.dr.curTool == 6)) 						// If in idea map editing mode
		$.proxy(shivaLib.dr.HighlightIdea(),shivaLib.dr);					// Set highlight
}

SHIVA_Show.prototype.DrawIdeaLinks=function(clear)							// DRAW IDEA LINK LINES
{
	var i,o,fx,fy,tx,ty;
	var ctx=$("#shivaDrawCanvas")[0].getContext('2d');						// Get context
	if (clear)																// If clearing the canvas
		ctx.clearRect(0,0,1600,1600);										// Clear canvas
	for (i=0;i<this.overlay.length;++i) {									// For each idea
		o=this.overlay[i];													// Point at idea
		if ((o.type != 5) || (o.ideaParent == -1))							// Not an idea node or a base node
			continue;														// Skip it
		dleftToRight=leftToRight=true;										// Assume l-r
		dir2=dir=2;															// Dir divisors
		tx=o.ideaLeft-0+(o.ideaWid/2+8);									// Cx from
		ty=o.ideaTop-0+(o.ideaHgt/2)+12;									// Cy
		o=this.overlay[o.ideaParent];										// Point at parent
		fx=o.ideaLeft-0+(o.ideaWid/2+8);									// Cx to
		fy=o.ideaTop-0+(o.ideaHgt/2+12);									// Cy
		if (tx < fx)														// If a set and left of control
			dleftToRight=leftToRight=false;									// Set l-r flag to false
		var x=[fx,tx];														// line
		var y=[fy,ty];														// line
		this.g.DrawPolygon(ctx,-1,.75,x,y,"#666",1,true);					// Draw line
		}
}

SHIVA_Show.prototype.Resize=function(wid) 								// RESIZE ELEMENT
{
	if (this.options) {														// If has data
		if (this.options.width) {											// And width
			if (this.options.width != wid) {								// And width is different
 				var asp=1.0;												// Assume 1:1
				if (this.options.height)									// If a height set
					asp=this.options.height/this.options.width;				// Get aspect
				this.options.width=wid;										// Set wid
				this.options.height=wid*asp;								// Set calculated hgt
				this.DrawElement(this.options);								// Redraw
				return true;												// Changed
				}
			}
		}
	return false;															// Unchanged
}

SHIVA_Show.prototype.SetLayer=function(num, mode, type) 				// SET LAYER
{
	var i;
	var group=this.options.shivaGroup;										// Get group

	if (this.items) {														// If items
		if (type == "GoTo")	{												// If a goto 
			for (i=0;i<this.items.length;++i) {								// For each item
				if (this.items[i].layerType == "GoTo")						// If a goto
					this.items[i].visible="false";							// Turn them all off
				}
			}
		if (this.items[num]) 												// If valid item	
			this.items[num].visible=mode.toString();						// Set visibility to mode as string
		}

	if (group == "Map")
		this.DrawMapOverlays();												
	else if (group == "Earth") 
		this.DrawEarthOverlays();												
	else if (group == "Subway") 
		this.DrawSubway();
	else if (group == "Timeline") 
		this.DrawTimeline();
}

SHIVA_Show.prototype.FillElement=function(table, query) 								// FILL ELEMENT WITH DATA TABLE
{
	var group=this.options.shivaGroup;														// Get type
	if (group == "Visualization") {															// Google api
	 	this.map.setDataSourceUrl(table);													// Set table
	 	if ((query) && (query != "NO CONDITIONS SET")) {									// If query set
	  		var v=query.split(" ");															// Divide into parts
	  		for (i=0;i<v.length;++i) {														// For each part
	  			if (v[i] == "has") {														// If has
	  				v[i++]="LIKE";															// Use LIKE
	  				v[i]="'%"+v[i]+"%'";													// %%
	  				}
	  			}
	 		query="";																		// Clear
	 		for (i=0;i<v.length;++i) 														// For each part
	  			query+=v[i]+" ";															// Rebuild query
	 		this.map.setQuery(query);														// Set query
			}
		this.map.draw();																	// Redraw
		}
	else if (group == "Dialog") {															// Infobox
	}
}

SHIVA_Show.prototype.Annotate=function() 												// SHOW ANNOTATION PALATTE
{
	if (!this.dr) {																			// If not already instantiated
		this.Draw({shivaGroup:"Draw"});														// Create canvas
		this.dr=new SHIVA_Draw(this.container);												// Alloc drawing module
		}
	else this.dr.DrawPalette();																// Draw palette
	this.Sound("click");																	// Click
}


//  GOOGLE EARTH   /////////////////////////////////////////////////////////////////////////////////////////// 

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
				obj.set(link,true,fly); 								// Sets the flyToView
			}
		if (obj) {														// If an object
			obj.setOpacity(opacity);									// Set opacity
			obj.setVisibility(items[i].visible == "true");				// Show/hide it
			}
		}
	this.map.getView().setAbstractView(lookAt);							// Go there
}

//  WEBPAGE   /////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawWebpage=function() 											//	DRAW WEBPAGE
{
	$("#"+this.container+"IF").remove();													// Remove old one
	var	str="<iframe src='"+this.options.url+"' id='"+this.container+"IF' style='"; 		// Iframe
	str+="width:"+$("#"+this.container).css("width")+";height:"+$("#"+this.container).css("height")+"'>";
	$("#"+this.container).append(str);														// Add to container
	this.SendReadyMessage(true);															// Send ready message									
}

                                       
//  NETWORK   /////////////////////////////////////////////////////////////////////////////////////////// 

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
			CanvasStyles: {},
			},	
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
	new google.visualization.Query(json.dataSourceUrl).send($.proxy(this.Google2Jit,this));
	this.config=this.Config[this.chartType]; 
	$jit.id(this.container).style.height=this.config.height+"px";
	$jit.id(this.container).style.width=this.config.width+"px";	
	$jit.id(this.container).style.backgroundColor=this.config.background.CanvasStyles.fillStyle;
}

VIZ.prototype.Google2Jit=function(rs)
{	
	var table=rs.getDataTable();
	var numRows = table.getNumberOfRows();
	var numCols = table.getNumberOfColumns();
	
	// Clean up data (trim leading and ending spaces) and save to local array
	// Crucial -- spaces will break things
	var ROWS = [];
	for (var i = 0; i < numRows; i++) {
		ROWS[i] = [];
		for (var j = 0; j < numCols; j++) {
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
		
		shivaLib.SendReadyMessage(true);					// Send ready msg to drupal manager
	}		

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
		            
		config.onCreateLabel = function(domElement, node) {
			domElement.className = 'shiva-node-label';
			domElement.innerHTML = node.name;
			domElement.onclick = function(){
				rgraph.onClick(node.id,{});
			};
			var style = domElement.style;
			style.fontSize 		= config.Label.size + 'px';
			style.color 			= config.Label.color;
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
		var jsonData 	= obj.data;
		var config		= obj.Config[obj.chartType];
		var div 			= obj.container;
		config.injectInto = div; 
		
		config.onCreateLabel = function(domElement, node){
			var style = domElement.style;
			domElement.className = 'shiva-node-label';
			style.fontSize 		= config.Label.size + 'px';
			style.color 			= config.Label.color;
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
			//console.log(node.data);
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
		var config	= obj.Config[obj.chartType];
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
	},	
}


//  SUBWAY   /////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawSubway=function(oldItems) 											//	DRAW SUBWAY
{
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var g=this.g=new SHIVA_Graphics();
	var items=new Array();
	if (oldItems)
		items=oldItems;
	else
	   	for (var key in options) {
			if (key.indexOf("item-") != -1) {
				var o=new Object;
				var v=options[key].split(';');
				for (i=0;i<v.length;++i)
					o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				items.push(o);
				}
			}
	this.items=items;
	$(con).html("");
	g.CreateCanvas("subwayCanvas",container);
	var ctx=$("#subwayCanvas")[0].getContext('2d');
	$("#subwayCanvas").attr("width",options.cols*options.gridSize+30);
	$("#subwayCanvas").attr("height",options.rows*options.gridSize+30);
	$("#textLayer").remove();
	$(con).append("<div id='textLayer'></div>");
	ctx.clearRect(0,0,1000,1000);
	DrawBack();
	DrawTracks();
	DrawStations();
	DrawLegend();
	this.SendReadyMessage(true);											
	
	function DrawLegend()
	{
		var i,str;
		var x=Number(options.gridSize*5)+8;
		var y=Number(options.gridSize*options.rows);
		for (i=0;i<items.length;++i) 
			if (items[i].title) 
				y-=16;
		for (i=0;i<items.length;++i) 
			if ((items[i].title) && (items[i].visible != "false")) {
				g.DrawLine(ctx,"#"+items[i].lineCol,1,options.gridSize,y,x-8,y,items[i].lineWid);								
				str="<div style='position:absolute;left:"+x+"px;top:"+(y-6)+"px'>"+items[i].title;
				$("#textLayer").append(str+"</div>");
				y+=16;
				}
	}
	
	function DrawTracks()
	{
		var i,j,v,pts
		var xs=new Array();
		var ys=new Array();
		var gw=options.gridSize;
		for (i=0;i<items.length;++i) {
			if (items[i].visible == "false")
				continue;
			xs=[];	ys=[]
			if (!items[i].coords)
				continue;
			pts=items[i].coords.split(",");
			for (j=0;j<pts.length;++j) {
				v=pts[j].split(".");
				xs.push(v[0]*gw);	
				ys.push(v[1]*gw);	
				}
			g.DrawPolygon(ctx,-1,1,xs,ys,"#"+items[i].lineCol,items[i].lineWid,true);
			}
	}

	function DrawStations()
	{
		var pts,tp,align,link="",lab="";
		var i,j,x,y,y2,x2,w,w2,style,str,span;
		if (!options.stations)
			return;
		pts=options.stations.split("~");
		for (j=0;j<pts.length;++j) {
			v=pts[j].split("`");
			x2=x=Number(v[0])*Number(options.gridSize);
			y2=y=Number(v[1])*Number(options.gridSize);
			tp=v[2];
			style=v[3];
			lab=v[4];
			link=v[5]
			w=8;
			w2=w/2;
			if (style == "S")
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);								
			else if (style == "s")
				g.DrawCircle(ctx,"#fff",1,x,y,w*.7,"#000",w/4);								
			else if (style.charAt(0)== "i") {
				span=Number(style.charAt(1));
				x2=x+Number(span*options.gridSize);
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);				
				g.DrawCircle(ctx,"#fff",1,x2,y,w,"#000",w2);								
				g.DrawLine(ctx,"#fff",1,x,y,x2,y,w/2);								
				g.DrawLine(ctx,"#000",1,x+Number(w),y-w2,x2-w,y-w2,w2);								
				g.DrawLine(ctx,"#000",1,x+Number(w),y+w2,x2-w,y+w2,w2);								
				}
			else if (style.charAt(0)== "I") {
				span=Number(style.charAt(1));
				y2=y+Number(span*options.gridSize);
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);				
				g.DrawCircle(ctx,"#fff",1,x,y2,w,"#000",w2);								
				g.DrawLine(ctx,"#fff",1,x,y,x,y2,w/2);								
				g.DrawLine(ctx,"#000",1,x-w2,y+Number(w),x-w2,y2-w,w/2);								
				g.DrawLine(ctx,"#000",1,x+w2,y+Number(w),x+w2,y2-w,w/2);								
				}
			w=Number(options.gridSize);
			if (tp == "r") {	x2=x2+w-w2;				align='left';		y2=y+((y2-y)/2); }
			if (tp == "l") {	x2=x-200-w+w2;			align='right';		y2=y+((y2-y)/2); }
			if (tp == "t") {	x2-=((x2-x)/2)+100;		align='center';		y2=y-w+w2; 		 }
			if (tp == "b") {	x2-=((x2-x)/2)+100;		align='center';		y2=y2+w-w2; 	 }
			str="<div id='shivaSubtx"+j+"' style='position:absolute;color:#000;width:200px;left:"+x2+"px;top:"+(y2-6)+"px;text-align:"+align+"'>";
			if (link)
				str+="<a href='"+link+"' target='_blank' style='color:#000;text-decoration: none;'>"+lab+"</a>";
			else
				str+=lab;
			$("#textLayer").append(str+"</div>");
			if (tp == "t") 	
				$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()+4)+"px");
			else if ((tp == "r") || (tp == "l")) 	
				$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()/2)+"px");
			}
	}

	function DrawBack()
	{
		var gridSize=options.gridSize;
		var numRows=options.rows;
		var numCols=options.cols;
		ctx.textAlign="center";		
		if (!options.showGrid) {
			g.DrawRoundBar(ctx,"#"+options.backCol,1,0,0,numCols*gridSize,numRows*gridSize,options.backCorner);
			return;	
			}
		for (i=1;i<=numCols;++i) {
			g.DrawLine(ctx,"#cccccc",1,i*gridSize,gridSize,i*gridSize,numRows*gridSize,.5);
			g.DrawText(ctx,i,(i*gridSize),gridSize/2,"color=#999");
			}
		for (i=1;i<=numRows;++i) {
			g.DrawLine(ctx,"#cccccc",1,gridSize,i*gridSize,numCols*gridSize,i*gridSize,.5);
			g.DrawText(ctx,i,gridSize/2,(i*gridSize)+3,"color=#999");
			}
		}
}


//  CONTROL   /////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawControl=function() 											//	DRAW CONTROL
{
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var items=new Array();
 	this.items=items;
	var _this=this;
    for (var key in options) {
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			var v=options[key].split(';');
			for (i=0;i<v.length;++i) {
				v[i]=v[i].replace(/http:/g,"http`");
				o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				}
			items.push(o);
			}
		}
	if (options.chartType == "Dialog") 
		$.proxy(DrawDialog(items),this);
	else if (options.chartType == "Selector") 
		$.proxy(DrawSelector(items),this);
	else if (options.chartType == "TimeSlider")
		$.proxy(DrawTimeSlider(items),this);
	else if (options.chartType == "TimeStepper")
		$.proxy(DrawTimeStepper(items),this);
	else if (options.chartType == "InfoBox")
		$.proxy(DrawInfoBox(items),this);
	this.SendReadyMessage(true);											

	// Individual types:

	function DrawTimeStepper(items)
	{
		var i;
		var dd=container+"Stp";
		var str="<span id='"+dd+"'>";
		for (i=0;i<items.length;++i) { 
			str+="<input type='radio' id='stp"+i+"' name='stepper'"; 
			if (!i)
				str+=" checked=checked";
			str+="/><label for='stp"+i+"'>"+(i+1)+"</label>"; 
			items[i].ans=items[i].def;
			}
		str+="<input type='radio' id='stp"+i+"' name='stepper'"; 
		str+="/><label for='stp"+i+"'>NEXT</label>"; 
		str+="</span>";
		$(con).html(str);		
		$(con).css("text-align","left");		
		$(con).css("width",((items.length*25)+80)+"px");		
		$("#"+dd).buttonset().change(function(e) { shiva_Step(e.target.id.substr(3),_this) });
		$("#stp"+i).button({ text: true, icons: { primary: "ui-icon-triangle-1-e" }});
		}

	function DrawTimeSlider(items)
	{
		var str="";
		var dd=con+"Int";
		$(dd).remove();
		$(con).append("<div id='"+dd.substr(1)+"'/>");
		$(con).css("height","30px");		
		$(con).css("width","30px");		
		options.orientation=options.orientation.toLowerCase();
		options.step=Number(options.step);
		if (options.orientation == "vertical") {
			$(dd).css("height",options.size+"px");
			$(con).css("height",options.size+"px");
			}
		else{		
			$(dd).css("width",options.size+"px");
			$(con).css("width",options.size+"px");
			}
		if (options.type == "Bar")
			options.range="min";
		else if (options.type == "Range")
			options.range=true;
		if ((!options.def) && (options.type == "Range"))
			options.def="25,75";
		if (options.def.indexOf(",") == -1)
			options.value=Number(options.def);
		else{
			options.values=new Array();
			options.values[0]=Number(options.def.split(",")[0]);
			options.values[1]=Number(options.def.split(",")[1]);
			}	
		if (!$('#sliderBack').length) {
			var mc=document.createElement('canvas'); 
			mc.setAttribute('id','sliderBack'); 
			$(dd).append(mc)
			sliderContext=mc.getContext('2d');
			}
		$(dd).slider("destroy");
		$(dd).slider(options);
		$(dd).bind("slidestop", function(e, ui) { 								// On slide stop
			var which=-1;														// Assume 1st
			var val=ui.value;													// Get value
			if (ui.values)														// If a range
				val=ui.values[0];												// Get 1st slider value
			if (ui.value != val) {												// If second slider
				which=0;														// Set name
				val=ui.values[1];												// Use 2nd val
				}
			RunGlue(con.substr(1),which,val,"") 
			});
		DrawSliderTicks();
	}

	function DrawSliderTicks()
	{
		var g=_this.g;
		if (!g)
			g=_this.g=new SHIVA_Graphics();
		var hgt=40,wid=40,pos,val;
		var n=Number(options.ticks);
		var showValues=(options.showValues == "true")
		var min=Number(options.min);
		var max=Number(options.max);
		var isVert=(options.orientation == "vertical");
		if (isVert)
			hgt=options.size;
		else
			wid=options.size;
		$('#sliderBack').attr('width',wid);
		$('#sliderBack').attr('height',hgt);
		var inc=Number(options.size/(n+1));
		var pos=inc;
		var tinc=Math.abs(max-min)/(n+1);
		var tpos=tinc;
		if (!isVert)
			sliderContext.textAlign="center";
		for (i=0;i<n;++i) {
			if (isVert)
				g.DrawLine(sliderContext,"#000",1,8,pos,15,pos,.5);
			else
				g.DrawLine(sliderContext,"#000",1,pos,8,pos,15,.5);
			if (showValues) {
				val=tpos;
				if (Math.abs(max-min) > 4)
					val=Math.round(val);
				else{
					val=Math.round(tpos*100);
					val=Math.floor(val/100)+"."+(val%100);
					}
				val=Number(val)+min;
				if (isVert)
					sliderContext.fillText(val,18,Number(options.size)-pos+3);
				else	
					sliderContext.fillText(val,pos,25);
				}
			pos+=inc;
			tpos+=tinc;
			}
		if (showValues) {
			sliderContext.font="bold 10px Arial";
			sliderContext.textAlign="left";
			if (isVert) {
				sliderContext.fillText(min,14,hgt);	
				sliderContext.fillText(max+options.suffix,14,10);	
				}
			else{
				sliderContext.fillText(min,0,25);	
				sliderContext.textAlign="right";
				sliderContext.fillText(max+options.suffix,wid,25);	
				}
			sliderContext.font="";
			}
	}
		
	function DrawSelector(items)
	{
		var i,o,nChars=0;
		var dd=container+"Sel";
		var str="<span id='"+dd+"'>";
		for (i=0;i<items.length;++i) { 
			o=items[i];
			nChars+=o.label.length+5;
			if (items[i].type)	nChars+=4;
			if (options.style == "Button") 
				str+="<input type='button' id='sel"+i+"' onclick='RunGlue(\""+container+"\","+i+",\"Checked\")' value='"+o.label+"'>"; 
			else if (options.style == "Toggle") 
				str+="<input type='checkbox' id='sel"+i+"' onclick='RunGlue(\""+container+"\","+i+",this.checked?\"Checked\":\"Unchecked\")'/><label for="+"'sel"+i+"'>"+o.label+"</label>"; 
			else{
				str+="<input type='radio' id='sel"+i+"' name='selector' onclick='RunGlue(\""+container+"\","+i+",\"Checked\",this.name)'"; 
				if (o.def == "true")
					str+=" checked='sel"+i+"'";
				if (!items[i].label)
					str+="/><label for='sel"+i+"'>&nbsp;</label>"; 
				else
					str+="/><label for='sel"+i+"'>"+o.label+"</label>"; 
				}
			}
		str+="</span>";
		$(con).html(str);		
		$(con).css("text-align","left");		
		$("#"+dd).buttonset();
		if (options.style == "Radio") 
			$("#"+dd).change=function() { RunGlue(container,i,this.checked?"Checked":"Unchecked",this.name) };
		$(con).css("width",(nChars*6)+"px");		
		for (i=0;i<items.length;++i)  
			if (items[i].type != "Button")	{
				items[i].type=items[i].type.replace(/\./g,"");
				items[i].type=items[i].type.replace(/ui-icon-/g,"");
				$("#sel"+i).button({ text: true, icons: { primary: "ui-icon-"+items[i].type }});
				}
	}
	 
	function DrawDialog(items)
	{
		var o,i,v,sty,str="";
		var dd="#"+container+"Dlg";
		$(dd).remove();
		$(con).append("<div id='"+container+"Dlg' style='border:1px solid #999;padding:8px;background-color:#f8f8f8;text-align:left' class='rounded-corners'/>");
		for (o in options){
       		v=options[o];
    		if (v == "true") 	v=true;
    		if (v == "false") 	v=false;
			options[o]=v;
			}
		if ((options.draggable) && (!_this.editMode))
			$(dd).draggable();
		if (options.title)		
			str+="<div align='center'><b>"+options.title+"</b></div><br>";
		for (i=0;i<items.length;++i) {
			o=items[i];
			if (o.type)
				sty=o.type.toLowerCase();
			if (sty == 'checkbox') {
				str+="<input type='"+sty+"'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				if (o.def)
					str+=" checked=checked";
				str+=" onClick='RunGlue(\""+container+"\","+i+",this.checked?\"Checked\":\"Unchecked\")'";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if (sty == 'radio') {
				str+="<input type='"+sty+"'";
				str+=" name='"+o.group+"' id='"+o.name+"'";
				if (o.def)
					str+=" checked=checked";
				str+=" onChange='RunGlue(\""+container+"\","+i+",this.checked?\"Checked\":\"Unchecked\",this.name)'";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if ((sty == 'input')  || (sty == 'range') || (sty == 'button')) {
				str+="<input type='"+sty+"' size='23'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				if (o.def)
					str+=" value='"+o.def+"'";
				if (sty == 'button')
					str+=" onClick='RunGlue(\""+container+"\","+i+",\"Clicked\")'";
				else
					str+=" onChange='RunGlue(\""+container+"\","+i+",this.value)'";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if (sty == 'combo') {
				str+="<select ";
				str+=" onChange='RunGlue(\""+container+"\","+i+",this.value)'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				str+=">";
				v=o.label.split("|");
				for (var j=0;j<v.length;++j) {
					str+="<option";
					if (o.def == v[j])
						str+=" selected='selected'";
					str+=">"+v[j]+"</option>";
					}
				str+="</select>";
				}
			else if (sty == 'line') {
				str+="<hr style='margin-top:.5em;margin-bottom:.5em'/>"; 
				continue;
				}
			else if (sty == 'text')
				str+="<span style='margin-top:.5em;margin-bottom:.5em'>"+o.label+"</span>"; 
			else if (sty == 'image') {
				str+="<input type='"+sty+"' src='"+o.def+"'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				str+=" onClick='RunGlue(\""+container+"\","+i+",\"Clicked\")'";
				str+="/>";
				}
			str+="<br/> ";
			}
		$(dd).html(str);
	}
	
	function DrawInfoBox(items)
	{
		var str="";	
		var min=0;
		var dd="#"+container+"Inf";
		$(dd).remove();
		$(con).append("<div id='"+container+"Inf' style='border:1px solid #999;padding:8px;text-align:left' class='rounded-corners'/>");
		for (o in options){
       		v=options[o];
    		if (v == "true") 	v=true;
    		if (v == "false") 	v=false;
			options[o]=v;
			}
		if (options.title)		
			str+="<div align='center'><b>"+options.title+"</b></div>";
		if ((options.closer) || (options.title)) {
			str+="<br/>";
			min=16;
			}
		var content="#"+container+"Con";
		str+="<div id='"+container+"Con'></div>"
		$(dd).html(str);
		if (options.backCol	== -1)		$(dd).css("background-color","transparent")
		else							$(dd).css("background-color","#"+options.backCol)
		if (options.frameCol == -1)		$(dd).css("border-color","transparent")
		else							$(dd).css("border-color","#"+options.frameCol)
		if (options.width  != "auto") 	$(dd).css("width",options.width+"px");
		if (options.height != "auto") {	
			$(dd).css("height",options.height+"px");
			$(content).css("height",options.height-min+"px");
			}
		if ((options.draggable) && (!_this.editMode))
			$(dd).draggable();
		if ((options.text) && (options.style == "Text"))				
			$(content).html(options.text);
		if (options.scroller)  			$(content).css("overflow","scroll").css("overflow-x","hidden"); 
		else 							$(content).css("overflow","hidden");
		if (options.closer) {
			var x=$(dd).width()-2;							
			str="<img id='Clo"+dd+"' src='closedot.gif' style='position:absolute;left:"+x+"px;top:5px' onclick='$(\"#\"+this.id.substr(4)).hide()'/>";
			$(dd).append(str);
			}
	}
		
}	// Dialog closure end

	function shiva_Step(num, obj)
	{
		if (num < 0)
			num=obj.lastStep-0+1;
		num=Math.min(num,obj.items.length-1);
		obj.lastStep=num;
		for (var i=0;i<obj.items.length;++i)
			$("#stp"+i).removeAttr("checked");
		$("#stp"+num).attr("checked",true);
		$("#shiva_stepq").remove();
		var str="<div id='shiva_stepq'><br/><b>"+obj.items[num].label+"</b><br/>";
		if (obj.items[num].ques.indexOf("|") != -1) {
			str+="<select name='shiva_stepa' id='shiva_stepa' onChange='shiva_onStepAnswer("+num+","+this+")'>";
			var v=obj.items[num].ques.split("|");
			for (var j=0;j<v.length;++j) {
				str+="<option";
				if (obj.items[num].ans == v[j])
					str+=" selected='selected'";
				str+=">"+v[j]+"</option>";
				}
			str+="</select></div>";
			$("#"+obj.container).append(str);
			}
		else if (obj.items[num].ques) {
			var e="onblur";
			if (obj.items[num].ques == "color")
				e="onfocus";
			str+="<input id='shiva_stepa' type='input' "+e+"='shiva_onStepAnswer("+num+","+this+")'></div>";
			$("#shiva_stepa").val(obj.items[num].ans);
			}			
		$("#"+obj.container).append(str);
		if (obj.items[num].ques) 
			RunGlue(obj.container,num,obj.items[num].ans);
		else
			RunGlue(obj.container,num,"checked");
		if ($("#accord").length)
			$("#accord").accordion({ active: num });
	}
	
	function shiva_onStepAnswer(num, obj)
	{
		if (obj.items[num].ques == "color")
			obj.ColorPicker(-1,"shiva_stepa");
		obj.items[num].ans=$("#shiva_stepa").val();
	}


//  IMAGE   /////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawImage=function() 												//	DRAW IMAGE
{
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var h=$(con).css('height');
	var w=$(con).css('width');
	var _this=this;
	
	if (options.dataSourceUrl.indexOf("//docs.google.com") != -1)
 	   	GetSpreadsheetData(options.dataSourceUrl,options.imgHgt,options.showImage,options.showSlide,options.transition,options.width);
 	 else if (options.dataSourceUrl) {
	   	$("#"+this.container).html("<img id='"+this.container+"Img' "+"width='"+options.width+"' src='"+options.dataSourceUrl+"'/>");
		$("#"+this.container).click( function() { _this.RunGlue(_this.container,-1,"clicked"); });
		this.SendReadyMessage(true);											
		}
	else
		this.SendReadyMessage(true);											
		
 	  function GetSpreadsheetData(file,imgHgt,showImage,showSlide,trans,wid) 	{
  		var query=new google.visualization.Query(file);
   		query.send(handleQueryResponse);
 
	    function handleQueryResponse(response) {
		    var a,i,j;
			var data=response.getDataTable();
			var cols=data.getNumberOfColumns();
			var rows=data.getNumberOfRows();
	 		var rowData=new Array();
 			for (i=0;i<rows;++i) {
 				a=new Array()
				for (j=0;j<cols;++j) 
					a.push(data.getValue(i,j));
   				rowData.push(a);
    			}
     		AddImages(rowData,imgHgt,showImage,showSlide,trans,wid);
		 	shivaLib.SendReadyMessage(true);											
  	     }
 	}

   	function AddImages(data, imgHgt, showImage, showSlide, transition, wid)
 	{
		var str="<div id='gallery' class='ad-gallery'>"
		if (showImage == "true")
			str+="<div class='ad-image-wrapper'></div>";
		if (showSlide == "true")
			str+="<div class='ad-controls'></div>";
		str+="<div class='ad-nav'><div class='ad-thumbs'><ul class='ad-thumb-list'>"
		for (var i=1;i<data.length;++i) {
			str+="<li><a href='"+data[i][0]+"'><img height='"+imgHgt+" 'src='"+data[i][0]+"'";
			if (data[i][1])
				str+=" title='"+data[i][1]+"'";		
			if (data[i][2])
				str+=" alt='"+data[i][2]+"'";		
	   		str+=" class='image"+i+"'></a></li>";
	   		}
	    str+="</ul></div></div></div>";
	    $("#"+container).html(str);
	  	$('.ad-gallery').adGallery()[0].settings.effect=transition;
	    $("#gallery").css("background","#ddd");
		$(".ad-gallery").css("width",wid) 
 	}

}  // Closure end

//  VIDEO   /////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawVideo=function() 												//	DRAW VIDEO
{
	var v,t;
	var options=this.options;
//	options.dataSourceUrl="kaltura_player_1_uyp6bkha"; 
//	options.dataSourceUrl="http://player.vimeo.com/video/17853047"; 
//	options.dataSourceUrl="http://www.primaryaccess.org/music.mp3";	
	var container=this.container;
	var con="#"+container;
	var id=options.dataSourceUrl;
	if (typeof(Popcorn) != "function")
		return;
	if (typeof(Popcorn.smart) != "function")
		return;
	var base="http://www.youtube.com/watch?v=";
	$(con).css("width",options.width+"px");
	$(con).css("height",options.height+"px");
	if ((options.dataSourceUrl.match(/vimeo/)) || (!isNaN(options.dataSourceUrl)))
		base="http://vimeo.com/";
	else if (options.dataSourceUrl.match(/kaltura/)) {
		var s=options.dataSourceUrl.indexOf("kaltura_player_");
		id=options.dataSourceUrl.substring(s+15);
		id="https://www.kaltura.com/p/2003471/sp/0/playManifest/entryId/"+id+"/format/url/flavorParamId/301951/protocol/https/video.mp4"
		base=""
		}
	else if ((options.dataSourceUrl.match(/http/g)) && (!options.dataSourceUrl.match(/youtube/g)))
		base="";
	if (this.player) {
    	this.player.destroy();
    	$(con).empty();
    	this.player=null;
    	}
  	if (!this.player)
		this.player=Popcorn.smart(con,base+id);
	this.player.media.src=base+id;
	if (options.end) {
		v=options.end.split(":");
		if (v.length == 1)
			v[1]=v[0],v[0]=0;
    	this.player.cue(Number(v[0]*60)+Number(v[1]),function() { this.pause()} );
    	}
	this.player.on("timeupdate",drawOverlay);
	this.player.on("loadeddata",onVidLoaded);

	if (this.ev) 
		t=this.ev.events;
	else
		t=options["shivaEvents"];
	this.ev=new SHIVA_Event(this);
	if ((t) && (t.length))	
		this.ev.AddEvents(t);

 	function onVidLoaded()	{
		var v=shivaLib.options.start.split(":");
		if (v.length == 1)
			v[1]=v[0],v[0]=0;
    	shivaLib.player.currentTime(Number(v[0]*60)+Number(v[1]));
		shivaLib.player.volume(shivaLib.options.volume/100);
	   	if (shivaLib.options.autoplay == "true")
    		shivaLib.player.play();
    	else
     		shivaLib.player.pause();
		$("#shivaEventDiv").height(Math.max(shivaLib.player.media.clientHeight-40,0));
   	}

  	function drawOverlay()	{
   		shivaLib.DrawOverlay();
   		}		
	this.SendReadyMessage(true);											
}
  
//  TIMELINE   /////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawTimeline=function() 											//	DRAW TIMELINE
{
  var i;
  var stimeline = new Object();
  
  if($('link[href*=timeglider]').length == 0) {
    $('head').append('<link rel="stylesheet" href="timeglider/css/Timeglider.css" type="text/css" media="screen" title="no title" charset="utf-8">');
  }
  
	stimeline.events=null;
	stimeline.options=this.options;
	stimeline.container=this.container;
	stimeline.con="#"+stimeline.container;

  if($(stimeline.con).find('*').length > 0) {
    // Sets timeline options. If the options that are different can be set on the fly, returns try
    // and the timeline is resized and this function returns. Otherwise, the whole timeline needs to be redrawn.
    var ret = $(stimeline.con).timeline('setOptions', jQuery.extend(true, {}, stimeline.options), false);
    if(ret) {
      $(stimeline.con).timeline('resize');
      return;
    } 
  } 
  // Always set width and height before drawing timeline as the layout depends on the container size.
  $(stimeline.con).css('width',stimeline.options['width']+"px");
  $(stimeline.con).css('height',stimeline.options['height']+"px");
  
  GetSpreadsheetData(stimeline.options.dataSourceUrl);   // Get data from spreadsheet, contains callback to draw timeline
      
  function GetSpreadsheetData(file, conditions) 
  {
    lastDataUrl=file.replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
    var query=new google.visualization.Query(lastDataUrl);
    if (conditions)
      query.setQuery(conditions);
      query.send(handleQueryResponse);
 
    function handleQueryResponse(response) {
      
      var i,j,key,s=0;
      var data=response.getDataTable();
      var rows=data.getNumberOfRows();
      var cols=data.getNumberOfColumns();
      eventData={ events:new Array() };
      if (!$.trim(data.getColumnLabel(0)))
        s=1;
      for (i=s;i<rows;++i) {
        o=new Object();
        for (j=0;j<cols;++j) {
          key=$.trim(data.getColumnLabel(j));
          if (!key)
            key=$.trim(data.getValue(0,j));
          if ((key == "icon") && (!data.getValue(i,j)))
            continue;
        if ((key == "startdate") || (key == "enddate")) {
          if (data.getFormattedValue(i,j))
            //o[key]=data.getFormattedValue(i,j).replace(/\//g,'-');
            o[key]=ConvertTimelineDate(data.getValue(i,j));
            //console.log(o[key]);
          }
        else  
          o[key]=data.getValue(i,j);
        }
        eventData.events.push(o);
      }
      
      stimeline.events = eventData.events;
      var stldata = [{
        "id":"stl" + (new Date()).getTime(),
        "title":stimeline.options.title,
        "description":"<p>" + stimeline.options.description + "</p>",
        "focus_date": stimeline.options.focus_date,
        "timezone":stimeline.options.timezone,
        "initial_zoom":stimeline.options.initial_zoom * 1,
        "events": stimeline.events
      }];
      $(stimeline.con).timeline('destroy');
      $(stimeline.con).html('');
      window.shivaTimeline =  $(stimeline.con).timeline({
          "min_zoom":stimeline.options.min_zoom * 1, 
          "max_zoom":stimeline.options.max_zoom * 1, 
          "icon_folder": 'timeglider/img/icons/', // check to see if we can make this a parameter
          "data_source":stldata,
          "show_footer":Boolean(stimeline.options.show_footer),
          "display_zoom_level":Boolean(stimeline.options.display_zoom_level),
          "constrain_to_data":false,
          "image_lane_height":60,
          "loaded":function (args, data) { 
            $(stimeline.con).timeline('setOptions', stimeline.options, true);
            shivaLib.SendReadyMessage(true); 
          }
      });
      
      // Make event modal windows draggable
      window.stlInterval = setInterval(function() {
        $('.timeglider-ev-modal').draggable({cancel : 'div.tg-ev-modal-description'});
      }, 500);
    }
  }
}


function ConvertTimelineDate(dateTime)                   
{
  var dt = new Date(dateTime);
  var mn = padZero(dt.getMonth() + 1);
  var dy = padZero(dt.getDate());
  var hrs = padZero(dt.getHours());
  var mns = padZero(dt.getMinutes());
  var scs = padZero(dt.getSeconds());
  var dtstr = dt.getFullYear() + "-" + mn + "-" + dy + " " + hrs + ":" + mns + ":" + scs;
  return dtstr;
}

function padZero(n) {
  if(n < 10) { n = '0' + n; }
  return n;
}

//  MAP   /////////////////////////////////////////////////////////////////////////////////////////// 

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
	this.DrawMapOverlays();
	this.DrawLayerControlBox(this.items,this.options.controlbox);
	this.SendReadyMessage(true);											
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
		if (items[i].obj) 
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
			}
		else if (items[i].layerType == "Overlay") {
			v=items[i].layerOptions.split(",");
			var imageBounds=new google.maps.LatLngBounds(new google.maps.LatLng(v[2],v[1]),new google.maps.LatLng(v[0],v[3]));
			if (v.length == 5)
				ops["opacity"]=v[4]/100;
			if (items[i].layerSource)
				items[i].obj=new google.maps.GroundOverlay(items[i].layerSource,imageBounds,ops);
//	38.07,-78.55,37.99,-78.41
			}
		else if (items[i].layerType == "KML") {
			if (items[i].layerOptions) {	
				v=items[i].layerOptions.split(",");
				for (j=0;j<v.length;++j) 
					ops[v[j].split("=")[0]]=v[j].split("=")[1];
				}
			items[i].obj=new google.maps.KmlLayer(items[i].layerSource,ops);
			}
		else if ((items[i].layerType == "GoTo") && (items[i].visible == "true")) {
			v=items[i].layerSource.split(",");							// Split into parts
			if (v.length > 1)									 		// If enough  vals and visible
				curLatlng=new google.maps.LatLng(v[0],v[1]);			// Set center
			if (v.length > 2)											// If set
				curZoom=v[2];											// Set zoom
			}
		if ((items[i].visible == "true") && (items[i].obj))
			items[i].obj.setMap(this.map);	
		if ((items[i].obj) && (!items[i].listener))
			items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e) { _this.RunGlue(_this.container,i-1,"clicked"); });
		}
	this.map.setCenter(curLatlng);										// Center map
	this.map.setZoom(Number(curZoom));									// Zoom map
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
	var clearStyle=[
		{ featureType:"road", 	        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"transit",        elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"poi",            elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"administrative", elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"landscape",      elementType:"all",      stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"labels",   stylers: [ { visibility:"off"} ] },
		{ featureType:"all", 			elementType:"geometry", stylers: [ { lightness:-20}    ] }
		];
	var clearMap=new google.maps.StyledMapType(clearStyle,{name:"Land"});
	map.mapTypes.set("LAND",clearMap);
}

//  CHART   /////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawChart=function() 												//	DRAW CHART
{	
	var i=0,array,val;
	var ops=new Object();
	var options=this.options;
	var container=this.container;
	var con="#"+container;
  	var _this=this;
	for (o in options) {
		val="";
		if (options[o]) {
			val=options[o].toString();
  			val=ops[o]=val.replace(/~/g,"#")
  			}
		if ((val.indexOf(",") != -1) && (o != "query") && (o != "title")) {
			if (val) {
				array=true;
				if (val.indexOf('=') == -1)
 					ops[o]=new Array();
				else{
					ops[o]=new Object();
					array=false;
					}
				var pairs=val.split(',');
				for (j=0;j<pairs.length;++j) {
					if (!pairs[j])
						continue;
					if (array)
						ops[o].push(pairs[j].replace(/ /g,""));
					else{
						v=pairs[j].split("=");
						if (o == "options")
							ops[v[0]]=v[1].replace(/ /g,"");
						else if (v[0].indexOf(".") != -1) {
							ops[o][v[0].split(".")[0]]={};
							ops[o][v[0].split(".")[0]][v[0].split(".")[1]]=v[1];
							}
						else
							ops[o][v[0]]=v[1];
						}
					}
				}
			}
   		if (ops[o] == 'true') 	ops[o]=true;
  		if (ops[o] == 'false') 	ops[o]=false;
   		}
	var innerChartDiv=this.container+"indiv";
	if (options['width'])		$(con).width(options['width']);
	if (options['height'])		$(con).height(options['height']);
	$(con).remove("#innerChartDiv");
	$(con).append("<div id="+innerChartDiv+"/>")
	$("#"+innerChartDiv).width($(con).width());
	$("#"+innerChartDiv).height($(con).height());
	ops.containerId=innerChartDiv;
	if (!ops.colors)	delete ops.colors;
 	if (ops.dataDataSourceUrl)	
 		ops.dataDataSourceUrl=""+ops.dataSourceUrl.replace(/\^/g,"&");
  	if (ops.query) {
  		var v=ops.query.split(" ");
  		for (i=0;i<v.length;++i) {
  			if (v[i] == "has") {
  				v[i++]="LIKE";
  				v[i]="'%"+v[i]+"%'";
  				}
  			}
 		ops.query="";
 		for (i=0;i<v.length;++i) 
  			ops.query+=v[i]+" ";
 		}
    if (options.series) {
        var v=options.series.split(",")
        ops.series=new Array();
        var o={};
        for (i=1;i<v.length;++i) {
            if (!isNaN(v[i]))
            ops.series.push(o),o={};
        else
            o[v[i].split("=")[0]]=v[i].split("=")[1];
        }
        ops.series.push(o);
        }
 	var wrap=new google.visualization.ChartWrapper(ops);
	this.map=wrap;
 	wrap.setOptions(ops);
    wrap.draw();
  	google.visualization.events.addListener(wrap,"ready", function() { _this.SendReadyMessage(true); });
}

SHIVA_Show.prototype.RunGlue=function(con, item, val, group) 						//	RUN GLUE
{
	RunGlue(con,item,val,group);														// Call global function
}

SHIVA_Show.prototype.SaveData=function(mode, style, items, props, type) 			// SAVE DATA FROM FROM TO JSON, ETC
{
		var i,j,k,o,str1;
		var ovr=""
		var itemStart;
		var str="{\n";
		$('#formatter').val(0)
		var atts=new Array();
		for (o in props) 
			atts.push(o);
		if (items) {
			for (i=0;i<atts.length;++i)
				if (atts[i] == "item") {
					atts[i]="name";
					break;
				}
			itemStart=i;
			for (j=0;j<items.length;++j) 
				for (k=itemStart+1;k<atts.length;++k)	
					items[j][atts[k]]=$("#itemInput"+j+"-"+(k-i)).val();
			}
		if ((mode == 'JSON') || (mode == "GetJSON") || (mode == "Canvas") || (mode == "eStore")) {
			if (items && items.length) {
				for (i=0;i<items.length;++i) {
					str+="\t\"item-"+(i+1)+"\": \"";
					for (k=itemStart;k<atts.length;++k)	{
						str1=items[i][atts[k]];
						if (str1)
							str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");
						str+=atts[k]+":"+str1+";"; 
						}
					str=str.substring(0,str.length-1)+"\",\n";	
					}
			if (!this.overlay)
				str=str.substring(0,str.length-3)+"\",\n";	
				}
			if (this.overlay)
				str+=this.dr.SaveDrawData(true);
			if (this.ev && this.ev.events.length) {
				var group=this.options.shivaGroup;
				str+="\"shivaEvents\": "+this.ArrayToString(this.ev.events,group)+",\n";
				}
			var j=0;
			if (type)
		        str+="\t\"chartType\": \""+type+"\",\n";
			for (o in props) {
		        if (o == "item")
		        	break;
		       	str1=$("#propInput"+(j++)).val(); 	
		        if ((props[o].opt == "list") && (str1))
		        	str1=str1.replace(/\n/g,",").replace(/\r/g,"");
	        	str+="\t\""+o+"\": \""+str1+"\",\n";
		        }
			d=new Date().toUTCString();
			str+="\t\"shivaMod\": \""+d.substring(0,d.length-13)+"\",\n";
			str+="\t\"shivaGroup\": \""+style+"\"\n}";
			if (mode == 'Canvas') {
	   			window.parent.document.getElementById("shivaCan").contentWindow.postMessage("PutJSON:"+str,"*");
	   			this.Sound("ding");
	   			window.parent.OpenTab(8);
				return ;
				}
			if (mode == 'GetJSON')
				return str;
			$('#formatter').val(0);
			if (mode == 'eStore')
				return this.EasyFile(str,$.proxy(function(data) { ReEdit(data) },this),style);
			$("#helpDiv").html("");	
			}	
		else{
			$('#formatter').val(0);
			$("#helpDiv").html("");		
			str="http://www.viseyes.org/shiva/go.htm";
			str+="?shivaGroup="+style;
			if (items && items.length) {
				for (i=0;i<items.length;++i) {
					str+="&item-"+(i+1)+"=";
					for (k=itemStart;k<atts.length;++k)	{
						str1=items[i][atts[k]];
						if (str1)
							str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");
						str+=atts[k]+":"+str1+";"; 
						}
					str=str.substring(0,str.length-1);	
					}
				}
			if (this.overlay)
				str+=this.dr.SaveDrawData(false);
			if (type)
				str+="&chartType="+type;
			var j=0;
			for (o in props) {
		        if (o == "item")
		        	break;
		        str1=$("#propInput"+(j++)).val();
		        if (str1)
		        	str1=str1.replace(/&/g,"^").replace(/#/g,"``");
		        if ((props[o].opt == "list") && (str1))
		        	str1=str1.replace(/\n/g,",").replace(/\r/g,"");
		        str+="&"+o+"="+str1;
		        }
			if (mode == 'WordPress')
		 		str="[iframe src='"+encodeURI(str)+"']";
			else if ((mode == 'iFrame') || (mode == 'Drupal'))
		 		str="<iframe width='600' height='400' src='"+encodeURI(str)+"'></iframe>";
			}
	$("#outputDiv").html("<br/><br/>Embed code:<br><textarea readonly='yes' rows='6' cols='60' id='tmptxt1'>"+str+"</textarea>");
	$("#tmptxt1").select();
	return str;
}

SHIVA_Show.prototype.ReEdit=function(jsonData, propertyList)	
{
		var p,v,i=0,j,k=0,pair,key,o;
		var query=window.location.search.substring(1);
		if (!query && !jsonData)
			return;
		if (jsonData) {
			var items=new Array();
			for (key in jsonData) {
	 			if (key == "shivaEvents") {
					if (!shivaLib.ev)
						SHIVA_Event(this.container,this.player);
					shivaLib.ev.AddEvents(jsonData[key]);										
		 			continue;
	 				}
	 			if (key.indexOf("item-") != -1) {
		 			v=jsonData[key].split(";");
					o=new Object;
		 			for (j=0;j<v.length;++j) {
		 				p=v[j].split(":");
		 				o[p[0]]=p[1];
		 				}
					items.push(o);
		 			continue;
		 			}
				else if (key.indexOf("draw-") != -1) 
					this.AddOverlaySeg(jsonData[key],true);					
				else{
					k=0;
					for (o in propertyList) {
						if (key == o) {
							$("#propInput"+k).val(jsonData[key]);
							break;
							}
						k++;
						}
					}
				}
			return items;
			}
		var vars=query.replace(/%C2%AE/g,"&reg").split("&");
		if (vars.length < 4)
			return;
		var items=new Array();
		for (var i=0;i<vars.length;i++) {
			vars[i]=vars[i].replace(/\^/g,"&").replace(/%20/g," ").replace(/%60/g,"`").replace(/%3C/g,"<").replace(/%3E/g,">").replace(/%3c/g,"<").replace(/%3e/g,">").replace(/``/g,"#");
			pair=vars[i].split("=");
			for (j=2;j<pair.length;++j)
				pair[1]+="="+pair[j];
			if (pair[1]) 
				pair[0]=unescape(pair[0]);
	 		if (pair[0].indexOf("draw-") != -1) 
				this.AddOverlaySeg(pair[1],true);					
	 		if (pair[0].indexOf("item-") != -1) {
	 			v=pair[1].split(";");
				o=new Object;
	 			for (j=0;j<v.length;++j) {
	 				p=v[j].split(":");
	 				o[p[0]]=p[1];
	 				}
				items.push(o);
	 			}
			else{
				for (o in propertyList) 
					if (pair[0] == o) {
						$("#propInput"+(k++)).val(pair[1]);
						break;
						}
				}
			}
	return items;
}

SHIVA_Show.prototype.ShowHelp=function(att, helpText, chartType)
{
		var v;
		var str="<br/><hr/>";
		$("#outputDiv").text(" ");
		if (att) {
			if (att.charAt(0) == ' ')
				att=att.substr(1)
			v=att.split("&nbsp;");
			str+="<b>How to set "+v[0]+"</b><br/><br/>";
			if (helpText[v[0]])
				str+=helpText[v[0]];
			if (att.toLowerCase().indexOf("(s)") != -1) 
				str+="<br><br><input type='button' onClick='shivaLib.ColorPicker(-1,-1)' value='Click to get a color number'/><div id='colorDiv'>&nbsp;<i>(Color will appear here)</i></div>";
			}
		else
			str+="Click on a label to show help."
		if (att == "Data source URL") {
			if (helpText[chartType]) {
				str+="<br/><br/><b>Data Format for "+chartType+"</b><br/><br/><table>";
				str+="<tr><td>"+helpText[chartType]+"</td></tr>";
				str+="</table>";
				}
			}
		if (helpText["OVERVIEW"]) 
			str+="<br/><br/><b><i>Click <a onClick='shivaLib.ShowOverview()'><u>here</u></a> for an overview on the entire element.</b>";
		$("#helpDiv").html(str);
}
		
SHIVA_Show.prototype.ShowOverview=function()
{
	var str="<br/><hr/><b>"+shivaLib.options.shivaGroup+" overview</b><br/><br/>";
	str+=helpText["OVERVIEW"];
	$("#helpDiv").html(str);
}
	
SHIVA_Show.prototype.SetAttributes=function(props, items, keepData)
{
	var i,j,k,l,o,oo,id,id2;
	var atts=new Array();
	var oldData;
	for (o in props) 
		atts.push(o);
	if (keepData) {
		oldData=new Array()
		for (i=0;i<atts.length;++i) {
			if (atts[i] == "item")
				break;
			oldData.push($("#propInput"+i).val());
			}
		}
	$('#propertyTable tr:gt(0)').remove();
	
	for (i=0;i<atts.length;++i) {
		o=atts[i];
		id="propInput"+i;
   		var str="<tr style='height:26px'><td width='12'></td><td width='200' onClick='ShowHelp(this.innerHTML)'>"+props[o].des.split("::")[0];
	if ((this.drupalMan) && (o == "dataSourceUrl")) 
			str+="&nbsp;&nbsp;<img src='databutton.gif' title='Click to find data set' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"gdoc\",0)'/>";
   		str+="</td><td></td><td>";
   		if (props[o].opt == "query") 
   			str+="<input type='password' size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.QueryEditor(\""+id+"\")' id='"+id+"'/>";
  		else if (props[o].opt == "advanced") 
   			str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.SetAdvancedAttributes(\""+id+"\",\""+o+"\")' id='"+id+"'/>";
   		else if ((props[o].opt == "color") || (props[o].opt == "colors")) {
   			str+="<div style='max-height:26px'><input size='7' onChange='Draw()' style='position:relative;text-align:center;height:16px;top:2px; padding-left: 20px' id='"+id+"'/>";
   			str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px'"
			if (props[o].opt == "colors")	
  				str+=" onclick='shivaLib.ColorPicker(1,"+i+")' id='"+id+"C'/>";		   			
			else
 				str+=" onclick='shivaLib.ColorPicker(0,"+i+")' id='"+id+"C'/>";		   			
			str+="</div>"
			}				   			
   		else if (props[o].opt == "button") 
   			str+="<button type='button' size='14' onChange='"+o+"' id='"+id+"'>"+props[o].def+"</button>";
   		else if (props[o].opt == "slider")
   			str+="<input style='width:100px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
   		else if (props[o].opt == "checkbox") {
   			str+="<input onChange='Draw()' type='checkbox' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'";
   			if (props[o].def == "true")
   				str+=" checked";
   			str+="/> "+props[o].des.split("::")[1];
   			}
   		else if (props[o].opt == "list")
   			str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
   		else if (props[o].opt == "hidden") 
   			str="<tr><td width='12'></td><td width='200'><input type='hidden' id='"+id+"'/>";
  		else if (props[o].opt.indexOf('|') != -1) {
   			var v=props[o].opt.split("|");
			if (o == 'item') {
				str="<tr><td width='12'></td><td colspan='3'><div id='accord'>";
				for (j=0;j<items.length;++j) {
					str+="<h3><a href='#'><b>"+items[j].name+"</b></a></h3><div id='accord-"+j+"'>";
					for (k=i+1;k<atts.length;++k) {
						id2="itemInput"+j+"-"+(k-i);
						oo=atts[k];
						if (props[oo].opt != "hidden")
							str+="<span onClick='ShowHelp(this.innerText)'>"+props[oo].des;
						if ((this.drupalMan) && (oo == "layerSource")) 
							str+="<img src='kmlicon.gif' id='"+j+"' title='Click to find KML file' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"kml\",this.id)'/>";
					   	str+="</span><span style='position:absolute;left:142px;'>";
					   	if (props[oo].opt == "color") {
	   						str+="<input size='14' onChange='Draw()' style='text-align:center' id='"+id2+"'>";
			    			str+="<div style='position:relative;border:1px solid;height:8px;width:9px;top:-14px;left:5px'"
							str+=" onclick='shivaLib.ColorPicker(0,"+((j*100)+100+(k-i))+")' id='"+id2+"C'/>";		   			
							}				   			
				   		else if (props[oo].opt == "colors") 
	   						str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.ColorPicker(2,"+((j*100)+100+(k-i))+")' id='"+id2+"'>";
			   			else if (props[oo].opt == "button") 
   							str+="<button type='button' size='12' onChange='"+oo+"' id='"+id+"'>"+props[oo].def+"</button>";
			   			else if (props[oo].opt == "slider")
   							str+="<input style='width:90px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
			   			else if (props[oo].opt == "list")
   							str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
				   		else if (props[oo].opt == "hidden") 
   							str+="<input type='hidden' id='"+id2+"'/>";
			   			else if (props[oo].opt.indexOf('|') != -1) {
			   				var v=props[oo].opt.split("|");
							str+="<select id='"+id2+"' onChange='Draw()' onFocus='ShowHelp(\""+props[oo].des+"\")'>";
							for (l=0;l<v.length;++l) {
								if (v[l])
									str+="<option>"+v[l]+"</option>";
								}
							str+="</select>";
				   			}
				   		else
   							str+="<input size='14' onChange='Draw()' type='text' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
				   		str+="</span></p>";
				   		}
					str+="</div>";
					}
				}
			else{
				str+="<select id='"+id+"' onChange='Draw()' onFocus='ShowHelp(\""+props[o].des+"\")'>";
				for (j=0;j<v.length;++j) {
					if (v[j])
						str+="<option>"+v[j]+"</option>";
					}
				str+="</select>";
	   			}
	   		}
	   		else
   				str+="<input size='14' style='height:16px' onChange='Draw()' type='text' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
		str+="<td width='12'></td ></td></tr>";
		$(str).appendTo("#propertyTable tbody")
	  	$("#"+id).val(props[o].def);  
	  	if (keepData)
		  	$("#"+id).val(oldData[i]);  
		else
	  		$("#"+id).val(props[o].def);  
   		if (props[o].opt == "color")
			if (props[o].def.toLowerCase() != 'auto') {
				$("#"+id).css('border-color',"#"+props[o].def); 
				$("#"+id+"C").css('background-color',"#"+props[o].def); 
				}
		if (o == "item")
			break;
		}			
	str="<tr height='8'><td></td></tr>";
	$(str).appendTo("#propertyTable tbody")
	$("#accord").accordion({ collapsible:true, active:false, autoHeight:false, change:this.callback});
	if (items) {
		for (j=0;j<items.length;++j) {
			for (k=i+1;k<atts.length;++k) {
		   		o=atts[k];
		   		id2="itemInput"+j+"-"+(k-i);
		   		if (props[o].opt == "color")
	    			if (props[o].def.toLowerCase() != 'auto') {
						$("#"+id2).css('border-color',"#"+items[j][atts[k]]); 
						$("#"+id2+"C").css('background-color',"#"+items[j][atts[k]]); 
						}
				}
			}
		for (i=0;i<atts.length;++i)
			if (atts[i] == "item") {
				atts[i]="name";
				break;
				}
		for (j=0;j<items.length;++j) 
			for (k=i;k<atts.length;++k)	
				$("#itemInput"+j+"-"+(k-i)).val(items[j][atts[k]]);
		}
}

SHIVA_Show.prototype.SetAdvancedAttributes=function(prop, baseVar) 		// ADVANCED OPTIONS									
{
	var str,title,aProps,v,i;
	$("#advAttDialogDiv").dialog("destroy");								// Kill old dialog is there							
	$("#advAttDialogDiv").remove();											// Remove any added parts
	str="<table>"															// Table header
	switch(baseVar) {														// Route on var
		case "legendTextStyle": 																				
		case "titleTextStyle": 																				
		case "pieSliceTextStyle": 																				
		case "tooltipTextStyle": 																				
			aProps= { 	fontName: 	{ opt:'string',	 des:'Font'},			// Sub-items
						fontSize: 	{ opt:'string',	 des:'Size'},
						color: 		{ opt:'color',	 des:'Color'}
						}			
			break;
		case "chartArea": 																				
			aProps= { 	left: 	{ opt:'string',	 des:'Left'},				// Sub-items
						top: 	{ opt:'string',	 des:'Top'},
						height: { opt:'string',	 des:'Height'},
						width: 	{ opt:'strinh',	 des:'Width'}
						}			
			break;
		case "backgroundColor": 																				
			aProps= { 	fill: 		{ opt:'color',	 des:'Fill color'},		// Sub-items
						stroke: 	{ opt:'color',	 des:'Border color'},
						strokeWidth:{ opt:'string',	 des:'Border width'}
						}			
			break;
		case "vAxis": 	
		case "hAxis":																			
			aProps= { 	baseline: 		{ opt:'string',	 des:'Baseline'},		// Sub-items
						baselineColor: 	{ opt:'color',	 des:'Baseline color'},
						direction:		{ opt:'string',	 des:'Direction'},
						format:			{ opt:'string',	 des:'Axis lable format'},
						direction:		{ opt:'string',	 des:'Direction'},
						logScale:		{ opt:'string',	 des:'Log scale?'},
						textPosition:	{ opt:'string',	 des:'Text position'},
						title:			{ opt:'string',	 des:'Axis title'},
						maxValue:		{ opt:'string',	 des:'Max value'},
						minValue:		{ opt:'string',	 des:'Min value'},
						slantedText:	{ opt:'string',	 des:'Slanted text'}
						}			
			break;
			}
		for (o in aProps) {													// For each sub-item
			str+="<tr style='height:26px' onClick='ShowHelp(\""+aProps[o].des+"\")'><td>"+aProps[o].des+"</td><td>";	// Add title
			if (aProps[o].opt == "color") { 									// If a color
	   			str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:center;height:16px;top:2px' id='"+baseVar+o+"'/>";
   				str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px'"
 				str+=" onclick='shivaLib.ColorPicker(0,\"___"+baseVar+o+"\")' id='"+baseVar+o+"C'/>";		   			
				}
			else															// If input
				str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:left;height:16px;top:2px' id='"+baseVar+o+"'/>";
			str+="</td></tr>";													// End row
			}
	
	var ops={ 																// Dialog options
		width:'auto',height:'auto',modal:true,title:"Set "+baseVar,position:[300,350],
		buttons: {
			OK: function() {												// On OK button
				str="";														// No text yet
				for (o in aProps) {											// For each item
					if ($("#"+baseVar+o).val())								// If something there
						str+=o+"="+$("#"+baseVar+o).val()+",";				// Add value
					}
				$("#"+prop).val(str);										// Set in input box
				$("#"+prop).trigger("onchange");							// Trigger a change
				$(this).dialog("destroy");									// Kill dialog
				$("#advAttDialogDiv").remove();								// Remove items
				},
			'Cancel': function() {											// On cancel button
				$(this).dialog("destroy");									// Kill dialog
				$("#advAttDialogDiv").remove();								// Remove items
				}
			}
		}
	$("body").append("<div id='advAttDialogDiv'/>");						// Add div for dialog
	$("#advAttDialogDiv").dialog(ops);										// Add dialog
	$("#advAttDialogDiv").html(str+"</table>");								// Fill dialog
	v=$("#"+prop).val().split(",");											// Split sub-items by comma
	for (i=0;i<v.length-1;++i)												// For each sub-item
		$("#"+baseVar+v[i].split("=")[0]).val(v[i].split("=")[1]);			// Set last value
}

SHIVA_Show.prototype.GetDataFromManager=function(type, index)
{
	if (type == "gdoc")
		window.parent.postMessage("dataSourceUrl","*");
	if (type == "kml")
		window.parent.postMessage("GetFile=KML="+index,"*");
}

/////// QUERY EDITOR

SHIVA_Show.prototype.QueryEditor=function(id)
{
	if ($("#propInput0").val())
		new SHIVA_QueryEditor($("#propInput0").val(),$("#"+id).val(),id,false);
	else
		this.Prompt("Data Filter","You need to define a data source first!","")
}

SHIVA_Show.prototype.ShiftItem=function(dir,items)
{
	var active=$("#accord").accordion("option","active");
	if (active === false) 
		return -1;
	var pos=Number(active)+Number(dir);
	if ((pos < 0) || (pos >= items.length))
		return active;
	else
		this.Sound("click");
	var o=items[pos];
	items[pos]=items[active];
	items[active]=o;
	this.Draw();
	return pos;
}

SHIVA_Show.prototype.Sound=function(sound)
{	
	var clickSound=new Audio(sound+".mp3");
	if (!clickSound.canPlayType("audio/mpeg"))
		clickSound=new Audio(sound+".ogg");
	clickSound.play();
}

SHIVA_Show.prototype.GetGoogleSpreadsheet=function(file, callback) 					//	GET GOOGLE DOCS SPREADSHEET
{
	var query=new google.visualization.Query(file);							
	query.send(handleQueryResponse);
 
    function handleQueryResponse(response) {
	    var i,j,o;
		var data=response.getDataTable();
		var cols=data.getNumberOfColumns();
		var rows=data.getNumberOfRows();
 		var keys=new Array();
		var theData=new Array();
		for (i=0;i<cols;++i) {
		 	if (!$.trim(data.getColumnLabel(i)))
		 		break;
			keys.push($.trim(data.getColumnLabel(i)));
			}
		for (i=0;i<rows;++i) {
			o={};
			for (j=0;j<keys.length;++j) 
				o[keys[j]]=data.getValue(i,j);
			theData.push(o);
 			}
		callback(theData);
     }
}

SHIVA_Show.prototype.ShowLightBox=function(width, top, title, content)
{
	var str;
	str="<div id='shivaLightBoxDiv' style='position:fixed;width:100%;height:100%;";	
	str+="background:url(overlay.png) repeat;top:0px;left:0px';</div>";
	$("body").append(str);														
	str="<div id='shivaLightBoxIntDiv' style='position:absolute;padding:10px;width:";
	if (width != "auto") 
		str+=Math.abs(width)+"px";	
	else
		width=400;
	var x=($("#shivaLightBoxDiv").width()-width)/2;
	if (width < 0)
		x=830;
	str+=";border-radius:12px;moz-border-radius:12px;z-index:2003;"
	str+="border:1px solid; left:"+x+"px;top:"+top+"%;background-color:#f8f8f8'>";
	str+="<img src='shivalogo32.png' style='vertical-align:-30%'/>&nbsp;&nbsp;";								
	str+="<span style='font-size:large;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";
	str+="<div id='shivaLightContentDiv'>"+content+"</div>";					
	$("#shivaLightBoxDiv").append(str);	
	$("#shivaLightBoxDiv").css("z-index",2500);						
}

SHIVA_Show.prototype.Prompt=function(title, message, def, id)
{
	var ops={ width:'auto',height:'auto',modal:true,autoOpen:true,title:title,
			buttons: {
				OK: function() {
					$("#"+id).val($("#shiva_dialogInput").val());
					$(this).remove();
					},
				CANCEL: function() { $(this).remove(); }
				}
		}
	var str="<br/><b>"+message+"</b><br/><br/>";
	str+="<input type='input' size='23' id='shiva_dialogInput' value='"+def+"'/>";
	$("body").append("<div id='shiva_dialogDiv'/>");
	$("#shiva_dialogDiv").dialog(ops);
	$("#shiva_dialogDiv").html(str);
}

SHIVA_Show.prototype.TimecodeToSeconds=function(timecode) 				// CONVERT TIMECODE TO SECONDS
{
	var h=0,m=0;
	var v=(""+timecode).split(":");											// Split by colons
	var s=v[0]																// Add them
 	if (v.length == 2)														// Just minutes, seconds
		s=v[1],m=v[0];														// Add them
	else if (v.length == 3)													// Hours, minutes, seconds
		s=v[2],m=v[1],h=v[0];												// Add them
	return(Number(h*3600)+Number(m*60)+Number(s));							// Convert
}

SHIVA_Show.prototype.SecondsToTimecode=function(secs) 					// CONVERT SECONDS TO TIMECODE
{
	var str="",n;
	n=Math.floor(secs/3600);												// Get hours
	if (n) str+=n+":";														// Add to tc
	n=Math.floor(secs/60);													// Get mins
	if (n < 10) str+="0";													// Add leading 0
	str+=n+":";																// Add to tc
	n=Math.floor(secs%60);													// Get secs
	if (n < 10) str+="0";													// Add leading 0
	str+=n;																	// Add to tc
	return str;																// Return timecode			
}	

SHIVA_Show.prototype.MakeSelect=function(id, multi, items, sel, extra)
{
	var	str="<select id='"+id+"'";
	if (multi)
		str+="multiple='multiple' size='"+multi+"'";
	if (extra)
		str+=extra;
	str+=">";
	for (i=0;i<items.length;++i) {
		str+="<option";
		if (sel == items[i])
			str+=" selected='selected'"
		str+=">"+items[i]+"</option>";
		}	
	return str+"</select>"
}

SHIVA_Show.prototype.GetTextFile=function(file, callback)
{
	var syncMode=false;
	if (file.charAt(0) == "@")														
		file="proxy.php?url="+file.substr(1);				
	xmlhttp=new XMLHttpRequest();
	if (callback) {
		syncMode=true;
		xmlhttp.onload=function(e){ callback(e.target.responseText); }
		}
	xmlhttp.open("GET",file,syncMode);
	xmlhttp.send();
	return(xmlhttp.responseText);
}

SHIVA_Show.prototype.ConvertDateToJSON=function(dateTime) 									
{
	var mos=new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");
	var v=String(dateTime).split('/');
	if (v.length == 2)
		return(mos[v[0]]+" "+v[1]);
	else if (v.length == 3)
		return(mos[v[0]]+" "+v[1]+" "+v[2]);
	return v[0];
}

SHIVA_Show.prototype.ArrayToString=function(jsonArray) 					// SAVE JSON ARRAY AS STRING
{
	var i,o,oo,str="[",key,val;
	for (i=0;i<jsonArray.length;++i) {										// For each event
		str+="{";															// Beginning item
		o=jsonArray[i];														// Point at data
		for (key in o) {													// For each item
			val=o[key];														// Get val
			str+="\""+key+"\":";											// Add key
			if (typeof(o[key]) == "object")  {								// An object
				str+="{";													// Initial {
				oo=o[key];													// Point at interior obj									
				for (key in oo) {											// For each item
					str+="\""+key+"\":";									// Add key
					val=oo[key];											// Get val
					str+="\""+val+"\",";									// Add to val
					}	
				str=str.substr(0,str.length-1)+"\t},";						// Remove last comma and add final },
				}
			else															// Regular one
				str+="\""+val+"\",";										// Add val
			}
		str=str.substr(0,str.length-1);										// Lop off last comma
		if (i != jsonArray.length-1)	str+="},\n";						// Not the last one use comma
		else							str+="}]";							// No comma or LF on last 
		}
	return str;
}


SHIVA_Show.prototype.Clone=function(obj) 								// CLONE OBJECT/ARRAY
{
    var i;
    if (null == obj || "object" != typeof obj) return obj;					// Singleton
	else if (obj instanceof Array) {   										// Handle Array
	    var copy=[];														// Copy array
        for (i=0;i<obj.length;++i) 											// For each member 
        	copy[i]=this.Clone(obj[i]);										// Copy with recursion
        return copy;														// Return array
    	}
	else if (obj instanceof Object) {   									// Handle Object
	    var copy={};														// Copy objecy
 		for (var attr in obj)												// For each part
			if (obj.hasOwnProperty(attr)) 									// ?
				copy[attr]=this.Clone(obj[attr]);							// Copy with recursion
        return copy;														// Return obj
   	 	}
}

/////////////  EASYFILE (eStore)

SHIVA_Show.prototype.EasyFile=function(_data, callback, type) 			// EASYFILE MENU
{
	var i,email="",w=350;											
	var v=document.cookie.split(';');										// Get cookie array
	for (var i=0;i<v.length;i++) 											// for each cookie
		if (v[i].indexOf("ez-email=") != -1)								// If an email set
			email=v[i].substr(9);											// Use it
	var str="<br/>Use <b>eStore</b> to save and load projects under your email address. When saving, type a title when asked and when loading, choose a project from a list of your saved projects.<br/>"
		str+="<br/><table id='ez-maintbl' cellspacing=0 cellpadding=0 style='font-size:small'>";
	str+="<tr><td width='25%'>Type email</td><td><input type='text' size='40' id='email' value='"+email+"'/></td></tr>";
	str+="</table><div align='right' style='font-size:x-small'><br/>";	
	if (type != "all")
		str+=" <button id='saveBut'>Save</button>";	
	str+=" <button id='loadBut'>Load</button>";	
	if (type != "all")
		str+=" <button id='linkBut'>Link</button>";	
	str+=" <button id='cancelBut'>Cancel</button></div>";	
	if (type == "KML") w=-350;												// Force to right of Earth (KLUDGE)																
	this.ShowLightBox(w,20,"SHIVA eStore",str)								// Create light box
	$("#cancelBut").button().click(function() { $("#shivaLightBoxDiv").remove();});
	$("#saveBut").button().click(function() {								// SAVE
		var _email=$("#email").val();										// Get email
		var _title=$("#ez-title").val();									// Get title
		var _type=type;														// Get type
		if (!_email) {														// Need email
			alert("Please type your email");								// Alertsh
			return;															// Don't save
			}						
		if (((_email.toLowerCase() == "samples") && (_email != "SaMpLeS")) || // Samples
			((_email.toLowerCase() == "canvas") && (_email != "CaNvAs"))) {	// Canvas
			alert("Sorry, but you can't save using this name");				// Alert
			return;															// Don't save
			}						
		if (!$("#ez-title").length) {										// If no title
			str="<tr><td>Type title</td><td><input type='text' size='40' id='ez-title'/></td></tr>";
			$(str).appendTo("#ez-maintbl tbody");							// Add title to table
			$("#ez-title").focus();											// Focus on title
			return;
			}
		if (!_title) {														// Need title
			alert("Please type title to save under");						// Alert
			return;															// Don't save
			}						
		document.cookie="ez-email="+_email;									// Save email in cookie
		$("#shivaLightBoxDiv").remove();									// Close box						
		str="\",\n\t\"shivaTitle\": \""+_title+"\"\n}";						// Add title
		if ((type != "Canvas") && (type != "KML"))							// Not for canvas or KML
			_data=_data.substr(0,_data.lastIndexOf("\""))+str;				// Remove last "\n}
		$.post("http://www.primaryaccess.org/REST/addeasyfile.php",{ email:_email, type: _type, title:_title,data:_data.replace(/'/g,"\\'") });
		});
	
	$("#loadBut").button().click(function() {								// LOAD
		email=$("#email").val();											// Get email
		if (!email) {														// Need email
			alert("Please type your email");								// Alert
			return;															// Don't save
			}						
		document.cookie="ez-email="+email;									// Save email in cookie
		var dat={ email:email };											// Set email to look for
		if (type != "all")													// If not loading all
			dat["type"]=type;												// Filter by type
		str="http://www.primaryaccess.org/REST/listeasyfile.php";			// eStore list url
		shivaLib.ezcb=callback;		shivaLib.ezmode="load";					// Set callback and mode
		$.ajax({ url: str, data:dat, dataType:'jsonp' });					// Get jsonp
		});
			
	$("#linkBut").button().click(function() {								// LINK
		email=$("#email").val();											// Get email
		if (!email) {														// Need email
			alert("Please type your email");								// Alert
			return;															// Don't save
			}						
		document.cookie="ez-email="+email;									// Save email in cookie
		var dat={ email:email };											// Set emila to look for
		if (type != "all")													// If not loading all
			dat["type"]=type;												// Filter by type
		str="http://www.primaryaccess.org/REST/listeasyfile.php";			// eStore list url
		shivaLib.ezcb="";		shivaLib.ezmode="link";						// Set callback and mode
		$.ajax({ url: str, data:dat, dataType:'jsonp' });					// Get jsonp
		});
	}

SHIVA_Show.prototype.ShowEasyFile=function(files, callback, mode) // GET DATA FROM EASYFILE
{
		var i;
		var str="<br/><div style='overflow:auto;overflow-x:hidden;height:200px;font-size:x-small;padding:8px;border:1px solid #cccccc'>";
		str+="<table id='ezFilesTable' cellspacing=0 cellpadding=4><tr><td></td></tr></table></div>";
		$("#shivaLightContentDiv").html(str);													
		str="<div align='right' style='font-size:x-small'><br>Show only with this in title: <input type='text' size='10' id='ezFileFilter'/>";
		str+=" <button id='cancelBut'>Cancel</button></div>";	
		$("#shivaLightContentDiv").append(str);
		$("#cancelBut").button().click(function() { $("#shivaLightBoxDiv").remove();});
		this.MakeEasyFileList(files,"",callback,mode);						// Show files
	
		$("#ezFileFilter").keyup($.proxy(function() {						// Add change handler
 			var filter=$("#ezFileFilter").val();							// Get filter
			$("#ezFilesTable tbody").empty();								// Empty all rows
			this.MakeEasyFileList(files,filter,callback,mode);				// Show files
			},this));
}

SHIVA_Show.prototype.MakeEasyFileList=function(files, filter, callback, mode) 	// SHOW LIST OF FILES
{
	var i,str,type;
	files.sort(function(a, b) { 												// Sort by date
		var A=new Date(a.created.substr(0,5)+"/2012 "+a.created.substr(6) );
		var B=new Date(b.created.substr(0,5)+"/2012 "+b.created.substr(6) );
		return B-A; 
		});												
	for (i=0;i<files.length;++i) {											// For each file
		if ((filter) && (files[i].title.toLowerCase().indexOf(filter.toLowerCase()) == -1)) // If  filter not in title
			continue;														// Skip it
		str="<tr ><td>"+files[i].created.replace(/ /,"&nbsp")+"</td>";		// Add date
		str+="<td width='100%'><img id='ezfile-"+files[i].id+"' src='adddot.gif'  height='11'> &nbsp;";
		str+=files[i].title+"</td></tr>";									// Add title
		$(str).appendTo("#ezFilesTable tbody");								// Add file to table
		$("#ezFilesTable tr:odd").addClass("odd");							// Color
		}
	for (i=0;i<files.length;++i) {											// For each file
		type=files[i].type;													// Set type
		$("#ezfile-"+files[i].id).click(function() {						// Add click handler
			str="http://www.primaryaccess.org/REST/geteasyfile.php?id="+this.id.substr(7);
			if ((mode == "link") && (type == "KML"))						// If a KML link
				alert("http://www.primaryaccess.org/REST/getkml.php?e="+this.id.substr(7));	// Show url
			if ((mode == "link") && (type != "KML"))						// If a SHIVA link
				alert("www.viseyes.org/shiva/go.htm?e="+this.id.substr(7));	// Show url
			else{															// If a load
				var dat={ id:this.id.substr(7) };							// Set id to look for
				str="http://www.primaryaccess.org/REST/geteasyfile.php";	// eStore list url
				shivaLib.ezcb=callback;										// Set callback
				shivaLib.ezmode=this.id.substr(7);	 						// Set ID
				$.ajax({ url: str, data:dat, dataType:'jsonp' });			// Get jsonp
				}
			$("#shivaLightBoxDiv").remove();								// Close lightbox
			});	
		}
}

function easyFileListWrapper(data)										// LOAD EASY FILE LIST
{
	shivaLib.ShowEasyFile(data,shivaLib.ezcb,shivaLib.ezmode); 				// Show list of files
}

function easyFileDataWrapper(data)										// LOAD EASY FILE DATA
{
	if (!data["Element-0"])													// If not a canvas element
		data.shivaId=Number(shivaLib.ezmode);								// Set ID
	shivaLib.ezcb(data);													// Callback
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// GRAPHICS
///////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Graphics() 																			// CONSTRUCTOR
{
	this.shadowOffX=this.shadowOffY=this.curShadowCol=this.curShadowBlur=0;	
	this.composite="source-over";
}

SHIVA_Graphics.prototype.CreateCanvas=function(id, con, wid, hgt, left, top) 						//	ADD NEW CANVAS
{
	var str="<canvas id='"+id+"' "; 
	if (wid) 	str+="width='"+wid+"px' "; 
	if (hgt) 	str+="height='"+hgt+"px' "; 
	str+="/>";
	var mc=$(str).appendTo("#"+con);
	if (left || top)	
		mc.style.position="absolute";
	if (left)	mc.style.left=left;
	if (top)	mc.style.top=top;
	return mc;
}

SHIVA_Graphics.prototype.DeleteCanvas=function(id) 													// DELETE CANVAS
{
	var mc=null;
	if (typeof(id) == "object")
		mc=id;
	else
		mc=document.getElementById(id);
	if (mc)
		document.body.removeChild(mc);
}

SHIVA_Graphics.prototype.Compositing=function(ctx,compositeMode, alpha) 							// COMPOSITING
{
	ctx.globalCompositeOperation=this.composite=compositeMode;										
	if (alpha != undefined)
		ctx.globalAlpha=this.alpha=alpha;										
}


SHIVA_Graphics.prototype.DrawBar=function(ctx, col, alpha, x1, y1, x2, y2, edgeCol, edgeWid) 		// DRAW RECTANGLE
{
 	ctx.globalAlpha=alpha;
	if (col != -1){	
 	 	ctx.fillStyle=col;
		ctx.fillRect(x1,y1,x2-x1,y2-y1);
		}	
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.strokeRect(x1,y1,x2-x1,y2-y1);
		}
}

SHIVA_Graphics.prototype.DrawRoundBar=function(ctx, col, alpha, x1, y1, x2, y2, rad, edgeCol, edgeWid) 	// DRAW ROUND RECTANGLE
{
	ctx.beginPath();
	ctx.globalAlpha=alpha;
	ctx.moveTo(x1+rad,y1);
	ctx.lineTo(x2-rad,y1);
	ctx.arcTo(x2,y1,x2,y1+8,rad);
	ctx.lineTo(x2,y2-rad);
	ctx.arcTo(x2,y2,x2-rad,y2,rad);
	ctx.lineTo(x1+rad,y2);
	ctx.arcTo(x1,y2,x1,y2-rad,rad);
	ctx.lineTo(x1,y1+rad);
	ctx.arcTo(x1,y1,x1+rad,y1,rad);
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawLine=function(ctx, col, alpha, x1, y1, x2, y2, edgeWid) 				// DRAW LINE
{	
 	ctx.beginPath();
 	ctx.globalAlpha=alpha;
   	ctx.lineWidth=edgeWid;
	ctx.strokeStyle=col;
	ctx.moveTo(x1,y1); 
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawRubberLine=function(ctx, x1, y1, x2, y2, edgeWid) 				// DRAW RUBBER LINE
{	
 	ctx.globalCompositeOperation="xor";
	ctx.beginPath();
 	ctx.globalAlpha=1;
   	ctx.lineWidth=1;
	ctx.strokeStyle="#000";
	ctx.moveTo(x1,y1); 
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
	ctx.globalCompositeOperation="source-over";
}

SHIVA_Graphics.prototype.DrawRubberBox=function(ctx, x1, y1, x2, y2, edgeWid) 				// DRAW RUBBER LINE
{	
 	ctx.globalCompositeOperation="xor";
	ctx.beginPath();
 	ctx.globalAlpha=1;
   	ctx.lineWidth=1;
	ctx.strokeStyle="#000";
	ctx.strokeRect(x1,y1,x2-x1,y2-y1);
	ctx.globalCompositeOperation="source-over";
}

SHIVA_Graphics.prototype.DrawCircle=function(ctx, col, alpha, cx, cy, rad, edgeCol, edgeWid)		// DRAW CIRCLE
{
	ctx.beginPath();
  	ctx.arc(cx,cy,rad,0,Math.PI*2,false);
	ctx.globalAlpha=alpha;
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawWedge=function(ctx, col, alpha, cx, cy, rad, start, end, edgeCol, edgeWid)		// DRAW A PIE WEDGE
{
  	var span=end-start;
	if (!span)
		return;
	ctx.beginPath();
  	if (span < 360)
	  	ctx.moveTo(cx,cy);
  	ctx.arc(cx,cy,rad,(start/360)*Math.PI*2,(end/360)*Math.PI*2,false);
  	if (span < 360)
 	  	ctx.lineTo(cx,cy);
	ctx.globalAlpha=alpha;
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineCap="round";
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawTriangle=function(ctx, col, alpha, x, y, wid, dir)	 				// DRAW TRIANGLE
{
	var wid2=(wid*4.0/5.0)>>0;
 	ctx.beginPath();
 	ctx.globalAlpha=alpha;
  	ctx.fillStyle=col;
	if (dir == "up") {	
		ctx.moveTo(x,y-wid2);  
		ctx.lineTo(x+wid,y+wid2);	  
		ctx.lineTo(x-wid,y+wid2);	  
		ctx.lineTo(x,y-wid2);  
		}
	else if (dir == "right") {
		ctx.moveTo(x-wid2,y-wid);  
		ctx.lineTo(x+wid2,y);	  
		ctx.lineTo(x-wid2,y+wid);	  
		ctx.lineTo(x-wid2,y-wid);  
		}
	else if (dir == "down") {			
		ctx.moveTo(x-wid,y-wid2);  
		ctx.lineTo(x+wid,y-wid2);	  
		ctx.lineTo(x,y+wid2);	  
		ctx.lineTo(x-wid,y-wid2);  
		}
	else if (dir == "left") {			
		ctx.moveTo(x-wid2,y);  
		ctx.lineTo(x+wid2,y-wid);	  
		ctx.lineTo(x+wid2,y+wid);	  
		ctx.lineTo(x-wid2,y);  
		}
	ctx.fill();	
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawPolygon=function(ctx, col, alpha, x, y,  edgeCol, edgeWid, smooth)			// DRAW POLYGON
{
	var n=x.length;	
	ctx.beginPath();
   	ctx.moveTo(x[0],y[0]);
	ctx.globalAlpha=alpha;
	var open=true;
	if ((Math.abs(x[0]-x[x.length-1]) < 3) && (Math.abs(y[0]-y[y.length-1]) < 3)) {
		x[x.length-1]=x[0];
		y[y.length-1]=y[0];
		open=false;
		}
	if (smooth) {
		var x1=x[0]-0+((x[1]-x[0])/2)-0;
		var y1=y[0]-0+((y[1]-y[0])/2)-0;
		if (open)
			ctx.lineTo(x1,y1); 															
		for (i=1;i<n-1;++i) {														
			x1=x[i]-0+((x[i+1]-x[i])/2)-0;												
			y1=y[i]-0+((y[i+1]-y[i])/2)-0;												
				ctx.quadraticCurveTo(x[i],y[i],x1,y1); 											
			}
		if (open)
			ctx.lineTo(x[i],y[i]); 									 					
		}
	else
	  	for (i=0;i<n;++i)
		  	ctx.lineTo(x[i],y[i]);
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineCap="round";
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		if (col != -1)
		 	ctx.lineTo(x[0],y[0]);
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.SetShadow=function(ctx, offx, offy, blur, col, comp)	 						// SET SHADOW/COMPOSITION
{
	if (!offx) {
		offx=offy=blur=col=0;
		comp="source-over";
		}
	if (offx != undefined)		ctx.shadowOffsetX=offx;	
	if (offy != undefined)		ctx.shadowOffsetY=offy;	
	if (blur != undefined)		ctx.shadowBlur=blur;
	if (col  != undefined)		ctx.shadowColor=col;	
	if (comp != undefined)		ctx.globalCompositeOperation=comp;	
}

SHIVA_Graphics.prototype.AddGradient=function(ctx, id, x1, y1, x2, y2, col1, col2, r1, r2)	 			// ADD GRADIENT TO CANVAS
{
	if (!r1)
		ctx[id]=ctx.createLinearGradient(x1,y1,x2,y2);
	else
		ctx[id]=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	if (!col1)		col1="#000000";	
	if (!col2)		col2="#ffffff";	
	ctx[id].addColorStop(0,col1);
	ctx[id].addColorStop(1,col2);
}

SHIVA_Graphics.prototype.GetImage=function(ctx, file, left, top, wid, hgt)							// GET IMAGE
{
	var image=new Image();
	image.src=file;
	image.onload=function() {
		var asp=image.height/image.width;
		if (!wid && !hgt)
			wid=image.width,hgt=image.height
		else if (!wid && hgt)
			wid=hgt/asp;
		else if (wid && !hgt)
			hgt=wid*asp;
		ctx.drawImage(image,left,top,wid,hgt)
		}
	return image;
}

///////// EVENTS   //////////

SHIVA_Graphics.prototype.resolveID=function(id)															// CONVERT STRING ID TO DOM ID
{
	if (typeof(id) != "object")
		id=document.getElementById(id);
	return id;
}

SHIVA_Graphics.prototype.AddListener=function(id, eventType, handler) 									// ADD EVENT LISTENER
{	
	$("#"+id)[0].addEventListener(eventType,handler,false);
}

SHIVA_Graphics.prototype.RemoveListener=function(id, eventType, handler) 								// REMOVE EVENT LISTENER
{	
	this.resolveID(id).removeEventListener(eventType,handler,false);
}

SHIVA_Graphics.prototype.SetDrag=function(id, mode) 													// START/STOP DRAG
{
	id=$("#"+id);
	id.g=this;
	id.draggable=mode;	
	if (!mode)
		this.removeListener(id,'mousedown',dragDown);
	else
		this.addListener(id,'mousedown',dragDown)

	function dragDown(e) {
		if (!e.target.draggable)
			return
		e.target.dragX=e.pageX-e.target.style.left.slice(0,-2);
		e.target.dragY=e.pageY-e.target.style.top.slice(0,-2)
		e.target.g.addListener(e.target,'mousemove',dragMove)
		e.target.g.addListener(e.target,'mouseup',dragUp)
		e.target.inDrag=true;
		}
	function dragMove(e) {
		e.target.style.left=e.pageX-e.target.dragX;
		e.target.style.top=e.pageY-e.target.dragY;
		}
	function dragUp(e) {
		e.target.g.removeListener(e.target,'mousemove',dragMove)
		e.target.g.removeListener(e.target,'mouseup',dragUp)
		e.target.inDrag=false;
		}
}

///////// DEBUG   //////////

SHIVA_Graphics.prototype.EnumObject=function(obj) 														// DEBUG TOOL
{
	trace("------------------------------------------------------------");		
	for (var key in obj) 														
		trace(key+"="+obj[key])													
}

///////// STRING   //////////

SHIVA_Graphics.prototype.SecsToTime=function(time, frameRate) 											// CONVERT MS TO TIMECODE
{				
	var timecode="";																
	if (!frameRate)
		frameRate=24;
	time/=1000;																		
	var mins=(time/60)>>0;																					
	var secs=(time%60)>>0;														
	var frms=((time-(secs+(mins*60)))*frameRate)>>0;							
	if (mins < 10)																	
		timecode+="0";															
	timecode+=mins+":";																				
	if (secs < 10)																
		timecode+="0";															
	timecode+=secs+":";																						
	if (frms < 10)																
		timecode+="0";															
	timecode+=frms;																							
	return timecode
}

SHIVA_Graphics.prototype.SetTextFormat=function(ctx, format) 									// SET TEXT FORMAT
{		
	var v=format.split(",");
	var pair,key,val;
	var bold="",ital="",font="",size="12";		
	for (var i=0;i<v.length;++i) {
		pair=v[i].split("=")
		key=pair[0];			val=pair[1];
		if (key == "align") 	ctx.textAlign=val;
		if (key == "color") 	ctx.fillStyle=val;
		if (key == "font")  	font=val;
		if (key == "size")  	size=val+"px";
		if (key == "bold")  	bold="bold";
		if (key == "italic")  	ital="italic";
		}
	if (font)	
		ctx.font=bold+" "+ital+" "+size+" "+font;
	return size.substring(0,size.length-2);
}

SHIVA_Graphics.prototype.DrawText=function(ctx, text, x, y, format) 							// DRAW TEXT
{		
	try {
		if (format)
			this.SetTextFormat(ctx,format);
		ctx.fillText(text,x,y);	
	} catch(e){};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	QUERY EDITOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_QueryEditor(source, query, returnID,fieldNames) 										
{
	this.advancedMode=false;
	$("#dataDialogDiv").dialog("destroy");
	$("#dataDialogDiv").remove();
	shivaLib.qe=this;
	if (query.indexOf("  ") == 0) 
		this.advancedMode=true,query=query.substr(2);
	else if (!query) 
 		query="SELECT * WHERE A = ? ORDER BY none"
 	if (query.indexOf(" ORDER BY ") == -1)
 		query+=" ORDER BY none";
	this.source=source;
	this.query=query.replace(/  /g," ");
	this.curFields=["A","B","C"];
	var thisObj=this;
	var ops={ 
		width:'auto',height:'auto',modal:true,title:'Data filter',position:[330,40],
		buttons: {
			OK: function() {
				if (thisObj.advancedMode)
					thisObj.query="  "+$("#curQuery").val();
				if (!fieldNames) {
					for (i=0;i<thisObj.curFields.length;++i)
						thisObj.query=thisObj.query.replace(RegExp(thisObj.curFields[i],"g"),String.fromCharCode(i+65));
					}
				if (!thisObj.query.match(/\?/)) {
					thisObj.query=thisObj.query.replace(/ORDER BY none/g,"");
					if (returnID == "curQueryDiv")
						$("#"+returnID).html(thisObj.query);
					else if (returnID)
						$("#"+returnID).val(thisObj.query);
					window.postMessage("ShivaDraw","*");
					}
				$(this).dialog("destroy");
				$("#dataDialogDiv").remove();
				$("#propInput0").trigger("onchange");
				},
			'Cancel': function() {
				$(this).dialog("destroy");
				$("#dataDialogDiv").remove();
				}
			}
		}
	$("body").append("<div id='dataDialogDiv'/>");
	$("#dataDialogDiv").dialog(ops);
	if (source) {
		var googleQuery=new google.visualization.Query(source);
	   	googleQuery.send(handleQueryResponse);
 		}
	this.DrawQuery();

	function handleQueryResponse(response) {
	    var i,j,key;
		var data=response.getDataTable();
		var rows=data.getNumberOfRows();
		var cols=data.getNumberOfColumns();
	 	thisObj.curFields=[];
	 	if ((thisObj.query.indexOf(" A ") != -1) && (thisObj.query.charAt(thisObj.query.length-1) != " "))
	 		thisObj.query+=" ";	
	 	for (j=0;j<cols;++j) {
			key=$.trim(data.getColumnLabel(j)).replace(/ /g,"_");
			if (!key)
				continue;
			thisObj.query=thisObj.query.replace(RegExp(" "+String.fromCharCode(j+65)+" ","g")," "+key+" ");
	  		thisObj.curFields.push(key);
			}
		thisObj.query=$.trim(thisObj.query);
		thisObj.DrawQuery();
	}
}

SHIVA_QueryEditor.prototype.DrawQuery=function() 
{
	var i,num;
	var select="all";
	var order="none";
	var thisObj=this;
	if (this.advancedMode) {
		str="<textArea id='curQuery' rows='4' cols='50' />";
		str+="<p><input type='checkbox' id='advedit' checked='checked' onclick='shivaLib.qe.AdvancedMode(false)'> Advanced editing mode";
		str+="<p><Button id='queryAdvEdit'>Test</button> ";
		str+="Click <a href='http://code.google.com/apis/chart/interactive/docs/querylanguage.html' target='_blank'>here</a> for information on formatting</p></p>";
		str+="<br/><div id='testShowDiv'/>"
		$("#dataDialogDiv").html(str);
		$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));
		$("#queryAdvEdit").click( function() { thisObj.TestQuery(); });
		this.TestQuery();
		return;
		}
	i=this.query.indexOf(" WHERE ");
	if (i == -1)
		i=this.query.indexOf(" ORDER BY ");
	select=this.query.substring(7,i);
	if (select == "*")
		select="all";
	i=this.query.indexOf(" ORDER BY ");
	order=this.query.substring(i+10);
	i=this.query.indexOf(" WHERE ");
	var str="<div style='border 1px solid'><br/><table id='clauseTable' cellspacing='0' cellpadding='0'>";
	if (i != -1) {
		j=this.query.indexOf(" ORDER BY ");
		var v=this.query.substring(i+7,j).split(" ");
		i=0;
		str+=this.AddClause("IF",v[0],v[1],v[2],v.length<6,i++);
		for (j=3;j<v.length;j+=4)
			str+=this.AddClause(v[j],v[j+1],v[j+2],v[j+3],(j+5)>v.length,i++);
		}
	var q=this.query.replace(/WHERE /g,"<br/>WHERE ").replace(/ORDER BY /g,"<br/>ORDER BY ")
	str+="<tr height='12'></tr>";
	str+="</div><tr><td><b>SHOW&nbsp;&nbsp;</b></td><td align='middle'>&nbsp;";
	str+="<select multiple='multiple' size='3'id='sel' onchange='shivaLib.qe.SetQueryString()'>";
	str+="<option>all</option>";
	for (i=0;i<this.curFields.length;++i)	str+="<option>"+this.curFields[i]+"</option>";
	str+="</select></td><td>&nbsp;&nbsp;<b>ORDER BY</B> &nbsp;<select id='ord' onchange='shivaLib.qe.SetQueryString()'>";
	str+="<option>none</option>";
	for (i=0;i<this.curFields.length;++i)	str+="<option>"+this.curFields[i]+"</option>";
	str+="</select></td></tr>";
	str+="</table><p><input type='checkbox' id='advedit' onclick='shivaLib.qe.AdvancedMode(true)'/> Advanced editing mode</p>";
	str+="<div id='curQuery' style='overflow:auto'><span style='color:#999'><b>"+q+"</b></span></div>";
	str+="<br/><div id='testShowDiv'/>"
	$("#dataDialogDiv").html(str);
	$("#sel").val(select.split(","));
	$("#ord").val(order);
	this.TestQuery();
}

SHIVA_QueryEditor.prototype.TestQuery=function() 
{
	var q=this.query;
	if (q.match(/\?/)) 
		q="";
	for (i=0;i<this.curFields.length;++i)
		q=q.replace(RegExp(this.curFields[i],"g"),String.fromCharCode(i+65));
	q=q.replace(/ORDER BY none/g,"");
	if (this.advancedMode)
		q=$("#curQuery").val();
	var tbl={"chartType": "Table","dataSourceUrl":this.source,"query":q,"shivaGroup":"Data"};
	$("#testShowDiv").empty();
	$("#testShowDiv").css("width",$("#dataDialogDiv").css("width"));
	$("#testShowDiv").css("height","200px");
	$("#testShowDiv").css("overflow","auto");
	new SHIVA_Show("testShowDiv",tbl);
}

SHIVA_QueryEditor.prototype.AdvancedMode=function(mode)
{
	this.advancedMode=mode;
	if (!mode)	
		this.query="SELECT * WHERE A = * ORDER BY none";
	this.DrawQuery();
	if (mode)	
		$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));
}

SHIVA_QueryEditor.prototype.AddClause=function(clause, subj, pred, obj, last, row)	
{
	var str="<tr valign='top'><td>";
	if (clause != "IF") 
		str+=shivaLib.MakeSelect("clause"+row,0,["AND","OR","NOT"],clause,"onchange='shivaLib.qe.SetQueryString()'");
	else
		str+="<b>IF</b>";
	str+="</td><td>&nbsp;"+shivaLib.MakeSelect("subject"+row,0,this.curFields,subj,"onchange='shivaLib.qe.SetQueryString()'");
	str+="</td><td>&nbsp;&nbsp;<b>IS&nbsp; </b>"+shivaLib.MakeSelect("predicate"+row,0,["<",">","=","!=","<=",">=","has"],pred,"onchange='shivaLib.qe.SetQueryString()'");
	str+=" <input type='input' size='8' id='object"+row+"' value='"+obj+"' onchange='shivaLib.qe.SetQueryString()'/>";
	if (clause == "IF") 
		str+="&nbsp;<img src='adddot.gif' onclick='shivaLib.qe.AddNewClause("+row+")'style='vertical-align:middle'>";
	else	
		str+="&nbsp;<img src='trashdot.gif' onclick='shivaLib.qe.DeleteClause("+row+")' style='vertical-align:middle'>";
	str+="</td></tr>";
	$("#pred").val(pred);
	return str;
}

SHIVA_QueryEditor.prototype.AddNewClause=function(num)
{
	var i=this.query.indexOf(" ORDER BY ");
	this.query=this.query.substr(0,i)+" AND * = ?"+this.query.substr(i);
	this.DrawQuery();
	shivaLib.Sound("ding");
}

SHIVA_QueryEditor.prototype.DeleteClause=function(num)
{
	var v=this.query.split(" ");
	var n,i,str="";
	for (n=0;n<v.length;++n)
		if (v[n] == "WHERE")
			break;
	n=n+(num*4)
	for (i=0;i<n;++i)
		str+=v[i]+" ";
	for (i=n+4;i<v.length;++i)
		str+=v[i]+" ";
	this.query=str;
	this.DrawQuery();
	shivaLib.Sound("delete");
}

SHIVA_QueryEditor.prototype.SetQueryString=function()
{
	var i,j,num=0;
	i=this.query.indexOf(" WHERE ");
	if (i != -1) {
		j=this.query.indexOf(" ORDER BY ");
		var v=this.query.substring(i+7,j).split(" ");
		num=(v.length+1)/4;
		}
	str="SELECT "
	var sel=$("#sel").val();
	if (sel == "all")
		sel="*";
	str+=sel+" ";
	if (num)
		str+="WHERE ";
	for (i=0;i<num;++i) {
		if (i)
			str+=$("#clause"+i).val()+" ";
		str+=$("#subject"+i).val()+" ";
		str+=$("#predicate"+i).val()+" ";
		str+=$("#object"+i).val();
		str+=" ";
		}		
	str+="ORDER BY "+ $("#ord").val();
	this.query=str;
	this.DrawQuery();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	OTHER
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function RunGlue(con, item, val, group)
{
	if (group) {
		var g=$("input[name="+group+"]");
		var j=g[0].id.substr(5);
		for (var i=0;i<g.length;++i) {
			if (j != item+1)
				window.postMessage("ShivaTrigger="+con.substr(4)+","+j+",Unchecked","*");
			++j;
			}
		}
	if (typeof(con) == "object") {
		}	
	else
		window.postMessage("ShivaTrigger="+con.substr(4)+","+(++item)+","+val,"*");
}

function trace(msg)
{
	console.log(msg);
}

///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVA DRAW
///////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Draw(container, hidePalette) 							// CONSTRUCTOR
{
	this.container=container;
	this.color="-1";
	this.clipboard=new Array();
	this.edgeColor="#0000ff";
	this.textColor="#000000";
	this.boxColor="-1";
	this.edgeWidth="30";
	this.arrow=false;
	this.alpha=100;
	this.curTool=0;
	this.imageURL="";
	this.imageWid=400;
	this.textAlign="Left";
	this.textStyle="";
	this.textSize=0;
	this.ideaShape="Round box";
	this.ideaGradient=true;
	this.ideaBold=false;
	this.ideaBackCol="#FFF2CC";
	this.ideaEdgeCol="#999999";
	this.ideaTextCol="#000000";
	this.selectedItems=new Array();
	this.selectedDot=-1;													
	this.segs=new Array();
	this.startTime="0:0";													// Start time
	this.endTime="end";														// End time
	if (shivaLib.overlay)													// If an overlay already
		this.segs=shivaLib.overlay;											// Use it
	this.closeOnMouseUp=false;												// Flag to close seg after drag-drawing
	this.curSeg=-1;															// Currently active segment
	this.lastDotTime=0;														// Last time a dot was added
	this.snap=false;														// Grid snap off
	this.curve=false;														// Straight lines
	this.snapSpan=20;														// Grid spacing
	this.leftClick=false;													// Hold left button status
	this.lastX=0;		this.lastY=0;										// Last cursor mouse down
	shivaLib.dr=this;														// Set SHIVA_Show pointer
	if (!hidePalette)														// If not hiding palette
		this.DrawPalette();													// Draw palatte
	this.colorPicker="";													// Not in color picker
	this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');						// Get context
	$("#shivaDrawDiv").css("cursor","crosshair");							// Crosshair cursor
	$("#shivaDrawDiv").mouseup(this.onMouseUp);								// Mouseup listener
	$("#shivaDrawDiv").mousedown(this.onMouseDown);							// Mousedown listener
	$("#shivaDrawDiv").mousemove(this.onMouseMove);							// Mousemovelistener
	document.onkeyup=this.onKeyUp;											// Keyup listener
	document.onkeydown=this.onKeyDown;										// Keydown listener
}

SHIVA_Draw.prototype.DrawPalette=function(tool) 						//	DRAW 
{
	var hgt=$("#"+this.container).css("height").replace(/px/g,"");			// Get height
	var top=$("#"+this.container).css("top").replace(/px/g,"");				// Get top
	if (top == "auto")	top=0;												// Use 0
	var left=$("#"+this.container).css("left").replace(/px/g,"")-0+12;		// Get left
	if ($("#shivaDrawPaletteDiv").length == 0) {							// If no palette
		var h=225;															// Default height
		if (shivaLib.player)												// If over a player										
			h+=16;															// Add space for start/end times
		str="<div id='shivaDrawPaletteDiv' style='position:absolute;left:"+left+"px;top:"+(top-12+Number(hgt)-100)+"px;width:180px;height:"+h+"px'>";
		$("body").append("</div>"+str);										// Add palette to body
		$("#shivaDrawPaletteDiv").addClass("propTable");					// Style same as property menu
		$("#shivaDrawPaletteDiv").draggable();								// Make it draggable
		$("#shivaDrawPaletteDiv").css("z-index",2001);						// Force on top
		}
	this.SetTool(0);														// Draw lines
	this.DrawMenu();														// Draw menu
}

SHIVA_Draw.prototype.ColorPicker=function(name) 						//	DRAW COLORPICKER
{
	var str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";
	str+="<img src='colorpicker.gif' style='position:absolute;left:15px;top:28px' />";
	str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";
	$("#shivaDrawPaletteDiv").html(str);									// Fill div
	$("#shivaDrawPaletteDiv").on("click",onColorPicker);					// Mouseup listener
	this.colorPicker=name;													// Set var name
	
	function onColorPicker(e) {
		var col;
		var cols=["000000","444444","666666","999999","CCCCCC","EEEEEE","E7E7E7","FFFFFF",
				  "FF0000","FF9900","FFFF00","00FF00","00FFFF","0000FF","9900FF","FF00FF",	
				  "F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EDD1DC",
				  "EA9999","F9CB9C","FFE599","BED7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD",
				  "E06666","F6B26B","FFD966","9C347D","76A5AF","6FA8DC","8E7CC3","C27BA0",
				  "CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79",
				  "990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47",
				  "660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"
				 ];
		var x=e.pageX-this.offsetLeft;										// Offset X from page
		var y=e.pageY-this.offsetTop;										// Y
		if ((x < 112) && (y < 55))											// In text area
			return;															// Quit
		$("#shivaDrawPaletteDiv").off("click",this.onColorPicker);			// Remove mouseup listener
		if ((x > 112) && (x < 143) && (y < 48))	{							// In OK area
			if ($("#shivaDrawColorInput").val())							// If something there
				col="#"+$("#shivaDrawColorInput").val();					// Get value
			else															// Blank
				x=135;														// Force a quit
			}
		if ((x > 143) && (y < 48)) {										// In quit area
			shivaLib.dr.DrawMenu();											// Put up menu	
			return;															// Return
			}
		if (y > 193) 														// In trans area
			col=-1;															// Set -1
		else if (y > 48) {													// In color grid
			x=Math.floor((x-24)/17);										// Column
			y=Math.floor((y-51)/17);										// Row
			col="#"+cols[x+(y*8)];											// Get color
			}
		shivaLib.dr[shivaLib.dr.colorPicker]=col;							// Set color
		if (shivaLib.dr.curTool == 5) {										// If editing 
			if (shivaLib.dr.selectedItems.length)							// If something selected
				shivaLib.dr.DrawMenu(shivaLib.dr.segs[shivaLib.dr.selectedItems[0]].type);	// Draw menu with this as a type
			else															// Nothing
				shivaLib.dr.DrawMenu(0);									// Draw menu as pencil
			shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);				// Draw segments
			}
		else if (shivaLib.dr.curTool == 6) {								// If idea map 
			shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);				// Draw segments
			shivaLib.dr.DrawMenu();											// Draw idea menu 
			}
		else																// In drawing
			shivaLib.dr.DrawMenu();											// Put up menu	
	}
}

SHIVA_Draw.prototype.DrawMenu=function(tool) 							//	DRAW 
{
	var preface="Edit ";
	if (tool == undefined)
		tool=this.curTool,preface="Draw ";
	var titles=["a line","a circle","a box","text","an image",""," an Idea Map"];
	var str="<p style='text-shadow:1px 1px white' align='center'><b>";	str+=preface+titles[tool]+"</b></p>";
	str+="<img src='closedot.gif' style='position:absolute;left:163px;top:1px' onclick='shivaLib.dr.SetTool(-1)'/>";
	str+="<table style='font-size:xx-small'>"
	if (tool < 3) {
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		if (tool == 2)
			str+="<tr><td>&nbsp;&nbsp;Round box?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		else if (tool == 0) {
			str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
			str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";
			}		
		str+="<tr><td>&nbsp;&nbsp;Fill color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"color\")' onChange='shivaLib.dr.SetVal(\"color\",this.value)' type='text' id='color'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Visibility</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"alpha\",this.value)' type='range' id='alpha'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line width</td><td>&nbsp;<input style='width:85px;height:12px;background-color:transparent;' onChange='shivaLib.dr.SetVal(\"edgeWidth\",this.value)' type='range' id='edgeWidth'></td></tr>";
		}
	else if (tool == 3) {
		str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"boxColor\")' onChange='shivaLib.dr.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Round box?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Visibility</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"alpha\",this.value)' type='range' id='alpha'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text size</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"textSize\",this.value)' type='range' id='textSize'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"textColor\")' onChange='shivaLib.dr.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";
		}
	else if (tool == 4) {
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Edge width</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"edgeWidth\",this.value)' type='range' id='edgeWidth'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Visibility</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"alpha\",this.value)' type='range' id='alpha'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Image URL</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"imageURL\",this.value)' type='text' id='imageURL'></td></tr>";
		}
	else if (tool == 6) {
		str+="<tr><td>&nbsp;&nbsp;Shape</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"ideaShape\",this.value)' id='ideaShape'><option>Round box</option><option>Rectangle</option><option>Oval</option><option>Circle</option></select></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaBackCol\")' type='text' id='ideaBackCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Gradient?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaGradient\",this.checked)' type='checkbox' id='ideaGradient'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaEdgeCol\")' onChange='shivaLib.dr.SetVal(\"ideaEdgeCol\",this.value)' type='text' id='ideaEdgeCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaTextCol\")' onChange='shivaLib.dr.SetVal(\"ideaTextCol\",this.value)' type='text' id='ideaTextCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Bold text?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaBold\",this.checked)' type='checkbox' id='ideaBold'></td></tr>";
		str+="<tr><td colspan='2' style='text-align:center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='font-size:x-small' onclick='shivaLib.dr.AddIdea(-1)'>Add base idea</button></td></tr>";
		}
	str+="</table><br/>";	
	str+="<div style='position:absolute;left:14px;top:194px'><span id='drawToolbar' style='font-size:xx-small'>";
	str+="<input type='radio' id='sdtb6' name='draw' onclick='shivaLib.dr.SetTool(5)'/><label for='sdtb6'>Select</label>";
	str+="<input type='radio' id='sdtb3' name='draw' onclick='shivaLib.dr.SetTool(2)'/><label for='sdtb3'>Box</label>";
	str+="<input type='radio' id='sdtb2' name='draw' onclick='shivaLib.dr.SetTool(1)'/><label for='sdtb2'>Circle</label>";
	str+="<input type='radio' id='sdtb1' name='draw' onclick='shivaLib.dr.SetTool(0)'/><label for='sdtb1'>Line</label>";
	str+="<input type='radio' id='sdtb4' name='draw' onclick='shivaLib.dr.SetTool(3)'/><label for='sdtb4'>A</label>";
	str+="<input type='radio' id='sdtb5' name='draw' onclick='shivaLib.dr.SetTool(4)'/><label for='sdtb5'>Image</label>";
	str+="<input type='radio' id='sdtb7' name='draw' onclick='shivaLib.dr.SetTool(6)'/><label for='sdtb7'>Idea</label>";
	str+="</span></div>";	
	if (shivaLib.player) {
		str+="<img src='startdot.gif' style='position:absolute;left:13px;top:220px'  onclick='shivaLib.dr.SetVal(\"startTime\")'/>";
		str+="<img src='enddot.gif'   style='position:absolute;left:150px;top:220px' onclick='shivaLib.dr.SetVal(\"endTime\")'/>";
		str+="<p id='startEndTime' align='center' style='position:absolute;left:40px;top:214px;width:108px;color:#777'/>";
		}
	$("#shivaDrawPaletteDiv").html(str);	
	$("#shivaDrawPaletteDiv").css("font-size","xx-small");	
	$("#sdtb"+(this.curTool+1)).attr("checked","checked");					// Check current tool button
	$("#drawToolbar").buttonset();
	$("#sdtb1").button({text: false, icons: { primary: "ui-icon-pencil"}});
	$("#sdtb2").button({text: false, icons: { primary: "ui-icon-radio-on"}});
	$("#sdtb3").button({text: false, icons: { primary: "ui-icon-circlesmall-plus"}});
	$("#sdtb4").button({text: true });
	$("#sdtb5").button({text: false, icons: { primary: "ui-icon-image"}});
	$("#sdtb6").button({text: false, icons: { primary: "ui-icon-arrowthick-1-nw"}}).css("width","100");
	$("#sdtb7").button({text: false, icons: { primary: "ui-icon-lightbulb"}}).css("width","100");
	this.SetMenuProperties();												// Set menu properties
}

SHIVA_Draw.prototype.SetMenuProperties=function() 						//	SET MENU PROPERTIES
{
	var col,tcol,txt;
	tcol=txt=col=this.color;												// Interior color
	gradient=true;
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#color").css("background-color",col); 								// Color chip
	$("#color").css("color",tcol); 											// Color text to hide it
	$("#color").val(txt); 													// Set text
	tcol=txt=col=this.edgeColor;											// Edge color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#edgeColor").css("background-color",col); 							// Color chip
	$("#edgeColor").css("color",tcol); 										// Color text to hide it
	$("#edgeColor").val(txt); 												// Set text
	tcol=txt=col=this.textColor;											// Text color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#textColor").css("background-color",col); 							// Color chip
	$("#textColor").css("color",tcol); 										// Color text to hide it
	$("#textColor").val(txt); 												// Set text
	tcol=txt=col=this.boxColor;												// Box color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#boxColor").css("background-color",col); 							// Color chip
	$("#boxColor").css("color",tcol); 										// Color text to hide it
	$("#boxColor").val(txt); 												// Set text
	$("#snap").attr("checked",this.snap);									// Check it
	$("#curve").attr("checked",this.curve);									// Check it
	$("#arrow").attr("checked",this.arrow);									// Check it
	$("#edgeWidth").val(this.edgeWidth); 									// Set edge width
	$("#alpha").val(this.alpha); 											// Set alpha
	$("#textSize").val(this.textSize); 										// Set text size
	$("#textAlign").val(this.textAlign); 									// Set text align
	$("#imageURL").val(this.imageURL); 										// Set image url
	$("#startEndTime").text(this.startTime+" -> "+this.endTime);			// Set times
	$("#edgeWidth").val(this.edgeWidth); 									// Set edge width
	$("#ideaShape").val(this.ideaShape); 									// Set idea shape
	$("#ideaBackCol").val(this.ideaBackCol); 								// Set idea back col
	$("#ideaGradient").attr("checked",this.ideaGradient);					// Check it
	$("#ideaBold").attr("checked",this.ideaBold);							// Check it
	tcol=txt=col=this.ideaBackCol;											// Back color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#ideaBackCol").val(txt); 											// Set idea edge col
	$("#ideaBackCol").css("background-color",col); 							// Color chip
	$("#ideaBackCol").css("color",tcol); 									// Color text to hide it
	tcol=txt=col=this.ideaEdgeCol;											// Edge color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#ideaEdgeCol").val(txt); 											// Set idea edge col
	$("#ideaEdgeCol").css("background-color",col); 							// Color chip
	$("#ideaEdgeCol").css("color",tcol); 									// Color text to hide it
	tcol=txt=col=this.ideaTextCol;											// Text color
	if (col == -1)	col="#fff",tcol="000",txt='none';						// If none, white chip/black text
	$("#ideaTextCol").val(txt); 											// Set idea edge col
	$("#ideaTextCol").css("background-color",col); 							// Color chip
	$("#ideaTextCol").css("color",tcol); 									// Color text to hide it
}	

SHIVA_Draw.prototype.DrawOverlay=function(num) 							// DRAW OVERLAY
{
	shivaLib.overlay=this.segs;												// Set overlay with display list
	shivaLib.Draw({shivaGroup:"Draw"});										// Draw it
}

SHIVA_Draw.prototype.SetShivaText=function(text, num)					// TEXT CHANGE HANDLER
{
	this.segs[num].text=text;												// Set new val
}

SHIVA_Draw.prototype.SaveDrawData=function(json) 						// SAVE DRAWING AS ITEM LIST
{
	var i,o,key,str="",str1;
	for (i=0;i<this.segs.length;++i) {										// For each seg
		o=this.segs[i];														// Point at it
		if (json)															// If saving as JSON
			str+="\t\"draw-"+(i+1)+"\":\"";									// Header
		else																// As a query string
			str+="&draw-"+(i+1)+"=";										// Header
		for (key in o) {													// For each object
			str1=String(o[key]);											// Get val as string
			if (str1) 														// If a value
				str+=key+":"+str1.replace(/\n/g,"|").replace(/\r/g,"").replace(/\:/g,"`").replace(/#/g,"~")+";";	// Replace special chars and add
			}
		str=str.substring(0,str.length-1);									// Lop of space
		if (json)															// If saving as JSON
			str+="\",\n";													// Add ",LF
		}
	return str;																// Return added elements
}

SHIVA_Draw.prototype.DrawWireframes=function(clear) 					// DRAW OVERLAY
{
	var o,i,col,scol;
	if (clear)																// If clearing canvas
		this.ctx.clearRect(0,0,1000,1000);									// Erase
	for (i=0;i<this.segs.length;++i)	{									// For each seg
		col="#777";															// Black border
		for (j=0;j<this.selectedItems.length;++j)							// For each selected element
			if (this.selectedItems[j] == i) {								// A match
				col="#ff0000";												// Red border
				break;														// Quit
				}
		o=this.segs[i];														// Point at seg
		if ((o.type == 5) || (!o.x))										// If an idea map node or no x's
			continue;														// Skip it
		if (o.type == 3) 													// Text
			shivaLib.g.DrawBar(this.ctx,-1,1,o.x[0],o.y[0],o.x[1],o.y[1],col,1);// Draw bar
		for (j=0;j<o.x.length;++j)	{										// For each point
			scol="#fff";													// Hollow marker
			if ((this.selectedDot == j) && (col == "#ff0000"))				// If this is the selected dot
				scol=col;													// Make it solid
			shivaLib.g.DrawCircle(this.ctx,scol,1,o.x[j],o.y[j],4,col,1);	// Draw marker
			}
		}
}

SHIVA_Draw.prototype.AddDot=function(x,y,up) 							// ADD DOT
{
	var o;
	if (this.curSeg == -1) {												// If not adding to an existing seg
		if (this.curTool && up)												// 2 point elements on mouseUp
			return;															// Start new segment only on up
		if (new Date().getTime()-this.lastDotTime < 100)					// If  too close to last click
			return;															// Quit
		o=new Object;														// Make a new one
		o.type=this.curTool;												// Set type
		o.x=new Array();													// Hold x coords
		o.y=new Array();													// y
		o.alpha=this.alpha;													// Alpha
		o.curve=this.curve;													// Curved path?
		if (shivaLib.player)												// If over a player
			o.s=this.startTime,o.e=this.endTime;							// Set time
		if (o.type < 3) {													// Line/Box/Cir
			o.color=this.color;												// Set color from property menu
			o.edgeColor=this.edgeColor;										// Edge color
			o.edgeWidth=this.edgeWidth;										// Width
			o.arrow=this.arrow;												// Arrow?
			}
		if (o.type == 3) {													// Text
			o.boxColor=this.boxColor;										// Box color
			o.textColor=this.textColor;										// Text color
			o.textAlign=this.textAlign;										// Text align
			o.textSize=this.textSize;										// Text size
			o.text="Click to edit";											// Text
			}
		if (o.type == 4) {													// Image
			o.edgeColor=this.edgeColor;										// Edge color
			o.edgeWidth=this.edgeWidth;										// Edge width
			o.imageURL=this.imageURL;										// URL
			}
		o.x.push(x);	o.y.push(y);										// Add XY
		this.lastX=x;	this.lastY=y;										// Save last XY
		this.segs.push(o);													// Add seg to array
		this.curSeg=this.segs.length-1;										// Point last seg in array
		this.lastDotTime=new Date().getTime();								// Save time
		return;
		}
	if (this.curTool == 0) {
		this.segs[this.curSeg].x.push(x);									// Add Y
		this.segs[this.curSeg].y.push(y);									// Add Y
		this.lastX=x;	this.lastY=y;										// Save last XY
		this.lastDotTime=new Date().getTime();								// Save time
		}
	else{
		if ((Math.abs(this.lastX-x) < 2) && (Math.abs(this.lastX-x) < 2)) {	// No drag
			$("#shtx"+this.curSeg).remove();								// Delete text box, if any
			this.segs.pop(0);												// Remove seg
			this.curSeg=-1;													// Stop to this seg	
			}
		else{
			o=this.segs[this.curSeg];										// Point at seg
			if (this.curTool == 3) {										// If a text box
				x=Math.max(x,o.x[o.x.length-1]+100);						// Min 100 pix
				y=Math.max(y,o.y[o.y.length-1]+40);							// Min 40 pix	
				}			
			o.x.push(x);													// Add x
			o.y.push(y);													// Add y
			this.curSeg=-1;													// Stop to this seg	
			}
		}
	this.DrawOverlay();														// Redraw
}	
	
SHIVA_Draw.prototype.SetVal=function(prop, val) 						//	SET VALUE
{
	if ((""+prop).match(/olor/)) {											// If a color
		if ((""+val).match(/none/))											// If none
			val=-1;															// val = -1
		if ((val != -1) && (!(""+val).match(/#/)))							// No #
			val="#"+val;													// Add it
		}
	var num=this.curSeg;													// Get index
	if ((prop == "startTime") || (prop == "endTime")) {						// If a time
		var time=shivaLib.player.currentTime();								// Get time
		val=Math.floor(time/60)+":";										// Mins
		val+=Math.ceil(time%60);											// Secs
		this[prop]=val;														// Set property
		this.DrawMenu();													// Redraw menu
		shivaLib.Sound("click");											// Click
		}
	this[prop]=val;															// Set property
	if ((this.curTool < 3) && (num != -1)) {								// If in polygon, cir, or bar
		this.segs[num].curve=this.curve;									// Set prop
		this.segs[num].arrow=this.arrow;									// Set prop
		this.segs[num].edgeColor=this.edgeColor;							// of each
		this.segs[num].edgeWidth=this.edgeWidth;							// from 
		this.segs[num].alpha=this.alpha;									// property
		this.segs[num].color=this.color;									
		this.DrawOverlay();													// Draw segments
		}
	if ((this.curTool == 3) && (num != -1)) {								// A text
		this.segs[num].curve=this.curve;									// Set prop
		this.segs[num].boxColor=this.boxColor;								// op
		this.segs[num].textSize=this.textSize;								// each
		this.segs[num].textColor=this.textColor;							// property
		this.segs[num].textAlign=this.textAlign;							// from
		this.segs[num].alpha=this.alpha;									// property
		}
	if ((this.curTool == 4) && (num != -1)) {								// Image
		this.segs[num].edgeColor=this.edgeColor;							// Set prop
		this.segs[num].edgeWidth=this.edgeWidth;							// from 
		this.segs[num].alpha=this.alpha;									// each
		this.segs[num].imageURL=this.imageURL;								// property
		}
	else if (this.curTool == 5) {											// If in edit
		for (var i=0;i<this.selectedItems.length;++i)  {					// For each selected seg
			num=this.selectedItems[i];										// Get index
			this.segs[num].alpha=this.alpha;								// property
			this.segs[num].curve=this.curve;								// property
			if (this.segs[num].type < 3) {									// Line, cir, box
				this.segs[num].color=this.color;							// Set prop
				this.segs[num].edgeColor=this.edgeColor;					// of each
				this.segs[num].edgeWidth=this.edgeWidth;					// from 
				this.segs[num].arrow=this.arrow;							// property
				}
			else if (this.segs[num].type == 3) {							// Text
				this.segs[num].boxColor=this.boxColor;							
				this.segs[num].textColor=this.textColor;							
				this.segs[num].textAlign=this.textAlign;							
				this.segs[num].textSize=this.textSize;							
				}
			else if (this.segs[num].type == 4) {							// Image
				this.segs[num].edgeColor=this.edgeColor;					// Set prop
				this.segs[num].edgeWidth=this.edgeWidth;					// from 
				this.segs[num].alpha=this.alpha;							// each
				this.segs[num].imageURL=this.imageURL;						// property
				}
			if (shivaLib.player) {											// If over a player
				this.segs[num].s=this.startTime;							// Set start
				this.segs[num].e=this.endTime;								// Set end
				}
			}
		this.DrawOverlay();													// Draw segments
		this.DrawWireframes(false);											// Draw wireframes
		}
	else if (this.curTool == 6) {											// If in idea map
		for (var i=0;i<this.selectedItems.length;++i)  {					// For each selected seg
			num=this.selectedItems[i];										// Get index
			this.segs[num].ideaBackCol=this.ideaBackCol;					// Set prop
			this.segs[num].ideaEdgeCol=this.ideaEdgeCol;					// Set prop
			this.segs[num].ideaTextCol=this.ideaTextCol;					// Set prop
			this.segs[num].ideaGradient=this.ideaGradient;					// Set prop
			this.segs[num].ideaBold=this.ideaBold;							// Set prop
			this.segs[num].ideaShape=this.ideaShape;						// Set prop
			}
		this.DrawOverlay();													// Draw idea map
		}
	}

SHIVA_Draw.prototype.SetTool=function(num) 								//	SET TOOL
{
	$("#shivaDrawDiv").css('pointer-events','auto');						// Restore pointer clicks
	this.curTool=num;														// Set current tool
	if (num == 6)															// Idea map
		$("#shivaDrawDiv").css("cursor","auto");							// Regular cursor
	else 																	// All others except close
		$("#shivaDrawDiv").css("cursor","crosshair");						// Crosshair cursor
	if (this.curTool == -1) {												// If quitting
		shivaLib.Sound("delete");											// Delete sound
		$("#shivaDrawDiv").css("cursor","auto");							// Regular cursor
		$("#shivaDrawDiv").css('pointer-events','none');					// Inibit pointer clicks if menu gone
		$("#shivaDrawPaletteDiv").remove();									// Close it
		}
	else																	
		shivaLib.Sound("click");											// Click sound
	
	this.DrawOverlay()														// Refresh
	this.curSeg=-1;															// Close this seg if open
	if (this.curTool == 5) {												// Editing menu
		this.selectedItems=[];												// Clear all previous selects
		if (this.segs.length > 0) {											// If something drawn
			var s=this.segs.length-1;										// Get last one drawn
			this.AddSelect(-1,s,false);										// Highlight it
			this.DrawMenu(this.segs[s].type);								// Draw menu, w/o resetting curtool
			}
		$("#shivaDrawDiv").css("cursor","auto");							// Regular cursor
		this.DrawWireframes(false);											// Show wireframes
		}
	else (this.curTool != -1)												// If not closed
		this.DrawMenu();													// Draw menu
}

///////////////////////////////////////////////////////////////////////////////////////////////
//  EVENTS
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Draw.prototype.onMouseUp=function(e)								// MOUSE UP HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return true;														// Quit
	if (shivaLib.dr.curTool == 5) 											// In edit
		e.stopPropagation();												// Trap event
	shivaLib.dr.leftClick=false;											// Left button up
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	if (e.shiftKey) {														// Shift key forces perpendicular lines
		if (Math.abs(x-shivaLib.dr.lastX) > Math.abs(y-shivaLib.dr.lastY))	// If mainly vertical
			y=shivaLib.dr.lastY;											// Hold y
		else																// Mainly horizontal
			x=shivaLib.dr.lastX;											// Hold x
		}
	if (shivaLib.dr.closeOnMouseUp) {										// After a drag-draw
		shivaLib.dr.closeOnMouseUp=false;									// Reset flag
		shivaLib.dr.curSeg=-1;												// Close segment
		return true;														// Quit
		}
	if (shivaLib.dr.curTool < 5 ) {											// Not in edit
		if (shivaLib.dr.snap)												// If snapping
			x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);		// Mod down coords
		if ((shivaLib.dr.curTool) && (e.target.id.indexOf("shtx") == -1))	// Not in line or over text
			shivaLib.dr.AddDot(x,y,true);									// Add coord
		}
	else if (shivaLib.dr.curTool > 4) 										// If in edit/idea map
		shivaLib.dr.AddSelect(x,y,e.shiftKey);								// Select seg/dot
	return (shivaLib.dr.curTool == 6);										// Set propagation
}


SHIVA_Draw.prototype.onMouseDown=function(e)							// MOUSE DOWN HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if (shivaLib.dr.curTool == 6) 											// If in idea
		return true;														// Quit
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	shivaLib.dr.leftClick=true;												// Left button down
	shivaLib.dr.closeOnMouseUp=false;										// Reset flag
	if (shivaLib.dr.snap)													// If snapping
		x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);			// Mod down coords
	if (shivaLib.dr.curTool == 5) {											// In edit mode
		shivaLib.dr.lastX=x;												// Save last X
		shivaLib.dr.lastY=y;												// Y
		e.stopPropagation();												// Trap event
		return false;														// Quit
		}
	if (e.target.id.indexOf("shtx") != -1)									// If over text box
		return;																// Quit
	if (shivaLib.dr.snap)													// If snapping
		x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);			// Mod down coords
	shivaLib.dr.AddDot(x,y,false);											// Add coord
	return false;															// Stop propagation
}

SHIVA_Draw.prototype.onMouseMove=function(e)							// MOUSE MOVE HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if ((shivaLib.dr.curTool == 6) || (shivaLib.dr.curTool == -1)) 			// If in idea or off
		return;																// Quit
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	if (shivaLib.dr.snap)													// If snapping
		x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);			// Mod down coords
	if ((shivaLib.dr.leftClick) && (shivaLib.dr.curTool == 5)) {			// If dragging seg in edit
		var dx=shivaLib.dr.lastX-x;											// Delta x
		var dy=shivaLib.dr.lastY-y;											// Y
		shivaLib.dr.MoveSegs(dx,dy,0);										// Move selected segs	
		shivaLib.dr.lastX=x;												// Save last X
		shivaLib.dr.lastY=y;												// Y
		return;																// Quit
		}
	if (shivaLib.dr.curSeg != -1) {											// If drawing
		if (shivaLib.dr.curTool != 5) 										// If not in edit mode
			shivaLib.dr.DrawOverlay();										// Draw overlay	
		if (e.shiftKey) {													// Shift key forces perpendicular lines
			if (Math.abs(x-shivaLib.dr.lastX) > Math.abs(y-shivaLib.dr.lastY))	// If mainly vertical
				y=shivaLib.dr.lastY;										// Hold y
			else															// Mainly horizontal
				x=shivaLib.dr.lastX;										// Hold x
			}
		if (shivaLib.dr.curTool == 0)										// Polygon
			shivaLib.g.DrawLine(shivaLib.dr.ctx,"#000",1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,1); // Rubber line
		else if ((shivaLib.dr.leftClick) && (shivaLib.dr.curTool == 1))		// Circle
			shivaLib.g.DrawCircle(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,Math.abs(x-shivaLib.dr.lastX),"#999",1);	// Rubber circle
		else if ((shivaLib.dr.leftClick) && (shivaLib.dr.curTool < 5))		// Box, text, image
			shivaLib.g.DrawBar(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,"#999",1); // Rubber box
		if ((shivaLib.dr.leftClick) && (shivaLib.dr.curTool == 0)){ 		// If dragging to draw
			if (new Date().getTime()-shivaLib.dr.lastDotTime > 100)	{		// If not too close to last one
				shivaLib.dr.AddDot(x,y);									// Add coord
				shivaLib.dr.closeOnMouseUp=true;							// Close seg on mouse up
				}
			}
		}
}

SHIVA_Draw.prototype.onKeyDown=function(e)								// KEY DOWN HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if ((e.keyCode == 8) &&													// Look for Del key
        (e.target.tagName != "TEXTAREA") && 								// In text area
        (e.target.tagName != "INPUT")) { 									// or input
		e.stopPropagation();												// Trap it
     	return false;
    }
}

SHIVA_Draw.prototype.onKeyUp=function(e)								// KEY UP HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if ((e.which == 83) && (e.ctrlKey) && (e.altKey)) {						// CTRL+ALT+S
		shivaLib.SaveData("eStore");										// Open eStore dialog	
		return;																// Quit
		}
	var i;
	if ((e.target.tagName == "TEXTAREA") || (e.target.tagName == "INPUT"))	// If in text entry
		return;																// Quit
	if ((e.which == 67) && (e.ctrlKey))	{									// Copy
		if (shivaLib.dr.selectedItems.length) {								// If something selected
			shivaLib.Sound("click");										// Play sound
			shivaLib.dr.clipboard=[];										// Clear clipboard
			}	
		for (i=0;i<shivaLib.dr.selectedItems.length;++i) 					
			shivaLib.dr.clipboard.push(shivaLib.Clone(shivaLib.dr.segs[shivaLib.dr.selectedItems[i]]));
		}
	if ((e.which == 86) && (e.ctrlKey))	{									// Paste
		if (shivaLib.dr.clipboard.length) {									// If something in clipboard
			shivaLib.dr.selectedItems=[];									// Clear selects
			shivaLib.Sound("ding");											// Play sound
			for (i=0;i<shivaLib.dr.clipboard.length;++i) {					// For each seg in clipboard				
				shivaLib.dr.selectedItems.push(shivaLib.dr.segs.length);	// Add to selects
				shivaLib.dr.segs.push(shivaLib.Clone(shivaLib.dr.clipboard[i])); // Add seg
				}
			}
		}	


	if (shivaLib.dr.curTool == 6) {											// In idea mode
		num=shivaLib.dr.selectedItems[0];									// Point at 1st select
		if (((e.which == 8) || (e.which == 46)) && (num != -1)) 			// If DEL and an active n
			shivaLib.dr.DeleteIdea();										// Delete it
		}
	var num=shivaLib.dr.curSeg;												// Point at currently drawn seg
	if (((e.which == 8) || (e.which == 46)) && (num != -1)) {				// If DEL and an active seg
		var o=shivaLib.dr.segs[num];										// Point at seg
		o.x.pop();		o.y.pop();											// Delete last dot xy
		shivaLib.dr.lastX=o.x[o.x.length-1];								// Set last x to end point
		shivaLib.dr.lastY=o.y[o.y.length-1];								// Set last y to end point
		shivaLib.dr.DrawOverlay();											// Redraw	
		shivaLib.Sound("delete");											// Play sound
		}
	if ((e.which == 27) && (num != -1))	{									// If ESC and an active seg
		shivaLib.dr.curSeg=-1;												// End current seg, if open
		shivaLib.Sound("dclick");											// Play sound
		}
	else if (shivaLib.dr.curTool == 5) {									// In edit mode
		if ((e.which == 8) || (e.which == 46)) {							// If DEL 
			if (shivaLib.dr.selectedItems.length) {							// If DEL and some selected segs
				num=shivaLib.dr.selectedItems[0];							// Point at 1st select
				if ((shivaLib.dr.selectedDot != -1) && (shivaLib.dr.segs[num].type == 0)) { // If a dot selected on a polygon
					shivaLib.dr.segs[num].x.splice(shivaLib.dr.selectedDot,1);	// Remove x dot
					shivaLib.dr.segs[num].y.splice(shivaLib.dr.selectedDot,1);	// Y
					}
				else if (e.target.id.indexOf("shtx") == -1)					// If not over text box remove whole segments(s)
					for (var i=0;i<shivaLib.dr.selectedItems.length;++i) {	// For each selected element
						$("#shtx"+shivaLib.dr.selectedItems[i]).remove();	// Delete text box, if any
						$("#shim"+shivaLib.dr.selectedItems[i]).remove();	// Delete image box, if any
						shivaLib.dr.segs.splice(shivaLib.dr.selectedItems[i],1);// Remove seg
						}


				shivaLib.dr.DrawOverlay();									// Redraw	
				shivaLib.dr.DrawWireframes(false);							// Draw wireframes
				shivaLib.Sound("delete");									// Play sound
				}
			}
	else if ((e.which == 40) && (e.shiftKey)) shivaLib.dr.MoveSegs(0,0,-1);	// SH-Up to order up
	else if ((e.which == 38) && (e.shiftKey)) shivaLib.dr.MoveSegs(0,0,1);	// SH-Dn to order down
	else if (e.which == 39)  shivaLib.dr.MoveSegs(-1,0,0);					// Move L 
	else if (e.which == 37)  shivaLib.dr.MoveSegs(1,0,0);					// Move R
	else if (e.which == 40)  shivaLib.dr.MoveSegs(0,-1,0);					// Move U 
	else if (e.which == 38)  shivaLib.dr.MoveSegs(0,1,0);					// Move D 
	}
}

SHIVA_Draw.prototype.AddSelect=function(x, y, shiftKey)					// SELECT SEGMENT/DOT FROM CLICK
{
	var i,j,o,seg=-1,asp;
	var oldDot=this.selectedDot;											// Save original dot
	this.selectedDot=-1;													// No selected dot
	var last=this.selectedItems[0];											// Save selected seg
	if (x != -1) {															// If not a forcing a selection
		if (!shiftKey) {													// If shift key unpressed
			this.selectedItems=[];											// Clear all previous selects
			$("#shivaDrawDiv").css("cursor","auto");						// Default cursor
			}
		if (this.curTool == 6)	{											// If idea map
			for (i=0;i<this.segs.length;++i) {								// For each seg
				o=this.segs[i];												// Point at seg
				if (o.type != 5)											// If an idea map node
					continue;												// Skip it
				var d=$("#shivaIdea"+i);									// Div id										
				if ((x > o.ideaLeft) && (x < Number(o.ideaLeft)+Number(d.width())+16) &&	// In h
				    (y > o.ideaTop ) && (y < Number(o.ideaTop)+Number(d.height())+16)) {	// In v
					this.selectedItems.push(i);								// Add to selects
					this.ideaShape=o.ideaShape;								// Shape
					this.ideaBackCol=o.ideaBackCol;							// Back col
					this.ideaGradient=o.ideaGradient;						// Gradient
					this.ideaEdgeCol=o.ideaEdgeCol;							// Edge col
					this.ideaTextCol=o.ideaTextCol;							// Text col
					this.ideaBold=o.ideaBold;								// Bold text
					this.SetMenuProperties();								// Set menu properties
					this.selectedItems[0]=i;								// Set select
					break;
					}
				}
				this.HighlightIdea();										// Set highlight
				return;
			}
		for (i=0;i<this.segs.length;++i) {									// For each seg
			o=this.segs[i];													// Point at seg
			if ((!o.x) || (o.type == 5))									// If an idea map node or no x
				continue;													// Skip it
			for (j=0;j<o.x.length;++j) 										// For each dot in seg
				if ((x > o.x[j]-6) && (x < o.x[j]+6) && (y > o.y[j]-6) && (y < o.y[j]+6)) { // If near
					if (last == i) 											// If clicking on already selected seg 
						this.selectedDot=j;									// This is the selected dot
					seg=i;													// Got one!
					break;													// Quit looking
					}
			}
		if (seg == -1) {													// If no seg/dot selected
			for (i=0;i<this.segs.length;++i) {								// For each seg
				var minx=99999,maxx=0,miny=99999,maxy=0;					// Set limits
				o=this.segs[i];												// Point at seg
				if (o.type == 5)											// If an idea map node
					continue;												// Skip it
				if (o.type == 1) {											// A circle
					j=Math.abs(o.x[1]-o.x[0]);								// Radius
					minx=o.x[0]-j;	maxx=o.x[1];							// X
					miny=o.y[0]-j;	maxy=Number(o.y[0])+j;					// Y
					}
				else
					for (j=0;j<o.x.length;++j) {							// For each dot in seg
						minx=Math.min(minx,o.x[j]);							// Minx
						miny=Math.min(miny,o.y[j]);							// Miny
						maxx=Math.max(maxx,o.x[j]);							// Maxx
						maxy=Math.max(maxy,o.y[j]);							// Maxy
						}
				if ((x > minx) && (x < maxx) && (y > miny) && (y < maxy)) {	// If within bounds
					seg=i;													// Got one!
					break;													// Quit looking
					}
				}
			}
		}
	else																	// Forcing a select
		seg=y;																// Get it from y

	if (seg != -1) {														// If a seg/dot selected
		o=this.segs[seg];													// Point at seg
		if (this.selectedDot != -1)	{										// If a specific dot selected
			$("#shivaDrawDiv").css("cursor","crosshair");					// Crosshair cursor
			if (oldDot != this.selectedDot)									// If a new selection
				shivaLib.Sound("dclick");									// Double-click
			}
		else{																// Whole seg
			$("#shivaDrawDiv").css("cursor","move");						// Move cursor
			shivaLib.Sound("click");										// Click
			}
		this.selectedItems.push(seg);										// Add seg to selects
		this.alpha=o.alpha;													// Everyone has alpha
		this.startTime=o.s;													// Everyone has start
		this.endTime=o.e;													// Everyone has end
		this.curve=o.curve;													// Everyone has curce
		if (o.type < 3)	{													// Line, cir, box	
			this.arrow=o.arrow;												
			this.curve=o.curve;												
			this.color=o.color;							
			this.edgeColor=o.edgeColor;
			this.edgeWidth=o.edgeWidth;	
			}
		else if (o.type == 3) {												// Text		
			this.curve=o.curve;												
			this.textColor=o.textColor;
			this.boxColor=o.boxColor;
			this.textSize=o.textSize;
			this.textAlign=o.textAlign;
			}
		else if (o.type == 4) {												// Image		
			o=this.segs[seg];												// Point at seg
			asp=$("#shimi"+seg).height()/$("#shimi"+seg).width();			// Get aspect
			if (!asp)	asp=1;												// If no asp, force to 1
			if (!isNaN(asp))												// If a valid #
				o.y[1]=o.y[0]+(Math.abs(o.x[1]-o.x[0])*asp);				// Conform y to asp
			this.edgeColor=o.edgeColor;										// Edge color
			this.edgeWidth=o.edgeWidth;										// Edge with
			this.DrawOverlay();												// Draw segments
			}
		this.DrawMenu(o.type);												// Set proper menu for type
		this.SetMenuProperties();											// Set menu properties
		}
	this.DrawWireframes(false);												// Draw wireframes
}

SHIVA_Draw.prototype.MoveSegs=function(dx, dy, dz)						// MOVE SELECTED SEGS
{
	var i,j,o,oo;
	for (i=0;i<this.selectedItems.length;++i) {								// For each selected element
		o=this.segs[this.selectedItems[i]];									// Point at seg
		if (o.type == 5)													// If an idea map node
			continue;														// Skip it
		if (dz) {															// If shifting order
			if ((this.selectedItems[i]+dz < 0) || (this.selectedItems[i]+dz >= this.segs.length)) {  // If out of range
				shivaLib.Sound("delete");									// Delete
				continue;													// Skip
				}
			oo=this.segs[this.selectedItems[i]+dz];							// Sve dest seg
			this.segs[this.selectedItems[i]+dz]=o;							// Move to dest
			this.segs[this.selectedItems[i]]=oo;							// Copy dest to src 
			this.selectedItems[i]+=dz;										// Dest is now selected one
			shivaLib.Sound("click");										// Click
			}
		if (this.selectedDot != -1)											// If single dot selected
			o.x[this.selectedDot]-=dx,o.y[this.selectedDot]-=dy;			// Shift it
		else																// Whole seg
			for (j=0;j<o.x.length;++j) 										// For each dot in seg
				o.x[j]-=dx,o.y[j]-=dy;										// Shift dot
		}
	this.DrawOverlay();														// Draw segments
	this.DrawWireframes(false);												// Draw wireframes
}

SHIVA_Draw.prototype.AddIdea=function(num) 								//	ADD IDEA NODE 
{
	var i,off=0;
	var o=new Object;
	if ((num != -1) && (this.selectedItems.length))							// If highlighted
		num=this.selectedItems[0]											// This is the parent
	o.type=5;																// Idea map
	o.id=this.segs.length;													// Save id
	o.ideaParent=num;														// Parent
	o.ideaShape=this.ideaShape;												// Box color
	o.ideaBackCol=this.ideaBackCol;											// Box color
	o.ideaGradient=this.ideaGradient;										// Gradient?
	o.ideaBold=this.ideaBold;												// Bold?
	o.ideaEdgeCol=this.ideaEdgeCol;											// Edge color
	o.ideaTextCol=this.ideaTextCol;											// Text color
	o.text="A new idea";													// Text
	o.ideaHgt=21;	o.ideaWid=100;											// Size
	if (num == -1) {														// First one
		o.ideaLeft=$("#shivaDrawDiv").width()/2;							// Center x
		o.ideaTop=$("#shivaDrawDiv").height()/2;							// Center y
		}
	else{                                                                   // A child
		for (i=0;i<this.segs.length;++i)                                    // For each seg
		  if (this.segs[i].ideaParent == num)                               // If siblings
		      off+=10;                                                      // Add to offset
		o.ideaLeft=this.segs[num].ideaLeft+off;								// Same x
		o.ideaTop=(Number(this.segs[num].ideaTop)+Number(this.segs[num].ideaHgt)+32+off);	// Put under parent
		}
	if (shivaLib.player)													// If over a player
		o.s=this.startTime,o.e=this.endTime;								// Set time
	num=this.selectedItems[0]=this.segs.length;;							// Set select
	this.segs.push(o);														// Add idea
	shivaLib.Sound("ding");													// Ding sound
	this.DrawOverlay();														// Draw idea map
}

SHIVA_Draw.prototype.HighlightIdea=function() 							//	HIGHLIGHT IDEA NODE 
{
	var i,dd;
	$("#shivaIdeaAddBut").remove();											// Take off add but
	for (i=0;i<this.segs.length;++i) {										// For each seg
		var wid=1;															// 1 pixel borders
		dd="#shivaIdea"+i;													// Div id										
		if (this.segs[i].ideaEdgeCol == -1)									// If col is none
			$(dd).css("border","none");										// No border
		else																// Had color
			$(dd).css("border",wid+"px solid "+this.segs[i].ideaEdgeCol);	// Regular border
		}
	if (this.selectedItems.length)	{										// If highlighted
		dd="#shivaIdea"+this.selectedItems[0];								// Div id										
		$(dd).css("border","1px dashed red");								// Red outline
		var x=$(dd).width()/2;												// Center
		var y=$(dd).height();												// Bottom
		var str="<div id='shivaIdeaAddBut' style='position:absolute;top:"+y+"px;left:"+x+"px'><img src='adddot.gif' title='Add child idea' onmouseup='shivaLib.dr.AddIdea(0)'></div>"
		$(dd).append(str);													// Add add but
		}
}

SHIVA_Draw.prototype.DeleteIdea=function() 								//	DELETE IDEA NODE 
{
	if (!this.selectedItems.length)											// Nothing selected
		return;																// Quit
	num=this.selectedItems[0];												// Get index
	if (this.segs[num].ideaParent != -1) {									// If connected
		shivaLib.Sound("click");											// click sound
		this.segs[num].ideaParent=-1;										// Free float it
		}
	else{																	// Delete them
		this.selectedItems=[];												// Deselect
		$("#shivaIdea"+num).remove();										// Remove idea node
		this.segs.splice(num,1);											// Remove seg
		this.DeleteIdeaChildren(num);										// Remove children recursively
		shivaLib.Sound("delete");											// Delete sound
		}
	this.DrawOverlay();														// Draw idea map
}

SHIVA_Draw.prototype.DeleteIdeaChildren=function(parent) 				//	DELETE IDEA CHILD NODES RECURSIVELY
{
	var i;
	for (i=0;i<this.segs.length;++i) {										// For each node
		if (this.segs[i].type != 5)											// If not an idea node
			continue;														// Skip it
		if (this.segs[i].ideaParent == parent) {							// If a child of parent									
			var id=this.segs[i].id;											// Real id
			$("#shivaIdea"+id).remove();									// Remove idea node
			this.segs.splice(i,1);											// Remove child
			this.DeleteIdeaChildren(id);									// Look for children
			this.DeleteIdeaChildren(parent);								// Look for siblings
			break;
			}
		}
}

SHIVA_Draw.prototype.MoveIdeaChildren=function(parent, dx, dy) 			//	MOVE IDEA CHILD NODES RECURSIVELY
{
	var i;
	for (i=0;i<this.segs.length;++i) {										// For each node
		if (this.segs[i].type != 5)											// If not an idea node
			continue;														// Skip it
		if (this.segs[i].ideaParent == parent) {							// If a child of parent									
			this.segs[i].ideaLeft=Number(this.segs[i].ideaLeft)+Number(dx);	// X
			this.segs[i].ideaTop=Number(this.segs[i].ideaTop)+Number(dy);	// Y
			$("#shivaIdea"+i).css("left",this.segs[i].ideaLeft+"px").css("top",this.segs[i].ideaTop+"px");
			this.MoveIdeaChildren(i,dx,dy);									// Look for children
			}
		}
}

SHIVA_Draw.prototype.IdeaDrop=function(from, to) 						//	HANDLE IDEA NODE DRAG & DROP
{
	this.segs[from].ideaParent=to;											// Connect
	shivaLib.Sound("ding");													// Ding sound
}

//////////// COLORPICKER

SHIVA_Show.prototype.ColorPicker = function(mode, attr) {
    $("#shiva_dialogDiv").remove();                                     //remove existing dialogs
    var self = this;
    var inputBox = $("#propInput" + attr);

    //HELPER FUNCTIONS
    this.HEX_to_HSV = function(hexString) {                             
        var value = hexString.substring(1);
        
        var r = parseInt(value.substring(0, 2), 16) / 255;
        var g = parseInt(value.substring(2, 4), 16) / 255;
        var b = parseInt(value.substring(4, 6), 16) / 255;

        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);

        var hue;
        var sat;
        var val = max;

        var delta = max - min;
        if (max != 0)
            sat = delta / max;
        else {
            sat = 0;
            hue = 0;
            return;
        }

        if (delta == 0) {
            return [0, 0, val];
        }

        if (r == max)
            hue = (g - b) / delta;
        else if (g == max)
            hue = 2 + (b - r) / delta;
        else
            hue = 4 + (r - g) / delta;
        hue *= 60;
        if (hue < 0)
            hue += 360;
        return [hue, sat, val];
    }

    this.RGB_to_HSV = function(r, g, b) {

        var max = Math.max.apply(Math, [r, g, b]);
        var min = Math.min.apply(Math, [r, g, b]);

        var hue;
        var sat;
        var val = max;

        var delta = max - min;

        if (max != 0)
            sat = delta / max;
        else {
            sat = 0;
            hue = 0;
            return [hue, sat, val];
        }

        if (delta == 0) {
            return [0, 0, val];
        }

        if (r == max) {
            hue = (g - b) / delta;
        } else if (g == max) {
            hue = 2 + (b - r) / delta;
        } else {
            hue = 4 + (r - g) / delta;
        }

        hue *= 60;
        if (hue < 0)
            hue += 360;
        return [hue, sat, val];
    }

    this.HSV_to_HEX = function(h, s, v) {

        if (h === 0)
            h = .001;
        else if (h == 360)
            h = 359.999;

        chroma = v * s;
        hprime = h / 60;
        x = chroma * (1 - Math.abs(hprime % 2 - 1));

        var r;
        var g;
        var b;

        if (h == 0)
            r, g, b = 0;
        else if (hprime >= 0 && hprime < 1) {
            r = chroma;
            g = x;
            b = 0;
        } else if (hprime >= 1 && hprime < 2) {
            r = x;
            g = chroma;
            b = 0;
        } else if (hprime >= 2 && hprime < 3) {
            r = 0;
            g = chroma;
            b = x;
        } else if (hprime >= 3 && hprime < 4) {
            r = 0;
            g = x;
            b = chroma;
        } else if (hprime >= 4 && hprime < 5) {
            r = x;
            g = 0;
            b = chroma;
        } else if (hprime >= 5 && hprime < 6) {

            r = chroma;
            g = 0;
            b = x;
        }

        m = v - chroma;
        r = Math.round(255 * (r + m));
        g = Math.round(255 * (g + m));
        b = Math.round(255 * (b + m));

        return self.RGB_to_HEX(r, g, b);
    }

    this.RGB_to_HEX = function(r, g, b) {
        h1 = Math.floor(r / 16).toString(16);
        h2 = Math.floor((r % 16)).toString(16);
        h3 = Math.floor(g / 16).toString(16);
        h4 = Math.floor((g % 16)).toString(16);
        h5 = Math.floor(b / 16).toString(16);
        h6 = Math.floor((b % 16)).toString(16);

        return "#" + h1 + h2 + h3 + h4 + h5 + h6;
    }
    
    //  BUILDING THE COLORPICKER
    var hue = 0;
    var sat = 1;
    var val = 1;
    var cp_current = 0;
    var cp_first = 0;

    $('body').append($("<div>", {
        id : 'shiva_dialogDiv',
        class : 'propTable',
        css : {
            position : 'absolute',
            right : '100px',
            top : '30px',
            width : '240px',
            marginLeft : '2px',
            marginRight : '2px',
            padding : '5px',
            paddingBottom : '30px',
            paddingTop : '10px',
        },
    }).draggable());
    //TABS
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_colorbar',
        css : {
            position : 'absolute',
            right : '1px',
            top : '-1px',
            width : '244px',
            height : '22px',
            borderTopLeftRadius : '8px',
            borderTopRightRadius : '8px',
        }
    }));
    $("#cp_colorbar").append($("<a>", {
        class : 'cbar_control',
        css : {
            width : '30px',
            height : '20px',
            position : 'relative',
            left : '-5px',
            float : 'left',
            border : '0',
            borderRadius : '0',
            borderTopLeftRadius : '8px',
            borderRight : '1px solid gray',
            borderBottom : '1px solid gray',
        },
        click : function() {
            if (cp_first > 0)
                cp_first--;
            self.position_bar();
        },
    }).button({
        icons : {
            primary : 'ui-icon-arrowthick-1-w'
        },
        text : false
    }));
    $("#cp_colorbar").append($("<a>", {
        class : 'cbar_control',
        css : {
            width : '28px',
            height : '20px',
            position : 'absolute',
            left : '216px',
            top : '0px',
            border : '0',
            borderRadius : '0',
            borderTopRightRadius : '8px',
            borderLeft : '1px solid gray',
            borderBottom : '1px solid gray',
        },
        click : function() {
            if (cp_first < $(".tab").length - 5)
                cp_first++
            self.position_bar();
        }
    }).button({
        icons : {
            primary : 'ui-icon-arrowthick-1-e'
        },
        text : false
    }));
    $("#cp_colorbar").append($("<a>", {
        class : 'cbar_control',
        css : {
            width : '18.5px',
            height : '20px',
            position : 'absolute',
            top : '0',
            left : '196px',
            border : '0',
            borderRadius : '0',
            borderLeft : '1px solid gray',
            borderBottom : '1px solid gray',
        },
        click : function() {
            cp_first++;
            self.add();
        }
    }).button({
        icons : {
            primary : 'ui-icon-plusthick'
        },
        text : false
    }));
    $("#cp_colorbar a").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $("#shiva_dialogDiv").append($("<span>", {
        html : "S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B",
        css : {
            color : 'gray',
            position : 'absolute',
            top : '25px',
            left : '186px',
        }
    }));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_colormap',
        css : {
            position : 'relative',
            top : '20px',
            width : '150px',
            padding : '2px',
            height : '150px',
        }
    }));
    $("#cp_colormap").append($("<img>", {
        src : 'hsv_wheel.png',
        click : function(e) {
            self.position((e.pageX - $(this).parent().offset().left), (e.pageY - $(this).parent().offset().top));
        },
    }))
    $("#shiva_dialogDiv").append($("<input>", {
        id : 'cp_current',
        maxLength : '7',
        css : {
            position : 'absolute',
            top : '97px',
            left : '52.5px',
            width : '58px',
            height : '20px',
            border : '0',
            textAlign : 'center',
            backgroundColor : 'transparent',
        },
        change : function() {
            var val = $(this).attr("value");
            if (val[0] != "#")
                val = "#" + val;
            if (val == "none")
                self.update(null);
            else if (val.length === 7) {
                var hsv = self.HEX_to_HSV(val);
                if (hsv == -1) {
                    self.setColor(0, 0, 0);
                    $(this).attr("value", "000000");
                } else {
                    hue = hsv[0];
                    sat = hsv[1];
                    val = hsv[2];
                    self.setColor(hue, sat, val);
                }
            }
        }
    }));
    //SLIDERS
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_brightness',
        class : 'slider',
        title : 'brightness',
        css : {
            width : '5px',
            height : '85px',
            position : 'relative',
            right : '24.5px',
            top : '-120px',
            float : 'right',
            borderRadius : '8px',
            border : '1px solid gray',
        }
    }).slider({
        value : 100,
        orientation : 'vertical'
    }));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_saturation',
        title : 'saturation',
        class : 'slider',
        css : {
            width : '5px',
            height : '85px',
            position : 'relative',
            right : '45.5px',
            top : '-120px',
            float : 'right',
            borderRadius : '8px',
            border : '1px solid gray',
        }
    }).slider({
        value : 100,
        orientation : 'vertical'
    }));
    $(".slider a").css("width", '20px');
    $(".slider a").css("height", '10px');
    $(".slider a").css("left", "-8px");
    $(".slider").first().slider("option", "slide", function() {
        self.setColor(hue, sat, $(this).slider("option", "value") / 100);
    });
    $(".slider").last().slider("option", "slide", function() {
        self.setColor(hue,$(this).slider("option", "value") / 100, val);
    });
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_chip',
        css : {
            border : '1px solid gray',
            borderRadius : '4px',
            width : '50px',
            height : '30px',
            position : 'relative',
            left : '172px',
            top: '-25px',
        },
    }));
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_basic',
        css : {
            width : '216px',
            position : 'relative',
            left : '10px',
        }
    }));
    $("#cp_basic").append($("<div>", {
        id : 'basic_colors',
        css : {
            position : 'absolute',
            width : '216px',
            height : '20px',
            border : '1px solid gray',
        }
    }))
    $("#cp_basic").append($("<div>", {
        id : 'neutral',
        css : {
            position : 'absolute',
            top : '20px',
            width : '216px',
            height : '20px',
            border : '1px solid gray',
        }
    }))
    var form = [16, 16];
    for (var i = 0; i < 2; i++) {
        var html = "";
        for (var j = 0; j < form[i]; j++) {
            html += "<div class= \'chips\' style=\'height:100%;width:" + ((1 / form[i]) * 100) + "%;float:left\'></div>";
        }
        $("#cp_basic").children().eq(i).html(html);
    }
    for (var i = 0; i < 16; i++) {
        $("#basic_colors").children().eq(i).css("backgroundColor", self.HSV_to_HEX((i * 22.5), 1, 1))
    }
    for (var i = 0; i < 16; i++) {
        $("#neutral").children().eq(i).css("backgroundColor", self.HSV_to_HEX(0, 0, (i * 0.06666666666666667)));
    }
    $("#cp_basic").children().children().click(function() {
        var color = $(this).css("backgroundColor");
        color = color.slice(4, color.length - 1);
        color = color.split(",");
        var hsv = self.RGB_to_HSV(color[0] / 255, color[1] / 255, color[2] / 255);
        self.setColor(hsv[0], hsv[1], hsv[2]);
    });

    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_control',
        css : {
            width : '216px',
            height : '30px',
            position : 'relative',
            top : '50px',
        }
    }));

    //SCHEMES
    $("#cp_control").append($("<button>", {
        id : 'cp_schemes',
        class : 'button',
        html : 'Schemes',
        css : {
            left : '18px',
        },
        click : function() {
            $("#cp_schemediv").toggle();
        }
    }))
    $("#shiva_dialogDiv").append($("<div>", {
        id : 'cp_schemediv',
        css : {
            height : '160px',
            position : 'relative',
            top : '60px',
            paddingBottom : '30px',

        }
    }));
    $("#cp_schemediv").hide();

    $("#cp_schemediv").append($("<div>", {
        id : 'cp_schemebox',
    }));
    for (var i = 0; i < 4; i++) {
        $("#cp_schemebox").append($("<div>", {
            css : {
                width : '100%',
                height : '35px',
                position : 'relative',
                top : '-5px',
                paddingBottom : '2px',
                paddingTop : '2px',
            }
        }));
    };
    var names = [["monochromatic"], ["complementary", "split-complementary"], ["triadic", "analagous"], ["tetrad"]];
    var form = [[16], [2, 3], [3, 3], [4]];
    for (var i = 0; i < form.length; i++) {
        for (var j = 0; j < form[i].length; j++) {
            $("#cp_schemebox").children().eq(i).append($("<div>", {
                html : "<center>" + names[i][j] + "</center>",
                css : {
                    float : 'left',
                    position : 'absolute',
                    top : '0',
                    left : (((92 / form[i].length) + 2) * j) + 2 + "%",
                    fontSize : '10px',
                    width : 92 / form[i].length + "%",
                    height : '100%',
                }
            }));
            for (var k = 0; k < form[i][j]; k++) {
                $("#cp_schemebox").children().eq(i).children("div").eq(j).append($("<div>", {
                    css : {
                        float : 'left',
                        position : 'relative',
                        top : '1px',
                        width : 100 / form[i][j] + "%",
                        height : '50%',
                    }
                }));
            }
        }
    }
    $("#cp_schemebox").children().children().css("fontSize", "8.5px");
    $("#cp_schemebox div:not(:has(*))").filter("div").click(function() {
        var color = $(this).css("backgroundColor");
        color = color.slice(4, color.length - 1);
        color = color.split(",");
        color = self.RGB_to_HEX(color[0], color[1], color[2]);
        $(".tab").eq(cp_current).children().first().css("backgroundColor", color);
        $(".tab").eq(cp_current).children().first().html("");
        self.drawColors(color);
    });
    ///end of schemes

    $("#cp_control").append($("<button>", {
        id : 'cp_nocolor',
        class : 'button',
        html : "No color",
        css : {
            left : '22px',
        },
        click : function() {
            self.update("none");
        }
    }));

    $("#cp_control").append($("<button>", {
        id : 'cp_OK',
        class : 'button',
        html : "OK",
        css : {
            width : '60px',
            left : '35px',
        },
        click : function() {
            $("#shiva_dialogDiv").remove();
            return;
        }
    }))
    $(".button").button();
    $(".button").css({
        position : 'relative',
        borderRadius : '8px',
        float : 'left',
        fontSize : '9px',
        top : '3px',
    });

    this.scheme = function() {    //Dynamically builds the schemes                                      
        for (var i = 0; i < 16; i++) {
            $("#cp_schemebox").children("div").eq(0).children("div").eq(0).children("div").eq(i).css("backgroundColor", self.HSV_to_HEX(hue, (1 - (i / 16)), 1));
        }
        $("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 180) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 150) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 210) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 120) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 240) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX((hue + 330) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 390) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(0).css("backgroundColor", self.HSV_to_HEX(hue, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(1).css("backgroundColor", self.HSV_to_HEX((hue + 30) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(2).css("backgroundColor", self.HSV_to_HEX((hue + 180) % 360, sat, val));
        $("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(3).css("backgroundColor", self.HSV_to_HEX((hue + 210) % 360, sat, val));
    }

    this.update = function(attr, value) {     //Sets "hue", "sat", or "val" and handles the consequences
        if (attr == "none") {
            $(".tab").eq(cp_current).children().html("<center>none</center>");
            $(".tab").eq(cp_current).children().css("backgroundColor", "white");
            $("#cp_chip").css("backgroundColor", "white");
            $("#cp_chip").css("border", "1px dashed gray");
            $(".slider").first().slider("option", "value", 100);
            $(".slider").last().slider("option", "value", 100);
            //handle inputBox?
        } else if (attr == null) {
            $(".tab").eq(cp_current).children().html("");
            $(".tab").eq(cp_current).children().css("backgroundColor", "transparent");
            $("#cp_current").attr("value", "");
            $("#cp_chip").css("backgroundColor", "transparent");
            $("#cp_chip").css("border", "1px dashed gray");
            $(".slider").first().slider("option", "value", 100)
            $(".slider").last().slider("option", "value", 100)
            //handle inputBox?
        } else {
            if (attr == "saturation") {
                sat = value;
            } else if (attr == "brightness") {
                val = value;
            } else if (attr == "hue") {
                hue = value;
            }
            var color = self.HSV_to_HEX(hue, sat, val);
            $("#cp_chip").css("backgroundColor", color);
            $("#cp_chip").css("border", "1px solid gray");
            $("#cp_current").attr("value", color.slice(1))
            $(".tab").eq(cp_current).children().css("backgroundColor", color)
            $(".tab").eq(cp_current).children().html('');
            $(".slider").first().slider("option", "value", val * 100)
            $(".slider").last().slider("option", "value", sat * 100)
        }
        self.scheme()
    }

    this.add = function(color_HEX) {                //Adds a new chip to the tabs
        cp_current = $(".tab").length;
        $("#cp_colorbar a:eq(1)").before($("<div>", {
            class : 'tab',
            css : {
                height : '16px',
                width : '28px',
                border : '1px solid gray',
                borderTop : '0',
                padding : '2px',
                position : 'relative',
                left : '-6px',
                float : 'left',
            },
            click : function() {
                $(".tab:not(:eq(" + $(this).index(".tab") + "))").css("borderBottom", '1px solid gray');
                $(this).css("borderBottom", '0');
                cp_current = $(this).index(".tab");
            }
        }).append($("<div>", {
            css : {
                fontSize : '10px',
                width : "100%",
                height : '100%',
            }
        })).append($("<img>", {
            src : 'cpclose.png',
            css : {
                width : '4px',
                position : 'absolute',
                top : '2.5px',
                right : '2.5px',
            },
            mouseenter : function() {
                $(this).css({
                    width : '10px',
                })
            },
            mouseleave : function() {
                $(this).css({
                    width : '4px',
                })
            },
            click : function() {
                cp_current = $(this).parent().index(".tab");
                self.removeTab();
            }
        })));
        if (color_HEX == "none") {
            $('.tab').last().children().css("backgroundColor", "transparent");
            self.update("none");
        } else if (color_HEX == null) {
            $('.tab').last().children().css("backgroundColor", "transparent");
            self.update(null);
        } else {
            $('.tab').last().children().css("backgroundColor", color_HEX);
            var color = self.HEX_to_HSV(color_HEX);
            if ( typeof color != "undefined")
                self.setColor(color[0], color[1], color[2]);
            else
                self.setColor(0, 0, 0);
        }
        self.position_bar();
    }
    
    this.drawColors = function(color_HEX){
        var colors = inputBox.val().split(",");
        colors[cp_current] = color_HEX.slice(1);
        
        var boxChip = colors[cp_current];
        boxChip = "#"+boxChip;
        var str = "#propInput" + attr;
        $(str).css('border-color', boxChip);
        $(str + "C").css('background-color', boxChip);
          
        var str = colors.toString();

        if (str[str.length - 1] != ",")
            str += ",";
        inputBox.val(str);

        Draw();
    }

    this.setColor = function(h, s, v) {                       
        self.update("hue", h);
        self.update("saturation", s);
        self.update("brightness", v);

       self.drawColors(self.HSV_to_HEX(h, s, v));
    }

    this.position_bar = function() {
        if (cp_current > cp_first + 4)
            cp_current = cp_first + 4;
        $(".tab").eq(cp_current).click();
        $(".tab").show();
        $(".tab:lt(" + cp_first + ")").hide();
        $(".tab:gt(" + (cp_first + 4) + ")").hide();
    }
    //HANDLES the setting of HUE by angle relative to the center of the wheel
    this.position = function(x, y) {
        var xrel = x - 75;
        var yrel = 75 - y;
        var angleR = Math.atan2(yrel, xrel);

        var angle = angleR * (180 / Math.PI);
        var h;

        if (angle > 0) {
            h = (360 - (angle - 90)) % 360;
        } else {
            h = 90 + (angle - (angle * 2));
        }
        self.setColor(h, 1, 1);
    }

    this.removeTab = function() {
        $(".tab").eq(cp_current).remove();
        var colors = inputBox.val();
        colors = colors.split(",");
        colors.splice(cp_current, 1)
        var str = colors.toString();
        if (str[str.length - 1] != ",")
            str = str + ",";
        inputBox.val(str);
        while ($(".tab").length < 5)
        self.add();
        cp_current = cp_first;
        $(".tab").eq(cp_current).click();
        Draw();
    }
    //COLORPICKER INITIALIZATION

    var oldcols = inputBox.val();

    //SINGLE color mode
    if (mode == 0) {
        $("#cp_colorbar").hide();
        if (oldcols != "") {
            if (oldcols[0] != "#")
                oldcols = "#" + oldcols;
            var color = self.HEX_to_HSV(oldcols);
            self.setColor(color[0], color[1], color[2]);
        }
    }
    //MULTI color mode
    else {
        $("#cp_nocolor").hide();
        $("#cp_OK").css("left", '90px');
        if (oldcols != "") {
            oldcols = oldcols.split(",");
            var rem = 6 - oldcols.length;
            for (var i = 0; i < oldcols.length; i++) {
                if (oldcols[i] != "") {
                    self.add("#" + oldcols[i]);
                }
            }
            if (rem > 0) {
                for (var j = 0; j < rem; j++) {
                    self.add();
                }
            }
        } else {
            for (var j = 0; j < 5; j++) {
                self.add();
            }
        }

        $(".tab").first().click();
        Draw();

        $(".tab").hover(function() {
            $(this).css("cursor", "pointer");
        });
    }
    $("#cp_schemebox div:not(:has(*))").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $("#cp_basic div:not(:has(*))").hover(function() {
        $(this).css("cursor", "pointer");
    });
    $(".slider a").hover(function() {
        $(this).css("cursor", "pointer");
    });

}