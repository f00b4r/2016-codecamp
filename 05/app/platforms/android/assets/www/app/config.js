app.constant("APP_CONFIG", {
    //Basic config
    debugMode: true,
    storagePrefix: "test_",

    // API config
    apiUrl: "example.com/api/v1/",
    apiEndpoints: {
        exampleApiEndpoint: "endpoint/",
    },

    getApiUrl: function (endpoint){
        return "http://" + this.apiUrl + this.apiEndpoints[endpoint];
    },
});
