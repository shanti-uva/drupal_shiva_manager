<?php
/**
 * @file
 * shiva_views_feature.views_default.inc
 */

/**
 * Implements hook_views_default_views().
 */
function shiva_views_feature_views_default_views() {
  $export = array();

  $view = new view();
  $view->name = 'shiva_data_sets';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'node';
  $view->human_name = 'Shiva Data Nodes';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['title'] = 'Data Sets';
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'perm';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '10';
  $handler->display->display_options['style_plugin'] = 'table';
  $handler->display->display_options['style_options']['columns'] = array(
    'title' => 'title',
  );
  $handler->display->display_options['style_options']['default'] = '-1';
  $handler->display->display_options['style_options']['info'] = array(
    'title' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
  );
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['exclude'] = TRUE;
  /* Field: Global: Custom text */
  $handler->display->display_options['fields']['nothing']['id'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['table'] = 'views';
  $handler->display->display_options['fields']['nothing']['field'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['label'] = '';
  $handler->display->display_options['fields']['nothing']['alter']['text'] = '<a href="https://shiva.virginia.edu/node/add/shivanode/[nid]">Visualize</a>';
  $handler->display->display_options['fields']['nothing']['element_label_colon'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  $handler->display->display_options['filter_groups']['operator'] = 'OR';
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'shivanode' => 'shivanode',
  );
  $handler->display->display_options['filters']['type']['group'] = 1;
  /* Filter criterion: Content: Type (shivanode_element_type) */
  $handler->display->display_options['filters']['shivanode_element_type_value']['id'] = 'shivanode_element_type_value';
  $handler->display->display_options['filters']['shivanode_element_type_value']['table'] = 'field_data_shivanode_element_type';
  $handler->display->display_options['filters']['shivanode_element_type_value']['field'] = 'shivanode_element_type_value';
  $handler->display->display_options['filters']['shivanode_element_type_value']['value'] = array(
    1 => '1',
  );
  $handler->display->display_options['filters']['shivanode_element_type_value']['group'] = 1;

  /* Display: Shiva Data */
  $handler = $view->new_display('page', 'Shiva Data', 'page');
  $handler->display->display_options['path'] = 'data-sets';

  /* Display: My Shiva Data */
  $handler = $view->new_display('panel_pane', 'My Shiva Data', 'panel_pane_1');
  $handler->display->display_options['defaults']['title'] = FALSE;
  $handler->display->display_options['defaults']['css_class'] = FALSE;
  $handler->display->display_options['css_class'] = 'my-data-table';
  $handler->display->display_options['defaults']['pager'] = FALSE;
  $handler->display->display_options['pager']['type'] = 'none';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['defaults']['style_plugin'] = FALSE;
  $handler->display->display_options['style_plugin'] = 'datatables';
  $handler->display->display_options['style_options']['columns'] = array(
    'title' => 'title',
    'nid' => 'nid',
    'nothing_1' => 'nothing_1',
    'created' => 'created',
    'nothing' => 'nothing',
  );
  $handler->display->display_options['style_options']['default'] = '-1';
  $handler->display->display_options['style_options']['info'] = array(
    'title' => array(
      'sortable' => 1,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'nid' => array(
      'sortable' => 0,
      'default_sort_order' => 'asc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'nothing_1' => array(
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'created' => array(
      'sortable' => 1,
      'default_sort_order' => 'desc',
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
    'nothing' => array(
      'align' => '',
      'separator' => '',
      'empty_column' => 0,
    ),
  );
  $handler->display->display_options['style_options']['elements'] = array(
    'search_box' => 1,
    'table_info' => 1,
    'save_state' => 0,
  );
  $handler->display->display_options['style_options']['layout'] = array(
    'autowidth' => 0,
    'themeroller' => 0,
    'sdom' => '<"top"Rfilp<"clear">>rt<"bottom"filp<"clear">>',
  );
  $handler->display->display_options['style_options']['pages'] = array(
    'pagination_style' => 'full_numbers',
    'length_change' => 1,
    'display_length' => '100',
  );
  $handler->display->display_options['defaults']['style_options'] = FALSE;
  $handler->display->display_options['defaults']['row_plugin'] = FALSE;
  $handler->display->display_options['defaults']['row_options'] = FALSE;
  $handler->display->display_options['defaults']['header'] = FALSE;
  $handler->display->display_options['defaults']['relationships'] = FALSE;
  /* Relationship: Content: Author */
  $handler->display->display_options['relationships']['uid']['id'] = 'uid';
  $handler->display->display_options['relationships']['uid']['table'] = 'node';
  $handler->display->display_options['relationships']['uid']['field'] = 'uid';
  $handler->display->display_options['defaults']['fields'] = FALSE;
  /* Field: Content: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'node';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['exclude'] = TRUE;
  $handler->display->display_options['fields']['title']['alter']['word_boundary'] = FALSE;
  $handler->display->display_options['fields']['title']['alter']['ellipsis'] = FALSE;
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_node'] = FALSE;
  /* Field: Content: Nid */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'node';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['exclude'] = TRUE;
  /* Field: Global: Custom text */
  $handler->display->display_options['fields']['nothing_1']['id'] = 'nothing_1';
  $handler->display->display_options['fields']['nothing_1']['table'] = 'views';
  $handler->display->display_options['fields']['nothing_1']['field'] = 'nothing';
  $handler->display->display_options['fields']['nothing_1']['label'] = 'Title';
  $handler->display->display_options['fields']['nothing_1']['alter']['text'] = '<a href="/node/[nid]">[title]</a>';
  $handler->display->display_options['fields']['nothing_1']['element_class'] = 'data-title';
  $handler->display->display_options['fields']['nothing_1']['element_label_colon'] = FALSE;
  /* Field: Content: Post date */
  $handler->display->display_options['fields']['created']['id'] = 'created';
  $handler->display->display_options['fields']['created']['table'] = 'node';
  $handler->display->display_options['fields']['created']['field'] = 'created';
  $handler->display->display_options['fields']['created']['label'] = 'Date Used';
  $handler->display->display_options['fields']['created']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['created']['date_format'] = 'custom';
  $handler->display->display_options['fields']['created']['custom_date_format'] = 'M d, Y (g:i A)';
  /* Field: Global: Custom text */
  $handler->display->display_options['fields']['nothing']['id'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['table'] = 'views';
  $handler->display->display_options['fields']['nothing']['field'] = 'nothing';
  $handler->display->display_options['fields']['nothing']['label'] = '';
  $handler->display->display_options['fields']['nothing']['alter']['text'] = '[title]|$|[nid]';
  $handler->display->display_options['fields']['nothing']['element_label_colon'] = FALSE;
  $handler->display->display_options['defaults']['sorts'] = FALSE;
  /* Sort criterion: Content: Post date */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'node';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  $handler->display->display_options['defaults']['filter_groups'] = FALSE;
  $handler->display->display_options['filter_groups']['operator'] = 'OR';
  $handler->display->display_options['defaults']['filters'] = FALSE;
  /* Filter criterion: Content: Published */
  $handler->display->display_options['filters']['status']['id'] = 'status';
  $handler->display->display_options['filters']['status']['table'] = 'node';
  $handler->display->display_options['filters']['status']['field'] = 'status';
  $handler->display->display_options['filters']['status']['value'] = 1;
  $handler->display->display_options['filters']['status']['group'] = 1;
  $handler->display->display_options['filters']['status']['expose']['operator'] = FALSE;
  /* Filter criterion: Content: Type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'node';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'shivanode' => 'shivanode',
  );
  $handler->display->display_options['filters']['type']['group'] = 1;
  /* Filter criterion: Content: Type (shivanode_element_type) */
  $handler->display->display_options['filters']['shivanode_element_type_value']['id'] = 'shivanode_element_type_value';
  $handler->display->display_options['filters']['shivanode_element_type_value']['table'] = 'field_data_shivanode_element_type';
  $handler->display->display_options['filters']['shivanode_element_type_value']['field'] = 'shivanode_element_type_value';
  $handler->display->display_options['filters']['shivanode_element_type_value']['value'] = array(
    1 => '1',
  );
  $handler->display->display_options['filters']['shivanode_element_type_value']['group'] = 1;
  /* Filter criterion: User: Current */
  $handler->display->display_options['filters']['uid_current']['id'] = 'uid_current';
  $handler->display->display_options['filters']['uid_current']['table'] = 'users';
  $handler->display->display_options['filters']['uid_current']['field'] = 'uid_current';
  $handler->display->display_options['filters']['uid_current']['relationship'] = 'uid';
  $handler->display->display_options['filters']['uid_current']['value'] = '1';
  $handler->display->display_options['filters']['uid_current']['group'] = 1;
  $export['shiva_data_sets'] = $view;

  $view = new view();
  $view->name = 'shiva_visualization_solr';
  $view->description = '';
  $view->tag = 'default';
  $view->base_table = 'search_api_index_default_node_index';
  $view->human_name = 'Shiva Visualizations Solr';
  $view->core = 7;
  $view->api_version = '3.0';
  $view->disabled = FALSE; /* Edit this to true to make a default view disabled initially */

  /* Display: Master */
  $handler = $view->new_display('default', 'Master', 'default');
  $handler->display->display_options['use_more_always'] = FALSE;
  $handler->display->display_options['access']['type'] = 'none';
  $handler->display->display_options['cache']['type'] = 'none';
  $handler->display->display_options['query']['type'] = 'views_query';
  $handler->display->display_options['exposed_form']['type'] = 'basic';
  $handler->display->display_options['pager']['type'] = 'full';
  $handler->display->display_options['pager']['options']['items_per_page'] = '60';
  $handler->display->display_options['pager']['options']['offset'] = '0';
  $handler->display->display_options['pager']['options']['id'] = '0';
  $handler->display->display_options['pager']['options']['quantity'] = '9';
  $handler->display->display_options['style_plugin'] = 'default';
  $handler->display->display_options['style_options']['row_class'] = 'shiva-teaser';
  $handler->display->display_options['row_plugin'] = 'fields';
  /* Header: Global: Text area */
  $handler->display->display_options['header']['area']['id'] = 'area';
  $handler->display->display_options['header']['area']['table'] = 'views';
  $handler->display->display_options['header']['area']['field'] = 'area';
  $handler->display->display_options['header']['area']['label'] = 'Shiva Front Page Blurb';
  $handler->display->display_options['header']['area']['empty'] = TRUE;
  $handler->display->display_options['header']['area']['content'] = '<h1>Welcome to SHIVA!</h1>
<p style="font-size: 120%; margin-bottom: 8px;">SHIVA is a way to create on-line, interactive visualizations. Read more <a href="/about">here ...</a> </p>';
  $handler->display->display_options['header']['area']['format'] = 'full_html';
  /* Field: Indexed Node: Node ID */
  $handler->display->display_options['fields']['nid']['id'] = 'nid';
  $handler->display->display_options['fields']['nid']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['nid']['field'] = 'nid';
  $handler->display->display_options['fields']['nid']['label'] = '';
  $handler->display->display_options['fields']['nid']['exclude'] = TRUE;
  $handler->display->display_options['fields']['nid']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['nid']['separator'] = '';
  $handler->display->display_options['fields']['nid']['link_to_entity'] = 0;
  /* Field: Indexed Node: Image */
  $handler->display->display_options['fields']['field_image']['id'] = 'field_image';
  $handler->display->display_options['fields']['field_image']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['field_image']['field'] = 'field_image';
  $handler->display->display_options['fields']['field_image']['label'] = '';
  $handler->display->display_options['fields']['field_image']['element_type'] = 'div';
  $handler->display->display_options['fields']['field_image']['element_class'] = 'shiva-teaser-image';
  $handler->display->display_options['fields']['field_image']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['field_image']['click_sort_column'] = 'fid';
  $handler->display->display_options['fields']['field_image']['settings'] = array(
    'image_style' => 'shiva_teaser',
    'image_link' => 'content',
  );
  /* Field: Indexed Node: Content type */
  $handler->display->display_options['fields']['type']['id'] = 'type';
  $handler->display->display_options['fields']['type']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['type']['field'] = 'type';
  $handler->display->display_options['fields']['type']['label'] = '';
  $handler->display->display_options['fields']['type']['exclude'] = TRUE;
  $handler->display->display_options['fields']['type']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['type']['link_to_entity'] = 0;
  $handler->display->display_options['fields']['type']['format_name'] = 0;
  /* Field: Indexed Node: Title */
  $handler->display->display_options['fields']['title']['id'] = 'title';
  $handler->display->display_options['fields']['title']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['title']['field'] = 'title';
  $handler->display->display_options['fields']['title']['label'] = '';
  $handler->display->display_options['fields']['title']['element_type'] = 'div';
  $handler->display->display_options['fields']['title']['element_class'] = 'shiva-teaser-title';
  $handler->display->display_options['fields']['title']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['title']['link_to_entity'] = 0;
  /* Field: Indexed Node: Type */
  $handler->display->display_options['fields']['shivanode_element_type']['id'] = 'shivanode_element_type';
  $handler->display->display_options['fields']['shivanode_element_type']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['shivanode_element_type']['field'] = 'shivanode_element_type';
  $handler->display->display_options['fields']['shivanode_element_type']['label'] = '';
  $handler->display->display_options['fields']['shivanode_element_type']['exclude'] = TRUE;
  $handler->display->display_options['fields']['shivanode_element_type']['element_label_colon'] = FALSE;
  /* Field: Indexed Node: Visualization Subtype */
  $handler->display->display_options['fields']['shivanode_subtype']['id'] = 'shivanode_subtype';
  $handler->display->display_options['fields']['shivanode_subtype']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['shivanode_subtype']['field'] = 'shivanode_subtype';
  $handler->display->display_options['fields']['shivanode_subtype']['label'] = '';
  $handler->display->display_options['fields']['shivanode_subtype']['exclude'] = TRUE;
  $handler->display->display_options['fields']['shivanode_subtype']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['shivanode_subtype']['empty'] = '[shivanode_element_type]';
  /* Field: Indexed Node: Date created */
  $handler->display->display_options['fields']['created']['id'] = 'created';
  $handler->display->display_options['fields']['created']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['created']['field'] = 'created';
  $handler->display->display_options['fields']['created']['label'] = '';
  $handler->display->display_options['fields']['created']['exclude'] = TRUE;
  $handler->display->display_options['fields']['created']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['created']['date_format'] = 'custom';
  $handler->display->display_options['fields']['created']['custom_date_format'] = 'M d, Y';
  $handler->display->display_options['fields']['created']['link_to_entity'] = 0;
  /* Field: Author: Name (indexed) */
  $handler->display->display_options['fields']['author_name']['id'] = 'author_name';
  $handler->display->display_options['fields']['author_name']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['author_name']['field'] = 'author_name';
  $handler->display->display_options['fields']['author_name']['label'] = '';
  $handler->display->display_options['fields']['author_name']['exclude'] = TRUE;
  $handler->display->display_options['fields']['author_name']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['author_name']['link_to_entity'] = 0;
  /* Field: Author: First Name (indexed) */
  $handler->display->display_options['fields']['author_field_fname']['id'] = 'author_field_fname';
  $handler->display->display_options['fields']['author_field_fname']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['author_field_fname']['field'] = 'author_field_fname';
  $handler->display->display_options['fields']['author_field_fname']['label'] = '';
  $handler->display->display_options['fields']['author_field_fname']['exclude'] = TRUE;
  $handler->display->display_options['fields']['author_field_fname']['element_label_colon'] = FALSE;
  /* Field: Author: Last Name (indexed) */
  $handler->display->display_options['fields']['author_field_lname']['id'] = 'author_field_lname';
  $handler->display->display_options['fields']['author_field_lname']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['fields']['author_field_lname']['field'] = 'author_field_lname';
  $handler->display->display_options['fields']['author_field_lname']['label'] = '';
  $handler->display->display_options['fields']['author_field_lname']['alter']['alter_text'] = TRUE;
  $handler->display->display_options['fields']['author_field_lname']['alter']['text'] = '<div class="info-wrapper"><div class="info"><a href="node/[nid]">[shivanode_subtype] <br/> Created by [author_field_fname] [author_field_lname]<br/>on [created]</a></div></div>';
  $handler->display->display_options['fields']['author_field_lname']['element_type'] = 'div';
  $handler->display->display_options['fields']['author_field_lname']['element_label_colon'] = FALSE;
  $handler->display->display_options['fields']['author_field_lname']['element_default_classes'] = FALSE;
  $handler->display->display_options['fields']['author_field_lname']['empty'] = '<div class="info-wrapper"><div class="info"><a href="node/[nid]">[shivanode_subtype] <br/> Created by  [author_name]<br/>on [created]</a></div></div>';
  /* Sort criterion: Indexed Node: Date created */
  $handler->display->display_options['sorts']['created']['id'] = 'created';
  $handler->display->display_options['sorts']['created']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['sorts']['created']['field'] = 'created';
  $handler->display->display_options['sorts']['created']['order'] = 'DESC';
  /* Filter criterion: Indexed Node: Content type */
  $handler->display->display_options['filters']['type']['id'] = 'type';
  $handler->display->display_options['filters']['type']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['filters']['type']['field'] = 'type';
  $handler->display->display_options['filters']['type']['value'] = array(
    'shivanode' => 'shivanode',
  );
  /* Filter criterion: Indexed Node: Type */
  $handler->display->display_options['filters']['shivanode_element_type']['id'] = 'shivanode_element_type';
  $handler->display->display_options['filters']['shivanode_element_type']['table'] = 'search_api_index_default_node_index';
  $handler->display->display_options['filters']['shivanode_element_type']['field'] = 'shivanode_element_type';
  $handler->display->display_options['filters']['shivanode_element_type']['operator'] = '<>';
  $handler->display->display_options['filters']['shivanode_element_type']['value'] = '1';

  /* Display: Shiva Gallery Home */
  $handler = $view->new_display('page', 'Shiva Gallery Home', 'page');
  $handler->display->display_options['path'] = 'home';

  /* Display: Shiva Gallery Examples */
  $handler = $view->new_display('page', 'Shiva Gallery Examples', 'page_1');
  $handler->display->display_options['defaults']['header'] = FALSE;
  /* Header: Global: Text area */
  $handler->display->display_options['header']['area']['id'] = 'area';
  $handler->display->display_options['header']['area']['table'] = 'views';
  $handler->display->display_options['header']['area']['field'] = 'area';
  $handler->display->display_options['header']['area']['label'] = 'Shiva Example Blurb';
  $handler->display->display_options['header']['area']['empty'] = TRUE;
  $handler->display->display_options['header']['area']['content'] = '<h1>SHIVA Examples</h1>
<p style="padding-bottom: 8px;">Below are real life examples for the type of visualization you have chosen.</p>';
  $handler->display->display_options['header']['area']['format'] = 'full_html';
  $handler->display->display_options['path'] = 'examples';
  $export['shiva_visualization_solr'] = $view;

  return $export;
}
