<?php
/**
 * @file
 * An include files with functions specific to the SHIVA Visualization Manager.
 */

/**
 * Returns a structured array defining the fields created by this content type.
 *
 * This is factored into this function so it can be used in both
 * node_example_install() and node_example_uninstall().
 * 
 * @return
 *  An associative array specifying the fields we wish to add to our
 *  new node type.
 */
 
function _shivanode_installed_fields() {
  $t = get_t();
  return array(
    'shivanode_element_type' => array(
      'field_name'  => 'shivanode_element_type',
      'type' => 'list_integer',
      'cardinality' => '1',
      'foreign keys' => array(),
      'indexes' => array(
        'value' => array(
          0 => 'value',
        ),
      ),
      'module' => 'list',
      'settings' => array(
        'allowed_values_function' => '_shivanode_element_typelist',
      ),
    ),
    'shivanode_subtype' => array(
      'field_name'  => 'shivanode_subtype',
      'type' => 'list_integer',
      'cardinality' => '1',
      'foreign keys' => array(),
      'indexes' => array(
        'value' => array(
          0 => 'value',
        ),
      ),
      'module' => 'list',
      'settings' => array(
        'allowed_values_function' => '_shivanode_subtypelist',
      ),
    ),
    'shivanode_access' => array(
      'field_name'  => 'shivanode_access',
      'type' => 'list_integer',
      'cardinality' => '1',
      'foreign keys' => array(),
      'indexes' => array(
        'value' => array(
          0 => 'value',
        ),
      ),
      'module' => 'list',
      'settings' => array(
        'allowed_values_function' => '_shivanode_access_modes',
      ),
    ),
    'shivanode_json' => array(
      'field_name' => 'shivanode_json',
      'type'        => 'text_long',
    ),
    'shivanode_description' => array(
      'field_name' => 'shivanode_description',
      'type' => 'text_with_summary',
    ),
    'shivanode_tags' => array(
      'field_name' => 'shivanode_tags',
      'type' => 'taxonomy_term_reference',
      'module' => 'taxonomy',
      'cardinality' => FIELD_CARDINALITY_UNLIMITED,
      'settings' => array(
        'allowed_values' => array(
          array(
            'vocabulary' => 'tags',
            'parent' => '0',
          ),
        ),
      ),
    ),
  );
}

/**
 * Returns a structured array defining the instances for this content type.
 *
 * The instance lets Drupal know which widget to use to allow the user to enter
 * data and how to react in different view modes.  We are going to display a
 * page that uses a custom "node_example_list" view mode.  We will set a
 * cardinality of three allowing our content type to give the user three color
 * fields.
 *
 * This is factored into this function so it can be used in both
 * node_example_install() and node_example_uninstall().
 *
 * @return
 *  An associative array specifying the instances we wish to add to our new
 *  node type.
 */
function _shivanode_installed_instances() {
  $t = get_t();
  return array(
    'shivanode_element_type' => array(
      'field_name'  => 'shivanode_element_type',
      'label'  => $t('Visualization Type'),
      'required' => 1,
      'display' => array(
        'default' => array(
          'label' => 'above',
          'module' => 'list',
          'settings' => array(
            'default_value' => 7,
          ),
          'type' => 'list_default',
          'weight' => 10,
        ),
      ),
      'settings' => array(
        'user_register_form' => FALSE,
        'default_value' => 6,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'options',
        'type' => 'options_select',
        'settings' => array(
          'default_value' => 7,
        ),
        'weight' => 10,
      ),
    ),
    'shivanode_subtype' => array(
      'field_name'  => 'shivanode_subtype',
      'label'  => $t('Visualization Subtype'),
      'required' => 0,
      'display' => array(
        'default' => array(
          'label' => 'hidden',
          'module' => 'list',
          'type' => 'list_default',
        ),
      ),
      'settings' => array(
        'user_register_form' => FALSE,
        'default_value' => 1,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'options',
        'type' => 'options_select',
      ),
    ),
    'shivanode_access' => array(
      'field_name'  => 'shivanode_access',
      'label'  => $t('Status'),
      'required' => 1,
      'display' => array(
        'default' => array(
          'label' => 'above',
          'module' => 'list',
          'settings' => array(
            'default_value' => 1,
           ),
          'type' => 'list_default',
          'weight' => 15,
        ),
      ),
      'settings' => array(
        'user_register_form' => FALSE,
        'default_value' => 1,
      ),
      'widget' => array(
        'active' => 1,
        'module' => 'options',
        'type' => 'options_select',
        'settings' => array(
          'default_value' => 1,
        ),
        'weight' => 15,
      ),
    ),
    'shivanode_json' => array(
      'field_name' => 'shivanode_json',
      'label'       => $t('Shiva Visualization'),
      'required' => 1,
      'display' => array(
        'default' => array(
          'module' => 'shivanode',
          'type' => 'shiva_visualizer',
          'settings' => array(
            'height' => SHIVA_IFRAME_HEIGHT,
            'width' => SHIVA_IFRAME_WIDTH,
            'context' => 'default',
          ),
          'weight' => 15,
        ),
        'teaser' => array(
          'module' => 'shivanode',
          'type' => 'shiva_visualizer',
          'settings' => array(
            'height' => SHIVA_IFRAME_HEIGHT_TEASER,
            'width' => SHIVA_IFRAME_WIDTH_TEASER,
            'context' => 'teaser',
          ),
          'weight' => 15,
        ),
      ),
      'widget'  => array(
        'type'   => 'text_textarea',
        'settings' => array(
          'rows' => 10,
        ),
        'weight' => 25,
      ),
    ),
    'shivanode_description' => array(
      'field_name' => 'shivanode_description',
      'label'       => $t('Description'),
      'module' => 'text',
      'required' => 0,
      'widget'      => array(
        'type'    => 'text_textarea_with_summary',
        'weight' => 35,
      ),
    ),
    'shivanode_tags' => array(
      'field_name' => 'shivanode_tags',
      'label'       => $t('Tags'),
      'module' => 'taxonomy',
      'widget'  => array(
        'type'   => 'taxonomy_autocomplete',
        'weight' => 40,
      ),
      'behaviors' => array(
        'multiple values' => FIELD_BEHAVIOR_CUSTOM,
      ),
    ),
  );
}

/**
 * Returns a structured array defining the values for the chart type list
 *
 * @return
 *  An associative array specifying the values we wish to add for the chart type.
 *  
 */
function _shivanode_element_typelist($byName = FALSE) {
  $options = array(
    7 => t('Chart'),
    1 => t('Data'),
    11 => t('Draw'),
    12 => t('Earth'),
    16 => t('Graph'),
    2 => t('Image'),
    3 => t('Map'),
    10 => t('Network'),
    14 => t('Poster'),
    4 => t('Subway'),
    5 => t('Timeline (Deprecated)'),
    13 => t('Timeline'),
    6 => t('Video'),
    15 => t('Word Cloud'),
    /*
    8 => 'Control',
    9 => 'Canvas',
    */
  );
  if($byName === TRUE) {
    $options = array_flip($options); // What about when localized in a different language? Will this still work?
  }
  return $options;
}

/** 
 * Returns list of subtypes for all visualization. Initial array each item has a label (1) and then it's json value (2)
 * A call without parameters returns an array of labels, _shivanode_subtypelist('json') returns an array of json values, and
 * _shivanode_subtypelist('index', 'rgraph') will return the index for the second item. Search value can be either label or json val.
 */
function _shivanode_subtypelist($type='label', $search=FALSE) {
  $types = array('label', 'json', 'index');
  $typeval = array_search($type, $types);
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
  if($type == 'index') {
    if(!$search) { return FALSE; } // If no search string, no match
    foreach($options as $key => $value) {
      if($value[0] == $search || $value[1] == $search) {
        return $key;
      }
    }
    return FALSE;  // no match
  } else {
    foreach($options as $key => &$value) {
      $value = $value[$typeval];
    }
    return $options; // return "filtered" options
  }
}

/**
 * Implements hook_options_list for the options widget of the visualization type field
 * Returns a structured array defining the values for the chart type list
 *
 * @return
 *  An associative array specifying the values we wish to add for the chart type.
 *  
 */
function _shivanode_options_list($option = NULL) {
  $options = array(
    t('Visualizations') => _shivanode_element_typelist(),  
  );
  if (isset($option)) {
    if (!is_numeric($option)) {
      return "The option index, $option, is not a numeric.";
    }
    $subtype = ($option != 8 && $option != 9) ? t('Visualizations'):t('Other');
    return $options[$subtype][$option];
  }
  else {
    return $options;
  }
}

/**
 * _shivanode_login: Function called by shivanode_menu that directs page either to shibboleth login url
 *                   or if that is not enabled then to the regular user login page
 *                   This menu url is called by the login link that is added to the main menu through
 *                   shantizen_preprocess_page function in the theme's template.php
 */
function _shivanode_login() {
  if(is_auth_user()) { return; }
  if (module_exists('shib_auth')) {
    drupal_goto(shib_auth_generate_login_url()); // Go to the shibboleth login url
  } else {
    drupal_goto('user');
  }
}

/**
 * Returns a structured array defining the values for the privileges 
 *
 * @return
 *  An associative array specifying the values we wish to add for the chart type.
 *  
 */
function _shivanode_access_modes() {
  $options = array(
    1 => t('Draft'),
    //2 => 'Group',
    //3 => 'University',
    4 => t('Published'),
  );
  return $options;
}

/**
 * Helper function that gets all Shiva nodes most recent first
 *  options can either be a space separated list of options or a element type number. Options include:
 *    stype:\d+ (the number after the colon will be the element type number and will show only elements of this type)
 *    nodata (will exclude data elements)
 *    recent (will give most recent elements first)
 *    mine (will return only current users nodes. This will override the following.) 
 *    user => uid (will return for a specific uid)
 * 
 *  If options is just a numeric it will return only elements of that type
 * 
 *  Common Options strings:
 *    'sntype:1 mine' : Returns user's data elements
 */

function _get_shivanodes($options = array()) {
  global $user;
  if(is_string($options)) {
    $options = explode(' ', $options); 
    $options = array_flip($options);
    foreach($options as $key => $value ) {
      if(preg_match('/stype\:(\d+)/', $key, $matches)) {
        $options['stype'] = $matches[1];
        break;
      }
    }
  }
  if(is_numeric($options)) { $options = array('stype' => $options); }
  $stype = (array_key_exists('stype', $options)) ? $options['stype'] : 0;
  $uid = $user->uid;
  $query = db_select('node', 'n');
  $query->join('field_data_shivanode_element_type', 'stype', 'n.nid = stype.entity_id');
  $query->join('field_data_shivanode_access', 'sac', 'n.nid = sac.entity_id');
  $query->join('field_data_shivanode_json', 'sjson', 'n.nid = sjson.entity_id');
  $query->fields('n')
    ->fields('stype', array('shivanode_element_type_value'))
    ->fields('sac', array('shivanode_access_value'))
    ->fields('sjson', array('shivanode_json_value'))
    ->condition('n.type', 'shivanode')
    ->condition('n.status', NODE_PUBLISHED);
  if(array_key_exists('mine', $options)) {
    $query->condition('n.uid', $user->uid);
  } else if(array_key_exists('user', $options)) {
    $query->condition('n.uid', $options['user']);
  }
  if (array_key_exists('recent', $options)) {
    $query->orderBy('n.changed', 'DESC');
  } 
  else {
    $query->orderBy('n.title', 'ASC');
  }
  // if stype variable is supplied and its a number get only that type of shivanode
  if (is_numeric($stype) && $stype > 0) {
    $query->condition('stype.shivanode_element_type_value', $stype);
  }
  $results = $query->execute();
  $nodes = array();
  foreach ($results as $row) {
    if ($row->uid == $uid || $row->shivanode_access_value == "Published" ||  user_access('bypass node access')) {
      if(isset($row->shivanode_json_value)) {
        $json = json_decode($row->shivanode_json_value);
        if(isset($json->dataSourceUrl)) {
          if($gid = _get_gid_from_url($json->dataSourceUrl)) { 
            $row->dataGid = $gid;
          }
        }
      }
      if (array_key_exists('nodata', $options)) {
        if ($row->shivanode_element_type_value > 1) {
          $nodes[] = $row; // This was returning node objects but it was too intensive to load each node.
        }
      } 
      else {
        $nodes[] = $row;
      }
    }
  }
  return $nodes;
}

function _get_gid_from_url($url) {
  if(preg_match('/\?key=([^\#\&]+)[\#\&]?/', $url, $matches)) { 
    return $matches[1];
  } else {
    return FALSE;
  }
}

/*
 * Gets the type of visualization in the Shiva node
 */
function _get_shivanode_type($node, $mode = 'string') {
  $type = FALSE;
  if ($node && isset($node->shivanode_element_type)) {
    $options = _shivanode_element_typelist();
    $typefield = $node->shivanode_element_type;
    $val = $typefield['und']['0']['value'] * 1;
    if ($val == 5) { $val = 13; } // account for old simile 5 
    $type = ($mode == 'number')? $val : $options[$val];
  }
  return $type;
}

/*
 * Gets the access value (0 = private, 1 = public) of visualization in the Shiva node
 */
function _get_shivanode_access_status($node) {
  $status = FALSE;
  if ($node && isset($node->shivanode_element_type)) {
    $options = _shivanode_access_modes();
    $accessfield = $node->shivanode_access;
    $val = $accessfield['und']['0']['value'] * 1;
    if (isset($options[$val])) {
      $status = $options[$val];  
    }
  }
  return $status;
}

/**
 * Function for turning a JSON Hash Object into a Shiva Go URL query string
 *
 * @return
 *   a query string for a Shiva Go Url
 *
 */
