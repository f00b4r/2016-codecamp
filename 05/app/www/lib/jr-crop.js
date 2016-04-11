/**
 * jr-crop - A simple ionic plugin to crop your images.
 * @version v0.1.1
 * @link https://github.com/JrSchild/jr-crop
 * @author Joram Ruitenschild
 * @license MIT
 */
angular.module('ionic')

    .factory('$jrCrop', [
        '$ionicModal',
        '$rootScope',
        '$q',
        function ($ionicModal, $rootScope, $q) {


            var template = '<ion-header-bar class="bar bar-header on-the-top">' +
                '<h1 class="title">Crop</h1>' +

                '<ion-header-buttons side="right" class="button button-clear" nav-clear ng-click="cancel()">' +
                '<i class="icon ion-android-close"></i>' +

                '</ion-header-buttons>' +

                '</ion-header-bar>' +
                '<div class="jr-crop modal">' +

                '<div class="jr-crop-center-container">' +
                '<div class="jr-crop-img" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +
                '</div>' +
                '<div class="jr-crop-center-container">' +
                '<div class="jr-crop-select" style="overflow: hidden" ng-style="{width: width + \'px\', height: height + \'px\'}"></div>' +

                '</div>' +

                '<div class="bar bar-footer jr-crop-footer buttons-85">' +

                    //'<div class="title">{{title}}</div>' +


                '<button class="button button-block" ng-click="crop()">{{chooseText}}</button>' +
                '</div>' +

                '</div>';

            var jrCropController = ionic.views.View.inherit({


                promise: null,
                imgWidth: null,
                imgHeight: null,

                // Elements that hold the cropped version and the full
                // overlaying image.
                imgSelect: null,
                imgFull: null,

                // Values exposed by scaling and moving. Needed
                // to calculate the result of cropped image
                posX: 0,
                posY: 0,
                scale: 1,

                last_scale: 1,
                last_posX: 0,
                last_posY: 0,

                initialize: function (options) {
                    var self = this;

                    self.options = options;
                    self.promise = $q.defer();
                    self.loadImage().then(function (elem) {
                        self.imgWidth = elem.naturalWidth;
                        self.imgHeight = elem.naturalHeight;
                        self.options.imgWidth = self.imgWidth;
                        self.options.imgHeight = self.imgHeight;
                        self.options.data = {"size": 200};

                        self.options.modal.el.querySelector('.jr-crop-img').appendChild(self.imgSelect = elem.cloneNode());
                        self.options.modal.el.querySelector('.jr-crop-select').appendChild(self.imgFull = elem.cloneNode());

                        self.bindHandlers();
                        self.initImage();
                    });
                    //self.options.data = {"size": 100};

                    // options === scope. Expose actions for modal.
                    self.options.cancel = this.cancel.bind(this);
                    self.options.crop = this.crop.bind(this);
                    self.options.cancelText = self.options.cancelText || 'Cancel';
                    self.options.chooseText = self.options.chooseText || 'Choose';


                    //self.options.$watch('size', function () {
                    //    console.log("s");
                    //    //scope.size= consoleLog;
                    //}, true);
                },

                /**
                 * Init the image in a center position
                 */
                initImage: function () {
                    var self = this;

                    if (self.options.height < self.imgHeight || self.options.width < self.imgWidth) {
                        var imgAspectRatio = self.imgWidth / self.imgHeight;
                        var selectAspectRatio = self.options.width / self.options.height;

                        if (selectAspectRatio > imgAspectRatio) {
                            self.scale = self.last_scale = self.options.width / self.imgWidth;
                        } else {
                            self.scale = self.last_scale = self.options.height / self.imgHeight;
                        }
                        self.options.scale = self.scale;
                        //self.options.$watch(function(){ return self.scale }, function(newValue){
                        //    console.info("update scale");
                        //    self.options.data.size = newValue;
                        //});

                        //scope.$watch('data', function () {
                        //    if (scope.data != undefined) {
                        //        //console.log(scope.data.size);
                        //        //scope.height = scope.data.size;
                        //        //scope.width = scope.data.size;
                        //        scope.scale= scope.data.size/100;
                        //        //console.log(scope.height);
                        //        console.info(scope.scale);
                        //    }
                        //}, true);

                        self.options.rangeMin = 0;
                        self.options.rangeMax = 100;

                    }

                    var centerX = (self.imgWidth - self.options.width) / 2;
                    var centerY = (self.imgHeight - self.options.height) / 2;

                    self.posX = self.last_posX = -centerX;
                    self.posY = self.last_posY = -centerY;

                    self.setImageTransform();
                },

                cancel: function () {
                    var self = this;

                    self.options.modal.remove().then(function () {
                        self.promise.reject('canceled');
                    });
                },

                /**
                 * This is where the magic happens
                 */
                bindHandlers: function () {
                    var self = this,

                        min_pos_x = 0, min_pos_y = 0,
                        max_pos_x = 0, max_pos_y = 0,
                        transforming_correctX = 0, transforming_correctY = 0,

                        scaleMax = 1, scaleMin,
                        image_ratio = self.imgWidth / self.imgHeight,
                        cropper_ratio = self.options.width / self.options.height;

                    if (cropper_ratio < image_ratio) {
                        scaleMin = self.options.height / self.imgHeight;
                    } else {
                        scaleMin = self.options.width / self.imgWidth;
                    }

                    function setPosWithinBoundaries() {
                        calcMaxPos();
                        if (self.posX > min_pos_x) {
                            self.posX = min_pos_x;
                        }
                        if (self.posX < max_pos_x) {
                            self.posX = max_pos_x;
                        }
                        if (self.posY > min_pos_y) {
                            self.posY = min_pos_y;
                        }
                        if (self.posY < max_pos_y) {
                            self.posY = max_pos_y;
                        }
                    }

                    /**
                     * Calculate the minimum and maximum positions.
                     * This took some headaches to write, good luck
                     * figuring this out.
                     */
                    function calcMaxPos() {
                        // Calculate current proportions of the image.
                        var currWidth = self.scale * self.imgWidth;
                        var currHeight = self.scale * self.imgHeight;

                        // Images are scaled from the center
                        min_pos_x = (currWidth - self.imgWidth) / 2;
                        min_pos_y = (currHeight - self.imgHeight) / 2;
                        max_pos_x = -(currWidth - min_pos_x - self.options.width);
                        max_pos_y = -(currHeight - min_pos_y - self.options.height);
                    }

                    // Based on: http://stackoverflow.com/questions/18011099/pinch-to-zoom-using-hammer-js


                    //$rootScope.$watch('size', function() {
                    //    console.log("size");
                    //});

                    ionic.onGesture('touch transform drag dragstart dragend', function (e) {
                        switch (e.type) {
                            case 'touch':
                                self.last_scale = self.scale;
                                break;
                            case 'drag':
                                //self.posX = self.last_posX - e.gesture.deltaX - transforming_correctX;
                                //self.posY = self.last_posY - e.gesture.deltaY - transforming_correctY;
                                self.posX = self.last_posX + e.gesture.deltaX - transforming_correctX;
                                self.posY = self.last_posY + e.gesture.deltaY - transforming_correctY;
                                setPosWithinBoundaries();
                                break;
                            case 'transform':
                                self.scale = Math.max(scaleMin, Math.min(self.last_scale * e.gesture.scale, scaleMax));
                                setPosWithinBoundaries();
                                break;
                            case 'dragend':
                                self.last_posX = self.posX;
                                self.last_posY = self.posY;
                                break;
                            case 'dragstart':
                                self.last_scale = self.scale;

                                // After scaling, hammerjs needs time to reset the deltaX and deltaY values,
                                // when the user drags the image before this is done the image will jump.
                                // This is an attempt to fix that.
                                if (e.gesture.deltaX > 1 || e.gesture.deltaX < -1) {
                                    transforming_correctX = e.gesture.deltaX;
                                    transforming_correctY = e.gesture.deltaY;
                                } else {
                                    transforming_correctX = 0;
                                    transforming_correctY = 0;
                                }
                                break;
                        }

                        self.setImageTransform();

                    }, self.options.modal.el.querySelector('.jr-crop'));
                },

                setImageTransform: function () {
                    var self = this;

                    var transform =
                        'translate3d(' + self.posX + 'px,' + self.posY + 'px, 0) ' +
                        'scale3d(' + self.scale + ',' + self.scale + ', 1)';

                    self.imgSelect.style[ionic.CSS.TRANSFORM] = transform;
                    self.imgFull.style[ionic.CSS.TRANSFORM] = transform;
                },

                /**
                 * Calculate the new image from the values calculated by
                 * user input. Return a canvas-object with the image on it.
                 *
                 * Note: It doesn't actually downsize the image, it only returns
                 * a cropped version. Since there's inconsistenties in image-quality
                 * when downsizing it's up to the developer to implement this. Preferably
                 * on the server.
                 */
                crop: function () {
                    var canvas = document.createElement('canvas');
                    var context = canvas.getContext('2d');

                    // Canvas size is original proportions but scaled down.
                    canvas.width = this.options.width / this.scale;
                    canvas.height = this.options.height / this.scale;

                    // The full proportions
                    var currWidth = this.imgWidth * this.scale;
                    var currHeight = this.imgHeight * this.scale;

                    // Because the top/left position doesn't take the scale of the image in
                    // we need to correct this value.
                    var correctX = (currWidth - this.imgWidth) / 2;
                    var correctY = (currHeight - this.imgHeight) / 2;

                    var sourceX = (this.posX - correctX) / this.scale;
                    var sourceY = (this.posY - correctY) / this.scale;

                    context.drawImage(this.imgFull, sourceX, sourceY);

                    this.options.modal.remove();
                    this.promise.resolve(canvas);
                },

                /**
                 * Load the image and return the element.
                 * Return Promise that will fail when unable to load image.
                 */
                loadImage: function () {
                    var promise = $q.defer();

                    // Load the image and resolve with the DOM node when done.
                    angular.element('<img />')
                        .bind('load', function (e) {
                            promise.resolve(this);
                        })
                        .bind('error', promise.reject)
                        .prop('src', this.options.url);

                    // Return the promise
                    return promise.promise;
                }
            });

            return {
                options: {
                    width: 0,
                    height: 0,
                    imgHeight: 0,
                    aspectRatio: 0
                },

                crop: function (options) {
                    var THIS = this;
                    this.initOptions(options);

                    var scope = $rootScope.$new(true);

                    ionic.Utils.extend(scope, this.options);

                    //scope.rangeMin = 64;
                    //scope.rangeMax = Math.min(scope.width, scope.height);
                    //console.info(scope.imgWidth, scope.imgHeight, scope.rangeMax);

                    scope.modal = $ionicModal.fromTemplate(template, {
                        scope: scope
                    });

                    document.addEventListener('touchstart', function (event) {
                        event.preventDefault();
                    });


                    // Show modal and initialize cropper.

                    return scope.modal.show().then(function () {




                        return (new jrCropController(scope)).promise.promise;
                    });
                },

                initOptions: function (options) {
                    ionic.Utils.extend(this.options, options);

                    if (this.options.aspectRatio) {
                        if (!this.options.width && this.options.height) {
                            this.options.width = 200;
                        }

                        if (this.options.width) {
                            this.options.height = this.options.width / this.options.aspectRatio;
                        } else if (this.options.height) {
                            this.options.width = this.options.height * this.options.aspectRatio;
                        }
                    }
                }
            };
        }]);