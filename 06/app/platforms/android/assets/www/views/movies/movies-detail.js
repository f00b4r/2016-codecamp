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

	function loadGeoMap(id) {
		MoviesService.getMovieDetailById(id)
			.then(function(response) {

			var chart = {};
			chart.type = "GeoChart";
			chart.data = [
				['Locale'],
			];
			
			response.production_countries.forEach(function (item) {
				chart.data.push([item.name]);
			});

			chart.options = {
				tooltip: {
					isHtml: true,
					trigger: 'both'
				}
			};

			$scope.map = chart;
		});
	}

	(function(){
		loadMovie(movieId);
		loadCredits(movieId);
		loadGeoMap(movieId)
		$scope.data = data;
	})();

});
