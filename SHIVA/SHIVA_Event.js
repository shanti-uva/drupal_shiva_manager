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
	shivaLib.player.numCues=0;												// No cues yet
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   EVENT EDITING   
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Event.prototype.EventEditor=function() 							// EDIT EVENT
{
	var _this=this;															// Save 'this' locally
	if ($("#shivaEventEditorDiv").length) {									// If already on
		$("#shivaEventEditorDiv").remove();									// Remove it
		shivaLib.VideoEvent("remove","timeupdate",$.proxy(_this.DrawEventDots,this));	// Kill handler
		return;																// Quit
		}
	shivaLib.VideoEvent("add","timeupdate",$.proxy(function() {
			if (shivaLib.VideoTime() != _this.lastUpdatedDotTime){			// If time changed
				_this.DrawEventDots();										// Redraw dots on player change
				_this.lastUpdatedDotTime=shivaLib.VideoTime();				// Then is now
				}
			},this));
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
	var dur=this.par.SecondsToTimecode(shivaLib.VideoDuration()*this.scale);// Get bar duration
	$("#shivaEventEditorDiv").append("<div id='shivaEventSlider' style='border:none;height:2px;position:relative;left:14px;top:41px;width:100px'/>");
	$("#shivaEventSlider").slider({ value:100-(this.scale*100),max:95});	// Init scaler
	$("#shivaEventEditorDiv").css("border-radius","6px");					// Add corner style
	$("#shivaEventEditorDiv").css("-moz-border-radius","6px");				// Mozilla
	$("#shivaEventEditorDiv").css("background-color","#000");
	$("#shivaEventSlider .ui-slider-handle").css("height","8px");
	$("#shivaEventSlider .ui-slider-handle").css("cursor","pointer");
	$("#shivaEventSlider").css("background","#ccc");
	$("#shivaEventSlider .ui-slider-range").css("background","#999");
	$("#shivaEventSlider").bind("slidechange",$.proxy(function(event, ui) {	// Add handler
		this.scale=1-($("#shivaEventSlider").slider("option","value")/100);	// Get slider start
		var d=this.par.SecondsToTimecode(shivaLib.VideoDuration()*+_this.scale);	// Get bar duration
		$("#shivaTimescale").text("Show: "+d);								// Show span
		this.DrawEventDots();												// Redraw bar
		},this));
	str="<div id='shivaTimescale' class='unselectable' style='position:absolute;";			
	str+="left:125px;top:35px;color:#ccc''>Show: "+dur+"</div>";
	$("#shivaEventEditorDiv").append(str);
	$("#shivaEventEditorDiv").append("<div id='shivaTimecode' style='position:absolute;left:"+(w/2-12)+"px;top:35px;color:#ccc'/>");
	str="<div id='shivaTimebarDiv' style='position:absolute;-moz-user-select: none;-khtml-user-select:none;-webkit-user-select:none;";			
	str+="width:"+w+"px;left:8px;top:10px;height:16px;";
	str+="border-radius:3px;-moz-border-radius:3px;background-color:#999'/>";
	str+="<span class='unselectable' style='position:absolute;left:"+(w-86)+"px;top:33px;color:#ccc;vertical-align:top'>Add new event &nbsp;<img src='addeventdot.gif' width='14' style='cursor:pointer' onclick='shivaLib.ev.EditEvent(-1)'/></span?";
	$("#shivaEventEditorDiv").append(str);
	$("#shivaTimebarDiv").css("overflow","hidden"); 						// Disable spillover
	$("#shivaEventEditorDiv").slideDown();									// Slide it on
	this.DrawEventDots();													// Draw doys
}

