let country = "";
let countryName = "";
let earthQuakeMarkers = L.markerClusterGroup();
let markersAirport = L.markerClusterGroup();
let markersTourist = L.markerClusterGroup();
var feature = null;//for boundary



var mymap = L.map('mapid').setView([51.5015385807725, -0.147456], 6);

//const accessToken = 'B5scqZ6aUALAqFgKkvM4YCzxrTqEivwNR4oNs1LI6kKdCqVSl7oax00Ls9iSpLPK';

L.tileLayer('https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}', {
	attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	minZoom: 0,
	maxZoom: 20,
	scrollWheelZoom: 'center',
	doubleClickZoom: 'center',
	subdomains: 'abcd',
	accessToken: 'B5scqZ6aUALAqFgKkvM4YCzxrTqEivwNR4oNs1LI6kKdCqVSl7oax00Ls9iSpLPK'
}).addTo(mymap);



L.easyButton('<img src="libs/img/information.png" width="40" height="40"/>', function (btn, map) {
	showModal("countryinfo");
}).addTo(mymap);

L.easyButton('<img src="libs/img/weather.png" width="40" height="40"/>', function (btn, map) {
	showModal("weatherinfo");
}).addTo(mymap);

L.easyButton('<img src="libs/img/earthquake01.png" width="40" height="40"/>' , function (btn, map) {
	showModal("earthquakeinfo");
}).addTo(mymap);


L.easyButton('<img src="libs/img/avion.png" width="40" height="40"/>', function (btn, map) {
	showModal("airportinfo");
}).addTo(mymap);

L.easyButton('<img src="libs/img/folded-map.png" width="40" height="40"/>', function (btn, map) {
	showModal("touristinfo");
}).addTo(mymap);

L.control.custom({
	position: 'topright',
	content: ' <select id="selCountry" onchange="CountryBoundary();">' +
		'< option value="GB" > United Kinngdom </option>' +
		'</select > ',
}).addTo(mymap);

function showModal(modalId) {
	document.getElementById(modalId).style.display = 'block';
}
// close when clicked elsewhere
window.onclick = function (event) {
	if (event.target == airportinfo) {
		airportinfo.style.display = "none";
	}
	if (event.target == touristinfo) {
		touristinfo.style.display = "none";
	}
	if (event.target == earthquakeinfo) {
		earthquakeinfo.style.display = "none";
	}
	if (event.target == weatherinfo) {
		weatherinfo.style.display = "none";
	}

	if (event.target == countryinfo) {
		countryinfo.style.display = "none";
	}
		
}





//getting country information , update global variables, call other functions - earthquake, airport, weather, tourism
async function countryinfo(country = "IN") {
	let north = 59.3607741849963;
	let south = 49.9028622252397;
	let east = 1.7689121033873;
	let west = -8.61772077108559;
	//let lati = 51.5015385807725;
	//let longi = -0.14176521957406812;
	let geonameId = 2635167;
	let selectedCountry = $('#selCountry').val();
	console.log("contry from country info", country);
	return $.ajax({
		url: "libs/php/getCountryInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			country: selectedCountry,
			lang: "en"
		},
		success: function (result) {
			if (result.status.name == "ok") {
				let inf = new Intl.NumberFormat('en-US');
				$('#txtCountry').html(result['data'][0]['countryName']);
				$('#txtContinent').html(result['data'][0]['continentName']);
				$('#txtCapital').html(result['data'][0]['capital']);
				$('#txtLanguages').html(result['data'][0]['languages']);
				$('#txtPopulation').html(inf.format(result['data'][0]['population']));
				$('#txtArea').html(inf.format(result['data'][0]['areaInSqKm']));
				countryName = result['data'][0]['countryName'];
				north = result['data'][0]['north'];
				south = result['data'][0]['south'];
				east = result['data'][0]['east'];
				west = result['data'][0]['west'];
				geonameId = result['data'][0]['geonameId'];

				weather(north, south, east, west);
				earthquake(north, south, east, west);
				tourist(geonameId);
				airport(selectedCountry);
				
				
			}
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}
	});
};

