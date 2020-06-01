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
        }
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
        }
    ]
};
// JSON ex.
let progRun;
let currentMarkedFlight;
//Initialize app
window.onload = function load() {
    //$('#dragAndDrop').hide();
    //running = true;
    //sleep(200);
    this.raiseNotification(`Welcome to Flight Control!
    1. You can add Flight Plans by dropping the files at the tables.
    2. You can receive each flight's details by clicking on the desired entry in the list.
    3. You can remove an internal flight by clicking the red button in the raised popup of each entry.`);
    this.initFlights();
   // sleep(100);
    //this.deleteEndedFlight();
    //this.asyncUpdates();
};


function addMyFlightsT(flight) {
    let myFlightsT = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
    let row = myFlightsT.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    row.setAttribute("onclick", "getFlightPlan(event)");
    row.id = flight.flightId;
    row.setAttribute("data-toggle", "popover");
    idCell.id = flight.flightId;
    idCell.innerText = flight.flightId;
    companyCell.id = flight.flightId;
    companyCell.innerText = flight.companyName;
    updatePopovers(flight.flightId);
}

function updatePopovers(flightID) {
    //window.alert(flightID);
    $('[data-toggle="popover"]').popover({
        animation: true,
        placement: "auto",
        trigger: "hover focus",
        id: flightID,
        html: true,
        delay: { "show": 200, "hide": 1500 },
        content: function () {
            let delB = document.createElement("button");
            delB.value = "X";
            delB.id = flightID;
            delB.className = "btn btn-danger";
            delB.setAttribute("onclick", "deleteFlight(event)");
            return delB;
        }
    });
}

function addExternalFlightsT(flight) {
    let externFlightsT = document.getElementById("externFlightsT").getElementsByTagName('tbody')[0];;
    let row = externFlightsT.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    let tdText;
    row.setAttribute("onclick", "showFlightDetails(event)");
    idCell.id = flight.flightId;
    idCell.innerHTML = flight.flightId;
    companyCell.id = flight.flightId;
    companyCell.innerHTML = flight.companyName;
}

// sort flights to relevant table
function sortFlights(flight) {
    if (flight.isExternal === true) {
        addExternalFlightsT(flight)
    } else if (flight.isExternal === false) {
        addMyFlightsT(flight);
    } else {
        //raiseNotification
    }
}

//GET (flights)
// receive all flights from server
function initFlights() {
    let flighturl = "../api/Flights?relative_to=2020-05-26T12:00:00Z&sync_all";
    $.getJSON(flighturl)
        .done(function (flights) {
            flights.forEach(function (flight) {
                sortFlights(flight);
                addAirplaneIcon({
                    coords: { lng: flight.longitude , lat: flight.latitude },
                    payload: flight
                });
            });
        })
        .fail(function (reason) {
            console.log("Failed loading flights");
        });
}

//POST
function sendFlightPlan(events) {
    let flightPlanzzz = flightPlan1;
    let postUrl = "../api/FlightPlan";
    fetch(postUrl, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightPlanzzz),
    })
    .then(response => response.json())
        .then(flightPlanzzz => {
            console.log('Success:', flightPlanzzz);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

//GET (flight plan)
function getFlightPlan(event) {
    if (currentMarkedFlight != null) {
        highlightCancel(currentMarkedFlight);
    }
    currentMarkedFlight = event.target.id;
    let getFPUrl = `../api/FlightPlan/${event.target.id}`;
    $.getJSON(getFPUrl)
        .done(function (flightPlan) {
            window.alert(flightPlan.companyName);
            highlightEntry(event.target.id);
            highlightFlight(event.target.id);
            showFlightDetails(flightPlan);
        })
        .fail(function (reason) {
            console.log("Failed to get flight's info");
        });
}

//LOCATIONS
function getLocation(event) {
    //let localID = "SA856B9CBD";
    let flighturl = `../api/FlightPlan/locations/${localID}`;
    //let flighturl = "../api/Flights";
    $.getJSON(flighturl)
        .done(function (locations) {
            let sourceP = { lng: parseFloat(locations[0]), lat: parseFloat(locations[1]) };
            let destP = { lng: parseFloat(locations[2]), lat: parseFloat(locations[3]) };
            console.log(sourceP.lng + " " + sourceP.lat + " " + destP.lng + " " + destP.lat);
        })
        .fail(function (reason) {
            console.log("Failed to get flight's locations");
        });
}

//DELETE
function deleteFlight(event) {
    let toDel = confirm(`Do you want to delete flight "${event.target.id}" ?`);
    if (toDel != true) {
        return;
    }
    // let notif = new Notification("flight will be deleted");
    let deleteUrl = `../api/Flights/${event.target.id}`;
    let localididid = event.target.id;
    fetch(deleteUrl, {
        method: 'DELETE'
    }).then(() => {
        console.log(event.target.id + 'removed');
        removeFlightFromT(event.target.id);
    }).catch(err => {
        console.error(err)
    });
    if (currentMarkedFlight == event.target.id) {
        currentMarkedFlight = null;
    }
}

function removeFlightFromT(flightId) {
    let rowToRemove = document.getElementById(`${flightId}`);
    rowToRemove.parentNode.removeChild(rowToRemove);
    removeAirplaneIcon(flightId);
}

function highlightEntry(flightId) {
    let rowToHighlight = document.getElementById(`${flightId}`);
    rowToHighlight.style.backgroundColor = "#808FFF";
}

function highlightCancel(flightId) {
    //let myFlightsT = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
    // Remove flight details
    if (flightDetails.rows.length > 1) {
        flightDetails.deleteRow(1);
    }
    // Remove row highlight
    let canceledRow = document.getElementById(`${flightId}`);
    canceledRow.style.backgroundColor = "";
    // Remove airplane animation
    apIcons[flightId].setAnimation(null);
}


function showFlightDetails(flightPlan) {
    let flightDetails = document.getElementById("flightDetails");
    let row = flightDetails.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    let sourceCell = row.insertCell();
    let destinationCell = row.insertCell();
    let takeoffCell = row.insertCell();
    let landingCell = row.insertCell();
    let passengersCell = row.insertCell();
    companyCell.innerText = flightPlan.companyName;
    //tdText = coordsToLocation(flightPlan.initial_location.latitude, flightPlan.initial_location.longitude);
    //sourceCell.appendChild(tdText);
    //tdText = document.createTextNode(flightPlan.passengers);
    passengersCell.innerText = flightPlan.passengers;
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

//Display notifications
function raiseNotification(notif) {
    $('notificationWindow').show();
    document.getElementById('notification').innerHTML = notif;
    $('notificationWindow').fadeTo(1000, 200).slideUp(200, function () {
        $('notificationWindow').slideUp(200);
    });
}

async function updateFlights() {
    while (running) {

    }
}






