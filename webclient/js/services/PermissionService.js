'use strict';

myapp.factory('PermissionService', function($q, $timeout, $http, $location) {
  return {

    checkCanCreateCountry: function() {
      var deferred = $q.defer();
      $http.get('/permission/cando/country/POST').success(function(response) {
        $timeout(function() {
          deferred.resolve(response.canDo);
        }, 0);
      });
      return deferred.promise;
    },

    checkIsAdmin: function() {
      var deferred = $q.defer();
      $http.get('/permission/ismember/ADMIN').success(function(response) {
        if (response.isMember) {
          $timeout(deferred.resolve, 0);
        }
        else {
          $timeout(function() {
            deferred.reject();
          }, 0);
          $location.url('/');
        }
      });
      return deferred.promise;
    }

  };
});