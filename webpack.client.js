const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const nodeExternals = require('webpack-node-externals')
const CopyPkgJsonPlugin = require("copy-pkg-json-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const TSLintPlugin = require('tslint-webpack-plugin')

const env = process.argv[2]

console.log(env)

let folder = ''
let fileName = '[name]'
let plugins = [
    new webpack.DefinePlugin({ 'process.env.NODE_ENV': 'production' }),
    new TSLintPlugin({
        typeCheck: true,
        config: path.join(__dirname, './tslint.json'),
        files: ['./src/**/*.ts']
    })
]

if (env === 'min') {
    folder = "/browser"
    fileName = 'ClusterWS.min'
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        mangle: true,
        compress: {
            warnings: false,
            pure_getters: true,
            unsafe: true,
            unsafe_comps: true,
            screw_ie8: true
        }
    }))
} else if (env === 'notmin') {
    folder = "/browser"
    fileName = 'ClusterWS'
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        comments: false,
        beautify: true
    }))
} else {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        comments: false,
        beautify: true
    }))
    plugins.push(new CopyPkgJsonPlugin({
        remove: ['devDependencies', 'scripts']
    }));
    plugins.push(new CopyWebpackPlugin([{ from: 'README.md' }]))
}

const configs = {
    entry: {
        'index': path.join(__dirname, '../../src/index.ts')
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        path: path.join(__dirname, '../../dist' + folder),
        filename: fileName + '.js',
        libraryTarget: 'umd'
    },
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
    plugins: plugins
}

module.exports = configs