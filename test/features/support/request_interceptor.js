const { Then } = require('cucumber');

Then('the browser sends a {string} request to {string}', function(httpVerb, url, callback) {
    const STATUS_CODE = 200;    // TODO: Get rid of this magick number.

    browser.expectRequest(httpVerb, url, STATUS_CODE);
    err = browser.assertRequests();

    // TODO: Check which standard of promises is being used (https://promisesaplus.com/)
    // TODO: specify the success and err methods in separate calls to the promise
    err.then(
        function(value) {
            console.log('success: ', value);
            callback();
        },
        function(reason) {
            callback(reason, "Error with ajax request.");
        },
    );
});
