'use strict';

/**
 * Declare states for application, along with associated urls.
 * Do any config-level stuff on imported modules.
 */
myapp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {

  // TODO Extract this to a factory/service (http://odetocode.com/blogs/scott/archive/2014/05/20/using-resolve-in-angularjs-routes.aspx)
  var checkCanCreateCountry = function($q, $timeout, $http) {
    var deferred = $q.defer();
    $http.get('/permission/cando/country/POST').success(function(response) {
      $timeout(deferred.resolve(response.canDo), 0);
    });
    return deferred.promise;
  };

  $stateProvider
    .state('home', {
      url:'/'
    })
    .state('countries', {
      url: '/countries',
      templateUrl: 'templates/countryList.html',
      controller: 'CountryController',
      resolve: {
        canCreateCountry: checkCanCreateCountry
      }
    })
    .state('countries.add', {
      templateUrl: 'templates/countryAdd.html'
    });

  $urlRouterProvider.otherwise('/');

  //Connect all HTTP events to the $rootScope bus, so that we can connect them to ngProgress in databricks.run()
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
