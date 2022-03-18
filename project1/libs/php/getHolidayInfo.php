<?php



	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

	//$url='http://api.geonames.org/countryInfoJSON?formatted=true&lang=' . $_REQUEST['lang'] . '&country=' . $_REQUEST['country'] . '&username=flightltd&style=full';
	$url='https://holidays.abstractapi.com/v1/?api_key=4d57f9bcd21044f58e4d6742eefee5e9&country='. $_REQUEST['country'] .'&year='. $_REQUEST['cYear'];// .'&month='. $_REQUEST['cMonth'];
	
	
// Initialize cURL.
$ch = curl_init();

// Set the URL that you want to GET by using the CURLOPT_URL option.
//curl_setopt($ch, CURLOPT_URL, 'https://holidays.abstractapi.com/v1/?api_key=4d57f9bcd21044f58e4d6742eefee5e9&country=US&year=2020&month=12&day=25');


//curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
// Set CURLOPT_RETURNTRANSFER so that the content is returned as a variable.
//curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

// Set CURLOPT_FOLLOWLOCATION to true to follow redirects.
//curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);



curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);



// Execute the request.
$result = curl_exec($ch);

// Close the cURL handle.
curl_close($ch);

//echo $result;

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
