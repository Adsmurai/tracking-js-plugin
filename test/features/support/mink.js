const { defineSupportCode } = require('cucumber');

defineSupportCode((cucumber) => {
    const Mink = require('cucumber-mink');
    const parameters = {
        driver: {
            logLevel: 'silent',
            desiredCapabilities: {
                browserName: 'chrome',
            },
            host: "tracking-selenium-hub.sandbox",
            port: 4444,
        },
        timeout: 5000,
    };
    Mink.configure(parameters);
    Mink.init(cucumber);
});