function _shivanode_parse_json($jdata) {
  $jobj = $jdata;
  $outstr = FALSE;
  $debug = "";
  if (is_string($jobj)) {
    $jobj = json_decode($jdata);
  }
  if (is_object($jobj)) {
    foreach ($jobj as $key => $value) {
      if ($value != '') {
        if (is_string($outstr)) {
          $outstr .= '&';
        }
        $outstr .= $key . "=" . $value;
      }
    }
  }
  return $outstr;
}

/**
 * Creates the admin settings form for shivanode module
 *    called by shivanode_menu for path: 'admin/config/content/shivanode'
 */
function _shivanode_admin_settings($form, &$form_state) {
  
  $form['shivanode_settings_header'] = array(
    '#markup' => t('<h3>Shivanode Basic Settings</h3>') .
      t('<p>In this form you can set the URLs for the SHIVA player (for viewing nodes) and the various SHIVA editors.</p>'),
  );
  
  // URL Settings for SHIVA Node
  $form['shivanode_url_settings'] = array(
    '#description' => t('The urls for the SHIVA player and editors'),
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('SHIVA Player/Editor URLS'),
    '#prefix' => '<div id="shiva_url_form_div">',
    '#suffix' => '</div>',
  );
  
  $form['shivanode_url_settings']['shivanode_chart_viewer'] = array(
    '#type' => 'textfield',
    '#title' => t('Full URL for the SHIVA player (go.htm)'),
    '#size' => 80,
    '#default_value' => variable_get('shivanode_chart_viewer', SHIVA_VIEWER),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_root_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Base URL (path) for the SHIVA editors:'),
    '#size' => 80,
    '#default_value' => variable_get('shivanode_root_url', SHIVA_ROOT),
    '#required' => TRUE,
  );
  
  $form['shivanode_username'] = array(
    '#prefix' => '<div id="snuname">',
    '#suffix' => '</div>',
  );
  
  $form['shivanode_username']['shivanode_username_auto'] = array(
    '#type' => 'checkbox',
    '#title' => t('Use Institution\'s Whois Server to Fill Out Username'),
    '#default_value' => variable_get('shivanode_username_auto', FALSE),
    '#required' => FALSE,
    '#ajax' => array(
      'callback' => '_shivanode_uname_field',
      'wrapper' => 'snuname',
      'method' => 'replace',
    ),
  );
  
  $prefixval = (variable_get('shivanode_username_auto', FALSE)) ? '<div>' : '<div style="display:none;">';
  
  $form['shivanode_username']['shivanode_whois_host'] = array(
      '#type' => 'textfield',
      '#title' => t('URL for WhoIs Host'),
      '#default_value' => variable_get('shivanode_whois_host', 'whois.virginia.edu'),
      '#prefix' => $prefixval,
      '#suffix' => '</div>',
      '#size' => 60,
  );
  
  $form['shivanode_view_json'] = array(
    '#type' => 'checkbox',
    '#title' => 'View JSON in Edit Form',
    '#description' => t('Allow users to view the JSON format of the data in an uneditable field. ') . 
                      t('Their role must have appropriate permissions set ') . l(t('here'), 'admin/people/permissions') . '.',
    '#default_value' => variable_get('shivanode_view_json', FALSE),
  );
  
  $form['shivanode_url_settings']['instructions_1'] = array(
    '#type' => 'markup',
    '#markup' => '<p>' . t('The following fields for the specific SHIVA editors can contain either a full URL includin "http://" or ' . 
                  'just a file name. In the latter case (if the "http://" is not found in the file name), the path provided by the base url for SHIVA editors above ' .
                  'will be prepended to the file name.') . '</p>',
  );
  
  $form['shivanode_url_settings']['shivanode_data_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Data Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_data_editor', SHIVA_DATA_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_draw_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Draw Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_draw_editor', SHIVA_DRAW_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_earth_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Earth Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_earth_editor', SHIVA_EARTH_EDITOR),
    '#required' => TRUE,
  );

  $form['shivanode_url_settings']['shivanode_graph_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Graph Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_graph_editor', SHIVA_GRAPH_EDITOR),
    '#required' => TRUE,
  );

  $form['shivanode_url_settings']['shivanode_image_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Image Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_image_editor', SHIVA_IMAGE_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_map_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Map Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_map_editor', SHIVA_MAP_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_network_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Network Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_network_editor', SHIVA_NETWORK_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_poster_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Poster Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_poster_editor', SHIVA_POSTER_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_subway_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Subway Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_subway_editor', SHIVA_SUBWAY_EDITOR),
    '#required' => TRUE,
  );
    
  /*$form['shivanode_url_settings']['shivanode_timeline_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Timeline Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_timeline_editor', SHIVA_TIMELINE_EDITOR),
    '#required' => TRUE,
  );*/

  $form['shivanode_url_settings']['shivanode_timeglider_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Timeglider Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_timeglider_editor', SHIVA_TIMEGLIDER_EDITOR),
    '#required' => TRUE,
  );
      
  $form['shivanode_url_settings']['shivanode_video_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Video Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_video_editor', SHIVA_VIDEO_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_chart_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Chart Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_chart_editor', SHIVA_CHART_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_control_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Control Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_control_editor', SHIVA_CONTROL_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_canvas_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Canvas Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_canvas_editor', SHIVA_CANVAS_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_wcloud_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Word Cloud Editor File:'),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_wcloud_editor', SHIVA_WCLOUD_EDITOR),
    '#required' => TRUE,
  );

  // Reset buttons uses the validate function to reset data
  $form['actions']['default_values'] = array(
    '#type' => 'button',
    '#value' => t('Reset Default Settings'),
    '#weight' => 20,
  );
  
  return system_settings_form($form);
}

function _shivanode_uname_field($form, $form_state) {
  $ufieldset = $form['shivanode_username'];
  if($ufieldset['shivanode_username_auto']['#value'] == 1) {
    $ufieldset['shivanode_whois_host']['#prefix'] = '<div>';
  } else {
    $ufieldset['shivanode_whois_host']['#prefix'] = '<div style="display: none;">';
  }
  return $ufieldset;
}

function _shivanode_admin_settings_display($form, &$form_state) {
  
  // Display Settings for Shivanode dealing with size of views etc.
    
  $form['shivanode_display_settings_header'] = array(
    '#markup' => t('<h3>Shivanode Display Settings</h3>') .
      t('<p>In this form you can set the default parameters for how SHIVA visualizations are displayed</p>'),
  );
  
  
  $form['shivanode_default_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Full Display'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_default_height', SHIVA_IFRAME_HEIGHT),
    '#required' => TRUE,
    '#element_validate' => array('_shivanode_size_settings_check', ),
  );
  
  $form['shivanode_default_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Full Display'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_default_width', SHIVA_IFRAME_WIDTH),
    '#required' => TRUE,
  );
  
  $form['shivanode_default_override'] = array(
    '#type' => 'checkbox',
    '#title' => t('Visualization\'s settings override default settings'),
    '#description' => t('Allows the SHIVA visualization settings for height and width to override default settings for the full display.'),
    '#default_value' => variable_get('shivanode_default_override', SHIVA_DEFAULT_OVERRIDE),
  );
  
  $form['shivanode_edit_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Edit Form'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_edit_height', SHIVA_IFRAME_HEIGHT_EDIT),
    '#required' => TRUE,
    '#element_validate' => array('_shivanode_size_settings_check', ),
  );
  
  $form['shivanode_edit_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Edit Form'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_edit_width', SHIVA_IFRAME_HEIGHT_EDIT),
    '#required' => TRUE,
  );
  
  $form['shivanode_teaser_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Teaser'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_teaser_height', SHIVA_IFRAME_HEIGHT_TEASER),
    '#required' => TRUE,
  );
  
  $form['shivanode_teaser_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Teaser'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_teaser_width', SHIVA_IFRAME_WIDTH_TEASER),
    '#required' => TRUE,
  );
  
  $form['shivanode_max_size'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum size (height or width) for Iframes'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM),
    '#required' => TRUE,
  );
  
  $form['shivanode_min_size'] = array(
    '#type' => 'textfield',
    '#title' => t('Minimum size (height or width) for Iframes'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM),
    '#required' => TRUE,
  );
  
  $form['actions']['default_values'] = array(
    '#type' => 'button',
    '#value' => t('Reset Default Settings'),
    '#weight' => 20,
  );
  
  return system_settings_form($form);
}

function _shivanode_admin_settings_thumbs($form, &$form_state) {
  
  // Display Settings for Shivanode dealing with size of views etc.
  
  $form['shivanode_display_settings_header'] = array(
    '#markup' => t('<h3>Shivanode Image Settings</h3>') .
      t('<p>In this form you can set the parameters for default thumbnail images for SHIVA visualizations. These images are used when a custom thumbnail is not set. This should only be adjusted by Administrators who can determine the file id (fid) of the desired images.</p>'),
  );
  
  $form['shivanode_default_image_field'] = array(
    '#type' => 'textfield',
    '#title' => t('Thumbnail Field'),
    '#description' => t('The machine name for the thumbnail field in the Shivanode content type. This field must be manually added to the content type.'),
    '#size' => 10,
    '#default_value' => variable_get('shivanode_default_image_field', SHIVA_DEFAULT_IMAGE_FIELD),
  );
  
  if (variable_get('shivanode_default_image_field', SHIVA_DEFAULT_IMAGE_FIELD)) {
    $imginfo = _shivanode_get_generic_image_info();
    foreach($imginfo as $key => $info) {
      $fid = variable_get($info['variable'], '');
      $suffix = '';
      if ($fid != '') {
        $file = file_load($fid);
        $suffix = '(' . l(t('View Current Image'), file_create_url($file->uri), array('attributes' => array('target' => '_blank'))) . ')';
      }
      $form[$info['variable']] = array(
        '#type' => 'textfield',
        '#title' => $info['label'],
        '#description' => t('The file id (fid) for the default thumbnail image for visualization type: @type ', array('@type' => $info['label'])) . $suffix,
        '#size' => 10,
        '#default_value' => variable_get($info['variable'], ''),
      );
    }
  }
  
  return system_settings_form($form);
}

/*
 * Using validate function to reset the default values in the Shivanode URL settings form
 * Uses constants set at the top of shivanode.module
 * 
 */
function _shivanode_admin_settings_validate($form, &$form_state) {
  if ($form_state['triggering_element']['#id'] == 'edit-default-values') {
    // Viewer and Editor URLS
   $form_state['input']['shivanode_chart_viewer'] = SHIVA_VIEWER;
    $form_state['input']['shivanode_root_url'] = SHIVA_ROOT;
    $form_state['input']['shivanode_chart_editor'] = SHIVA_CHART_EDITOR;
    $form_state['input']['shivanode_data_editor'] = SHIVA_DATA_EDITOR;
    $form_state['input']['shivanode_draw_editor'] = SHIVA_DRAW_EDITOR;
    $form_state['input']['shivanode_earth_editor'] = SHIVA_EARTH_EDITOR;
    $form_state['input']['shivanode_graph_editor'] = SHIVA_GRAPH_EDITOR;
    $form_state['input']['shivanode_image_editor'] = SHIVA_IMAGE_EDITOR;
    $form_state['input']['shivanode_map_editor'] = SHIVA_MAP_EDITOR;
    $form_state['input']['shivanode_network_editor'] = SHIVA_NETWORK_EDITOR;
    $form_state['input']['shivanode_poster_editor'] = SHIVA_POSTER_EDITOR;
    $form_state['input']['shivanode_subway_editor'] = SHIVA_SUBWAY_EDITOR;
    //$form_state['input']['shivanode_timeline_editor'] = SHIVA_TIMELINE_EDITOR;
    $form_state['input']['shivanode_timeglider_editor'] = SHIVA_TIMEGLIDER_EDITOR;
    $form_state['input']['shivanode_video_editor'] = SHIVA_VIDEO_EDITOR;
    $form_state['input']['shivanode_control_editor'] = SHIVA_CONTROL_EDITOR;
    $form_state['input']['shivanode_canvas_editor'] = SHIVA_CANVAS_EDITOR;
    $form_state['input']['shivanode_wcloud_editor'] = SHIVA_WCLOUD_EDITOR;
  
    drupal_set_message(t('All values have been reset to their default'));
    drupal_set_message(t('Configuration must be saved to take effect.'), 'warning');
  }
} 
/*
 * Using Validate function to reset the default values in the Shivanode URL display form
 * Uses constants set at the top of shivanode.module
 * 
 */
function _shivanode_admin_settings_display_validate($form, &$form_state) {
  if ($form_state['triggering_element']['#id'] == 'edit-default-values') { 
    // Display Settings 
    $form_state['input']['shivanode_default_height'] = SHIVA_IFRAME_HEIGHT;
    $form_state['input']['shivanode_default_width'] = SHIVA_IFRAME_WIDTH;
    $form_state['input']['shivanode_edit_height'] = SHIVA_IFRAME_HEIGHT_EDIT;
    $form_state['input']['shivanode_edit_width'] = SHIVA_IFRAME_WIDTH_EDIT;
    $form_state['input']['shivanode_teaser_height'] = SHIVA_IFRAME_HEIGHT_TEASER;
    $form_state['input']['shivanode_teaser_width'] = SHIVA_IFRAME_WIDTH_TEASER;
    $form_state['input']['shivanode_max_size'] = SHIVA_IFRAME_DIMENSION_MAXIMUM;
    $form_state['input']['shivanode_min_size'] = SHIVA_IFRAME_DIMENSION_MINIMUM;
    $form_state['input']['shivanode_default_override'] = SHIVA_DEFAULT_OVERRIDE;
    $form_state['input']['shivanode_show_json'] = SHIVA_SHOW_JSON;
    
    drupal_set_message(t('All values have been reset to their default'));
    drupal_set_message(t('Configuration must be saved to take effect.'), 'warning');
  }
}

