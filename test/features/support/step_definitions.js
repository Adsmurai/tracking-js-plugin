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

    Then(/^all collected requests have the same fingerprint hash$/, function (callback) {
        assert.isTrue(allSame(this.state.ajaxRequests, x => x.body.fingerprint.hash));
        callback();
    });

    Then(/^all collected requests have the same pageViewId$/, function (callback) {
        assert.isTrue(allSame(this.state.ajaxRequests, x => x.body.pageViewId));
        callback();
    });

    function allSame(requests, fieldAccessor) {
        const referenceValue = fieldAccessor(requests[0]);
        return requests
            .map( request => fieldAccessor(request))
            .every( value => value=== referenceValue);

    }
});
