// @ts-check
/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it

import React from 'react'
import Providers from './src/components/Providers'

/** @param {{ element: any }} _ */
export const wrapRootElement = ({ element }) => <Providers>{element}</Providers>
