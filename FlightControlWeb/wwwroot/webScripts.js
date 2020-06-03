
//Global variables
let progRun;
let numOfFlights = 0;
let currentMarkedFlight;
let lngD;
let latD;
let landingTime;
//Initialize the app
window.onload = function load() {
    $("#dnd").hide();
    progRun = true;
    document.getElementById('dragpic').style.display = 'none';
    this.raiseNotification(`Welcome to Flight Control!<br>
    1. You can add Flight Plans by dropping the files at the tables.<br>
    2. You can receive each flight's details by clicking on the desired entry in the list.<br>
    3. You can remove an internal flight by clicking the red button in the raised popup of each entry.`);
    this.initFlights();
    this.setInterval(function () { updateFlights(); }, 4000);
};

// Close the app
window.onclose = function close() {
    progRun = false;
}

// Adding flights to My Flights table
function addMyFlightsT(flight) {
    let myFlightsT = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
    let row = myFlightsT.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    // setting onclick in order to get flight's flightplan
    row.setAttribute("onclick", "getFlightPlan(event)");
    row.id = flight.flightId;
    // popover - for delete button
    row.setAttribute("data-toggle", "popover");
    idCell.id = flight.flightId;
    idCell.innerText = flight.flightId;
    companyCell.id = flight.flightId;
    companyCell.innerText = flight.companyName;
    //updating all the popovers (delete buttons of entries)
    updatePopovers(flight.flightId);
}

// updating all the popovers
// makes sure only visible flights will have visible popovers (delete buttons)
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

// Adding flights to External Flights table
function addExternalFlightsT(flight) {
    let externFlightsT = document.getElementById("externFlightsT").getElementsByTagName('tbody')[0];
    let row = externFlightsT.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    // setting onclick in order to get flight's flightplan
    row.setAttribute("onclick", "getFlightPlan(event)");
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
        raiseNotification("Failed to sort flights");
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
// receive all relevant flights (considering time) from server
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
            console.log("Failed loading flights");
        });
}

//POST (flightplan)
// Sends a flight plan to the server
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
            raiseNotification("Failed sending flight plan, retrying..");
            console.error('Error:', error);
        });
}

//GET (flight plan)
// asks for a flight plan of a specific flight
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
// extra internal function (works by REST) to get utilities
// such as landing time and human-readable source and destination (by using google geocoder)
function getExtra(flightId) {
    let flighturl = `../api/FlightPlan/locations/${flightId}`;
 $.getJSON(flighturl)
     .done(function (info) {
         lngD = info[0];
         latD = info[1];
         landingTime = info[2];
     })
     .fail(function (reason) {
         raiseNotification("Failed to get flight's destination and landing time");
     });
}

//DELETE
// deletes a desired flight (from both server and client)
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

// Removes all the tables' entries (in order to populate them with new information from server)
function removeFlightFromTs() {
    let myFlights = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
    myFlights.innerHTML = "";
    let externFlights = document.getElementById("externFlightsT").getElementsByTagName('tbody')[0];
    externFlights.innerHTML = "";
    let flightDetails = document.getElementById("flightDetails").getElementsByTagName('tbody')[0];
    flightDetails.innerHTML = "";
}

//Highlight's a desired table entry
function highlightEntry(flightId) {
    let rowToHighlight = document.getElementById(`${flightId}`);
    rowToHighlight.style.backgroundColor = "#808FFF";
}

// Cancel's the highlight of a flight by a map click
function mapCancelHighlight(event) {
    if (currentMarkedFlight != null) {
        highlightCancel(currentMarkedFlight);
    }
}

// Cancel's the highlight of a flight (tables and map)
function highlightCancel(flightId) {
    let flightDetails = document.getElementById("flightDetails");
    // Remove from flight details
    if (flightDetails.rows.length > 1) {
        flightDetails.deleteRow(1);
    }
    // Remove table row highlight
    let canceledRow = document.getElementById(`${flightId}`);
    canceledRow.style.backgroundColor = "";
    // Remove airplane animation
    apIcons[flightId].setAnimation(null);
    removeRoute(flightId);
    currentMarkedFlight = null;
}

// Presents all the flight details in a table
function showFlightDetails(flightPlan, flightId) {
    getExtra(flightId);
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
        coordsToSource(flightPlan.initialLocation.latitude, flightPlan.initialLocation.longitude);
        sourceCell.innerText = sourceCountry;
        companyCell.innerText = flightPlan.companyName;
        takeoffCell.innerText = flightPlan.initialLocation.dateTime;
        passengersCell.innerText = flightPlan.passengers;
        if (landingTime != null && latD != null && lngD != null) {
            coordsToDest(latD, lngD);
            destinationCell.innerText = destCountry;
            landingCell.innerText = landingTime;
        } else {
            destinationCell.innerText = "N/A";
            landingCell.innerText = "N/A";
        }

    }
}


/*  Drag and Drop functions   */
// handles dragging a file over the designated area
function dragOverHandler(event) {
    document.getElementById('myFlightsT').style.display = 'none';
    document.getElementById('dragpic').style.display = 'inline';
    event.preventDefault();
}

// handles dropping a file in the designated area
function dropHandler(event) {
    event.preventDefault();
    document.getElementById('dragpic').style.display = 'none';
    document.getElementById('myFlightsT').style.display = 'inline';
    if (event.dataTransfer.items[0].kind === 'file') {
        sendFlightPlan(event.dataTransfer.items[0].getAsFile());
    }
}

// handles end of dragging a file over the designated area
function dragEndHandler(event) {
    if (!document.hasFocus) {
        event.preventDefault();
        document.getElementById('dragpic').style.display = 'none';
        document.getElementById('myFlightsT').style.display = 'inline';
    }
}
/* End of Drag and Drop functions   */

//Display notifications (toasts)
function raiseNotification(notif) {
    // creates a toast container
    let toastContainer = $("<div></div>");
    toastContainer.addClass("toastContainer");
    // creates a toast header
    let toastHeader = $("<div></div>");
    toastHeader.addClass("toastHeader");
    toastHeader.html("Flight Control Notification:");
    toastContainer.append(toastHeader);
    // creates the toast's content
    var toastContent = $("<div></div>");
    toastContent.addClass("toastContent");
    toastContent.html(notif);
    toastContainer.append(toastContent);
    // can be removed by clicking it
    toastContainer.click(function () {
        toastContainer.remove();
    });
    // will be removed in 5 seconds
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

// An async function thats responsible for refreshing the information
// the function is running in 4 seconds intervals
async function updateFlights() {
    while (progRun) {
        await initFlights();
    }
}






