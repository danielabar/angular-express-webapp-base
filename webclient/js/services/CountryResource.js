'use strict';

myapp.factory('CountryResource', function($resource) {
  var url = '/api/country';
  var paramDefaults = {};
  var actions = {
    'delete' : {
      method: 'DELETE',
      params: {id: '@code'},
      url: '/api/country/:code'
    }
  };
  return $resource(url, paramDefaults, actions);
});