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
		$.ajax({															// Fetch file
			type:  'GET',													// a GET
			url:   'proxy.php',												// Use proxy for cross-domain issue
			data:  { url : url },											// Add url
			async: false }													// Async									
		).complete(handleCSVResponse); 										// Callback
		}

   function handleCSVResponse(response) {									// HANDLE INCOMING DATA
	    var i,j,o,lab;
		var keys=new Array();												
		var theData=new Array();
		var data=shivaLib.parseCSV(response.responseText);						// Parse CSV
		var cols=data[0].length;												// Get cols
		if (addHeader || fields) {												// If setting header
			for (i=0;i<data[0].length;++i) {									// For each header
		 		lab=$.trim(data[0][i]);											// Get trimmed lab
				if (!lab)														// If noting there
				 	break;														// Quit
				keys.push(lab);													// Add to keys array
				}
			cols=keys.length;													// Cols = keys length
			}
		var rows=data.length;													// Set rows

		if (fields) {															// If fielded JSON mode
			for (i=1;i<rows;++i) {												// For each row
				o={};															// New obj
				for (j=0;j<keys.length;++j) 									// For each key
					o[keys[j]]=data[i][j];										// Get data
				theData.push(o);												// Add to result
	 			}
			}
		else{																	// Nested arrays
			for (i=0;i<rows;++i) {												// For each row
 				o=[];															// New sub-array
				for (j=0;j<cols;++j) {											// For each col
					if (isNaN(data[i][j])) 										// If a string
						o.push(data[i][j]);										// Add to result
					else														// If a number
						o.push((data[i][j]-0));									// Cast and add to result
					}
  				theData.push(o);
				}
			}
		callback(theData,url);													// Send to callback
	}			

     
    function handleGoogleResponse(response) {								// HANDLE INCOMING DATA
	    var i,j,o,lab;
		var keys=new Array();												
		var theData=new Array();
		var data=response.getDataTable();										// Try getting table from Google
		var cols=data.getNumberOfColumns();										// Get cols
		var rows=data.getNumberOfRows();										// Get rows
		if (addHeader || fields) {												// If setting header
			for (i=0;i<cols;++i) {												// For each field
			 	lab=$.trim(data.getColumnLabel(i));								// Get trimmed lab
				if (!lab)														// If noting there
			 		break;														// Quit
				keys.push(lab);													// Add to keys array
				}
			cols=keys.length;													// Cols = keys length
			if (addHeader)														// If adding header
				theData.push(keys);												// Add it
			}
		if (fields) {															// If fielded JSON mode
			for (i=0;i<rows;++i) {												// For each row
				o={};															// New obj
				for (j=0;j<keys.length;++j) 									// For each key
					o[keys[j]]=data.getValue(i,j);								// Get data
				theData.push(o);												// Add to result
	 			}
			}
		else{																	// Nested arrays
			for (i=0;i<rows;++i) {												// For each row
 				o=[];															// New sub-array
				for (j=0;j<cols;++j) 											// For each col
					o.push(data.getValue(i,j));									// Add to result
   				theData.push(o);
				}
			}
		callback(theData,url);													// Send to callback
   	}															
};

SHIVA_Show.prototype.parseCSV=function(str) 								// PARSE CSV TO NESTED ARRAYS
{
	var arr=[];
	var quote=false;  															// True means we're inside a quoted field
   	str=str.replace(/\\r\\n/g,"\n");											// Convert \r\n -> \n
  	str=str.replace(/\\n\\r/g,"\n");											// Convert \n\r -> \n
	for (var row=col=c=0;c < str.length;c++) {   								// Iterate over each character, keep track of current row and column (of the returned array)
		var cc=str[c],nc=str[c+1];        										// Current character, next character
		arr[row]=arr[row] || [];             									// Create a new row if necessary
		arr[row][col]= arr[row][col] || '';   									// Create a new column (start with empty string) if necessary
		if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }  // If the cur char is ", and we're inside a quoted field, and the next char is also a ", add a " to the current column and skip the next character
		if (cc == '"') { quote = !quote; continue; }        					// If it's just one quotation mark, begin/end quoted field
		if (cc == ',' && !quote) { ++col; continue; }      						// If it's a comma and we're not in a quoted field, move on to the next column
		if (cc == '\n' && !quote) { ++row; col = 0; continue; }        			// If it's a newline and we're not in a quoted field, move on to the next row and move to column 0 of that new row
		arr[row][col] += cc;        											// Otherwise, append the current character to the current column
		}
	return arr;																	// Return nested arrays
}
