'use strict';

myapp.controller('CountryController', function($scope, CountryResource, $state, canCreateCountry) {

  $scope.fields = ['code', 'name', 'continent'];
  $scope.countries = CountryResource.query();


  if (canCreateCountry) {
    $state.transitionTo('countries.add');
  }

  $scope.continents = [
    'Europe',
    'Oceania',
    'Asia',
    'North America',
    'Africa',
    'Antarctica',
    'South America',
  ];
  $scope.newCountry = new CountryResource;
  $scope.newCountry.continent = $scope.continents[0];

  // Issue: Create country form is in a child view, don't have access to $scope.newCountryForm
  $scope.createCountry = function() {
    // if ($scope.newCountryForm.$valid) {
      $scope.newCountry.$save().then(function(response) {
        $scope.countries.push(response);          // update country list
        $scope.newCountry = new CountryResource;  // reset to blank form
        // $scope.newCountryForm.$setPristine();
        $scope.countryCreateErrorMessage = false;
      },
      function() {
        $scope.countryCreateErrorMessage = 'Unable to create country';
      });
    // }
  };

});