/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   SEAMIXER METHODS 
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function seaMixer() 												// CONSTRUCTOR
{
	this.ondos=new Array();												// Hold ondo statements
	this.preload=0;														// No preload
	this.data=new Object();												// Holds table data
}

seaMixer.prototype.Run=function(ondoList) 							// RUN
{
	this.ondos=[];														// Clear queue
	var _this=this;														// Point at mixer obj
 	for (var i=0;i<ondoList.length;++i)									// For each one
		this.AddOnDo(ondoList[i]);										// Add to list and run if an init
  	var preInt=setInterval(onPreloadHandler,100); 						// Start preload timer
	
	function onPreloadHandler() {										// PRELOAD HANDLER
		if (_this.preload < 1)	{										// If preload is done
			clearInterval(preInt);										// Stop timer									
			_this.Start();												// Start listening
			}
		}
}

seaMixer.prototype.AddOnDo=function(ondo) 							// ADD NEW ONDO
{
	this.ondos.push(ondo);												// Add to array
	if (ondo.on == "init")												// If an init
		this.RunOnDo(ondo);												// Run it
}

seaMixer.prototype.RunOnDo=function(ondo) 							// RUN AN INIT ONDO
{
	var str,o,i;
	switch(ondo.do) {													// Route on type
		case "load": 													// Load an iframe
			str=ondo.src;												// Set url
			if (ondo.src.indexOf("e=") == 0)							// An eStore
				str="//www.viseyes.org/shiva/go.htm?"+ondo.src;			// Make url
			else if (ondo.src.indexOf("m=") == 0)						// A Drupal manager
				str="//shiva.shanti.virginia.edu/go.htm?m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			else if (ondo.src.indexOf("E=") == 0)						// eStore test
				str="//127.0.0.1:8020/SHIVA/go.htm?e="+ondo.src.substr(2);	// Make url
			else if (ondo.src.indexOf("M=") == 0)						// Drupal test
				str="//127.0.0.1:8020/SHIVA/go.htm?m=//shiva.virginia.edu/data/json/"+ondo.src.substr(2);	// Make url
			if (ondo.preload)											// If preloading
				this.preload++;											// Add to count
			$("#"+ondo.id).attr("src",str);								// Set src
			break;
		case "data": 													// Load data
			this.LoadSpreadsheet(ondo);									// Load file
			if (ondo.preload)											// If preloading
				this.preload++;											// Add to count
			break;
		case "fill": 													// Fill an iframe
			if ((!ondo.src) || (!this.data[ondo.src]))					// No src
				break;													// Quit
			str="ShivaActChart=data|";									// Base			
			o=this.data[ondo.src];										// Point at table
			str+=this.TableToString(this.data[ondo.src])				// Add table data
			this.SendMessage(ondo.id,str);								// Send message to iframe
			break;
		case "action": 													// Run an action
			this.SendMessage(ondo.id,ondo.type+"|"+ondo.p1);			// Send message to iframe
			break;
		case "call": 													// Run a callback
			window[ondo.id](ondo.p1,ondo.p2,ondo.p3,ondo.p4,ondo.p5,ondo.p6);	// Callback
			break;
		case "query": 													// Run a query
			this.data[ondo.id]=[];										// New array
			this.Query(this.data[ondo.src],this.data[ondo.id],ondo.query,ondo.fields,ondo.sort);	// Run query on table
trace(this.data[ondo.id])
			break;
		}
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   MESSAGING  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

seaMixer.prototype.Start=function() 								// START
{
	window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false); // Add event listener
}

seaMixer.prototype.Stop=function() 									// STOP
{
	window.removeEventListener("message",$.proxy(this.ShivaEventHandler,this));	 // Remove event listener
}

seaMixer.prototype.ShivaEventHandler=function(e) 					// CATCH SHIVA EVENTS
{
	var i,o,n=this.ondos.length;
	for (i=0;i<n;++i) {													// For each ondo
		o=this.ondos[i];												// Point at it
		if (e.data.indexOf(o.on) == 0)									// Got one
			this.HandleOnEvent(o,e.data);
		}
}

