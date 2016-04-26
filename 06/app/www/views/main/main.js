app
    .controller('MainCtrl', function ($scope, $state, $ionicNavBarDelegate, $ionicPopup, $ionicModal, $filter, $interval, GlobalService, $rootScope, $ionicLoading, $ionicSideMenuDelegate, $ionicHistory, $ionicScrollDelegate, APP_CONFIG) {
        $scope.config = APP_CONFIG;
        $scope.debugMode = APP_CONFIG.debugMode;
        $scope.applicationStatus = null;

        $scope.$on("applicationStatus", function (event, applicationStatus) {
            $scope.applicationStatus = applicationStatus;
        });


        /**
         * @description Universal alert dialog
         * @param {string} alert text
         * @param {string} alert title
         * @param {string} alert button text
         * @param {function} alert callback
         */
        $rootScope.showAlert = function (text, title, button, callback) {
            if (button == null) button = "Zavřít";
            if (title == null) title = "Oznámení";

            if (navigator.notification) {
                navigator.notification.alert(text, callback, title, button);
            } else {
                alert(text);
            }
        };


        /**
         * @description Method for skipping view and showing side menu button instead of back button
         */
        $scope.skipView = function () {
            $ionicHistory.nextViewOptions({
                disableBack: true
            });
        };


        /**
         * @description Return true if the app is deploy on real device/simulator
         */
        $scope.isDevice = function () {
            return !!((ionic.Platform.isIPad() || ionic.Platform.isIOS() || ionic.Platform.isAndroid()) && window.cordova != undefined);
        };
    })