SHIVA_Event.prototype.DrawEventDots=function() 							// DRAW EVENT DOTS
{
	var i,o,s,e,x=0,w,str;	
	$("#shivaTimebarDiv").empty();
	var _this=this;															// Save 'this' locally
	var dur=shivaLib.VideoDuration();										// Get clip duration
	var now=shivaLib.VideoTime();											// Get current time
	var wid=$("#shivaTimebarDiv").width();									// Width of time bar
	var end=(dur*this.scale)+now;											// End
	for (i=0;i<this.events.length;++i) {									// For each event
		o=this.events[i];													// Point at event
		if (!o.start)														// No start
			continue;														// Continue
		s=shivaLib.TimecodeToSeconds(o.start);								// Get start
		if ((s > end) && (this.scale < 1))									// After timespan and not showing all
			continue;														// Continue
		if (o.end) 															// If an end defined
			e=shivaLib.TimecodeToSeconds(o.end);							// Get end
		else																// A singleton
			e=s;															// End=start													
		if ((e < now) && (this.scale < 1))									// Before timespan and not showing all
			continue;														// Continue
		if (this.scale < 1)													// If not showing all
			x=((s-now)/dur)*wid/this.scale;									// Start x, account for now	
		else																// If scrolling
			x=(s/dur)*wid/this.scale;										// Start x		
		w=Math.max(15,((e-s)/dur)*wid/this.scale)-1;						// Width
		str="<div id='shivaEventDot-"+i+"' style='position:absolute;text-align:center;cursor:pointer;";
		str+="width:"+w+"px;left:"+x+"px;height:14px;padding:0px;margin:0px;";
		str+="border-radius:8px;-moz-border-radius:8px;background-color:#ccc;border:1px #eee solid'";
		str+="title='"+o.type.toUpperCase()+" "+o.start;					// Tool tip
		if (o.end)															// If an end
			str+="->"+o.end;												// Add end
		if (o.id)															// If an id
			str+=" ("+o.id+")";												// Add id
		str+="'>"+(i+1)+"</div>";											// Event num
		$("#shivaTimebarDiv").append(str);

		$("#shivaEventDot-"+i).dblclick( function(e) { 						// Handle double-click
			var id=this.id.substr(14);										// Get id
			var time=shivaLib.TimecodeToSeconds(_this.events[id].start)-1; 	// Back up one second
			shivaLib.VideoTime(time);										// Set time
			_this.EditEvent(id);  											// Edit the event
				});
	
		$("#shivaEventDot-"+i).draggable( {									// Make dots draggable			
				 drag: function(e,ui) {										// Handle drag				
						ui.position.top=0; 									// Force in track
						x=Math.max(Math.min(ui.position.left,wid),0);		// Cap 0-wid
						x=x/wid*shivaLib.VideoDuration()*_this.scale;		// Absolute time from bar
						$("#shivaTimecode").text(_this.par.SecondsToTimecode(x)); // Show position
						},
				stop: function(event,ui) { 									// Handle drag stop
						o=_this.events[this.id.substr(14)];					// Point at event
						x=Math.max(Math.min(ui.position.left,wid),0);		// Cap 0-wid
						x=x/wid*shivaLib.VideoDuration()*_this.scale;		// Absolute time from bar
						if (_this.scale < 1)								// If not showing all
							x+=now;											// Add start
						_this.Do("Move event");								// Save undo
						w=_this.par.TimecodeToSeconds(o.end)-_this.par.TimecodeToSeconds(o.start);// Save dur
						o.start=_this.par.SecondsToTimecode(x);				// Set time
						if (o.end)											// If an end defined
							o.end=_this.par.SecondsToTimecode(x+w); 		// Set time
						_this.UpdatePlayerEvents();							// Update player
						$("#shivaTimecode").text("");						// Clear timecode display
						}
				});
					
		$("#shivaTimebarDiv").scrollLeft((now/dur)*wid/this.scale);			// Scroll it
		}
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
		this.events[num].start=this.par.SecondsToTimecode(shivaLib.VideoTime());// Set start
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
			lines[0]=lines[0].replace(/\*!!\*/g,"\n").replace(/&quot;/g,"\"").replace(/&apos;/g,"\'");	// *!!* -> LF and quot/apos
			$("#sqpr").val(lines[0]);										// Set prompt
			}
		for (i=1;i<lines.length+1;++i) {									// For each line
			if (lines[i]) {													// If something there
				lines[i]=lines[i].replace(/&quot;/g,"\"").replace(/&apos;/g,"\'");	// Unescape
				v=lines[i].split("|");										// Get sub-parts
				if (v[0]) {													// If exists
					v[0]=v[0].replace(/\*!!\*/g,"\n").replace(/&quot;/g,"\"");	// *!!* -> LF and &quot; -> "
					$("#sq"+i+"a").val(v[0]);								// Set answer
					}
				if (v[1].charAt(0) == "*") {								// A leading *
					v[1]=v[1].substr(1);									// Lop it off
					$("#sq"+i+"c").attr("checked","checked");				// Set check			
					}
				if (v[1])													// If exists
					$("#sq"+i+"b").val(v[1]);								// Set action
				}
			}
		}
	else if (o.type == "find") {											// Deconstruct find
		var lines=o.text.split(">>");										// Split into lines
		if (lines[0]) {														// If exists
			lines[0]=lines[0].replace(/\*!!\*/g,"\n").replace(/&quot;/g,"\"");	// *!!* -> LF and &quot; -> "
			$("#sqpr").val(lines[0]);										// Set prompt
			}
		if (lines[1])														// If something there
			lines[1]=lines[1].replace(/&quot;/g,"\"").replace(/&apos;/g,"\'");	// Unescape
		v=lines[1].split("|");												// Get sub-parts
		if (v[0]) {															// If exists
			var vv=v[0].split("-");											// Chop up x-y-d
			var s=vv[0];													// Get 1st part
			if (!v[0].match(/--/))											// If spatial										
				s+=","+vv[1];												// Add y
			$("#sf3").val(s);												// Set target
			$("#sf4").val(vv[2]);											// Set delta
			}
		if (v[1]) 															// If exists
			$("#sf1").val(v[1]);											// Set success
		if (v[2]) 															// If exists
			$("#sf2").val(v[2]);											// Set failure
		}
	else if (o.type == "draw") {											// Get drawing
		var x=$("#containerDiv").css("left").replace(/px/,"")-0;			// Get left side of video
		x+=$("#containerDiv").width()-0+8;									// Set right
		$("#shivaLightBoxDiv").css("left",x+"px");							// Move background
		$("#shivaLightBoxIntDiv").css("left","8px");						// Move dialog
		shivaLib.AddOverlay(o.text);										// Get draw data
		shivaLib.dr.segs=shivaLib.overlay;									// Set drawing segs
		shivaLib.DrawOverlay();												// Reshow
		}

	$("#text").val($("#text").val().replace(/\*!!\*/g,"\n"));				// *!!* -> LF
	$("#text").val($("#text").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape
	$("#title").val($("#title").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape
	$("#done").val($("#done").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape
	$("#click").val($("#click").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape
	$("#hover").val($("#hover").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape
	$("#done").val($("#done").val().replace(/&quot;/g,"\"").replace(/&apos;/g,"\'"));	// Unescape

	if ($("#sqpr").length)													// If exists
		$("#sqpr").val($("#sqpr").val().replace(/&apos;/g,"'").replace(/&quot;/g,"\"")); // Unescape
	
	if ($("#sq1").length)													// If exists
		$("#sq1").val($("#sq1").val().replace(/&apos;/g,"'").replace(/&quot;/g,"\"")); // Unescape
	if ($("#sq2").length)													// If exists
		$("#sq2").val($("#sq2").val().replace(/&apos;/g,"'").replace(/&quot;/g,"\"")); // Unescape

	for (i=1;i<6;++i) 														// For each possible answer
		if ($("#sq"+i+"a").length) 											// If exists
			$("#sq"+i+"a").val($("#sq"+i+"a").val().replace(/&apos;/g,"'").replace(/&quot;/g,"\""));	// Unescape

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

SHIVA_Event.prototype.SetContentPanel=function(etype) 					// SET CONTENT PANEL CONTROLS
{
	var _this=this;															// Save 'this' locally
	str="<table cellspacing=0 cellpadding=0 style='font-size:small' width='100%'>";
	var chg="onchange='$(\"#content\").html(shivaLib.ev.SetContentPanel(this.value));	shivaLib.ev.SetEventHelp(); '";
	str+="<tr><td>Type</td><td>"+this.par.MakeSelect("type",false,["ask","draw","find","iframe","image","menu","popup","poller"],etype,chg)+"</td></tr>";
	str+="<tr><td>Calling ID</td><td><input type='text' size='20' id='id'/></td></tr>";
	str+="<tr><td>Title</td><td><input type='text' size='20' id='title'/></td></tr>";
	str+="<tr><td>Image Url</td><td><input type='text' size='20' id='url'/></td></tr>";
	str+="<tr><td>Has scrollbar?</td><td><input type='checkbox' id='frame-scroller'/></td></tr>";
	str+="<tr><td>Has close button? &nbsp;</td><td><input type='checkbox' id='frame-closer'/></td></tr>";
	if (etype == "menu") {
		str+="<input type='hidden' id='text'>";
		str+="<tr><td>Prompt</td><td><textarea rows='2' style='width:160px' id='sqpr'/> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Action &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;*</td></tr>";
		str+="<tr><td>Answer 1</td><td><input type='text' style='width:160px' id='sq1a'/> <input type='text' size='10' id='sq1b'/> <input type='checkbox' id='sq1c'/></td></tr>";
		str+="<tr><td>Answer 2</td><td><input type='text' style='width:160px' id='sq2a'/> <input type='text' size='10' id='sq2b'/> <input type='checkbox' id='sq2c'/></td></tr>";
		str+="<tr><td>Answer 3</td><td><input type='text' style='width:160px' id='sq3a'/> <input type='text' size='10' id='sq3b'/> <input type='checkbox' id='sq3c'/></td></tr>";
		str+="<tr><td>Answer 4</td><td><input type='text' style='width:160px' id='sq4a'/> <input type='text' size='10' id='sq4b'/> <input type='checkbox' id='sq4c'/></td></tr>";
		str+="<tr><td>Answer 5</td><td><input type='text' style='width:160px' id='sq5a'/> <input type='text' size='10' id='sq5b'/> <input type='checkbox' id='sq5c'/></td></tr>";
		}
	else if (etype == "find") {
		str+="<input type='hidden' id='text'>";
		str+="<tr><td>Prompt</td><td><textarea rows='2' style='width:160px' id='sqpr'/></tr>";
		str+="<tr><td>On success</td><td><input type='text' id='sf1'/></td></tr>";
		str+="<tr><td>On failure</td><td><input type='text' id='sf2'/></td></tr>";
		str+="<tr><td>Target</td><td><input type='text' id='sf3'/></td></tr>";
		str+="<tr><td>Fudge factor</td><td><input type='text' id='sf4'/></td></tr>";
		}
	else if (etype == "draw") {
		str+="<input type='hidden' id='text'>";								// Holds drawing data
		str+="<tr><td>Freehand drawing</td><td><input type='button' onclick='shivaLib.Annotate()' value='Draw/Edit'/></td></tr>";
		var x=$("#containerDiv").css("left").replace(/px/,"")-0;			// Get left side of video
		x+=$("#containerDiv").width()-0+8;									// Set right
		$("#shivaLightBoxDiv").css("left",x+"px");							// Move background
		$("#shivaLightBoxIntDiv").css("left","8px");						// Move dialog
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
	shivaLib.VideoCue("delete");											// Delete existing cues
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
	if (o.type == "menu") {													// Construct text from parts
		o.text=$("#sqpr").val();											// Prompt
		for (i=1;i<6;++i)													// For each question
			if ($("#sq"+i+"a").val()) {										// If an answer title
			o.text+=">>"+$("#sq"+i+"a").val()+"|";							// Add title
			if ($("#sq"+i+"c").attr("checked")) 							// If correct
				o.text+="*";												// Add star
			if ($("#sq"+i+"b").val()) 										// If an answer action
				o.text+=$("#sq"+i+"b").val();								// Add action
			}				
		}
	else if (o.type == "find") {											// Construct text from parts
		o.text=$("#sqpr").val();											// Prompt
		var str=$("#sf3").val();											// Get target
		if (str.match(/,/))	{												// If spatial
			str=str.replace(/,/g,"-");										// Use hyphen
			o.text+=">>"+str+"-"+$("#sf4").val(); 							// Add coords
			}
		else																// Temporal
			o.text+=">>"+str+"--"+$("#sf4").val(); 							// Add time
		if ($("#sf1").val())												// If set
			o.text+="|"+$("#sf1").val();									// Add success
		if ($("#sf2").val())												// If set
			o.text+="|"+$("#sf2").val();									// Add failure
		}				
	else if (o.type == "draw") {											// Get data from draw tool
		if (shivaLib.dr) {													// If drawing lib open
			o.text=shivaLib.dr.SaveDrawData(false);							// Get drawing data
			shivaLib.dr.segs=[];											// Clear segs
			}
		shivaLib.overlay=[];												// Clear data from memory
		shivaLib.DrawOverlay();												// Redraw	
		$("#shivaDrawDiv").html("");										// Clear draw div
		$("#shivaDrawPaletteDiv").remove();									// Close drawing tool
		}
	o.frame.scroller=($("#frame-scroller").attr("checked") == "checked"); 	// Set checkbox
	o.frame.closer=($("#frame-closer").attr("checked") == "checked"); 		// Set checkbox
	o.frame.draggable=($("#frame-draggable").attr("checked") == "checked"); // Set checkbox
	o.text=o.text.replace(/\r/g,"").replace(/\n/g,"*!!*");					// Remove CR, LF -> *!!*
	o.text=o.text.replace(/"/g,"&quot;").replace(/'/g,"&apos;");			// Escape quotes/apos
	o.title=o.title.replace(/"/g,"&quot;").replace(/'/g,"&apos;");			// Escape quotes/apos
	o.hover=o.hover.replace(/"/g,"&quot;").replace(/'/g,"&apos;");			// Escape quotes/apos
	o.click=o.click.replace(/"/g,"&quot;").replace(/'/g,"&apos;");			// Escape quotes/apos
	o.done=o.done.replace(/"/g,"&quot;").replace(/'/g,"&apos;");			// Escape quotes/apos
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
	if (o.id)																// If an id
		return;																// Don't add to cue
	shivaLib.VideoCue("add",o.start,function() { 							// A cue
		_this.Draw(num,true); 												// Add start cue
		shivaLib.SendShivaMessage("ShivaPlayer=event",num);					// Send message
 		 });		
	if (o.end)																// If an end set
		shivaLib.VideoCue("add",o.end,function() {_this.Draw(num,false);});	// Add end cue
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
			if (o.title)													// If title defined
				str+="<span style='text-align:center;text-shadow:1px 1px white'><b>"+o.title+"</b></span>";
			if (o.text)														// If text defined
				str+="<p>"+shivaLib.LinkToAnchor(o.text.replace(/\*!!\*/g,"<br>")),"<br/>"+"</p>";	// Add body text
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
		case "ask": 														// Ask dialog
		case "menu": 														// Menu dialog
		case "find": 														// Find dialog
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
	var	now=shivaLib.VideoTime();												// Get time
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
	if (def == undefined)													// If no def
		def="";																// Pur in null string														
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

SHIVA_Event.prototype.CloseEvent=function(id, p1, p2) 					// CLOSE EVENT
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
	else if (o.type == "find") {											// If a find event
		var s,e,now=0;
		if (this.player)													// If player 
			now=shivaLib.VideoTime();										// Get time
		var doit=false;														// Assume incorrect response
		v=lines[1].split("|")												// Temporal
		if (!v[0].match(/--/)) {											// If not a -- must be spatial	
			var x=v[0].split("-")[0];										// Get x
			var y=v[0].split("-")[1];										// Get y
			var d=v[0].split("-")[2]/2;										// Get delta
			if ((p1 > x-d) && (p1 < x+d) && (p2 > y-d) && (p2 < y+d))		// In range	
				doit=true;
			}
		else{																// Temporal
			s=this.par.TimecodeToSeconds(v[0].split("--")[0]);				// Start
			e=v[0].split("--")[1];											// Delta
			if ((now >= s-e) && (now <= s+e)) 								// In range
				doit=true;													// Trigger actions
			}
		if (doit && v[1])													// If correct
			this.EventRouter(v[1].replace(/\*/g,""),""); 					// Run events(s)
		else if (!doit && v[2])												// If wrong
			this.EventRouter(v[2].replace(/\*/g,""),""); 					// Run events(s)
		$("#shivaEvent-"+num).hide();										// Hide it
		this.EventRouter(o.done,"");										// Run events(s)
		this.modalEvent=-1;													// Clear modal event flag
		}
	else if (o.type == "ask") {												// If an ask
		this.SaveResponse(num,$("#shivaAskDiv-"+num).val());				// Save response
		$("#shivaEvent-"+num).hide();										// Hide it
		this.EventRouter(o.done,"");										// Run events(s)
		}
}

SHIVA_Event.prototype.SaveResponse=function(num, val) 					// SAVE RESPONSE TO ASK/MENU
{
	var name;
	var o=this.events[num];													// Point at event
	if (!o.response)														// Not response set
		return;																// Quit
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

SHIVA_Event.prototype.HideAll=function(now) 							// HIDE ALL EVENTS
{
	var i,s,e,o;
	for (i=0;i<this.events.length;++i) {									// For each event
		o=this.events[i];													// Point at event
		s=shivaLib.TimecodeToSeconds(o.start)-0;							// Get start
		if (o.end)															// If an end set
			e=shivaLib.TimecodeToSeconds(o.end);							// Get end
		else																// No end
			e=100000;														// Inifinite
		if ((now > s) && (now <= e))										// If in it
			continue;														// Don't hide it	
		$("#shivaEvent-"+i).hide();											// Hide it
		if ($("#shivaIframe-"+i).length)									// If an iframe
			$("#shivaIframe-"+i).remove();									// Remove it from DOM	
		}
	$("#shivaPopupDiv").remove();											// Remove popup, if there
	shivaLib.overlay=[];													// Clear draw data
	$("#shivaDrawDiv").html("");											// Clear draw div
	shivaLib.DrawOverlay();													// Reshow
}

SHIVA_Event.prototype.Draw=function(num, visible) 						//	DRAW OR HIDE EVENT
{
	var str;
	if ((num < 0) || (num >= this.events.length))							// If out of bounds
		return;																// Quit
	$("#shivaDrawDiv").css('pointer-events','none');						// Inibit pointer clicks if menu gone
   	var o=this.events[num];													// Point at event
	this.HideAll(shivaLib.VideoTime());										// Clear inactive events
	if ((o.type == "ask") || (o.type == "menu")|| (o.type == "find"))		// Ask, find or menu event
		this.modalEvent=num;												// Set modal flag
	if (o.type == "canvas") 												// A canvas event
		window.postMessage("ShivaTrigger="+this.container.substr(4)+","+(num+1)+",clicked","*");
	else if (o.type == "find") {											// A find
		if (!(o.text.split(">>")[1].split("|")[0].match(/--/)))	{			// If spatial										
 			var _this=this;													// Point at this
 			$("#shivaEventDiv").append("<div style='width:100%;height:100%;cursor:crosshair;background-color:white;opacity:0;z-index:2510' id='shivaEventDivFinder-"+num+"'></div>");
			$("#shivaEventDivFinder-"+num).click(function(e) {
				if (e.offsetX == undefined) { 								//  Firefox doesn't support offsetX
					e.offsetX=e.clientX-$("#containerDiv").position().left;	// Use clientX
					e.offsetY=e.clientY-$("#containerDiv").position().top;	// and sub pos 
					}
 				_this.CloseEvent(this.id,e.offsetX,e.offsetY); 				// Close event
				$("#"+this.id).remove();									// Remove event capture div
				});
			}
 		}
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
		}	 
	else if (o.type == "draw") {											// A drawing
		if (visible)														// Show
			shivaLib.AddOverlay(o.text);									// Get draw data
		else{																// Hide
			shivaLib.overlay=[];											// Clear data
			$("#shivaDrawDiv").html("");									// Clear draw div
			}
		shivaLib.DrawOverlay();												// Reshow
		}
	
	var fade=0;																// Assume no fade
	if (visible) {															// If making visible
		if (o.fadein)	fade=o.fadein*1000;									// If set, use it
		$("#shivaEvent-"+num).fadeIn(fade);									// Fade it in to show
		}														
	else{																	// If hiding
		if (o.fadeout)	fade=o.fadeout*1000;								// If set, use it
		$("#shivaEvent-"+num).fadeOut(fade);								// Fade out in to hide
		if (o.done)															// If done action
			this.EventRouter(o.done,"");									// Run events(s)
		}
	if ((o.player) && (this.player) && (visible)) {							// Player motion
		var param="";
		var s=o.player.indexOf("(");										// Param start
		var e=o.player.indexOf(")");										// Param end
		if ((s != -1) && (e != -1))											// If well-formed
			param=o.player.substring(s+1,e).replace(/%/g,"");				// Extract param			
		if (o.player.match(/^play/i)) {										// Play
			if (param)														// If a time set
				shivaLib.VideoPlay(param);									// Play from that
			else															// No time set
				shivaLib.VideoPlay();										// Play from current spot
			}
		else if (o.player.match(/^pause/i))	
			shivaLib.VideoPause();											// Pause
		else if (o.player.match(/^volume/i))								// Volume
			shivaLib.VideoVolume(param/100);								// Set volume
		else if (o.player.match(/^load/i)) {								// Load new clip
			shivaLib.VideoLoad(param); 										// Load
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
	  		if (this.SpecialEvent(v[i])) 									// If a special event, run it
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
	if (id.match(/^pause/i))												// If pause				
		shivaLib.VideoPause();												// Pause
	else if (id.match(/play/i)) {											// Play
		if (param)															// If a time set
			shivaLib.VideoPlay(param);										// Play from that
		else																// No time set
			shivaLib.VideoPlay();											// Play from current spot
		}
	else if (id.match(/^load/i))											// Load new clip	
		shivaLib.VideoLoad(param);											// Load
	else if (id.match(/^volume/i)) 											// If volume
		shivaLib.Videovolume(param/100);									// Volume
	else if (id.match(/popup/i)) {											// Popup	
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
		$("#shivaPopupDiv").delay(5000).fadeOut(400);						// Close after 6 seconds
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
	helpText['shapes']="For configuring the dimensions of your event as well as some of the basic behavior of that event on the page.";
	helpText['frame-top']="Where the top of your event dialog box begins. This is a pixel value the establishes an offset relative to the top of the video player.";
	helpText['frame-left']="Where the left side of your event dialog box begins. This is a pixel value the establishes an offset relative to the left side of the video player.";
	helpText['frame-width']="The width of your dialog box. Can be set to auto.";
	helpText['frame-height']="The height of your dialog box. Can be set to auto.";
	helpText['frame-radius']="The amount that your event dialog box's corners are rounded. This is a value in pixels that represents the radius of the circle that determines the curve of your box's corners.";
	helpText['frame-draggable']="Is  dialog box draggable?";
	helpText['colors']="For configuring text color, border color, background color, and the opacity of the event dialog box.";
	helpText['frame-color']="The font color for your event dialog box. Enter a hexadecimal color value in the text box, or a color name, such as black or red.";
	helpText['frame-background-color']="The background color for your event dialog box. Enter a hexadecimal color value in the text box, or a color name, such as black or red.";
	helpText['frame-border']="The border of the dialog in CSS.";
	helpText['frame-opacity']="The opacity of your event dialog box. A value of 0 (left) will be totally transparent, and a value of 100 (right) will be fully opaque.";
	helpText['actions']="For configuring how your event dialog box responds to various kinds of user actions.";
	helpText['click']="What action to trigger when a user clicks on your event dialog box.";
	helpText['hover']="What action to trigger when a user hovers over your event dialog box.";
	helpText['done']="What action to trigger when a user finishes interacting with your event dialog box. Note this only applies to events like 'ask' and 'menu' that actually require user interaction.";
	helpText['response']="How to store user input when a user finishes interacting with your event dialog box. Note this only applies to events like 'ask' and 'menu' that actually require user interaction.";
	helpText['player']="The behavior of the video player when the event first opens. Use 'pause' to pause the video player or leave the box blank to allow the video player to keep playing.";
	helpText['times']="For configuring various aspects of the timing for your event.";
	helpText['start']="The starting time for your event. This should be in the form mm:ss, e.g. 00:05.";
	helpText['end']="The ending time for your event. This should be in the form mm:ss, e.g. 00:05.";
	helpText['fadein']="The duration of the fade in for your event. This should be a number of seconds.";
	helpText['fadeout']="The duration of the fade out for your  event. This should be a number of seconds.";
	helpText['content']="For configuring what text, images, and other content to display in your event.";
	helpText['type']="Use the drop-down menu to choose what type of event you would like to use. ";
	helpText['id']="The name for this  event. Use only for called events";
	helpText['title ']="The title for the event.";
	helpText['url']="The web URL of an image to optionally add an image to your event.";
	helpText['frame-scroller']="Should your event popup box has scrollbars?";
	helpText['frame-closer']="Should your event popup box have a close button?";
	helpText['text']="The text in the body of your event.";
	helpText['sqpr']="Type the prompt the viewer will see in the popup box.";
	helpText['sq1a']="Text of answer."; helpText['sq1b']="Action to occur when answer is chosen."; helpText['sq1c']="Click if answer is correct one.";
	helpText['sq2a']="Text of answer."; helpText['sq2b']="Action to occur when answer is chosen."; helpText['sq2c']="Click if answer is correct one.";
	helpText['sq3a']="Text of answer."; helpText['sq3b']="Action to occur when answer is chosen."; helpText['sq3c']="Click if answer is correct one.";
	helpText['sq4a']="Text of answer."; helpText['sq4b']="Action to occur when answer is chosen."; helpText['sq4c']="Click if answer is correct one.";
	helpText['sq5a']="Text of answer."; helpText['sq5b']="Action to occur when answer is chosen."; helpText['sq5c']="Click if answer is correct one.";
	helpText['sf1']="Action to occur when user clicks in desired area.";		
	helpText['sf2']="Action to occur when user does NOT click in area.";
	helpText['sf3']="Point on video screen to click on x,y or timecode to find. Find x,y by clicking on video and hold Control key.";		
	helpText['sf4']="Number of pixels can click near target and still be correct, or seconds from the target.";

	var id;
	for (id in helpText) {
		$("#"+id).attr("title",helpText[id]);
	}

}