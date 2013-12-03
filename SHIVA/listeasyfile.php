<?
	header('Cache-Control: no-cache, no-store, must-revalidate'); 
	header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
	header('Pragma: no-cache'); 
	require_once('../teacher/config.php');
	$email=mysql_real_escape_string($_REQUEST['email']);
	$type=mysql_real_escape_string($_REQUEST['type']);
	$query="SELECT * FROM easyfile WHERE email = '$email'";
	if ($type)
		$query.=" AND type = '$type'";
	$result=mysql_query($query);
	mysql_close();
	$num=mysql_numrows($result);
	if (($result == false) || (!$num))
		echo "No $type files for $email";
	else{
		echo "easyFileListWrapper( [ ";	
		for ($i=0;$i<$num;$i++) {
			echo "{\"title\":\"".mysql_result($result,$i,"title")."\",\"created\":\"".mysql_result($result,$i,"created")."\",\"id\":\"".mysql_result($result,$i,"id")."\",\"type\":\"".mysql_result($result,$i,"type")."\"}";
		if ($i != $num-1)
			echo ",";
			}
		echo " ] )";
		}
		
?>

