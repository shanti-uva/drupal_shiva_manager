///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB DRAW
///////////////////////////////////////////////////////////////////////////////////////////////

var drObj=null;

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
	drObj=shivaLib.dr=this;													// Set SHIVA_Show pointer
	if (!hidePalette)														// If not hiding palette
		this.DrawPalette();													// Draw palatte
	this.colorPicker="";													// Not in color picker
	if ($("#shivaDrawCanvas")[0])											// If canvas there
		this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');					// Get context
	$("#shivaDrawDiv").css("cursor","crosshair");							// Crosshair cursor
	$("#shivaDrawDiv").mouseup(this.onMouseUp);								// Mouseup listener
	$("#shivaDrawDiv").mousedown(this.onMouseDown);							// Mousedown listener
	$("#shivaDrawDiv").mousemove(this.onMouseMove);							// Mousemovelistener
	document.onkeyup=this.onKeyUp;											// Keyup listener
	document.onkeydown=this.onKeyDown;										// Keydown listener
}

SHIVA_Draw.prototype.Sound=function(snd) 						
{
	shivaLib.Sound(snd);
}

SHIVA_Draw.prototype.DrawPalette=function(tool) 						//	DRAW 
{
	this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');						// Get context
	var hgt=$("#"+this.container).css("height").replace(/px/g,"");			// Get height
	var top=$("#"+this.container).css("top").replace(/px/g,"");				// Get top
	if (top == "auto")	top=0;												// Use 0
	var left=$("#"+this.container).css("left").replace(/px/g,"")-0+12;		// Get left
	if ($("#shivaDrawPaletteDiv").length == 0) {							// If no palette
		var h=225;															// Default height
		str="<div id='shivaDrawPaletteDiv' style='position:absolute;left:"+left+"px;top:"+(top-12+Number(hgt)-100)+"px;width:180px;height:"+h+"px'>";
		$("body").append("</div>"+str);										// Add palette to body
		$("#shivaDrawPaletteDiv").css({ "background-color":"#eee","border-radius":"8px","z-index":2001 });
		$("#shivaDrawPaletteDiv").addClass("propTable");					// Style same as property menu
		$("#shivaDrawPaletteDiv").draggable();								// Make it draggable
		$("#shivaDrawPaletteDiv").css({ "-moz-user-select":"none","-khtml-user-select":"none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none"});
		$("#shivaDrawPaletteDiv")[0].addEventListener('contextmenu', function(ev) {
		    ev.preventDefault();
			window.prompt("To copy graphics to clipboard: Hit Ctrl+C, then press OK",drObj.SaveSVGData());
		    return false;
			}, false);
		}
	this.SetTool(0);														// Draw lines
	this.DrawMenu();														// Draw menu
}

SHIVA_Draw.prototype.Clear=function() 									//	CLEAR DRAWING
{
	shivaLib.overlay=[];													// Clear data from memory
	this.segs=[];															// Clear list
	$("#shivaDrawDiv").html("");											// Clear draw div
}

SHIVA_Draw.prototype.ColorPicker=function(name) 						//	DRAW COLORPICKER
{
	var str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";
	str+="<img src='colorpicker.gif' style='position:absolute;left:15px;top:28px' />";
	str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";
	$("#shivaDrawPaletteDiv").html(str);									// Fill div
	$("#shivaDrawPaletteDiv").on("click",onColorPicker);					// Mouseup listener
	this.colorPicker=name;													// Set var name
	var _this=this;															// Point to main obj
	
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
			_this.DrawMenu();												// Put up menu	
			return;															// Return
			}
		if (y > 193) 														// In trans area
			col=-1;															// Set -1
		else if (y > 48) {													// In color grid
			x=Math.floor((x-24)/17);										// Column
			y=Math.floor((y-51)/17);										// Row
			col="#"+cols[x+(y*8)];											// Get color
			}
		_this[_this.colorPicker]=col;										// Set color
		if (_this.curTool == 5) {											// If editing 
			if (_this.selectedItems.length)									// If something selected
				_this.DrawMenu(_this.segs[_this.selectedItems[0]].type);	// Draw menu with this as a type
			else															// Nothing
				_this.DrawMenu(0);											// Draw menu as pencil
			_this.SetVal(_this.colorPicker,col);							// Draw segments
			}
		else if (_this.curTool == 6) {										// If idea map 
			_this.SetVal(_this.colorPicker,col);							// Draw segments
			_this.DrawMenu();												// Draw idea menu 
			}
		else																// In drawing
			_this.DrawMenu();												// Put up menu	
	}
}

