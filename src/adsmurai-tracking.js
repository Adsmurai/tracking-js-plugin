'use strict';


(function (_window) {
    const utils = {
        uuidv4: function() {
            /* Following  RFC4122 version 4 UUID. Implementation from https://stackoverflow.com/a/2117523 */
            const randomValues = new Uint32Array(32);
            const randomIterator = window
                .crypto.getRandomValues(randomValues)
                .map(x => x%16)
                .values();

            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = randomIterator.next().value;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    };

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
        pageViewId: utils.uuidv4(),
        utils: utils
    };

    if (typeof(_window.adsmurai_tracking) === 'undefined') {
        _window.adsmurai_tracking = adsmurai_tracking;
    }
})(window);
