<?php

/**
 * Define all types here. 
 * 
 * Types are associative arrays which have the following field:
 * 		index: their unique index in an array because of development history these do not list type alphabetically
 * 		name:  name of the type
 * 		deprecated: (boolean)
 * 		uses_data: (boolean) whether this type uses a Google spreadsheet or similar data source
 * 		player: the player to use when displaying the chart either "shiva" or "qmedia" presently
 *  	help_url: Url to the help file
 * 		image: variable name that holds the file number for the thumb image
 * 		subtypes: an array of subtypes or FALSE if no subtypes.	See below for subtype fields
 * 		
 * Subtypes are sequential (i.e. non-associative arrays) which the following fields:
 * 		0: Label for subtype
 * 		1: Machine Name of subtype
 * 		2: Thumbnail image variable name (name of variable that contains file number for thumb image)
 * 		3: Help URL
 * 
 * Old prototypes not included are:
 * 
 *   8 => 'Control',
 *   9 => 'Canvas',
 */
function _get_sn_type_array() {
	$shivanode_types = array(
		'data' => array(
			'index' => 1,
			'name' => 'data',
			'deprecated' => TRUE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => FALSE,
			'image' => FALSE,
			'subtypes' => FALSE,
		),
		'chart' => array(
			'index' => 7,
			'name' => t('Chart'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Charts+Tool',
			'image' => 'sngen-chart-default',
			'subtypes' => array(
				1 => array(t('Annotated Timeline'), 'AnnotatedTimeLine', 'sngen-chart-antime', 'https://wiki.shanti.virginia.edu/display/KB/Create+an+Annotated+Timeline'),
			  2 => array(t('Area Chart'), 'AreaChart', 'sngen-chart-area', 'https://wiki.shanti.virginia.edu/display/KB/Create+an+Area+Chart'),
			  3 => array(t('Bar Chart'), 'BarChart', 'sngen-chart-bar', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Bar+Chart'),
			  4 => array(t('Candlestick Chart'), 'CandlestickChart', 'sngen-chart-candle', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Candlestick+Chart'),
			  5 => array(t('Column Chart'), 'ColumnChart', 'sngen-chart-column', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Column+Chart'),
			  6 => array(t('Gauge'), 'Gauge', 'sngen-chart-gauge', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Gauge'),
			  7 => array(t('Geo Chart'), 'GeoChart', 'sngen-chart-geo', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Geo+Chart'),
			  8 => array(t('Line Chart'), 'LineChart', 'sngen-chart-line', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Line+Chart'),
			  9 => array(t('Motion Chart'), 'MotionChart', 'sngen-chart-motion', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Motion+Chart'),
			  10 => array(t('Organization Chart'), 'OrgChart', 'sngen-chart-org', 'https://wiki.shanti.virginia.edu/display/KB/Create+an+Organization+Chart'),
			  11 => array(t('Pie Chart'), 'PieChart', 'sngen-chart-pie', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Pie+Chart'),
			  12 => array(t('Scatter Chart'), 'ScatterChart', 'sngen-chart-scatter', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Scatter+Chart'),
			  13 => array(t('Table'), 'Table', 'sngen-chart-table', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Table'),
			  14 => array(t('Tree Map'), 'TreeMap', 'sngen-chart-tree', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Tree+Map+Chart'),
			),
		),
		'draw' => array(
			'index' => 11,
			'name' => t('Draw'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => FALSE,
			'image' => 'sngen-draw',
			'subtypes' => FALSE,
		),
		'earth' => array(
			'index' => 12,
			'name' => t('Earth'),
			'deprecated' => TRUE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Maps+Tool+and+Earth+Tool',
			'image' => 'sngen-earth',
			'subtypes' => FALSE,
		),
		'graph' => array(
			'index' => 16,
			'name' => t('Graph'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Graph+Tool',
			'image' => 'sngen-graph',
			'subtypes' => array(
		    23 => array(t('Bubble'), 'Bubble', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Bubble+Graph'),
		    21 => array(t('Chord'), 'Chord', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Chord+Graph'),
				21 => array(t('Network'), 'Network', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Simple+Network+Graph'),
		    25 => array(t('Parallel'), 'Parallel', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Parallel+Graph'),
		    24 => array(t('Stream'), 'Stream', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Stream+Graph'),
		    22 => array(t('Tree'), 'Tree', 'sngen-graph', 'https://wiki.shanti.virginia.edu/display/KB/Create+a+Tree+Graph'),
			),
		),
		'image' => array(
			'index' => 2,
			'name' => t('Image'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/SHIVA+Images+Tool',
			'image' => 'sngen-image',
			'subtypes' => array(
				18 => array(t('Slideshow'), 'Slideshow', 'sngen-image', 'https://wiki.shanti.virginia.edu/display/KB/SHIVA+Images+Tool'),
		    19 => array(t('Image Montage'), 'Montage', 'sngen-image', 'https://wiki.shanti.virginia.edu/display/KB/SHIVA+Images+Tool'),
		    20 => array(t('Zoomable Image'), 'Zoomable', 'sngen-image', 'https://wiki.shanti.virginia.edu/display/KB/SHIVA+Images+Tool'),
			),
		),
		'map' => array(
			'index' => 3,
			'name' => t('Map'),
			'deprecated' => FALSE,
			'player' => 'shiva',
			'uses_data' => FALSE,
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Maps+Tool+and+Earth+Tool',
			'image' => 'sngen-map',
			'subtypes' => FALSE,
		),
		'multimedia' => array(
			'index' => 17,
			'name' => t('Multimedia'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'player' => 'qmedia',
			'help_url' => FALSE,
			'image' => 'sngen-qmedia',
			'subtypes' => FALSE,
		),
		'network' => array(
			'index' => 10,
			'name' => t('Network'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Network+Tool',
			'image' => 'sngen-network',
			'subtypes' => array(
				15 => array(t('Radial Graph'), 'rgraph', 'sngen-network', 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Network+Tool'),
		    16 => array(t('Forced Directed'), 'forcedir', 'sngen-network', 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Network+Tool'),
		    17 => array(t('Hyper Tree'), 'hypertree', 'sngen-network', 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Network+Tool'),
			),
		),
		'poster' => array(
			'index' => 14,
			'name' => t('Poster'),
			'deprecated' => TRUE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => FALSE,
			'image' => 'sngen-poster',
			'subtypes' => FALSE,
		),
		'subway' => array(
			'index' => 4,
			'name' => t('Subway'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Subway+Tool',
			'image' => 'sngen-subway',
			'subtypes' => FALSE,
		),
		'timeline_simile' => array(
			'index' => 5,
			'name' => t('Timeline (Simile)'),
			'deprecated' => TRUE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => FALSE,
			'image' => 'sngen-timeline',
			'subtypes' => FALSE,
		),
		'timeline' => array(
			'index' => 13,
			'name' => t('Timeline'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Timeline+Tool',
			'image' => 'sngen-timeline',
			'subtypes' => FALSE,
		),
		'video' => array(
			'index' => 6,
			'name' => t('Video'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Video+Tool',
			'image' => 'sngen-video',
			'subtypes' => FALSE,
		),
		'word_cloud' => array(
			'index' => 15,
			'name' => t('Word Cloud'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'player' => 'shiva',
			'help_url' => 'https://wiki.shanti.virginia.edu/display/KB/Use+the+Word+Cloud+Tool',
			'image' => 'sngen-wcloud',
			'subtypes' => FALSE,
		),
		/**
		'' => array(
			'index' => -1,
			'name' => t(''),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
		  'player' => 'shiva',
			'help_url' => FALSE,
			'image' => '',
			'subtypes' => FALSE,
		),
		 **/
	);
	return $shivanode_types;
}

/** Old Subtype code from shivanode.inc:
 * 
 * /*
  $options = array(
    1 => array(t('Annotated Timeline'), 'AnnotatedTimeLine'),
    2 => array(t('Area Chart'), 'AreaChart'),
    3 => array(t('Bar Chart'), 'BarChart'),
    4 => array(t('Candlestick Chart'), 'CandlestickChart'),
    5 => array(t('Column Chart'), 'ColumnChart'),
    6 => array(t('Gauge'), 'Gauge'),
    7 => array(t('Geo Chart'), 'GeoChart'),
    8 => array(t('Line Chart'), 'LineChart'),
    9 => array(t('Motion Chart'), 'MotionChart'),
    10 => array(t('Organization Chart'), 'OrgChart'),
    11 => array(t('Pie Chart'), 'PieChart'),
    12 => array(t('Scatter Chart'), 'ScatterChart'),
    13 => array(t('Table'), 'Table'),
    14 => array(t('Tree Map'), 'TreeMap'),
    15 => array(t('Radial Graph'), 'rgraph'),
    16 => array(t('Forced Directed'), 'forcedir'),
    17 => array(t('Hyper Tree'), 'hypertree'),
    18 => array(t('Slideshow'), 'Slideshow'),
    19 => array(t('Image Montage'), 'Montage'),
    20 => array(t('Zoomable Image'), 'Zoomable'),
    21 => array(t('Network'), 'Network'),
    22 => array(t('Tree'), 'Tree'),
    23 => array(t('Bubble'), 'Bubble'),
    24 => array(t('Stream'), 'Stream'),
    25 => array(t('Parallel'), 'Parallel'),
    21 => array(t('Chord'), 'Chord'),
  );
 */
 
 /**
  * Old IMage list code:
  *  $imgs = array(
    'chart' => array('label' => t('Default Chart') , 'variable' =>  'sngen-chart-default'),  
    'chart_annotatedtimeline' => array('label' => t('Annotated Timeline Chart'), 'variable' =>  'sngen-chart-antime'),
    'chart_areachart' => array('label' => t('Area Chart'), 'variable' =>  'sngen-chart-area'),
    'chart_barchart' => array('label' => t('Bar Chart'), 'variable' =>  'sngen-chart-bar'),
    'chart_candlestickchart' => array('label' =>  t('Candlestick Chart'), 'variable' =>  'sngen-chart-candle'),
    'chart_columnchart' => array('label' => t('Column Chart'), 'variable' =>  'sngen-chart-column'),
    'chart_gauge' => array('label' => t('Gauge Chart'), 'variable' =>  'sngen-chart-gauge'),
    'chart_geochart' => array('label' => t('Geo Chart'), 'variable' =>  'sngen-chart-geo'),
    'chart_linechart' => array('label' => t('Line Chart'), 'variable' =>  'sngen-chart-line'),
    'chart_motionchart' => array('label' => t('Motion Chart'), 'variable' =>  'sngen-chart-motion'),
    'chart_orgchart' => array('label' => t('Organization Chart'), 'variable' =>  'sngen-chart-org'),
    'chart_piechart' => array('label' => t('Pie Chart'), 'variable' =>  'sngen-chart-pie'),
    'chart_scatterchart' => array('label' => t('Scatter Chart'), 'variable' =>  'sngen-chart-scatter'),
    'chart_table' => array('label' => t('Table Chart'), 'variable' =>  'sngen-chart-table'),
    'chart_treemap' => array('label' => t('Tree Map Chart'), 'variable' =>  'sngen-chart-tree'),
    'draw' => array('label' => t('Draw'), 'variable' =>  'sngen-draw'),
    'earth' => array('label' => t('Earth'), 'variable' =>  'sngen-earth'),
    'graph' => array('label' => t('Graph'), 'variable' =>  'sngen-graph'),
    'image' => array('label' => t('Image') , 'variable' =>  'sngen-image'),
    'map' => array('label' => t('Map'), 'variable' =>  'sngen-map'),  
    'multimedia' => array('label' => t('Multimedia'), 'variable' =>  'sngen-qmedia'),  
    'network' => array('label' => t('Network'), 'variable' =>  'sngen-network'),
    'poster' => array('label' => t('Poster'), 'variable' =>  'sngen-poster'),  
    'subway' => array('label' => t('Subway'), 'variable' =>  'sngen-subway'),  
    'timeline' => array('label' => t('Timeline'), 'variable' =>  'sngen-timeline'),
    'video' => array('label' => t('Video'), 'variable' =>  'sngen-video'),
    'word cloud' => array('label' => t('Word Cloud'), 'variable' =>  'sngen-wcloud'),
  );
  */
  
	/**
	 * shivanode_get_types: returns a list of shivanode types according to parameters
	 * 	format:
	 * 		full = full list 
	 * 		nameindex = just names by index value
	 * 		datatypes = just names with lowercase label as index of subtypes that take data urls
	 * 		subtypes = list of subtypes by index value
	 */
	function shivanode_get_types($format='nameindex', $show_deprecated=TRUE) {
		$shivanode_types = _get_sn_type_array();
		//dpm($shivanode_types, 'types');
		$data = array();
		if($format == 'nameindex') {
			foreach($shivanode_types as $nind => $typeitem) {
				if($show_deprecated || $typeitem['deprecated'] == FALSE) {
					$data[$typeitem['index']] = $typeitem['name'];
				}
			}
		} elseif ($format == 'datatypes') {
			foreach($shivanode_types as $nind => $typeitem) {
				if($show_deprecated || $typeitem['deprecated'] == FALSE) {
					if($typeitem['uses_data']) {
						if($typeitem['subtypes']) {
							foreach($typeitem['subtypes'] as $subtype) {
								$data[$nind . '?ctype=' . $subtype[1]] = $subtype[0]; // this is different from before
							} 
						} else {
							$data[$nind] = $typeitem['name'];
						}
					}
				}
			}
			asort($data);
		} elseif ($format == 'full') {
			if(!$show_deprecated) {
				$shivanode_types = array_filter($shivanode_types, function($v) {
					return !$v['deprecated'];
				});
			}
			return $shivanode_types;
		} elseif ($format == 'subtypes') {
			foreach($shivanode_types as $nind => $typeitem) {
				if($typeitem['subtypes'] && ($show_deprecated || $typeitem['deprecated'] == FALSE)) {
					$data = $data + $typeitem['subtypes'];
				}
			}
		} else {
			$data = t('Invalid format given in shivanode_get_types (@format) in shivanode.types.inc', array(
				'@format' => $format,
			));
		}
		if(is_array($data)) {
			return $data;
		} else {
			drupal_set_message($data, 'error');
			return FALSE;
		}
	}

	/**
	 * Get the label for a type of subtype
	 */
	function _shivanode_get_type_label($tind, $isSubtype = FALSE) {
		if($isSubtype) {
			$sts = shivanode_get_types('subtypes');
			return $sts[$tind][0];
		} else {
			$tps = shivanode_get_types('nameindex');
			return $tps[$tind];
		}
	}
	
	/**
	 * Get a full list of help urls for both types and subtypes
	 * 
	 * returns an associative array of 'types' and 'subtypes' helpurls by index
	 */
	function _shivanode_get_help_urls() {
		$alltypes = shivanode_get_types('full');
		$outurls = array(
			'types' => array(),
			'subtypes' => array(),
		);
		foreach ($alltypes as $mnm => $type) {
			$outurls['types'][$type['index']] = $type['help_url'];
			if ($type['subtypes']) {
				foreach ($type['subtypes'] as $sind => $subtype) {
					if (!empty($subtype[3])) { $outurls['subtypes'][$sind] = $subtype[3]; }
	 			}
			}
		}
		return $outurls;
	}
	
	/**
	 * Get the index for a type or subtype given its name
	 */
	function _shivanode_get_type_index($typeInd, $isSubtype) {
		if($isSubtype) {
			$subtypes = shivanode_get_types('subtypes');
			foreach($subtypes as $sind => $stype) {
				if($stype[0] == $typeInd || $stype[1] == $typeInd) {
					return $sind;
				}
			}
		} else {
			$alltypes = shivanode_get_types('full');
			foreach($alltypes as $tind => $type) {
				if ($tind == $typeInd || $type['name'] == $typeInd) {
					return $type['index'];
				}
			}
		}
		return -1;
	}
	
	/**
	 * Get thumb image machine name
	 */
	function _shivanode_get_thumb_image_list() {
		$alltypes = shivanode_get_types('full');
		$outurls = array(
			'types' => array(),
			'subtypes' => array(),
		);
		foreach ($alltypes as $mnm => $type) {
			$outurls['types'][$type['index']] = $type['image'];
			if ($type['subtypes']) {
				foreach ($type['subtypes'] as $sind => $subtype) {
					if (!empty($subtype[2])) { $outurls['subtypes'][$sind] = $subtype[2]; }
	 			}
			}
		}
		return $outurls;
	}