SHIVA_Draw.prototype.DrawMenu=function(tool) 							//	DRAW 
{
	var preface="Edit ";
	if (tool == undefined)
		tool=this.curTool,preface="Draw ";
	var titles=["a line","a circle","a box","text","an image",""," an Idea Map"];
	var str="<p style='text-shadow:1px 1px white' align='center'><b>";	str+=preface+titles[tool]+"</b></p>";
	str+="<img src='closedot.gif' style='position:absolute;left:163px;top:1px' onclick='drObj.SetTool(-1)'/>";
	str+="<table style='font-size:xx-small'>"
	if (tool < 3) {				// LINE, BOX, CIR
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='drObj.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		if (tool == 2)
			str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		else if (tool == 0) {
			str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
			str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td><input onClick='drObj.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";
			}		
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"edgeColor\")' onChange='drObj.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Fill color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"color\")' onChange='drObj.SetVal(\"color\",this.value)' type='text' id='color'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";
		}
	else if (tool == 3) {		// TEXT
		str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"boxColor\")' onChange='drObj.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='drObj.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='drObj.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Text size</td><td><div style='width:82px;margin-left:6px' id='textSize'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"textColor\")' onChange='drObj.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";
		}
	else if (tool == 4) {		// IMAGE
		str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='drObj.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"edgeColor\")' onChange='drObj.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";
		str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Image URL</td><td>&nbsp;<input style='width:85px;height:12px' onChange='drObj.SetVal(\"imageURL\",this.value)' type='text' id='imageURL'></td></tr>";
		}
	else if (tool == 6) {		// IDEA
		str+="<tr><td>&nbsp;&nbsp;Shape</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='drObj.SetVal(\"ideaShape\",this.value)' id='ideaShape'><option>Round box</option><option>Rectangle</option><option>Oval</option><option>Circle</option></select></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaBackCol\")' type='text' id='ideaBackCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Gradient?</td><td>&nbsp;<input onClick='drObj.SetVal(\"ideaGradient\",this.checked)' type='checkbox' id='ideaGradient'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaEdgeCol\")' onChange='drObj.SetVal(\"ideaEdgeCol\",this.value)' type='text' id='ideaEdgeCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='drObj.ColorPicker(\"ideaTextCol\")' onChange='drObj.SetVal(\"ideaTextCol\",this.value)' type='text' id='ideaTextCol'></td></tr>";
		str+="<tr><td>&nbsp;&nbsp;Bold text?</td><td>&nbsp;<input onClick='drObj.SetVal(\"ideaBold\",this.checked)' type='checkbox' id='ideaBold'></td></tr>";
		str+="<tr><td colspan='2' style='text-align:center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='font-size:x-small' onclick='drObj.AddIdea(-1)'>Add base idea</button></td></tr>";
		}
	str+="</table><br/>";	
	str+="<div style='position:absolute;left:14px;top:194px'><span id='drawToolbar' style='font-size:xx-small'>";
	str+="<input type='radio' id='sdtb6' name='draw' onclick='drObj.SetTool(5)'/><label for='sdtb6'>Select</label>";
	str+="<input type='radio' id='sdtb3' name='draw' onclick='drObj.SetTool(2)'/><label for='sdtb3'>Box</label>";
	str+="<input type='radio' id='sdtb2' name='draw' onclick='drObj.SetTool(1)'/><label for='sdtb2'>Circle</label>";
	str+="<input type='radio' id='sdtb1' name='draw' onclick='drObj.SetTool(0)'/><label for='sdtb1'>Line</label>";
	str+="<input type='radio' id='sdtb4' name='draw' onclick='drObj.SetTool(3)'/><label for='sdtb4'>A</label>";
	str+="<input type='radio' id='sdtb5' name='draw' onclick='drObj.SetTool(4)'/><label for='sdtb5'>Image</label>";
	str+="<input type='radio' id='sdtb7' name='draw' onclick='drObj.SetTool(6)'/><label for='sdtb7'>Idea</label>";
	str+="</span></div>";	
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

	$("#alpha").slider({slide:function(event, ui) {drObj.SetVal("alpha",ui.value);}});	
	$("#edgeWidth").slider({slide:function(event, ui) {drObj.SetVal("edgeWidth",ui.value);}});	
	$("#textSize").slider({slide:function(event, ui) {drObj.SetVal("textSize",ui.value);}});	
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
	$("#textSize").slider("value",this.textSize); 							// Set text size
	$("#textAlign").val(this.textAlign); 									// Set text align
	$("#imageURL").val(this.imageURL); 										// Set image url
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

SHIVA_Draw.prototype.SaveSVGData=function() 							// SAVE DRAWING AS SVG
{
	var i,j,o,x,y,e;
	var w=$("#shivaDrawDiv").width();										// Container wid
	var h=$("#shivaDrawDiv").height();										// Container hht
	var str="<svg width='100%' height='100%' viewBox='0 0 "+w+" "+h+"'>\n";	// Header
	for (i=0;i<drObj.segs.length;++i) {										// For each seg
		o=drObj.segs[i];													// Point at it
		e=Math.max((o.edgeWidth/10),.5);									// Edge is .5-10							 															
		if (o.type == 0) {													// Line
			if (o.arrow) {													// If an arrow tip												
				var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);			// Angle of line
				var xx=[],yy=[];											// Arrow arrays
				var n=o.x.length-1;											// Last point
				var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);			// Angle of line
				var hh=o.edgeWidth/2;										// Set size
				xx[0]=o.x[n]-hh*Math.cos(aa-Math.PI/6),
				yy[0]=o.y[n]-hh*Math.sin(aa-Math.PI/6);			
	 			xx[1]=o.x[n];	yy[1]=o.y[n];								// Tip point
				xx[2]=o.x[n]-hh*Math.cos(aa+Math.PI/6),
				yy[2]=o.y[n]-hh*Math.sin(aa+Math.PI/6);			
				o.x[n]=((xx[2]-xx[0])/2)+xx[0];								// Mid x
				o.y[n]=((yy[2]-yy[0])/2)+yy[0];								// Mid y
				}
			str+="<path style='fill:";										// Start
			if (o.color != -1)	str+=o.color+";";							// Fill color
			else				str+="none;"								// No fill
			if (o.edgeColor != -1)	 {										// If an edge
				str+="stroke:"+o.edgeColor;									// Edge color
				str+=";stroke-width:"+e+";";								// Edge width
				}
			str+="opacity:"+(o.alpha/100)+"' d='M";							// Alpha								
			str+=o.x[0]+",";												// Pos x
			str+=o.y[0]+" ";												// Pos y
			
			if (o.curve) {
				var open=true;
				if ((Math.abs(o.x[0]-o.x[o.x.length-1]) < 3) && (Math.abs(o.y[0]-o.y[o.y.length-1]) < 3)) {
					o.x[x.length-1]=o.x[0];
					o.y[y.length-1]=o.y[0];
					open=false;
					}
				x=o.x[0]-0+((o.x[1]-o.x[0])/2)-0;
				y=o.y[0]-0+((o.y[1]-o.y[0])/2)-0;
				if (open) {
					str+="L"+x+",";											// Pos x
					str+=y+" ";												// Pos y
			 		}			
				for (j=1;j<o.x.length-1;++j) {								// For each coord
					x=o.x[j]-0+((o.x[j+1]-o.x[j])/2)-0;						// Mid x										
					y=o.y[j]-0+((o.y[j+1]-o.y[j])/2)-0;						// Mid y										
					str+="Q";												// Line to
					str+=o.x[j]+",";										// Pos x
					str+=o.y[j]+" ";										// Pos y
					str+=x+",";												// Control x
					str+=y+" ";												// Control y
					}
				if (open) {
					str+="L"+o.x[j]+",";									// Pos x
					str+=o.y[j]+" ";										// Pos y
			 		}			
				}
			else{
				for (j=1;j<o.x.length;++j) {								// For each coord
					str+="L";												// Line to
					str+=o.x[j]+",";										// Pos x
					str+=o.y[j]+" ";										// Pos y
					}
				}
			if (o.color != -1)	str+="Z"									// If a filled polygon, close it
				str+="'/>\n";												// End rect
			if ((o.x) && (o.arrow)) {										// If line arrow
				o.x[n]=xx[1];	o.y[n]=yy[1];								// Restore last point
				str+="<path style='fill:"+o.edgeColor;						// Start
				str+=";opacity:"+(o.alpha/100)+"' d='M";					// Alpha								
				str+=xx[0];													// Start x				
				str+=","+yy[0]; 											// Start y
	 			str+=" L"+xx[1]+",";										// Tip x
	 			str+=yy[1];													// Tip y
				str+=" L"+xx[2]; 											// End x
				str+=","+yy[2];												// End y	
	 			str+=" Z'/>\n";												// End arrow
				}
			}
		else if (o.type == 1) {												// Box
			x=Math.abs(o.x[1]-o.x[0]);										// Calc wid
			str+="<circle r='"+x+"' ";										// Size
			x=o.x[0];														// Pos x
			y=o.y[0];														// Pos y
			str+="cx='"+x+"' cy='"+y+"' style='fill:";						// Pos
			if (o.color != -1)	str+=o.color+";";							// Fill color
			else				str+="none;"								// No fill
			if (o.edgeColor != -1)	 {										// If an edge
				str+="stroke:"+o.edgeColor;									// Edge color
				str+=";stroke-width:"+e+";";								// Edge width
				}
			str+="opacity:"+(o.alpha/100)+"'";								// Alpha								
			str+="/>\n";													// End rect
			}
		else if (o.type == 2) {												// Box
			x=Math.abs(o.x[1]-o.x[0]);										// Calc wid
			y=Math.abs(o.y[1]-o.y[0]);										// Hgt
			str+="<rect width='"+x+"' height='"+y+"' ";						// Size
			x=o.x[0];														// Pos x
			y=o.y[0];														// Pos y
			str+="x='"+x+"' y='"+y+"' style='fill:";						// Pos
			if (o.color != -1)	str+=o.color+";";							// Fill color
			else				str+="none;"								// No fill
			if (o.edgeColor != -1)	 {										// If an edge
				str+="stroke:"+o.edgeColor;									// Edge color
				str+=";stroke-width:"+e+";";								// Edge width
				}
			str+="opacity:"+(o.alpha/100)+"'";								// Alpha								
			if (o.curve)	str+=" rx='10' ry='10'";						// Round box
			str+="/>\n";													// End rect
			}
		else if (o.type == 3) {												// Text
			var th=(o.textSize/2)-0+10;										// Text size							 															
			if (o.boxColor != -1) {											// If a box
				x=Math.abs(o.x[1]-o.x[0]);									// Calc wid
				y=Math.abs(o.y[1]-o.y[0]);									// Hgt
				str+="<rect width='"+x+"' height='"+y+"' ";					// Size
				x=o.x[0];													// Pos x
				y=o.y[0];													// Pos y
				str+="x='"+x+"' y='"+y+"' style='fill:"+o.boxColor;			// Pos
				str+=";opacity:"+(o.alpha/100)+"'";							// Alpha								
				if (o.curve)	str+=" rx='10' ry='10'";					// Round box
				str+="/>\n";												// End rect
				}
			x=o.x[0]+10;													// Assume left
			e="start";
			if (o.textAlign == "Right")		x=o.x[1]-10,e="end";			// Right
			if (o.textAlign == "Center")	x=o.x[0]-0+Math.abs(o.x[1]-o.x[0])/2,e="middle";	// Center
			x=x;															// Pos x
			y=((o.y[0])+th+1);												// Pos y
			str+="<text x='"+x+"' y='"+y+"' ";								// Text pos
			str+="style='opacity:"+(o.alpha/100);							// Alpha
			str+=";text-anchor:"+e+";fill:"+o.textColor;					// Anchor / color
			str+=";font-family:sans-serif;font-size:"+th+"'>";				// Style							
			str+=o.text;													// String
			str+="</text>\n";												// End text
			}
		else if (o.type == 4) {												// Image
			x=Math.abs(o.x[1]-o.x[0]);										// Calc wid
			y=Math.abs(o.y[1]-o.y[0]);										// Hgt
			str+="<image width='"+x+"' height='"+y+"' ";					// Size
			x=o.x[0];														// Pos x
			y=o.y[0];														// Pos y
			str+="x='"+x+"' y='"+y+"' style='";								// Pos
			str+="opacity:"+(o.alpha/100)+"'";								// Alpha								
			str+=" xlink:href='"+o.imageURL+"'";							// Round box
			str+="/>\n";													// End image
			if (o.edgeColor != -1) {										// If a box
				x=Math.abs(o.x[1]-o.x[0]);									// Calc wid
				y=Math.abs(o.y[1]-o.y[0]);									// Hgt
				str+="<rect width='"+x+"' height='"+y+"' ";					// Size
				x=o.x[0];													// Pos x
				y=o.y[0];													// Pos y
				str+="x='"+x+"' y='"+y+"' style='";							// Pos
				str+="fill:none;stroke:"+o.edgeColor;						// Edge color
				str+=";stroke-width:"+e+";";								// Edge width
				str+=";opacity:"+(o.alpha/100)+"'";							// Alpha								
				str+="/>\n";												// End rect
				}
			}
		}
	str+="</g></svg>";														// Close svg
	return str;
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
		this.Sound("delete");												// Delete sound
		$("#shivaDrawDiv").css("cursor","auto");							// Regular cursor
		$("#shivaDrawDiv").css('pointer-events','none');					// Inibit pointer clicks if menu gone
		$("#shivaDrawPaletteDiv").remove();									// Close it
		if (shivaLib)														// If shivalib defined
			shivaLib.SendShivaMessage("ShivaDraw=done"); 					// Send EVA message
		}
	else																	
		this.Sound("click");												// Click sound
	
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
	if (drObj.curTool == 5) 												// In edit
		e.stopPropagation();												// Trap event
	drObj.leftClick=false;													// Left button up
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	if (e.shiftKey) {														// Shift key forces perpendicular lines
		if (Math.abs(x-drObj.lastX) > Math.abs(y-drObj.lastY))				// If mainly vertical
			y=drObj.lastY;													// Hold y
		else																// Mainly horizontal
			x=drObj.lastX;													// Hold x
		}
	if (drObj.closeOnMouseUp) {												// After a drag-draw
		drObj.closeOnMouseUp=false;											// Reset flag
		drObj.curSeg=-1;													// Close segment
		return true;														// Quit
		}
	if (drObj.curTool < 5 ) {												// Not in edit
		if (drObj.snap)														// If snapping
			x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);					// Mod down coords
		if ((drObj.curTool) && (e.target.id.indexOf("shtx") == -1))			// Not in line or over text
			drObj.AddDot(x,y,true);											// Add coord
		}
	else if (drObj.curTool > 4) 											// If in edit/idea map
		drObj.AddSelect(x,y,e.shiftKey);									// Select seg/dot
	return (drObj.curTool == 6);											// Set propagation
}

