#!/usr/bin/env node
const shell = require('shelljs')
const path = require('path')
process.cwd()

const args = process.argv.slice()
let crossEnv = 'cross-env'

args.forEach(arg => {
    switch (arg) {
        case '-prod': return crossEnv += ' prod=true '
        case '-npm': return crossEnv += ' npm=true '
        case '-node': return crossEnv += ' isNode=true '
        case '-name': return crossEnv += ' name=' + args[args.indexOf('-name') + 1] + ' '
        case '-folder': return crossEnv += ' folder=' + args[args.indexOf('-folder') + 1] + ' '
        case '-mainfile': return crossEnv += ' mainfile=' + args[args.indexOf('-mainfile') + 1] + ' '
        case '-outfile': return crossEnv += ' outfile=' + args[args.indexOf('-outfile') + 1] + ' '
        case '-outfolder': return crossEnv += ' outfolder=' + args[args.indexOf('-outfolder') + 1] + ' '
        case '-format': return crossEnv += ' format=' + args[args.indexOf('-format') + 1] + ' '
        default: break
    }
})

shell.exec('tslint -c ./node_modules/ts-builder/tslint.json ./' + args[args.indexOf('-folder') + 1] + '/**/*.ts && ' + crossEnv + ' node ./node_modules/ts-builder/rollup.config.js --color')