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

let localFlightsManager = [flight1, flight2];
let localFlightPlans = [flightPlan1, flightPlan2];

//let myFlightsT = document.getElementById("myFlightsT");
let numberOfFlights;
function addMyFlightsT(flight) {
  let myFlightsT = document.getElementById("myFlightsT").getElementsByTagName('tbody')[0];
  //localFlightsManager.forEach(function (flight) {
  let row = myFlightsT.insertRow();
  let idCell = row.insertCell();
  let companyCell = row.insertCell();
  let tdText;
  row.setAttribute("onclick", "showFlightDetails(event)");
  row.setAttribute("data-toggle", "popover");
  idCell.id = flight.flightId;
  companyCell.id = flight.flightId;
  tdText = document.createTextNode(flight.flightId);
  idCell.appendChild(tdText);
  tdText = document.createTextNode(flight.companyName);
  companyCell.appendChild(tdText);
  //row.appendChild(delB);
  updatePopovers(flight.flightId);
  //  });
}

function updatePopovers(flightID) {
    window.alert(flightID);
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
    let externFlightsT = document.getElementById("externFlightsT");
    let row = externFlightsT.insertRow();
    let idCell = row.insertCell();
    let companyCell = row.insertCell();
    let tdText;
    row.setAttribute("onclick", "showFlightDetails(event)");
    idCell.setAttribute("id", "flight.flight_id");
    companyCell.setAttribute("id", "flight.flight_id")
    tdText = document.createTextNode(flight.flight_id);
    idCell.appendChild(tdText);
    tdText = document.createTextNode(flight.company_name);
    companyCell.appendChild(tdText);
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

//GET
// receive all flights from server
function initFlights(event) {
    let flighturl = "../api/Flights?relative_to=2020-05-26T12:00:00Z&sync_all";
    //let flighturl = "../api/Flights";
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

//LOCATIONS
function getLocation(event) {
    let localID = "SA856B9CBD";
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
   // let localIDs = "SA856B9CBD";
    //let locFlight = flight1
    //window.alert(event.target.id);
    let toDel = confirm(`Do you want to delete flight "${event.target.id}" ?`);
    if (toDel != true) {
        return;
    }
    // let notif = new Notification("flight will be deleted");
    let deleteUrl = `../api/Flights/${event.target.id}`;
    let localididid = event.target.id;
    fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(event.target.id),
    })
        .then(response => response.json())
        .then(localididid => {
            console.log('Success:', localididid);
        })
        .catch((error) => {
            console.error('Error:', error);
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


function showFlightDetails(event) {
    let flightDetails = document.getElementById("flightDetails");
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






