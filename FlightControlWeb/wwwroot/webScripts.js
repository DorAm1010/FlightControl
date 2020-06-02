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
    $("#dnd").hide();
    //running = true;
    //sleep(200);
    //progRun = true;
    document.getElementById('dragpic').style.display = 'none';
    this.raiseNotification(`Welcome to Flight Control!
    1. You can add Flight Plans by dropping the files at the tables.
    2. You can receive each flight's details by clicking on the desired entry in the list.
    3. You can remove an internal flight by clicking the red button in the raised popup of each entry.`);
    this.initFlights();
    this.setInterval(function () { updateFlights(); }, 500);
    //sleep(150);
    //this.deleteEndedFlight();
    //this.updateFlights();
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

//Check if flight exists
function isAlreadyPresent(flightId) {
    if (document.getElementById("myFlightsT").rows.namedItem(`${flightId}`) != null) {
        return true;
    }
    return false;
}

//GET (flights)
// receive all flights from server
function initFlights() {
    let flighturl = "../api/Flights?relative_to=2020-05-26T12:00:00Z&sync_all";
    $.getJSON(flighturl)
        .done(function (flights) {
            flights.forEach(function (flight) {
                if (!isAlreadyPresent(flight.flightId)) {
                    sortFlights(flight);
                    addAirplaneIcon({
                        coords: { lng: flight.longitude, lat: flight.latitude },
                        payload: flight
                    });
                } else {
                    updateLocation(flight);
                }
            });
        })
        .fail(function (reason) {
            console.log("Failed loading flights");
        });
}

//POST
function sendFlightPlan(flightPlan) {
    //let flightPlanzzz = flightPlan1;
    let postUrl = "../api/FlightPlan";
    fetch(postUrl, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(flightPlan),
    })
    .then(response => response.json())
        .then(flightPlan => {
            console.log('Success:', flightPlan);
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
            highlightEntry(event.target.id);
            highlightFlight(event.target.id);
            showFlightDetails(flightPlan, event.target.id);
            drawRoute(flightPlan);
        })
        .fail(function (reason) {
            console.log("Failed to get flight's info");
        });
}

//LOCATIONS
function getLocation(event) {
    let flighturl = `../api/FlightPlan/locations/${localID}`;
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
    //let localididid = event.target.id;
    fetch(deleteUrl, {
        method: 'DELETE'
    }).then(() => {
        console.log(event.target.id + 'removed');
        removeFlightFromT(event.target.id);
        removeAirplaneIcon(event.target.id);
        if (currentMarkedFlight == event.target.id) {
            currentMarkedFlight = null;
        }
    }).catch(err => {
        console.error(err)
    });
}

// Check for flights that are inactive and remove them
function removeInactiveFlights() {
    return new Promise(function (resolve, reject) {
        let flightId;
        let myFlightsT = document.getElementById("myFlightsT");
        let rows = myFlightsT.getElementsByTagName('tr');
        for (let i = 0, row; i < rows.length; i++) {
            row = rows[i];
            flightId = row.id;
            checkStatus(flightId);
        }
        setTimeout(() => resolve('Success'), 0);
    });
}

//Checking the status of a flight in the server
function checkStatus(flightId) {
    let found = false;
    let currentDate = new Date().toISOString();
    const checkStatusUrl = `../api/Flights?relative_to=${currentDate}&sync_all`;
    $.getJSON(checkStatusUrl)
        .done(function (data) {
            data.forEach(function (flight) {
                if (flightId == flight.flightId) {
                    found = true;
                }
            });
            if (!found) {
                prepareForDeletion(flightId);
            }
        })
        .fail(function (response) {
            raiseNotification();
        });
}

function prepareForDeletion(flightId) {
    let id = flightId;
    let target = { id };
    let flightObj = { target };
    deleteFlight(flightObj);
}

function removeFlightFromT(flightId) {
    let rowToRemove = document.getElementById(`${flightId}`);
    let flightDetails = document.getElementById("flightDetails");
    if (currentMarkedFlight == flightId) {
        flightDetails.deleteRow(1);
    }
    rowToRemove.parentNode.removeChild(rowToRemove);
    //removeAirplaneIcon(flightId);
}

function highlightEntry(flightId) {
    let rowToHighlight = document.getElementById(`${flightId}`);
    rowToHighlight.style.backgroundColor = "#808FFF";
}

function mapCancelHighlight(event) {
    if (currentMarkedFlight != null) {
        highlightCancel(currentMarkedFlight);
    }
}

function highlightCancel(flightId) {
    let flightDetails = document.getElementById("flightDetails");
    // Remove flight details
    if (flightDetails.rows.length > 1) {
        flightDetails.deleteRow(1);
    }
    // Remove row highlight
    let canceledRow = document.getElementById(`${flightId}`);
    canceledRow.style.backgroundColor = "";
    // Remove airplane animation
    apIcons[flightId].setAnimation(null);
    removeRoute(flightId);
}


function showFlightDetails(flightPlan, flightId) {
    let flightDetails = document.getElementById("flightDetails");
    let row = flightDetails.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    let sourceCell = row.insertCell();
    let destinationCell = row.insertCell();
    let takeoffCell = row.insertCell();
    let landingCell = row.insertCell();
    let passengersCell = row.insertCell();
    idCell.innerText = flightId;
    companyCell.innerText = flightPlan.companyName;
    takeoffCell.innerText = flightPlan.initialLocation.dateTime;
    landingCell.innerText = "N/A";
    passengersCell.innerText = flightPlan.passengers;
}


/*  Drag and Drop functions   */
function dragOverHandler(event) {
    document.getElementById('myFlightsT').style.display = 'none';
    document.getElementById('dragpic').style.display = 'inline';
    event.preventDefault();
   // sleep(2000);
}

function dropHandler(event) {
    event.preventDefault();
    document.getElementById('dragpic').style.display = 'none';
    document.getElementById('myFlightsT').style.display = 'inline';
    if (event.dataTransfer.items[0].kind === 'file') {
        sendFlightPlan(event.dataTransfer.items[0].getAsFile());
    }
}


function dragEndHandler(event) {
    if (!document.hasFocus) {
        event.preventDefault();
        document.getElementById('dragpic').style.display = 'none';
        document.getElementById('myFlightsT').style.display = 'inline';
    }
}
  
/* End of Drag and Drop functions   */

//Display notifications
function raiseNotification(notif) {

}



async function updateFlights() {
    //while (progRun) {
        await initFlights();
       // sleep(50);
   //   }
}

// Sleep for 'X' ms
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}






