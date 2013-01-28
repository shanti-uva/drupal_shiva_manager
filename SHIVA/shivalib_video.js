///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB VIDEO
///////////////////////////////////////////////////////////////////////////////////////////////

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
    	shivaLib.player.currentTime(Number(v[0]*60)+Number(v[1]));
		shivaLib.player.volume(shivaLib.options.volume/100);
	   	if (shivaLib.options.autoplay == "true")
    		shivaLib.player.play();
    	else
     		shivaLib.player.pause();
		$("#shivaEventDiv").height(Math.max(shivaLib.player.media.clientHeight-40,0));
 		shivaLib.SendShivaMessage("ShivaVideo=ready");
   	}

  	function drawOverlay()	{
   		shivaLib.DrawOverlay();
   		}		
	this.SendReadyMessage(true);											
}
  
SHIVA_Show.prototype.VideoActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaActVideo=play") {									// PLAY
		this.player.play();												// Play from current spot
		if (v[1] != undefined)											// If a time set
				this.player.play(v[1]);									// Play from then
			}
	else if (v[0] == "ShivaActVideo=pause")								// PAUSE
		this.player.pause();											// Pause
	else if (v[0] == "ShivaActVideo=load") {							// LOAD
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
