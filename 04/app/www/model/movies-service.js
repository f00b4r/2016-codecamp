app.factory('MoviesService', function ($http, APP_CONFIG) {
    return new (function () {
        var self = this;
        self.data = {};

        self.removeById = function(id) {
            angular.forEach(self.data.movies, function(value, key) {
                if (value.id == id) {
                    self.data.movies.splice(key, 1);
                }
            });
        }

        self.addMovie = function(movie) {
            if (!movie) return;

            self.data.movies.push({
                "id": 5,
                "title": movie.title,
                "released": movie.released,
                "rating": movie.rating,
            });

            movie.title = '';
            movie.released = '';
            movie.rating = '';
        }

        self.getMovies = function() {
            var req ={
                method: "GET",
                url: APP_CONFIG.getApiUrl('moviesPopular')
            };

            $http(req).success(function(response) {
                self.data.movies = response.results;
            }).error(function(data, status) {
                console.error(data);
                alert('API ERROR!');
            });

            return self.data;
        }

        self.getMoreMovies = function (page, successCallback) {
           var req ={
                method: "GET",
                url: APP_CONFIG.getApiUrl('moviesPopular') + "&page=" + page 
            };

            $http(req).success(function(response) {
                self.data.movies = self.data.movies.concat(response.results);
                successCallback();
            }).error(function(data, status) {
                console.error(data);
                alert('API ERROR!');
            }); 
        }

        self.getMovieCreditsById = function(id, successCallback) {
            var req ={
                method: "GET",
                url: APP_CONFIG.getApiUrl('movieCredits', {id: id})
            };

            $http(req).success(function(response) {
                successCallback(response);
            }).error(function(data, status) {
                console.error(data);
                alert('API ERROR!');
            });
        }

        self.getMovieById = function(id) {
            var selectedMovie = {};
            angular.forEach(self.data.movies, function(movie) {
                if (movie.id == id) selectedMovie = movie;
            });
            return selectedMovie;       
        }
    })();
});
