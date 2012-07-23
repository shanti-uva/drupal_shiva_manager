<?php
	set_error_handler("my_error_handler");
	if(!isset($_GET['url'])) {
		echo "false";
	} else {
		
		$url = $_GET['url'];
		$file = file_get_contents($url, 'r');
		
		echo "true";
	}
	
	function my_error_handler($errno, $errstr) {
		echo "false";
		exit;
	}
?>