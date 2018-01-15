'use strict';

/* global console */
/* global browser */
/* global window */

const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({Then, When}) {
    When(/^I launch a page view event$/, function (callback) {
        browser
            .setupInterceptor()
            .then(function () {
                return browser.executeAsync(function (done) {
                    // TODO: Wait for registerPageViewEvent's promise to resolv
                    window.adsmurai_tracking.registerPageViewEvent();
                    done();
                });
            })
            .then(function() {
                callback();
            })
            .catch(function(reason) {
                console.error('Error setting up interceptor.', reason);
                callback(reason, 'failure');
            });
    });

    Then(/^the browser sends a "([^"]*)" request to "([^"]*)"$/, function(httpVerb, url, callback) {
        const STATUS_CODE = 200;

        browser
            .expectRequest(httpVerb, url, STATUS_CODE)
            .then(function(value) {
                return browser.assertRequests();
            })
            .then(function(value) {
                callback();
            })
            .catch(function(reason) {
                browser
                    .log('browser')
                    .then(function(v) {
                        console.log(
                            '<browser log> \n',
                            v.value.map(x => x.message),
                            '\n</browser log>'
                        );
                        callback(reason, 'failed');
                    })
            });
    });
});
