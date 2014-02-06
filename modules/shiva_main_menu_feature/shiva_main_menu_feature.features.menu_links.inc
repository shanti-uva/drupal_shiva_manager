<?php
/**
 * @file
 * shiva_main_menu_feature.features.menu_links.inc
 */

/**
 * Implements hook_menu_default_menu_links().
 */
function shiva_main_menu_feature_menu_default_menu_links() {
  $menu_links = array();

  // Exported menu link: main-menu:<front>
  $menu_links['main-menu:<front>'] = array(
    'menu_name' => 'main-menu',
    'link_path' => '<front>',
    'router_path' => '',
    'link_title' => 'Home',
    'options' => array(),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 1,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -50,
  );
  // Exported menu link: main-menu:contact
  $menu_links['main-menu:contact'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'contact',
    'router_path' => 'contact',
    'link_title' => 'Contact Us',
    'options' => array(
      'attributes' => array(
        'title' => 'Send feedback to the SHIVA team',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -43,
  );
  // Exported menu link: main-menu:explore
  $menu_links['main-menu:explore'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'explore',
    'router_path' => 'explore',
    'link_title' => 'Explore',
    'options' => array(),
    'module' => 'system',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
  );
  // Exported menu link: main-menu:groups
  $menu_links['main-menu:groups'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'groups',
    'router_path' => 'groups',
    'link_title' => 'Groups',
    'options' => array(),
    'module' => 'system',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -44,
  );
  // Exported menu link: main-menu:mydata
  $menu_links['main-menu:mydata'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'mydata',
    'router_path' => 'mydata',
    'link_title' => 'Data',
    'options' => array(
      'attributes' => array(
        'title' => 'List of available spreadsheets to use as data for visualizations',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -46,
  );
  // Exported menu link: main-menu:node/add/shivanode
  $menu_links['main-menu:node/add/shivanode'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Create Visualization',
    'options' => array(
      'attributes' => array(
        'title' => 'This is a custom content type for storing, editing, and displaying a Shanti Interactive Visualization.',
      ),
    ),
    'module' => 'system',
    'hidden' => 1,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -40,
  );
  // Exported menu link: main-menu:node/add/shivanode/chart
  $menu_links['main-menu:node/add/shivanode/chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 1,
    'expanded' => 0,
    'weight' => -50,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Annotated Time Line
  $menu_links['main-menu:node/add/shivanode/chart/Annotated Time Line'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Annotated Time Line',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Annotated Time Line',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -50,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Area Chart
  $menu_links['main-menu:node/add/shivanode/chart/Area Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Area Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Area Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Bar Chart
  $menu_links['main-menu:node/add/shivanode/chart/Bar Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Bar Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Bar Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -48,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Candlestick Chart
  $menu_links['main-menu:node/add/shivanode/chart/Candlestick Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Candlestick Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Candlestick Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -47,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Column Chart
  $menu_links['main-menu:node/add/shivanode/chart/Column Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Column Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Column Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -46,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Geo Chart
  $menu_links['main-menu:node/add/shivanode/chart/Geo Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Geo Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Geo Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -45,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Line Chart
  $menu_links['main-menu:node/add/shivanode/chart/Line Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Line Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Line Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -43,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Motion Chart
  $menu_links['main-menu:node/add/shivanode/chart/Motion Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Motion Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Motion Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -42,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Org Chart
  $menu_links['main-menu:node/add/shivanode/chart/Org Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Org Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Organizational Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -41,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Pie Chart
  $menu_links['main-menu:node/add/shivanode/chart/Pie Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Pie Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Pie Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -40,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Scatter Chart
  $menu_links['main-menu:node/add/shivanode/chart/Scatter Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Scatter Chart',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Scatter Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -39,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Table
  $menu_links['main-menu:node/add/shivanode/chart/Table'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Table',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Table',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -38,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/Tree Map
  $menu_links['main-menu:node/add/shivanode/chart/Tree Map'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/Tree Map',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Tree Map',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -37,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/chart/guage
  $menu_links['main-menu:node/add/shivanode/chart/guage'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/chart/guage',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Gauge Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -44,
    'parent_path' => 'node/add/shivanode/chart',
  );
  // Exported menu link: main-menu:node/add/shivanode/draw
  $menu_links['main-menu:node/add/shivanode/draw'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/draw',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Drawing',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/earth
  $menu_links['main-menu:node/add/shivanode/earth'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/earth',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Earth Tour',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -48,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/image
  $menu_links['main-menu:node/add/shivanode/image'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/image',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Slideshow',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -44,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/map
  $menu_links['main-menu:node/add/shivanode/map'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/map',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Map',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -47,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/network
  $menu_links['main-menu:node/add/shivanode/network'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/network',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Network',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -46,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/poster
  $menu_links['main-menu:node/add/shivanode/poster'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/poster',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Poster',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -45,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/subway
  $menu_links['main-menu:node/add/shivanode/subway'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/subway',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Subway',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -43,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/timeline
  $menu_links['main-menu:node/add/shivanode/timeline'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/timeline',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Timeline',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -42,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/video
  $menu_links['main-menu:node/add/shivanode/video'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/video',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Video',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -41,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:node/add/shivanode/wcloud
  $menu_links['main-menu:node/add/shivanode/wcloud'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'node/add/shivanode/wcloud',
    'router_path' => 'node/add/shivanode',
    'link_title' => 'Word Cloud',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -40,
    'parent_path' => 'node/add/shivanode',
  );
  // Exported menu link: main-menu:visualizations
  $menu_links['main-menu:visualizations'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'visualizations',
    'router_path' => 'visualizations',
    'link_title' => 'Visualizations',
    'options' => array(
      'attributes' => array(
        'title' => 'A list of all public visualizations',
      ),
    ),
    'module' => 'menu',
    'hidden' => 1,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -48,
  );
  // Exported menu link: main-menu:wikidoc/Annotated+Time+Line
  $menu_links['main-menu:wikidoc/Annotated+Time+Line'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Annotated+Time+Line',
    'router_path' => 'wikidoc',
    'link_title' => 'Annotated Time Line',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -50,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Area+Chart+and+Line+Chart
  $menu_links['main-menu:wikidoc/Area+Chart+and+Line+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Area+Chart+and+Line+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Area Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Bar+Chart+and+Column+Chart
  $menu_links['main-menu:wikidoc/Bar+Chart+and+Column+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Bar+Chart+and+Column+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Bar Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -48,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Candlestick+Chart
  $menu_links['main-menu:wikidoc/Candlestick+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Candlestick+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Candlestick Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -47,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Gauge+Tool
  $menu_links['main-menu:wikidoc/Gauge+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Gauge+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Gauge',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -45,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Geo+Chart
  $menu_links['main-menu:wikidoc/Geo+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Geo+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Geo Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -44,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Motion+Chart
  $menu_links['main-menu:wikidoc/Motion+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Motion+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Motion Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Org+Chart
  $menu_links['main-menu:wikidoc/Org+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Org+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Organizational Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Pie+Chart
  $menu_links['main-menu:wikidoc/Pie+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Pie+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Pie Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA
  $menu_links['main-menu:wikidoc/SHIVA'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA',
    'router_path' => 'wikidoc',
    'link_title' => 'Help',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 1,
    'expanded' => 0,
    'weight' => -45,
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Charts+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Charts+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Charts+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Chart Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 1,
    'expanded' => 0,
    'weight' => -48,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Draw+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Draw+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Draw+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Draw Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -47,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Earth+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Earth+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Earth+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Earth Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -46,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+FAQs
  $menu_links['main-menu:wikidoc/SHIVA+FAQs'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+FAQs',
    'router_path' => 'wikidoc',
    'link_title' => 'FAQ',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -49,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Images+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Images+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Images+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Image Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -45,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Maps+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Maps+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Maps+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Map Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -44,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Networks+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Networks+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Networks+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Network Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -43,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Subway+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Subway+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Subway+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Subway Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -42,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Timeline+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Timeline+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Timeline+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Timeline Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -41,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/SHIVA+Videos+Tool
  $menu_links['main-menu:wikidoc/SHIVA+Videos+Tool'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/SHIVA+Videos+Tool',
    'router_path' => 'wikidoc',
    'link_title' => 'Video Tool',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => -40,
    'parent_path' => 'wikidoc/SHIVA',
  );
  // Exported menu link: main-menu:wikidoc/Scatter+Chart
  $menu_links['main-menu:wikidoc/Scatter+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Scatter+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Scatter Chart',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Table
  $menu_links['main-menu:wikidoc/Table'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Table',
    'router_path' => 'wikidoc',
    'link_title' => 'Table',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Exported menu link: main-menu:wikidoc/Tree+Map+Chart
  $menu_links['main-menu:wikidoc/Tree+Map+Chart'] = array(
    'menu_name' => 'main-menu',
    'link_path' => 'wikidoc/Tree+Map+Chart',
    'router_path' => 'wikidoc',
    'link_title' => 'Tree Map',
    'options' => array(
      'attributes' => array(
        'title' => '',
      ),
    ),
    'module' => 'menu',
    'hidden' => 0,
    'external' => 0,
    'has_children' => 0,
    'expanded' => 0,
    'weight' => 0,
    'parent_path' => 'wikidoc/SHIVA+Charts+Tool',
  );
  // Translatables
  // Included for use with string extractors like potx.
  t('Annotated Time Line');
  t('Area Chart');
  t('Bar Chart');
  t('Candlestick Chart');
  t('Chart');
  t('Chart Tool');
  t('Column Chart');
  t('Contact Us');
  t('Create Visualization');
  t('Data');
  t('Draw Tool');
  t('Drawing');
  t('Earth Tool');
  t('Earth Tour');
  t('Explore');
  t('FAQ');
  t('Gauge');
  t('Gauge Chart');
  t('Geo Chart');
  t('Groups');
  t('Help');
  t('Home');
  t('Image Tool');
  t('Line Chart');
  t('Map');
  t('Map Tool');
  t('Motion Chart');
  t('Network');
  t('Network Tool');
  t('Organizational Chart');
  t('Pie Chart');
  t('Poster');
  t('Scatter Chart');
  t('Slideshow');
  t('Subway');
  t('Subway Tool');
  t('Table');
  t('Timeline');
  t('Timeline Tool');
  t('Tree Map');
  t('Video');
  t('Video Tool');
  t('Visualizations');
  t('Word Cloud');


  return $menu_links;
}
