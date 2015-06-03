(function($) {
	
	// Use custom Drupal.Shivanode object for functions that are called at various times.
	Drupal.Shivanode = {};
	
	// shiva_settings is assigned by reference from Drupal.settings.shivanode 
	//      in the shivanode-behaviors.js shivaViewNode function
	
	/*
	 * Debug array:
	 * 	Can contain any number of the following values:
	 * 		'message_in' 		: displays message received by the message handler
	 * 		'message_out' 	: displays message sent by Shiva
	 * 		'ready_message' : show status when ready message received
	 * 		'show_errors'   : displays errors in console.	
	 * 
	 */
	debug_settings = ['show_errors', 'ready_message', 'message_in', 'message_out']; // 'show_errors', 'ready_message', 'message_in', 'message_out'
		
	function debug_on(type) {
		if (debug_settings.indexOf(type) > -1) {
			return true;
		}
		return false;
	}
   
	/**************** Message Sending and Receiving ***********************/
	/*
	 * Shiva Message Handler: Processes messages from visualization Ifram
	 */ 
	Drupal.Shivanode.shivaMessageHandler = function(e) {
		// Separate out param name (message type) and message data
		var mtype, mdata;
		var eind = e.data.indexOf('=');
		if (eind == -1) { 
			mtype = e.data;
		} else {
			mtype = e.data.substr(0,eind);
			mdata = e.data.substr(eind + 1);
		}
		if (mdata && mdata.indexOf('ready|posterFrame') > -1) {return;} // Ignore old message about poster
		if (debug_on('message_in')) { console.log('message in: ', mtype, mdata); }
		
		// Process message (mdata) depending on message type (mtype)
		switch (mtype) {
			case 'ChartChanged':
				if(shiva_settings.status == 'ready') {
					Drupal.Shivanode.chartChanged(mdata);
				}
				break;
				
			// Subway, etc. send "DataChanged=true" but chart sends "DataChanged={chart type}"
			case 'DataChanged':
			  if(shiva_settings.status == 'ready') {
					Drupal.Shivanode.dataChanged(mdata);
				}
				break;
				
			// Shiva edit frame requests a data source URL from Drupal User. 	
			case 'dataSourceUrl':
				var durl = ($('#chosen_data_element_url').length == 1) ? $.trim($('#chosen_data_element_url').text()) : '';
				if($('#chosen_data_element_url').text().length > 0 && $('#sn-data-removed').length == 0) {
					alert(Drupal.t("You already have a data item associated with this visualization." +
						"\nRemove this with the 'Remove Data Link' button before selecting a new one."));
				} else {
					$('#use-data-element-link a').click(); // Click on link to open lightbox list.
				}
				break;
				
			case 'GetJSON':
		  	Drupal.Shivanode.processGetJSON(mdata, e);
		  	break;
				
			case 'RelayJSON':
				Drupal.Shivanode.relayJSON(mdata, e);
				break;
				
			case 'SetDataElement':
				Drupal.Shivanode.setDataElement(mdata);
				break;
				
			case 'ShivaReady':
				Drupal.Shivanode.processReadyMessage(mdata);
				break;
				
			default:
				console.log("message unprocessed: " + mdata);
		}
	};
	
	/* 
	 * Sending message to Iframe
	 */
	Drupal.Shivanode.shivaSendMessage = function(iFrameName,cmd) {
		if (typeof(document.getElementById(iFrameName)) == 'object' && document.getElementById(iFrameName) != null) {
			var win=document.getElementById(iFrameName).contentWindow.postMessage(cmd,'*');
			if (debug_on('message_out')) { console.log("message out: ", cmd); }
		} else if (debug_on('show_errors')) {
	  	console.error('There is no frame by the name of: ' + iFrame); // for debugging messages, send to console
	  }
	};
	// End of Message Sending and Receiving
	
	/********* Message Handling Functions *******************/
	Drupal.Shivanode.chartChanged = function(mdata) {
		/** 
		 * Set toggle loadData to load Google Doc data 
		 * New chart will automatically call dataChanged function
		 * This will call getJSON to get json for new chart and in processGetJson will add in new data.
		 **/
		if(shiva_settings.status == "ready" && shiva_settings.isNewEl == true ) {
			// if a new chart, then add the subtype to the end of the url and reload.
			var winloc = window.location.pathname;
			if(winloc.indexOf('node/add') > -1) {
				// determine whether there's a data node id in url or if /nd/
				var dstr = (winloc.indexOf('/nd/') > -1) ? '/nd/' : winloc.match(/\/(\d+)\//)[0];
				if (dstr) {
					// replace subtype with new chart type and reload
					var locpts = winloc.split(dstr);
					var postpts = locpts[1].split('/');
					winloc = locpts[0] + dstr + postpts[0] + "/" + mdata.replace(' ','');
					window.location.pathname = winloc;
				}
			}
			shiva_settings.loadData = "GD"; 
		}
	}; 
	
	/**
	 * When Data is changed, call getJSON to get new JSON format from new chart
	 * This returns "GetJSON" message which is handled in Drupal.Shivanode.processGetJSON
	 */
	Drupal.Shivanode.dataChanged = function(mdata) {
		// any datachanged message received when shiva_settings.status is 'ready' means use changed form so data is changed 
		if (shiva_settings.status == 'ready') { 
			shiva_settings.dataChanged = true; 
			Drupal.Shivanode.getJSON();
		}
	}; 
	
	/**
	 * Prodcesses a Ready message from the SHIVA IFrame
	 *    shiva_settings.status represents the previously set status describing what is now ready
	 *   Used to deal with ready message in different contexts.
	 */
	Drupal.Shivanode.processReadyMessage = function(mdata) {
		if (debug_on('ready_message')) { console.info('ready message received: [' + shiva_settings.status + ']'); }
		// Determine what to do depending on previously set status
		//console.log(shiva_settings.status, shiva_settings.loadData);
		if (shiva_settings.status == 'loading') {
			if (shiva_settings.loadData == "JS") {
				Drupal.Shivanode.putJSON('shivaEditFrame', shiva_settings.jsonFromDrupal); //Drupal.Shivanode.putDrupalJSON();
				shiva_settings.loadData = false;
			} else {
				// When initially loading the iframe get JSON from it
				Drupal.Shivanode.getJSON();
			}
		} else if (shiva_settings.status == 'puttingJSON') {
		// When sending JSON data to Iframe status = puttingJSON
			shiva_settings.status = 'ready';
			shiva_settings.jsonLoaded = true;	
		} else if (shiva_settings.status == 'newdata') {
			if (shiva_settings.latestJSON) {
				Drupal.Shivanode.setDrupalJSON(shiva_settings.latestJSON);
			}
		} else {
			shiva_settings.status = 'ready';
		}
	};
	
	// End of Message Handling
	
	/*************** Helper Functions *******************/
	
	// Adjust IFrame Height and Width to visualization
  Drupal.Shivanode.adjustHeightWidth = function(json) {
    // Set IFrame height and width corresponding to the visualization if it is larger
    if (typeof(json) == "string") {json = JSON.parse(json); }
    // Set IFrame height and width corresponding to the visualization if it is larger
    if (typeof(json.width) == "string" && !isNaN(json.width)) {
      vwidth = json.width * 1;
      if (vwidth > 800) {
        $('#shivaEditFrame').css('width','');
        $('#shivaEditFrame').width(vwidth + 350); // add 350 for settings table on left
      }
    }
    if (typeof(json.height) == "string" && !isNaN(json.height)) {
      vheight = json.height * 1;
      if (vheight > 900) {
        $('#shivaEditFrame').css('height','');
        $('#shivaEditFrame').height(vheight +  150);
      }
    }
  };
  
	/* 
	 * Get JSON From iframe
	 * 		This calls the editor iframe which response with the message GetJSON={json string}
	 */
	Drupal.Shivanode.getJSON = function() {
	  if (shiva_settings.status == "gettingJSON") { return; }
	  shiva_settings.status = "gettingJSON";
		Drupal.Shivanode.shivaSendMessage('shivaEditFrame','GetJSON');
	};	
	
	Drupal.Shivanode.processGetJSON = function(mdata, e) {
		Drupal.Shivanode.setDrupalJSON(mdata, e);	
		var sstr = window.location.search;
		var m = sstr.match(/ctype=([^\&]+)/);
		if (m && m.length > 1 && !shiva_settings.ctypeprocessed) {
			var json = shiva_settings.latestJSON;
			json = JSON.parse(json);
			json.chartType = m[1];
			json = JSON.stringify(json);
			Drupal.Shivanode.putJSON('shivaEditFrame', json);
			shiva_settings.latestJSON = json;
			shiva_settings.ctypeprocessed = true;
		}
  	// When frame loads initially it gets the json from it
  	// if loadData is "GD" (for google doc) than combine the google data with it and send it back to the frame
  	if(shiva_settings.loadData == "GD") {
  		shiva_settings.loadData = false;
  		if (shiva_settings.dataUrl && shiva_settings.dataUrl.length > 0) {
				Drupal.Shivanode.setDataSheet(shiva_settings.dataUrl, shiva_settings.dataTitle);
			}
  	}
	};
	
	/** 
	 * Send JSON to editor iframe
	 *    Sends the 'json' string to iframe with the given id
	 * 		This Iframe should hold a Shiveye editor page, such as chart.htm, timeline.htm, etc.
	 * 		Those pages then handle the putJSON= message, which is not handled in this JS
	 */
	Drupal.Shivanode.putJSON = function(iframe,json,status) {
		if (typeof(json) == 'object') { json = JSON.stringify(json); }
		if (typeof(status) == 'undefined') { status = 'puttingJSON'; }
		try {
			var cmd = 'PutJSON=' + json;
			Drupal.Shivanode.shivaSendMessage(iframe,cmd);
			shiva_settings.latestJSON = json;
			Drupal.Shivanode.adjustHeightWidth(json);
			shiva_settings.status = status;
		} catch(e) {
			if (typeof(console) == 'object') {
				console.error("Error parsing JSON for put into Iframe (" + iframe + "): \n" + e);
			}
		}
		//setTimeout("Drupal.settings.shivanode.loadJS = false;", 1000);
		//Drupal.Shivanode.monitorEditFrame(true);
	};
	
	Drupal.Shivanode.relayJSON = function(json, e) {
		var fnm = 'shivaEditFrame';
		// if edit frame is in a popup, have to first relay to the popup.
		if($('#' + fnm).length == 0 && $('iframe.overlay-active').length > 0) {
			fnm = 'shivaOverlay';
			$('iframe.overlay-active').attr('id',fnm); // Iframe needs an id for messaging.
			json = e.data; // keep the RelayJSON for overlay
			Drupal.Shivanode.ShivaMessage(fnm, json);
		} else { // Edit Iframe is in top page so just PutJSON to it.
			var jobj = JSON.parse(json);
			var currjson = shiva_settings.latestJSON;
			currjson = JSON.parse(currjson);					 // Get Current JSON
			if (jobj.data_url) {	
				currjson.dataSourceUrl = jobj.data_url;  // Set the URL and Title to new data nod
				currjson.title = jobj.title;
				currjson.shivaMod = dt.toDateString();
				currjson = JSON.stringify(json);
				Drupal.Shivanode.putJSON('shivaEditFrame',json);  // Send the JSON to the shiva edit frame child
				Drupal.Shivanode.setDrupalJSON(json);							// Update the Drupal JSON field in the node record
				// NEED TO ADD LINK to Visualization somehow
				alert("Need to add code to write the link to database and not allow link if one exists");
			}
		}
	};
	
	/* 
	 * Send given Gdoc url and title to Visualization editing frame
	 * 		for creating visualizations from data entrys
	 */
	Drupal.Shivanode.setDataSheet = function(gdoc, gtitle) {
		var dt = new Date;
		var json = JSON.parse(shiva_settings.latestJSON);
		// Get chart type from url if adding node
		//  URL for adding
		var pn = window.location.pathname;
		if (isadd = pn.match(/node\/add\/shivanode\/(\d+)\/([^\/]+)\/([^\/]+)/)) {
			//console.log("Changing chart type: " + isadd[3]);
			json.chartType = isadd[3];
		} 
		json.dataSourceUrl = gdoc;
		json.title = gtitle;
		json.shivaId = 0;
		json.shivaMod = dt.toDateString();
		json = JSON.stringify(json);
		if (self == top ) {
			Drupal.Shivanode.putJSON('shivaEditFrame',json, 'newdata');
			shiva_settings.latestJSON = json;
		} else { 
			setTimeout(function() { 
				window.parent.postMessage('RelayJSON=' + json,'*');
			}, 1000);
		}
	};
	
	/**
	 * sendDataElId: Sends a data element ID to the parent frame. Used from within lightbox popup
	 */
	Drupal.Shivanode.sendDataElId = function(did) {
		// When it is in the lightbox, send id to parent (SetDataElement) and close window
		cmd = 'SetDataElement=' + did;
		window.parent.postMessage(cmd,'*');
		window.parent.Lightbox.end();
		$('#bottomNavClose').click(); // if above doesn't work.
		return false;
	};
	
	/*
	 * setDataElement(did) : set the ID for a data entry linked to a visualization
	 * 					did = the data node's node id (nid)
	 */
	Drupal.Shivanode.setDataElement = function(did) {
		var wpn = window.location.pathname; 
		// When its a new chart form with no data
		if (wpn.indexOf('node/add/shivanode/nd') > -1) {
			wpn = wpn.replace('/nd/', '/' + did + '/');
			window.location.pathname = wpn;
		// When its a new chart that had a previous data node id
		} else if (wpn.match(/node\/add\/shivanode\/\d+/)) {
			wpn = wpn.replace(/node\/add\/shivanode\/\d+/, '/node/add/shivanode/' + did);
		// When its an old chart being edited
		} else {
			$.ajax({
				type: "GET",
				url: Drupal.settings.basePath + 'shivapi/data/' + did + '.json',
				async: false, 
				success: function (data) {
					Drupal.Shivanode.setDataSheet(data.data_url, data.title);
					shiva_settings.newdid = did;
					$("#data_sheet_in_use #new-data-sheet").remove();
					$("#data_sheet_in_use").append('<span id="new-data-sheet"><a href="' + data.data_url + '" target="_blank">' + data.title + '</a></span>');
					$("#data_sheet_in_use").append('<input type="hidden" name="shivanode_data_nid" id="shivanode_data_nid" value="' + did + '"></input>');
					$("#data_sheet_in_use").show();
				}
			});
		}
	};
	
	// Function to set the JSON value of visualizations within a Shivanode edit/create form
	Drupal.Shivanode.setDrupalJSON = function(json, e) {
		var jobj = JSON.parse(json); 
    json = JSON.stringify(jobj);
		// If "new" json is the same as old "latestJSON" then return
    if (shiva_settings.latestJSON == json && shiva_settings.status != 'newdata') { 
	    shiva_settings.status = "ready";
	    return; 
	   }
    $('textarea[id^="edit-shivanode-json"]').val(json);
    shiva_settings.latestJSON = json;
		// Set IFrame height and width corresponding to the visualization 
    Drupal.Shivanode.adjustHeightWidth(jobj);
    shiva_settings.status = "ready";
	};
	
	/**
	 * setUnload: sets error checkers for when a user navigates away from edit form
	 * 			1. warns if data is changed and not saved
	 * 			2. prevents submission without title
	 */
	Drupal.Shivanode.setUnload = function() {
		// Set window onbeforeunload to warn if not saving
		window.onbeforeunload = function (e) {
			if (shiva_settings.dataChanged == true) {
				if (typeof(e.srcElement) == "undefined") { return; }
				var txt = e.srcElement.activeElement.innerText;
				if (txt.indexOf('SAVE') == -1 && txt.indexOf('UPDATE') == -1) {
					return Drupal.t("You have changed the data on this page without saving it!");
				}
			}
		};
		
		// Don't allow save unless Title is filled in
		$('button[id*="edit-submit"]').click(function(e) {
			var sntitle = $('#edit-title').val();
			if (sntitle == '') {
				alert("You must enter a title before submitting your visualization!");
				$('#edit-title').addClass('error');
				e.preventDefault();
			}
		});
	};
	// End of Helper Functions
	
}) (jQuery);