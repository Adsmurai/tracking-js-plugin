'use strict';
(function(name, context, definition){
    context[name] = definition();
})('AdsmuraiTracking', window, function(){
    const AdsmuraiTracking = function(trackingId, galleryId) {
        this.trackingId = trackingId;
        this.galleryId = galleryId;
        this.pageViewId = this.utils.uuidv4();
        this.fingerprint = {
            hash: null,
            components: null
        };

        const _adsmuraiTracking = this;
        loadFingerprintingJavascript()
            .then(calculateFingerprint)
            .then(injectTracking);

        function loadFingerprintingJavascript() {
            if (typeof(Fingerprint2) !== 'undefined') {
                return new Promise.resolve();
            }

            const fingerprintjs2Element = document.createElement('script');

            return new Promise(function(resolve) {
                fingerprintjs2Element.onload = function() {
                    resolve();
                };

                fingerprintjs2Element.src = 'https://cdnjs.cloudflare.com/ajax/libs/fingerprintjs2/1.5.1/fingerprint2.min.js';
                document.head.appendChild(fingerprintjs2Element);
            });
        }

        function calculateFingerprint() {
            return new Promise(function(resolve) {
                new Fingerprint2().get(function(fingerprintHash, fingerprintComponents){
                    resolve({
                        hash: fingerprintHash,
                        components: fingerprintComponents
                    });
                });

            });
        }

        function injectTracking(fingerprint) {
            _adsmuraiTracking.fingerprint.hash = fingerprint.hash;
            _adsmuraiTracking.fingerprint.components = fingerprint.components;
        }
    };

    AdsmuraiTracking.prototype.registerEvent = function(eventName, eventData) {
        if (this.utils.isDoNotTrackEnabled()) return;

        if (typeof eventData === 'undefined') {
            eventData = {};
        }

        eventData.fingerprint = this.fingerprint;
        eventData.trackingId = this.trackingId;
        eventData.pageViewId = this.pageViewId;
        eventData.galleryId = this.galleryId;

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://' + window.adsmurai_consts.TRACKING_API_DOMAIN + '/' + eventName);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(eventData));
    };

    AdsmuraiTracking.prototype.registerPageViewEvent = function() {
        // TODO: this method should return a promise that's resolved after the servers responds
        this.registerEvent('pageView', {
            url: window.location.href,
            referrer: document.referrer
        });
    };

    AdsmuraiTracking.prototype.registerGalleryViewEvent = function(galleryGridWidth, featuredImages) {
        this.registerEvent('galleryView', {
            galleryGridWidth: galleryGridWidth,
            featuredImages: featuredImages
        });
    };

    AdsmuraiTracking.prototype.utils = {
        uuidv4: function() {
            /* Following  RFC4122 version 4 UUID. Implementation from https://stackoverflow.com/a/2117523 */
            const randomValues = new Uint32Array(32);
            const crypto = window.crypto || window.msCrypto;
            const randomIterator = crypto
                .getRandomValues(randomValues)
                .map(x => x % 16)
                .values();

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = randomIterator.next().value;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        },
        isDoNotTrackEnabled: function() {
            return (
                !!(navigator.doNotTrack - 0)     || // Current & standard check
                !!(window.doNotTrack - 0)        || // MSIE 11 & MS Edge & Safari 7.1.3+
                !!(navigator.msDoNotTrack - 0)   || // MSIE 9 & MSIE 10
                'yes' === navigator.doNotTrack    // Firefox < v32.0
            );
        }
    };

    return AdsmuraiTracking;
});
