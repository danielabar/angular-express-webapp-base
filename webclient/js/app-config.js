'use strict';

/**
 * Declare states for application, along with associated urls.
 * Do any config-level stuff on imported modules.
 */
myapp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  $stateProvider
    .state('home', {
      url:'/'
    })
    .state('countries', {
      url: '/countries',
      templateUrl: 'templates/countryList.html',
      controller: 'CountryController',
      resolve: {
        canCreateCountry: function(PermissionService) {
          return PermissionService.checkCanCreateCountry();
        }
      }
    })
    .state('countries.add', {
      templateUrl: 'templates/countryAdd.html'
    })
    .state('admin', {
      url: '/admin',
      templateUrl: 'templates/admin.html',
      controller: 'AdminController',
      resolve: {
        isAdmin: function(PermissionService) {
          return PermissionService.checkIsAdmin();
        }
      }
    });

  $urlRouterProvider.otherwise('/');

  //Connect all HTTP events to the $rootScope bus, so that we can connect them to ngProgress in myapp.run()
  $httpProvider.interceptors.push(function($q, $rootScope){
    return {
      'request': function(config) {
        $rootScope.$emit('start request');
        return config;
      },
      'requestError': function(rejection) {
        $rootScope.$emit('end request');
        return $q.reject(rejection);
      },
      'response': function(response) {
        $rootScope.$emit('end request');
        return response;
      },
      'responseError': function(rejection) {
        $rootScope.$emit('end request');
        return $q.reject(rejection);
      }
    };
  });
});


/**
 * Main entry point for application
 */
myapp.run(function(
  $rootScope,
  ngProgress) {

  //Hook up starting and ending of HTTP requests to ngProgress, for pretty progress bar
  $rootScope.$on('end request', function(){
    ngProgress.complete();
  });
  $rootScope.$on('start request', function(){
    ngProgress.reset();
    ngProgress.start();
  });
});
