#!/usr/bin/env node
const shell = require('shelljs')
const path = require('path')
process.cwd()

const args = process.argv.slice()

if (args.indexOf('-output') === -1 || args.indexOf('-input') === -1) {
    return console.log('Please specify -output and -input values')
}

const input = path.join(__dirname, '../../../' + args[args.indexOf('-input') + 1])
const output = path.join(__dirname, '../../../' + args[args.indexOf('-output') + 1])


const npm = 'npm --prefix ./node_modules/ts-builder run'
const webpack = 'webpack --config ./webpack/webpack.config.js'

let crossEnv = 'cross-env -- input=' + input + ' output=' + output

args.forEach(arg => {
    switch (arg) {
        case '-prod': return crossEnv += ' production=true '
        case '-beauty': return crossEnv += ' beautify=true '
        case '-npm': return crossEnv += ' npm=true '
        case '-node': return crossEnv += ' node=true ' 
        case '-name': return crossEnv += ' name=' + args[args.indexOf('-name')+1] + ' '
        default: break
    }
})

shell.exec(npm + ' ' + crossEnv + ' ' + webpack + ' --color=always')
