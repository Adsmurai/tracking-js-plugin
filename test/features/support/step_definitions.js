'use strict';

/* global console */
/* global browser */
/* global window */

const { defineSupportCode } = require('cucumber');
const { assert } = require('chai');

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

    When(/^I take a snapshot of sent AJAX requests$/, function (callback) {
        if (!this.hasOwnProperty('state')) {
            this.state = {};
        }

        const state = this.state;
        browser
            .getRequests()
            .then(function(requests) {
                state.ajaxRequests = requests;
                callback();
            })
            .catch(function(reason) {
                callback(reason, 'failed');
            });
    });

    Then(/^the browser sends a "([^"]*)" request to "([^"]*)"$/, function(httpVerb, url, callback) {
        const requests = this.state.ajaxRequests;
        assert.equal(1, requests.length);
        const request = requests[0];
        assert.equal(httpVerb, request.method);
        assert.equal(url, request.url);
        callback();
    });

    Then(/^the payload has property "([^"]*)"$/, function(property, callback) {
        const payload = this.state.ajaxRequests[0].body;
        assert.property(payload, property);
        callback();
    });

    Then(/^the payload's "([^"]*)" has value "([^"]*)"$/, function (property, value, callback) {
        const payload = this.state.ajaxRequests[0].body;
        assert.equal(payload[property], value);
        callback();
    });
});
