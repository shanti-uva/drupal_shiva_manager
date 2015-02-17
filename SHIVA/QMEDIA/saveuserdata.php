<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
require_once('config.php');
			
	$email=strtolower($_REQUEST['email']);						// Get email
	$password=$_REQUEST['password'];							// Get password
	$event=$_REQUEST['event'];									// Get event
	$show=$_REQUEST['show'];									// Get show
	
	if (!$email || !$show || !$event) {							// Not enough data
		if (!$email)											// If no email
			print("data");										// Show error 
		mysql_close();											// Close session
		exit();													// Quit
		}
										
	$query="SELECT * FROM qusers WHERE email = '".$email."' AND showNum = '".$show."'";	// Look for existing one
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print(-2);												// Show error 
		mysql_close();											// Close session
		exit();													// Quit
		}
	
	if (!mysql_numrows($result)) {								// If not found, add it
		$query="INSERT INTO qusers (email, password, showNum, events ) VALUES ('";
		$query.=addEscapes($email)."','";						// Email
		$query.=addEscapes($password)."','";					// Password
		$query.=addEscapes($show)."','";						// Show num
		$query.=addEscapes($event)."')";						// Event
		$result=mysql_query($query);							// Add row
		if ($result == false)									// Bad save
			print("-3");										// Show error 
		else
			print("new:".mysql_insert_id()."\n");				// Return ID of new user
		}
	else{														// We have one already
		$oldpass=mysql_result($result,0,"password");			// Get old password		
		if ($oldpass && ($password != $oldpass)) {				// Passwords don't match
			print("pass");										// Show error 
			mysql_close();										// Close session
			exit();												// Quit
			}
		$id=mysql_result($result,0,"id");						// Get id
		if ($id != "") {										// If valid
			if (isSet($_REQUEST['replace'])) 					// If replacing field
				$query="UPDATE qusers SET events='".addEscapes($event)."' WHERE id = '".$id."'";
			else 												// Adding to
				$query="UPDATE qusers SET events = CONCAT(events, '$event') WHERE id = '".$id."'";
			$result=mysql_query($query);						// Add to field
			}
		if ($result == false)									// Bad update
			print("-4");										// Show error 
		else
			print("exist:".$id);								// Show id 
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
	
