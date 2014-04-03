<?php
	header('Content-Type: text/xml');
	header('Cache-Control: no-cache, no-store, must-revalidate'); 
	header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
	header('Pragma: no-cache'); 
	require_once('../teacher/config.php');
	$id=mysql_real_escape_string($_GET['id']);
	if (!is_nan($id)) {
		$query="SELECT * FROM easyfile WHERE id = '$id'";
		$result=mysql_query($query);
		}
	else
		$result=false;
	mysql_close();
	ob_clean();
	if (($result == false) || (!mysql_numrows($result)))
		echo "Can't load file!";
	else{
		$r=mysql_result($result,0,"data");
		if (!strstr($r,"<?xml"))
			echo "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n";
		echo $r;
		}
?>