<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
	
	$id=$_REQUEST['id'];										// Get ID
	$password=$_REQUEST['password'];							// Password
	$password=addEscapes($password);							// Escape password	
	$id=addEscapes($id);										// ID
	$query="SELECT * FROM qshow WHERE id = '$id'";				// Make query
	$result=mysql_query($query);								// Run query
	if (($result == false) || (!mysql_numrows($result)))		// Error
			print("LoadShow({ \"qmfmsg\":\"error\"})");
	else{														// Good result
		if (mysql_result($result,0,"private") && (mysql_result($result,0,"password") != $password))
			print("LoadShow({ \"qmfmsg\":\"private\"})");
		else	
			print(mysql_result($result,0,"script"));
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