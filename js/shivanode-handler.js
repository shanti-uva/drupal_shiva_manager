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
	debug_settings = ['message_in']; // 'show_errors', 'ready_message', 'message_in', 'message_out'
		
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
				if($('#chosen_data_element_url').text().length > 0) {
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
		 * Set toggle loadGData to load Google Doc data 
		 * New chart will automatically call dataChanged function
		 * This will call getJSON to get json for new chart and in processGetJson will add in new data.
		 **/
		if(shiva_settings.status == "ready" && shiva_settings.isNewEl == true ) {
			shiva_settings.loadGData = true; 
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
		if (shiva_settings.status == 'loading') {
			if (shiva_settings.loadData == "JS") {
				Drupal.Shivanode.putJSON('shivaEditFrame', shiva_settings.jsonFromDrupal); //Drupal.Shivanode.putDrupalJSON();
			} else {
				// When initially loading the iframe get JSON from it
				Drupal.Shivanode.getJSON();
			}
		} else if (shiva_settings.status == 'puttingJSON') {
		// When sending JSON data to Iframe status = puttingJSON
			shiva_settings.status = 'ready';
			shiva_settings.jsonLoaded = true;	
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
  	// When frame loads initially it gets the json from it
  	// if loadData is "true"GD" (for google doc) than combine the google data with it and send it back to the frame
  	if(shiva_settings.loadData == "GD") {
  		shiva_settings.loadData = false;
			Drupal.Shivanode.setDataSheet(shiva_settings.dataUrl, shiva_settings.dataTitle);
  	}
	};
	
	/** 
	 * Send JSON to editor iframe
	 *    Sends the 'json' string to iframe with the given id
	 * 		This Iframe should hold a Shiveye editor page, such as chart.htm, timeline.htm, etc.
	 * 		Those pages then handle the putJSON= message, which is not handled in this JS
	 */
	Drupal.Shivanode.putJSON = function(iframe,json) {
		if (typeof(json) == 'object') { json = JSON.stringify(json); }
		try {
			var cmd = 'PutJSON=' + json;
			Drupal.Shivanode.shivaSendMessage(iframe,cmd);
			shiva_settings.latestJSON = json;
			Drupal.Shivanode.adjustHeightWidth(json);
			shiva_settings.status = 'puttingJSON';
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
			console.log("Changing chart type: " + isadd[3]);
			json.chartType = isadd[3];
		} 
		json.dataSourceUrl = gdoc;
		json.title = gtitle;
		json.shivaId = 0;
		json.shivaMod = dt.toDateString();
		json = JSON.stringify(json);
		if (self == top ) {
			Drupal.Shivanode.putJSON('shivaEditFrame',json);
		} else { 
			setTimeout(function() { 
				window.parent.postMessage('RelayJSON=' + json,'*');
			}, 1000);
		}
	};
	
	/*
	 * setDataElement(did, isnew) : set or relay the ID for a data entry linked to a visualization
	 * 					did = the data node's node id (nid)
	 * 					isnew = whether or not it is a new visualization and the add/shivanode page has not yet been called
	 * 									if this is true this function will redirect to node/add/shivanode/### which ### = the data node id to use 
	 */
	Drupal.Shivanode.setDataElement = function(did, isnew) {
	  if(self == top && window.location.search.indexOf('insert=') > -1) { isnew = true; }
		if(typeof(isnew) == "undefined") { isnew = false;}
		var e = this.event;
		if(self != top || $(this).parents('#lightbox').length > 0) {
			// When it is in the lightbox, send id to parent (SetDataElement) and close window
			cmd = 'SetDataElement=' + did;
			window.parent.postMessage(cmd,'*');
			window.parent.Lightbox.end();
			$('#bottomNavClose').click(); // if above doesn't work.
			return false;
		} else if(isnew) {
			// if it's a brand new visualization and its in the parent position it's a link from the All Data Entries page
			//  to create a new visualization based on a data entry so redirect
			var newloc = Drupal.settings.basePath + 'node/add/shivanode/' + did;
			setTimeout(function () { window.location.href = newloc;},300);
			return false;
		} else {
			// If the top parent controller, then get the data entry JSON and send to Iframe Editor with RelayJSON message
			$.ajax({
				type: "GET",
				url: Drupal.settings.basePath + 'shivapi/data/' + did + '.json',
				async: false, 
				success: function (data) {
					var jobj = JSON.parse(data.json);
					jobj.did = did;
					jobj.isNewDSU = true;
					window.parent.postMessage('RelayJSON=' + JSON.stringify(jobj),'*');
				}
			});
		}
	};
	
	// Function to set the JSON value of visualizations within a Shivanode edit/create form
	Drupal.Shivanode.setDrupalJSON = function(json, e) {
    shiva_settings.status = "ready";
		var jobj = JSON.parse(json); 
    json = JSON.stringify(jobj);
		// If "new" json is the same as old "latestJSON" then return
    if (shiva_settings.latestJSON == json) { return; }
    $('textarea[id^="edit-shivanode-json"]').val(json);
    shiva_settings.latestJSON = json;
		// Set IFrame height and width corresponding to the visualization 
    Drupal.Shivanode.adjustHeightWidth(jobj);
		//Drupal.Shivanode.checkKMLUrls(jobj);
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