/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   SEAMIXER  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function seaMixer() 												// CONSTRUCTOR
{
	this.ondos=new Array();												// Hold ondo statements
	this.q=new SHIVA_Query();											// Alloc query library
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
	this.RunOnDo(ondo);													// Run it
}

seaMixer.prototype.RunOnDo=function(ondo) 							// RUN AN INIT ONDO
{
	var str,o,i;
	if (ondo.on != "init")												// If not an init
		return;															// Quit
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
			else if (ondo.src.indexOf("t=") == 0)              // than's localhost
        str="http://shantivis.org/sites/all/modules/shivanode/SHIVA/go.htm?m=http://shantivis.org/data/json/"+ondo.src;     // Make url
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
			break;
		case "query": 													// Run a query
			break;
		}
}

seaMixer.prototype.Start=function() 								// START
{
	window.addEventListener("message",$.proxy(this.ShivaEventHandler,this),false); // Add event listener
}

seaMixer.prototype.Stop=function() 									// STOP
{
	window.removeEventListener("message",$.proxy(this.ShivaEventHandler,this));	 // Remove event listener
}

seaMixer.prototype.Query=function(src, dst, query) 					// QUERY
{
}

seaMixer.prototype.ShivaEventHandler=function(e) 					// CATCH SHIVA EVENTS
{
	trace(e.data);
}

seaMixer.prototype.SendMessage=function(con, msg) 					// SEND HTML5 MESSAGE TO IFRAME
{
	var win=document.getElementById(con).contentWindow;					// Point at iframe	
	win.postMessage(msg,"*");											// Send message to container
}

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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////
//   QUERY  
/////////////////////////////////////////////////////////////////////////////////////////////////////////////

function SHIVA_Query() 												// CONSTRUCTOR
{
}