function _shivanode_admin_settings_thumbs_validate($form, &$form_state) {
  $imginfo = _shivanode_get_generic_image_info();
  foreach($form_state['values'] as $key => $value) {
    if(preg_match('/sngen-/',$key)) {
      $file = file_load($value);
      if(!$file) {
        foreach($imginfo as $key2 => $info) {
          if($info['variable'] == $key2) {
            form_set_error('File Not Found', t('The file (fid: @fid) for the @type visualization does not exist!', array( '@fid' => $value, '@type' => $info['label'])));
            break;
          }
        }
      }
    }
  }
}

function _shivanode_integer_check($element, &$form_state, $form) {
  $elval = $element['#value'];
  if (!is_numeric($elval)) {
    form_error($element, t('This field must be an integer.'));
  }
}

function _shivanode_size_settings_check($element, &$form_state, $form) {
  $elval = $element['#value'];
  if ($elval < variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM)) {
    form_error($element, t('This value cannot be less than %minimum', array('%minimum' => variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM))));
  }
  elseif ($elval > variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM)) {
    form_error($element, t('This value cannot be more than %maximum', array('%maximum' => variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM))));
  }
}

/*
 * A function to return the number of recent shivanode set in the admin settings, default is 5
 *
 */

function _get_recent_shivanodes() {
  $recent_num = variable_get('shivanode_block_entries', SHIVA_RECENT_ENTRIES);
  $all_recent = _get_shivanodes('recent nodata');
  $shiva_recent = array();
  foreach ($all_recent as $node) {
    $shiva_recent[] = $node;
    if (--$recent_num == 0) {
      break;
    }
  }
  return $shiva_recent;
}

/**
 * Callback for menu node/spreadsheets. (I think this is deprecated. Replaced by _shivanode_data_elements. 2013-08-20)
 *
 * Tests if any google docs logon info is stored either 1. in a session variable or
 *   2. in the user's data and if it is displays a list of spreadsheets (_shivanode_spreadsheet_list)
 *   otherwise displays a logon form (_shivanode_google_login_form)
 *
 * @return renderable array from function
 */

function _shivanode_gss_form($form, &$form_state) {
  _shivanode_check_google_login();
  drupal_set_title(t('Spreadsheet Data'));

  // Print out a list of spreadsheets using that client.
  $page = array();
  $sslists = _shivanode_get_spreadsheet_list();
  
  if ($sslists === FALSE) {
    $form['error'] = array(
      'header' => array(
        '#markup' => '<h2>Problem Accessing Information</h2>',
      ),
      'p0' => array(
        '#markup' => '<p><b>Unexpected Exception Thrown:</b> ' . $msg . '</p>',
      ),
      'p1' => array(
        '#markup' => '<p><b>Session Token:</b> ' . $_SESSION['gdoc_token'] . '</p>',
      ),
      'backlink' => array(
        '#markup' => '<p>' . l(t('Try Again?'), 'node/spreadsheets') . '</p>',
      ),
    );
    
    return $form;
    
  } 
  else {
      
    // Create a checkable list of spreadsheets that can be converted into data elements
    $avail_list = $sslists[0];
    // Create a list of Spreadsheets that already have visualizations associated with them
    $hasels = $sslists[1];
    $total_sheets = count($avail_list) + count($hasels);
    
    $form['#prefix'] = '<div class="shivanode_google_spreadsheets">';
    $form['#suffix'] = '</div>';
    
    // Instructions
    $form['intro'] = array(
      '#type' => 'markup',
      '#markup' => '<p>' . t('The present page has two sections:  1) a list of spreadsheets you have already imported and 2) a list of spreadsheets in your currently logged-in Google Drive account. Click the select link to use a spreadsheet you have already entered. Or, to add spreadsheets from your Google Drive account, check the boxes next to desired spreadsheet title(s) and click the "Create Data Entries" button at the bottom of the page.') . '</p><p>' . t('If you want to switch Google Drive accounts, make sure your browser is logged into the new account, then <a href="@reauthlink">click here</a>.', array('@reauthlink' => url('gdrive/reauth'))),
    );

    $form['filterdiv'] = array(
      '#prefix' => '<div id="addspreadsheet-filter"><span class="label">' . t('Filter') . ': </span>',
      '#suffix' => '</div>',
    );

    $form['filterdiv']['input'] = array(
      '#type' => 'markup',
      '#markup' => '<input id="ssfilter" onkeyup="javascript: Drupal.Shivanode.filterSsList(this);" type="text" name="input" 
				value="" size="15" title="Filter data sets by words in title (case-sensitive)"></input>',
    );

    $form['gss_done'] = array(
      '#type' => 'fieldset',
      '#title' => t('Already Imported Spreadsheets'),
      '#collapsible' => TRUE,
    );
    
    if (count($hasels) > 0) {
      $form['gss_done']['p'] = array(
        '#type' => 'markup',
        '#markup' => '<p><em>' . t('The following ' . count($hasels) . ' spreadsheets from your Google Docs account have ' .
          'already been added as data entries. Click on the "Select" option to create a visualization from it: ') . '</em></p>',
      );
      $form['gss_done']['ul'] = array(
        '#type' => 'markup',
        '#prefix' => '<ul>',
        '#suffix' => '</ul>',
      );
      $list = '';
      foreach ($hasels as $el) {
        $enode = node_load($el['nid']);
        $target_top_attr = array(
          'attributes' => array(
            'target' => '_top',
          )
        );
        $form['gss_done']['ul'][] = array(
          '#type' => 'markup',
          '#markup' => '<li>' . $el['title'] . ' (' . 
             l(t('Select'), 'data/add/nid/' . $el['nid'], $target_top_attr) . ' | ' .
             l(t('View'), 'node/' . $el['nid'], $target_top_attr) . ' | ' .
             l(t('Edit'), 'node/' . $el['nid'] . '/edit', $target_top_attr) . ')</li>',
        );
      }
    } 
    else {
      $form['gss_done']['p'] = array(
        '#type' => 'markup',
        '#markup' => '<p>' . t('You have not added any spreadsheets from the presently logged in Google Docs account. Choose from among ' .
          'your spreadsheets listed below those you would like to make into data entries.') . '</p>',
      );
    }
    
    // Fieldset for Checkboxes
    $form['gss_list'] = array(
      '#type' => 'fieldset',
      '#title' => t('My Remaining Google Spreadsheets'),
      '#collapsible' => TRUE,
      '#description' => check_plain( t('Choose from among the ' . ((count($hasels) > 0)?'remaining ': '') . 
        count($avail_list) . ' spreadsheets in your Google Docs account ' .
        'which ones you would like to make into data entry:')),
    );
    
    // Create Checkboxes
    $form['gss_list']['choices'] = array(
      '#type' => 'markup',
      '#prefix' => '<ul class="shivanode-spreadsheets">',
      '#suffix' => '<ul>',
    );
    
    $alct = -1;
    foreach ($avail_list as $key => $value) {
      $alct++;
      $form['gss_list']['choices'][$alct] = array(
        '#type' => 'markup',
        '#prefix' => '<li>',
        '#suffix' => '</li>',
      );
      $form['gss_list']['choices'][$alct]['access' . $alct] = array(
        '#type' => 'hidden',
        '#value' => 0,
      );
      $shared = TRUE;
      if(preg_match('/([\w\W]+)\$\$notshared\$\$/', $value, $matches)) {
        $value = $matches[1] . t(' (**Private**)');
        $shared = FALSE;
      }

      $form['gss_list']['choices'][$alct]['cbox' . $alct] = array(
        '#type' => 'checkbox',
        '#prefix' => '<span class="list-checkbox">',
        '#suffix' => '</span>',
        '#title' => '<span title="' . t('Warning: This spreadsheet is not shared and so cannot be used for public visualizations.') . '">' . check_plain($value) . '</span>',
        '#default_value' => $key,
      );
      if(!$shared) {
        $form['gss_list']['choices'][$alct]['cbox' . $alct]['#attributes'] = array(
          'title' =>  t('Warning: This spreadsheet is not shared and so cannot be used for public visualizations.'),
        );
      }
    }
    
    // The Submit button
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Create Data Entries'),
      '#prefix' => '<p>',
      '#suffix' => '</p>',
    );
    
    // Enable submit by pressing enter
    $form['#attributes']['onkeypress'][]='if(event.keyCode==13){this.submit();}';
    return $form;
  }
}

function _shivanode_get_spreadsheet_list() {
  try {
    $gdocs = gdrive_get_filelist();
    foreach ($gdocs as $doc) {
      $value = $doc['title'];
      if(!$doc['shared']) {
        $value .= '$$notshared$$';
      }
      $key = $doc['url'];
      $sslist[$key] = $value;
    }
    // Call _shivanode_filter_gss_list() to separate list between those
    //    spreadsheets that have data entries associated with them [1]
    //    and those that do not already have data entries [0]
    return _shivanode_filter_gss_list($sslist);
  } catch (Exception $e) {
    $msg = $e->getMessage();
    drupal_set_message(check_plain($msg), 'error');
    return FALSE;
  }
}

function _shivanode_filter_gss_list($sslist) {
  global $user;
  $noelement = array();
  $haselement = array();
 
  $msg = '';
  
  $existing = _get_shivanodes('stype:1 mine'); // Get all Shiva Data entries from Database
  foreach ($sslist as $url => $title) {
    // Get current sheets gid and compare with existing data nodes
    $gid = _get_gid_from_url($url);
    $found = FALSE;
    if($gid) {
      foreach($existing as $n) {
        if(isset($n->dataGid)) {
          // Spreadsheet has already been used on this site
          if($n->dataGid == $gid) {
            $found = TRUE;
            $n->found = TRUE; // add found property to existing node record
            $haselement[] = array(
              'nid' => $n->nid,
              'url' => $url,
              'title' => $title,
            );
          }
        }
      }
      // If not found in existing nodes add to the noelement array
      if(!$found) {
        $noelement[] = $title . "_URL:" . $url;
      }
    } 
  }
  // Check for existing data nodes not from this Gdrive account, i.e. do not have the found property
  foreach($existing as $n) {
    if(!isset($n->found)) {
      $json = json_decode($n->shivanode_json_value);
      $haselement[] = array(
        'nid' => $n->nid,
        'url' => $json->dataSourceUrl,
        'title' => $n->title,
      );
    }
  }
  asort($noelement);
  // split no element items into keyed array
  $avail_list = array();
  foreach ($noelement as $item) {
    $pts = explode('_URL:', $item);
    $avail_list[$pts[1]] = $pts[0];
  }
  usort($haselement, 'cmp_titles');
  return array($avail_list, $haselement); // return 2 arrays, list of gsheets not added and list of data nodes already created from gsheets
}

function cmp_titles($a, $b) {
  if ($a['title'] < $b['title']) {
    return -1;
  } 
  elseif ($a['title'] == $b['title']) {
    return 0;
  } 
  else {
    return 1;
  }
}

/**
 * Function _shivanode_gss_form_submit($form, &$form_state): (I think this is deprecated. Replaced by _shivanode_data_elements_submit. 2013-08-20)
 * 
 * called upon submission of the gss_form which lists one's google
 * spreadsheets with checkboxes. For each ss checked in that form this function
 * will create a Shiva data entry with title and URL.
 *
 */
function _shivanode_gss_form_submit($form, &$form_state) {
  // Filter the form values and create an array of new objects
  //   with values for cbox (whether chosen), access (public or private),
  //   title and url. Put these in a $values array indexed by the integer
  //   found in the checkbox name cbox0, cbox1, etc. There are also access0, access1, etc. fields
  //   The title and url come from the 'complete form' variable of the form_state

  $formvalues = $form_state['values'];
  $values = array();
  foreach ($formvalues as $key => $val) {
    $ind = str_replace(array('access', 'cbox'), '', $key);
    $subind = preg_replace('/\d+/', '', $key);
    $values[$ind][$subind] = intval($val);
  }
  $choices = $form_state['complete form']['gss_list']['choices'];
  foreach (array_keys($values) as $key) {
    if (is_numeric($key)) {
      $values[$key]['title'] = $choices[$key]['cbox' . $key]['#title'] . ' (Data)';
      $values[$key]['url'] = $choices[$key]['cbox' . $key]['#default_value'];
    }
  }
  
  // Filter the $values array created above to $pick which contains only checked options
  $picks = array();
  foreach ($values as $key => $item) {
    if (isset($item['cbox']) && intval($item['cbox']) == 1) {
      $picks[$key] = $item;
    }
  }

  // Now iterate through the picks and create a node for each
  $out = ""; // For the resulting message after form processing.
  $nct = 0;
  foreach ($picks as $pick) {
    // Only create a node if there's a url
    $today = date("D, j M Y"); 
    // convert url to URL of the google 'shared' version
    $pick['url'] = str_replace('https://spreadsheets.google.com/ccc', 'https://docs.google.com/spreadsheet/ccc', $pick['url']);
    $snjson = '{"dataSourceUrl":"' . $pick['url'] . '","title":"' . $pick['title'] . '","shivaId":"0",' .
      '"shivaMod":"' . $today . '","shivaGroup":"Data"}';
    $node = new stdClass();
    $node->type = 'shivanode';
    node_object_prepare($node);
    $node->title    = $pick['title'];
    $node->language = LANGUAGE_NONE;
    $node->shivanode_element_type[$node->language][0]['value'] = 1;
    $body_text = t('Shiva data entry created from Google spreadsheet on @datestr', array(
        '@datestr' => date('c'),
      ));
    $node->body[$node->language][0]['value']   = $body_text;
    $node->body[$node->language][0]['summary'] = text_summary($body_text);
    $node->body[$node->language][0]['format']  = 'filtered_html';
    // access returns 0 = private, 1 = public, but those are 1 and 4 respectively in options array
    $node->shivanode_access[$node->language][0]['value'] = (intval($pick['access']) == 1)?4:1; // 4 = public, 1 = private
    $node->shivanode_json[$node->language][0]['value'] = $snjson;
    node_save($node);
    $nct++;
  }
  // Output message about which spreadsheets have been turned into data entries.
  $out = $nct . ' ' . t('data entries have been created!'); 
  drupal_set_message(check_plain($out));
}

