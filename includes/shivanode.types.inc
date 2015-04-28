<?php

/**
 * Define all types here. Old prototypes not included are:
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
			'subtypes' => FALSE,
		),
		'chart' => array(
			'index' => 7,
			'name' => t('Chart'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => array(
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
			),
		),
		'draw' => array(
			'index' => 11,
			'name' => t('Draw'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'earth' => array(
			'index' => 12,
			'name' => t('Earth'),
			'deprecated' => TRUE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'graph' => array(
			'index' => 16,
			'name' => t('Graph'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => array(
				21 => array(t('Network'), 'Network'),
		    22 => array(t('Tree'), 'Tree'),
		    23 => array(t('Bubble'), 'Bubble'),
		    24 => array(t('Stream'), 'Stream'),
		    25 => array(t('Parallel'), 'Parallel'),
		    21 => array(t('Chord'), 'Chord'),
			),
		),
		'image' => array(
			'index' => 2,
			'name' => t('Image'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => array(
				18 => array(t('Slideshow'), 'Slideshow'),
		    19 => array(t('Image Montage'), 'Montage'),
		    20 => array(t('Zoomable Image'), 'Zoomable'),
			),
		),
		'map' => array(
			'index' => 3,
			'name' => t('Map'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'multimedia' => array(
			'index' => 17,
			'name' => t('Multimedia'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'network' => array(
			'index' => 10,
			'name' => t('Network'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => array(
				15 => array(t('Radial Graph'), 'rgraph'),
		    16 => array(t('Forced Directed'), 'forcedir'),
		    17 => array(t('Hyper Tree'), 'hypertree'),
			),
		),
		'poster' => array(
			'index' => 14,
			'name' => t('Poster'),
			'deprecated' => TRUE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'subway' => array(
			'index' => 4,
			'name' => t('Subway'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'timeline_simile' => array(
			'index' => 5,
			'name' => t('Timeline (Simile)'),
			'deprecated' => TRUE,
			'uses_data' => TRUE,
			'subtypes' => FALSE,
		),
		'timeline' => array(
			'index' => 13,
			'name' => t('Timeline'),
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => FALSE,
		),
		'video' => array(
			'index' => 6,
			'name' => t('Video'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		'word_cloud' => array(
			'index' => 15,
			'name' => t('Word Cloud'),
			'deprecated' => FALSE,
			'uses_data' => FALSE,
			'subtypes' => FALSE,
		),
		/*
		'' => array(
			'index' => ,
			'name' => ,
			'deprecated' => FALSE,
			'uses_data' => TRUE,
			'subtypes' => FALSE,
		),*/
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
			$data = t('Invalid format given in shivanode_get_types (@format) in shivanode.types.inc line 167', array(
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
