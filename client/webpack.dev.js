const path = require('path')
const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin')
const fs = require('fs')

const configs = {
    entry: {
        'ClusterWS': path.join(__dirname, '../../../src/index.ts')
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        path: path.join(__dirname, '../../../dist/browser'),
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    externals: fs.readdirSync("../../node_modules"),
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: path.join(__dirname, '../tsconfig.json')
                }
            }
        ]
    },
    plugins: [
        new DtsBundlePlugin(),
        new webpack.DefinePlugin({ 'process.env.NODE_ENV': 'production' }),
        new TSLintPlugin({
            typeCheck: true,
            config: path.join(__dirname, '../tslint.json'),
            files: ['../../src/**/*.ts']
        }),
        new webpack.optimize.UglifyJsPlugin({
            comments: false,
            beautify: true
        })
    ]
}

function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle')

        dts.bundle({
            headerTex: "",
            externals: false,
            referenceExternals: false,
            name: "ClusterWS",
            main: '../../src/**/*.d.ts',
            out: '../dist/index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true
        })
    })
}

module.exports = configs