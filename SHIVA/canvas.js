//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//	DRAWING ELEMENTS
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Canvas()													// CONSTRUCTOR
{
	this.elements=new Array();												// Holds shiva elements
}	

SHIVA_Canvas.prototype.DrawCanvas=function(mode)						// DRAW CONTROLLED ELEMENTS 
{	
	var i;
	for (i=0;i<this.elements.length;++i) {									// For each element
		this.CreateElement(i,mode);											// Create element
		this.elements[i].dx=Number(this.elements[i].left);					// Set
		this.elements[i].dy=Number(this.elements[i].top);					// to
		this.elements[i].dw=Number(this.elements[i].wid);					// default
		this.elements[i].da=Number(this.elements[i].alpha);					// values
		this.elements[i].dd=Number(this.elements[i].dur);				
		this.elements[i].dv=this.elements[i].vis;	
		if (mode == 0)														// If in Set
			this.elements[i].dv=true;										// Always show
		if (this.elements[i].shivaGroup == "Control") 						// If a control
			this.ApplyControlDefaults(i);									// Apply control defaults
		}
	this.SetElements(null,0);												// Set element size, pos & alpha
}

SHIVA_Canvas.prototype.ApplyControlDefaults=function(num)				// APPLY CONTROL DEFAULTS TO D's
{
	var i,str;
	for (i=1;i<50;++i) {													// For each possible control item
		if (!(str=this.elements[num]["item-"+i]))							// Get item string
			break;															// Quit if no more
		if (str.indexOf("type:Button") != -1)								// If a button
			continue;														// Skip
		if (str.indexOf("def:;") != -1)										// If no def
			continue;														// Skip
		this.ActionResponse(num,i,"shivaInit");								// React to event
		}				
}

SHIVA_Canvas.prototype.ActionResponse=function(num, i, val)				// RESPOND TO ELEMENT EVENT
{
	var j,k,s,e,o,v;
	var def,to,item,from,trigger;
	from=num+"."+i;															// From address of control item
	
	if (val == "shivaInit") {												// If initting
		o=this.elements[num]["item-"+i];									// Get item string
		s=o.indexOf("def:",0)+4;	e=o.indexOf(";",s);						// Isolate def
		def=o.substring(s,e).toLowerCase();									// Copy as l/c
		}
	else																	// Get from event
		def=val.toLowerCase();												// Copy as l/c
	for (j=0;j<items.length;++j) {											// For each action	
		if (items[j].from != from)											// If action not linked to control item
			continue;														// Skip
		v=String(items[j].to).split(".");									// To array
		to=Number(v[0]);		item=Number(v[1]);							// Split into element/item
		trigger=items[j].trig.toLowerCase();								// Get l/c trigger
		if (items[j].type == "set") {										// If a set
			for (k=0;k<this.elements.length;++k) {							// For each element
				this.elements[to].di=items[j].to.split(".")[1];				// Layer number (0 for whole)	
				if (k == to) {												// If action's to matches element num
					if (trigger == def) {									// If trigger matches setting
						if (items[j].left)	this.elements[to].dx=Number(items[j].left);	// If not undefined
						if (items[j].top)	this.elements[to].dy=Number(items[j].top)	// set display values
						if (items[j].wid)	this.elements[to].dw=Number(items[j].wid);	// into 'to' item
						if (items[j].dur)	this.elements[to].dd=Number(items[j].dur);	// from action item
						this.elements[to].da=Number(items[j].alpha);				// Set alpha always
						this.elements[to].dv=items[j].vis;					// Set vis always
						}
					else{													// Doesn't match
						this.elements[to].dx=Number(this.elements[to].left);	// Revert
						this.elements[to].dy=Number(this.elements[to].top);		// to
						this.elements[to].dw=Number(this.elements[to].wid);		// original
						this.elements[to].da=Number(this.elements[to].alpha);	// default
						this.elements[to].dd=Number(this.elements[to].dur);		// values		
						this.elements[to].dv=this.elements[to].vis;	
						}
					if (val != "shivaInit") 								// If not initting
						this.SetElements(to,item);							// Set element			
					}
				}
			}
		else if (items[j].type == "fill") {									// If a data fill
			var table=this.elements[items[j].dat].dataSourceUrl;			// Get url
			var query="";													// Assume no query
			if ($("#curQueryDiv").text().indexOf("Use the ") == -1)			// If something set
				query=$("#curQueryDiv").text().replace(/ LK /g," LIKE ");	// Get query
			if (trigger == def) { 											// If trigger matches setting
				if (this.elements[to].pe)									// If initted
					if (val != "shivaInit") 								// If not initting
						this.elements[to].pe.FillElement(table,query);		// Set value
				}
			}
		}
}	

SHIVA_Canvas.prototype.CreateElement=function(num, mode)				// CREATE ELEMENT
{
	if (this.elements[num].shivaGroup == "Data")							// If a data element 
		return;																// Skip
	var id="#shel"+num;														// Element constainer div
	$("#canvasDiv").append("<div id='shel"+num+"' style='position:absolute'</div>");	// Append element div
	this.elements[num].pe=new SHIVA_Show("shel"+num,this.elements[num],mode != 2);	// Create element
	if (mode == 0) 															// If in Set mode
		$(id).on("click",null,{num:num},SelectElement);						// Click event	
}

SHIVA_Canvas.prototype.SetElements=function(num, item)					// SET ELEMENT PARAMS
{
	var i,offX,offY;
	var s=0,e=this.elements.length;
	if (num)																// If one spec'd
		s=num,e=num-0+1;													// Do just one
	for (i=s;i<e;++i) {														// For each element
		if (this.elements[i].shivaGroup == "Data") 							// If a table
			continue;														// Skip
		id="#shel"+i;														// Element constainer div
		if (!this.elements[i].pv) {											// If hidden
			$(id).hide();	 												// Hide it
			continue;														// Skip it
			}
		if (item) {															// If a sub-layer
			this.elements[i].pe.SetLayer(item-1,this.elements[i].dv);		// Control layer
			continue;														// Skip it
			}
		if (this.elements[i].dv)											// If showing
			$(id).show();													// Show it
		else																// Visible
			$(id).hide();													// Hide it
		this.elements[i].pe.Resize(this.elements[i].dw);					// Resize element if width changed
		var animObj={														// Animation poperties
			opacity: this.elements[i].da/100,								// Opacity
			left: this.elements[i].dx+"px",									// X
			top: this.elements[i].dy+"px"									// Y
			}
		$(id).animate(animObj,{duration: this.elements[i].dd*1000+1});		// Animate there
		}
}	

	