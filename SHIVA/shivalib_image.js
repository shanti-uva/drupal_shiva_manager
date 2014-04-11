///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB IMAGE
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawImage=function() 												//	DRAW IMAGE
{
	var i,v,o,str;
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var _this=this;
	if (!options.chartType)																	// If not type defined (legacy)
		options.chartType="Slideshow";														// Make it slideshow	
	if (options.chartType == "Slideshow") {													// If slideshow or single image
		if (options.dataSourceUrl.indexOf("//docs.google.com") != -1)						// Google doc
 	   		GetSpreadsheetData(options.dataSourceUrl,options.imgHgt,options.showImage,options.showSlide,options.transition,options.width);
  		 else if (options.dataSourceUrl) {
	   		$("#"+this.container).html("<img id='"+this.container+"Img' "+"width='"+options.width+"' src='"+options.dataSourceUrl+"'/>");
			if (options.height)
				$(con).css('height',options.height);
			this.SendReadyMessage(true);											
			}
		else
			this.SendReadyMessage(true);	
		}										
	else if ((options.chartType == "Zoomable") && (options.dataSourceUrl)) 					// If zoomable
		this.DrawPoster("Image");															// Draw poster
	else if (options.chartType == "Montage") {												// If montage
		var items=new Array();																// Alloc iteems array
	   	for (var key in options) {															// For each item
			if (key.indexOf("item-") != -1) {												// If an item
				o={};																		// Alloc obj
				v=options[key].split(';');													// Split by ;
				for (i=0;i<v.length;++i)													// For each field
					o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				items.push(o);
				}
			}
		this.items=items;
		$(con).height(options.height);														// Set height
		$(con).width(options.width);														// Set width
		var act=$("#accord").accordion("option","active");									// Get active
   		if ((act === false) || (isNaN(act)) || (!$("#accord").length))						// If no image or in go.htm
   			act=0;																			// Force to first
		if (!this.imageMob)																	// If fist time
			this.imageMob={ div:this.container+"Img" };										// Init obj
 		this.imageMob.start=0;																// Start fresh
  		this.imageMob.curMob=act;															// Set curMob
  	 	this.imageMob.audioStart=0;															// Start fresh
		for (i=0;i<act;++i)																	// Run up to act
			this.imageMob.audioStart+=items[i].dur-0;										// Add time
		this.imageMob.numMobs=items.length;													// Number of mobs
   		clearInterval(shivaLib.imageMob.interval);											// Clear timer
		shivaLib.imageMob.interval=0;														// Clear var

		$(con).html("<img id='"+this.container+"Img' "+"' src='"+items[act].url+"' onclick='shivaLib.DrawImage()'/>"); // Add image
		if (act < items.length-1)															// If not last image
			$(con).append("<img id='"+this.container+"Img2' "+"' src='"+items[act+1].url+"' style='display:none' />");	// Preload next image
		$("#"+this.container+"Snd").remove();												// Remover old ones
		this.imageMob.snd=null;																// No audio object		
		if (options.audio) {																// If an audio file
			var file=options.audio.substr(0,options.audio.length-4);						// Remove extension
			str="<audio id='"+this.container+"Snd'";										// Base
			str+="><source src='"+file+".ogg' type='audio/ogg'><source src='"+file+".mp3' type='audio/mpeg'></audio>";	// Add sources
			$(con).append(str);																// Add audio to container
			this.imageMob.snd=document.getElementById(this.container+"Snd");				// Point at audio object
			this.imageMob.snd.volume=options.volume/100;									// Set volume
			}
		str="<div id='"+this.container+"Title'";											// Base
		if (options.etitle == "true") 	str+=" contenteditable='true'";						// If editable, set flag
		else							str+=" onclick='shivaLib.DrawImage()'";				// If not, repond to clicks
		str+="style='top:0px;left:0px;height:90%;width:90%;padding:5%;position:absolute;"; 	// Pos
		str+="font-size:"+options.height/20+"px;font-weight:bold;";							// Set height/bold
		str+="text-align:center;text-shadow:5px 5px 10px black;color:white'>";				// Text format		
		str+=items[act].title+"</div>";														// Add title
		$(con).append(str);																	// Add title overlay to container
		if ($("#accord").length)															// If editing	
			this.AnimateDiv("full");														// Draw full image
		else																				// Playing in go.htm
			this.AnimateDiv("start");														// Draw image at start pos
		if ((options.autoplay == "true") && (!$("#accord").length))							// If autoplay in go.htm
			$("#"+this.container+"PlyBut").trigger("click");								// Trigger play								
		this.SendReadyMessage(true);														// Send ready messge										
		}
		
 	  function GetSpreadsheetData(url, imgHgt, showImage, showSlide, trans, wid) {			// GET DATA FROM SPREADSHEET

		shivaLib.GetSpreadsheet(url,false,null,function(data) {								// Get spreadsheet data
  	     	AddImages(data,imgHgt,showImage,showSlide,trans,wid);							// Add images to gallery
		 	shivaLib.SendReadyMessage(true);												// Send ready message
  	    	});
 		}

  
  http://127.0.0.1:8020/SHIVA/go.htm?shivaGroup=Poster&item-1=name:Pane-1;data:250|437|285;url:599;asp:654;layerTitle:Montage;scrollbars:false;caption:Montage%20-%20Demo;style:border`3px%20solid%20white&item-2=name:Pane-2;data:250|438|621;asp:1000;url:610;layerTitle:Network;scrollbars:false;caption:Network%20-%20Demo;style:border`3px%20solid%20white&item-3=name:Pane-3;data:272|720|284;asp:610;url:500;layerTitle:Video%20-%20Demo;scrollbars:false;caption:Video%20-%20Demo;style:border`3px%20solid%20white&item-4=name:Pane-4;asp:764;data:356|761|588;url:586;layerTitle:Timeline%20-%20Demo;scrollbars:false;caption:Timeline%20-%20Demo;style:border`3px%20solid%20white&pos=1000|500|500&eva=&height=900&width=1400&backCol=fffcf2&dataSourceUrl=https://lh6.googleusercontent.com/-O-8_RgU9WCU/UoYskYStOyI/AAAAAAAAL_0/gwopG2GnaLo/w1440-h900-no/Creative-Sanford-Background-300.png&overview=true&grid=false&controlbox=false&ud=false
   
  
   	function AddImages(data, imgHgt, showImage, showSlide, transition, wid)				// ADD IMAGES TO GALLERY
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
	    $("#"+container).html(str);																// Add slideshow
	  	$('.ad-gallery').adGallery()[0].settings.effect=transition;								// Set transition style
	    $("#gallery").css("background","#ddd");													// Gray b/g
		if (wid.match(/%/)) {																	// If a percent
			wid=wid.replace(/%/,"")/100;														// Lop off % and turn to val
			wid=$("#"+container).width()*wid;													// Get a real #
			}
		$(".ad-gallery").css("width",wid+"px");													// Set wid 
 	}

}  // Closure end


