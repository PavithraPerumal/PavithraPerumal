<?php
//return lati and longi for country code

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	
	

	$result=file_get_contents("countryBorders.geo.json");
	// var_dump($result);
	//var $country=json_decode($_REQUEST['country']);
	// var $country=$_REQUEST['country'];
	$decode = json_decode($result, true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	
	// header('Content-Type: application/json; charset=UTF-8');
	$features = $decode['features'];
	// echo json_encode($features);
	foreach($features as $feature){
	$properties = $feature['properties'];
		if($properties['iso_a2']===$_REQUEST['country']){
		    // $geometry = $properties['geometry'];
			$output['data']=$feature['geometry'];
	    }
	}
	echo json_encode($output);

?>
