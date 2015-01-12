'use strict';

myapp.factory('PermissionService', function($q, $timeout, $http) {
  return {
    checkCanCreateCountry: function() {
      var deferred = $q.defer();
      $http.get('/permission/cando/country/POST').success(function(response) {
        $timeout(function() {
          deferred.resolve(response.canDo);
        }, 0);
      });
      return deferred.promise;
    }
  };
});