const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = [
    {
        name: 'full',
        entry: [
            path.resolve(__dirname, 'src', 'adsmurai-tracking.js'),
            path.resolve(__dirname, 'node_modules', 'fingerprintjs2', 'dist', 'fingerprint2.min.js')
        ],
        output: {
            filename: 'adsmurai-tracking.min.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [new UglifyJSPlugin({sourceMap: true})]
    },

    // Only for people who already use FingerprintJS2 on their own
    {
        name: 'lite',
        entry: path.resolve(__dirname, 'src', 'adsmurai-tracking.js'),
        output: {
            filename: 'adsmurai-tracking.lite.min.js',
            path: path.resolve(__dirname, 'dist')
        },
        plugins: [new UglifyJSPlugin({sourceMap: true})]
    }
];
