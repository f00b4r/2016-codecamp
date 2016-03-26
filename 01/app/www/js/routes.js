angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('movies', {
    url: '/list',
    templateUrl: 'templates/movies.html',
    controller: 'moviesCtrl'
  })

  .state('signup', {
    url: '/signup',
    templateUrl: 'templates/signup.html',
    controller: 'signupCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('matrix', {
    url: '/detail/info',
    templateUrl: 'templates/matrix.html',
    controller: 'matrixCtrl'
  })

  .state('matrix2', {
    url: '/detail/video',
    templateUrl: 'templates/matrix2.html',
    controller: 'matrix2Ctrl'
  })

  .state('matrix3', {
    url: '/detail/comment',
    templateUrl: 'templates/matrix3.html',
    controller: 'matrix3Ctrl'
  })

  .state('menu', {
    url: '/menu',
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('settings', {
    url: '/settings',
    templateUrl: 'templates/settings.html',
    controller: 'settingsCtrl'
  })

$urlRouterProvider.otherwise('/menu')

  

});