// @ts-check
/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */
/* eslint-env node, es6 */
/* eslint-disable @typescript-eslint/no-var-requires */
const config = require('./tsconfig.json')
require('ts-node').register({
  compilerOptions: Object.assign(config.compilerOptions, {
    paths: undefined,
    module: 'commonjs',
  }),
  transpileOnly: true,
})

module.exports = require('./config/gatsby-node').default
