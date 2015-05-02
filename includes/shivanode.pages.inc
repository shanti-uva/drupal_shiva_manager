<?php

/*************** Page Functions *******************************/

/**
 * Function to create a entry page for creating a visualizations, listing all registered types.
 */
function explore_vis_page() {
	module_load_include('inc', 'shivanode', 'includes/shivanode.types');
	$stypes = shivanode_get_types('full', FALSE);
	
	$page = array(
		'header' => array(
			'#markup' => t('<h3>Explore Visualization Types</h3>'),
		),
		'description' => array(
			'#markup' => t('<p>Listed below are the various types of visualizations one can make in SHIVA. Put your cursor over the image of the visualization type you are interested in and a list of choices will appear.</p>'),
		),
		'charts' => array(
			'#type' => 'fieldset',
	    '#title' => t('Charts'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => FALSE,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => '<ul>',
				'#suffix' => '</ul>',
			),
		),
		'relationships' => array(
			'#type' => 'fieldset',
	    '#title' => t('Relationships'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => TRUE,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => '<ul>',
				'#suffix' => '</ul>',
			),
		),
		'mediatypes' => array(
			'#type' => 'fieldset',
	    '#title' => t('Media'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => TRUE,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => '<ul>',
				'#suffix' => '</ul>',
			),
		),
		'maps' => array(
			'#type' => 'fieldset',
	    '#title' => t('Maps'),
	    '#collapsible' => TRUE, // Added
	    '#collapsed' => TRUE,  // Added
	    '#description' => t("this is a fieldset element"),
	    'items' => array(
				'#prefix' => '<ul>',
				'#suffix' => '</ul>',
			),
		),
	);
	
	// Fill Charts
	foreach($stypes['chart']['subtypes'] as $sind => $subtype) {
		$subtype['type'] = 'chart';
		$page['charts']['items'][] = array(
			'#markup' => shivanode_explore_thumb($sind, $subtype, TRUE),
		);
	}
	
	// Fill Relationships
	$reltypes = array('graph', 'network', 'subway', 'timeline', 'word_cloud' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['relationships']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item),
		);
	}
	
	// Fill mediatypes
	$reltypes = array('image', 'video', 'multimedia' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['mediatypes']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item),
		);
	}
	
	// Fill maps
	$reltypes = array('map' ) ;
	foreach ($reltypes as $tname) {
		$type = $stypes[$tname];
		$item = array( $type['name'], $tname, $type['image'], $type['help_url'] );
		$page['maps']['items'][] = array(
			'#markup' => shivanode_explore_thumb($type['index'], $item),
		);
	}
	
	return $page;
	/** old html from page
	<p>Listed below are the various types of visualizations one can make in SHIVA. Put your cursor over the image of the visualization type you are interested in and a list of choices will appear.</p>
<h3>Charts</h3>
<table border="0" cellpadding="4">
<tbody>
<tr>
<td>
<p><strong>Annotated Timeline</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-antime.png?itok=i-5IKyHO" alt="Annotated Timeline Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Annotated+Time+Line">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A1">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Annotated%20Time%20Line">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Area Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-area.png?itok=2Clytl69" alt="Area Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Area%2BChart%2Band%2BLine%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A2">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Area%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Bar Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-bar.png?itok=HJdCWPDH" alt="Bar Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Bar%2BChart%2Band%2BColumn%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A3">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Bar%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Candlestick Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-candle.png?itok=8GQL4J4-" alt="Candle Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Candlestick%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A4">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Candlestick%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Column Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-column.png?itok=W4PwBUWA" alt="Column Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Bar%2BChart%2Band%2BColumn%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A5">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Column%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Gauge Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-gauge.png?itok=ro1fEz64" alt="Gauge Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Gauge%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A6">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Gauge">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Geo Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-geo.png?itok=h973KHeu" alt="Geo Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Geo%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A7">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Area%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
</tr>
<tr>
<td>
<p><strong>Line Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-line.png?itok=E3ktTE04" alt="Line Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Area%2BChart%2Band%2BLine%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A8">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Line%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Motion Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-motion.png?itok=MmOwfxZy" alt="Motion Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Motion%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A9">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Motion%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Organization Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-org.png?itok=4Aye1lNU" alt="Org Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Org%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A10">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Org%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Pie Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-pie.png?itok=Qw7KdTTQ" alt="Pie Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Pie%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A11">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Pie%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Scatter Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-scatter.png?itok=pfOO4dpV" alt="Scatter Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Scatter%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A12">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Scatter%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Table Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-table.png?itok=dbw5-75S" alt="Table Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Table">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A13">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Table%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Tree Chart</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-chart-tree.png?itok=ImvCCZ7c" alt="Tree Chart Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/Tree%2BMap%2BChart">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_subtype%3A14">Examples</a></li>
<li><a href="/node/add/shivanode/chart/Tree%20Chart">Create one</a></li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h2>Relationships</h2>
<table border="0" cellpadding="4">
<tbody>
<tr>
<td width="150">
<p><strong>Graphs</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-graph.png?itok=OLMoNkIU" alt="Graph Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><!--<a href="https://wiki.shanti.virginia.edu/x/g6C1AQ" _mce_href="https://wiki.shanti.virginia.edu/x/g6C1AQ">Documentation</a>-->Documentation</li>
<li><a href="/examples?f[0]=shivanode_element_type%3A16">Examples</a></li>
<li><a href="/node/add/shivanode/graph">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td width="150">
<p><strong>Poster</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-poster.png?itok=ugp7mkyI" alt="Poster Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BPoster%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A14">Examples</a></li>
<li><a href="/node/add/shivanode/poster">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td width="150">
<p><strong>Networks</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-network.png?itok=yUFLX4jQ" alt="Network Thumbnail" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BNetworks%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A10">Examples</a></li>
<li><a href="/node/add/shivanode/network">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td width="150">
<p><strong>Subway</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-subway.png?itok=HAPuRDZ-" alt="Subway Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BSubway%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A4">Examples</a></li>
<li><a href="/node/add/shivanode/subway">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td width="150">
<p><strong>Timelines</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-timeline.png?itok=SxBYkdOZ" alt="Timeline Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BTimeline%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A13">Examples</a></li>
<li><a href="/node/add/shivanode/timeline">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Word Cloud</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-wcloud.png?itok=bAFVQSwG" alt="Word Cloud Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><!--<a href="https://wiki.shanti.virginia.edu/x/sprRAQ" _mce_href="https://wiki.shanti.virginia.edu/x/sprRAQ">Documentation</a>-->Documentation</li>
<li><a href="/examples?f[0]=shivanode_element_type%3A15">Examples</a></li>
<li><a href="/node/add/shivanode/wcloud">Create one</a></li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h2>Media</h2>
<table border="0" cellpadding="4">
<tbody>
<tr>
<td width="150">
<p><strong>Video</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-video.png?itok=ru6z7xMO" alt="Video Thumbnail" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BVideos%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A6">Examples</a></li>
<li><a href="/node/add/shivanode/video">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td width="150">
<p><strong>Images/Slideshows</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-image.png?itok=eP2L-_Wv" alt="Image Visualization" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BImages%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A2">Examples</a></li>
<li><a href="/node/add/shivanode/image">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Drawing</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-draw.png?itok=W-PNzNt4" alt="Draw Thumbnail" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BDraw%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A11">Examples</a></li>
<li><a href="/node/add/shivanode/draw">Create one</a></li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>
<h2>Maps</h2>
<table border="0" cellpadding="4" width="250" height="116">
<tbody>
<tr>
<td width="150">
<p><strong>Maps</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-map.png?itok=q9JEqZYh" alt="Map Visualization Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BMaps%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A3">Examples</a></li>
<li><a href="/node/add/shivanode/map">Create one</a></li>
</ul>
</li>
</ul>
</td>
<td>
<p><strong>Earth</strong></p>
<ul class="sf-menu explore">
<li><img src="http://shiva-staging.drupal.shanti.virginia.edu/sites/shiva-staging.drupal.shanti.virginia.edu/files/styles/shiva_teaser/public/shivanode/sngen-earth.png?itok=EKp3B0uN" alt="Earth Visualization Thumb" width="150" height="150" class="imgp_img"> 
<ul>
<li><a href="/wikidoc/SHIVA%2BEarth%2BTool">Documentation</a></li>
<li><a href="/examples?f[0]=shivanode_element_type%3A12">Examples</a></li>
<li><a href="/node/add/shivanode/map">Create one</a></li>
</ul>
</li>
</ul>
</td>
</tr>
</tbody>
</table>
	*/
}

function shivanode_explore_thumb($ind, $item, $isSubtype=FALSE) {
	$img = variable_get($item[2], FALSE);
	if($img) {
		$f = file_load($img);
		$img = image_style_url('shiva_teaser', $f->uri);
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
						<li><a href="' . $create .'">Create</a></li>
				</div> 
			</div> 
		</li>';
	return $out;
}
/**
 * Function to create a entry page for creating a visualizations, listing all registered types.
 */
function create_vis_page() {
	
}
