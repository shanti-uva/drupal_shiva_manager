<?php
  // A PHP script to test if a url is valid
  // It takes the param: url=... and then uses file_get_contents() to read that url
  // If it successfully reads that url it echos "true"
  // If there is an error in getting the contents, it calls the custom error handler and returns "false"
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