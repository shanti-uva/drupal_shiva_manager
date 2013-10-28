function SHIVA_Event(parent) 											// CONSTRUCTOR
{
	var i;
	this.par=parent;														// Set parent
	parent.ev=this;															// Set shiva pointer to events
	this.player=parent.player;												// Point at player
	this.events=new Array();												// Alloc array of events
	this.modalEvent=-1;														// No modal event
	this.scale=1;															// Scale of timeline
	this.mouseDown=false;													// Tracks mouse status
	this.container=parent.container;										// Container div
	$("#shivaEventDiv").empty() 											// Clear it																																																																																																																																																																									// No div yet	
	$("#shivaEventDiv").remove() 											// Clear it																																																																																																																																																																									// No div yet	
	var con="#"+parent.container;											// Set container
	var t=$(con).css("top");												// Get top
	var l=$(con).css("left");												// Get left
	if ($(con).css("left") == undefined) l="308px";							// If not defined KLUDGE!!!!
	if ($(con).css("top") == undefined)  t="0px";							// If not defined KLUDGE!!!!
		
	var str="<div id='shivaEventDiv' style='position:absolute";				// Div
	str+=";width:"+$(con).css("width");										// Make div
	str+=";top:"+t;															// same as
	str+=";left:"+l;														// container div
	i=$(con).css("height").replace(/px/g,"");								// Get hgt
	if (this.player)														// If a player object
		i-=40;																// Don't hide controls
	str+=";height:"+i+"px'/>";												// Set hgt
	$('body').append(str);													// Add to dom								
	$("#shivaEventDiv").css("z-index",1999);								// Force on top
	this.Do("Startup");														// Save undo
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   EVENT EDITING   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.EventEditor=function() 							// EDIT EVENT
{
	var _this=this;															// Save 'this' locally
	if ($("#shivaEventEditorDiv").length) {									// If already on
		$("#shivaEventEditorDiv").remove();									// Remove it
		this.player.off("timeupdate",$.proxy(_this.DrawEventDots,this));	// Kill handler
		return;																// Quit
		}
	this.player.on("timeupdate",$.proxy(_this.DrawEventDots,this));			// Redraw dots on player change
	var con="#"+this.container;
	var w=$(con).css("width").replace(/px/,"");
	var h=$(con).css("height").replace(/px/,"")
	var t=$(con).css("top").replace(/px/,"")-4+Number(h);
	var l=$(con).css("left").replace(/px/,"")
	var r=w-16;
	str="<div id='shivaEventEditorDiv' style='position:absolute;";
	str+="width:"+w+"px;left:"+l+"px;top:"+t+"px;height:55px'>";	
	$("body").append(str);													// Add to body							
	w=w-16;
	var dur=this.par.SecondsToTimecode(this.player.duration()*this.scale);	// Get bar duration
	$("#shivaEventEditorDiv").append("<div id='shivaEventSlider' style='border:none;height:2px;position:relative;left:14px;top:41px;width:100px'/>");
	$("#shivaEventSlider").slider({ value:100-(this.scale*100),max:95});	// Init scaler
	$("#shivaEventEditorDiv").css("border-radius","6px");					// Add corner style
	$("#shivaEventEditorDiv").css("-moz-border-radius","6px");				// Mozilla
	$("#shivaEventEditorDiv").css("background-color","#000");
	$("#shivaEventSlider .ui-slider-handle").css("height","8px");
	$("#shivaEventSlider").css("background","#ccc");
	$("#shivaEventSlider .ui-slider-range").css("background","#999");
	$("#shivaEventSlider").bind("slidechange",$.proxy(function(event, ui) {	// Add handler
		this.scale=1-($("#shivaEventSlider").slider("option","value")/100);	// Get slider start
		var d=this.par.SecondsToTimecode(_this.player.duration()*+_this.scale);	// Get bar duration
		$("#shivaTimescale").text("Show: "+d);								// Show span
		this.DrawEventDots();												// Redraw bar
		},this));
	str="<div id='shivaTimescale' style='position:absolute;";			
	str+="left:125px;top:35px;color:#ccc''>Show: "+dur+"</div>";
	$("#shivaEventEditorDiv").append(str);
	$("#shivaEventEditorDiv").append("<div id='shivaTimecode' style='position:absolute;left:"+(w/2-12)+"px;top:35px;color:#ccc'/>");
	str="<div id='shivaTimebarDiv' style='position:absolute;";			
	str+=";width:"+w+"px;left:8px;top:10px;height:16px;";
	str+="border-radius:3px;-moz-border-radius:3px;background-color:#999'/>";
	str+="<img src='addeventdot.gif' style='position:absolute;left:"+(w-8)+"px;top:33px' onclick='shivaLib.ev.EditEvent(-1)'/>";
	$("#shivaEventEditorDiv").append(str);
	$("#shivaTimebarDiv").css("overflow","hidden"); 						// Disable spillover
	$("#shivaEventEditorDiv").slideDown();									// Slide it on
	this.DrawEventDots();													// Draw doys
	
	$("#shivaTimebarDiv").bind("click",function(e) { 					// HANDLE CLICK STOP
		var x=e.pageX-8-$("#shivaEventEditorDiv").css("left").replace(/px/,"")	// Position in bar
		x=x/w*_this.player.duration()*_this.scale;							// Absolute time
		});
	
	$("#shivaTimebarDiv").dblclick( function(e) { 						// SET TIME
		var x=e.clientX-$("#"+_this.par.container).css("left").replace(/px/,"")-8;
		var wid=$("#shivaTimebarDiv").width();								// Width
		x=Math.max(Math.min(x,wid),0);										// Cap 0-wid
		x=x/wid*_this.player.duration()*_this.scale;						// Absolute time from bar
		_this.player.currentTime(x);										// Set time
		});
}

SHIVA_Event.prototype.DrawEventDots=function() 							// DRAW EVENT DOTS
{
	var i,o,s,e,x=0,w,str;	
	$("#shivaTimebarDiv").empty();
	var _this=this;															// Save 'this' locally
	var dur=this.player.duration();											// Get clip duration
	var now=this.player.currentTime();										// Get current time
	var wid=$("#shivaTimebarDiv").width();									// Width of time bar
	var end=(dur*this.scale)+now;											// End
	for (i=0;i<this.events.length;++i) {									// For each event
		o=this.events[i];													// Point at event
		if (!o.start)														// No start
			continue;														// Continue
		s=this.par.TimecodeToSeconds(o.start);								// Get start
		if ((s > end) && (this.scale < 1))									// After timespan and not showing all
			continue;														// Continue
		if (o.end) 															// If an end defined
			e=this.par.TimecodeToSeconds(o.end);								// Get end
		else																// A singleton
			e=s;															// End=start													
		if ((e < now) && (this.scale < 1))									// Before timespan and not showing all
			continue;														// Continue
		if (this.scale < 1)													// If not showing all
			x=((s-now)/dur)*wid/this.scale;									// Start x, account for now	
		else																// If scrolling
			x=(s/dur)*wid/this.scale;										// Start x		
		w=Math.max(14,((e-s)/dur)*wid/this.scale)-1;							// Width
		str="<div id='shivaEventDot-"+i+"' style='position:absolute;text-align:center;";
		str+="width:"+w+"px;left:"+x+"px;height:14px;padding:0px;";
		str+="border-radius:8px;-moz-border-radius:8px;background-color:#ccc;border:1px #eee solid'";
		str+="title='"+o.type.toUpperCase()+" "+o.start;					// Tool tip
		if (o.end)															// If an end
			str+="->"+o.end;												// Add end
		if (o.id)															// If an id
			str+=" ("+o.id+")";												// Add id
		str+="'>"+(i+1)+"</div>";											// Event num
		$("#shivaTimebarDiv").append(str);
		$("#shivaEventDot-"+i).dblclick( function(e) { _this.EditEvent(this.id.substr(14));  }).draggable();
		
		$("#shivaEventDot-"+i).bind("drag",function(event,ui) { 
			ui.position.top=0; 												// Force in track
			x=Math.max(Math.min(ui.position.left,wid),0);					// Cap 0-wid
			x=x/wid*_this.player.duration()*_this.scale;					// Absolute time from bar
			$("#shivaTimecode").text(_this.par.SecondsToTimecode(x+now));	// Show position
			});
		$("#shivaEventDot-"+i).bind("dragstop",function(event,ui) { 		// Handle drag stop
			o=_this.events[this.id.substr(14)];								// Point at event
			x=Math.max(Math.min(ui.position.left,wid),0);					// Cap 0-wid
			x=x/wid*_this.player.duration()*_this.scale;					// Absolute time from bar
			if (_this.scale < 1)											// If not showing all
				x+=now;														// Add start
			_this.Do("Move event");											// Save undo
			w=_this.par.TimecodeToSeconds(o.end)-_this.par.TimecodeToSeconds(o.start);// Save dur
			o.start=_this.par.SecondsToTimecode(x);							// Set time
			if (o.end)														// If an end defined
				o.end=_this.par.SecondsToTimecode(x+w); 						// Set time
			_this.UpdatePlayerEvents();										// Update player
			$("#shivaTimecode").text("");									// Clear timecode display
			});
		}			
	$("#shivaTimebarDiv").scrollLeft((now/dur)*wid/this.scale);				// Scroll it
}

SHIVA_Event.prototype.EditEvent=function(num) 							// EDIT EVENT
{
	var i,v,title;
	var newEvent=false;														// Just editing
	var _this=this;															// Save 'this' locally
	if (num == -1) {														// If adding a new one
		this.Do("Add Event");												// Save undo
		this.events.push(new Object())										// Add one
		num=this.events.length-1;											// Point at it	
		this.events[num].type="popup";										// Set type
		this.events[num].frame={ closer:true,draggable:true };				// Default frame
		this.events[num].start=this.par.SecondsToTimecode(this.player.currentTime());	// Set start
		this.CreateEventDisplay(num);										// Add display
		this.AddToCue(num);													// Add to player
		newEvent=true;														// A new event
		}
	else																	// Editing
		this.Do("Edit Event");												// Save undo
	var o=this.events[num];													// Get pointer to event
	var str="<br/><div id='etabs' style='font-size:x-small'><ul>";
	str+="<li><a href='#content'>Content</a></li>";
	str+="<li><a href='#times'>Time</a></li>";
	str+="<li><a href='#shapes'>Shape</a></li>";
	str+="<li><a href='#colors'>Color</a></li>";
	str+="<li><a href='#actions'>Action</a></li>";
	str+="</ul>";

	str+="<div id='times'><table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	str+="<tr><td>Start (min:sec)</td><td><input type='text' size='8' id='start'/></td></tr>";
	str+="<tr><td>End (min:sec)</td><td><input type='text' size='8' id='end'/></td></tr>";
	str+="<tr><td>Fade in (secs)</td><td><input type='text' size='8' id='fadein'/></td></tr>";
	str+="<tr><td>Fade out (secs) &nbsp;</td><td><input type='text' size='8' id='fadeout'/></td></tr>";
	str+="</table></div>";
  
   	str+="<div id='content'>";
	str+=this.SetContentPanel(o.type);
  	str+="</div>";
	
	str+="<div id='shapes'><table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	str+="<tr><td>Top</td><td><input type='text' size='10' id='frame-top'/></td></tr>";
	str+="<tr><td>Left</td><td><input type='text' size='10' id='frame-left'/></td></tr>";
	str+="<tr><td>Width</td><td><input type='text' size='10' id='frame-width' value='auto'/></td></tr>";
	str+="<tr><td>Height</td><td><input type='text' size='10' id='frame-height' value='auto'/></td></tr>";
	str+="<tr><td>Corner radius</td><td><input type='text' size='10' id='frame-radius' value='8'/></td></tr>";
	str+="<tr><td>Draggable? &nbsp;</td><td><input type='checkbox' id='frame-draggable'/></td></tr>";
  	str+="</table></div>";
 
  	str+="<div id='colors'><table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	str+="<tr><td>Text color</td><td><input type='text' size='15' value='black' id='frame-color'/></td></tr>";
	str+="<tr><td>Background color &nbsp;</td><td><input type='text' size='15' id='frame-background-color'/></td></tr>";
	str+="<tr><td>Border</td><td><input type='text' size='15' id='frame-border' value='1px solid'/></td> </tr>";
	str+="<tr><td>Opacity (0-100%)</td><td><input type='range' id='frame-opacity' value='100%'/></td></tr>";
  	str+="</table></div>";
 
	str+="<div id='actions'><table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	str+="<tr><td>On a click</td><td><input type='text' size='20' id='click'/></td></tr>";
	str+="<tr><td>On a hover</td><td><input type='text' size='20' id='hover'/></td></tr>";
	str+="<tr><td>When done</td><td><input type='text' size='20' id='done'/></td></tr>";
	str+="<tr><td>Response storage &nbsp;</td><td><input type='text' size='20' id='response'/></td></tr>";
	str+="<tr><td>Player action</td><td><input type='text' size='20' id='player'/></td></tr>";
  	str+="</table></div></div>";
	str+="<div align='center' style='px;font-size:small'><br><button id='saveBut'>Save</button>";	
	str+=" <button id='deleteBut'>Delete</button>";	
	str+=" <button id='cancelBut'>Cancel</button></div>";	
	if (newEvent)
		title="Create new event";
	else	
		title="Edit this "+""+o.type.toUpperCase();
	this.par.ShowLightBox("auto",20,title,str)									// Create light box
	$("#saveBut").button().click(function() { _this.SaveEditedEvent(num,false); $("#shivaLightBoxDiv").remove();});
	$("#deleteBut").button().click(function() { _this.SaveEditedEvent(num,true); $("#shivaLightBoxDiv").remove();});
	$("#cancelBut").button().click(function() { if (newEvent) _this.SaveEditedEvent(num,true); $("#shivaLightBoxDiv").remove();});
	$('#etabs').tabs({selected:0});											// Init jqueryui
	for (key in o)															// For each key
		$("#"+key).val(o[key]);												// Set field
	if (o.type == "menu") {													// Deconstruct menu
		var lines=o.text.split(">>");										// Split into lines
		if (lines[0]) {														// If exists
			lines[0]=lines[0].replace(/\*!!\*/g,"\n").replace(/&quot;/g,"\"");	// *!!* -> LF and &quot; -> "
			$("#sqpr").val(lines[0]);										// Set prompt
			}
		for (i=1;i<lines.length;++i) {										// For each line
			v=lines[i].split("|");											// Get sub-parts
			if (v[0]) {														// If exists
				v[0]=v[0].replace(/\*!!\*/g,"\n").replace(/&quot;/g,"\"");	// *!!* -> LF and &quot; -> "
				$("#sq"+i+"a").val(v[0]);									// Set answer
				}
			if (v[1].charAt(0) == "*") {									// A leading *
				v[1]=v[1].substr(1);										// Lop it off
				$("#sq"+i+"c").attr("checked","checked");					// Set check			
				}
			if (v[1])														// If exists
				$("#sq"+i+"b").val(v[1]);									// Set action
			}
		}
	$("#text").val($("#text").val().replace(/\*!!\*/g,"\n"));				// *!!* -> LF
	$("#text").val($("#text").val().replace(/&quot;/g,"\""));				// &quot; -> "
	$("#title").val($("#title").val().replace(/&quot;/g,"\""));				// &quot; -> "
	$("#text").val($("#text").val().replace(/&apos;/g,"'"));				// &apos; -> '
	$("#title").val($("#title").val().replace(/&apos;/g,"'"));				// &apos; -> '
	o=o.frame;																// Point at field
	for (key in o)															// For each field member
		$("#frame-"+key).val(o[key]);										// Set field
	if (o.scroller)		$("#frame-scroller").attr("checked","checked");		// Set check
	if (o.closer)		$("#frame-closer").attr("checked","checked");		// Set check
	if (o.draggable)	$("#frame-draggable").attr("checked","checked");	// Set check
	if (o.opacity)															// If opacity set
		i=o.opacity.replace(/\%/,"");										// Get value
	else																	// Default
		i=100;																// To 100%
	$("#frame-opacity").val(i);												// Set value
	this.SetEventHelp();													// Set help's
}

SHIVA_Event.prototype.SetContentPanel=function(etype) 						// SET CONTENT PANEL CONTROLS
{
	var _this=this;															// Save 'this' locally
	str="<table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	var chg="onchange='$(\"#content\").html(shivaLib.ev.SetContentPanel(this.value))'";
	str+="<tr><td>Type</td><td>"+this.par.MakeSelect("type",false,["ask","iframe","image","menu","popup","poller"],etype,chg)+"</td></tr>";
	str+="<tr><td>ID</td><td><input type='text' size='20' id='id'/></td></tr>";
	str+="<tr><td>Title</td><td><input type='text' size='20' id='title'/></td></tr>";
	str+="<tr><td>Image Url</td><td><input type='text' size='20' id='url'/></td></tr>";
	str+="<tr><td>Has scrollbar?</td><td><input type='checkbox' id='frame-scroller'/></td></tr>";
	str+="<tr><td>Has close button? &nbsp;</td><td><input type='checkbox' id='frame-closer'/></td></tr>";
	if (etype == "menu") {
		str+="<input type='hidden' id='text'/>";
		str+="<tr><td>Prompt</td><td><textarea rows='2' style='width:160px' id='sqpr'/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;?</td></tr>";
		str+="<tr><td>Answer 1</td><td><input type='text' style='width:160px' id='sq1a'/> <input type='text' size='10' id='sq1b'/> <input type='checkbox' id='sq1c'/></td></tr>";
		str+="<tr><td>Answer 2</td><td><input type='text' style='width:160px' id='sq2a'/> <input type='text' size='10' id='sq2b'/> <input type='checkbox' id='sq2c'/></td></tr>";
		str+="<tr><td>Answer 3</td><td><input type='text' style='width:160px' id='sq3a'/> <input type='text' size='10' id='sq3b'/> <input type='checkbox' id='sq3c'/></td></tr>";
		str+="<tr><td>Answer 4</td><td><input type='text' style='width:160px' id='sq4a'/> <input type='text' size='10' id='sq4b'/> <input type='checkbox' id='sq4c'/></td></tr>";
		str+="<tr><td>Answer 5</td><td><input type='text' style='width:160px' id='sq5a'/> <input type='text' size='10' id='sq5b'/> <input type='checkbox' id='sq5c'/></td></tr>";
		}
	else
		str+="<tr><td>Text</td><td><textarea rows='4' cols='20' id='text'/></td></tr>";
	return str+"</table>";
}

SHIVA_Event.prototype.UpdatePlayerEvents=function() 					// ADD EVENTS
{
	var i,o;
	if (!this.player)														// No player
		return;																// Quit
	for (i=0;i<this.events.length;++i) {									// For each event
		o=this.events[i];													// Point at event
		if (o.start)														// If a start event
			this.player.removeTrackEvent(this.player.getLastTrackEventId()); // Remove last
		if (o.end)															// If end
			this.player.removeTrackEvent(this.player.getLastTrackEventId());// Remove last
		}
	for (i=0;i<this.events.length;++i) 										// For each event
		this.AddToCue(i);													// Add them back
	this.DrawEventDots();													// Redraw events
}

SHIVA_Event.prototype.SaveEditedEvent=function(num, remove) 			// SAVE EDITED EVENT
{
	if ((num < 0) || (num >= this.events.length))							// If out of bounds
		return;																// Quit
	var i,val;
	var o=this.events[num];													// Point at event
	var keys=["type","id","title","url","frame-scroller","frame-closer","text",		// Vars
			  "start","end","fadein","fadeout",
			  "frame-top","frame-left","frame-width","frame-height","frame-radius","frame-draggable",
			  "frame-color","frame-background-color","frame-border","frame-opacity",
			  "hover","click","done","response","player"];
	for (i=0;i<keys.length;++i) {											// For each var
		val=$("#"+keys[i]).val();											// Get value
			if (keys[i].indexOf("frame-") != -1)							// A frame
			o.frame[keys[i].substr(6)]=val;									// Add to frame obj
		else																// Normal						
			o[keys[i]]=val;													// Add to obj
		}
	if (o.type == "menu") {													// Construct text from menu parts
		o.text=$("#sqpr").val();											// Prompt
		for (i=0;i<5;++i)													// For each question
			if ($("#sq"+i+"a").val()) {										// If an answer title
			o.text+=">>"+$("#sq"+i+"a").val()+"|";							// Add title
			if ($("#sq"+i+"c").attr("checked")) 							// If correct
				o.text+="*";												// Add star
			if ($("#sq"+i+"b").val()) 										// If an answer action
				o.text+=$("#sq"+i+"b").val();								// Add action
			}				
		}
	o.frame.scroller=($("#frame-scroller").attr("checked") == "checked"); 	// Set checkbox
	o.frame.closer=($("#frame-closer").attr("checked") == "checked"); 		// Set checkbox
	o.frame.draggable=($("#frame-draggable").attr("checked") == "checked"); // Set checkbox
	o.text=o.text.replace(/\r/g,"").replace(/\n/g,"*!!*");					// Remove CR, LF -> *!!*
	o.text=o.text.replace(/"/g,"&quot;");									// Escape quotes
	o.title=o.title.replace(/"/g,"&quot;");									// Escape quotes
	o.text=o.text.replace(/'/g,"&apos;");									// Escape apost
	o.title=o.title.replace(/'/g,"&apos;");									// Escape apost
	$("#shivaEvent-"+num).remove();											// Remove display div
	if (remove)	{															// If removing it
		this.events.splice(num,1);											// Remove from events list
		this.Do("Remove Event");											// Save undo
		}
	else																	// Updating it
		this.CreateEventDisplay(num);										// Update event display
	this.DrawEventDots();													// Update event dots
	this.UpdatePlayerEvents();												// Update player
}
SHIVA_Event.prototype.UpdatePlayerEvents=function() 					// ADD EVENTS
{
	var i,o;
	if (!this.player)														// No player
		return;																// Quit
	for (i=0;i<this.events.length;++i) {									// For each event
		o=this.events[i];													// Point at event
		if (o.start)														// If a start event
			this.player.removeTrackEvent(this.player.getLastTrackEventId()); // Remove last
		if (o.end)															// If end
			this.player.removeTrackEvent(this.player.getLastTrackEventId());// Remove last
		}
	for (i=0;i<this.events.length;++i) 										// For each event
		this.AddToCue(i);													// Add them back
	this.DrawEventDots();													// Redraw events
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   EVENT CREATION   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.AddEvents=function(data) 							// ADD EVENTS
{
	var i;
	for (var i=0;i<this.events.length;++i) 									// For each event
		$("#shivaEvent-"+i).remove();										// Clean it out
	this.events=new Array();												// Flush old events
	this.UpdatePlayerEvents();												// Clear old cues out
	for (var i=0;i<data.length;++i) {										// For each event
		this.events.push(data[i]);											// Copy events locally
		this.AddToCue(i);													// Add cue to player
		this.CreateEventDisplay(i);											// Create event display
		}
}

SHIVA_Event.prototype.AddToCue=function(num) 							// ADD EVENT TO EVENT QUEUE
{
	if (!this.player)														// No player
		return;																// Quit
	var _this=this;															// Save 'this' locally
	var o=this.events[num];													// Point at event
	if (!o.start)															// If no start defined
		return;																// Don't add to cue
	this.player.cue(o.start,function() 	{ 									// A cue
		_this.Draw(num,true); 												// Add start cue
		shivaLib.SendShivaMessage("ShivaPlayer=event",num);					// Send message
 		 });		
	if (o.end)																// If an end set
		this.player.cue(o.end,function() { _this.Draw(num,false); });		// Add end cue
}

SHIVA_Event.prototype.CreateEventDisplay=function(num, params) 			// CREATE EVENT DISPLAY
{
	if ((num < 0) || (num >= this.events.length))							// If out of bounds
		return;																// Quit
	var o=this.events[num];													// Point at event
	var _this=this;															// Save 'this' locally
	if ((params) && params != "*"){											// If updating parameters
		var p=params.split("|");											// Extract param(s)			
		for (var j=0;j<p.length;++j)										// For each param
			o[p[j].split(":")[0]]=p[j].split(":")[1];						// Set field
		}
	var _this=this;															// Context ptr
	var left="50%",top="50%",wid="auto",hgt="auto",alpha=1;
	var border="1px solid",tcol="black",rad=8,pad="8px";
	if (o.frame) {															// If a frame
		if (o.frame.left)													// If set
			left=this.CSSPixel(o.frame.left);								// Use it
		if (o.frame.top)													// If set
			top=this.CSSPixel(o.frame.top);									// Use it
		if (o.frame.width)													// If set
			wid=this.CSSPixel(o.frame.width);								// Use it
		if (o.frame.height)													// If set
			hgt=this.CSSPixel(o.frame.height);								// Use it
		if (o.frame.padding)												// If set
			pad=this.CSSPixel(o.frame.padding);								// Use it
		if (o.frame.radius)													// If set
			rad=this.CSSPixel(o.frame.radius);								// Use it
		if (o.frame.opacity)												// If set
			alpha=o.frame.opacity.replace(/%/g,"")/100;						// Use it
		if (o.frame.border)													// If set
			border=o.frame.border;											// Use it
		if (o.frame.color)													// If set
			tcol=o.frame.color;												// Use it
		}
	$("#shivaEvent-"+num).remove();											// Remove old one
	var str="<div id='shivaEvent-"+num+"' style='position:absolute";		// Div
	str+=";top:"+top;		str+=";left:"+left;								// Pos				
	str+=";width:"+wid;		str+=";height:"+hgt;							// Wid				
	str+=";opacity:"+alpha;	str+=";padding:"+pad;							// Alpha/padding
	str+=";overflow:hidden";												// No overflow
	if (o.type == "popup")	str+=";border:"+border;							// Border
	str+="'";																// End style
	str+="></div>";															// Close div
	switch(o.type) {														// Route on type
		case "popup": 														// Popup dialog
			if (params == undefined)										// If not just updating
				$("#shivaEventDiv").append(str);							// Add to general event div								
			str="";															// Clear									
			$("#shivaEvent-"+num).css("border-radius",rad);					// Add corner style
			$("#shivaEvent-"+num).css("-moz-border-radius",rad);			// Mozilla
			$("#shivaEvent-"+num).css("background-color","#eee").css('border',"1px solid #ccc");
			if (o.url) 														// If an icon defined
				str+="<img src='"+o.url+"' style='vertical-align:middle'/> "; // Add icon image		
			str+="<span style='text-align:center;text-shadow:1px 1px white'><b>"+o.title+"</b></span>";
			if (o.text)														// If set
				str+="<p>"+o.text.replace(/\*!!\*/g,"<br/>")+"</p>";		// Add body text, LFs -> <br>'s
			$("#shivaEvent-"+num).html(str);								// Set content								
			break;
		case "image": 														// Image
			if (params == undefined)										// If not just updating
				$("#shivaEventDiv").append(str);							// Add to general event div								
			str="<img src='"+o.url+"'";										// Set image			
			if (border)														// If a border
				str+=" style='border:1px solid'";							// Set it
			if ((o.frame) && (o.frame.width))								// If a frame width set
				str+=" width='"+o.frame.width+"'";							// Add width
			if ((o.frame) && (o.frame.height))								// If a frame height set
				str+=" height='"+o.frame.height+"'";						// Add height
			str+="/>";														// Close image
			if (o.title)													// If a title
				str+="<div style='text-align:center;border:none;color:"+tcol+"'><b>"+o.title+"</b></div>";	// Add title
			$("#shivaEvent-"+num).html(str);								// Set content							
			break;
		case "ask": 														// Ask for response
		case "menu": 														// Menu dialog
			if (params == undefined)										// If not just updating
				$("#shivaEventDiv").append(str);							// Add to general event div								
			$("#shivaEvent-"+num).css("border-radius",rad);					// Add corner style
			$("#shivaEvent-"+num).css("-moz-border-radius",rad);			// Mozilla
			$("#shivaEvent-"+num).css("background-color","#eee").css('border',"1px solid #ccc");
			o.frame.draggable=true;											// Foce draggable
			if (!o.player)													// If not some other player command
				o.player="pause";											// Pause player
			$("#shivaEvent-"+num).html(this.CreateEventBody(o.text,num));	// Set content								
			$("#shivaContinue-"+num).click( function() { _this.CloseEvent(this.id) } );
			break;
		case "poller": 														// Poller
			if (params == undefined)										// If not just updating
				$("#shivaEventDiv").append(str);							// Add to general event div								
			$("#shivaEvent-"+num).css("padding","0px");						// No padding
			$("#shivaEvent-"+num).css("top","8px");							// Set to top
			$("#shivaEvent-"+num).css("border-radius",rad);					// Add corner style
			$("#shivaEvent-"+num).css("-moz-border-radius",rad);			// Mozilla
			$("#shivaEvent-"+num).css("background-color","#eee").css('border',"1px solid #ccc");
			var x=$("#shivaEventDiv").width()-8;							// Edge
			if ((o.frame) && (o.frame.width) && (o.frame.width != "auto")){	// If a frame width set
				$("#shivaEvent-"+num).css("width",o.frame.width+"px");		// Set width
				x-=o.frame.width;											// Set left
				}
			else{
				$("#shivaEvent-"+num).css("width","16px");					// Set width
				x-=16;														// Set left
				}
			$("#shivaEvent-"+num).css("left",x+"px");						// Set left
			x=$("#shivaEventDiv").height()/2;								// Top pos
			$("#shivaEvent-"+num).css("height",x+"px");						// Set height
			$("#shivaEvent-"+num).css("top","32px");						// Set top
			o.frame.draggable=false;										// Inhibit dragging
			o.frame.closer=false;											// No closer
			str="<div id='shivaPoller' style='width:100%;position:absolute;pointer-events:none'/>"; // Add poll bar div
			$("#shivaEvent-"+num).html(str);								// Set content								
			this.SetPoller(50);												// Set poller bar centered	
			$("#shivaEvent-"+num).mouseup( function(e) {					// ON MOUSEUP HANDLER
				var y=e.clientY-$("#shivaPoller").parent().css("top").replace(/px/,"");		// Get top
				var val=1-(y/$("#shivaPoller").parent().height());			// Get value 1-0
				_this.SetPoller(val*100)
				_this.mouseDown=false;										// Set mouse status
				});
			$("#shivaEvent-"+num).mousedown( function(e) {					// ON MOUSEDOWN HANDLER
				_this.mouseDown=true;										// Set mouse status
				});
			$("#shivaEvent-"+num).mousemove( function(e) {					// ON MOUSEMOVE HANDLER
				if (_this.mouseDown) {										// If mouse down
					var y=e.clientY-$("#shivaPoller").parent().css("top").replace(/px/,"");		// Get top
					var val=1-(y/$("#shivaPoller").parent().height());		// Get value 1-0
					_this.SetPoller(val*100);
					}
				});
			$(document).keydown( function(e) {								// ON KEYUP HANDLER
				var val=$("#shivaPoller").data("val");						// Get current val
				if ((e.which == 38) ||(e.which == 39) || (e.which == 107))	// Increase
					val=Math.min(100,val+10);								// Up 10
				if ((e.which == 37) ||(e.which == 40) || (e.which == 109))	// Decrease
					val=Math.max(0,val-10);									// Down 10
				_this.SetPoller(val);										// Set val
				});
			break;
		}
	if (o.frame) {															// If a frame defined
		if (o.frame.scroller)												// If set
			$("#shivaEvent-"+num).css("overflow","auto").css("overflow-x","hidden"); // Enable v scrollbar
		if (o.frame["background-color"])									// If set
			$("#shivaEvent-"+num).css("background-color",o.frame["background-color"]); // Set back
		if (o.frame.draggable)												// If set
			$("#shivaEvent-"+num).draggable();								// Make it draggable
		if (o.frame.closer)	{												// If set
			var y=0;
			var x=$("#shivaEvent-"+num).width()-8;							// Get pos of closer
			if (pad)														// If padding set
				x+=Number(""+pad.replace(/px/g,""));						// Add padding to pos
			if (o.type == "image") 	y=8;									// Put within image
			str="<img id='"+num+"' src='closedot.gif' style='position:absolute;left:"+x+"px;top:"+y+"px' onclick='$(\"#shivaEvent-\"+this.id).hide()'/>";
			if (params == undefined)										// If not just updating
				$("#shivaEvent-"+num).append(str);							// Add to this to event div								
			}
		}
	if (o.click)															// If a click
		$("#shivaEvent-"+num).click( function() { _this.EventRouter(this.id,"click") } );
	if (o.hover) {															// If a hover
		$("#shivaEvent-"+num).mouseover( function() { _this.EventRouter(this.id,"hover") } );
		$("#shivaEvent-"+num).mouseout( function()  { _this.EventRouter(this.id,"hoverOut") } );
		}
	$("#shivaEvent-"+num).hide();											// Hide it
}

SHIVA_Event.prototype.SetPoller=function(val) 							// SET POLLER BAR
{
	val=Math.round(val/10)*10;												// Value by 10's
	var h=$("#shivaPoller").parent().height()/2;							// Get height of bar
	var t=$("#shivaPoller").parent().position().top-32;						// Get top of bar
	var d=Math.max(Math.abs(val-50),2)/50*h;								// Poll bar hgt
	$("#shivaPoller").height(d-1);											// Set bar height
	if (val < 50)															// Negative
		$("#shivaPoller").css("background-color","#990000").css("top",(t+h)+"px"); // Red, below middle
	else																	// Positive
		$("#shivaPoller").css("background-color","#009900").css("top",(t-d+h)+"px"); // Green, above middle
	$("#shivaPoller").data("val",val);										// Save value
	var	now=this.player.currentTime();										// Get time
	now=Math.round(now*1000)/1000;											// Hundreths only
	shivaLib.SendShivaMessage("ShivaVideo=poller",Math.round(val)+"|"+now);	// Send message
}

SHIVA_Event.prototype.CreateEventBody=function(def, num) 				// CREATE EVENT BODY
{
	var i,v,str="<p>";
	var o=this.events[num];													// Point at event
	if (o.url) 																// If an icon defined
		str+="<img src='"+o.url+"' style='vertical-align:middle'/> ";		// Add icon image		
	if (o.title)															// If a title spec'd
		str+="<span style='text-align:center;text-shadow:1px 1px white'><b>"+o.title+"</b></span><br/><br/>";
	def=def.replace(/Hint:/g,"hint:");										// Force tags l/c
	if (!def.match(/hint:/g)) 												// If no hint tag defined
		if (def.match(/>>/g)) 												// And an option(s)
			def=def.replace(/>>/,"hint:>>");								// Force a blank hint
	var lines=def.split(">>");												// Split into lines
	str+=lines[0].split("hint:")[0].replace(/\*!!\*/g,"<br/>");				// Prompt text, turn LFs -> <br>'s
	if (lines[0].split("hint:")[1])											// If a hint defined
		str+=" <img src='hintdot.gif' style='vertical-align:middle' title='"+lines[0].split("hint:")[1]+"'/>"
	str+="<br/><br/>"
	if (o.type == "ask") {													// Ask event
		var wid="auto", pad="8px";											// Def width, padding
		str+="<textarea";													// Add textarea
		if (o.frame) {														// If a frame defined
			if (o.frame.width)												// If set
				wid=this.CSSPixel(o.frame.width);							// Get width
			if (o.frame.padding)											// If set
				pad=this.CSSPixel(o.frame.padding);							// Get padding
			}
		str+=" style='width:"+(wid.replace(/px/g,"")-pad.replace(/px/g,""))+"px'"	// Add width 			
		str+=" id='shivaAskDiv-"+num+"'/>";									// End textarea
		}
	for (i=0;i<lines.length-1;++i) {										// For each line
		lines[i+1]=lines[i+1].replace(/\*!!\*/g,"");						// Remove LFs from options
		v=lines[i+1].split("|")												// Get sub-parts
		if (o.type == "menu")												// A menu 
			str+="<input type='radio' id='shivaMenu"+num+"-"+i+"' name='shivaMenu' value='"+v[1]+"'/> "+v[0]+"<br/>";  // option
		}
	str+="<div><button id='shivaContinue-"+num+"'>Continue</button></div>";	// Add continue button
	return str+"</p>";
}

SHIVA_Event.prototype.CloseEvent=function(id) 							// CLOSE EVENT
{
	var i,v;
	mustBeCorrect=false;
	var num=id.substr(id.lastIndexOf("-")+1);								// Get id number
	var o=this.events[num];													// Point at event
	var lines=o.text.split(">>");											// Split into lines
	for (i=1;i<lines.length;++i) 											// For each line
		if (lines[i].split("|")[1])											// If something there
			if (lines[i].match(/\|\*/))										// If a star in go portion
				mustBeCorrect=true;											// Must be answer correctly to move on
	if (o.type == "menu") {													// If a menu event
		for (i=0;i<lines.length-1;++i) {									// For each line
			if ($("#shivaMenu"+num+"-"+i).attr("checked"))	{				// If checked
				this.SaveResponse(num,i-0+1);								// Save response
				if ($("#shivaMenu"+num+"-"+i).val()) 						// If a go spec'd
					this.EventRouter($("#shivaMenu"+num+"-"+i).val().replace(/\|\*/g,"|"),""); // Run events(s)
				if ($("#shivaMenu"+num+"-"+i).val().indexOf("*") != -1) {	// If marked as the correct one
					$("#shivaEvent-"+num).hide();							// Hide it
					this.EventRouter(o.done,"");							// Run events(s)
					this.modalEvent=-1;										// Clear modal event flag
					shivaLib.SendShivaMessage("ShivaPlayer=Menu-right");	// Send message
					break;													// Stop looking
					}
				}
			}
		if (i >= lines.length-1) {											// Wrong answer
			shivaLib.SendShivaMessage("ShivaPlayer=Menu-wrong");			// Send message
			if (!mustBeCorrect) {											// If any answer will do to move on
				$("#shivaEvent-"+num).hide();								// Hide it
				this.EventRouter(o.done,"");								// Run events(s)
				this.modalEvent=-1;											// Clear modal event flag
				}
			}

		}
	if (o.type == "ask") {													// If an ask event
		var s,e,now=0;
		if (this.player)													// If player 
			now=this.player.currentTime();									// Get time
		for (i=1;i<lines.length;++i) {										// For each line
			v=lines[i].split("|")											// Get sub-parts
			s=this.par.TimecodeToSeconds(v[0].split("-")[0]);				// Start
			e=this.par.TimecodeToSeconds(v[0].split("-")[1]);				// End
			if ((now >= s) && (now <= e)) {									// In range
				if (v[1])													// If a go defined
					this.EventRouter(v[1].replace(/\*/g,""),""); 			// Run events(s)
				$("#shivaEvent-"+num).hide();								// Hide it
				this.EventRouter(o.done,"");								// Run events(s)
				this.modalEvent=-1;											// Clear modal event flag
				break;														// Stop searching
				}
			}
		if (i >= lines.length) {											// Incorrect frame
			if ((lines[1]) && (lines[1].split("|")[2]))						// If a wrong answer defined
				this.EventRouter(lines[1].split("|")[2].replace(/\*/g,""),""); 	// Run events(s)
			if (!mustBeCorrect) {											// If any time will do to move on
				$("#shivaEvent-"+num).hide();								// Hide it
				this.EventRouter(o.done,"");								// Run events(s)
				this.modalEvent=-1;											// Clear modal event flag
				}
			}
		this.SaveResponse(num,$("#shivaAskDiv-"+num).val());				// Save response
		}
}

SHIVA_Event.prototype.SaveResponse=function(num, val) 					// SAVE RESPONSE TO ASK/MENU
{
	var name;
	var o=this.events[num];													// Point at event
	var res=o.response;														// Get response
	var s=res.indexOf("(");													// Param start
	var e=res.indexOf(")");													// Param end
	if ((s != -1) && (e != -1))												// If well-formed
		name=res.substring(s+1,e);											// Extract param			
	else if (res.match(/\$/)) {												// If setting a user var
		this[res]=val;														// Set it										
		return;																// Quit														
		}
	else																	// Not a var or a save
		return;																// Quit														
	if (name.match(/\$/)) 													// If val is a variable
		name=this[name];													// Resolve var
	var id=o.id;															// Set id
	if (id === "")															// If no id set
		id=o.title;															// Try title
	if (id === "")															// If title set
		id=(num-0+1);														// Use num 
	if (isNaN(id))	 id=id.replace(/'/g,"\\'")								// Remove apos's
	if (isNaN(val))	 val=val.replace(/'/g,"\\'")							// Remove apos's
	if (res.toLowerCase().match(/estore/))									// If saving to eStore
		$.post("http://www.primaryaccess.org/REST/addeasyfile.php",{ email:name, type: "Response", title:id,data:val });
}

SHIVA_Event.prototype.HideAll=function() 								// HIDE ALL EVENTS
{
	$("#shivaPopupDiv").remove();											// Remove popup, if there
	for (var i=0;i<this.events.length;++i) {								// For each event
		if (i == this.modalEvent)											// Don't hide the modal one
			continue;														// Continue
		$("#shivaEvent-"+i).hide();											// Hide it
		if ($("#shivaIframe-"+i).length)									// If an iframe
			$("#shivaIframe-"+i).remove();									// Remove it from DOM	
		}
}

SHIVA_Event.prototype.Draw=function(num, visible) 						//	DRAW OR HIDE EVENT
{
	var str;
	if ((num < 0) || (num >= this.events.length))							// If out of bounds
		return;																// Quit
	$("#shivaDrawDiv").css('pointer-events','none');						// Inibit pointer clicks if menu gone
 	var o=this.events[num];													// Point at event
	if (this.player && visible && o.start) {								// If player is active and not a named event
		if (this.player.paused()) 											// If paused
			return this.HideAll();											// Clear all and quit
		else if ((o.type == "ask") || (o.type == "menu"))					// Ask or menu event
			this.modalEvent=num;											// Set modal flag
		}
	if (o.type == "canvas") 												// A canvas event
		window.postMessage("ShivaTrigger="+this.container.substr(4)+","+(num+1)+",clicked","*");
	else if (o.type == "iframe") {											// An iframe
		str="<iframe src='"+o.url+"' id='shivaIframe-"+num+"'";				// Opening and src
		if (o.frame){														// If a frame
			if (o.frame.width)	str+=" width='"+this.CSSPixel(o.frame.width)+"'";	// Add width
			if (o.frame.height)	str+=" height='"+this.CSSPixel(o.frame.height)+"'";	// Add height
			if (o.frame.border)	str+=" frameborder='1'";					// Add border
			else				str+=" frameborder='0'";					// No border
			if (o.frame.padding != undefined)	str+=" marginheight='"+this.CSSPixel(o.frame.padding)+"'";  // Add margin height
			if (o.frame.padding != undefined)	str+=" marginwidth='"+this.CSSPixel(o.frame.padding)+"'";   // Add margin height
			if (o.frame.scroller == false)	str+=" scrolling='no'";			// Inhibit scrollbars
			str+=" style='position:absolute";								// Style opener
			if (o.frame.left)	str+=";left:"+this.CSSPixel(o.frame.left);	// Add left
			if (o.frame.top)	str+=";top:"+this.CSSPixel(o.frame.top);	// Add top
			str+="'>";														// Close style
			}
		str+="</iframe>";													// Add iframe
		if (visible){														// If visible 
			if (!$("#shivaIframe-"+num).length)								// If not yet
				$("#shivaEventDiv").append(str);							// Add to overlay							
			}
		else																// Hide it
			$("#shivaIframe-"+num).remove();								// Remove it from DOM	
		return;																// Quit		
		}	 
	var fade=0;																// Assume no fade
	if (visible) {															// If making visible
		if (o.fadein)	fade=o.fadein*1000;									// If set, use it
		$("#shivaEvent-"+num).fadeIn(fade);									// Fade it in to show
		}														
	else{																	// If hiding
		if (o.fadeout)	fade=o.fadeout*1000;								// If set, use it
		$("#shivaEvent-"+num).fadeOut(fade);								// Fade out in to hide
		}
	if ((o.player) && (this.player) && (visible)) {							// Player motion
		var param="";
		var s=o.player.indexOf("(");										// Param start
		var e=o.player.indexOf(")");										// Param end
		if ((s != -1) && (e != -1))											// If well-formed
			param=o.player.substring(s+1,e).replace(/%/g,"");				// Extract param			
		if (o.player.toLowerCase().indexOf("play") != -1) {					// Play
			if (param)														// If a time set
				this.player.play(param);									// Play from that
			else															// No time set
				this.player.play();											// Play from current spot
			}
		else if (o.player.toLowerCase() == "pause")	this.player.pause();	// Pause
		else if (o.player.toLowerCase().indexOf("volume") != -1)			// Volume
			this.player.volume(param/100);									// Set volume
		else if (o.player.toLowerCase().indexOf("load") != -1) {			// Load new clip
			this.player.media.src=param;									// Set new source
			this.player.load(); 											// Load
			}
		}															
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   EVENT HANDLING   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.EventRouter=function(id, type) 					// HANDLE CLICK/HOVER TO EVENT
{
	var str=id,params="";
	var num=id.substr(id.indexOf("-")+1);									// Extract event #
	var o=this.events[num];													// Point at event
	if (type == "click")													// If a click
		str=o.click;														// Get dest
	else if (type == "hover")												// If a hover
		str=o.hover;														// Get dest
	else if (type == "hoverOut")											// If a hoverOut
		str=o.hover;														// Get dest
	if ((str.indexOf("http") != -1) && (str.indexOf("(") == -1))			// If a webpage and not within parens
  		window.open(str);													// Open link
 	else{																	// Run named link
 		var s=str.indexOf("(");												// Param start
		var e=str.indexOf(")");												// Param end
		if ((s != -1) && (e != -1))											// If well-formed
			params=str.substring(s+1,e)										// Extract params
  		var v=str.split("+");												// Split by +
		for (var i=0;i<v.length;++i) {										// For each event
	  		if (this.SpecialEvent(v[i]))									// If a special event, run it
 				continue;													// Then continue
			if (params) 													// If params set
	 			this.CreateEventDisplay(this.FindEventById(v[i]),params);	// Update event
			this.Draw(this.FindEventById(v[i]),(type != "hoverOut"));		// Run named event
	 		}
	 	}
}

SHIVA_Event.prototype.SpecialEvent=function(id) 						// RUN SPECIAL EVENT
{
	var str,param="";
	var s=id.indexOf("(");													// Param start
	var e=id.indexOf(")");													// Param end
	if ((s != -1) && (e != -1))												// If well-formed
		param=id.substring(s+1,e).replace(/%/g,"");							// Extract param			
	if (id == "pause()")					this.player.pause();			// Pause
	else if (id.indexOf("play") != -1) {									// Play
		if (param)															// If a time set
			this.player.play(param);										// Play from that
		else																// No time set
			this.player.play();												// Play from current spot
		}
	else if (id.indexOf("load(") != -1)	{									// Load new clip	
		this.player.media.src=param;										// Set url			
		this.player.load();													// Load
		}
	else if (id.indexOf("volume(") != -1)	this.player.volume(param/100);	// Volume
	else if (id.indexOf("popup(") != -1) {									// Popup	
		$("#shivaPopupDiv").remove();										// Remove existing one
		str="<div id='shivaPopupDiv' style='position:absolute;width:200px;padding:8px;";	// Div
		str+="border:1px solid; left:200px;top:100px'>";					// End style
		str+="<img src='icons/blue/aperture_12x12.png' style='vertical-align:middle'/> "+param;
		str+="<img src='closedot.gif' style='position:absolute;left:200px;top:0px' onclick='$(\"#shivaPopupDiv\").remove()'/></div>";
		$("#shivaEventDiv").append(str);									// Add to general event div								
		$("#shivaPopupDiv").css("border-radius","8px");						// Add corner style
		$("#shivaPopupDiv").css("-moz-border-radius","8px");				// Mozilla
		$("#shivaPopupDiv").css("background-color","#eee").css('border',"1px solid #ccc");
		$("#shivaPopupDiv").draggable();									// Draggable
		}
	else return false;														// Not a special event
	return true;															// Got one
}

SHIVA_Event.prototype.FindEventById=function(id) 						// FIND EVENT BY ID NAME
{
	var i;
	var s=id.indexOf("(");													// Param start
	if (s != -1)															// If a param there
		id=id.substr(0,s);													// Lop it off
	for (i=0;i<this.events.length;++i)										// For each event
		if ((this.events[i].id) && (this.events[i].id == id)) 				// A match
			return i; 														// Return index
	return -1;																// Not found
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   UTILITIES  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.Do=function() 									//	SAVE UNDO
{
}

SHIVA_Event.prototype.CSSPixel=function(size) 							//	ADD PX to SIZE IF NEEDED
{
	if ((size+"").toLowerCase() == "auto")	return "auto";					// Auto
	if ((size+"").indexOf("%") != -1)		return size;					// Return %
	if ((size+"").indexOf("px") == -1)		return size+"px";				// Return with added px
	return size;															// Return original
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   HELP  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.SetEventHelp=function()
{
	var helpText=new Array();
	helpText['shapes']="The 'Shape' tab allows for configuring the dimensions of your event as well as some of the basic behavior of that event on the page.";
	helpText['frame-top']="Click on the text box to the right and enter a number that will set the where the top of your event dialog box begins. This is a pixel value the establishes an offset relative to the top of the video player.";
	helpText['frame-left']="Click on the text box to the right and enter a number that will set the where the left side of your event dialog box begins. This is a pixel value the establishes an offset relative to the left side of the video player.";
	helpText['frame-width']="Click on the text box to the right and enter a number that sets the width of your event dialog box.";
	helpText['frame-height']="Click on the text box to the right and enter a number that sets the height of your event dialog box.";
	helpText['frame-radius']="Click on the text box to the right and enter a value that sets the amount that your event dialog box's corners are rounded. This is a value in pixels that represents the radius of the circle that determines the curve of your box's corners.";
	helpText['frame-draggable']="Use the check-box to the right to choose whether or not your event dialog box is draggable.";
	helpText['colors']="The 'Colors' tab allows for configuring text color, border color, background color, and the opacity of the event dialog box.";
	helpText['frame-color']="Click on the text box to the right to set the font color for you event dialog box. Either click on the square color chip icon in the text box to the right to launch the color picker and select a color, or enter a hexadecimal color value in the text box.";
	helpText['frame-background-color']="Click on the text box to the right to set the background color for you event dialog box. Either click on the square color chip icon in the text box to the right to launch the color picker and select a color, or enter a hexadecimal color value in the text box.";
	helpText['frame-border']="Click on the text box to the right to set the border color for you event dialog box. Either click on the square color chip icon in the text box to the right to launch the color picker and select a color, or enter a hexadecimal color value in the text box.";
	helpText['frame-opacity']="Use the slider-bar to the right to set the opacity of your event dialog box. A value of 0 (left) will be totally transparent, and a value of 100 (right) will be fully opaque.";
	helpText['actions']="The 'Action' tab allows for configuring how your event dialog box responds to various kinds of user actions.";
	helpText['click']="Click on the text box to the right and enter a value that determines what action to trigger when a user clicks on your event dialog box.";
	helpText['hover']="Click on the text box to the right and enter a value that determines what action to trigger when a user hovers over your event dialog box.";
	helpText['done']="Click on the text box to the right and enter a value that determines what action to trigger when a user finishes interacting with your event dialog box. Note this only applies to events like 'ask' and 'menu' that actually require user interaction.";
	helpText['response']="Click on the text box to the right and enter a value that determines how to store user input when a user finishes interacting with your event dialog box. Note this only applies to events like 'ask' and 'menu' that actually require user interaction.";
	helpText['player']="Click on the text box to the right and enter a value that determines the behavior of the video player when the event first opens. Use 'pause' to pause the video player or leave the box blank to allow the video player to keep playing.";
	helpText['times']="The 'Time' tab allows for configuring various aspects of the timing for your video event.";
	helpText['start']="Click on the text box to the right and enter a value that determines the starting time for your video event. This should be in the form mm:ss, e.g. 00:05.";
	helpText['end']="Click on the text box to the right and enter a value that determines the ending time for your video event. This should be in the form mm:ss, e.g. 00:05.";
	helpText['fadein']="Click on the text box to the right and enter a value that sets the duration of the fade in for your video event. This should be a number of seconds.";
	helpText['fadeout']="Click on the text box to the right and enter a value that sets the duration of the fade out for your video event. This should be a number of seconds.";
	helpText['content']="The 'Content' tab allows for configuring what text, images, and other content to display in your video event.";
	helpText['type']="Use the drop-down menu to the right to choose what type of event you would like to use. ";
	helpText['id']="Click on the text box to the right and enter a value that determines the id of this video event.";
	helpText['title ']="Click on the text box to the right and enter a title for your video event.";
	helpText['url']="Click on the text box to the right and enter a the web URL of an image to optionally add an image to your video event.";
	helpText['frame-scroller']="Use the check-box to the right to choose whether or not your event dialog box has scrollbars.";
	helpText['frame-closer']="Use the check-box to the right to choose whether or not your event dialog box has a close button.";
	helpText['text']="Click on the text box to the right and enter a value that sets the text in the body of your video event.";
	
	var id;
	for (id in helpText) {
		$("#"+id).attr("title",helpText[id]);
	}

}