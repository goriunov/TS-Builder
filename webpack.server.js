const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TSLintPlugin = require('tslint-webpack-plugin')

let configs = {
    entry: {
        'index': path.join(__dirname, '../../src/index.ts')
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        path: path.join(__dirname, '../../dist'),
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    target: 'node',
    externals: [nodeExternals()],
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.join(__dirname, './tsconfig.json')
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': 'production'
        }),
        new webpack.optimize.UglifyJsPlugin({
            beautify: true
        }),
        new CopyPkgJsonPlugin({
            remove: ['devDependencies', 'scripts']
        }),
        new CopyWebpackPlugin([{
            from: 'README.md'
        }]),
        new TSLintPlugin({
            typeCheck: true,
            config: path.join(__dirname, './tslint.json'),
            files: ['./src/**/*.ts']
        })
    ]
}

module.exports = configs
