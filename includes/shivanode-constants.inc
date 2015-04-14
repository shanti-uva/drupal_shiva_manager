<?php 

/**
 * Constants used in Shivanode Module
 */

global $base_root, $base_path;
 
 // default (base) URL for Visualization Editors
 // Definitive site is: http://shiva.shanti.virginia.edu/go.htm
define('SHIVA_ROOT', $base_root . $base_path . drupal_get_path('module','shivanode') . '/SHIVA/');

// default URL for Visualization Player
define('SHIVA_VIEWER', SHIVA_ROOT . 'go.htm'); 

// default URL for Chart Editor
define('SHIVA_CHART_EDITOR', 'chart.htm');

// default URL for Data Editor
define('SHIVA_DATA_EDITOR', 'data.htm');

// default URL for Draw Editor
define('SHIVA_DRAW_EDITOR', 'draw.htm');

// default URL for Earth Editor
define('SHIVA_EARTH_EDITOR', 'earth.htm');

// default URL for GRAPH Editor
define('SHIVA_GRAPH_EDITOR', 'graph.htm');

// default URL for Image Editor
define('SHIVA_IMAGE_EDITOR', 'image.htm');

// default URL for Map Editor
define('SHIVA_MAP_EDITOR', 'map.htm');

// default URL for Network Editor
define('SHIVA_NETWORK_EDITOR', 'network.htm');

// default URL for Poster Editor
define('SHIVA_POSTER_EDITOR', 'poster.htm');

// default URL for Subway Editor
define('SHIVA_SUBWAY_EDITOR', 'subway.htm');

// default URL for Timeline Editor
define('SHIVA_TIMELINE_EDITOR', 'timeline.htm');

// default URL for Timeline Editor
define('SHIVA_TIMEGLIDER_EDITOR', 'timeglider.htm');

// default URL for Video Editor
define('SHIVA_VIDEO_EDITOR', 'video.htm');

// default URL for Control Editor
define('SHIVA_CONTROL_EDITOR', 'control.htm');

// default URL for Canvas Editor
define('SHIVA_CANVAS_EDITOR', 'canvas.htm');

// default URL for Canvas Editor
define('SHIVA_QMEDIA_EDITOR', 'QMEDIA/edit.htm');

// default URL for Word Cloud Editor
define('SHIVA_WCLOUD_EDITOR', 'wordcloud.htm');

// default Iframe Height for Full Display of Shiva visualization
define('SHIVA_IFRAME_HEIGHT', 800);

// default Iframe Width for Full Display of Shiva visualization
define('SHIVA_IFRAME_WIDTH', 925);

// default value for ability for visualization height/width to override default Iframe height/width
define('SHIVA_DEFAULT_OVERRIDE', FALSE);

// default height value for edit IFrame
define('SHIVA_IFRAME_HEIGHT_EDIT', 1000);

// default width value for edit IFrame
define('SHIVA_IFRAME_WIDTH_EDIT', 1150);

// default Iframe Height for Teaser Display of Shiva visualization
define('SHIVA_IFRAME_HEIGHT_TEASER', 300);

// default Iframe Width for Teaser Display of Shiva visualization
define('SHIVA_IFRAME_WIDTH_TEASER', 400);

// default Minimum Height/Width
define('SHIVA_IFRAME_DIMENSION_MINIMUM', 50);

// default Maximum Height/Width
define('SHIVA_IFRAME_DIMENSION_MAXIMUM', 5000);

// Number of Recent SHIVA visualizations to Show in Recent Shivanode Block
define('SHIVA_RECENT_ENTRIES', 5);

// Whether to show JSON in Edit Form  
define('SHIVA_SHOW_JSON', FALSE);

// Default thumbnail field
define('SHIVA_DEFAULT_IMAGE_FIELD', NULL); 

// Data-based Visualizations
define('SHIVA_DATA_VISUALIZATIONS', 'Chart|Graph|Image|Network|Timeline');