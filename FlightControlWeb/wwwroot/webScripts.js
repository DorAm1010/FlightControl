// JSON ex.
let flight1 =
{
    "flight_id": "55555",
    "longitude": 33.244,
    "latitude": 31.12,
    "passengers": 216,
    "company_name": "SwissAir",
    "date_time": "2020-12-26T23:56:21Z",
    "is_external": false
};

let flight2 =
{
    "flight_id": "44444",
    "longitude": 33.244,
    "latitude": 31.12,
    "passengers": 216,
    "company_name": "Dor",
    "date_time": "2020-12-26T23:56:21Z",
    "is_external": false
};

let flight3 =
{
    "flight_id": "22222",
    "longitude": 33.244,
    "latitude": 31.12,
    "passengers": 216,
    "company_name": "Yakir",
    "date_time": "2020-12-26T23:56:21Z",
    "is_external": true
};

let flightPlan1 =
{
    "passengers": 216,
    "company_name": "SwissAir",
    "initial_location": {
        "longitude": 32.006517,
        "latitude": 34.885265,
        "date_time": "2020-12-26T23:56:21Z"
    },
    "segments": [
        {
            "longitude": 33.234,
            "latitude": 31.18,
            "timespan_seconds": 650
        },
        /*... more segments...*/
    ]
};

let flightPlan2 =
{
    "passengers": 320,
    "company_name": "Dor",
    "initial_location": { 
        "longitude": 31.720005,
        "latitude": 35.987877,
        "date_time": "2020-12-26T23:56:21Z"
    },
    "segments": [
        {
            "longitude": 33.234,
            "latitude": 31.18,
            "timespan_seconds": 650
        },
        /*... more segments...*/
    ]
};

// JSON ex.

let localFlightsManager = [flight1, flight2];
let localFlightPlans = [flightPlan1, flightPlan2];

/* Map unctions */
//Map init
let Gmap;
let apIcons = {};
let clicked = false;
function initMap() {
    Gmap = new google.maps.Map(document.getElementById('map'), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 2
    });
    // $("map").append(map)
}
//google.maps.event.addDomListener(window, "load", initialize);

function addAirplaneIcon(data) {
    let airplaneIcon = {
        url: ".../resources/airplane.png",
        iconSize = new google.maps.Size(15, 15),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    };
    let airplaneMarker = new google.maps.Marker({
        position: data.coords,
        map: Gmap,
        icon: airplaneIcon
    });
    apIcons[data.payload.flight_id] = airplaneMarker;
    //check info window and add
    if (data.payload) {
        contect: data.payload;
    }
    airplaneMarker.addListener('click', function () {
        clicked = true;
        highlightFlight(data.payload);
    });
}
/* End of Map functions */


let myFlightsT = document.getElementById("myFlightsT");
let numberOfFlights;
function addMyFlightsT(flight) {
        let row = myFlightsT.insertRow();
        //let deletePop;
        let idCell = row.insertCell();
        let companyCell = row.insertCell();
        let tdText;
        row.setAttribute("onclick", "showFlightDetails(event)");
        idCell.setAttribute("id", "flight.flight_id");
        idCell.setAttribute("onmouseover", "raisePopup(event)");
        companyCell.setAttribute("id", "flight.flight_id")
        companyCell.setAttribute("onmouseover", "raisePopup(event)")
        tdText = document.createTextNode(flight.flight_id);
        idCell.appendChild(tdText);
        tdText = document.createTextNode(flight.company_name);
        companyCell.appendChild(tdText);
        //deletePop.setAttribute("style", "display: none");
        //row.appendChild()
}

