'use strict';

const { defineSupportCode } = require('cucumber');
const { assert } = require('chai');

defineSupportCode(function ({Then, When}) {
    When(/^I enable the doNotTrack feature$/, function () {
        // The aim of this step is to check how we behave once we know that the doNotTrack property is enabled, not to
        // check if we are able to know if this property is enabled or not.

        return browser
            .execute(function () {
                navigator.doNotTrack = '1';
                if (navigator.doNotTrack !== '1') {
                    // This is a hack:
                    //   As expected, the navigator.doNotTrack (used in Chrome & Firefox) property is readonly for
                    //   security reasons. So we set another not standard property (used in Safari) that is not readonly
                    //   protected (in Chrome).
                    window.doNotTrack = '1';
                }
            });
    });

    When(/^I launch a page view event$/, function () {
        return browser
            .setupInterceptor()
            .then(function () {
                return browser.execute(function () {
                    // TODO: Wait for registerPageViewEvent's promise to resolve
                    window.adsmurai_tracking.registerPageViewEvent();
                });
            });
    });

    When(/^I take a snapshot of sent AJAX requests$/, function () {
        if (!this.hasOwnProperty('state')) {
            this.state = {};
        }

        if (!this.state.hasOwnProperty('ajaxRequests')) {
            this.state.ajaxRequests = [];
        }

        const state = this.state;
        return browser
            .getRequests()
            .then(function(requests) {
                state.ajaxRequests = state.ajaxRequests.concat(requests);
            })
            .catch(function (e) {
                if ('Could not find request with index undefined' !== e.message) {
                    throw e;
                }
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
    Then(/^the browser has sent 0 requests$/, function (callback) {
        assert.equal(0, this.state.ajaxRequests.length);
        callback();
    });
});
