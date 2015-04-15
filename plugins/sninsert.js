
/**
 * Wysiwyg plugin button implementation for Shivanode Insert plugin.
 * 		Copied from the "awesome" example given the wysiwyg.api.js file
 */
(function ($) {
Drupal.wysiwyg.plugins.sninsert = {
  /**
   * Return whether the passed node belongs to this plugin.
   *
   * @param node
   *   The currently focused DOM element in the editor content.
   */
  isNode: function(node) {
    return ($(node).is('img.shivanode-sninsert'));
  },

  /**
   * Execute the button.
   *
   * @param data
   *   An object containing data about the current selection:
   *   - format: 'html' when the passed data is HTML content, 'text' when the
   *     passed data is plain-text content.
   *   - node: When 'format' is 'html', the focused DOM element in the editor.
   *   - content: The textual representation of the focused/selected editor
   *     content.
   * @param settings
   *   The plugin settings, as provided in the plugin's PHP include file.
   * @param instanceId
   *   The ID of the current editor instance.
   */
  invoke: function(data, settings, instanceId) {
    // Generate HTML markup.
    if (data.format == 'html') {
    	// When button is clicked show the popup sending the wysiwyg instace to it
    	Drupal.Shivanode.popup.show(Drupal.wysiwyg.instances[instanceId]);
    }
  },

  /**
   * Prepare all plain-text contents of this plugin with HTML representations.
   *
   * Optional; only required for "inline macro tag-processing" plugins.
   *
   * @param content
   *   The plain-text contents of a textarea.
   * @param settings
   *   The plugin settings, as provided in the plugin's PHP include file.
   * @param instanceId
   *   The ID of the current editor instance.
   */
  attach: function(content, settings, instanceId) {
    content = content.replace(/<!--Insert Shiva Node-->/g, this._getShivaNode(settings));
    return content;
  },

  /**
   * Process all HTML placeholders of this plugin with plain-text contents.
   *
   * Optional; only required for "inline macro tag-processing" plugins.
   *
   * @param content
   *   The HTML content string of the editor.
   * @param settings
   *   The plugin settings, as provided in the plugin's PHP include file.
   * @param instanceId
   *   The ID of the current editor instance.
   */
  detach: function(content, settings, instanceId) {
    var mycontent = $('<div>' + content + '</div>');
    /*
    $.each($('img.shivanode-sninsert', mycontent), function (i, elem) {
          //...
        });*/
    return mycontent.html();
  },

  /**
   * Helper function to return a HTML placeholder.
   *
   * The 'drupal-content' CSS class is required for HTML elements in the editor
   * content that shall not trigger any editor's native buttons (such as the
   * image button for this example placeholder markup).
   */
  _getShivaNode: function (settings) {
    return '<img src="' + settings.path + '/images/spacer.gif" alt="&lt;--shivanode--&gt;" title="&lt;--shivanode--&gt;" class="wysiwyg-sninsert drupal-content" />';
  }
};

/*
 * Drupal.Shivanode.popup: An object to create a popup for inserting Shivanode code into a Wysiwyg editor
 * 		NOTE: Visualization does not show in TinyMCE editor when the default "media" option is activated,
 * 					because it thinks the iframe is a videa and replaces it with a standard image, but when saved it displays.
 */
Drupal.Shivanode.popup = {
	show: function(instance) {
		Drupal.Shivanode.popup.wysiwyginstance = instance;
		var offset = $('#' + instance.field).offset().top;
		var popup = '<div id="sninsert-popup" style="display: none;"><div class="closeBtn" onclick="Drupal.Shivanode.popup.hide();"></div>';
		popup += '<p>Click on one of the titles of a Shiva element below to insert it into this page:</p>';
		popup += '<p><a href="javascript:jQuery(\'\#popellist li.other\').toggle();">Toggle Others\&rsquo; Elements</a></p><ul id="popellist"></ul></div>';
		$("body").append(popup);;
		$.getJSON(
			window.location.protocol + '//' + window.location.host + Drupal.settings.basePath + 'shivanode/list/popup',
			function(data) {
				for(var n in data) {
					var el = data[n];
					var snlink = '<a class="link" onclick="Drupal.Shivanode.popup.setElement(\'' + el.nid + '\');">' + el.title +
								 '</a> (' + el.type + ' by ' + el.uname + ')';
					var liclass = (el.owned) ? ' class="mine"':' class="other"';
					$('#sninsert-popup ul').append('<li' + liclass + '>' + snlink + '</li>');
				}
				$('#sninsert-popup').css('margin-top', offset).show();
			}
		);
	},
	 
	hide: function() {
		$('#sninsert-popup').hide();
		$('#sninsert-popup').remove();
		Drupal.Shivanode.popup.instanceId = null;
	},
	
	setElement: function(nid) {
		Drupal.Shivanode.popup.hide();
		var basepath = window.location.protocol + '//' + window.location.host + Drupal.settings.basePath;
		$.getJSON(basepath + '/api/rest/shivanode/' + nid + '.json', 
			function(data) {
				var json = JSON.parse(data.json);
				var url= Drupal.settings.shivanode.snviewer + '?m=' + window.location.protocol + '//' + window.location.host + Drupal.settings.basePath + 'data/json/' + nid;
				var pref = '';
				var fheight = (typeof(json.height) == "undefined" || json.height < 1) ? 800 : json.height;
				var fwidth = (typeof(json.width) == "undefined" || json.width < 1) ? 500 : json.width;
	
				if(!isNaN(fheight)) { fheight = parseInt(fheight) + 15; }
				if(!isNaN(fwidth)) { fwidth = parseInt(fwidth) + 15; }
				var iframe = document.createElement('iframe');
				iframe.setAttribute('src', url);
				iframe.setAttribute('frameborder','0');
				iframe.setAttribute('scrolling','no');
				iframe.setAttribute('height', fheight);
				iframe.setAttribute('width', fwidth);
				iframe.appendChild(document.createTextNode(' '));
				var content = $('<div class="snviewer"></div>').append(iframe);
				Drupal.Shivanode.popup.wysiwyginstance.insert($('<div>').append(content.clone()).html() + '<p></p>');
				Drupal.Shivanode.popup.hide();
			}
		);
	}
};

}) (jQuery);