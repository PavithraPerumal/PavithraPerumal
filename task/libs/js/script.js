

$('#btnRun1').click(function () {
			$.ajax({
				url: "libs/php/getCountryInfo.php",
				type: 'POST',
				dataType: 'json',
				data: {
					country: $('#selCountry').val(),
					lang: $('#selLanguage').val()
				},
				success: function (result) {

					console.log(JSON.stringify(result));

					if (result.status.name == "ok") {

						$('#txtContinent').html(result['data'][0]['continent']);
						$('#txtCapital').html(result['data'][0]['capital']);
						$('#txtLanguages').html(result['data'][0]['languages']);
						$('#txtPopulation').html(result['data'][0]['population']);
						$('#txtArea').html(result['data'][0]['areaInSqKm']);

					}

				},
				error: function (jqXHR, textStatus, errorThrown) {
					// your error code
				}
			});

});

$('#latitude').change(function () {
	var latitude = $('#latitude').val();
	$('#txtlatitude').html(latitude);
});

$('#longitude').change(function () {
	var longitude = $('#longitude').val();
	$('#txtlongitude').html(longitude);
});

// JavaScript source code
$('#north').change(function () {
	var north = $('#north').val();
	$('#txtnorth').html(north);
});

$('#south').change(function () {
	var south = $('#south').val();
	$('#txtsouth').html(south);
});
$('#east').change(function () {
	var east = $('#east').val();
	$('#txteast').html(east);
});

$('#west').change(function () {
	var west = $('#west').val();
	$('#txtwest').html(west);
});

$('#btnWeather').click(function () {
	var north = $('#north').val();
	var south = $('#south').val();
	var east = $('#east').val();
	var west = $('#west').val();
	console.log("n,s,e,w=>", north, south, east, west);
	$.ajax({
		url: "http://localhost/task/libs/php/getWeatherInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			north,
			south,
			east,
			west,
		},
		success: function (result) {
			var weatherDetails = result.data;

			if (result.status.name == "ok") {
				$('#txthumidity').html(weatherDetails.humidity);
				$('#txtwindSpeed').html(weatherDetails.windSpeed);
				$('#txttemperature').html(weatherDetails.temperature);
			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			// your error code
		}
	});

});

// JavaScript source code


$('#latitude').change(function () {
	var latitude = $('#latitude').val();
	$('#txtlatitude').html(latitude);
});

$('#longitude').change(function () {
	var longitude = $('#longitude').val();
	$('#txtlongitude').html(longitude);
});

$('#btnOcean').click(function () {
	var latitude = $('#latitude').val();
	var longitude = $('#longitude').val();
	$('#txtlatitude').html(latitude);
	$('#txtlongitude').html(longitude);
	console.log('==>', latitude);
	console.log('==>', longitude);
	$.ajax({
		url: "http://localhost/task/libs/php/getOceanInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			latitude: $('#latitude').val(),
			longitude: $('#longitude').val()
		},
		success: function (result) {

			console.log(JSON.stringify(result));
			var oceanDetail = result.data;

			if (result.status.name == "ok") {

				$('#txtOcean').html(oceanDetail.name);

			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			// your error code
		}
	});

});



// JavaScript source code
$('#north1').change(function () {
	var north = $('#north1').val();
	$('#txtnorth1').html(north);
});

$('#south1').change(function () {
	var south = $('#south1').val();
	$('#txtsouth1').html(south);
});
$('#east1').change(function () {
	var east = $('#east1').val();
	$('#txteast1').html(east);
});

$('#west1').change(function () {
	var west = $('#west1').val();
	$('#txtwest1').html(west);
});

$('#btnEarthquake').click(function () {
	var north = $('#north1').val();
	var south = $('#south1').val();
	var east = $('#east1').val();
	var west = $('#west1').val();
	console.log("n,s,e,w=>", north1, south1, east1, west1);
	$.ajax({
		url: "http://localhost/task/libs/php/getEarthquakeInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			north,
			south,
			east,
			west,
		},
		success: function (result) {
			var weatherDetails = result.data;

			if (result.status.name == "ok") {
				$('#txtdatetime').html(weatherDetails.datetime);
				$('#txtmagnitude').html(weatherDetails.magnitude);
			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			// your error code
		}
	});

});