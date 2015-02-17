<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
require_once('config.php');
			
	$id="";
	$password="";												
	$email="";												
	$title="";													
	$script="";												
	$private='0';												
	$deleted='0';
	$ver=0;												

	$email=$_REQUEST['email'];									// Get email
	$password=$_REQUEST['password'];							// Get password
	
	if (isSet($_REQUEST['id'])) 								// If set
		$id=$_REQUEST['id'];									// Get it
	if (isSet($_REQUEST['title'])) 								// If set
		$title=$_REQUEST['title'];								// Get it
	if (isSet($_REQUEST['script'])) 							// If set
		$script=$_REQUEST['script'];							// Get it
	if (isSet($_REQUEST['private'])) 							// If set
		$private=$_REQUEST['private'];							// Get it
	if (isSet($_REQUEST['deleted'])) 							// If set
		$deleted=$_REQUEST['deleted'];							// Get it
	if (isSet($_REQUEST['ver'])) 								// If set
		$ver=$_REQUEST['ver'];									// Get it
								
	$query="SELECT * FROM qshow WHERE id = '".$id."'"; 			// Look existing one	
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("-1");											// Show error 
		mysql_close();											// Close session
		exit();													// Quit
		}
	if (!mysql_numrows($result)) {								// If not found, add it
		$query="INSERT INTO qshow (title, script, email, password, version, private) VALUES ('";
		$query.=addEscapes($title)."','";
		$query.=addEscapes($script)."','";
		$query.=addEscapes($email)."','";
		$query.=addEscapes($password)."','";
		$query.=addEscapes($ver)."','";
		$query.=addEscapes($private)."')";
		$result=mysql_query($query);							// Add row
		if ($result == false)									// Bad save
			print("-2");										// Show error 
		else
			print(mysql_insert_id()."\n");						// Return ID of new resource
		}
	else{														// We have one already
		$oldpass=mysql_result($result,0,"password");			// Get old password		
		if ($oldpass && ($password != $oldpass)) {				// Passwords don't match
			print("-3");										// Show error 
			mysql_close();										// Close session
			exit();												// Quit
			}
		if (!isSet($_REQUEST['title'])) 						// If not set
			$title=mysql_result($result,0,"title");				// Get from POST
		if (!isSet($_REQUEST['script'])) 						// If not set
			$script=mysql_result($result,0,"script");			// Get from POST
		if (!isSet($_REQUEST['private'])) 						// If not set
			$private=mysql_result($result,0,"private");			// Get from POST
		if (!isSet($_REQUEST['deleted'])) 						// If not set
			$deleted=mysql_result($result,0,"deleted");			// Get from POST
		
		$id=mysql_result($result,0,"id");						// Get id
		if ($id != "") {										// If valid
			$query="UPDATE qshow SET title='".addEscapes($title)."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET script='".addEscapes($script)."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET private='".addEscapes($private)."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET deleted='".addEscapes($deleted)."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			$query="UPDATE qshow SET date='".date("Y-m-d H:i:s")."' WHERE id = '".$id."'";
			$result=mysql_query($query);
			}
		if ($result == false)									// Bad update
			print("-4");										// Show error 
		else
			print($id);											// Show id 
			}													// End if valid
		mysql_close();											// Close session

	
	function addEscapes($str)									// ESCAPE ENTRIES
	{
		if (!$str)												// If nothing
			return $str;										// Quit
		$str=mysql_real_escape_string($str);					// Add slashes
		$str=str_replace("\r","",$str);							// No crs
		return $str;
	}

?>
	
