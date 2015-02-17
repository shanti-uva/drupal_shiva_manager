<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$email="";
	$show="";
	$password="";
	if (isSet($_REQUEST['email'])) 								// If set
		$email=addslashes($_REQUEST['email']);					// Get email
	if (isSet($_REQUEST['show'])) 								// If set
		$show=addslashes($_REQUEST['show']);					// Get show
	if (isSet($_REQUEST['password'])) 							// If set
		$password=addslashes($_REQUEST['password']);			// Get password
			
	$query="SELECT * FROM qusers WHERE ";						// Query start 
	if ($email)													// If a email spec'd
		$query.="email = '".strtolower($email)."'";				// Add email
	if ($show && $email)										// If both
		$query.=" AND";											// Add AND
	if ($show)													// If a show spec'd
		$query.=" showNum = '".$show."'";						// Look for a particular show
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("-1\n");											// Return error
		exit();													// Quit
		}
	$num=mysql_numrows($result);								// Get num rows
	print("<font face='sans-serif'>");							// Font
	for ($i=0;$i<$num;++$i) {									// For each record
		print("The assessment result for <b>".mysql_result($result,$i,"email")."</b> in show <b>".mysql_result($result,$i,"showNum")."</b> is:<br>");	// Header
		print("<blockquote>");									// Indent
		$s=mysql_result($result,$i,"events");					// Get events
		$s=str_replace("\t","&nbsp;&nbsp;",$s);					// Tabs to spaces	
		$s=str_replace("\n","<br>",$s);							// CRs to BRs		
		print($s);												// Show events
		print("<br></blockquote>");								// BR
		}
	if (!$num)													// No record
		print("No assessment results to show for $email");		// Say it
	print("</font>");											// Font
	
	mysql_close();												// Close session
?>
	