/*
 * _shivanode_check_google_login($authenticate) : Checks whether you are logged into and authenticated in your google account
 *      if $authenticate is TRUE, then it logs you in
 *      else it returns false
 */
function _shivanode_check_google_login($authenticate = TRUE) {
  return gdrive_is_authorized();
}


/**
 * _shivanode_data_form: Lists all data entries for inclusion in lightbox popup
 *     when icon on a shiva edit page is clicked to use a data entry for a visualization,
 *      this function produces the content displayed in a popup for choosing which data entries
 *
 */
function _shivanode_data_form($form, &$form_state) {
  global $base_root, $base_path;
  
  drupal_set_title(t('Choose Your Data'));
  
  // Get path arguments
  $args = arg();
  $type = (isset($args[1])) ? $args[1] : FALSE; 
  $ctype = (isset($args[2])) ? $args[2] : FALSE;
  
  // Set display strings
  if(!preg_match('/' . strtolower(SHIVA_DATA_VISUALIZATIONS) . '/', strtolower($type))) { $type = FALSE; }
  $sntypelabel = ($type) ? ucfirst($type) : t('Charts, Images, Networks, and Timeline');
  if($ctype) { $sntypelabel = ucfirst($ctype); }
  
  // Set Base Url
  $baseurl = url('node/add/shivanode');
  if($type) {
    $baseurl .= '/nd/' . $type;
    if($ctype) {
      $baseurl .= '/?ctype=' . $ctype;
    }
  }
  
  // Create Form
  $form = array(
    '#prefix' => '<div id="data-element-page">',
    '#suffix' => '</div>',
  );
  
  $form['isPop'] = array(
    '#type' => 'hidden',
    '#value' => (isset($_GET['format']) && $_GET['format'] == 'simple')? 1 : 0,
  );
  
  $form['did'] = array(
    '#type' => 'hidden',
  );
  
  $form['dtitle'] = array(
    '#type' => 'hidden',
  );
  
  $form['dtype'] = array(
    '#type' => 'hidden',
  );
  
  $form['vtype'] = array(
    '#type' => 'hidden',
    '#value' => $type,
  );
  
  $form['ctype'] = array(
    '#type' => 'hidden',
    '#value' => $ctype,
  );
  
  $form['skip'] = array(
    '#type' => 'submit',
    '#value' => t('Skip this step!'),
    '#name' => 'skipbutton',
    '#prefix' => '<form class="skip-form" action="' . $baseurl . '">',
    '#suffix' => '</form>',
  );
  
  $form['p'] = array(
    '#type' => 'markup',
    '#markup' => t('<p>@type visualizations require data in the form of a Google Spreadsheet or simple CSV spreadsheet file.  Below is a list of all the spreadsheets you have registered with this site as well as all the spreadsheets in your Google Drive account. Press the visualization button next to the desired data set to begin to create a visualization base on it.</p><p>If you want to switch Google Drive accounts, make sure your browser is logged into the new account, then <a href="@reauthlink">click here</a>.</p>', array(
    '@type' => $sntypelabel, 
    '@reauthlink' => url('gdrive/reauth')
   )),
  );
  
  // Add help link
  $link = _shivanode_get_help_link($sntypelabel, t('@type visualization type',  array('@type' => $sntypelabel)));
  if ($link != '') {
    $form['help'] = array(
      '#type' => 'markup',
      '#markup' => '<p>' . t('For a description of how to format a spreadsheet, see the documentation for the ') . $link . '.</p>',
    );
  }
  
  // List GDocs
  // Call _shivanode_gdocs_view function to get HTML list of spreadsheets from view, tweak it and insert in this form
  $isSimple = (isset($_GET['format']) && $_GET['format'] == 'simple') ? TRUE : FALSE;
  $viewmarkup = _shivanode_gdocs_view($type, $ctype, $isSimple);
  $form['addedview'] = array(
    '#type' => 'markup',
    '#markup' => $viewmarkup,
    //'#prefix' => '<div class=""'
  );
  
  // If not logged in show authorization button
  if (!_shivanode_check_google_login(FALSE)) {
    $markup['spreadsheets'] = array(
      '#type' => 'markup',
      '#prefix' => '<div>',
      '#suffix' => '</div>',
    );
    $form['spreadsheets']['instructions'] = array(
      '#type' => 'markup',
      '#markup' =>'<p>' . t('To view spreadsheets in your Google Drive account you must give permission for this site to have read-only access to your Google Drive. To do so, you need to visit the <a href="@authpage">Authorization Page</a>.', array('@authpage' => url('gdrive/auth'))) . '</p>',
    );
  }
  return $form;
}
 
function _shivanode_data_form_submit($form, &$form_state) {
  // example url: node/add/shivanode/1635/chart?ctype=Candlestick Chart
  // example url when skipping data choice: node/add/shivanode/nd/timeline
  if(isset($form_state['input']['skipbutton'])) {
    // if there's an arg(1) it is type of visualization, so add /nd/ (no data) and then type name
    $type = (arg(1)) ? '/nd/' . arg(1) : ''; 
    $type = 'node/add/shivanode' . str_replace('Slideshow', 'Image', $type);
    $options = array();
    if(arg(2)) {
      $options = array(
        'query' => array(
          'ctype' => arg(2),
        )
      );
    }
    drupal_goto($type, $options);
  }
  $vals = &$form_state['input'];
  if(!isset($vals['did']) || $vals['did'] == '') {
    drupal_set_message('No data id was sent', 'warning');
    return;
  }
  if(!isset($vals['dtype']) || $vals['dtype'] == '') {
    drupal_set_message('No data type was sent', 'warning');
    return;
  }
  
  $nid = $vals['did'];
  if($vals['dtype'] == 'gid') {
    $ssurl = 'https://docs.google.com/spreadsheet/ccc?key=' . $nid;
    $newel = _shivanode_create_shiva_data_node($vals['dtitle'], $ssurl);
    $nid = $newel->nid;
  }
   
  $url = array('node/add/shivanode/' . $nid);
  $ctype = FALSE;
  if(arg(1)) {
    $url[0] .= '/' . arg(1);
    if(arg(2)) { $ctype = arg(2); }
  } else if($vals['vtype']) {
    $mytype = _shivanode_types_using_gdocs($vals['vtype']);
    if($vals['vtype'] < 15) {
      $ctype = $mytype;
      $mytype = 'chart';
    }
    $url[0] .= '/' . $mytype;
  }
  $url = str_replace('Slideshow', 'Image', $url);
  if($ctype) {
    $url[1] = array(
      'query' => array(
        'ctype' => $ctype,
      )
    );
  }
  $form_state['redirect'] = $url;
}
/**
 * _shivanode_gdocs_view: Adds Spreadsheets in GDoc account to list of data sources
 *    Calls a view of existing data elements and adds ones google docs to it, if one has given permission
 *    Creates visualize buttons to create a visualization using a spreadsheet when clicked.
 *    The buttons are modified by JS () to set the newss, newsstype, and newsstitle hidden elements when clicked before submission
 *    $simple param refers to whether page is being displayed as a popup (simple = true) or not
 *    See JS at:  Drupal.behaviors.shivaDataElementSelect in shivanode.js
 */
function _shivanode_gdocs_view($vistype='', $ctype=FALSE, $simple=FALSE) {
  // If user does not have any data nodes, add one so view will show results
  if(count(_get_shivanodes('stype:1 mine')) == 0) {
    $url = 'https://docs.google.com/spreadsheet/ccc?key=0AhXu2Gubcj72dGVROGVESlJWblBSc1c4RjFPTVpyamc&usp=sharing';
    $title = 'Example Data for SHIVA';
    _shivanode_create_shiva_data_node($title, $url);
  }
  // Get the view of data sets
  $viewMarkup = views_embed_view('shiva_data_list', 'my_shiva_data_pane');
  
  // Load it into a XML DOM Document
  $xml = new DOMDocument();
  $xml->preserveWhiteSpace = false;
  $xml->loadXML($viewMarkup);
  
  // Find each row via XSL
  $xpathstr = '//div[@class="view-content"]//tbody/tr';
  $xpath = new DOMXPath($xml);
  $result = $xpath->evaluate($xpathstr);
  
  // Iterate through each data element and adjust markup
  foreach($result as $row) {
    $cell3 = $row->childNodes->item(2);
    $txt = $cell3->childNodes->item(0);
    $info = explode('|$|', trim($txt->wholeText));
    $title = $info[0];
    $nid = $info[1];
    // if simple = true, it's a popup and just insert data node.
    $selectFrag = $xml->createDocumentFragment(); 
    $res = $selectFrag->appendXML('<a href="#" onclick="Drupal.Shivanode.setDataElement(' . $nid . ', true);">Visualize</a>');
    if(!$simple) {
      $selectFrag = _shivanode_gdocs_view_select($xml, $vistype, $ctype, $title, 'nid', $nid);
    }
    $cell3->replaceChild($selectFrag, $cell3->childNodes->item(0));
  }
  
  // Find last row to determine whether even or odd (row mod)
  $xpathstr = '//div[@class="view-content"]//tbody/tr[contains(@class, "views-row-last")]';
  $xpath = new DOMXPath($xml);
  $result = $xpath->evaluate($xpathstr)->item(0);
  
  if(!is_object($result)) {
    return $xml->saveXML(); 
  }
  
  $result->setAttribute('class', preg_replace('/\s*views-row-last/', '', $result->getAttribute('class')));
  $tbody = $result->parentNode;
  $rowmod = $result->getAttribute('class');
  
  // if logged in, then add gdocs not yet added to the list
  if (_shivanode_check_google_login(FALSE)) {
    $sslists = _shivanode_get_spreadsheet_list();
    $gsheets = $sslists[0];
    foreach($gsheets as $key => $title) {
      $shared = TRUE;
      if(strpos($title, '$$notshared$$') > -1) {
        $shared = FALSE;
        $title = str_replace('$$notshared$$', '', $title);
      }
      $rowclone = $result->cloneNode(TRUE);
      $rowmod = ($rowmod == 'even') ? 'odd' : 'even';
      $rowclone->setAttribute('class', $rowmod);
      $gid = $key;
      if(strpos($key, '?key=') > -1) {
        $pts = explode('?key=', $key);
        if(isset($pts[1])) {
          $gid = $pts[1];
        }
      }
      if(preg_match('/([^\#\&]+)[\#\&]?/', $gid, $matches)) {
        $gid = $matches[1];
      }
      //dpm($gid, $key);
      $titlecell = $rowclone->childNodes->item(0);
      $datecell = $rowclone->childNodes->item(1);
      $linkcell = $rowclone->childNodes->item(2)->cloneNode();
      $titlecell->replaceChild(new DOMText($title), $titlecell->childNodes->item(0));
      if(!$shared) {
        $nsel = $xml->createElement('a','*');
        $nsel->setAttribute('href', 'https://docs.google.com/spreadsheet/ccc?key=' . $gid);
        $nsel->setAttribute('class', 'sn-notpublic');
        $nsel->setAttribute('target', '_blank');
        $nsel->setAttribute('title', 'This spreadsheet is not publically shared');
        $titlecell->appendChild($nsel);
      }
      $datecell->replaceChild(new DOMText(t('Not yet used')), $datecell->childNodes->item(0));
      $selectFrag = $xml->createDocumentFragment(); 
      $res = $selectFrag->appendXML(l(t('Visualize'), 'data/add/gid/' . $gid . '/popup/' . $title));
      if(!$simple) {
        $selectFrag = _shivanode_gdocs_view_select($xml, $vistype, $ctype, $title, 'gid', $gid );
      }
      $linkcell->appendChild($selectFrag);
      
      $rowclone->replaceChild($linkcell, $rowclone->childNodes->item(2));
      $tbody->appendChild($rowclone);
    }
  }
  $xhtml = $xml->saveXML();

  return $xhtml;
}

/**
 * _shivanode_gdocs_view_select returns a DOM 
 */
function _shivanode_gdocs_view_select($xml, $vistype, $ctype, $title, $type, $id) {
  $divid = 'data-' . $id;
  $sform = array(
    '#prefix' => '<div id="' . $divid . '" class="infoparent">',
    '#suffix' => '</div>',
  );
  $sform = array();
  $sform['visselect'] = array(
    '#type' => 'select',
    '#multiple' => FALSE,
    '#required' => TRUE,
    '#empty_option' => t('Visualize as ...'),
    '#empty_value' => 0,
    '#default_value' => 0,
    '#options' => _shivanode_types_using_gdocs(),
    '#attributes' => array('onchange' => 'Drupal.Shivanode.setSelectedType(jQuery(this), true);', 'class' => array('myclass ' . $divid)),
  );
  if($vistype) {
    unset($sform['visselect']);
    $label = ($ctype) ? ucfirst($ctype) : ucfirst($vistype);
    $sform['visselect'] = array(
      '#type' => 'button',
      '#value' => t("Visualize as @type", array('@type' => $label)),
      '#attributes' => array('onmousedown' => 'Drupal.Shivanode.setSelectedType(this); return false;'),
    );
  }
  $sform['myinfospan'] = array(
    '#type' => 'markup',
    '#markup' => '<div style="display: none;"><span class="mydtitle">' . htmlentities($title) . '</span>' .
          '<span class="mydtype">' . $type . '</span>' . 
          '<span class="mydid">' . $id . '</span></div>',
  );
  $selectForm = drupal_render($sform);
  // hack because drupal_render does not recognize empty_value the way the drupal_get_form() does
  $sstr =  t('Visualize as ...');
  $selectForm = str_replace('<option value="0"></option>', '<option value="0" selected="selected">' . $sstr . '.</option>', $selectForm);
  $selectFrag = $xml->createDocumentFragment(); 
  $res = $selectFrag->appendXML($selectForm);
  return $selectFrag; 
}

