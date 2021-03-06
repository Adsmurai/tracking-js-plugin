const assert = require('assert');
const webdriverio = require('webdriverio');
const options = {
    logLevel: 'silent',
    desiredCapabilities: {
        browserName: 'chrome',
    },
    host: 'tracking-selenium-hub.sandbox',
    port: 4444,

    sync: false,
    waitforTimeout: 10000,
    connectionRetryCount: 3
};

describe('uuidv4', function() {
    const browser = webdriverio.remote(options);

    before('init browser session', function() {
        this.retries(3);
        this.timeout(10000);

        return browser
            .init()
            .url('https://tracking-test.adsmurai.local');
    });

    it('returns different uuids in different calls', function(done) {
        browser
            .execute(function() {
                return [
                    window.adsmurai_tracking.utils.uuidv4(),
                    window.adsmurai_tracking.utils.uuidv4()
                ];
            })
            .then(function(value) {
                const generatedUuids = value.value;
                assert.notEqual(generatedUuids[0], generatedUuids[1]);
                done();
            })
            .catch(done);
    });

    it('the uuid returned is compliant with the specification', function(done) {
        browser
            .execute(function() {
                return window.adsmurai_tracking.utils.uuidv4();
            })
            .then(function(value) {
                const generatedUuid = value.value;
                const uuidv4Regex = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
                assert.ok(uuidv4Regex.test(generatedUuid), 'offending uuid: ' + generatedUuid);
                done();
            })
            .catch(done);
    });

    after('finish browser session', function() {
        return browser.end();
    });
});
