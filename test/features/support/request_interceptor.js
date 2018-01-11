const { Then } = require('cucumber');

Then('the browser sends a {string} request to {string}', function(httpVerb, url, callback) {
    const STATUS_CODE = 405;    // TODO: Get rid of this magick number.

    browser.setupInterceptor().then(function(value) {
        console.log('<interceptor> success: ', value);
        return browser.expectRequest(httpVerb, url, STATUS_CODE);
    }).then(function(value) {
        console.log('<expect> success: ', value);
        return browser.assertRequests();
    }).then(function(value) {
        console.log('<assert> success: ', value);
        callback();
    }).catch(function(reason) {
        console.log("Error with ajax request.");
        callback(reason, "failed");
    });
});
