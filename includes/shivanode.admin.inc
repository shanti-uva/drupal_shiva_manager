<?php 

/**
 * Creates the admin settings form for shivanode module
 *    called by shivanode_menu for path: 'admin/config/content/shivanode'
 */
function _shivanode_admin_settings($form, &$form_state) {
  
  $form['shivanode_settings_header'] = array(
    '#markup' => t('<h3>Shivanode Basic Settings</h3>') .
      t('<p>In this form you can set the URLs for the SHIVA player (for viewing nodes) and the various SHIVA editors.</p>'),
  );
	
  $form['shivanode_shiva_home'] = array(
  	'#type' => 'textfield',
    '#title' => t('Location of the SHIVA library'),
    '#size' => 80,
    '#default_value' => variable_get('shivanode_shiva_home', SHIVA_HOME),
    '#required' => TRUE,
	);
	
  $form['shivanode_qmedia_home'] = array(
  	'#type' => 'textfield',
    '#title' => t('Location of the QMeida library'),
    '#size' => 80,
    '#default_value' => variable_get('shivanode_qmedia_home', QMEDIA_HOME),
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

/*
function _shivanode_integer_check($element, &$form_state, $form) {
  $elval = $element['#value'];
  if (!is_numeric($elval)) {
    form_error($element, t('This field must be an integer.'));
  }
}
*/
function _shivanode_size_settings_check($element, &$form_state, $form) {
  $elval = $element['#value'];
  if ($elval < variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM)) {
    form_error($element, t('This value cannot be less than %minimum', array('%minimum' => variable_get('shivanode_min_size', SHIVA_IFRAME_DIMENSION_MINIMUM))));
  }
  elseif ($elval > variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM)) {
    form_error($element, t('This value cannot be more than %maximum', array('%maximum' => variable_get('shivanode_max_size', SHIVA_IFRAME_DIMENSION_MAXIMUM))));
  }
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
    $form_state['input']['shivanode_shiva_home'] = SHIVA_HOME;
    $form_state['input']['shivanode_qmedia_home'] = QMEDIA_HOME;
  
    drupal_set_message(t('All values have been reset to their default'));
    drupal_set_message(t('Configuration must be saved to take effect.'), 'warning');
  }
	$form_state['values']['shivanode_shiva_home'] = preg_replace('/https?\:/', '', $form_state['values']['shivanode_shiva_home']);
	$form_state['values']['shivanode_qmedia_home'] = preg_replace('/https?\:/', '', $form_state['values']['shivanode_qmedia_home']);
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