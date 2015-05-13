<?php

/*************** Page Functions *******************************/

	module_load_include('inc', 'shivanode', 'includes/shivanode.types');
/**
 * Function to create a entry page for creating a visualizations, listing all registered types.
 */
function explore_vis_page($mode='explore') {
	$stypes = shivanode_get_types('full', FALSE);
	$collapsed = ($mode == 'explore') ? TRUE : FALSE;
	$page = array(
		'header' => array(
			'#markup' => t('<h3>Explore Visualization Types</h3>'),
		),
		'description' => array(
			'#markup' => t('<p>Listed below are the various types of visualizations one can make in SHIVA. Put your cursor over the image of the visualization type you are interested in and a list of choices will appear.</p>'),
		),
		'#attributes' => array(
			'class' => array('shanti-gallery'),
		),
		'charts' => array(
			'#type' => 'fieldset',
	    '#title' => t('Charts'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => FALSE,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => '<ul class="sn-explore-list">',
				'#suffix' => '</ul>',
			),
		),
		'relationships' => array(
			'#type' => 'fieldset',
	    '#title' => t('Relationships'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => $collapsed,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => "<ul class=\"sn-explore-list $mode\">",
				'#suffix' => '</ul>',
			),
		),
		'mediatypes' => array(
			'#type' => 'fieldset',
	    '#title' => t('Media'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => $collapsed,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => "<ul class=\"sn-explore-list $mode\">",
				'#suffix' => '</ul>',
			),
		),
		'maps' => array(
			'#type' => 'fieldset',
	    '#title' => t('Maps'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => $collapsed,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => "<ul class=\"sn-explore-list $mode\">",
				'#suffix' => '</ul>',
			),
		),
	);
	
	// if create mode then change headers
	if ($mode == 'create') {
		$page['header'] = array(
				'#markup' => t('<h3>Create a Visualization</h3>'),
			);
		$page['description'] = array(
				'#markup' => t('<p>Click on the type of visualization you want to create</p>'),
			);
	}
	
	// Fill Charts
	foreach($stypes['chart']['subtypes'] as $sind => $subtype) {
		$subtype['type'] = 'chart';
		$page['charts']['items'][] = array(
			'#markup' => shivanode_explore_thumb($sind, $subtype, TRUE, $mode),
		);
	}
	
	// Fill Relationships
	$reltypes = array('graph', 'network', 'subway', 'timeline', 'word_cloud' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['relationships']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item, FALSE, $mode),
		);
	}
	
	// Fill mediatypes
	$reltypes = array('image', 'video', 'multimedia' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['mediatypes']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item, FALSE, $mode),
		);
	}
	
	// Fill maps
	$reltypes = array('map' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['maps']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item, FALSE, $mode),
		);
	}
	
	return $page;
	
}
/**
 * Creates thumbnail for the explore visualization page
 * 
 * @param $ind : index of the item in the php array that defines shivanode types
 * @param $item : an sequential array of info about the item with title, machine-name, img variable name, and help link in that order
 * @param $isSubtype : whether or not this is a visualization subtype
 * 
 * @return html markup for the thubmnail wrapped in an <li> element for inclusion in a <ul class="shiva-gallery"></ul> list
 */
