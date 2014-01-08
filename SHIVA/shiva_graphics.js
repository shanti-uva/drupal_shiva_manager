////////////////////////////////////////////////////////////////////////////////////////////////////
// SHIVA GRAPHICS
///////////////////////////////////////////////////////////////////////////////////////////////////
function SHIVA_Graphics() 																			// CONSTRUCTOR
{
	this.shadowOffX=this.shadowOffY=this.curShadowCol=this.curShadowBlur=0;	
	this.composite="source-over";
}

SHIVA_Graphics.prototype.CreateCanvas=function(id, con, wid, hgt, left, top) 						//	ADD NEW CANVAS
{
	var str="<canvas id='"+id+"' "; 
	if (wid) 	str+="width='"+wid+"px' "; 
	if (hgt) 	str+="height='"+hgt+"px' "; 
	str+="/>";
	var mc=$(str).appendTo("#"+con);
	if (left || top)	
		mc.style.position="absolute";
	if (left)	mc.style.left=left;
	if (top)	mc.style.top=top;
	return mc;
}

SHIVA_Graphics.prototype.DeleteCanvas=function(id) 													// DELETE CANVAS
{
	var mc=null;
	if (typeof(id) == "object")
		mc=id;
	else
		mc=document.getElementById(id);
	if (mc)
		document.body.removeChild(mc);
}

SHIVA_Graphics.prototype.Compositing=function(ctx,compositeMode, alpha) 							// COMPOSITING
{
	ctx.globalCompositeOperation=this.composite=compositeMode;										
	if (alpha != undefined)
		ctx.globalAlpha=this.alpha=alpha;										
}


SHIVA_Graphics.prototype.DrawBar=function(ctx, col, alpha, x1, y1, x2, y2, edgeCol, edgeWid) 		// DRAW RECTANGLE
{
 	ctx.globalAlpha=alpha;
	if (col != -1){	
 	 	ctx.fillStyle=col;
		ctx.fillRect(x1,y1,x2-x1,y2-y1);
		}	
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.strokeRect(x1,y1,x2-x1,y2-y1);
		}
}

