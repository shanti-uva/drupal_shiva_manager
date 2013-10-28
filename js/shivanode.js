(function($) {
	
/* shivanode.js: Javascript functions for use within shivanode Drupal Module */
	
/*
 *    Use Drupal.behaviors as $(document).ready() to call upon load.
 *      This is called after every ajax call. Hence the use of context.
 * 			May have to detect context to run some of this only when major page loads.
 */
	Drupal.behaviors.shivaEntryFormConfig = {
		attach: function (context, settings) {
			// some module is adding lots of padding to the body top. Not sure which one so just eliminating it universally
			setTimeout(function () {$('body').css('padding-top', '0px');}, 50);
			
			Drupal.Shivanode.shibstatus = null;
			
			setInterval(function () { Drupal.Shivanode.testShibAuth(); }, 120000); // Test Shibolleth Authentication every 2 mins
			
			// Initialize HTML5 messaging
			if (window.addEventListener) {
				window.addEventListener('message', Drupal.Shivanode.shivaMessageHandler, false);
			}
			else {
				window.attachEvent('message', Drupal.Shivanode.shivaMessageHandler);
			}
			
			// if it's an edit frame, enable the JS for that
			if($('iframe#shivaEditFrame').length > 0) {
			  setTimeout(function() {
			    setInterval(function() { 
		            Drupal.Shivanode.ShivaMessage('shivaEditFrame','GetJSON'); 
		        }, 500);
			  }, 10000);
				// When there's a validation error, reload the type of iframe
				if(typeof(Drupal.Shivanode.IframeSrcUrl) != 'undefined' && Drupal.Shivanode.IframeSrcUrl != null) {
					$('#shivaEditFrame').attr('src', Drupal.Shivanode.IframeSrcUrl);
					$('#iframe_container .fieldset-legend').text(Drupal.Shivanode.IframeType);
					Drupal.Shivanode.IframeSrcUrl = null;
				}
				$('iframe#shivaEditFrame').load(function() {
				  Drupal.Shivanode.ShivaMessage("shivaEditFrame", "GetType"); // once edit frame is loaded send GetType message just to register this page as parent frame
					var json = $('#edit-shivanode-json-und-0-value').val();
					//  No longer used. See line 378 or so where ShivaReady message is received
					//if(typeof(Drupal.Shivanode.loadJS) == "boolean" && Drupal.Shivanode.loadJS == true) {
						//setTimeout(function() { Drupal.Shivanode.putJSON('shivaEditFrame',json); }, 2000);
						// Drupal.Shivanode.loadJS = false;
					//}
					/*
					if(json.length > 10 ) { // if json exists it's an edit frame and load that json value into iframe'
						Drupal.Shivanode.putJSON('shivaEditFrame',json);
					} else {
						Drupal.Shivanode.ShivaMessage('shivaEditFrame','GetJSON'); // If not, it's a new frame and get the starting JSON from it 
					}*/
					if($('#iframe_container legend .form-required').length == 0) {
						$('#iframe_container legend span').append('<span title="This field is required." class="form-required">*</span>');
					}
					
					// Make Edit frame as wide as fieldset
					var pw = $('#shivaEditFrame').parent().width();
					var w = $('#shivaEditFrame').width();
					if(pw > w) {$('#shivaEditFrame').width(pw);}
					// after 3 seconds wait, start getting JSON from iframe every sec
					//setTimeout('Drupal.Shivanode.monitorEditFrame(true)',3000);
				});
				// move the required asterisk from the uneditable JSON field to the Iframe legend
				$("#shivanode_json_div label:contains('Shiva Visualization')").text('JSON Value');
				$('#shivanode-json-add-more-wrapper label span.form-required').appendTo('#iframe_container legend span');
				$("#shivanode_json_div label:contains('JSON Value'), #shivanode_json_div textarea")
					.attr('title','This field is uneditable. Use the form above to edit the visualization. Click here to refresh JSON based on form above.');
				if($('#json-hide-link').length == 0 ) {
					$("#shivanode_json_div label:contains('JSON Value')")
						.append('<span> (<a href="#" id="json-hide-link" class="toggle-link" ' +
						'onclick="Drupal.Shivanode.toggleJsonElement(); return false;" title="Hide this field">Hide</a>)</span>');			
				}
				// Add separator line of dashes before control option if not already there
				/* Uncomment this when Controls and Canvas are activated
				if($('#stypeseparator').length == 0) {
									$('#edit-shivanode-element-type-und option[value=7]')
										.after('<option id="stypeseparator" disabled="disabled">\u2014\u2014\u2014\u2014\u2014\u2014</option>'); 
								}*/
				
				// Add change listener to visualization type, when it's a data entry show add other data entries link
				$('#edit-shivanode-element-type-und').change(function() {
					var v = $('#edit-shivanode-element-type-und option[value=' + $(this).val() + ']').text();
					if(v == 'Data') {
						$('.spreadsheet-add-de-link').show();
					} else {
						$('.spreadsheet-add-de-link').hide();
					}
				});
				
				// Register last submit button clicked in window.lastButtonClicked variable to check if leaving without saving in
				//     .setWindowUnloadConfirm function
				$('input[type="submit"]').each(function() {
					$(this).click(function() { window.lastButtonClicked = $(this).attr('id'); });
				});
				
				$("input.form-text").keypress(function(e){
					if(e.which==13) {
						return false;
					}
				});
			}
			 
			/* Old code for when embed page had a drop down list (commented out 2013-04-05)
			// If it's an embed code pop-up, add change to the select
						// to relay the request for the appropriate get function and put its result in the text area
						// the object Drupal.Shivanode.node is embeded in popup window by the Drupal _shivanode_node_embed_page($nid) function
						// it contains values for nid (node id), title, json, and player.
						$('#snembedselect').change(function() {
					 var choice = $(this).val();
						  var url = Drupal.Shivanode.node.player + "?m=//" + window.location.host + Drupal.settings.basePath 
												 + 'data/json/' + Drupal.Shivanode.node.nid;
						  var jobj = JSON.parse(Drupal.Shivanode.node.json);
						  var retval = '';
					 switch (choice) {
					  case 'cf':
						retval = '{iframe:src=' + url + '|width=' + jobj.width + '|height=' + jobj.height + '}Your browser does not support iframes{iframe}';
						break;
						 case 'wp':
							 retval = "[iframe src='" + url + "']";
							 break;
						 case 'link':
							 retval = '<a href="' + url + '">' + Drupal.Shivanode.node.title + '</a>';
							 break;
						 case 'if':
							 retval = '<iframe src="' + url + '" height="' + jobj.height + '" width="' + jobj.width + '"></iframe>';
							 break;
						 case 'json':
							 retval = Drupal.Shivanode.node.json;
							 break;
						 default:
							 retval = url;				
							 break;
					 }
					 $('#sn-embedcode-area').val(retval); 
				  });*/
			
			
			// if format=simple then hide header footer and sidenavs
			var ss = window.location.search;
			if(ss.indexOf('format=simple') > -1) {
				$('html').addClass('lightpop');
				//$('#admin-menu, #header, #footer, #sidebar-first, #sidebar-second').hide()
				$('#main-wrapper').height(800);
			}
			
			// Hide Header etc. for specific shivanode pages in an Iframe
			var snpageclasses = '.shivanode_data_elements, .shivanode_google_spreadsheets'; // Classes of pages that appear in popups.
			if($(snpageclasses).length == 1 ) {
				if (self != top) {
					$('html').addClass('lightpop');
					$(snpageclasses).addClass('popup');
				}
			}
			$.each($('.snviewer iframe'), function() {
				if(!$(this).attr('src') || $(this).attr('src') == '' ) {
					window.location.reload();
				}
			});
                      
			// Make all Shiveyes Site links open in new window
			$("a:contains('Shiveyes Site')").attr('target','_blank');
			
			var srch = window.location.search;
			if(typeof(srch) == "string" && srch.indexOf('insert=') > -1) {
				$did = srch.substr(srch.indexOf('=') + 1);
				$('body *').hide();
				isnew = ($('#lightbox').length == 0) ? true : false;
				Drupal.Shivanode.setDataElement($did, isnew);
			}
			
			// Show popup is popup=dataurl is in url
			if(window.location.search.indexOf('popup=dataurl') > -1) {
			  if(Drupal.Shivanode.getShivaCookie('Drupal.Shivanode.popup') != 'done') {
			    var etyp = Drupal.Shivanode.getShivaCookie('Drupal.Shivanode.lastElementType');
			    if(etyp) {
		            $('#edit-shivanode-element-type-und').val(etyp);
		            $('#edit-shivanode-element-type-und').change();
		          }
	            $('#use-data-element-link a').click();
	  			Drupal.Shivanode.setShivaCookie('Drupal.Shivanode.popup', 'done', 1);
  			  }
		    }
		    
		    // Code to activate JQuery Tabs in the Share embed page
		    if($('#sharetabs').length > 0) {
			    $('#sharetabs div').hide();
				$('#sharetabs div:first').show();
				$('#sharetabs ul li:first').addClass('active');
				$('#sharetabs .sharethis-wrapper').show();
				$('#sharetabs ul li a').click(function(){
					$('#sharetabs ul li').removeClass('active');
					$(this).parent().addClass('active');
					var currentTab = $(this).attr('href');
					$('#sharetabs div').hide();
					$(currentTab).show();
					if($(currentTab).find('.sharethis-wrapper').length > 0) {
						$('.sharethis-wrapper').show();
					}
					return false;
				});
			}
			
		} // End of attach function
	}; // End of Drupal.behaviors.shivaEntryFormConfig
	
	// Drupal Behaviors shivaDataElementSelect: for attach js to data entry select buttions
	Drupal.behaviors.shivaDataElementSelect = {
		attach: function(context, settings) {
			$('.visualize-button').mousedown(function() {
				var $this = jQuery(this);
				var form = $this.parents('form');
				form.find('*[name=newss]').attr('value', $this.nextAll().eq(1).attr('value'));
				form.find('*[name=newsstype]').attr('value', $this.nextAll().eq(1).attr('name'));
				form.find('*[name=newsstitle]').attr('value', $this.next().attr('value'));
				//console.info(form);
			});
		}
	};
	
	// Go to shiva teaser's link (the visualization) when .info overlay is clicked
	Drupal.behaviors.shivaTeasers = {
		attach: function(context, settings) {
			$('div.shiva-teaser .info-wrapper').click(function() {
				$(this).parents('div.shiva-teaser').find('.shiva-teaser-title a').get(0).click();
				console.info('clicked');
				console.info($(this).parents('div.shiva-teaser').find('.shiva-teaser-image a'));
			});
		}
	};
	
	// Use custom Drupal.Shivanode object for functions that are called at various times.
	Drupal.Shivanode = {};
	Drupal.Shivanode.debug = { 
		send : true, 
		sendtype : 'all',
		receive : false,
		receivetype : 'all',
		trace : true
	};
	
	Drupal.Shivanode.debug = null;   // put this above the other Drupal.Shivanode.debug to enable debugging or below to disable
		
	Drupal.Shivanode.embedCallType = ''; // variable to hold embed call type during messaging between Shiva frame and popup iframe
	
	Drupal.Shivanode.latestJSON = ''; // The latest JSON received from the Shiva frame
	
	Drupal.Shivanode.frameMonitor = null; // Holds the ID for the Interval that requests JSON from the Shiva Frame
	
	//Drupal.Shivanode.GetJSONInterval = 500; // The length of the interval in millisecs querying the Shiva Frame
	
	Drupal.Shivanode.dataChanged = false;
	
	Drupal.Shivanode.dataChangedTimes = 0; // Count the number of dataChanged messages sent. Only register after 2nd time. See message handler below.
	
	Drupal.Shivanode.chartChanged = false;
	
	Drupal.Shivanode.fileItemIndex = null; // The index of the item for which a file request has been made in GetFile
	
	Drupal.Shivanode.helplinks = {
    'Annotated Time Line': 'https://wiki.shanti.virginia.edu/x/aAHLAQ',
    'Area Chart': 'https://wiki.shanti.virginia.edu/x/tgHLAQ',
    'Bar Chart': 'https://wiki.shanti.virginia.edu/x/HQLLAQ',
    'Candlestick Chart': 'https://wiki.shanti.virginia.edu/x/MgLLAQ',
    'Column Chart': 'https://wiki.shanti.virginia.edu/x/HQLLAQ',
    'Combo Chart': 'https://wiki.shanti.virginia.edu/x/WQLLAQ',
    'Gauge': 'https://wiki.shanti.virginia.edu/x/EADLAQ',
    'Geo Chart': 'https://wiki.shanti.virginia.edu/x/XALLAQ',
    'Line Chart': 'https://wiki.shanti.virginia.edu/x/tgHLAQ',
    'Motion Chart': 'https://wiki.shanti.virginia.edu/x/fgLLAQ',
    'Org Chart': 'https://wiki.shanti.virginia.edu/x/dQDAAQ',
    'Pie Chart': 'https://wiki.shanti.virginia.edu/x/ZQHLAQ',
    'Scatter Chart': 'https://wiki.shanti.virginia.edu/x/ZgDGAQ',
    'Table': 'https://wiki.shanti.virginia.edu/x/tgLLAQ',
    'Tree Map': 'https://wiki.shanti.virginia.edu/x/g6C1AQ',
    'Draw': 'https://wiki.shanti.virginia.edu/x/DaC1AQ',
    'Earth': 'https://wiki.shanti.virginia.edu/x/J5XRAQ',
    'Image': 'https://wiki.shanti.virginia.edu/x/VZ21AQ',
    'Map': 'https://wiki.shanti.virginia.edu/x/cZy1AQ',
    'Network': 'https://wiki.shanti.virginia.edu/x/o5S1AQ',
    'Subway': 'https://wiki.shanti.virginia.edu/x/Wp21AQ',
    'Timeline': 'https://wiki.shanti.virginia.edu/x/tZy1AQ',
    'Timeglider': 'https://wiki.shanti.virginia.edu/x/sprRAQ',
    'Video': 'https://wiki.shanti.virginia.edu/x/upy1AQ'
  };
	
	/*
	  shivaMessageHandler(e) : A handler for HTML 5 messages to the current frame
	  	- Handler for HTML 5 messages received
	  	- NOTE: the message putJSON= is not handled here but is handled in the Shiveyes edit frames: chart.htm, subway.htm etc.
	  				  putJSON= is sent to these edit frames from Drupal with the SHIVA visualization JSON to use
	*/
	Drupal.Shivanode.shivaMessageHandler = function(e)
	{
		/* 
		 * Handler for HTML 5 messages sent to this frame. Messages handled:
		 * 
		 * 		1. ChartChanged={chart-type} : When the visualization chart is changed
		 * 
		 * 		2. DataChanged={mode} : When data is changed on certain other pages (Replaces #1 by assigning chart-type to mode)
		 * 
		 * 		3. dataSourceUrl : Triggers the opening of a popup window for choosing a data entry
		 * 
		 * 		4. DataUrl={url of google spreadsheet& title} : Inserts the URL and title into the Shiva visualization edit form and sets preset indicator 
		 * 
		 * 		5. GetElements : Invokes a message from this frame that returns a JSON object describing all visualizations created by current user
		 * 
		 * 		6. GetGroupElements= : append either group id as number or group's node id, e.g. 6, as 'n' + number, e.g. n23, this will return 
		 * 												the group's list of visualization info to the shivaEditFrame
		 * 
		 * 		7. GetJSON={json} : The JSON returned by the shivaEdit frame after this parent makes a "GetJSON" request. Calls setDrupalJSON.
		 * 
		 * 		8. GetType={shiva group} : Get Type call from IFrame, returned when shiva frame is asked GetType. It is the shivaGroup value (e.g., chart, map, video, etc.)
		 * 
		 * 		9. GetWordPress={wpembed} : Returned from shiva frame with embed code to be sent to popup
		 * 
		 * 		10. GetWebPage={webpgembed} : Returned from shiva frame with embed code to be sent to popup
		 * 
		 * 		11. RelayJSON={json} : Relays the JSON from one popup Iframe to the editor Iframe.
		 * 
		 * 		12. RelayRequest=(type) : Relays the request GetWebPage, GetWordPress, GetJSON from lightframe popup to the shiva frame for an embed code
		 * 															Possible type values are: wp, json, web, if, link
		 * 
		 * 		13. SetEmbed=(embedcode) : Sends an embed code received from the shiva frame to the Iframe popup
		 * 
		 * 		14. SetUrl= : Allows the child IFrame to set the URL of the parent or a higher level Iframe, used by the highlight box popup iframes
		 * 
		 * 		15. SetDataElement={data element id} : when given a data entry ID, this will look up the data entry and insert its info in the present SHIVA visualization form
		 * 																					 the child iframe (i.e. the list of possible data entrys) calls SetDataElement(did) to send this message to the parent (i.e. the editing form) 
		 * 																					 and the parent calls the same function to get the data elemen through the API 
		 * 																					 and inserts the info into the form.
		 * 
		 * 		16. ShivaReady=true: Sent from editor frame and first time puts the Drupal JSON into it
		 * 
		 *    17. GetFile={File Type}={Item Index}: Message from the shiveEditFrame to get a file of File type for the item index given
		 *                                          
		 * 
		 *    18. PutFile={File Type}={Item Index}={Url} : Message from a lightbox popup to put a file of filetype with item index
		 *                                                 Sending the URL
		 * 
		 */

	  var response='';
	  
	  if(Drupal.Shivanode.debug != null && typeof(console) == 'object') {
	  	if(Drupal.Shivanode.debug.receive == true) {
	  		if(Drupal.Shivanode.debug.receivetype == 'all' || e.data.indexOf(Drupal.Shivanode.debug.receivetype) > -1) {
	  			var pref = ($("html.lightpop").length > 0 || $('#shivaEditFrame').parents('#overlay').length > 0) ? "Popup" : "Parent";
	  			console.debug(pref + " (message received): " + e.data); // for debugging messages, send to console
	  		}
	  	}
	  }
	  
	  // Determine the message and act appropriately.
		
	  // ChartChanged={chart type} : When the visualization chart is changed
	  if (e.data.indexOf('ChartChanged=') == 0) {
	    Drupal.Shivanode.setHelpLink(e.data.substr(13));
	    
	    // Special code for reloading data in Network visualizations. 
	    // If we need to do this for charts as well, then a separate function should be spawned.
	    if(e.data.search(/rgraph|forcedir|hypertree/) > -1) {
	    	jobj = JSON.parse(Drupal.Shivanode.latestJSON);
	    	jobj.chartType = e.data.substr(13);
	    	if(jQuery('#chosen_data_element_url').length > 0) {
	    		jobj.dataSourceUrl = jQuery('#chosen_data_element_url').text();
	    	}
	    	json = JSON.stringify(jobj);
	    	Drupal.Shivanode.networkJSON = json;
	    //
	    } else if($('#shivanode_data_nid').length > 0) {
				// if there is a set data node, then reinsert that data
				setTimeout("Drupal.Shivanode.insertDataElement('preset');", 1000);
			}
			
		// DataChanged={boolean} : When certain pages are changed
		// When editing data gets changed upon initialization and after sending JSON to editor
	  //  so we only need to register a change after the 2nd time this is called
		} else if (e.data.indexOf('DataChanged=') == 0) {
			var mode = e.data.substr(12);
			if (mode != "false") { // Subway, etc. send "DataChanged=true" but chart sends "DataChanged={chart type}"
				Drupal.Shivanode.dataChangedTimes++;
				if(Drupal.Shivanode.dataChangedTimes > 2) { // wait until after 2nd time
					Drupal.Shivanode.setDataChanged(mode);
				}
			}
	  // dataSourceUrl : opens a list of data entries to use to create a visualization
		} else if (e.data.indexOf('dataSourceUrl') == 0) {
			//Drupal.Shivanode.monitorEditFrame(false);
			$('#use-data-element-link a').click();  // click on hidden popup (lighbox) link
		
	  // DataUrl={url of google spreadsheet& title} : When Data URL is sent from IFrame
	  } else if (e.data.indexOf('DataUrl=')	 == 0) {
			response=e.data.substr(8);
			Drupal.Shivanode.insertDataElement(response);

		// GetElements : When IFrame requests a list of visualizations created by the User (for Canvas)
		} else if (e.data.indexOf('GetElements') == 0) {
			Drupal.Shivanode.getElementList();
			
		// GetGroupElements: Get a list of an group's visualization. Give either GID or Group's node ID, n + number
		} else if (e.data.indexOf('GetGroupElements=') == 0) {
			var gid = e.data.substr(17);
			Drupal.Shivanode.getGroupElements(gid);
					
	  // GetJSON={json} : Get JSON call from child IFrame
	  } else if (e.data.indexOf('GetJSON=') == 0) {
	  	var json = e.data.substr(8);
	  	Drupal.Shivanode.setDrupalJSON(json, e);	
	  
		// GetType= : Get Type call from IFrame, returned when shiva frame is asked GetType. It is the shivaGroup value (e.g., chart, map, video, etc.)
	  } else if (e.data.indexOf('GetType=') == 0) {
	    response=e.data.substr(8);
	    
		// GetWordPress= : Receive the response for GetWordPress and send to lightframe
		// GetWebPage= : Receive the response for GetWebPage and send to lightframe
		} else if (e.data.indexOf('GetWordPress=') == 0 || e.data.indexOf('GetWebPage=') == 0) {
			var embed = e.data.substr(e.data.indexOf('=') + 1);
			Drupal.Shivanode.doWebEmbed(embed);
					
		// RelayJSON= : Relay JSON from one Iframe (lightbox popup) to another (Shiveyes editor)
		} else if (e.data.indexOf('RelayJSON=') == 0) {
			if (Drupal.Shivanode.loadJS) { return; }
			var json = e.data.substr(10);
			Drupal.Shivanode.relayJSON(json, e);
			
		// RelayRequest={type} : Relay a Request (for an embed code) from the lightframe popup frame to the Shiva frame
		//  for special behaviors in other functions sets the embedCallType variable
		} else if (e.data.indexOf('RelayRequest=') == 0) {
			var choice = e.data.substr(13);
			Drupal.Shivanode.relayRequest(choice);
			

		// SetEmbed= : Set the textarea of the Lightbox IFrame to the Embed code value
		} else if (e.data.indexOf('SetEmbed=') == 0) {
			var embed = e.data.substr(9);
			$('#sn-embedcode-area').val(embed);
			
		// SetURL= : Set URL of parent page
		} else if (e.data.indexOf('SetUrl=') == 0) {
			var url = e.data.substr(7);
			Drupal.Shivanode.setUrl(url);
			
		// SetDataElement= : Set the data entry in the Iframe using the data entry ID.
		} else if (e.data.indexOf('SetDataElement=') == 0) {
			var did = e.data.substr(15);
			Drupal.Shivanode.setDataElement(did);
		
		// ShivaReady: Sent from editor frame and first time puts the Drupal JSON into it if editing
		} else if (e.data.indexOf('ShivaReady=') == 0) {
			if(Drupal.Shivanode.loadJS == true && typeof(Drupal.Shivanode.jsonloaded) == "undefined") {
				var json = $('#edit-shivanode-json-und-0-value').val();
				Drupal.Shivanode.putJSON('shivaEditFrame',json); 
				Drupal.Shivanode.jsonloaded = true;
		  // else if adding a new element tell it to load default data (only timeglider needs this)
			} else if (window.location.href.indexOf("add/shivanode") > -1) {
			   Drupal.Shivanode.ShivaMessage("shivaEditFrame", "LoadDefaultData");
			}
			if(typeof(Drupal.Shivanode.networkJSON) != "undefined") {
				Drupal.Shivanode.putJSON('shivaEditFrame', Drupal.Shivanode.networkJSON);
				delete Drupal.Shivanode.networkJSON;
			} 
			
		// GetKML={layerid} : Set the data entry in the Iframe using the data entries ID.
    } else if (e.data.indexOf('GetFile=') == 0) {
      Drupal.Shivanode.getFile(e.data.substr(8));

    // PutKML={layerid} : Set the data entry in the Iframe using the data entrys ID.
    } else if (e.data.indexOf('PutFile=') == 0) {
      var pts = e.data.substr(8).split("=");
      if(pts.length == 2)
        Drupal.Shivanode.putFile(pts[0],pts[1]);
        
    // ScrollLeft : scroll Iframe to left and then ease back (For Timeglider to show zoombar in edit view)
    } else if (e.data.indexOf("ScrollLeft") == 0) {
      if($('#shivaEditFrame').length == 1) {
        //  For Timeglider Scrolls left to show zoombar
        $('#shivaEditFrame').contents().find("html, body").animate({ scrollLeft: 1000 }, { duration: 'medium', easing: 'swing' });
        setTimeout(function() {
          $('#shivaEditFrame').contents().find("html, body").animate({ scrollLeft: 0 }, { duration: 'slow', easing: 'swing' });
        }, 1000);
      }
    }
		
	};

	// checkPrivacyValue(val): Checking the privacy value and not allowing any but published and draft
	Drupal.Shivanode.checkPermissionsValue = function(sval) {
		val = parseInt(sval);
		if (sval != '_none' && (isNaN(val) || (val != 1 && val != 4))) { sval = '1'; }
		$('#edit-shivanode-access-und').val(sval);
	};
	
	// Function called once JSON from Iframe have been delivered. It completes the insertion of data entry data.
	//    When done through the url with ?url=...&title=... or if url = false, then through json
	// 		Check to see if url method is used at all
	Drupal.Shivanode.doInsertDataElement = function(url, jsonparam) {
		var title = '';
		var ispreset = false;
		// Get the Data 
		var json = $('#edit-shivanode-json-und-0-value').val(); // Get JSON from Drupal json field. This is the default JSON data value
		// if url is 'preset', means reinsert the dataSource Url from the data entry associated. Get info from it
		if(url == 'preset') {
			url = $('#chosen_data_element_url').text();
			title = $('#chosen_data_element_title').text();
			ispreset = true;
		// if jsonparam is given then use that for the ul and title	
		} else if(typeof(jsonparam) == "string" && jsonparam != "") {
			var jobjSent = JSON.parse(jsonparam);
			url = jobjSent.dataSourceUrl;
			title = jobjSent.title;
		}
		// Parse JSON into object and validate data
		var jobj = JSON.parse(json); //var jobj = $.evalJSON(json);
		if(typeof(jobj.dataSourceUrl) != 'undefined') { jobj.dataSourceUrl = url; }
		if(typeof(jobj.title) != 'undefined') { jobj.title = title.replace(' (Data)',''); }
		if(typeof(jobj.shivaMod) != 'undefined') {
			var dt = new Date;
			jobj.shivaMod = dt.toDateString();
		}
		
		// When not preset (preset means the shivanode_data_nid is already set and we are reinserting the data into the entry form)
		// Then add the markup in the node create/edit form
		if (ispreset == false ) {
			$("#data_sheet_in_use").html('<input id="shivanode_data_nid" name="shivanode_data_nid" type="hidden" value="' + jobj.did + '" /> ' +
				'<strong>Data Used: </strong> <span id="chosen_data_element_title">' + ((title != "")?title:url) + '</span> ' +
				'<span id= "chosen_data_element_url" class="hidden">' + url + '</span>' +
				'<input type="button" value="Refresh Data" onclick="Drupal.Shivanode.insertDataElement(\'preset\'); return false;" ' +
            'title="Insert the Data URL from this link in the form below."  class="form-submit" /> | ' +
        '<input type="button" value="Remove Link to Data" title="Remove the association between this element and the data element that supplies its Data Source URL." ' +
            ' id="edit-remove-datanid" onclick="jQuery(\'#data_sheet_in_use\').html(\'\').hide(); return false;" class="form-submit ajax-processed" />');
			$("#data_sheet_in_use").show();
			$("#edit-title").val(title.replace(' (Data)',''));
		}

		// Reconvert JSON obj to JSON string and send to edit frame
		json = JSON.stringify(jobj); //json = $.toJSON(jobj);
		Drupal.Shivanode.putJSON('shivaEditFrame',json);
	};
	
	/*
	 * doWebEmbed(embed) : Send an embed code to the Iframe based on the "embed" choice
	 */
	Drupal.Shivanode.doWebEmbed = function(embed) {
		if(Drupal.Shivanode.embedCallType == 'iframe') {
			var jobj = JSON.parse(Drupal.Shivanode.latestJSON);
			if(typeof(jobj.height) != 'undefined' ) {
				embed = '<iframe src="' + embed + '" frameborder="0" scrolling="no" height="' + jobj.height + '" width="' + jobj.width + '"/>';
			} else {
				embed = '<iframe src="' + embed + '" frameborder="0" scrolling="no" />';
			}
		}
		if(Drupal.Shivanode.embedCallType == 'link') {
			var title = ($('#shivaEditFrame').length) ? $('#edit-title').val() : $('#page-title').text();
			embed = '<a href="' + embed + '" target="_blank">' + title + '</a>';
		}
		Drupal.Shivanode.embedCallType = '';
		Drupal.Shivanode.ShivaMessage('lightboxFrame', 'SetEmbed=' + embed);
	};
	
	Drupal.Shivanode.filterSsList = function(el) {
		var srch = $(el).val().toLowerCase();
		$.each($('li.mynode, li.othernode, #edit-newss div.form-item, #edit-gss-done li, #edit-gss-list li'), function() {
		  var mytxt = $(this).text().toLowerCase();
			if(mytxt.indexOf(srch) > -1) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
	};
	
	/*
	 * getElementList() : A function that uses the API to get a list of the users visualizations and send it to the Iframe with putElem
	 * 										Meant to be used for canvas
	 */
	Drupal.Shivanode.getELementList = function() {
		var apiurl = Drupal.settings.basePath + 'api/rest/shivanode.json?var[uid]=my';
		$.getJSON(apiurl, function(data) {
			var outobj = new Array();
			for(var n in data) {
				var item = data[n];
				var ijson = JSON.parse(item.json);
				if(typeof(ijson.title) == 'undefined') { ijson.title = item.title; }
				outobj.push(ijson);
			}
			var elements = JSON.stringify(outobj);
			Drupal.Shivanode.ShivaMessage('shivaEditFrame','PutElem=' + elements);
		});
	};
	
	/*
	 * getGroupElements(gid) : a function that uses the API to retrieve a list of visualizations associated iwth a group
	 * 													and send the json definition of that list to the Iframe.
	 */
	Drupal.Shivanode.getGroupElements = function(gid) {
		var url = Drupal.settings.basePath + 'api/rest/shivanode.json?var[gid]=';
		if(gid.indexOf('n') == 0) {
			url = url.replace('[gid]','[gnid]');
			gid = gid.substr(1);
		}
		url = url + gid;
		$.ajax({
			url: url,
			async: false,
			dataType: 'json',
			success: function(data) {
				data = JSON.stringify(data);
				Drupal.Shivanode.ShivaMessage('shivaEditFrame','GroupElements=' + data);
			}
		});
	};
	
	/* 
	 * Get JSON From iframe
	 * 		This calls the editor iframe which response with the message GetJSON={json string}
	 */
	Drupal.Shivanode.getJSON = function() {
		var frm = 'shivaEditFrame';
		Drupal.Shivanode.ShivaMessage(frm,'GetJSON');
	};	
	
	// Function called when DataURL sent from the IFrame
	//   Calls to refresh JSON data (finalize) and sets temporary IDE variable as trigger to call doInsertDataElement from setDrupalJSON
	Drupal.Shivanode.insertDataElement = function(url, jsonparam) {
		Drupal.Shivanode.IDE = {
			'url':url,
			'json':jsonparam
		};
		Drupal.Shivanode.getJSON();
	};
	
	/* 
	 * Send JSON to editor iframe
	 *    Sends the 'json' string to iframe with the given id
	 * 		This Iframe should hold a Shiveye editor page, such as chart.htm, timeline.htm, etc.
	 * 		Those pages then handle the putJSON= message, which is not handled in this JS
	 */
	Drupal.Shivanode.putJSON = function(iframe,json) {
		if(Drupal.Shivanode.debug != null && Drupal.Shivanode.debug.send != '' && typeof(console) == 'object') {
			var pref = ($("html.lightpop").length > 0 || $('#' +iframe).parents('#overlay').length > 0) ? "Popup " : "Parent ";
			if(Drupal.Shivanode.debug.trace) { console.trace(); }
		}
		if (typeof(json) == 'object') {
			json = JSON.stringify(json);
		}
		try {
			var cmd = 'PutJSON=' + json;
			Drupal.Shivanode.ShivaMessage(iframe,cmd);
		} catch(e) {
			if(typeof(console) == 'object') {
				console.error("Error parsing JSON for put into Iframe (" + iframe + "): \n" + e);
			}
		}
		setTimeout("Drupal.Shivanode.loadJS = false;", 1000);
		//Drupal.Shivanode.monitorEditFrame(true);
	};
	
	Drupal.Shivanode.registerSheet = function(el) {
		var href = $(el).attr('href');
		var ind = href.indexOf('?gdoc=');
		var gdoc = href.substring(ind + 6);
		gdoc = gdoc.replace('spreadsheets.google.com','docs.google.com/spreadsheet');
		var gtitle = $(el).text();
		$('form#addNodeInfo input#gdoc').val(gdoc);
		$('form#addNodeInfo input#gtitle').val(gtitle);
		$('form#addNodeInfo').submit();
		return false;
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
			Drupal.Shivanode.IDE= {
				url: jobj.dataSourceUrl,
				json: json
			};
			Drupal.Shivanode.setDrupalJSON(json);
		}
	};
	
	Drupal.Shivanode.relayRequest = function(choice) {
		var shivaframe = ($('#shivaEditFrame').length) ? 'shivaEditFrame' : 'shivaViewFrame';
		var req = '';
		switch (choice) {
	    	case 'wp':
	    		req = 'GetWordPress';
	    		break;
	    	case 'json':
	    		Drupal.Shivanode.embedCallType = 'json';  // Json is retrieved periodically through interval. This is detected in GetJson msg handler
	    		Drupal.Shivanode.ShivaMessage('shivaEditFrame','GetJSON');
	    		return;
	    	case 'web':
	    		req = 'GetWebPage';  // Just get a webpage URL
	    		break;
	    	case 'if':
	    		req = 'GetWebPage';
	    		Drupal.Shivanode.embedCallType = 'iframe'; // Turn webpage url into an iframe code
	    		break;
	    	case 'link':
	    		req = 'GetWebPage';
	    		Drupal.Shivanode.embedCallType = 'link'; // Turn webpage url into link
	    		break;
	    }
	    Drupal.Shivanode.ShivaMessage(shivaframe, req);
	};
	
	Drupal.Shivanode.setDataChanged = function(mode) {
		if(mode == false) {
			Drupal.Shivanode.dataChanged = false;
			Drupal.Shivanode.chartChanged = false;
			Drupal.Shivanode.setUnloadConfirm(false);
		
		} else if (typeof(mode) == "string" && typeof(Drupal.Shivanode.dataChanged) == "string" && Drupal.Shivanode.dataChanged != mode) {
			Drupal.Shivanode.chartChanged = true;
			
		} else {
			Drupal.Shivanode.dataChanged = mode;
			Drupal.Shivanode.chartChanged = false;
			Drupal.Shivanode.setUnloadConfirm(true);
		}
	};
	
	/*
	 * setDataElement(did, isnew) : set or relay the ID for a data entry linked to a visualization
	 * 					did = the data node's node id (nid)
	 * 					isnew = whether or not it is a new visualization and the add/shivanode page has not yet been called
	 * 									if this is true this function will redirect to node/add/shivanode/### which ### = the data node id to use 
	 */
	Drupal.Shivanode.setDataElement = function(did, isnew) {
	  if(self == top && window.location.search.indexOf('insert=') > -1) {
	    isnew = true;
	  }
		if(typeof(isnew) == "undefined") { isnew = false;}
		var e = this.event;
		if(self != top || $(this).parents('#lightbox').length > 0) {
			// If the Lightbox popup with list of data elems, send to parent with SetDataElement message and close popup
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
			// If parent controller, then get the data entry JSON and send to Iframe Editor with RelayJSON message
			$.ajax({
				type: "GET",
				url: Drupal.settings.basePath + 'api/rest/shivanode/' + did + '.json',
				async: false,
				success: function (data) {
					var jobj = JSON.parse(data.json);
					jobj.did = did;
					window.parent.postMessage('RelayJSON=' + JSON.stringify(jobj),'*');
				}
			});
		}
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
	  // This is called every .5 secs. If JSON is the same, then return
    if (Drupal.Shivanode.latestJSON == json) {
      return;
    }
		Drupal.Shivanode.latestJSON = json;
  	// if Drupal.Shivanode.embedCallType is set to 'json', means Lightbox Frame is requesting JSON so set it.
		if (Drupal.Shivanode.embedCallType == 'json') {
			Drupal.Shivanode.ShivaMessage('lightboxFrame', 'SetEmbed=' + json);
			Drupal.Shivanode.embedCallType = '';
		}
  	// Otherwise, it's the Shiva Manager asking for the JSON of an visualization to store
		var jobj = JSON.parse(json); 
		// Set IFrame height and width corresponding to the visualization if it is larger
		if(typeof(jobj.width) == "string" && !isNaN(jobj.width)) {
		  vwidth = jobj.width * 1
		  if (vwidth > 900) {
		    $('#shivaEditFrame').css('width','');
        $('#shivaEditFrame').width(vwidth + 350);
		  }
		}
		if(typeof(jobj.height) == "string" && !isNaN(jobj.height)) {
      vheight = jobj.height * 1
      if (vheight > 900) {
        $('#shivaEditFrame').css('height','');
        $('#shivaEditFrame').height(vheight +  150);
      }
    }
		Drupal.Shivanode.checkKMLUrls(jobj);
		var jdurl = jobj.dataSourceUrl;
		// if there's no dataSourceUrl and a data entry is linked with the present edit form, then add that info
		if(typeof(jdurl) == 'string' && jdurl == '' && $('#data_sheet_in_use').length == 1) {
			jobj.dataSourceUrl = $('#chosen_data_element_url').text();
			if(typeof(jobj.title) != 'string' || jobj.title == '') {
				jobj.title = $('#chosen_data_element_title').text();
			}
			e.source.postMessage('PutJSON=' + JSON.stringify(jobj),'*');
			return;
		}
		$('#edit-shivanode-json-und-0-value').attr('readonly', false).val(JSON.stringify(jobj)).attr('readonly', true);
		if(typeof(Drupal.Shivanode.IDE) != 'undefined' && Drupal.Shivanode.IDE != null) {
			var ide = Drupal.Shivanode.IDE;
			Drupal.Shivanode.IDE = null;
			Drupal.Shivanode.doInsertDataElement(ide.url, ide.json);
		}
	};
	
	Drupal.Shivanode.setHelpLink = function(sntype) {
	  if(sntype == 'Chart') { sntype = 'Pie Chart'; }
	  if(sntype != '' && typeof(Drupal.Shivanode.helplinks[sntype]) != 'undefined') {
      //$('#sn-helplink .charttype').text(sntype);
      $('#iframe_container legend a.sn-helplink').attr({
        'href' : Drupal.Shivanode.helplinks[sntype],
        'title' : sntype + " help"
      }).show();
    } else {
      $('#iframe_container legend a.sn-helplink').hide(); // if help URL not defined, hide the link
    }
	};
	
	Drupal.Shivanode.checkKMLUrls = function(jobj) {
		for(var o in jobj) {
			if(o.indexOf("item-") > -1) {
				var srch = jobj[o].match(/layerSource:([^;]+)/);
				if(jobj[o].indexOf('layerType:KML') > -1 && srch != null && typeof(srch[1]) != "undefined") {
					var dataurl = srch[1].replace(/`/g, ":");
					var wloc = window.location;
					var ajaxurl = Drupal.Shivanode.getModuleUrl() + 'pingurl.php';
					$.ajax({
						url: ajaxurl,
						data: 'url=' + dataurl,
						async: false,
						success: function(data) {
							var layername = o.replace("item","Layer");
							if(data=="false" && typeof(window[layername + "-alert"]) == "undefined") {
								alert(o.replace("item","Layer") + " url is invalid: \n" + dataurl);
								window[layername + "-alert"] = true;
							}
						},
						error: function(e) {
							//alert("Error testing KML layer url (" + o.replace("item","Layer") +  ")");
							if(typeof(console) == "object") { console.info(e); }
						}
					})
				}
			}
		}
	};
	
	Drupal.Shivanode.getFile = function(data) {
	  
	  var prms = data.split("=");
	  Drupal.Shivanode.fileItemIndex = prms[1];
	  switch(prms[0]) {
	    case "KML":
       $('#use-kml-link a').click();
       break;
	  }
	}
	
	Drupal.Shivanode.putFile = function(type, fileurl) {
	  // If the html element has a class "lightpop" it is the popup list, so send it to the main drupal page
	  if( $("html").hasClass('lightpop')) {
	    window.parent.postMessage('PutFile=' + type + "=" + fileurl,'*');
      window.parent.Lightbox.end();
    // Else send the message to the map.htm in the shivaeditframe 
	  } else if (Drupal.Shivanode.fileItemIndex != null) {
      Drupal.Shivanode.ShivaMessage('shivaEditFrame','PutFile=' + type +  "=" + Drupal.Shivanode.fileItemIndex + "=" + fileurl);
      Drupal.Shivanode.fileItemIndex = null;
	  }
	  return false;
	};
	
	Drupal.Shivanode.getModuleUrl = function() {
		var scripturl = '';
		$('script').each(function() {
			var src = $(this).attr('src');
			if(typeof(src) == "string" && src.indexOf('shivanode.js') > -1) {
				src = src.replace('shivanode.js','');
				var pts = src.split('js/?');
				scripturl = pts[0];
			}
		});
		return scripturl;
	};
	
	Drupal.Shivanode.setIframeSpecifics = function() {
		$('#use-data-element-link').hide(); 
		if($('#shivanode_data_nid').length > 0) {
			Drupal.Shivanode.insertDataElement('preset');
		}
	};
	
	/*
	 * setUnloadConfirm: sets the window onbeforeunload function to check if leaving the page without saving.
	 * 			In document ready function above, all input[type="submit"] are made to record their ID in 
	 * 			window.lastButtonClicked when they are clicked. This is checked and the .val() of the button
	 * 			is retreived (i.e. the button text) if this text has "save" in it anywhere, then it proceeds
	 * 			otherwise it asks user to confirm.
	 * 
	 * 			In case of overlay, if the close button is clicked, then it asks for confirmation.
	 */
	Drupal.Shivanode.setUnloadConfirm = function(ison) { 
		if(ison) {
			jQuery('#overlay-close, input[value=New]').attr('onmousedown', 
				'javascript: if(confirm(Drupal.t(\"Are you sure you want to leave without saving?\"))) {jQuery(this).click();}');
			if(window.onbeforeunload == null) {
				window.onbeforeunload = function (e) {
					var retval = Drupal.t("You have changed the data on this page without saving it.");
					var btext = "";
					if(typeof(window.lastButtonClicked) != "undefined") {
						var bid = window.lastButtonClicked;
						btext = $('#' + bid).val().toLowerCase();
						if(btext.match(/save|update|preview|delete/)) { retval = null; }
					}
					return retval;
				}
			}
		} else {
			$(window).unbind('beforeunload');
		}
	};

	Drupal.Shivanode.setUrl = function(url) {
		var hash = window.location.hash;
		if (hash.indexOf('#overlay=') > -1) {
			window.location.hash = '#overlay=' + url.substr(url.indexOf('node/'));
		} else {
			window.location.pathname = url;
		}
	};
	
	/* 
	 * Sending message to Iframe
	 */
	Drupal.Shivanode.ShivaMessage = function(iFrameName,cmd) 
	{
		if(typeof(document.getElementById(iFrameName)) == 'object' && document.getElementById(iFrameName) != null) {
			if(Drupal.Shivanode.debug != null && typeof(console) == 'object') {
				if(Drupal.Shivanode.debug.send == true) {
					if(Drupal.Shivanode.debug.sendtype == 'all' || Drupal.Shivanode.debug.sendtype.indexOf(cmd) > -1 || cmd.indexOf(Drupal.Shivanode.debug.sendtype) > -1) {
		  			console.log('Sending message "' + cmd + '" to the Iframe, ' + iFrameName); // for debugging messages, send to console
		  		}
		  		if(Drupal.Shivanode.debug.trace) { console.trace();}
		  	}
		  }
			var win=document.getElementById(iFrameName).contentWindow.postMessage(cmd,'*');
		} else if(Drupal.Shivanode.debug && typeof(console) == 'object') {
	  	console.log('There is no frame by the name of: ' + iFrame); // for debugging messages, send to console
	  }
	};
	
	/*
	 * testShibAuth: a function that tests whether Shibolleth authentication is still valid
	 */
	Drupal.Shivanode.testShibAuth = function() {
		 // if shibstatus variable is undefined, don't check, because they haven't logged in yet
		jQuery.getJSON(Drupal.settings.basePath + 'shib/auth/check', function(data) { 
			var status = data.status;
			if(Drupal.Shivanode.shibstatus == "ok" && status != "ok") {
				alert(Drupal.t("Your Netbadge session has expired!"));
				Drupal.Shivanode.shibstatus = null; // so message only appears once
			} else {
				Drupal.Shivanode.shibstatus = status;
			}
		});
	};
	
	/*
	 * toggleJsonElement : a function that hides or shows the div with the JSON data in it
	 */
	Drupal.Shivanode.toggleJsonElement = function(type) { // used to be shivanode_toggle_json_element
		if($("#shivanode_json_div label:contains('JSON Value') a.toggle-link").text() == 'Hide') {
			$("#shivanode_json_div label:contains('JSON Value')").nextAll().hide();	
			$("#shivanode_json_div label:contains('JSON Value') a.toggle-link").text('Show');
		} else {
			$("#shivanode_json_div label:contains('JSON Value')").nextAll().show();	
			$("#shivanode_json_div label:contains('JSON Value') a.toggle-link").text('Hide');
		}
	};
	
	/*
	 * goto: function to go to certain links used in views
	 */
	Drupal.Shivanode.goto = function(loc) {
		var path = Drupal.settings.basePath;
		switch(loc) {
			case 'datalist':
				path += 'node/data-elements'
				break;
			case 'shivalist':
				path += 'node/elements'
				break;
			case 'newshiva':
				path+= 'add/shivanode'
				break;
		}
		window.location.pathname = path;
	};
	
	// Generic Set Cookie function: No path or domain set, takes cookie name, value, and expiration in hours
	//     to delete a cookie set val = '' and hours to a negative number, e.g. -1
	Drupal.Shivanode.setShivaCookie = function(cname, cval, chours) {
    var now = new Date();
    now.setHours( now.getHours() + chours ); 
    document.cookie=cname + "=" +  escape(cval.trim()) + ";" + "expires=" + now.toUTCString() + ";path=/;domain=;";
	};
	
	// Generic Get cookie function by name
	Drupal.Shivanode.getShivaCookie = function(cname) {
	  var allcookies = document.cookie;
	  var re = new RegExp(cname + '=([^;]+)');
	  var mtch = allcookies.match(re);
	  if(mtch != null && mtch.length == 2) {
	    return mtch[1];
	  } else {
	    return false;
	  }
	};
	
	Drupal.Shivanode.dataSheetEdit = function() {
	  if($.browser.msie) {
	    var href = jQuery('#datasheeturl').attr('href');
	    window.open(href);
	  } else {
	    jQuery('#datasheeturl').click();
	  }
	};
	
	Drupal.Shivanode.hideViewDuringPopups = function() {
	  jQuery('#shivaViewFrame, #shivaEditFrame').hide(); 
	  Drupal.Shivanode.sntempint = setInterval(function() {
	    if(!jQuery('#lightbox').is(':visible')) { 
	      jQuery('#shivaViewFrame, #shivaEditFrame').show(); 
	      clearInterval(Drupal.Shivanode.sntempint);
	    }
	  }, 500);
	}
}) (jQuery);
