import React from 'react'
import Providers from './src/components/Providers'
import './src/components/typography/fonts'

/**
 * @param {{ element: React.ReactNode }} param0
 */
export const wrapRootElement = ({ element }) => <Providers>{element}</Providers>
