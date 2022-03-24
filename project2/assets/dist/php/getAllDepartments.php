<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getAllDepartments.php

	// remove next two lines for production	
	
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	include("config.php");

	header('Content-Type: application/json; charset=UTF-8');

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname);//, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];

		mysqli_close($conn);

		echo json_encode($output);

		exit;

	}	

	// SQL does not accept parameters and so is not prepared
	//$query1 = 'SELECT id, name, l.name as location FROM department d LEFT JOIN location l ON(l.id=d.locationID)';
	//
	//$query1 = 'SELECT a.id, a.name, a.locationID, l.name FROM department a LEFT JOIN location l on (a.id=l.locationID)';
	$query1= 'SELECT d.id as id, d.name as Department, l.name as Location, l.id as lId FROM department d LEFT JOIN location l ON (l.id = d.locationID)
	ORDER BY d.id, d.name, l.name ';
	
	$result1 = $conn->query($query1);
	if (!$result1) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;

	}
   	$data1 = [];
	while ($row1 = mysqli_fetch_assoc($result1)) {
		array_push($data1, $row1);
	}
///location

//$query2 = 'SELECT id, name, l.name as location FROM department d LEFT JOIN location l ON(l.id=d.locationID)';
	$query2 = 'SELECT id, name FROM location';

$result2 = $conn->query($query2);
if (!$result2) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];
	mysqli_close($conn);
	echo json_encode($output); 
	exit;

}
   $data2 = [];
while ($row2 = mysqli_fetch_assoc($result2)) {
	array_push($data2, $row2);
}


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data']['dept'] = $data1;
	$output['data']['loc'] = $data2;
	
	mysqli_close($conn);

	echo json_encode($output); 

?>