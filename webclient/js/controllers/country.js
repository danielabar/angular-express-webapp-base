'use strict';

myapp.controller('CountryController', function($scope, CountryResource, $state, canCreateCountry) {

  $scope.fields = ['code', 'name', 'continent'];
  $scope.countries = CountryResource.query();

  if (canCreateCountry) {
    $state.transitionTo('countries.add');
  }

});