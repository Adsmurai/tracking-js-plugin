'use strict';

(function (_window) {
    const adsmurai_tracking = {
        registerPageViewEvent: function () {
            // TODO: this method should return a promise that's resolved after the servers responds
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://tracking-api.adsmurai.local/pageView');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.send(JSON.stringify({
                pageViewId: 'the page view id'
            }));
        }
    };

    if (typeof(_window.adsmurai_tracking) === 'undefined') {
        _window.adsmurai_tracking = adsmurai_tracking;
    }
})(window);
