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