﻿
/* Map unctions */
//Map init
let Gmap;
let apIcons = {};
//let clicked = false;
function initMap() {
    Gmap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
    });
    // $("map").append(map)
}
// google.maps.event.addDomListener(window, "load", initialize);

function addAirplaneIcon(data) {
    let airplaneIcon = {
        url: "../resources/airplane.png",
        iconSize : new google.maps.Size(5, 5),
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
    airplaneMarker.addListener('click', function () {
        //clicked = true;
        let id = data.payload.flightId;
        let target = { id };
        let flightObj = { target };
        getFlightPlan(flightObj);
    });
}

function removeAirplaneIcon(flightId) {
    // delete from map:
    console.log(apIcons);
    apIcons[flightId].setMap(null);
    delete apIcons[flightId];
}

// Flight selection
function highlightFlight(flightId) {
    apIcons[flightId].setAnimation(google.maps.Animation.BOUNCE); 
}

function coordsToLocation(lati, long) {
    window.alert("Entered cordsToLocation");
    let city;
    let parseAddress;
    let geocoder = new google.maps.Geocoder;
    let loc = { lat: parseFloat(lati), lng: parseFloat(long) };
    geocoder.geocode({ 'location': loc }, function (results, status) {
        if (status == 'OK') {
            if (results[0]) {
                window.alert("Location Found");
                let marker = new google.maps.marker({
                    position: loc,
                    map: map
                });
                parseAddress = geocoder.results[0].address_components;
                $.each(parseAddress, function (i, address_component) {
                    if (address_component.types[0] == "locality") {
                        window.alert(address_component.long_name);
                        city = address_component.long_name;
                    }
                });
                //window.alert(city);
                return city;
            }
            //window.alert(loc);
            return loc.lat.toString() + loc.lng.toString();
        }
        //window.alert(loc);
        return loc.lat.toString() + loc.lng.toString();
    });
}

/* End of Map functions */