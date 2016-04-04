app.constant("APP_CONFIG", {
    //Basic config
    debugMode: true,
    storagePrefix: "test_",

    // API config
    apiKey: "4aa883f95999ec813b8bfaf319f3972b",
    apiUrl: "api.themoviedb.org/3/",
    apiEndpoints: {
        moviesPopular: "movie/popular",
        movieCredits: "movie/%id%/credits",
    },

    getApiUrl: function (endpoint, params){
        url = "http://" 
            + this.apiUrl 
            + this.apiEndpoints[endpoint]
            + "?api_key=" + this.apiKey;

        if (!params) return url;

        url = url.replace(/%\w+%/g, function(all) {
           return params[all.slice(1,-1)] || all;
        });

        return url; 
    },
});
