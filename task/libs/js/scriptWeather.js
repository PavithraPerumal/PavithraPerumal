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