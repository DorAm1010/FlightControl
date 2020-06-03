
/* Map functions */
// Global variables
let Gmap;
let currentDisplayedRoute = [];
let destCountry;
let sourceCountry;
let apIcons = {};

//Map init
function initMap() {
    Gmap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
    });
}

// Adding airplane icon (marker) to the map
function addAirplaneIcon(data) {
    let airplaneIcon = {
        url: "../resources/airplane.png",
        scaledSize : new google.maps.Size(15, 15),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };
    let airplaneMarker = new google.maps.Marker({
        position: data.coords,
        map: Gmap,
        icon: airplaneIcon
    });
    apIcons[data.payload.flightId] = airplaneMarker;
    console.log(data.payload.flightId);
    console.log(apIcons[data.payload.flightId]);
    //check info window and add
    if (data.payload) {
        contect: data.payload;
    }
    //adding click function to each marker
    airplaneMarker.addListener('click', function () {
        let id = data.payload.flightId;
        let target = { id };
        let flightObj = { target };
        getFlightPlan(flightObj);
    });
}
// Removing airplanes icons (markers) from map
function removeAirplaneIcon(flightId) {
    //remove all icons
    Object.keys(apIcons).forEach((index) => {
        const airplaneMarker = apIcons[index];
        airplaneMarker.setMap(null);
    });
    removeRoute();
    apIcons = {};
}

// Flight selcted is highlighted by bounce animation
function highlightFlight(flightId) {
    apIcons[flightId].setAnimation(google.maps.Animation.BOUNCE); 
}

// Draw's the route of a flight
function drawRoute(flightPlan) {
    const segments = flightPlan.segments;
    const routeLen = flightPlan.segments.length;
    let lat = flightPlan.initialLocation.latitude;
    let lng = flightPlan.initialLocation.longitude;
    let route = [];
    route.push({ lat: lat, lng: lng });
    for (let i = 0; i < routeLen; i++) {
        lat = segments[i].latitude;
        lng = segments[i].longitude;
        route.push({ lat: lat, lng: lng });
    }
    filledRoute = new google.maps.Polyline({
        path: route,
        geodesic: true,
        strokeColor: '#576AF9',
        strokeOpacity: 1.0,
        strokeWeight: 2,
    });
    // currentDisplayedRoute holds the current flight route to draw on map
    currentDisplayedRoute.push(filledRoute);
    filledRoute.setMap(Gmap);
}

// Remove the current route on map
function removeRoute() {
    for (let i = 0; i < currentDisplayedRoute.length; i++) {
        currentDisplayedRoute[i].setMap(null);
    }
}

// Converts the coords of the destination to a human-readable destination
// with google geocoder API
function coordsToDest(lati, long) {
        let count;
        let rawAddress;
        let parseAddress;
        let geocoder = new google.maps.Geocoder;
        let latlng = new google.maps.LatLng(parseFloat(lati), parseFloat(long));
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    rawAddress = results[0].formatted_address;
                    parseAddress = rawAddress.split(",");
                    count = parseAddress.length;
                    destCountry = parseAddress[count - 1];
                } else {
                    // destCountry is N/A if the location is invalid
                    destCountry = "N/A";
                }
            } else {
                // destCountry is N/A if the geocoder failed
                destCountry = "N/A";
            }
        });
}

// Converts the coords of the source to a human-readable source
// with google geocoder API
function coordsToSource(lati, long) {
        let count;
        let rawAddress;
        let parseAddress;
        let geocoder = new google.maps.Geocoder;
        let latlng = new google.maps.LatLng(parseFloat(lati), parseFloat(long));
        geocoder.geocode({ 'latLng': latlng }, function (results, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                if (results[0]) {
                    rawAddress = results[0].formatted_address;
                    parseAddress = rawAddress.split(",");
                    count = parseAddress.length;
                    sourceCountry = parseAddress[count - 1];
                } else {
                    // sourceCountry is N/A if the location is invalid
                    sourceCountry = "N/A";
                }
            } else {
                // sourceCountry is N/A if the geocoder failed
                sourceCountry = "N/A";
            }
        });
}

/* End of Map functions */