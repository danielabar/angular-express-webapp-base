'use strict';

myapp.controller('AdminController', function($scope, UserResource) {
  $scope.users = UserResource.query();

   $scope.selected = [];

    // Grid Options
    $scope.gridOpts = {
      data: 'users',
      showGroupPanel: true,
      multiSelect: false,
      selectedItems: $scope.selected,
      columnDefs: [
        {field: 'first_name', displayName: 'First Name'},
        {field: 'last_name', displayName: 'Last Name'}
      ]
    };

});