const { CheckerPlugin } = require('awesome-typescript-loader');

module.exports = {
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js']
    },
    entry: './main.ts',
    output: {
        filename: 'bundle.js',
        path: __dirname
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            }
        ]
    },
    plugins: [
        new CheckerPlugin()
    ],
    target: "node"
};
