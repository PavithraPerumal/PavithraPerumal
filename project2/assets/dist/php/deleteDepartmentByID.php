<?php

	// example use from browser
	// use insertDepartment.php first to create new dummy record and then specify it's id in the command below
	// http://localhost/companydirectory/libs/php/deleteDepartmentByID.php?id=<id>

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

	// SQL statement accepts parameters and so is prepared to avoid SQL injection.
	// $_REQUEST used for development / debugging. Remember to change to $_POST for production

	//$query = $conn->prepare('DELETE FROM department WHERE id = ?');
	//$query = $conn->prepare('DELETE FROM location WHERE id= ? AND id NOT IN (SELECT DISTINCT(locationID) FROM department'));
	// $query1=$conn->prepare('SELECT COUNT(*) DEPENDENCY_COUNT FROM personnel WHERE departmentID = ?');
	// $query1->bind_param("i", $_REQUEST['id']);
	// $query1->execute();
	

	// if (false === $query1) {

	// 	$output['status']['code'] = "400";
	// 	$output['status']['name'] = "executed";
	// 	$output['status']['description'] = "query failed";	
	// 	$output['data'] = [];

	// 	mysqli_close($conn);

	// 	echo json_encode($output); 

	// 	exit;

	// }
	// $result1 = $query1->get_result();
	// $row1 = mysqli_fetch_assoc($result1);
	// // $data1 = [];
	// // while ($row = mysqli_fetch_assoc($result1)) {

	// // 	array_push($data, $row);

	// // }
	


	// if ($row1['DEPENDENCY_COUNT']>0)
	// {
	// 	//print_r($row1['DEPENDENCY_COUNT']);
	// 	$output['status']['code'] = "200";
	// 	$output['status']['name'] = "ok";
	// 	$output['status']['description'] = "success";
	// 	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	// 	$output['data'] = $row1['DEPENDENCY_COUNT'];
	// 	mysqli_close($conn);

	// 	echo json_encode($output); 
		
	// }

	// else{
	$query2=$conn->prepare('DELETE FROM department WHERE id = ?');
	$query2->bind_param("i", $_REQUEST['id']);
	$query2->execute();
	$result2 = $query2->get_result();
	//$row2 = mysqli_fetch_assoc($result2);
	//print_r($result2);
	if (false === $query2) {

		$output['status']['code'] = "400";
	 	$output['status']['name'] = "executed";
	 	$output['status']['description'] = "query failed";	
	 	$output['data'] = [];
	 	mysqli_close($conn);
	 	echo json_encode($output); 
	 	exit;
	 }


	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = -1;
	
	mysqli_close($conn);

	echo json_encode($output); 
	

?>