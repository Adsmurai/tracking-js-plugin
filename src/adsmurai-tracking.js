'use strict';

(function (_window) {
    function uuidv4() {
        /* Following  RFC4122 version 4 UUID. Implementation from https://stackoverflow.com/a/2117523 */
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    const adsmurai_tracking = {
        registerPageViewEvent: function () {
            // TODO: this method should return a promise that's resolved after the servers responds
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://tracking-api.adsmurai.local/pageView');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({
                pageViewId: this.pageViewId,
                url: window.location.href
            }));
        },
        pageViewId: uuidv4()
    };

    if (typeof(_window.adsmurai_tracking) === 'undefined') {
        _window.adsmurai_tracking = adsmurai_tracking;
    }
})(window);
