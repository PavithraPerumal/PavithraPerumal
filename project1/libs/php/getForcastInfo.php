<?php

	// remove for production

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	
	//$url='http://api.geonames.org/countryCode?lat=' . $_REQUEST['latitude'] . '&lng='.$_REQUEST['longitude'] . '&username=pavithraperumal&type=JSON';

	$url='http://api.weatherapi.com/v1/forecast.json?key=f7564bf3f300433abd6153334221703&q='.$_REQUEST['capital'].'&days=3&aqi=no&alerts=no';
	$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	
	// var_dump($decode);
	// echo $url;
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data']=$decode;
	
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>