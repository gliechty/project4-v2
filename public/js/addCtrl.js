var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates (Denver)

    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Get User's actual coordinates 
    geolocation.getLocation().then(function(data){

        // Set the latitude and longitude equal to the HTML5 coordinates
        coords = {lat:data.coords.latitude, long:data.coords.longitude};

        // Display coordinates in location textboxes rounded to five decimal points
        $scope.formData.longitude = parseFloat(coords.long).toFixed(5);
        $scope.formData.latitude = parseFloat(coords.lat).toFixed(5);

        // Display message confirming that the coordinates verified.
        $scope.formData.htmlverified = "Yep (Thanks for giving us real data!)";

        gservice.refresh($scope.formData.latitude, $scope.formData.longitude);

    });


    // Get coordinates based on click
    $rootScope.$on("clicked", function(){
        console.log("clicked");
        // Run the gservice functions associated with identifying coordinates
        $scope.$apply(function(){
            $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(5);
            $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(5);
            $scope.formData.htmlverified = "Not verified";
        });
    });


    // Creates a new user from form fields
    $scope.createUser = function() {

        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            fly: $scope.formData.fly,
            size: $scope.formData.size,
            url: $scope.formData.url,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        console.log("creating user");

        // Saves to the db
        $http.post('/users', userData)
            .then(function (data) {

                // Clears after submission
                $scope.formData.username = "";
                $scope.formData.fly = "";
                $scope.formData.size = "";
                $scope.formData.url = "";
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
                
            })
            .catch(function (data) {
                console.log('What an Error!!! ' + data);
            });
    };
});







