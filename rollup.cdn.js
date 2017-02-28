var typescript = require('rollup-plugin-typescript');

module.exports = {
    entry: './src/index.ts',
    dest: './dist/steel-scene-plugin-gsap.js',
    format: 'iife',
    moduleName: 'steel.gsap',
    globals: {
      'steel-scene': 'steel'
    },
    plugins: [
        typescript({
            "allowUnreachableCode": false,
            "allowUnusedLabels": false,
            "declaration": false,
            "forceConsistentCasingInFileNames": true,
            "inlineSourceMap": false,
            "moduleResolution": "node",
            "newLine": "LF",
            "noFallthroughCasesInSwitch": true,
            "noImplicitAny": true,
            "noImplicitReturns": true,
            "noImplicitUseStrict": true,
            "noUnusedLocals": true,
            "preserveConstEnums": false,
            "removeComments": true,
            "rootDir": "src",
            "sourceMap": false,
            "strictNullChecks": true,
            "suppressImplicitAnyIndexErrors": true,
            "target": "es5",
            "typescript": require('typescript')
        })
    ]
};
