const { Then } = require('cucumber');

Then('the browser sends a {string} request to {string}', function(httpVerb, url, callback) {
    const STATUS_CODE = 200;    // TODO: Get rid of this magick number.

    browser.expectRequest(httpVerb, url, STATUS_CODE);
    browser.assertRequests();

    callback(null, "All is fine!");
});
