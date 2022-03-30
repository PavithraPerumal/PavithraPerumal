<?php

	// example use from browser
	// http://localhost/companydirectory/libs/php/getDepartmentByID.php?id=<id>

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
	$dfilter=$_REQUEST['dfilter'];
	$lfilter=$_REQUEST['lfilter'];
	if(($dfilter!=null || $dfilter!="-1") && ($lfilter!=null || $lfilter!="-1")){
		$query = $conn->prepare('SELECT p.id as id, p.lastName, p.firstName, p.jobTitle, p.email, d.id as dID, l.id as lID, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id= ? AND l.id=? AND (UPPER(p.lastName) LIKE ? OR UPPER(p.firstName) LIKE ? OR UPPER(p.email) LIKE ? ) ORDER BY p.lastName, p.firstName, d.name, l.name');
		$p=$_REQUEST['search'];
		$param = "%".$p."%";
		$query->bind_param("iisss",$dfilter, $lfilter, $param ,$param,$param);
	}
	else if(($dfilter==null || $dfilter=="-1")&& ($lfilter==null || $lfilter=="-1")){
		$query = $conn->prepare('SELECT p.id as id, p.lastName, p.firstName, p.jobTitle, p.email, d.id as dID, l.id as lID, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE UPPER(p.lastName) LIKE ? OR UPPER(p.firstName) LIKE ? OR UPPER(p.email) LIKE ? ORDER BY p.lastName, p.firstName, d.name, l.name');
		$p=$_REQUEST['search'];
		$param = "%".$p."%";
		$query->bind_param("sss", $param ,$param,$param);
	}
	else if( $lfilter==null || $lfilter=="-1"){
		$query = $conn->prepare('SELECT p.id as id, p.lastName, p.firstName, p.jobTitle, p.email, d.id as dID, l.id as lID, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE d.id= ? AND (UPPER(p.lastName) LIKE ? OR UPPER(p.firstName) LIKE ? OR UPPER(p.email) LIKE ? ) ORDER BY p.lastName, p.firstName, d.name, l.name');
		$p=$_REQUEST['search'];
		$param = "%".$p."%";
		$query->bind_param("isss",$dfilter, $param ,$param,$param);
	}
	else if ($dfilter==null || $dfilter=="-1"){
		$query = $conn->prepare('SELECT p.id as id, p.lastName, p.firstName, p.jobTitle, p.email, d.id as dID, l.id as lID, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE l.id= ? AND (UPPER(p.lastName) LIKE ? OR UPPER(p.firstName) LIKE ? OR UPPER(p.email) LIKE ? ) ORDER BY p.lastName, p.firstName, d.name, l.name');
		$p=$_REQUEST['search'];
		$param = "%".$p."%";
		$query->bind_param("isss",$lfilter, $param ,$param,$param);
	}
	



	$query->execute();
	
	if (false === $query) {

		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		echo json_encode($output); 
	
		mysqli_close($conn);
		exit;

	}

	$result = $query->get_result();

   	$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	echo json_encode($output); 

	mysqli_close($conn);

?>