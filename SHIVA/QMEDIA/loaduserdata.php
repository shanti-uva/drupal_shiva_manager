<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
	
	$email=addEscapes(strtolower($_REQUEST['email']));			// Get email
	$show=addEscapes($_REQUEST['show']);						// Get show
										
	$query="SELECT * FROM qusers WHERE email = '".$email."' AND showNum = '".$show."'";	// Look for data
	$result=mysql_query($query);								// Run query
	if (mysql_numrows($result)) {								// If found,
		$s=mysql_result($result,$i,"events");					// Get events field
		$s=str_replace("\r\n","\n",$s);							// No crlf
		$s=str_replace("\n\r","\n",$s);							// No lfcr
		$s=str_replace("\n","\\n",$s);							// Escape
		$s=str_replace("\t","\\t",$s);							// Escape
		print("LoadUserData({ \"data\":\"$s\"})");				// Send JSONP
		}
	mysql_close();												// Close
	
	
	function addEscapes($str)									// ESCAPE ENTRIES
	{
		if (!$str)												// If nothing
			return $str;										// Quit
		$str=addslashes($str);									// Add slashes
		$str=str_replace("\r","",$str);							// No crs
		return $str;
	}
	
?>