let externFlightsT = document.getElementById("externFlightsT");
function addExternalFlightsT(flight) {
        let row = externFlightsT.insertRow();
        //let deletePop;
        let idCell = row.insertCell();
        let companyCell = row.insertCell();
        let tdText;
        row.setAttribute("onclick", "showFlightDetails(event)");
        idCell.setAttribute("id", "flight.flight_id");
        idCell.setAttribute("onmouseover", "raisePopup(event)");
        companyCell.setAttribute("id", "flight.flight_id")
        companyCell.setAttribute("onmouseover", "raisePopup(event)")
        tdText = document.createTextNode(flight.flight_id);
        idCell.appendChild(tdText);
        tdText = document.createTextNode(flight.company_name);
        companyCell.appendChild(tdText);
        //deletePop.setAttribute("style", "display: none");
        //row.appendChild()
}

function sortFlights(flight) {
    if (flight.is_external === true) {
        addExternalFlightsT(flight)
    } else if (flight.is_external === false) {
        addMyFlightsT(flight);
    } else {
        //raiseNotification
    }
}

// receive all flights from server
function initFlights() {
    let flighturl = "../api/Flights?relative_to==2020-5-26T12:00:00Z&sync_all";
    $.getJSON(flighturl)
        .done(function (flights) {
            flights.forEach(function (flight) {
                sortFlights(flight);
                addAirplaneIcon({
                    coords: { lat: flight.latitude, lng: flight.longitude },
                    payload: flight
                });
            });
        })
        .fail(function (reason) {
            //raiseNotification(reason);
        });
}

// Flight selection
function highlightFlight(flight) {

}

function highlightEntry(flightTable, flight) {
    let tableId;
    //let entry;
    //let rows;
    //rows = flightTable.getElementById('tr');
    for (let i = 0, row; row = flightTable.rows[i]; i++) {
        tableId = row.idCell.id;
        if (tableId === flight.flight_id) {
            row.style.backgroundColor = "#808FFF";
        } else {
            row.style.backgroundColor = "";
        }
    }
}

function highlightCancel(event) {
    if (!clicked) {
        //remove path
        //
        // Remove flight details
        if (flightDetails.rows.length > 1) {
            flightDetails.deleteRow(1);
        }
        // Remove row highlight
        for (let i = 1, row; row = myFlightsT.rows[i]; i++) {
            row.style.backgroundColor = "";
        }
        for (let i = 1, row; row = externFlightsT.rows[i]; i++) {
            row.style.backgroundColor = "";
        }
        // Remove airplane animation
        for (let plane in apIcons) {
            apIcons[plane].setAnimation(null);
        }
    }
    clicked = false;
}

function raisePopup() {

}

function deleteFlight(flightID) {
    window.alert(row.flight_id);
}

let flightDetails = document.getElementById("flightDetails");
function showFlightDetails(ev) {
    localFlightPlans.forEach(function (flightPlan) {
        let row = flightDetails.insertRow();
        let idCell = row.insertCell();
        let companyCell = row.insertCell();
        let sourceCell = row.insertCell();
        let destinationCell = row.insertCell();
        let takeoffCell = row.insertCell();
        let landingCell = row.insertCell();
        let passengersCell = row.insertCell();
        let tdText;
        tdText = document.createTextNode(flightPlan.company_name);
        companyCell.appendChild(tdText);
     //   window.alert(flightPlan.initial_location.latitude + " " + flightPlan.initial_location.longitude);
        tdText = coordsToLocation(flightPlan.initial_location.latitude, flightPlan.initial_location.longitude);
     //   window.alert("location is " + tdText);
        sourceCell.appendChild(tdText);
        tdText = document.createTextNode(flightPlan.passengers);
        passengersCell.appendChild(tdText);
    });
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

function addFlight(flight) {

}

function internDrop(ev) {
    console.log('File(s) dropped');

    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (let i = 0; i < ev.dataTransfer.items.length; i++) {
            // If dropped items aren't files, reject them
            if (ev.dataTransfer.items[i].kind === 'JSON') {
                let file = ev.dataTransfer.items[i].getAsFile();
                console.log('... file[' + i + '].name = ' + file.name);
            }
        }
    } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
            console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
            DataTransferItemList.FlightsArr += ev.dataTransfer.files[i];
        }
    }
}

async function updateFlights() {
    while (running) {

    }
}






