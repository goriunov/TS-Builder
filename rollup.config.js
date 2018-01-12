const fs = require('fs')
const path = require('path')
const rollup = require('rollup').rollup
const uglify = require('rollup-plugin-uglify')
const filesize = require('rollup-plugin-filesize')
const typescriptPlugin = require('rollup-plugin-typescript2')


function addDefaultExports (){
    return {
        name: 'add_export',

        transformBundle(code) {
            let nameOfTheModule = code.split('module.exports =')[1]
            let result = code
            let matchingModules = code.match(/(module.exports =(.*);)/g)
            for(let i = 0; i< matchingModules.length; i++){
                let name = matchingModules[i].split('module.exports =')[1]
                result = result.replace('module.exports =' + name, 'module.exports =' + name + ' module.exports.default ='+ name)
            }
            return result
        }
    };
}

const options = {
    compilerOptions: {
        target: "es5",
        module: "commonjs",
        removeComments: true,
        moduleResolution: "node",
        declaration: true,
        declarationDir: "../../" + process.env.folder
    },
    files: [
        "../@types/node/index.d.ts",
        "../@types/uws/index.d.ts"
    ],
    include: [
        "../../" + process.env.folder + "/**/*.ts"
    ]
}

if (!process.env.npm) {
    delete options.compilerOptions['declaration']
    delete options.compilerOptions['declarationDir']
}
if (!process.env.isNode) {
    delete options.compilerOptions['moduleResolution']
    delete options['files']
}

const copyPlugin = function (options) {
    return {
        ongenerate() {
            const targDir = path.dirname(options.targ);
            if (!fs.existsSync(options.src)) {
                options.src = options.src.replace('./', './.github/')
                if (!fs.existsSync(options.src)) {
                    options.src = options.src.replace('./.github/', './docs/')
                }
            }
            if (!fs.existsSync(targDir)) {
                fs.mkdirSync(targDir)
            }
            if (options.remove) {
                let json = fs.readFileSync(options.src)
                let parsed = JSON.parse(json)
                options.remove.forEach(element => delete parsed[element])
                fs.writeFileSync(options.targ, JSON.stringify(parsed, null, '\t'))
            } else {
                fs.writeFileSync(options.targ, fs.readFileSync(options.src))
            }
        }
    }
}

return rollup({
    input: './' + process.env.folder + '/' + process.env.mainfile,
    plugins: [
        typescriptPlugin({
            useTsconfigDeclarationDir: true,
            tsconfig: './node_modules/ts-builder/tsconfig.json',
            cacheRoot: './node_modules/ts-builder/cache',
            tsconfigOverride: options
        }),
        addDefaultExports(),
        uglify({
            mangle: true,
            output: {
                beautify: process.env.prod ? false : true
            }
        }),
        !process.env.npm || copyPlugin({
            src: './package.json',
            targ: './' + process.env.outfolder + '/package.json',
            remove: ['devDependencies', 'scripts']
        }),
        !process.env.npm || copyPlugin({
            src: './README.md',
            targ: './' + process.env.outfolder + '/README.md',
        }),
        !process.env.npm || copyPlugin({
            src: './LICENSE',
            targ: './' + process.env.outfolder + '/LICENSE',
        }),
        filesize()
    ],
    external: ['cluster', 'http', 'https', 'uws', 'crypto']
}).then((bundle) => {
    bundle.write({ format: process.env.format || 'cjs', file: './' + process.env.outfolder + '/' + process.env.outfile, name: process.env.name || 'ClusterWS' }).then(() => {
        if (process.env.npm) {
            const dts = require('dts-bundle')
            dts.bundle({
                externals: false,
                referenceExternals: false,
                name: "index",
                main: './' + process.env.folder + '/**/*.d.ts',
                out: '../' + process.env.outfolder + '/index.d.ts',
                removeSource: true,
                outputAsModuleFolder: true,
                emitOnIncludedFileNotFound: true
            })
        }
    })
})