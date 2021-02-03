import React from 'react'
import { partial } from '@util/react-util'
import { OverridableComponent } from '@util/types/OverridableComponent'
import Typography, { TypographyProps, TypographyTypeMap } from './Typography'

export const Pre = (props: TypographyProps<'pre'>) => (
  <Typography component="pre" variant="subtitle1" {...props} />
)

export const H1 = partial(Typography, {
  variant: 'h1',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const H2 = partial(Typography, {
  variant: 'h2',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const H3 = partial(Typography, {
  variant: 'h3',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const H4 = partial(Typography, {
  variant: 'h4',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const H5 = partial(Typography, {
  variant: 'h5',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const H6 = partial(Typography, {
  variant: 'h6',
  gutterBottom: true,
}) as OverridableComponent<TypographyTypeMap>
export const P: OverridableComponent<TypographyTypeMap> = partial(Typography, {
  paragraph: true,
}) as OverridableComponent<TypographyTypeMap>
