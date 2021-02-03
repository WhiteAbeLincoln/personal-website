import React from 'react'
import Typography, { TypographyProps } from '@comps/typography'
import { forwardRef } from 'react'
import { createStyles, withStyles } from '@material-ui/styles'
import { capitalize, clsx } from '@util/util'
import { ClassesProp } from '@util/types'
import { spacing, Theme } from '@src/styles/theme'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'start',
      '& $input:checked + $icon': {
        '& $iconCheck': {
          stroke: 'currentColor',
        },
      },
      '& $input:hover + $icon': {
        borderWidth: `${3 / 16}rem`,
      },
      '& $input:focus + $icon': {
        borderWidth: `${3 / 16}rem`,
      },
      '& $input:focus:not(:focus-visible) + $icon': {
        outline: 'none',
      },
    },
    input: {
      position: 'absolute',
      width: '1em',
      height: '1em',
      margin: 0,
      outline: 0,
      opacity: 0,
    },
    icon: {
      border: `${1 / 8}rem solid black`,
      width: '1em',
      height: '1em',
      marginRight: spacing(theme)(1),
      marginTop: '.1em',
      zIndex: 2,
      '*': {
        transition: 'all 0.1s',
      },
    },
    iconRect: {},
    iconCheck: {},
    label: {
      fontSize: 'inherit',
    },
    colorPrimary: {
      color: theme.palette.primary.main,
    },
    colorSecondary: {
      color: theme.palette.secondary.main,
    },
    colorInherit: {
      color: 'inherit',
    },
    disabled: {},
  })

type Props = {
  label?: React.ReactNode
  labelProps?: JSX.IntrinsicElements['label']
  textProps?: TypographyProps<'span'>
  disabled?: boolean
  checked?: boolean
  name?: string
  value?: string | number | readonly string[]
  color?: 'inherit' | 'primary' | 'secondary'
} & JSX.IntrinsicElements['input']

const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  {
    label,
    labelProps,
    textProps,
    disabled: disabledProp,
    checked,
    name,
    value,
    classes = {},
    className,
    color = 'primary',
    ...props
  }: Props & ClassesProp<typeof styles>,
  ref,
) {
  return (
    <label className={clsx(classes.root, className)} {...labelProps}>
      <input
        type="checkbox"
        className={classes.input}
        disabled={disabledProp}
        checked={checked}
        name={name}
        value={value}
        ref={ref}
        {...props}
      />
      <svg
        className={clsx(
          classes.icon,
          classes[`color${capitalize(color)}` as const],
        )}
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
      >
        <polyline
          className={classes.iconCheck}
          points="4,14 12,23 28,5"
          stroke="transparent"
          strokeWidth="4"
          fill="none"
        />
      </svg>
      <Typography className={classes.label} component="span" {...textProps}>
        {label}
      </Typography>
    </label>
  )
})

export default withStyles(styles, { name: 'Checkbox' })(Checkbox)
