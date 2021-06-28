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
    "jsx": "preserve",
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

const { createSchemaCustomization, pluginOptionsSchema } = require('./impl')

module.exports = {
  pluginOptionsSchema,
  createSchemaCustomization
}