SHIVA_Show.prototype.AnimateDiv=function(mode)									// ANIMATE/POSITION DIV
{
	var o,v;
	var mob=shivaLib.imageMob;														// Point at mob
 	if (!mob)																		// Nothing there
 		return;																		// Q!uit
 	if (mode == "next") {															// Advance to next pic
 		if (mob.curMob < shivaLib.items.length-1)	{								// If not last pic
 			mob.curMob++;															// Inc
			shivaLib.imageMob.start=new Date().getTime();							// Set start
			shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);			// Set timer ~24fps
			}
 		else{																		// All done
			if (shivaLib.imageMob.snd)												// If a sound object
				shivaLib.imageMob.snd.pause();										// Stop playing
			if (!$("#accord").length)												// If in go.htm
				mob.curMob=0;														// Back to the top
			$("#"+shivaLib.container+"PlyBut").show();								// Show play button
		  	shivaLib.SendShivaMessage("ShivaImage=done");							// Done
			return;																	// Quit
	 		}
	 	}
 	var o=shivaLib.items[mob.curMob];												// Point at current item
	v=o.sp.split(",");	mob.sx=v[0]-0; 	mob.sy=v[1]-0; 	mob.sw=v[2]-0;				// Start pos
  	v=o.ep.split(",");	mob.ex=v[0]-0; 	mob.ey=v[1]-0; 	mob.ew=v[2]-0;				// Emd pos
   	mob.dur=o.dur-0;	mob.fx=o.fx;	mob.url=o.url;	mob.ease=o.ease;			// Misc options
   	mob.title=o.title;													
 	$("#"+shivaLib.container+"Title").html(mob.title);								// Set title
	$("#"+shivaLib.container).css("overflow","hidden");								// Extra is hidden
	if (($("#"+shivaLib.container+"PlyBut").length == 0) && mob.dur) {				// If no playbut yet, but animated
		$("#"+shivaLib.container).append("<img id='"+this.container+"PlyBut' src='playbut.gif' style='position:absolute;top:48%;left:47%;padding:2px;padding-left:18px;padding-right:18px' class='propTable' width='18'>");
		$("#"+shivaLib.container+"PlyBut").click( function(){						// Play button click handler
			$(this).hide();															// Hide it 
			if (shivaLib.imageMob.snd) {											// If a sound object
				if (shivaLib.imageMob.snd.readyState)								// If ready
					shivaLib.imageMob.snd.currentTime=shivaLib.imageMob.audioStart;	// Cue audio
				shivaLib.imageMob.snd.play();										// Start playing
				}
			clearInterval(shivaLib.imageMob.interval);								// Clear timer
			shivaLib.imageMob.start=new Date().getTime();							// Set start
			shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);			// Set timer ~24fps
		  	shivaLib.SendShivaMessage("ShivaImage=play");							// Playing
			});	
		}
 	if (mob.url != $("#"+mob.div).attr('src'))	{									// If not same url
 	 	$("#"+mob.div).attr('src',shivaLib.items[mob.curMob].url);					// Set src
 	 	if (mob.curMob < mob.numMobs-1)												// If not last mob
 	 		$("#"+mob.div+"2").attr('src',shivaLib.items[mob.curMob+1].url);		// Preload next one
		}
	var pct=(new Date().getTime()-mob.start)/(mob.dur*1000);						// Get percentage
	if (mob.start == 0)																// If first time
		pct=0;																		// Start at beginning
	if (pct >= .99) { 																// If done
		clearInterval(shivaLib.imageMob.interval);									// Clear timer
		shivaLib.imageMob.interval=0;												// Clear var
		mob.start=0;																// Stop recursing for some reason
		shivaLib.AnimateDiv("next");												// Get next pic
 		return;
		}
 	if (mob.start == 0)																// If first time
		pct=0;																		// Start at beginning
	if (mob.ease == "both")															// Both
		pct=1.0-((Math.cos(3.1414*pct)+1)/2.0);										// Full cosine curve
	else if (mob.ease == "in")														// Slow in
		pct=1.0-(Math.cos(1.5707*pct));												// 1st quadrant of cosine curve
	else if (mob.ease == "out")														// Slow out
		pct=1.0-(Math.cos(1.5707+(1.5707*pct))+1.0);								// 2nd quadrant of cosine curve
	var o={ position:"relative"};													// Position mode
	o.left=(mob.sx+((mob.ex-mob.sx)*pct))/100;										// Calc left
	o.top=(mob.sy+((mob.ey-mob.sy)*pct))/100;										// Calc top
	o.width=1000000/((mob.sw+((mob.ew-mob.sw)*pct)));								// Calc width
	o.opacity=(mob.sa+((mob.ea-mob.sa*pct))/100);									// Calc alpha
	o.left=(-o.width*(o.left/100))+"%";												// Scale left
	o.top=(-o.width*(o.top/100))+"%";												// Scale top
	o.width+="%"																	// Add %
	if ((mode == "full") &&	($("#accord").length)) {								// If full image
  		o.top=o.left="0%",o.width="100%",o.opacity=1;								// Ignore settings	
  		$("#"+shivaLib.container).css("overflow","visible");						// Show extra
  		}
	$("#"+mob.div).css(o);															// Set css 
}

SHIVA_Show.prototype.ImageActions=function(msg)									// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");															// Split msg into parts
	if (v[0] == "ShivaAct=resize") {  												// RESIZE
		if (v[1] == "100") 															// If forcing 100%
			shivaLib.options.width=shivaLib.options.height="100%";					// Set values
		shivaLib.DrawImage();														// Redraw image
		}
	else if (v[0] == "ShivaAct=play") {   											// PLAY
		if (!shivaLib.imageMob.interval)											// If not playing
			$("#"+this.container+"PlyBut").trigger("click");						// Trigger play								
		}
	else if (v[0] == "ShivaAct=pause") {   											// PAUSE
		if (shivaLib.imageMob.interval)												// If not paused
			shivaLib.DrawImage();													// Redraw image to pause
		}
}

                      