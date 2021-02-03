/* eslint-disable @typescript-eslint/ban-types */
/*
taken from material-ui
@see MUI_LICENSE
*/
import React from 'react'
import { Theme, spacing, shadowBorder } from '../styles/theme'
import { createStyles, withStyles } from '@material-ui/styles'
import ButtonBase, {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
} from './ButtonBase'
import { OverrideProps } from '@util/types/OverridableComponent'
import { capitalize, clsx } from '@util/util'

export const styles = (theme: Theme) =>
  createStyles({
    root: {
      ...theme.typography.button,
      minWidth: '4rem',
      color: theme.palette.text.primary,
      textDecoration: 'none',
      '&:hover': {
        textDecoration: 'none',
      },
      ...shadowBorder(theme),
      '&$disabled': {
        color: theme.palette.text.disabled,
        ...shadowBorder(theme, { disabled: true }),
      },
      padding: spacing(theme)(1, 2),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true }),
      },
    },
    colorPrimary: {
      color: theme.palette.primary.main,
      ...shadowBorder(theme, { color: theme.palette.primary.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.primary.main }),
      },
    },
    colorSecondary: {
      color: theme.palette.secondary.main,
      ...shadowBorder(theme, { color: theme.palette.secondary.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.secondary.main }),
      },
    },
    colorWarning: {
      color: theme.palette.warning.main,
      ...shadowBorder(theme, { color: theme.palette.warning.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.warning.main }),
      },
    },
    colorError: {
      color: theme.palette.error.main,
      ...shadowBorder(theme, { color: theme.palette.error.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.error.main }),
      },
    },
    colorSuccess: {
      color: theme.palette.success.main,
      ...shadowBorder(theme, { color: theme.palette.success.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.success.main }),
      },
    },
    colorInfo: {
      color: theme.palette.info.main,
      ...shadowBorder(theme, { color: theme.palette.info.main }),
      '&:hover, &:focus': {
        ...shadowBorder(theme, { focused: true, color: theme.palette.info.main }),
      },
    },
    label: {
      width: '100%', // Ensure the correct width for iOS Safari
      display: 'inherit',
      alignItems: 'inherit',
      justifyContent: 'inherit',
    },
    disabled: {},
    focusVisible: {},
    sizeSmall: {
      padding: spacing(theme)(1),
    },
    sizeLarge: {
      padding: spacing(theme)(2, 3),
    },
    fullWidth: {
      width: '100%',
    },
    /* Styles applied to the startIcon element if supplied. */
    startIcon: {
      display: 'inherit',
      marginRight: 8,
      marginLeft: -4,
      '&$iconSizeSmall': {
        marginLeft: -2,
      },
    },
    /* Styles applied to the endIcon element if supplied. */
    endIcon: {
      display: 'inherit',
      marginRight: -4,
      marginLeft: 8,
      '&$iconSizeSmall': {
        marginRight: -2,
      },
    },
    /* Styles applied to the icon element if supplied and `size="small"`. */
    iconSizeSmall: {
      '& > *:first-child': {
        fontSize: 18,
      },
    },
    /* Styles applied to the icon element if supplied and `size="medium"`. */
    iconSizeMedium: {
      '& > *:first-child': {
        fontSize: 20,
      },
    },
    /* Styles applied to the icon element if supplied and `size="large"`. */
    iconSizeLarge: {
      '& > *:first-child': {
        fontSize: 22,
      },
    },
    /* Styles applied to the root element if `color="inherit"`. */
    colorInherit: {
      color: 'inherit',
      borderColor: 'currentColor',
    },
  })

export type ButtonClassKey = keyof ReturnType<typeof styles>

export type ButtonTypeMap<
  P = {},
  D extends React.ElementType = 'button'
> = ExtendButtonBaseTypeMap<{
  props: P & {
    /**
     * The content of the button.
     */
    children?: React.ReactNode
    /**
     * The color of the component. It supports those theme colors that make sense for this component.
     */
    color?:
      | 'primary'
      | 'secondary'
      | 'default'
      | 'inherit'
      | 'warning'
      | 'error'
      | 'info'
      | 'success'
    /**
     * If `true`, the button will be disabled.
     */
    disabled?: boolean
    /**
     * Element placed after the children.
     */
    endIcon?: React.ReactNode
    /**
     * If `true`, the button will take up the full width of its container.
     */
    fullWidth?: boolean
    /**
     * The URL to link to when the button is clicked.
     * If defined, an `a` element will be used as the root node.
     */
    href?: string
    /**
     * The size of the button.
     * `small` is equivalent to the dense button styling.
     */
    size?: 'small' | 'medium' | 'large'
    /**
     * Element placed before the children.
     */
    startIcon?: React.ReactNode
  }
  defaultComponent: D
  classKey: ButtonClassKey
}>

export type ButtonProps<
  D extends React.ElementType = ButtonTypeMap['defaultComponent'],
  P = {}
> = OverrideProps<ButtonTypeMap<P, D>, D>

type Props = ButtonProps & {
  component?: React.ElementType
  href?: string
}

const Button = React.forwardRef<unknown, Props>(function Button(
  {
    children,
    classes = {},
    className,
    color = 'default',
    component = 'button',
    disabled = false,
    endIcon: endIconProp,
    focusVisibleClassName,
    fullWidth = false,
    size = 'medium',
    startIcon: startIconProp,
    type = 'button',
    ...other
  },
  ref,
) {
  const startIcon = startIconProp && (
    <span
      className={clsx(
        classes.startIcon,
        classes[`iconSize${capitalize(size)}` as const],
      )}
    >
      {startIconProp}
    </span>
  )

  const endIcon = endIconProp && (
    <span
      className={clsx(
        classes.endIcon,
        classes[`iconSize${capitalize(size)}` as const],
      )}
    >
      {endIconProp}
    </span>
  )

  return (
    <ButtonBase
      className={clsx(
        classes.root,
        size !== 'medium' && classes[`size${capitalize(size)}` as const],
        disabled && classes.disabled,
        fullWidth && classes.fullWidth,
        color !== 'default' && classes[`color${capitalize(color)}` as const],
        className,
      )}
      component={component}
      disabled={disabled}
      focusVisibleClassName={clsx(classes.focusVisible, focusVisibleClassName)}
      ref={ref}
      type={type}
      {...other}
    >
      {/*
       * The inner <span> is required to vertically align the children.
       * Browsers don't support `display: flex` on a <button> element.
       * https://github.com/philipwalton/flexbugs/blob/master/README.md#flexbug-9
       */}
      <span className={classes.label}>
        {startIcon}
        {children}
        {endIcon}
      </span>
    </ButtonBase>
  )
})

export default withStyles(styles, { name: 'Button' })(
  Button,
) as ExtendButtonBase<ButtonTypeMap>
