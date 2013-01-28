///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB MAIN
///////////////////////////////////////////////////////////////////////////////////////////////

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
	this.jit=null;
	this.cvs=null;
	this.group=null;
	this.msgAction=new Array();
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
	this.group=group=ops.shivaGroup;
	if (group == 'Visualization') 
		this.DrawChart();
	else if (group == 'Map')
		this.DrawMap();
	else if (group == 'Timeline')
		this.DrawTimeline();
	else if (group == 'Timeglider')
		this.DrawTimeGlider();
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
 	switch(which) {															// Route on type
		case "Timeline": 													// Simile			
			obj="Timeline.DefaultEventSource";								// Object to test for
			lib="//api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true";  // Lib to load
          	break;
		case "Timeglider": 													 // Time glider			
			obj="timeglider";								    			 // Object to test for
			lib="//mandala.drupal-dev.shanti.virginia.edu/sites/all/modules/shivanode/SHIVA/timeglider-all.js";
         	break;
		case "Video": 														// Popcorn
			obj="Popcorn.smart";											// Object to test for
			lib="//popcornjs.org/code/dist/popcorn-complete.min.js";  	// Lib to load
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
        	lib="//maps.googleapis.com/maps/api/js?sensor=false&callback=shivaJSLoaded"; 		// Lib to load
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
	if (o && (i == n)) 														// Got them all		
		callback();															// Call callback
	else																	// No loaded yet
		setTimeout(function() { shivaJSLoaded(obj,callback); },50);			// Recurse		
}

SHIVA_Show.prototype.SendReadyMessage=function(mode) 					// SEND READY MESSAGE TO DRUPAL MANAGER
{
	if (shivaLib.drupalMan) 												// If called from Drupal manager
		window.parent.postMessage("ShivaReady="+mode.toString(),"*");		// Send message to parent wind		
}

SHIVA_Show.prototype.SendShivaMessage=function(msg) 					// SEND SHIVA MESSAGE 
{
	if (window.parent)														// If has a parent
		window.parent.postMessage(msg,"*");									// Send message to parent wind
	else																	// Local	
		window.postMessage(msg,"*");										// Send message to wind
}

SHIVA_Show.prototype.ShivaEventHandler=function(e) 						//	HANDLE SHIVA EVENTS
{
	if (e == "init") {														// If installing listener
		if (window.addEventListener) 
			window.addEventListener("message",shivaLib.ShivaEventHandler,false);
		else
			window.attachEvent("message",shivaLib.ShivaEventHandler);	
		return;
		}
	for (var i=0;i<shivaLib.msgAction.length;++i)							// For each possible event								
		if (e.data.indexOf(shivaLib.msgAction[i].id) != -1)					// The one						
			shivaLib.msgAction[i].Do(i);									// Run callback
	if (e.data.indexOf("ShivaAct") != -1) {									// If an action
		if (e.data.indexOf("ShivaActMap=") != -1)							// If a map action
			shivaLib.MapActions(e.data);									// Route to map actions
		else if (e.data.indexOf("ShivaActEarth=") != -1)					// If an earth action
			shivaLib.EarthActions(e.data);									// Route to earth actions
		else if (e.data.indexOf("ShivaActVideo=") != -1)					// If a video action
			shivaLib.VideoActions(e.data);									// Route to earth actions
		else if (e.data.indexOf("ShivaActTime=") != -1)						// If a timeline action
			shivaLib.TimeActions(e.data);									// Route to earth actions
		else if (e.data.indexOf("ShivaActChart=") != -1)					// If a chart action
			shivaLib.ChartActions(e.data);									// Route to chart actions
		}
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
		i=Math.max(0,i-=40);												// Don't hide controls, cap at 0
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	WEBPAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawWebpage=function() 											//	DRAW WEBPAGE
{
	$("#"+this.container+"IF").remove();													// Remove old one
	var	str="<iframe src='"+this.options.url+"' id='"+this.container+"IF' style='"; 		// Iframe
	str+="width:"+$("#"+this.container).css("width")+";height:"+$("#"+this.container).css("height")+"'>";
	$("#"+this.container).append(str);														// Add to container
	this.SendReadyMessage(true);															// Send ready message									
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	IMAGE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	CHART
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
 	if (ops.dataSourceUrl) {	
 		ops.dataSourceUrl=""+ops.dataSourceUrl.replace(/\^/g,"&");
	 	if (ops.dataSourceUrl.toLowerCase().indexOf(".csv") != -1) {	
  			ops.dataTable=CSV(ops.dataSourceUrl,"hide","JSON");
   			ops.dataDataSourceUrl="";
  		}	
  	}
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
  	google.visualization.events.addListener(wrap,"select", function(r) { 
  		var o=wrap.getChart().getSelection()[0];
   		var row="-", col="-";
   		if ((o) && (o.row != undefined))
   			row=o.row;
   		if ((o) && (o.column != undefined))
   			col=o.column;
  		_this.SendShivaMessage("ShivaChart=data"+row+"|"+col); 
   		});
}

SHIVA_Show.prototype.ChartActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaActChart=data") {									// DATA
		var data=google.visualization.arrayToDataTable($.parseJSON(v[1]));	// Convert to table format
		this.map.setDataTable(data);									// Set data
		this.map.draw();												// Redraw chart
		}
}

