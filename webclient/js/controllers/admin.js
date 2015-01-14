'use strict';

myapp.controller('AdminController', function($scope, UserResource) {
  $scope.users = UserResource.query();

   $scope.selected = [];

    // Grid Options
    $scope.gridOpts = {
      data: 'users',
      showGroupPanel: false,
      multiSelect: false,
      selectedItems: $scope.selected,
      columnDefs: [
        {field: 'username', displayName: 'Username'},
        {field: 'first_name', displayName: 'First Name'},
        {field: 'last_name', displayName: 'Last Name'},
        {field: 'email', displayName: 'Email Address'}
      ]
    };

});