////gets called when the document is loaded- to get geolocation of the user
function getLocation() {
	navigator.geolocation.getCurrentPosition(showPosition);
	
}

async function showPosition(geo) {
	
	lati = geo.coords.latitude;
	longi = geo.coords.longitude;
	

	var uIcon = L.AwesomeMarkers.icon({
		icon: 'star', prefix: 'fa', markerColor: 'darkred',

	});
	var marker1 = L.marker([geo.coords.latitude, geo.coords.longitude], { icon: uIcon }).addTo(mymap);
	marker1.bindPopup('<b>You are Here!</b>');

		////get country code for geo.coords.  lati and longi and call country info to update the global variables
	$.ajax({
		url: "libs/php/getCountryCode.php",
		type: 'POST',
		dataType: 'json',
		data: {
			latitude: geo.coords.latitude,
			longitude: geo.coords.longitude,
		},
		success: function (result) {
			console.log("countrycode=>", result);
			console.log(JSON.stringify(result));
			country = result.data;
			console.log("country selected", country)
			if (result.status.name == "ok") {
				$("#selCountry").val(country).change();
				country = result;
				console.log("countrycode=>", result);
			}

		
			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log("failed");
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);

		}
	});

}

//drop down for selection of countries

function selectCountries() {
	$.ajax({
		url: "libs/php/getCountryList.php",
		type: 'POST',
		dataType: 'json',

		success: function (result) {

			console.log("inside select - success");
			let countries = result.data;
		
			let optionv = `<option value="">---Select Country---</option>`;
			for (const c of countries) {
				optionv += `<option value=${c['countryCode']}>${c['countryName']}</option>`;
			};
			$("#selCountry").append(optionv).select();

		},
		error: function (jqXHR, textStatus, errorThrown) {
			
			console.log(errorThrown);
			console.log("failed in selection");
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}
	});



};

//put the boundary for country selected and call country info - called when change happens in select-countries dropdown
function CountryBoundary() {

	let selectedCountry = $('#selCountry').val();
	console.log("country selected :", selectedCountry);
	
	$.ajax({
		url: "libs/php/getLatLong.php",
		type: "GET",
		dataType: "json",
		data: {
			country: selectedCountry,
		},
		success: function (result) {
			console.log(result);

			if (result.status.name == "ok") {
				const { type, coordinates } = result.data;

				var geojsonFeature = {
					'type': 'Feature',
					'geometry': {
						'type': type,
						'coordinates': coordinates
					}
				};
				
							
				countryinfo(selectedCountry);// calls other functions
		
			}
			if (feature) {
				feature.clearLayers();
			}


			var featureStyle = {
				"color": '#bf18b7',
				"weight": 2,
				"opacity": 1,
			}

			feature = L.geoJSON(geojsonFeature, { style: featureStyle }).addTo(mymap);

			var bounds = feature.getBounds();
			mymap.fitBounds(bounds);

			
		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}
	});
}



function weather(north, south, east, west) {

	console.log("n,s,e,w=>", north, south, east, west);
	$.ajax({
		url: "libs/php/getWeatherInfo.php",
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
			console.log("hi from weather", north);
			if (result.status.name == "ok") {
				$('#txthumidity').html(weatherDetails.humidity);
				$('#txtwindSpeed').html(weatherDetails.windSpeed);
				$('#txttemperature').html(weatherDetails.temperature);
				$('#txtstationName').html(weatherDetails.ICAO);
				$('#txtclouds').html(weatherDetails.clouds);
				
				
			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}

	});

}

// mark earth earthquakes on map

