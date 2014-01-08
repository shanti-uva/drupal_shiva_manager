//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB CONTROL   
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 


SHIVA_Show.prototype.DrawControl=function() 											//	DRAW CONTROL
{
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var items=new Array();
 	this.items=items;
	var _this=this;
    for (var key in options) {
		if (key.indexOf("item-") != -1) {
			var o=new Object;
			var v=options[key].split(';');
			for (i=0;i<v.length;++i) {
				v[i]=v[i].replace(/http:/g,"http`");
				o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				}
			items.push(o);
			}
		}
	if (options.chartType == "Dialog") 
		$.proxy(DrawDialog(items),this);
	else if (options.chartType == "Selector") 
		$.proxy(DrawSelector(items),this);
	else if (options.chartType == "TimeSlider")
		$.proxy(DrawTimeSlider(items),this);
	else if (options.chartType == "TimeStepper")
		$.proxy(DrawTimeStepper(items),this);
	else if (options.chartType == "InfoBox")
		$.proxy(DrawInfoBox(items),this);
	this.SendReadyMessage(true);											

	// Individual types:

	function DrawTimeStepper(items)
	{
		var i;
		var dd=container+"Stp";
		$(con).height(40);
		var str="<span id='"+dd+"'>";
		for (i=0;i<items.length;++i) { 
			str+="<input type='radio' id='stp"+i+"' name='stepper'"; 
			if (!i)
				str+=" checked=checked";
			str+="/><label for='stp"+i+"'>"+(i+1)+"</label>"; 
			items[i].ans=items[i].def;
			}
		str+="<input type='radio' id='stp"+i+"' name='stepper'"; 
		str+="/><label for='stp"+i+"'>NEXT</label>"; 
		str+="</span>";
		$(con).html(str);		
		$(con).css("text-align","left");		
		$(con).css("width",((items.length*25)+80)+"px");		
		$("#"+dd).buttonset().change(function(e) { shiva_Step(e.target.id.substr(3),_this) });
		$("#stp"+i).button({ text: true, icons: { primary: "ui-icon-triangle-1-e" }});
		}

	function DrawTimeSlider(items)											// TIMESLIDER
	{
		var hgt=40,wid=40;
		var dd=con+"Int";														// Id of slider
		$(dd).remove();															// Remove old one, if there
		$(con).append("<div id='"+dd.substr(1)+"'/>");							// Add slider div
		options.orientation=options.orientation.toLowerCase();					// Force l/c
		options.step-=0;	options.max-=0;		options.min-=0;					// Force as numbers
		if (options.orientation == "vertical") {								// If vertical
			$(dd).css("height","100%");											// Set slider height
			hgt=$(con).height();												// Set con height
			if (shivaLib.options.height)										// If height set by go.htm
				hgt=shivaLib.options.height;									// Use it
			}
		else{																	// Horizontal
			$(dd).css("width","100%");											// Set slider width
			wid=$(con).width();													// Set con width
			if (shivaLib.options.width)											// If width set by go.htm
				wid=shivaLib.options.width;										// Use it
			}
		$(con).width(wid);														// Resize container
		$(con).height(hgt);														// Resize container
		if (options.type == "Bar")												// If a bar
			options.range="min";												// Set to min
		else if (options.type == "Range")										// If a dula slider
			options.range=true;													// Set range
		if ((!options.def) && (options.type == "Range"))						// If no def set for range
			options.def="25,75";												// Set def
		if (options.def.indexOf(",") == -1)										// If not a range
			options.value=Number(options.def);									// Set single def
		else{																	// A range
			options.values=new Array();											// Alloc array
			options.values[0]=Number(options.def.split(",")[0]);				// Add min
			options.values[1]=Number(options.def.split(",")[1]);				// Add max
			}	
		if (!$('#sliderBack').length) {											// If no back yet
			var mc=document.createElement('canvas'); 							// Create canvas
			mc.setAttribute('id','sliderBack'); 								// Set id
			$(dd).append(mc)													// Add to DOM
			sliderContext=mc.getContext('2d');									// Get draw context
			}
		$(dd).slider("destroy");												// Kill old slider
		$(dd).slider(options);													// Set new slider

		$(dd).bind("slidestop", function(e, ui) { 								// On slide stop
			var which=-1;														// Assume 1st
			var val=ui.value;													// Get value
			if (ui.values)														// If a range
				val=ui.values[0];												// Get 1st slider value
			if (ui.value != val) {												// If second slider
				which=0;														// Set name
				val=ui.values[1];												// Use 2nd val
				}
			shivaLib.SendShivaMessage("ShivaSlider=click",(which+1)+"|"+val);	// Send message
 			});

		$(dd).bind("slide", function(e, ui) { 									// On slide
			var which=-1;														// Assume 1st
			var val=ui.value;													// Get value
			if (ui.values)														// If a range
				val=ui.values[0];												// Get 1st slider value
			if (ui.value != val) {												// If second slider
				which=0;														// Set name
				val=ui.values[1];												// Use 2nd val
				}
			shivaLib.SendShivaMessage("ShivaSlider=move",(which+1)+"|"+val);	// Send message
 			});
		DrawSliderTicks();
	}

	function DrawSliderTicks()
	{
		var g=_this.g;
		if (!g)
			g=_this.g=new SHIVA_Graphics();
		var hgt=40,wid=40,pos,val;
		var n=Number(options.ticks);
		var showValues=(options.showValues == "true")
		var min=Number(options.min);
		var max=Number(options.max);
		var isVert=(options.orientation == "vertical");
		if (isVert)
			hgt=$(con).height();
		else
			wid=$(con).width();
		$('#sliderBack').attr('width',wid);
		$('#sliderBack').attr('height',hgt);
		var inc=Number(Math.max(hgt,wid)/(n+1));
		var pos=inc;
		var tinc=Math.abs(max-min)/(n+1);
		var tpos=tinc;
		sliderContext.fillStyle=options.textCol;
		if (!isVert)
			sliderContext.textAlign="center";
		for (i=0;i<n;++i) {
			if (isVert)
				g.DrawLine(sliderContext,"#000",1,8,pos,15,pos,.5);
			else
				g.DrawLine(sliderContext,"#000",1,pos,8,pos,15,.5);
			if (showValues) {
				val=tpos;
				if (Math.abs(max-min) > 4)
					val=Math.round(val);
				else{
					val=Math.round(tpos*100);
					val=Math.floor(val/100)+"."+(val%100);
					}
				val=Number(val)+min;
				if (isVert)
					sliderContext.fillText(val,18,Number(hgt)-pos+3);
				else	
					sliderContext.fillText(val,pos,25);
				}
			pos+=inc;
			tpos+=tinc;
			}
		if (showValues) {
			sliderContext.font="bold 10px Arial";
			sliderContext.textAlign="left";
			if (isVert) {
				sliderContext.fillText(min,14,hgt);	
				sliderContext.fillText(max+options.suffix,14,10);	
				}
			else{
				sliderContext.fillText(min,0,25);	
				sliderContext.textAlign="right";
				sliderContext.fillText(max+options.suffix,wid,25);	
				}
			sliderContext.font="";
			}
	}
		
	function DrawSelector(items)
	{
		var i,o,nChars=0;
		var dd=container+"Sel";
		var str="<span id='"+dd+"'>";
		$(con).height(40);
		for (i=0;i<items.length;++i) { 
			o=items[i];
			nChars+=o.label.length+5;
			if (items[i].type)	nChars+=4;
			if (options.style == "Button") 
				str+="<input type='button' id='sel"+i+"' value='"+o.label+"'>"; 
			else if (options.style == "Toggle") 
 				str+="<input type='checkbox' id='sel"+i+"'/><label for="+"'sel"+i+"'>"+o.label+"</label>"; 
			else{
				str+="<input type='radio' id='sel"+i+"' name='selector'";				
				if (o.def == "true")
					str+=" checked='sel"+i+"'";
				if (!items[i].label)
					str+="/><label for='sel"+i+"'>&nbsp;</label>"; 
				else
					str+="/><label for='sel"+i+"'>"+o.label+"</label>"; 
				}
			}
		str+="</span>";
		$(con).html(str);		
		for (i=0;i<items.length;++i) { 
			if (options.style == "Toggle")
				$("#sel"+i).click(function(){
					var ch=this.checked?"checked":"unchecked"
					var id=this.id.substr(3)
					shivaLib.SendShivaMessage("ShivaSelect=click",id+"|"+ch)
					});
			else
				$("#sel"+i).click(function(){shivaLib.SendShivaMessage("ShivaSelect=click",this.id.substr(3)+"|checked")});
			} 
 		
		$(con).css("text-align","left");		
		$("#"+dd).buttonset();
		$(con).css("width",(nChars*6)+"px");		
		for (i=0;i<items.length;++i)  
			if (items[i].type != "Button")	{
				items[i].type=items[i].type.replace(/\./g,"");
				items[i].type=items[i].type.replace(/ui-icon-/g,"");
				$("#sel"+i).button({ text: true, icons: { primary: "ui-icon-"+items[i].type }});
				}
	}
	 
	function DrawDialog(items)
	{
		var o,i,v,sty,str="";
		var dd="#"+container+"Dlg";
		$(dd).remove();
		$(con).append("<div id='"+container+"Dlg' style='width:auto;border:1px solid #999;padding:8px;background-color:#f8f8f8;text-align:left' class='rounded-corners'/>");
		for (o in options){
       		v=options[o];
    		if (v == "true") 	v=true;
    		if (v == "false") 	v=false;
			options[o]=v;
			}
		
		$(con).width(options.width)
		if ((options.draggable) && (!_this.editMode))
			$(dd).draggable();
		if (options.title)		
			str+="<div align='center'><b>"+options.title+"</b></div><br>";
		for (i=0;i<items.length;++i) {
			o=items[i];
			if (o.type)
				sty=o.type.toLowerCase();
			if (sty == 'checkbox') {
				str+="<input type='"+sty+"'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				if (o.def)
					str+=" checked=checked";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if (sty == 'radio') {
				str+="<input type='"+sty+"'";
				str+=" name='"+o.group+"' id='"+o.name+"'";
				if (o.def)
					str+=" checked=checked";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if ((sty == 'input') || (sty == 'button')) {
				str+="<input type='"+sty+"' size='23'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				if (o.def)
					str+=" value='"+o.def+"'";
				str+="/> ";
				if (o.label)
					str+=o.label;
				}
			else if  (sty == 'range')
				str+="<div style='width:120px;display:inline-block' id='"+o.name+"'></div> "+o.label;
			else if (sty == 'combo') {
				str+="<select ";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				str+=">";
				v=o.label.split("|");
				for (var j=0;j<v.length;++j) {
					str+="<option";
					if (o.def == v[j])
						str+=" selected='selected'";
					str+=">"+v[j]+"</option>";
					}
				str+="</select>";
				}
			else if (sty == 'line') {
				str+="<hr style='margin-top:.5em;margin-bottom:.5em'/>"; 
				continue;
				}
			else if (sty == 'text')
				str+="<span style='margin-top:.5em;margin-bottom:.5em'>"+o.label+"</span>"; 
			else if (sty == 'image') {
				str+="<input type='"+sty+"' src='"+o.def+"'";
				str+=" name='"+o.name+"' id='"+o.name+"'";
				str+="style='margin-top:.5em;margin-bottom:.5em'";
				str+="/>";
				}
			str+="<br/> ";
			}
		$(dd).html(str);
		for (i=0;i<items.length;++i) {
			o=items[i];
			if (o.type)
				sty=o.type.toLowerCase();
			if ((sty == "radio") || (sty == "image") || (sty == "button")) 
				$("#"+o.name).click(function(){ 
					var id=this.id.substr(5)
					shivaLib.SendShivaMessage("ShivaDialog=click",id+"|checked")
					});
			else if (sty == "checkbox") 
				$("#"+o.name).click(function(){ 
					var id=this.id.substr(5)
					var ch=this.checked?"checked":"unchecked"
					shivaLib.SendShivaMessage("ShivaDialog=click",id+"|"+ch)
					});
			else if ((sty == "input") || (sty == "combo"))				
				$("#"+o.name).change(function(){ 
					var id=this.id.substr(5)
					var ch=this.value;
					shivaLib.SendShivaMessage("ShivaDialog=click",id+"|"+ch)
					});
			else if (sty == "range") {
				if (o.def == "false")	o.def=0;
				var ops={ min:0, max:100, value:o.def-0, stop:function(event,ui) {											
					var id=this.id.substr(5)
					shivaLib.SendShivaMessage("ShivaDialog=click",id+"|"+ui.value)
					}};    
				$("#"+o.name).slider(ops);	
				}										
			}
	}

	
	function DrawInfoBox(items)
	{
		var str="";	
		var min=0;
		var dd="#"+container+"Inf";
		$(dd).remove();
		$(con).append("<div id='"+container+"Inf' style='border:1px solid #999;padding:8px;text-align:left' class='rounded-corners'/>");
		for (o in options){
       		v=options[o];
    		if (v == "true") 	v=true;
    		if (v == "false") 	v=false;
			options[o]=v;
			}
		if (options.title)		
			str+="<div align='center'><b>"+options.title+"</b></div>";
		if ((options.closer) || (options.title)) {
			str+="<br/>";
			min=16;
			}
		var content="#"+container+"Con";
		str+="<div id='"+container+"Con'></div>"
		$(dd).html(str);
		if (options.backCol	== -1)		$(dd).css("background-color","transparent")
		else							$(dd).css("background-color","#"+options.backCol)
		if (options.frameCol == -1)		$(dd).css("border-color","transparent")
		else							$(dd).css("border-color","#"+options.frameCol)
		if (options.width  != "auto") 	$(dd).css("width",options.width+"px");
		if (options.height != "auto") {	
			$(dd).css("height",options.height+"px");
			$(content).css("height",options.height-min+"px");
			}
		if ((options.text) && (options.style == "Text"))				
			$(content).html(options.text);
		if (options.scroller)  			$(content).css("overflow","scroll").css("overflow-x","hidden"); 
		else 							$(content).css("overflow","hidden");
		if (options.closer) {
			var x=$(dd).width()-2;							
			str="<img id='Clo"+dd.substr(1)+"' src='closedot.gif' style='position:absolute;left:"+x+"px;top:5px'/>" 
			$(dd).append(str);
			$("#Clo"+dd.substr(1)).click(function(){
				var id=this.id.substr(3);
				$("#"+id).hide();
				shivaLib.SendShivaMessage("ShivaDialog=close",options.title);
				});
			}
		}
		
}	// Dialog closure end

	function shiva_Step(num, obj)
	{
		if (num < 0)
			num=obj.lastStep-0+1;
		num=Math.min(num,obj.items.length-1);
		obj.lastStep=num;
		for (var i=0;i<obj.items.length;++i)
			$("#stp"+i).removeAttr("checked");
		$("#stp"+num).attr("checked",true);
		$("#shiva_stepq").remove();
		var str="<div id='shiva_stepq'><br/><b>"+obj.items[num].label+"</b><br/>";
		shivaLib.SendShivaMessage("ShivaStep=click",num+"|"+obj.items[num].ques+"|"+obj.items[num].ans);
		if (obj.items[num].ques.indexOf("|") != -1) {
			str+="<select name='shiva_stepa' id='shiva_stepa' onChange='shiva_onStepAnswer("+num+","+this+")'>";
			var v=obj.items[num].ques.split("|");
			for (var j=0;j<v.length;++j) {
				str+="<option";
				if (obj.items[num].ans == v[j])
					str+=" selected='selected'";
				str+=">"+v[j]+"</option>";
				}
			str+="</select></div>";
			$("#"+obj.container).append(str);
			}
		else if (obj.items[num].ques) {
			var e="onblur";
			if (obj.items[num].ques == "color")
				e="onfocus";
			str+="<input id='shiva_stepa' type='input' "+e+"='shiva_onStepAnswer("+num+","+this+")'></div>";
			$("#shiva_stepa").val(obj.items[num].ans);
			}			
		$("#"+obj.container).append(str);
		if ($("#accord").length)
			$("#accord").accordion({ active: num });
	}
	
	function shiva_onStepAnswer(num, obj)
	{
		if (obj.items[num].ques == "color")
			obj.ColorPicker(-1,"shiva_stepa");
		obj.items[num].ans=$("#shiva_stepa").val();
	}


SHIVA_Show.prototype.ControlActions=function(msg)					// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=resize") { 									// RESIZE
		if (v[1] == "100") {											// If forcing 100%
			$("#containerDiv").width("100%");							// Set container 100%
			$("#containerDiv").height("100%");							// Set container 100%
			}
		shivaLib.DrawControl();											// Redraw control
		}
}
