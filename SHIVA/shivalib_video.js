///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB VIDEO
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawVideo=function() 												//	DRAW VIDEO
{
	var v,t,type="YouTube";
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
	var base="http://www.youtube.com/watch?autoplay=1&v=";
	
	$(con).width(options.width);
	$(con).height(options.height);
	if ((options.dataSourceUrl.match(/vimeo/)) || (!isNaN(options.dataSourceUrl)))
		base="http://vimeo.com/",type="Vimeo";
	else if (options.dataSourceUrl.match(/kaltura/)) {
		var s=options.dataSourceUrl.indexOf("kaltura_player_");
		var flavor=487061;		// Was 301951
		id=options.dataSourceUrl.substring(s+15);
		id="https://www.kaltura.com/p/2003471/sp/0/playManifest/entryId/"+id+"/format/url/flavorParamId/"+flavor+"/protocol/https/video.mp4"
		base="";
		type="Kaltura";
		}
	else if ((options.dataSourceUrl.match(/http/g)) && (!options.dataSourceUrl.match(/youtube/g)))
		base="",type="HTML5";
	if (this.player) {
    	this.player.destroy();
    	$(con).empty();
    	this.player=null;
    	}
  	if (!this.player)
		this.player=Popcorn.smart(con,base+id);
	this.player.smartPlayerType=type;
	this.player.media.src=base+id;
	if (options.end) {
		v=options.end.split(":");
		if (v.length == 1)
			v[1]=v[0],v[0]=0;
    	this.VideoCue("add",Number(v[0]*60)+Number(v[1]),function() { 
     		this.pause()
			shivaLib.SendShivaMessage("ShivaVideo=done");
    		});
    	}

////////////////////////// VIDEO WRAPPER ///////////////////////////////////////////////////

	this.VideoPlay=function(time) {											// PLAY A CLIP
		if (time != undefined) {												// If a time set
			shivaLib.player.play();											// Start it playing first for some unknown reason
			time=""+time;													// Cast to string
 			if (time.match(/:/))											// If a timecode
 				time=shivaLib.TimecodeToSeconds(time);						// Convert to seconds
			}
		shivaLib.player.play(time);											// Send timecode
		}

	this.VideoPause=function() {											// PAUSE A CLIP
   		shivaLib.player.pause();											// Send pause
		}
	
	this.VideoPaused=function() {											// IS CLIP PAUSED?
   		return (shivaLib.player.paused());									// Get state
		}

	this.VideoDuration=function() {											// GET CLIP DURATION
   		return (shivaLib.player.duration());								// Get duration
		}

	this.VideoVolume=function(vol) {										// SET VOLUME
   		shivaLib.player.volume(vol);										// Send pause
		}

	this.VideoLoad=function(clip) {											// LOAD A CLIP
   		shivaLib.player.load();												// Send pause
		}
	
	this.VideoMediaHeight=function() {										// GET MEDIA HEIGHT
  		return (shivaLib.player.media.clientHeight);						// Return height
  		}

	this.VideoTime=function(time) {											// GET/SET CURRENT TIME
 		if (time != undefined) {											// If setting time
 			time=""+time;													// Cast to string
 			if (time.match(/:/))											// If a timecode
 				time=shivaLib.TimecodeToSeconds(time);						// Convert to seconds
		   	shivaLib.player.currentTime(time-0);							// Send timecode
			}
		else																// Getting time
			time=shivaLib.player.currentTime();								// Get time
		return(time);														// Return time
	}

	this.VideoCue=function(mode, time, callback, num) {						// SET VIDEO CUE
		if (mode == "add") {												// If adding a new cue
			shivaLib.player.cue(time,callback);								// Add end cue
			shivaLib.player.numCues++;										// Add to count
			}
 		else if (mode == "delete") {										// If removing them
			for (var i=0;i<shivaLib.player.numCues;++i)						// For each cue
 				shivaLib.player.removeTrackEvent(this.player.getLastTrackEventId()); // Remove last
			shivaLib.player.numCues=0;										// Reset count
			}
  		}

	this.VideoEvent=function(mode, type, callback) {						// SET VIDEO EENT
		if (mode == "add") 													// If adding a new cue
			shivaLib.player.on(type,callback);								// Add event listener
		else																// Remove it
			shivaLib.player.off(type,callback);								// Remove event listener
		}
		
////////////////////////// EVENTS ///////////////////////////////////////////////////
	
	if (this.ev) 															// If event lib is already loaded
		t=this.ev.events;													// Get events from lib
	else																	// Else
		t=options["shivaEvents"];											// Get from options array
	this.ev=new SHIVA_Event(this);											// Alloc event library
	if ((t) && (t.length))	{												// If any events
		this.ev.AddEvents(t);												// Add them
		this.ev.HideAll(0);													// Hide boxes after load
		}
	this.SendReadyMessage(true);											// Ready										

	this.VideoEvent("add","timeupdate",drawOverlay);						// Draw overlay when time changes
	this.VideoEvent("add","loadeddata",onVidLoaded);						// Call when video is loaded
	this.VideoEvent("add","ended",function(){ shivaLib.SendShivaMessage("ShivaVideo=done")});	// When video plays til end
	this.VideoEvent("add","playing",function(){ shivaLib.SendShivaMessage("ShivaVideo=play")});	// When video starts to play
	this.VideoEvent("add","pause",function(){ shivaLib.SendShivaMessage("ShivaVideo=pause")});	// When video is paused

////////////////////////// CALBACKS ///////////////////////////////////////////////////

 	function onVidLoaded()	{
		var v=shivaLib.options.start.split(":");
		if (v.length == 1)
			v[1]=v[0],v[0]=0;
    	var time=Math.max(Number(v[0]*60)+Number(v[1]),.25);
   		shivaLib.VideoTime(time);
  		shivaLib.VideoVolume(shivaLib.options.volume/100);
	   	if (shivaLib.options.autoplay == "true")
    		shivaLib.VideoPlay();
    	else
     		shivaLib.VideoPause();
		$("#shivaEventDiv").height(Math.max(shivaLib.VideoMediaHeight()-40,0));
		shivaLib.VideoNotes();
 		shivaLib.SendShivaMessage("ShivaVideo=ready");
   		setInterval(onVideoTimer,400);	
 		if (shivaLib.ev)
 			shivaLib.ev.DrawEventDots();										
   	}

  	function onVideoTimer(e) {										// VIDEO TIMER HANDLER
		if ($("#shivaNotesDiv").length) {								// If open
			var t,i,j,next;
			var now=shivaLib.VideoTime();								// Get current time
			for (i=0;i<500;++i) {										// Loop
				if (!$("#ntc-"+i).length)								// If no more                                  
					break;												// Quit
				$("#ntc-"+i).css("color","#009900");					// Clear it
	        	t=shivaLib.TimecodeToSeconds($("#ntc-"+i).text());		// Convert to seconds      
				if (now >= t) {											// Post start
	        		next=shivaLib.TimecodeToSeconds($("#ntc-"+(i+1)).text()); // Next tc in secs    
					if (now < next) {									// If before next
						$("#ntc-"+i).css("color","#ff0000");			// Highlight it
			            break;                                         	// Quit
	            		}
       				}
       			}
       		}
	}
	
  	function drawOverlay()	{										// ON TIME CHANGE										
		if (!$("#shivaDrawPaletteDiv").length)							// If not drawing
   			shivaLib.DrawOverlay();										// Refresh overlay
   		}		
}
  
