#!/usr/bin/env node

const shell = require('shelljs')

process.cwd()

let arg = ''
if (process.argv[3]) arg = process.argv[3]

if (process.argv[2] === '--server') return shell.exec("npm --prefix ./node_modules/ts-builder run webpack -- " + arg + " --config ./server/webpack.server.js  --color=always")
if (process.argv[2] === '--client') {
    if (arg === '--prod') return shell.exec("npm --prefix ./node_modules/ts-builder run webpack -- --config ./client/webpack.npm.js --color=always &&  npm --prefix ./node_modules/ts-builder run webpack -- --config ./client/webpack.dev.js --color=always && npm --prefix ./node_modules/ts-builder run webpack -- --config ./client/webpack.min.js --color=always")
    if (arg === '--npm') return shell.exec("npm --prefix ./node_modules/ts-builder run webpack -- --config ./client/webpack.npm.js --color=always")
    return shell.exec("npm --prefix ./node_modules/ts-builder run webpack -- " + arg + " --config ./client/webpack.dev.js --color=always")
}
return console.log('You must pass which webpack plugin do you want to execute --server or --client \n \n \n')