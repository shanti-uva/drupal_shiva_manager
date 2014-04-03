///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB SUBWAY
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.DrawSubway=function(oldItems) 											//	DRAW SUBWAY
{
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var g=this.g=new SHIVA_Graphics();
	var items=new Array();
	if (oldItems)
		items=oldItems;
	else
	   	for (var key in options) {
			if (key.indexOf("item-") != -1) {
				var o=new Object;
				var v=options[key].split(';');
				for (i=0;i<v.length;++i)
					o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				items.push(o);
				}
			}
	this.items=items;
	$(con).html("");
	g.CreateCanvas("subwayCanvas",container);
	var ctx=$("#subwayCanvas")[0].getContext('2d');
	$("#subwayCanvas").attr("width",options.cols*options.gridSize+30);
	$("#subwayCanvas").attr("height",options.rows*options.gridSize+30);
	$("#propInput8").val(options.cols*options.gridSize+30);
	$("#propInput7").val(options.rows*options.gridSize+30);
	$("#textLayer").remove();
	$(con).append("<div id='textLayer'></div>");
	ctx.clearRect(0,0,1000,1000);
	DrawBack();
	DrawTracks();
	DrawStations();
	DrawLegend();
	this.SendReadyMessage(true);											
	
	function DrawLegend()
	{
		var i,str;
		var x=Number(options.gridSize*5)+8;
		var y=Number(options.gridSize*options.rows);
		for (i=0;i<items.length;++i) 
			if (items[i].title) 
				y-=16;
		for (i=0;i<items.length;++i) 
			if ((items[i].title) && (items[i].visible != "false")) {
				g.DrawLine(ctx,"#"+items[i].lineCol,1,options.gridSize,y,x-8,y,items[i].lineWid);								
				str="<div style='position:absolute;left:"+x+"px;top:"+(y-6)+"px'>"+items[i].title;
				$("#textLayer").append(str+"</div>");
				y+=16;
				}
	}
	
	function DrawTracks()
	{
		var i,j,v,pts
		var xs=new Array();
		var ys=new Array();
		var gw=options.gridSize;
		for (i=0;i<items.length;++i) {
			if (items[i].visible == "false")
				continue;
			xs=[];	ys=[]
			if (!items[i].coords)
				continue;
			pts=items[i].coords.split(",");
			for (j=0;j<pts.length;++j) {
				v=pts[j].split(".");
				xs.push(v[0]*gw);	
				ys.push(v[1]*gw);	
				}
			g.DrawPolygon(ctx,-1,1,xs,ys,"#"+items[i].lineCol,items[i].lineWid,true);
			}
	}

	function DrawStations()
	{
		var pts,tp,align,link="",lab="";
		var i,j,x,y,y2,x2,w,w2,style,str,span;
		if (!options.stations)
			return;
		pts=options.stations.split("~");
		for (j=0;j<pts.length;++j) {
			v=pts[j].split("`");
			x2=x=Number(v[0])*Number(options.gridSize);
			y2=y=Number(v[1])*Number(options.gridSize);
			tp=v[2];
			style=v[3];
			lab=v[4];
			link=v[5]
			w=8;
			w2=w/2;
			if (style == "S")
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);								
			else if (style == "s")
				g.DrawCircle(ctx,"#fff",1,x,y,w*.7,"#000",w/4);								
			else if (style.charAt(0)== "i") {
				span=Number(style.charAt(1));
				x2=x+Number(span*options.gridSize);
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);				
				g.DrawCircle(ctx,"#fff",1,x2,y,w,"#000",w2);								
				g.DrawLine(ctx,"#fff",1,x,y,x2,y,w/2);								
				g.DrawLine(ctx,"#000",1,x+Number(w),y-w2,x2-w,y-w2,w2);								
				g.DrawLine(ctx,"#000",1,x+Number(w),y+w2,x2-w,y+w2,w2);								
				}
			else if (style.charAt(0)== "I") {
				span=Number(style.charAt(1));
				y2=y+Number(span*options.gridSize);
				g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);				
				g.DrawCircle(ctx,"#fff",1,x,y2,w,"#000",w2);								
				g.DrawLine(ctx,"#fff",1,x,y,x,y2,w/2);								
				g.DrawLine(ctx,"#000",1,x-w2,y+Number(w),x-w2,y2-w,w/2);								
				g.DrawLine(ctx,"#000",1,x+w2,y+Number(w),x+w2,y2-w,w/2);								
				}
			w=Number(options.gridSize);
			if (tp == "r") {	x2=x2+w-w2;				align='left';		y2=y+((y2-y)/2); }
			if (tp == "l") {	x2=x-200-w+w2;			align='right';		y2=y+((y2-y)/2); }
			if (tp == "t") {	x2-=((x2-x)/2)+100;		align='center';		y2=y-w+w2; 		 }
			if (tp == "b") {	x2-=((x2-x)/2)+100;		align='center';		y2=y2+w-w2; 	 }
			str="<div id='shivaSubtx"+j+"' style='position:absolute;color:#000;width:200px;left:"+x2+"px;top:"+(y2-6)+"px;text-align:"+align+"'>";
			if (link)
				str+="<a href='"+link+"' target='_blank' style='color:#000;text-decoration: none;'>"+lab+"</a>";
			else
				str+=lab;
			$("#textLayer").append(str+"</div>");
			$("#shivaSubtx"+j).click(function(){shivaLib.SendShivaMessage("ShivaSubway=click",this.id.substr(10))});
			if (tp == "t") 	
				$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()+4)+"px");
			else if ((tp == "r") || (tp == "l")) 	
				$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()/2)+"px");
			}
	}

	function DrawBack()
	{
		var gridSize=options.gridSize;
		var numRows=options.rows;
		var numCols=options.cols;
		ctx.textAlign="center";		
		if (!options.showGrid) {
			g.DrawRoundBar(ctx,"#"+options.backCol,1,0,0,numCols*gridSize,numRows*gridSize,options.backCorner);
			return;	
			}
		for (i=1;i<=numCols;++i) {
			g.DrawLine(ctx,"#cccccc",1,i*gridSize,gridSize,i*gridSize,numRows*gridSize,.5);
			g.DrawText(ctx,i,(i*gridSize),gridSize/2,"color=#999");
			}
		for (i=1;i<=numRows;++i) {
			g.DrawLine(ctx,"#cccccc",1,gridSize,i*gridSize,numCols*gridSize,i*gridSize,.5);
			g.DrawText(ctx,i,gridSize/2,(i*gridSize)+3,"color=#999");
			}
		}
}