SHIVA_Show.prototype.VideoActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=resize") { 									// RESIZE
		if (v[1] == "100") {											// If forcing 100%
			$("#containerDiv").width("100%");							// Set container 100%
			$("#containerDiv").height("100%");							// Set container 100%
			}
		}
	else if (v[0] == "ShivaAct=play") {									// PLAY
		this.VideoPlay();												// Play from current spot
		if (v[1] != undefined)											// If a time set
			this.Videoplay(v[1]);										// Play from then
			}
	else if (v[0] == "ShivaAct=pause")									// PAUSE
		this.VideoPause();												// Pause
	else if (v[0] == "ShivaAct=load") {									// LOAD
		this.VideoLoad(v[1]); 											// Load
		}
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

SHIVA_Show.prototype.VideoNotes=function() 								//	ADD NOTES TO VIDEO
{
	var str;
	$("#shivaNotesDiv").remove();											// Clear it
	if (this.options.notes != "true") 										// If not visible
		return;																// Turn it off
	var con=$("#"+this.container);											// Point at video player container	
	str="<div id='shivaNotesDiv' style='position:absolute;padding:8px;overflow-y:auto;";	// Div
	str+="width:500px;height:"+(con.height()-16)+"px;";						// Set sizing
	str+="background-color:#f8f8f8;border:1px solid #ccc;box-shadow:4px 4px 8px #ccc;";			// Set coloring
	var top=con.offset().top;												// Get top
	var left=con.offset().left+con.width()+16;								// Get left
	str+="top:"+top+"px;left:"+left+"px;'>";								// Set position
	str+="<table id='shivaNotesTbl' width='100%'>";							// Table
	var ts="color:#009900;cursor:pointer";									// Timecode style
	var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px"; // Note style	
	str+="<div style='text-align:center;font-size:large;'><img src='shivalogo16.png' style='vertical-align:-2px'><b> SHIVA Notes</b></div><hr>";
	str+="<div style='position:absolute;top:-2px;left:0px;width:100%;text-align:right'><br/>Find: <input type='input' id='shivaNotesSearch' style='height:12px;width:60px;font-size:x-small;padding:0px;margin:0px'/>&nbsp; &nbsp;</div>"
	str+="<tr><td width='38' id='ntc-0' style='"+ts+"'>Type:</td><td><input id='ntx-0' type='input' style='"+ns+"'/></td></tr>";
	str+="</table>";														// End
	str+="<div style='text-align:right'><br/>________________________________<br/><br/>Pause video while typing?<input type='checkbox' id='notesPause' style='height:11px'>";
	str+="<br/>Save notes: <img src='savedot.gif' id='shivaNotesSave' title='Save notes' width='15' style='vertical-align:bottom'>";
	
	$('body').append(str+"</div>");											// Add to dom								
	$("#shivaNotesDiv").draggable();										// Make draggable
	$("#ntx-0").focus();													// Focus on first one
	
	$("#shivaNotesSearch").on("keydown", function(e) {						// Handle filter
				var n=$("#shivaNotesTbl tr").length;						// Number of rows
				var patt=new RegExp($("#shivaNotesSearch").val());			// Pattern to find
				for (var i=0;i<n;++i) {										// For each row
					$("#ntx-"+i).css("color","black");						// Clear it
					if (($("#ntx-"+i).val()) && ($("#ntx-"+i).val().match(patt))) // If in there
						$("#ntx-"+i).css("color","red");					// Highlight it
					}
				});			
		
	$("#shivaNotesSave").on("click", function(e) {							// Handle save
				var str="";
				var n=$("#shivaNotesTbl tr").length;						// Number of rows
				for (var i=0;i<n;++i) 										// For each row
					if ($("#ntx-"+i).val())									// If something there
						str+=$("#ntc-"+i).text()+"\t"+$("#ntx-"+i).val()+"\n";	// Add row
	 			 	window.prompt ("To copy your Notes to the clipboard:\nType Ctrl+C or Cmd+C and click  OK button.",str);	// Copy to clipboard
				});			


	$("#shivaNotesTbl").on("keydown", function(e) {							// Handle key down
		var cap=false;														// Don't cap
		var rowNum=e.target.id.split("-")[1];								// Get rownum
		if ($("#"+e.target.id).val().length > 80)							// If past limit
			cap=true;														// Let's cap line
		if ((e.keyCode == 13) || (cap)) {									// Enter on capping a line
			var ts="color:#009900;cursor:pointer";						// Timecode style
			var ns="font-size:small;border:none;background:none;width:100%;padding:0px;margin:0px";	// Note style	
			var id=$("#shivaNotesTbl tr").length;							// If of next row
			var str="<tr><td id='ntc-"+id+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+id+"' type='input' style='"+ns+"'/></td></tr>";
			$("#shivaNotesTbl").append(str);								// Add row
			$("#ntx-"+id).focus();											// Focus on new one
			if ($("#notesPause").prop('checked') && !cap) 					// If checked and not capped
				shivaLib.VideoPlay();										// Resume player
			if (cap)														// If line is capped
				$("#ntc-"+id).text($("#ntc-"+rowNum).text());				// Set to same time
			}
		else if ((e.keyCode == 8) || (e.keyCode == 46)) {					// Delete
			var id="#"+e.target.id;											// Get id
			if ((!$(id).val()) && (id != "#ntx-0")) {						// No more chars left sand not 1st row
				id="ntx-"+(id.substr(5)-1);									// Last row										
				$("#"+id).focus();											// Focus there to prevent page back action
				$("#"+e.target.id).parent().parent().remove();				// Delete
				}			
			}
		else if (!$("#ntx-"+rowNum).val()) {								// A key and nothing in the field yet
			$("#ntc-"+rowNum).text(shivaLib.SecondsToTimecode(shivaLib.VideoTime()));	// Set new time
			if ($("#notesPause").prop('checked')) 							// If checked
				shivaLib.VideoPause();										// Pause player
			
			$("#ntc-"+rowNum).click(function(e){							// Add click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					if (e.shiftKey)											// If shift key pressed
						$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.VideoTime()));	// Set new time
					else
						shivaLib.VideoTime(shivaLib.TimecodeToSeconds(time));	// Cue player
					});
			
			$("#ntc-"+rowNum).dblclick(function(e){							// Add  d-click handler
				   	var time=$("#"+e.target.id).text();						// Get time
					shivaLib.VideoPlay(time);								// Play
					});
			}
		});
};

