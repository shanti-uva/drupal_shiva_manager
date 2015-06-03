<?php 

/**
 * Constants used in Shivanode Module
 *  and array of Shiva Type definitions
 */

global $base_root, $base_path;
 
 // OLD default (base) URL for Visualization Editors
define('SHIVA_ROOT', $base_root . $base_path . drupal_get_path('module','shivanode') . '/SHIVA/');

// SHIVA Home in Libraries Folder
define('SHIVA_HOME', preg_replace('/https?:/','', $base_root . $base_path . 'sites/all/libraries/SHIVA/'));

// default URL for Visualization Player
define('SHIVA_VIEWER', SHIVA_HOME . 'go.htm'); 

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

// default URL for Word Cloud Editor
define('SHIVA_WCLOUD_EDITOR', 'wordcloud.htm');

// Qmedia Home in Libraries Folder
define('QMEDIA_HOME', preg_replace('/https?:/','', $base_root . $base_path . 'sites/all/libraries/Qmedia/'));

// default URL for QMedia Player
define('SHIVA_QMEDIA_VIEWER', QMEDIA_HOME . 'show.htm'); 

// default URL for Qmedia Editor
define('SHIVA_QMEDIA_EDITOR', QMEDIA_HOME . 'edit.htm');

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

/*
 *  An Array of all Shiva Types and subtypes with relevant info for each:
 *  
 * 	Types are: 	1 = data, 2 = Image, 3 = Map, 4 = Subway, 5 = Timeline (Simile)*, 6 = Video, 7 = Chart,
 * 							8 = Control*, 9 = Canvas*, 10 = Network, 11 = Draw*, 12 = Earth, 13 = Timeline (Timeglider), 14 = Poster,*
 * 							15 = Word Cloud, 16 = Graph, 17 = Multimedia (Qmedia)
 * 
 * 		* means "deprecated"
 */
$shiva_types = array(
	2 =>  array(
		'label' => t('Images'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(
			18 => array('label' => t('Slideshow'), 'value' => 'Slideshow'),
			19 => array('label' => t('Image Montage'), 'value' => 'Montage'),
			20 => array('label' => t('Zoomable Image'), 'value' => 'Zoomable'),
		),
	),
	3 =>  array(
		'label' => t('Map'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => FALSE,
	),
	4 =>  array(
		'label' => t('Subway'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => FALSE,
	),
	5 => array(
		'label' => t('Timeline (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	6 =>  array(
		'label' => t('Video'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => FALSE,
	),
	7 => array(
		'label' => t('Chart'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(
			1 => array('label' => t('Annotated Timeline'), 'value' => 'AnnotatedTimeLine'),
			2 => array('label' => t('Area Chart'), 'value' => 'AreaChart'),
			3 => array('label' => t('Bar Chart'), 'value' => 'BarChart'),
			4 => array('label' => t('Candlestick Chart'), 'value' => 'CandlestickChart'),
			5 => array('label' => t('Column Chart'), 'value' => 'ColumnChart'),
			6 => array('label' => t('Gauge'), 'value' => 'Gauge'),
			7 => array('label' => t('Geo Chart'), 'value' => 'GeoChart'),
			8 => array('label' => t('Line Chart'), 'value' => 'LineChart'),
			9 => array('label' => t('Motion Chart'), 'value' => 'MotionChart'),
			10 => array('label' => t('Organization Chart'), 'value' => 'OrgChart'),
			11 => array('label' => t('Pie Chart'), 'value' => 'PieChart'),
			12 => array('label' => t('Scatter Chart'), 'value' => 'ScatterChart'),
			13 => array('label' => t('Table'), 'value' => 'Table'),
			14 => array('label' => t('Tree Map'), 'value' => 'TreeMap'),
		),
	),
	8 => array(
		'label' => t('Control (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	9 => array(
		'label' => t('Canvas (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	10 => array(
		'label' => t('Network'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(
			15 => array('label' => t('Radial Graph'), 'value' => 'rgraph'),
			16 => array('label' => t('Forced Directed'), 'value' => 'forcedir'),
			17 => array('label' => t('Hyper Tree'), 'value' => 'hypertree'),
		),
	),
	11 => array(
		'label' => t('Draw (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	12 => array(
		'label' => t('Eart (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	13 => array(
		'label' => t('Timeline'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(),
	),
	14 => array(
		'label' => t('Timeline (deprecated)'),
		'deprecated' => 1,
		'player' => SHIVA_VIEWER,
	),
	15 => array(
		'label' => t('Word Cloud'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(),
	),
	16 => array(
		'label' => t('Graph'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(
			21 => array('label' => t('Network'), 'value' => 'Network'),
			22 => array('label' => t('Tree'), 'value' => 'Tree'),
			23 => array('label' => t('Bubble'), 'value' => 'Bubble'),
			24 => array('label' => t('Stream'), 'value' => 'Stream'),
			25 => array('label' => t('Parallel'), 'value' => 'Parallel'),
			21 => array('label' => t('Chord'), 'value' => 'Chord'),
		),
	),
	/*
	# => array(
		'label' => t('Label'),
		'deprecated' => 0,
		'player' => SHIVA_VIEWER,
		'editor' => '',
		'helpurl' => '',
		'subtypes' => array(),
	),*/
);

