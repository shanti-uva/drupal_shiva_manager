<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$query="SELECT * FROM qshow";								// Query start
	if (isSet($_REQUEST['email'])) {		 					// If set
		$email=addslashes($_REQUEST['email']);					// Get email
		$query.=" WHERE email = '".$email."' ORDER by date DESC";	// WHERE email search
		}
	else{
		print("Sorry, there are no projects with this email\n");// Return error
		return;
		}
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("Error getting projects");						// Return error
		exit();													// Quit
		}
	$body="Here are projects saved under the email ".$email.":\n\n";// Header
	$num=mysql_numrows($result);								// Get num rows
	for ($i=0;$i<$num;$i++) {									// For each row
		$body.="Id:" .mysql_result($result,$i,"id")."\t";			// Add id
		$body.="Priv: ".mysql_result($result,$i,"private")."\t";	// Add private
		$body.="Del: ".mysql_result($result,$i,"deleted")."\t";		// Add Deleted
		$body.="Date: ".mysql_result($result,$i,"date")."\t";		// Add Date
		$body.="Pass: ".mysql_result($result,$i,"password")."\t";	// Add password
		$body.="Title: ".mysql_result($result,$i,"title")."\n";		// Add title
		}		
	mysql_close();												// Close session
	ini_set("sendmail_from",$email);							// Close
	$sub="Here are your saved projects...";						// Subject			
	mail($email,$sub,$body,"From: $email\nReply-To: $email\n");	// Mail it
?>
	