function _shivanode_data_use_form_submit($form, &$form_state) {
  $vistype = '';
  $ctype = '';
  if (isset($form_state['input']['vistype'])) {
    $vistype = $form_state['input']['vistype'];
    if(isset($form_state['input']['ctype'])) {
      $ctype = $form_state['input']['ctype'];
    }
  } else {
    $types =_shivanode_types_using_gdocs();
    $selected = $form_state['input']['vistypeselect'];
    $vistype = $types[$selected];
    if($selected < 15 ) {
      $vistype = 'chart';
      $ctype = $types[$selected] ;
    }
  }
  $title = $form_state['input']['datatitle'];
  $type = $form_state['input']['datatype'];
  $id = $form_state['input']['dataid'];
  $ispopup = (isset($form_state['values']['isPop']) && $form_state['values']['isPop'] == 1) ? TRUE : FALSE;
  $nid = $id; // by default assume it is an existing datanode and the nid is passed as ssurl;
  // if sstype is 'gid', then it's a spreadsheet that has not been added.
  if($type == 'gid') {
    $ssurl = 'https://docs.google.com/spreadsheet/ccc?key=' . $id;
    $newel = _shivanode_create_shiva_data_node($title, $ssurl);
    $nid = $newel->nid;
    $form_state['values']['datatype'] = 'nid';
    $form_state['values']['dataid'] = $newel->nid;
  }

  if($ispopup) {
    /*
    // redirect from popup form. The query ?insert={new node id} is to close the popup and insert the data id
    //$form_state['redirect'] = 'node/add/shivanode/' .  $ctype . '?insert=' .  $nid;
    drupal_set_message("Is a popup!");
    $form_state['redirect'] = array(
      'node/add/shivanode/' .  $vistype,
      array(
        'query' => array(
          'insert' => $nid,
        ),
      ),
    );
    drupal_redirect_form($form_state);
    $form['newp'] = array(
      '#type' => 'markup',
      '#markup' => '<p> THIS IS ALL NEW MARKUP ADDED AFTER SUBMISSION</p>',
    );
     * */
  } 
  elseif ($ctype != '') { 
    $form_state['redirect'] = array(
      'node/add/shivanode/' . $nid . '/' . $vistype,
      array(
      'query' => array(
        'ctype' => $ctype,
        ),
      ),
    );
  } 
  else {
     $form_state['redirect'] = 'node/add/shivanode/' . $nid . '/' . $vistype;
  }
}

//** Returns an array of shiva node types that use spreadsheet info **/
function _shivanode_types_using_gdocs($val = FALSE) {
  $gtypes = array(
    '',
    'Annotated Time Line',
    'Area Chart',
    'Bar Chart',
    'Candlestick Chart',
    'Column Chart',
    'Gauge',
    'Geo Chart',
    'Line Chart',
    'Motion Chart',
    'Organization Chart',
    'Pie Chart',
    'Scatter Chart',
    'Table',
    'Tree Map',
    'Graph',
    'Slideshow',
    'Network',
    'Timeline'
  );
  if(!$val) {
    return $gtypes;
  } else if (!isset($gtypes[$val])) {
    return FALSE;
  } else {
    return $gtypes[$val];
  }
}

function _add_DOM_attributes($newel, $atts = array()) {
  foreach ($atts as $aname => $value) {
    $newel->setAttribute($aname,$value);
  }
  return $newel;
}

/*
 * _shivanode_data_elements_submit($form, &$form_state) : Called when the "Add Spreadsheet" button in the 
 *      shivanode data entry form is pressed, only when adding a previously unused spreadsheet.
 *      This function creates the data node for the spreadsheet and then redirects the form (which is in a popup window)
 *      to the data node with a query of insert=nid, e.g. /node/123?insert=123. This triggers the javascript in the popup 
 *      to send an html5 message to the parent base page to insert the new data entry and then closes the popup.
 */
function _shivanode_data_elements_submit($form, &$form_state) {
  // If sent here by "Skip this step" button, then just go to form without data (no prefix, just gives chart or /nd/{type} goes to that type)
  if($form_state['triggering_element']['#name'] == 'skip') {
    $type = (isset($form_state['build_info']['args'][0])) ? '/nd/' . $form_state['build_info']['args'][0] : '';
    drupal_goto('node/add/shivanode' . $type);
  }
  $ssurl = $form_state['input']['newss'];
  $sstype = $form_state['input']['newsstype'];
  $sstitle = $form_state['input']['newsstitle'];
  $ispopup = $form_state['input']['ispopup'];
  $ctype = (preg_match('/mydata\/([^\/\?]+)/', $form['#action'], $match)) ? '/' . $match[1] : '';
  $nid = $ssurl; // by default assume it is an existing datanode and the nid is passed as ssurl;
  // if sstype is 'gid', then it's a spreadsheet that has not been added.
  if($sstype == 'gid') {
    $ssurl = 'https://docs.google.com/spreadsheet/ccc?key=' . $ssurl;
    $newel = _shivanode_create_shiva_data_node($sstitle, $ssurl);
    $nid = $newel->nid;
  }

  if($ispopup == 'true') {
    // redirect from popup form. The query ?insert={new node id} is to close the popup and insert the data id
    //$form_state['redirect'] = 'node/add/shivanode/' .  $ctype . '?insert=' .  $nid;
    drupal_goto('node/add/shivanode/' .  $ctype, array(
      'query' => array('insert' => $nid),
    ));
  } else { 
    $form_state['redirect'] = 'node/add/shivanode/' . $nid . $ctype;
  }
}

function _shivanode_create_shiva_data_node($title, $url) {
  $newel = new stdClass();
  $newel->type = 'shivanode';
  node_object_prepare($newel);
  $newel->title = $title;
  $newel->language  = LANGUAGE_NONE;
  $newel->shivanode_description[$newel->language][0]['value']   = 'Added programmatically in order to create a visualization';
  $newel->shivanode_element_type[$newel->language][0]['value'] = 1;
  $newel->shivanode_access[$newel->language][0]['value'] = 1;
  $newel->shivanode_json[$newel->language][0]['value'] = '{"dataSourceUrl":"' . $url . '","title":"' . $title . '","shivaId":"0","shivaMod":"' . 
      date('D, j F Y') . '","shivaGroup":"Data"}';
  node_save($newel);
  return $newel;
}

/*
 *   _shivanode_get_dataurl($node) : a function that when given a shivanode node object returns the dataSourceURL within it
 */
function _shivanode_get_dataurl($node) {
  $result = FALSE;
  if (isset($node->shivanode_json)) {
    $json_str = $node->shivanode_json['und'][0]['value'];
    $json = json_decode($json_str);
    if (isset($json->dataSourceUrl)) {
      $result = $json->dataSourceUrl;
    }
  }
  return $result;
}

/*
 * function _shivanode_set_to_remove_datainfo($form, $form_state): adds hidden element to trigger removal of data entry upon saving.
 * 
 */

function _shivanode_set_to_remove_datainfo($form, $form_state) {
  $actions = array();
  // $gdinfo is the section of the form that has the info about the linked google spreadsheet
  $gdinfo = $form['gdocinfo'];
  $gdinfo['#prefix'] = '<div id="data_sheet_in_use" style="display: block; clear: both;" class="messages status">';
  unset($gdinfo['script']);
  unset($gdinfo['data_nid']);
  // If it's during the creation of a new visualization, one message
  if (preg_match('/\/node\/add\/shivanode/', $form['#action'])) {
    drupal_set_message(t('Link to data has been removed.'));
    $gdinfo['span']['#markup'] ='<script type="text/javascript">Drupal.Shivanode.setUrl("node/add/shivanode", false);</script>';
   /* $gdinfo['span']['#markup'] = '<span>' . t('No data entry will be linked to this one.') . '</span>';
    $gdinfo['button_div'] = array();*/
  // otherwise if editing an existing visualization, another message and ...
  } 
  else {
    $gdinfo['span']['#markup'] = '<span>' . t('Link to data entry:') . '</span>';
    $gdinfo['old_button_div'] = array(
      '#type' => 'markup',
      '#prefix' => '<div id="old_button_div" class="hidden">',
      '#suffix' => '</div>',
    );
    // Save the old button info in case we want to revert this choice (Not yet implemented)
    $gdinfo['old_button_div']['content'] = $gdinfo['button_div'];
    $gdinfo['button_div'] = array();
    $gdinfo['button_div']['text'] = array(
      '#type' => 'markup',
      '#markup' => '<span> ' . t('will be removed upon saving this node.') . '</span>',
    ); 
  }
  // Ajax commands to return
  $actions[] = ajax_command_replace('#data_sheet_in_use', drupal_render($gdinfo)); // replace gdinfo markup
  $actions[] = ajax_command_remove('#shivanode_data_nid'); // remove hidden value to link to another data entry from form
  return array('#type' => 'ajax', '#commands' => $actions);
}

/*
 * _shivanode_remove_datalink($node) : a function to remove the link between a shiva node visualization and a data entry
 * 
 */
function _shivanode_remove_datalink($node) {
  if ($node->type == 'shivanode') {
    $nid = $node->nid;
    $links = db_select('shivanode_links', 'sl')
      ->fields('sl')
      ->condition('sn_id', $nid)
      ->execute()
      ->fetchCol(0);
  
    if (count($links) == 0) {
      return;  
    }
    $num_deleted = db_delete('shivanode_links')
      ->condition('sn_id', $nid)
      ->execute();
    if ($num_deleted == 1) {
      drupal_set_message(check_plain(t('Link from @nid to data entry @did removed.', array(
        '@nid' => $nid,
        '@did' => $links[0],
      ))));
    } 
    else {
      drupal_set_message(
        check_plain(t('@num links to data entries removed!', array( '@num' => $num_deleted))), 
        'error');
    }
  }
}

/*
 *  _shivanode_greset_form($form, $form_state) : Display for for reseting Google authentication
 *            This is a confirm form, the actual reseting is done in the _shivanode_greset_form_submit function
 * 
 */
function _shivanode_greset_form($form, $form_state) {
  $form['greset'] = array(
    '#type' => 'fieldset',
    '#title' => t('Reset Google Account Info'),
  );
  $form['greset']['p'] = array(
    '#markup' => '<p>' . t('The SHIVA manager interfaces with the currently logged on Google Docs account and lists the available spreadsheets in that account. ' .
      'To change the account from which you would like to add spreadsheets. You must first log out of the present google account. ' .
      '<a href="https://docs.google.com/" target="_blank">Click here to open the present account in a new window.</a> ' .
      'Log out of that account and log into the another account to see the spreadsheets from that later one. ' .
      'Once this is done you can reset the authentication information used by this site by clicking the button below.'),
  );
  $form['greset']['submit'] = array(
    '#type' => 'submit',
    '#value' => t('Reset'),
    '#prefix' => '<p>',
    '#suffix' => '</p>',
  );
  return $form;
}
 
/*
 * _shivanode_greset_form_submit($form, &$form_state) : Resets (erases) Google Account logon information 
 *              by deleting the information stored in the session variable 'gdoc_token'
 */
function _shivanode_greset_form_submit($form, &$form_state) {
  global $base_root, $base_path;
  if (isset($_SESSION['gdoc_token'])) {
    unset($_SESSION['gdoc_token']); 
  }
  drupal_set_message( check_plain(t('Google account authorization has been reset.')) );
  drupal_goto($base_root . $base_path . 'mydata');
}

function _get_shivaframe_url($opt, $nid = '') {
  if (is_array($opt)) {
    $opt = $opt[0]; 
  } // if it's an array take first element value
  if (!is_numeric($opt)) {
    $opt = 7; 
  } // default is visualization
  $player = '';
  switch ($opt) {
    case 1:  // Data
      if ($nid != '') {
        $njson = _shivanode_get_json($nid);
        if(isset($njson['dataSourceUrl'])) {
          $player = str_replace('https','http', $njson['dataSourceUrl']);
        }
      }
       //$player = variable_get('shivanode_data_editor', SHIVA_DATA_EDITOR); //"$otherroot/data.htm?pr=d";
      break;
    case 2:   // Image
      $player =  variable_get('shivanode_image_editor', SHIVA_IMAGE_EDITOR);
      break;
    case 3:  // Maps
      $player =  variable_get('shivanode_map_editor', SHIVA_MAP_EDITOR);
      break;
    case 4: // Subway
      $player =  variable_get('shivanode_subway_editor', SHIVA_SUBWAY_EDITOR);
      break;
    case 5: // Timelines
      // removing ability to add simile timelines but calling timeglider editor for any existing ones
      $player =  variable_get('shivanode_timeglider_editor', SHIVA_TIMEGLIDER_EDITOR);
      //$player =  variable_get('shivanode_timeline_editor', SHIVA_TIMELINE_EDITOR);
      break;
    case 6: // Videos
      $player =  variable_get('shivanode_video_editor', SHIVA_VIDEO_EDITOR);
      break;
    case 7:  // Chart
      $player =  variable_get('shivanode_chart_editor', SHIVA_CHART_EDITOR);
      break;
    case 8:  // Controls
      $player =  variable_get('shivanode_control_editor', SHIVA_CONTROL_EDITOR);
      break;
    case 9:  // Canvas
      $player =  variable_get('shivanode_canvas_editor', SHIVA_CANVAS_EDITOR);
      break;
    case 10:  // Network
      $player =  variable_get('shivanode_network_editor', SHIVA_NETWORK_EDITOR);
      break;
    case 11:  // Draw
      $player = variable_get('shivanode_draw_editor', SHIVA_DRAW_EDITOR); 
      break;
    case 12:  // Earth
      $player = variable_get('shivanode_earth_editor', SHIVA_EARTH_EDITOR); 
      break;
    case 13: // Timeglider
      $player =  variable_get('shivanode_timeglider_editor', SHIVA_TIMEGLIDER_EDITOR);
      break;
    case 14: // Poster
      $player =  variable_get('shivanode_poster_editor', SHIVA_POSTER_EDITOR);
      break;
    case 15: // Word Cloud
      $player =  variable_get('shivanode_wcloud_editor', SHIVA_WCLOUD_EDITOR);
      break;
    case 16: // Graph
      $player =  variable_get('shivanode_graph_editor', SHIVA_GRAPH_EDITOR);
      break;
  }
  if (strpos($player, 'http://') === FALSE && $opt > 1) {
    $player = variable_get('shivanode_root_url', SHIVA_ROOT) . $player; 
    $player = $player . '?pr=d';
  }
  $player = preg_replace('/https?\:\/\//', '//', $player); // added 2013-08-19 for Firefox 23 which blocks mixed content in iframes
  return $player;
}

