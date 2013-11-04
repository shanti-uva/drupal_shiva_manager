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
    	this.player.cue(Number(v[0]*60)+Number(v[1]),function() { 
     		this.pause()
			shivaLib.SendShivaMessage("ShivaVideo=done");
    		});
    	}
	this.player.on("timeupdate",drawOverlay);
	this.player.on("loadeddata",onVidLoaded);
	this.player.on("ended",function(){ shivaLib.SendShivaMessage("ShivaVideo=done")});
	this.player.on("playing",function(){ shivaLib.SendShivaMessage("ShivaVideo=play")});
	this.player.on("pause",function(){ shivaLib.SendShivaMessage("ShivaVideo=pause")});

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
    	var time=Math.max(Number(v[0]*60)+Number(v[1]),.25);
     	if (this.smartPlayerType == "Vimeo") 
   			shivaLib.player.currentTime(shivaLib.options.start);
 		else
  			shivaLib.player.currentTime(time);
  		shivaLib.player.volume(shivaLib.options.volume/100);
	   	if (shivaLib.options.autoplay == "true")
    		shivaLib.player.play();
    	else
     		shivaLib.player.pause();
		$("#shivaEventDiv").height(Math.max(shivaLib.player.media.clientHeight-40,0));
		shivaLib.VideoNotes();
 		shivaLib.SendShivaMessage("ShivaVideo=ready");
   		setInterval(onVideoTimer,400);	
   	}

  	function onVideoTimer(e) {												// VIDEO TIMER HANDLER
		if ($("#shivaNotesDiv").length) {									// If open
			var t,i,next;
			var now=shivaLib.player.currentTime();							// Get current time
			for (i=0;i<500;++i) {											// Loop
				if (!$("#ntc-"+i).length)									// If no more                                  
					break;													// Quit
	        	t=shivaLib.TimecodeToSeconds($("#ntc-"+i).text());			// Convert to seconds      
				if (now > t) {												// Post start
	        		next=shivaLib.TimecodeToSeconds($("#ntc-"+(i+1)).text()); // Next tc in secs    
					if (now < next) {										// If before next
						$("#ntx-"+i).focus();								// Set focus
		            	break;                                              // Quit	            		}
	            		}
       				}
       			}
       		}
	}
	
  
  	function drawOverlay()	{
   		shivaLib.DrawOverlay();
   		}		
	this.SendReadyMessage(true);											
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
		this.player.play();												// Play from current spot
		if (v[1] != undefined)											// If a time set
				this.player.play(v[1]);									// Play from then
			}
	else if (v[0] == "ShivaAct=pause")									// PAUSE
		this.player.pause();											// Pause
	else if (v[0] == "ShivaAct=load") {									// LOAD
		this.player.media.src=v[1];										// Set new source
		this.player.load(); 											// Load
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
	var ts="color:#009900;cursor:crosshair";								// Timecode style
	var ns="font-size:x-small;border:none;background:none;width:100%;padding:0px;margin:0px"; // Note style	
	str+="<div style='text-align:center;font-size:medium;><img src='shivalogo16.png' style='vertical-align:middle'><b> SHIVA Notes</b></div><hr>";
	str+="<div style='position:absolute;top:0px;left:0px;width:100%;text-align:right'><br/><img src='savedot.gif' id='shivaNotesSave' title='Save notes'>&nbsp; &nbsp;</div>";
	str+="<tr><td width='36' id='ntc-0' style='"+ts+"'>Type:</td><td><input id='ntx-0' type='input' style='"+ns+"'/></td></tr>";
	str+="</table>";														// End
	str+="<div style='text-align:right'><br/><br/><input type='checkbox' id='notesPause'/>Pause video while typing?";
//	str+="<br/>Filter by: <input type='input' id='notesFilter' size='10'/></div>";
	
	$('body').append(str+"</div>");													// Add to dom								
	$("#shivaNotesDiv").draggable();										// Make draggable
	$("#ntx-0").focus();													// Focus on first one
	
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
			var ts="color:#009900;cursor:crosshair";						// Timecode style
			var ns="font-size:x-small;border:none;background:none;width:100%;padding:0px;margin:0px";	// Note style	
			var id=$("#shivaNotesTbl tr").length;							// If of next row
			var str="<tr><td id='ntc-"+id+"' style='"+ts+"'>Type:</td><td><input id='ntx-"+id+"' type='input' style='"+ns+"'/></td></tr>";
			$("#shivaNotesTbl").append(str);								// Add row
			$("#ntx-"+id).focus();											// Focus on new one
			if ($("#notesPause").prop('checked') && !cap) 					// If checked and not capped
				shivaLib.player.play();										// Resume player
			if (cap)														// If line is capped
				$("#ntc-"+id).text(shivaLib.SecondsToTimecode(shivaLib.player.currentTime()));	// Set new time
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
			$("#ntc-"+rowNum).text(shivaLib.SecondsToTimecode(shivaLib.player.currentTime()));	// Set new time
			if ($("#notesPause").prop('checked')) 							// If checked
				shivaLib.player.pause();									// Pause player
			
			$("#ntc-"+rowNum).click(function(e){							// Add click handler
				   	var time=$("#"+e.target.id).text();						// Get time
				   	if (shivaLib.player.smartPlayerType != "Vimeo") {		// If vimeo
 						var v=time.split(":");								// Reconstruct from parts into seconds
						if (v.length == 1)									// Only seconds
							v[1]=v[0],v[0]=0;								// Pad it
						time=Math.max(Number(v[0]*60)+Number(v[1]),.25);	// Make into seconds
						}
					if (e.shiftKey)											// If shift key pressed
						$("#"+e.target.id).text(shivaLib.SecondsToTimecode(shivaLib.player.currentTime()));	// Set new time
					else
						shivaLib.player.currentTime(time);						// Cue player
					});
			$("#ntc-"+rowNum).dblclick(function(e){							// Add  d-click handler
				   	var time=$("#"+e.target.id).text();						// Get time
				   	if (shivaLib.player.smartPlayerType != "Vimeo") {		// If vimeo
 						var v=time.split(":");								// Reconstruct from parts into seconds
						if (v.length == 1)									// Only seconds
							v[1]=v[0],v[0]=0;								// Pad it
						time=Math.max(Number(v[0]*60)+Number(v[1]),.25);	// Make into seconds
						}
					shivaLib.player.play(time);								// Play
					});
			}
		});
};

