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
let numOfFlights = 0;
let currentMarkedFlight;
//Initialize app
window.onload = function load() {
    $("#dnd").hide();
    //running = true;
    //sleep(200);
    //progRun = true;
    document.getElementById('dragpic').style.display = 'none';
    this.raiseNotification(`Welcome to Flight Control!<br>
    1. You can add Flight Plans by dropping the files at the tables.<br>
    2. You can receive each flight's details by clicking on the desired entry in the list.<br>
    3. You can remove an internal flight by clicking the red button in the raised popup of each entry.`);
    this.initFlights();
    this.setInterval(function () { updateFlights(); }, 3000);
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
    $("*").each(function () {
        let popover = $.data(this, "bs.popover");
        if (popover)
            $(this).popover('hide');
    });
    $('[data-toggle="popover"]').popover({
        animation: true,
        placement: "auto",
        trigger: "hover focus",
        id: flightID,
        html: true,
        delay: { "show": 200, "hide": 1500 },
        content: function () {
            let delB = document.createElement("button");
            delB.innerText = "X";
            delB.id = flightID;
            delB.className = "btn btn-danger";
            delB.setAttribute("onclick", "deleteFlight(event)");
            return delB;
        }
    });
}

function addExternalFlightsT(flight) {
    let externFlightsT = document.getElementById("externFlightsT").getElementsByTagName('tbody')[0];
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
        //raiseNotification("Failed to sort flights");
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
    let dateTime = new Date().toISOString();
    let flighturl = `../api/Flights?relative_to=${dateTime}&sync_all`;
    $.getJSON(flighturl)
        .done(function (flights) {
            removeFlightFromTs();
            removeAirplaneIcon();
            flights.forEach(function (flight) {
                    numOfFlights += 1;
                    sortFlights(flight);
                    addAirplaneIcon({
                        coords: { lng: flight.longitude, lat: flight.latitude },
                        payload: flight
                    });
                    if (currentMarkedFlight == flight.flightId) {
                        let id = flight.flightId;
                        let target = { id };
                        let wrapper = { target };
                        getFlightPlan(wrapper);
                    }
            });
        })
        .fail(function (reason) {
            raiseNotification("Failed loading flights");
        });
}

//POST
function sendFlightPlan(flightPlan) {
    let postUrl = "../api/FlightPlan";
    fetch(postUrl, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: flightPlan,
    })
    .then(response => response.json())
        .then(flightPlan => {
            console.log('Success:', flightPlan);
            initFlights();
        })
        .catch((error) => {
            raiseNotification("Failed sending flight plan");
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
            raiseNotification("Failed to get flight's plan");
        });
}

//LOCATIONS
function getExtra(flightId) {
    let flighturl = `../api/FlightPlan/locations/${flightId}`;
 $.getJSON(flighturl)
     .done(function (info) {
         let lat = info[0];
         let lng = info[1];
         let landingTime = info[2];
         let extra = { lat, lng, landingTime };
         return extra;
     })
     .fail(function (reason) {
         raiseNotification("Failed to get flight's destination and landing time");
     });
}

//DELETE
function deleteFlight(event) {
    let toDel = confirm(`Do you want to delete flight "${event.target.id}" ?`);
    if (toDel != true) {
        return;
    }
    let deleteUrl = `../api/Flights/${event.target.id}`;
    fetch(deleteUrl, {
        method: 'DELETE'
    }).then(() => {
        console.log(event.target.id + ' removed');
        removeFlightFromTs();
        removeAirplaneIcon();
        if (currentMarkedFlight == event.target.id) {
            currentMarkedFlight = null;
        }
        numOfFlights -= 1;
        initFlights();
    }).catch(err => {
            raiseNotification("Failed deleting flight");
            console.error(err)
    });
}

// Check for flights that are inactive and remove them
function removeFlights() {

}


function removeFlightFromTs() {
    let myFlights = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
    myFlights.innerHTML = "";
    let externFlights = document.getElementById("externFlightsT").getElementsByTagName('tbody')[0];
    externFlights.innerHTML = "";
    let flightDetails = document.getElementById("flightDetails").getElementsByTagName('tbody')[0];
    flightDetails.innerHTML = "";
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
    currentMarkedFlight = null;
}


function showFlightDetails(flightPlan, flightId) {
    //let extra = getExtra(flightId);
    let flightDetails = document.getElementById("flightDetails").getElementsByTagName('tbody')[0];
    if (!(flightDetails.length > 0)) {
        let row = flightDetails.insertRow();
        row.id = flightId + flightId;
        let idCell = row.insertCell();
        let companyCell = row.insertCell();
        let sourceCell = row.insertCell();
        let destinationCell = row.insertCell();
        let takeoffCell = row.insertCell();
        let landingCell = row.insertCell();
        let passengersCell = row.insertCell();
        idCell.innerText = flightId;
        sourceCell.innerText = flightPlan.initialLocation.longitude + ", " + flightPlan.initialLocation.latitude;
        // destinationCell.innerText = extra[0] + ", " + extra[1];
        companyCell.innerText = flightPlan.companyName;
        takeoffCell.innerText = flightPlan.initialLocation.dateTime;
        //  landingCell.innerText = extra[2];
        passengersCell.innerText = flightPlan.passengers;
    }
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
    let toastContainer = $("<div></div>");
    toastContainer.addClass("toastContainer");
    //
    let toastHeader = $("<div></div>");
    toastHeader.addClass("toastHeader");
    toastHeader.html("Flight Control");
    toastContainer.append(toastHeader);
    //
    var toastContent = $("<div></div>");
    toastContent.addClass("toastContent");
    toastContent.html(notif);
    toastContainer.append(toastContent);
    toastContainer.click(function () {
        toastContainer.remove();
    });
    toastContainer.hide(function () {
        $("#toastsContainer").append(toastContainer);
        toastContainer.fadeIn(500);
    });
    setTimeout(function () {
        toastContainer.fadeOut(500, function () {
            toastContainer.remove();
        });
    }, 5000);
}



async function updateFlights() {
    await initFlights();
}

// Sleep for 'X' ms
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}






