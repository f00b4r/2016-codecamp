app.factory('MoviesService', function ($http, APP_CONFIG) {
    return new (function () {
        var self = this;

        self.removeById = function(id) {
            angular.forEach(self.data.movies, function(value, key) {
                if (value.id == id) {
                    self.data.movies.splice(key, 1);
                }
            });
        }

        self.addMovie = function(movie) {
            if (typeof movie == 'undefined') return;
            if (typeof movie.title == 'undefined') {
                alert('Movie title is required!');
                return;
            }
            if (typeof movie.rating == 'undefined') {
                alert('Movie rating is required!');
                return;
            }

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

        self.data = {};
        self.data.movies = [
            {
                "id": 1,
                "title": "Matrix",
                "released": "1999-12-25",
                "rating": 10,
            }, 
            {
                "id": 2,
                "title": "Kill Bill",
                "released": "2002-12-25",
                "rating": 5,
            }, 
            {
                "id": 3,
                "title": "Lord of the Ring",
                "released": "2004-12-25",
                "rating": 8,
            }, 
            {
                "id": 4,
                "title": "Enigma",
                "released": "2015-12-25",
                "rating": 9,
            }, 
            {
                "id": 5,
                "title": "Ring",
                "released": "1998-12-25",
                "rating": 1,
            }
        ];
    })();
});
