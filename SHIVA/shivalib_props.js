//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 
//  SHIVALIB PROPERTIES  
//  ///////////////////////////////////////////////////////////////////////////////////////////////////// 

SHIVA_Show.prototype.SaveData=function(mode, style, items, props, type) 			// SAVE DATA FROM FROM TO JSON, ETC
{
		var i,j,k,o,str1;
		var ovr=""
		var itemStart;
		var str="{\n";
		$('#formatter').val(0)
		var atts=new Array();
		for (o in props) 
			atts.push(o);
		if (items) {
			for (i=0;i<atts.length;++i)
				if (atts[i] == "item") {
					atts[i]="name";
					break;
				}
			itemStart=i;
			for (j=0;j<items.length;++j) 
				for (k=itemStart+1;k<atts.length;++k)	
					items[j][atts[k]]=$("#itemInput"+j+"-"+(k-i)).val();
			}
		if ((mode == 'JSON') || (mode == "GetJSON") || (mode == "Canvas") || (mode == "eStore")) {
			if (items && items.length) {
				for (i=0;i<items.length;++i) {
					str+="\t\"item-"+(i+1)+"\": \"";
					for (k=itemStart;k<atts.length;++k)	{
						str1=items[i][atts[k]];
						if (str1) {
							if ((props[atts[k]]) && (props[atts[k]].opt == "list"))
								str1=str1.replace(/\n/g,"<br/>").replace(/\r/g,"").replace(/\:/g,"`");
							else
								str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");
							}
						str+=atts[k]+":"+str1+";"; 
						}
					str=str.substring(0,str.length-1)+"\",\n";	
					}
			if (!this.overlay)
				str=str.substring(0,str.length-3)+"\",\n";	
				}
			if (this.overlay && this.dr)
				str+=this.dr.SaveDrawData(true);
			if (this.ev && this.ev.events.length) {
				var group=this.options.shivaGroup;
				str+="\"shivaEvents\": "+this.ArrayToString(this.ev.events,group)+",\n";
				}
			var j=0;
			if (type)
		        str+="\t\"chartType\": \""+type+"\",\n";
			for (o in props) {
		        if (o == "item")
		        	break;
		       	str1=$("#propInput"+(j++)).val(); 	
		        if ((props[o].opt == "list") && (str1))
		        	str1=str1.replace(/\n/g,",").replace(/\r/g,"");
	        	str+="\t\""+o+"\": \""+str1+"\",\n";
		        }
			d=new Date().toUTCString();
			str+="\t\"shivaMod\": \""+d.substring(0,d.length-13)+"\",\n";
			str+="\t\"shivaGroup\": \""+style+"\"\n}";
			if (mode == 'Canvas') {
	   			window.parent.document.getElementById("shivaCan").contentWindow.postMessage("PutJSON:"+str,"*");
	   			this.Sound("ding");
	   			window.parent.OpenTab(8);
				return ;
				}
			if (mode == 'GetJSON')
				return str;
			$('#formatter').val(0);
			if (mode == 'eStore')
				return this.EasyFile(str,$.proxy(function(data) { ReEdit(data) },this),style);
			$("#helpDiv").html("");	
			}	
		else{
			$('#formatter').val(0);
			$("#helpDiv").html("");		
			str="http://www.viseyes.org/shiva/go.htm";
			str+="?shivaGroup="+style;
			if (items && items.length) {
				for (i=0;i<items.length;++i) {
					str+="&item-"+(i+1)+"=";
					for (k=itemStart;k<atts.length;++k)	{
						str1=items[i][atts[k]];
						if (str1)
							str1=str1.replace(/\n/g,",").replace(/\r/g,"").replace(/\:/g,"`");
						str+=atts[k]+":"+str1+";"; 
						}
					str=str.substring(0,str.length-1);	
					}
				}
			if (this.overlay)
				str+=this.dr.SaveDrawData(false);
			if (type)
				str+="&chartType="+type;
			var j=0;
			for (o in props) {
		        if (o == "item")
		        	break;
		        str1=$("#propInput"+(j++)).val();
		        if (str1)
		        	str1=str1.replace(/&/g,"^").replace(/#/g,"``");
		        if ((props[o].opt == "list") && (str1))
		        	str1=str1.replace(/\n/g,",").replace(/\r/g,"");
		        str+="&"+o+"="+str1;
		        }
			if (mode == 'WordPress')
		 		str="[iframe src='"+encodeURI(str)+"']";
			else if ((mode == 'iFrame') || (mode == 'Drupal'))
		 		str="<iframe width='600' height='400' src='"+encodeURI(str)+"'></iframe>";
			}
	$("#outputDiv").html("<br/><br/>Embed code:<br><textarea readonly='yes' rows='6' cols='60' id='tmptxt1'>"+str+"</textarea>");
	$("#tmptxt1").select();
	return str;
}

SHIVA_Show.prototype.ReEdit=function(jsonData, propertyList)	
{
		var p,v,i=0,j,k=0,pair,key,o;
		var query=window.location.search.substring(1);
		if (!query && !jsonData)
			return;
		if (jsonData) {
			var items=new Array();
			for (key in jsonData) {
	 			if (key == "shivaEvents") {
					if (!shivaLib.ev)
						SHIVA_Event(this.container,this.player);
					shivaLib.ev.AddEvents(jsonData[key]);										
		 			continue;
	 				}
	 			if (key.indexOf("item-") != -1) {
		 			v=jsonData[key].split(";");
					o=new Object;
		 			for (j=0;j<v.length;++j) {
		 				p=v[j].split(":");
		 				o[p[0]]=p[1];
		 				}
					items.push(o);
		 			continue;
		 			}
				else if (key.indexOf("draw-") != -1) 
					this.AddOverlaySeg(jsonData[key],true);					
				else{
					k=0;
					for (o in propertyList) {
						if (key == o) {
							$("#propInput"+k).val(jsonData[key]);
							break;
							}
						k++;
						}
					}
				}
			return items;
			}
		var vars=query.replace(/%C2%AE/g,"&reg").split("&");
		if (vars.length < 4)
			return;
		var items=new Array();
		for (var i=0;i<vars.length;i++) {
			vars[i]=vars[i].replace(/\^/g,"&").replace(/%20/g," ").replace(/%60/g,"`").replace(/%3C/g,"<").replace(/%3E/g,">").replace(/%3c/g,"<").replace(/%3e/g,">").replace(/``/g,"#");
			pair=vars[i].split("=");
			for (j=2;j<pair.length;++j)
				pair[1]+="="+pair[j];
			if (pair[1]) 
				pair[0]=unescape(pair[0]);
	 		if (pair[0].indexOf("draw-") != -1) 
				this.AddOverlaySeg(pair[1],true);					
	 		if (pair[0].indexOf("item-") != -1) {
	 			v=pair[1].split(";");
				o=new Object;
	 			for (j=0;j<v.length;++j) {
	 				p=v[j].split(":");
	 				o[p[0]]=p[1];
	 				}
				items.push(o);
	 			}
			else{
				for (o in propertyList) 
					if (pair[0] == o) {
						$("#propInput"+(k++)).val(pair[1]);
						break;
						}
				}
			}
	return items;
}

SHIVA_Show.prototype.ShowHelp=function(att, helpText, chartType)
{
		var v;
		var str="<br/><hr/>";
		$("#outputDiv").text(" ");
		if (att) {
			if (att.charAt(0) == ' ')
				att=att.substr(1)
			v=att.split("&nbsp;");
			str+="<b>How to set "+v[0]+"</b><br/><br/>";
			if (helpText[v[0]])
				str+=helpText[v[0]];
			}
		else
			str+="Click on a label to show help."
		if (att == "Data source URL") {
			if (helpText[chartType]) {
				str+="<br/><br/><b>Data Format for "+chartType+"</b><br/><br/><table>";
				str+="<tr><td>"+helpText[chartType]+"</td></tr>";
				str+="</table>";
				}
			}
		if (helpText["OVERVIEW"]) 
			str+="<br/><br/><b><i>Click <a onClick='shivaLib.ShowOverview()'><u>here</u></a> for an overview on the entire element.</b>";
		$("#helpDiv").html(str);
}
		
SHIVA_Show.prototype.ShowOverview=function()
{
	var str="<br/><hr/><b>"+shivaLib.options.shivaGroup+" overview</b><br/><br/>";
	str+=helpText["OVERVIEW"];
	$("#helpDiv").html(str);
}
	
SHIVA_Show.prototype.SetAttributes=function(props, items, keepData)
{
	var i,j,k,l,o,oo,id,id2;
	var atts=new Array();
	var oldData;
	for (o in props) 
		atts.push(o);
	if (keepData) {
		oldData=new Array()
		for (i=0;i<atts.length;++i) {
			if (atts[i] == "item")
				break;
			oldData.push($("#propInput"+i).val());
			}
		}
	$('#propertyTable tr:gt(0)').remove();
	
	for (i=0;i<atts.length;++i) {
		o=atts[i];
		id="propInput"+i;
   		var str="<tr style='height:28px'><td width='12'></td><td width='200' onClick='ShowHelp(this.innerHTML)'>"+props[o].des.split("::")[0];
		if ((this.drupalMan) && (o == "dataSourceUrl")) 
			str+="&nbsp;&nbsp;<img src='databutton.gif' title='Click to find data set' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"gdoc\",0)'/>";
   		str+="</td><td></td><td>";
   		if (props[o].opt == "query") 
   			str+="<input type='password' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.QueryEditor(\""+id+"\")' id='"+id+"'/>";
  		else if (props[o].opt == "advanced") 
   			str+="<input tabIndex='-1' onChange='Draw()' onFocus='shivaLib.SetAdvancedAttributes(\""+id+"\",\""+o+"\")' id='"+id+"'/>";
   		else if ((props[o].opt == "color") || (props[o].opt == "colors")) {
   			str+="<div style='max-height:26px'><input onChange='Draw()' style='position:relative;text-align:center;height:16px;top:2px; padding-left: 20px' id='"+id+"'/>";
   			str+="<div style='position:relative;border:1px solid #999;height:10px;width:10px;top:-15px;left:8px;background-color:white'"
			if (props[o].opt == "colors")	
  				str+=" onclick='shivaLib.ColorPicker(1,"+i+")' id='"+id+"C'/>";		   			
			else
 				str+=" onclick='shivaLib.ColorPicker(0,"+i+")' id='"+id+"C'/>";		   			
			str+="</div>"
			}				   			
   		else if (props[o].opt == "button") 
   			str+="<button type='button' onChange='"+o+"' id='"+id+"'>"+props[o].def+"</button>";
   		else if (props[o].opt == "slider")
   			str+="<input onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
   		else if (props[o].opt == "checkbox") {
   			str+="<input onChange='Draw()' type='checkbox' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'";
   			if (props[o].def == "true")
   				str+=" checked";
   			str+="/> "+props[o].des.split("::")[1];
   			}
   		else if (props[o].opt == "list")
   			str+="<textarea cols='12' rows='2' onChange='Draw()' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
   		else if (props[o].opt == "sizer") 
			str+="<button type='button' id='"+id+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";		   			
   		else if (props[o].opt == "hidden") 
   			str="<tr><td width='12'></td><td width='200'><input type='hidden' id='"+id+"'/>";
  		else if (props[o].opt.indexOf('|') != -1) {
   			var v=props[o].opt.split("|");
			if (o == 'item') {
				str="<tr><td width='12'></td><td colspan='3'><div id='accord'>";
				for (j=0;j<items.length;++j) {
					str+="<h3><a href='#' id='acctitle"+j+"'><b>"+items[j].name+"</b></a></h3><div id='accord-"+j+"'style='overflow-x:hidden'>";
					for (k=i+1;k<atts.length;++k) {
						id2="itemInput"+j+"-"+(k-i);
						oo=atts[k];
						if (props[oo].opt != "hidden")
							str+="<span onClick='ShowHelp(this.innerText)'>"+props[oo].des;
						if ((this.drupalMan) && (oo == "layerSource")) 
							str+="<img src='kmlicon.gif' id='"+j+"' title='Click to find KML file' style='vertical-align:bottom' onclick='shivaLib.GetDataFromManager(\"kml\",this.id)'/>";
					   	str+="</span><span style='position:absolute;left:142px;'>";
					   	if (props[oo].opt == "color") {
	   						str+="<input size='14' onChange='Draw()' style='text-align:center' id='"+id2+"'>";
			    			str+="<div style='position:relative;border:1px solid;height:8px;width:9px;top:-14px;left:5px'"
							str+=" onclick='shivaLib.ColorPicker(0,"+((j*100)+100+(k-i))+")' id='"+id2+"C'/>";		   			
							}				   			
				   		else if (props[oo].opt == "colors") 
	   						str+="<input style='width:90px' tabIndex='-1' onChange='Draw()' onFocus='shivaLib.ColorPicker(2,"+((j*100)+100+(k-i))+")' id='"+id2+"'>";
			   			else if (props[oo].opt == "button") 
   							str+="<button type='button' size='12' onChange='"+oo+"' id='"+id+"'>"+props[oo].def+"</button>";
			   			else if (props[oo].opt == "slider")
   							str+="<input style='width:90px' onChange='Draw(\"opacity\")' type='range' id='"+id+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
			   			else if (props[oo].opt == "list")
   							str+="<textarea style='width:90px' rows='2' onChange='Draw()' onInput='Draw()' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
				   		else if (props[oo].opt == "hidden") 
   							str+="<input type='hidden' id='"+id2+"'/>";
			   			else if (props[oo].opt.indexOf('|') != -1) {
			   				var v=props[oo].opt.split("|");
							str+="<select style='width:90px' id='"+id2+"' onChange='Draw()' onFocus='ShowHelp(\""+props[oo].des+"\")'>";
							for (l=0;l<v.length;++l) {
								if (v[l])
									str+="<option>"+v[l]+"</option>";
								}
							str+="</select>";
				   			}
				   		else if (props[oo].opt == "sizer") 
  							str+="<button type='button' id='"+id2+"' onclick='shivaLib.SizingBox(\"containerDiv\",this.id)'>Set</button>";		   			
				   		else
   							str+="<input style='width:90px' onChange='Draw()' type='text' id='"+id2+"' onFocus='ShowHelp(\""+props[oo].des+"\")'/>";
				   		str+="</span></p>";
				   		}
					str+="</div>";
					}
				}
			else{
				str+="<select id='"+id+"' onChange='Draw()' onFocus='ShowHelp(\""+props[o].des+"\")'>";
				for (j=0;j<v.length;++j) {
					if (v[j])
						str+="<option>"+v[j]+"</option>";
					}
				str+="</select>";
	   			}
	   		}
	   		else
   				str+="<input size='14' style='height:16px' onChange='Draw()' type='text' id='"+id+"' onFocus='ShowHelp(\""+props[o].des+"\")'/>";
		str+="<td width='12'></td ></td></tr>";
		$(str).appendTo("#propertyTable tbody")
	  	$("#"+id).val(props[o].def);  
	  	if (keepData)
		  	$("#"+id).val(oldData[i]);  
		else
	  		$("#"+id).val(props[o].def);  
   		if (props[o].opt == "color")
			if (props[o].def.toLowerCase() != 'auto') {
				$("#"+id).css('border-color',"#"+props[o].def); 
				$("#"+id+"C").css('background-color',"#"+props[o].def); 
				}
		if (o == "item")
			break;
		}			
	str="<tr height='8'><td></td></tr>";
	$(str).appendTo("#propertyTable tbody")
	$("#accord").accordion({ collapsible:true, active:false, autoHeight:false, change:this.callback});
	if (items) {
		for (j=0;j<items.length;++j) {
			for (k=i+1;k<atts.length;++k) {
		   		o=atts[k];
		   		id2="itemInput"+j+"-"+(k-i);
		   		if (props[o].opt == "color")
	    			if (props[o].def.toLowerCase() != 'auto') {
						$("#"+id2).css('border-color',"#"+items[j][atts[k]]); 
						$("#"+id2+"C").css('background-color',"#"+items[j][atts[k]]); 
						}
				}
			}
		for (i=0;i<atts.length;++i) 
			if (atts[i] == "item") {
				atts[i]="name";
				break;
			}
		for (j=0;j<items.length;++j) 
			for (k=i;k<atts.length;++k)	
				$("#itemInput"+j+"-"+(k-i)).val(items[j][atts[k]]);
		}
	
	var bs={"-moz-border-radius":"10px","-webkit-border-radius":"10px","-khtml-border-radius":"10px","border-radius":"10px",
			"width":"100px","padding-left":"7px","padding-right":"7px","padding-top":"1px",
			"border":"1px solid #ddd","color":"#666","font-size":"12px","height":"18px"
			};	 
	
	for (i=0;i<atts.length;++i) {
		$("#propInput"+i).css(bs);
		if ((props[atts[i]]) && (props[atts[i]].opt.match(/\|/)) && (atts[i] != "item")) {
			$("#propInput"+i).css({ "background-color":"#eee",
				  					"background":"-webkit-linear-gradient(top,#ffffff 0%,#f0f0f0 100%)",
				  					"background":"linear-gradient(#ffffff,#f0f0f0)",
									"padding-left":"5px",width:"115px",height:"21px",
									});
			if (navigator.userAgent.match(/firefox/i))
				$("#propInput"+i).css({ "text-indent":"0.01px","text-overflow":"''",
										"background":"url(selectorbutton.gif) no-repeat right #f8f8f8"
										});
			}
	}

}

SHIVA_Show.prototype.SetAdvancedAttributes=function(prop, baseVar) 		// ADVANCED OPTIONS									
{
	var str,title,aProps,v,i;
	$("#advAttDialogDiv").dialog("destroy");								// Kill old dialog is there							
	$("#advAttDialogDiv").remove();											// Remove any added parts
	str="<table>"															// Table header
	switch(baseVar) {														// Route on var
		case "legendTextStyle": 																				
		case "titleTextStyle": 																				
		case "pieSliceTextStyle": 																				
		case "tooltipTextStyle": 																				
			aProps= { 	fontName: 	{ opt:'string',	 des:'Font'},			// Sub-items
						fontSize: 	{ opt:'string',	 des:'Size'},
						color: 		{ opt:'color',	 des:'Color'}
						}			
			break;
		case "chartArea": 																				
			aProps= { 	left: 	{ opt:'string',	 des:'Left'},				// Sub-items
						top: 	{ opt:'string',	 des:'Top'},
						height: { opt:'string',	 des:'Height'},
						width: 	{ opt:'string',	 des:'Width'}
						}			
			break;
		case "backgroundColor": 																				
			aProps= { 	fill: 		{ opt:'color',	 des:'Fill color'},		// Sub-items
						stroke: 	{ opt:'color',	 des:'Border color'},
						strokeWidth:{ opt:'string',	 des:'Border width'}
						}			
			break;
		case "vAxis": 	
		case "hAxis":																			
			aProps= { 	baseline: 		{ opt:'string',	 des:'Baseline'},		// Sub-items
						baselineColor: 	{ opt:'color',	 des:'Baseline color'},
						direction:		{ opt:'string',	 des:'Direction'},
						format:			{ opt:'string',	 des:'Axis label format'},
						direction:		{ opt:'string',	 des:'Direction'},
						logScale:		{ opt:'string',	 des:'Log scale?'},
						textPosition:	{ opt:'string',	 des:'Text position'},
						title:			{ opt:'string',	 des:'Axis title'},
						viewWindow_max:	{ opt:'string',	 des:'Max value'},
						viewWindow_min: { opt:'string',	 des:'Min value'},
						slantedText:	{ opt:'string',	 des:'Slanted text'}
						}			
			break;
		 case "backgroundColors":
			aProps= {   main:     { opt:'color',  des:'Main Background'},   // Sub-items
		            eventspan:  		{ opt:'color',   des:'Event Span Background'},
		            head:    			{ opt:'color',  des:'Header, Footer and Zoom Background'},
		            popup:     			{ opt:'color',  des:'Popup Background'},
		            imagelane:    		{ opt:'color',  des:'Image Lane Background'},
		            ticklane:   		{ opt:'color',  des:'Time Ticks Background'},
		            popuplink: 			{ opt:'color',  des:'Popup Link Background'}
		            }     
			break;
		case "fontColors":
		      aProps= {   main:     { opt:'color',  des:'Main Font Color'},   // Sub-items
		            head:    { opt:'color',  des:'Header Font Color'},
		            popup:   { opt:'color',  des:'Popup Font Color'},
		            links:   { opt:'color',  des:'Link Font Color'}
		            }  
			break;
			}
		for (o in aProps) {													// For each sub-item
			str+="<tr style='height:26px' onClick='ShowHelp(\""+aProps[o].des+"\")'><td>"+aProps[o].des+"</td><td>";	// Add title
			if (aProps[o].opt == "color") { 									// If a color
	   			str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:center;height:16px;top:2px' id='"+baseVar+o+"'/>";
   				str+="<div style='position:relative;border:1px solid;height:11px;width:11px;top:-16px;left:6px;background-color:white'"
 				str+=" onclick='shivaLib.ColorPicker(0,\"___"+baseVar+o+"\")' id='"+baseVar+o+"C'/>";		   			
				}
			else															// If input
				str+="<div style='max-height:26px'><input size='14' style='position:relative;text-align:left;height:16px;top:2px' id='"+baseVar+o+"'/>";
			str+="</td></tr>";													// End row
			}
	
	var ops={ 																// Dialog options
		width:'auto',height:'auto',modal:true,title:"Set "+baseVar,position:[300,350],
		buttons: {
			OK: function() {												// On OK button
				str="";														// No text yet
				for (o in aProps) {											// For each item
					if ($("#"+baseVar+o).val())								// If something there
						str+=o+"="+$("#"+baseVar+o).val()+",";				// Add value
					}
				$("#"+prop).val(str);										// Set in input box
				$("#"+prop).trigger("onchange");							// Trigger a change
				$(this).dialog("destroy");									// Kill dialog
				$("#advAttDialogDiv").remove();								// Remove items
				},
			'Cancel': function() {											// On cancel button
				$(this).dialog("destroy");									// Kill dialog
				$("#advAttDialogDiv").remove();								// Remove items
				}
			}
		}
	$("body").append("<div id='advAttDialogDiv'/>");						// Add div for dialog
	$("#advAttDialogDiv").dialog(ops);										// Add dialog
	$("#advAttDialogDiv").html(str+"</table>");								// Fill dialog
	v=$("#"+prop).val().split(",");											// Split sub-items by comma
	for (i=0;i<v.length-1;++i)												// For each sub-item
		$("#"+baseVar+v[i].split("=")[0]).val(v[i].split("=")[1]);			// Set last value
}

SHIVA_Show.prototype.SizingBox=function(div, id, pos, alpha, col, edge)		// SIZING BOX
{ 	 	
	if (div == undefined) {													// If no div
		$("#shivaSizingBox").remove();										// Kill it
		Draw();																// Redraw
		return;																// Quit
		}
	Draw();																	// Redraw
	if (id.indexOf("Input")!= -1) 											// If an id
		pos=$("#"+id).val();												// Get value
	var v,top=0,left=0,wid=10000;											// Defs
	if (pos)																// If a pos
		v=pos.split(",");													// Split pos
	if ($("#shivaSizingBox").length == 0) {									// If doesn't exit yet
		if (alpha == undefined)	alpha=.5;									// Default alpha
		if (col == undefined)	col="#ccc;"									// Default color
		if (edge == undefined)	edge="#000;"								// Default edge color
		var str="<div id='shivaSizingBox' style='background:"+col+"border:1px solid "+edge+";position:absolute;opacity:"+alpha+"'>";
		str+="<img src='addeventdot.gif' onclick='shivaLib.SizingBox()'></div>";	// Add close box
		$("#"+div).append(str);												// Add to container div		
 		}
	
	var box=$("#shivaSizingBox");											// Point at box
	var con=$("#"+div);														// Point at container
	if (v[0] != undefined)	left=v[0] 										// Default left
	if (v[1] != undefined)	top=v[1];										// Default top
	if (v[2] != undefined)	wid=v[2];										// Default width
	box.css({left:left/100+"%",top:top/100+"%",width:wid/100+"%",height:wid/100+"%"});	// Set position
 	box.resizable( { aspectRatio:true, cursor:"se-resize", resize:SetBox } );	// Make resizable
 	box.draggable( { containment:"parent", cursor:"move", drag:SetBox  } );	// Make draggable
	
	function SetBox(event, ui) {											// MOVE/DRAG EVENT HANDLER
		var box=$(this);													// Point at box
		var left=Math.round(ui.position.left/box.parent().width()*10000);	// Get x
		var top=Math.round(ui.position.top/box.parent().height()*10000);	// Get y
		var wid=Math.round(box.width()/con.width()*10000);					// Get w
		$("#"+id).val(left+","+top+","+wid);								// Concat and set in structure
		SaveData("GetJSON");												// Set items
		}
}
	
SHIVA_Show.prototype.GetDataFromManager=function(type, index)
{
	if (type == "gdoc")
		window.parent.postMessage("dataSourceUrl","*");
	if (type == "kml")
		window.parent.postMessage("GetFile=KML="+index,"*");
}

/////// QUERY EDITOR

SHIVA_Show.prototype.QueryEditor=function(id)
{
	if ($("#propInput0").val())
		new SHIVA_QueryEditor($("#propInput0").val(),$("#"+id).val(),id,false);
	else
		this.Prompt("Data Filter","You need to define a data source first!","")
}

SHIVA_Show.prototype.ShiftItem=function(dir,items)
{
	var active=$("#accord").accordion("option","active");
	if (active === false) 
		return -1;
	var pos=Number(active)+Number(dir);
	if ((pos < 0) || (pos >= items.length))
		return active;
	else
		this.Sound("click");
	var o=items[pos];
	items[pos]=items[active];
	items[active]=o;
	this.Draw();
	return pos;
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	QUERY EDITOR
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_QueryEditor(source, query, returnID, fieldNames, callback) 										
{
	this.advancedMode=false;
	this.autoShow=true;
	$("#dataDialogDiv").dialog("destroy");
	$("#dataDialogDiv").remove();
	shivaLib.qe=this;
	if (query.indexOf("  ") == 0) 
		this.advancedMode=true,query=query.substr(2);
	else if (!query) 
 		query="SELECT * WHERE A = ? ORDER BY none"
 	if (query.indexOf(" ORDER BY ") == -1)
 		query+=" ORDER BY none";
	this.source=source;
	this.query=query.replace(/  /g," ");
	this.curFields=["A","B","C"];
	var thisObj=this;
	
	var ops={ 
		width:'auto',height:'auto',modal:true,title:'Data filter',position:[330,40],
		buttons: {
			OK: function() {
				if (thisObj.advancedMode)
					thisObj.query="  "+$("#curQuery").val();
				if (!fieldNames) {
					var i,f;
					for (i=0;i<thisObj.curFields.length;++i) {
						f=thisObj.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");						
						thisObj.query=thisObj.query.replace(RegExp(f,"g"),String.fromCharCode(i+65));
						}
					}
				if (!thisObj.query.match(/\?/)) {
					thisObj.query=thisObj.query.replace(/ORDER BY none/g,"");
					if (returnID == "curQueryDiv")
						$("#"+returnID).html(thisObj.query);
					else if (returnID)
						$("#"+returnID).val(thisObj.query);
					window.postMessage("ShivaDraw","*");
					}
				$(this).dialog("destroy");
				$("#dataDialogDiv").remove();
				$("#propInput0").trigger("onchange");
				if (callback) 
					callback(thisObj.query);
				},
			'Cancel': function() {
				$(this).dialog("destroy");
				$("#dataDialogDiv").remove();
				if (callback) {
					callback(query);
					return;
					}
				}
			}
		}
	$("body").append("<div id='dataDialogDiv'/>");
	$("#dataDialogDiv").dialog(ops);
	if (source) {
		var googleQuery=new google.visualization.Query(source);
	   	googleQuery.send(handleQueryResponse);
 		}
	this.DrawQuery();

	function handleQueryResponse(response) {
	    var i,j,key;
		var data=response.getDataTable();
		var rows=data.getNumberOfRows();
		var cols=data.getNumberOfColumns();
	 	thisObj.curFields=[];
	 	if ((thisObj.query.indexOf(" A ") != -1) && (thisObj.query.charAt(thisObj.query.length-1) != " "))
	 		thisObj.query+=" ";	
	 	for (j=0;j<cols;++j) {
			key=$.trim(data.getColumnLabel(j)).replace(/ /g,"_");
			if (!key)
				continue;
			thisObj.query=thisObj.query.replace(RegExp(" "+String.fromCharCode(j+65)+" ","g")," "+key+" ");
	  		thisObj.curFields.push(key);
			}
		thisObj.query=$.trim(thisObj.query);
		thisObj.DrawQuery();
	}
}

SHIVA_QueryEditor.prototype.DrawQuery=function() 
{
	var i,num;
	var select="all";
	var order="none";
	var thisObj=this;
	if (this.advancedMode) {
		str="<textArea id='curQuery' rows='4' cols='50' />";
		str+="<p><input type='checkbox' id='advedit' checked='checked' onclick='shivaLib.qe.AdvancedMode(false)'> Advanced edit mode";
		str+="<p><Button id='queryAdvEdit'>Test</button> ";
		str+="Click <a href='http://code.google.com/apis/chart/interactive/docs/querylanguage.html' target='_blank'>here</a> for information on formatting</p></p>";
		str+="<br/><div id='testShowDiv'/>"
		$("#dataDialogDiv").html(str);
		$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));
		$("#queryAdvEdit").click( function() { thisObj.TestQuery(); });
		this.TestQuery();
		return;
		}
	i=this.query.indexOf(" WHERE ");
	if (i == -1)
		i=this.query.indexOf(" ORDER BY ");
	select=this.query.substring(7,i);
	if (select == "*")
		select="all";
	i=this.query.indexOf(" ORDER BY ");
	order=this.query.substring(i+10);
	i=this.query.indexOf(" WHERE ");
	var str="<div style='border 1px solid'><br/><table id='clauseTable' cellspacing='0' cellpadding='0'>";
	if (i != -1) {
		j=this.query.indexOf(" ORDER BY ");
		var v=this.query.substring(i+7,j).split(" ");
		i=0;
		str+=this.AddClause("IF",v[0],v[1],v[2],v.length<6,i++);
		for (j=3;j<v.length;j+=4)
			str+=this.AddClause(v[j],v[j+1],v[j+2],v[j+3],(j+5)>v.length,i++);
		}
	var q=this.query.replace(/WHERE /g,"<br/>WHERE ").replace(/ORDER BY /g,"<br/>ORDER BY ")
	str+="<tr height='12'></tr>";
	str+="</div><tr><td><b>SHOW&nbsp;&nbsp;</b></td><td align='middle'>&nbsp;";
	str+="<select multiple='multiple' size='3'id='sel' onchange='shivaLib.qe.SetQueryString()'>";
	str+="<option>all</option>";
	for (i=0;i<this.curFields.length;++i)	str+="<option>"+this.curFields[i]+"</option>";
	str+="</select></td><td>&nbsp;&nbsp;<b>ORDER BY</B> &nbsp;<select id='ord' onchange='shivaLib.qe.SetQueryString()'>";
	str+="<option>none</option>";
	for (i=0;i<this.curFields.length;++i)	str+="<option>"+this.curFields[i]+"</option>";
	str+="</select></td></tr>";
	str+="</table><p><input type='checkbox' id='advedit' onclick='shivaLib.qe.AdvancedMode(true)'/> Advanced edit mode";
	str+=" <input type='checkbox' id='qAutoShow'";
	if (this.autoShow) str+=" checked='checked'";
	str+=">Auto-show</p>";
	str+="<div id='curQuery' style='overflow:auto'><span style='color:#999'><b>"+q+"</b></span></div>";
	str+="<br/><div id='testShowDiv'/>"
	$("#dataDialogDiv").html(str);
	$("#sel").val(select.split(","));
	$("#ord").val(order);
	if (this.autoShow)
		this.TestQuery();

	$("#qAutoShow").click(function() {
		shivaLib.qe.autoShow=!shivaLib.qe.autoShow;
		shivaLib.qe.DrawQuery();
		});
		
}