SHIVA_Draw.prototype.onMouseDown=function(e)							// MOUSE DOWN HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if (drObj.curTool == 6) 												// If in idea
		return true;														// Quit
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	drObj.leftClick=true;													// Left button down
	drObj.closeOnMouseUp=false;												// Reset flag
	if (drObj.snap)															// If snapping
		x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);						// Mod down coords
	if (drObj.curTool == 5) {												// In edit mode
		drObj.lastX=x;														// Save last X
		drObj.lastY=y;														// Y
		e.stopPropagation();												// Trap event
		return false;														// Quit
		}
	if (e.target.id.indexOf("shtx") != -1)									// If over text box
		return;																// Quit
	if (drObj.snap)															// If snapping
		x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);						// Mod down coords
	drObj.AddDot(x,y,false);												// Add coord
	return false;															// Stop propagation
}

SHIVA_Draw.prototype.onMouseMove=function(e)							// MOUSE MOVE HANDLER
{
	if ($("#shivaDrawPaletteDiv").length == 0) 								// If no palette
		return;																// Quit
	if ((drObj.curTool == 6) || (drObj.curTool == -1)) 						// If in idea or off
		return;																// Quit
	var x=e.pageX-this.offsetLeft;											// Offset X from page
	var y=e.pageY-this.offsetTop;											// Y
	if (drObj.snap)															// If snapping
		x=x-(x%drObj.snapSpan),y=y-(y%drObj.snapSpan);						// Mod down coords
	if ((drObj.leftClick) && (drObj.curTool == 5)) {						// If dragging seg in edit
		var dx=drObj.lastX-x;												// Delta x
		var dy=drObj.lastY-y;												// Y
		drObj.MoveSegs(dx,dy,0);											// Move selected segs	
		drObj.lastX=x;														// Save last X
		drObj.lastY=y;														// Y
		return;																// Quit
		}
	if (drObj.curSeg != -1) {												// If drawing
		if (drObj.curTool != 5) 											// If not in edit mode
			drObj.DrawOverlay();											// Draw overlay	
		if (e.shiftKey) {													// Shift key forces perpendicular lines
			if (Math.abs(x-drObj.lastX) > Math.abs(y-drObj.lastY))			// If mainly vertical
				y=drObj.lastY;												// Hold y
			else															// Mainly horizontal
				x=drObj.lastX;												// Hold x
			}
		if (drObj.curTool == 0)												// Polygon
			shivaLib.g.DrawLine(drObj.ctx,"#000",1,drObj.lastX,drObj.lastY,x,y,1); // Rubber line
		else if ((drObj.leftClick) && (drObj.curTool == 1))					// Circle
			shivaLib.g.DrawCircle(drObj.ctx,-1,1,drObj.lastX,drObj.lastY,Math.abs(x-drObj.lastX),"#999",1);	// Rubber circle
		else if ((drObj.leftClick) && (drObj.curTool < 5))					// Box, text, image
			shivaLib.g.DrawBar(drObj.ctx,-1,1,drObj.lastX,drObj.lastY,x,y,"#999",1); // Rubber box
		if ((drObj.leftClick) && (drObj.curTool == 0)){ 					// If dragging to draw
			if (new Date().getTime()-drObj.lastDotTime > 100)	{			// If not too close to last one
				drObj.AddDot(x,y);											// Add coord
				drObj.closeOnMouseUp=true;									// Close seg on mouse up
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
		if (drObj.selectedItems.length) {									// If something selected
			drObj.Sound("click");											// Play sound
			drObj.clipboard=[];												// Clear clipboard
			}	
		for (i=0;i<drObj.selectedItems.length;++i) 					
			drObj.clipboard.push(shivaLib.Clone(drObj.segs[drObj.selectedItems[i]]));
		}
	if ((e.which == 86) && (e.ctrlKey))	{									// Paste
		if (drObj.clipboard.length) {										// If something in clipboard
			drObj.selectedItems=[];											// Clear selects
			drObj.Sound("ding");											// Play sound
			for (i=0;i<drObj.clipboard.length;++i) {						// For each seg in clipboard				
				drObj.selectedItems.push(drObj.segs.length);				// Add to selects
				drObj.segs.push(shivaLib.Clone(drObj.clipboard[i])); 		// Add seg
				}
			}
		}	


	if (drObj.curTool == 6) {												// In idea mode
		num=drObj.selectedItems[0];											// Point at 1st select
		if (((e.which == 8) || (e.which == 46)) && (num != -1)) 			// If DEL and an active n
			drObj.DeleteIdea();												// Delete it
		}
	var num=drObj.curSeg;													// Point at currently drawn seg
	if (((e.which == 8) || (e.which == 46)) && (num != -1)) {				// If DEL and an active seg
		var o=drObj.segs[num];												// Point at seg
		o.x.pop();		o.y.pop();											// Delete last dot xy
		drObj.lastX=o.x[o.x.length-1];										// Set last x to end point
		drObj.lastY=o.y[o.y.length-1];										// Set last y to end point
		drObj.DrawOverlay();												// Redraw	
		drObj.Sound("delete");												// Play sound
		}
	if ((e.which == 27) && (num != -1))	{									// If ESC and an active seg
		drObj.curSeg=-1;													// End current seg, if open
		drObj.Sound("dclick");												// Play sound
		}
	else if (drObj.curTool == 5) {											// In edit mode
		if ((e.which == 8) || (e.which == 46)) {							// If DEL 
			if (drObj.selectedItems.length) {								// If DEL and some selected segs
				num=drObj.selectedItems[0];									// Point at 1st select
				if ((drObj.selectedDot != -1) && (drObj.segs[num].type == 0)) { // If a dot selected on a polygon
					drObj.segs[num].x.splice(drObj.selectedDot,1);			// Remove x dot
					drObj.segs[num].y.splice(drObj.selectedDot,1);			// Y
					}
				else if (e.target.id.indexOf("shtx") == -1)					// If not over text box remove whole segments(s)
					for (var i=0;i<drObj.selectedItems.length;++i) {		// For each selected element
						$("#shtx"+drObj.selectedItems[i]).remove();			// Delete text box, if any
						$("#shim"+drObj.selectedItems[i]).remove();			// Delete image box, if any
						drObj.segs.splice(drObj.selectedItems[i],1);		// Remove seg
						}


				drObj.DrawOverlay();										// Redraw	
				drObj.DrawWireframes(false);								// Draw wireframes
				drObj.Sound("delete");										// Play sound
				}
			}
	else if ((e.which == 40) && (e.shiftKey)) drObj.MoveSegs(0,0,-1);		// SH-Up to order up
	else if ((e.which == 38) && (e.shiftKey)) drObj.MoveSegs(0,0,1);		// SH-Dn to order down
	else if (e.which == 39)  drObj.MoveSegs(-1,0,0);						// Move L 
	else if (e.which == 37)  drObj.MoveSegs(1,0,0);							// Move R
	else if (e.which == 40)  drObj.MoveSegs(0,-1,0);						// Move U 
	else if (e.which == 38)  drObj.MoveSegs(0,1,0);							// Move D 
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
				drObj.Sound("dclick");										// Double-click
			}
		else{																// Whole seg
			$("#shivaDrawDiv").css("cursor","move");						// Move cursor
			drObj.Sound("click");											// Click
			}
		this.selectedItems.push(seg);										// Add seg to selects
		this.alpha=o.alpha;													// Everyone has alpha
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
				drObj.Sound("delete");										// Delete
				continue;													// Skip
				}
			oo=this.segs[this.selectedItems[i]+dz];							// Sve dest seg
			this.segs[this.selectedItems[i]+dz]=o;							// Move to dest
			this.segs[this.selectedItems[i]]=oo;							// Copy dest to src 
			this.selectedItems[i]+=dz;										// Dest is now selected one
			drObj.Sound("click");											// Click
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
	num=this.selectedItems[0]=this.segs.length;;							// Set select
	this.segs.push(o);														// Add idea
	this.Sound("ding");															// Ding sound
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
		var str="<div id='shivaIdeaAddBut' style='position:absolute;top:"+y+"px;left:"+x+"px'><img src='adddot.gif' title='Add child idea' onmouseup='drObj.AddIdea(0)'></div>"
		$(dd).append(str);													// Add add but
		}
}

SHIVA_Draw.prototype.DeleteIdea=function() 								//	DELETE IDEA NODE 
{
	if (!this.selectedItems.length)											// Nothing selected
		return;																// Quit
	num=this.selectedItems[0];												// Get index
	if (this.segs[num].ideaParent != -1) {									// If connected
		this.Sound("click");												// click sound
		this.segs[num].ideaParent=-1;										// Free float it
		}
	else{																	// Delete them
		this.selectedItems=[];												// Deselect
		$("#shivaIdea"+num).remove();										// Remove idea node
		this.segs.splice(num,1);											// Remove seg
		this.DeleteIdeaChildren(num);										// Remove children recursively
		this.Sound("delete");												// Delete sound
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
	this.Sound("ding");														// Ding sound
}