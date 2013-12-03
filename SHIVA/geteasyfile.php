<?
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
	if (($result == false) || (!mysql_numrows($result)))
		echo "Can't load file!";
	else{
		$type=mysql_result($result,0,"type");
		$data=mysql_result($result,0,"data");
		echo "easyFileDataWrapper(\n";	
		if ($type == "KML") {
			$data=str_replace("\"","'",$data);	
			$data=str_replace("</","|*",$data);	
			$data=str_replace(">","*|",$data);	
			$data=str_replace("<","|*",$data);	
			$data=str_replace("\r\n","",$data);	
			$data=str_replace("\n\r","",$data);	
			$data=str_replace("\n","",$data);	
			$data=str_replace("\t","",$data);	
			echo "{ \"kml\":\"";
			}
//		else
//			$data=str_replace("\"","\\\"",$data);	
		echo $data;
		if ($type == "KML")
			echo "\"}";
		echo "\n)";	
		}
?>

