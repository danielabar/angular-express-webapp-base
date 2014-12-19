'use strict';

// TODO: Handle errors
myapp.factory('CountryResource', function($resource) {
  return $resource('/api/country/:code', { code : '@code'}, {
    'update': { method: 'PUT' }
  });
});