'use strict';

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
            .then(() => callback())
            .catch(function(reason) {
                console.error('Error setting up interceptor.', reason);
                callback(reason, 'failure');
            });
    });

    When(/^I take a snapshot of sent AJAX requests$/, function (callback) {
        if (!this.hasOwnProperty('state')) {
            this.state = {};
        }

        if (!this.state.hasOwnProperty('ajaxRequests')) {
            this.state.ajaxRequests = [];
        }

        const state = this.state;
        browser
            .getRequests()
            .then(function(requests) {
                state.ajaxRequests = state.ajaxRequests.concat(requests);
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

    Then(/^the content type is set to "([^"]*)"$/, function (contentType, callback) {
        const request = this.state.ajaxRequests[0];
        assert.equal(contentType, request.headers['Content-Type']);
        callback();
    });

    Then(/^each request has a different pageViewId$/, function (callback) {
        const pageViewidsCount = this.state.ajaxRequests
            .map( request => request.body.pageViewId)
            .reduce((counts, pageViewId) => {
                counts[pageViewId] = pageViewId in counts? counts[pageViewId] + 1: 1;
                return counts;
            }, {});

        const maxRepetitions = Object
            .values(pageViewidsCount)
            .reduce((a,b) => Math.max(a,b), 0);

        assert.equal(maxRepetitions, 1);
        callback();
    });

    Then(/^the fingerprint hash of all the requests' collected until now is the same$/, function (callback) {
        const referenceHash = this.state.ajaxRequests[0].body.fingerprint.hash;
        const sameFingerprints = this.state.ajaxRequests
            .map( request => request.body.fingerprint.hash)
            .every( fingerprintHash => fingerprintHash === referenceHash);

        assert.isTrue(sameFingerprints);
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
