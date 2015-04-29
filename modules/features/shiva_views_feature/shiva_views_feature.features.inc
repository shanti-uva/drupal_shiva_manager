<?php
/**
 * @file
 * shiva_views_feature.features.inc
 */

/**
 * Implements hook_ctools_plugin_api().
 */
function shiva_views_feature_ctools_plugin_api($module = NULL, $api = NULL) {
  if ($module == "facetapi" && $api == "facetapi_defaults") {
    return array("version" => "1");
  }
}

/**
 * Implements hook_views_api().
 */
function shiva_views_feature_views_api($module = NULL, $api = NULL) {
  return array("api" => "3.0");
}

/**
 * Implements hook_default_search_api_index().
 */
function shiva_views_feature_default_search_api_index() {
  $items = array();
  $items['default_node_index'] = entity_import('search_api_index', '{
    "name" : "Shiva Solr Index",
    "machine_name" : "default_node_index",
    "description" : "Shiva Solr Index on drupal-index.shanti.virginia.edu\\/solr\\/shiva",
    "server" : "shiva_solr_server",
    "item_type" : "node",
    "options" : {
      "index_directly" : 1,
      "cron_limit" : "200",
      "data_alter_callbacks" : { "search_api_alter_node_access" : { "status" : 1, "weight" : "0", "settings" : [] } },
      "processors" : {
        "search_api_case_ignore" : { "status" : 1, "weight" : "0", "settings" : { "strings" : 0 } },
        "search_api_html_filter" : {
          "status" : 1,
          "weight" : "10",
          "settings" : {
            "title" : 0,
            "alt" : 1,
            "tags" : "h1 = 5\\nh2 = 3\\nh3 = 2\\nstrong = 2\\nb = 2\\nem = 1.5\\nu = 1.5"
          }
        },
        "search_api_tokenizer" : {
          "status" : 1,
          "weight" : "20",
          "settings" : { "spaces" : "[^\\\\p{L}\\\\p{N}]", "ignorable" : "[-]" }
        }
      },
      "fields" : {
        "author" : { "type" : "integer", "entity_type" : "user" },
        "author:field_fname" : { "type" : "text" },
        "author:field_lname" : { "type" : "text" },
        "author:name" : { "type" : "string" },
        "author:roles" : { "type" : "list\\u003Cinteger\\u003E" },
        "author:uid" : { "type" : "integer" },
        "body:value" : { "type" : "text" },
        "changed" : { "type" : "date" },
        "created" : { "type" : "date" },
        "field_tags" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "taxonomy_term" },
        "language" : { "type" : "string" },
        "nid" : { "type" : "integer" },
        "og_membership" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "og_membership" },
        "search_api_language" : { "type" : "string" },
        "shivanode_access" : { "type" : "integer" },
        "shivanode_element_type" : { "type" : "integer" },
        "shivanode_subtype" : { "type" : "integer" },
        "shivanode_tags" : { "type" : "list\\u003Cinteger\\u003E", "entity_type" : "taxonomy_term" },
        "status" : { "type" : "integer" },
        "title" : { "type" : "text", "boost" : "5.0" },
        "type" : { "type" : "string" }
      }
    },
    "enabled" : "1",
    "read_only" : "0",
    "rdf_mapping" : []
  }');
  return $items;
}

/**
 * Implements hook_default_search_api_server().
 */
function shiva_views_feature_default_search_api_server() {
  $items = array();
  $items['shiva_solr_server'] = entity_import('search_api_server', '{
    "name" : "Shiva Solr Server",
    "machine_name" : "shiva_solr_server",
    "description" : "",
    "class" : "search_api_solr_service",
    "options" : {
      "clean_ids" : true,
      "scheme" : "http",
      "host" : "localhost",
      "port" : "8080",
      "path" : "\\/solr\\/shiva",
      "http_user" : "",
      "http_pass" : "",
      "excerpt" : 0,
      "retrieve_data" : 0,
      "highlight_data" : 0,
      "http_method" : "AUTO"
    },
    "enabled" : "1",
    "rdf_mapping" : []
  }');
  return $items;
}
