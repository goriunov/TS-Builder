#!/usr/bin/env node

const shell = require('shelljs')

let arg = ''
if (process.argv[3]) arg = process.argv[3]

if (process.argv[2] === '--server') return shell.exec("npm run webpack -- " + arg + " --config ./node_modules/ts-builder/webpack.server.js")
if (process.argv[2] === '--client'){
    if(arg === '--prod') return shell.exec("npm run webpack -- --config ./node_modules/ts-builder/webpack.server.js &&  npm run webpack -- min --config ./node_modules/ts-builder/webpack.server.js && npm run webpack -- notmin --config ./node_modules/ts-builder/webpack.server.js")
    if(arg === '--npm') return shell.exec("npm run webpack -- --config ./node_modules/ts-builder/webpack.server.js")
    return shell.exec("npm run webpack -- notmin --config ./node_modules/ts-builder/webpack.server.js")
} 

return console.log('You must pass which webpack plugin do you want to execute --server or --client')