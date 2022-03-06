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
	var latitude = $('#latitude').val() ;
	var longitude = $('#longitude').val();
	$('#txtlatitude').html(latitude);
	$('#txtlongitude').html(longitude);
	console.log('==>',latitude);
	console.log('==>',longitude);
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