SHIVA_Show.prototype.Sound=function(sound, mode)									// PLAY SOUND
{	
	var snd=new Audio();
	if (!snd.canPlayType("audio/mpeg"))
		snd=new Audio(sound+".ogg");
	else	
		snd=new Audio(sound+".mp3");
	if (mode != "init")
		snd.play();
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

SHIVA_Show.prototype.ShowIframe=function(left, top, wid, hgt, url, id, mode, content)
{
	$("#"+id).remove();															
	$("#CL-"+id).remove();															
	if ((hgt == 0) || (wid == 0))
		return;
	var	str="<iframe id='"+id+"' ";
	if (url)
		str+="src='"+url+"' ";
	str+="style='position:absolute;"; 					
	if (mode == "black")
		str+="border:none;background:black;"
	else if (mode == "transparent")
		str+="border:none;background:transparent;"
	else
		str+="background:white;"
	str+="width:"+(wid+2)+"px;height:"+(hgt+2)+"px;left:"+left+"px;top:"+top+"px;'";
	if (mode == "black")
		str+=" scrolling='no'";
	else if (mode == "transparent")
		str+=" allowtransparency='true'";
	$("body").append(str+"></iframe>");	
	str="<iframe marginwidth='0' marginheight='0' src='closedot.gif' id='CL-"+id+"' style='position:absolute;margin:0px;padding:0px;border:none;"; 					
	str+="width:17px;height:18px;left:"+(wid-13+left)+"px;top:"+(top+3)+"px'/>";
	if (mode != "black")
		$("body").append(str);	

	$("#"+id).bind("load",function(e) {
    	if (content)
    		this.contentWindow.document.body.innerHTML=content;
      });
	$("#CL-"+id).bind("load",function(e) {
  		this.contentWindow.document.body.onclick=function(e) {
     	shivaLib.Sound("delete");
		$("#"+id).remove();															
		$("#CL-"+id).remove();															
      }});
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
	if (width < 0) {												// EARTH KLUDGE!!
		x=$("#"+this.container).css("left").replace(/px/,"");
		x=x-0+$("#"+this.container).width()-0+20;
		}
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	ESTORE
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
	if ((type == "KML") || (this.group == "Earth")) w=-350;					// Force to right of Earth (KLUDGE)																
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

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	HELPERS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Graphics.prototype.EnumObject=function(obj) 														// DEBUG TOOL
{
	trace("------------------------------------------------------------");		
	for (var key in obj) 														
		trace(key+"="+obj[key])													
}

function trace(msg, p1, p2, p3)
{
	if (p3)
		console.log(msg,p1,p2,p3);
	else if (p2)
		console.log(msg,p1,p2);
	else if (p1)
		console.log(msg,p1);
	else
	console.log(msg);
	
}

SHIVA_Draw.prototype.isTouchDevice=function() 							// IS THIS A TOUCH DEVICE?
{
	var el=document.createElement('div');									// Make div
	el.setAttribute('ongesturestart', 'return;');							// Try to set gesture
	if (typeof el.ongesturestart == "function")								// If supports touch		
		return true;														// Return true
	else 																	// Doesn't support touch
		return false;														// Return false
}

