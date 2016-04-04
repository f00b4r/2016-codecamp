app.factory('GlobalService', function ($http, $ionicPopup, APP_CONFIG) {
    return new (function () {
        var self = this;
        this.promises = [];
        this.data = {};


        /**
         * @description Method for pushing promises to array for getting know what resources aren't loaded
         */
        this.pushPromise = function (promise) {
            self.promises.push(promise.$promise);
        };


        /**
         * @description Show spinner until all content in the view are loaded
         */
        this.startLoading = function (promise) {
            self.loadingShow();
            $q.all(this.promises).then(function () {
                self.loadingHide();
                self.promises = [];
            }, function () {
                self.loadingHide();
            });
        };


        /**
         * @description Method for showing custom spinner
         */
        this.loadingShow = function (text) {
            text = (text) ? text : "Loading data";
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner><br><span>'+text+'</span>'
            });
        };


        /**
         * @description Method for hiding custom spinner
         */
        this.loadingHide = function () {
            $ionicLoading.hide();
        };


        /**
         * @description Method for showing custom dialog
         */
        this.dialogShow = function (text, title, duration, classes) {
            text = (text) ? text : "Loading data";
            title = (title) ? '<span class="title">' + title + '</span>' : "";
            classes = (classes) ? classes : "ion-ios-checkmark-empty zoom-in";
            duration = (duration) ? duration : 2000;
            $ionicLoading.show({
                template: '<i class="button-icon icon assertive animation ' + classes + '"></i><div class="box">' + title + text + '</div>',
                duration: duration
            });
        };


        /**
         * Get data for dataSource from the server
         * @param {object} service
         * @param {object} options
         *          {function} options.callback
         *          {object} options.customDataSource - $resource object which will be downloaded and cached
         *          {string} options.customTarget - Target where to map data. Example: for string "campaigns" data are mapped to service.data.campaigns
         *          {object} options.queryParams - Specify what exactly should be picked from data source. For example in case of {userId: 123} will be picked only items with this parameter
         *
         */
        this.getRemoteContent = function (service, options) {
            var dataSource = service.dataSource;
            if (options && options.customDataSource) dataSource = options.customDataSource;
            var promise = dataSource.get((options && options.queryParams) ? options.queryParams : {}, function (response) {
            }).$promise;
            self.pushPromise(promise);
            self.startLoading();
            return promise;
        };


        /**
         * @description Get data from data source by specific ID
         */
        this.getDataById = function (dataSource, id, callback) {
            var state;
            if (!dataSource) console.warn("Empty data source");
            if (dataSource instanceof Array) {
                angular.forEach(dataSource, function (item, key) {
                    if (item.id == id) state = item;
                })
            } else {
                if (dataSource && dataSource.id == id) state = dataSource;
            }
            if (callback) callback(state);
            return state;
        };


        /**
         * @description Get today date in YYYY-MM-DD
         */
        this.getTodayDate = function () {
            return moment().format("YYYY-MM-DD");
        };


        /**
         * @description Get today date in timestamp
         */
        this.getTodayTime = function (date) {
            return moment(date, "YYYY-MM-DD").unix();
        };


        /**
         * @description Method for setting localstorage value with prefixed key
         * @param {String} key name without prefix
         * @param {String} value to be set into localStorage
         */
        this.setStorageItem = function (key, value) {
            localStorage.setItem(APP_CONFIG.storagePrefix + key, value);
        };


        /**
         * @description Method for getting localStorage value with prefixed key
         * @param {String} Key to search for
         */
        this.getStorageItem = function (key) {
            return localStorage.getItem(APP_CONFIG.storagePrefix + key);
        };


        /**
         * @description Method for remove localStorage value with prefixed key
         * @param {String} Key to search for
         */
        this.removeStorageItem = function (key) {
            return localStorage.removeItem(APP_CONFIG.storagePrefix + key);
        };
    })();
});
