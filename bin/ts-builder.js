#!/usr/bin/env node

const shell = require('shelljs')

let arg = ''
if (process.argv[3]) arg = process.argv[3]

if (process.argv[2] === '--server') return shell.exec("npm run webpack -- " + arg + " --config ./node_modules/ts-builder/server/webpack.server.js  --color=always")
if (process.argv[2] === '--client') {
    if (arg === '--prod') return shell.exec("npm run webpack -- --config ./node_modules/ts-builder/client/webpack.npm.js &&  npm run webpack -- --config ./node_modules/ts-builder/client/webpack.dev.js && npm run webpack -- --config ./node_modules/ts-builder/client/webpack.min.js --color=always")
    if (arg === '--npm') return shell.exec("npm run webpack -- --config ./node_modules/ts-builder/client/webpack.npm.js --color=always")
    return shell.exec("npm run webpack -- " + arg + " --config ./node_modules/ts-builder/client/webpack.dev.js --color=always")
}
return console.log('You must pass which webpack plugin do you want to execute --server or --client \n \n \n')