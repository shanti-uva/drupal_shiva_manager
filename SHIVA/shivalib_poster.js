//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB POSTER  (USED IN IMAGE:ZOOMABLE too)
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.DrawPoster=function() 											//	DRAW POSTER
{
	var str;
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
	var str="<div id='posterDiv' style='position:absolute;border:1px solid;";			// Make poster div
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
								  	shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos); // Send message
								}});	 
	
/*	
	if (!this.g)																		// If no graphics lib
		this.g=new SHIVA_Graphics();													// Allocate it
	this.g.CreateCanvas("posterCanvas","posterDiv");									// Create canvas
	$("#posterCanvas").css({ position:"absolute" });
	$("#posterCanvas").attr("width",$("#posterDiv").css("width")).attr("height",$("#posterDiv").css("height"));						// Scale canvas to fit poster
	var ctx=$("#posterCanvas")[0].getContext('2d');										// Get context
	this.g.DrawBar(ctx, 0, 1, 0, 0, 100, 200)
*/	
	if (options.dataSourceUrl) {														// If a back img spec'd
		str="<img src='"+options.dataSourceUrl+"' ";									// Name
		str+="height='100%' width='100%'>";												// Size
		$("#posterDiv").append(str);													// Add image to poster
		}	
	this.DrawPosterOverview();															// Draw overview, if enabled
	if (this.posterMode != "Connect") {													// If editing
		this.DrawPosterPanes(-1,"draw");												// Draw panes
		this.DrawLayerControlBox(this.items,(options.controlbox == "true"));			// Draw control box?
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
//	$("#posterCanvas").attr("width",1600+"px").attr("height",1200+"px");						// Scale canvas to fit poster
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
								  	shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos); // Send message
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
								  		shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos); // Send message
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
		dh=v[0]/1000*h;																	// Div height
		x=w*v[1]/1000-(dw/2);															// Set centered left
		y=h*v[2]/1000-(dh/2);															// Set centered top
		str="<div id='posterPane"+i+"' style='position:absolute;background:none transparent;";	// Base
		if (this.items[i].style) 														// If a style spec'd
			str+=this.items[i].style.replace(/\|/g,";").replace(/=/g,":");				// Add it
		str+="'>"
		u=this.items[i].url;															// Point at url
		if (isImg=u.match(/[[.]jpg|jpeg|gif|png]/i))									// If an image file
			str+="<img src='"+this.items[i].url+"' width='"+dw+"'>";					// Image				
		else if (u) {																	// Something else
			if (!isNaN(u))																// If a number
				u="http://www.viseyes.org/shiva/go.htm?e="+u;							// Add file base
			str+="<iframe id='posterFrame-"+i+"' src='"+u+"'";							// Iframe base
			if (this.items[i].scrollbars == "false")									// If not scrolling
				str+="scrolling='no' ";													// Inhibit it
			str+="frameborder='0' allowtransparency='true'></iframe>";					// Finish iframe				
			}
		if (mode == "draw") {															// If doing them all, or redrawing one
			$("#posterPane"+i).remove();												// Remove old one, if there
			$("#posterDiv").append(str+"</div>");										// Add div to poster
			if (this.posterMode == "Edit") {											// If editing
				var str="<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;border:1px dashed'>";	// Make overlay div for dragging
				str+="<div id='posterPaneLab"+i+"' style='position:absolute;left:0px;text-shadow:1px 1px #eee'>";
				str+="<b> "+(i+1)+". "+this.items[i].layerTitle+"</b></div>";			// Label
				$("#posterPane"+i).append(str+"</div>");								// Add div
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
			var win=document.getElementById("posterFrame-"+i).contentWindow;			// Point at iframe	
			win.postMessage("ShivaAct=resize|100","*");									// Send message to container
			}
		if (this.posterMode != "Edit")													// If viewing
			continue;																	// No need for interaction
		$("#posterPane"+i).resizable({ 	containment:"parent",							// Resizable
										aspectRatio:isImg,
										stop:function(event,ui) {						// On resize stop
											var i=event.target.id.substr(10);			// Extract id
											var v=shivaLib.items[i].data.split("|");	// Get parts
											v[0]=Math.floor(Math.min(ui.size.width/$("#containerDiv").width()/shivaLib.posterScale,1)*1000); // Get new scale, cap at 100%					
											shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];		// Set new size
											$("#itemInput"+i+"-1").val(shivaLib.items[i].data);	// Put in menu
											shivaLib.DrawPosterPanes(i,"resize");			// Redraw this pane, and resize 								
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