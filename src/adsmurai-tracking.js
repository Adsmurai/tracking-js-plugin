'use strict';
(function(name, context, definition) {
    context[name] = definition();
})('AdsmuraiTracking', window, function() {
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
                new Fingerprint2().get(function(fingerprintHash, fingerprintComponents) {
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

    Object.defineProperty(AdsmuraiTracking, 'ALLOWED_EVENT_TYPES_NAMES', {
        value: [
            'pageView',
            'galleryView',
            'ugcImageHover',
            'productImageHover',
            'ugcImageClick',
            'goToProductClick',
            'addProductToCart',
            'cartView',
            'finishPurchase',
            'test'
        ]
    });

    AdsmuraiTracking.prototype.registerEvent = function(eventName, eventData) {
        if (this.utils.isDoNotTrackEnabled()) return;

        if (!AdsmuraiTracking.ALLOWED_EVENT_TYPES_NAMES.includes(eventName)) {
            return Promise.reject('Event name "' + eventName + '" not allowed. Use one of: ' + AdsmuraiTracking.ALLOWED_EVENT_TYPES_NAMES);
        }

        const payload = Object.assign({
            fingerprint: this.fingerprint,
            trackingId: this.trackingId,
            pageViewId: this.pageViewId,
            galleryId: this.galleryId,
            url: window.location.href,
            referrer: document.referrer
        }, eventData);

        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://' + window.adsmurai_consts.TRACKING_API_DOMAIN + '/' + eventName);
        xhr.setRequestHeader('Content-Type', 'application/json');

        return new Promise(function(resolve, reject) {
            xhr.onload = function() {
                if (xhr.status < 200 || xhr.status >= 300) {
                    reject({status: xhr.status});
                } else {
                    resolve({status: xhr.status});
                }
            };

            xhr.onerror = function() {
                reject('An error occurred during the transaction');
            };

            xhr.send(JSON.stringify(payload));
        });
    };

    AdsmuraiTracking.prototype.registerAddProductToCartEvent = function(product) {
        return this.registerEvent('addProductToCart', {product: product});
    };

    AdsmuraiTracking.prototype.registerGalleryViewEvent = function(galleryGridWidth, featuredImages) {
        return this.registerEvent('galleryView', {
            galleryGridWidth: galleryGridWidth,
            featuredImages: featuredImages
        });
    };

    AdsmuraiTracking.prototype.registerPageViewEvent = function() {
        return this.registerEvent('pageView');
    };

    AdsmuraiTracking.prototype.registerProductImageHoverEvent = function(product, ugcImage) {
        return this.registerEvent('productImageHover', {
            product: product,
            ugcImage: ugcImage
        });
    };

    AdsmuraiTracking.prototype.registerUgcClickEvent = function(ugcImage) {
        return this.registerEvent('ugcImageClick', {ugcImage: ugcImage});
    };

    AdsmuraiTracking.prototype.registerUgcHoverEvent = function(ugcImage) {
        return this.registerEvent('ugcImageHover', {ugcImage: ugcImage});
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