function earthquake(north, south, east, west) {
	console.log("n,s,e,w=>", north, south, east, west);
	console.log("marker eq len", earthQuakeMarkers.getLayers().length);
	earthQuakeMarkers.clearLayers();
	$.ajax({
		url: "libs/php/getEarthquakeInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			north,
			south,
			east,
			west,
		},
		success: function (result) {
			let eqList = result.data;
			
			if (result.status.name == "ok") {
				for (i = 0; i < eqList.length; i++) {
					eq = eqList[i];
					var eqIcon = L.AwesomeMarkers.icon({
						icon: 'fa-align-center', prefix:"fa",  markerColor: 'black'
					});
					let marker2 = L.marker([eq.lat, eq.lng], { icon: eqIcon });
					let pop = `Earthquake<br/>Date:${eq.datetime}<br/>Magnitude: ${eq.magnitude}`;
					marker2.bindPopup(pop);
					earthQuakeMarkers.addLayer(marker2);

				}
				
				mymap.addLayer(earthQuakeMarkers);//add markers to map
				$('#txtdatetime').html(eq.datetime);//update data on html
				$('#txtmagnitude').html(eq.magnitude);
				$('#txtlatitude').html(eq.lat);
				$('#txtlongitude').html(eq.lng);

			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}
	});

}


/////airport
function airport(country) {
	let apcount = 0;
	let airports = " ";//stores names of all airports
	let marker3=null;
	let pop;
	markersAirport.clearLayers();
	console.log("find airport for ", country);
	$.ajax({
		url: "libs/php/getAirportInfo.php",
		type: 'POST',
		dataType: 'json',

		success: function (result) {
			let apList = result.data;
			
			
			if (result.status.name == "ok") {
				for (i = 0; i < apList.length; i++) {
					
						ap = apList[i];
                    //types of airports large, medium, small
					if ((country == ap.iso_country) && (ap.type == "large_airport") ) {
						apcount = apcount + 1;
						airports += `${apcount} . ${ap.name}<br/>`;
						let apIcon = L.AwesomeMarkers.icon({
							icon: 'plane', prefix: 'fa', markerColor: '#f109d0'
						});
						 marker3 = L.marker([ap.latitude_deg, ap.longitude_deg], { icon: apIcon });
						 pop = `Name:${ap.name}`;
						marker3.bindPopup(pop);
						
						markersAirport.addLayer(marker3);
						}

				}

				mymap.addLayer(markersAirport);
				$('#txtairport').html(airports);
				$('#txtapcountry').html(countryName);
			}

		},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
			
		}
	});

}

function tourist(geonameId) {

	console.log("geonameId inside tourist fn=>", geonameId);
	markersTourist.clearLayers();
	$.ajax({
		url: "libs/php/getTouristSpotInfo.php",
		type: 'POST',
		dataType: 'json',
		data: {
			geonameId,
		},
		success: function (result) {
			let tsList = result.data;
			let tscount = 0;
			let ts;
			let marker4;
			let pop;
			let visit = "";
			console.log(tsList);
			 
			
			if (result.status.name == "ok") {
				for (i = 0; i < tsList.length; i++) {
					
					ts = tsList[i];
						tscount = tscount + 1;
					//console.log(ts.name);
					
					visit += `${tscount} . ${ts.name}<br/>`;;
					
						let tsIcon = L.AwesomeMarkers.icon({
							icon: 'fa-camera', prefix: 'fa', markerColor: 'orange'
						});
						 marker4 = L.marker([ts.lat, ts.lng], { icon: tsIcon });
						 pop = `Name of state: ${ts.name}`;
						marker4.bindPopup(pop);
						markersTourist.addLayer(marker4);

				}
			}
				mymap.addLayer(markersTourist);
				$('#txttourist').html(visit);
			
			},
		error: function (jqXHR, textStatus, errorThrown) {
			console.log(errorThrown);
			console.log(jqXHR.responseText);
			console.log(textStatus);
		}
	});

}

$(document).ready(function () {

	$(window).on('load', function () {
		if ($('#preloader').length) {
			$('#preloader').delay(5500).fadeOut('slow', function () {
				$(this).remove();
			});
		}
	});

	selectCountries();
	getLocation();
});
