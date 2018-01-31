'use strict';

const { defineSupportCode } = require('cucumber');
const { assert } = require('chai');

defineSupportCode(function({Before, When, Then}) {
    Before(function() {
        this.state = {
            eventRegistrationStatuses: [],
            ajaxRequests: []
        };
    });

    When(/^I enable the doNotTrack feature$/, function() {
        // The aim of this step is to check how we behave once we know that the doNotTrack property is enabled, not to
        // check if we are able to know if this property is enabled or not.

        return browser
            .execute(function() {
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

    When(/^I launch an add product to cart event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const product = eventData.product;

        return executeInBrowser(this.state, function(product, done) {
            window
                .adsmurai_tracking
                .registerAddProductToCartEvent(product)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, product);
    });

    When(/^I launch a cart view event$/, function() {
        return executeInBrowser(this.state, function(done) {
            window
                .adsmurai_tracking
                .registerCartViewEvent()
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        });
    });

    When(/^I launch a finish purchase event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const products = eventData.products;

        return executeInBrowser(this.state, function(products, done) {
            window
                .adsmurai_tracking
                .registerFinishPurchaseEvent(products)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, products);
    });

    When(/^I launch a gallery view event$/, function() {
        return launchRegisterGalleryViewEvent(this.state, 0, []);
    });

    When(/^I launch product image hover event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const product = eventData.product;
        const ugcImage = eventData.ugcImage;

        return executeInBrowser(this.state, function(product, ugcImage, done) {
            window
                .adsmurai_tracking
                .registerProductImageHoverEvent(product, ugcImage)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, product, ugcImage);
    });

    When(/^I launch a gallery view event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const galleryGridWidth = eventData.galleryGridWidth;
        const featuredImages = eventData.featuredImages;

        return launchRegisterGalleryViewEvent(this.state, galleryGridWidth, featuredImages);
    });

    When(/^I launch an image click event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const ugcImage = eventData.ugcImage;

        return executeInBrowser(this.state, function(ugcImage, done) {
            window
                .adsmurai_tracking
                .registerUgcClickEvent(ugcImage)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, ugcImage);
    });

    When(/^I launch an image hover event with payload containing '([^']*)'$/, function(eventDataString) {
        const eventData = JSON.parse(eventDataString);
        const ugcImage = eventData.ugcImage;

        return executeInBrowser(this.state, function(ugcImage, done) {
            window
                .adsmurai_tracking
                .registerUgcHoverEvent(ugcImage)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, ugcImage);
    });

    When(/^I launch a page view event$/, function() {
        return executeInBrowser(this.state, function(done) {
            window
                .adsmurai_tracking
                .registerPageViewEvent()
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        });
    });

    When(/^I launch a "([^"]*)" event$/, function(eventName) {
        return executeInBrowser(this.state, function(eventName, done) {
            window
                .adsmurai_tracking
                .registerEvent(eventName)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, eventName);
    });

    When(/^I take a snapshot of sent AJAX requests$/, function() {
        const state = this.state;
        return browser
            .getRequests()
            .then(function(requests) {
                state.ajaxRequests = state.ajaxRequests.concat(requests);
            })
            .catch(function(e) {
                if ('Could not find request with index undefined' !== e.message) {
                    throw e;
                }
            });
    });

    Then(/^all collected requests have the same fingerprint hash$/, function(callback) {
        assert.isTrue(allSame(this.state.ajaxRequests, x => x.body.fingerprint.hash));
        callback();
    });

    Then(/^all collected requests have the same pageViewId$/, function(callback) {
        assert.isTrue(allSame(this.state.ajaxRequests, x => x.body.pageViewId));
        callback();
    });

    Then(/^each request has a different "([^"]*)"$/, function(key, callback) {
        const galleryIdsCount = this.state.ajaxRequests
            .map( request => request.body[key])
            .reduce((counts, value) => {
                counts[value] = value in counts ? counts[value] + 1 : 1;
                return counts;
            }, {});

        const maxRepetitions = Object
            .values(galleryIdsCount)
            .reduce((a,b) => Math.max(a,b), 0);

        assert.equal(maxRepetitions, 1);
        callback();
    });

    Then(/^no errors are registered$/, function(callback) {
        const eventRegistrationErrors = getEventRegistrationErrors(this.state);
        assert.isEmpty(eventRegistrationErrors);
        callback();
    });

    Then(/^the browser has sent 0 requests$/, function(callback) {
        assert.equal(0, this.state.ajaxRequests.length);
        callback();
    });

    Then(/^the browser sends a "([^"]*)" request to "([^"]*)"$/, function(httpVerb, url, callback) {
        const requests = this.state.ajaxRequests;
        assert.equal(requests.length, 1);
        const request = requests[0];
        assert.equal(request.method, httpVerb);
        assert.equal(request.url, url);
        callback();
    });

    Then(/^the content type is set to "([^"]*)"$/, function(contentType, callback) {
        const request = this.state.ajaxRequests[0];
        assert.equal(contentType, request.headers['Content-Type']);
        callback();
    });

    Then(/^the errors generated by the request are registered$/, function(callback) {
        const eventRegistrationErrors = getEventRegistrationErrors(this.state);
        assert.isNotEmpty(eventRegistrationErrors);
        callback();
    });

    Then(/^the payload has property "([^"]*)"$/, function(property, callback) {
        const payload = this.state.ajaxRequests[0].body;
        assert.property(payload, property);
        callback();
    });

    Then(/^the payload's "([^"]*)" has value "([^"]*)"$/, function(property, value, callback) {
        const payload = this.state.ajaxRequests[0].body;
        assert.equal(payload[property], value);
        callback();
    });

    Then(/^the payload contains the eventData '([^']*)'$/, function(eventDataString, callback) {
        const eventData = JSON.parse(eventDataString);
        const payload = this.state.ajaxRequests[0].body;

        Object.keys(eventData).forEach(function(key) {
            assert.deepEqual(eventData[key], payload[key]);
        });

        callback();
    });

    function allSame(requests, fieldAccessor) {
        const referenceValue = fieldAccessor(requests[0]);
        return requests
            .map(request => fieldAccessor(request))
            .every(value => value === referenceValue);
    }

    function executeInBrowser(state, script, ...args) {
        return browser
            .setupInterceptor()
            .then(function() {
                return  browser
                    .executeAsync(script, ...args)
                    .then(function(v) {
                        state.eventRegistrationStatuses.push(v.value);
                    })
                    .catch(function(e) {
                        state.eventRegistrationStatuses.push(e.value);
                    });
            });
    }

    function getEventRegistrationErrors(state) {
        return state
            .eventRegistrationStatuses
            .filter(status => status === 'rejected');
    }

    function launchRegisterGalleryViewEvent(state, galleryGridWidth, featuredImages) {
        return executeInBrowser(state, function(galleryGridWidth, featuredImages, done) {
            window
                .adsmurai_tracking
                .registerGalleryViewEvent(galleryGridWidth, featuredImages)
                .then(() => done('resolved'))
                .catch(() => done('rejected'));
        }, galleryGridWidth, featuredImages);
    }
});
