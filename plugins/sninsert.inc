<?php

/**
 * @file
 * Wysiwyg API integration on behalf of Shivanode module.
 */

/**
 * Implementation of wysiwyg's hook_INCLUDE_plugin().
 */
function shivanode_sninsert_plugin() {
  $plugins['sninsert'] = array(
    // The plugin's title; defaulting to its internal name ('awesome').
    'title' => t('Insert Shivanode'),
    // The (vendor) homepage of this plugin; defaults to ''.
    //'vendor url' => 'http://shanti.virginia.edu/',
    // The path to the button's icon; defaults to
    // '/[path-to-module]/[plugins-directory]/[plugin-name]/images'.
    'icon path' => drupal_get_path('module', 'shivanode') . '/plugins',
    // The button image filename; defaults to '[plugin-name].png'.
    'icon file' => 'sninsert.png',
    // The button title to display on hover.
    'icon title' => t('Insert a Shiva Node'),
    // An alternative path to the integration JavaScript; defaults to
    // '[path-to-module]/[plugins-directory]/[plugin-name]'.
    'js path' => drupal_get_path('module', 'shivanode') . '/plugins',
    // An alternative filename of the integration JavaScript; defaults to
    // '[plugin-name].js'.
    //'js file' => 'awesome.js',
    // An alternative path to the integration stylesheet; defaults to
    // '[path-to-module]/[plugins-directory]/[plugin-name]'.
    'css path' => drupal_get_path('module', 'shivanode') . '/plugins',
    // An alternative filename of the integration stylesheet; defaults to
    // '[plugin-name].css'.
    'css file' => 'sninsert.css',
    // An array of settings for this button. Required, but API is still in flux.
    
    'settings' => array(
      'global' => array(
        'id' => 'sninsert_wysiwyg',
      ),
    ),
    // TinyMCE-specific: Additional HTML elements to allow in the markup.
    /*
    'extended_valid_elements' => array(
      'tag1[attribute1|attribute2]',
      'tag2[attribute3|attribute4]',
    ),*/

  );
  return $plugins;
}

/**
 * Act on editor profile settings.
 *
 * This hook is invoked from wysiwyg_get_editor_config() after the JavaScript
 * settings have been generated for an editor profile and before the settings
 * are added to the page. The settings may be customized or enhanced; typically
 * with options that cannot be controlled through Wysiwyg module's
 * administrative UI currently.
 *
 * Modules implementing this hook to enforce settings that can also be
 * controlled through the UI should also implement
 * hook_form_wysiwyg_profile_form_alter() to adjust or at least indicate on the
 * editor profile configuration form that certain/affected settings cannot be
 * changed.
 *
 * @param $settings
 *   An associative array of JavaScript settings to pass to the editor.
 * @param $context
 *   An associative array containing additional context information:
 *   - editor: The plugin definition array of the editor.
 *   - profile: The editor profile object, as loaded from the database.
 *   - theme: The name of the editor theme/skin.
 */
function shivanode_wysiwyg_editor_settings_alter(&$settings, $context) {
  // Each editor has its own collection of native settings that may be extended
  // or overridden. Please consult the respective official vendor documentation
  // for details.
  if ($context['profile']->editor == 'tinymce') {
    // Supported values to JSON data types.
    $settings['cleanup_on_startup'] = TRUE;
  }
}