<?php
/**
 * @file
 * shiva_explore_page_feature.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function shiva_explore_page_feature_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "page_manager" && $api == "pages_default") {
    return array("version" => "1");
  }
}
