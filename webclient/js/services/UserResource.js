'use strict';

myapp.factory('UserResource', function($resource) {
  return $resource('/api/user');
});