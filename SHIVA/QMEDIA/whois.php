<?php
header('Cache-Control: no-cache, no-store, must-revalidate'); 
header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
header('Pragma: no-cache'); 
require_once('config.php');
			
	$query="SELECT * FROM qshow ORDER by date DESC";			// Query 
	$result=mysql_query($query);								// Query
	if ($result == false) {										// Bad query
		print("Error getting projects");						// Return error
		exit();													// Quit
		}
	$num=mysql_numrows($result);								// Get num rows
	print("<font face='sans-serif'>");							// Font
	print("<b>The current Qmedia projects</b>:<br>");			// Header
	for ($i=0;$i<$num;++$i) {									// For each record
		print("<blockquote>");									// Indent
		print(mysql_result($result,$i,"date")." | ");			// Date
		print(mysql_result($result,$i,"email")." | ");			// Email
		if (mysql_result($result,$i,"version") == 1)			// If MapScholar
			print("<a href='//www.viseyes.org/mapscholar/?".mysql_result($result,$i,"id")."'>".mysql_result($result,$i,"id")."</a> | ");	// Id
		else 													// Qmedia
			print("<a href='//www.qmediaplayer.com/show.htm?".mysql_result($result,$i,"id")."'>".mysql_result($result,$i,"id")."</a> | ");	// Id
		print(mysql_result($result,$i,"title"));				// Title
		print("<br></blockquote>");								// BR
		}
	print("</font>");											// Font
	mysql_close();												// Close session
?>
	
