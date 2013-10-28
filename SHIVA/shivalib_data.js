///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB DATA
///////////////////////////////////////////////////////////////////////////////////////////////
var dal = function(){
    //private helper functions
    function clone(o) {
        //thank you stackoverflow
        return JSON.parse(JSON.stringify(o));
    };
    function trimZeros(val){
        var neg = false;
        if(val[0]=="-"){
            neg = true;
            val = val.slice(1);
        }
        while(val[0]=="0")
            val = val.slice(1);
        return (neg)?"-"+val:val;
    };
    function padZeros(val, len){
        val = val.toString();
        var neg = false;
        if(val[0]=="-"){
            neg = true;
            val = val.slice(1);
        }
        while(val.length>=len)
            val = "0"+val;
        return (neg)?"-"+val:val;
    };
    function wrangleDate(date){
        var ret;
        if(typeof date=="number"){
        //epoch time
         ret = new Date(date);
        }
        else{
        //date string
        /*suppports :
        date: dd/mm/yyyy | dd-mm-yyyy | yyyy/mm/dd | yyyy-mm-dd | dd-MMM-yyyy | MMM dd, yyyy 
        time: hh:mm:ss | hh:mm:ss AM/PM
        datetime: date time */
        var formats = [/^(?:\d{1,2}[\/\-]){0,2}\-?\d{1,4}(?:\s|$)/,
                     /^\-?\d{1,4}[\/\-]?(?:[\/\-]\d{1,2}){0,2}(?:\s|$)/,
                     /^\d{1,2}?[\-\/]?(?:Jan\.?(?:uary)?|Feb\.?(?:ruary)?|Mar\.?(?:arch)?|Apr\.?(?:il)?|May|Jun\.?(?:e)?|Jul\.?(?:y)?|Aug\.?(?:ust)?|Sep\.?(?:tember)?|Oct\.?(?:ober)?|Nov\.?(?:ember)?|Dec\.?(?:ember)?)[\/\-]\d{1,4}(?:\s|$)/,
                     /^(?:Jan\.?(?:uary)?|Feb\.?(?:ruary)?|Mar\.?(?:arch)?|Apr\.?(?:il)?|May|Jun\.?(?:e)?|Jul\.?(?:y)?|Aug\.?(?:ust)?|Sep\.?(?:tember)?|Oct\.?(?:ober)?|Nov\.?(?:ember)?|Dec\.?(?:ember)?)\s\d{1,2}?\s?\,\s?\d{1,4}(?:\s|$)/,
                      ];
        var time = /(?:\d+\:){0,3}\d+(?:\s[ap]\.?m\.?)?$/i;
        var d = {years : 0, months : 0, days : 0};
        var keys = Object.keys(d);
        var months = [/Jan\.?(?:uary)?/, /Feb\.?(?:ruary)?/, /Mar\.?(?:arch)?/, /Apr\.?(?:il)?/, /May/, /Jun\.?(?:e)?/, /Jul.?(?:y)?/, /Aug\.?(?:ust)?/, /Sep\.?(?:tember)?/, /Oct\.?(?:ober)?/, /Nov\.?(?:ember)?/, /Dec\.?(?:ember)?/];
        for(var i=0; i<formats.length; i++){
            var match = formats[i].exec(date);
            if(match != null){
                switch(i){
                    case 0:
                        var parts = (/\//.test(match))?match[0].split(/[\/]/g):match[0].split(/\-/g);
                        var j=0;
                        while(parts.length>0){
                            d[keys[j]]=parseInt(trimZeros(parts.pop()));
                            j++;    
                        }
                        break;
                    break;
                    case 1:
                        var parts = match[0].split(/[\/\-]/g);
                        var j=0;
                        while(parts.length>0){
                            d[keys[j]]=parseInt(trimZeros(parts.shift()));
                            j++;
                        }   
                        break;
                    break;
                    case 2:
                        var parts = match[0].split(/[\/\-]/g);
                        var len = parts.length-1;
                        for(var j=len; j>=0; j--){
                            if(j!=1)
                                d[keys[len-j]] = parseInt(trimZeros(parts[j]));
                            else{
                                for(var k=0;k<months.length;k++){
                                    if(months[k].test(parts[j]))
                                        d[keys[len-j]] = k;
                                    }
                                }
                            }
                            break;
                        break;
                        case 3:
                            var parts = match[0].split(/(?:,\s*|\s+)/g);
                            var len = parts.length;
                            for(var k=0; k<months.length;k++){
                                if(months[k].test(parts[0]))
                                    d.months = k;
                            }
                            d.days = parseInt(trimZeros(parts[1]));
                            d.years = parseInt(trimZeros(parts[2]));
                            break;
                        break;
                    }
                }
            }
            var t = time.exec(date);
            if(t!=null){
                var parts = t[0].split(/[\:\s]/g);
            var j=0;
            d.hours = 0;
            d.minutes = 0;
            d.seconds = 0;
            d.ms = 0;
            keys = Object.keys(d);
            while(parts.length>0){
                var chunk = parts.shift();
                if(!isNaN(chunk))
                    d[keys[j+3]] = parseInt(trimZeros(chunk));
                else if(/p\.?m\.?/i.test(chunk))
                    d.hours+=12;
                    j++;
                }
            }
            var ret = new Date();
            ret.setFullYear(padZeros(d.years,4),padZeros(d.months,2),padZeros(d.days,2));
            //ret.setMonth(d.months-1);
            //ret.setDate(d.days);
            ret.setHours(d.hours);
            ret.setMinutes(d.minutes);
            ret.setSeconds(d.seconds);
            ret.setMilliseconds(d.ms);
        }
        if(ret.toJSON()==null)
            return date;
        return ret;
    };
    function guessType(a, checkDate) {
        if ( typeof a != "string")
            return typeof a;
        if ( typeof checkDate == "undefined")
            checkDate = false;
        var d;
        if (/^[0-9]*\.?[0-9]*$/.test(a)) {//number?
            return "number";
        } else if (/(true)|(false)/i.test(a)) {//bool?
            return "bool";
        } else if (checkDate && !isNaN(Date.parse(a)) && typeof (d = wrangleDate(a)) != "string") {//date?
            return "date";
        } else {//string
            return "string";
        }
    };
    function getRealType(val, type) {
        if ( typeof val != "string")
            return val;
        if (val.trim().search(/\"/) == 0)
            val = val.trim().slice(1, -1);
        if ( typeof type == "undefined")
            type = guessType(val);
        switch(type) {
            case 'number':
                return parseFloat(val);
                break;
            case 'bool':
                return (/true/i.test(a)) ? true : false;
                break;
            case 'date':
                return wrangleDate(a);
                break;
            case 'string':
                return val;
                break;
        }
    };
    function normalize(src, cb){
        //first infer types with a random sample
        var cols = src[0].length;
        var types = [];
        for(var i=0; i<cols; i++)
            types[i] = {};
        var rows = src.length-2;
        var sample = (rows.length<10)?10:Math.ceil(rows*0.1);
        for(var i=1; i<=sample; i++){
            var r = Math.floor(Math.random()*rows)+1;
            var row = src[r];
            for(var j=0; j<cols; j++){
                var type = guessType(row[j]);
                if(typeof types[j][type] == 'undefined')
                    types[j][type] = 1;
                else
                    types[j][type]++;
            }       
        }
        //now force type conversion
        for(var i=0; i<types.length; i++){
           var opts = Object.keys(types[i]);
           var vals = Array(opts.length);
           for(var k=0; k<opts.length; k++)
                vals[k] = types[i][opts[k]];
           var type  = opts[vals.indexOf(Math.max.apply(Math, vals))]; 
           types[i] = type;   
        }
        rows = rows+2;
        for(var i=1; i<rows; i++){
            for(var j=0; j<cols; j++){
                var type = types[j];
                if(guessType(src[i][j])!=type){
                    switch(type){
                        case 'string':
                            src[i][j] = '';
                        break;
                        case 'number':
                            src[i][j] = 0;
                        break;
                    }
                }
                else{
                    src[i][j] = getRealType(src[i][j], type);   
                }
            }
        }
        //if the data doesn't have a header row, add one with letter headings
        var head = src[0];
        var alt = new Array(cols);
        var headTypes = [];
        for(var i=0; i<cols.length;i++){
            headTypes[i] = guessType(head[i]);    
            alt[i] = String.fromCharCode(i+65);
        }
        if(headTypes.join(',')==types.join(','))
            src = alt.concat(src);
        cb(src);
    };
    //CSVQUERY
   this.g_query = function(src, dst, query, typed){
        dst.length = 0;
        if(typeof typed == "undefined")
            typed = true;
        if(query.search(/\s\?\s/g) != -1){
            for(var i=0; i<src.length; i++){
                dst[i] = [];
                for(var j=0; j<src[i].length; j++){
                    dst[i].push(src[i][j]);  
                }                
            } 
            return;      
        }
        var cols = src[0];
        for(var i=0; i<cols.length; i++){
            cols[i] = cols[i].replace(/\s/g, '_');
            var header = String.fromCharCode(65+i);
            var reg = '[(\\s|,)]+'+header+'([^\\w]+|$)';
            query = query.replace(RegExp(reg, 'g'), function(a){return  a.replace(header,cols[i]);});
        }    
        var f = /select\s+.+\s+where/i;
        var fields = f.exec(query)[0].replace(/(select|where|\s*)/gi, '').split(/,/g);
        if(fields[0]=="*")
            fields = src[0];
        for(var i=0; i<fields.length; i++){
            fields[i]=fields[i].replace(/\s/g, '_');
        }
        var comparator = "(!?=|>=?|<=?|has|LIKE)";
        var operator = "(AND|OR|NOT)";
        var clauses = query.replace(/select.+where\s*/i,'').replace(/\s*order by\s*.*$/gi, '').split(RegExp(" "+operator+" ",'g'));  
        var o = /order by.+$/i;    
        var order = o.exec(query);
        if (/order by none/i.test(order))
            order = null;
        var orders = [];
        var ofunc;
        if(order!=null){
            var vals = order[0].replace(/order by\s*/gi,'').split(/(?:,\s*|\s+(desc|inc))/i);
            vals = vals.filter(function(a){
                return typeof a!="undefined" && a!=""; 
            });
            if(!/(?:inc|desc)/i.test(order)){
                vals.push("INC");                
            }
            var valStack = [];
            for(var i=0; i<vals.length; i++){
                if(!/(?:inc|desc)/i.test(vals[i])){
                    valStack.push(vals[i].replace(/\s/g, '_'));
                }
                else{
                    var rel_cols = [];
                    while(valStack.length>0){
                        var c = valStack.shift();
                        rel_cols.push(fields.indexOf(c));
                    }
                    orders.push([rel_cols, vals[i]]);
                }
            }
            ofunc = function(a,b){
                var sw = 0;
                for(var i=0; i<orders.length; i++){
                    sw = 0;
                    var cur_o = orders[i];
                    var j = 0;
                    while(sw == 0 && j < cur_o[0].length){
                        var ind = cur_o[0][j];
                        if(cur_o[1]=="INC"){
                            if(a[ind] < b[ind])
                                return -1;
                            else if(a[ind] > b[ind])
                                return 1;   
                        }
                        else{
                            if(a[ind] > b[ind])
                                return -1;
                            else if(a[ind] < b[ind])
                                return 1;  
                        } 
                        j++; 
                    }
                    if(sw != 0)
                        return sw; 
                }
                return sw;    
            };  
        }
        var conditions = [];
        var bools = [];
        for(var i=0; i<clauses.length; i++){
            if(i%2 == 0)
                conditions.push(clauses[i]);
            else
                bools.push(clauses[i]);
        }
        var compareVals = [];
        for(var i=1; i<src.length; i++){
            //initial case
            var cond = conditions[0].split(RegExp("\\s"+comparator+"\\s"));
            var col = cond[0];
            var val = src[i][cols.indexOf(col)];
            var op = cond[1];
            var comp = cond[2];
            if(i==1)
                compareVals[0] = getRealType(comp);
            var res = evaluate(op,compareVals[0],val, typed);
            //middle cases
            for(var j=1; j<conditions.length-1; j++){
                cond = conditions[j].split(RegExp("\\s"+comparator+"\\s"));
                col = cond[0];
                val = src[i][cols.indexOf(col)];
                op = cond[1];
                comp = cond[2];
                if(i==1)
                    compareVals[i] = getRealType(comp);
                res = operate(bools[j-1], res, evaluate(op, compareVals[i], val, typed));   
            }
            //end case
            if(bools.length>0){
                cond = conditions.slice(-1)[0].split(RegExp("\\s"+comparator+"\\s"));
                col = cond[0];
                val = src[i][cols.indexOf(col)];
                op = cond[1];
                comp = cond[2];
                if(i==1)
                    compareVals.push(getRealType(comp));
                res = operate(bools.slice(-1)[0], res, evaluate(op,compareVals.slice(-1)[0],val, typed));
            }
            if (res){
                var row =[];
                for (var k = 0; k<fields.length; k++){
                    row.push(src[i][cols.indexOf(fields[k])]);
                }
                dst.push(row);
            }
        }
        if(ofunc)
            dst.sort(ofunc);
        dst.unshift(fields);
    };
    function evaluate(op, comp, val){ 
        switch(op){
                case '=':
                    return getRealType(val) == getRealType(comp);
                break;
                case '>':
                    return getRealType(val) > getRealType(comp);
                break;
                case '>=':
                    return getRealType(val) >= getRealType(comp);
                break;
                case '<':
                    return getRealType(val) < getRealType(comp);
                break;
                case '<=':
                    return getRealType(val) <= getRealType(comp);
                break;
                case '!=':
                    return getRealType(val) != getRealType(comp);
                break;
                case 'has':
                case 'LIKE':
                    return RegExp(comp.trim().replace(/(%'|'%)/g,''), 'g').test(val);
                break;
        }
    };
    function operate(op,v1,v2){
        switch(op){
            case 'AND':
                return v1 && v2;
            break;
            case 'OR':
                return v1 || v2;
            break;
            case 'NOT':
                return v1 && !v2;
            break;
        }
    };
   function type(data){
        var cols = [];
        for(var i=0;i<data[0].length;i++){
            var range = data.length-1;
            var type = "";
            for(var j=0;j<Math.floor(0.05 * range); j++){
                var entry = data[Math.floor(Math.random()*range)+1][i];
                var cur = guessType(entry);
                if(type == "")
                    type = cur;
                else if(type!=cur){
                    type = "string";
                    break;    
                }
            }
            cols.push(type);
        }
        return cols;
    };
    this.loadDelimited = function(datasource, dst, remote, cb) {
        //empty source without losing reference
        dst.length = 0;
        var thisObj = this;
        if ( typeof remote == "undefined")
            remote = true;
        var cellDelim = ',';
        var quote = '\'';
        var data;
        if (remote) {
            //fetch data through proxy
            $.ajax({
                type : 'GET',
                url : 'proxy.php',
                data : {
                    url : datasource,
                },
                async : false
            }).complete(function(d) {
                parse(d.responseText);
            });
        } else
            parse(datasource);
        function parse(data) {
            if (data == -1) {
                error("Not found");
                alert("Please check your source URL...we didn't find anything at the other end.");
                return ;
            } else {
                //normalize newlines
                data = data.replace(/(\n\r)|(\r\n)|(\r)|(\n\n+)/g, '\n');
                //find cell delim
                var c = data.split(',').length;
                var t = data.split('\t').length;
                var cn = data.split(';').length;
                var pi = data.split('|').length;
                var cl = data.split(':').length;
                //0=comma,1=tab,2=semicolon,3=pipe,4=colon
                switch([c,t,cn,pi,cl].indexOf(Math.max(c,t,cn,pi,cl))) {
                    case 0:
                        cellDelim = ',';
                        break;
                    case 1:
                        cellDelim = '\\t';
                        break;
                    case 2:
                        cellDelim = ';';
                        break;
                    case 3:
                        cellDelim = '|';
                        break;
                    case 4:
                        cellDelim = ':';
                        break;
                }
                //try to autodetect escape delimiter
                quote = (data.split("\"").length >= data.split("\'").length) ? "\\\"" : "\\\'";
                //parse
                var space = "\\s*";
                var cells = data.replace(RegExp(space + quote + "?" + space + cellDelim + space + quote + "?", 'g'), function(capture) {
                    return capture.replace(RegExp(cellDelim), "___DELIM___");
                });
                cells = cells.split("___DELIM___");
                var row = 0;
                dst[0] = [];
                var len = cells.length;
                var in_quote = quote.slice(1);
                for (var i = 0; i < len; i++) {
                    var cell = cells[i];
                    if (/\n/g.test(cell)) {
                        if (cell.split(RegExp(quote + ".*?[^" + quote + "]\n[^" + quote + "].*?" + quote)).length % 2 == 1) {
                            if (cell.slice(-1) == "\n") {
                                cell = cell.slice(0, -1);
                                dst[row].push(cell);
                            } else {
                                var parts = cell.split('\n');
                                dst[row].push(parts[0]);
                                row++;
                                dst[row] = [parts[1]];
                            }
                        } else {
                            dst[row].push(cell);
                        }
                    } else
                        dst[row].push(cell);
                }
            }
            normalize(dst, cb);
        }
    };
    //public methods
    this.load = function(ops, callback) {
        if(!ops.dataSourceUrl){
            throw new Error("No data source defined.");
            return false;
        }
        if(typeof ops.dataTable == "undefined"){
            ops.dataTable = [];    
        }
        var datasource = ops.dataSourceUrl;
        //Google
        if(/\w+\.google\.com/.test(datasource)){
            var data = new google.visualization.Query(datasource); 
            //in memory queries
            data.send(function(src){
                    if(src.isError()){
                        throw new Error(src.getMessage());
                        return;
                    }
                    var table = [];
                    var t = src.getDataTable();
                    var cn = t.getNumberOfColumns();
                    var rn = t.getNumberOfRows();
                    var header = [];
                    for(var i=0;i<cn;i++){
                        header.push(t.getColumnLabel(i));    
                    }
                    for(var i=0; i<rn; i++){
                        table[i] = [];
                        for(var j=0; j<cn; j++){
                            table[i].push(t.getValue(i,j));
                        }
                    }
                    table.unshift(header);
                    var t = [];
                    normalize(table, function(){
                        if(ops.query){
                            ops.ogTable = table;
                            g_query(table, t, ops.query);
                        }
                        else
                            t = table;
                        ops.dataTable = t;
                        callback(ops);       
                    });
            });
        }
        else{
            if(ops.shivaGroup == "WordCloud"){
                var qs = 'parser.php?' + encodeURIComponent('url') + '=' + encodeURIComponent(ops.dataSourceUrl);
                d3.json(qs, function(error, data) {
                    if(error){
                        alert(error.response);                        
                    }
                    if (data.error) {
                        if (data.error == "fetch_fail")
                            alert("Sorry we didn't find anything at that URL. Please make sure it is correct.");
                        else if (data.error == "robots")
                            $('<div id="wordcloudError"><p> SHIVA has detected that the site you are trying to access has set a robots.txt policy that prohibits machine access to the content you are trying to fetch. Please instead copy and paste the text from the page you would like to access into the text box to the right of "Data source URL". <br /><br /> For more information about robots.txt, please visit <a target="_blank" href="http://www.robotstxt.org/robotstxt.html">this page.</a></p></div>').dialog({
                                appendTo : 'body',
                                position : 'top'
                            });
                        return false;
                    }
                    return callback(data);
                });
            }
            else{
                this.loadDelimited(ops.dataSourceUrl, ops.dataTable, true, function(){
                    if(ops.query){
                        var data = clone(ops.dataTable);
                        ops.ogTable = data;
                        g_query(data, ops.dataTable, ops.query);    
                    }
                    callback(ops.dataTable);  
                 });
            }
        }
    };
    this.queryResponse = function(data){
        this.getDataTable = function(){return new dataTable(data);};
    };
    var dataTable = function(data){
        var table = {
            head : data[0],
            data : data.slice(1)
        };
        this.getNumberOfColumns = function(){return table.head.length;};
        this.getNumberOfRows = function(){return table.data.length;};
        this.getColumnLabel = function(col){return table.head[col];};
        this.getValue = function(i,j){return table.data[i][j];};
        return this;
    };
    return this;
};

SHIVA_Show.prototype.GetSpreadsheet=function(url, fields, query, callback, addHeader) 		//	GET GOOGLE DOCS SPREADSHEET
{
	if (url.indexOf("google.com") != -1) {
		var query=new google.visualization.Query(url);							
		query.send(handleQueryResponse);
	}
	else{
	    var DAL = new dal();
	    var dst = new Array();
        DAL.loadDelimited(url, dst, true, function(data){
            var out = new Array();
            if(query){
                DAL.g_query(data, out, query);    
            }
            out = (out.length == 0)?data:out;
            qr = new DAL.queryResponse(out);
            fields = data[0];
            handleQueryResponse(qr);
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
		else{
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