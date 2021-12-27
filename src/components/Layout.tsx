import { css } from '@linaria/core'
import React, { PropsWithChildren } from 'react'
import Header from './Header'
import { spacing } from '@src/styles'

const styles = {
  root: css`
    display: flex;
    padding: ${spacing(1)};
    flex-flow: column nowrap;
  `,
}

const Layout = ({
  children,
  ...props
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <>
      <Header />
      <main className={styles.root} {...props}>
        {children}
      </main>
    </>
  )
}

export default Layout