seaMixer.prototype.HandleOnEvent=function(ondo, data) 				// HANDLE INCOMING EVENT
{
	var run=new Object();												// New run obj
	for (o in ondo)														// For each field in on field
		run[o]=ondo[o];													// Add to run obj
	if (!run.p1) {														// If params not define
		var v=data.split("|");											// Get on params
		if (v[1] != undefined)	run.p1=v[1];							// Add param from on
		if (v[2] != undefined)	run.p2=v[2];							// Add 
		if (v[3] != undefined)	run.p3=v[3];							// Add 
		if (v[4] != undefined)	run.p4=v[4];							// Add 
		if (v[5] != undefined)	run.p5=v[5];							// Add 
		if (v[6] != undefined)	run.p6=v[6];							// Add 
		}	
	if (ondo.script) 													// If a script
		run=window[ondo.script](run);									// Callback
	this.RunOnDo(run);													// Run it
}

seaMixer.prototype.SendMessage=function(con, msg) 					// SEND HTML5 MESSAGE TO IFRAME
{
	var win=document.getElementById(con).contentWindow;					// Point at iframe	
	win.postMessage(msg,"*");											// Send message to container
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   DATA TABLES  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

seaMixer.prototype.LoadSpreadsheet=function(ondo) 					// GET GOOGLE DOCS SPREADSHEET
{
	var base="https://docs.google.com/spreadsheet/ccc?key=";			// Base url
	var query=new google.visualization.Query(base+ondo.src);			// Setup load					
	query.send(handleQueryResponse);									// Load
 	var _this=this;														// Point at mixer obj
  
    function handleQueryResponse(response) {							// HANDLE LOAD CALLBACK
	    var i,j,lab,n;
		var o=new Array();
		var data=response.getDataTable();								// Point at table
		var cols=data.getNumberOfColumns();								// Get num cols
		var rows=data.getNumberOfRows();								// Get num rows
 		var oo=_this.data[ondo.id]=new Array();							// Alloc data array
		for (i=0;i<cols;++i) {											// For each field
		 	lab=$.trim(data.getColumnLabel(i));							// Get trimmed label
		 	if (!lab)													// If nothing there					
		 		break;													// Quit 
			o.push($.trim(lab));										// Add field to table
			}
		n=o.length;														// Get num fields
		oo.push(o);														// Add header
		for (i=0;i<rows;++i) {											// For each row
			o=[];														// Null obj
			for (j=0;j<n;++j) 											// For every field
				o.push(data.getValue(i,j));								// Add to array
			oo.push(o);													// Add obj to array
 			}
  		if (ondo.preload)												// If set for preloading
 			_this.preload=Math.max(_this.preload-1,0);					// Dec count
       }
}

seaMixer.prototype.TableToString=function(table) 					// SAVE TABLE AS STRING
{
	var i,j,val,str="[";
	var cols=table[0].length-1;											// Number of fields
	var rows=table.length-1;											// Number of rows
	for (i=0;i<=rows;++i) {												// For each event
		str+="[";														// Begin row
		for (j=0;j<=cols;++j) { 										// For each value
			val=table[i][j];											// Get value
			if (isNaN(val))												// If not a number			
				str+="\""+val+"\"";										// Add value
			else														// A number
				str+=val;												// Add it
			if (j != cols)												// If not last
				str+=",";												// Add comma
			}
		str+="]";														// End row
		if (i != rows)													// If not last
			str+=",";													// Add comma
		}
	return str+"]";														// Return stringified array
}

seaMixer.prototype.Query=function(src, dst, query, fields, sort) 	// RUN QUERY
{
	var v,j,i=0;
	var allFields=false;												// Assume selected fields
	var nAnds=0;														// Assume no AND clauses yet
	if (!src || !dst)													// No data
		return;															// Quit
	var n=src.length;													// Length of table
	var clause=new Array();												// Holds clauses
	var ands=new Array();												// Holds hits of AND clauses
	var ors=new Array();												// Holds hits of OR clauses

	if ((!fields) || (fields == "*")) { 								// If no fields spec'd
		fields=src[0];													// Return all fields
		allFields=true;													// Fast track
		}
	else																// Only these fields
		fields=fields.split("+");										// Split buy '+'
	if ((!query) || (query == "*"))										// If no query spec'd
		query="* * *";													// Return all rows

	var o=new Object();													// Create obj
	clause.push(o);														// Add 1st clause
	o.type="AND";														// 1st is AND
	v=query.split(" ");													// Tokenize
	while (i < v.length) {												// For each token	
		o.hits=[];														// No hits yet
		o.field=v[i++];													// Field
		o.cond=v[i++];													// Condition
		o.what=v[i++];													// Field
		if (i < v.length) {												// For each token
			o={};														// Fresh obj
			o.type=v[i++];												// Type
			clause.push(o);												// Add new clause
			}
		}	

	for (i=0;i<clause.length;++i) {										// For each clause
		o=clause[i];													// Point at clause
		h=ands;															// Point at ands array to store hits
		if (o.type == "OR")												// Unless it's an OR
			h=ors;														// Point at ors array
		else															// An AND
			nAnds++;													// Add to count
		for (j=0;j<src[0].length;++j) 									// For each field
			if (o.field == src[0][j]) {									// If name matches
				o.field=j;												// Replace name with num
				break;													// Quit looking
				}
		
		for (j=1;j<n;++j) {												// If each row
			if (o.cond == "*")	{										// Always
				h.push(j-1);											// Add it to clause									
				}
			if (o.cond == "LT")	{										// Less than
				if (src[j][o.field] < o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			else if (o.cond == "GT") {									// Greater than
				if (src[j][o.field] > o.what)							// A hit
					h.push(j-1);										// Add it to clause		
				}							
			if (o.cond == "LE")	{										// Less than or equal
				if (src[j][o.field] <= o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			else if (o.cond == "GE") {									// Greater than or equal
				if (src[j][o.field] >= o.what)							// A hit
					h.push(j-1);										// Add it to clause		
				}							
			if (o.cond == "EQ")	{										// Equal
				if (src[j][o.field] == o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "NE")	{										// Not equal
				if (src[j][o.field] != o.what)							// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "LK")	{										// Like
				if (src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase()) != -1)	// A hit
					h.push(j-1);										// Add it to clause									
				}
			if (o.cond == "NL")	{										// Not like
				if (src[j][o.field].toLowerCase().indexOf(o.what.toLowerCase()) == -1)	// A hit
					h.push(j-1);										// Add it to clause									
				}
			}
		}
	var results=new Array();											// Make new array to hold results
	if (nAnds == 1) 													// If just one AND clauses
		results=ands;													// Take hits from ands
	else {																// Multiple AND clauses
		var thisOne;
		n=ands.length;													// Number of AND hits
		var matches=1;													// Set matches counter
		for (i=0;i<n;++i) {												// For each and hit
			thisOne=ands[i];											// Point at current and hit
			for (j=i+1;j<n;++j) {										// For following ands
				if (ands[j] == thisOne)									// A match
					++matches;											// Add to count
				if (matches == nAnds)	{								// Enough to add row to results	
					results.push(ands[i]);								// Add to results
					matches=1;											// Reset matches
					break;												// Stop looking for this one
					}
				}
			}
		}
	n=results.length;													// Number of hits
	if (ors.length) {													// If any OR clauses
		for (i=0;i<ors.length;++i) {									// For each or hit
			for (j=0;j<n;++j) 											// For each result
				if (ors[i] == results[j])								// If already in
					break;												// Quit
			if (j == n)													// Didn't have it already
				results.push(ors[i]);									// Add to results
			}
		}
	
	n=fields.length;													// Number of fields
	if (allFields) {													// If doing all fields
		for (i=0;i<results.length;++i) 									// For each result
			dst.push(src[results[i]]);									// Add row
		}
	else{																// Selected fields
		var ids=new Array();
		for (i=0;i<n;++i) { 											// For each field
			for (j=0;j<n;++j) 											// For each field
				if (fields[i] == src[0][j]) {							// If name matches
					ids[i]=j;											// Replace name with num
					break;												// Quit looking
					}
			}
		for (i=0;i<results.length;++i) {								// For each result
			o=[];														// New array
			for (j=0;j<n;++j) 											// For each result
				o.push(src[results[i]+1][ids[j]]);						// Add data (skip header)
			dst.push(o);												// Add row
			}
		}
	
	if (sort) {															// If sorting
		var dir=-1;														// Assume ascending
		if (sort.charAt(0) == "-") {									// If neg	
			dir=1;														// Sort descending
			sort=sort.substr(1);										// Eemove '-'
			}
		for (j=0;j<n;++j) 												// For each field
			if (sort == src[0][j]) {									// If name matches
				sort=j;													// Replace name with num
				break;													// Quit looking
				}
		dst.sort(function(a,b) { return a[sort] > b[sort]?-1*dir:1*dir });	// Sort it
		}
	dst.splice(0,0,fields);												// Set header
}

	