const path = require('path');
module.exports = {
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    mode: "development",
    node: {"child_process": "empty"},
    performance: { hints: false },
    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    }
};