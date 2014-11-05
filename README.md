README for Shanti Shivanode Module

	The Shiva Node module allows for the creation and management of SHIVA visualizations within a Drupal website.
	
	The central module creates a "shivanode" content-type for SHIVA visualizations.
	
	The directories of the shivanode module folder are:
	   - css: for css stylesheets
	   - images: for various images used in the site
	   - js: contains the javascript for the module and html messaging as well as jQuery plugins used by the module.
	   - plugins: this contains the php/js/css code for the TinyMCE editor plugin
	   - modules: this contains a series of submodules for the following purposes:
	     - extdocs: a sub-module for including external wiki help docs within the sites pages
	     - shiva_explore_page_feature: sets up a custom explore page of visualization types
	     - shiva_main_menu_feature: custom links for exploring and creating visualizations (buggy)
	     - shiva_views_feature: imports gallery views of visualizations
	     - shivakml: a sub-module that allows kml files to be uploaded for use with map-types
	   - SHIVA: This contains the code by Bill Ferster for creating visualizations. Also found at http://viseyes.org/shiva/
	   - templates: contains drupal theme templates for certain types of pages such as type=simple.
	   
	Other files to note are:
	   - pingurl.php: this file is called as a URI by the javascript to test KML url that users enter for map shiva nodes
	   
	NOTE: For clarity's sake this repos has been named "drupal_shiva_manager" but in order to work within Drupal the module folder
        must have the name "shivanode". Therefore, when cloning the repo in your drupal instance append "shivanode" as the name
        of the destination folder after your clone statement. E.g.:
        
             sudo git clone https://github.com/shanti-uva/drupal_shiva_manager.git shivanode
             
  API Calls:
  	* /api/json/{nid} : returns an json string for the complete Drupal node
  	* /data/json/{nid}: returns the json object created by Bill's Shiva JS module
  	* /api/ajax/{nid} : returns an html fragment displaying the node for use with ajax.
  	* /kmaps/json/subjects/{kid} : returns a json list of nodes tagged with that subject id
  	* /kmaps/json/places/{kid} : returns a list of nodes tagged with that place id
  	
             
# VERSIONS

## 7.x-1.5-beta1 (April 1, 2014)

* Switched to using Gdrive module authentication (OAuth 2.0) instead of Zend.

October 22, 2012 (Updated, April 1, 2014)

Than Grove
