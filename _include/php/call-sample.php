<?php

$servername = "";
$username = "";
$password = "";
$dbname = "";

try {
    $db = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES 'utf8'"));
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	
	$stmt = $db->query('SELECT ID, date FROM gyvg_meeting');
	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$meetingDate[] = $row['date']; 
	$date_id[] = $row['ID'];
	}
	
	$stmtTwo = $db->query('SELECT ID, message, due_date FROM gyvg_meeting_message');
	while($row = $stmtTwo->fetch(PDO::FETCH_ASSOC)) {
	$message_id[] = $row['ID']; 
	$message[] = $row['message'];
	$dueDate[] = $row['due_date'];
	}
	echo json_encode(array($meetingDate,$date_id,$message,$dueDate));
}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$db = null;

?>