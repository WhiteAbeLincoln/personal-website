/* eslint-disable @typescript-eslint/ban-types */
/*
taken from material-ui
@see MUI_LICENSE
*/
import { css } from '@linaria/core'
import React, { forwardRef } from 'react'
import ButtonBase, {
  ExtendButtonBase,
  ExtendButtonBaseTypeMap,
} from './ButtonBase'
import {
  clsx,
  getVar,
  shadowBorder,
  typography,
  WithStyles,
  withStyles,
  spacing,
} from '@src/styles'
import { capitalize } from '@src/util'
import { OverrideProps } from '@src/util/types/OverridableComponent'

const styles = {
  root: css`
    ${typography('button')}

    min-width: 4rem;
    color: var(--theme-palette-text-primary);
    text-decoration: none;
    &:hover {
      text-decoration: none;
    }
    ${shadowBorder.base};
    padding: ${spacing(1, 2)};
    &:hover,
    &:focus {
      ${shadowBorder.focused};
    }
  `,
  colorPrimary: css`
    color: var(--theme-palette-primary-main);
  `,
  colorSecondary: css`
    color: var(--theme-palette-secondary-main);
  `,
  colorWarning: css`
    color: var(--theme-palette-warning-main);
  `,
  colorError: css`
    color: var(--theme-palette-error-main);
  `,
  colorSuccess: css`
    color: var(--theme-palette-success-main);
  `,
  colorInfo: css`
    color: var(--theme-palette-info-main);
  `,
  label: css`
    width: 100%;
    display: inherit;
    align-items: inherit;
    justify-content: inherit;
  `,
  disabled: css`
    color: ${getVar('palette-text-disabled')};
  `,
  focusVisible: '',
  sizeSmall: css`
    padding: ${spacing(1)};
  `,
  sizeLarge: css`
    padding: ${spacing(2, 3)};
  `,
  fullWidth: css`
    width: 100%;
  `,
  startIcon: css`
    display: inherit;
    margin-right: 8;
    margin-left: -4;
  `,
  endIcon: css`
    display: inherit;
    margin-right: -4;
    margin-left: 8;
  `,
  iconSizeSmall: css`
    margin-left: -2;
    & > *:first-child {
      font-size: 18px;
    }
  `,
  iconSizeMedium: css`
    & > *:first-child {
      font-size: 20px;
    }
  `,
  iconSizeLarge: css`
    & > *:first-child {
      font-size: 22px;
    }
  `,
  colorInherit: css`
    color: inherit;
    border-color: currentColor;
  `,
}

export type ButtonClassKey = keyof typeof styles

export type ButtonTypeMap<
  P = {},
  D extends React.ElementType = 'button',
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
  P = {},
> = OverrideProps<ButtonTypeMap<P, D>, D>

type Props = ButtonProps & {
  component?: React.ElementType
  href?: string
}

const Button = forwardRef<unknown, WithStyles<Props, typeof styles>>(
  function Button(props, ref) {
    const {
      children,
      classes,
      color = 'default',
      component = 'button',
      disabled = false,
      endIcon: endIconProp,
      fullWidth = false,
      size = 'medium',
      startIcon: startIconProp,
      type = 'button',
      ...other
    } = props

    const startIcon = startIconProp && (
      <span
        className={clsx(
          classes.startIcon,
          classes[`iconSize${capitalize(size)}`],
        )}
      >
        {startIconProp}
      </span>
    )

    const endIcon = endIconProp && (
      <span
        className={clsx(
          classes.endIcon,
          classes[`iconSize${capitalize(size)}`],
        )}
      >
        {endIconProp}
      </span>
    )

    return (
      <ButtonBase
        className={clsx(
          classes.root,
          size !== 'medium' && classes[`size${capitalize(size)}`],
          disabled && classes.disabled,
          fullWidth && classes.fullWidth,
          color !== 'default' && classes[`color${capitalize(color)}`],
        )}
        classes={{ focusVisible: classes.focusVisible }}
        component={component}
        disabled={disabled}
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
  },
)

export default withStyles(styles, { name: 'Button' })(
  Button as any,
) as ExtendButtonBase<ButtonTypeMap>
