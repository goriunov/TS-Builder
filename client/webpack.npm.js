const path = require('path')
const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const fs = require('fs')

const configs = {
    entry: {
        'index': path.join(__dirname, '../../../src/index.ts')
    },
    resolve: {
        extensions: [".ts"]
    },
    output: {
        path: path.join(__dirname, '../../../dist'),
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
        }),
        new CopyWebpackPlugin([
            {
                from: '../../README.md'
            },
            {
                from: '../../package.json',
                transform: (content) => {
                    const json = JSON.parse(content.toString('utf8'))
                    json['types'] = './index.d.ts'
                    delete json['devDependencies']
                    delete json['scripts']
                    return Buffer.from(JSON.stringify(json, null, '\t'))
                }
            },
            {
                from: '../../LICENSE'
            }
        ])
    ]
}


function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle')

        dts.bundle({
            externals: false,
            referenceExternals: false,
            name: "ClusterWS",
            main: '../../src/**/*.d.ts',
            out: '../dist/index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true,
            emitOnIncludedFileNotFound: true
        })
    })
}

module.exports = configs