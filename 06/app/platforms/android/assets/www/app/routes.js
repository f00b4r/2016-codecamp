app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider, $resourceProvider, APP_CONFIG) {
    $httpProvider.interceptors.push('authInterceptorService');

    $stateProvider
        .state('movies', {
            url: '/movies',
            templateUrl: "views/movies/movies.html",
            controller: 'MoviesCtrl'
        })
        .state('movie-detail', {
            url: '/movies/:id',
            templateUrl: "views/movies/movies-detail.html",
            controller: 'MoviesDetailCtrl'
        })

    // states end
    ;

    $urlRouterProvider.otherwise("/movies");

});