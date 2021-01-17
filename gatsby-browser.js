import React from 'react'
import Providers from './src/components/Providers'

/**
 * @param {{ element: React.ReactNode }} param0
 */
export const wrapRootElement = ({ element }) => <Providers>{element}</Providers>