/*
 * _shivanode_node_json($nid): Function called by the menu path 'data/json/%' in shivanode_menu
 * 		This function retreives the node, gets its SHIVA json data and publishes that
 * 		Returned in jsonp format for the new viewer.
 */
function _shivanode_node_json($nid, $display) {
  $pwd = '';
  if(strpos($nid,'-') > -1) {
    $pts = explode('-',$nid);
    $nid = $pts[0];
    $pwd = $pts[1];
  }
  $node = node_load($nid);
  // only return JSON if private, or Drupal has added key for embedded visualizations
  if(_shivanode_get_access($node) == '4' || $pwd == md5($node->title)) { 
    $json = '';
    drupal_add_http_header('Content-Type', 'application/javascript'); // JSONP is actually Javascript
    $json =  _shivanode_get_json($node, FALSE); // FALSE means do NOT return a PHP Object but a JSON string
    if($display == "teaser") {
    	$json = _shivanode_get_json($node, TRUE);
		$json['height'] = variable_get('shivanode_teaser_height', SHIVA_IFRAME_HEIGHT_TEASER);
		$json['width'] = variable_get('shivanode_teaser_width', SHIVA_IFRAME_WIDTH_TEASER);
		$json = json_encode($json);
    }
    $json = 'shivaDataWrapper(' . $json . ')'; // drupal_json_encode means turn a PHP object into JSON text
    echo $json;
  } else {
    echo 'shivaDataWrapper("private" : true)';
  }
}

function _shivanode_search_json($q) {
  //if(!isset($_GET['q']) && !isset($_POST['q']) && !isset($_GET['uid']) && !isset($_POST['uid'])) {
  //  return '{\'msg\': \'Cannot return all nodes. A user or query must be set.\'}';
  //}
  $q = '';
  $uid = '';
  $ntype = '';
  $etype = '';
  if (isset($_GET['q']) || isset($_GET['uid'])) {
    $q = (isset($_GET['q']))?$_GET['q']:'';
    $uid = (isset($_GET['uid']))?$_GET['uid']:'';
    $ntype = (isset($_GET['ntype']))?$_GET['ntype']:'shivanode';
    $etype = (isset($_GET['etype']))?$_GET['etype']:'';
  } 
  elseif (isset($_POST['q']) || isset($_POST['uid'])) {
    $q = (isset($_POST['q']))?$_POST['q']:'';
    $uid = (isset($_POST['uid']))?$_POST['uid']:'';
    $ntype = (isset($_POST['ntype']))?$_POST['ntype']:'shivanode';
    $etype = (isset($_POST['etype']))?$_POST['etype']:'';
  }
  $conditions = array();
  $conditions[] = array(
    'key' => 'n.type',
    'val' => $ntype,
  );
  if ($uid != '') {
    $conditions[] = array(
      'key' => 'n.uid',
      'val' => $uid,
    );
  }
  if ($etype != '') {
    $conditions[] = array(
      'key' => 'n.shivanode_element_type',
      'val' => $etype,
    );
  }
  //echo drupal_json_encode(_shivanode_search($q,$conditions));
}

/*
 * _shivanode_shib_check(): called by the menu item which is called by a JS interval to test 
 * 			if Shibboleth session is still active. If expired, JS popups up an alert
 */
function _shivanode_shib_check() {
  // added user_is_logged_in() for extra security: 2013-08-30. Need to test.
  $status = (user_is_logged_in() && !empty($_SERVER['Shib-Application-ID'])) ? "ok" : "expired"; // Adding check to make sure user is logged in
  $json = '{ "status": "' . $status . '"}';
  drupal_json_output(json_decode($json));
}

/* code initially copied from node_search_execute */
function _shivanode_search($keys = NULL, $conditions = NULL) {
   // Build matching conditions
  $query = db_select('search_index', 'i', array('target' => 'slave'))->extend('SearchQuery')->extend('PagerDefault');
  $query->join('node', 'n', 'n.nid = i.sid');
  $query
    ->condition('n.status', 1)
    ->addTag('node_access')
    ->searchExpression($keys, 'node');
  
  if ($conditions != NULL) {
    foreach ($conditions as $cond) {
      $query->condition($cond['key'], $cond['val']);
    }
  }

  // Insert special keywords.
  $query->setOption('type', 'n.type');
  $query->setOption('language', 'n.language');
  if ($query->setOption('term', 'ti.tid')) {
    $query->join('taxonomy_index', 'ti', 'n.nid = ti.nid');
  }
  // Only continue if the first pass query matches.
  if (!$query->executeFirstPass()) {
    return array();
  }

  // Add the ranking expressions.
  //_node_rankings($query);

  // Load results.
  $find = $query
    ->limit(10)
    ->execute();
  $results = array();
  foreach ($find as $item) {
    // Build the node body.
    $node = node_load($item->sid);
    node_build_content($node, 'search_result');
    $node->body = drupal_render($node->content);

    // Fetch comments for snippet.
    $node->rendered .= ' ' . module_invoke('comment', 'node_update_index', $node);
    // Fetch terms for snippet.
    $node->rendered .= ' ' . module_invoke('taxonomy', 'node_update_index', $node);

    $extra = module_invoke_all('node_search_result', $node);

    $results[] = array(
      'link' => url('node/' . $item->sid, array('absolute' => TRUE)), 
      'type' => check_plain(node_type_get_name($node)), 
      'title' => $node->title, 
      'user' => theme('username', array('account' => $node)), 
      'date' => $node->changed, 
      'node' => $node, 
      'extra' => $extra, 
      'score' => $item->calculated_score, 
      'snippet' => search_excerpt($keys, $node->body),
    );
  }
  return $results;
}


/**
 * Function _shivanode_resource_index: 
 *    Return an array of optionally paged nids baed on a set of criteria.
 *
 * Copied from _node_resource_index in the services/resources/node_resources.inc file.
 * Modified to use "var" instead of "parameters" and to include a tags search on Taxonomy tags
 * 
 * An example request might look like
 *
 * http://domain/endpoint/node?fields=nid,title&var[tags]=India,Temple&parameters[uid]=1
 *
 * This would return an array of objects with only nid and title defined, which
 * have either the tage India or Temple and were created by UID = 1.
 *
 * @param $page
 *   Page number of results to return (in pages of 20).
 * @param $fields
 *   The fields you want returned.
 * @param $var
 *   An array containing fields and values used to build a sql WHERE clause
 *   indicating items to retrieve.
 * @param $page_size
 *   Integer number of items to be returned.
 * @return
 *   An array of node objects.
 *
 * @todo
 *   Evaluate the functionality here in general. Particularly around
 *     - Do we need fields at all? Should this just return full nodes?
 *     - Is there an easier syntax we can define which can make the urls
 *       for index requests more straightforward?
 */
function _shivanode_resource_index($fields, $var, $page, $page_size) {
  module_load_include('inc', 'services', 'services.module');
  $node_select = db_select('node', 't')
    ->addTag('node_access')
    ->orderBy('sticky', 'DESC')
    ->orderBy('created', 'DESC');
    
  // Add type = shivanode
  $node_select->condition('t.type', 'shivanode');
  /* 
  // set type to Shivanode
    if(!isset($var['type'])) {
      $var['type'] = 'shivanode';
    }*/
  
  
  // if var[tags] is set, find all shivanodes with the tid values
  // Just searches in the taxonomy vocabularies. Must do something different for KMAPS

  if (isset($var['tags'])) {
    $tags = $var['tags'];
    $delim = 'or';
    if (is_string($tags) && strpos($tags, ',') > -1 ) {
      $tags = explode(',', $tags); 
    }
    if (is_string($tags) && strpos($tags, '+') > -1 ) {
      $tags = explode('+', $tags);
    }
    $nids = _shivanode_taxterms_to_nids($tags, $delim);
    if (is_array($nids)) {
      if (count($nids) == 0) {
        return $nids; 
      }
      $node_select->condition('t.nid', $nids, 'IN');
    }
  }
  unset($var['tags']);
  // If UID is a true string, it's users name, so find the ID
  if (isset($var['uid']) && !is_numeric($var['uid'])) {
    if ($var['uid'] == 'my') {
      global $user;
      $var['uid'] = $user->uid;
    }
    $snuser = user_load_by_name($var['uid']);
    if (isset($snuser->uid)) {
      $var['uid'] = $snuser->uid;
    }
  }
  
  // Allow for use of fields=all
  if ($fields == 'all') {
    $fields = '*';
  }
  
  $gid = 0;
  // Search for nodes belonging to gid, if Og exists
  if (module_exists('og')) {
    if (isset($var['gid']) || isset($var['gnid']))  {
      // if gid variable is set, looking for a gid
      if (isset($var['gid']) ) {
        $gid = $var['gid'];
        unset($var['gid']); 
      } 
      else { 
        // if gnid is set, looking for a group by nid so convert to gid
        $gnid = $var['gnid'];
        unset($var['gnid']);
        $oggroup = og_get_group('node', $gnid);
        if (isset($oggroup->gid)) {
          $gid = $oggroup->gid;
        }
      }
      $var = '';
      $fields = '*';
      $node_select->join('field_data_group_audience', 'g', 't.nid=g.entity_id');
      $node_select->fields('g', array('group_audience_gid'))
        ->condition('g.group_audience_gid', $gid);
    }
  } 
  
  // Add the Shivanode JSON field to output
  if (strpos($fields, 'json') || $fields == '*') {
    $node_select->join('field_data_shivanode_json', 'j', 't.nid=j.entity_id');
    $node_select->addField('j', 'shivanode_json_value', 'json');
    // take out the json field from the list now that it is dealt with
    $fields = implode(',', _shivanode_array_remove_value(explode(',', $fields), 'json'));
  }
  services_resource_build_index_query($node_select, $page, $fields, $var, $page_size, 'node');

  if (!user_access('administer nodes')) {
    $node_select->condition('status', 1);
  }
  
  $results = services_resource_execute_index_query($node_select);
  $nodes = services_resource_build_index_list($results, 'node', 'nid');
  foreach ($nodes as $node) {
    $node->uri = str_replace('/node/', '/shivanode/', $node->uri) . '.json';
  }
  return $nodes;
}

/*
 * _shivanode_taxterms_to_nids($tags, $delim):
 *     Takes and array of tags and returns nids of shivanodes that match
 *     $tags: an array of various tags
 *      $delim: defaults to 'or', using 'and' will require all tags match in each node
 */ 

function _shivanode_taxterms_to_nids($tags, $delim = 'or') {
  if (!is_array($tags)) {
    $tags = array($tags); 
  }
  $out = array();
  $tids = array();
  
  // Turn Terms into term ids (tids)
  foreach ($tags as $key => $term) {
    $term = strtolower($term);
    $query = db_select('taxonomy_term_data', 't')
      ->fields('t', array('tid', 'name'))
      ->where('LOWER(t.name) = :term', array(':term' => $term));
    $result = $query->execute();
    foreach ($result as $record) {
      $tids[] = $record->tid;
    }
  }
  if (count($tids) == 0 ) {
    return $tids; 
  }
  
  // Find nodes with those terms
  // The basic query
  $query = db_select('field_data_shivanode_tags', 'f')
    ->fields('f', array('entity_id', 'shivanode_tags_tid'));
  if ($delim == 'and') {
    // the 'and' conditions
    foreach ($tids as $n => $tid) {
      $query->condition('f.shivanode_tags_tid', $tid, '=');
    }
  } 
  else {
    // the 'or' condition
    $query->condition('f.shivanode_tags_tid', $tids, 'IN');
  }
  
  // Perform query and put resulting nids in the out array removing duplicates
  $results = $query->execute();
  foreach ($results as $result) {
    $out[] = $result->entity_id;
  }
  return array_unique($out);
}

function _shivanode_array_remove_value($array, $item) {
  $i = -1;
  foreach ($array as $n => $value) {
    if ($value == $item) {
      $i = $n;
      break;
    }
  }
  if ( $i > -1 ) {
    unset($array[$i]);
  }
  return $array;
}

