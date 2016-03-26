app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $resourceProvider, APP_CONFIG) {
    $httpProvider.interceptors.push('authInterceptorService');

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: "views/home/home.html",
            controller: 'HomeCtrl'
        })

    // states end
    ;

    $urlRouterProvider.otherwise("/home");

});