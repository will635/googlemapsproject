let markers =[];
var map;
let infoWindow;
let myLat;
let myLong;
let myLocation;
var theLocation;
let counter = 0;
let destination;
let number = 3;

const directionsService = new google.maps.DirectionsService();
const directionsDisplay =  new google.maps.DirectionsRenderer({
  map:map
});
/*var polygonCords = [
  {lat: LAT1, lng: LNG1},
  {lat: LAT2, lng: LNG2},
  {lat: LAT3, lng: LNG3}
];*/

directionsDisplay.setMap(map);
var request = {
  origin: "4087 Shelbourne St, Victoria, BC, Canada",
  destination: "3100 Foul Bay Rd, Victoria, BC, Canada",
  travelMode: "DRIVING"
};
let radius;
let mode = 0;
let hasPosition = false;


window.onload = function() {
  const routeButton = document.createElement("button");
  routeButton.textContent = "Route";
  routeButton.addEventListener("click", driveRoute());
  routeButton.style.display = "none";
  document.body.appendChild(routeButton);
}

function changeSearch() {
  let e = document.getElementById("dropdown");

  if (e.value == 1) {
    mode = 0;
    initializeMap();
  }
  if (e.value == 2) {
    mode = 1;
    initializeMap();
  }
}


window.onload = initializeMap;

// initalize map 
function initializeMap () {
  const directionsRenderer = new google.maps.DirectionsRenderer();
  const directionsService = new google.maps.DirectionsService();

  // center map in Vicotria by default 
      map = new google.maps.Map(document.getElementById("map"), {
          center: myLocation,
          zoom:13
  
  
      });

  
  
      infoWindow = new google.maps.InfoWindow();

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              myLat = position.coords.latitude
              myLong = position.coords.longitude
  
  
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
  
              };
    
              myLocation = new google.maps.LatLng(pos.lat, pos.lng);
              createCurrentMarker(position);
              infoWindow.open(map);
              map.setCenter(pos);
    
              myLocation = new google.maps.LatLng(pos.lat, pos.lng)
              
              if (mode == 0){
                searchForRestaurants(pos);
              } else {
                searchForParks(pos);
              }
              
            },
            () => {
              handleLocationError(true, infoWindow, map.getCenter());
            },
          );
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      
      } // initializeMap

 function handleLocationError(
    browserHasGeolocation,
    infoWindowCurrentLocation,
    pos
  ) {
    infoWindowCurrentLocation.setPosition(pos);
    infoWindowCurrentLocation.setContent(
      browserHasGeolocation
        ? "Error: The Geolocation service failed."
        : "Error: Your browser doesn't support geolocation."
    );
    infoWindowCurrentLocation.open(map);
  } //handleLocationError

    function createCurrentMarker(position) {
      myLat = position.coords.latitude;
      myLong = position.coords.longitude;
      const marker = new google.maps.Marker({
        position: {lat: myLat, lng: myLong},
        map: map,
        title: 'Current Location',
        icon: {
          url: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png', // URL to a red marker icon
          scaledSize: new google.maps.Size(25, 40), // Adjust the size if needed
        }
        
      });
  
  
    }



//google.maps.event.addDomListener(window, 'load', getLocation() );


function searchForRestaurants(location) {
    
    let request = {
          location: location,
          radius: 3000,
          query: "restaurant",
          rankBy: google.maps.places.RankBy.PROMINENCE
      };
      service = new google.maps.places.PlacesService(map);
      service.textSearch(request, processRestaurants);
  }//searchForRestaurants

  function processRestaurants(results, status) {
      number = document.getElementById("amount").value;
    if (status == google.maps.places.PlacesServiceStatus.OK) {
        deleteMarkers();
        results.sort(function(a,b){
          return b.rating - a.rating;
        })
        for (let i = 0; i < number; i++) {
            let place  = results[i];
            console.log(place);
            createMarker(place);
        }
    }
}// processParks



function searchForParks(location) {
    
  let request = {
        location: location,
        radius: 3000,
        query: "park",
        rankBy: google.maps.places.RankBy.PROMINENCE
    };
    service = new google.maps.places.PlacesService(map);
    service.textSearch(request, processParks);
}//searchForParksts

function processParks(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
      deleteMarkers();
      results.sort(function(a,b){
        return b.rating - a.rating;
      })
      for (let i = 0; i < 3; i++) {
          let place  = results[i];
          console.log(place);
          createMarker(place);
      }
  }
}// processParks

