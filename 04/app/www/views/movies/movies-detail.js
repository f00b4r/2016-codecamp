app.controller('MoviesDetailCtrl', function($scope, $stateParams, $ionicLoading, MoviesService) {
	var movieId = +$stateParams.id;
	var data = {};

	function loadMovie(id) {
		data['movie'] = MoviesService.getMovieById(id);
	}

	function loadCredits(id) {
		$ionicLoading.show({
			template: 'Loading credits <ion-spinner icon="ripple"></ion-spinner>'
		});

		MoviesService.getMovieCreditsById(id, function(response) {
			data['credits'] = response;
			$ionicLoading.hide();
		});
	}

	(function(){
		loadMovie(movieId);
		loadCredits(movieId);
		$scope.data = data;
	})();

});
