///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB DATA ACCESS (CSV/GOOGLE DOCS)
///////////////////////////////////////////////////////////////////////////////////////////////

SHIVA_Show.prototype.GetSpreadsheet=function(url, fields, query, callback, addHeader) 		//	GET GOOGLE DOCS SPREADSHEET
{
	if (url.indexOf("google.com") != -1) {									// If Google doc
		var query=new google.visualization.Query(url);						// Make query object	
		query.send(handleGoogleResponse);									// Fetch data
		}
	else{																	// A CSV
	  console.info('url: ' + url);
		$.ajax({															// Fetch file
			type:  'GET',													// a GET
			url:   'proxy.php',												// Use proxy for cross-domain issue
			data:  { url : url },											// Add url
			async: false }													// Async									
		).complete(handleCSVResponse); 										// Callback
	}

   function handleCSVResponse(response) {								// HANDLE INCOMING DATA
     console.info("handling reponse");
     console.info(response);
	    var i,j,o,lab;
		var keys=new Array();												
		var theData=new Array();
		var data=shivaLib.parseCSV(response.responseText);					// Parse CSV
		var cols=data[0].length;											// Get cols
		if (addHeader || fields) {											// If setting header
			for (i=0;i<data[0].length;++i) {								// For each header
		 		lab=$.trim(data[0][i]);										// Get trimmed lab
				if (!lab)													// If noting there
				 	break;													// Quit
				keys.push(lab);												// Add to keys array
				}
			cols=keys.length;												// Cols = keys length
			}
		var rows=data.length;												// Set rows

		if (fields) {														// If fielded JSON mode
			for (i=1;i<rows;++i) {											// For each row
				o={};														// New obj
				for (j=0;j<keys.length;++j) 								// For each key
					o[keys[j]]=data[i][j];									// Get data
				theData.push(o);											// Add to result
	 			}
			}
		else{																// Nested arrays
			if (addHeader)													// If adding a header
 				theData.push(keys);											// Add it
			for (i=0;i<rows;++i) {											// For each row
 				o=[];														// New sub-array
				for (j=0;j<cols;++j) {										// For each col
					if (isNaN(data[i][j])) 									// If a string
						o.push(data[i][j]);									// Add to result
					else													// If a number
						o.push((data[i][j]-0));								// Cast and add to result
					}
  				theData.push(o);											// Add row
				}
			}
		console.info(theData);
		callback(theData,url);												// Send to callback
	}			

     
    function handleGoogleResponse(response) {							// HANDLE INCOMING DATA
	    var i,j,o,lab;
		var keys=new Array();												
		var theData=new Array();
		var data=response.getDataTable();									// Try getting table from Google
		var cols=data.getNumberOfColumns();									// Get cols
		var rows=data.getNumberOfRows();									// Get rows
		if (addHeader || fields) {											// If setting header
			for (i=0;i<cols;++i) {											// For each field
			 	lab=$.trim(data.getColumnLabel(i));							// Get trimmed lab
				if (!lab)													// If noting there
			 		break;													// Quit
				keys.push(lab);												// Add to keys array
				}
			cols=keys.length;												// Cols = keys length
			if (addHeader)													// If adding header
				theData.push(keys);											// Add it
			}
		if (fields) {														// If fielded JSON mode
			for (i=0;i<rows;++i) {											// For each row
				o={};														// New obj
				for (j=0;j<keys.length;++j) 								// For each key
					o[keys[j]]=data.getValue(i,j);							// Get data
				theData.push(o);											// Add to result
	 			}
			}
		else{																// Nested arrays
			for (i=0;i<rows;++i) {											// For each row
 				o=[];														// New sub-array
				for (j=0;j<cols;++j) 										// For each col
					o.push(data.getValue(i,j));								// Add to result
   				theData.push(o);
				}
			}
		callback(theData,url);												// Send to callback
   	}															
};

SHIVA_Show.prototype.parseCSV=function(str) 							// PARSE CSV TO NESTED ARRAYS
{
	var arr=[];
	var quote=false;  														// True means we're inside a quoted field
   	str=str.replace(/\\r\\n/g,"\n");										// Convert \r\n -> \n
  	str=str.replace(/\\n\\r/g,"\n");										// Convert \n\r -> \n
	for (var row=col=c=0;c < str.length;c++) {   							// Iterate over each character, keep track of current row and column (of the returned array)
		var cc=str[c],nc=str[c+1];        									// Current character, next character
		arr[row]=arr[row] || [];             								// Create a new row if necessary
		arr[row][col]= arr[row][col] || '';   								// Create a new column (start with empty string) if necessary
		if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  // If the cur char is ", and we're inside a quoted field, and the next char is also a ", add a " to the current column and skip the next character
		if (cc == '"') { quote = !quote; continue; }        				// If it's just one quotation mark, begin/end quoted field
		if (cc == ',' && !quote) { ++col; continue; }      					// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == '\n' && !quote) { ++row; col = 0; continue; }        		// If it's a newline and we're not in a quoted field, move on to the next row and move to column 0 of that new row
		arr[row][col] += cc;        										// Otherwise, append the current character to the current column
		}
	return arr;																// Return nested arrays
}


SHIVA_Show.prototype.Query=function(src, dst, query, fields, sort) 	// RUN QUERY
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
		if ((i < v.length) && (v[i] != "AND") && (v[i] != "OR"))		// Must have space in what word phrase
			o.what+=" "+v[i++];											// Ad next what word
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
		for (i=0;i<n;++i) { 											// For each desired field
			for (j=0;j<src[0].length;++j) 								// For each possible field
				if (fields[i] == src[0][j]) {							// If name matches
					ids[i]=j;											// Replace name with num
					break;												// Quit looking
					}
			}
		for (i=0;i<results.length;++i) {								// For each result
			o=[];														// New array
			for (j=0;j<n;++j) 	{										// For each result
				o.push(src[results[i]+1][ids[j]]);						// Add data (skip header)
			}
			dst.push(o);												// Add row
			}
		}
	
	if (sort) {															// If sorting
		var dir=1;														// Assume ascending
		if (sort.charAt(0) == "-") {									// If neg	
			dir=-1;														// Sort descending
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
