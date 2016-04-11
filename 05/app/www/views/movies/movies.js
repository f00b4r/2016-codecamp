app.controller('MoviesCtrl', function($scope, $ionicModal, $ionicSlideBoxDelegate, MoviesService) {
	$scope.data = MoviesService.getMovies();
	$scope.page = 1;

	// Default ordering by ID
	$scope.ordering = 'title';	
    $scope.changeOrdering = function(order) {
        $scope.ordering = order;
    }

 	$scope.removeMovie = function(id) {
 		MoviesService.removeById(id);	
 	}

 	$scope.addMovie = function(movie) {
 		MoviesService.addMovie(movie);
 		$scope.addMovieModal.hide();
 	}

 	// Infinite scrolling
 	$scope.loadMore = function() {
 		$scope.page += 1;
 		MoviesService.getMoreMovies($scope.page, function() {
			$scope.$broadcast('scroll.infiniteScrollComplete');
 		});
 	}

 	// Add movie modal
	$ionicModal.fromTemplateUrl('add-movie-modal.html', {
	    scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.addMovieModal = modal
	})  

	$scope.openAddMovieModal = function() {
		$scope.addMovieModal.show()
	}

	$scope.closeAddMovieModal = function() {
		$scope.addMovieModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.addMovieModal.remove();
	}); 

 	// Usage modal
	$ionicModal.fromTemplateUrl('usage-modal.html', {
	    scope: $scope,
		animation: 'slide-in-up'
	}).then(function(modal) {
		$scope.usageModal = modal
	})  

	$scope.openUsageModal = function() {
		$ionicSlideBoxDelegate.$getByHandle('usage').slide(0);
		$scope.usageModal.show();
	}

	$scope.closeUsageModal = function() {
		$scope.usageModal.hide();
	};

	$scope.$on('$destroy', function() {
		$scope.usageModal.remove();
	}); 	

});
