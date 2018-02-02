const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = function(env) {
    env = env || { devMode: false };

    const fileEntries =  [
        path.resolve(__dirname, 'src', env.devMode ? 'dev-settings.js' : 'prod-settings.js'),
        path.resolve(__dirname, 'src', 'adsmurai-tracking.js')
    ];
    const distPath = env.devMode
        ? path.resolve(__dirname, 'test', 'fixtures')
        : path.resolve(__dirname, 'dist');

    return [
        {
            name: 'full',
            target: 'web',
            devtool: env.devMode ? 'eval-source-map' : false,
            entry: [path.resolve(__dirname, 'node_modules', 'fingerprintjs2', 'dist', 'fingerprint2.min.js')].concat(
                fileEntries
            ),
            output: {
                filename: 'adsmurai-tracking.min.js',
                path: distPath
            },
            plugins: [new UglifyJSPlugin()]
        },

        // Only for people who already use FingerprintJS2 on their own
        {
            name: 'lite',
            target: 'web',
            devtool: env.devMode ? 'eval-source-map' : false,
            entry: fileEntries,
            output: {
                filename: 'adsmurai-tracking.lite.min.js',
                path: distPath
            },
            plugins: [new UglifyJSPlugin()]
        }
    ];
};