function createMarker(place) {
  for (let i = 0; i < 3; i++) {
    if (!place.geometry || !place.geometry.location) return;

    const scaledIcon = {
        url: 'yellowmarker.png',
        scaledSize: new google.maps.Size(25, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
    }
     const marker =  new google.maps.Marker({
        map,
        position: place.geometry.location,
        icon: scaledIcon,
        title: place.name
    }); 


    google.maps.event.addListener(marker, "click", () => {
      let contentString = "<h3>" + place.name + "</h3>" + "Rating: <b>" + place.rating  + "</b> / 5 <p>" + place.formatted_address + "</p>" + '<button id="driveBtn" onclick="driveRoute()">Driving Route Guidance</button>' + '<button id="busBtn" onclick="driveRouteBus()">Bus Route Guidance</button>';

      destination = place.geometry.location;
      infoWindow.setContent(contentString);
      infoWindow.open(map, marker);
    });

    markers.push(marker);
  }
} //createMarker


function addMarker(location) {
    const marker =  new google.maps.Marker({
      position: location,
      map:map
    });
    markers.push(marker);
  } // addmarker
  
  function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
  } //setmaponall
  
  function clearMarkers() {
    setMapOnAll(null);
  } //clearmarkers
  
  function showMarkers() {
    setMapOnAll(map);
  } //showmarkers
  
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  } //deletemarkers

let counter2 = 0
  function driveRoute() {
  if (counter2 >= 0) { //so directions only show up once
    document.getElementById("sidebar").textContent = "Loading new route..";
    if (counter2 == 0){
      document.getElementById("driveBtn").style.backgroundColor = "#ffffffff";
      document.getElementById("driveBtn").style.border = "none";
      document.getElementById("driveBtn").innerHTML = "<p class='loading'>Loading Drive Route.</p>";
    }
      document.getElementById("bus").style.display = "block";

      document.getElementById("drive").style.display = "none";
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const gpos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
      const directionsRenderer = new google.maps.DirectionsRenderer();
      const directionsService = new google.maps.DirectionsService();
      const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: { lat: gpos.lat, lng: gpos.lng},
        disableDefaultUI: true,
      });
      document.getElementById("sidebar").textContent = "";
      directionsRenderer.setMap(map);
      directionsRenderer.setPanel(document.getElementById("sidebar"));

      const control = document.getElementById("floating-panel");

      map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);
    

      calculateAndDisplayRoute(directionsService, directionsRenderer, gpos);
    });
    counter2++;
    counter3++;
  }

  function calculateAndDisplayRoute(directionsService, directionsRenderer, gpos) {
    //const start = document.getElementById("start").value;
    //const end = document.getElementById("end").value;
    directionsService
      .route({
        origin: gpos,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
      })
      .then((response) => {
        directionsRenderer.setDirections(response);
      })
      .catch((e) => window.alert("Directions request failed due to " + status));

  }
} // function
  
let counter3 = 0
function driveRouteBus() {
  if (counter3 >= 0) {
    document.getElementById("sidebar").textContent = "Loading new route..";
    if (counter3 == 0) {
      document.getElementById("busBtn").style.backgroundColor = "#ffffffff";
      document.getElementById("busBtn").style.border = "none";
      document.getElementById("busBtn").innerHTML = "<p class='loading'>Loading Bus Route.</p>"; 
    }
      document.getElementById("bus").style.display = "none";
      document.getElementById("drive").style.display = "block";

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const gpos1 = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
    const directionsRenderer1 = new google.maps.DirectionsRenderer();
    const directionsService1 = new google.maps.DirectionsService();
    const map = new google.maps.Map(document.getElementById("map"), {
      zoom: 13,
      center: { lat: gpos1.lat, lng: gpos1.lng},
      disableDefaultUI: true,
    });

    document.getElementById("sidebar").textContent = "";
    directionsRenderer1.setMap(map);
    directionsRenderer1.setPanel(document.getElementById("sidebar"));

    const control = document.getElementById("floating-panel");

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(control);


    calculateAndDisplayRouteBus(directionsService1, directionsRenderer1, gpos1);
  });
  counter3++;
  counter2++;
}


function calculateAndDisplayRouteBus(directionsService1, directionsRenderer1, gpos1) {
  //const start = document.getElementById("start").value;
  //const end = document.getElementById("end").value;


  directionsService1
    .route({
      origin: gpos1,
      destination: destination,
      travelMode: google.maps.TravelMode.TRANSIT,
    })
    .then((response) => {
      directionsRenderer1.setDirections(response);
    })
    .catch((e) => window.alert("Directions request failed due to " + status));

}
} // function */