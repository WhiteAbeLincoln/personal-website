// @ts-check
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
/* eslint-env node, es6 */
/* eslint-disable @typescript-eslint/no-var-requires */
require('ts-node').register({
  compilerOptions: {
    "target": "es2017",
    "module": "commonjs",
    "moduleResolution": "node",
    "allowJs": true,
    "checkJs": true,
    "jsx": "react",
    "skipLibCheck": true,
    "outDir": "./build",
    "rootDir": ".",
    "strict": true,
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
  },
  transpileOnly: true,
})

module.exports = require('./gatsby-ssr-impl')
