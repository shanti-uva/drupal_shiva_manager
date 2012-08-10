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
      'label'  => $t('Element Type'),
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
    'shivanode_access' => array(
      'field_name'  => 'shivanode_access',
      'label'  => $t('Privileges'),
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
      'label'       => $t('Shiva Element'),
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
function _shivanode_element_typelist() {
  $options = array(
    1 => t('Data'),
    11 => t('Draw'),
    2 => t('Image'),
    3 => t('Map'),
    10 => t('Network'),
    4 => t('Subway'),
    5 => t('Timeline'),
    6 => t('Video'),
    7 => t('Visualization'),
    /*
    8 => 'Control',
        9 => 'Canvas',*/
  );
  return $options;
}

/**
 * Implements hook_options_list for the options widget of the element type field
 * Returns a structured array defining the values for the chart type list
 *
 * @return
 *  An associative array specifying the values we wish to add for the chart type.
 *  
 */
function _shivanode_options_list($option = NULL) {
  $options = array(
    t('Elements') => array(
      1 => t('Data'),
      11 => t('Draw'),
      2 => t('Image'),
      3 => t('Map'),
      10 => t('Network'),
      4 => t('Subway'),
      5 => t('Timeline'),
      6 => t('Video'),
      7 => t('Visualization'),
    ),
   /*
    t('Other') => array(
         8 => t('Control'),
         9 => t('Canvas'),
       ),*/
   
  );
  if (isset($option)) {
    if (!is_numeric($option)) {
      return "The option index, $option, is not a numeric.";
    }
    $subtype = ($option != 8 && $option != 9) ? t('Elements'):t('Other');
    return $options[$subtype][$option];
  }
  else {
    return $options;
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
    1 => t('Private'),
    //2 => 'Group',
    //3 => 'University',
    4 => t('Public'),
  );
  return $options;
}

/**
 * Helper function that gets all Shiva nodes most recent first
 *
 */

function _get_shivanodes($stype = 0) {
  global $user;
  $uid = $user->uid;
  $query = db_select('node', 'n');
  $query->join('field_data_shivanode_element_type', 'stype', 'n.nid = stype.entity_id');
  $query->fields('n')
    ->fields('stype')
    ->condition('n.type', 'shivanode')
    ->condition('n.status', NODE_PUBLISHED);
  if(strpos($stype,'recent') > -1 ) {
    $query->orderBy('n.changed', 'DESC');
  } else {
    $query->orderBy('n.title', 'ASC');
  }
  // if stype variable is supplied and its a number get only that type of shivanode
  if (is_numeric($stype) && $stype > 0) {
    $query->condition('stype.shivanode_element_type_value', $stype);
  }
  $results = $query->execute();
  $nodes = array();
  foreach ($results as $row) {
    $node = node_load($row->nid);
    if ($node->uid == $uid || _get_shivanode_access_status($node) == "Public" ||  user_access('bypass node access')) {
      if(strpos($stype, "nodata") > -1 ) {
        if(_get_shivanode_type($node) != "Data") {
          $nodes[] = $node;
        }
      } else {
        $nodes[] = $node;
      }
    }
  }
  return $nodes;
}

/*
 * Gets the type of element in the Shiva node
 */
function _get_shivanode_type($node, $mode = 'string') {
  $type = FALSE;
  if ($node && isset($node->shivanode_element_type)) {
    $options = _shivanode_element_typelist();
    $typefield = $node->shivanode_element_type;
    $val = $typefield['und']['0']['value'] * 1;
    $type = ($mode == 'number')? $val : $options[$val];
  }
  return $type;
}

/*
 * Gets the access value (0 = private, 1 = public) of element in the Shiva node
 */
function _get_shivanode_access_status($node) {
  $status = FALSE;
  if ($node && isset($node->shivanode_element_type)) {
    $options = _shivanode_access_modes();
    $accessfield = $node->shivanode_access;
    $val = $accessfield['und']['0']['value'] * 1;
    if(isset($options[$val])) { $status = $options[$val];  }
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
  
	//dpm($form_state, "Form State in original routine");
  $form['shivanode_settings_header'] = array(
    '#markup'=> '<h3>Settings for the Shivanode Module</h3>' .
      '<p>' . t('There are two types of settings for the Shivanode module. The display settings are where one can set ' .
      'the dimensions of the visualizations and whether individual elements can override the default settings. ' .
      'In the URL section the adminitrator can set the URLs for the default players and editors for Shivanodes.') . '</p.',
  );
  
  $form['shivanode_display_settings'] = array(
    '#description' => t('The display settings for SHIVA elements'),
    '#type' => 'fieldset',
    '#collapsible' => TRUE,
    '#collapsed' => FALSE,
    '#title' => t('Display'),
    '#prefix' => '<div id="shiva_settings_form_div">',
    '#suffix' => '</div>',
  );
  
  $form['shivanode_display_settings']['shivanode_default_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Full Display'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_default_height', SHIVA_IFRAME_HEIGHT),
    '#required' => TRUE,
    '#element_validate' => array('_shivanode_size_settings_check', ),
  );
  
  $form['shivanode_display_settings']['shivanode_default_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Full Display'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_default_width', SHIVA_IFRAME_WIDTH),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['shivanode_default_override'] = array(
    '#type' => 'checkbox',
    '#title' => t('Element\'s settings override default settings'),
    '#description' => t('Allows the SHIVA element settings for height and width to override default settings for the full display.'),
    '#default_value' => variable_get('shivanode_default_override', SHIVA_DEFAULT_OVERRIDE),
  );
  
  $form['shivanode_display_settings']['shivanode_edit_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Edit Form'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_edit_height', SHIVA_IFRAME_HEIGHT_EDIT),
    '#required' => TRUE,
    '#element_validate' => array('_shivanode_size_settings_check', ),
  );
  
  $form['shivanode_display_settings']['shivanode_edit_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Edit Form'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_edit_width', SHIVA_IFRAME_HEIGHT_EDIT),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['shivanode_teaser_height'] = array(
    '#type' => 'textfield',
    '#title' => t('Height for Teaser'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_teaser_height', SHIVA_IFRAME_HEIGHT_TEASER),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['shivanode_teaser_width'] = array(
    '#type' => 'textfield',
    '#title' => t('Width for Teaser'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_teaser_width', SHIVA_IFRAME_WIDTH_TEASER),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['shivanode_max_size'] = array(
    '#type' => 'textfield',
    '#title' => t('Maximum size (height or width) for Iframes'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['shivanode_min_size'] = array(
    '#type' => 'textfield',
    '#title' => t('Minimum size (height or width) for Iframes'),
    '#size' => 3,
    '#default_value' => variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM),
    '#required' => TRUE,
  );
  
  $form['shivanode_display_settings']['p'] = array(
    '#type' => 'markup',
    '#markup' => '<p>' . t('Settings to show or hide the underlying JSON of a SHIVA element are found within ') .
      l(t('the indvidual user permisions'), 'admin/people/permissions') . '.</p>',
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
    '#size' => 50,
    '#default_value' => variable_get('shivanode_chart_viewer', SHIVA_VIEWER),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_editor_url'] = array(
    '#type' => 'textfield',
    '#title' => t('Base URL (path) for the SHIVA editors: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_editor_url', SHIVA_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['instructions_1'] = array(
    '#type' => 'markup',
    '#markup' => '<p>' . t('The following fields for the specific SHIVA editors can contain either a full URL includin "http://" or ' . 
                  'just a file name. In the latter case (if the "http://" is not found in the file name), the path provided by the base url for SHIVA editors above ' .
                  'will be prepended to the file name.') . '</p>',
  );
  
  $form['shivanode_url_settings']['shivanode_data_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Data Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_data_editor', SHIVA_DATA_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_draw_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Draw Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_draw_editor', SHIVA_DRAW_EDITOR),
    '#required' => TRUE,
  );
	  
  $form['shivanode_url_settings']['shivanode_image_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Image Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_image_editor', SHIVA_IMAGE_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_map_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Map Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_map_editor', SHIVA_MAP_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_network_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Network Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_network_editor', SHIVA_NETWORK_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_subway_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Subway Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_subway_editor', SHIVA_SUBWAY_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_timeline_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Timeline Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_timeline_editor', SHIVA_TIMELINE_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_video_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Video Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_video_editor', SHIVA_VIDEO_EDITOR),
    '#required' => TRUE,
  );
    
  $form['shivanode_url_settings']['shivanode_chart_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Visualization (chart) Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_chart_editor', SHIVA_CHART_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_control_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Control Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_control_editor', SHIVA_CONTROL_EDITOR),
    '#required' => TRUE,
  );
  
  $form['shivanode_url_settings']['shivanode_canvas_editor'] = array(
    '#type' => 'textfield',
    '#title' => t('Name of the Canvas Editor File: '),
    '#size' => 50,
    '#default_value' => variable_get('shivanode_canvas_editor', SHIVA_CANVAS_EDITOR),
    '#required' => TRUE,
  );
      
  $form['actions']['default_values'] = array(
    '#type' => 'button',
    '#value' => t('Reset Default Settings'),
  /*  '#submit' => array('_shivanode_settings_default_values'),
    '#ajax' => array(
      'callback' => '_shivanode_settings_default_values',
      'wrapper' => 'shiva_settings_form_div',
      'effect' => 'slide',
    ),*/
    '#weight' => 20,
  );
  
  return system_settings_form($form);
}

/*
 * A function to reset the default values in the Shivanode settings form
 * Uses constants set at the top of shivanode.module
 * 
 */
function _shivanode_admin_settings_validate($form, &$form_state) {
	if($form_state['triggering_element']['#id'] == 'edit-default-values') {
		_shivanode_settings_default_values($form_state);
	}
} 

/*
 *  _shivanode_settings_default_values(&$form_state) : called by the shivanode admin settings validation routine
 * 						when the "reset" button is pressed. Resets all values to default ~~in the form only~~
 * 						Reset settings must be saved to tke effect and a warning to that effect is given.
 */
function _shivanode_settings_default_values(&$form_state) {
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
  
  // Viewer and Editor URLS
  $form_state['input']['shivanode_chart_viewer'] = SHIVA_VIEWER;
  $form_state['input']['shivanode_editor_url'] = SHIVA_EDITOR;
  $form_state['input']['shivanode_chart_editor'] = SHIVA_CHART_EDITOR;
  $form_state['input']['shivanode_data_editor'] = SHIVA_DATA_EDITOR;
  $form_state['input']['shivanode_draw_editor'] = SHIVA_DRAW_EDITOR;
  $form_state['input']['shivanode_image_editor'] = SHIVA_IMAGE_EDITOR;
  $form_state['input']['shivanode_map_editor'] = SHIVA_MAP_EDITOR;
  $form_state['input']['shivanode_network_editor'] = SHIVA_NETWORK_EDITOR;
  $form_state['input']['shivanode_subway_editor'] = SHIVA_SUBWAY_EDITOR;
  $form_state['input']['shivanode_timeline_editor'] = SHIVA_TIMELINE_EDITOR;
  $form_state['input']['shivanode_video_editor'] = SHIVA_VIDEO_EDITOR;
  $form_state['input']['shivanode_control_editor'] = SHIVA_CONTROL_EDITOR;
  $form_state['input']['shivanode_canvas_editor'] = SHIVA_CANVAS_EDITOR;
	
	drupal_set_message(t('All values have been reset to their default'));
	drupal_set_message(t('Configuration must be saved to take effect.'), 'warning');
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
 * Callback for menu node/spreadsheets.
 *
 * Tests if any google docs logon info is stored either 1. in a session variable or
 *   2. in the user's data and if it is displays a list of spreadsheets (_shivanode_spreadsheet_list)
 *   otherwise displays a logon form (_shivanode_google_login_form)
 *
 * @return renderable array from function
 */

function _shivanode_gss_form($form, &$form_state) {
  _shivanode_check_google_login();
  drupal_set_title('Spreadsheet Data');

  // Print out a list of spreadsheets using that client.
  $page = array();
  $sslists = _shivanode_get_spreadsheet_list();
  
  if($sslists === FALSE) {
    $form['error'] = array(
      'header' => array(
        '#markup' => '<h2>Problem Accessing Information</h2>',
      ),
      'p0' => array(
        '#markup' => '<p><b>Unexpected Exception Thrown:</b> ' . $msg .  '</p>',
      ),
      'p1' => array(
        '#markup' => '<p><b>Session Token:</b> ' . $_SESSION['gdoc_token'] .  '</p>',
      ),
      'backlink' => array(
        '#markup' => '<p>' . l('Try Again?', 'node/spreadsheets') . '</p>',
      ),
    );
    
    return $form;
    
  } else {
      
    // Create a checkable list of spreadsheets that can be converted into data elements
    $avail_list = $sslists[0];
    // Create a list of Spreadsheets that already have elements associated with them
    $hasels = $sslists[1];
    $total_sheets = count($avail_list) + count($hasels);
    
    $ssStr = ($total_sheets == '1')?'spreadsheet':'spreadsheets';
    $form['#prefix'] = '<div class="shivanode_google_spreadsheets">';
    $form['#suffix'] = '</div>';
    // Link to google reauthentication>
    $form['p0'] = array(
      '#type' => 'markup',
      '#markup' => '<p id="guser-reset">' .
        l(t('Switch Google Account'), 'node/guser/reset/confirm', array(
          'attributes' => array(
            'target' => '_top',
          )
        )) . '</p>',
    );
    
    // View All Shiva Elements Link
    $form['viewall'] = array(
      '#type' => 'markup',
      '#markup' => '<div class="bold">' . l(t('View All SHIVA Data Elements'), 'node/data-elements', array(
        'attributes' => array(
          'target' => '_top',
        )
      )) . '</div>',
    );
    
    // Instructions
    $form['intro'] = array(
      '#type' => 'markup',
      '#markup' => '<p>' . t('To create a SHIVA Element using a Google Doc spreadsheet, you must first import that spreadsheet into Shiva to make it into a Shiva data element. The present page has two sections:  Shiva Data Elements, which shows already imported spreadsheets for the Goolge account to which you are currently logged in; and (ii) "My Remaining Google Spreadsheets", which shows your other Google spreadsheets that are available for importation into Shiva. In the first section, you choose one of the Shiva data elements as the base for creating a new Shiva visualization. In the second section, you can import one of your other Google spreadsheets into Shiva, after which it will then appear in the first section, and you can use it as the basis of a visualization. To convert a Google spreadsheet into a Shiva element, check the box next to the spreadsheets you wish to convert into data elements and when you click the button "Create Data Elements" at the bottom, data elements for each of those spreadsheets will be created. If you wish to log on to a different Google Doc account, click the "Switch Google Account" button above.') . '</p>' .
                    '<p>' . t('Finally, the link "View All Shiva Data Elements" above will show you other people&rsquo;s data elements that they have shared with you or a group of which you are part, rather than only showing Shiva data elements that you personally created.') . '<p>',
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
      '#title' => t('SHIVA Data Elements (Already Imported Spreadsheets)'),
      '#collapsible' => TRUE,
    );
    
    if(count($hasels) > 0) {
      $form['gss_done']['p'] = array(
        '#type' => 'markup',
        '#markup' => '<p>' . t('The following ' . count($hasels) . ' spreadsheets from your Google Docs account have ' .
          'already been added as data elements. Click on the "Select" option to create a visualization from it: ') . '</p>',
      );
      $form['gss_done']['ul'] = array(
        '#type' => 'markup',
        '#prefix' => '<ul>',
        '#suffix' => '</ul>',
      );
      $list = '';
      foreach($hasels as $el) {
        $enode = node_load($el['nid']);
        $targetTopAttr = array(
          'attributes' => array(
            'target' => '_top',
          )
        );
        $form['gss_done']['ul'][] = array(
          '#type' => 'markup',
          '#markup' => '<li>' . $el['title'] . ' (' . 
             l(t('Select'), 'node/add/shivanode/' . $el['nid'], $targetTopAttr) . ' | ' .
             l(t('View'), 'node/' . $el['nid'], $targetTopAttr) . ' | ' .
             l(t('Edit'), 'node/' . $el['nid'] . '/edit', $targetTopAttr) .  ')</li>',
        );
      }
    } else {
      $form['gss_done']['p'] = array(
        '#type' => 'markup',
        '#markup' => '<p>' . t('You have not added any spreadsheets from the presently logged in Google Docs account. Choose from among ' .
          'your spreadsheets listed below those you would like to make into data elements.') . '</p>',
      );
    }
    
    // Fieldset for Checkboxes
    $form['gss_list'] = array(
      '#type' => 'fieldset',
      '#title' => t('My Remaining Google Spreadsheets'),
      '#collapsible' => TRUE,
      '#description' => t('Choose from among the ' . ((count($hasels) > 0)?'remaining ': '') . count($avail_list) . ' spreadsheets in your Google Docs account ' .
        'which ones you would like to make into data elements:'),
    );
    
    // Create Checkboxes
    $form['gss_list']['choices'] = array(
      '#type' => 'markup',
      '#prefix' => '<ul class="shivanode-spreadsheets">',
      '#suffix' => '<ul>',
    );
    
    $alct = -1;
    foreach($avail_list as $key =>$value) {
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
      $form['gss_list']['choices'][$alct]['cbox' . $alct] = array(
        '#type' => 'checkbox',
        '#prefix' => '<span class="list-checkbox">',
        '#suffix' => '</span>',
        '#title' => $value,
        '#default_value' => $key,
      );
    }
    
    // The Submit button
    $form['submit'] = array(
      '#type' => 'submit',
      '#value' => t('Create Data Elements'),
      '#prefix' => '<p>',
      '#suffix' => '</p>',
    );
    return $form;
  }
}

function _shivanode_get_spreadsheet_list() {
  try {
    // Create an authenticated HTTP Client to talk to Google.
    $client = Zend_Gdata_AuthSub::getHttpClient($_SESSION['gdoc_token']);
    // Get google doc info and display using ZEND
    $spreadsheet_service = new Zend_Gdata_Spreadsheets($client);
    $feed = $spreadsheet_service->getSpreadsheetFeed();
    // Get Spreadsheet list from Feed and create an array
    $sslist = array();
    foreach ($feed->entries as $entry) {
      $value = $entry->getTitleValue();
      $key   = $entry->getLink('alternate')->getHref();
      $sslist[$key] = $value;
    }
    // Call _shivanode_filter_gss_list() to separate list between those
    //    spreadsheets that have data elements associated with them [1]
    //    and those that do not already have data elements [0]
    return _shivanode_filter_gss_list($sslist);
  } catch (Exception $e) {
    $msg = $e->getMessage();
    drupal_set_message($msg,'error');
    return false;
  }
}

function _shivanode_filter_gss_list($sslist) {
  global $user;
  $noelement = array();
  $haselement = array();
 
  $msg = '';
  foreach($sslist as $url => $title) {
    // Get all Shiva Data elements from Database
    $query = db_select('node', 'n');
    $query->join('field_data_shivanode_element_type','t','n.nid=t.entity_id');
    $query->join('field_data_shivanode_access','a','n.nid=a.entity_id');
    $query->join('field_data_shivanode_json','j','n.nid=j.entity_id');
    $query
      ->fields('n', array('nid', 'type', 'title', 'created', 'uid'))
      ->fields('a', array('shivanode_access_value'))
      ->fields('t', array('shivanode_element_type_value'))
      ->fields('j', array('shivanode_json_value'))
      ->condition('n.type', 'shivanode', '=')
      ->condition('t.shivanode_element_type_value', 1, '=');
    $gkey = substr($url,strpos($url,'?'));
    $result = $query->execute();
    $found = 0;
    $nid = '';
    // Iterate through all data elements and see if one is based on this google doc ($url)
    foreach ($result as $record) {
      $json = $record->shivanode_json_value;
      // If the google key is within the data element's json then that spreadsheet has been added.
      if(strpos($json,$gkey) > -1) {
        // but add the record to the already added list only if the user owns this data element.
        if($record->uid == $user->uid) {
          $nid = $record->nid;
          $found = 1;
          break;
        }
      }
    }
    if($found) {
      $haselement[] = array(
          'nid' => $nid,
          'url' => $url,
          'title' => $title,
      );
    } else {
      $noelement[] = $title . "_URL:" . $url;
    }
  }
  asort($noelement);
  // split no element items into keyed array
  $avail_list = array();
  foreach($noelement as $item) {
    $pts = explode('_URL:', $item);
    $avail_list[$pts[1]] = $pts[0];
  }
  usort($haselement, 'cmpHasEls');
  return array($avail_list,$haselement);
}

function cmpHasEls($a, $b) 
{
  if($a['title'] < $b['title']) {
    return -1;
  } else if ($a['title'] == $b['title']) {
    return 0;
  } else {
    return 1;
  }
}

/**
 * Function _shivanode_gss_form_submit($form, &$form_state):
 * 
 * called upon submission of the gss_form which lists one's google
 * spreadsheets with checkboxes. For each ss checked in that form this function
 * will create a Shiva data element with title and URL.
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
    $ind = str_replace(array('access','cbox'),'',$key);
    $subind = preg_replace('/\d+/','',$key);
    $values[$ind][$subind] = intval($val);
  }
  $choices = $form_state['complete form']['gss_list']['choices'];
  foreach(array_keys($values) as $key) {
    if(is_numeric($key)) {
      $values[$key]['title'] = $choices[$key]['cbox' . $key]['#title'] . ' (Data)';
      $values[$key]['url'] = $choices[$key]['cbox' . $key]['#default_value'];
    }
  }
  
  // Filter the $values array created above to $pick which contains only checked options
  $picks = array();
  foreach($values as $key => $item) {
    if(isset($item['cbox']) && intval($item['cbox']) == 1) {
      $picks[$key] = $item;
    }
  }

  // Now iterate through the picks and create a node for each
  $out = ""; // For the resulting message after form processing.
  $nct = 0;
  foreach($picks as $pick) {
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
    $body_text = 'Shiva data element created from Google spreadsheet on ' . date('c');
    $node->body[$node->language][0]['value']   = $body_text;
    $node->body[$node->language][0]['summary'] = text_summary($body_text);
    $node->body[$node->language][0]['format']  = 'filtered_html';
    // access returns 0 = private, 1 = public, but those are 1 and 4 respectively in options array
    $node->shivanode_access[$node->language][0]['value'] = (intval($pick['access']) == 1)?4:1; // 4 = public, 1 = private
    $node->shivanode_json[$node->language][0]['value'] = $snjson;
    node_save($node);
    $nct++;
  }
  // Output message about which spreadsheets have been turned into data elements.
  $out = $nct . ' data elements have been created!'; 
  drupal_set_message($out);
}

/*
 * _shivanode_check_google_login($authenticate) : Checks whether you are logged into and authenticated in your google account
 *      if $authenticate is TRUE, then it logs you in
 *      else it returns false
 */
function _shivanode_check_google_login($authenticate = TRUE) {
  if (!isset($_SESSION['gdoc_token'])) {
      if (isset($_GET['token'])) {
        // Converting single-use token to a session token.
        $session_token = Zend_Gdata_AuthSub::getAuthSubSessionToken($_GET['token']);
        // Store the session token in session.
        $_SESSION['gdoc_token'] = $session_token;
      } else {
        if(!$authenticate) { return FALSE; } // if just testing, return false
        // Display link to generate single-use token
        $gdocs = 'http://spreadsheets.google.com/feeds/';
        $google_uri = Zend_Gdata_AuthSub::getAuthSubTokenUri(
            'http://' . $_SERVER['SERVER_NAME'] . request_uri(),
            $gdocs, 0, 1);
        drupal_goto($google_uri);
      }
  }
  return TRUE;
}

/**
 * _shivanode_data_elements: Lists all data elements for inclusion in lightbox popup
 *     when icon on a shiva edit page is clicked to use a data element for a visualization,
 *      this function produces the content displayed in a popup for choosing which data element
 *
 */
function _shivanode_data_elements($form, &$form_state) {
  global $user;
  
  $markup = array(
    '#prefix' => '<div id="data-element-popup">',
    '#suffix' => '</div>',
  );
  
  $markup['instruct'] = array(
    '#type' => 'fieldset',
    '#title' => t('Instructions'),
    '#collapsible' => TRUE,
    '#collapsed' => TRUE,
    '#attributes' => array(
      'class' => array(
        'collapsible',
        'form-wrapper',
      ),
    )
  );
  
  $markup['instruct']['p'] = array(
    '#type' => 'markup',
    '#markup' => '<p>' . t('This list allows you to specify the data that you would like to call upon for the Shiva visualization on which you are currently working. ' . 
                            'Shiva visualizations draw upon Shiva Data elements, which are typically created from Google Doc spreadsheets. ' .
                            'The first section of this page shows you Shiva Data elements that you have personally created and also allows you see Shiva ' .
                            'Data elements others have created and shared with groups to which you belong.  ' .
                            'The second section of this page shows your Google spreadsheets that you have not yet added. ' .
                            'To make a visualization from one of these spreadsheets, choose the radio button next to it ' .
                            'and click the &lsquo;Add Spreadsheet&rsquo; button.') . '</p>',
  );
    
  if(!_shivanode_check_google_login(FALSE)) {
    $markup['addbutton'] = array(
      '#prefix' => '<div class="addspreadsheet-button"><span>',
      '#markup' => l('Authenticate Google Account', 'data/spreadsheets', array(
                      'attributes' => array(
                        'target' => '_top',
                        'class' => 'shiva-button',
                      )
                    )),
       '#suffix' => ' </span></div>',
    );
  } else {
  	$markup['filterdiv'] = array(
      '#prefix' => '<div id="addspreadsheet-filter"><span class="label">' . t('Filter') . ': </span>',
      '#suffix' => '</div>',
    );
	$markup['filterdiv']['input'] = array(
		'#type' => 'markup',
		'#markup' => '<input id="ssfilter" onkeyup="javascript: Drupal.Shivanode.filterSsList(this);" type="text" name="input" 
						value="" size="15" title="Filter data sets by words in title (case-sensitive)"></input>',
	);
  }
  $markup['existing'] = array(
    '#type' => 'fieldset',
    '#title' => t('Existing Data Elements'),
    '#collapsible' => TRUE,
  );
  
  $markup['existing']['sntoggle'] = array(
    '#markup' =>'<p id="sntoggle"><input type="checkbox" onclick="javascript:jQuery(\'#shivanodelist li.othernode, #shivanodelist .uname\').toggle();"/>&nbsp;' . t('View Others') . '&rsquo; ' . t('Public Data Elements') . '<p/>',
  );
  
  $markup['existing']['snlist'] = array(
    '#prefix' => '<ul id="shivanodelist">',
    '#suffix' => '</ul>',
  );
  
  $nodes = _get_shivanodes(1); // get all shivanode that are data elements (type = 1)
  $lict = 0;
  foreach($nodes as $node) {
    $csscode = ($user->uid == $node->uid)? 'mynode"' : 'othernode" style="display:none;"';
    $nuser = user_load($node->uid);
    if (node_access('view', $node)) {
      $lict++;
      $limarkup = '<li class="' . $csscode . '>'  . l($node->title, 'node/' . $node->nid, array(
        'attributes' => array(
          'target' => '_top',
        ),
      )) . '<span class="uname" style="display: none;">&nbsp;by ' . $nuser->name . '</span> (';
      $limarkup .= '<a class="link" onmousedown="Drupal.Shivanode.setDataElement(\''.  $node->nid . 
                    '\', true);">' . t('Select') . '</a>';
      if (node_access('update', $node)) {
        $limarkup .=  ' | ' . l(t('Edit'), 'node/' . $node->nid . '/edit', array(
          'attributes' => array(
            'target' => '_top',
          ),
        ));
      }
      $limarkup .= ')</li>';
      $markup['existing']['snlist']['li' . $lict] = array(
        '#markup' => $limarkup,
      );
    }
  }
  
  if(_shivanode_check_google_login(FALSE)) {
    $sslists = _shivanode_get_spreadsheet_list();
    $gsheets = $sslists[0];
    $markup['spreadsheets'] = array(
      '#type' => 'fieldset',
      '#title' => t('Remaining Google Spreadsheets'),
      '#description' => t('Choose from one of your remaining @num Google spreadsheets to create a visualization from it:', array('@num' => count($gsheets))),
      '#collapsible' => TRUE,
    );
    $markup['spreadsheets']['newss'] = array(
      '#type' => 'radios',
      '#options' => $gsheets,
    );
    $markup['spreadsheets']['sumbitss'] = array(
      '#type' => 'submit',
      '#value' => t('Add Spreadsheet'),
    );
  }
  
  return $markup;
}

/*
 * _shivanode_data_elements_submit($form, &$form_state) : Called when the "Add Spreadsheet" button in the 
 *      shivanode data element form is pressed, only when adding a previously unused spreadsheet.
 *      This function creates the data node for the spreadsheet and then redirects the form (which is in a popup window)
 *      to the data node with a query of insert=nid, e.g. /node/123?insert=123. This triggers the javascript in the popup 
 *      to send an html5 message to the parent base page to insert the new data element and then closes the popup.
 */
function _shivanode_data_elements_submit($form, &$form_state) {
  $ssurl = $form_state['values']['newss'];
  $sstitle = $form_state['complete form']['spreadsheets']['newss'][$ssurl]['#title'] . ' (Data)';
  $ssurl = str_replace('spreadsheets.google.com/ccc','docs.google.com/spreadsheet/ccc',$ssurl);
  $newel = new stdClass();
  $newel->type = 'shivanode';
  node_object_prepare($newel);
  $newel->title = $sstitle;
  $newel->language  = LANGUAGE_NONE;
  $newel->shivanode_description[$newel->language][0]['value']   = 'Added programmatically in order to create a visualization';
  $newel->shivanode_element_type[$newel->language][0]['value'] = 1;
  $newel->shivanode_access[$newel->language][0]['value'] = 1;
  $newel->shivanode_json[$newel->language][0]['value'] = '{"dataSourceUrl":"' . $ssurl . '","title":"' . $sstitle . '","shivaId":"0","shivaMod":"' . 
      date('D, j F Y') . '","shivaGroup":"Data"}';
  node_save($newel);
  $form_state['redirect'] = array(
    'node/' . $newel->nid,
    array(
      'query' => array(
        'insert' => $newel->nid,
      ),
    ),
  );
}

/*
 *   _shivanode_get_dataurl($node) : a function that when given a shivanode node object returns the dataSourceURL within it
 */
function _shivanode_get_dataurl($node) {
  $result = FALSE;
  if(isset($node->shivanode_json)) {
    $jsonStr = $node->shivanode_json['und'][0]['value'];
    $json = json_decode($jsonStr);
    if(isset($json->dataSourceUrl)) {
      $result = $json->dataSourceUrl;
    }
  }
  return $result;
}

/*
 * function _shivanode_set_to_remove_datainfo($form, $form_state): adds hidden element to trigger removal of data element upon saving.
 * 
 */

function _shivanode_set_to_remove_datainfo($form, $form_state) {
  $actions = array();
  // $gdinfo is the section of the form that has the info about the linked google spreadsheet
  $gdinfo = $form['gdocinfo'];
  $gdinfo['#prefix'] = '<div id="data_sheet_in_use" style="display: block; clear: both;" class="messages status">';
  unset($gdinfo['script']);
  unset($gdinfo['data_nid']);
  // If it's during the creation of a new element, one message
  if($form['#action'] == '/node/add/shivanode') {
    $gdinfo['span']['#markup'] = '<span>' . t('No data element will be linked to this one.') . '</span>';
    $gdinfo['button_div'] = array();
  // otherwise if editing an existing element, another message and ...
  } else {
    $gdinfo['span']['#markup'] = '<span>' . t('Link to data element:') . '</span>';
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
  $actions[] = ajax_command_remove('#shivanode_data_nid'); // remove hidden value to link to another data element from form
  return array('#type' => 'ajax', '#commands' => $actions);
}

/*
 * _shivanode_remove_datalink($node) : a function to remove the link between a shiva node element and a data element
 * 
 */
function _shivanode_remove_datalink($node) {
  if($node->type == 'shivanode') {
    $nid = $node->nid;
    $results = db_select('shivanode_links', 'sl')
      ->fields('sl')
      ->condition('sn_id', $nid)
      ->execute()
      ->fetchCol(0);
    if(count($results) == 0) { return;  }
    $num_deleted = db_delete('shivanode_links')
      ->condition('sn_id', $nid)
      ->execute();
    if($num_deleted == 1) {
      drupal_set_message(t('Link to data element removed.'));
    } else {
      drupal_set_message(t('More than one link (' . $num_deleted . ') to data elements from node ' . $nid . ' removed!'),'error');
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
  if(isset($_SESSION['gdoc_token'])) { unset($_SESSION['gdoc_token']); }
  drupal_set_message(t('Google account authorization has been reset.'));
  drupal_goto('data/spreadsheets');
}

function _get_shivaframe_url($opt) {
  if(is_array($opt)) { $opt = $opt[0]; } // if it's an array take first element value
	if(!is_numeric($opt)) { $opt = 7; } // default is visualization
	switch($opt) {
		case 1:  // Data
      $player = variable_get('shivanode_data_editor', SHIVA_DATA_EDITOR); //"$otherroot/data.htm?pr=d";
			break;
		case 2: 	// Image
			$player =  variable_get('shivanode_image_editor', SHIVA_IMAGE_EDITOR);
			break;
		case 3:  // Maps
			$player =  variable_get('shivanode_map_editor', SHIVA_MAP_EDITOR);
			break;
		case 4: // Subway
			$player =  variable_get('shivanode_subway_editor', SHIVA_SUBWAY_EDITOR);
			break;
		case 5: // Timelines
			$player =  variable_get('shivanode_timeline_editor', SHIVA_TIMELINE_EDITOR);
			break;
		case 6: // Videos
			$player =  variable_get('shivanode_video_editor', SHIVA_VIDEO_EDITOR);
			break;
		case 7:  // Visualization
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
      $player = variable_get('shivanode_drawditor', SHIVA_DRAW_EDITOR); 
			break;
	}
	if(strpos($player,'http://') === false) {  $player = variable_get('shivanode_editor_url', SHIVA_EDITOR) . $player; }
  $player = $player . '?pr=d';
  return $player;
}

/*
 * _shivanode_node_json($nid): Function called by the menu path 'data/json/%' in shivanode_menu
 * 		This function retreives the node, gets its SHIVA json data and publishes that
 * 		Returned in jsonp format for the new viewer.
 */
function _shivanode_node_json($nid) {
  $node = node_load($nid);
  $json =  _shivanode_get_json($node, FALSE); // FALSE means do NOT return a PHP Object but a JSON string
	$json = 'shivaDataWrapper(' . $json . ')'; // drupal_json_encode means turn a PHP object into JSON text
	drupal_add_http_header('Content-Type', 'application/javascript'); // JSONP is actually Javascript
  echo $json;
}

function _shivanode_search_json($q) {
  //if(!isset($_GET['q']) && !isset($_POST['q']) && !isset($_GET['uid']) && !isset($_POST['uid'])) {
  //  return '{\'msg\': \'Cannot return all nodes. A user or query must be set.\'}';
  //}
  $q = '';
  $uid = '';
  $ntype = '';
  $etype = '';
  if(isset($_GET['q']) || isset($_GET['uid'])) {
    $q = (isset($_GET['q']))?$_GET['q']:'';
    $uid = (isset($_GET['uid']))?$_GET['uid']:'';
    $ntype = (isset($_GET['ntype']))?$_GET['ntype']:'shivanode';
    $etype = (isset($_GET['etype']))?$_GET['etype']:'';
  } else if (isset($_POST['q']) || isset($_POST['uid'])) {
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
	$status = (!empty($_SERVER['Shib-Application-ID'])) ? "ok" : "expired";
	$json = '{ "status": "' . $status . '"}';
	drupal_json_output($json);
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
  
  if($conditions != NULL) {
    foreach($conditions as $cond) {
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
  $node_select->condition('t.type','shivanode');
  /*
  // set type to Shivanode
    if(!isset($var['type'])) {
      $var['type'] = 'shivanode';
    }*/
  
  
  // if var[tags] is set, find all shivanodes with the tid values
  // Just searches in the taxonomy vocabularies. Must do something different for KMAPS

  if(isset($var['tags'])) {
    $tags = $var['tags'];
    $delim = 'or';
    if(is_string($tags) && strpos($tags,',') > -1 ) { $tags = explode(',',$tags); }
    if(is_string($tags) && strpos($tags,'+') > -1 ) { $tags = explode('+', $tags);}
    $nids = _shivanode_taxterms_to_nids($tags, $delim);
    if(is_array($nids)) {
      if(count($nids) == 0) { return $nids; }
      $node_select->condition('t.nid', $nids, 'IN');
    }
  }
  unset($var['tags']);
  // If UID is a true string, it's users name, so find the ID
  if(isset($var['uid']) && !is_numeric($var['uid'])) {
    if($var['uid'] == 'my') {
      global $user;
      $var['uid'] = $user->uid;
    }
    $snuser = user_load_by_name($var['uid']);
    if(isset($snuser->uid)) {
      $var['uid'] = $snuser->uid;
    }
  }
  
  // Allow for use of fields=all
  if($fields == 'all') {
    $fields = '*';
  }
  
  $gid = 0;
  // Search for nodes belonging to gid, if Og exists
  if(module_exists('og')) {
    if(isset($var['gid']) || isset($var['gnid']))  {
      // if gid variable is set, looking for a gid
      if (isset($var['gid']) ) {
        $gid = $var['gid'];
        unset($var['gid']); 
      } else { 
        // if gnid is set, looking for a group by nid so convert to gid
        $gnid = $var['gnid'];
        unset($var['gnid']);
        $oggroup = og_get_group('node', $gnid);
        if(isset($oggroup->gid)) {
          $gid = $oggroup->gid;
        }
      }
      $var = '';
      $fields = '*';
      $node_select->join('field_data_group_audience', 'g', 't.nid=g.entity_id');
      $node_select->fields('g', array('group_audience_gid'))
        ->condition('g.group_audience_gid',$gid);
    }
  } 
  
  // Add the Shivanode JSON field to output
  if(strpos($fields,'json') || $fields == '*') {
    $node_select->join('field_data_shivanode_json','j', 't.nid=j.entity_id');
    $node_select->addField('j','shivanode_json_value','json');
    // take out the json field from the list now that it is dealt with
    $fields = implode(',',_shivanode_array_remove_value(explode(',',$fields), 'json'));
  }
  services_resource_build_index_query($node_select, $page, $fields, $var, $page_size, 'node');

  if (!user_access('administer nodes')) {
    $node_select->condition('status', 1);
  }
  
  $results = services_resource_execute_index_query($node_select);
  $nodes = services_resource_build_index_list($results, 'node', 'nid');
  foreach($nodes as $node) {
    $node->uri = str_replace('/node/','/shivanode/',$node->uri) . '.json';
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
  if(!is_array($tags)) { $tags = array($tags); }
  $out = array();
  $tids = array();
  
  // Turn Terms into term ids (tids)
  foreach($tags as $key => $term) {
    $term = strtolower($term);
    $query = db_select('taxonomy_term_data','t')
      ->fields('t', array('tid', 'name'))
      ->where('LOWER(t.name) = :term', array(':term' => $term));
    $result = $query->execute();
    foreach ($result as $record) {
      $tids[] = $record->tid;
    }
  }
  if(count($tids) == 0 ) { return $tids; }
  
  // Find nodes with those terms
  // The basic query
  $query = db_select('field_data_shivanode_tags','f')
    ->fields('f', array('entity_id', 'shivanode_tags_tid'));
  if($delim == 'and') {
    // the 'and' conditions
    foreach($tids as $n => $tid) {
      $query->condition('f.shivanode_tags_tid', $tid, '=');
    }
  } else {
    // the 'or' condition
    $query->condition('f.shivanode_tags_tid', $tids, 'IN');
  }
  
  // Perform query and put resulting nids in the out array removing duplicates
  $results = $query->execute();
  foreach($results as $result) {
    $out[] = $result->entity_id;
  }
  return array_unique($out);
}

function _shivanode_array_remove_value($array, $item) {
  $i = -1;
  foreach($array as $n => $value) {
    if($value == $item) {
      $i = $n;
      break;
    }
  }
  if( $i > -1 ) {
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
  if(isset($node->shivanode_tags['und']) && is_array($node->shivanode_tags['und'])) {
    foreach($node->shivanode_tags['und'] as $n => &$t) {
      $query = db_select('taxonomy_term_data','t')
        ->fields('t', array('tid', 'name'))
        ->condition('t.tid',$t['tid'],'=');
      $result = $query->execute();
      foreach ($result as $record) {
        $t['name'] = $record->name;
      }
    }
  }
  
  // add the kmap category name for each kmap tag id
  if(isset($node->field_kmap_tags['und']) && is_array($node->field_kmap_tags['und'])) {
    foreach($node->field_kmap_tags['und'] as $n => &$t) {
      $query = db_select('taxonomy_term_data','t')
        ->fields('t', array('tid', 'name'))
        ->condition('t.tid',$t['tid'],'=');
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
  if(isset($node->shivanode_element_type)) {
    $options = _shivanode_element_typelist();
    $typenum = $node->shivanode_element_type['und'][0]['value'];
    return ($type == "number" || $type == "num") ? $typenum : $options[$typenum];
  } else {
    return false;
  }
}

function _shivanode_get_json($node, $as_obj = TRUE) {
  if( isset($node->shivanode_json) ) {
    $eljson = $node->shivanode_json['und'][0]['value'];
    return ($as_obj) ? drupal_json_decode($eljson) : $eljson;
  } else {
    return false;
  }
}

/* _shivanode_get_data_element($source) :
 *    returns the NID of the data element that the $souce element relies on
 *    $source: is either a $form from the edit page or a NID number
 */
function _shivanode_get_data_element($source) {
  $nid = (is_numeric($source)) ? $source : $source['nid']['#value'];
  $result = db_select('shivanode_links', 'l')
      ->fields('l')
      ->condition('sn_id', $nid, '=')
      ->execute()
      ->fetchCol(2); 
  if(count($result) > 0) {
    return $result[0];
  } else {
    return false;
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
  foreach($vs as $voc) {
    if($voc->module == 'taxonomy') {
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

/* _shivanode_add_data_correspondence($node) :
 *     adds or updates the shivanode_links table with an entry linking the given node with it's data element
 *    $node: the node being added or updated, when submitted a data_id field is added to the node object with 
 *            the nid of the data element it is linked to. 
 * 
 *    This function should only be called for shivanodes that are not themselves data elements.
 */
function _shivanode_add_data_correspondence($node) {
  if(isset($node->data_id)) {
    $nid = $node->nid;
    $result = db_select('shivanode_links', 'l')
        ->fields('l')
        ->condition('sn_id', $nid, '=')
        ->execute()
        ->fetchCol(2);
    if($result) {
      db_update('shivanode_links')
        ->fields(array(
          'data_id' => $node->data_id,
        ))
        ->condition('sn_id', $node->nid, '=')
        ->execute();
    } else {
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
 * _shivanode_add_datalink: Adds a link to a data element to a shivanode create/edit form
 *      Requires the form, the data element id, and a boolean as to whether it is a new node (create) or not (edit)
 */
function _shivanode_add_datalink(&$form, $did, $isNewEl) {
  if(!isset($isNewEl)) { $isNewEl = FALSE; }
  $dnode = node_load($did);
  if($dnode) {
    $form['gdocinfo']['#prefix'] = str_replace('none;','block;', $form['gdocinfo']['#prefix']);
    $dataurl = _shivanode_get_dataurl($dnode);
    $datatitle = $dnode->title;
    
    // if it's a new element use its title for visualizations title
    if($isNewEl) {
       $form['title']['#default_value'] = str_replace(' (Data)','', $datatitle); 
    } 
    
    // if it is a  new element call JS function to load the data element data once form is loaded.
    // use 'preset' because this function already sets the markup for the data element
    // Otherwise, load the data from the Drupal unless told not to
    $jsfunct =  ($isNewEl)?  'Drupal.Shivanode.insertDataElement(\'preset\'); ' : 
    		'if(!Drupal.Shivanode.loadJS || Drupal.Shivanode.loadJS == false) { Drupal.Shivanode.setDataSheet(\'' . $dataurl . '\', \'' . $datatitle . '\');}';
    $form['gdocinfo']['script'] = array(
      '#type' => 'markup',
      '#markup' => '<script type="text/javascript">' .
              'jQuery(document).ready(function() {' .
               ' jQuery(\'#shivaEditFrame\').load(function() { ' .
                    $jsfunct.
                 '});' .
              '});' .
          '</script>',
    );

    // Add the form elements display what the linked data element is with links to reinsert, clear, and edit data.
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
    $gurl = 'https://docs.google.com/spreadsheet/ccc?key=' . $gupts[1];
    $form['gdocinfo']['button_div']['edit_gdoc'] = array(
      '#type' => 'markup',
      '#prefix' => '(',
      '#markup' =>  l(t('Edit Data'), $gurl, array(
        'attributes' => array(
          'target' => '_blank',
        ),
      )),
      '#suffix' => ' | ',
    );
    // Link to reinsert Google url into data table.
    $form['gdocinfo']['button_div']['insert_button'] = array(
      '#type' => 'markup',
      '#markup' => '<a href="#" onclick="Drupal.Shivanode.insertDataElement(\'preset\'); return false;" ' .
        'title="' . t('Insert the Data URL from this link in the form below.') . '" >' . t('Re-Insert URL') . '</a> ',
        '#suffix' => ' | ',
    );
    // The clear link to clear the link from shivanode to data element.
    $form['gdocinfo']['button_div']['remove_datanid'] = array(
      '#type' => 'button',
      '#value' =>  t('Remove'),
      '#attributes' => array(
        'title' => t('Remove the association between this element and the data element that supplies its Data Source URL.'),
        'class' => array('nobutton'),
      ),
      '#ajax' => array(
        'callback' => '_shivanode_set_to_remove_datainfo',
      ),
      '#suffix' => ')',
    );
  }
}

function _shivanode_node_embed_page($nid) {
  $node = node_load($nid);
  $page = array(
    'head' => array(
      '#type' => 'markup',
      '#markup' => '<h2>How To Share <i>' . $node->title . '</i></h2>',
    ),
    'select' => array(
      '#type' => 'select',
      '#title' => t('Format:'),
      '#description' => t('Choose the format you would like to use and copy the resulting code to your site.'),
      '#options' => array(
        'none' => t('-- Select --'),
        'wp' => t('Word Press'),
        'if' => t('IFrame'),
        'link' => t('Link'),
        'web' => t('URL'),
        'json' => t('JSON'),
      ),
      '#attributes' => array(
        'id' => 'snembedselect'
      ),
    ),
    'textarea' => array(
      '#type' => 'textarea',
      '#cols' => 20,
      '#rows' => 10,
      '#attributes' => array(
        'id' => 'sn-embedcode-area',
      ),
      '#default_value' => '',
      '#value' => '',
    ),
    'script' => array(
      '#type' => 'markup',
      '#markup' => '<script type="text/javascript"> Drupal.Shivanode.node = {
        "nid": ' . $nid . ',
        "title": "' . str_replace('"', '\"', $node->title) . '",
        "json": \'' . _shivanode_get_json($node,FALSE) . '\',
        "player": "' . variable_get('shivanode_chart_viewer') . '"
      };</script>',
    ),
  );
  return $page;
}

function _node_using_data_element($dnid) {
  $results = db_query('shivanode_links', 'l')
      ->condition('data_id',$dnid)
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