// For the Retreive service of shivanode
//   converts node->shivanode_json['und'][0]['value'] to node->json
function _shivanode_resource_retrieve($nid) {
  $node = node_load($nid);
  if ($node) {
    $uri = entity_uri('node', $node);
    $node->path = url($uri['path'], array('absolute' => TRUE));
    // Unset uri as it has complete entity and this
    // cause never ending recursion in rendering.
    unset($node->uri);
  }
  $node->json = $node->shivanode_json['und'][0]['value'];
  unset($node->shivanode_json);
  
  // add the tag name for each tag id
  if (isset($node->shivanode_tags['und']) && is_array($node->shivanode_tags['und'])) {
    foreach ($node->shivanode_tags['und'] as $n => &$t) {
      $query = db_select('taxonomy_term_data', 't')
        ->fields('t', array('tid', 'name'))
        ->condition('t.tid', $t['tid'], '=');
      $result = $query->execute();
      foreach ($result as $record) {
        $t['name'] = $record->name;
      }
    }
  }
  
  // add the kmap category name for each kmap tag id
  if (isset($node->field_kmap_tags['und']) && is_array($node->field_kmap_tags['und'])) {
    foreach ($node->field_kmap_tags['und'] as $n => &$t) {
      $query = db_select('taxonomy_term_data', 't')
        ->fields('t', array('tid', 'name'))
        ->condition('t.tid', $t['tid'], '=');
      $result = $query->execute();
      foreach ($result as $record) {
        $t['name'] = $record->name;
        $t['done'] = TRUE;
      }
    }
  }
  return $node;
}

function _shivanode_get_element_type($node, $type = "string") {
  if (isset($node->shivanode_element_type)) {
    $options = _shivanode_element_typelist();
    $typenum = intval($node->shivanode_element_type['und'][0]['value']);
    if ($typenum == 5) { $typenum = 13; }
    return ($type == "number" || $type == "num") ? $typenum : $options[$typenum];
  } 
  else {
    return FALSE;
  }
}

function _shivanode_get_json($node, $as_obj = TRUE) {
  if (gettype($node) != "object") {
    $node = node_load($node);
  }
  if (isset($node->shivanode_json)) {
    $eljson = $node->shivanode_json['und'][0]['value'];
    return ($as_obj) ? drupal_json_decode($eljson) : $eljson;
  } 
  else {
    return FALSE;
  }
}

/* _shivanode_get_data_element($source) :
 *    returns the NID of the data entry that the $souce element relies on
 *    $source: is either a $form from the edit page or a NID number
 */
function _shivanode_get_data_element($source) {
  $nid = (is_numeric($source)) ? $source : $source['nid']['#value'];
  $result = db_select('shivanode_links', 'l')
      ->fields('l')
      ->condition('sn_id', $nid, '=')
      ->execute()
      ->fetchCol(2); 
  if (count($result) > 0) {
    return $result[0];
  } 
  else {
    return FALSE;
  }
}

/* _shivanode_get_tags() : 
 * 
 *  Returns an array of tag objects for shivanodes
 * 
 */
function _shivanode_get_tags() {
  $vs = taxonomy_get_vocabularies('shivanode');
  $vids = array();
  foreach ($vs as $voc) {
    if ($voc->module == 'taxonomy') {
      array_push($vids, $voc->vid);
    }
  }
  $size = 60;
  $tags = array();
  $result = db_query_range('SELECT COUNT(*) AS count, td.tid, td.vid, td.name, td.description FROM {taxonomy_term_data} td INNER JOIN {taxonomy_index} tn ON td.tid = tn.tid INNER JOIN {node} n ON tn.nid = n.nid WHERE td.vid IN (' . implode(',', array_fill(0, count($vids), '?')) . ') GROUP BY td.tid, td.vid, td.name, td.description HAVING COUNT(*) > 0 ORDER BY count DESC', 0, $size, $vids);
  foreach ($result as $tag) {
    $tags[$tag->tid] = $tag;
  }
  return $tags;
}

/**
 *  _shivanode_add_gid($gid, $type): Called from the My Data list, this function is connected to the menu url: /data/add/gid/
 *      Adds a Google doc and creates a node from it.
 *      type param is the value of the select drop down defined in _shivanode_types_using_gdocs() funciton that includes all shiva vis that use gdocs
 */
function _shivanode_add_gid($gid = NULL, $type = NULL, $title = NULL) {
  if(!$gid) { drupal_goto('mydata'); }
  $vtype = 'chart';
  $ctype = '';

  $dnode = _shivanode_create_shiva_data_node($title, 'https://docs.google.com/spreadsheet/ccc?key=' . $gid);
  if($type == "popup") {
    $markup = array(
      '#type' => 'markup',
      '#markup' => '<div><p>Loading data ...</p><script type="text/javascript">Drupal.Shivanode.setDataElement(' . $dnode->nid . ', true);</script></div>',
    );
    return $markup;
  }
  if($type < 15) {
    $ctype = _shivanode_types_using_gdocs($type); 
  } else {
    $vtype = strtolower(_shivanode_types_using_gdocs($type));
  }
  
  if($vtype == 'slideshow') { $vtype = 'image'; }
  
  if($ctype == '') {
    drupal_goto('node/add/shivanode/' . $dnode->nid . '/' . $vtype);
  } else {
     drupal_goto('node/add/shivanode/' . $dnode->nid . '/' . $vtype, array(
        'query' => array(
          'ctype' => $ctype,
        ),
     ));
  }
}

/**
 *  _shivanode_add_datanid($gid, $type): Called from the My Data list, this function is connected to the menu url: /data/add/nid/
 *      Redirects to url to form using a data node
 */
function _shivanode_add_datanid($nid = NULL, $type = 11) {
  $vtype = 'chart';
  $ctype = '';

  if($type < 15) {
    $ctype = _shivanode_types_using_gdocs($type); 
  } else {
    $vtype = strtolower(_shivanode_types_using_gdocs($type));
  }
  
  if($vtype == 'slideshow') { $vtype = 'image'; }

  if($ctype == '') {
    drupal_goto('node/add/shivanode/' . $nid . '/' . $vtype);
  } else {
     drupal_goto('node/add/shivanode/' . $nid . '/' . $vtype, array(
        'query' => array(
          'ctype' => $ctype,
        ),
     ));
  }
} 

/* _shivanode_add_data_correspondence($node) :
 *     adds or updates the shivanode_links table with an entry linking the given node with it's data entry
 *    $node: the node being added or updated, when submitted a data_id field is added to the node object with 
 *            the nid of the data entry it is linked to. 
 * 
 *    This function should only be called for shivanodes that are not themselves data entries.
 */
function _shivanode_add_data_correspondence($node) {
  if (isset($node->data_id)) {
    $nid = $node->nid;
    $result = db_select('shivanode_links', 'l')
        ->fields('l')
        ->condition('sn_id', $nid, '=')
        ->execute()
        ->fetchCol(2);
    if ($result) {
      db_update('shivanode_links')
        ->fields(array(
          'data_id' => $node->data_id,
        ))
        ->condition('sn_id', $node->nid, '=')
        ->execute();
    } 
    else if ($node->data_id > 0){
      db_insert('shivanode_links')
        ->fields(array(
          'sn_id' => $node->nid,
          'data_id' => $node->data_id,
          'created' => REQUEST_TIME,
        ))
        ->execute();
    }
  }
}

/*
 * _shivanode_add_datalink: Adds a link to a data entry to a shivanode create/edit form
 *      Requires the form, the data entry id, and a boolean as to whether it is a new node (create) or not (edit)
 */
function _shivanode_add_datalink(&$form, $did, $is_new_el) {
  if (!isset($is_new_el)) {
    $is_new_el = FALSE; 
  }
  $dnode = node_load($did);
  if ($dnode) {
    $form['gdocinfo']['#prefix'] = str_replace('none;', 'block;', $form['gdocinfo']['#prefix']);
    $dataurl = _shivanode_get_dataurl($dnode);
    $datatitle = $dnode->title;
    
    // if it's a new entry use its title for visualizations title
    if ($is_new_el) {
       $form['title']['#default_value'] = str_replace(' (Data)', '', $datatitle); 
    } 
    
    // if it is a  new visualization call JS function to load the data entry data once form is loaded.
    // use 'preset' because this function already sets the markup for the data entry
    // Otherwise, load the data from the Drupal unless told not to
    $jsfunct =  ($is_new_el)?  'Drupal.Shivanode.insertDataElement(\'preset\'); ' : 
              'if(!Drupal.Shivanode.loadJS || Drupal.Shivanode.loadJS == false) { Drupal.Shivanode.setDataSheet(\'' . 
              $dataurl . '\', \'' . $datatitle . '\');}';
    $form['gdocinfo']['script'] = array(
      '#type' => 'markup',
      '#markup' => '<script type="text/javascript">' .
              'jQuery(document).ready(function() {' .
               ' jQuery(\'#shivaEditFrame\').load(function() { ' . $jsfunct . '});' .
              '});' .
          '</script>',
    );

    // Add the form elements display what the linked data entry is with links to reinsert, clear, and edit data.
    $form['gdocinfo']['data_nid'] = array(
      '#type' => 'hidden',
      '#value' => $did,
      '#attributes' => array(
        'id' => 'shivanode_data_nid',
        'name' => 'shivanode_data_nid',
      ),
    );
    $form['gdocinfo']['title_span'] = array(
      '#type' => 'markup',
      '#markup' => '<span id="chosen_data_element_title">' . $datatitle . '</span> ',
    );
    $form['gdocinfo']['url_span'] = array(
      '#type' => 'markup',
      '#markup' => '<span id= "chosen_data_element_url" class="hidden">' . $dataurl . '</span>',
    );
    $form['gdocinfo']['button_div'] = array(
      '#type' => 'markup',
      '#prefix' => '<div id="data_sheet_link_buttons">',
      '#suffix' => '</div>',
    );
    // Link to Edit Google Doc source spreadsheet
    $gupts = explode('key=', $dataurl);
    $gurl = 'https://docs.google.com/spreadsheet/ccc?key=' . $gupts[1]; //$(this).parent().click();
    $form['gdocinfo']['button_div']['edit_gdoc'] = array(
      '#type' => 'markup',
      '#markup' =>  '&nbsp;' . l('<input type="button" value="' . t('Edit Data') . '" onclick="Drupal.Shivanode.dataSheetEdit();" class="form-submit" />', $gurl, array(
        'attributes' => array(
          'target' => '_blank',
          'id' => 'datasheeturl'
        ),
        'html' => true,
      )),
      '#suffix' => ' | ',
    );
    // Link to reinsert Google url into data table.
    $form['gdocinfo']['button_div']['insert_button'] = array(
      '#type' => 'markup',
      '#markup' => '<input type="button" value="' . t('Refresh Data') . '" onclick="Drupal.Shivanode.insertDataElement(\'preset\'); return false;" ' .
        'title="' . t('Insert the Data URL from this link in the form below.') . '" class="form-submit" />',
        '#suffix' => ' | ',
    );
    // The clear link to clear the link from shivanode to data entry.
    $form['gdocinfo']['button_div']['remove_datanid'] = array(
      '#type' => 'button',
      '#value' =>  t('Remove Link to Data'),
      '#attributes' => array(
        'title' => t('Remove the association between this visualization and the data entry that supplies its Data Source URL.'),
        //'class' => array('nobutton'),
      ),
      '#ajax' => array(
        'callback' => '_shivanode_set_to_remove_datainfo',
      ),
    );
  }
}

function _shivanode_node_embed_page($nid) {
	global $base_url, $base_path;
	$node = node_load($nid);
	// Starting code for sharing url pattern: node/###/share
	// example taken from http://papermashup.com/simple-jquery-tabs/
	$bcontent = FALSE;
	$selcontent = '<ul>
					     <li><a href="#tab-cf">Confluence</a></li>
					     <li><a href="#tab-wp">Word Press</a></li>
					     <li><a href="#tab-if">IFrame</a></li>
					     <li><a href="#tab-lk">Link</a></li>
					     <li><a href="#tab-url">URL</a></li>
					     <li><a href="#tab-js">JSON</a></li>
				   </ul>';
    $smtab = '';
	if(module_exists('sharethis')) {
	    // add meta tag for share image
	    // Can also be done through custom JS adding chicklets as outlined on http://support.sharethis.com/customer/portal/articles/475079-share-properties-and-sharing-custom-information
	    // but have been unable to get thumnail and node name to be shared.
	    _shivanode_add_share_meta($node);
	    $block = module_invoke('sharethis', 'block_view', 'sharethis_block');
	    $bcontent = $block['content'];
	    $bcontent = preg_replace('/node\/(\d+)\/share/','node/$1', $bcontent);
	    $bcontent = preg_replace('/stLight.options\(\{"publisher"\:"([^"]+)"/','stLight.options({"publisher":"$1", "onhover":"false", "doNotCopy":"true"', $bcontent);
	    $imgurl = _get_thumb_image($node);
	    $bcontent = preg_replace('/st\_title=""/','st_title="' . $node->title . '" st_image="' . $imgurl . '" ', $bcontent);
	    $selcontent = str_replace('<ul>','<ul><li><a href="#tab-sm">Social Media</a></li>', $selcontent);
		$smtab = '<div id="tab-sm">' . str_replace('display: none;','', $bcontent) . '<p>Click on a button to share this visualization through the desired social media site. <br/> ' .
					'Don\'t see your preferred social media site? Then let us know by <a href="/contact" target="_blank">clicking here</a>.</p></div>';
	}

	$nurl = variable_get('shivanode_chart_viewer', SHIVA_VIEWER) . '?m=' . preg_replace('/https?\:/','', $base_url) . $base_path . 'data/json/' . $nid;
  $nurl = preg_replace('/https?:/', '', $nurl);
	$njson = _shivanode_get_json($nid);
	$width = isset($njson['width'])? $njson['width'] : '800';
	$height = isset($njson['height']) ? $njson['height'] : '800';
 
	$page =  array(
	    'head' => array(
	      '#type' => 'markup',
	      '#prefix' => '<div id="sharetabs">',
	      '#markup' => '<h2>How To Share <i>' . $node->title . '</i></h2>',
	    ),
	   /* 'instructions' => array(
	    	'#type' => 'markup',
	    	'#markup' => '<p>' . t('Choose the format you would like to use and copy the resulting code to your site.') . '</p>',
		),*/

	    'selectors' => array(
	    	'#type' => 'markup',
	    	'#markup' => $selcontent
		),
		'tabsm' => array(
			'#type' => 'markup',
			'#markup' => $smtab
		),
		'tabcf' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-cf"><p>Cut and paste the following macron into the "Wiki Markup" view of your Confluence site page:</p>' .
						'<textarea class="code">{iframe:src=' . $nurl . '|width=' . $width .
						 '|height=' . $height .  '}Your browser does not support iframes{iframe}</textarea>' .
						'<p>For information on other iframe macro parameters see the <a href="http://www.adaptavist.com/display/AtlassianConfluence/iframe+macro" target="_blank">Confluence IFrame Macro Overview</a>.</p> </div>'
						 
						 //
		),
		'tabwp' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-wp"><p>Cut and paste the following code into your Word Press site: </p>' . 
						'<textarea class="code">[iframe src="' . $nurl . '" width="' . $width . '" height="' . $height . '"]</textarea>' .
						'<p>For information on other iframe parameters see the <a href="http://wordpress.org/extend/plugins/iframe/other_notes/" target="_blank">WP IFrame Plugin Notes</a>.</p> </div>'
		),
		'tabif' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-if"><p>Use this HTML code to put an iframe of this visualization on a web page: </p> ' .
							'<textarea class="code"><iframe src="' . $nurl . '" height="' . $height .  '" width="' . $width . '"></iframe></textarea></div>'
		),
		'tablk' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-lk"><p>To link to this visualization on a web page use the following link code: </p>' .
							'<textarea class="code"><a href="' . $nurl . '">' . $node->title .  '</a></textarea></div>'
		),
		'taburl' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-url"><p>The public URL to view this visualization is: </p>' .
							'<p><a href="' . $nurl . '" target="_blank">http:' . $nurl . '</a></p></div>'
		),
		'tabjs' => array(
			'#type' => 'markup',
			'#markup' => '<div id="tab-js"><p>The JSON code that defines this visualization is: </p>' .
							'<textarea class="code">' . prettyJson(json_encode($njson)) . '</textarea></div>'
		),
		'closing' => array(
			'#type' => 'markup',
			'#markup' => '',
			'#suffix' => '</div>',
		),
	);
	return $page;
}