SHIVA_Graphics.prototype.DrawRoundBar=function(ctx, col, alpha, x1, y1, x2, y2, rad, edgeCol, edgeWid) 	// DRAW ROUND RECTANGLE
{
	ctx.beginPath();
	ctx.globalAlpha=alpha;
	ctx.moveTo(x1+rad,y1);
	ctx.lineTo(x2-rad,y1);
	ctx.arcTo(x2,y1,x2,y1+8,rad);
	ctx.lineTo(x2,y2-rad);
	ctx.arcTo(x2,y2,x2-rad,y2,rad);
	ctx.lineTo(x1+rad,y2);
	ctx.arcTo(x1,y2,x1,y2-rad,rad);
	ctx.lineTo(x1,y1+rad);
	ctx.arcTo(x1,y1,x1+rad,y1,rad);
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawLine=function(ctx, col, alpha, x1, y1, x2, y2, edgeWid) 				// DRAW LINE
{	
 	ctx.beginPath();
 	ctx.globalAlpha=alpha;
   	ctx.lineWidth=edgeWid;
	ctx.strokeStyle=col;
	ctx.moveTo(x1,y1); 
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawRubberLine=function(ctx, x1, y1, x2, y2, edgeWid) 				// DRAW RUBBER LINE
{	
 	ctx.globalCompositeOperation="xor";
	ctx.beginPath();
 	ctx.globalAlpha=1;
   	ctx.lineWidth=1;
	ctx.strokeStyle="#000";
	ctx.moveTo(x1,y1); 
	ctx.lineTo(x2,y2);
	ctx.stroke();
	ctx.closePath();
	ctx.globalCompositeOperation="source-over";
}

SHIVA_Graphics.prototype.DrawRubberBox=function(ctx, x1, y1, x2, y2, edgeWid) 				// DRAW RUBBER LINE
{	
 	ctx.globalCompositeOperation="xor";
	ctx.beginPath();
 	ctx.globalAlpha=1;
   	ctx.lineWidth=1;
	ctx.strokeStyle="#000";
	ctx.strokeRect(x1,y1,x2-x1,y2-y1);
	ctx.globalCompositeOperation="source-over";
}

SHIVA_Graphics.prototype.DrawCircle=function(ctx, col, alpha, cx, cy, rad, edgeCol, edgeWid)		// DRAW CIRCLE
{
	ctx.beginPath();
  	ctx.arc(cx,cy,rad,0,Math.PI*2,false);
	ctx.globalAlpha=alpha;
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawWedge=function(ctx, col, alpha, cx, cy, rad, start, end, edgeCol, edgeWid)		// DRAW A PIE WEDGE
{
  	var span=end-start;
	if (!span)
		return;
	ctx.beginPath();
  	if (span < 360)
	  	ctx.moveTo(cx,cy);
  	ctx.arc(cx,cy,rad,(start/360)*Math.PI*2,(end/360)*Math.PI*2,false);
  	if (span < 360)
 	  	ctx.lineTo(cx,cy);
	ctx.globalAlpha=alpha;
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineCap="round";
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawTriangle=function(ctx, col, alpha, x, y, wid, dir)	 				// DRAW TRIANGLE
{
	var wid2=(wid*4.0/5.0)>>0;
 	ctx.beginPath();
 	ctx.globalAlpha=alpha;
  	ctx.fillStyle=col;
	if (dir == "up") {	
		ctx.moveTo(x,y-wid2);  
		ctx.lineTo(x+wid,y+wid2);	  
		ctx.lineTo(x-wid,y+wid2);	  
		ctx.lineTo(x,y-wid2);  
		}
	else if (dir == "right") {
		ctx.moveTo(x-wid2,y-wid);  
		ctx.lineTo(x+wid2,y);	  
		ctx.lineTo(x-wid2,y+wid);	  
		ctx.lineTo(x-wid2,y-wid);  
		}
	else if (dir == "down") {			
		ctx.moveTo(x-wid,y-wid2);  
		ctx.lineTo(x+wid,y-wid2);	  
		ctx.lineTo(x,y+wid2);	  
		ctx.lineTo(x-wid,y-wid2);  
		}
	else if (dir == "left") {			
		ctx.moveTo(x-wid2,y);  
		ctx.lineTo(x+wid2,y-wid);	  
		ctx.lineTo(x+wid2,y+wid);	  
		ctx.lineTo(x-wid2,y);  
		}
	ctx.fill();	
	ctx.closePath();
}

SHIVA_Graphics.prototype.DrawPolygon=function(ctx, col, alpha, x, y,  edgeCol, edgeWid, smooth)			// DRAW POLYGON
{
	var n=x.length;	
	ctx.beginPath();
   	ctx.moveTo(x[0],y[0]);
	ctx.globalAlpha=alpha;
	var open=true;
	if ((Math.abs(x[0]-x[x.length-1]) < 3) && (Math.abs(y[0]-y[y.length-1]) < 3)) {
		x[x.length-1]=x[0];
		y[y.length-1]=y[0];
		open=false;
		}
	if (smooth) {
		var x1=x[0]-0+((x[1]-x[0])/2)-0;
		var y1=y[0]-0+((y[1]-y[0])/2)-0;
		if (open)
			ctx.lineTo(x1,y1); 															
		for (i=1;i<n-1;++i) {														
			x1=x[i]-0+((x[i+1]-x[i])/2)-0;												
			y1=y[i]-0+((y[i+1]-y[i])/2)-0;												
				ctx.quadraticCurveTo(x[i],y[i],x1,y1); 											
			}
		if (open)
			ctx.lineTo(x[i],y[i]); 									 					
		}
	else
	  	for (i=0;i<n;++i)
		  	ctx.lineTo(x[i],y[i]);
	if (col != -1) {
	 	ctx.fillStyle=col;
		ctx.fill();
		}
	if (edgeWid) {
    	ctx.lineCap="round";
    	ctx.lineWidth=edgeWid;
		ctx.strokeStyle=edgeCol;
		if (col != -1)
		 	ctx.lineTo(x[0],y[0]);
		ctx.stroke();
		}
	ctx.closePath();
}

SHIVA_Graphics.prototype.SetShadow=function(ctx, offx, offy, blur, col, comp)	 						// SET SHADOW/COMPOSITION
{
	if (!offx) {
		offx=offy=blur=col=0;
		comp="source-over";
		}
	if (offx != undefined)		ctx.shadowOffsetX=offx;	
	if (offy != undefined)		ctx.shadowOffsetY=offy;	
	if (blur != undefined)		ctx.shadowBlur=blur;
	if (col  != undefined)		ctx.shadowColor=col;	
	if (comp != undefined)		ctx.globalCompositeOperation=comp;	
}

SHIVA_Graphics.prototype.AddGradient=function(ctx, id, x1, y1, x2, y2, col1, col2, r1, r2)	 			// ADD GRADIENT TO CANVAS
{
	if (!r1)
		ctx[id]=ctx.createLinearGradient(x1,y1,x2,y2);
	else
		ctx[id]=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);
	if (!col1)		col1="#000000";	
	if (!col2)		col2="#ffffff";	
	ctx[id].addColorStop(0,col1);
	ctx[id].addColorStop(1,col2);
}

SHIVA_Graphics.prototype.GetImage=function(ctx, file, left, top, wid, hgt)							// GET IMAGE
{
	var image=new Image();
	image.src=file;
	image.onload=function() {
		var asp=image.height/image.width;
		if (!wid && !hgt)
			wid=image.width,hgt=image.height
		else if (!wid && hgt)
			wid=hgt/asp;
		else if (wid && !hgt)
			hgt=wid*asp;
		ctx.drawImage(image,left,top,wid,hgt)
		}
	return image;
}

///////// EVENTS   //////////

SHIVA_Graphics.prototype.resolveID=function(id)															// CONVERT STRING ID TO DOM ID
{
	if (typeof(id) != "object")
		id=document.getElementById(id);
	return id;
}

SHIVA_Graphics.prototype.AddListener=function(id, eventType, handler) 									// ADD EVENT LISTENER
{	
	$("#"+id)[0].addEventListener(eventType,handler,false);
}

SHIVA_Graphics.prototype.RemoveListener=function(id, eventType, handler) 								// REMOVE EVENT LISTENER
{	
	this.resolveID(id).removeEventListener(eventType,handler,false);
}

SHIVA_Graphics.prototype.SetDrag=function(id, mode) 													// START/STOP DRAG
{
	id=$("#"+id);
	id.g=this;
	id.draggable=mode;	
	if (!mode)
		this.removeListener(id,'mousedown',dragDown);
	else
		this.addListener(id,'mousedown',dragDown)

	function dragDown(e) {
		if (!e.target.draggable)
			return
		e.target.dragX=e.pageX-e.target.style.left.slice(0,-2);
		e.target.dragY=e.pageY-e.target.style.top.slice(0,-2)
		e.target.g.addListener(e.target,'mousemove',dragMove)
		e.target.g.addListener(e.target,'mouseup',dragUp)
		e.target.inDrag=true;
		}
	function dragMove(e) {
		e.target.style.left=e.pageX-e.target.dragX;
		e.target.style.top=e.pageY-e.target.dragY;
		}
	function dragUp(e) {
		e.target.g.removeListener(e.target,'mousemove',dragMove)
		e.target.g.removeListener(e.target,'mouseup',dragUp)
		e.target.inDrag=false;
		}
}

///////// STRING   //////////

SHIVA_Graphics.prototype.SecsToTime=function(time, frameRate) 											// CONVERT MS TO TIMECODE
{				
	var timecode="";																
	if (!frameRate)
		frameRate=24;
	time/=1000;																		
	var mins=(time/60)>>0;																					
	var secs=(time%60)>>0;														
	var frms=((time-(secs+(mins*60)))*frameRate)>>0;							
	if (mins < 10)																	
		timecode+="0";															
	timecode+=mins+":";																				
	if (secs < 10)																
		timecode+="0";															
	timecode+=secs+":";																						
	if (frms < 10)																
		timecode+="0";															
	timecode+=frms;																							
	return timecode
}

SHIVA_Graphics.prototype.SetTextFormat=function(ctx, format) 									// SET TEXT FORMAT
{		
	var v=format.split(",");
	var pair,key,val;
	var bold="",ital="",font="",size="12";		
	for (var i=0;i<v.length;++i) {
		pair=v[i].split("=")
		key=pair[0];			val=pair[1];
		if (key == "align") 	ctx.textAlign=val;
		if (key == "color") 	ctx.fillStyle=val;
		if (key == "font")  	font=val;
		if (key == "size")  	size=val+"px";
		if (key == "bold")  	bold="bold";
		if (key == "italic")  	ital="italic";
		}
	if (font)	
		ctx.font=bold+" "+ital+" "+size+" "+font;
	return size.substring(0,size.length-2);
}

SHIVA_Graphics.prototype.DrawText=function(ctx, text, x, y, format) 							// DRAW TEXT
{		
	try {
		if (format)
			this.SetTextFormat(ctx,format);
		ctx.fillText(text,x,y);	
	} catch(e){};
}

