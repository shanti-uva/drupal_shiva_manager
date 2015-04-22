(function($) {
	
	// Use custom Drupal.Shivanode object for functions that are called at various times.
	Drupal.Shivanode = {};
	
	// shiva_settings is assigned by reference from Drupal.settings.shivanode 
	//      in the shivanode-behaviors.js shivaEntryFormConfig function
	
	/*
	 * Debug array:
	 * 	Can contain any number of the following values:
	 * 		'message_in' 		: displays message received by the message handler
	 * 		'message_out' 	: displays message sent by Shiva
	 * 		'ready_message' : show status when ready message received
	 * 		'show_errors'   : displays errors in console.	
	 * 
	 */
	debug_settings = ['show_errors', 'ready_message', 'message_in', 'message_out'];
		
	function debug_on(type) {
		if(debug_settings.indexOf(type) > -1) {
			return true;
		}
		return false;
	}
	
	/**************** Message Sending and Receiving ***********************/
	/*
	 * Shiva Message Handler: Processes messages from visualization Ifram
	 */ 
	Drupal.Shivanode.shivaMessageHandler = function(e) {
		var mtype, mdata;
		var eind = e.data.indexOf('=');
		if(eind == -1) { 
			mtype = e.data;
		} else {
			mtype = e.data.substr(0,eind);
			mdata = e.data.substr(eind + 1);
		}
		if(debug_on('message_in')) { console.log('message in: ', mtype, mdata); }
				
		switch(mtype) {
			case 'ChartChanged':
				Drupal.Shivanode.chartChanged(mdata);
				break;
				
			// Subway, etc. send "DataChanged=true" but chart sends "DataChanged={chart type}"
			case 'DataChanged':
				Drupal.Shivanode.dataChanged(mdata);
				break;
				
			// Shiva edit frame requests a data source URL from Drupal User. 	
			case'dataSourceUrl':
				$('#use-data-element-link a').click(); // Click on link to open lightbox list.
				break;
				
			case 'GetJSON':
		  	Drupal.Shivanode.setDrupalJSON(mdata, e);	
		  	break;
				
			case 'ShivaReady':
				Drupal.Shivanode.processReadyMessage(mdata);
				break;
		}
	};
	
	/* 
	 * Sending message to Iframe
	 */
	Drupal.Shivanode.shivaSendMessage = function(iFrameName,cmd) {
		//console.trace();
		if(typeof(document.getElementById(iFrameName)) == 'object' && document.getElementById(iFrameName) != null) {
			var win=document.getElementById(iFrameName).contentWindow.postMessage(cmd,'*');
			if(debug_on('message_out')) { console.log("message out: ", cmd); }
		} else if(debug_on('show_errors')) {
	  	console.error('There is no frame by the name of: ' + iFrame); // for debugging messages, send to console
	  }
	};
	// End of Message Sending and Receiving
	
	/********* Message Handling Functions *******************/
	Drupal.Shivanode.chartChanged = function(mdata) {
		//console.log("Chart changed: " + shiva_settings.status);
	}; 
	
	Drupal.Shivanode.dataChanged = function(mdata) {
		// any datachanged message received when shiva_settings.status is 'ready' means use changed form so data is changed 
		if(shiva_settings.status == 'ready') { 
			shiva_settings.dataChanged = true; 
			Drupal.Shivanode.getJSON();
		} else {
			console.log("in data changed: " + shiva_settings.status);
		}
	}; 
	
	Drupal.Shivanode.processReadyMessage = function(mdata) {
		if(debug_on('ready_message')) { console.info('ready message received: ' + shiva_settings.status); }
		if(shiva_settings.status == 'puttingJSON') {
			shiva_settings.status = 'ready';
			shiva_settings.jsonLoaded = true;	
		} else {
			console.log(shiva_settings.status);
		}
	};
	
	// End of Message Handling
	
	/*************** Helper Functions *******************/
	
	// Adjust IFrame Height and Width to visualization
  Drupal.Shivanode.adjustHeightWidth = function(json) {
    // Set IFrame height and width corresponding to the visualization if it is larger
    if(typeof(json) == "string") {json = JSON.parse(json); }
    // Set IFrame height and width corresponding to the visualization if it is larger
    if(typeof(json.width) == "string" && !isNaN(json.width)) {
      vwidth = json.width * 1;
      if (vwidth > 800) {
        $('#shivaEditFrame').css('width','');
        $('#shivaEditFrame').width(vwidth + 350); // add 350 for settings table on left
      }
    }
    if(typeof(json.height) == "string" && !isNaN(json.height)) {
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
	  if(shiva_settings.status == "gettingJSON") { return; }
	  shiva_settings.status = "gettingJSON";
		Drupal.Shivanode.shivaSendMessage('shivaEditFrame','GetJSON');
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
			if(typeof(console) == 'object') {
				console.error("Error parsing JSON for put into Iframe (" + iframe + "): \n" + e);
			}
		}
		//setTimeout("Drupal.settings.shivanode.loadJS = false;", 1000);
		//Drupal.Shivanode.monitorEditFrame(true);
	};
	
	/**
	 * putDrupalJSON: takes json from node edit form and sends it to internal IFrame with SHIVA editor
	 */
	Drupal.Shivanode.putDrupalJSON = function() {
		var frm = 'shivaEditFrame';
		var json = $('textarea[id^="edit-shivanode-json"]').val();
		Drupal.Shivanode.putJSON(frm, json);
	};
	
	/* 
	 * Send given Gdoc url and title to Visualization editing frame
	 * 		for creating visualizations from data entrys
	 */
	Drupal.Shivanode.setDataSheet = function(gdoc, gtitle) {
		var dt = new Date;
		var json = '{"dataSourceUrl":"' + gdoc + '","title":"' + gtitle + '","shivaId":"0","shivaMod":"'
		   + dt.toDateString() + '"}';
		if(self == top ) {
			Drupal.Shivanode.putJSON('shivaEditFrame',json);
		} else { 
			setTimeout(function() { 
				window.parent.postMessage('RelayJSON=' + json,'*');
			}, 1000);
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
			if(shiva_settings.dataChanged == true) {
				var txt = e.srcElement.activeElement.innerText;
				if(txt.indexOf('SAVE') == -1 && txt.indexOf('UPDATE') == -1) {
					return Drupal.t("You have changed the data on this page without saving it!");
				}
			}
		};
		
		// Don't allow save unless Title is filled in
		$('button[id*="edit-submit"]').click(function(e) {
			var sntitle = $('#edit-title').val();
			if(sntitle == '') {
				alert("You must enter a title before submitting your visualization!");
				$('#edit-title').addClass('error');
				e.preventDefault();
			}
		});
	};
	// End of Helper Functions
	
}) (jQuery);