SHIVA_QueryEditor.prototype.TestQuery=function() 
{
	var f,q=this.query;
	if (q.match(/\?/)) 
		q="";
	for (i=0;i<this.curFields.length;++i) {
		f=this.curFields[i].replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");						
		q=q.replace(RegExp(f,"g"),String.fromCharCode(i+65));
		}
	q=q.replace(/ORDER BY none/g,"");
	if (this.advancedMode)
		q=$("#curQuery").val();
	var tbl={"chartType": "Table","dataSourceUrl":this.source,"query":q,"shivaGroup":"Data"};
	$("#testShowDiv").empty();
	$("#testShowDiv").css("width",$("#dataDialogDiv").css("width"));
	$("#testShowDiv").css("height","200px");
	$("#testShowDiv").css("overflow","auto");
	new SHIVA_Show("testShowDiv",tbl);
}

SHIVA_QueryEditor.prototype.AdvancedMode=function(mode)
{
	this.advancedMode=mode;
	if (!mode)	
		this.query="SELECT * WHERE A = * ORDER BY none";
	this.DrawQuery();
	if (mode)	
		$("#curQuery").val(this.query.replace(/ORDER BY none/g,"").replace(/  /g," "));
}

SHIVA_QueryEditor.prototype.AddClause=function(clause, subj, pred, obj, last, row)	
{
	var str="<tr valign='top'><td>";
	if (clause != "IF") 
		str+=shivaLib.MakeSelect("clause"+row,0,["AND","OR","NOT"],clause,"onchange='shivaLib.qe.SetQueryString()'");
	else
		str+="<b>IF</b>";
	str+="</td><td>&nbsp;"+shivaLib.MakeSelect("subject"+row,0,this.curFields,subj,"onchange='shivaLib.qe.SetQueryString()'");
	str+="</td><td>&nbsp;&nbsp;<b>IS&nbsp; </b>"+shivaLib.MakeSelect("predicate"+row,0,["<",">","=","!=","<=",">=","has"],pred,"onchange='shivaLib.qe.SetQueryString()'");
	str+=" <input type='input' size='8' id='object"+row+"' value='"+obj+"' onchange='shivaLib.qe.SetQueryString()'/>";
	if (clause == "IF") 
		str+="&nbsp;<img src='adddot.gif' onclick='shivaLib.qe.AddNewClause("+row+")'style='vertical-align:middle'>";
	else	
		str+="&nbsp;<img src='trashdot.gif' onclick='shivaLib.qe.DeleteClause("+row+")' style='vertical-align:middle'>";
	str+="</td></tr>";
	$("#pred").val(pred);
	return str;
}

