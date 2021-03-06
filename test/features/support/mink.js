'use strict';

const { defineSupportCode } = require('cucumber');
const wdajax = require('webdriverajax');

defineSupportCode((cucumber) => {
    const Mink = require('cucumber-mink');
    const parameters = {
        driver: {
            logLevel: 'silent',
            desiredCapabilities: {
                browserName: 'chrome',
            },
            host: 'tracking-selenium-hub.sandbox',
            port: 4444,
        },
        timeout: 5000,
    };

    Mink.configure(parameters);
    Mink.init(cucumber);
    wdajax.init(Mink.driver.client);
    global.browser = Mink.driver.client;
});
