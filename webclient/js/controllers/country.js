'use strict';

myapp.controller('CountryController', function($scope) {

  $scope.fields = ['code', 'name', 'continent'];

  // Mock data for now, later get from Country resource
  $scope.countries = [
    {code: 'ARG', name: 'Argentina', continent: 'South America'},
    {code: 'BEL', name: 'Belgium', continent: 'Europe'},
    {code: 'CHL', name: 'Chile', continent: 'South America'}
  ];

});