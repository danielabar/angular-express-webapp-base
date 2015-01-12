'use strict';

myapp.controller('CountryController', function($scope, CountryResource, $state, canCreateCountry) {

  $scope.fields = ['code', 'name', 'continent'];
  $scope.countries = CountryResource.query();

  // TODO This should come from a ContinentResource and be fetched from resource/http
  $scope.continents = [
    {name: 'Europe'},
    {name: 'Oceania'},
    {name: 'Asia'},
    {name: 'North America'},
    {name: 'Africa'},
    {name: 'Antarctica'},
    {name: 'South America'},
  ];

  if (canCreateCountry) {
    $state.transitionTo('countries.add');
  }

  $scope.newCountry = new CountryResource;
  $scope.createCountry = function() {
    $scope.newCountry.$save().then(function(response) {
      $scope.countries.push(response);        // update edge list
      $scope.newCountry = new CountryResource;  // reset to blank form
      $scope.countryCreateErrorMessage = false;
    },
    function(response) {
      $scope.countryCreateErrorMessage = response.data.message;
    });
  };

});