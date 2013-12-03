<?
	header('Cache-Control: no-cache, no-store, must-revalidate'); 
	header('Expires: Sun, 01 Jul 2005 00:00:00 GMT'); 
	header('Pragma: no-cache'); 
	require_once('../teacher/config.php');
	$email=mysql_real_escape_string($_REQUEST['email']);			
	$title=mysql_real_escape_string($_REQUEST['title']);			
	$data=($_REQUEST['data']);			
	$type=mysql_real_escape_string($_REQUEST['type']);			
	$created=date("m/d H:i");		
	$sql="INSERT INTO easyfile (email,title,created,data,type) VALUES ('$email','$title','$created','$data','$type')";
	$result=mysql_query($sql,$connection) or die ("Couldn't execute query.");
	if ($result == false)									// Bad save
		print("-2\n");										// Return error
	else													// Good save
		print(mysql_insert_id()."\n");						// Return ID of new user
	mysql_close();
?>
	

