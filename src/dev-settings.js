'use strict';

(function(_window) {
    if (typeof _window.adsmurai_tracking === 'undefined') {
        _window.adsmurai_tracking = {};
    }

    _window.adsmurai_tracking = Object.assign(_window.adsmurai_tracking, {
        TRACKING_API_DOMAIN: 'tracking-api.adsmurai.local'
    });
})(window);