/**
 * Indents a flat JSON string to make it more human-readable.
 *   Taken from: http://www.daveperrett.com/articles/2008/03/11/format-json-with-php/
 */
 
function prettyJson($json) {

    $result      = '';
    $pos         = 0;
    $strLen      = strlen($json);
    $indentStr   = '  ';
    $newLine     = "\n";
    $prevChar    = '';
    $outOfQuotes = true;

    for ($i=0; $i<=$strLen; $i++) {

        // Grab the next character in the string.
        $char = substr($json, $i, 1);

        // Are we inside a quoted string?
        if ($char == '"' && $prevChar != '\\') {
            $outOfQuotes = !$outOfQuotes;

        // If this character is the end of an element,
        // output a new line and indent the next line.
        } else if(($char == '}' || $char == ']') && $outOfQuotes) {
            $result .= $newLine;
            $pos --;
            for ($j=0; $j<$pos; $j++) {
                $result .= $indentStr;
            }
        }

        // Add the character to the result string.
        $result .= $char;

        // If the last character was the beginning of an element,
        // output a new line and indent the next line.
        if (($char == ',' || $char == '{' || $char == '[') && $outOfQuotes) {
            $result .= $newLine;
            if ($char == '{' || $char == '[') {
                $pos ++;
            }

            for ($j = 0; $j < $pos; $j++) {
                $result .= $indentStr;
            }
        }

        $prevChar = $char;
    }

    return $result;
}

function _node_using_data_element($dnid) {
  $results = db_query('shivanode_links', 'l')
      ->condition('data_id', $dnid)
      ->execute()
      ->fetchCol(1);
  return $results;
}

function _shivanode_node_list_popup() {
  global $user;
  $snnodes = _get_shivanodes('nodata');
  $list = array();
  foreach ($snnodes as $n) {

    $list[] = array(
      'nid' => $n->nid,
      'title' => $n->title,
      'type' => _get_shivanode_type($n),
      'uid' => $n->uid,
      'uname' => (user_load($n->uid)->name),
      'owned' => ($user->uid == $n->uid)? TRUE : FALSE
    );
  }
  drupal_json_output($list);
}

// Add meta tag for facebook sharing to include title, desc, and a custom image/icon
function _shivanode_add_share_meta($node) {
  global $base_root, $base_path;
  //$imgurl = 'https://shiva.virginia.edu/sites/shiva/files/shivathumbs/hinduism-in-africa.PNG';
  $imgurl = _get_thumb_image($node);
  $element = array(
    '#tag' => 'meta',
    '#attributes' => array(
       "property" => "og:image",
       "content" => $imgurl,
     ),
  );
  drupal_add_html_head($element, 'og_image');
  
  // Add Meta Title tag
  $element = array(
    '#tag' => 'meta',
    '#attributes' => array(
       "property" => "og:title",
       "content" => $node->title,
     ),
  );
  drupal_add_html_head($element, 'og_title');
  
  // Add Meta Description
  $desc = 'A visualization created with the SHIVA application provided by SHANTI at the University of Virginia (http://shiva.virginia.edu/)';
  if(isset($node->shivanode_description['und'][0])) {
    if($node->shivanode_description['und'][0]['safe_summary'] != '') {
      $desc = trim(strip_tags($node->shivanode_description['und'][0]['safe_summary']));
    } else {
      $desc = trim(strip_tags($node->shivanode_description['und'][0]['safe_value']));
    }
  }
  $element = array(
    '#tag' => 'meta',
    '#attributes' => array(
       "property" => "og:description",
       "content" => $desc,
     ),
  );
  drupal_add_html_head($element, 'og_desc');
  
  // Meta URL
  $url = $base_root . $base_path . 'node/' . $node->nid;
  $element = array(
    '#tag' => 'meta',
    '#attributes' => array(
       "property" => "og:url",
       "content" => $url,
     ),
  );
  drupal_add_html_head($element, 'og_url');
}

function _shivanode_get_access($node) {
  if(isset($node->shivanode_access)) {
    $access = $node->shivanode_access;
    if(isset($access['und'])) {
      if(isset($access['und'][0])) {
        if(isset($access['und'][0]['value'])) {
          return $access['und'][0]['value'];
        }
      }
    }
  }
  return null;
}

function _get_thumb_image($node) {
  global $base_path;
  // Add image meta tag (og:image)
  //  e.g. <meta property="og:image" content="Image url here">
  $imgurl = $base_path . drupal_get_path('module', 'shivanode') . '/images/sn-fb-share-icon.jpg'; // Default url for when there is no thumbnail
  if (isset($node->field_image['und'][0]['uri']) ) {
    $imgurl = file_create_url($node->field_image['und'][0]['uri']);
  } else {
    // Use PagePeeker Thumbnails as a default for sharing.
    $imgurl = 'http://pagepeeker.com/thumbs.php?size=l&url=https://shiva.virginia.edu/node/' . $node->nid;
  }
  return $imgurl;
}

function is_theme($tk) {
  global $theme_key;
  return ($theme_key == $tk) ? TRUE : FALSE ;
} 

function get_theme_info($tk) {
  global $theme_key;
  $themes = list_themes();
  return $themes[$theme_key];
} 

function _shivanode_popup_page($content) {
  drupal_send_headers();
  $out = drupal_render($content);
  print '<html><body>' . $out . '</body></html>';
}

function _shivanode_add_jtree_js() {
  if(module_exists("kmap_taxonomy") === TRUE) {
    $kmappath = drupal_get_path("module","kmap_taxonomy");
    if (strpos($kmappath,'sites') > -1) {
      drupal_add_js($kmappath . "/js/lib/jstree/jquery.jstree.js");
    }
  }
}

function _shivanode_add_ms_metafix() {
  $meta = array(
    '#tag' => 'meta',
    '#attributes' => array(
      "http-equiv" => "X-UA-Compatible",
       "content" => "IE=Edge",
    ),
    '#weight' => '-99999', // To put it first in the head element
  );
  drupal_add_html_head($meta, 'iemetatag');
}

/**
 * Function get Help link
 *    Returns the html link code for the help page depending on the shivanode type value sent to function
 */
function _shivanode_get_help_link($typeVal = 7, $linkStr=FALSE) {
  global $base_root, $base_path;
  $helpurls = array(
      'SHIVA' => 'https://wiki.shanti.virginia.edu/display/KB/SHIVA',
      'Annotated Time Line' =>  'https://wiki.shanti.virginia.edu/x/aAHLAQ',
      'Area Chart' => 'https://wiki.shanti.virginia.edu/x/tgHLAQ',
      'Bar Chart' => 'https://wiki.shanti.virginia.edu/x/HQLLAQ',
      'Candlestick Chart' => 'https://wiki.shanti.virginia.edu/x/MgLLAQ',
      'Chart' => 'https://wiki.shanti.virginia.edu/x/N5y1AQ',
      'Column Chart' => 'https://wiki.shanti.virginia.edu/x/HQLLAQ',
      'Combo Chart' => 'https://wiki.shanti.virginia.edu/x/WQLLAQ',
      'Gauge' => 'https://wiki.shanti.virginia.edu/x/EADLAQ',
      'Geo Chart' => 'https://wiki.shanti.virginia.edu/x/XALLAQ',
      'Line Chart' => 'https://wiki.shanti.virginia.edu/x/tgHLAQ',
      'Motion Chart' => 'https://wiki.shanti.virginia.edu/x/fgLLAQ',
      'Org Chart' => 'https://wiki.shanti.virginia.edu/x/dQDAAQ',
      'Pie Chart' => 'https://wiki.shanti.virginia.edu/x/ZQHLAQ',
      'Scatter Chart' => 'https://wiki.shanti.virginia.edu/x/ZgDGAQ',
      'Table' => 'https://wiki.shanti.virginia.edu/x/tgLLAQ',
      'Tree Map' => 'https://wiki.shanti.virginia.edu/x/g6C1AQ',
      'Draw' => 'https://wiki.shanti.virginia.edu/x/DaC1AQ',
      'Earth' => 'https://wiki.shanti.virginia.edu/x/J5XRAQ',
      'Graph' => '',
      'Image' => 'https://wiki.shanti.virginia.edu/x/VZ21AQ',
      'Map' => 'https://wiki.shanti.virginia.edu/x/cZy1AQ',
      'Network' => 'https://wiki.shanti.virginia.edu/x/o5S1AQ',
      'Poster' => '',
      'Subway' => 'https://wiki.shanti.virginia.edu/x/Wp21AQ',
      'Timeline' => 'https://wiki.shanti.virginia.edu/x/sprRAQ',  // old link to simile instructions: https://wiki.shanti.virginia.edu/x/tZy1AQ
      'Timeglider' => 'https://wiki.shanti.virginia.edu/x/sprRAQ',
      'Video' => 'https://wiki.shanti.virginia.edu/x/upy1AQ',
      'Word Cloud' => ''
  );
  
  $helpStr = 'SHIVA'; 
  if (is_numeric($typeVal)) { 
     $helpStr = _shivanode_options_list($typeVal);
    if ($helpStr == 'Chart') { $helpStr = 'Pie Chart'; }
    if ($helpStr == 'Wcloud') { $helpStr = 'Word Cloud'; }
  } else {
    $helpStr = $typeVal;
  }
  if ($helpStr == "Data" || !array_key_exists($helpStr, $helpurls)) {
    return '';
  } else {
    if($linkStr) {
      return '<a href="' . $helpurls[$helpStr] . '" target="_blank" title="' . str_replace(' visualization type', '', $linkStr) . ' Help" >' . $linkStr . '</a>';
    } else { 
      return '<a class="sn-helplink" href="' . $helpurls[$helpStr] . '" target="_blank" title="' . $helpStr . ' Help" ><img src="' . 
                $base_root . '/' .  drupal_get_path('module','shivanode') . '/images/help-bluer-3d-16px.png" /></a>';
    }
  }
}

/**
 * _shivanode_get_generic_image_info($type): 
 *    A function that returns the variable name for the generic image of a certain type of visualization
 *    These Drupal variables contain the FID for the generic thumbnail for that type of visualization
 *    If $type is set to ALL (default), returns an named array of visualization type/variable name pairs
 *    If $type is set to a particular image type, it returns that variable name if set.
 *    Variables are set in shivanode.install (update 7005)
 * 
 *    The variable names must also be the name of the .png image file of the thumb. Generic Images are set for nodes in shivanode_node_presave($node).
 */
function _shivanode_get_generic_image_info($type = 'ALL') {
  $imgs = array(
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
    'network' => array('label' => t('Network'), 'variable' =>  'sngen-network'),
    'map' => array('label' => t('Map'), 'variable' =>  'sngen-map'),  
    'poster' => array('label' => t('Poster'), 'variable' =>  'sngen-poster'),  
    'subway' => array('label' => t('Subway'), 'variable' =>  'sngen-subway'),  
    'timeline' => array('label' => t('Timeline'), 'variable' =>  'sngen-timeline'),
    'video' => array('label' => t('Video'), 'variable' =>  'sngen-video'),
    'word cloud' => array('label' => t('Word Cloud'), 'variable' =>  'sngen-wcloud'),
  );
  if ($type == 'ALL') {
    return $imgs;
  } else if (isset($imgs[$type]['variable'])) {
    return variable_get($imgs[$type]['variable'], FALSE);
  } else {
    return FALSE;
  }
}
