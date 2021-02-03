import React, { useState } from 'react'
import Typography from '@comps/typography'
import Layout from '@comps/Layout'
import { ThemeProvider } from '@material-ui/styles'
import {
  BreakpointKey,
  defaultThemeModular,
  modularTypography,
  themeBase,
} from '@src/styles/theme'

export default () => {
  const [data, setData] = useState(
    defaultThemeModular as Parameters<typeof modularTypography>[1],
  )
  const [bp, setBp] = useState(defaultThemeModular.breakpoints.join(',') ?? '')
  const theme = modularTypography(themeBase, data)
  return (
    <Layout>
      <label htmlFor="scale">Scale</label>
      <input
        id="scale"
        value={data.scale}
        type="number"
        onChange={e => {
          const scale = Number(e.target.value)
          setData(d => ({ ...d, scale }))
        }}
      />
      <label htmlFor="betweenscale">Between Scale</label>
      <input
        id="betweenscale"
        value={data.betweenScale}
        type="number"
        onChange={e => {
          const betweenScale = Number(e.target.value)
          setData(d => ({ ...d, betweenScale }))
        }}
      />
      <label htmlFor="breakpoints">Breakpoints</label>
      <input
        id="breakpoints"
        value={bp}
        onChange={e => {
          const v = e.target.value
          setBp(v)
          const breakpoints = v
            .split(',')
            .map(v => v.trim())
            .filter((v): v is BreakpointKey =>
              ['xs', 'sm', 'md', 'lg', 'xl'].includes(v),
            )
          setData(d => ({ ...d, breakpoints }))
        }}
      />
      <ThemeProvider theme={theme}>
        <Typography variant="display" gutterBottom>
          h1. Display
        </Typography>
        <Typography variant="h1" gutterBottom>
          h1. Heading
        </Typography>
        <Typography variant="h2" gutterBottom>
          h2. Heading
        </Typography>
        <Typography variant="h3" gutterBottom>
          h3. Heading
        </Typography>
        <Typography variant="h4" gutterBottom>
          h4. Heading
        </Typography>
        <Typography variant="h5" gutterBottom>
          h5. Heading
        </Typography>
        <Typography variant="h6" gutterBottom>
          h6. Heading
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          subtitle1. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="subtitle2" gutterBottom>
          subtitle2. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
          Quos blanditiis tenetur
        </Typography>
        <Typography variant="body1" gutterBottom>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="body2" gutterBottom>
          body2. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore
          consectetur, neque doloribus, cupiditate numquam dignissimos laborum
          fugiat deleniti? Eum quasi quidem quibusdam.
        </Typography>
        <Typography variant="button" gutterBottom>
          button text
        </Typography>
        <Typography variant="caption" gutterBottom>
          caption text
        </Typography>
      </ThemeProvider>
    </Layout>
  )
}
