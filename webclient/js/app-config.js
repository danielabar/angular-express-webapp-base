'use strict';

/**
 * Declare states for application, along with associated urls.
 * Do any config-level stuff on imported modules.
 */
myapp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  $stateProvider.state('home', {
    url:'/'
  });

  $urlRouterProvider.otherwise('/');

  //Connect all HTTP events to the $rootScope bus, so that
  //we can connect them to ngProgress in databricks.run()
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
    //console.log('end request');
    ngProgress.complete();
  });
  $rootScope.$on('start request', function(){
    //console.log('start request');
    ngProgress.reset();
    ngProgress.start();
  });
});
