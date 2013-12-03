///////////////////////////////////////////////////////////////////////////////////////////////
//  SHIVALIB TIMELINE
///////////////////////////////////////////////////////////////////////////////////////////////

//  TIMEGLIDER /////////////////////////////////////////////////////////////////////////////////////////// 
//  From Than 1/31/13

SHIVA_Show.prototype.DrawTimeGlider=function() //  DRAW TIMEGLIDER
{
  if($('#cp_colorbar').is(":visible") == true || $('#cp_colormap').is(":visible") == true) {
    return;
  }
  var i;
  var stimeline = new Object();
  
  if($('link[href*=timeglider]').length == 0) {
    $('head').append('<link rel="stylesheet" href="css/timeglider/Timeglider.css" type="text/css" media="screen" title="no title" charset="utf-8">');
  }
  
  stimeline.events=null;
  stimeline.options=this.options;
  stimeline.container=this.container;
  stimeline.con="#"+stimeline.container;

  // Always set width and height before drawing timeline as the layout depends on the container size.
  $(stimeline.con).width(stimeline.options['width']);
  $(stimeline.con).height(stimeline.options['height']);
  $(stimeline.con).timeline('resize');  // Resixe after setting height

	this.GetSpreadsheet(stimeline.options.dataSourceUrl,true,stimeline.options.query,$.proxy(ProcessTimelineData, this)); 
	
	function ProcessTimelineData(data) {
    eventData={ events:new Array() };
    // process event
    for(var n in data) {
    	var ev = data[n];
    	// normalize dates and strings for events
    	// further event normalization occurs in normalizeEventData() function called below.
    	for(var prop in ev) {
    		var val = ev[prop];
    		if(prop == 'icon' || val == '') { continue; }
    		// dates
    		if ((prop == "startdate") || (prop == "enddate")) {
          ev[prop] = ConvertTimelineDate(val);
        // strings
        } else if(typeof(val) == "string" ) {
          // replace carriage returns with <br/> html
          ev[prop] = val.replace(/[\n\r\f]/g, "<br/>");
        }
        eventData.events.push(ev);
        data[n] = ev; // update data array
    	} // end of event property loop
    } // end of array of events loop
    
    stimeline.events = eventData.events;
    
    // Normalize timeline options
    if (typeof(stimeline.options.min_zoom) == "undefined" ||
         stimeline.options.min_zoom == "" || 
         stimeline.options.min_zoom == "0") {
            stimeline.options.min_zoom = 1;
    }
    if (typeof(stimeline.options.max_zoom) == "undefined" ||
         stimeline.options.max_zoom == "" || 
         stimeline.options.max_zoom == "0") {
            stimeline.options.max_zoom = 99;
    }
    if (typeof(stimeline.options.initial_zoom) == "undefined" ||
         stimeline.options.initial_zoom == "" || 
         stimeline.options.initial_zoom == "0") {
            stimeline.options.initial_zoom = 50;
    }
    var stldata = [{
      "id":"stl" + (new Date()).getTime(),
      "title":stimeline.options.title,
      "description":"<p>" + stimeline.options.description + "</p>",
      "focus_date": ConvertTimelineDate(stimeline.options.focus_date),
      "timezone":stimeline.options.timezone,
      "initial_zoom":stimeline.options.initial_zoom * 1,
      "events": normalizeEventData(stimeline.events)
    }];
    
    // Set data and create new timeline if window's timeline object is undefined
    if(typeof(window.shivaTimeline) == "undefined") {
      // Load the initial timeline with default data
      window.shivaTimeline =  $(stimeline.con).timeline({
          "min_zoom":stimeline.options.min_zoom * 1,
          "max_zoom":stimeline.options.max_zoom * 1,
          "icon_folder": 'images/timeglider/icons/', // check to see if we can make this a parameter
          "data_source":stldata,
          "timezone": "-05:00",
          "show_footer":Boolean(stimeline.options.show_footer),
          "display_zoom_level":Boolean(stimeline.options.display_zoom_level),
          "constrain_to_data":false,
          "image_lane_height": stimeline.options.imglane_height * 1,
          "mousewheel": "none",
          "loaded":function (args, data) {
            $(stimeline.con).timeline('setOptions', stimeline.options, true);
            $(stimeline.con).timeline('registerEvents', stimeline.events);
            $(stimeline.con).timeline('eventList'); //setTimeout('$(\'' + stimeline.con + '\').timeline(\'eventList\')', 500);
            if(stimeline.options.show_desc == "false") { $('.tg-timeline-modal').fadeOut();  }
            shivaLib.SendReadyMessage(true);
          }
      });
   
   // Inserting or updating data into timeline structure already created
   } else {
      var callbackObj = {
        fn : function (args, data) {
            setTimeout(function() {
              $(stimeline.con).timeline('setOptions', stimeline.options, true);
              $(stimeline.con).timeline('registerEvents', stimeline.events);
              $(stimeline.con).timeline('eventList');
              if(stimeline.options.show_desc == "false") { $('.tg-timeline-modal').fadeOut();  }
            }, 500);
        },
        args : {
          "min_zoom":stimeline.options.min_zoom * 1,
          "max_zoom":stimeline.options.max_zoom * 1,
          "icon_folder": 'images/timeglider/icons/', // check to see if we can make this a parameter
          "data_source": stldata,
          "timezone": "-05:00",
          "mousewheel": "none",
          "show_footer":Boolean(stimeline.options.show_footer),
          "display_zoom_level":Boolean(stimeline.options.display_zoom_level),
          "constrain_to_data":false,
          "image_lane_height": stimeline.options.imglane_height * 1,
        },
        display : true
      };
      $(stimeline.con).timeline('loadTimeline', stldata, callbackObj);
    }

    // Make event modal windows draggable
    window.stlInterval = setInterval(function() {
      $('.timeglider-ev-modal').draggable({cancel : 'div.tg-ev-modal-description'});
    }, 500);

		// Functions called above 
		// Convert dates to something ingestible by Timeglider
    function ConvertTimelineDate(dateTime) {
    	if(typeof(dateTime) == 'undefined') {return '';}
      var dt = dateTime;
      // First deal with dates that only have month/year, as these break the date object
      // Add the day to be 15th of the month (TO DO: make it into a span if no end date or if there is then use the first of the month)
      if(typeof(dateTime) == "number") { dateTime = dateTime.toString(); }
      if( typeof(dateTime) == 'string') {
        var m = dateTime.match(/\//g);
        if(m != null && m.length == 1) {
          var dp = dateTime.split('/');
          dp.splice(1,0,"15");
          dateTime = dp.join('/');
        }
        // Parse Date piece by piece to account for BC or - years
        var dt = new Date();
        var dp = dateTime.split('/');
        var y = $.trim(dp[dp.length - 1]);
        if(y.indexOf(' ')> -1) {
          pts = y.split(' ');
          y = pts[0];
          // Test and account for times in dates
          if (pts[1].indexOf(':') > -1) {
            tpts = pts[1].split(":");
            if (tpts.length == 3) {
              dt.setHours(tpts[0]);
              dt.setMinutes(tpts[1]);
              dt.setSeconds(tpts[2]);
            }
          }
        }
        dt.setFullYear(y);
        var m = (dp.length > 1)? dp[dp.length - 2] : 1;
        dt.setMonth((m * 1) - 1);
        var d = (dp.length > 2)? dp[dp.length - 3] : 15;
        dt.setDate(d);
      }
      
      // Adjust positive years to match the tick (doesn't work with BCE years)
      /* Taking out because it messes with the dates too much. 
       * If it is still an issue of aligning with the tick marks trying using CSS
       if(typeof(dt.getFullYear()) == "number" && dt.getFullYear() > 0) {
        dateTime=Date.parse(dt)+50000000;
        dt = new Date(dateTime);
      }*/
      if (typeof(dt) == "undefined" || dt == null) { return ''; }
      var mn = padZero(dt.getMonth() + 1);
      var dy = padZero(dt.getDate());
      var hrs = padZero(dt.getHours());
      var mns = padZero(dt.getMinutes());
      var scs = padZero(dt.getSeconds());
      var dtstr = dt.getFullYear() + "-" + mn + "-" + dy + " " + hrs + ":" + mns + ":" + scs;
      return dtstr;
    }
		
		// Zero padding function
    function padZero(n) {
      if(n < 10) { n = '0' + n; }
      return n;
    }
		
		// Event data normalization
    function normalizeEventData(events) {
      var ct = 0;
      for(var i in events) {
        ct++;
        var ev = events[i];
        if(typeof(ev.id) == "undefined" || ev.id == null) {
          ev.id = "event-" + ct;
        } else {
          ev.id = ev.id + "-" + ct;
        }
        if(typeof(ev.startdate) == "undefined" && typeof(ev.start) != "undefined") {
          ev.startdate = ConvertTimelineDate(ev.start);
        }
        if(typeof(ev.enddate) == "undefined" && typeof(ev.end) != "undefined") {
          ev.enddate = ConvertTimelineDate(ev.end);
        }
        if(typeof(ev.enddate) == "undefined" || ev.enddate == "" || ev.enddate == null) {
          ev.enddate = ev.startdate;
        }
        if(typeof(ev.importance) == "undefined" || ev.importance == "" || ev.importance == null) {
          ev.importance = 50;
        }
        if(typeof(ev.date_display) == "undefined" || ev.date_display == "" || ev.date_display == null) {
          ev.date_display = "ye";
        }
        if(typeof(ev.icon) == "undefined" || ev.icon == "" || ev.icon == null)  {
          ev.icon = "none";
        }
      }
      return events;
    }
	}
};

//  SIMILE

SHIVA_Show.prototype.DrawTimeline=function(oldItems) 											//	DRAW TIMELINE
{
	var i;
	var eventData=null;
	var options=this.options;
	var container=this.container;
	var con="#"+container;
	var ops=new Array();
	var items=new Array();
	$(con).css('width',options['width']+"px");
	$(con).css('height',options['height']+"px");
	var eventSource=new Timeline.DefaultEventSource();
	$("#timelineCSS").attr('href',"css/timeline"+options.theme+".css");
	if (oldItems)
		items=oldItems;
	else
	   	for (var key in options) {
			if (key.indexOf("item-") != -1) {
				var o=new Object;
				var v=options[key].split(';');
				for (i=0;i<v.length;++i)
					o[v[i].split(':')[0]]=v[i].split(':')[1].replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
				items.push(o);
				}
			}
	this.items=items;
	for (i=0;i<items.length;++i) {
		if (items[i].visible == "false")
			continue;
		o=new Object();
		o.width=items[i].pct+"%";
		o.intervalUnit=eval("Timeline.DateTime."+items[i].intu.toUpperCase()); 
		o.intervalPixels=Number(items[i].intw);
		o.eventSource=eventSource;
		o.date=items[i].date;
		o.overview=(items[i].text == "false");
		var theme=Timeline.ClassicTheme.create();
		theme.event.tape.height=Number(items[i].thgt);
		theme.event.track.height=Number(items[i].thgt)+2;
		o.theme=theme;
		ops.push(Timeline.createBandInfo(o));
		if (i) {
			if (items[i].sync != "None")
				ops[i].syncWith=Number(items[i].sync)-1;
				ops[i].highlight=(items[i].high == "true");
				}
		}
	i=(options['orientation'] != "Vertical")?0:1; 		
	if (this.timeLine) 
		Timeline.timelines.pop();
	this.timeLine=Timeline.create(document.getElementById(container),ops,i);
	if (options['dataSourceUrl'])
		GetSpreadsheetData(options['dataSourceUrl'],"",this);
	else{
  		this.timeLine.loadJSON("SimileTestData.js",function(json, url) {  eventSource.loadJSON(json, url); });
		this.SendReadyMessage(true);											
		}
		
	function GetSpreadsheetData(file, conditions, _this) 
	{
		lastDataUrl=file.replace(/\^/g,"&").replace(/~/g,"=").replace(/\`/g,":");
		var query=new google.visualization.Query(lastDataUrl);
		if (conditions)
			query.setQuery(conditions);
   		query.send(handleQueryResponse);
 
	    function handleQueryResponse(response) {
		    var i,j,key,s=0;
			var data=response.getDataTable();
			var rows=data.getNumberOfRows();
			var cols=data.getNumberOfColumns();
	 		eventData={ events:new Array() };
			if (!$.trim(data.getColumnLabel(0)))
				s=1;
			for (i=s;i<rows;++i) {
 				o=new Object();
				for (j=0;j<cols;++j) {
					key=$.trim(data.getColumnLabel(j));
					if (!key)
						key=$.trim(data.getValue(0,j));
					if ((key == "icon") && (!data.getValue(i,j)))
						continue;
					if ((key == "start") || (key == "end")) {
						if (data.getFormattedValue(i,j))
							o[key]=_this.ConvertDateToJSON(data.getFormattedValue(i,j));
						}
					else	
						o[key]=data.getValue(i,j);
					}
 				eventData.events.push(o);
  				}
 			eventSource.loadJSON(eventData,'');
		 	shivaLib.SendReadyMessage(true);											
 	     }
  	}
};

SHIVA_Show.prototype.TimeActions=function(msg)						// REACT TO SHIVA ACTION MESSAGE
{
	var v=msg.split("|");												// Split msg into parts
	if (v[0] == "ShivaAct=resize") { 									// RESIZE
		if (v[1] == "100") {											// If forcing 100%
			$("#"+shivaLib.container).width("100%");					// Set container 100%
			$("#"+shivaLib.container).height("100%");					// Set container 100%
			}
	$("#"+shivaLib.container).timeline('resize');  						// Resize after setting height
	}
};