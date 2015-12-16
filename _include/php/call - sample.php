<?php

$servername = "";
$username = "";
$password = "";
$dbname = "";

try {
    $db = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

	
	$stmt = $db->query('SELECT ID, date FROM gyvg_meeting');
	while($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
	$meetingDate[] = $row['date']; 
	$date_id[] = $row['ID'];
	}
	echo json_encode(array($meetingDate,$date_id));
}
catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
$db = null;

?>