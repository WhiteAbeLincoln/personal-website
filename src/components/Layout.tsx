import { makeStyles } from '@material-ui/styles'
import { spacing } from '@src/styles/theme'
import { ClassesProp } from '@util/types'
import { clsx } from '@util/util'
import React, { PropsWithChildren } from 'react'
import Header from './Header'

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    padding: spacing(theme)(1),
    flexFlow: 'column nowrap',
  },
}))

const Layout = ({
  children,
  className,
  ...props
}: PropsWithChildren<ClassesProp<typeof useStyles>>) => {
  const classes = useStyles(props)
  return (
    <>
      <Header />
      <main className={clsx(classes.root, className)}>{children}</main>
    </>
  )
}

export default Layout
