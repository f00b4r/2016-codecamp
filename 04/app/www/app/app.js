/**
 * The main application module.
 */

var app = angular.module('App', ['ionic', 'ngCordova', 'ui.router', 'ngResource'])

    .run(function ($ionicPlatform, $http, $ionicSideMenuDelegate, $ionicScrollDelegate, $rootScope) {
        $http.defaults.headers.post = {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "dataType": "json"
        };


        /**
         * @description Workaround for closing side menu in Android
         */
        document.addEventListener('touchstart', function (event) {
            if ($ionicSideMenuDelegate.isOpenLeft()) {
                event.preventDefault();
            }
        });


        /**
         * @description DEVICE READY
         */
        $ionicPlatform.ready(function ($cordovaGlobalization) {
            setTimeout(function () {
                navigator.splashscreen && navigator.splashscreen.hide();
            }, 100);
            console.info("DEVICE READY");
            if (window.cordova && window.cordova.plugins.Keyboard) {
                try {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
                    cordova.plugins.Keyboard.disableScroll(true);

                } catch (e) {
                    console.error("Hide keyboard fail");
                }
            }
            if (window.StatusBar) {
                StatusBar.styleLightContent();
            }
        });

    })
    .factory('authInterceptorService', ['$q', '$location', '$window', '$injector', function ($q, $location, $window, $injector) {
        var responseError = function (rejection) {
            if (rejection.status === 401) {
                $injector.get('$rootScope').$broadcast("applicationStatus", "unauthorized");
            }
            return $q.reject(rejection);
        };
        return {
            responseError: responseError
        };
    }]);
;



