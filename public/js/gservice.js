angular.module('gservice', [])
    .factory('gservice', function($rootScope, $http){


        // Service the factory will return
        var googleMapService = {};

        var locations = [];

        // Selected Location (Start at Denver)
        var selectedLat = 39.739;
        var selectedLong = -104.990;

        /////////////////////////////////////
        // Is this in the right place????????

        googleMapService.clickLat  = 0;
        googleMapService.clickLong = 0;

        //////////////////////////////////////

        // Refresh the Map with new data. Function will take new latitude and longitude coordinates.
        googleMapService.refresh = function(latitude, longitude){

            // Clears the holding array of locations
            locations = [];

            // Set the selected lat and long equal to the ones provided on the refresh() call
            selectedLat = latitude;
            selectedLong = longitude;

            // Perform an AJAX call to get all of the records in the db.
            $http.get('/users').then(function(response){
                console.log(response);
                // Convert the results into Google Map Format
                locations = convertToMapPoints(response.data);

                // Then initialize the map.
                initialize(latitude, longitude);

            }).catch(function(err){
                console.log("the error is " + err);
            });
        };

        // Convert users JSON into markers
        var convertToMapPoints = function(response){

            // Clear the locations holder
            var locations = [];

            // Loop through all of the JSON entries provided in the response
            for(var i= 0; i < response.length; i++) {
                var user = response[i];

                // Create popup windows for each record
                var  contentString =
                    
                    '<p><b>Username</b>: ' + user.username +
                    '<br><b>Fly</b>: ' + user.fly +
                    '<br><b>Fly Size</b>: ' + user.size +
                    
                    '</p><img src="' + user.url + '" style="height:100px;">'+
                    '<br><button class="delete" id="deleteButton" onClick="deleteUser">X</button>';

                // Converts each of the JSON records into Google Maps Location format (Note [Lat, Lng] format).
                locations.push({
                    latlon: new google.maps.LatLng(user.location[1], user.location[0]),
                    message: new google.maps.InfoWindow({
                        content: contentString,
                        maxWidth: 320
                    }),
                    username: user.username,
                    fly: user.fly,
                    size: user.size,
                    url: user.url
                });
        }
        // location is now an array populated with records in Google Maps format
        return locations;
    };

    // Initializes the map
    var initialize = function(latitude, longitude) {

        // Uses the selected lat, long as starting point
        var myLatLng = {lat: selectedLat, lng: selectedLong};

        // If map has not been created already...
        if (!map){

            // Create a new map and place in the index.html page
            var map = new google.maps.Map(document.getElementById('map'), {
                zoom: 15,
                center: myLatLng,
                mapTypeId: 'terrain'
            });
        }

       

        // Loop through each location in the array and place a marker
        locations.forEach(function(n, i){
            // console.log('gets location markers');
            var marker = new google.maps.Marker({
                position: n.latlon,
                map: map,
                title: "Big Map",
                // icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                icon: "../assets/fishing-pier.svg"

            });

            // For each marker created, add a listener that checks for clicks
            google.maps.event.addListener(marker, 'click', function(e){

                // When clicked, open the selected marker's message

                currentSelectedMarker = n;

                n.message.open(map, marker);

            });

        });

        // Set initial location as a bouncing red marker
        var initialLocation = new google.maps.LatLng(latitude, longitude);
        var marker = new google.maps.Marker({
            position: initialLocation,
            animation: google.maps.Animation.DROP,
            map: map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
        });
        // Function for moving to a selected location
        map.panTo(new google.maps.LatLng(latitude, longitude));


        // Clicking on the Map adds red marker
        google.maps.event.addListener(map, 'click', function(e){
            var marker = new google.maps.Marker({
                position: e.latLng,
                animation: google.maps.Animation.DROP,
                map: map,
                icon: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
            });


            // Create a new marker and move to it
            lastMarker = marker;
            map.panTo(marker.position);

            // Is this the right place???
            googleMapService.clickLat = marker.getPosition().lat();
            googleMapService.clickLong = marker.getPosition().lng();
            $rootScope.$broadcast("clicked");
        });

    };

// Refresh the page upon window load. Use the initial latitude and longitude
google.maps.event.addDomListener(window, 'load',
    googleMapService.refresh(selectedLat, selectedLong));

return googleMapService;
});


// psudocode for this (include in main function)
var deleteUser = function(){
    console.log("yeeeeah deleteUser");

    // get lat/long for the marker clicked
    // 

    $http.get('/users').then(function(response){
        locations = convertToMapPoints(response.data);

    });
};




// 