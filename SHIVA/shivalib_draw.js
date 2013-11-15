///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB DRAW
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
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		if (tool == 2)
			str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		else if (tool == 0) {
			str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
			str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td><input onClick='shivaLib.dr.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";
			}		
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";
		}
	else if (tool == 3) {
		str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"boxColor\")' onChange='shivaLib.dr.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Text size</td><td><div style='width:82px;margin-left:6px' id='textSize'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"textColor\")' onChange='shivaLib.dr.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";
		}
	else if (tool == 4) {
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
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

	$("#alpha").slider({slide:function(event, ui) {shivaLib.dr.SetVal("alpha",ui.value);}});	
	$("#edgeWidth").slider({slide:function(event, ui) {shivaLib.dr.SetVal("edgeWidth",ui.value);}});	
	$("#textSize").slider({slide:function(event, ui) {shivaLib.dr.SetVal("textSize",ui.value);}});	
	$("#alpha .ui-slider-handle").css("border","1px solid #888");
	$("#edgeWidth .ui-slider-handle").css("border","1px solid #888");
	$("#textSize .ui-slider-handle").css("border","1px solid #888");
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
	$("#edgeWidth").slider("value",this.edgeWidth); 						// Set edge width
	$("#alpha").slider("value",this.alpha); 								// Set alpha
	$("#restSize").slider("value",this.textSize); 							// Set edge width
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
	else if (this.curTool != -1)											// If not closed
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

                                                                     
                                                                                  