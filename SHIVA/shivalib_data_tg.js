SHIVA_Show.prototype.GetSpreadsheet=function(url, fields, query, callback, addHeader) 		//	GET GOOGLE DOCS SPREADSHEET
{
	if (url.indexOf("google.com") != -1) {
		var query=new google.visualization.Query(url);							
		query.send(handleQueryResponse);
	}
	else {
		$.ajax({
			type : 'GET',
			url : 'proxy.php',
			data : {
				url : url,
			},
			async : false
		}).complete(function(d) {
	    var csv = jQuery.csv.toObjects(d.responseText);	
			callback(csv, url);
			return;
		});
   }
   
   function handleQueryResponse(response) {
			var i,j,o,lab;
			var data=response.getDataTable();
			var cols=data.getNumberOfColumns();
			var rows=data.getNumberOfRows();
			var keys=new Array();
			var theData=new Array();
			if (addHeader || fields) {
				for (i=0;i<cols;++i) {
				 	lab=$.trim(data.getColumnLabel(i));
				 	if (!lab)
				 		break;
					keys.push(lab);
					}
				cols=keys.length;
				if (addHeader)
					theData.push(keys);
				}
			if (fields) {
				for (i=0;i<rows;++i) {
					o={};
					for (j=0;j<keys.length;++j) 
						o[keys[j]]=data.getValue(i,j);
					theData.push(o);
				}
			}
			else {
				for (i=0;i<rows;++i) {
					o=[];
					for (j=0;j<cols;++j) 
						o.push(data.getValue(i,j));
						theData.push(o);
				}
			}
			callback(theData,url);
	 }
};