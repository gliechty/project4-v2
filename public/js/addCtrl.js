var addCtrl = angular.module('addCtrl', ['geolocation', 'gservice']);
addCtrl.controller('addCtrl', function($scope, $http, $rootScope, geolocation, gservice){

    $scope.formData = {};
    var coords = {};
    var lat = 0;
    var long = 0;

    // Set initial coordinates

    $scope.formData.latitude = 39.500;
    $scope.formData.longitude = -98.350;

    // Creates a new user from form fields
    $scope.createUser = function() {


    // Get coordinates based on mouse click. When a click event is detected....
        $rootScope.$on("clicked", function(){
            console.log("clicked");
            // Run the gservice functions associated with identifying coordinates
            $scope.$apply(function(){
                $scope.formData.latitude = parseFloat(gservice.clickLat).toFixed(3);
                $scope.formData.longitude = parseFloat(gservice.clickLong).toFixed(3);
                $scope.formData.htmlverified = "Nope (Thanks for spamming my map...)";
            });
        });


        // Grabs all of the text box fields
        var userData = {
            username: $scope.formData.username,
            gender: $scope.formData.gender,
            age: $scope.formData.age,
            favlang: $scope.formData.favlang,
            location: [$scope.formData.longitude, $scope.formData.latitude],
            htmlverified: $scope.formData.htmlverified
        };
        console.log("creating user");

        // Saves to the db
        $http.post('/users', userData)
            .then(function (data) {

                // Clears after submission
                $scope.formData.username = "";
                $scope.formData.gender = "";
                $scope.formData.age = "";
                $scope.formData.favlang = "";
                gservice.refresh($scope.formData.latitude, $scope.formData.longitude);
                
            })
            .catch(function (data) {
                console.log('Error: ' + data);
            });
    };
});






