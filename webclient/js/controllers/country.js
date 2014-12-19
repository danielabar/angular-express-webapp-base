'use strict';

myapp.controller('CountryController', function($scope, CountryResource) {

  $scope.fields = ['code', 'name', 'continent'];

  $scope.countries = CountryResource.query();

});