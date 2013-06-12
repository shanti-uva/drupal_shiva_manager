
function SHIVA_Show(container,options,editMode)
{this.drupalMan=false;this.inGo=false;this.options=null;this.map=null;this.player=null;this.timeLine=null;this.container=container;this.editMode=editMode;this.items=null;this.overlay=null;this.g=null;this.qe=null;this.ev=null;this.jit=null;this.cvs=null;this.group=null;this.msgAction=new Array();if(options)
this.Draw(options);}
SHIVA_Show.prototype.Draw=function(ops)
{if(!ops)
return;this.options=ops;this.LoadJSLib(ops.shivaGroup,$.proxy(function(){this.DrawElement(ops)},this))}
SHIVA_Show.prototype.DrawElement=function(ops)
{var _this=this;this.group=group=ops.shivaGroup;if(group=='Visualization')
this.DrawChart();else if(group=='Map')
this.DrawMap();else if(group=='Timeline')
this.DrawTimeline();else if(group=='Timeglider')
this.DrawTimeGlider();else if(group=='Control')
this.DrawControl();else if(group=='Video')
this.DrawVideo();else if(group=='Image')
this.DrawImage();else if(group=='Subway')
this.DrawSubway();else if(group=='Data')
this.DrawChart();else if(group=='Network')
this.DrawNetwork();else if(group=='Earth')
this.DrawEarth();else if(group=='Draw'){if(ops.width)$("#"+this.container).css("width",ops.width+"px");if(ops.height)$("#"+this.container).css("height",ops.height+"px");this.DrawOverlay();this.SendReadyMessage(true);}
else if(group=='Webpage')
this.DrawWebpage();else if(group=='WordCloud')
this.DrawWordCloud();else if(group=='Poster')
this.DrawPoster();if(ops["draw-1"])
this.AddOverlay();var ud=ops["ud"];if(ud=="true")ud=true;else if(ud=="false")ud=false;if((ud)&&(this.inGo)){var h=$("#"+this.container).css("height").replace(/px/g,"");var str="<img  id='shivaAnnotateBut' src='annotate.gif' style='position:absolute";str+=";top:"+(h-0+12)+"px'>";$("body").append(str);$("#shivaAnnotateBut").click(function(){_this.Annotate();});$("#shivaAnnotateBut").css('pointer-events','auto');}}
SHIVA_Show.prototype.LoadJSLib=function(which,callback)
{var i,obj,lib="";switch(which){case"Timeline":obj="Timeline.DefaultEventSource";lib="//api.simile-widgets.org/timeline/2.3.1/timeline-api.js?bundle=true";break;case"Timeglider":obj="timeglider";lib="timeglider-all.js";break;case"Video":obj="Popcorn.smart";lib="//popcornjs.org/code/dist/popcorn-complete.min.js";break;case"Image":obj="jQuery.prototype.adGallery";lib="jquery.ad-gallery.min.js";break;case"Network":obj="$jit.id";lib="jit-yc.js";break;case"Map":obj="google.maps.Map";lib="//maps.googleapis.com/maps/api/js?sensor=false&callback=shivaJSLoaded";break;case"WordCloud":obj="d3.layout.cloud";lib="d3_cloud_combined.js";}
if(lib){var v=obj.split(".");var n=v.length;var o=$(window)[0];for(i=0;i<n;++i)
if(!(o=o[v[i]]))
break;if(o&&(i==n)){callback();return;}
var head=document.getElementsByTagName('head')[0];var script=document.createElement('script');script.type="text/javascript";script.src=lib;script.onload=shivaJSLoaded(obj,callback);head.appendChild(script);}
else
callback();}
function shivaJSLoaded(obj,callback)
{var i;if(!obj)
return;var v=obj.split(".");var n=v.length;var o=$(window)[0];for(i=0;i<n;++i)
if(!(o=o[v[i]]))
break;if(o&&(i==n))
callback();else
setTimeout(function(){shivaJSLoaded(obj,callback);},50);}
SHIVA_Show.prototype.SendReadyMessage=function(mode)
{if(shivaLib.drupalMan)
window.parent.postMessage("ShivaReady="+mode.toString(),"*");}
SHIVA_Show.prototype.SendShivaMessage=function(msg)
{if(window.parent)
window.parent.postMessage(msg,"*");else
window.postMessage(msg,"*");}
SHIVA_Show.prototype.ShivaEventHandler=function(e)
{if(e=="init"){if(window.addEventListener)
window.addEventListener("message",shivaLib.ShivaEventHandler,false);else
window.attachEvent("message",shivaLib.ShivaEventHandler);return;}
if(!e.data)
return;for(var i=0;i<shivaLib.msgAction.length;++i)
if(e.data.indexOf(shivaLib.msgAction[i].id)!=-1)
shivaLib.msgAction[i].Do(i);if(e.data.indexOf("ShivaAct")!=-1){if(shivaLib.options.shivaGroup=="Map")
shivaLib.MapActions(e.data);else if(shivaLib.options.shivaGroup=="Earth")
shivaLib.EarthActions(e.data);else if(shivaLib.options.shivaGroup=="Video")
shivaLib.VideoActions(e.data);else if(shivaLib.options.shivaGroup=="Timeglider")
shivaLib.TimeActions(e.data);else if(shivaLib.options.shivaGroup=="Visualization")
shivaLib.ChartActions(e.data);else if(shivaLib.options.shivaGroup=="Image")
shivaLib.ImageActions(e.data);else if(shivaLib.options.shivaGroup=="Network")
shivaLib.NetworkActions(e.data);else if(shivaLib.options.shivaGroup=="WordCloud")
shivaLib.WordActions(e.data);}}
SHIVA_Show.prototype.AddOverlay=function()
{var key;this.overlay=new Array();this.DrawOverlay();for(key in this.options){if(key.match(/draw-/g))
this.AddOverlaySeg(this.options[key],false);}
$("#shivaDrawDiv").css('pointer-events','none');this.DrawOverlay();}
SHIVA_Show.prototype.AddOverlaySeg=function(seg,init)
{var i,key;if(!seg)
return;var o=new Object();if(!this.overlay)
this.overlay=new Array();if(!this.dr&&init){this.Draw({shivaGroup:"Draw"});this.dr=new SHIVA_Draw(this.container,true);}
var v=seg.split(';');for(i=0;i<v.length;++i){key=v[i].split(':')[0];o[key]=v[i].split(':')[1].replace(/\~/g,"#").replace(/\|/g,"\n").replace(/\`/g,":");if(o[key]=="true")o[key]=true;if(o[key]=="false")o[key]=false;}
if(o.x)o.x=o.x.split(",");if(o.y)o.y=o.y.split(",");this.overlay.push(o);}
SHIVA_Show.prototype.DrawOverlay=function()
{var o,i,col,ecol,ewid,a,cur,ctx,str,now,s=0,e=36000;var con="#"+this.container;if(!this.g)
this.g=new SHIVA_Graphics();var l=$(con).css("left");var t=$(con).css("top");if(l=="auto")l="0px";if(t=="auto")t="0px";i=$(con).css("height").replace(/px/g,"");if(this.player)
i=Math.max(0,i-=40);if(!$("#shivaDrawCanvas").length){str="<div id='shivaDrawDiv' style='position:absolute";str+=";width:"+$(con).css("width");str+=";top:"+t;str+=";left:"+l;str+=";height:"+i+"px'/>";$('body').append(str);this.g.CreateCanvas("shivaDrawCanvas","shivaDrawDiv");}
$("#shivaDrawCanvas").attr("width",$(con).css("width"));$("#shivaDrawCanvas").attr("height",i+"px");$("#shivaDrawDiv").css("left",l+"px");$("#shivaDrawDiv").css("top",t+"px");$("#shivaDrawDiv").css("width",$(con).css("width"));$("#shivaDrawDiv").css("height",i+"px");ctx=$("#shivaDrawCanvas")[0].getContext('2d');ctx.clearRect(0,0,1600,1600);if($.browser.msie)
$("#shivaDrawDiv").css("z-index",2);else
$("#shivaDrawDiv").css("z-index",2000);if($("#shivaDrawPaletteDiv").length)
$("#shivaDrawDiv").css('pointer-events','auto');else
$("#shivaDrawDiv").css('pointer-events','none');if(!this.overlay)
return;this.DrawIdeaLinks(false);for(i=0;i<this.overlay.length;++i){o=this.overlay[i];if(this.player){now=Math.floor(this.player.currentTime());if(o.s){v=o.s.split(":");if(v.length==1)
v[1]=v[0],v[0]=0;s=Number(v[0]*60)+Number(v[1]);}
if(o.e=="end")e=36000;else if(o.e){v=o.e.split(":");if(v.length==1)
v[1]=v[0],v[0]=0;e=Number(v[0]*60)+Number(v[1]);}
if((now<s)||(now>=e))
continue;}
$("#shtx"+i).remove();$("#shim"+i).remove();$("#shivaIdea"+i).remove();if(o.type==5){var dd="#shivaIdea"+i;str="<div id='"+dd.substr(1)+"'";str+="style='position:absolute;padding:8px;font-family:sans-serif;text-align:center;";str+="margin:0px;border:1px solid "+o.ideaEdgeCol+";background-color:"+o.ideaBackCol+";";str+="left:"+o.ideaLeft+"px;top:"+o.ideaTop+"px;'>";str+="</div>";$("#shivaDrawDiv").append(str);str="<textarea";if((shivaLib.dr)&&(shivaLib.dr.curTool!=6))
str+=" readonly='readonly'";str+=" id='shtx"+i+"' onchange='shivaLib.dr.SetShivaText(this.value,"+i+")' "
str+="style='overflow:hidden;vertical-align:middle;";if((!shivaLib.dr)||((shivaLib.dr)&&(shivaLib.dr.curTool!=6)))
str+="resize:none;";str+="height:"+o.ideaHgt+"px;width:"+o.ideaWid+"px;color:"+o.ideaTextCol+";"
if(o.ideaBold)
str+="font-weight:bold;";str+="background:transparent;border:none;margin:0px;padding:0px;font-family:sans-serif;text-align:center;'/>";$(dd).append(str);$("#shtx"+i).html(o.text);if(o.ideaShape=="Round box")
$(dd).css("border-radius","8px");else if(o.ideaShape=="Oval")
$(dd).css("border-radius",$(dd).css("height"));else if(o.ideaShape=="Circle"){var w=$(dd).width();$(dd).css("border-radius",(w/2+16)+"px");$(dd).css("height",w+"px");}
if(o.ideaGradient){if($.browser.mozilla)
$(dd).css("background","-moz-linear-gradient(top,#f0f0f0,"+o.ideaBackCol+")");else
$(dd).css("background","-webkit-linear-gradient(top, #f0f0f0 0%,"+o.ideaBackCol+" 100%)");}
if((shivaLib.dr)&&(shivaLib.dr.curTool==6)){$("#shtx"+i).resizable({stop:function(event,ui){var num=ui.originalElement[0].id.substr(4);shivaLib.dr.segs[num].ideaWid=ui.size.width-4;shivaLib.dr.segs[num].ideaHgt=ui.size.height-4;}});$(dd).draggable({drag:function(event,ui){var num=this.id.substr(9);var dx=ui.position.left-shivaLib.dr.segs[num].ideaLeft;var dy=ui.position.top-shivaLib.dr.segs[num].ideaTop;shivaLib.dr.segs[num].ideaLeft=ui.position.left;shivaLib.dr.segs[num].ideaTop=ui.position.top;shivaLib.dr.segs[num].ideaText=$("#"+this.id).val();shivaLib.dr.MoveIdeaChildren(num,dx,dy);shivaLib.DrawIdeaLinks(true);},containment:"parent",stop:function(event,ui){shivaLib.dr.DrawOverlay();}});$(dd).droppable({drop:function(event,ui){var from=ui.draggable.context.id.substr(9);var to=event.target.id.substr(9);shivaLib.dr.IdeaDrop(from,to);}});}
continue;}
cur=o.curve;col=o.color;ecol=o.edgeColor;ewid=Math.floor(o.edgeWidth/10)+1;a=Number(o.alpha)/100;if(o.edgeColor==-1)ewid=0;if((o.x)&&(o.x.length<2))
continue;if(o.type==1)
this.g.DrawCircle(ctx,o.color,a,o.x[0],o.y[0],Math.abs(o.x[0]-o.x[1]),ecol,ewid);else if(o.type==2){if(o.curve)
this.g.DrawRoundBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);else
this.g.DrawBar(ctx,o.color,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);}
else if(o.type==3){if(o.curve)
this.g.DrawRoundBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],12,ecol,ewid);else
this.g.DrawBar(ctx,o.boxColor,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);str="<text";if($("#shivaDrawPaletteDiv").length)
str+="area rows='8'";str+=" id='shtx"+i+"' ";str+="style='position:absolute;background:transparent;border:none;margin:8px;font-family:sans-serif;overflow:auto;";str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;opacity:"+(o.alpha/100)+";";str+="width:"+(Math.abs(o.x[1]-o.x[0])-18)+"px;height:"+Math.abs(o.y[1]-o.y[0]-18)+"px'/>";$("#shivaDrawDiv").append(str);$("#shtx"+i).css("color",o.textColor).css("text-align",o.textAlign.toLowerCase());$("#shtx"+i).css("font-size",Number(o.textSize)+12);$("#shtx"+i).html(o.text);$("#shtx"+i).bind("change input propertychange",function(e){var i=e.target.id.substr(4);var val=$("#shtx"+i).val();shivaLib.dr.SetShivaText(val,i);});}
else if(o.type==4){this.g.DrawBar(ctx,-1,a,o.x[0],o.y[0],o.x[1],o.y[1],ecol,ewid);str="<div id='shim"+i+"' style='position:absolute;background:transparent;opacity:"+(o.alpha/100)+";";w=Math.abs(o.x[1]-o.x[0]);h=Math.abs(o.y[1]-o.y[0]);str+="left:"+Math.min(o.x[0],o.x[1])+"px;top:"+Math.min(o.y[0],o.y[1])+"px;";str+="width:"+(w-16)+"px;height:"+h+"px'>";str+="<img id=shimi"+i+" src='"+o.imageURL+"' width='"+w+"'/>";$("#shivaDrawDiv").append(str);}
else if((o.x)&&(o.x.length==2)&&(!o.arrow))
this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);else if((o.x)&&(!o.arrow))
this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur==true));if((o.x)&&(o.type==0)&&(o.arrow)){var xx=[],yy=[];var n=o.x.length-1;var aa=Math.atan2(o.y[n]-o.y[n-1],o.x[n]-o.x[n-1]);var h=Math.max(12,ewid*4);xx[0]=o.x[n]-h*Math.cos(aa-Math.PI/6),yy[0]=o.y[n]-h*Math.sin(aa-Math.PI/6);xx[1]=o.x[n];yy[1]=o.y[n];xx[2]=o.x[n]-h*Math.cos(aa+Math.PI/6),yy[2]=o.y[n]-h*Math.sin(aa+Math.PI/6);this.g.DrawPolygon(ctx,ecol,a,xx,yy,ecol,0,false);o.x[n]=((xx[2]-xx[0])/2)+xx[0];o.y[n]=((yy[2]-yy[0])/2)+yy[0];if(o.x.length==2)
this.g.DrawPolygon(ctx,-1,a,o.x,o.y,ecol,Math.max(ewid,2),false);else
this.g.DrawPolygon(ctx,o.color,a,o.x,o.y,ecol,ewid,(cur==true));o.x[n]=xx[1];o.y[n]=yy[1];}}
if((shivaLib.dr)&&(shivaLib.dr.curTool==6))
$.proxy(shivaLib.dr.HighlightIdea(),shivaLib.dr);}
SHIVA_Show.prototype.DrawIdeaLinks=function(clear)
{var i,o,fx,fy,tx,ty;var ctx=$("#shivaDrawCanvas")[0].getContext('2d');if(clear)
ctx.clearRect(0,0,1600,1600);for(i=0;i<this.overlay.length;++i){o=this.overlay[i];if((o.type!=5)||(o.ideaParent==-1))
continue;dleftToRight=leftToRight=true;dir2=dir=2;tx=o.ideaLeft-0+(o.ideaWid/2+8);ty=o.ideaTop-0+(o.ideaHgt/2)+12;o=this.overlay[o.ideaParent];fx=o.ideaLeft-0+(o.ideaWid/2+8);fy=o.ideaTop-0+(o.ideaHgt/2+12);if(tx<fx)
dleftToRight=leftToRight=false;var x=[fx,tx];var y=[fy,ty];this.g.DrawPolygon(ctx,-1,.75,x,y,"#666",1,true);}}
SHIVA_Show.prototype.Resize=function(wid)
{if(this.options){if(this.options.width){if(this.options.width!=wid){var asp=1.0;if(this.options.height)
asp=this.options.height/this.options.width;this.options.width=wid;this.options.height=wid*asp;this.DrawElement(this.options);return true;}}}
return false;}
SHIVA_Show.prototype.SetLayer=function(num,mode,type)
{var i;var group=this.options.shivaGroup;if(this.items){if(type=="GoTo"){for(i=0;i<this.items.length;++i){if(this.items[i].layerType=="GoTo")
this.items[i].visible="false";}}
if(this.items[num])
this.items[num].visible=mode.toString();}
if(group=="Map")
this.DrawMapOverlays();else if(group=="Earth")
this.DrawEarthOverlays();else if(group=="Subway")
this.DrawSubway();else if(group=="Timeline")
this.DrawTimeline();else if(group=="Poster")
this.GoToPosterPane(num);}
SHIVA_Show.prototype.FillElement=function(table,query)
{var group=this.options.shivaGroup;if(group=="Visualization"){this.map.setDataSourceUrl(table);if((query)&&(query!="NO CONDITIONS SET")){var v=query.split(" ");for(i=0;i<v.length;++i){if(v[i]=="has"){v[i++]="LIKE";v[i]="'%"+v[i]+"%'";}}
query="";for(i=0;i<v.length;++i)
query+=v[i]+" ";this.map.setQuery(query);}
this.map.draw();}
else if(group=="Dialog"){}}
SHIVA_Show.prototype.Annotate=function(x,y)
{if(!this.dr){this.Draw({shivaGroup:"Draw"});this.dr=new SHIVA_Draw(this.container);}
else this.dr.DrawPalette();if(x!=undefined){$("#shivaDrawPaletteDiv").css("left",x+"px");$("#shivaDrawPaletteDiv").css("top",y+"px");}
this.Sound("click");}
SHIVA_Show.prototype.DrawWebpage=function()
{$("#"+this.container+"IF").remove();var h=this.options.height;var w=this.options.width;if(!isNaN(h))h+="px";if(!isNaN(w))w+="px";h=h.replace(/%25/,"%");w=w.replace(/%25/,"%");$("#"+this.container).css("height",h);$("#"+this.container).css("width",w);var str="<iframe src='"+this.options.url+"' id='"+this.container+"IF' style='";str+="width:"+w+";height:"+h+"'>";$("#"+this.container).append(str);this.SendReadyMessage(true);}
SHIVA_Show.prototype.DrawChart=function()
{var i=0,array,val;var ops=new Object();var options=this.options;var container=this.container;var con="#"+container;var _this=this;for(o in options){val="";if(options[o]){val=options[o].toString();val=ops[o]=val.replace(/~/g,"#")}
if((val.indexOf(",")!=-1)&&(o!="query")&&(o!="title")){if(val){array=true;if(val.indexOf('=')==-1)
ops[o]=new Array();else{ops[o]=new Object();array=false;}
var pairs=val.split(',');for(j=0;j<pairs.length;++j){if(!pairs[j])
continue;if(array)
ops[o].push(pairs[j].replace(/ /g,""));else{v=pairs[j].split("=");if(o=="options")
ops[v[0]]=v[1].replace(/ /g,"");else if(v[0].indexOf(".")!=-1){ops[o][v[0].split(".")[0]]={};ops[o][v[0].split(".")[0]][v[0].split(".")[1]]=v[1];}
else
ops[o][v[0]]=v[1];}}}}
if(ops[o]=='true')ops[o]=true;if(ops[o]=='false')ops[o]=false;}
if(options['width'])$(con).width(options['width']);if(options['height'])$(con).height(options['height']);ops.containerId=this.container;if(!ops.colors)delete ops.colors;if(ops.dataSourceUrl){ops.dataSourceUrl=""+ops.dataSourceUrl.replace(/\^/g,"&");if(ops.dataSourceUrl.toLowerCase().indexOf(".csv")!=-1){ops.dataTable=CSV(ops.dataSourceUrl,"hide","JSON");ops.dataDataSourceUrl="";}}
if(ops.query){var v=ops.query.split(" ");for(i=0;i<v.length;++i){if(v[i]=="has"){v[i++]="LIKE";v[i]="'%"+v[i]+"%'";}}
ops.query="";for(i=0;i<v.length;++i)
ops.query+=v[i]+" ";}
if(options.series){var v=options.series.split(",")
ops.series=new Array();var o={};for(i=1;i<v.length;++i){if(!isNaN(v[i]))
ops.series.push(o),o={};else
o[v[i].split("=")[0]]=v[i].split("=")[1];}
ops.series.push(o);}
var wrap=new google.visualization.ChartWrapper(ops);this.map=wrap;wrap.setOptions(ops);wrap.draw();google.visualization.events.addListener(wrap,"ready",function(){_this.SendReadyMessage(true);});google.visualization.events.addListener(wrap,"select",function(r){var o=wrap.getChart().getSelection()[0];var row="-",col="-";if((o)&&(o.row!=undefined))
row=o.row;if((o)&&(o.column!=undefined))
col=o.column;_this.SendShivaMessage("ShivaChart=data|"+window.name+"|"+row+"|"+col);});}
SHIVA_Show.prototype.ChartActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100"){$("#containerDiv").width("100%");$("#containerDiv").height("100%");shivaLib.map.setOption("width","100%");shivaLib.map.setOption("height","100%");}
shivaLib.map.draw();}
else if(v[0]=="ShivaAct=data"){var data=google.visualization.arrayToDataTable($.parseJSON(v[1]));shivaLib.map.setDataTable(data);shivaLib.map.draw();}}
SHIVA_Show.prototype.Sound=function(sound,mode)
{var snd=new Audio();if(!snd.canPlayType("audio/mpeg"))
snd=new Audio(sound+".ogg");else
snd=new Audio(sound+".mp3");if(mode!="init")
snd.play();}
SHIVA_Show.prototype.GetGoogleSpreadsheet=function(file,callback)
{var query=new google.visualization.Query(file);query.send(handleQueryResponse);function handleQueryResponse(response){var i,j,o;var data=response.getDataTable();var cols=data.getNumberOfColumns();var rows=data.getNumberOfRows();var keys=new Array();var theData=new Array();for(i=0;i<cols;++i){if(!$.trim(data.getColumnLabel(i)))
break;keys.push($.trim(data.getColumnLabel(i)));}
for(i=0;i<rows;++i){o={};for(j=0;j<keys.length;++j)
o[keys[j]]=data.getValue(i,j);theData.push(o);}
callback(theData);}}
SHIVA_Show.prototype.ShowIframe=function(left,top,wid,hgt,url,id,mode,content)
{$("#"+id).remove();$("#CL-"+id).remove();if((hgt==0)||(wid==0))
return;var str="<iframe id='"+id+"' ";if(url)
str+="src='"+url+"' ";str+="style='position:absolute;";if(mode=="black")
str+="border:none;background:black;"
else if(mode=="transparent")
str+="border:none;background:transparent;"
else
str+="background:white;"
str+="width:"+(wid+2)+"px;height:"+(hgt+2)+"px;left:"+left+"px;top:"+top+"px;'";if(mode=="black")
str+=" scrolling='no'";else if(mode=="transparent")
str+=" allowtransparency='true'";$("body").append(str+"></iframe>");str="<iframe marginwidth='0' marginheight='0' src='closedot.gif' id='CL-"+id+"' style='position:absolute;margin:0px;padding:0px;border:none;";str+="width:17px;height:18px;left:"+(wid-13+left)+"px;top:"+(top+3)+"px'/>";if(mode!="black")
$("body").append(str);$("#"+id).bind("load",function(e){if(content)
this.contentWindow.document.body.innerHTML=content;});$("#CL-"+id).bind("load",function(e){this.contentWindow.document.body.onclick=function(e){shivaLib.Sound("delete");$("#"+id).remove();$("#CL-"+id).remove();}});}
SHIVA_Show.prototype.ShowLightBox=function(width,top,title,content)
{var str;str="<div id='shivaLightBoxDiv' style='position:fixed;width:100%;height:100%;";str+="background:url(overlay.png) repeat;top:0px;left:0px';</div>";$("body").append(str);str="<div id='shivaLightBoxIntDiv' style='position:absolute;padding:10px;width:";if(width!="auto")
str+=Math.abs(width)+"px";else
width=400;var x=($("#shivaLightBoxDiv").width()-width)/2;if(width<0){x=$("#"+this.container).css("left").replace(/px/,"");x=x-0+$("#"+this.container).width()/2+(width/2);}
str+=";border-radius:12px;moz-border-radius:12px;z-index:2003;"
str+="border:1px solid; left:"+x+"px;top:"+top+"%;background-color:#f8f8f8'>";str+="<img src='shivalogo32.png' style='vertical-align:-30%'/>&nbsp;&nbsp;";str+="<span style='font-size:large;text-shadow:1px 1px #ccc'><b>"+title+"</b></span>";str+="<div id='shivaLightContentDiv'>"+content+"</div>";$("#shivaLightBoxDiv").append(str);$("#shivaLightBoxDiv").css("z-index",2500);}
SHIVA_Show.prototype.Prompt=function(title,message,def,id)
{var ops={width:'auto',height:'auto',modal:true,autoOpen:true,title:title,buttons:{OK:function(){$("#"+id).val($("#shiva_dialogInput").val());$(this).remove();},CANCEL:function(){$(this).remove();}}}
var str="<br/><b>"+message+"</b><br/><br/>";str+="<input type='input' size='23' id='shiva_dialogInput' value='"+def+"'/>";$("body").append("<div id='shiva_dialogDiv'/>");$("#shiva_dialogDiv").dialog(ops);$("#shiva_dialogDiv").html(str);}
SHIVA_Show.prototype.MakeSelect=function(id,multi,items,sel,extra)
{var str="<select id='"+id+"'";if(multi)
str+="multiple='multiple' size='"+multi+"'";if(extra)
str+=extra;str+=">";for(i=0;i<items.length;++i){str+="<option";if(sel==items[i])
str+=" selected='selected'"
str+=">"+items[i]+"</option>";}
return str+"</select>"}
SHIVA_Show.prototype.GetTextFile=function(file,callback)
{var syncMode=false;if(file.charAt(0)=="@")
file="proxy.php?url="+file.substr(1);xmlhttp=new XMLHttpRequest();if(callback){syncMode=true;xmlhttp.onload=function(e){callback(e.target.responseText);}}
xmlhttp.open("GET",file,syncMode);xmlhttp.send();return(xmlhttp.responseText);}
SHIVA_Show.prototype.ConvertDateToJSON=function(dateTime)
{var mos=new Array("","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec");var v=String(dateTime).split('/');if(v.length==2)
return(mos[v[0]]+" "+v[1]);else if(v.length==3)
return(mos[v[0]]+" "+v[1]+" "+v[2]);return v[0];}
SHIVA_Show.prototype.ArrayToString=function(jsonArray)
{var i,o,oo,str="[",key,val;for(i=0;i<jsonArray.length;++i){str+="{";o=jsonArray[i];for(key in o){val=o[key];str+="\""+key+"\":";if(typeof(o[key])=="object"){str+="{";oo=o[key];for(key in oo){str+="\""+key+"\":";val=oo[key];str+="\""+val+"\",";}
str=str.substr(0,str.length-1)+"\t},";}
else
str+="\""+val+"\",";}
str=str.substr(0,str.length-1);if(i!=jsonArray.length-1)str+="},\n";else str+="}]";}
return str;}
SHIVA_Show.prototype.Clone=function(obj)
{var i;if(null==obj||"object"!=typeof obj)return obj;else if(obj instanceof Array){var copy=[];for(i=0;i<obj.length;++i)
copy[i]=this.Clone(obj[i]);return copy;}
else if(obj instanceof Object){var copy={};for(var attr in obj)
if(obj.hasOwnProperty(attr))
copy[attr]=this.Clone(obj[attr]);return copy;}}
SHIVA_Show.prototype.EasyFile=function(_data,callback,type)
{var i,email="",w=350;var v=document.cookie.split(';');for(var i=0;i<v.length;i++)
if(v[i].indexOf("ez-email=")!=-1)
email=v[i].substr(9);var str="<br/>Use <b>eStore</b> to save and load projects under your email address. When saving, type a title when asked and when loading, choose a project from a list of your saved projects.<br/>"
str+="<br/><table id='ez-maintbl' cellspacing=0 cellpadding=0 style='font-size:small'>";str+="<tr><td width='25%'>Email</td><td><input type='text' id='email' size='40' value='"+email+"'/></td></tr>";str+="</table><div align='right' style='font-size:x-small'><br/>";if(type!="all")
str+=" <button id='saveBut'>Save</button>";str+=" <button id='loadBut'>Load</button>";if(type!="all")
str+=" <button id='linkBut'>Link</button>";str+=" <button id='cancelBut'>Cancel</button></div>";if((type=="KML")||(this.group=="Earth")){w=-400;$("#containerDiv").height($("#containerDiv").height()/100);}
this.ShowLightBox(w,20,"SHIVA eStore",str)
$("#cancelBut").button().click(function(){$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});$("#saveBut").button().click(function(){var _email=$("#email").val();var _title=$("#ez-title").val();var _type=type;if(!_email){alert("Please type your email");return;}
if(((_email.toLowerCase()=="samples")&&(_email!="SaMpLeS"))||((_email.toLowerCase()=="canvas")&&(_email!="CaNvAs"))){alert("Sorry, but you can't save using this name");return;}
if(!$("#ez-title").length){str="<tr><td>Title</td><td><input type='text' size='40' id='ez-title'/></td></tr>";$(str).appendTo("#ez-maintbl tbody");$("#ez-title").focus();return;}
if(!_title){alert("Please type title to save under");return;}
document.cookie="ez-email="+_email;$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);str="\",\n\t\"shivaTitle\": \""+_title+"\"\n}";if((type!="Canvas")&&(type!="KML"))
_data=_data.substr(0,_data.lastIndexOf("\""))+str;$.post("http://www.primaryaccess.org/REST/addeasyfile.php",{email:_email,type:_type,title:_title,data:_data.replace(/'/g,"\\'")});});$("#loadBut").button().click(function(){email=$("#email").val();if(!email){alert("Please type your email");return;}
document.cookie="ez-email="+email;var dat={email:email};if(type!="all")
dat["type"]=type;str="http://www.primaryaccess.org/REST/listeasyfile.php";shivaLib.ezcb=callback;shivaLib.ezmode="load";$.ajax({url:str,data:dat,dataType:'jsonp'});});$("#linkBut").button().click(function(){email=$("#email").val();if(!email){alert("Please type your email");return;}
document.cookie="ez-email="+email;var dat={email:email};if(type!="all")
dat["type"]=type;str="http://www.primaryaccess.org/REST/listeasyfile.php";shivaLib.ezcb="";shivaLib.ezmode="link";$.ajax({url:str,data:dat,dataType:'jsonp'});});}
SHIVA_Show.prototype.ShowEasyFile=function(files,callback,mode)
{var i;var str="<br/><div style='overflow:auto;overflow-x:hidden;height:200px;font-size:x-small;padding:8px;border:1px solid #cccccc'>";str+="<table id='ezFilesTable' cellspacing=0 cellpadding=4><tr><td></td></tr></table></div>";$("#shivaLightContentDiv").html(str);str="<div align='right' style='font-size:x-small'><br>Show only with this in title: <input type='text' size='10' id='ezFileFilter'/>";str+=" <button id='cancelBut'>Cancel</button></div>";$("#shivaLightContentDiv").append(str);$("#cancelBut").button().click(function(){$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});this.MakeEasyFileList(files,"",callback,mode);$("#ezFileFilter").keyup($.proxy(function(){var filter=$("#ezFileFilter").val();$("#ezFilesTable tbody").empty();this.MakeEasyFileList(files,filter,callback,mode);},this));}
SHIVA_Show.prototype.MakeEasyFileList=function(files,filter,callback,mode)
{var i,str,type;files.sort(function(a,b){var A=new Date(a.created.substr(0,5)+"/2012 "+a.created.substr(6));var B=new Date(b.created.substr(0,5)+"/2012 "+b.created.substr(6));return B-A;});for(i=0;i<files.length;++i){if((filter)&&(files[i].title.toLowerCase().indexOf(filter.toLowerCase())==-1))
continue;str="<tr id='ezfile-"+files[i].id+"'><td>"+files[i].created.replace(/ /,"&nbsp")+"</td>";str+="<td width='100%'><img  src='adddot.gif'  height='11'> &nbsp;";str+=files[i].id+" "+files[i].title+"</td></tr>";$(str).appendTo("#ezFilesTable tbody");$("#ezFilesTable tr:odd").addClass("odd");}
for(i=0;i<files.length;++i){type=files[i].type;$("#ezfile-"+files[i].id).click(function(){if((mode=="link")&&(type=="KML"))
alert("http://www.primaryaccess.org/REST/getkml.php?id="+this.id.substr(7));if((mode=="link")&&(type!="KML"))
alert("www.viseyes.org/shiva/go.htm?e="+this.id.substr(7));else{var dat={id:this.id.substr(7)};str="http://www.primaryaccess.org/REST/geteasyfile.php";shivaLib.ezcb=callback;shivaLib.ezmode=this.id.substr(7);$.ajax({url:str,data:dat,dataType:'jsonp'});}
$("#shivaLightBoxDiv").remove();if($("#containerDiv").height()<10)
$("#containerDiv").height($("#containerDiv").height()*100);});}}
function easyFileListWrapper(data)
{shivaLib.ShowEasyFile(data,shivaLib.ezcb,shivaLib.ezmode);}
function easyFileDataWrapper(data)
{if(!data["Element-0"])
data.shivaId=Number(shivaLib.ezmode);shivaLib.ezcb(data);}
SHIVA_Graphics.prototype.EnumObject=function(obj)
{trace("------------------------------------------------------------");for(var key in obj)
trace(key+"="+obj[key])}
function trace(msg,p1,p2,p3)
{if(p3)
console.log(msg,p1,p2,p3);else if(p2)
console.log(msg,p1,p2);else if(p1)
console.log(msg,p1);else
console.log(msg);}
SHIVA_Draw.prototype.isTouchDevice=function()
{var el=document.createElement('div');el.setAttribute('ongesturestart','return;');if(typeof el.ongesturestart=="function")
return true;else
return false;}
SHIVA_Show.prototype.SaveData=function(mode,style,items,props,type)
{var i,j,k,o,str1;var ovr=""
var itemStart;var str="{\n";$('#formatter').val(0)
var atts=new Array();for(o in props)
atts.push(o);if(items){for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
itemStart=i;for(j=0;j<items.length;++j)
for(k=itemStart+1;k<atts.length;++k)
items[j][atts[k]]=$("#itemInput"+j+"-"+(k-i)).val();}
if((mode=='JSON')||(mode=="GetJSON")||(mode=="Canvas")||(mode=="eStore")){if(items&&items.length){for(i=0;i<items.length;++i){str+="\t\"item-"+(i+1)+"\": \"";for(k=itemStart;k<atts.length;++k){str1=items[i][atts[k]];if(str1){if((props[atts[k]])&&(props[atts[k]].opt=="list"))
str1=str1.replace(/\n/g,"<br/>").replace(/\r/g,"").replace(/\:/g,"`");else
str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");}
str+=atts[k]+":"+str1+";";}
str=str.substring(0,str.length-1)+"\",\n";}
if(!this.overlay)
str=str.substring(0,str.length-3)+"\",\n";}
if(this.overlay)
str+=this.dr.SaveDrawData(true);if(this.ev&&this.ev.events.length){var group=this.options.shivaGroup;str+="\"shivaEvents\": "+this.ArrayToString(this.ev.events,group)+",\n";}
var j=0;if(type)
str+="\t\"chartType\": \""+type+"\",\n";for(o in props){if(o=="item")
break;str1=$("#propInput"+(j++)).val();if((props[o].opt=="list")&&(str1))
str1=str1.replace(/\n/g,",").replace(/\r/g,"");str+="\t\""+o+"\": \""+str1+"\",\n";}
d=new Date().toUTCString();str+="\t\"shivaMod\": \""+d.substring(0,d.length-13)+"\",\n";str+="\t\"shivaGroup\": \""+style+"\"\n}";if(mode=='Canvas'){window.parent.document.getElementById("shivaCan").contentWindow.postMessage("PutJSON:"+str,"*");this.Sound("ding");window.parent.OpenTab(8);return;}
if(mode=='GetJSON')
return str;$('#formatter').val(0);if(mode=='eStore')
return this.EasyFile(str,$.proxy(function(data){ReEdit(data)},this),style);$("#helpDiv").html("");}
else{$('#formatter').val(0);$("#helpDiv").html("");str="http://www.viseyes.org/shiva/go.htm";str+="?shivaGroup="+style;if(items&&items.length){for(i=0;i<items.length;++i){str+="&item-"+(i+1)+"=";for(k=itemStart;k<atts.length;++k){str1=items[i][atts[k]];if(str1)
str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");str+=atts[k]+":"+str1+";";}
str=str.substring(0,str.length-1);}}
if(this.overlay)
str+=this.dr.SaveDrawData(false);if(type)
str+="&chartType="+type;var j=0;for(o in props){if(o=="item")
break;str1=$("#propInput"+(j++)).val();if(str1)
str1=str1.replace(/&/g,"^").replace(/#/g,"``");if((props[o].opt=="list")&&(str1))
str1=str1.replace(/\n/g,",").replace(/\r/g,"");str+="&"+o+"="+str1;}
if(mode=='WordPress')
str="[iframe src='"+encodeURI(str)+"']";else if((mode=='iFrame')||(mode=='Drupal'))
str="<iframe width='600' height='400' src='"+encodeURI(str)+"'></iframe>";}
$("#outputDiv").html("<br/><br/>Embed code:<br><textarea readonly='yes' rows='6' cols='60' id='tmptxt1'>"+str+"</textarea>");$("#tmptxt1").select();return str;}
SHIVA_Show.prototype.ReEdit=function(jsonData,propertyList)
{var p,v,i=0,j,k=0,pair,key,o;var query=window.location.search.substring(1);if(!query&&!jsonData)
return;if(jsonData){var items=new Array();for(key in jsonData){if(key=="shivaEvents"){if(!shivaLib.ev)
SHIVA_Event(this.container,this.player);shivaLib.ev.AddEvents(jsonData[key]);continue;}
if(key.indexOf("item-")!=-1){v=jsonData[key].split(";");o=new Object;for(j=0;j<v.length;++j){p=v[j].split(":");o[p[0]]=p[1];}
items.push(o);continue;}
else if(key.indexOf("draw-")!=-1)
this.AddOverlaySeg(jsonData[key],true);else{k=0;for(o in propertyList){if(key==o){$("#propInput"+k).val(jsonData[key]);break;}
k++;}}}
return items;}
var vars=query.replace(/%C2%AE/g,"&reg").split("&");if(vars.length<4)
return;var items=new Array();for(var i=0;i<vars.length;i++){vars[i]=vars[i].replace(/\^/g,"&").replace(/%20/g," ").replace(/%60/g,"`").replace(/%3C/g,"<").replace(/%3E/g,">").replace(/%3c/g,"<").replace(/%3e/g,">").replace(/``/g,"#");pair=vars[i].split("=");for(j=2;j<pair.length;++j)
pair[1]+="="+pair[j];if(pair[1])
pair[0]=unescape(pair[0]);if(pair[0].indexOf("draw-")!=-1)
this.AddOverlaySeg(pair[1],true);if(pair[0].indexOf("item-")!=-1){v=pair[1].split(";");o=new Object;for(j=0;j<v.length;++j){p=v[j].split(":");o[p[0]]=p[1];}
items.push(o);}
else{for(o in propertyList)
if(pair[0]==o){$("#propInput"+(k++)).val(pair[1]);break;}}}
return items;}
SHIVA_Show.prototype.ShowHelp=function(att,helpText,chartType)
{var v;var str="<br/><hr/>";$("#outputDiv").text(" ");if(att){if(att.charAt(0)==' ')
att=att.substr(1)
v=att.split("&nbsp;");str+="<b>How to set "+v[0]+"</b><br/><br/>";if(helpText[v[0]])
str+=helpText[v[0]];}
else
str+="Click on a label to show help."
if(att=="Data source URL"){if(helpText[chartType]){str+="<br/><br/><b>Data Format for "+chartType+"</b><br/><br/><table>";str+="<tr><td>"+helpText[chartType]+"</td></tr>";str+="</table>";}}
if(helpText["OVERVIEW"])
str+="<br/><br/><b><i>Click <a onClick='shivaLib.ShowOverview()'><u>here</u></a> for an overview on the entire element.</b>";$("#helpDiv").html(str);}
SHIVA_Show.prototype.ShowOverview=function()
{var str="<br/><hr/><b>"+shivaLib.options.shivaGroup+" overview</b><br/><br/>";str+=helpText["OVERVIEW"];$("#helpDiv").html(str);}
SHIVA_Show.prototype.SetAttributes=function(props,items,keepData)
{var i,j,k,l,o,oo,id,id2;var atts=new Array();var oldData;for(o in props)
atts.push(o);if(keepData){oldData=new Array()
for(i=0;i<atts.length;++i){if(atts[i]=="item")
break;oldData.push($("#propInput"+i).val());}}
$('#propertyTable tr:gt(0)').remove();for(i=0;i<atts.length;++i){o=atts[i];id="propInput"+i;var str="<tr style='height:26px'><td width='12'></td><td width='200' onClick='ShowHelp(this.innerHTML)'>"+props[o].des.split("::")[0];if((this.drupalMan)&&(o=="dataSourceUrl"))
str+="&nbsp;&nbsp;<img src='databutton.gif' title='Click to find data set' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"gdoc\",0)'/>";str+="</td><td></td><td>";if(props[o].opt=="query")
str+="<input type='password' size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.QueryEditor(\""+id+"\")' id='"+id+"'/>";else if(props[o].opt=="advanced")
str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.SetAdvancedAttributes(\""+id+"\",\""+o+"\")' id='"+id+"'/>";else if((props[o].opt=="color")||(props[o].opt=="colors")){str+="<div style='max-height:26px'><input size='7' onChange='Draw()' style='position:relative;text-align:center;height:16px;top:2px; padding-left: 20px' id='"+id+"'/>";str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px;background-color:white'"
if(props[o].opt=="colors")
str+=" onclick='shivaLib.ColorPicker(1,"+i+")' id='"+id+"C'/>";else
str+=" onclick='shivaLib.ColorPicker(0,"+i+")' id='"+id+"C'/>";str+="</div>"}
else if(props[o].opt=="button")
str+="<button type='button' size='14' onChange='"+o+"' id='"+id+"'>"+props[o].def+"</button>";else if(props[o].opt=="slider")
str+="<input style='width:100px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="checkbox"){str+="<input onChange='Draw()' type='checkbox' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'";if(props[o].def=="true")
str+=" checked";str+="/> "+props[o].des.split("::")[1];}
else if(props[o].opt=="list")
str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";else if(props[o].opt=="sizer")
str+="<button type='button' id='"+id+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";else if(props[o].opt=="hidden")
str="<tr><td width='12'></td><td width='200'><input type='hidden' id='"+id+"'/>";else if(props[o].opt.indexOf('|')!=-1){var v=props[o].opt.split("|");if(o=='item'){str="<tr><td width='12'></td><td colspan='3'><div id='accord'>";for(j=0;j<items.length;++j){str+="<h3 style='overflow-x:hidden'><a href='#'><b>"+items[j].name+"</b></a></h3><div id='accord-"+j+"'>";for(k=i+1;k<atts.length;++k){id2="itemInput"+j+"-"+(k-i);oo=atts[k];if(props[oo].opt!="hidden")
str+="<span onClick='ShowHelp(this.innerText)'>"+props[oo].des;if((this.drupalMan)&&(oo=="layerSource"))
str+="<img src='kmlicon.gif' id='"+j+"' title='Click to find KML file' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"kml\",this.id)'/>";str+="</span><span style='position:absolute;left:142px;'>";if(props[oo].opt=="color"){str+="<input size='14' onChange='Draw()' style='text-align:center' id='"+id2+"'>";str+="<div style='position:relative;border:1px solid;height:8px;width:9px;top:-14px;left:5px'"
str+=" onclick='shivaLib.ColorPicker(0,"+((j*100)+100+(k-i))+")' id='"+id2+"C'/>";}
else if(props[oo].opt=="colors")
str+="<input size='14' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.ColorPicker(2,"+((j*100)+100+(k-i))+")' id='"+id2+"'>";else if(props[oo].opt=="button")
str+="<button type='button' size='12' onChange='"+oo+"' id='"+id+"'>"+props[oo].def+"</button>";else if(props[oo].opt=="slider")
str+="<input style='width:90px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="list")
str+="<textarea cols='13' rows='2' onChange='Draw()' onInput='Draw()' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";else if(props[oo].opt=="hidden")
str+="<input type='hidden' id='"+id2+"'/>";else if(props[oo].opt.indexOf('|')!=-1){var v=props[oo].opt.split("|");str+="<select id='"+id2+"' onChange='Draw()' onFocus='ShowHelp(\""+props[oo].des+"\")'>";for(l=0;l<v.length;++l){if(v[l])
str+="<option>"+v[l]+"</option>";}
str+="</select>";}
else if(props[oo].opt=="sizer")
str+="<button type='button' id='"+id2+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";else
str+="<input size='14' onChange='Draw()' type='text' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";str+="</span></p>";}
str+="</div>";}}
else{str+="<select id='"+id+"' onChange='Draw()' onFocus='ShowHelp(\""+props[o].des+"\")'>";for(j=0;j<v.length;++j){if(v[j])
str+="<option>"+v[j]+"</option>";}
str+="</select>";}}
else
str+="<input size='14' style='height:16px' onChange='Draw()' type='text' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";str+="<td width='12'></td ></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#"+id).val(props[o].def);if(keepData)
$("#"+id).val(oldData[i]);else
$("#"+id).val(props[o].def);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id).css('border-color',"#"+props[o].def);$("#"+id+"C").css('background-color',"#"+props[o].def);}
if(o=="item")
break;}
str="<tr height='8'><td></td></tr>";$(str).appendTo("#propertyTable tbody")
$("#accord").accordion({collapsible:true,active:false,autoHeight:false,change:this.callback});if(items){for(j=0;j<items.length;++j){for(k=i+1;k<atts.length;++k){o=atts[k];id2="itemInput"+j+"-"+(k-i);if(props[o].opt=="color")
if(props[o].def.toLowerCase()!='auto'){$("#"+id2).css('border-color',"#"+items[j][atts[k]]);$("#"+id2+"C").css('background-color',"#"+items[j][atts[k]]);}}}
for(i=0;i<atts.length;++i)
if(atts[i]=="item"){atts[i]="name";break;}
for(j=0;j<items.length;++j)
for(k=i;k<atts.length;++k)
$("#itemInput"+j+"-"+(k-i)).val(items[j][atts[k]]);}}
SHIVA_Show.prototype.SetAdvancedAttributes=function(prop,baseVar)
{var str,title,aProps,v,i;$("#advAttDialogDiv").dialog("destroy");$("#advAttDialogDiv").remove();str="<table>"
switch(baseVar){case"legendTextStyle":case"titleTextStyle":case"pieSliceTextStyle":case"tooltipTextStyle":aProps={fontName:{opt:'string',des:'Font'},fontSize:{opt:'string',des:'Size'},color:{opt:'color',des:'Color'}}
break;case"chartArea":aProps={left:{opt:'string',des:'Left'},top:{opt:'string',des:'Top'},height:{opt:'string',des:'Height'},width:{opt:'string',des:'Width'}}
break;case"backgroundColor":aProps={fill:{opt:'color',des:'Fill color'},stroke:{opt:'color',des:'Border color'},strokeWidth:{opt:'string',des:'Border width'}}
break;case"vAxis":case"hAxis":aProps={baseline:{opt:'string',des:'Baseline'},baselineColor:{opt:'color',des:'Baseline color'},direction:{opt:'string',des:'Direction'},format:{opt:'string',des:'Axis label format'},direction:{opt:'string',des:'Direction'},logScale:{opt:'string',des:'Log scale?'},textPosition:{opt:'string',des:'Text position'},title:{opt:'string',des:'Axis title'},maxValue:{opt:'string',des:'Max value'},minValue:{opt:'string',des:'Min value'},slantedText:{opt:'string',des:'Slanted text'}}
break;case"backgroundColors":aProps={main:{opt:'color',des:'Main Background'},eventspan:{opt:'color',des:'Event Span Background'},head:{opt:'color',des:'Header, Footer and Zoom Background'},popup:{opt:'color',des:'Popup Background'},imagelane:{opt:'color',des:'Image Lane Background'},ticklane:{opt:'color',des:'Time Ticks Background'},popuplink:{opt:'color',des:'Popup Link Background'}}
break;case"fontColors":aProps={main:{opt:'color',des:'Main Font Color'},head:{opt:'color',des:'Header Font Color'},popup:{opt:'color',des:'Popup Font Color'},links:{opt:'color',des:'Link Font Color'}}}
for(o in aProps){str+="<tr style='height:26px' onClick='ShowHelp(\""+aProps[o].des+"\")'><td>"+aProps[o].des+"</td><td>";if(aProps[o].opt=="color"){str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:center;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px;background-color:white'"
str+=" onclick='shivaLib.ColorPicker(0,\"___"+baseVar+o+"\")' id='"+baseVar+o+"C'/>";}
else
str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:left;height:16px;top:2px' id='"+baseVar+o+"'/>";str+="</td></tr>";}
var ops={width:'auto',height:'auto',modal:true,title:"Set "+baseVar,position:[300,350],buttons:{OK:function(){str="";for(o in aProps){if($("#"+baseVar+o).val())
str+=o+"="+$("#"+baseVar+o).val()+",";}
$("#"+prop).val(str);$("#"+prop).trigger("onchange");$(this).dialog("destroy");$("#advAttDialogDiv").remove();},'Cancel':function(){$(this).dialog("destroy");$("#advAttDialogDiv").remove();}}}
$("body").append("<div id='advAttDialogDiv'/>");$("#advAttDialogDiv").dialog(ops);$("#advAttDialogDiv").html(str+"</table>");v=$("#"+prop).val().split(",");for(i=0;i<v.length-1;++i)
$("#"+baseVar+v[i].split("=")[0]).val(v[i].split("=")[1]);}
SHIVA_Show.prototype.SizingBox=function(div,id,pos,alpha,col,edge)
{if(div==undefined){$("#shivaSizingBox").remove();Draw();return;}
Draw();if(id.indexOf("Input")!=-1)
pos=$("#"+id).val();var v,top=0,left=0,wid=10000;if(pos)
v=pos.split(",");if($("#shivaSizingBox").length==0){if(alpha==undefined)alpha=.5;if(col==undefined)col="#ccc;"
if(edge==undefined)edge="#000;"
var str="<div id='shivaSizingBox' style='background:"+col+"border:1px solid "+edge+";position:absolute;opacity:"+alpha+"'>";str+="<img src='addeventdot.gif' onclick='shivaLib.SizingBox()'></div>";$("#"+div).append(str);}
var box=$("#shivaSizingBox");var con=$("#"+div);if(v[0]!=undefined)left=v[0]
if(v[1]!=undefined)top=v[1];if(v[2]!=undefined)wid=v[2];box.css({left:left/100+"%",top:top/100+"%",width:wid/100+"%",height:wid/100+"%"});box.resizable({aspectRatio:true,cursor:"se-resize",resize:SetBox});box.draggable({containment:"parent",cursor:"move",drag:SetBox});function SetBox(event,ui){var box=$(this);var left=Math.round(ui.position.left/box.parent().width()*10000);var top=Math.round(ui.position.top/box.parent().height()*10000);var wid=Math.round(box.width()/con.width()*10000);$("#"+id).val(left+","+top+","+wid);SaveData("GetJSON");}}
SHIVA_Show.prototype.GetDataFromManager=function(type,index)
{if(type=="gdoc")
window.parent.postMessage("dataSourceUrl","*");if(type=="kml")
window.parent.postMessage("GetFile=KML="+index,"*");}
SHIVA_Show.prototype.QueryEditor=function(id)
{if($("#propInput0").val())
new SHIVA_QueryEditor($("#propInput0").val(),$("#"+id).val(),id,false);else
this.Prompt("Data Filter","You need to define a data source first!","")}
SHIVA_Show.prototype.ShiftItem=function(dir,items)
{var active=$("#accord").accordion("option","active");if(active===false)
return-1;var pos=Number(active)+Number(dir);if((pos<0)||(pos>=items.length))
return active;else
this.Sound("click");var o=items[pos];items[pos]=items[active];items[active]=o;this.Draw();return pos;}
function SHIVA_QueryEditor(source,query,returnID,fieldNames)
{this.advancedMode=false;$("#dataDialogDiv").dialog("destroy");$("#dataDialogDiv").remove();shivaLib.qe=this;if(query.indexOf("  ")==0)
this.advancedMode=true,query=query.substr(2);else if(!query)
query="SELECT * WHERE A = ? ORDER BY none"
if(query.indexOf(" ORDER BY ")==-1)
query+=" ORDER BY none";this.source=source;this.query=query.replace(/  /g," ");this.curFields=["A","B","C"];var thisObj=this;var ops={width:'auto',height:'auto',modal:true,title:'Data filter',position:[330,40],buttons:{OK:function(){if(thisObj.advancedMode)
thisObj.query="  "+$("#curQuery").val();if(!fieldNames){var i,f;for(i=0;i<thisObj.curFields.length;++i){f=thisObj.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");thisObj.query=thisObj.query.replace(RegExp(f,"g"),String.fromCharCode(i+65));}}
if(!thisObj.query.match(/\?/)){thisObj.query=thisObj.query.replace(/ORDER BY none/g,"");if(returnID=="curQueryDiv")
$("#"+returnID).html(thisObj.query);else if(returnID)
$("#"+returnID).val(thisObj.query);window.postMessage("ShivaDraw","*");}
$(this).dialog("destroy");$("#dataDialogDiv").remove();$("#propInput0").trigger("onchange");},'Cancel':function(){$(this).dialog("destroy");$("#dataDialogDiv").remove();}}}
$("body").append("<div id='dataDialogDiv'/>");$("#dataDialogDiv").dialog(ops);if(source){var googleQuery=new google.visualization.Query(source);googleQuery.send(handleQueryResponse);}
this.DrawQuery();function handleQueryResponse(response){var i,j,key;var data=response.getDataTable();var rows=data.getNumberOfRows();var cols=data.getNumberOfColumns();thisObj.curFields=[];if((thisObj.query.indexOf(" A ")!=-1)&&(thisObj.query.charAt(thisObj.query.length-1)!=" "))
thisObj.query+=" ";for(j=0;j<cols;++j){key=$.trim(data.getColumnLabel(j)).replace(/ /g,"_");if(!key)
continue;thisObj.query=thisObj.query.replace(RegExp(" "+String.fromCharCode(j+65)+" ","g")," "+key+" ");thisObj.curFields.push(key);}
thisObj.query=$.trim(thisObj.query);thisObj.DrawQuery();}}
SHIVA_QueryEditor.prototype.DrawQuery=function()
{var i,num;var select="all";var order="none";var thisObj=this;if(this.advancedMode){str="<textArea id='curQuery' rows='4' cols='50' />";str+="<p><input type='checkbox' id='advedit' checked='checked' onclick='shivaLib.qe.AdvancedMode(false)'> Advanced editing mode";str+="<p><Button id='queryAdvEdit'>Test</button> ";str+="Click <a href='http://code.google.com/apis/chart/interactive/docs/querylanguage.html' target='_blank'>here</a> for information on formatting</p></p>";str+="<br/><div id='testShowDiv'/>"
$("#dataDialogDiv").html(str);$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));$("#queryAdvEdit").click(function(){thisObj.TestQuery();});this.TestQuery();return;}
i=this.query.indexOf(" WHERE ");if(i==-1)
i=this.query.indexOf(" ORDER BY ");select=this.query.substring(7,i);if(select=="*")
select="all";i=this.query.indexOf(" ORDER BY ");order=this.query.substring(i+10);i=this.query.indexOf(" WHERE ");var str="<div style='border 1px solid'><br/><table id='clauseTable' cellspacing='0' cellpadding='0'>";if(i!=-1){j=this.query.indexOf(" ORDER BY ");var v=this.query.substring(i+7,j).split(" ");i=0;str+=this.AddClause("IF",v[0],v[1],v[2],v.length<6,i++);for(j=3;j<v.length;j+=4)
str+=this.AddClause(v[j],v[j+1],v[j+2],v[j+3],(j+5)>v.length,i++);}
var q=this.query.replace(/WHERE /g,"<br/>WHERE ").replace(/ORDER BY /g,"<br/>ORDER BY ")
str+="<tr height='12'></tr>";str+="</div><tr><td><b>SHOW&nbsp;&nbsp;</b></td><td align='middle'>&nbsp;";str+="<select multiple='multiple' size='3'id='sel' onchange='shivaLib.qe.SetQueryString()'>";str+="<option>all</option>";for(i=0;i<this.curFields.length;++i)str+="<option>"+this.curFields[i]+"</option>";str+="</select></td><td>&nbsp;&nbsp;<b>ORDER BY</B> &nbsp;<select id='ord' onchange='shivaLib.qe.SetQueryString()'>";str+="<option>none</option>";for(i=0;i<this.curFields.length;++i)str+="<option>"+this.curFields[i]+"</option>";str+="</select></td></tr>";str+="</table><p><input type='checkbox' id='advedit' onclick='shivaLib.qe.AdvancedMode(true)'/> Advanced editing mode</p>";str+="<div id='curQuery' style='overflow:auto'><span style='color:#999'><b>"+q+"</b></span></div>";str+="<br/><div id='testShowDiv'/>"
$("#dataDialogDiv").html(str);$("#sel").val(select.split(","));$("#ord").val(order);this.TestQuery();}
SHIVA_QueryEditor.prototype.TestQuery=function()
{var f,q=this.query;if(q.match(/\?/))
q="";for(i=0;i<this.curFields.length;++i){f=this.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,"\\$&");q=q.replace(RegExp(f,"g"),String.fromCharCode(i+65));}
q=q.replace(/ORDER BY none/g,"");if(this.advancedMode)
q=$("#curQuery").val();var tbl={"chartType":"Table","dataSourceUrl":this.source,"query":q,"shivaGroup":"Data"};$("#testShowDiv").empty();$("#testShowDiv").css("width",$("#dataDialogDiv").css("width"));$("#testShowDiv").css("height","200px");$("#testShowDiv").css("overflow","auto");new SHIVA_Show("testShowDiv",tbl);}
SHIVA_QueryEditor.prototype.AdvancedMode=function(mode)
{this.advancedMode=mode;if(!mode)
this.query="SELECT * WHERE A = * ORDER BY none";this.DrawQuery();if(mode)
$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));}
SHIVA_QueryEditor.prototype.AddClause=function(clause,subj,pred,obj,last,row)
{var str="<tr valign='top'><td>";if(clause!="IF")
str+=shivaLib.MakeSelect("clause"+row,0,["AND","OR","NOT"],clause,"onchange='shivaLib.qe.SetQueryString()'");else
str+="<b>IF</b>";str+="</td><td>&nbsp;"+shivaLib.MakeSelect("subject"+row,0,this.curFields,subj,"onchange='shivaLib.qe.SetQueryString()'");str+="</td><td>&nbsp;&nbsp;<b>IS&nbsp; </b>"+shivaLib.MakeSelect("predicate"+row,0,["<",">","=","!=","<=",">=","has"],pred,"onchange='shivaLib.qe.SetQueryString()'");str+=" <input type='input' size='8' id='object"+row+"' value='"+obj+"' onchange='shivaLib.qe.SetQueryString()'/>";if(clause=="IF")
str+="&nbsp;<img src='adddot.gif' onclick='shivaLib.qe.AddNewClause("+row+")'style='vertical-align:middle'>";else
str+="&nbsp;<img src='trashdot.gif' onclick='shivaLib.qe.DeleteClause("+row+")' style='vertical-align:middle'>";str+="</td></tr>";$("#pred").val(pred);return str;}
SHIVA_QueryEditor.prototype.AddNewClause=function(num)
{var i=this.query.indexOf(" ORDER BY ");this.query=this.query.substr(0,i)+" AND * = ?"+this.query.substr(i);this.DrawQuery();shivaLib.Sound("ding");}
SHIVA_QueryEditor.prototype.DeleteClause=function(num)
{var v=this.query.split(" ");var n,i,str="";for(n=0;n<v.length;++n)
if(v[n]=="WHERE")
break;n=n+(num*4)
for(i=0;i<n;++i)
str+=v[i]+" ";for(i=n+4;i<v.length;++i)
str+=v[i]+" ";this.query=str;this.DrawQuery();shivaLib.Sound("delete");}
SHIVA_QueryEditor.prototype.SetQueryString=function()
{var i,j,num=0;i=this.query.indexOf(" WHERE ");if(i!=-1){j=this.query.indexOf(" ORDER BY ");var v=this.query.substring(i+7,j).split(" ");num=(v.length+1)/4;}
str="SELECT "
var sel=$("#sel").val();if(sel=="all")
sel="*";str+=sel+" ";if(num)
str+="WHERE ";for(i=0;i<num;++i){if(i)
str+=$("#clause"+i).val()+" ";str+=$("#subject"+i).val()+" ";str+=$("#predicate"+i).val()+" ";str+=$("#object"+i).val();str+=" ";}
str+="ORDER BY "+$("#ord").val();this.query=str;this.DrawQuery();}
SHIVA_Show.prototype.DrawControl=function()
{var options=this.options;var container=this.container;var con="#"+container;var items=new Array();this.items=items;var _this=this;for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i){v[i]=v[i].replace(/http:/g,"http`");o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");}
items.push(o);}}
if(options.chartType=="Dialog")
$.proxy(DrawDialog(items),this);else if(options.chartType=="Selector")
$.proxy(DrawSelector(items),this);else if(options.chartType=="TimeSlider")
$.proxy(DrawTimeSlider(items),this);else if(options.chartType=="TimeStepper")
$.proxy(DrawTimeStepper(items),this);else if(options.chartType=="InfoBox")
$.proxy(DrawInfoBox(items),this);this.SendReadyMessage(true);function DrawTimeStepper(items)
{var i;var dd=container+"Stp";var str="<span id='"+dd+"'>";for(i=0;i<items.length;++i){str+="<input type='radio' id='stp"+i+"' name='stepper'";if(!i)
str+=" checked=checked";str+="/><label for='stp"+i+"'>"+(i+1)+"</label>";items[i].ans=items[i].def;}
str+="<input type='radio' id='stp"+i+"' name='stepper'";str+="/><label for='stp"+i+"'>NEXT</label>";str+="</span>";$(con).html(str);$(con).css("text-align","left");$(con).css("width",((items.length*25)+80)+"px");$("#"+dd).buttonset().change(function(e){shiva_Step(e.target.id.substr(3),_this)});$("#stp"+i).button({text:true,icons:{primary:"ui-icon-triangle-1-e"}});}
function DrawTimeSlider(items)
{var str="";var dd=con+"Int";$(dd).remove();$(con).append("<div id='"+dd.substr(1)+"'/>");$(con).css("height","30px");$(con).css("width","30px");options.orientation=options.orientation.toLowerCase();options.step=Number(options.step);if(options.orientation=="vertical"){$(dd).css("height",options.size+"px");$(con).css("height",options.size+"px");}
else{$(dd).css("width",options.size+"px");$(con).css("width",options.size+"px");}
if(options.type=="Bar")
options.range="min";else if(options.type=="Range")
options.range=true;if((!options.def)&&(options.type=="Range"))
options.def="25,75";if(options.def.indexOf(",")==-1)
options.value=Number(options.def);else{options.values=new Array();options.values[0]=Number(options.def.split(",")[0]);options.values[1]=Number(options.def.split(",")[1]);}
if(!$('#sliderBack').length){var mc=document.createElement('canvas');mc.setAttribute('id','sliderBack');$(dd).append(mc)
sliderContext=mc.getContext('2d');}
$(dd).slider("destroy");$(dd).slider(options);$(dd).bind("slidestop",function(e,ui){var which=-1;var val=ui.value;if(ui.values)
val=ui.values[0];if(ui.value!=val){which=0;val=ui.values[1];}
shivaLib.SendShivaMessage("ShivaSlider="+(which+1)+"|"+val);});DrawSliderTicks();}
function DrawSliderTicks()
{var g=_this.g;if(!g)
g=_this.g=new SHIVA_Graphics();var hgt=40,wid=40,pos,val;var n=Number(options.ticks);var showValues=(options.showValues=="true")
var min=Number(options.min);var max=Number(options.max);var isVert=(options.orientation=="vertical");if(isVert)
hgt=options.size;else
wid=options.size;$('#sliderBack').attr('width',wid);$('#sliderBack').attr('height',hgt);var inc=Number(options.size/(n+1));var pos=inc;var tinc=Math.abs(max-min)/(n+1);var tpos=tinc;if(!isVert)
sliderContext.textAlign="center";for(i=0;i<n;++i){if(isVert)
g.DrawLine(sliderContext,"#000",1,8,pos,15,pos,.5);else
g.DrawLine(sliderContext,"#000",1,pos,8,pos,15,.5);if(showValues){val=tpos;if(Math.abs(max-min)>4)
val=Math.round(val);else{val=Math.round(tpos*100);val=Math.floor(val/100)+"."+(val%100);}
val=Number(val)+min;if(isVert)
sliderContext.fillText(val,18,Number(options.size)-pos+3);else
sliderContext.fillText(val,pos,25);}
pos+=inc;tpos+=tinc;}
if(showValues){sliderContext.font="bold 10px Arial";sliderContext.textAlign="left";if(isVert){sliderContext.fillText(min,14,hgt);sliderContext.fillText(max+options.suffix,14,10);}
else{sliderContext.fillText(min,0,25);sliderContext.textAlign="right";sliderContext.fillText(max+options.suffix,wid,25);}
sliderContext.font="";}}
function DrawSelector(items)
{var i,o,nChars=0;var dd=container+"Sel";var str="<span id='"+dd+"'>";for(i=0;i<items.length;++i){o=items[i];nChars+=o.label.length+5;if(items[i].type)nChars+=4;if(options.style=="Button")
str+="<input type='button' id='sel"+i+"' value='"+o.label+"'>";else if(options.style=="Toggle")
str+="<input type='checkbox' id='sel"+i+"'/><label for="+"'sel"+i+"'>"+o.label+"</label>";else{str+="<input type='radio' id='sel"+i+"' name='selector'";if(o.def=="true")
str+=" checked='sel"+i+"'";if(!items[i].label)
str+="/><label for='sel"+i+"'>&nbsp;</label>";else
str+="/><label for='sel"+i+"'>"+o.label+"</label>";}}
str+="</span>";$(con).html(str);for(i=0;i<items.length;++i){if(options.style=="Toggle")
$("#sel"+i).click(function(){var ch=this.checked?"checked":"unchecked"
var id=this.id.substr(3)
shivaLib.SendShivaMessage("ShivaSelect="+id+"|"+ch)});else
$("#sel"+i).click(function(){shivaLib.SendShivaMessage("ShivaSelect="+this.id.substr(3)+"|checked")});}
$(con).css("text-align","left");$("#"+dd).buttonset();$(con).css("width",(nChars*6)+"px");for(i=0;i<items.length;++i)
if(items[i].type!="Button"){items[i].type=items[i].type.replace(/\./g,"");items[i].type=items[i].type.replace(/ui-icon-/g,"");$("#sel"+i).button({text:true,icons:{primary:"ui-icon-"+items[i].type}});}}
function DrawDialog(items)
{var o,i,v,sty,str="";var dd="#"+container+"Dlg";$(dd).remove();$(con).append("<div id='"+container+"Dlg' style='border:1px solid #999;padding:8px;background-color:#f8f8f8;text-align:left' class='rounded-corners'/>");for(o in options){v=options[o];if(v=="true")v=true;if(v=="false")v=false;options[o]=v;}
if((options.draggable)&&(!_this.editMode))
$(dd).draggable();if(options.title)
str+="<div align='center'><b>"+options.title+"</b></div><br>";for(i=0;i<items.length;++i){o=items[i];if(o.type)
sty=o.type.toLowerCase();if(sty=='checkbox'){str+="<input type='"+sty+"'";str+=" name='"+o.name+"' id='"+o.name+"'";if(o.def)
str+=" checked=checked";str+="/> ";if(o.label)
str+=o.label;}
else if(sty=='radio'){str+="<input type='"+sty+"'";str+=" name='"+o.group+"' id='"+o.name+"'";if(o.def)
str+=" checked=checked";str+="/> ";if(o.label)
str+=o.label;}
else if((sty=='input')||(sty=='button')){str+="<input type='"+sty+"' size='23'";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";if(o.def)
str+=" value='"+o.def+"'";str+="/> ";if(o.label)
str+=o.label;}
else if(sty=='range')
str+="<div style='width:120px;display:inline-block' id='"+o.name+"'></div> "+o.label;else if(sty=='combo'){str+="<select ";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";str+=">";v=o.label.split("|");for(var j=0;j<v.length;++j){str+="<option";if(o.def==v[j])
str+=" selected='selected'";str+=">"+v[j]+"</option>";}
str+="</select>";}
else if(sty=='line'){str+="<hr style='margin-top:.5em;margin-bottom:.5em'/>";continue;}
else if(sty=='text')
str+="<span style='margin-top:.5em;margin-bottom:.5em'>"+o.label+"</span>";else if(sty=='image'){str+="<input type='"+sty+"' src='"+o.def+"'";str+=" name='"+o.name+"' id='"+o.name+"'";str+="style='margin-top:.5em;margin-bottom:.5em'";str+="/>";}
str+="<br/> ";}
$(dd).html(str);for(i=0;i<items.length;++i){o=items[i];if(o.type)
sty=o.type.toLowerCase();if((sty=="radio")||(sty=="image")||(sty=="button"))
$("#"+o.name).click(function(){var id=this.id.substr(5)
shivaLib.SendShivaMessage("ShivaDialog="+id+"|checked")});else if(sty=="checkbox")
$("#"+o.name).click(function(){var id=this.id.substr(5)
var ch=this.checked?"checked":"unchecked"
shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ch)});else if((sty=="input")||(sty=="combo"))
$("#"+o.name).change(function(){var id=this.id.substr(5)
var ch=this.value;shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ch)});else if(sty=="range"){var ops={min:0,max:100,value:o.def,slide:function(event,ui){var id=this.id.substr(5)
shivaLib.SendShivaMessage("ShivaDialog="+id+"|"+ui.value)}};$("#"+o.name).slider(ops);}}}
function DrawInfoBox(items)
{var str="";var min=0;var dd="#"+container+"Inf";$(dd).remove();$(con).append("<div id='"+container+"Inf' style='border:1px solid #999;padding:8px;text-align:left' class='rounded-corners'/>");for(o in options){v=options[o];if(v=="true")v=true;if(v=="false")v=false;options[o]=v;}
if(options.title)
str+="<div align='center'><b>"+options.title+"</b></div>";if((options.closer)||(options.title)){str+="<br/>";min=16;}
var content="#"+container+"Con";str+="<div id='"+container+"Con'></div>"
$(dd).html(str);if(options.backCol==-1)$(dd).css("background-color","transparent")
else $(dd).css("background-color","#"+options.backCol)
if(options.frameCol==-1)$(dd).css("border-color","transparent")
else $(dd).css("border-color","#"+options.frameCol)
if(options.width!="auto")$(dd).css("width",options.width+"px");if(options.height!="auto"){$(dd).css("height",options.height+"px");$(content).css("height",options.height-min+"px");}
if((options.draggable)&&(!_this.editMode))
$(dd).draggable();if((options.text)&&(options.style=="Text"))
$(content).html(options.text);if(options.scroller)$(content).css("overflow","scroll").css("overflow-x","hidden");else $(content).css("overflow","hidden");if(options.closer){var x=$(dd).width()-2;str="<img id='Clo"+dd.substr(1)+"' src='closedot.gif' style='position:absolute;left:"+x+"px;top:5px'/>"
$(dd).append(str);$("#Clo"+dd.substr(1)).click(function(){var id=this.id.substr(3);$("#"+id).hide();shivaLib.SendShivaMessage("ShivaDialog="+options.title+"|closed");});}}}
function shiva_Step(num,obj)
{if(num<0)
num=obj.lastStep-0+1;num=Math.min(num,obj.items.length-1);obj.lastStep=num;for(var i=0;i<obj.items.length;++i)
$("#stp"+i).removeAttr("checked");$("#stp"+num).attr("checked",true);$("#shiva_stepq").remove();var str="<div id='shiva_stepq'><br/><b>"+obj.items[num].label+"</b><br/>";shivaLib.SendShivaMessage("ShivaStep="+num+"|"+obj.items[num].ques+"|"+obj.items[num].ans);if(obj.items[num].ques.indexOf("|")!=-1){str+="<select name='shiva_stepa' id='shiva_stepa' onChange='shiva_onStepAnswer("+num+","+this+")'>";var v=obj.items[num].ques.split("|");for(var j=0;j<v.length;++j){str+="<option";if(obj.items[num].ans==v[j])
str+=" selected='selected'";str+=">"+v[j]+"</option>";}
str+="</select></div>";$("#"+obj.container).append(str);}
else if(obj.items[num].ques){var e="onblur";if(obj.items[num].ques=="color")
e="onfocus";str+="<input id='shiva_stepa' type='input' "+e+"='shiva_onStepAnswer("+num+","+this+")'></div>";$("#shiva_stepa").val(obj.items[num].ans);}
$("#"+obj.container).append(str);if($("#accord").length)
$("#accord").accordion({active:num});}
function shiva_onStepAnswer(num,obj)
{if(obj.items[num].ques=="color")
obj.ColorPicker(-1,"shiva_stepa");obj.items[num].ans=$("#shiva_stepa").val();}
function SHIVA_Draw(container,hidePalette)
{this.container=container;this.color="-1";this.clipboard=new Array();this.edgeColor="#0000ff";this.textColor="#000000";this.boxColor="-1";this.edgeWidth="30";this.arrow=false;this.alpha=100;this.curTool=0;this.imageURL="";this.imageWid=400;this.textAlign="Left";this.textStyle="";this.textSize=0;this.ideaShape="Round box";this.ideaGradient=true;this.ideaBold=false;this.ideaBackCol="#FFF2CC";this.ideaEdgeCol="#999999";this.ideaTextCol="#000000";this.selectedItems=new Array();this.selectedDot=-1;this.segs=new Array();this.startTime="0:0";this.endTime="end";if(shivaLib.overlay)
this.segs=shivaLib.overlay;this.closeOnMouseUp=false;this.curSeg=-1;this.lastDotTime=0;this.snap=false;this.curve=false;this.snapSpan=20;this.leftClick=false;this.lastX=0;this.lastY=0;shivaLib.dr=this;if(!hidePalette)
this.DrawPalette();this.colorPicker="";this.ctx=$("#shivaDrawCanvas")[0].getContext('2d');$("#shivaDrawDiv").css("cursor","crosshair");$("#shivaDrawDiv").mouseup(this.onMouseUp);$("#shivaDrawDiv").mousedown(this.onMouseDown);$("#shivaDrawDiv").mousemove(this.onMouseMove);document.onkeyup=this.onKeyUp;document.onkeydown=this.onKeyDown;}
SHIVA_Draw.prototype.DrawPalette=function(tool)
{var hgt=$("#"+this.container).css("height").replace(/px/g,"");var top=$("#"+this.container).css("top").replace(/px/g,"");if(top=="auto")top=0;var left=$("#"+this.container).css("left").replace(/px/g,"")-0+12;if($("#shivaDrawPaletteDiv").length==0){var h=225;if(shivaLib.player)
h+=16;str="<div id='shivaDrawPaletteDiv' style='position:absolute;left:"+left+"px;top:"+(top-12+Number(hgt)-100)+"px;width:180px;height:"+h+"px'>";$("body").append("</div>"+str);$("#shivaDrawPaletteDiv").addClass("propTable");$("#shivaDrawPaletteDiv").draggable();$("#shivaDrawPaletteDiv").css("z-index",2001);}
this.SetTool(0);this.DrawMenu();}
SHIVA_Draw.prototype.ColorPicker=function(name)
{var str="<p style='text-shadow:1px 1px white' align='center'><b>Choose a new color</b></p>";str+="<img src='colorpicker.gif' style='position:absolute;left:15px;top:28px' />";str+="<input id='shivaDrawColorInput' type='text' style='position:absolute;left:22px;top:29px;width:96px;background:transparent;border:none;'>";$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").on("click",onColorPicker);this.colorPicker=name;function onColorPicker(e){var col;var cols=["000000","444444","666666","999999","CCCCCC","EEEEEE","E7E7E7","FFFFFF","FF0000","FF9900","FFFF00","00FF00","00FFFF","0000FF","9900FF","FF00FF","F4CCCC","FCE5CD","FFF2CC","D9EAD3","D0E0E3","CFE2F3","D9D2E9","EDD1DC","EA9999","F9CB9C","FFE599","BED7A8","A2C4C9","9FC5E8","B4A7D6","D5A6BD","E06666","F6B26B","FFD966","9C347D","76A5AF","6FA8DC","8E7CC3","C27BA0","CC0000","E69138","F1C232","6AA84F","45818E","3D85C6","674EA7","A64D79","990000","B45F06","BF9000","38761D","134F5C","0B5394","351C75","741B47","660000","783F04","7F6000","274E13","0C343D","073763","20124D","4C1130"];var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if((x<112)&&(y<55))
return;$("#shivaDrawPaletteDiv").off("click",this.onColorPicker);if((x>112)&&(x<143)&&(y<48)){if($("#shivaDrawColorInput").val())
col="#"+$("#shivaDrawColorInput").val();else
x=135;}
if((x>143)&&(y<48)){shivaLib.dr.DrawMenu();return;}
if(y>193)
col=-1;else if(y>48){x=Math.floor((x-24)/17);y=Math.floor((y-51)/17);col="#"+cols[x+(y*8)];}
shivaLib.dr[shivaLib.dr.colorPicker]=col;if(shivaLib.dr.curTool==5){if(shivaLib.dr.selectedItems.length)
shivaLib.dr.DrawMenu(shivaLib.dr.segs[shivaLib.dr.selectedItems[0]].type);else
shivaLib.dr.DrawMenu(0);shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);}
else if(shivaLib.dr.curTool==6){shivaLib.dr.SetVal(shivaLib.dr.colorPicker,col);shivaLib.dr.DrawMenu();}
else
shivaLib.dr.DrawMenu();}}
SHIVA_Draw.prototype.DrawMenu=function(tool)
{var preface="Edit ";if(tool==undefined)
tool=this.curTool,preface="Draw ";var titles=["a line","a circle","a box","text","an image",""," an Idea Map"];var str="<p style='text-shadow:1px 1px white' align='center'><b>";str+=preface+titles[tool]+"</b></p>";str+="<img src='closedot.gif' style='position:absolute;left:163px;top:1px' onclick='shivaLib.dr.SetTool(-1)'/>";str+="<table style='font-size:xx-small'>"
if(tool<3){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";if(tool==2)
str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";else if(tool==0){str+="<tr><td>&nbsp;&nbsp;Draw curves?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Draw arrow?</td><td><input onClick='shivaLib.dr.SetVal(\"arrow\",this.checked)' type='checkbox' id='arrow'></td></tr>";}
str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";}
else if(tool==3){str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"boxColor\")' onChange='shivaLib.dr.SetVal(\"boxColor\",this.value)' type='text' id='boxColor'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Round box?</td><td><input onClick='shivaLib.dr.SetVal(\"curve\",this.checked)' type='checkbox' id='curve'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Align</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"textAlign\",this.value)' id='textAlign'><option>Left</option><option>Right</option><option>Center</option></select></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Text size</td><td><div style='width:82px;margin-left:6px' id='textSize'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"textColor\")' onChange='shivaLib.dr.SetVal(\"textColor\",this.value)' type='text' id='textColor'></td></tr>";}
else if(tool==4){str+="<tr><td>&nbsp;&nbsp;Snap to grid?</td><td><input onClick='shivaLib.dr.SetVal(\"snap\",this.checked)' type='checkbox' id='snap'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Edge color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"edgeColor\")' onChange='shivaLib.dr.SetVal(\"edgeColor\",this.value)' type='text' id='edgeColor'></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Line width</td><td><div style='width:78px;margin-left:6px' id='edgeWidth'/></td></tr>";str+="<tr height='20'><td>&nbsp;&nbsp;Visibility</td><td><div style='width:78px;margin-left:4px' id='alpha'/></td></tr>";str+="<tr><td>&nbsp;&nbsp;Image URL</td><td>&nbsp;<input style='width:85px;height:12px' onChange='shivaLib.dr.SetVal(\"imageURL\",this.value)' type='text' id='imageURL'></td></tr>";}
else if(tool==6){str+="<tr><td>&nbsp;&nbsp;Shape</td><td>&nbsp;<select style='width:85px;height:18px;font-size:x-small' onChange='shivaLib.dr.SetVal(\"ideaShape\",this.value)' id='ideaShape'><option>Round box</option><option>Rectangle</option><option>Oval</option><option>Circle</option></select></td></tr>";str+="<tr><td>&nbsp;&nbsp;Back color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaBackCol\")' type='text' id='ideaBackCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Gradient?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaGradient\",this.checked)' type='checkbox' id='ideaGradient'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Line color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaEdgeCol\")' onChange='shivaLib.dr.SetVal(\"ideaEdgeCol\",this.value)' type='text' id='ideaEdgeCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Text color</td><td>&nbsp;<input style='width:85px;height:12px' onFocus='shivaLib.dr.ColorPicker(\"ideaTextCol\")' onChange='shivaLib.dr.SetVal(\"ideaTextCol\",this.value)' type='text' id='ideaTextCol'></td></tr>";str+="<tr><td>&nbsp;&nbsp;Bold text?</td><td>&nbsp;<input onClick='shivaLib.dr.SetVal(\"ideaBold\",this.checked)' type='checkbox' id='ideaBold'></td></tr>";str+="<tr><td colspan='2' style='text-align:center'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button style='font-size:x-small' onclick='shivaLib.dr.AddIdea(-1)'>Add base idea</button></td></tr>";}
str+="</table><br/>";str+="<div style='position:absolute;left:14px;top:194px'><span id='drawToolbar' style='font-size:xx-small'>";str+="<input type='radio' id='sdtb6' name='draw' onclick='shivaLib.dr.SetTool(5)'/><label for='sdtb6'>Select</label>";str+="<input type='radio' id='sdtb3' name='draw' onclick='shivaLib.dr.SetTool(2)'/><label for='sdtb3'>Box</label>";str+="<input type='radio' id='sdtb2' name='draw' onclick='shivaLib.dr.SetTool(1)'/><label for='sdtb2'>Circle</label>";str+="<input type='radio' id='sdtb1' name='draw' onclick='shivaLib.dr.SetTool(0)'/><label for='sdtb1'>Line</label>";str+="<input type='radio' id='sdtb4' name='draw' onclick='shivaLib.dr.SetTool(3)'/><label for='sdtb4'>A</label>";str+="<input type='radio' id='sdtb5' name='draw' onclick='shivaLib.dr.SetTool(4)'/><label for='sdtb5'>Image</label>";str+="<input type='radio' id='sdtb7' name='draw' onclick='shivaLib.dr.SetTool(6)'/><label for='sdtb7'>Idea</label>";str+="</span></div>";if(shivaLib.player){str+="<img src='startdot.gif' style='position:absolute;left:13px;top:220px'  onclick='shivaLib.dr.SetVal(\"startTime\")'/>";str+="<img src='enddot.gif'   style='position:absolute;left:150px;top:220px' onclick='shivaLib.dr.SetVal(\"endTime\")'/>";str+="<p id='startEndTime' align='center' style='position:absolute;left:40px;top:214px;width:108px;color:#777'/>";}
$("#shivaDrawPaletteDiv").html(str);$("#shivaDrawPaletteDiv").css("font-size","xx-small");$("#sdtb"+(this.curTool+1)).attr("checked","checked");$("#drawToolbar").buttonset();$("#sdtb1").button({text:false,icons:{primary:"ui-icon-pencil"}});$("#sdtb2").button({text:false,icons:{primary:"ui-icon-radio-on"}});$("#sdtb3").button({text:false,icons:{primary:"ui-icon-circlesmall-plus"}});$("#sdtb4").button({text:true});$("#sdtb5").button({text:false,icons:{primary:"ui-icon-image"}});$("#sdtb6").button({text:false,icons:{primary:"ui-icon-arrowthick-1-nw"}}).css("width","100");$("#sdtb7").button({text:false,icons:{primary:"ui-icon-lightbulb"}}).css("width","100");$("#alpha").slider({slide:function(event,ui){shivaLib.dr.SetVal("alpha",ui.value);}});$("#edgeWidth").slider({slide:function(event,ui){shivaLib.dr.SetVal("edgeWidth",ui.value);}});$("#textSize").slider({slide:function(event,ui){shivaLib.dr.SetVal("textSize",ui.value);}});$("#alpha .ui-slider-handle").css("border","1px solid #888");$("#edgeWidth .ui-slider-handle").css("border","1px solid #888");$("#textSize .ui-slider-handle").css("border","1px solid #888");this.SetMenuProperties();}
SHIVA_Draw.prototype.SetMenuProperties=function()
{var col,tcol,txt;tcol=txt=col=this.color;gradient=true;if(col==-1)col="#fff",tcol="000",txt='none';$("#color").css("background-color",col);$("#color").css("color",tcol);$("#color").val(txt);tcol=txt=col=this.edgeColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#edgeColor").css("background-color",col);$("#edgeColor").css("color",tcol);$("#edgeColor").val(txt);tcol=txt=col=this.textColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#textColor").css("background-color",col);$("#textColor").css("color",tcol);$("#textColor").val(txt);tcol=txt=col=this.boxColor;if(col==-1)col="#fff",tcol="000",txt='none';$("#boxColor").css("background-color",col);$("#boxColor").css("color",tcol);$("#boxColor").val(txt);$("#snap").attr("checked",this.snap);$("#curve").attr("checked",this.curve);$("#arrow").attr("checked",this.arrow);$("#edgeWidth").slider("value",this.edgeWidth);$("#alpha").slider("value",this.alpha);$("#restSize").slider("value",this.textSize);$("#textAlign").val(this.textAlign);$("#imageURL").val(this.imageURL);$("#startEndTime").text(this.startTime+" -> "+this.endTime);$("#edgeWidth").val(this.edgeWidth);$("#ideaShape").val(this.ideaShape);$("#ideaBackCol").val(this.ideaBackCol);$("#ideaGradient").attr("checked",this.ideaGradient);$("#ideaBold").attr("checked",this.ideaBold);tcol=txt=col=this.ideaBackCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaBackCol").val(txt);$("#ideaBackCol").css("background-color",col);$("#ideaBackCol").css("color",tcol);tcol=txt=col=this.ideaEdgeCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaEdgeCol").val(txt);$("#ideaEdgeCol").css("background-color",col);$("#ideaEdgeCol").css("color",tcol);tcol=txt=col=this.ideaTextCol;if(col==-1)col="#fff",tcol="000",txt='none';$("#ideaTextCol").val(txt);$("#ideaTextCol").css("background-color",col);$("#ideaTextCol").css("color",tcol);}
SHIVA_Draw.prototype.DrawOverlay=function(num)
{shivaLib.overlay=this.segs;shivaLib.Draw({shivaGroup:"Draw"});}
SHIVA_Draw.prototype.SetShivaText=function(text,num)
{this.segs[num].text=text;}
SHIVA_Draw.prototype.SaveDrawData=function(json)
{var i,o,key,str="",str1;for(i=0;i<this.segs.length;++i){o=this.segs[i];if(json)
str+="\t\"draw-"+(i+1)+"\":\"";else
str+="&draw-"+(i+1)+"=";for(key in o){str1=String(o[key]);if(str1)
str+=key+":"+str1.replace(/\n/g,"|").replace(/\r/g,"").replace(/\:/g,"`").replace(/#/g,"~")+";";}
str=str.substring(0,str.length-1);if(json)
str+="\",\n";}
return str;}
SHIVA_Draw.prototype.DrawWireframes=function(clear)
{var o,i,col,scol;if(clear)
this.ctx.clearRect(0,0,1000,1000);for(i=0;i<this.segs.length;++i){col="#777";for(j=0;j<this.selectedItems.length;++j)
if(this.selectedItems[j]==i){col="#ff0000";break;}
o=this.segs[i];if((o.type==5)||(!o.x))
continue;if(o.type==3)
shivaLib.g.DrawBar(this.ctx,-1,1,o.x[0],o.y[0],o.x[1],o.y[1],col,1);for(j=0;j<o.x.length;++j){scol="#fff";if((this.selectedDot==j)&&(col=="#ff0000"))
scol=col;shivaLib.g.DrawCircle(this.ctx,scol,1,o.x[j],o.y[j],4,col,1);}}}
SHIVA_Draw.prototype.AddDot=function(x,y,up)
{var o;if(this.curSeg==-1){if(this.curTool&&up)
return;if(new Date().getTime()-this.lastDotTime<100)
return;o=new Object;o.type=this.curTool;o.x=new Array();o.y=new Array();o.alpha=this.alpha;o.curve=this.curve;if(shivaLib.player)
o.s=this.startTime,o.e=this.endTime;if(o.type<3){o.color=this.color;o.edgeColor=this.edgeColor;o.edgeWidth=this.edgeWidth;o.arrow=this.arrow;}
if(o.type==3){o.boxColor=this.boxColor;o.textColor=this.textColor;o.textAlign=this.textAlign;o.textSize=this.textSize;o.text="Click to edit";}
if(o.type==4){o.edgeColor=this.edgeColor;o.edgeWidth=this.edgeWidth;o.imageURL=this.imageURL;}
o.x.push(x);o.y.push(y);this.lastX=x;this.lastY=y;this.segs.push(o);this.curSeg=this.segs.length-1;this.lastDotTime=new Date().getTime();return;}
if(this.curTool==0){this.segs[this.curSeg].x.push(x);this.segs[this.curSeg].y.push(y);this.lastX=x;this.lastY=y;this.lastDotTime=new Date().getTime();}
else{if((Math.abs(this.lastX-x)<2)&&(Math.abs(this.lastX-x)<2)){$("#shtx"+this.curSeg).remove();this.segs.pop(0);this.curSeg=-1;}
else{o=this.segs[this.curSeg];if(this.curTool==3){x=Math.max(x,o.x[o.x.length-1]+100);y=Math.max(y,o.y[o.y.length-1]+40);}
o.x.push(x);o.y.push(y);this.curSeg=-1;}}
this.DrawOverlay();}
SHIVA_Draw.prototype.SetVal=function(prop,val)
{if((""+prop).match(/olor/)){if((""+val).match(/none/))
val=-1;if((val!=-1)&&(!(""+val).match(/#/)))
val="#"+val;}
var num=this.curSeg;if((prop=="startTime")||(prop=="endTime")){var time=shivaLib.player.currentTime();val=Math.floor(time/60)+":";val+=Math.ceil(time%60);this[prop]=val;this.DrawMenu();shivaLib.Sound("click");}
this[prop]=val;if((this.curTool<3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].arrow=this.arrow;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].color=this.color;this.DrawOverlay();}
if((this.curTool==3)&&(num!=-1)){this.segs[num].curve=this.curve;this.segs[num].boxColor=this.boxColor;this.segs[num].textSize=this.textSize;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].alpha=this.alpha;}
if((this.curTool==4)&&(num!=-1)){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}
else if(this.curTool==5){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].alpha=this.alpha;this.segs[num].curve=this.curve;if(this.segs[num].type<3){this.segs[num].color=this.color;this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].arrow=this.arrow;}
else if(this.segs[num].type==3){this.segs[num].boxColor=this.boxColor;this.segs[num].textColor=this.textColor;this.segs[num].textAlign=this.textAlign;this.segs[num].textSize=this.textSize;}
else if(this.segs[num].type==4){this.segs[num].edgeColor=this.edgeColor;this.segs[num].edgeWidth=this.edgeWidth;this.segs[num].alpha=this.alpha;this.segs[num].imageURL=this.imageURL;}
if(shivaLib.player){this.segs[num].s=this.startTime;this.segs[num].e=this.endTime;}}
this.DrawOverlay();this.DrawWireframes(false);}
else if(this.curTool==6){for(var i=0;i<this.selectedItems.length;++i){num=this.selectedItems[i];this.segs[num].ideaBackCol=this.ideaBackCol;this.segs[num].ideaEdgeCol=this.ideaEdgeCol;this.segs[num].ideaTextCol=this.ideaTextCol;this.segs[num].ideaGradient=this.ideaGradient;this.segs[num].ideaBold=this.ideaBold;this.segs[num].ideaShape=this.ideaShape;}
this.DrawOverlay();}}
SHIVA_Draw.prototype.SetTool=function(num)
{$("#shivaDrawDiv").css('pointer-events','auto');this.curTool=num;if(num==6)
$("#shivaDrawDiv").css("cursor","auto");else
$("#shivaDrawDiv").css("cursor","crosshair");if(this.curTool==-1){shivaLib.Sound("delete");$("#shivaDrawDiv").css("cursor","auto");$("#shivaDrawDiv").css('pointer-events','none');$("#shivaDrawPaletteDiv").remove();}
else
shivaLib.Sound("click");this.DrawOverlay()
this.curSeg=-1;if(this.curTool==5){this.selectedItems=[];if(this.segs.length>0){var s=this.segs.length-1;this.AddSelect(-1,s,false);this.DrawMenu(this.segs[s].type);}
$("#shivaDrawDiv").css("cursor","auto");this.DrawWireframes(false);}
else if(this.curTool!=-1)
this.DrawMenu();}
SHIVA_Draw.prototype.onMouseUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return true;if(shivaLib.dr.curTool==5)
e.stopPropagation();shivaLib.dr.leftClick=false;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(e.shiftKey){if(Math.abs(x-shivaLib.dr.lastX)>Math.abs(y-shivaLib.dr.lastY))
y=shivaLib.dr.lastY;else
x=shivaLib.dr.lastX;}
if(shivaLib.dr.closeOnMouseUp){shivaLib.dr.closeOnMouseUp=false;shivaLib.dr.curSeg=-1;return true;}
if(shivaLib.dr.curTool<5){if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if((shivaLib.dr.curTool)&&(e.target.id.indexOf("shtx")==-1))
shivaLib.dr.AddDot(x,y,true);}
else if(shivaLib.dr.curTool>4)
shivaLib.dr.AddSelect(x,y,e.shiftKey);return(shivaLib.dr.curTool==6);}
SHIVA_Draw.prototype.onMouseDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if(shivaLib.dr.curTool==6)
return true;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;shivaLib.dr.leftClick=true;shivaLib.dr.closeOnMouseUp=false;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if(shivaLib.dr.curTool==5){shivaLib.dr.lastX=x;shivaLib.dr.lastY=y;e.stopPropagation();return false;}
if(e.target.id.indexOf("shtx")!=-1)
return;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);shivaLib.dr.AddDot(x,y,false);return false;}
SHIVA_Draw.prototype.onMouseMove=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((shivaLib.dr.curTool==6)||(shivaLib.dr.curTool==-1))
return;var x=e.pageX-this.offsetLeft;var y=e.pageY-this.offsetTop;if(shivaLib.dr.snap)
x=x-(x%shivaLib.dr.snapSpan),y=y-(y%shivaLib.dr.snapSpan);if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==5)){var dx=shivaLib.dr.lastX-x;var dy=shivaLib.dr.lastY-y;shivaLib.dr.MoveSegs(dx,dy,0);shivaLib.dr.lastX=x;shivaLib.dr.lastY=y;return;}
if(shivaLib.dr.curSeg!=-1){if(shivaLib.dr.curTool!=5)
shivaLib.dr.DrawOverlay();if(e.shiftKey){if(Math.abs(x-shivaLib.dr.lastX)>Math.abs(y-shivaLib.dr.lastY))
y=shivaLib.dr.lastY;else
x=shivaLib.dr.lastX;}
if(shivaLib.dr.curTool==0)
shivaLib.g.DrawLine(shivaLib.dr.ctx,"#000",1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,1);else if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==1))
shivaLib.g.DrawCircle(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,Math.abs(x-shivaLib.dr.lastX),"#999",1);else if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool<5))
shivaLib.g.DrawBar(shivaLib.dr.ctx,-1,1,shivaLib.dr.lastX,shivaLib.dr.lastY,x,y,"#999",1);if((shivaLib.dr.leftClick)&&(shivaLib.dr.curTool==0)){if(new Date().getTime()-shivaLib.dr.lastDotTime>100){shivaLib.dr.AddDot(x,y);shivaLib.dr.closeOnMouseUp=true;}}}}
SHIVA_Draw.prototype.onKeyDown=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.keyCode==8)&&(e.target.tagName!="TEXTAREA")&&(e.target.tagName!="INPUT")){e.stopPropagation();return false;}}
SHIVA_Draw.prototype.onKeyUp=function(e)
{if($("#shivaDrawPaletteDiv").length==0)
return;if((e.which==83)&&(e.ctrlKey)&&(e.altKey)){shivaLib.SaveData("eStore");return;}
var i;if((e.target.tagName=="TEXTAREA")||(e.target.tagName=="INPUT"))
return;if((e.which==67)&&(e.ctrlKey)){if(shivaLib.dr.selectedItems.length){shivaLib.Sound("click");shivaLib.dr.clipboard=[];}
for(i=0;i<shivaLib.dr.selectedItems.length;++i)
shivaLib.dr.clipboard.push(shivaLib.Clone(shivaLib.dr.segs[shivaLib.dr.selectedItems[i]]));}
if((e.which==86)&&(e.ctrlKey)){if(shivaLib.dr.clipboard.length){shivaLib.dr.selectedItems=[];shivaLib.Sound("ding");for(i=0;i<shivaLib.dr.clipboard.length;++i){shivaLib.dr.selectedItems.push(shivaLib.dr.segs.length);shivaLib.dr.segs.push(shivaLib.Clone(shivaLib.dr.clipboard[i]));}}}
if(shivaLib.dr.curTool==6){num=shivaLib.dr.selectedItems[0];if(((e.which==8)||(e.which==46))&&(num!=-1))
shivaLib.dr.DeleteIdea();}
var num=shivaLib.dr.curSeg;if(((e.which==8)||(e.which==46))&&(num!=-1)){var o=shivaLib.dr.segs[num];o.x.pop();o.y.pop();shivaLib.dr.lastX=o.x[o.x.length-1];shivaLib.dr.lastY=o.y[o.y.length-1];shivaLib.dr.DrawOverlay();shivaLib.Sound("delete");}
if((e.which==27)&&(num!=-1)){shivaLib.dr.curSeg=-1;shivaLib.Sound("dclick");}
else if(shivaLib.dr.curTool==5){if((e.which==8)||(e.which==46)){if(shivaLib.dr.selectedItems.length){num=shivaLib.dr.selectedItems[0];if((shivaLib.dr.selectedDot!=-1)&&(shivaLib.dr.segs[num].type==0)){shivaLib.dr.segs[num].x.splice(shivaLib.dr.selectedDot,1);shivaLib.dr.segs[num].y.splice(shivaLib.dr.selectedDot,1);}
else if(e.target.id.indexOf("shtx")==-1)
for(var i=0;i<shivaLib.dr.selectedItems.length;++i){$("#shtx"+shivaLib.dr.selectedItems[i]).remove();$("#shim"+shivaLib.dr.selectedItems[i]).remove();shivaLib.dr.segs.splice(shivaLib.dr.selectedItems[i],1);}
shivaLib.dr.DrawOverlay();shivaLib.dr.DrawWireframes(false);shivaLib.Sound("delete");}}
else if((e.which==40)&&(e.shiftKey))shivaLib.dr.MoveSegs(0,0,-1);else if((e.which==38)&&(e.shiftKey))shivaLib.dr.MoveSegs(0,0,1);else if(e.which==39)shivaLib.dr.MoveSegs(-1,0,0);else if(e.which==37)shivaLib.dr.MoveSegs(1,0,0);else if(e.which==40)shivaLib.dr.MoveSegs(0,-1,0);else if(e.which==38)shivaLib.dr.MoveSegs(0,1,0);}}
SHIVA_Draw.prototype.AddSelect=function(x,y,shiftKey)
{var i,j,o,seg=-1,asp;var oldDot=this.selectedDot;this.selectedDot=-1;var last=this.selectedItems[0];if(x!=-1){if(!shiftKey){this.selectedItems=[];$("#shivaDrawDiv").css("cursor","auto");}
if(this.curTool==6){for(i=0;i<this.segs.length;++i){o=this.segs[i];if(o.type!=5)
continue;var d=$("#shivaIdea"+i);if((x>o.ideaLeft)&&(x<Number(o.ideaLeft)+Number(d.width())+16)&&(y>o.ideaTop)&&(y<Number(o.ideaTop)+Number(d.height())+16)){this.selectedItems.push(i);this.ideaShape=o.ideaShape;this.ideaBackCol=o.ideaBackCol;this.ideaGradient=o.ideaGradient;this.ideaEdgeCol=o.ideaEdgeCol;this.ideaTextCol=o.ideaTextCol;this.ideaBold=o.ideaBold;this.SetMenuProperties();this.selectedItems[0]=i;break;}}
this.HighlightIdea();return;}
for(i=0;i<this.segs.length;++i){o=this.segs[i];if((!o.x)||(o.type==5))
continue;for(j=0;j<o.x.length;++j)
if((x>o.x[j]-6)&&(x<o.x[j]+6)&&(y>o.y[j]-6)&&(y<o.y[j]+6)){if(last==i)
this.selectedDot=j;seg=i;break;}}
if(seg==-1){for(i=0;i<this.segs.length;++i){var minx=99999,maxx=0,miny=99999,maxy=0;o=this.segs[i];if(o.type==5)
continue;if(o.type==1){j=Math.abs(o.x[1]-o.x[0]);minx=o.x[0]-j;maxx=o.x[1];miny=o.y[0]-j;maxy=Number(o.y[0])+j;}
else
for(j=0;j<o.x.length;++j){minx=Math.min(minx,o.x[j]);miny=Math.min(miny,o.y[j]);maxx=Math.max(maxx,o.x[j]);maxy=Math.max(maxy,o.y[j]);}
if((x>minx)&&(x<maxx)&&(y>miny)&&(y<maxy)){seg=i;break;}}}}
else
seg=y;if(seg!=-1){o=this.segs[seg];if(this.selectedDot!=-1){$("#shivaDrawDiv").css("cursor","crosshair");if(oldDot!=this.selectedDot)
shivaLib.Sound("dclick");}
else{$("#shivaDrawDiv").css("cursor","move");shivaLib.Sound("click");}
this.selectedItems.push(seg);this.alpha=o.alpha;this.startTime=o.s;this.endTime=o.e;this.curve=o.curve;if(o.type<3){this.arrow=o.arrow;this.curve=o.curve;this.color=o.color;this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;}
else if(o.type==3){this.curve=o.curve;this.textColor=o.textColor;this.boxColor=o.boxColor;this.textSize=o.textSize;this.textAlign=o.textAlign;}
else if(o.type==4){o=this.segs[seg];asp=$("#shimi"+seg).height()/$("#shimi"+seg).width();if(!asp)asp=1;if(!isNaN(asp))
o.y[1]=o.y[0]+(Math.abs(o.x[1]-o.x[0])*asp);this.edgeColor=o.edgeColor;this.edgeWidth=o.edgeWidth;this.DrawOverlay();}
this.DrawMenu(o.type);this.SetMenuProperties();}
this.DrawWireframes(false);}
SHIVA_Draw.prototype.MoveSegs=function(dx,dy,dz)
{var i,j,o,oo;for(i=0;i<this.selectedItems.length;++i){o=this.segs[this.selectedItems[i]];if(o.type==5)
continue;if(dz){if((this.selectedItems[i]+dz<0)||(this.selectedItems[i]+dz>=this.segs.length)){shivaLib.Sound("delete");continue;}
oo=this.segs[this.selectedItems[i]+dz];this.segs[this.selectedItems[i]+dz]=o;this.segs[this.selectedItems[i]]=oo;this.selectedItems[i]+=dz;shivaLib.Sound("click");}
if(this.selectedDot!=-1)
o.x[this.selectedDot]-=dx,o.y[this.selectedDot]-=dy;else
for(j=0;j<o.x.length;++j)
o.x[j]-=dx,o.y[j]-=dy;}
this.DrawOverlay();this.DrawWireframes(false);}
SHIVA_Draw.prototype.AddIdea=function(num)
{var i,off=0;var o=new Object;if((num!=-1)&&(this.selectedItems.length))
num=this.selectedItems[0]
o.type=5;o.id=this.segs.length;o.ideaParent=num;o.ideaShape=this.ideaShape;o.ideaBackCol=this.ideaBackCol;o.ideaGradient=this.ideaGradient;o.ideaBold=this.ideaBold;o.ideaEdgeCol=this.ideaEdgeCol;o.ideaTextCol=this.ideaTextCol;o.text="A new idea";o.ideaHgt=21;o.ideaWid=100;if(num==-1){o.ideaLeft=$("#shivaDrawDiv").width()/2;o.ideaTop=$("#shivaDrawDiv").height()/2;}
else{for(i=0;i<this.segs.length;++i)
if(this.segs[i].ideaParent==num)
off+=10;o.ideaLeft=this.segs[num].ideaLeft+off;o.ideaTop=(Number(this.segs[num].ideaTop)+Number(this.segs[num].ideaHgt)+32+off);}
if(shivaLib.player)
o.s=this.startTime,o.e=this.endTime;num=this.selectedItems[0]=this.segs.length;;this.segs.push(o);shivaLib.Sound("ding");this.DrawOverlay();}
SHIVA_Draw.prototype.HighlightIdea=function()
{var i,dd;$("#shivaIdeaAddBut").remove();for(i=0;i<this.segs.length;++i){var wid=1;dd="#shivaIdea"+i;if(this.segs[i].ideaEdgeCol==-1)
$(dd).css("border","none");else
$(dd).css("border",wid+"px solid "+this.segs[i].ideaEdgeCol);}
if(this.selectedItems.length){dd="#shivaIdea"+this.selectedItems[0];$(dd).css("border","1px dashed red");var x=$(dd).width()/2;var y=$(dd).height();var str="<div id='shivaIdeaAddBut' style='position:absolute;top:"+y+"px;left:"+x+"px'><img src='adddot.gif' title='Add child idea' onmouseup='shivaLib.dr.AddIdea(0)'></div>"
$(dd).append(str);}}
SHIVA_Draw.prototype.DeleteIdea=function()
{if(!this.selectedItems.length)
return;num=this.selectedItems[0];if(this.segs[num].ideaParent!=-1){shivaLib.Sound("click");this.segs[num].ideaParent=-1;}
else{this.selectedItems=[];$("#shivaIdea"+num).remove();this.segs.splice(num,1);this.DeleteIdeaChildren(num);shivaLib.Sound("delete");}
this.DrawOverlay();}
SHIVA_Draw.prototype.DeleteIdeaChildren=function(parent)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){var id=this.segs[i].id;$("#shivaIdea"+id).remove();this.segs.splice(i,1);this.DeleteIdeaChildren(id);this.DeleteIdeaChildren(parent);break;}}}
SHIVA_Draw.prototype.MoveIdeaChildren=function(parent,dx,dy)
{var i;for(i=0;i<this.segs.length;++i){if(this.segs[i].type!=5)
continue;if(this.segs[i].ideaParent==parent){this.segs[i].ideaLeft=Number(this.segs[i].ideaLeft)+Number(dx);this.segs[i].ideaTop=Number(this.segs[i].ideaTop)+Number(dy);$("#shivaIdea"+i).css("left",this.segs[i].ideaLeft+"px").css("top",this.segs[i].ideaTop+"px");this.MoveIdeaChildren(i,dx,dy);}}}
SHIVA_Draw.prototype.IdeaDrop=function(from,to)
{this.segs[from].ideaParent=to;shivaLib.Sound("ding");}
function SHIVA_Graphics()
{this.shadowOffX=this.shadowOffY=this.curShadowCol=this.curShadowBlur=0;this.composite="source-over";}
SHIVA_Graphics.prototype.CreateCanvas=function(id,con,wid,hgt,left,top)
{var str="<canvas id='"+id+"' ";if(wid)str+="width='"+wid+"px' ";if(hgt)str+="height='"+hgt+"px' ";str+="/>";var mc=$(str).appendTo("#"+con);if(left||top)
mc.style.position="absolute";if(left)mc.style.left=left;if(top)mc.style.top=top;return mc;}
SHIVA_Graphics.prototype.DeleteCanvas=function(id)
{var mc=null;if(typeof(id)=="object")
mc=id;else
mc=document.getElementById(id);if(mc)
document.body.removeChild(mc);}
SHIVA_Graphics.prototype.Compositing=function(ctx,compositeMode,alpha)
{ctx.globalCompositeOperation=this.composite=compositeMode;if(alpha!=undefined)
ctx.globalAlpha=this.alpha=alpha;}
SHIVA_Graphics.prototype.DrawBar=function(ctx,col,alpha,x1,y1,x2,y2,edgeCol,edgeWid)
{ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fillRect(x1,y1,x2-x1,y2-y1);}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.strokeRect(x1,y1,x2-x1,y2-y1);}}
SHIVA_Graphics.prototype.DrawRoundBar=function(ctx,col,alpha,x1,y1,x2,y2,rad,edgeCol,edgeWid)
{ctx.beginPath();ctx.globalAlpha=alpha;ctx.moveTo(x1+rad,y1);ctx.lineTo(x2-rad,y1);ctx.arcTo(x2,y1,x2,y1+8,rad);ctx.lineTo(x2,y2-rad);ctx.arcTo(x2,y2,x2-rad,y2,rad);ctx.lineTo(x1+rad,y2);ctx.arcTo(x1,y2,x1,y2-rad,rad);ctx.lineTo(x1,y1+rad);ctx.arcTo(x1,y1,x1+rad,y1,rad);if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawLine=function(ctx,col,alpha,x1,y1,x2,y2,edgeWid)
{ctx.beginPath();ctx.globalAlpha=alpha;ctx.lineWidth=edgeWid;ctx.strokeStyle=col;ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.closePath();}
SHIVA_Graphics.prototype.DrawRubberLine=function(ctx,x1,y1,x2,y2,edgeWid)
{ctx.globalCompositeOperation="xor";ctx.beginPath();ctx.globalAlpha=1;ctx.lineWidth=1;ctx.strokeStyle="#000";ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();ctx.closePath();ctx.globalCompositeOperation="source-over";}
SHIVA_Graphics.prototype.DrawRubberBox=function(ctx,x1,y1,x2,y2,edgeWid)
{ctx.globalCompositeOperation="xor";ctx.beginPath();ctx.globalAlpha=1;ctx.lineWidth=1;ctx.strokeStyle="#000";ctx.strokeRect(x1,y1,x2-x1,y2-y1);ctx.globalCompositeOperation="source-over";}
SHIVA_Graphics.prototype.DrawCircle=function(ctx,col,alpha,cx,cy,rad,edgeCol,edgeWid)
{ctx.beginPath();ctx.arc(cx,cy,rad,0,Math.PI*2,false);ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawWedge=function(ctx,col,alpha,cx,cy,rad,start,end,edgeCol,edgeWid)
{var span=end-start;if(!span)
return;ctx.beginPath();if(span<360)
ctx.moveTo(cx,cy);ctx.arc(cx,cy,rad,(start/360)*Math.PI*2,(end/360)*Math.PI*2,false);if(span<360)
ctx.lineTo(cx,cy);ctx.globalAlpha=alpha;if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineCap="round";ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.DrawTriangle=function(ctx,col,alpha,x,y,wid,dir)
{var wid2=(wid*4.0/5.0)>>0;ctx.beginPath();ctx.globalAlpha=alpha;ctx.fillStyle=col;if(dir=="up"){ctx.moveTo(x,y-wid2);ctx.lineTo(x+wid,y+wid2);ctx.lineTo(x-wid,y+wid2);ctx.lineTo(x,y-wid2);}
else if(dir=="right"){ctx.moveTo(x-wid2,y-wid);ctx.lineTo(x+wid2,y);ctx.lineTo(x-wid2,y+wid);ctx.lineTo(x-wid2,y-wid);}
else if(dir=="down"){ctx.moveTo(x-wid,y-wid2);ctx.lineTo(x+wid,y-wid2);ctx.lineTo(x,y+wid2);ctx.lineTo(x-wid,y-wid2);}
else if(dir=="left"){ctx.moveTo(x-wid2,y);ctx.lineTo(x+wid2,y-wid);ctx.lineTo(x+wid2,y+wid);ctx.lineTo(x-wid2,y);}
ctx.fill();ctx.closePath();}
SHIVA_Graphics.prototype.DrawPolygon=function(ctx,col,alpha,x,y,edgeCol,edgeWid,smooth)
{var n=x.length;ctx.beginPath();ctx.moveTo(x[0],y[0]);ctx.globalAlpha=alpha;var open=true;if((Math.abs(x[0]-x[x.length-1])<3)&&(Math.abs(y[0]-y[y.length-1])<3)){x[x.length-1]=x[0];y[y.length-1]=y[0];open=false;}
if(smooth){var x1=x[0]-0+((x[1]-x[0])/2)-0;var y1=y[0]-0+((y[1]-y[0])/2)-0;if(open)
ctx.lineTo(x1,y1);for(i=1;i<n-1;++i){x1=x[i]-0+((x[i+1]-x[i])/2)-0;y1=y[i]-0+((y[i+1]-y[i])/2)-0;ctx.quadraticCurveTo(x[i],y[i],x1,y1);}
if(open)
ctx.lineTo(x[i],y[i]);}
else
for(i=0;i<n;++i)
ctx.lineTo(x[i],y[i]);if(col!=-1){ctx.fillStyle=col;ctx.fill();}
if(edgeWid){ctx.lineCap="round";ctx.lineWidth=edgeWid;ctx.strokeStyle=edgeCol;if(col!=-1)
ctx.lineTo(x[0],y[0]);ctx.stroke();}
ctx.closePath();}
SHIVA_Graphics.prototype.SetShadow=function(ctx,offx,offy,blur,col,comp)
{if(!offx){offx=offy=blur=col=0;comp="source-over";}
if(offx!=undefined)ctx.shadowOffsetX=offx;if(offy!=undefined)ctx.shadowOffsetY=offy;if(blur!=undefined)ctx.shadowBlur=blur;if(col!=undefined)ctx.shadowColor=col;if(comp!=undefined)ctx.globalCompositeOperation=comp;}
SHIVA_Graphics.prototype.AddGradient=function(ctx,id,x1,y1,x2,y2,col1,col2,r1,r2)
{if(!r1)
ctx[id]=ctx.createLinearGradient(x1,y1,x2,y2);else
ctx[id]=ctx.createRadialGradient(x1,y1,r1,x2,y2,r2);if(!col1)col1="#000000";if(!col2)col2="#ffffff";ctx[id].addColorStop(0,col1);ctx[id].addColorStop(1,col2);}
SHIVA_Graphics.prototype.GetImage=function(ctx,file,left,top,wid,hgt)
{var image=new Image();image.src=file;image.onload=function(){var asp=image.height/image.width;if(!wid&&!hgt)
wid=image.width,hgt=image.height
else if(!wid&&hgt)
wid=hgt/asp;else if(wid&&!hgt)
hgt=wid*asp;ctx.drawImage(image,left,top,wid,hgt)}
return image;}
SHIVA_Graphics.prototype.resolveID=function(id)
{if(typeof(id)!="object")
id=document.getElementById(id);return id;}
SHIVA_Graphics.prototype.AddListener=function(id,eventType,handler)
{$("#"+id)[0].addEventListener(eventType,handler,false);}
SHIVA_Graphics.prototype.RemoveListener=function(id,eventType,handler)
{this.resolveID(id).removeEventListener(eventType,handler,false);}
SHIVA_Graphics.prototype.SetDrag=function(id,mode)
{id=$("#"+id);id.g=this;id.draggable=mode;if(!mode)
this.removeListener(id,'mousedown',dragDown);else
this.addListener(id,'mousedown',dragDown)
function dragDown(e){if(!e.target.draggable)
return
e.target.dragX=e.pageX-e.target.style.left.slice(0,-2);e.target.dragY=e.pageY-e.target.style.top.slice(0,-2)
e.target.g.addListener(e.target,'mousemove',dragMove)
e.target.g.addListener(e.target,'mouseup',dragUp)
e.target.inDrag=true;}
function dragMove(e){e.target.style.left=e.pageX-e.target.dragX;e.target.style.top=e.pageY-e.target.dragY;}
function dragUp(e){e.target.g.removeListener(e.target,'mousemove',dragMove)
e.target.g.removeListener(e.target,'mouseup',dragUp)
e.target.inDrag=false;}}
SHIVA_Graphics.prototype.SecsToTime=function(time,frameRate)
{var timecode="";if(!frameRate)
frameRate=24;time/=1000;var mins=(time/60)>>0;var secs=(time%60)>>0;var frms=((time-(secs+(mins*60)))*frameRate)>>0;if(mins<10)
timecode+="0";timecode+=mins+":";if(secs<10)
timecode+="0";timecode+=secs+":";if(frms<10)
timecode+="0";timecode+=frms;return timecode}
SHIVA_Graphics.prototype.SetTextFormat=function(ctx,format)
{var v=format.split(",");var pair,key,val;var bold="",ital="",font="",size="12";for(var i=0;i<v.length;++i){pair=v[i].split("=")
key=pair[0];val=pair[1];if(key=="align")ctx.textAlign=val;if(key=="color")ctx.fillStyle=val;if(key=="font")font=val;if(key=="size")size=val+"px";if(key=="bold")bold="bold";if(key=="italic")ital="italic";}
if(font)
ctx.font=bold+" "+ital+" "+size+" "+font;return size.substring(0,size.length-2);}
SHIVA_Graphics.prototype.DrawText=function(ctx,text,x,y,format)
{try{if(format)
this.SetTextFormat(ctx,format);ctx.fillText(text,x,y);}catch(e){};}
SHIVA_Show.prototype.DrawEarth=function()
{if(!this.map){this.map="no";google.earth.createInstance(this.container,$.proxy(initCB,this));return;}
if(this.map=="no")
return;if(!this.options)
return;var ops=this.options;this.items=[];for(var key in ops){if(ops[key]=="true")ops[key]=true;if(ops[key]=="false")ops[key]=false;if(key.indexOf("item-")!=-1){var o=new Object;v=ops[key].split(';');for(i=0;i<v.length;++i){vv=v[i].split(':');if(vv[1].indexOf("http")==-1)
vv[1]=vv[1].replace(/~/g,"=");o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");}
this.items.push(o);}}
$("#"+this.container).height(ops.height);$("#"+this.container).width(ops.width);var ge=this.map;var lookAt=ge.createLookAt('');var v=ops.mapcenter.split(",");lookAt.setLatitude(Number(v[0]));lookAt.setLongitude(Number(v[1]));lookAt.setRange(Number(ops.range));lookAt.setTilt(Number(ops.tilt));lookAt.setHeading(Number(ops.heading));ge.getView().setAbstractView(lookAt);if(ops.panControl)
ge.getNavigationControl().setVisibility(ge.VISIBILITY_AUTO);else
ge.getNavigationControl().setVisibility(ge.VISIBILITY_HIDE);ge.getNavigationControl().getScreenXY().setYUnits(ge.UNITS_INSET_PIXELS);ge.getNavigationControl().getScreenXY().setXUnits(ge.UNITS_PIXELS);ge.getOptions().setOverviewMapVisibility((ops.overviewMapControl));ge.getOptions().setMouseNavigationEnabled((ops.draggable));if(ops.scrollwheel)
ge.getOptions().setScrollWheelZoomSpeed(1);else
ge.getOptions().setScrollWheelZoomSpeed(.0000000001)
ge.getOptions().setTerrainExaggeration(Number(ops.terrainexag));ge.getLayerRoot().enableLayerById(ge.LAYER_BORDERS,ops.borders);ge.getLayerRoot().enableLayerById(ge.LAYER_ROADS,ops.roads);ge.getLayerRoot().enableLayerById(ge.LAYER_TERRAIN,true);this.DrawEarthOverlays();this.DrawLayerControlBox(this.items,ops.controlbox);function initCB(instance){this.map=instance;this.map.getWindow().setVisibility(true);this.DrawEarth();if(typeof(ShivaPostInit)=="function")
ShivaPostInit();google.earth.addEventListener(this.map.getGlobe(),'click',function(e){var str=e.getLatitude()+"|"+e.getLongitude()+"|"+e.getClientX()+"|"+e.getClientY();shivaLib.SendShivaMessage("ShivaEarth=click|"+window.name+"|"+str);});google.earth.addEventListener(shivaLib.map.getView(),'viewchangeend',function(){var lookAt=shivaLib.map.getView().copyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);var view=Math.floor(lookAt.getLatitude()*10000)/10000+"|"+Math.floor(lookAt.getLongitude()*10000)/10000+"|";view+=Math.floor(lookAt.getRange())+"|"+Math.floor(lookAt.getTilt()*100)/100+"|"+Math.floor(lookAt.getHeading()*100)/100;shivaLib.SendShivaMessage("ShivaEarth=move|"+window.name+"|"+view);});}
this.SendReadyMessage(true);}
SHIVA_Show.prototype.DrawEarthOverlays=function()
{var i,v,opacity,obj;var items=this.items;var lookAt=this.map.getView().copyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);lookAt.setLatitude(Number(this.options.mapcenter.split(",")[0]));lookAt.setLongitude(Number(this.options.mapcenter.split(",")[1]));lookAt.setRange(Number(this.options.range));lookAt.setTilt(Number(this.options.tilt));lookAt.setHeading(Number(this.options.heading));for(i=0;i<items.length;++i){opacity=1;obj=shivaLib.map.getElementById("Layer-"+(i+1));if(items[i].layerType=="GoTo"){v=items[i].layerSource.split(",");if((v.length>1)&&(items[i].visible=="true")){if(v[0]!=undefined)lookAt.setLatitude(Number(v[0]));if(v[1]!=undefined)lookAt.setLongitude(Number(v[1]));if(v[2]!=undefined)lookAt.setRange(Number(v[2]));if(v[3]!=undefined)lookAt.setTilt(Number(v[3]));if(v[4]!=undefined)lookAt.setHeading(Number(v[4]));}}
if(items[i].layerType=="Overlay"){if(!obj){obj=this.map.createGroundOverlay("Layer-"+(i+1));this.map.getFeatures().appendChild(obj);}
if(items[i].listener)
google.earth.removeEventListener(obj,'click',null)
v=items[i].layerOptions.split(",");var icon=this.map.createIcon('');icon.setHref(items[i].layerSource);obj.setIcon(icon);var latLonBox=this.map.createLatLonBox('');latLonBox.setBox(Number(v[2]),Number(v[0]),Number(v[1]),Number(v[3]),0);obj.setLatLonBox(latLonBox);if(v.length==5)
opacity=v[4]/100;}
if(items[i].layerType=="KML"){var link=this.map.createLink('');link.setHref(items[i].layerSource);if(!obj){obj=this.map.createNetworkLink("Layer-"+(i+1));this.map.getFeatures().appendChild(obj);}
var fly=(items[i].layerOptions.toLowerCase().indexOf("port")==-1)
obj.set(link,true,fly);items[i].listener=google.earth.addEventListener(obj,'click',function(e){var str=i+"|"+e.getLatitude()+"|"+e.getLongitude();shivaLib.SendShivaMessage("ShivaEarth=kml|"+window.name+"|"+str);});}
if(items[i].layerType=="MarkerSet"){this.items[i].obj=[];this.markerData=i;this.GetGoogleSpreadsheet(items[i].layerSource,function(d){_this.EarthAddMarkers(d,_this.items[_this.markerData].obj)});}
if(obj){obj.setOpacity(opacity);obj.setVisibility(items[i].visible=="true");}}
this.map.getView().setAbstractView(lookAt);}
SHIVA_Show.prototype.EarthActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaActEarth=goto"){var lookAt=shivaLib.map.getView().co
pyAsLookAt(shivaLib.map.ALTITUDE_RELATIVE_TO_GROUND);if(v[1]!=undefined)lookAt.setLatitude(Number(v[1]));if(v[2]!=undefined)lookAt.setLongitude(Number(v[2]));if(v[3]!=undefined)lookAt.setRange(Number(v[3]));if(v[4]!=undefined)lookAt.setTilt(Number(v[4]));if(v[5]!=undefined)lookAt.setHeading(Number(v[5]));shivaLib.map.getView().setAbstractView(lookAt);}
else if((v[0]=="ShivaActEarth=show")||(v[0]=="ShivaActEarth=hide")){if(this.items[v[1]])
this.items[v[1]].visible=(v[0]=="ShivaActEarth=show").toString();this.DrawEarthOverlays();}
else if(v[0]=="ShivaActEarth=data"){if(v[1])
this.EarthAddMarkers(v[1]);}}
SHIVA_Show.prototype.EarthAddMarkers=function(json,mData)
{}
SHIVA_Show.prototype.DrawMap=function()
{var v,vv,i;var container=this.container;var ops=this.options;var latlng=new google.maps.LatLng(-34.397,150.644);var mapType=ops.mapTypeId.toUpperCase();if(mapType=="LAND")
ops.mapTypeId=mapType;else
ops.mapTypeId=google.maps.MapTypeId[mapType];var ll=ops.mapcenter.split(",")
latlng=new google.maps.LatLng(ll[0],ll[1]);ops.center=latlng;ops.zoom=Number(ll[2]);this.mapsInfoWindow=new google.maps.InfoWindow({maxWidth:300});this.items=[];for(var key in ops){if(ops[key]=="true")ops[key]=true;if(ops[key]=="false")ops[key]=false;if(key.indexOf("item-")!=-1){var o=new Object;v=ops[key].split(';');for(i=0;i<v.length;++i){vv=v[i].split(':');if(vv[1].indexOf("http")==-1)
vv[1]=vv[1].replace(/~/g,"=");o[vv[0]]=vv[1].replace(/\^/g,"&").replace(/\`/g,":");}
this.items.push(o);}}
$("#"+this.container).height(ops.height);$("#"+this.container).width(ops.width);ops["mapTypeControlOptions"]={"mapTypeIds":[google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.TERRAIN,google.maps.MapTypeId.SATELLITE,google.maps.MapTypeId.HYBRID,"LAND"],style:google.maps.MapTypeControlStyle.DROPDOWN_MENU};this.map=new google.maps.Map(document.getElementById(container),ops);this.AddClearMapStyle(this.map);this.AddBlankMapStyle(this.map);this.DrawMapOverlays();this.DrawLayerControlBox(this.items,this.options.controlbox);this.SendReadyMessage(true);google.maps.event.addListener(this.map,'click',function(e){var l=e.latLng.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");var p=e.pixel.toString().replace(/\(/,"").replace(/, /,"|").replace(/\)/,"");shivaLib.SendShivaMessage("ShivaMap=click|"+window.name+"|"+l+"|"+p);});google.maps.event.addListener(this.map,'center_changed',function(e){var map=shivaLib.map;var lat=map.getCenter();shivaLib.SendShivaMessage("ShivaMap=move|"+window.name+"|"+lat.lat()+"|"+lat.lng()+"|"+map.getZoom());});}
SHIVA_Show.prototype.AddInternalOptions=function(options,newOps)
{var i,vv;if(newOps){var v=newOps.split(',');for(i=0;i<v.length;++i){vv=v[i].split("=");if(vv[1]=='true')vv[1]=true;if(vv[1]=='false')vv[1]=false;options[vv[0]]=vv[1];}}}
SHIVA_Show.prototype.DrawMapOverlays=function()
{if(!this.items)
return;var i,j,latlng,v,ops,curZoom,curLatLon;var _this=this;var items=this.items;v=this.options.mapcenter.split(",")
curLatlng=new google.maps.LatLng(v[0],v[1]);curZoom=v[2];for(i=0;i<items.length;++i){ops=new Object();if(items[i].listener)
google.maps.event.removeListener(items[i].listener);if((items[i].obj)&&(items[i].layerType=="MarkerSet")){for(j=0;j<items[i].obj.length;++j){google.maps.event.removeListener(items[i].obj[j].listener);items[i].obj[j].obj.setMap(null);}
items[i].obj=null;}
else if(items[i].obj)
items[i].obj.setMap(null);if(items[i].layerType=="Drawn"){items[i].obj=new ShivaCustomMapOverlay()}
else if(items[i].layerType=="Marker"){items[i].obj=new google.maps.Marker();v=items[i].layerSource.split(",")
items[i].pos=latlng=new google.maps.LatLng(v[0],v[1]);ops["title"]=v[2];ops["position"]=latlng;if(v.length==4)
ops["icon"]=v[3]
if(ops&&items[i].obj)
items[i].obj.setOptions(ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){var j,v;for(j=0;j<_this.items.length;++j){v=_this.items[j].layerSource.split(",")
if(v[2]==this.title)
break;}
shivaLib.SendShivaMessage("ShivaMap=marker|"+window.name+"|"+this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);});}
else if(items[i].layerType=="MarkerSet"){if(items[i].visible=="true"){this.items[i].obj=[];this.markerData=i;this.GetGoogleSpreadsheet(items[i].layerSource,function(d){_this.MapAddMarkers(d,_this.items[_this.markerData].obj)});}
continue;}
else if(items[i].layerType=="Overlay"){v=items[i].layerOptions.split(",");var imageBounds=new google.maps.LatLngBounds(new google.maps.LatLng(v[2],v[1]),new google.maps.LatLng(v[0],v[3]));if(v.length==5)
ops["opacity"]=v[4]/100;if(items[i].layerSource)
items[i].obj=new google.maps.GroundOverlay(items[i].layerSource,imageBounds,ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){shivaLib.SendShivaMessage("ShivaMap=overlay|"+window.name+"|"+this.url+"|"+e.latLng.lat()+"|"+e.latLng.lng());});}
else if(items[i].layerType=="KML"){if(items[i].layerOptions){v=items[i].layerOptions.split(",");for(j=0;j<v.length;++j)
ops[v[j].split("=")[0]]=v[j].split("=")[1];}
items[i].obj=new google.maps.KmlLayer(items[i].layerSource,ops);items[i].listener=google.maps.event.addListener(items[i].obj,'click',function(e){var str=this.url+"|"+e.featureData.name+"|"+e.latLng.lat()+"|"+e.latLng.lng();shivaLib.SendShivaMessage("ShivaMap=kml|"+window.name+"|"+str);});}
else if((items[i].layerType=="GoTo")&&(items[i].visible=="true")){v=items[i].layerSource.split(",");if(v.length>1)
curLatlng=new google.maps.LatLng(v[0],v[1]);if(v.length>2)
curZoom=v[2];}
if((items[i].visible=="true")&&(items[i].obj))
items[i].obj.setMap(this.map);}
this.map.setCenter(curLatlng);this.map.setZoom(Number(curZoom));}
SHIVA_Show.prototype.MapActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaActMap=goto"){var curLatlng=new google.maps.LatLng(v[1],v[2]);this.map.setCenter(curLatlng);this.map.setZoom(Number(v[3]));}
else if((v[0]=="ShivaActMap=show")||(v[0]=="ShivaActMap=hide")){if(this.items[v[1]])
this.items[v[1]].visible=(v[0]=="ShivaActMap=show").toString();this.DrawMapOverlays();}
else if(v[0]=="ShivaActMap=data"){if(v[1])
this.MapAddMarkers(v[1]);}
else if(v[0]=="ShivaActMap=marker"){if(v[1]<this.markerData.length)
this.markerData[v[1]].obj.setMap(v[2]=="true"?this.map:null);}}
SHIVA_Show.prototype.MapAddMarkers=function(json,mData)
{var hasLines=false;var i,j,o,mark,list,ops;var flat,flon,tlat,tlon,col,alpha,width,coords,path;var _this=shivaLib;if(typeof(json)=="string"){json=$.parseJSON(json);var cols=json[0].length;for(i=1;i<json.length;++i){o={};for(j=0;j<cols;++j)
o[json[0][j]]=json[i][j];json[i]=o;}
json=json.slice(1);mData=this.markerData;if(mData){for(i=0;i<mData.length;++i){if(mData[i].listener)
google.maps.event.removeListener(mData[i].listener);mData[i].obj.setMap(null);}}
this.markerData=mData=[];}
for(i=0;i<json.length;++i){if(json[i].icon!="line")
continue;hasLines=true;alpha=1;width=2;col="#990000";if(json[i].width)
width=json[i].width;if(json[i].color){col=json[i].color;if(json[i].color.length>7){col=json[i].color.substr(0,7);alpha=parseInt(json[i].color.substr(7,2),16)/255;}}
flat=json[json[i].lat-2].lat;flon=json[json[i].lat-2].lon;tlat=json[json[i].lon-2].lat;tlon=json[json[i].lon-2].lon;path=new google.maps.Polyline({path:[new google.maps.LatLng(flat,flon),new google.maps.LatLng(tlat,tlon)],strokeColor:col,strokeOpacity:alpha,strokeWeight:width});path.setMap(shivaLib.map);mData.push({obj:path,title:"",listener:null});}
for(i=0;i<json.length;++i){if(json[i].icon=="line")
continue;mark=new google.maps.Marker();ops={};if(json[i].title)
ops["title"]=json[i].title;ops["position"]=new google.maps.LatLng(json[i].lat-0,json[i].lon-0);if(json[i].icon){if(hasLines)
ops["icon"]={url:json[i].icon,anchor:new google.maps.Point(8,8)};else
ops["icon"]=json[i].icon;}
mark.setOptions(ops);mark.setMap(shivaLib.map);list=google.maps.event.addListener(mark,'click',function(e){var j;for(j=0;j<mData.length;++j)
if(mData[j].title==this.title)
break;shivaLib.SendShivaMessage("ShivaMap=marker|"+window.name+"|"+this.title+"|"+e.latLng.lat()+"|"+e.latLng.lng()+"|"+j);if(mData[j].desc){shivaLib.mapsInfoWindow.setContent(mData[j].desc);shivaLib.mapsInfoWindow.open(this.map,this);}});mData.push({obj:mark,title:json[i].title,listener:list,desc:json[i].desc});}}
SHIVA_Show.prototype.DrawLayerControlBox=function(items,show)
{var i,hasGotos=false,hasLayers=false;if(!show){$("#shivaMapControlDiv").remove();return;}
var l=$("#"+this.container).css("left").replace(/px/g,"");var t=$("#"+this.container).css("top").replace(/px/g,"");var h=$("#"+this.container).css("height").replace(/px/g,"");if(t=="auto")t=8;if(l=="auto")l=8;if(this.options.shivaGroup=="Earth"){l=Number(l)+($("#"+this.container).css("width").replace(/px/g,"")-0)+8;t=24;h=0;}
if($("#shivaMapControlDiv").length==0){str="<div id='shivaMapControlDiv' style='position:absolute;left:"+l+"px;top:"+((t-0)+(h-0)-24)+"px'>";$("body").append("</div>"+str);$("#shivaMapControlDiv").addClass("rounded-corners").css("background-color","#eee").css('border',"1px solid #ccc");$("#shivaMapControlDiv").draggable();$("#shivaMapControlDiv").css("z-index",2001);}
var str="<p style='text-shadow:1px 1px white' align='center'><b>&nbsp;&nbsp;Controls&nbsp;&nbsp;</b></p>";for(i=0;i<items.length;++i){if((items[i].layerTitle)&&(items[i].layerType!="GoTo"))
hasLayers=true;else if((items[i].layerTitle)&&(items[i].layerType=="GoTo"))
hasGotos=true;}
if(this.options.shivaGroup=="Poster"){hasLayers=false;hasGotos=true;}
if(hasLayers){str="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Show layer&nbsp;&nbsp;</b><br/>";for(i=0;i<items.length;++i)
if((items[i].layerTitle)&&(items[i].layerType!="GoTo")){str+="&nbsp;<input type='checkbox' id='shcb"+i+"'";if(items[i].visible=="true")
str+=" checked=checked ";str+=">"+items[i].layerTitle+"&nbsp;&nbsp;<br/>";}
str+="</p>";}
if((hasGotos)||(this.options.shivaGroup=="Poster")){if(!hasLayers)str="";str+="<p style='text-shadow:1px 1px white'><b>&nbsp;&nbsp;Go to:&nbsp;&nbsp;</b><br/>";str+="&nbsp;<input type='radio' name='gotos' id='shcr"+items.length+"' checked=checked>Start&nbsp;&nbsp;&nbsp;<br/>";for(i=0;i<items.length;++i)
if((items[i].layerTitle)&&((items[i].layerType=="GoTo")||(this.options.shivaGroup=="Poster"))){str+="&nbsp;<input type='radio' name='gotos' id='shcr"+i+"'";if(items[i].visible=="true")
str+=" checked=checked ";str+=">"+items[i].layerTitle+"&nbsp;&nbsp;&nbsp;<br/>";}
str+="</p>";}
$("#shivaMapControlDiv").html(str+"<br/>");var _this=this;for(i=0;i<items.length;++i){if((items[i].layerType=="GoTo")||(this.options.shivaGroup=="Poster"))
$("#shcr"+i).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this);});else
$("#shcb"+i).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"?"),_this);});}
if(hasGotos)
$("#shcr"+items.length).click(function(){$.proxy(_this.SetLayer(this.id.substr(4),this.checked.toString(),"GoTo"),_this);});}
if((typeof(google)=="object")&&(google.maps))
ShivaCustomMapOverlay.prototype=new google.maps.OverlayView();function ShivaCustomMapOverlay(bounds,data)
{var swBound=new google.maps.LatLng(62.281819,-150.287132);var neBound=new google.maps.LatLng(62.400471,-150.005608);bounds=new google.maps.LatLngBounds(swBound,neBound);this.bounds_=bounds;this.data_=data;this.div_=null;}
ShivaCustomMapOverlay.prototype.onAdd=function()
{var div=document.createElement('div');div.style.border="none";div.style.borderWidth="0px";div.style.position="absolute";var img=document.createElement("img");img.src="http://www.viseyes.org/shiva/map.jpg";img.style.width="100%";img.style.height="100%";div.appendChild(img);this.div_=div;var panes=this.getPanes();panes.overlayLayer.appendChild(div);}
ShivaCustomMapOverlay.prototype.draw=function()
{var overlayProjection=this.getProjection();var sw=overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());var ne=overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());this.div_.style.left=sw.x+'px';this.div_.style.top=ne.y+'px';this.div_.style.width=(ne.x-sw.x)+'px';this.div_.style.height=(sw.y-ne.y)+'px';}
ShivaCustomMapOverlay.prototype.onRemove=function()
{this.div_.parentNode.removeChild(this.div_);this.div_=null;}
SHIVA_Show.prototype.AddClearMapStyle=function(map)
{var style=[{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"geometry",stylers:[{lightness:-20}]}];var type=new google.maps.StyledMapType(style,{name:"Land"});map.mapTypes.set("LAND",type);}
SHIVA_Show.prototype.AddBlankMapStyle=function(map)
{var style=[{featureType:"road",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"transit",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"poi",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"administrative",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"landscape",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"water",elementType:"all",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"labels",stylers:[{visibility:"off"}]},{featureType:"all",elementType:"geometry",stylers:[{lightness:-20}]}];var type=new google.maps.StyledMapType(style,{name:"Blank"});map.mapTypes.set("BLANK",type);}
SHIVA_Show.prototype.DrawVideo=function()
{var v,t,type="YouTube";var options=this.options;var container=this.container;var con="#"+container;var id=options.dataSourceUrl;if(typeof(Popcorn)!="function")
return;if(typeof(Popcorn.smart)!="function")
return;var base="http://www.youtube.com/watch?autoplay=1&v=";$(con).width(options.width);$(con).height(options.height);if((options.dataSourceUrl.match(/vimeo/))||(!isNaN(options.dataSourceUrl)))
base="http://vimeo.com/",type="Vimeo";else if(options.dataSourceUrl.match(/kaltura/)){var s=options.dataSourceUrl.indexOf("kaltura_player_");id=options.dataSourceUrl.substring(s+15);id="https://www.kaltura.com/p/2003471/sp/0/playManifest/entryId/"+id+"/format/url/flavorParamId/301951/protocol/https/video.mp4"
base="";type="Kaltura";}
else if((options.dataSourceUrl.match(/http/g))&&(!options.dataSourceUrl.match(/youtube/g)))
base="",type="HTML5";if(this.player){this.player.destroy();$(con).empty();this.player=null;}
if(!this.player)
this.player=Popcorn.smart(con,base+id);this.player.smartPlayerType=type;this.player.media.src=base+id;if(options.end){v=options.end.split(":");if(v.length==1)
v[1]=v[0],v[0]=0;this.player.cue(Number(v[0]*60)+Number(v[1]),function(){this.pause()
shivaLib.SendShivaMessage("ShivaVideo=done|"+window.name);});}
this.player.on("timeupdate",drawOverlay);this.player.on("loadeddata",onVidLoaded);this.player.on("ended",function(){shivaLib.SendShivaMessage("ShivaVideo=done|"+window.name)});this.player.on("playing",function(){shivaLib.SendShivaMessage("ShivaVideo=play|"+window.name)});this.player.on("pause",function(){shivaLib.SendShivaMessage("ShivaVideo=pause|"+window.name)});if(this.ev)
t=this.ev.events;else
t=options["shivaEvents"];this.ev=new SHIVA_Event(this);if((t)&&(t.length))
this.ev.AddEvents(t);function onVidLoaded(){var v=shivaLib.options.start.split(":");if(v.length==1)
v[1]=v[0],v[0]=0;var time=Math.max(Number(v[0]*60)+Number(v[1]),.25);if(this.smartPlayerType=="Vimeo")
shivaLib.player.currentTime(shivaLib.options.start);else
shivaLib.player.currentTime(time);shivaLib.player.volume(shivaLib.options.volume/100);if(shivaLib.options.autoplay=="true")
shivaLib.player.play();else
shivaLib.player.pause();$("#shivaEventDiv").height(Math.max(shivaLib.player.media.clientHeight-40,0));shivaLib.SendShivaMessage("ShivaVideo=ready|"+window.name);}
function drawOverlay(){shivaLib.DrawOverlay();}
this.SendReadyMessage(true);}
SHIVA_Show.prototype.VideoActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100"){$("#containerDiv").width("100%");$("#containerDiv").height("100%");}}
else if(v[0]=="ShivaActVideo=play"){this.player.play();if(v[1]!=undefined)
this.player.play(v[1]);}
else if(v[0]=="ShivaActVideo=pause")
this.player.pause();else if(v[0]=="ShivaActVideo=load"){this.player.media.src=v[1];this.player.load();}}
SHIVA_Show.prototype.TimecodeToSeconds=function(timecode)
{var h=0,m=0;var v=(""+timecode).split(":");var s=v[0]
if(v.length==2)
s=v[1],m=v[0];else if(v.length==3)
s=v[2],m=v[1],h=v[0];return(Number(h*3600)+Number(m*60)+Number(s));}
SHIVA_Show.prototype.SecondsToTimecode=function(secs)
{var str="",n;n=Math.floor(secs/3600);if(n)str+=n+":";n=Math.floor(secs/60);if(n<10)str+="0";str+=n+":";n=Math.floor(secs%60);if(n<10)str+="0";str+=n;return str;}
SHIVA_Show.prototype.DrawSubway=function(oldItems)
{var options=this.options;var container=this.container;var con="#"+container;var g=this.g=new SHIVA_Graphics();var items=new Array();if(oldItems)
items=oldItems;else
for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;$(con).html("");g.CreateCanvas("subwayCanvas",container);var ctx=$("#subwayCanvas")[0].getContext('2d');$("#subwayCanvas").attr("width",options.cols*options.gridSize+30);$("#subwayCanvas").attr("height",options.rows*options.gridSize+30);$("#propInput8").val(options.cols*options.gridSize+30);$("#propInput7").val(options.rows*options.gridSize+30);$("#textLayer").remove();$(con).append("<div id='textLayer'></div>");ctx.clearRect(0,0,1000,1000);DrawBack();DrawTracks();DrawStations();DrawLegend();this.SendReadyMessage(true);function DrawLegend()
{var i,str;var x=Number(options.gridSize*5)+8;var y=Number(options.gridSize*options.rows);for(i=0;i<items.length;++i)
if(items[i].title)
y-=16;for(i=0;i<items.length;++i)
if((items[i].title)&&(items[i].visible!="false")){g.DrawLine(ctx,"#"+items[i].lineCol,1,options.gridSize,y,x-8,y,items[i].lineWid);str="<div style='position:absolute;left:"+x+"px;top:"+(y-6)+"px'>"+items[i].title;$("#textLayer").append(str+"</div>");y+=16;}}
function DrawTracks()
{var i,j,v,pts
var xs=new Array();var ys=new Array();var gw=options.gridSize;for(i=0;i<items.length;++i){if(items[i].visible=="false")
continue;xs=[];ys=[]
if(!items[i].coords)
continue;pts=items[i].coords.split(",");for(j=0;j<pts.length;++j){v=pts[j].split(".");xs.push(v[0]*gw);ys.push(v[1]*gw);}
g.DrawPolygon(ctx,-1,1,xs,ys,"#"+items[i].lineCol,items[i].lineWid,true);}}
function DrawStations()
{var pts,tp,align,link="",lab="";var i,j,x,y,y2,x2,w,w2,style,str,span;if(!options.stations)
return;pts=options.stations.split("~");for(j=0;j<pts.length;++j){v=pts[j].split("`");x2=x=Number(v[0])*Number(options.gridSize);y2=y=Number(v[1])*Number(options.gridSize);tp=v[2];style=v[3];lab=v[4];link=v[5]
w=8;w2=w/2;if(style=="S")
g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);else if(style=="s")
g.DrawCircle(ctx,"#fff",1,x,y,w*.7,"#000",w/4);else if(style.charAt(0)=="i"){span=Number(style.charAt(1));x2=x+Number(span*options.gridSize);g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);g.DrawCircle(ctx,"#fff",1,x2,y,w,"#000",w2);g.DrawLine(ctx,"#fff",1,x,y,x2,y,w/2);g.DrawLine(ctx,"#000",1,x+Number(w),y-w2,x2-w,y-w2,w2);g.DrawLine(ctx,"#000",1,x+Number(w),y+w2,x2-w,y+w2,w2);}
else if(style.charAt(0)=="I"){span=Number(style.charAt(1));y2=y+Number(span*options.gridSize);g.DrawCircle(ctx,"#fff",1,x,y,w,"#000",w2);g.DrawCircle(ctx,"#fff",1,x,y2,w,"#000",w2);g.DrawLine(ctx,"#fff",1,x,y,x,y2,w/2);g.DrawLine(ctx,"#000",1,x-w2,y+Number(w),x-w2,y2-w,w/2);g.DrawLine(ctx,"#000",1,x+w2,y+Number(w),x+w2,y2-w,w/2);}
w=Number(options.gridSize);if(tp=="r"){x2=x2+w-w2;align='left';y2=y+((y2-y)/2);}
if(tp=="l"){x2=x-200-w+w2;align='right';y2=y+((y2-y)/2);}
if(tp=="t"){x2-=((x2-x)/2)+100;align='center';y2=y-w+w2;}
if(tp=="b"){x2-=((x2-x)/2)+100;align='center';y2=y2+w-w2;}
str="<div id='shivaSubtx"+j+"' style='position:absolute;color:#000;width:200px;left:"+x2+"px;top:"+(y2-6)+"px;text-align:"+align+"'>";if(link)
str+="<a href='"+link+"' target='_blank' style='color:#000;text-decoration: none;'>"+lab+"</a>";else
str+=lab;$("#textLayer").append(str+"</div>");$("#shivaSubtx"+j).click(function(){shivaLib.SendShivaMessage("ShivaSubway=click|"+window.name+"|"+this.id.substr(10))});if(tp=="t")
$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()+4)+"px");else if((tp=="r")||(tp=="l"))
$("#shivaSubtx"+j).css("top",(y2-$("#shivaSubtx"+j).height()/2)+"px");}}
function DrawBack()
{var gridSize=options.gridSize;var numRows=options.rows;var numCols=options.cols;ctx.textAlign="center";if(!options.showGrid){g.DrawRoundBar(ctx,"#"+options.backCol,1,0,0,numCols*gridSize,numRows*gridSize,options.backCorner);return;}
for(i=1;i<=numCols;++i){g.DrawLine(ctx,"#cccccc",1,i*gridSize,gridSize,i*gridSize,numRows*gridSize,.5);g.DrawText(ctx,i,(i*gridSize),gridSize/2,"color=#999");}
for(i=1;i<=numRows;++i){g.DrawLine(ctx,"#cccccc",1,gridSize,i*gridSize,numCols*gridSize,i*gridSize,.5);g.DrawText(ctx,i,gridSize/2,(i*gridSize)+3,"color=#999");}}}
SHIVA_Show.prototype.DrawNetwork=function()
{if(!this.jit)
this.jit=new VIZ(this.container);this.jit.Draw(this.options);}
function VIZ(container)
{this.chartType="rgraph";this.container=container;this.config=new Object();this.data=new Array();this.Config={rgraph:{background:{CanvasStyles:{}},Navigation:{enable:true,panning:true},Node:{CanvasStyles:{}},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}},forcedir:{iterations:200,background:{CanvasStyles:{},numberOfCircles:0},Navigation:{enable:true,panning:'avoid nodes'},Node:{CanvasStyles:{}},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}},hypertree:{background:{CanvasStyles:{},numberOfCircles:0},Navigation:{enable:true,panning:true},Node:{CanvasStyles:{},transform:false},Edge:{overridable:true,CanvasStyles:{}},Label:{overridable:true,type:'HTML'},Tips:{enable:true},Events:{enable:true,enableForEdges:true},NodeStyles:{enable:true},CanvasStyles:{}}}}
SHIVA_Show.prototype.NetworkActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100")
shivaLib.options.width=shivaLib.options.height="100%";shivaLib.DrawNetwork();}}
VIZ.prototype.Draw=function(json)
{var k,key,val;this.chartType=json.chartType;for(key in json){val=json[key];if(key.match(/_(fillStyle|strokeStyle|color)/))
val='#'+val;if(val=="true")
val=true;else if(val=='false')
val=false;k=key.split("_");if(k.length==2)
this.Config[this.chartType][k[0]][k[1]]=val;else if(k.length==3)
this.Config[this.chartType][k[0]][k[1]][k[2]]=val;else
this.Config[this.chartType][key]=val;}
new google.visualization.Query(json.dataSourceUrl).send($.proxy(this.Google2Jit,this));this.config=this.Config[this.chartType];$("#"+this.container).height(this.config.height);$("#"+this.container).width(this.config.width);$jit.id(this.container).style.backgroundColor=this.config.background.CanvasStyles.fillStyle;}
VIZ.prototype.Google2Jit=function(rs)
{var table=rs.getDataTable();var numRows=table.getNumberOfRows();var numCols=table.getNumberOfColumns();var ROWS=[];for(var i=0;i<numRows;i++){ROWS[i]=[];for(var j=0;j<numCols;j++){var v=table.getValue(i,j);if(isNaN(v)){v=v.replace(/(^\s+|\s+$)/g,"");}
ROWS[i][j]=v;}}
var CLASSES={node:{},link:{}};for(var i=0;i<numRows;i++){var rType=ROWS[i][0];if(!rType.match(/-class/))continue;var c=ROWS[i][1];var k=ROWS[i][2];var v=ROWS[i][3];if(rType.match(/node-class/)){if(CLASSES.node[c]==undefined)CLASSES.node[c]={};CLASSES.node[c][k]=v;}else if(rType.match(/link-class/)){if(CLASSES.link[c]==undefined)CLASSES.link[c]={};CLASSES.link[c][k]=v;}}
var JIT={};for(var i=0;i<numRows;i++){var rType=ROWS[i][0];if(rType.match(/-class/))continue;var nodeID=ROWS[i][1];if(JIT[nodeID]==undefined){JIT[nodeID]={};JIT[nodeID].id=nodeID;JIT[nodeID].data={};JIT[nodeID].adjacencies=[];}
if(rType.match(/^\s*node\s*$/)){if(ROWS[i][2]&&!ROWS[i][2].match(/^\s*$/)){JIT[nodeID].name=ROWS[i][2];}else{JIT[nodeID].name=nodeID;}
var nodeClass=ROWS[i][3];JIT[nodeID].data.className=nodeClass;for(var k in CLASSES.node[nodeClass]){JIT[nodeID].data['$'+k]=CLASSES.node[nodeClass][k];}
if(numCols>4){JIT[nodeID].data.tip=ROWS[i][4];}}else if(rType.match(/^\s*link\s*$/)){var linkClass=ROWS[i][2];var nodeTo=ROWS[i][3];var linkObject={'nodeTo':nodeTo,'data':{'class':linkClass}};for(var k in CLASSES.link[linkClass]){linkObject.data['$'+k]=CLASSES.link[linkClass][k];}
JIT[nodeID].adjacencies.push(linkObject);}
shivaLib.SendReadyMessage(true);}
this.data=[];for(var x in JIT)this.data.push(JIT[x]);$jit.id(this.container).innerHTML='';this.Init[this.chartType](this);}
VIZ.prototype.Init={rgraph:function(obj){var data=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;var divElement=document.getElementById(div);config.width=divElement.offsetWidth;config.height=divElement.offsetHeight;config.onCreateLabel=function(domElement,node){domElement.className='shiva-node-label';domElement.innerHTML=node.name;domElement.onclick=function(){shivaLib.SendShivaMessage("ShivaNetwork=click|"+window.name+"|"+node.id);rgraph.onClick(node.id,{});};var style=domElement.style;style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';style.display='';};config.onPlaceLabel=function(domElement,node){};config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var rgraph=new $jit.RGraph(config);rgraph.loadJSON(data);rgraph.graph.eachNode(function(n){var pos=n.getPos();pos.setc(-200,-200);});rgraph.compute('end');rgraph.fx.animate({modes:['polar'],duration:2000});var canvasConfig=rgraph.canvas.getConfig();},forcedir:function(obj){var jsonData=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;config.onCreateLabel=function(domElement,node){var style=domElement.style;domElement.className='shiva-node-label';style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';domElement.innerHTML=node.name;var left=parseInt(style.left);var top=parseInt(style.top);var w=domElement.offsetWidth;style.left=(left-w/2)+'px';style.top=(top+10)+'px';style.display='';domElement.onclick=function(){shivaLib.SendShivaMessage("ShivaNetwork=click|"+window.name+"|"+node.id);};};config.onPlaceLabel=function(domElement,node){};config.onMouseEnter=function(){fd.canvas.getElement().style.cursor='move';};config.onMouseLeave=function(){fd.canvas.getElement().style.cursor='';};config.onDragMove=function(node,eventInfo,e){var pos=eventInfo.getPos();node.pos.setc(pos.x,pos.y);fd.plot();};config.onTouchMove=function(node,eventInfo,e){$jit.util.event.stop(e);this.onDragMove(node,eventInfo,e);};config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var fd=new $jit.ForceDirected(config);fd.loadJSON(jsonData);fd.computeIncremental({iter:40,property:'end',onStep:function(perc){},onComplete:function(){fd.animate({modes:['linear'],transition:$jit.Trans.Elastic.easeOut,duration:2500});}});},hypertree:function(obj){var data=obj.data;var config=obj.Config[obj.chartType];var div=obj.container;config.injectInto=div;var divElement=document.getElementById(div);config.width=divElement.offsetWidth;config.height=divElement.offsetHeight;config.onCreateLabel=function(domElement,node){domElement.innerHTML=node.name;var style=domElement.style;domElement.className='shiva-node-label';style.fontSize=config.Label.size+'px';style.color=config.Label.color;style.fontWeight=config.Label.style;style.fontStyle=config.Label.style;style.fontFamily=config.Label.family;style.textAlign=config.Label.textAlign;style.cursor='crosshair';style.display='';$jit.util.addEvent(domElement,'click',function(){ht.onClick(node.id,{onComplete:function(){shivaLib.SendShivaMessage("ShivaNetwork=click|"+window.name+"|"+node.id);ht.controller.onComplete();}});});};config.onPlaceLabel=function(domElement,node){};config.onComplete=function(){return;}
config.Tips.onShow=function(tip,node){var count=0;node.eachAdjacency(function(){count++;});if(node.data.tip){tip.innerHTML="<div class='tip-title'>"+node.data.tip+"</div>";}else{tip.innerHTML="<div class='tip-title'>"+node.name+" is a <b>"+node.data.className+"</b> with "+count+" connections.</div>";}
tip.style.color='black';tip.style.fontFamily=config.Label.family;tip.style.backgroundColor='white';tip.style.padding='1em';tip.style.maxWidth='200px';tip.style.fontSize='10pt';tip.style.border='1px solid black';tip.style.opacity='0.99';tip.style.boxShadow='#555 2px 2px 8px';};var ht=new $jit.Hypertree(config);ht.loadJSON(data);ht.refresh();ht.controller.onComplete();}}
SHIVA_Show.prototype.DrawTimeGlider=function()
{if($('#cp_colorbar').is(":visible")==true||$('#cp_colormap').is(":visible")==true){return;}
var i;var stimeline=new Object();if($('link[href*=timeglider]').length==0){$('head').append('<link rel="stylesheet" href="css/timeglider/Timeglider.css" type="text/css" media="screen" title="no title" charset="utf-8">');}
stimeline.events=null;stimeline.options=this.options;stimeline.container=this.container;stimeline.con="#"+stimeline.container;$(stimeline.con).width(stimeline.options['width']);$(stimeline.con).height(stimeline.options['height']);$(stimeline.con).timeline('resize');GetSpreadsheetData(stimeline.options.dataSourceUrl);function GetSpreadsheetData(file,conditions)
{lastDataUrl=file.replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");var query=new google.visualization.Query(lastDataUrl);if(conditions)
query.setQuery(conditions);query.send(handleQueryResponse);function handleQueryResponse(response){if(response.isError()){alert("Either your internet connection is down or the Google spreadsheet that  \n"+"holds the data for this visualization has not been properly shared.\n"+"The owner of the spreadsheet should set permissions to 'Anyone with Link' or 'Public'.");return;}
var i,j,key,s=0;var data=new google.visualization.DataView(response.getDataTable());var rows=data.getNumberOfRows();var cols=data.getNumberOfColumns();eventData={events:new Array()};if(!$.trim(data.getColumnLabel(0)))
s=1;for(i=s;i<rows;++i){o=new Object();for(j=0;j<cols;++j){key=$.trim(data.getColumnLabel(j));if(!key)
key=$.trim(data.getValue(0,j));if((key=="icon")&&(!data.getValue(i,j)))
continue;if((key=="startdate")||(key=="enddate")){if(data.getFormattedValue(i,j))
o[key]=ConvertTimelineDate(data.getValue(i,j));}
else{o[key]=data.getValue(i,j);if(typeof(o[key])=="string"){o[key]=o[key].replace(/[\n\r\f]/g,"<br/>");}}}
eventData.events.push(o);}
stimeline.events=eventData.events;if(typeof(stimeline.options.min_zoom)=="undefined"||stimeline.options.min_zoom==""||stimeline.options.min_zoom=="0"){stimeline.options.min_zoom=1}
if(typeof(stimeline.options.max_zoom)=="undefined"||stimeline.options.max_zoom==""||stimeline.options.max_zoom=="0"){stimeline.options.max_zoom=99}
if(typeof(stimeline.options.initial_zoom)=="undefined"||stimeline.options.initial_zoom==""||stimeline.options.initial_zoom=="0"){stimeline.options.initial_zoom=50}
var stldata=[{"id":"stl"+(new Date()).getTime(),"title":stimeline.options.title,"description":"<p>"+stimeline.options.description+"</p>","focus_date":ConvertTimelineDate(stimeline.options.focus_date),"timezone":stimeline.options.timezone,"initial_zoom":stimeline.options.initial_zoom*1,"events":normalizeEventData(stimeline.events)}];if(typeof(window.shivaTimeline)=="undefined"){window.shivaTimeline=$(stimeline.con).timeline({"min_zoom":stimeline.options.min_zoom*1,"max_zoom":stimeline.options.max_zoom*1,"icon_folder":'images/timeglider/icons/',"data_source":stldata,"show_footer":Boolean(stimeline.options.show_footer),"display_zoom_level":Boolean(stimeline.options.display_zoom_level),"constrain_to_data":false,"image_lane_height":stimeline.options.imglane_height*1,"loaded":function(args,data){$(stimeline.con).timeline('setOptions',stimeline.options,true);$(stimeline.con).timeline('registerEvents',stimeline.events);$(stimeline.con).timeline('eventList');if(stimeline.options.show_desc=="false"){$('.tg-timeline-modal').fadeOut();}
shivaLib.SendReadyMessage(true);}});}else{var callbackObj={fn:function(args,data){setTimeout(function(){$(stimeline.con).timeline('setOptions',stimeline.options,true);$(stimeline.con).timeline('registerEvents',stimeline.events);$(stimeline.con).timeline('eventList');if(stimeline.options.show_desc=="false"){$('.tg-timeline-modal').fadeOut();}},500);},args:{"min_zoom":stimeline.options.min_zoom*1,"max_zoom":stimeline.options.max_zoom*1,"icon_folder":'images/timeglider/icons/',"data_source":stldata,"show_footer":Boolean(stimeline.options.show_footer),"display_zoom_level":Boolean(stimeline.options.display_zoom_level),"constrain_to_data":false,"image_lane_height":stimeline.options.imglane_height*1,},display:true};$(stimeline.con).timeline('loadTimeline',stldata,callbackObj);}
window.stlInterval=setInterval(function(){$('.timeglider-ev-modal').draggable({cancel:'div.tg-ev-modal-description'});},500);function ConvertTimelineDate(dateTime){var dt=dateTime;if(typeof(dateTime)=="number"){dateTime=dateTime.toString();}
if(typeof(dateTime)=='string'){var m=dateTime.match(/\//g);if(m!=null&&m.length==1){var dp=dateTime.split('/');dp.splice(1,0,"15");dateTime=dp.join('/');}
var dt=new Date();var dp=dateTime.split('/');var y=$.trim(dp[dp.length-1]);if(y.indexOf(' ')>-1){pts=y.split(' ');y=pts[0];if(pts[1].indexOf(':')>-1){tpts=pts[1].split(":");if(tpts.length==3){dt.setHours(tpts[0]);dt.setMinutes(tpts[1]);dt.setSeconds(tpts[2]);}}}
dt.setFullYear(y);var m=(dp.length>1)?dp[dp.length-2]:1;dt.setMonth((m*1)-1);var d=(dp.length>2)?dp[dp.length-3]:15;dt.setDate(d)}
if(typeof(dt.getFullYear())=="number"&&dt.getFullYear()>0){dateTime=Date.parse(dt)+50000000;dt=new Date(dateTime);}
var mn=padZero(dt.getMonth()+1);var dy=padZero(dt.getDate());var hrs=padZero(dt.getHours());var mns=padZero(dt.getMinutes());var scs=padZero(dt.getSeconds());var dtstr=dt.getFullYear()+"-"+mn+"-"+dy+" "+hrs+":"+mns+":"+scs;return dtstr;}
function padZero(n){if(n<10){n='0'+n;}
return n;}
function normalizeEventData(events){var ct=0;for(var i in events){ct++;var ev=events[i];if(typeof(ev.id)=="undefined"||ev.id==null){ev.id="event-"+ct;}else{ev.id=ev.id+"-"+ct;}
if(typeof(ev.startdate)=="undefined"&&typeof(ev.start)!="undefined"){ev.startdate=ConvertTimelineDate(ev.start);}
if(typeof(ev.enddate)=="undefined"&&typeof(ev.end)!="undefined"){ev.enddate=ConvertTimelineDate(ev.end);}
if(typeof(ev.enddate)=="undefined"||ev.enddate==""||ev.enddate==null){ev.enddate=ev.startdate;}
if(typeof(ev.importance)=="undefined"||ev.importance==""||ev.importance==null){ev.importance=50;}
if(typeof(ev.date_display)=="undefined"||ev.date_display==""||ev.date_display==null){ev.date_display="ye";}
if(typeof(ev.icon)=="undefined"||ev.icon==""||ev.icon==null){ev.icon="none";}}
return events;}}}}
SHIVA_Show.prototype.DrawTimeline=function(oldItems)
{var i;var eventData=null;var options=this.options;var container=this.container;var con="#"+container;var ops=new Array();var items=new Array();$(con).css('width',options['width']+"px");$(con).css('height',options['height']+"px");var eventSource=new Timeline.DefaultEventSource();$("#timelineCSS").attr('href',"css/timeline"+options.theme+".css");if(oldItems)
items=oldItems;else
for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;for(i=0;i<items.length;++i){if(items[i].visible=="false")
continue;o=new Object();o.width=items[i].pct+"%";o.intervalUnit=eval("Timeline.DateTime."+items[i].intu.toUpperCase());o.intervalPixels=Number(items[i].intw);o.eventSource=eventSource;o.date=items[i].date;o.overview=(items[i].text=="false");var theme=Timeline.ClassicTheme.create();theme.event.tape.height=Number(items[i].thgt);theme.event.track.height=Number(items[i].thgt)+2;o.theme=theme;ops.push(Timeline.createBandInfo(o));if(i){if(items[i].sync!="None")
ops[i].syncWith=Number(items[i].sync)-1;ops[i].highlight=(items[i].high=="true");}}
i=(options['orientation']!="Vertical")?0:1;if(this.timeLine)
Timeline.timelines.pop();this.timeLine=Timeline.create(document.getElementById(container),ops,i);if(options['dataSourceUrl'])
GetSpreadsheetData(options['dataSourceUrl'],"",this);else{this.timeLine.loadJSON("SimileTestData.js",function(json,url){eventSource.loadJSON(json,url);});this.SendReadyMessage(true);}
function GetSpreadsheetData(file,conditions,_this)
{lastDataUrl=file.replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");var query=new google.visualization.Query(lastDataUrl);if(conditions)
query.setQuery(conditions);query.send(handleQueryResponse);function handleQueryResponse(response){var i,j,key,s=0;var data=response.getDataTable();var rows=data.getNumberOfRows();var cols=data.getNumberOfColumns();eventData={events:new Array()};if(!$.trim(data.getColumnLabel(0)))
s=1;for(i=s;i<rows;++i){o=new Object();for(j=0;j<cols;++j){key=$.trim(data.getColumnLabel(j));if(!key)
key=$.trim(data.getValue(0,j));if((key=="icon")&&(!data.getValue(i,j)))
continue;if((key=="start")||(key=="end")){if(data.getFormattedValue(i,j))
o[key]=_this.ConvertDateToJSON(data.getFormattedValue(i,j));}
else
o[key]=data.getValue(i,j);}
eventData.events.push(o);}
eventSource.loadJSON(eventData,'');shivaLib.SendReadyMessage(true);}}}
SHIVA_Show.prototype.TimeActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100"){$("#"+shivaLib.container).width("100%");$("#"+shivaLib.container).height("100%");}
$("#"+shivaLib.container).timeline('resize');}}
SHIVA_Show.prototype.ColorPicker=function(mode,attr){$("#shiva_dialogDiv").remove();var self=this;var sel="";console.log(isNaN(attr));if(isNaN(attr))
sel="#"+attr.replace(/___/g,"");else if(attr<0)
sel="#colordiv";else if(attr>100)
sel="#itemInput"+(Math.floor(attr/100)-1)+"-"+(attr%100);else sel="#propInput"+attr;console.log(sel);var inputBox=$(sel);var inputBoxChip=$(sel+"C");this.HEX_to_HSV=function(hexString){var value=hexString.substring(1);var r=parseInt(value.substring(0,2),16)/255;var g=parseInt(value.substring(2,4),16)/255;var b=parseInt(value.substring(4,6),16)/255;var max=Math.max.apply(Math,[r,g,b]);var min=Math.min.apply(Math,[r,g,b]);var hue;var sat;var val=max;var delta=max-min;if(max!=0)
sat=delta/max;else{sat=0;hue=0;return;}
if(delta==0){return[0,0,val];}
if(r==max)
hue=(g-b)/delta;else if(g==max)
hue=2+(b-r)/delta;else
hue=4+(r-g)/delta;hue*=60;if(hue<0)
hue+=360;return[hue,sat,val];}
this.RGB_to_HSV=function(r,g,b){var max=Math.max.apply(Math,[r,g,b]);var min=Math.min.apply(Math,[r,g,b]);var hue;var sat;var val=max;var delta=max-min;if(max!=0)
sat=delta/max;else{sat=0;hue=0;return[hue,sat,val];}
if(delta==0){return[0,0,val];}
if(r==max){hue=(g-b)/delta;}else if(g==max){hue=2+(b-r)/delta;}else{hue=4+(r-g)/delta;}
hue*=60;if(hue<0)
hue+=360;return[hue,sat,val];}
this.HSV_to_HEX=function(h,s,v){if(h===0)
h=.001;else if(h==360)
h=359.999;chroma=v*s;hprime=h/60;x=chroma*(1-Math.abs(hprime%2-1));var r;var g;var b;if(h==0)
r,g,b=0;else if(hprime>=0&&hprime<1){r=chroma;g=x;b=0;}else if(hprime>=1&&hprime<2){r=x;g=chroma;b=0;}else if(hprime>=2&&hprime<3){r=0;g=chroma;b=x;}else if(hprime>=3&&hprime<4){r=0;g=x;b=chroma;}else if(hprime>=4&&hprime<5){r=x;g=0;b=chroma;}else if(hprime>=5&&hprime<6){r=chroma;g=0;b=x;}
m=v-chroma;r=Math.round(255*(r+m));g=Math.round(255*(g+m));b=Math.round(255*(b+m));return self.RGB_to_HEX(r,g,b);}
this.RGB_to_HEX=function(r,g,b){h1=Math.floor(r/16).toString(16);h2=Math.floor((r%16)).toString(16);h3=Math.floor(g/16).toString(16);h4=Math.floor((g%16)).toString(16);h5=Math.floor(b/16).toString(16);h6=Math.floor((b%16)).toString(16);return"#"+h1+h2+h3+h4+h5+h6;}
var hue=0;var sat=1;var val=1;var cp_current=0;var cp_first=0;var z=($('.ui-widget-overlay').length>0)?($('.ui-widget-overlay').css('z-index')+1):'auto';$('body').append($("<div>",{id:'shiva_dialogDiv',css:{zIndex:z,position:'absolute',right:'100px',top:'30px',width:'240px',marginLeft:'2px',marginRight:'2px',padding:'5px',paddingBottom:'30px',paddingTop:'10px'}}).draggable().addClass("propTable"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_colorbar',css:{position:'absolute',right:'1px',top:'-1px',width:'244px',height:'22px',borderTopLeftRadius:'8px',borderTopRightRadius:'8px'}}));$("#cp_colorbar").append($("<a>",{css:{width:'30px',height:'20px',position:'relative',left:'-5px',float:'left',border:'0',borderRadius:'0',borderTopLeftRadius:'8px',borderRight:'1px solid gray',borderBottom:'1px solid gray'},click:function(){if(cp_first>0)
cp_first--;self.position_bar();}}).button({icons:{primary:'ui-icon-arrowthick-1-w'},text:false}).addClass("cbar_control"));$("#cp_colorbar").append($("<a>",{css:{width:'28px',height:'20px',position:'absolute',left:'216px',top:'0px',border:'0',borderRadius:'0',borderTopRightRadius:'8px',borderLeft:'1px solid gray',borderBottom:'1px solid gray'},click:function(){if(cp_first<$(".tab").length-5)
cp_first++
self.position_bar();}}).button({icons:{primary:'ui-icon-arrowthick-1-e'},text:false}).addClass("cbar_control"));$("#cp_colorbar").append($("<a>",{css:{width:'18.5px',height:'20px',position:'absolute',top:'0',left:'196px',border:'0',borderRadius:'0',borderLeft:'1px solid gray',borderBottom:'1px solid gray'},click:function(){cp_first++;self.add();}}).button({icons:{primary:'ui-icon-plusthick'},text:false}).addClass("cbar_control"));$("#cp_colorbar a").hover(function(){$(this).css("cursor","pointer");});$("#shiva_dialogDiv").append($("<span>",{html:"S&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;B",css:{color:'gray',position:'absolute',top:'25px',left:'186px'}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_colormap',css:{position:'relative',top:'20px',width:'150px',padding:'2px',height:'150px'}}));$("#cp_colormap").append($("<img>",{src:'hsv_wheel.png',click:function(e){self.position((e.pageX-$(this).parent().offset().left),(e.pageY-$(this).parent().offset().top));}}))
$("#shiva_dialogDiv").append($("<input>",{id:'cp_current',maxLength:'7',css:{position:'absolute',top:'97px',left:'52.5px',width:'58px',height:'20px',border:'0',textAlign:'center',backgroundColor:'transparent'},change:function(){var val=$(this).attr("value");if(val[0]!="#")
val="#"+val;if(val=="none")
self.update(null);else if(val.length===7){var hsv=self.HEX_to_HSV(val);if(hsv==-1){self.setColor(0,0,0);$(this).attr("value","000000");}else{hue=hsv[0];sat=hsv[1];val=hsv[2];self.setColor(hue,sat,val);}}}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_brightness',title:'brightness',css:{width:'5px',height:'85px',position:'relative',right:'24.5px',top:'-120px',float:'right',borderRadius:'8px',border:'1px solid gray'}}).slider({value:100,orientation:'vertical'}).addClass("slider"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_saturation',title:'saturation',css:{width:'5px',height:'85px',position:'relative',right:'45.5px',top:'-120px',float:'right',borderRadius:'8px',border:'1px solid gray'}}).slider({value:100,orientation:'vertical'}).addClass("slider"));$(".slider a").css("width",'20px');$(".slider a").css("height",'10px');$(".slider a").css("left","-8px");$(".slider").first().slider("option","slide",function(){self.setColor(hue,sat,$(this).slider("option","value")/100);});$(".slider").last().slider("option","slide",function(){self.setColor(hue,$(this).slider("option","value")/100,val);});$("#shiva_dialogDiv").append($("<div>",{id:'cp_chip',css:{border:'1px solid gray',borderRadius:'4px',width:'50px',height:'30px',position:'relative',left:'172px',top:'-25px'}}));$("#shiva_dialogDiv").append($("<div>",{id:'cp_basic',css:{width:'216px',position:'relative',left:'10px'}}));$("#cp_basic").append($("<div>",{id:'basic_colors',css:{position:'absolute',width:'216px',height:'20px',border:'1px solid gray'}}))
$("#cp_basic").append($("<div>",{id:'neutral',css:{position:'absolute',top:'20px',width:'216px',height:'20px',border:'1px solid gray'}}))
var form=[16,16];for(var i=0;i<2;i++){var html="";for(var j=0;j<form[i];j++){html+="<div class= \'chips\' style=\'height:100%;width:"+((1/form[i])*100)+"%;float:left\'></div>";}
$("#cp_basic").children().eq(i).html(html);}
for(var i=0;i<16;i++){$("#basic_colors").children().eq(i).css("backgroundColor",self.HSV_to_HEX((i*22.5),1,1))}
for(var i=0;i<16;i++){$("#neutral").children().eq(i).css("backgroundColor",self.HSV_to_HEX(0,0,(i*0.06666666666666667)));}
$("#cp_basic").children().children().click(function(){var color=$(this).css("backgroundColor");color=color.slice(4,color.length-1);color=color.split(",");var hsv=self.RGB_to_HSV(color[0]/255,color[1]/255,color[2]/255);self.setColor(hsv[0],hsv[1],hsv[2]);});$("#shiva_dialogDiv").append($("<div>",{id:'cp_control',css:{width:'216px',height:'30px',position:'relative',top:'50px'}}));$("#cp_control").append($("<button>",{id:'cp_schemes',html:'Schemes',css:{left:'18px'},click:function(){$("#cp_schemediv").toggle();}}).addClass("button"));$("#shiva_dialogDiv").append($("<div>",{id:'cp_schemediv',css:{height:'160px',position:'relative',top:'60px',paddingBottom:'30px'}}));$("#cp_schemediv").hide();$("#cp_schemediv").append($("<div>",{id:'cp_schemebox'}));for(var i=0;i<4;i++){$("#cp_schemebox").append($("<div>",{css:{width:'100%',height:'35px',position:'relative',top:'-5px',paddingBottom:'2px',paddingTop:'2px'}}));};var names=[["monochromatic"],["complementary","split-complementary"],["triadic","analagous"],["tetrad"]];var form=[[16],[2,3],[3,3],[4]];for(var i=0;i<form.length;i++){for(var j=0;j<form[i].length;j++){$("#cp_schemebox").children().eq(i).append($("<div>",{html:"<center>"+names[i][j]+"</center>",css:{float:'left',position:'absolute',top:'0',left:(((92/form[i].length)+2)*j)+2+"%",fontSize:'10px',width:92/form[i].length+"%",height:'100%'}}));for(var k=0;k<form[i][j];k++){$("#cp_schemebox").children().eq(i).children("div").eq(j).append($("<div>",{css:{float:'left',position:'relative',top:'1px',width:100/form[i][j]+"%",height:'50%'}}));}}}
$("#cp_schemebox").children().children().css("fontSize","8.5px");$("#cp_schemebox div:not(:has(*))").filter("div").click(function(){var color=$(this).css("backgroundColor");color=color.slice(4,color.length-1);color=color.split(",");color=self.RGB_to_HEX(color[0],color[1],color[2]);$(".tab").eq(cp_current).children().first().css("backgroundColor",color);$(".tab").eq(cp_current).children().first().html("");self.drawColors(color);});$("#cp_control").append($("<button>",{id:'cp_nocolor',html:"No color",css:{left:'22px'},click:function(){self.update("none");}}).addClass("button"));$("#cp_control").append($("<button>",{id:'cp_OK',html:"OK",css:{width:'60px',left:'35px'},click:function(){$("#shiva_dialogDiv").remove();return;}}).addClass("button"));$(".button").button();$(".button").css({position:'relative',borderRadius:'8px',float:'left',fontSize:'9px',top:'3px'});this.scheme=function(){for(var i=0;i<16;i++){$("#cp_schemebox").children("div").eq(0).children("div").eq(0).children("div").eq(i).css("backgroundColor",self.HSV_to_HEX(hue,(1-(i/16)),1));}
$("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+180)%360,sat,val));$("#cp_schemebox").children("div").eq
(1).children("div").eq(1).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+150)%360,sat,val));$("#cp_schemebox").children("div").eq(1).children("div").eq(1).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+210)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+120)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(0).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+240)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX((hue+330)%360,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(2).children("div").eq(1).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+390)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(0).css("backgroundColor",self.HSV_to_HEX(hue,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(1).css("backgroundColor",self.HSV_to_HEX((hue+30)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(2).css("backgroundColor",self.HSV_to_HEX((hue+180)%360,sat,val));$("#cp_schemebox").children("div").eq(3).children("div").eq(0).children("div").eq(3).css("backgroundColor",self.HSV_to_HEX((hue+210)%360,sat,val));}
this.update=function(attr,value){if(attr=="none"){$(".tab").eq(cp_current).children().html("<center>none</center>");$(".tab").eq(cp_current).children().css("backgroundColor","white");$("#cp_chip").css("backgroundColor","white");$("#cp_chip").css("border","1px dashed gray");$(".slider").first().slider("option","value",100);$(".slider").last().slider("option","value",100);}else if(attr==null){$(".tab").eq(cp_current).children().html("");$(".tab").eq(cp_current).children().css("backgroundColor","transparent");$("#cp_current").attr("value","");$("#cp_chip").css("backgroundColor","transparent");$("#cp_chip").css("border","1px dashed gray");$(".slider").first().slider("option","value",100)
$(".slider").last().slider("option","value",100)}else{if(attr=="saturation"){sat=value;}else if(attr=="brightness"){val=value;}else if(attr=="hue"){hue=value;}
var color=self.HSV_to_HEX(hue,sat,val);$("#cp_chip").css("backgroundColor",color);$("#cp_chip").css("border","1px solid gray");$("#cp_current").attr("value",color.slice(1))
$(".tab").eq(cp_current).children().css("backgroundColor",color)
$(".tab").eq(cp_current).children().html('');$(".slider").first().slider("option","value",val*100)
$(".slider").last().slider("option","value",sat*100)}
self.scheme()}
this.add=function(color_HEX){cp_current=$(".tab").length;$("#cp_colorbar a:eq(1)").before($("<div>",{css:{height:'16px',width:'28px',border:'1px solid gray',borderTop:'0',padding:'2px',position:'relative',left:'-6px',float:'left'},click:function(){$(".tab:not(:eq("+$(this).index(".tab")+"))").css("borderBottom",'1px solid gray');$(this).css("borderBottom",'0');cp_current=$(this).index(".tab");}}).addClass("tab").append($("<div>",{css:{fontSize:'10px',width:"100%",height:'100%'}})).append($("<img>",{src:'cpclose.png',css:{width:'4px',position:'absolute',top:'2.5px',right:'2.5px'},mouseenter:function(){$(this).css({width:'10px'})},mouseleave:function(){$(this).css({width:'4px'})},click:function(){cp_current=$(this).parent().index(".tab");self.removeTab();}})));if(color_HEX=="none"){$('.tab').last().children().css("backgroundColor","transparent");self.update("none");}else if(color_HEX==null){$('.tab').last().children().css("backgroundColor","transparent");self.update(null);}else{$('.tab').last().children().css("backgroundColor",color_HEX);var color=self.HEX_to_HSV(color_HEX);if(typeof color!="undefined")
self.setColor(color[0],color[1],color[2]);else
self.setColor(0,0,0);}
self.position_bar();}
this.drawColors=function(color_HEX){if(mode!=0){var colors=inputBox.val().split(",");colors[cp_current]=color_HEX.slice(1);var boxChip=colors[cp_current];boxChip="#"+boxChip;inputBox.css('border-color',boxChip);inputBoxChip.css('background-color',boxChip);var str=colors.toString();if(str[str.length-1]!=",")
str+=",";inputBox.val(str);}
else{var boxChip=color_HEX;inputBox.css('border-color',boxChip);inputBoxChip.css('background-color',boxChip);inputBox.val(boxChip.slice(1,boxChip.length));}
Draw();}
this.setColor=function(h,s,v){self.update("hue",h);self.update("saturation",s);self.update("brightness",v);self.drawColors(self.HSV_to_HEX(h,s,v));}
this.position_bar=function(){if(cp_current>cp_first+4)
cp_current=cp_first+4;$(".tab").eq(cp_current).click();$(".tab").show();$(".tab:lt("+cp_first+")").hide();$(".tab:gt("+(cp_first+4)+")").hide();}
this.position=function(x,y){var xrel=x-75;var yrel=75-y;var angleR=Math.atan2(yrel,xrel);var angle=angleR*(180/Math.PI);var h;if(angle>0){h=(360-(angle-90))%360;}else{h=90+(angle-(angle*2));}
self.setColor(h,1,1);}
this.removeTab=function(){$(".tab").eq(cp_current).remove();var colors=inputBox.val();colors=colors.split(",");colors.splice(cp_current,1)
var str=colors.toString();if(str[str.length-1]!=",")
str=str+",";inputBox.val(str);while($(".tab").length<5)
self.add();cp_current=cp_first;$(".tab").eq(cp_current).click();Draw();}
var oldcols=inputBox.val();if(mode==0){$("#cp_colorbar").hide();if(oldcols!=""){if(oldcols[0]!="#")
oldcols="#"+oldcols;var color=self.HEX_to_HSV(oldcols);self.setColor(color[0],color[1],color[2]);}}
else{$("#cp_nocolor").hide();$("#cp_OK").css("left",'90px');if(oldcols!=""){oldcols=oldcols.split(",");var rem=6-oldcols.length;for(var i=0;i<oldcols.length;i++){if(oldcols[i]!=""){self.add("#"+oldcols[i]);}}
if(rem>0){for(var j=0;j<rem;j++){self.add();}}}else{for(var j=0;j<5;j++){self.add();}}
$(".tab").first().click();Draw();$(".tab").hover(function(){$(this).css("cursor","pointer");});}
$("#cp_schemebox div:not(:has(*))").hover(function(){$(this).css("cursor","pointer");});$("#cp_basic div:not(:has(*))").hover(function(){$(this).css("cursor","pointer");});$(".slider a").hover(function(){$(this).css("cursor","pointer");});}
function CSV(inputID,mode,output_type,callback){var self=this;var cellopts=[',','\t','other']
var textopts=['\"','\''];var cellDelim=',';var quote='\''
var CSV_title='';var csvHasHeader=false;var CSV_data=[];var input='';$.get('proxy.php',{url:$('#'+inputID).val()},function(data){input=data;if(data==-1){console.log("Bad data source.");alert("Please check your source URL...we didn't find anything at the other end.");return;}else{CSV_title=$('#'+inputID).val().split('/').pop().split(".")[0];if(mode==='hide'){self.prep();self.parse();self.done();}else if(mode==='show'){self.prep();self.show(10);}else
console.log("Bad mode type.");}});self.prep=function(){input=input.replace(/\n\r/g,'\n');input=input.replace(/\r\n/g,'\n');input=input.replace(/\r/g,'\n');var c=input.split(',').length;var t=input.split('\t').length;var cn=input.split(';').length
if(c>=t&&c>=cn)
cellDelim=',';else if(t>=c&&t>=cn)
cellDelim='\t';else if(cn>=c&&cn>=t)
cellDelim=';';quote=(input.split("\"").length>=input.split("\'").length)?"\"":"\'";}
self.parse=function(n){var cell="";var row=0;var text=false;CSV_data[row]=[];for(var i=0;i<input.length;i++){if(typeof n!=='undefined'&&row===n)
break;text=(RegExp(quote,'g').test(input[i]))?!text:text;if(text)
cell+=input[i];else{if(/\n/g.test(input[i])){CSV_data[row].push(cell);cell="";row++;if(typeof input[i+1]!='undefined')
CSV_data[row]=[];}else if(RegExp(cellDelim,'g').test(input[i])){CSV_data[row].push(cell);cell="";}else{cell+=input[i];}}}
if(typeof CSV_data[0][0]!=typeof CSV_data[1][0]){csvHasHeader=true;}}
self.init=function(){$('body').append($("<div>",{id:'CSV_overlay',css:{color:'black',position:'absolute',top:'0',left:'0',width:$(document).width(),height:'150%',opacity:'0.4',backgroundColor:'black'}}).append($('<div>',{id:'CSV_preview',css:{padding:'56px',position:'absolute',top:'10%',left:'20%',width:'800px',height:'400px',backgroundColor:'white',borderRadius:'5px'}}).append($("<div>",{id:'CSV_preview_table',marginLeft:'auto',marginRight:'auto',css:{overflow:'scroll',position:'absolute',top:'25%',height:'330px',width:'86%',borderRadius:'5px',border:'solid thin gray'}})).append($("<div>",{id:'csvControl',css:{position:'absolute',top:'2%',bottom:'76%',width:'86%',borderRadius:'5px'}}))));$("#csvControl").append($("<p>",{css:{position:'relative',left:'5px'}}).append($("<span>",{html:"Title: "})).append($("<input>",{id:'titleInput',value:CSV_title,css:{position:'relative',left:'5px',marginRight:'40px'},change:function(){CSV_title=$(this).val();}})).append($("<span>",{html:'Data has header row?'})).append($("<input>",{id:'dataHasHeader',type:'checkbox',checked:(csvHasHeader)?true:false,css:{position:'relative',left:'5px'},change:function(){csvHasHeader=($(this).is(":checked"))?true:false;self.show()}}))).append($("<p>",{css:{position:'relative',left:'5px'}}).append($("<span>",{html:"Cell delimiter: "})).append($("<select>",{id:'cellDelimInput',html:'<option value=0>Comma (,)</option><option value=1>Tab (\\t)</option><option value=2> Other </option>',css:{width:'100px',position:'relative',left:'5px',marginRight:'40px'},change:function(){if($(this).val()==2){$("#cellDelimOther").show();}else{$("#cellDelimOther").hide();cellDelim=cellopts[$(this).val()];self.show();}}})).append($("<span>",{html:'Text delimitier: '})).append($("<select>",{id:'textDelimInput',html:"<option value=0>Double quote (\")</option><option value=1>Single quote (\')</option>",css:{position:'relative',left:'5px'},change:function(){quote=textopts[$(this).val()];self.show();}})));$('#CSV_overlay').append($("<input>",{id:'cellDelimOther',css:{height:$('#cellDelimInput').css('height')-2,width:'75px',position:'absolute',left:$('#cellDelimInput').offset().left,top:$('#cellDelimInput').offset().top},change:function(){cellDelim=$(this).val();self.show();}}).hide());$('#CSV_preview').append($("<button>",{html:'Back',css:{position:'absolute',bottom:'15px',left:'350px'},click:function(){$(input).val("");$('#CSV_overlay').remove();}}).button()).append($("<button>",{html:'Accept',css:{position:'absolute',bottom:'15px',right:'391px'},click:function(){self.done();}}).button())
$('#cellDelimInput').val(cellDelim);$('#textDelimInput').val(quote);}
self.show=function(){if($('#CSV_overlay').length>0)
$('#CSV_preview_table').children().remove();else
self.init();self.parse(10);var gwidth;for(var i=0;i<10;i++){var odd=(i%2==0)?'lightgray':'transparent';$("#CSV_preview_table").append($("<div>",{css:{height:$('#CSV_preview_table').height()/10+'px',backgroundColor:odd}}).addClass("row"));for(var j=0;j<CSV_data[i].length;j++){var alignment='right';if(isNaN(CSV_data[i][j]))
alignment='left';$("#CSV_preview_table").children().eq(i).append($("<div>",{html:(i===0&&csvHasHeader)?'<center><strong>'+CSV_data[i][j]+'</strong></center>':CSV_data[i][j],align:alignment,css:{paddingLeft:'2px',paddingRight:'2px',height:$('#CSV_preview_table').height()/10+'px',float:'left',outline:'1px solid black'}}).addClass("col"+j));if($('.col'+j).length>1&&$('.col'+j).last().width()>$('.col'+j).eq($('.col'+j).last().index('.col'+j)-1).width()){$('.col'+j).css('width',$('.col'+j).last().width()+'px');}else{$('.col'+j).last().css('width',$('.col'+j).width()+'px');}}}
var gwidth=0;for(var i=0;i<$('.row').last().children().length;i++){gwidth+=$('.row').last().children().eq(i).width();}
$('.row').css('width',(gwidth+(CSV_data[0].length*4))+'px');}
self.to_JSON=function(){if(CSV_data.length==0){throw new Error("The CSV_data source is empty.")
return;}else{var table={"title":(CSV_title!="")?CSV_title:"New Table","headers":(csvHasHeader)?CSV_data[0]:null,"data":(csvHasHeader)?CSV_data.slice(1):CSV_data}
$("#CSV_overlay").remove();return table;}}
self.done=function(){self.parse();if(callback!=null){if(output_type==='JSON'){callback(self.to_JSON());}else if(output_type==='Google')
callback(self.to_Gtable());else if(output_type==='Array'){callback(CSV_data);}
else{console.log('Output type not recognized or not implemented.');return;}}else{if(output_type==='JSON')
return(self.toJSON());else if(output_type==='Google')
return(self.to_Gtable());else if(output_type==='Array')
return CSV_data;else
console.log('Output type not recognized or not implemented.');}}}
SHIVA_Show.prototype.DrawWordCloud=function(){Array.prototype.extract=function(attr){var res=[];for(var i=0;i<this.length;i++){res.push(this[i][attr]);}
return res;}
Array.prototype.diff=function(arr){return this.filter(function(val){return arr.indexOf(val.text)==-1;});}
Array.prototype.find=function(item,attr){for(var i=0;i<this.length;i++){if(this[i][attr]==item)
return this[i];}
return false;}
var cloud;var fill=d3.scale.category20();if(!this.wcloud){cloud=new wordCloud(this.container);this.wcloud=cloud;cloud.options=this.options;cloud.load(this.options.dataSourceUrl);}else{cloud=this.wcloud;var props=Object.keys(this.options);for(var i=0;i<props.length;i++){var prop=props[i];if(this.wcloud.options[prop]!=this.options[prop]){if(prop=="dataSourceUrl"){cloud.options=this.options;cloud.load(cloud.options['dataSourceUrl']);break;}else if(prop=="width"||prop=="height"||prop=="low_threshold"||prop=="high_threshold"||prop=='tiltRange'||prop=="scale"){if(prop=="height"){if(this.options.height.indexOf('%')!=-1)
this.options.height=$('#containerDiv').height()*(this.options.height.slice(0,-1)/100);}
cloud.options=this.options;cloud.buildLayout(cloud.d);}else{switch(prop){case'font_name':d3.selectAll('text').style('font-family',this.options.font_name);break;case'backgroundColor':d3.select('rect').style('fill','#'+this.options.backgroundColor);break;case'spectrum':cloud.colorize(this.options.spectrum);break;case'title':d3.select('#cloudTitle').text(this.options.title);break;case'titleColor':d3.select('#cloudTitle').attr('fill','#'+this.options.titleColor);break;case'titleFontSize':d3.select('#cloudTitle').style('font-size',this.options.titleFontSize+'px');break;case'wordList':if(this.options.wordList=="true")
$('#cloudShowListButton').show();else{$('#cloudShowListButton').hide();$('#wordCloudWordList').hide();}
break;}}}}
cloud.options=this.options;}
function wordCloud(container){this.d=[];this.filterSet=[];this.container=container;this.draw=function(data){var word=data;$('svg').remove();$('#cloudLoad').remove();var svg=d3.select("#"+cloud.container).append("svg").attr("id","wordCloud").attr("width",cloud.options.width).attr("height",cloud.options.height)
svg.append("g").attr('scale','(1,-1)').append('rect').attr('x',0).attr('y',0).attr('width','100%').attr('height','90%').style('fill',(cloud.options.backgroundColor=="")?'white':cloud.options.backgroundColor);d3.select('g').selectAll("text").data(data).enter().append("text").attr('class','word').style("font-size",function(d){return d.size+"px";}).style("font-family",cloud.options.font_name).style("fill",function(d,i){return fill(i);}).attr("text-anchor","middle").attr("transform",function(d){return"translate("+[d.x+cloud.options.width/2,d.y+cloud.options.height/2]+")rotate("+d.rotate+")";}).text(function(d){return d.text;});d3.select('svg').append('text').attr('id','cloudTitle').text(cloud.options.title).style('font-size',cloud.options.titleFontSize+'px').attr('text-anchor','middle').attr('y',cloud.options.height-(cloud.options.titleFontSize)).attr('x',cloud.options.width/2);if($('#wordCloudWordList').length==0){$('#containerDiv').append($('<a>').attr('id','cloudShowListButton').css({position:'absolute',top:'10px',left:0,width:'25px',height:'20px'}).click(function(){$('#wordCloudWordList').toggle();}).button({icons:{primary:'ui-icon-script'}}).hide());$('#containerDiv').append($('<div>',{id:'wordCloudWordList',css:{position:'absolute',top:'10px',left:'20px',height:(cloud.options.height*0.6)+"px",width:'120px',borderRadius:'8px',border:'5px solid #EEE',backgroundColor:'white',overflow:'scroll',padding:'5px',}}).hide());}
d3.selectAll('.listEntry').remove();d3.select('#wordCloudWordList').selectAll('.listEntry').data(cloud.d).enter().append('div').attr('class','listEntry').style('vertical-align','middle').style('height','20px').style('width','100px').text(function(d){return d.text+" ("+d.freq+")";}).on('click',function(d){console.log(d.text+" : "+d.freq);shivaLib.SendShivaMessage("ShivaWord=click|"+window.name+"|"+d.text+"|"+d.freq);$('.listEntry').css('backgroundColor','white');$(this).css('backgroundColor','rgba(255,255,105,0.5)');});var listClickHandler=function(e,pass){e.preventDefault();e.stopPropagation();if(typeof pass=="undefined")
pass=false;if($(this).hasClass('ui-icon-close')){$(this).removeClass('ui-icon-close').addClass('ui-icon-arrowreturnthick-1-w');$(this).parent().css('opacity',0.5);}
else{$(this).removeClass('ui-icon-arrowreturnthick-1-w').addClass('ui-icon-close');$(this).parent().css('opacity',1);}
var word=$(this).parent().text().split(' ')[0];if(!pass)
cloud.filter();};$('.listEntry').append($('<span>',{css:{float:'right'}}).addClass('listEntryFilter ui-icon ui-icon-close').on('click',listClickHandler));$('.listEntry').filter(function(i){return cloud.filterSet.indexOf($(this).text().split(' ')[0])!=-1;}).find('span').trigger('click',[true]);if(cloud.options.wordlist=="true"){$('#cloudShowListButton').show();}
if(cloud.options.spectrum!="")
cloud.colorize(cloud.options.spectrum);d3.selectAll('.word').on("click",function(d){console.log(d.text+" : "+d.freq);shivaLib.SendShivaMessage("ShivaWord=click|"+window.name+"|"+d.text+"|"+d.freq);});shivaLib.SendShivaMessage("ShivaWord=ready|"+window.name);};this.buildLayout=function(data){var fs;if(cloud.options.scale=="logarithmic")
fs=d3.scale.log().range([10,100]);else if(cloud.options.scale=="linear")
fs=d3.scale.linear().domain([0,data[0].freq]).range([10,100]);else if(cloud.options.scale=="binary")
fs=d3.scale.quantile().range([0,(cloud.options.height/(data.length/5))]);var high,low;low=(cloud.options.low_threshold=='')?0:parseInt(cloud.options.low_threshold);high=(cloud.options.high_threshold=='')?100000000000:parseInt(cloud.options.high_threshold);data=data.filter(function(el){return el.freq>=low&&el.freq<=high;});d3.layout.cloud().size([cloud.options.width,cloud.options.height*0.8]).words(data).rotate(function(){return~~((Math.random()*2)*cloud.options.tiltRange)*((Math.random()>0.5)?1:-1);}).font(cloud.options.font_name).fontSize(function(d){return fs(d.freq);}).on("end",cloud.draw).start();};this.load=function(src,algo){if(typeof algo=="undefined")
algo="raw";d3.select('svg').remove();var qs='parser.php?'+encodeURIComponent('url')+'='+encodeURIComponent(src)+"&"+encodeURIComponent('a')+'='+encodeURIComponent(algo);d3.json(qs,function(error,data){if(data.error){if(data.error=="fetch_fail")
alert("Sorry we didn't find anything at that URL. Plese make sure it is correct.");else if(data.error=="robots")
$('<div id="wordcloudError"><p> SHIVA has detected that the site you are trying to access has set a robots.txt policy that prohibits machine access to the content you are trying to fetch. Please instead copy and paste the text from the page you would like to access into the text box to the right of "Data source URL". <br /><br /> For more information about robots.txt, please visit <a target="_blank" href="http://www.robotstxt.org/robotstxt.html">this page.</a></p></div>').dialog({appendTo:'body',position:'top'});return false;}
cloud.d=data;cloud.buildLayout(data);});};this.filter=function(){var words=[];cloud.filterSet.length=0;$('.listEntry').filter(function(){return $(this).children('span').hasClass('ui-icon-close');}).each(function(){words.push($(this).text().split(' ')[0]);});var d=cloud.d.filter(function(el){if(words.indexOf(el.text)==-1){cloud.filterSet.push(el.text);return false;}
else
return true;});cloud.buildLayout(d);};this.colorize=function(colors){var opts=colors.split(',').slice(0,-1);if(opts.length==1)
opts.push('ffffff');var spec=[];for(var j=1;j<opts.length;j++){var s=d3.hsl('#'+opts[j-1]);var e=d3.hsl('#'+opts[j]);spec.push(d3.interpolate(s,e));}
var size=cloud.d[0].freq+1;d3.selectAll('.word').style('fill',function(d,i){var hole=Math.floor((cloud.d[i].freq/size)*spec.length);var rem=(cloud.d[i].freq/size)*spec.length%1;return spec[hole](rem);});};}}
SHIVA_Show.prototype.WordActions=function(msg){var m=msg.split('=')[1];var cmd=m.split('|');switch(cmd[0]){case'data':if(/^http/gi.test(cmd[1])){this.wcloud.load(cmd[1]);}else{try{var json=JSON.parse(cmd[1]);json.sort(function(a,b){return a.size-b.size;});this.wcloud.buildLayout(json);}catch(e){this.wcloud.load(cmd[1]);}}
break;case'resize':if(cmd[1]=="100"){$("#"+shivaLib.container).width("100%");$("#"+shivaLib.container).height("100%");this.wcloud.options.width=$("#"+shivaLib.container).width();this.wcloud.options.height=$("#"+shivaLib.container).height();}
this.wcloud.buildLayout(this.wcloud.d);break;}}
SHIVA_Show.prototype.DrawPoster=function()
{var str;var options=this.options;var container=this.container;var con="#"+container;var _this=this;this.items=new Array();for(var key in options){if(key.indexOf("item-")!=-1){var o=new Object;var v=options[key].split(';');for(i=0;i<v.length;++i){v[i]=v[i].replace(/http:/g,"http`");o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");}
this.items.push(o);}}
if(!this.posterScale)
this.posterScale=2;var str="<div id='posterDiv' style='position:absolute;border:1px solid;";str+="background-color:#"+options.backCol+"'></div>";$(con).html(str);$(con).css({border:"1px solid",overflow:"hidden",margin:"0px",padding:"0px"});$(con).width(options.width);$(con).height(options.height);$("#posterDiv").draggable({drag:function(event,ui){var w=$("#posterDiv").width();var h=$("#posterDiv").height();var s=shivaLib.posterScale;shivaLib.posterX=(-$("#posterDiv").css("left").replace(/px/,"")+(w/s/2))/w;shivaLib.posterY=(-$("#posterDiv").css("top").replace(/px/,"")+(h/s/2))/h;shivaLib.DrawPosterOverview();$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos);}});if(options.dataSourceUrl){str="<img src='"+options.dataSourceUrl+"' ";str+="height='100%' width='100%'>";$("#posterDiv").append(str);}
this.DrawPosterOverview();if(this.posterMode!="Connect"){this.DrawPosterPanes(-1,"draw");this.DrawLayerControlBox(this.items,(options.controlbox=="true"));}
var v=options.pos.split("|");this.PositionPoster(v[0],v[1],v[2]);this.DrawPosterOverview();this.SendReadyMessage(true);}
SHIVA_Show.prototype.PositionPoster=function(size,left,top)
{if(size!=undefined){shivaLib.posterScale=size/1000;shivaLib.posterX=left/1000;shivaLib.posterY=top/1000;}
var s=shivaLib.posterScale;$("#posterDiv").width(shivaLib.options.width);$("#posterDiv").height(shivaLib.options.height);var w=$("#posterDiv").width()*s;var h=$("#posterDiv").height()*s;$("#posterDiv").width(w);$("#posterDiv").height(h);var l=w*shivaLib.posterX-(w/s/2);var t=h*shivaLib.posterY-(h/s/2);$("#posterDiv").css({"left":-l+"px","top":-t+"px"});$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));this.DrawPosterPanes(-1,"resize");if(typeof(DrawPosterGrid)=="function")
DrawPosterGrid();var l=$("#"+shivaLib.container).position().left;var r=l-0+(w/s-w);var t=$("#"+shivaLib.container).position().top;var b=t-0+(h/s-h);$("#posterDiv").draggable("option",{containment:[r,b,l,t]});}
SHIVA_Show.prototype.GoToPosterPane=function(num)
{if(num<this.items.length){var v=this.items[num].data.split("|");v[0]=Math.round(1000/v[0]*1000);this.options.pos=v[0]+"|"+v[1]+"|"+v[2];$("#posterOverDiv").hide();}
else{$("#posterOverDiv").show();this.options.pos="1000|500|500";}
v=this.options.pos.split("|");this.PositionPoster(v[0],v[1],v[2]);this.DrawPosterOverview();$("#shcr"+num).attr("checked","checked");}
SHIVA_Show.prototype.DrawPosterOverview=function()
{var str;var options=this.options;var s=this.posterScale;var w=$("#containerDiv").width()/4;var h=$("#containerDiv").height()/4;var h=w*h/w;if(($("#posterOverDiv").length==0)&&(options.overview=="true")){var css={position:"absolute",left:w*4-w+"px",width:w+"px",height:h+"px",top:h*4-h+"px",border:"1px solid","background-color":"#"+options.backCol};str="<div id='posterOverDiv'></div>";$("#"+this.container).append(str);$("#posterOverDiv").css(css);if(options.dataSourceUrl){str="<img src='"+options.dataSourceUrl+"' ";str+="height='"+h+"' ";str+="width='"+w+"' >";$("#posterOverDiv").append(str);}
if(typeof(DrawPosterOverviewGrid)=="function")
DrawPosterOverviewGrid();var css={position:"absolute",border:"1px solid #666","z-index":3,"background-color":"rgba(220,220,220,0.4)"};str="<div id='posterOverBox'></div>";$("#posterOverDiv").append(str);$("#posterOverBox").css(css);$("#posterOverBox").draggable({containment:"parent",drag:function(event,ui){var w=$("#posterOverDiv").width();var pw=$("#posterDiv").width();var h=$("#posterOverDiv").height();var ph=$("#posterDiv").height();var s=shivaLib.posterScale;var x=Math.max(0,ui.position.left/w*pw);var y=Math.max(0,ui.position.top/h*ph);shivaLib.posterX=(x+(pw/s/2))/pw;shivaLib.posterY=(y+(ph/s/2))/ph;$("#posterDiv").css({"left":-x+"px","top":-y+"px"});$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos);}});$("#posterOverBox").resizable({containment:"parent",aspectRatio:true,minHeight:12,stop:function(event,ui){var w=$("#posterOverDiv").width();var pw=$("#posterDiv").width();var h=$("#posterOverDiv").height();var ph=$("#posterDiv").height();shivaLib.posterScale=Math.max(w/ui.size.width,1);var s=shivaLib.posterScale;var x=Math.max(0,ui.position.left/w*pw);var y=Math.max(0,ui.position.top/h*ph);shivaLib.posterX=(x+(pw/s/2))/pw;shivaLib.posterY=(y+(ph/s/2))/ph;$("#propInput0").val(shivaLib.options.pos=Math.round(shivaLib.posterScale*1000)+"|"+Math.round(shivaLib.posterX*1000)+"|"+Math.round(shivaLib.posterY*1000));shivaLib.PositionPoster();if(shivaLib.options.chartType=="Zoomable")
shivaLib.SendShivaMessage("ShivaImage=move|"+window.name+"|"+shivaLib.options.pos);}});}
var x=$("#posterDiv").css("left").replace(/px/,"");x=-x/w/4*w/this.posterScale;var y=$("#posterDiv").css("top").replace(/px/,"");y=-y/h/4*h/this.posterScale;$("#posterOverBox").width(w/this.posterScale).height(h/this.posterScale);$("#posterOverBox").css({"left":x+"px","top":y+"px"});}
SHIVA_Show.prototype.DrawPosterPanes=function(num,mode)
{var i,v,u,str,dw,dh,x,y,s=0,isImg=true;var scale=this.posterScale;var e=this.items.length;var w=$("#posterDiv").width();var h=$("#posterDiv").height();if(num!=-1)s=num,e=num-0+1;for(i=0;i<e;++i){v=this.items[i].data.split("|");dw=v[0]/1000*w;dh=v[0]/1000*h;x=w*v[1]/1000-(dw/2);y=h*v[2]/1000-(dh/2);str="<div id='posterPane"+i+"' style='position:absolute;background:none transparent;";if(this.items[i].style)
str+=this.items[i].style.replace(/\|/g,";").replace(/=/g,":");str+="'>"
u=this.items[i].url;if(isImg=u.match(/[[.]jpg|jpeg|gif|png]/i))
str+="<img src='"+this.items[i].url+"' width='"+dw+"'>";else if(u){if(!isNaN(u))
u="http://www.viseyes.org/shiva/go.htm?e="+u;str+="<iframe id='posterFrame-"+i+"' src='"+u+"'";if(this.items[i].scrollbars=="false")
str+="scrolling='no' ";str+="frameborder='0' allowtransparency='true'></iframe>";}
if(mode=="draw"){$("#posterPane"+i).remove();$("#posterDiv").append(str+"</div>");if(this.posterMode=="Edit"){var str="<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;border:1px dashed'>";str+="<div id='posterPaneLab"+i+"' style='position:absolute;left:0px;text-shadow:1px 1px #eee'>";str+="<b> "+(i+1)+". "+this.items[i].layerTitle+"</b></div>";$("#posterPane"+i).append(str+"</div>");}}
$("#posterFrame-"+i).height(dh);$("#posterFrame-"+i).width(dw);$("#posterPane"+i).height(dh);$("#posterPane"+i).width(dw);$("#posterPane"+i).css({"left":x+"px","top":y+"px"});$("#posterPaneLab"+i).css("top",$("#posterPane"+i).height()+3+"px");if(this.options.overview=="true"){str="<div id='posterOverPane"+i+"' style='position:absolute;opacity:.4;border:1px solid white;pointer-events:none;background-color:#666'/>";if(mode=="draw")
$("#posterOverDiv").append(str);x=$("#posterPane"+i).position().left;y=$("#posterPane"+i).position().top;$("#posterOverPane"+i).css({"left":x/4/scale+"px","top":y/4/scale+"px"});$("#posterOverPane"+i).height(dh/4/scale);$("#posterOverPane"+i).width(dw/4/scale);}
if((mode=="resize")&&(u)){var win=document.getElementById("posterFrame-"+i).contentWindow;win.postMessage("ShivaAct=resize|100","*");}
if(this.posterMode!="Edit")
continue;$("#posterPane"+i).resizable({containment:"parent",aspectRatio:isImg,stop:function(event,ui){var i=event.target.id.substr(10);var v=shivaLib.items[i].data.split("|");v[0]=Math.floor(Math.min(ui.size.width/$("#containerDiv").width()/shivaLib.posterScale,1)*1000);shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];$("#itemInput"+i+"-1").val(shivaLib.items[i].data);shivaLib.DrawPosterPanes(i,"resize");}});$("#posterPane"+i).draggable({containment:"parent",drag:function(event,ui){var i=event.target.id.substr(10);var v=shivaLib.items[i].data.split("|");var w=$("#posterDiv").width();var h=$("#posterDiv").height();var off=0;if(shivaLib.items[i].url.match(/[[.]jpg|jpeg|gif|png]/i))
off=12*shivaLib.posterScale;v[1]=Math.round(($("#posterPane"+i).position().left+$("#posterPane"+i).width()/2)/w*1000);v[2]=Math.round(($("#posterPane"+i).position().top+$("#posterPane"+i).height()/2+off)/h*1000);shivaLib.items[i].data=v[0]+"|"+v[1]+"|"+v[2];$("#itemInput"+i+"-1").val(shivaLib.items[i].data);shivaLib.DrawPosterPanes(i,"drag");}});}}
SHIVA_Show.prototype.DrawImage=function()
{var i,v,o,str;var options=this.options;var container=this.container;var con="#"+container;var _this=this;if(!options.chartType)
options.chartType="Slideshow";if(options.chartType=="Slideshow"){if(options.dataSourceUrl.indexOf("//docs.google.com")!=-1)
GetSpreadsheetData(options.dataSourceUrl,options.imgHgt,options.showImage,options.showSlide,options.transition,options.width);else if(options.dataSourceUrl){$("#"+this.container).html("<img id='"+this.container+"Img' "+"width='"+options.width+"' src='"+options.dataSourceUrl+"'/>");if(options.height)
$(con).css('height',options.height);this.SendReadyMessage(true);}
else
this.SendReadyMessage(true);}
else if((options.chartType=="Zoomable")&&(options.dataSourceUrl))
this.DrawPoster("Image");else if(options.chartType=="Montage"){var items=new Array();for(var key in options){if(key.indexOf("item-")!=-1){o={};v=options[key].split(';');for(i=0;i<v.length;++i)
o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");items.push(o);}}
this.items=items;$(con).height(options.height);$(con).width(options.width);var act=$("#accord").accordion("option","active");if((act===false)||(isNaN(act))||(!$("#accord").length))
act=0;if(!this.imageMob)
this.imageMob={div:this.container+"Img"};this.imageMob.start=0;this.imageMob.curMob=act;this.imageMob.audioStart=0;for(i=0;i<act;++i)
this.imageMob.audioStart+=items[i].dur-0;this.imageMob.numMobs=items.length;clearInterval(shivaLib.imageMob.interval);$(con).html("<img id='"+this.container+"Img' "+"' src='"+items[act].url+"' onclick='shivaLib.DrawImage()'/>");if(act<items.length-1)
$(con).append("<img id='"+this.container+"Img2' "+"' src='"+items[act+1].url+"' style='display:none' />");$("#"+this.container+"Snd").remove();this.imageMob.snd=null;if(options.audio){var file=options.audio.substr(0,options.audio.length-4);str="<audio id='"+this.container+"Snd'";str+="><source src='"+file+".ogg' type='audio/ogg'><source src='"+file+".mp3' type='audio/mpeg'></audio>";$(con).append(str);this.imageMob.snd=document.getElementById(this.container+"Snd");this.imageMob.snd.volume=options.volume/100;}
str="<div id='"+this.container+"Title'";if(options.etitle=="true")str+=" contenteditable='true'";else str+=" onclick='shivaLib.DrawImage()'";str+="style='top:0px;left:0px;height:90%;width:90%;padding:5%;position:absolute;";str+="font-size:"+options.height/20+"px;font-weight:bold;";str+="text-align:center;text-shadow:5px 5px 10px black;color:white'>";str+=items[act].title+"</div>";$(con).append(str);if($("#accord").length)
this.AnimateDiv("full");else
this.AnimateDiv("start");if((options.autoplay=="true")&&(!$("#accord").length))
$("#"+this.container+"PlyBut").trigger("click");}
function GetSpreadsheetData(file,imgHgt,showImage,showSlide,trans,wid){var query=new google.visualization.Query(file);query.send(handleQueryResponse);function handleQueryResponse(response){var a,i,j;var data=response.getDataTable();var cols=data.getNumberOfColumns();var rows=data.getNumberOfRows();var rowData=new Array()
for(i=0;i<rows;++i){a=new Array()
for(j=0;j<cols;++j)
a.push(data.getValue(i,j));rowData.push(a);}
AddImages(rowData,imgHgt,showImage,showSlide,trans,wid);shivaLib.SendReadyMessage(true);}}
function AddImages(data,imgHgt,showImage,showSlide,transition,wid)
{var str="<div id='gallery' class='ad-gallery'>"
if(showImage=="true")
str+="<div class='ad-image-wrapper'></div>";if(showSlide=="true")
str+="<div class='ad-controls'></div>";str+="<div class='ad-nav'><div class='ad-thumbs'><ul class='ad-thumb-list'>"
for(var i=1;i<data.length;++i){str+="<li><a href='"+data[i][0]+"'><img height='"+imgHgt+" 'src='"+data[i][0]+"'";if(data[i][1])
str+=" title='"+data[i][1]+"'";if(data[i][2])
str+=" alt='"+data[i][2]+"'";str+=" class='image"+i+"'></a></li>";}
str+="</ul></div></div></div>";$("#"+container).html(str);$('.ad-gallery').adGallery()[0].settings.effect=transition;$("#gallery").css("background","#ddd");$(".ad-gallery").css("width",wid)}}
SHIVA_Show.prototype.AnimateDiv=function(mode)
{var o,v;var mob=shivaLib.imageMob;if(!mob)
return;if(mode=="next"){if(mob.curMob<shivaLib.items.length-1){mob.curMob++;shivaLib.imageMob.start=new Date().getTime();shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);}
else{if(shivaLib.imageMob.snd)
shivaLib.imageMob.snd.pause();if(!$("#accord").length)
mob.curMob=0;$("#"+shivaLib.container+"PlyBut").show();return;}}
var o=shivaLib.items[mob.curMob];v=o.sp.split(",");mob.sx=v[0]-0;mob.sy=v[1]-0;mob.sw=v[2]-0;v=o.ep.split(",");mob.ex=v[0]-0;mob.ey=v[1]-0;mob.ew=v[2]-0;mob.dur=o.dur-0;mob.fx=o.fx;mob.url=o.url;mob.ease=o.ease;mob.title=o.title;$("#"+shivaLib.container+"Title").html(mob.title);$("#"+shivaLib.container).css("overflow","hidden");if(($("#"+shivaLib.container+"PlyBut").length==0)&&mob.dur){$("#"+shivaLib.container).append("<img id='"+this.container+"PlyBut' src='playbut.gif' style='position:absolute;top:48%;left:47%;padding:2px;padding-left:18px;padding-right:18px' class='propTable' width='18'>");$("#"+shivaLib.container+"PlyBut").click(function(){$(this).hide();if(shivaLib.imageMob.snd){if(shivaLib.imageMob.snd.readyState)
shivaLib.imageMob.snd.currentTime=shivaLib.imageMob.audioStart;shivaLib.imageMob.snd.play();}
clearInterval(shivaLib.imageMob.interval);shivaLib.imageMob.start=new Date().getTime();shivaLib.imageMob.interval=setInterval(shivaLib.AnimateDiv,42);shivaLib.SendShivaMessage("ShivaImage=play|"+window.name);});}
if(mob.url!=$("#"+mob.div).attr('src')){$("#"+mob.div).attr('src',shivaLib.items[mob.curMob].url);if(mob.curMob<mob.numMobs-1)
$("#"+mob.div+"2").attr('src',shivaLib.items[mob.curMob+1].url);}
var pct=(new Date().getTime()-mob.start)/(mob.dur*1000);if(mob.start==0)
pct=0;if(pct>=.99){shivaLib.SendShivaMessage("ShivaImage=pause|"+window.name);clearInterval(shivaLib.imageMob.interval);mob.start=0;shivaLib.AnimateDiv("next");return;}
if(mob.start==0)
pct=0;if(mob.ease=="both")
pct=1.0-((Math.cos(3.1414*pct)+1)/2.0);else if(mob.ease=="in")
pct=1.0-(Math.cos(1.5707*pct));else if(mob.ease=="out")
pct=1.0-(Math.cos(1.5707+(1.5707*pct))+1.0);var o={position:"relative"};o.left=(mob.sx+((mob.ex-mob.sx)*pct))/100;o.top=(mob.sy+((mob.ey-mob.sy)*pct))/100;o.width=1000000/((mob.sw+((mob.ew-mob.sw)*pct)));o.opacity=(mob.sa+((mob.ea-mob.sa*pct))/100);o.left=(-o.width*(o.left/100))+"%";o.top=(-o.width*(o.top/100))+"%";o.width+="%"
if((mode=="full")&&($("#accord").length)){o.top=o.left="0%",o.width="100%",o.opacity=1;$("#"+shivaLib.container).css("overflow","visible");}
$("#"+mob.div).css(o);}
SHIVA_Show.prototype.ImageActions=function(msg)
{var v=msg.split("|");if(v[0]=="ShivaAct=resize"){if(v[1]=="100")
shivaLib.options.width=shivaLib.options.height="100%";shivaLib.DrawImage();}}