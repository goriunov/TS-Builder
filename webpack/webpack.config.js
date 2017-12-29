const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const TSLintPlugin = require('tslint-webpack-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")

const configs = {
    entry: process.env.input,
    resolve: {
        extensions: [".ts"]
    },
    output: {
        path: process.env.output,
        libraryTarget: 'umd',
        filename: process.env.name || 'index.js'
    },
    externals: fs.readdirSync('../../node_modules'),
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                options: {
                    configFileName: process.env.production ? path.join(__dirname, './tsconfig.prod.json') : path.join(__dirname, './tsconfig.dev.json')
                }
            }
        ]
    },
    plugins: []
}

if (process.env.node) {
    configs.target = 'node',
        configs.output.libraryTarget = 'commonjs2',
        configs.plugins.push(new webpack.DefinePlugin({ 'process.env.NODE_ENV': 'production' }))
}

if (process.env.production) {
    configs.plugins.push(
        new TSLintPlugin({
            typeCheck: true,
            config: path.join(__dirname, '../tslint.json'),
            files: ['../../src/**/*.ts']
        })
    )
    configs.plugins.push(new DtsBundlePlugin())
    configs.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            beautify: process.env.beautify
        })
    )
}

if (process.env.npm) {
    configs.plugins.push(
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
    )

}

function DtsBundlePlugin() { }
DtsBundlePlugin.prototype.apply = function (compiler) {
    compiler.plugin('done', function () {
        var dts = require('dts-bundle')

        dts.bundle({
            externals: false,
            referenceExternals: false,
            name: "index",
            main: '../../src/**/*.d.ts',
            out: '../' + process.env.output + '/index.d.ts',
            removeSource: true,
            outputAsModuleFolder: true,
            emitOnIncludedFileNotFound: true
        })
    })
}

module.exports = configs