SHIVA_QueryEditor.prototype.AddNewClause=function(num)
{
	var i=this.query.indexOf(" ORDER BY ");
	this.query=this.query.substr(0,i)+" AND * = ?"+this.query.substr(i);
	this.DrawQuery();
	shivaLib.Sound("ding");
}

SHIVA_QueryEditor.prototype.DeleteClause=function(num)
{
	var v=this.query.split(" ");
	var n,i,str="";
	for (n=0;n<v.length;++n)
		if (v[n] == "WHERE")
			break;
	n=n+(num*4)
	for (i=0;i<n;++i)
		str+=v[i]+" ";
	for (i=n+4;i<v.length;++i)
		str+=v[i]+" ";
	this.query=str;
	this.DrawQuery();
	shivaLib.Sound("delete");
}

SHIVA_QueryEditor.prototype.SetQueryString=function()
{
	var i,j,num=0;
	i=this.query.indexOf(" WHERE ");
	if (i != -1) {
		j=this.query.indexOf(" ORDER BY ");
		var v=this.query.substring(i+7,j).split(" ");
		num=(v.length+1)/4;
		}
	str="SELECT "
	var sel=$("#sel").val();
	if (sel == "all")
		sel="*";
	str+=sel+" ";
	if (num)
		str+="WHERE ";
	for (i=0;i<num;++i) {
		if (i)
			str+=$("#clause"+i).val()+" ";
		str+=$("#subject"+i).val()+" ";
		str+=$("#predicate"+i).val()+" ";
		str+=$("#object"+i).val();
		str+=" ";
		}		
	str+="ORDER BY "+ $("#ord").val();
	this.query=str;
	this.DrawQuery();
}