function shivanode_explore_thumb($ind, $item, $isSubtype=FALSE, $mode='explore') {
	$img = variable_get($item[2], FALSE); // load image file variable (contains fid for thumb image)
	if($img) {
		$f = file_load($img); // Load thumb image file
		$img = image_style_url('shiva_teaser', $f->uri); // Get image tag
	} else {
		drupal_set_message('No imgurl found for ' . $item[0], 'warning');
	}
	$facet = ($isSubtype) ? 'shivanode_subtype%3A' . $ind : 'shivanode_element_type%3A' . $ind;
	$create = ($isSubtype) ? "/node/add/shivanode/{$item['type']}/{$item[1]}" : "/node/add/shivanode/{$item[1]}";
	$out = '<li class="shanti-thumbnail visual" >
			
		  <div class="shanti-thumbnail-image shanti-field-visuals">
		   <img class="img-responsive" typeof="foaf:Image" src="' . $img . '">       
		   <span class="icon shanticon-visuals"></span>
		  </div> 
		  
		  <div class="shanti-thumbnail-info">
				<div class="body-wrap">
					<div class="title">' . $item[0] . '</div>
					<ul class="links">
						<li><a href="' . $item[3] .'" target="_blank">Documentation</a></li>
						<li><a href="/examples?f[0]=' . $facet .'">Examples</a></li>
						<li class="sn-create-link"><a href="' . $create .'">Create</a></li>
					</ul>
				</div> 
			</div> 
		</li>';
	// For create mode make a simple thumb linked to create
	if ($mode == 'create') {
			$out = '<li class="shanti-thumbnail visual" >
			<a href="' . $create .'">
		  <div class="shanti-thumbnail-image shanti-field-visuals">
		   <img class="img-responsive" typeof="foaf:Image" src="' . $img . '">       
		   <span class="icon shanticon-visuals"></span>
		  </div> 
		  
		  <div class="shanti-thumbnail-info">
				<div class="body-wrap">
					<div class="title">' . $item[0] . '</div>
				</div> 
			</div> </a>
		</li>';
	}	
	return $out;
}

/**
 * Function to create a entry page for creating a visualizations from data, listing all registered types that use data.
 * 
 * @param int $did
 * 	Integer ID value for the shivadata node to use
 */
function create_vis_page($did=FALSE) {
	if (!$did ) {drupal_goto('explore');} // if no data id is given go to explore page from which one can create any visualization

	if ($did == 'all') {
		return explore_vis_page('create');
	} else {
		$dnode = node_load($did);
		$dtitle = $dnode->title;
		$dtypes = array();
		$page = array(
			'header' => array(
				'#markup' => t('<h3>Create a Visualization from a Spreadsheet</h3>'),
			),
			'description' => array(
				'#markup' => t('<p>Choose the type of data you want to create with the "@dtitle" spreadsheet</p>', array('@dtitle' => $dtitle)),
			),
			'items' => array(
				'#prefix' => '<ul class="shanti-gallery">',
				'#suffix' => '</ul>',
			),
		);
	
		$dtypes = shivanode_get_types('datatypes', FALSE);
		foreach ($dtypes as $machine_name => $dtype) {
			$dtinfo = array( $dtype['name'], $machine_name, $dtype['image'], $dtype['help_url'] );
			if($dtype['is_subtype']) { $dtinfo['type'] = $dtype['type'];}
			$page['items'][] = array(
				'#markup' => shivanode_create_thumb($dtype['index'], $dtinfo, $dtype['is_subtype'], $did),
			);
		}
		return $page;
	}
}

/**
 * Creates thumbnail for the create visualization page
 * 
 * @param $ind : index of the item in the php array that defines shivanode types
 * @param $item : an sequential array of info about the item with title, machine-name, img variable name, and help link in that order
 * @param $isSubtype : whether or not this is a visualization subtype
 * @param mixed $did
 * 	The data id to use in creating the visualization
 * @return html markup for the thubmnail wrapped in an <li> element for inclusion in a <ul class="shiva-gallery"></ul> list
 */
function shivanode_create_thumb($ind, $item, $isSubtype=FALSE, $did=FALSE) {
	$img = variable_get($item[2], FALSE); // load image file variable (contains fid for thumb image)
	if($img) {
		$f = file_load($img); // Load thumb image file
		$img = image_style_url('shiva_teaser', $f->uri); // Get image tag
	} else {
		$img = '';
	}
	$did = ($did) ? $did . '/' : '';
	$create = ($isSubtype) ? "/node/add/shivanode/{$did}{$item['type']}/{$item[1]}" : "/node/add/shivanode/{$did}{$item[1]}";
	$out = '<li class="shanti-thumbnail visual" ><a href="' . $create .'">
			
		  <div class="shanti-thumbnail-image shanti-field-visuals">
		   <img class="img-responsive" typeof="foaf:Image" src="' . $img . '">       
		   <span class="icon shanticon-visuals"></span>
		  </div> 
		  
		  <div class="shanti-thumbnail-info">
				<div class="body-wrap">
					<div class="title">' . $item[0] . '</div>
				</div> 
			</div> 
		</a></li>';
	return $out;
}

